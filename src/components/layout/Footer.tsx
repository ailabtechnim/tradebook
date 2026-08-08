'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* CTA Section */}
      <div className="gradient-primary py-12">
        <div className="container-app text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Transform Your Business?</h2>
          <p className="text-teal-100 mb-6 max-w-lg mx-auto">Register your company or shop today. Transparent wholesale pricing, escrow protection, no middlemen.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/manufacturers/onboarding" className="px-6 py-3 bg-white text-teal-700 font-semibold rounded-xl hover:bg-gray-100 transition">
              List Your Products
            </Link>
            <Link href="/products" className="px-6 py-3 bg-teal-800 text-white font-semibold rounded-xl hover:bg-teal-900 transition border border-teal-600">
              Browse Wholesale
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">T</div>
              <span className="text-xl font-bold text-white">TradeBook</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Africa&apos;s first social-commerce B2B platform. Connecting manufacturers directly with retailers through transparent wholesale pricing.
            </p>
            <div className="flex gap-3 items-center text-xs text-gray-500">
              <a href="mailto:support@tradebook.rw" className="hover:text-teal-400 transition">✉️ support@tradebook.rw</a>
            </div>
          </div>

          {/* For Retailers */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Retailers</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products" className="hover:text-teal-400 transition">Browse Products</Link></li>
              <li><Link href="/group-buy" className="hover:text-teal-400 transition">Group Buying</Link></li>
              <li><Link href="/manufacturers" className="hover:text-teal-400 transition">Find Manufacturers</Link></li>
              <li><Link href="/dashboard" className="hover:text-teal-400 transition">My Dashboard</Link></li>
              <li><Link href="/cart" className="hover:text-teal-400 transition">My Cart</Link></li>
            </ul>
          </div>

          {/* For Manufacturers */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Manufacturers</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/manufacturers/onboarding" className="hover:text-teal-400 transition">Register Your Factory</Link></li>
              <li><Link href="/manufacturers/onboarding" className="hover:text-teal-400 transition">List Products</Link></li>
              <li><Link href="/stories" className="hover:text-teal-400 transition">Share Stories</Link></li>
              <li><Link href="/dashboard" className="hover:text-teal-400 transition">Vendor Dashboard</Link></li>
              <li><Link href="/group-buy" className="hover:text-teal-400 transition">Group Buy Demand</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-teal-400 transition">About TradeBook</Link></li>
              <li><Link href="/" className="hover:text-teal-400 transition">How It Works</Link></li>
              <li><Link href="/checkout" className="hover:text-teal-400 transition">Escrow Protection</Link></li>
              <li><a href="mailto:support@tradebook.rw" className="hover:text-teal-400 transition">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-app py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">© 2026 TradeBook Rwanda. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/legal" className="hover:text-gray-300 transition">Privacy Policy</Link>
            <Link href="/legal" className="hover:text-gray-300 transition">Terms of Service</Link>
            <Link href="/legal" className="hover:text-gray-300 transition">Escrow Policy</Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>💳 MTN MoMo</span>
            <span>💳 Airtel Money</span>
            <span>💳 Visa</span>
            <span>🏦 Bank Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
