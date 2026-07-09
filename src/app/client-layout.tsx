'use client';

import React from 'react';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Toast from '@/components/ui/Toast';
import AuthModal from '@/components/ui/AuthModal';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toast />
      <AuthModal />
    </AppProvider>
  );
}
