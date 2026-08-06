'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, CartItem, Notification, Manufacturer, Product, Order, Story } from '@/data/types';
import { demoUser, manufacturers as initialManufacturers, products as initialProducts, orders as initialOrders, stories as initialStories } from '@/data/mockData';

interface AppContextType {
  // User
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (userData: Partial<User>) => void;

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

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;

  // Data
  manufacturers: Manufacturer[];
  products: Product[];
  stories: Story[];
  addManufacturer: (mfr: Manufacturer) => void;
  addProduct: (prod: Product) => void;
  addStory: (story: Story) => void;

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

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'register'>('login');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load all data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('tradebook-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(demoUser);
        localStorage.setItem('tradebook-user', JSON.stringify(demoUser));
      }

      const savedCart = localStorage.getItem('tradebook-cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem('tradebook-orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders(initialOrders);
        localStorage.setItem('tradebook-orders', JSON.stringify(initialOrders));
      }

      const savedMfrs = localStorage.getItem('tradebook-manufacturers');
      if (savedMfrs) {
        setManufacturers(JSON.parse(savedMfrs));
      } else {
        setManufacturers(initialManufacturers);
        localStorage.setItem('tradebook-manufacturers', JSON.stringify(initialManufacturers));
      }

      const savedProducts = localStorage.getItem('tradebook-products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(initialProducts);
        localStorage.setItem('tradebook-products', JSON.stringify(initialProducts));
      }

      const savedStories = localStorage.getItem('tradebook-stories');
      if (savedStories) {
        setStories(JSON.parse(savedStories));
      } else {
        setStories(initialStories);
        localStorage.setItem('tradebook-stories', JSON.stringify(initialStories));
      }
    }
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Auth
  const login = useCallback((email: string, password: string) => {
    setUser(demoUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tradebook-user', JSON.stringify(demoUser));
    }
    setShowAuthModal(false);
    showToast('Welcome back, Jean-Pierre!', 'success');
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tradebook-user');
    }
    showToast('Logged out successfully', 'info');
  }, [showToast]);

  const register = useCallback((userData: Partial<User>) => {
    const newUser = { ...demoUser, ...userData } as User;
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tradebook-user', JSON.stringify(newUser));
    }
    setShowAuthModal(false);
    showToast('Account created! Welcome to TradeBook!', 'success');
  }, [showToast]);

  // Cart
  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      let updated;
      if (existing) {
        updated = prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i);
      } else {
        updated = [...prev, item];
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('tradebook-cart', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`${item.productName} added to cart`, 'success');
  }, [showToast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => {
      const updated = prev.filter(i => i.productId !== productId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tradebook-cart', JSON.stringify(updated));
      }
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
      const updated = prev.map(i => i.productId === productId ? { ...i, quantity } : i);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tradebook-cart', JSON.stringify(updated));
      }
      return updated;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tradebook-cart');
    }
    showToast('Cart cleared', 'info');
  }, [showToast]);

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders
  const placeOrder = useCallback((newOrder: Order) => {
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('tradebook-orders', JSON.stringify(updated));
      }
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('tradebook-orders', JSON.stringify(updated));
      }
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('tradebook-orders', JSON.stringify(updated));
      }
      return updated;
    });
    showToast('Order disputed. A TradeBook agent will contact you within 24 hours.', 'info');
  }, [showToast]);

  // Data Modifiers
  const addManufacturer = useCallback((mfr: Manufacturer) => {
    setManufacturers(prev => {
      const updated = [...prev, mfr];
      if (typeof window !== 'undefined') {
        localStorage.setItem('tradebook-manufacturers', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const addProduct = useCallback((prod: Product) => {
    setProducts(prev => {
      const updated = [...prev, prod];
      if (typeof window !== 'undefined') {
        localStorage.setItem('tradebook-products', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const addStory = useCallback((story: Story) => {
    setStories(prev => {
      const updated = [story, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('tradebook-stories', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Follow
  const toggleFollow = useCallback((manufacturerId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setUser(prev => {
      if (!prev) return prev;
      const isFollowing = prev.followedManufacturers.includes(manufacturerId);
      const updated = {
        ...prev,
        followedManufacturers: isFollowing
          ? prev.followedManufacturers.filter(id => id !== manufacturerId)
          : [...prev.followedManufacturers, manufacturerId],
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('tradebook-user', JSON.stringify(updated));
      }
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

  // Notifications
  const unreadCount = notifs.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <AppContext.Provider value={{
      user, setUser, isLoggedIn: !!user, login, logout, register,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
      orders, placeOrder, confirmDelivery, disputeOrder,
      toggleFollow, isFollowing,
      notifications: notifs, unreadCount, markAsRead, markAllAsRead,
      manufacturers, products, stories, addManufacturer, addProduct, addStory,
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
