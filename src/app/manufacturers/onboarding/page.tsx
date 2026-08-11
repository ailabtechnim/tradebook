'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { categories } from '@/data/mockData';
import {
  Building2, Package, Video, Shield, ArrowLeft, ArrowRight, CheckCircle,
  Upload, Sparkles, Phone, Mail, MapPin, Globe, Clock, Award, FileText, Check, AlertCircle,
  Lock, Eye, EyeOff, FileSpreadsheet, Image as ImageIcon, Loader2, X, Plus, Trash2, Tag, Store
} from 'lucide-react';

// --- Simulated Kigali Kicks extracted products ---
const KIGALI_KICKS_PRODUCTS = [
  {
    name: 'Classic Heritage Sneaker',
    description: 'Premium handcrafted leather sneaker blending timeless Rwandan heritage motifs with modern comfort technology. Full-grain leather upper, cushioned ortholite insole, durable vulcanized rubber outsole.',
    category: 'Textiles & Clothing',
    subcategory: 'Footwear',
    wholesalePrice: 25000,
    suggestedRetailPrice: 45000,
    moq: 12,
    unit: 'pair',
    stockQuantity: 500,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    mediaUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
    tags: ['heritage', 'leather', 'premium'],
  },
  {
    name: 'Urban Street Runner',
    description: 'Lightweight breathable mesh runner engineered for Kigali\'s urban streets. Adaptive FlowFoam cushioning, reflective details, urban camouflage accent, engineered knit.',
    category: 'Textiles & Clothing',
    subcategory: 'Footwear',
    wholesalePrice: 18000,
    suggestedRetailPrice: 32000,
    moq: 20,
    unit: 'pair',
    stockQuantity: 800,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
    mediaUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
    tags: ['runner', 'mesh', 'urban'],
  },
  {
    name: 'Eco Slip-On Canvas',
    description: 'Sustainable eco-friendly slip-on crafted from organic canvas and recycled rubber. Minimalist design, ultra-comfort stretch collar, perfect for everyday wear.',
    category: 'Textiles & Clothing',
    subcategory: 'Footwear',
    wholesalePrice: 15000,
    suggestedRetailPrice: 28000,
    moq: 24,
    unit: 'pair',
    stockQuantity: 1200,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
    mediaUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800',
    tags: ['eco', 'canvas', 'sustainable'],
  },
];

export default function ManufacturerOnboardingPage() {
  const router = useRouter();
  const { addManufacturer, addProduct, addStory, user, setUser, showToast } = useApp();
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1: Corporate Account State
  const [corporateAccount, setCorporateAccount] = useState({
    companyName: '',
    email: '',
    password: '',
  });
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  const [isMfrAuthenticated, setIsMfrAuthenticated] = useState(false);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tradebook-user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.type === 'manufacturer' && !!parsed?.email) {
            setIsMfrAuthenticated(true);
            return;
          }
        }
      } catch {}
    }
    // fallback check on global user
    if (user?.type === 'manufacturer') setIsMfrAuthenticated(true);
  }, [user]);
  // keep in sync with global user
  React.useEffect(() => {
    if (user?.type === 'manufacturer') {
      setIsMfrAuthenticated(true);
      if (user?.name && !corporateAccount.companyName) {
        setCorporateAccount(prev => ({ ...prev, companyName: user.name, email: user.email }));
      }
    }
  }, [user]);

  // Step 2: Manufacturer Profile State
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
    tags: 'footwear, handmade, rwanda',
  });

  // Keep mfrInfo.name in sync with corporateAccount.companyName when auth happens
  React.useEffect(() => {
    if (corporateAccount.companyName && !mfrInfo.name) {
      setMfrInfo(prev => ({ ...prev, name: corporateAccount.companyName, email: corporateAccount.email }));
    }
  }, [corporateAccount.companyName, corporateAccount.email]);

  // Step 3: Product State
  const [productMode, setProductMode] = useState<'manual' | 'bulk'>('manual');
  const [productInfo, setProductInfo] = useState({
    name: '',
    description: '',
    category: 'Textiles & Clothing',
    subcategory: 'Footwear',
    wholesalePrice: '',
    suggestedRetailPrice: '',
    moq: '12',
    unit: 'pair',
    stockQuantity: '500',
  });

  // Bulk upload states
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [parsingLogs, setParsingLogs] = useState<string[]>([]);
  const [parsedProducts, setParsedProducts] = useState<typeof KIGALI_KICKS_PRODUCTS>([]);
  const [showBulkPreview, setShowBulkPreview] = useState(false);

  // Step 4: Production Video Story State
  const [storyInfo, setStoryInfo] = useState({
    title: '',
    description: '',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-factory-worker-checking-metal-production-41133-large.mp4',
    tags: 'manufacturing, quality, rwanda',
  });

  // Emoji options for logo
  const logoOptions = ['🏭', '🥛', '🏗️', '👗', '☀️', '🌿', '🍎', '🍞', '🪵', '🎨', '👜', '👟'];

  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);

  // --- Step 1 Auth Handler ---
  const handleCorporateAuth = () => {
    if (!corporateAccount.companyName.trim()) {
      showToast('Company Name is required for corporate account.', 'error');
      return;
    }
    if (!corporateAccount.email.trim() || !corporateAccount.email.includes('@')) {
      showToast('Valid corporate email is required.', 'error');
      return;
    }
    if (!corporateAccount.password || corporateAccount.password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    // Simulate creation/login: create manufacturer type user in global context
    const tempUser = {
      id: `mfr-temp-${Math.random().toString(36).substring(3, 7)}`,
      name: corporateAccount.companyName,
      email: corporateAccount.email,
      phone: mfrInfo.phone || '+250 788 000 000',
      type: 'manufacturer' as const,
      avatar: mfrInfo.logo,
      location: `${mfrInfo.city}, Rwanda`,
      followedManufacturers: [],
      orders: [],
      cart: [],
      joinedDate: new Date().toISOString().split('T')[0],
      verified: true,
    };
    setUser(tempUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tradebook-user', JSON.stringify(tempUser));
    }
    setIsMfrAuthenticated(true);
    // Also update mfrInfo to reflect corporate account
    setMfrInfo(prev => ({ ...prev, name: corporateAccount.companyName, email: corporateAccount.email }));
    showToast(`Welcome, ${corporateAccount.companyName}! Corporate account verified.`, 'success');
    setStep(2);
  };

  // Validations
  const validateStep2 = () => {
    if (!mfrInfo.name.trim()) return 'Company Name is required.';
    if (!mfrInfo.email.trim()) return 'Business Email is required.';
    if (!mfrInfo.phone.trim()) return 'Contact Phone is required.';
    if (!mfrInfo.description.trim()) return 'A short About Us description is required.';
    if (!mfrInfo.location.trim()) return 'Physical Location is required.';
    if (!mfrInfo.businessRegistration.trim()) return 'Business Registration Number is required.';
    return null;
  };

  const validateStep3Manual = () => {
    if (!productInfo.name.trim()) return 'Product Name is required.';
    if (!productInfo.description.trim()) return 'Product Description is required.';
    if (!productInfo.wholesalePrice || parseFloat(productInfo.wholesalePrice) <= 0) return 'Valid Wholesale Price is required.';
    if (!productInfo.suggestedRetailPrice || parseFloat(productInfo.suggestedRetailPrice) <= 0) return 'Valid Suggested Retail Price is required.';
    if (parseFloat(productInfo.wholesalePrice) >= parseFloat(productInfo.suggestedRetailPrice)) return 'Wholesale price must be lower than suggested retail price.';
    if (!productInfo.moq || parseInt(productInfo.moq) <= 0) return 'Valid Minimum Order Quantity (MOQ) is required.';
    return null;
  };

  const validateStep4 = () => {
    if (!storyInfo.title.trim()) return 'Story/Video Title is required.';
    if (!storyInfo.description.trim()) return 'Story/Video Description is required.';
    return null;
  };

  const handleNextStep = () => {
    if (step === 1) {
      // already handled via handleCorporateAuth, but also guard
      if (!isMfrAuthenticated) {
        showToast('Please create your corporate account first.', 'error');
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
      if (productMode === 'manual') {
        const err = validateStep3Manual();
        if (err) {
          showToast(err, 'error');
          return;
        }
      } else {
        if (parsedProducts.length === 0) {
          showToast('Please upload and parse your catalogue document first. Click "Simulate \'Kigali Kicks.pdf\' Upload".', 'error');
          return;
        }
      }
      setStep(4);
    } else if (step === 4) {
      const err = validateStep4();
      if (err) {
        showToast(err, 'error');
        return;
      }
      setStep(5);
    }
  };

  // --- Bulk Parsing Simulation ---
  const startParsingSimulation = (fileName: string) => {
    setIsParsing(true);
    setParsingProgress(0);
    setParsingLogs([]);
    setParsedProducts([]);
    setShowBulkPreview(false);
    setSelectedFileName(fileName);

    const logsTimeline: { at: number; msg: string }[] = [
      { at: 5, msg: `Opening '${fileName}' catalog document...` },
      { at: 25, msg: `Analyzing layout grids & table boundaries (Rwandan PDF Reader Engine)...` },
      { at: 55, msg: `Extracted headers: Product Name, Description, Category, Wholesale Price, Suggested Retail Price, MOQ, Stock, Media URL` },
      { at: 80, msg: `Validating extracted rows and verifying photo assets...` },
      { at: 100, msg: `Successfully parsed 3 products — validated and ready for listing!` },
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 7; // 7-15 increment
      if (progress >= 100) progress = 100;
      setParsingProgress(progress);

      // push logs that are at or below current progress
      const newLogs = logsTimeline.filter(l => l.at <= progress).map(l => l.msg);
      setParsingLogs(newLogs);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsParsing(false);
          setParsedProducts(KIGALI_KICKS_PRODUCTS);
          setShowBulkPreview(true);
          showToast('3 products extracted from Kigali Kicks.pdf and ready to publish!', 'success');
        }, 400);
      }
    }, 280);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validExt = ['.pdf', '.xls', '.xlsx', '.csv'];
    const lower = file.name.toLowerCase();
    if (!validExt.some(ext => lower.endsWith(ext))) {
      showToast('Unsupported file type. Please upload .pdf, .xls, .xlsx, or .csv', 'error');
      return;
    }
    startParsingSimulation(file.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const validExt = ['.pdf', '.xls', '.xlsx', '.csv'];
    const lower = file.name.toLowerCase();
    if (!validExt.some(ext => lower.endsWith(ext))) {
      showToast('Unsupported file type. Please upload .pdf, .xls, .xlsx, or .csv', 'error');
      return;
    }
    startParsingSimulation(file.name);
  };

  const triggerSimulateKigali = () => {
    startParsingSimulation('Kigali Kicks.pdf');
  };

  const removeParsedProduct = (idx: number) => {
    setParsedProducts(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCompleteOnboarding = () => {
    // Generate unique IDs
    const mfrId = `mfr-${Math.random().toString(36).substring(3, 9)}`;
    const mfrSlug = mfrInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const storyId = `story-${Math.random().toString(36).substring(3, 9)}`;

    const effectiveCategory = productMode === 'bulk' ? KIGALI_KICKS_PRODUCTS[0].category : productInfo.category;
    const productCount = productMode === 'bulk' ? parsedProducts.length : 1;

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
      verified: true,
      premium: false,
      rating: 5.0,
      reviewCount: 0,
      followerCount: 0,
      productCount: productCount,
      joinedDate: new Date().toISOString().split('T')[0],
      categories: [effectiveCategory],
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

    // 2. Construct Products (bulk or manual)
    if (productMode === 'bulk' && parsedProducts.length > 0) {
      parsedProducts.forEach((p, idx) => {
        const prodId = `prod-${Math.random().toString(36).substring(3, 9)}-${idx}`;
        const prodSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newProduct = {
          id: prodId,
          manufacturerId: mfrId,
          manufacturerName: mfrInfo.name,
          manufacturerLogo: mfrInfo.logo,
          name: p.name,
          slug: prodSlug,
          description: p.description,
          category: p.category,
          subcategory: p.subcategory,
          images: [p.image],
          wholesalePrice: p.wholesalePrice,
          suggestedRetailPrice: p.suggestedRetailPrice,
          currency: 'RWF',
          moq: p.moq,
          unit: p.unit,
          tieredPricing: [
            { minQty: p.moq, maxQty: null, price: p.wholesalePrice, label: `Wholesale Standard (${p.moq}+)` }
          ],
          inStock: true,
          stockQuantity: p.stockQuantity,
          rating: 5.0,
          reviewCount: 0,
          orderCount: 0,
          tags: p.tags,
          specifications: { 'Origin': mfrInfo.city, 'Manufacturer': mfrInfo.name, 'Media': p.mediaUrl },
          shippingInfo: 'Direct factory shipping arranged on TradeBook platform.',
          verified: true,
          priceGuaranteeDays: 30,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
        addProduct(newProduct);
      });
    } else {
      const prodId = `prod-${Math.random().toString(36).substring(3, 9)}`;
      const prodSlug = productInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
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
      addProduct(newProduct);
    }

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
    addStory(newStory);

    // 5. Log the newly registered manufacturer in as user session (override temp)
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

    showToast(`Welcome to TradeBook, ${mfrInfo.name}! Your profile with ${productCount} products is now live.`, 'success');
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
            { num: 1, label: 'Corporate Account', icon: <Lock size={16} /> },
            { num: 2, label: 'Profile details', icon: <Building2 size={16} /> },
            { num: 3, label: 'Product catalogue', icon: <Package size={16} /> },
            { num: 4, label: 'Production story', icon: <Video size={16} /> },
            { num: 5, label: 'Go Live', icon: <CheckCircle size={16} /> },
          ].map(s => (
            <div key={s.num} className="flex items-center gap-2 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${step >= s.num ? 'gradient-primary border-teal-600 text-white shadow-sm' : step === s.num ? 'bg-teal-50 border-teal-200 text-teal-600' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
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

          {/* STEP 1: CORPORATE ACCOUNT */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                  <Lock className="text-teal-600" size={20} /> 1. Corporate Account Access
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Manufacturers must first sign up or log in with their corporate credentials. This secures your factory identity.</p>
              </div>

              {isMfrAuthenticated && user?.type === 'manufacturer' ? (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm shrink-0">{user.avatar || '🏭'}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-teal-900">Authenticated as {user.name}</p>
                    <p className="text-xs text-teal-700 mt-0.5">{user.email} • Corporate Manufacturer Account</p>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => setStep(2)} className="px-4 py-2 gradient-primary text-white text-xs font-bold rounded-lg flex items-center gap-1.5">Continue to Profile <ArrowRight size={14} /></button>
                      <button onClick={() => { setIsMfrAuthenticated(false); setUser(null); if (typeof window!=='undefined') localStorage.removeItem('tradebook-user'); }} className="px-4 py-2 bg-white border border-teal-200 text-teal-700 text-xs font-semibold rounded-lg">Switch Account</button>
                    </div>
                  </div>
                  <CheckCircle className="text-teal-600" size={20} />
                </div>
              ) : (
                <>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                    <Shield size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">Authentication Required</p>
                      <p className="text-[11px] text-amber-700 leading-normal mt-0.5">To protect retail buyers, every manufacturer must verify a corporate email and password before listing products. This unlocks Step 2.</p>
                    </div>
                  </div>

                  <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
                    <button onClick={() => setAuthMode('register')} className={`px-5 py-2 text-xs font-bold rounded-lg transition ${authMode==='register' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Create Corporate Account</button>
                    <button onClick={() => setAuthMode('login')} className={`px-5 py-2 text-xs font-bold rounded-lg transition ${authMode==='login' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Log In</button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Manufacturer / Factory Name</label>
                      <input
                        type="text"
                        value={corporateAccount.companyName}
                        onChange={(e) => setCorporateAccount({ ...corporateAccount, companyName: e.target.value })}
                        placeholder="e.g. Kigali Kicks Ltd"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Corporate Email Address</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={corporateAccount.email}
                          onChange={(e) => setCorporateAccount({ ...corporateAccount, email: e.target.value })}
                          placeholder="sales@kigalikicks.rw"
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Corporate Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={corporateAccount.password}
                          onChange={(e) => setCorporateAccount({ ...corporateAccount, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">Use at least 6 characters. E.g. for demo use `sales@kigalikicks.rw` / `Kicks2026`</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleCorporateAuth}
                      className="px-6 py-3 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-95 transition flex items-center gap-1.5 shadow-sm"
                    >
                      {authMode === 'register' ? 'Create Account & Unlock Profile' : 'Log In & Continue'} <ArrowRight size={15} />
                    </button>
                  </div>
                  <p className="text-center text-[11px] text-gray-400">
                    By continuing you agree to TradeBook Manufacturer Terms & Verified Badging policy.
                  </p>
                </>
              )}
            </div>
          )}

          {/* STEP 2: COMPANY PROFILE */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                    <Building2 className="text-teal-600" size={20} /> 2. Business Profile Information
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Define your manufacturing brand and contact coordinates for retail buyers.</p>
                </div>
                <span className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full"><CheckCircle size={12} /> Step 1 Verified</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Manufacturer / Factory Name</label>
                  <input
                    type="text"
                    value={mfrInfo.name}
                    onChange={(e) => setMfrInfo({ ...mfrInfo, name: e.target.value })}
                    placeholder="e.g. Kigali Kicks Ltd"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Business Email Address</label>
                  <input
                    type="email"
                    value={mfrInfo.email}
                    onChange={(e) => setMfrInfo({ ...mfrInfo, email: e.target.value })}
                    placeholder="wholesale@kigalikicks.rw"
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
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">WhatsApp Business Number</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                    <input
                      type="tel"
                      value={mfrInfo.whatsapp}
                      onChange={(e) => setMfrInfo({ ...mfrInfo, whatsapp: e.target.value })}
                      placeholder="+250 788 000 000"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Business Registration Number (RDB)</label>
                  <input
                    type="text"
                    value={mfrInfo.businessRegistration}
                    onChange={(e) => setMfrInfo({ ...mfrInfo, businessRegistration: e.target.value })}
                    placeholder="RW-BIZ-2026-9048"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Business Tags / Keywords</label>
                  <div className="relative">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={mfrInfo.tags}
                      onChange={(e) => setMfrInfo({ ...mfrInfo, tags: e.target.value })}
                      placeholder="footwear, sneakers, handmade, sustainable"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Comma-separated tags help retailers discover you. E.g. footwear, kitenge, organic</p>
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
                    placeholder="e.g. Rwandan premium footwear artisans crafting heritage sneakers in Kigali."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Corporate Story (Optional)</label>
                  <textarea
                    rows={4}
                    value={mfrInfo.longDescription}
                    onChange={(e) => setMfrInfo({ ...mfrInfo, longDescription: e.target.value })}
                    placeholder="Provide a long description about your production processes, quality standards, or worker welfare values..."
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
                    placeholder="e.g. Kigali Special Economic Zone, Road G4"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setStep(1)} className="px-5 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Back</button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-95 transition flex items-center gap-1.5 shadow-sm"
                >
                  Continue to Product Catalogue <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PRODUCT CATALOGUE with DUAL METHODS */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                  <Package className="text-teal-600" size={20} /> 3. Product Catalogue
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Choose how you want to list your wholesale products. Upload a bulk catalogue or add manually.</p>
              </div>

              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
                <button onClick={() => setProductMode('manual')} className={`px-5 py-2.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition ${productMode==='manual' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                  🖊️ Add Product Manually
                </button>
                <button onClick={() => setProductMode('bulk')} className={`px-5 py-2.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition ${productMode==='bulk' ? 'bg-teal-600 shadow text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                  📄 Bulk Upload Document (PDF / Excel)
                </button>
              </div>

              {productMode === 'manual' ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 flex gap-2.5">
                    <Package className="text-teal-600 shrink-0" size={16} />
                    <p className="text-[11px] text-teal-800 leading-relaxed"><strong>Manual mode:</strong> Fill in a single product form. Great for first listings. You can always bulk-import the rest later from your dashboard.</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product / Wholesale Item Name</label>
                      <input type="text" value={productInfo.name} onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })} placeholder="e.g. Premium Highland Green Tea (250g)" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product Description & Wholesale Specifications</label>
                      <textarea rows={3} value={productInfo.description} onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value })} placeholder="Describe the product quality, packing quantities, shelf life, or ingredients..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Wholesale Category</label>
                      <select value={productInfo.category} onChange={(e) => setProductInfo({ ...productInfo, category: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                        {categories.map(cat => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subcategory / Tag</label>
                      <input type="text" value={productInfo.subcategory} onChange={(e) => setProductInfo({ ...productInfo, subcategory: e.target.value })} placeholder="e.g. Footwear, Sneakers" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Wholesale Price (RWF)</label>
                      <input type="number" value={productInfo.wholesalePrice} onChange={(e) => setProductInfo({ ...productInfo, wholesalePrice: e.target.value })} placeholder="1200" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Suggested Retail Price (RWF)</label>
                      <input type="number" value={productInfo.suggestedRetailPrice} onChange={(e) => setProductInfo({ ...productInfo, suggestedRetailPrice: e.target.value })} placeholder="2000" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Minimum Order Quantity (MOQ)</label>
                      <input type="number" value={productInfo.moq} onChange={(e) => setProductInfo({ ...productInfo, moq: e.target.value })} placeholder="50" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Pricing Unit</label>
                      <select value={productInfo.unit} onChange={(e) => setProductInfo({ ...productInfo, unit: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                        <option value="piece">piece / item</option>
                        <option value="pair">pair (shoes)</option>
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
                </div>
              ) : (
                <div className="space-y-5 animate-fade-in">
                  {/* Bulk Intro */}
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 rounded-xl p-4 flex gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                      <FileSpreadsheet className="text-teal-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-teal-900">Automated PDF/Excel Catalogue Listing & Parsing System</p>
                      <p className="text-[11px] text-teal-700 leading-relaxed mt-0.5">Upload your existing product catalogue PDF or Excel sheet. Our Rwandan PDF Reader Engine auto-extracts products, prices, MOQs and photo URLs into live listings.</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="px-2 py-0.5 bg-white border border-teal-100 text-teal-700 text-[10px] font-bold rounded-full">.pdf</span>
                        <span className="px-2 py-0.5 bg-white border border-teal-100 text-teal-700 text-[10px] font-bold rounded-full">.xls</span>
                        <span className="px-2 py-0.5 bg-white border border-teal-100 text-teal-700 text-[10px] font-bold rounded-full">.xlsx</span>
                        <span className="px-2 py-0.5 bg-white border border-teal-100 text-teal-700 text-[10px] font-bold rounded-full">.csv</span>
                      </div>
                    </div>
                  </div>

                  {/* Dropzone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => !isParsing && fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${isDragging ? 'border-teal-500 bg-teal-50/50 scale-[1.01]' : 'border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50/30'} ${isParsing ? 'pointer-events-none opacity-60' : ''}`}
                  >
                    <input ref={fileInputRef} type="file" accept=".pdf,.xls,.xlsx,.csv" onChange={handleFileInputChange} className="hidden" />
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm ${isDragging ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-teal-600'}`}>
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-900">Drag & drop your catalogue here</p>
                    <p className="text-xs text-gray-500 mt-1">or <span className="text-teal-600 font-bold underline">browse files</span> • Supports PDF, Excel, CSV (max 10MB)</p>
                    <div className="mt-4 flex flex-col gap-2 w-full max-w-md">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); triggerSimulateKigali(); }}
                        className="w-full py-3 bg-white border-2 border-teal-600 text-teal-700 font-bold rounded-xl hover:bg-teal-600 hover:text-white transition flex items-center justify-center gap-2 text-sm shadow-sm"
                      >
                        <FileText size={16} /> Select 'Kigali Kicks.pdf' to simulate bulk listing extraction
                      </button>
                      <p className="text-[10px] text-gray-400">This simulates the exact structure of your attached shoes document with 3 sneaker products • Instant demo</p>
                    </div>
                    {selectedFileName && !isParsing && !showBulkPreview && (
                      <div className="mt-3 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
                        <FileText size={14} className="text-teal-600" />
                        <span className="font-semibold">{selectedFileName}</span>
                        <span className="text-gray-400">• Ready to parse</span>
                      </div>
                    )}
                  </div>

                  {/* Console-like Parsing Logs & Progress Tracker */}
                  {(isParsing || parsingLogs.length > 0) && (
                    <div className="space-y-3">
                      <div className="bg-gray-950 rounded-xl overflow-hidden border border-gray-800 shadow-lg">
                        {/* Console header */}
                        <div className="bg-gray-900 px-4 py-2.5 flex items-center justify-between border-b border-gray-800">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            </div>
                            <span className="ml-3 text-[11px] font-mono font-bold text-gray-400 tracking-wider">Rwandan PDF Reader Engine — console</span>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-teal-400">{parsingProgress}%</span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-1.5 bg-gray-800">
                          <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300" style={{ width: `${parsingProgress}%` }}></div>
                        </div>
                        {/* Logs */}
                        <div className="p-4 space-y-1.5 font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto">
                          {parsingLogs.length === 0 && isParsing ? (
                            <div className="text-gray-500 flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Initializing parser...</div>
                          ) : (
                            parsingLogs.map((log, idx) => (
                              <div key={idx} className="flex gap-2 animate-fade-in">
                                <span className="text-gray-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                                <span className={`${idx === parsingLogs.length -1 && isParsing ? 'text-amber-400' : idx === parsingLogs.length -1 && !isParsing ? 'text-emerald-400 font-bold' : 'text-gray-300'}`}>{idx + 1}. {log}</span>
                              </div>
                            ))
                          )}
                          {isParsing && (
                            <div className="text-teal-400 flex items-center gap-1.5 pt-1">
                              <Loader2 size={12} className="animate-spin" />
                              <span>Processing... {parsingProgress}%</span>
                              <span className="animate-pulse">▌</span>
                            </div>
                          )}
                        </div>
                        {/* Footer stats */}
                        <div className="px-4 py-2 bg-gray-900 border-t border-gray-800 flex justify-between text-[10px] font-mono text-gray-500">
                          <span>Engine: v2.4.1 • Grid Analysis: {parsingProgress > 25 ? '✓' : '○'} Table Detection: {parsingProgress > 55 ? '✓' : '○'} Photo Verify: {parsingProgress > 80 ? '✓' : '○'}</span>
                          <span>{isParsing ? 'Parsing...' : parsingProgress===100 ? '✓ Complete' : 'Idle'}</span>
                        </div>
                      </div>
                      {/* Progress tracker bar below console */}
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full gradient-primary transition-all duration-300" style={{ width: `${parsingProgress}%` }}></div>
                        </div>
                        <span className="font-mono font-bold text-teal-700">{parsingProgress}%</span>
                        <span className="text-gray-400">•</span>
                        <span className={`font-semibold ${isParsing ? 'text-amber-600' : 'text-emerald-600'}`}>{isParsing ? 'Extracting...' : 'Extraction Complete'}</span>
                      </div>
                    </div>
                  )}

                  {/* Auto-Listing Preview */}
                  {showBulkPreview && parsedProducts.length > 0 && (
                    <div className="space-y-4 animate-fade-in border-t border-gray-100 pt-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                          <CheckCircle className="text-emerald-600" size={16} /> Auto-Listing Preview — {parsedProducts.length} products extracted
                        </h3>
                        <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-full">Ready to Publish</span>
                      </div>
                      <p className="text-xs text-gray-500">Review the automatically parsed items below. They will be auto-published when you click <strong>Register & Go Live</strong>.</p>

                      <div className="grid md:grid-cols-1 gap-4">
                        {parsedProducts.map((p, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex gap-4 p-4 relative">
                            <img src={p.image} alt={p.name} className="w-24 h-24 object-cover rounded-xl border border-gray-100 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-gray-900 text-sm">{p.name}</h4>
                                <button onClick={() => removeParsedProduct(idx)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14} /></button>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                                <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-bold text-gray-700">{p.category} • {p.subcategory}</span>
                                <span className="px-2 py-1 bg-teal-50 border border-teal-100 rounded-lg text-[11px] font-bold text-teal-700">{formatPrice(p.wholesalePrice)} RWF wholesale</span>
                                <span className="px-2 py-1 bg-amber-50 border border-amber-100 rounded-lg text-[11px] font-bold text-amber-700">{formatPrice(p.suggestedRetailPrice)} RWF retail</span>
                              </div>
                              <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                                <span className="flex items-center gap-1"><Package size={12} /> MOQ: <strong className="text-gray-900">{p.moq} {p.unit}</strong></span>
                                <span className="flex items-center gap-1"><Store size={12} /> Stock: <strong className="text-gray-900">{p.stockQuantity}</strong></span>
                                <span className="flex items-center gap-1"><ImageIcon size={12} /> Media verified</span>
                              </div>
                              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-teal-600 bg-teal-50 border border-teal-100 rounded px-2 py-1 truncate max-w-full">
                                <Globe size={10} /> {p.mediaUrl}
                              </div>
                            </div>
                            <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">EXTRACTED ✓</div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3">
                        <Shield size={16} className="text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Validation Complete</p>
                          <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5">All 3 products passed header validation (Product Name, Description, Category, Wholesale Price, Suggested Retail Price, MOQ, Stock, Media URL) and photo assets were verified. Units are in <strong>pair</strong> as detected.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setStep(2)} className="px-5 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Back</button>
                <button type="button" onClick={handleNextStep} className="px-6 py-3 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-95 transition flex items-center gap-1.5 shadow-sm">
                  Continue to Video Story <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PRODUCTION VIDEO STORY */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                  <Video className="text-teal-600" size={20} /> 4. Add Production Video Story
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Stories build authentic retail trust. Share a short video snippet showing your factory assembly line, packaging quality, or farm harvest.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Story Video Title</label>
                  <input type="text" value={storyInfo.title} onChange={(e) => setStoryInfo({ ...storyInfo, title: e.target.value })} placeholder="e.g. Inside Our Sneaker Assembly Line — Kigali Kicks Craftsmanship" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Story / Video Description</label>
                  <textarea rows={3} value={storyInfo.description} onChange={(e) => setStoryInfo({ ...storyInfo, description: e.target.value })} placeholder="Explain what retailers are looking at (e.g., how the sneakers are hand-stitched and quality-checked in our Kigali workshop under ISO standards)..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Story tags (comma-separated)</label>
                  <input type="text" value={storyInfo.tags} onChange={(e) => setStoryInfo({ ...storyInfo, tags: e.target.value })} placeholder="handmade, sneakers, kigali, sustainable" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Production Video Link</label>
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between items-center bg-white p-2 border rounded-lg">
                      <span className="font-mono font-semibold truncate max-w-[200px]">{storyInfo.videoUrl}</span>
                      <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-[10px]">DEMO VIDEO LOADED</span>
                    </div>
                    <p className="text-[10px] text-gray-400">ℹ️ For this demo sandbox, we pre-loaded a beautiful sample factory assembly loop video to show on your live profile.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setStep(3)} className="px-5 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Back</button>
                <button type="button" onClick={handleNextStep} className="px-6 py-3 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-95 transition flex items-center gap-1.5 shadow-sm">
                  Preview Registration <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: PREVIEW & CONFIRM */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                  <CheckCircle className="text-teal-600" size={20} /> 5. Confirm and Publish Profile
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
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {mfrInfo.tags.split(',').map((t,i) => t.trim() && <span key={i} className="tag text-[10px]">#{t.trim()}</span>)}
                  </div>
                </div>

                {/* Summary Section 2 */}
                <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/50 space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Package size={13} className="text-teal-600" /> Wholesale Catalogue • {productMode === 'bulk' ? `${parsedProducts.length} Bulk-Extracted Products` : '1 Manual Product'}
                  </h3>
                  {productMode === 'bulk' && parsedProducts.length > 0 ? (
                    <div className="space-y-3">
                      {parsedProducts.map((p, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-gray-100 p-3 flex gap-3">
                          <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover border shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{p.description}</p>
                            <div className="flex gap-3 text-xs pt-1">
                              <span className="text-gray-400 block font-semibold text-[10px] uppercase">Wholesale <strong className="text-teal-700 text-sm block">{formatPrice(p.wholesalePrice)} RWF</strong></span>
                              <span className="text-gray-400 block font-semibold text-[10px] uppercase">Retail <strong className="text-gray-900 text-sm block">{formatPrice(p.suggestedRetailPrice)} RWF</strong></span>
                              <span className="text-gray-400 block font-semibold text-[10px] uppercase">MOQ <strong className="text-gray-900 text-sm block">{p.moq} {p.unit}s</strong></span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="font-bold text-gray-900">{productInfo.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{productInfo.description}</p>
                      <div className="flex gap-4 text-xs pt-1.5 border-t border-gray-100">
                        <div><span className="text-gray-400 block font-semibold text-[10px] uppercase">Wholesale Price</span><strong className="text-teal-700 text-sm">{productInfo.wholesalePrice ? formatPrice(parseFloat(productInfo.wholesalePrice)) : '—'} RWF</strong></div>
                        <div><span className="text-gray-400 block font-semibold text-[10px] uppercase">Suggested Retail</span><strong className="text-gray-900 text-sm">{productInfo.suggestedRetailPrice ? formatPrice(parseFloat(productInfo.suggestedRetailPrice)) : '—'} RWF</strong></div>
                        <div><span className="text-gray-400 block font-semibold text-[10px] uppercase">Min Order (MOQ)</span><strong className="text-gray-900 text-sm">{productInfo.moq} {productInfo.unit}s</strong></div>
                      </div>
                    </>
                  )}
                </div>

                {/* Summary Section 3 */}
                <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/50 space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Video size={13} className="text-teal-600" /> Production Story Video
                  </h3>
                  <p className="font-bold text-gray-900">{storyInfo.title || 'Untitled Story'}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{storyInfo.description || 'No description'}</p>
                </div>

              </div>

              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                <div className="flex gap-2.5">
                  <Shield size={18} className="text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-teal-900">TradeBook Verified Badging & Auto-Publishing</p>
                    <p className="text-[11px] text-teal-700 leading-normal mt-0.5">
                      Your factory profile will receive a <strong>Verified</strong> badge. Upon clicking <strong>Register & Go Live</strong>, all {productMode==='bulk' ? parsedProducts.length : 1} parsed product(s) will be looped and registered in the persistent local storage database and appear instantly on your live profile with images & escrow payments.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100 gap-3">
                <button type="button" onClick={() => setStep(4)} className="px-5 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Back</button>
                <button type="button" onClick={handleCompleteOnboarding} className="flex-1 py-3 gradient-primary text-white text-sm font-bold rounded-xl hover:opacity-95 transition flex items-center justify-center gap-1.5 shadow-sm">
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
