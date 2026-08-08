'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, CartItem, Notification, Manufacturer, Product, Order, Story, GroupBuy } from '@/data/types';
import { hashCredential, safeEqual, randomSalt, isValidEmail, sanitizeText } from '@/lib/security';

// Storage schema version. Bumping this wipes the previous localStorage
// payload so that legacy demo/seeded data can never resurface for
// returning visitors after the demo dataset was removed.
const SCHEMA_VERSION = '2';
const SCHEMA_KEY = 'tradebook-schema';

const KEYS = {
  session: 'tradebook-user',
  accounts: 'tradebook-accounts',
  cart: 'tradebook-cart',
  orders: 'tradebook-orders',
  manufacturers: 'tradebook-manufacturers',
  products: 'tradebook-products',
  stories: 'tradebook-stories',
  groupBuys: 'tradebook-groupbuys',
  notifications: 'tradebook-notifications',
  lockouts: 'tradebook-login-lockouts',
} as const;

// A locally persisted account record. Passwords are NEVER stored in
// plain text — only a salted hash is kept.
interface StoredAccount {
  email: string;
  salt: string;
  passwordHash: string;
  user: User;
  // Legacy field from the v1 schema (plain text). Migrated & deleted on load.
  password?: string;
}

export interface RegistrationInput extends Partial<User> {
  password?: string;
}

interface LoginLockout {
  attempts: number;
  lockedUntil: number;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

interface AppContextType {
  // User
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoggedIn: boolean;
  authHydrated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegistrationInput) => Promise<boolean>;
  updateUser: (patch: Partial<User>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Orders & Escrow
  orders: Order[];
  placeOrder: (order: Order) => void;
  confirmDelivery: (orderId: string) => void;
  disputeOrder: (orderId: string) => void;

  // Follow
  toggleFollow: (manufacturerId: string) => void;
  isFollowing: (manufacturerId: string) => boolean;

  // Notifications (scoped to the signed-in user)
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (userId: string, data: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>) => void;

  // Marketplace data (all user-generated — platform ships EMPTY)
  manufacturers: Manufacturer[];
  products: Product[];
  stories: Story[];
  groupBuys: GroupBuy[];
  addManufacturer: (mfr: Manufacturer) => void;
  updateManufacturer: (id: string, patch: Partial<Manufacturer>) => void;
  addProduct: (prod: Product) => void;
  addStory: (story: Story) => void;
  joinGroupBuy: (groupBuyId: string, quantity: number) => boolean;
  createGroupBuy: (product: Product) => string | null;

  // UI
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalType: 'login' | 'register';
  setAuthModalType: (type: 'login' | 'register') => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ── Pure localStorage helpers (module scope, no component state) ──
function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function readAccounts(): StoredAccount[] {
  return readJSON<StoredAccount[]>(KEYS.accounts, []);
}

function readLockouts(): Record<string, LoginLockout> {
  return readJSON<Record<string, LoginLockout>>(KEYS.lockouts, {});
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authHydrated, setAuthHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [groupBuys, setGroupBuys] = useState<GroupBuy[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'register'>('login');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Load persisted state once on mount (with schema migration).
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bootstrap = async () => {
      // ── Schema migration: wipe legacy demo/seeded data exactly once ──
      if (localStorage.getItem(SCHEMA_KEY) !== SCHEMA_VERSION) {
        [KEYS.cart, KEYS.orders, KEYS.manufacturers, KEYS.products, KEYS.stories, KEYS.groupBuys, KEYS.notifications]
          .forEach(k => localStorage.removeItem(k));
        localStorage.removeItem('tradebook-user'); // legacy auto-demo session
        localStorage.setItem(SCHEMA_KEY, SCHEMA_VERSION);
      }

      // ── Migrate legacy plain-text credentials to salted hashes ──
      const accounts = readAccounts();
      let accountsChanged = false;
      for (const acc of accounts) {
        if (acc.password !== undefined && !acc.passwordHash) {
          acc.salt = randomSalt();
          acc.passwordHash = await hashCredential(acc.salt + acc.password);
          delete acc.password;
          accountsChanged = true;
        }
      }
      if (accountsChanged) writeJSON(KEYS.accounts, accounts);

      // ── Restore session, but only if it matches the account registry.
      //    The registry is the source of truth for the user's role/profile;
      //    a tampered or orphaned session is dropped. ──
      const sessionUser = readJSON<User | null>(KEYS.session, null);
      if (sessionUser) {
        const registryAccount = accounts.find(a => a.email.toLowerCase() === sessionUser.email.toLowerCase());
        if (registryAccount) {
          setUser(registryAccount.user);
        } else {
          localStorage.removeItem(KEYS.session);
        }
      }

      // Catalog: user-generated content only — the platform ships empty.
      setCart(readJSON<CartItem[]>(KEYS.cart, []));
      setOrders(readJSON<Order[]>(KEYS.orders, []));
      setManufacturers(readJSON<Manufacturer[]>(KEYS.manufacturers, []));
      setProducts(readJSON<Product[]>(KEYS.products, []));
      setStories(readJSON<Story[]>(KEYS.stories, []));
      setGroupBuys(readJSON<GroupBuy[]>(KEYS.groupBuys, []));

      // Notifications scoped to the restored session (if any).
      const restoredEmail = registryEmail(accounts);
      if (restoredEmail) {
        const acc = accounts.find(a => a.email.toLowerCase() === restoredEmail);
        if (acc) {
          const all = readJSON<Notification[]>(KEYS.notifications, []);
          setNotifs(all.filter(n => n.userId === acc.user.id));
        }
      }

      setAuthHydrated(true);
    };

    const registryEmail = (accounts: StoredAccount[]): string | null => {
      const sessionUser = readJSON<User | null>(KEYS.session, null);
      const acc = sessionUser ? accounts.find(a => a.email.toLowerCase() === sessionUser.email.toLowerCase()) : null;
      return acc ? acc.email.toLowerCase() : null;
    };

    bootstrap();
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const emailKey = email.trim().toLowerCase();

    // Brute-force lockout check
    const lockouts = readLockouts();
    const lock = lockouts[emailKey];
    if (lock && lock.lockedUntil > Date.now()) {
      const secs = Math.ceil((lock.lockedUntil - Date.now()) / 1000);
      showToast(`Too many failed attempts. Try again in ${secs}s.`, 'error');
      return false;
    }

    const accounts = readAccounts();
    const account = accounts.find(a => a.email.toLowerCase() === emailKey);
    const candidateHash = account ? await hashCredential(account.salt + password) : await hashCredential('missing-salt' + password);
    const ok = !!account && safeEqual(candidateHash, account.passwordHash);

    if (!ok) {
      const attempts = (lock?.attempts || 0) + 1;
      lockouts[emailKey] = {
        attempts,
        lockedUntil: attempts >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0,
      };
      writeJSON(KEYS.lockouts, lockouts);
      // Unified message — never reveals whether the email exists.
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        showToast(`Too many failed attempts. Account locked for ${Math.round(LOCKOUT_MS / 1000)}s.`, 'error');
      } else {
        showToast(`Invalid email or password. (${MAX_LOGIN_ATTEMPTS - attempts} attempts left)`, 'error');
      }
      return false;
    }

    // Success — clear lockout, restore session + scoped notifications.
    delete lockouts[emailKey];
    writeJSON(KEYS.lockouts, lockouts);

    const sessionUser = account!.user;
    setUser(sessionUser);
    writeJSON(KEYS.session, sessionUser);
    setNotifs(readJSON<Notification[]>(KEYS.notifications, []).filter(n => n.userId === sessionUser.id));
    setShowAuthModal(false);
    const firstName = sessionUser.name.split(' ')[0] || 'there';
    showToast(`Welcome back, ${firstName}!`, 'success');
    return true;
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    setNotifs([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(KEYS.session);
    }
    showToast('Logged out successfully', 'info');
  }, [showToast]);

  const register = useCallback(async (userData: RegistrationInput): Promise<boolean> => {
    const email = (userData.email || '').trim().toLowerCase();
    if (!userData.name?.trim()) {
      showToast('Please provide your name.', 'error');
      return false;
    }
    if (!isValidEmail(email)) {
      showToast('Please provide a valid email address.', 'error');
      return false;
    }
    if (!userData.password || userData.password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return false;
    }

    const accounts = readAccounts();
    // SECURITY: never silently overwrite an existing account (takeover hole).
    if (accounts.some(a => a.email.toLowerCase() === email)) {
      showToast('An account with this email already exists. Sign in instead.', 'error');
      return false;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const accountType = userData.type || 'retailer';
    const newUser: User = {
      id: `user-${Math.random().toString(36).substring(3, 10)}`,
      name: sanitizeText(userData.name, 80),
      email,
      phone: userData.phone || '',
      type: accountType,
      avatar: userData.avatar || (accountType === 'manufacturer' ? '🏭' : '🏪'),
      location: userData.location || 'Kigali, Rwanda',
      followedManufacturers: userData.followedManufacturers || [],
      orders: [],
      cart: [],
      joinedDate: timestamp,
      verified: false,
      manufacturerId: userData.manufacturerId,
    };

    const salt = randomSalt();
    const passwordHash = await hashCredential(salt + userData.password);
    accounts.push({ email, salt, passwordHash, user: newUser });
    writeJSON(KEYS.accounts, accounts);

    setUser(newUser);
    writeJSON(KEYS.session, newUser);

    // Real welcome notification for the brand-new user.
    const welcome: Notification = {
      id: `notif-${Math.random().toString(36).substring(3, 10)}`,
      userId: newUser.id,
      type: 'system',
      title: 'Welcome to TradeBook! 🎉',
      message: accountType === 'manufacturer'
        ? 'Your corporate account is ready. Complete your factory profile and publish your first wholesale product.'
        : 'Your wholesale buyer account is ready. Browse products and place escrow-protected orders.',
      read: false,
      createdAt: timestamp,
      link: accountType === 'manufacturer' ? '/manufacturers/onboarding' : '/products',
    };
    const all = readJSON<Notification[]>(KEYS.notifications, []);
    all.unshift(welcome);
    writeJSON(KEYS.notifications, all);
    setNotifs([welcome]);

    setShowAuthModal(false);
    showToast('Account created! Welcome to TradeBook!', 'success');
    return true;
  }, [showToast]);

  // Merge profile changes into the active session and keep the account
  // registry in sync so the enriched profile survives future logins.
  const updateUser = useCallback((patch: Partial<User>) => {
    if (!user) return;
    const updated: User = { ...user, ...patch, id: user.id };
    setUser(updated);
    if (typeof window !== 'undefined') {
      writeJSON(KEYS.session, updated);
      const accounts = readAccounts();
      const idx = accounts.findIndex(a => a.email.toLowerCase() === updated.email.toLowerCase());
      if (idx >= 0) {
        accounts[idx] = { ...accounts[idx], user: updated };
        writeJSON(KEYS.accounts, accounts);
      }
    }
  }, [user]);

  // ── Cart ─────────────────────────────────────────────────────────

  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      let updated;
      if (existing) {
        updated = prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i);
      } else {
        updated = [...prev, item];
      }
      writeJSON(KEYS.cart, updated);
      return updated;
    });
    showToast(`${item.productName} added to cart`, 'success');
  }, [showToast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => {
      const updated = prev.filter(i => i.productId !== productId);
      writeJSON(KEYS.cart, updated);
      return updated;
    });
    showToast('Item removed from cart', 'info');
  }, [showToast]);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      // Clamp to the product's MOQ — buyers cannot undercut the minimum.
      const updated = prev.map(i => {
        if (i.productId !== productId) return i;
        const clamped = quantity < i.moq ? i.moq : quantity;
        return { ...i, quantity: clamped };
      });
      writeJSON(KEYS.cart, updated);
      return updated;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(KEYS.cart);
    }
    showToast('Cart cleared', 'info');
  }, [showToast]);

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ── Orders & Escrow ──────────────────────────────────────────────

  const placeOrder = useCallback((newOrder: Order) => {
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      writeJSON(KEYS.orders, updated);
      return updated;
    });
  }, []);

  const confirmDelivery = useCallback((orderId: string) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'completed' as const,
            paymentStatus: 'released' as const,
            updatedAt: new Date().toISOString().split('T')[0],
            escrowDetails: {
              ...o.escrowDetails,
              status: 'released' as const,
              releaseDate: new Date().toISOString().split('T')[0]
            }
          };
        }
        return o;
      });
      writeJSON(KEYS.orders, updated);
      return updated;
    });
    showToast('Escrow released! Payment successfully sent to manufacturer.', 'success');
  }, [showToast]);

  const disputeOrder = useCallback((orderId: string) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'disputed' as const,
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        return o;
      });
      writeJSON(KEYS.orders, updated);
      return updated;
    });
    showToast('Order disputed. A TradeBook agent will contact you within 24 hours.', 'info');
  }, [showToast]);

  // ── Marketplace data (user-generated) ────────────────────────────

  const addManufacturer = useCallback((mfr: Manufacturer) => {
    setManufacturers(prev => {
      const updated = [...prev, mfr];
      writeJSON(KEYS.manufacturers, updated);
      return updated;
    });
  }, []);

  const updateManufacturer = useCallback((id: string, patch: Partial<Manufacturer>) => {
    setManufacturers(prev => {
      const updated = prev.map(m => (m.id === id ? { ...m, ...patch, id } : m));
      writeJSON(KEYS.manufacturers, updated);
      return updated;
    });
  }, []);

  const addProduct = useCallback((prod: Product) => {
    setProducts(prev => {
      const updated = [...prev, prod];
      writeJSON(KEYS.products, updated);
      return updated;
    });
  }, []);

  const addStory = useCallback((story: Story) => {
    setStories(prev => {
      const updated = [story, ...prev];
      writeJSON(KEYS.stories, updated);
      return updated;
    });
  }, []);

  // ── Group Buys (fully functional, persisted) ─────────────────────

  const createGroupBuy = useCallback((product: Product): string | null => {
    if (!user) {
      setShowAuthModal(true);
      setAuthModalType('login');
      showToast('Sign in as a retailer to start a group buy.', 'info');
      return null;
    }
    if (user.type !== 'retailer') {
      showToast('Only registered retailer accounts can start group buys.', 'error');
      return null;
    }
    const today = new Date();
    const deadline = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const id = `gb-${Math.random().toString(36).substring(3, 10)}`;
    const gb: GroupBuy = {
      id,
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || '',
      manufacturerId: product.manufacturerId,
      manufacturerName: product.manufacturerName,
      wholesalePrice: product.wholesalePrice,
      targetQuantity: product.moq * 10,
      currentQuantity: 0,
      minParticipants: 5,
      currentParticipants: 0,
      deadline: deadline.toISOString().split('T')[0],
      status: 'active',
      participants: [],
      savingsPercent: 15,
      createdBy: user.id,
      location: (user.location || 'Kigali').split(',')[0],
    };
    setGroupBuys(prev => {
      const updated = [gb, ...prev];
      writeJSON(KEYS.groupBuys, updated);
      return updated;
    });
    showToast('Group buy created! Share it with other retailers to unlock the group price.', 'success');
    return id;
  }, [user, showToast]);

  const joinGroupBuy = useCallback((groupBuyId: string, quantity: number): boolean => {
    if (!user) {
      setShowAuthModal(true);
      setAuthModalType('login');
      showToast('Sign in as a retailer to join a group buy.', 'info');
      return false;
    }
    if (user.type !== 'retailer') {
      showToast('Only registered retailer accounts can join group buys.', 'error');
      return false;
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      showToast('Please enter a valid quantity.', 'error');
      return false;
    }

    let joined = false;
    let justCompleted = false;
    setGroupBuys(prev => {
      const updated = prev.map(gb => {
        if (gb.id !== groupBuyId || gb.status !== 'active') return gb;
        joined = true;
        const existing = gb.participants.find(p => p.userId === user.id);
        const participants = existing
          ? gb.participants.map(p => (p.userId === user.id ? { ...p, quantity: p.quantity + quantity } : p))
          : [...gb.participants, { userId: user.id, userName: user.name, quantity, joinedAt: new Date().toISOString().split('T')[0] }];
        const currentQuantity = participants.reduce((s, p) => s + p.quantity, 0);
        if (currentQuantity >= gb.targetQuantity) justCompleted = true;
        return {
          ...gb,
          participants,
          currentQuantity,
          currentParticipants: participants.length,
          status: currentQuantity >= gb.targetQuantity ? ('completed' as const) : gb.status,
        };
      });
      writeJSON(KEYS.groupBuys, updated);
      return updated;
    });

    if (joined) {
      showToast(
        justCompleted
          ? '🎉 Target reached! This group buy is complete — everyone gets the group price.'
          : `You joined the group buy with ${quantity} units.`,
        'success'
      );
    } else {
      showToast('This group buy is no longer active.', 'error');
    }
    return joined;
  }, [user, showToast]);

  // ── Follow ───────────────────────────────────────────────────────

  const toggleFollow = useCallback((manufacturerId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setUser(prev => {
      if (!prev) return prev;
      const isF = prev.followedManufacturers.includes(manufacturerId);
      const updated = {
        ...prev,
        followedManufacturers: isF
          ? prev.followedManufacturers.filter(id => id !== manufacturerId)
          : [...prev.followedManufacturers, manufacturerId],
      };
      writeJSON(KEYS.session, updated);
      // Keep registry copy in sync as well
      const accounts = readAccounts();
      const idx = accounts.findIndex(a => a.email.toLowerCase() === updated.email.toLowerCase());
      if (idx >= 0) {
        accounts[idx] = { ...accounts[idx], user: updated };
        writeJSON(KEYS.accounts, accounts);
      }
      return updated;
    });
    // Keep the public follower counter on the manufacturer entity honest
    setManufacturers(prev => {
      const updated = prev.map(m => {
        if (m.id !== manufacturerId) return m;
        const isF = user.followedManufacturers.includes(manufacturerId);
        return { ...m, followerCount: Math.max(0, m.followerCount + (isF ? -1 : 1)) };
      });
      writeJSON(KEYS.manufacturers, updated);
      return updated;
    });
    const mfr = manufacturers.find(m => m.id === manufacturerId);
    if (mfr) {
      const isNowFollowing = !user.followedManufacturers.includes(manufacturerId);
      showToast(isNowFollowing ? `Following ${mfr.name}` : `Unfollowed ${mfr.name}`, 'info');
    }
  }, [user, manufacturers, showToast]);

  const isFollowing = useCallback((manufacturerId: string) => {
    return user?.followedManufacturers.includes(manufacturerId) || false;
  }, [user]);

  // ── Notifications (scoped to the signed-in user) ─────────────────

  const unreadCount = notifs.filter(n => !n.read).length;

  const addNotification = useCallback((userId: string, data: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>) => {
    const notif: Notification = {
      ...data,
      id: `notif-${Math.random().toString(36).substring(3, 10)}`,
      userId,
      read: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const all = readJSON<Notification[]>(KEYS.notifications, []);
    all.unshift(notif);
    writeJSON(KEYS.notifications, all);
    if (user?.id === userId) {
      setNotifs(prev => [notif, ...prev]);
    }
  }, [user]);

  const persistNotifState = useCallback((updater: (n: Notification) => Notification, id?: string) => {
    const all = readJSON<Notification[]>(KEYS.notifications, []);
    const updated = all.map(n => ((id === undefined || n.id === id) && n.userId === user?.id ? updater(n) : n));
    writeJSON(KEYS.notifications, updated);
  }, [user]);

  const markAsRead = useCallback((id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    persistNotifState(n => ({ ...n, read: true }), id);
  }, [persistNotifState]);

  const markAllAsRead = useCallback(() => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    persistNotifState(n => ({ ...n, read: true }));
  }, [persistNotifState]);

  return (
    <AppContext.Provider value={{
      user, setUser, isLoggedIn: !!user, authHydrated, login, logout, register, updateUser,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
      orders, placeOrder, confirmDelivery, disputeOrder,
      toggleFollow, isFollowing,
      notifications: notifs, unreadCount, markAsRead, markAllAsRead, addNotification,
      manufacturers, products, stories, groupBuys,
      addManufacturer, updateManufacturer, addProduct, addStory, joinGroupBuy, createGroupBuy,
      showAuthModal, setShowAuthModal, authModalType, setAuthModalType,
      toast, showToast, searchQuery, setSearchQuery,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
