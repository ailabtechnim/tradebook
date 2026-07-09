'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, CartItem, Notification, Manufacturer, Product } from '@/data/types';
import { demoUser, manufacturers as initialManufacturers, products as initialProducts } from '@/data/mockData';

interface AppContextType {
  // User
  user: User | null;
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
  const [user, setUser] = useState<User | null>(demoUser);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'register'>('login');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('tradebook-cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tradebook-cart', JSON.stringify(cart));
    }
  }, [cart]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Auth
  const login = useCallback((email: string, password: string) => {
    setUser(demoUser);
    setShowAuthModal(false);
    showToast('Welcome back, Jean-Pierre!', 'success');
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
    showToast('Logged out successfully', 'info');
  }, [showToast]);

  const register = useCallback((userData: Partial<User>) => {
    setUser({ ...demoUser, ...userData } as User);
    setShowAuthModal(false);
    showToast('Account created! Welcome to TradeBook!', 'success');
  }, [showToast]);

  // Cart
  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
    showToast(`${item.productName} added to cart`, 'success');
  }, [showToast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
    showToast('Item removed from cart', 'info');
  }, [showToast]);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    showToast('Cart cleared', 'info');
  }, [showToast]);

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Follow
  const toggleFollow = useCallback((manufacturerId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setUser(prev => {
      if (!prev) return prev;
      const isFollowing = prev.followedManufacturers.includes(manufacturerId);
      return {
        ...prev,
        followedManufacturers: isFollowing
          ? prev.followedManufacturers.filter(id => id !== manufacturerId)
          : [...prev.followedManufacturers, manufacturerId],
      };
    });
    const mfr = initialManufacturers.find(m => m.id === manufacturerId);
    if (mfr) {
      const isNowFollowing = !user.followedManufacturers.includes(manufacturerId);
      showToast(isNowFollowing ? `Following ${mfr.name}` : `Unfollowed ${mfr.name}`, 'info');
    }
  }, [user, showToast]);

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
      user, isLoggedIn: !!user, login, logout, register,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
      toggleFollow, isFollowing,
      notifications: notifs, unreadCount, markAsRead, markAllAsRead,
      manufacturers: initialManufacturers, products: initialProducts,
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
