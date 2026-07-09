'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { categories, stories, groupBuys } from '@/data/mockData';
import {
  ArrowRight, TrendingUp, Shield, Users, Zap, Star, ChevronRight, Package,
  Eye, Clock, Heart, ShoppingCart, MapPin, CheckCircle, BarChart3, Globe,
  Truck, Lock, Award, Handshake, Target, Sparkles
} from 'lucide-react';

export default function HomePage() {
  const { manufacturers, products, addToCart, isFollowing, toggleFollow } = useApp();
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'deals'>('trending');

  const featuredProducts = products.slice(0, 8);
  const featuredManufacturers = manufacturers.slice(0, 6);

  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);

  return (
    <div className="min-h-screen">
      {/* ============ HERO SECTION ============ */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
        </div>
        <div className="container-app relative py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur rounded-full text-teal-100 text-sm mb-6">
              <Sparkles size={14} />
              <span>Africa&apos;s First Wholesale Social Commerce Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Buy Wholesale.<br />
              <span className="text-teal-300">Direct from Manufacturers.</span><br />
              <span className="text-amber-400">Transparent Prices.</span>
            </h1>
            <p className="text-lg md:text-xl text-teal-100 mb-8 max-w-2xl">
              Follow manufacturers, see their wholesale prices, compare, and order directly. No hidden markups. No middlemen. Just fair, transparent pricing for every retailer.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/products" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-700 font-bold rounded-xl hover:bg-gray-100 transition text-lg">
                Browse Wholesale <ArrowRight size={20} />
              </Link>
              <Link href="/manufacturers" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-800 text-white font-bold rounded-xl hover:bg-teal-900 transition border border-teal-600 text-lg">
                I&apos;m a Manufacturer
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { icon: <Shield size={18} />, text: 'Escrow Protection' },
                { icon: <CheckCircle size={18} />, text: 'Verified Manufacturers' },
                { icon: <Users size={18} />, text: '12,000+ Retailers' },
                { icon: <Globe size={18} />, text: '6 Countries' },
              ].map(badge => (
                <div key={badge.text} className="flex items-center gap-2 text-teal-200 text-sm">
                  {badge.icon} {badge.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-app py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '500+', label: 'Verified Manufacturers', icon: <Factory size={20} /> },
              { value: '12,000+', label: 'Active Retailers', icon: <Users size={20} /> },
              { value: '45,000+', label: 'Products Listed', icon: <Package size={20} /> },
              { value: '98%', label: 'Price Transparency', icon: <BarChart3 size={20} /> },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-16 bg-gray-50">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How TradeBook Works</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Three simple steps to transparent wholesale pricing</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <Eye size={32} />, title: 'Discover & Follow', desc: 'Browse verified manufacturers, see their wholesale prices openly. Follow the ones you trust to get updates and price alerts.', color: 'from-teal-500 to-teal-600' },
              { step: '02', icon: <Handshake size={32} />, title: 'Compare & Choose', desc: 'Compare wholesale prices across manufacturers. See suggested retail prices. Join group buys with other retailers for bigger discounts.', color: 'from-amber-500 to-amber-600' },
              { step: '03', icon: <Truck size={32} />, title: 'Order & Receive', desc: 'Place orders with escrow protection. Track delivery in real-time. Your payment is safe until you confirm receipt.', color: 'from-green-500 to-green-600' },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow group">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div className="text-sm font-bold text-gray-400 mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="py-16">
        <div className="container-app">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse by Category</h2>
              <p className="text-gray-500 mt-1">Find wholesale products across industries</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-teal-600 font-medium hover:text-teal-700 transition text-sm">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-teal-200 transition-all group card-hover">
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-teal-700 transition">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat.productCount} products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="py-16 bg-gray-50">
        <div className="container-app">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Wholesale Products</h2>
              <p className="text-gray-500 mt-1">Factory-direct prices, verified quality</p>
            </div>
            <div className="flex gap-2">
              {[
                { key: 'trending' as const, label: 'Trending' },
                { key: 'new' as const, label: 'New' },
                { key: 'deals' as const, label: 'Best Deals' },
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.key ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map(product => {
              const savings = Math.round((1 - product.wholesalePrice / product.suggestedRetailPrice) * 100);
              return (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group card-hover">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl">
                      {product.images[0] ? '📦' : '📦'}
                    </div>
                    {savings > 0 && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                        -{savings}%
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      <button className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition">
                        <Heart size={14} className="text-gray-600" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur rounded-lg">
                      <span className="text-xs font-medium">{product.manufacturerLogo} {product.manufacturerName}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <Link href={`/products/${product.id}`} className="font-semibold text-gray-900 hover:text-teal-700 transition line-clamp-2 text-sm">
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs text-gray-600">{product.rating}</span>
                      <span className="text-xs text-gray-400">({product.reviewCount})</span>
                      {product.verified && <CheckCircle size={12} className="text-teal-500 ml-1" />}
                    </div>

                    {/* Price */}
                    <div className="mt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="price-wholesale text-lg">{formatPrice(product.wholesalePrice)} {product.currency}</span>
                        <span className="price-retail text-sm">{formatPrice(product.suggestedRetailPrice)}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        MOQ: {product.moq} {product.unit}s • Price guarantee: {product.priceGuaranteeDays} days
                      </div>
                    </div>

                    {/* Tiered pricing preview */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.tieredPricing.slice(0, 2).map((tier, i) => (
                        <span key={i} className="tag tag-teal text-[10px]">
                          {tier.label}: {formatPrice(tier.price)}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => addToCart({
                        productId: product.id, productName: product.name, productImage: product.images[0] || '',
                        manufacturerId: product.manufacturerId, manufacturerName: product.manufacturerName,
                        quantity: product.moq, unitPrice: product.wholesalePrice, moq: product.moq,
                      })} className="flex-1 py-2.5 gradient-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition flex items-center justify-center gap-1.5">
                        <ShoppingCart size={14} /> Add to Cart
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

          <div className="text-center mt-8">
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ GROUP BUYING ============ */}
      <section className="py-16">
        <div className="container-app">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">🤝 Active Group Buys</h2>
              <p className="text-gray-500 mt-1">Pool orders with other retailers for bigger discounts</p>
            </div>
            <Link href="/group-buy" className="hidden sm:flex items-center gap-1 text-teal-600 font-medium hover:text-teal-700 transition text-sm">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {groupBuys.map(gb => {
              const progress = Math.round((gb.currentQuantity / gb.targetQuantity) * 100);
              return (
                <div key={gb.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl shrink-0">📦</div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{gb.productName}</h3>
                      <p className="text-xs text-gray-500">by {gb.manufacturerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{gb.currentParticipants}/{gb.minParticipants} participants</span>
                    <span className="text-sm font-bold text-teal-600">{gb.savingsPercent}% OFF</span>
                  </div>

                  <div className="progress-bar mb-2">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mb-4">
                    <span>{gb.currentQuantity}/{gb.targetQuantity} units</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs text-gray-400">Wholesale</span>
                      <div className="text-lg font-bold text-gray-900">{formatPrice(gb.wholesalePrice)} RWF</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400">Group Price</span>
                      <div className="text-lg font-bold text-green-600">{formatPrice(Math.round(gb.wholesalePrice * (1 - gb.savingsPercent / 100)))} RWF</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Clock size={12} />
                    <span>Ends {new Date(gb.deadline).toLocaleDateString()}</span>
                    <span className="ml-auto flex items-center gap-1"><MapPin size={12} /> {gb.location}</span>
                  </div>

                  <Link href="/group-buy" className="block w-full py-2.5 gradient-primary text-white text-sm font-medium rounded-lg text-center hover:opacity-90 transition">
                    Join Group Buy
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ MANUFACTURER STORIES ============ */}
      <section className="py-16 bg-gray-50">
        <div className="container-app">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">📱 Manufacturer Stories</h2>
              <p className="text-gray-500 mt-1">Behind the scenes from Rwanda&apos;s top manufacturers</p>
            </div>
            <Link href="/stories" className="hidden sm:flex items-center gap-1 text-teal-600 font-medium hover:text-teal-700 transition text-sm">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
            {stories.map(story => (
              <div key={story.id} className="min-w-[280px] sm:min-w-[320px] bg-white rounded-xl overflow-hidden border border-gray-100 snap-start card-hover">
                <div className="relative h-48 bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{story.manufacturerLogo}</span>
                      <span className="text-white text-sm font-medium">{story.manufacturerName}</span>
                      {story.mediaType === 'video' && (
                        <span className="ml-auto px-2 py-0.5 bg-white/20 backdrop-blur text-white text-[10px] rounded-full">▶ VIDEO</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{story.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{story.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Eye size={12} /> {story.views.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Heart size={12} /> {story.likes}</span>
                    <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED MANUFACTURERS ============ */}
      <section className="py-16">
        <div className="container-app">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">🏭 Top Manufacturers</h2>
              <p className="text-gray-500 mt-1">Verified, trusted, and transparent</p>
            </div>
            <Link href="/manufacturers" className="hidden sm:flex items-center gap-1 text-teal-600 font-medium hover:text-teal-700 transition text-sm">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredManufacturers.map(mfr => (
              <div key={mfr.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Cover */}
                <div className="h-32 bg-gradient-to-br from-teal-400 to-teal-600 relative">
                  <div className="absolute -bottom-8 left-4">
                    <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-3xl border-2 border-white">
                      {mfr.logo}
                    </div>
                  </div>
                  {mfr.verified && (
                    <div className="absolute top-3 right-3 badge-verified flex items-center gap-1">
                      <CheckCircle size={12} /> Verified
                    </div>
                  )}
                  {mfr.premium && (
                    <div className="absolute top-3 left-3 badge-premium flex items-center gap-1">
                      <Award size={12} /> Premium
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 pt-10">
                  <Link href={`/manufacturers/${mfr.id}`} className="font-bold text-gray-900 hover:text-teal-700 transition text-lg">
                    {mfr.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium">{mfr.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">({mfr.reviewCount} reviews)</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} /> {mfr.city}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{mfr.description}</p>

                  {/* Stats */}
                  <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">{mfr.productCount}</div>
                      <div className="text-[10px] text-gray-400">Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">{mfr.followerCount.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-400">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">{mfr.stats.fulfillmentRate}%</div>
                      <div className="text-[10px] text-gray-400">Fulfillment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">{mfr.stats.responseTime}</div>
                      <div className="text-[10px] text-gray-400">Response</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => toggleFollow(mfr.id)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition flex items-center justify-center gap-1.5 ${isFollowing(mfr.id) ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'gradient-primary text-white'}`}>
                      {isFollowing(mfr.id) ? <><CheckCircle size={14} /> Following</> : <><Heart size={14} /> Follow</>}
                    </button>
                    <Link href={`/manufacturers/${mfr.id}`} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY TRADEBOOK ============ */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Why TradeBook?</h2>
            <p className="text-gray-400 max-w-lg mx-auto">We&apos;re solving the real problems in wholesale trade</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <BarChart3 size={28} />, title: 'Price Transparency', desc: 'Manufacturers publish wholesale prices openly. Compare across suppliers. No more guessing or haggling.' },
              { icon: <Shield size={28} />, title: 'Escrow Protection', desc: 'Your payment is held safely until you confirm delivery. No risk of losing money to unreliable suppliers.' },
              { icon: <Users size={28} />, title: 'Group Buying', desc: 'Small retailers unite! Pool orders with others to reach MOQ and unlock bulk discounts.' },
              { icon: <Target size={28} />, title: 'Suggested Retail Price', desc: 'Manufacturers publish recommended retail prices, creating accountability against unfair markups.' },
              { icon: <Lock size={28} />, title: 'Price Guarantee', desc: 'Manufacturers commit to stable prices for 30-90 days. Get notified before any price changes.' },
              { icon: <Award size={28} />, title: 'Verified Quality', desc: 'Every manufacturer is physically verified. Business registration, factory visits, and quality certifications.' },
            ].map(item => (
              <div key={item.title} className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-teal-500/30 transition-colors">
                <div className="text-teal-400 mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRUST PARTNERS ============ */}
      <section className="py-12 bg-white">
        <div className="container-app text-center">
          <p className="text-sm text-gray-400 mb-6">TRUSTED BY LEADING RWANDAN INSTITUTIONS</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            {['RDB Rwanda', 'Made in Rwanda', 'BNR', 'RISA', 'EAC Trade'].map(partner => (
              <div key={partner} className="px-6 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-500">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Missing icon component
function Factory(props: any) {
  return <Building2 {...props} />;
}

function Building2(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
    </svg>
  );
}
