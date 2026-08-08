'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { categories } from '@/data/mockData';
import { Search, Filter, Star, Heart, ShoppingCart, Eye, CheckCircle, MapPin, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

export default function ProductsPage() {
  const { products, addToCart } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term) || p.manufacturerName.toLowerCase().includes(term));
    }
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (verifiedOnly) result = result.filter(p => p.verified);
    result = result.filter(p => p.wholesalePrice >= priceRange[0] && p.wholesalePrice <= priceRange[1]);
    if (sortBy === 'price_low') result.sort((a, b) => a.wholesalePrice - b.wholesalePrice);
    else if (sortBy === 'price_high') result.sort((a, b) => b.wholesalePrice - a.wholesalePrice);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, searchTerm, selectedCategory, sortBy, priceRange, verifiedOnly]);

  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-app py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wholesale Products</h1>
          <p className="text-gray-500">{filteredProducts.length} products from verified manufacturers</p>

          {/* Search & Filters */}
          <div className="flex gap-3 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              <SlidersHorizontal size={16} /> Filters
            </button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20">
              <option value="relevance">Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container-app py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0`}>
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button onClick={() => { setSelectedCategory(''); setVerifiedOnly(false); }} className="text-xs text-teal-600 hover:underline">Clear All</button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
                <div className="space-y-1.5">
                  <button onClick={() => setSelectedCategory('')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${!selectedCategory ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${selectedCategory === cat.name ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <span>{cat.icon}</span> {cat.name}
                      <span className="ml-auto text-xs text-gray-400">{products.filter(p => p.category === cat.name).length}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm text-gray-700">Verified Manufacturers Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map(product => {
                  const savings = Math.round((1 - product.wholesalePrice / product.suggestedRetailPrice) * 100);
                  return (
                    <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow card-hover">
                      <div className="relative h-44 bg-gray-100">
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl">📦</div>
                        {savings > 0 && <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">-{savings}%</div>}
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition">
                          <Heart size={14} className="text-gray-600" />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-xs">{product.manufacturerLogo}</span>
                          <span className="text-xs text-gray-500 truncate">{product.manufacturerName}</span>
                          {product.verified && <CheckCircle size={12} className="text-teal-500 shrink-0" />}
                        </div>
                        <Link href={`/products/${product.id}`} className="font-semibold text-gray-900 hover:text-teal-700 transition line-clamp-2 text-sm">
                          {product.name}
                        </Link>
                        <div className="flex items-center gap-1 mt-1">
                          {product.reviewCount > 0 ? (
                            <>
                              <Star size={12} className="text-amber-400 fill-amber-400" />
                              <span className="text-xs text-gray-600">{product.rating.toFixed(1)} ({product.reviewCount})</span>
                            </>
                          ) : (
                            <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">New listing</span>
                          )}
                        </div>
                        <div className="mt-3">
                          <span className="price-wholesale text-lg">{formatPrice(product.wholesalePrice)} {product.currency}</span>
                          <span className="price-retail text-sm ml-2">{formatPrice(product.suggestedRetailPrice)}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">MOQ: {product.moq} • {product.priceGuaranteeDays}-day guarantee</div>
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => addToCart({ productId: product.id, productName: product.name, productImage: '', manufacturerId: product.manufacturerId, manufacturerName: product.manufacturerName, quantity: product.moq, unitPrice: product.wholesalePrice, moq: product.moq })}
                            className="flex-1 py-2.5 gradient-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition flex items-center justify-center gap-1.5">
                            <ShoppingCart size={14} /> Add
                          </button>
                          <Link href={`/products/${product.id}`} className="px-3 py-2.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition">
                            <Eye size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Package(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
    </svg>
  );
}
