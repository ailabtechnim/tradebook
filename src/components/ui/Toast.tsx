'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const icons = {
    success: <CheckCircle size={18} className="text-green-500" />,
    error: <XCircle size={18} className="text-red-500" />,
    info: <Info size={18} className="text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${bgColors[toast.type]}`}>
        {icons[toast.type]}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
}
