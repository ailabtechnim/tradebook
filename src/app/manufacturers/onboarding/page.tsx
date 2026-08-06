'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { categories } from '@/data/mockData';
import {
  Building2, Package, Video, Shield, ArrowLeft, ArrowRight, CheckCircle,
  Upload, Sparkles, Phone, Mail, MapPin, Globe, Clock, Award, FileText, Check, AlertCircle
} from 'lucide-react';

export default function ManufacturerOnboardingPage() {
  const router = useRouter();
  const { addManufacturer, addProduct, addStory, setUser, showToast } = useApp();
  const [step, setStep] = useState(1);

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
  });

  // Step 3: Production Video Story State
  const [storyInfo, setStoryInfo] = useState({
    title: '',
    description: '',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-factory-worker-checking-metal-production-41133-large.mp4',
    tags: 'manufacturing, quality, rwanda',
  });

  // Emoji options for logo
  const logoOptions = ['🏭', '🥛', '🏗️', '👗', '☀️', '🌿', '🍎', '🍞', '🪵', '🎨', '👜', '👟'];

  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);

  // Validations
  const validateStep1 = () => {
    if (!mfrInfo.name.trim()) return 'Company Name is required.';
    if (!mfrInfo.email.trim()) return 'Business Email is required.';
    if (!mfrInfo.phone.trim()) return 'Contact Phone is required.';
    if (!mfrInfo.description.trim()) return 'A short About Us description is required.';
    if (!mfrInfo.location.trim()) return 'Physical Location is required.';
    if (!mfrInfo.businessRegistration.trim()) return 'Business Registration Number is required.';
    return null;
  };

  const validateStep2 = () => {
    if (!productInfo.name.trim()) return 'Product Name is required.';
    if (!productInfo.description.trim()) return 'Product Description is required.';
    if (!productInfo.wholesalePrice || parseFloat(productInfo.wholesalePrice) <= 0) return 'Valid Wholesale Price is required.';
    if (!productInfo.suggestedRetailPrice || parseFloat(productInfo.suggestedRetailPrice) <= 0) return 'Valid Suggested Retail Price is required.';
    if (parseFloat(productInfo.wholesalePrice) >= parseFloat(productInfo.suggestedRetailPrice)) return 'Wholesale price must be lower than suggested retail price.';
    if (!productInfo.moq || parseInt(productInfo.moq) <= 0) return 'Valid Minimum Order Quantity (MOQ) is required.';
    return null;
  };

  const validateStep3 = () => {
    if (!storyInfo.title.trim()) return 'Story/Video Title is required.';
    if (!storyInfo.description.trim()) return 'Story/Video Description is required.';
    return null;
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

    // 1. Construct Manufacturer
    const newMfr = {
      id: mfrId,
      name: mfrInfo.name,
      slug: mfrSlug,
      logo: mfrInfo.logo,
      coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      description: mfrInfo.description,
      longDescription: mfrInfo.longDescription || mfrInfo.description,
      location: mfrInfo.location,
      city: mfrInfo.city,
      country: 'Rwanda',
      verified: true, // Auto-verified for sandbox demo
      premium: false,
      rating: 5.0,
      reviewCount: 0,
      followerCount: 0,
      productCount: 1,
      joinedDate: new Date().toISOString().split('T')[0],
      categories: [productInfo.category],
      contactPhone: mfrInfo.phone,
      contactEmail: mfrInfo.email,
      whatsapp: mfrInfo.whatsapp || mfrInfo.phone,
      website: mfrInfo.website || 'www.' + mfrSlug + '.rw',
      socialLinks: {},
      businessRegistration: mfrInfo.businessRegistration,
      established: mfrInfo.established,
      employees: mfrInfo.employees,
      certifications: ['Made in Rwanda', 'Verified Supplier'],
      story: null,
      stats: {
        totalOrders: 0,
        responseTime: '< 1 hour',
        fulfillmentRate: 100,
        repeatBuyers: 0,
      }
    };

    // 2. Construct Product
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
      images: ['https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400'],
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
      rating: 5.0,
      reviewCount: 0,
      orderCount: 0,
      tags: ['new', 'wholesale-direct'],
      specifications: { 'Origin': mfrInfo.city, 'Manufacturer': mfrInfo.name },
      shippingInfo: 'Direct factory shipping arranged on TradeBook platform.',
      verified: true,
      priceGuaranteeDays: 30,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    // 3. Construct Video Story
    const newStory = {
      id: storyId,
      manufacturerId: mfrId,
      manufacturerName: mfrInfo.name,
      manufacturerLogo: mfrInfo.logo,
      title: storyInfo.title,
      description: storyInfo.description,
      mediaType: 'video' as const,
      mediaUrl: storyInfo.videoUrl,
      thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString().split('T')[0],
      tags: storyInfo.tags.split(',').map(t => t.trim()),
    };

    // 4. Update Global Context State & Local Storage
    addManufacturer(newMfr);
    addProduct(newProduct);
    addStory(newStory);

    // 5. Log the newly registered manufacturer in as user session
    const mfrUser = {
      id: mfrId,
      name: mfrInfo.name,
      email: mfrInfo.email,
      phone: mfrInfo.phone,
      type: 'manufacturer' as const,
      avatar: mfrInfo.logo,
      location: `${mfrInfo.city}, Rwanda`,
      followedManufacturers: [],
      orders: [],
      cart: [],
      joinedDate: new Date().toISOString().split('T')[0],
      verified: true,
    };
    setUser(mfrUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tradebook-user', JSON.stringify(mfrUser));
    }

    showToast(`Welcome to TradeBook, ${mfrInfo.name}! Your profile is now live.`, 'success');
    router.push(`/manufacturers/${mfrId}`);
  };

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

        {/* Wizard Progress Steps */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6 flex justify-between items-center overflow-x-auto gap-4">
          {[
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
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Product Media (Image Mockup)</label>
                  <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-6 text-center select-none flex flex-col items-center justify-center">
                    <Package className="text-teal-600/40 mb-2" size={32} />
                    <span className="text-xs font-bold text-gray-700">Autoloaded Stock Product Asset</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">A placeholder Made-In-Rwanda wholesale product cover image will be generated for your catalogue.</span>
                  </div>
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
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Production Video Link</label>
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between items-center bg-white p-2 border rounded-lg">
                      <span className="font-mono font-semibold truncate max-w-[200px]">{storyInfo.videoUrl}</span>
                      <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-[10px]">DEMO VIDEO LOADED</span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      ℹ️ For this demo sandbox, we pre-loaded a beautiful sample factory assembly loop video to show on your live profile.
                    </p>
                  </div>
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
                    <p className="text-xs font-bold text-teal-900">TradeBook Verified Badging</p>
                    <p className="text-[11px] text-teal-700 leading-normal mt-0.5">
                      Your factory profile will automatically receive a <strong>Verified</strong> badge for being compliant with corporate and RDB business registries.
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
