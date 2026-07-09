'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Shield, CreditCard, Smartphone, Building, MapPin, Truck, Lock, CheckCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);
  const escrowFee = Math.round(cartTotal * 0.015);
  const total = cartTotal + escrowFee;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
    showToast('Order placed successfully! Payment held in escrow.', 'success');
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 animate-slide-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h2>
          <p className="text-gray-500 mb-4">Your payment of <span className="font-bold text-teal-700">{formatPrice(total)} RWF</span> is held securely in escrow.</p>
          <div className="bg-teal-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-teal-800 text-sm mb-2">🛡️ Escrow Protection Active</h3>
            <ul className="text-xs text-teal-700 space-y-1">
              <li>✓ Payment held securely by TradeBook</li>
              <li>✓ Released to manufacturer only after delivery confirmation</li>
              <li>✓ Full refund if delivery fails</li>
              <li>✓ Dispute resolution available</li>
            </ul>
          </div>
          <p className="text-sm text-gray-500 mb-6">Order ID: TB-2026-{Math.random().toString(36).substring(7).toUpperCase()}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard" className="px-6 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition">
              View Orders
            </Link>
            <Link href="/products" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No items to checkout</h2>
          <Link href="/products" className="text-teal-600 hover:underline">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-app py-8">
        <Link href="/cart" className="flex items-center gap-1 text-teal-600 text-sm font-medium hover:text-teal-700 mb-6">
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[
            { num: 1, label: 'Shipping' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Review' },
          ].map(s => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s.num ? 'gradient-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > s.num ? <CheckCircle size={16} /> : s.num}
              </div>
              <span className={`text-sm font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
              {s.num < 3 && <div className={`w-12 h-0.5 ${step > s.num ? 'bg-teal-600' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 animate-fade-in">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={20} /> Shipping Address</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" defaultValue="Jean-Pierre Habimana" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" defaultValue="+250 788 111 222" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input type="text" defaultValue="Kimironko Market, KG 12 Ave" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" defaultValue="Kigali" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">District</label><input type="text" defaultValue="Gasabo" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" /></div>
                </div>
                <button onClick={() => setStep(2)} className="mt-6 px-8 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition">
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 animate-fade-in">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><CreditCard size={20} /> Payment Method</h2>

                <div className="space-y-3 mb-6">
                  {[
                    { id: 'mtn', icon: <Smartphone size={20} />, name: 'MTN Mobile Money', desc: 'Pay with MTN MoMo' },
                    { id: 'airtel', icon: <Smartphone size={20} />, name: 'Airtel Money', desc: 'Pay with Airtel Money' },
                    { id: 'card', icon: <CreditCard size={20} />, name: 'Visa / Mastercard', desc: 'Pay with debit/credit card' },
                    { id: 'bank', icon: <Building size={20} />, name: 'Bank Transfer', desc: 'Direct bank transfer' },
                  ].map(method => (
                    <label key={method.id} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${paymentMethod === method.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === method.id ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{method.name}</div>
                        <div className="text-xs text-gray-500">{method.desc}</div>
                      </div>
                      {paymentMethod === method.id && <CheckCircle size={20} className="text-teal-600" />}
                    </label>
                  ))}
                </div>

                {/* Escrow info */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <Shield size={18} className="text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Escrow Protection</p>
                      <p className="text-xs text-amber-600 mt-1">Your payment will be held securely by TradeBook until you confirm delivery. The manufacturer receives payment only after you verify the goods.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition">Back</button>
                  <button onClick={() => setStep(3)} className="px-8 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition">Review Order</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 animate-fade-in">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Review Your Order</h2>

                <div className="space-y-3 mb-6">
                  {cart.map(item => (
                    <div key={item.productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">📦</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                        <p className="text-xs text-gray-500">{item.quantity} × {formatPrice(item.unitPrice)} RWF</p>
                      </div>
                      <span className="font-bold text-sm text-gray-900">{formatPrice(item.unitPrice * item.quantity)} RWF</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition">Back</button>
                  <button onClick={handlePlaceOrder} className="flex-1 py-3 gradient-primary text-white font-bold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2">
                    <Lock size={18} /> Place Order — {formatPrice(total)} RWF
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>{formatPrice(cartTotal)} RWF</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Escrow Fee (1.5%)</span><span>{formatPrice(escrowFee)} RWF</span></div>
                <hr />
                <div className="flex justify-between font-bold"><span>Total</span><span className="text-teal-700 text-lg">{formatPrice(total)} RWF</span></div>
              </div>
              <div className="bg-teal-50 rounded-lg p-3 text-xs text-teal-700">
                <Shield size={14} className="inline mr-1" /> 100% Escrow Protected
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
