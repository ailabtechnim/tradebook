'use client';

import React, { useState } from 'react';
import { Shield, FileText, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LegalPage() {
  const [doc, setDoc] = useState<'privacy' | 'terms' | 'escrow'>('privacy');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-app py-8 max-w-3xl">
        <Link href="/" className="flex items-center gap-1 text-teal-600 text-sm font-medium hover:text-teal-700 mb-6">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Legal & Policies</h1>

        <div className="flex gap-2 mb-6">
          {[
            { key: 'privacy' as const, label: 'Privacy Policy', icon: <Lock size={14} /> },
            { key: 'terms' as const, label: 'Terms of Service', icon: <FileText size={14} /> },
            { key: 'escrow' as const, label: 'Escrow Policy', icon: <Shield size={14} /> },
          ].map(t => (
            <button key={t.key} onClick={() => setDoc(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${doc === t.key ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-5 text-sm text-gray-600 leading-relaxed animate-fade-in">
          {doc === 'privacy' && (
            <>
              <h2 className="text-xl font-bold text-gray-900">Privacy Policy</h2>
              <p><strong>Effective:</strong> August 2026 · Applies to the TradeBook platform.</p>
              <h3 className="font-bold text-gray-900">1. Data we collect</h3>
              <p>When you register, we store only what you type into our forms: your name or business name, email, phone number, city, and (for manufacturers) your company profile, products and production story links. Passwords are never stored in plain text — only a salted one-way hash is kept.</p>
              <h3 className="font-bold text-gray-900">2. Where your data lives</h3>
              <p>This deployment stores all records locally in your browser (localStorage) on your own device. We do not run analytics, tracking pixels, or advertising cookies. Nothing is transmitted to third parties except links you explicitly open (e.g., WhatsApp).</p>
              <h3 className="font-bold text-gray-900">3. Your control</h3>
              <p>Signing out removes the active session. You may clear all stored records at any time via your browser's site-data settings. Contact <a className="text-teal-600 underline" href="mailto:support@tradebook.rw">support@tradebook.rw</a> for data questions.</p>
            </>
          )}
          {doc === 'terms' && (
            <>
              <h2 className="text-xl font-bold text-gray-900">Terms of Service</h2>
              <p><strong>Effective:</strong> August 2026 · By using TradeBook you accept these terms.</p>
              <h3 className="font-bold text-gray-900">1. Real businesses only</h3>
              <p>Accounts must represent a real registered business or retail shop. Providing false company details, fake RDB registrations, impersonating another business, or listing products you cannot supply may result in account removal.</p>
              <h3 className="font-bold text-gray-900">2. Roles</h3>
              <p>Manufacturer accounts may publish catalogs and stories. Retailer accounts may order, follow manufacturers and join group buys. Wholesale checkout is restricted to registered retailer accounts.</p>
              <h3 className="font-bold text-gray-900">3. Pricing honesty</h3>
              <p>Manufacturers must publish truthful wholesale and suggested retail prices. TradeBook's transparency model exists to protect retailers from hidden markups; deliberate price manipulation violates these terms.</p>
              <h3 className="font-bold text-gray-900">4. Verification</h3>
              <p>The "Verified" badge is granted only after TradeBook reviews your business registration and premises. Accounts may not claim verification they have not received.</p>
            </>
          )}
          {doc === 'escrow' && (
            <>
              <h2 className="text-xl font-bold text-gray-900">Escrow Policy</h2>
              <p><strong>Effective:</strong> August 2026 · How TradeBook protects every order.</p>
              <h3 className="font-bold text-gray-900">1. How it works</h3>
              <p>When a retailer pays, funds are locked in the TradeBook escrow ledger — the manufacturer does NOT receive the money immediately. A flat 1.5% escrow protection fee applies at checkout.</p>
              <h3 className="font-bold text-gray-900">2. Release</h3>
              <p>Funds release to the manufacturer only when the retailer confirms physical delivery in their dashboard. Confirmation is an explicit, logged action ("Confirm Delivery — Release Funds").</p>
              <h3 className="font-bold text-gray-900">3. Disputes</h3>
              <p>Either party may open a dispute before release. A dispute locks the escrow indefinitely while a TradeBook mediator reviews evidence from both sides within 24 hours.</p>
              <h3 className="font-bold text-gray-900">4. Refunds</h3>
              <p>If a dispute resolves in the buyer's favour, the full escrowed amount (including the escrow fee) is returned to the buyer's original payment method.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
