'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Search, ShoppingCart, Bell, Menu, X, User, LogOut, ChevronDown, Globe, Heart } from 'lucide-react';

export default function Header() {
  const { user, isLoggedIn, cartCount, notifications, unreadCount, logout, markAllAsRead, setShowAuthModal, setAuthModalType, searchQuery, setSearchQuery } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [lang, setLang] = useState('EN');

  const handleAuthClick = (type: 'login' | 'register') => {
    setAuthModalType(type);
    setShowAuthModal(true);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-200/50">
      {/* Top bar */}
      <div className="bg-teal-900 text-white text-xs py-1.5">
        <div className="container-app flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>📍 Kigali, Rwanda</span>
            <a href="mailto:support@tradebook.rw" className="hidden sm:inline hover:text-teal-200 transition">✉️ support@tradebook.rw</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === 'EN' ? 'FR' : lang === 'FR' ? 'RW' : 'EN')} className="flex items-center gap-1 hover:text-teal-200 transition">
              <Globe size={12} /> {lang}
            </button>
            <span className="hidden sm:inline">|</span>
            <Link href="/manufacturers" className="hidden sm:inline hover:text-teal-200 transition">Sell on TradeBook</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-app py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">T</div>
            <div>
              <span className="text-xl font-bold text-gradient">TradeBook</span>
              <span className="hidden md:block text-[10px] text-gray-500 -mt-1">Wholesale. Transparent. Direct.</span>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products, manufacturers, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Mobile search */}
            <button className="md:hidden p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition">
              <Search size={20} />
            </button>

            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition">
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                      <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        <button onClick={markAllAsRead} className="text-xs text-teal-600 hover:underline">Mark all read</button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
                        ) : (
                          notifications.slice(0, 5).map(n => (
                            <div key={n.id} className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${!n.read ? 'bg-teal-50/50' : ''}`}>
                              <p className="text-sm font-medium text-gray-900">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <Link href="/dashboard" className="block p-2 text-center text-xs text-teal-600 hover:bg-teal-50 font-medium" onClick={() => setNotifOpen(false)}>
                        View all notifications
                      </Link>
                    </div>
                  )}
                </div>

                {/* Wishlist */}
                <Link href="/dashboard" className="hidden sm:flex p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition">
                  <Heart size={20} />
                </Link>

                {/* Cart */}
                <Link href="/cart" className="relative p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition">
                    <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.trim() ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-gray-700 max-w-[100px] truncate">{user?.name}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                      <div className="p-3 border-b border-gray-100">
                        <p className="font-semibold text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-semibold rounded-full">{user?.type === 'retailer' ? '🏪 Retailer' : '🏭 Manufacturer'}</span>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition" onClick={() => setUserMenuOpen(false)}>
                        <User size={16} /> Dashboard
                      </Link>
                      <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition" onClick={() => setUserMenuOpen(false)}>
                        <ShoppingCart size={16} /> My Orders
                      </Link>
                      <hr className="my-1" />
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => handleAuthClick('login')} className="px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50 rounded-lg transition">
                  Sign In
                </button>
                <button onClick={() => handleAuthClick('register')} className="px-4 py-2 text-sm font-medium text-white gradient-primary rounded-lg hover:opacity-90 transition">
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden lg:block border-t border-gray-100">
        <div className="container-app">
          <div className="flex items-center gap-1">
            {[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: 'Manufacturers', href: '/manufacturers' },
              { label: 'Group Buying', href: '/group-buy' },
              { label: 'Stories', href: '/stories' },
              { label: 'Categories', href: '/products?view=categories' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-teal-700 hover:bg-teal-50/50 rounded-lg transition">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white animate-slide-up">
          <div className="container-app py-3 space-y-1">
            {/* Mobile search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20" />
            </div>
            {[
              { label: '🏠 Home', href: '/' },
              { label: '📦 Products', href: '/products' },
              { label: '🏭 Manufacturers', href: '/manufacturers' },
              { label: '🤝 Group Buying', href: '/group-buy' },
              { label: '📱 Stories', href: '/stories' },
              { label: '📊 Dashboard', href: '/dashboard' },
              { label: '🛒 Cart', href: '/cart' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
