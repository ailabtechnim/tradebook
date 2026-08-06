'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Shield, CreditCard, Smartphone, Building, MapPin, Truck, Lock, CheckCircle,
  ArrowLeft, Loader2, AlertTriangle, Upload, Eye, FileText, Check, X, SmartphoneIcon
} from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  // Shipping information state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: 'Jean-Pierre Habimana',
    phone: '+250 788 111 222',
    address: 'Kimironko Market, KG 12 Ave',
    city: 'Kigali',
    district: 'Gasabo',
  });

  // Mobile money payment state
  const [momoPhone, setMomoPhone] = useState('+250 788 111 222');

  // Credit card payment state
  const [cardInfo, setCardInfo] = useState({
    holder: 'Jean-Pierre Habimana',
    number: '',
    expiry: '',
    cvv: '',
  });

  // Bank transfer state
  const [selectedBank, setSelectedBank] = useState('BK');
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [receiptName, setReceiptName] = useState('');
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Simulation modal state
  const [showSimModal, setShowSimModal] = useState(false);
  const [simStep, setSimStep] = useState<'processing' | 'momo_ussd' | 'card_otp' | 'bank_upload' | 'verifying' | 'failed' | 'success'>('processing');
  const [simMessage, setSimMessage] = useState('');
  const [simSubstep, setSimSubstep] = useState(0);
  const [momoPin, setMomoPin] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [failedReason, setFailedReason] = useState('');

  useEffect(() => {
    // Pre-populate MoMo phone number when shipping phone changes
    setMomoPhone(shippingInfo.phone);
  }, [shippingInfo.phone]);

  useEffect(() => {
    // Generate a unique order ID once checkout starts
    setGeneratedOrderId(`TB-2026-${Math.random().toString(36).substring(3, 9).toUpperCase()}`);
  }, []);

  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);
  const escrowFee = Math.round(cartTotal * 0.015);
  const total = cartTotal + escrowFee;

  const handleShippingChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  // Card input formatters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = value.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || '';
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      value = parts.join(' ');
    } else {
      value = value.substring(0, 19);
    }
    setCardInfo(prev => ({ ...prev, number: value }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setCardInfo(prev => ({ ...prev, expiry: value.substring(0, 5) }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/gi, '');
    setCardInfo(prev => ({ ...prev, cvv: value.substring(0, 3) }));
  };

  // Simulate file upload for Bank Receipt
  const triggerMockReceiptUpload = () => {
    setIsUploadingReceipt(true);
    setUploadProgress(10);
    const names = ['transfer_slip_bk_tradebook.png', 'bank_receipt_img2026.pdf', 'transaction_screenshot.jpg'];
    const chosenName = names[Math.floor(Math.random() * names.length)];
    setReceiptName(chosenName);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploadingReceipt(false);
          setReceiptUploaded(true);
          showToast('Mock proof of payment uploaded successfully!', 'success');
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  // Start the payment simulation flow
  const handleProceedToPayment = () => {
    // Simple validation before starting
    if (paymentMethod === 'card') {
      if (!cardInfo.number || cardInfo.number.length < 15) {
        showToast('Please enter a valid credit card number.', 'error');
        return;
      }
      if (!cardInfo.expiry || cardInfo.expiry.length < 5) {
        showToast('Please enter a valid expiry date (MM/YY).', 'error');
        return;
      }
      if (!cardInfo.cvv || cardInfo.cvv.length < 3) {
        showToast('Please enter a valid CVV.', 'error');
        return;
      }
    }

    if (paymentMethod === 'bank' && !receiptUploaded) {
      showToast('Please upload a bank transfer receipt receipt before continuing.', 'error');
      return;
    }

    setShowSimModal(true);
    setSimStep('processing');
    setSimSubstep(0);
    setMomoPin('');
    setOtpCode('');

    // Simulated progress steps
    const timer1 = setTimeout(() => {
      setSimSubstep(1); // Connecting to gateway
      const timer2 = setTimeout(() => {
        setSimSubstep(2); // Securing escrow vault ledger
        const timer3 = setTimeout(() => {
          if (paymentMethod === 'mtn' || paymentMethod === 'airtel') {
            setSimStep('momo_ussd');
          } else if (paymentMethod === 'card') {
            setSimStep('card_otp');
          } else {
            // bank receipt is already uploaded, proceed directly to verifying receipt
            setSimStep('verifying');
            const timer4 = setTimeout(() => {
              setSimStep('success');
            }, 2500);
          }
        }, 1500);
      }, 1500);
    }, 1200);
  };

  const handleMomoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!momoPin) {
      showToast('Please enter your 4-digit PIN.', 'error');
      return;
    }

    if (momoPin === '0000') {
      setFailedReason('Insufficient wallet balance or incorrect PIN entry on your mobile device.');
      setSimStep('failed');
    } else {
      setSimStep('verifying');
      setTimeout(() => {
        setSimStep('success');
      }, 2500);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      showToast('Please enter the OTP verification code.', 'error');
      return;
    }

    if (otpCode !== '123456') {
      setFailedReason('3D-Secure card verification failed. Incorrect OTP code entered.');
      setSimStep('failed');
    } else {
      setSimStep('verifying');
      setTimeout(() => {
        setSimStep('success');
      }, 2500);
    }
  };

  const handleConfirmOrderSuccess = () => {
    setOrderPlaced(true);
    setShowSimModal(false);
    clearCart();
    showToast('Payment received and safely secured in TradeBook Escrow!', 'success');
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto px-6 py-8 bg-white rounded-2xl border border-gray-100 shadow-xl animate-slide-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-sm text-gray-500 mb-6">Your payment has been successfully secured in escrow.</p>

          <div className="bg-teal-50 border border-teal-100 rounded-xl p-5 mb-6 text-left">
            <h3 className="font-bold text-teal-800 text-sm mb-3 flex items-center gap-2">
              <Shield size={16} /> 🛡️ Escrow Protection Active
            </h3>
            <ul className="text-xs text-teal-700 space-y-2">
              <li className="flex items-start gap-1.5">
                <Check size={14} className="mt-0.5 shrink-0" />
                <span>TradeBook is holding <strong>{formatPrice(total)} RWF</strong> securely.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check size={14} className="mt-0.5 shrink-0" />
                <span>The manufacturer will be notified to pack and ship.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check size={14} className="mt-0.5 shrink-0" />
                <span>Funds are only released once you inspect and verify delivery in your dashboard.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check size={14} className="mt-0.5 shrink-0" />
                <span>Full dispute protection is available for peace of mind.</span>
              </li>
            </ul>
          </div>

          <div className="text-left border-t border-b border-gray-100 py-3 mb-6 space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Order ID</span>
              <span className="font-mono font-bold text-gray-800">{generatedOrderId}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Payment Mode</span>
              <span className="capitalize font-medium text-gray-800">
                {paymentMethod === 'mtn' ? 'MTN MoMo' : paymentMethod === 'airtel' ? 'Airtel Money' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Bank Transfer'}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Deliver To</span>
              <span className="font-medium text-gray-800">{shippingInfo.fullName} ({shippingInfo.city})</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard" className="flex-1 py-3 gradient-primary text-white font-semibold rounded-xl text-center hover:opacity-95 transition text-sm">
              Go to Dashboard
            </Link>
            <Link href="/products" className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-xl text-center hover:bg-gray-100 transition text-sm">
              Keep Shopping
            </Link>
          </div>
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
            { num: 1, label: 'Shipping Address' },
            { num: 2, label: 'Secure Payment' },
            { num: 3, label: 'Review & Verify' },
          ].map(s => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= s.num ? 'gradient-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > s.num ? <CheckCircle size={16} /> : s.num}
              </div>
              <span className={`text-sm font-semibold hidden sm:inline ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
              {s.num < 3 && <div className={`w-8 sm:w-16 h-0.5 transition-colors duration-300 ${step > s.num ? 'bg-teal-600' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-fade-in">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <MapPin size={20} className="text-teal-600" /> Shipping Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name / Retail Shop Name</label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => handleShippingChange('fullName', e.target.value)}
                      placeholder="Jean-Pierre Habimana"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Contact Phone Number</label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      placeholder="+250 788 111 222"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Delivery Address / Shop Stall Location</label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      placeholder="Kimironko Market, Stall B42, KG 12 Ave"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">City</label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      placeholder="Kigali"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">District</label>
                    <input
                      type="text"
                      value={shippingInfo.district}
                      onChange={(e) => handleShippingChange('district', e.target.value)}
                      placeholder="Gasabo"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => {
                      if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
                        showToast('Please fill out all required shipping fields.', 'error');
                        return;
                      }
                      setStep(2);
                    }}
                    className="px-8 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition shadow-sm"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-fade-in">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <CreditCard size={20} className="text-teal-600" /> Secure Payment Method
                </h2>

                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  {[
                    { id: 'mtn', icon: <span className="font-bold text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">MTN</span>, name: 'MTN Mobile Money', desc: 'Rwanda MoMo instant push' },
                    { id: 'airtel', icon: <span className="font-bold text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Airtel</span>, name: 'Airtel Money', desc: 'Airtel Money instant push' },
                    { id: 'card', icon: <CreditCard size={20} />, name: 'Visa / Mastercard', desc: 'Secure card gateway' },
                    { id: 'bank', icon: <Building size={20} />, name: 'Bank Transfer', desc: 'BK, I&M manual upload' },
                  ].map(method => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === method.id ? 'border-teal-500 bg-teal-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${paymentMethod === method.id ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>
                        {method.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 truncate">{method.name}</div>
                        <div className="text-xs text-gray-500 truncate">{method.desc}</div>
                      </div>
                      {paymentMethod === method.id && <CheckCircle size={18} className="text-teal-600 shrink-0" />}
                    </label>
                  ))}
                </div>

                {/* Nested Interactive Forms based on chosen Payment Method */}
                <div className="border-t border-gray-100 pt-6 mt-6">
                  {(paymentMethod === 'mtn' || paymentMethod === 'airtel') && (
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200/60 animate-fade-in">
                      <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-1.5">
                        <Smartphone size={16} className="text-teal-600" />
                        {paymentMethod === 'mtn' ? 'MTN Mobile Money Gateway' : 'Airtel Money Gateway'}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                        We will push a secure USSD payment request dialog directly to your phone. Enter your wallet details below:
                      </p>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Mobile Money Number</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-semibold flex items-center gap-1 border-r pr-2 border-gray-200">
                            🇷🇼 +250
                          </span>
                          <input
                            type="text"
                            value={momoPhone.replace(/^\+250\s*/, '')}
                            onChange={(e) => setMomoPhone(`+250 ${e.target.value}`)}
                            placeholder="788 111 222"
                            className="w-full pl-24 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                          />
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1.5">
                          Make sure this mobile wallet has at least <strong className="text-teal-700">{formatPrice(total)} RWF</strong> available.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200/60 space-y-4 animate-fade-in">
                      <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                        <Lock size={15} className="text-teal-600" /> Secure Card Checkout
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardInfo.holder}
                            onChange={(e) => setCardInfo({ ...cardInfo, holder: e.target.value })}
                            placeholder="Jean-Pierre Habimana"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Card Number</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={cardInfo.number}
                              onChange={handleCardNumberChange}
                              placeholder="4111 1111 1111 1111"
                              maxLength={19}
                              className="w-full pl-4 pr-12 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            />
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                              <CreditCard size={18} />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expiry Date</label>
                            <input
                              type="text"
                              value={cardInfo.expiry}
                              onChange={handleExpiryChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CVV Security Code</label>
                            <input
                              type="password"
                              value={cardInfo.cvv}
                              onChange={handleCvvChange}
                              placeholder="•••"
                              maxLength={3}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-1">
                        <Shield size={12} className="text-teal-600" />
                        <span>Protected by AES-256 standard bank level encryption. TradeBook does not save your security code.</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'bank' && (
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200/60 space-y-4 animate-fade-in">
                      <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                        <Building size={16} className="text-teal-600" /> Bank Transfer Escrow Instructions
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Select Escrow Beneficiary Bank</label>
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                          >
                            <option value="BK">Bank of Kigali (BK)</option>
                            <option value="I&M">I&M Bank Rwanda</option>
                            <option value="BPR">BPR Bank Rwanda (BPR Atlas Mara)</option>
                            <option value="Equity">Equity Bank Rwanda</option>
                          </select>
                        </div>

                        {/* Custom bank info based on bank choice */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2.5 text-xs text-gray-600">
                          <div>
                            <span className="text-gray-400 block uppercase font-bold text-[10px]">Beneficiary Name</span>
                            <span className="font-bold text-gray-900 text-sm">TradeBook Ltd (Escrow Account)</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-gray-400 block uppercase font-bold text-[10px]">Account Number</span>
                              <span className="font-mono font-bold text-gray-900">
                                {selectedBank === 'BK' ? '00095-01384029-41' : selectedBank === 'I&M' ? '10003094829-10' : selectedBank === 'BPR' ? '4009-1234902-88' : '5010-3321908-12'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400 block uppercase font-bold text-[10px]">Reference Code</span>
                              <span className="font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded text-sm">{generatedOrderId}</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-amber-600 pt-1 border-t border-gray-100">
                            🚨 You MUST include the reference code above in your transfer memo for instant auto-verification!
                          </p>
                        </div>

                        {/* File upload mockup */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Proof of Bank Transfer (Screenshot or PDF Slip)</label>
                          {receiptUploaded ? (
                            <div className="border border-green-200 bg-green-50 rounded-lg p-3 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-green-800 text-sm font-semibold">
                                <FileText size={18} />
                                <span className="truncate max-w-[180px]">{receiptName}</span>
                              </div>
                              <button
                                onClick={() => {
                                  setReceiptUploaded(false);
                                  setReceiptName('');
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={triggerMockReceiptUpload}
                              disabled={isUploadingReceipt}
                              className={`w-full py-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${isUploadingReceipt ? 'bg-gray-100 border-gray-300' : 'border-gray-300 hover:border-teal-500 bg-white hover:bg-teal-50/10'}`}
                            >
                              {isUploadingReceipt ? (
                                <div className="text-center py-2">
                                  <Loader2 className="animate-spin text-teal-600 mx-auto mb-2" size={24} />
                                  <span className="text-xs font-semibold text-gray-500">Uploading Payment Slip ({uploadProgress}%)</span>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <Upload className="text-gray-400 mx-auto mb-1.5" size={24} />
                                  <span className="text-xs font-semibold text-gray-700 block">Click to Simulate Transfer Proof Upload</span>
                                  <span className="text-[10px] text-gray-400">PDF, PNG, JPG up to 10MB</span>
                                </div>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Escrow warning badge */}
                <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-4 mt-6">
                  <div className="flex gap-3">
                    <Shield size={20} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-800">TradeBook Escrow Guarantee</p>
                      <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                        Funds are stored inside a cryptographic multi-sig bank ledger. Payment is NOT transferred to the manufacturer until you physically mark the order as delivered and approved in your panel. Protects against scams, incomplete deliveries, or damaged stock.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition text-sm"
                  >
                    Back to Shipping
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition text-sm text-center shadow-sm"
                  >
                    Review & Place Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-fade-in">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Review & Confirm Your Wholesale Order</h2>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Shipping summary card */}
                  <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/40">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <MapPin size={13} className="text-teal-600" /> Shipping Destination
                    </h3>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p className="font-bold text-gray-900">{shippingInfo.fullName}</p>
                      <p>{shippingInfo.phone}</p>
                      <p className="line-clamp-1">{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.district} District</p>
                    </div>
                  </div>

                  {/* Payment summary card */}
                  <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/40">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <CreditCard size={13} className="text-teal-600" /> Selected Escrow Payment
                    </h3>
                    <div className="space-y-1.5 text-sm text-gray-700">
                      <p className="font-bold text-gray-900">
                        {paymentMethod === 'mtn' ? 'MTN Mobile Money' : paymentMethod === 'airtel' ? 'Airtel Money' : paymentMethod === 'card' ? 'Visa / Mastercard' : 'Bank Transfer'}
                      </p>
                      {paymentMethod === 'mtn' && <p className="font-mono text-xs font-semibold text-teal-700">MTN Wallet: {momoPhone}</p>}
                      {paymentMethod === 'airtel' && <p className="font-mono text-xs font-semibold text-teal-700">Airtel Wallet: {momoPhone}</p>}
                      {paymentMethod === 'card' && (
                        <p className="font-mono text-xs font-semibold text-teal-700">
                          Holder: {cardInfo.holder} <br />
                          Number: •••• •••• •••• {cardInfo.number.slice(-4)}
                        </p>
                      )}
                      {paymentMethod === 'bank' && (
                        <p className="font-mono text-xs font-semibold text-teal-700">
                          Bank: {selectedBank} <br />
                          Receipt: {receiptName || 'Uploaded'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Items ({cart.length})</h3>
                <div className="space-y-2 mb-6">
                  {cart.map(item => (
                    <div key={item.productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center text-xl shrink-0">
                        📦
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{item.productName}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} units × {formatPrice(item.unitPrice)} RWF • <span className="font-medium text-teal-600">{item.manufacturerName}</span>
                        </p>
                      </div>
                      <span className="font-bold text-sm text-gray-900 shrink-0">{formatPrice(item.unitPrice * item.quantity)} RWF</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition text-sm"
                  >
                    Back to Payment
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    className="flex-1 py-3 gradient-primary text-white font-bold rounded-xl hover:opacity-95 transition flex items-center justify-center gap-2 text-sm shadow-sm"
                  >
                    <Lock size={15} /> Proceed to Secure Payment — {formatPrice(total)} RWF
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Order Summary</h3>
              <div className="space-y-3.5 mb-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Wholesale Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(cartTotal)} RWF</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-1">
                    Escrow Protection Fee
                    <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded">1.5%</span>
                  </span>
                  <span className="font-medium text-gray-900">{formatPrice(escrowFee)} RWF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Protection Guarantee</span>
                  <span className="font-semibold text-green-600 text-xs uppercase bg-green-50 px-2 py-0.5 rounded">FREE</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between font-bold items-baseline">
                  <span className="text-gray-900">Grand Total</span>
                  <span className="text-teal-700 text-xl font-bold">{formatPrice(total)} RWF</span>
                </div>
              </div>

              <div className="bg-teal-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
                  <Shield size={14} className="text-teal-600 shrink-0" />
                  <span>100% Secure Escrow Verified</span>
                </div>
                <p className="text-[11px] text-teal-700 leading-relaxed">
                  Your funds are protected from vendor delays, non-delivery, or quality issues. Release only on confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/*                   PAYMENT GATEWAY SIMULATOR MODAL                         */}
      {/* ========================================================================= */}
      {showSimModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-150 overflow-hidden animate-slide-up">
            
            {/* Header */}
            <div className="bg-gray-950 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
                <span className="font-mono text-xs uppercase font-bold tracking-wider text-teal-400">TradeBook Sandbox Gateway v1.0</span>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to cancel the active payment session?')) {
                    setShowSimModal(false);
                    showToast('Payment session aborted.', 'info');
                  }
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Switcher */}
            <div className="p-6">
              
              {/* STAGE: PROCESSING */}
              {simStep === 'processing' && (
                <div className="text-center py-8 space-y-4">
                  <Loader2 className="animate-spin text-teal-600 mx-auto" size={42} />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Contacting Gateway API...</h3>
                    <p className="text-xs text-gray-500 mt-1">Please wait while we establish a secure tunnel with your service provider.</p>
                  </div>
                  
                  {/* Step status logs */}
                  <div className="max-w-xs mx-auto text-left bg-gray-50 border border-gray-150 rounded-lg p-3 space-y-2 text-xs font-mono text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✔</span>
                      <span>Resolved merchant authorization endpoint</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {simSubstep >= 1 ? (
                        <>
                          <span className="text-green-600">✔</span>
                          <span>Connected to {paymentMethod === 'card' ? 'Stripe Gateway' : paymentMethod === 'mtn' ? 'MTN MoMo API' : 'Airtel Money API'}</span>
                        </>
                      ) : (
                        <>
                          <Loader2 className="animate-spin text-teal-500" size={12} />
                          <span className="text-gray-400">Handshaking with payment network...</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {simSubstep >= 2 ? (
                        <>
                          <span className="text-green-600">✔</span>
                          <span>Locked Escrow Account: {generatedOrderId}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-300">Allocating secure ledger space...</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE: USSD MOBILE MONEY PROMPT SIMULATOR */}
              {simStep === 'momo_ussd' && (
                <div className="space-y-5">
                  <div className="text-center mb-1">
                    <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-800 border border-yellow-200 text-[10px] font-bold uppercase rounded-full">
                      Interactive Push Notification Simulator
                    </span>
                    <h3 className="font-bold text-gray-900 mt-2 text-base">Check Your Virtual Mobile Phone!</h3>
                    <p className="text-xs text-gray-500 mt-1">We sent a payment prompt message to {momoPhone}. Please respond to approve.</p>
                  </div>

                  {/* Virtual Phone Container */}
                  <div className="max-w-[280px] mx-auto border-8 border-gray-800 bg-gray-900 rounded-3xl overflow-hidden shadow-lg p-4 font-sans relative">
                    {/* Phone speaker notch */}
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-gray-800 rounded-b-md"></div>
                    
                    {/* Active USSD Box Overlay */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 mt-4 shadow-md text-left text-xs text-gray-800 select-none animate-pulse-once">
                      <div className="flex justify-between border-b pb-1.5 mb-2 text-gray-400 font-bold uppercase text-[9px] tracking-wide">
                        <span>{paymentMethod === 'mtn' ? 'MTN MoMo Message' : 'Airtel Money Message'}</span>
                        <span>Now</span>
                      </div>
                      
                      <p className="mb-3 font-semibold leading-relaxed">
                        Do you want to authorize payment of <span className="font-bold text-red-600">{formatPrice(total)} RWF</span> to <span className="font-bold text-teal-700">TradeBook Ltd</span> (Ref: {generatedOrderId})?
                      </p>
                      <p className="text-[10px] text-gray-400 mb-3 font-bold">
                        Enter 4-digit Wallet PIN:
                      </p>

                      <form onSubmit={handleMomoSubmit} className="space-y-3">
                        <input
                          type="password"
                          value={momoPin}
                          onChange={(e) => setMomoPin(e.target.value.replace(/\D/g, '').substring(0, 4))}
                          placeholder="••••"
                          maxLength={4}
                          autoFocus
                          className="w-full text-center tracking-widest text-lg font-bold border border-gray-300 rounded px-2 py-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                        <div className="text-[10px] text-amber-600 bg-amber-50 rounded p-1.5 leading-normal">
                          💡 <strong>Demo Instructions:</strong> Enter any PIN (e.g. 1234) to approve. Use <strong>0000</strong> to simulate failed transaction.
                        </div>
                        <div className="flex gap-2 font-bold">
                          <button
                            type="button"
                            onClick={() => {
                              setFailedReason('Transaction cancelled on mobile handset by customer.');
                              setSimStep('failed');
                            }}
                            className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 border text-center transition text-[11px]"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 py-1.5 gradient-primary text-white rounded text-center hover:opacity-95 transition text-[11px]"
                          >
                            Send
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Virtual Home Bar */}
                    <div className="w-20 h-1 bg-gray-700 mx-auto mt-6 rounded-full"></div>
                  </div>
                </div>
              )}

              {/* STAGE: CARD OTP SIMULATOR */}
              {simStep === 'card_otp' && (
                <div className="space-y-5">
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold uppercase rounded-full">
                      3D Secure OTP Simulator
                    </span>
                    <h3 className="font-bold text-gray-900 mt-2 text-base">Authorize Card Transaction</h3>
                    <p className="text-xs text-gray-500 mt-1">A mock 3D secure verification code has been dispatched to {shippingInfo.phone}.</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-left text-xs space-y-4">
                    <div className="flex justify-between items-center pb-2.5 border-b border-gray-200">
                      <span className="font-bold text-gray-800 tracking-wide text-[11px]">TradeBook Verified Security</span>
                      <span className="font-mono font-bold text-teal-600">MASTERPASS / VISA</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-500">
                        <span>Merchant Account</span>
                        <span className="font-semibold text-gray-800">TradeBook Ltd (Rwanda)</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Payment Amount</span>
                        <span className="font-bold text-teal-700">{formatPrice(total)} RWF</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Card number</span>
                        <span className="font-mono text-gray-800">•••• •••• •••• {cardInfo.number.slice(-4)}</span>
                      </div>
                    </div>

                    <form onSubmit={handleOtpSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Enter 6-Digit Verification OTP Code</label>
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                          placeholder="123456"
                          maxLength={6}
                          autoFocus
                          className="w-full text-center tracking-widest text-lg font-bold border border-gray-300 rounded-lg py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        />
                      </div>
                      <div className="text-[10px] text-teal-700 bg-teal-50 border border-teal-100 rounded p-2 leading-relaxed">
                        💡 <strong>Demo Key:</strong> Type <strong>123456</strong> to successfully verify and approve payment. Any other code simulates validation failure.
                      </div>

                      <div className="flex gap-2 font-bold pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setFailedReason('3D-Secure transaction cancelled by credit card holder.');
                            setSimStep('failed');
                          }}
                          className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 border rounded-lg text-gray-700 text-center transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 gradient-primary text-white rounded-lg text-center hover:opacity-95 transition"
                        >
                          Submit OTP Code
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* STAGE: VERIFYING CRYPTOGRAPHIC LEDGER LOCK */}
              {simStep === 'verifying' && (
                <div className="text-center py-8 space-y-4">
                  <Loader2 className="animate-spin text-teal-600 mx-auto" size={42} />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Broadcasting to Escrow Vault...</h3>
                    <p className="text-xs text-gray-500 mt-1">Please wait while the transaction signature is verified on-chain and registered to your Escrow Agreement.</p>
                  </div>
                  <div className="max-w-xs mx-auto text-left bg-gray-50 border border-gray-150 rounded-lg p-3 space-y-2 text-xs font-mono text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✔</span>
                      <span>Signature hash received</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✔</span>
                      <span>Fund reserve block verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin text-teal-500" size={12} />
                      <span className="text-gray-400">Locking Escrow vault ledger...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE: TRANSACTION FAILED */}
              {simStep === 'failed' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle size={32} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Payment Transaction Failed</h3>
                    <p className="text-xs text-gray-500 mt-1">The secure gateway payment request was declined.</p>
                  </div>
                  
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-xs text-red-800 text-left leading-relaxed">
                    <strong>Error Details:</strong> {failedReason || 'Communication failure with remote banking node.'}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowSimModal(false);
                        setStep(2); // Go back to payment selection
                        showToast('Please select another payment option.', 'info');
                      }}
                      className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 border rounded-xl text-gray-700 text-xs font-bold transition"
                    >
                      Choose Another Method
                    </button>
                    <button
                      onClick={() => {
                        setSimStep('processing');
                        setSimSubstep(0);
                        // restart simulation
                        const timer1 = setTimeout(() => {
                          setSimSubstep(1);
                          const timer2 = setTimeout(() => {
                            setSimSubstep(2);
                            const timer3 = setTimeout(() => {
                              if (paymentMethod === 'mtn' || paymentMethod === 'airtel') {
                                setSimStep('momo_ussd');
                              } else if (paymentMethod === 'card') {
                                setSimStep('card_otp');
                              } else {
                                setSimStep('success');
                              }
                            }, 1200);
                          }, 1200);
                        }, 1000);
                      }}
                      className="flex-1 py-2.5 gradient-primary text-white rounded-xl text-xs font-bold hover:opacity-95 transition"
                    >
                      Retry Payment
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE: SECURE SUCCESS */}
              {simStep === 'success' && (
                <div className="text-center py-6 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Payment Locked in Escrow!</h3>
                    <p className="text-xs text-gray-500 mt-1">Transaction approved. Funds held safely by TradeBook.</p>
                  </div>

                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-xs text-left text-teal-800 space-y-1">
                    <p className="font-bold mb-1">🏦 Transaction Verified</p>
                    <p>Amount: <strong>{formatPrice(total)} RWF</strong></p>
                    <p>Escrow ID: <strong>{generatedOrderId}</strong></p>
                    <p>Ledger Status: <span className="font-bold text-green-700">LOCKED (PENDING DELIVERY)</span></p>
                  </div>

                  <button
                    onClick={handleConfirmOrderSuccess}
                    className="w-full py-3 gradient-primary text-white text-sm font-bold rounded-xl hover:opacity-95 transition flex items-center justify-center gap-2"
                  >
                    Complete Order Setup <Check size={16} />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
