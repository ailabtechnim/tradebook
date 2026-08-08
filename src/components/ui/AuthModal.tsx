'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Mail, Lock, User, Phone, MapPin, Building2, Store } from 'lucide-react';

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, authModalType, setAuthModalType, login, register } = useApp();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', location: '', type: 'retailer' as 'retailer' | 'manufacturer',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (authModalType === 'login') {
        // login shows its own error toasts and keeps the modal open on failure.
        await login(formData.email, formData.password);
      } else {
        // register validates, rejects duplicate emails and shows its own toasts.
        await register({ name: formData.name, email: formData.email, phone: formData.phone, type: formData.type, location: formData.location, password: formData.password });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAuthModal(false)}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="relative gradient-primary p-6 rounded-t-2xl text-white">
          <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition">
            <X size={20} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold">T</div>
            <span className="text-lg font-bold">TradeBook</span>
          </div>
          <h2 className="text-xl font-bold">{authModalType === 'login' ? 'Welcome Back' : 'Join TradeBook'}</h2>
          <p className="text-teal-100 text-sm mt-1">
            {authModalType === 'login' ? 'Sign in to your account' : 'Create your free account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {authModalType === 'register' && (
            <>
              {/* Account type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, type: 'retailer' })}
                    className={`p-3 rounded-xl border-2 text-center transition ${formData.type === 'retailer' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Store size={24} className="mx-auto mb-1" />
                    <span className="text-sm font-medium">Retailer</span>
                    <p className="text-[10px] text-gray-500 mt-0.5">Buy wholesale</p>
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, type: 'manufacturer' })}
                    className={`p-3 rounded-xl border-2 text-center transition ${formData.type === 'manufacturer' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Building2 size={24} className="mx-auto mb-1" />
                    <span className="text-sm font-medium">Manufacturer</span>
                    <p className="text-[10px] text-gray-500 mt-0.5">Sell wholesale</p>
                  </button>
                </div>
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" required />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" required />
          </div>

          {authModalType === 'register' && (
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="tel" placeholder="Phone Number (e.g., +250 788 000 000)" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" required />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" required />
          </div>

          {authModalType === 'register' && (
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="City / Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" required />
            </div>
          )}

          <button type="submit" disabled={submitting} className={`w-full py-3 gradient-primary text-white font-semibold rounded-xl transition ${submitting ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}>
            {submitting ? 'Please wait…' : authModalType === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          {authModalType === 'login' && (
            <p className="text-center text-xs text-gray-400">
              Trouble signing in? Accounts are stored on this device — create a new account if you registered elsewhere.
            </p>
          )}

          <div className="text-center text-sm text-gray-500">
            {authModalType === 'login' ? (
              <>Don&apos;t have an account? <button type="button" onClick={() => setAuthModalType('register')} className="text-teal-600 font-medium hover:underline">Sign Up</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => setAuthModalType('login')} className="text-teal-600 font-medium hover:underline">Sign In</button></>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
