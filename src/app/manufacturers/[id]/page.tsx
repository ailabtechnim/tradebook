'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { MapPin, Star, CheckCircle, Heart, Award, Users, Package, Truck, Clock, Shield, Globe, Phone, Mail, MessageCircle, ExternalLink, Eye, ShoppingCart, Calendar, Building2, ArrowLeft } from 'lucide-react';

export default function ManufacturerDetailPage() {
  const params = useParams();
  const { manufacturers, products, isFollowing, toggleFollow, addToCart } = useApp();
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews' | 'stories'>('products');

  const mfr = manufacturers.find(m => m.id === params.id);
  const mfrProducts = products.filter(p => p.manufacturerId === params.id);

  if (!mfr) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Manufacturer Not Found</h2>
          <Link href="/manufacturers" className="text-teal-600 hover:underline">← Back to Manufacturers</Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-teal-400 to-teal-700 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-app relative h-full flex items-end pb-4">
          <Link href="/manufacturers" className="absolute top-4 left-4 flex items-center gap-1 text-white/80 hover:text-white text-sm transition">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
      </div>

      <div className="container-app -mt-12 relative z-10 pb-16">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center text-4xl border-4 border-white -mt-14 md:-mt-14 shrink-0">
              {mfr.logo}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{mfr.name}</h1>
                {mfr.verified && <span className="badge-verified flex items-center gap-1"><CheckCircle size={12} /> Verified</span>}
                {mfr.premium && <span className="badge-premium flex items-center gap-1"><Award size={12} /> Premium</span>}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1"><MapPin size={14} /> {mfr.location}, {mfr.city}</span>
                <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> {mfr.rating} ({mfr.reviewCount} reviews)</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> Est. {mfr.established}</span>
              </div>
              <p className="text-gray-600 text-sm">{mfr.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-gray-100">
                {[
                  { icon: <Package size={16} />, value: mfr.productCount, label: 'Products' },
                  { icon: <Users size={16} />, value: mfr.followerCount.toLocaleString(), label: 'Followers' },
                  { icon: <Truck size={16} />, value: `${mfr.stats.fulfillmentRate}%`, label: 'Fulfillment' },
                  { icon: <Clock size={16} />, value: mfr.stats.responseTime, label: 'Response' },
                  { icon: <ShoppingCart size={16} />, value: mfr.stats.totalOrders.toLocaleString(), label: 'Orders' },
                  { icon: <Users size={16} />, value: `${mfr.stats.repeatBuyers}%`, label: 'Repeat Buyers' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <span className="text-teal-600">{stat.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{stat.value}</div>
                      <div className="text-[10px] text-gray-400">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => toggleFollow(mfr.id)}
                className={`px-6 py-2.5 text-sm font-medium rounded-xl transition flex items-center gap-2 ${isFollowing(mfr.id) ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'gradient-primary text-white'}`}>
                {isFollowing(mfr.id) ? <><CheckCircle size={16} /> Following</> : <><Heart size={16} /> Follow</>}
              </button>
              <a href={`https://wa.me/${mfr.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer"
                className="px-6 py-2.5 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition flex items-center gap-2">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100">
            {[
              { key: 'products' as const, label: `Products (${mfrProducts.length})` },
              { key: 'about' as const, label: 'About' },
              { key: 'reviews' as const, label: 'Reviews' },
              { key: 'stories' as const, label: 'Stories' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 text-sm font-medium transition ${activeTab === tab.key ? 'text-teal-700 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mfrProducts.map(product => {
              const savings = Math.round((1 - product.wholesalePrice / product.suggestedRetailPrice) * 100);
              return (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow card-hover">
                  <div className="relative h-44 bg-gray-100">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl">📦</div>
                    {savings > 0 && <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">-{savings}%</div>}
                  </div>
                  <div className="p-4">
                    <Link href={`/products/${product.id}`} className="font-semibold text-gray-900 hover:text-teal-700 transition text-sm">{product.name}</Link>
                    <div className="flex items-center gap-1 mt-1"><Star size={12} className="text-amber-400 fill-amber-400" /><span className="text-xs">{product.rating}</span></div>
                    <div className="mt-2">
                      <span className="price-wholesale">{formatPrice(product.wholesalePrice)} {product.currency}</span>
                      <span className="price-retail ml-2 text-xs">{formatPrice(product.suggestedRetailPrice)}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">MOQ: {product.moq}</div>
                    <button onClick={() => addToCart({ productId: product.id, productName: product.name, productImage: '', manufacturerId: product.manufacturerId, manufacturerName: product.manufacturerName, quantity: product.moq, unitPrice: product.wholesalePrice, moq: product.moq })}
                      className="w-full mt-3 py-2.5 gradient-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition flex items-center justify-center gap-1.5">
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">About {mfr.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{mfr.longDescription}</p>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {mfr.certifications.map(cert => (
                  <span key={cert} className="tag tag-green">✓ {cert}</span>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm"><Phone size={16} className="text-teal-600" /><span>{mfr.contactPhone}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Mail size={16} className="text-teal-600" /><span>{mfr.contactEmail}</span></div>
                  <div className="flex items-center gap-3 text-sm"><MessageCircle size={16} className="text-green-500" /><span>{mfr.whatsapp}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Globe size={16} className="text-teal-600" /><a href="#" className="text-teal-600 hover:underline">{mfr.website}</a></div>
                  <div className="flex items-center gap-3 text-sm"><MapPin size={16} className="text-teal-600" /><span>{mfr.location}, {mfr.city}, {mfr.country}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Business Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Registration</span><span className="font-medium">{mfr.businessRegistration}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Established</span><span className="font-medium">{mfr.established}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Employees</span><span className="font-medium">{mfr.employees}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Member Since</span><span className="font-medium">{new Date(mfr.joinedDate).toLocaleDateString()}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="text-center py-8">
              <Star size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reviews coming soon</h3>
              <p className="text-gray-500 text-sm">Product reviews are available on individual product pages</p>
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="text-center py-8">
              <Eye size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
              <p className="text-gray-500 text-sm">This manufacturer hasn&apos;t published any stories yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
