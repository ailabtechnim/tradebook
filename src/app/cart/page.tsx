'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Shield, Truck, Lock, Package, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount } = useApp();

  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);
  const escrowFee = Math.round(cartTotal * 0.015);
  const total = cartTotal + escrowFee;

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

              <Link href="/checkout" className="block w-full py-3 gradient-primary text-white font-semibold rounded-xl text-center hover:opacity-90 transition">
                Proceed to Checkout
              </Link>

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
    </div>
  );
}
