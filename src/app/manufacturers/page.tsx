'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Search, MapPin, Star, CheckCircle, Heart, Award, Users, Package, Truck, Clock, SlidersHorizontal } from 'lucide-react';

export default function ManufacturersPage() {
  const { manufacturers, isFollowing, toggleFollow } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const filtered = manufacturers.filter(mfr => {
    if (searchTerm && !mfr.name.toLowerCase().includes(searchTerm.toLowerCase()) && !mfr.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedCategory && !mfr.categories.includes(selectedCategory)) return false;
    if (selectedCountry && mfr.country !== selectedCountry) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="gradient-hero py-12">
        <div className="container-app">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Verified Manufacturers</h1>
          <p className="text-teal-100 mb-6">Connect directly with Africa&apos;s best manufacturers. Transparent pricing, verified quality.</p>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search manufacturers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/30" />
            </div>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white text-sm focus:outline-none">
              <option value="" className="text-gray-900">All Categories</option>
              <option value="Food & Beverages" className="text-gray-900">Food & Beverages</option>
              <option value="Construction Materials" className="text-gray-900">Construction</option>
              <option value="Textiles & Clothing" className="text-gray-900">Textiles</option>
              <option value="Electronics" className="text-gray-900">Electronics</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container-app py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500 text-sm">{filtered.length} manufacturers found</p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-teal-200">
            <CheckCircle size={48} className="mx-auto text-teal-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm || selectedCategory || selectedCountry ? 'No manufacturers match your search' : 'No manufacturers registered yet'}
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              {searchTerm || selectedCategory || selectedCountry
                ? 'Try a different search term or clear your filters.'
                : 'Every company on TradeBook is a real business registered by its owner. If you run a factory, claim the first spot in the directory.'}
            </p>
            {!(searchTerm || selectedCategory || selectedCountry) && (
              <Link href="/manufacturers/onboarding" className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition">
                Register Your Factory
              </Link>
            )}
          </div>
        ) : (
        /* Manufacturers Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(mfr => (
            <div key={mfr.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Cover */}
              <div className="h-32 bg-gradient-to-br from-teal-400 to-teal-600 relative">
                <div className="absolute -bottom-8 left-4">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-3xl border-2 border-white">{mfr.logo}</div>
                </div>
                {mfr.verified && <div className="absolute top-3 right-3 badge-verified flex items-center gap-1"><CheckCircle size={12} /> Verified</div>}
                {mfr.premium && <div className="absolute top-3 left-3 badge-premium flex items-center gap-1"><Award size={12} /> Premium</div>}
              </div>

              <div className="p-4 pt-10">
                <Link href={`/manufacturers/${mfr.id}`} className="font-bold text-gray-900 hover:text-teal-700 transition text-lg">{mfr.name}</Link>
                <div className="flex items-center gap-2 mt-1">
                  {mfr.reviewCount > 0 ? (
                    <>
                      <div className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /><span className="text-sm font-medium">{mfr.rating.toFixed(1)}</span></div>
                      <span className="text-xs text-gray-400">({mfr.reviewCount})</span>
                    </>
                  ) : (
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">New vendor</span>
                  )}
                  <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} /> {mfr.city}, {mfr.country}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{mfr.description}</p>

                {/* Categories */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {mfr.categories.map(cat => (
                    <span key={cat} className="tag tag-teal text-[10px]">{cat}</span>
                  ))}
                </div>

                {/* Stats — zeroed honestly for brand-new vendors */}
                <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-gray-100">
                  <div className="text-center"><div className="text-sm font-bold text-gray-900">{mfr.productCount}</div><div className="text-[10px] text-gray-400">Products</div></div>
                  <div className="text-center"><div className="text-sm font-bold text-gray-900">{mfr.followerCount.toLocaleString()}</div><div className="text-[10px] text-gray-400">Followers</div></div>
                  <div className="text-center"><div className="text-sm font-bold text-gray-900">{mfr.stats.totalOrders > 0 ? `${mfr.stats.fulfillmentRate}%` : '—'}</div><div className="text-[10px] text-gray-400">Fulfillment</div></div>
                  <div className="text-center"><div className="text-sm font-bold text-gray-900">{mfr.stats.responseTime}</div><div className="text-[10px] text-gray-400">Response</div></div>
                </div>

                {/* Certifications */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {mfr.certifications.slice(0, 3).map(cert => (
                    <span key={cert} className="tag text-[10px]">✓ {cert}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button onClick={() => toggleFollow(mfr.id)}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition flex items-center justify-center gap-1.5 ${isFollowing(mfr.id) ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'gradient-primary text-white'}`}>
                    {isFollowing(mfr.id) ? <><CheckCircle size={14} /> Following</> : <><Heart size={14} /> Follow</>}
                  </button>
                    <Link href={`/manufacturers/${mfr.id}`} className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
