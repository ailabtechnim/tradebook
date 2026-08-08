'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { categories } from '@/data/mockData';
import { isValidEmail, sanitizeUrl } from '@/lib/security';
import {
  Building2, Package, Video, Shield, ArrowLeft, ArrowRight, CheckCircle,
  Upload, Sparkles, Phone, Mail, MapPin, Globe, Clock, Award, FileText, Check, AlertCircle,
  User as UserIcon, KeyRound, Lock, Loader2, LogOut
} from 'lucide-react';

export default function ManufacturerOnboardingPage() {
  const router = useRouter();
  const { addManufacturer, addProduct, addStory, updateUser, showToast, user, isLoggedIn, authHydrated, login, register, logout } = useApp();
  const [step, setStep] = useState(1);

  // Phase A: Corporate account credentials (email account first)
  const [mfrAuthMode, setMfrAuthMode] = useState<'signup' | 'login'>('signup');
  const [corpAccount, setCorpAccount] = useState({
    contactName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Step 1: Manufacturer Profile State
  const [mfrInfo, setMfrInfo] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    description: '',
    longDescription: '',
    city: 'Kigali',
    location: '',
    logo: '🏭',
    established: '2026',
    employees: '10-50',
    businessRegistration: '',
    website: '',
  });

  // Step 2: Product State
  const [productInfo, setProductInfo] = useState({
    name: '',
    description: '',
    category: 'Food & Beverages',
    subcategory: '',
    wholesalePrice: '',
    suggestedRetailPrice: '',
    moq: '10',
    unit: 'piece',
    stockQuantity: '1000',
    imageUrl: '',
  });

  // Step 3: Production Video Story State
  const [storyInfo, setStoryInfo] = useState({
    title: '',
    description: '',
    videoUrl: '',
    tags: 'manufacturing, quality, rwanda',
  });

  // Emoji options for logo
  const logoOptions = ['🏭', '🥛', '🏗️', '👗', '☀️', '🌿', '🍎', '🍞', '🪵', '🎨', '👜', '👟'];

  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);

  // Validations
  const validateStep1 = () => {
    if (!mfrInfo.name.trim()) return 'Company Name is required.';
    if (!isValidEmail(mfrInfo.email)) return 'A valid Business Email is required.';
    if (!mfrInfo.phone.trim()) return 'Contact Phone is required.';
    if (!mfrInfo.description.trim()) return 'A short About Us description is required.';
    if (!mfrInfo.location.trim()) return 'Physical Location is required.';
    if (!mfrInfo.businessRegistration.trim()) return 'Business Registration Number is required.';
    if (mfrInfo.website.trim() && !sanitizeUrl(mfrInfo.website)) return 'Website must be a valid http(s) address.';
    return null;
  };

  const validateStep2 = () => {
    if (!productInfo.name.trim()) return 'Product Name is required.';
    if (!productInfo.description.trim()) return 'Product Description is required.';
    if (!productInfo.wholesalePrice || parseFloat(productInfo.wholesalePrice) <= 0) return 'Valid Wholesale Price is required.';
    if (!productInfo.suggestedRetailPrice || parseFloat(productInfo.suggestedRetailPrice) <= 0) return 'Valid Suggested Retail Price is required.';
    if (parseFloat(productInfo.wholesalePrice) >= parseFloat(productInfo.suggestedRetailPrice)) return 'Wholesale price must be lower than suggested retail price.';
    if (!productInfo.moq || parseInt(productInfo.moq) <= 0) return 'Valid Minimum Order Quantity (MOQ) is required.';
    if (productInfo.imageUrl.trim() && !sanitizeUrl(productInfo.imageUrl)) return 'Product Image must be a valid http(s) URL.';
    return null;
  };

  const validateStep3 = () => {
    if (!storyInfo.title.trim()) return 'Story/Video Title is required.';
    if (!storyInfo.description.trim()) return 'Story/Video Description is required.';
    if (!storyInfo.videoUrl.trim()) return 'A link to your production video is required.';
    if (!sanitizeUrl(storyInfo.videoUrl)) return 'Production Video must be a valid http(s) URL (e.g., your hosted .mp4 link).';
    return null;
  };

  // ── Phase A: Corporate account creation (sign-up first) ──
  const handleCorpSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!corpAccount.contactName.trim()) return showToast('Contact Person Name is required.', 'error');
    if (!isValidEmail(corpAccount.email)) return showToast('A valid Corporate Email is required.', 'error');
    if (corpAccount.password.length < 6) return showToast('Account Password must be at least 6 characters.', 'error');
    if (corpAccount.password !== corpAccount.confirmPassword) return showToast('Passwords do not match.', 'error');

    const ok = await register({
      name: corpAccount.contactName,
      email: corpAccount.email,
      type: 'manufacturer',
      avatar: '🏭',
      location: 'Kigali, Rwanda',
      password: corpAccount.password,
    });
    if (!ok) return; // register already explained why (e.g. duplicate email)

    // Pre-fill the corporate email into the business profile step
    setMfrInfo(prev => ({ ...prev, email: prev.email || corpAccount.email }));
    showToast(`Corporate account created for ${corpAccount.contactName}! Complete your catalog to go live.`, 'success');
  };

  // ── Phase A: Returning manufacturer sign-in ──
  const handleCorpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!corpAccount.email.trim()) return showToast('Please enter your corporate email.', 'error');
    if (!corpAccount.password) return showToast('Please enter your account password.', 'error');
    const ok = await login(corpAccount.email, corpAccount.password);
    if (ok) {
      setMfrInfo(prev => ({ ...prev, email: prev.email || corpAccount.email }));
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        showToast(err, 'error');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        showToast(err, 'error');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      const err = validateStep3();
      if (err) {
        showToast(err, 'error');
        return;
      }
      setStep(4);
    }
  };

  const handleCompleteOnboarding = () => {
    // Generate unique IDs
    const mfrId = `mfr-${Math.random().toString(36).substring(3, 9)}`;
    const mfrSlug = mfrInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const prodId = `prod-${Math.random().toString(36).substring(3, 9)}`;
    const prodSlug = productInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const storyId = `story-${Math.random().toString(36).substring(3, 9)}`;

    // 1. Construct Manufacturer — every field comes from the REAL
    //    registered user's input. New vendors start UNVERIFIED with zero
    //    ratings; TradeBook accreditation is earned, never fabricated.
    const newMfr = {
      id: mfrId,
      name: mfrInfo.name,
      slug: mfrSlug,
      logo: mfrInfo.logo,
      coverImage: '',
      description: mfrInfo.description,
      longDescription: mfrInfo.longDescription || mfrInfo.description,
      location: mfrInfo.location,
      city: mfrInfo.city,
      country: 'Rwanda',
      verified: false, // pending TradeBook physical verification
      premium: false,
      rating: 0,
      reviewCount: 0,
      followerCount: 0,
      productCount: 1,
      joinedDate: new Date().toISOString().split('T')[0],
      categories: [productInfo.category],
      contactPhone: mfrInfo.phone,
      contactEmail: mfrInfo.email,
      whatsapp: mfrInfo.whatsapp || mfrInfo.phone,
      website: sanitizeUrl(mfrInfo.website),
      socialLinks: {},
      businessRegistration: mfrInfo.businessRegistration,
      established: mfrInfo.established,
      employees: mfrInfo.employees,
      certifications: [],
      story: null,
      stats: {
        totalOrders: 0,
        responseTime: 'New vendor',
        fulfillmentRate: 0,
        repeatBuyers: 0,
      }
    };

    // 2. Construct Product — uses the manufacturer's OWN product photo
    //    when supplied; pending TradeBook product verification.
    const newProduct = {
      id: prodId,
      manufacturerId: mfrId,
      manufacturerName: mfrInfo.name,
      manufacturerLogo: mfrInfo.logo,
      name: productInfo.name,
      slug: prodSlug,
      description: productInfo.description,
      category: productInfo.category,
      subcategory: productInfo.subcategory || 'General',
      images: sanitizeUrl(productInfo.imageUrl) ? [sanitizeUrl(productInfo.imageUrl)] : [],
      wholesalePrice: parseFloat(productInfo.wholesalePrice),
      suggestedRetailPrice: parseFloat(productInfo.suggestedRetailPrice),
      currency: 'RWF',
      moq: parseInt(productInfo.moq),
      unit: productInfo.unit,
      tieredPricing: [
        { minQty: parseInt(productInfo.moq), maxQty: null, price: parseFloat(productInfo.wholesalePrice), label: `Wholesale Standard (${productInfo.moq}+)` }
      ],
      inStock: true,
      stockQuantity: parseInt(productInfo.stockQuantity),
      rating: 0,
      reviewCount: 0,
      orderCount: 0,
      tags: ['new', 'wholesale-direct'],
      specifications: { 'Origin': mfrInfo.city, 'Manufacturer': mfrInfo.name },
      shippingInfo: 'Direct factory shipping arranged on TradeBook platform.',
      verified: false,
      priceGuaranteeDays: 30,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    // 3. Construct Video Story — the manufacturer's OWN hosted video link
    const newStory = {
      id: storyId,
      manufacturerId: mfrId,
      manufacturerName: mfrInfo.name,
      manufacturerLogo: mfrInfo.logo,
      title: storyInfo.title,
      description: storyInfo.description,
      mediaType: 'video' as const,
      mediaUrl: sanitizeUrl(storyInfo.videoUrl),
      thumbnail: '',
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString().split('T')[0],
      tags: storyInfo.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    // 4. Update Global Context State & Local Storage
    addManufacturer(newMfr);
    addProduct(newProduct);
    addStory(newStory);

    // 5. Bind the published catalog to the authenticated corporate account.
    //    The manufacturer entity ID is stored on the user record so the
    //    dashboard can show incoming orders and catalog management tools.
    updateUser({
      phone: mfrInfo.phone || user?.phone,
      type: 'manufacturer',
      avatar: mfrInfo.logo,
      location: `${mfrInfo.city}, Rwanda`,
      manufacturerId: mfrId,
    });

    showToast(`Welcome to TradeBook, ${mfrInfo.name}! Your profile is now live.`, 'success');
    router.push(`/manufacturers/${mfrId}`);
  };

  // Wait for the persisted session to hydrate before evaluating the gate.
  if (!authHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="text-teal-600 animate-spin" />
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────
  // AUTHENTICATION-FIRST GUARD: Phase A — Corporate Account
  // Manufacturers must create (or sign in to) a corporate email account
  // before the catalog onboarding wizard unlocks.
  // ────────────────────────────────────────────────────────────────
  if (!isLoggedIn || user?.type !== 'manufacturer') {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container-app max-w-xl">
          <Link href="/" className="flex items-center gap-1.5 text-teal-600 text-sm font-semibold hover:text-teal-700 mb-6">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="gradient-primary p-8 text-white text-center">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 size={28} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-white/90 text-[11px] font-bold mb-3 uppercase tracking-wider">
                <Shield size={11} /> Step 1 of onboarding — Account first
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">Create Your Corporate Account</h1>
              <p className="text-teal-50 text-sm mt-2 max-w-md mx-auto">
                Register with your corporate email to unlock the manufacturer catalog wizard. Your products and production stories will be bound to this account.
              </p>
            </div>

            {/* Signed-in-as-wrong-role warning */}
            {isLoggedIn && user?.type !== 'manufacturer' && (
              <div className="mx-6 md:mx-8 mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800">
                  <p className="font-bold">You are signed in as a {user?.type === 'retailer' ? 'retail buyer' : 'customer'} account ({user?.email}).</p>
                  <p className="mt-1">Manufacturer onboarding requires a corporate manufacturer account. Sign out and register with your factory&apos;s corporate email.</p>
                  <button
                    onClick={logout}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition"
                  >
                    <LogOut size={12} /> Sign Out & Switch to Manufacturer
                  </button>
                </div>
              </div>
            )}

            {/* Mode tabs (only meaningful when fully anonymous) */}
            {!isLoggedIn && (
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setMfrAuthMode('signup')}
                  className={`flex-1 py-3.5 text-sm font-semibold transition ${mfrAuthMode === 'signup' ? 'text-teal-700 border-b-2 border-teal-600 bg-teal-50/50' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Create Account
                </button>
                <button
                  onClick={() => setMfrAuthMode('login')}
                  className={`flex-1 py-3.5 text-sm font-semibold transition ${mfrAuthMode === 'login' ? 'text-teal-700 border-b-2 border-teal-600 bg-teal-50/50' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Sign-up form */}
            {mfrAuthMode === 'signup' && (
              <form onSubmit={handleCorpSignup} className="p-6 md:p-8 space-y-4">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Contact Person Name (e.g., Aline Uwase)"
                    value={corpAccount.contactName}
                    onChange={(e) => setCorpAccount({ ...corpAccount, contactName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Corporate Email (e.g., sales@nyabihutea.rw)"
                    value={corpAccount.email}
                    onChange={(e) => setCorpAccount({ ...corpAccount, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="Account Password"
                    value={corpAccount.password}
                    onChange={(e) => setCorpAccount({ ...corpAccount, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="Confirm Account Password"
                    value={corpAccount.confirmPassword}
                    onChange={(e) => setCorpAccount({ ...corpAccount, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <button type="submit" className="w-full py-3.5 gradient-primary text-white font-bold rounded-xl hover:opacity-95 transition flex items-center justify-center gap-2 shadow-sm">
                  Create Account & Continue <ArrowRight size={16} />
                </button>

                <div className="flex items-center gap-2 justify-center text-[11px] text-gray-400 pt-1">
                  <Shield size={12} className="text-teal-500" />
                  <span>Your catalog, escrow payouts, and production stories will link to this account.</span>
                </div>
              </form>
            )}

            {/* Sign-in form */}
            {mfrAuthMode === 'login' && (
              <form onSubmit={handleCorpLogin} className="p-6 md:p-8 space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Corporate Email"
                    value={corpAccount.email}
                    onChange={(e) => setCorpAccount({ ...corpAccount, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="Account Password"
                    value={corpAccount.password}
                    onChange={(e) => setCorpAccount({ ...corpAccount, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <button type="submit" className="w-full py-3.5 gradient-primary text-white font-bold rounded-xl hover:opacity-95 transition flex items-center justify-center gap-2 shadow-sm">
                  <UserIcon size={16} /> Sign In & Resume Onboarding
                </button>

                <p className="text-center text-xs text-gray-500">
                  First time on TradeBook?{' '}
                  <button type="button" onClick={() => setMfrAuthMode('signup')} className="text-teal-600 font-semibold hover:underline">
                    Create a corporate account
                  </button>
                </p>
              </form>
            )}

            {/* Upcoming steps preview */}
            <div className="px-6 md:px-8 pb-8">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Unlocks after your account is created</p>
                <div className="space-y-2.5">
                  {[
                    { icon: <Building2 size={13} />, label: 'WhatsApp business number, RDB registration & factory profile' },
                    { icon: <Package size={13} />, label: 'Publish your first wholesale catalog product' },
                    { icon: <Video size={13} />, label: 'Post a production video story for retail buyers' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-gray-500">
                      <div className="w-6 h-6 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                        {s.icon}
                      </div>
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phase B: authenticated manufacturer — corporate catalog wizard.
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container-app max-w-3xl">
        <Link href="/" className="flex items-center gap-1.5 text-teal-600 text-sm font-semibold hover:text-teal-700 mb-6">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Introduction */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full text-teal-700 text-xs font-bold mb-3">
            <Sparkles size={14} /> Registered Vendor Program
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Expand Your Wholesale Footprint</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Publish your wholesale catalog, showcase production videos directly to retailers, and secure 100% of your payments via TradeBook Escrow.
          </p>
        </div>

        {/* Authenticated corporate account banner */}
        <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 mb-6 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5 text-xs text-teal-800 min-w-0">
            <CheckCircle size={16} className="text-teal-600 shrink-0" />
            <span className="truncate">
              Signed in as <strong>{user?.name}</strong> ({user?.email}) — your catalog will publish under this account.
            </span>
          </div>
          <button
            onClick={logout}
            className="shrink-0 text-[11px] font-bold text-gray-400 hover:text-red-500 transition flex items-center gap-1"
            title="Sign out of this corporate account"
          >
            <LogOut size={12} /> Switch account
          </button>
        </div>

        {/* Wizard Progress Steps */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6 flex justify-between items-center overflow-x-auto gap-4">
          {[
            { num: 0, label: 'Account', icon: <Shield size={16} /> },
            { num: 1, label: 'Profile details', icon: <Building2 size={16} /> },
            { num: 2, label: 'First product', icon: <Package size={16} /> },
            { num: 3, label: 'Production story', icon: <Video size={16} /> },
            { num: 4, label: 'Go Live', icon: <CheckCircle size={16} /> },
          ].map(s => (
            <div key={s.num} className="flex items-center gap-2 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${step >= s.num ? 'gradient-primary border-teal-600 text-white shadow-sm' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                {step > s.num ? <Check size={12} /> : s.num}
              </div>
              <div className="text-left hidden sm:block">
                <p className={`text-xs font-bold leading-none ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* STAGES CONTAINER */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">

          {/* STEP 1: COMPANY PROFILE */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                  <Building2 className="text-teal-600" size={20} /> 1. Business Profile Information
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Define your manufacturing brand and contact coordinates for retail buyers.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Manufacturer / Factory Name</label>
                  <input
                    type="text"
                    value={mfrInfo.name}
                    onChange={(e) => setMfrInfo({ ...mfrInfo, name: e.target.value })}
                    placeholder="e.g. Nyabihu Tea Packers Ltd"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Business Email Address</label>
                  <input
                    type="email"
                    value={mfrInfo.email}
                    onChange={(e) => setMfrInfo({ ...mfrInfo, email: e.target.value })}
                    placeholder="wholesale@nyabihutea.rw"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sales Phone Number</label>
                  <input
                    type="tel"
                    value={mfrInfo.phone}
                    onChange={(e) => setMfrInfo({ ...mfrInfo, phone: e.target.value })}
                    placeholder="+250 788 000 000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">WhatsApp Contact Number</label>
                  <input
                    type="tel"
                    value={mfrInfo.whatsapp}
                    onChange={(e) => setMfrInfo({ ...mfrInfo, whatsapp: e.target.value })}
                    placeholder="+250 788 000 000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Business Registration Number (RDB)</label>
                  <input
                    type="text"
                    value={mfrInfo.businessRegistration}
                    onChange={(e) => setMfrInfo({ ...mfrInfo, businessRegistration: e.target.value })}
                    placeholder="RW-BIZ-2026-10294"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Choose Factory Profile Icon/Logo</label>
                  <div className="flex flex-wrap gap-2.5">
                    {logoOptions.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setMfrInfo({ ...mfrInfo, logo: emoji })}
                        className={`w-11 h-11 text-2xl border-2 rounded-xl flex items-center justify-center transition-all ${mfrInfo.logo === emoji ? 'border-teal-500 bg-teal-50 scale-110 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Short Description / Tagline (About Us)</label>
                  <input
                    type="text"
                    value={mfrInfo.description}
                    onChange={(e) => setMfrInfo({ ...mfrInfo, description: e.target.value })}
                    placeholder="e.g. Rwandan organic tea growers and packagers direct from highlands."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Corporate Story (Optional)</label>
                  <textarea
                    rows={4}
                    value={mfrInfo.longDescription}
                    onChange={(e) => setMfrInfo({ ...mfrInfo, longDescription: e.target.value })}
                    placeholder="Provide a long description about your farm collection processes, sorting standards, or worker welfare values..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Factory City Location</label>
                  <select
                    value={mfrInfo.city}
                    onChange={(e) => setMfrInfo({ ...mfrInfo, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Kigali">Kigali</option>
                    <option value="Musanze">Musanze</option>
                    <option value="Rubavu">Rubavu</option>
                    <option value="Huye">Huye</option>
                    <option value="Rwamagana">Rwamagana</option>
                    <option value="Rusizi">Rusizi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Physical Factory Address</label>
                  <input
                    type="text"
                    value={mfrInfo.location}
                    onChange={(e) => setMfrInfo({ ...mfrInfo, location: e.target.value })}
                    placeholder="e.g. Nyabihu District, Road G4"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Company Website (Optional)</label>
                  <input
                    type="url"
                    value={mfrInfo.website}
                    onChange={(e) => setMfrInfo({ ...mfrInfo, website: e.target.value })}
                    placeholder="https://your-company.rw"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-95 transition flex items-center gap-1.5 shadow-sm"
                >
                  Continue to Add Product <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ADD PRODUCT */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                  <Package className="text-teal-600" size={20} /> 2. Add First Wholesale Product
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">First impressions count! Launch your factory list with a best-selling item.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product / Wholesale Item Name</label>
                  <input
                    type="text"
                    value={productInfo.name}
                    onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
                    placeholder="e.g. Premium Highland Green Tea (250g)"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product Description & Wholesale Specifications</label>
                  <textarea
                    rows={3}
                    value={productInfo.description}
                    onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value })}
                    placeholder="Describe the product quality, packing quantities, shelf life, or ingredients..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Wholesale Category</label>
                  <select
                    value={productInfo.category}
                    onChange={(e) => setProductInfo({ ...productInfo, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subcategory / Tag</label>
                  <input
                    type="text"
                    value={productInfo.subcategory}
                    onChange={(e) => setProductInfo({ ...productInfo, subcategory: e.target.value })}
                    placeholder="e.g. Black Tea, Processed Foods"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Wholesale Price (RWF)</label>
                  <input
                    type="number"
                    value={productInfo.wholesalePrice}
                    onChange={(e) => setProductInfo({ ...productInfo, wholesalePrice: e.target.value })}
                    placeholder="1200"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Suggested Retail Price (RWF)</label>
                  <input
                    type="number"
                    value={productInfo.suggestedRetailPrice}
                    onChange={(e) => setProductInfo({ ...productInfo, suggestedRetailPrice: e.target.value })}
                    placeholder="2000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Minimum Order Quantity (MOQ)</label>
                  <input
                    type="number"
                    value={productInfo.moq}
                    onChange={(e) => setProductInfo({ ...productInfo, moq: e.target.value })}
                    placeholder="50"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Pricing Unit</label>
                  <select
                    value={productInfo.unit}
                    onChange={(e) => setProductInfo({ ...productInfo, unit: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="piece">piece / item</option>
                    <option value="bottle">bottle</option>
                    <option value="bag">bag / sack</option>
                    <option value="packet">packet / pack</option>
                    <option value="kg">kilogram (kg)</option>
                    <option value="litre">liter (L)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product Photo URL (Optional)</label>
                  <input
                    type="url"
                    value={productInfo.imageUrl}
                    onChange={(e) => setProductInfo({ ...productInfo, imageUrl: e.target.value })}
                    placeholder="https://your-domain.rw/product-photo.jpg"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Link to a photo of YOUR actual product (hosted on your website or cloud drive). Only http(s) links are accepted. If left empty, a neutral placeholder icon is shown.</p>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-95 transition flex items-center gap-1.5 shadow-sm"
                >
                  Continue to Video Story <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PRODUCTION VIDEO STORY */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                  <Video className="text-teal-600" size={20} /> 3. Add Production Video Story
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Stories build authentic retail trust. Share a short video snippet showing your factory assembly line, packaging quality, or farm harvest.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Story Video Title</label>
                  <input
                    type="text"
                    value={storyInfo.title}
                    onChange={(e) => setStoryInfo({ ...storyInfo, title: e.target.value })}
                    placeholder="e.g. Inside Our Organic Tea Processing Assembly Line"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Story / Video Description</label>
                  <textarea
                    rows={3}
                    value={storyInfo.description}
                    onChange={(e) => setStoryInfo({ ...storyInfo, description: e.target.value })}
                    placeholder="Explain what retailers are looking at (e.g., how the raw tea is handpicked and sorted in the Northern Province under hygienic ISO standards)..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Story tags (comma-separated)</label>
                  <input
                    type="text"
                    value={storyInfo.tags}
                    onChange={(e) => setStoryInfo({ ...storyInfo, tags: e.target.value })}
                    placeholder="harvesting, tea, organic, processing"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Production Video URL</label>
                  <input
                    type="url"
                    value={storyInfo.videoUrl}
                    onChange={(e) => setStoryInfo({ ...storyInfo, videoUrl: e.target.value })}
                    placeholder="https://your-domain.rw/factory-tour.mp4"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    ℹ️ Link to YOUR OWN production video (hosted .mp4/.webm URL). This is shown to retailers on your profile and proves your factory is real. Only http(s) links are accepted.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-95 transition flex items-center gap-1.5 shadow-sm"
                >
                  Preview Registration <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PREVIEW & CONFIRM */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                  <CheckCircle className="text-teal-600" size={20} /> 4. Confirm and Publish Profile
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Please review your wholesale profile details before launching onto TradeBook.</p>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                
                {/* Summary Section 1 */}
                <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/50 space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Building2 size={13} className="text-teal-600" /> Company Profile
                  </h3>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border text-2xl">{mfrInfo.logo}</div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">{mfrInfo.name}</p>
                      <p className="text-xs text-gray-500">{mfrInfo.city}, Rwanda • Established {mfrInfo.established} • RDB Registration {mfrInfo.businessRegistration}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic border-t border-gray-100 pt-2">{mfrInfo.description}</p>
                </div>

                {/* Summary Section 2 */}
                <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/50 space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Package size={13} className="text-teal-600" /> First Wholesale Product
                  </h3>
                  <p className="font-bold text-gray-900">{productInfo.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{productInfo.description}</p>
                  <div className="flex gap-4 text-xs pt-1.5 border-t border-gray-100">
                    <div>
                      <span className="text-gray-400 block font-semibold text-[10px] uppercase">Wholesale Price</span>
                      <strong className="text-teal-700 text-sm">{formatPrice(parseFloat(productInfo.wholesalePrice))} RWF</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-semibold text-[10px] uppercase">Suggested Retail</span>
                      <strong className="text-gray-900 text-sm">{formatPrice(parseFloat(productInfo.suggestedRetailPrice))} RWF</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-semibold text-[10px] uppercase">Min Order (MOQ)</span>
                      <strong className="text-gray-900 text-sm">{productInfo.moq} {productInfo.unit}s</strong>
                    </div>
                  </div>
                </div>

                {/* Summary Section 3 */}
                <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/50 space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Video size={13} className="text-teal-600" /> Production Story Video
                  </h3>
                  <p className="font-bold text-gray-900">{storyInfo.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{storyInfo.description}</p>
                </div>

              </div>

              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                <div className="flex gap-2.5">
                  <Shield size={18} className="text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-teal-900">TradeBook Verification Process</p>
                    <p className="text-[11px] text-teal-700 leading-normal mt-0.5">
                      Your profile goes live immediately as <strong>Pending Verification</strong>. A TradeBook agent will physically review your RDB registration and factory site — the <strong>Verified</strong> badge is awarded only after that review, protecting retailer trust.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleCompleteOnboarding}
                  className="flex-1 py-3 gradient-primary text-white text-sm font-bold rounded-xl hover:opacity-95 transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Register & Go Live on TradeBook <Check size={16} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
