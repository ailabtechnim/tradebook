'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Shield, Truck, Lock, Package, ArrowLeft, Store, AlertCircle } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount, isLoggedIn, setShowAuthModal, setAuthModalType, showToast } = useApp();
  const router = useRouter();
  const [showCheckoutGuard, setShowCheckoutGuard] = useState(false);

  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);
  const escrowFee = Math.round(cartTotal * 0.015);
  const total = cartTotal + escrowFee;

  const handleProceedToCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowCheckoutGuard(true);
      return;
    }
    router.push('/checkout');
  };

  const handleGuardConfirm = () => {
    setShowCheckoutGuard(false);
    setAuthModalType('register');
    setShowAuthModal(true);
    showToast('Wholesaler Portal Access required — please register to unlock checkout.', 'info');
    // After auth, checkout page will still guard, but also allow direct navigation
    // We still push to checkout so they see the dedicated Wholesaler Portal Access wall there
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingCart size={64} className="mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Browse our wholesale products from verified manufacturers and add items to your cart.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition">
            Browse Products <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-app py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 text-sm">{cartCount} items in your cart</p>
          </div>
          <Link href="/products" className="flex items-center gap-1 text-teal-600 text-sm font-medium hover:text-teal-700">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.productId} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-2xl shrink-0">📦</div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`} className="font-semibold text-gray-900 hover:text-teal-700 transition text-sm">{item.productName}</Link>
                    <p className="text-xs text-gray-500 mt-0.5">by {item.manufacturerName}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg">
                        <button onClick={() => updateCartQuantity(item.productId, item.quantity - 1)} className="p-2 hover:bg-gray-200 rounded-l-lg transition"><Minus size={14} /></button>
                        <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.productId, item.quantity + 1)} className="p-2 hover:bg-gray-200 rounded-r-lg transition"><Plus size={14} /></button>
                      </div>
                      <span className="text-xs text-gray-400">MOQ: {item.moq}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-teal-700">{formatPrice(item.unitPrice * item.quantity)} RWF</div>
                    <div className="text-xs text-gray-400">{formatPrice(item.unitPrice)} × {item.quantity}</div>
                    <button onClick={() => removeFromCart(item.productId)} className="mt-2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium">Clear Cart</button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal ({cartCount} items)</span><span className="font-medium">{formatPrice(cartTotal)} RWF</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Escrow Protection Fee (1.5%)</span><span className="font-medium">{formatPrice(escrowFee)} RWF</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Delivery</span><span className="text-teal-600 font-medium">Calculated at checkout</span></div>
                <hr />
                <div className="flex justify-between"><span className="font-bold text-gray-900">Total</span><span className="font-bold text-xl text-teal-700">{formatPrice(total)} RWF</span></div>
              </div>

              {/* Escrow Info */}
              <div className="bg-teal-50 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Shield size={16} className="text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-teal-800">Escrow Protection</p>
                    <p className="text-[10px] text-teal-600 mt-0.5">Your payment is held securely until you confirm delivery. 100% buyer protection.</p>
                  </div>
                </div>
              </div>

              {!isLoggedIn && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-3 flex gap-2">
                  <Store size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 leading-relaxed"><strong>Wholesaler Portal Access required.</strong> You must sign up with shop name, email, phone, location & password before checkout unlocks.</p>
                </div>
              )}

              <button onClick={handleProceedToCheckout} className="block w-full py-3 gradient-primary text-white font-semibold rounded-xl text-center hover:opacity-90 transition">
                Proceed to Checkout
              </button>
              {!isLoggedIn && (
                <p className="text-center text-[11px] text-gray-400 mt-2">Clicking will prompt Wholesaler Portal Access</p>
              )}

              {/* Trust badges */}
              <div className="flex justify-center gap-4 mt-4 text-gray-400">
                <div className="flex items-center gap-1 text-[10px]"><Lock size={12} /> Secure</div>
                <div className="flex items-center gap-1 text-[10px]"><Shield size={12} /> Escrow</div>
                <div className="flex items-center gap-1 text-[10px]"><Truck size={12} /> Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wholesaler Guard Modal */}
      {showCheckoutGuard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target===e.currentTarget && setShowCheckoutGuard(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="gradient-primary p-6 text-white relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Store size={20} /></div>
                <div>
                  <h3 className="font-bold text-lg">Wholesaler Portal Access</h3>
                  <p className="text-teal-100 text-xs">Authentication wall — Retail buyers only</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-900">Sign-up required before checkout</p>
                  <p className="text-[11px] text-amber-700 leading-relaxed mt-1">To unlock shipping & MTN MoMo / Airtel Money escrow payments, please register your shop with <strong>shop name, email, phone, location and password</strong>. This secures your buyer protection.</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-xs text-gray-600">
                <p className="font-bold text-gray-900 flex items-center gap-1"><Shield size={14} className="text-teal-600" /> What unlocks after sign-up:</p>
                <ul className="space-y-1 ml-4 list-disc text-[11px]">
                  <li>Pre-filled shipping form with your shop details</li>
                  <li>Escrow payment options: MTN MoMo, Airtel Money, Cards & Bank</li>
                  <li>Order tracking & buyer-protection dashboard</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowCheckoutGuard(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition text-sm">Cancel</button>
                <button onClick={handleGuardConfirm} className="flex-1 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-95 transition text-sm">Sign Up to Continue</button>
              </div>
              <p className="text-center text-[11px] text-gray-400">You will be redirected to secure checkout portal</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
