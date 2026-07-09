'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { reviews as allReviews } from '@/data/mockData';
import { Star, ShoppingCart, Heart, CheckCircle, MapPin, Shield, Clock, Truck, Package, ArrowLeft, Minus, Plus, MessageCircle, Share2, Bell, Award, TrendingDown, Users } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const { products, manufacturers, addToCart, toggleFollow, isFollowing } = useApp();
  const [quantity, setQuantity] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'pricing'>('details');

  const product = products.find(p => p.id === params.id);
  const mfr = manufacturers.find(m => m.id === product?.manufacturerId);
  const productReviews = allReviews.filter(r => r.productId === params.id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <Link href="/products" className="text-teal-600 hover:underline">← Back to Products</Link>
        </div>
      </div>
    );
  }

  const savings = Math.round((1 - product.wholesalePrice / product.suggestedRetailPrice) * 100);
  const currentTier = product.tieredPricing.find(t => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty)) || product.tieredPricing[0];
  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-app py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/products" className="flex items-center gap-1 hover:text-teal-600"><ArrowLeft size={14} /> Products</Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Image */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="relative h-96 bg-gray-100">
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">📦</div>
              {savings > 0 && <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg">-{savings}% OFF</div>}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition shadow-sm">
                  <Heart size={18} className="text-gray-600" />
                </button>
                <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition shadow-sm">
                  <Share2 size={18} className="text-gray-600" />
                </button>
              </div>
              {product.verified && (
                <div className="absolute bottom-4 left-4 badge-verified flex items-center gap-1 text-sm">
                  <CheckCircle size={14} /> Verified Product
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Manufacturer */}
            <Link href={`/manufacturers/${product.manufacturerId}`} className="flex items-center gap-2 mb-3 group">
              <span className="text-2xl">{product.manufacturerLogo}</span>
              <div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-teal-700 transition">{product.manufacturerName}</span>
                {mfr?.verified && <CheckCircle size={12} className="text-teal-500 inline ml-1" />}
              </div>
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                ))}
                <span className="text-sm font-medium ml-1">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
              <span className="text-sm text-gray-400">{product.orderCount} orders</span>
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Price */}
            <div className="bg-teal-50 rounded-xl p-5 mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-teal-700">{formatPrice(currentTier.price)} {product.currency}</span>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.suggestedRetailPrice)}</span>
                <span className="text-sm font-medium text-green-600">Save {savings}%</span>
              </div>
              <div className="text-sm text-gray-500">
                Current tier: <span className="font-medium">{currentTier.label}</span> • per {product.unit}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-teal-700">
                <Shield size={14} /> {product.priceGuaranteeDays}-day price guarantee
                <Clock size={14} className="ml-2" /> Updated {new Date(product.lastUpdated).toLocaleDateString()}
              </div>
            </div>

            {/* Tiered Pricing Table */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1"><TrendingDown size={14} /> Volume Discounts</h3>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-gray-500 font-medium">Quantity</th><th className="px-4 py-2 text-right text-gray-500 font-medium">Price/Unit</th><th className="px-4 py-2 text-right text-gray-500 font-medium">Savings</th></tr></thead>
                  <tbody>
                    {product.tieredPricing.map((tier, i) => {
                      const tierSavings = Math.round((1 - tier.price / product.suggestedRetailPrice) * 100);
                      const isActive = currentTier.minQty === tier.minQty;
                      return (
                        <tr key={i} className={`border-t border-gray-100 ${isActive ? 'bg-teal-50 font-medium' : ''}`}>
                          <td className="px-4 py-2.5">{tier.label}</td>
                          <td className="px-4 py-2.5 text-right text-teal-700 font-medium">{formatPrice(tier.price)} RWF</td>
                          <td className="px-4 py-2.5 text-right text-green-600">{tierSavings}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl">
                <button onClick={() => setQuantity(Math.max(0, quantity - 1))} className="p-3 hover:bg-gray-100 rounded-l-xl transition"><Minus size={18} /></button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))} className="w-20 text-center text-lg font-medium border-0 focus:outline-none" />
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100 rounded-r-xl transition"><Plus size={18} /></button>
              </div>
              <span className="text-sm text-gray-500">MOQ: {product.moq} {product.unit}s</span>
            </div>

            {quantity > 0 && quantity < product.moq && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-700 flex items-center gap-2">
                <Users size={16} /> Minimum order is {product.moq} units. Consider joining a <Link href="/group-buy" className="font-medium underline">Group Buy</Link>!
              </div>
            )}

            <div className="flex gap-3 mb-4">
              <button onClick={() => {
                if (quantity < product.moq) return;
                addToCart({ productId: product.id, productName: product.name, productImage: '', manufacturerId: product.manufacturerId, manufacturerName: product.manufacturerName, quantity, unitPrice: currentTier.price, moq: product.moq });
              }} disabled={quantity < product.moq}
                className={`flex-1 py-4 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-lg ${quantity >= product.moq ? 'gradient-primary hover:opacity-90' : 'bg-gray-300 cursor-not-allowed'}`}>
                <ShoppingCart size={20} /> Add to Cart {quantity >= product.moq && `— ${formatPrice(currentTier.price * quantity)} RWF`}
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={() => mfr && toggleFollow(mfr.id)} className={`flex-1 py-3 text-sm font-medium rounded-xl transition flex items-center justify-center gap-2 ${mfr && isFollowing(mfr.id) ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {mfr && isFollowing(mfr.id) ? <><CheckCircle size={16} /> Following {mfr.name}</> : <><Heart size={16} /> Follow Manufacturer</>}
              </button>
              <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center gap-2 text-sm">
                <Bell size={16} /> Price Alert
              </button>
              <button className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition flex items-center gap-2 text-sm">
                <MessageCircle size={16} /> WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100">
            {[
              { key: 'details' as const, label: 'Product Details' },
              { key: 'pricing' as const, label: 'Pricing Info' },
              { key: 'reviews' as const, label: `Reviews (${productReviews.length})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 text-sm font-medium transition ${activeTab === tab.key ? 'text-teal-700 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'details' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Specifications</h3>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">{key}</span>
                    <span className="text-sm font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Shipping Information</h3>
                <div className="flex items-start gap-3">
                  <Truck size={20} className="text-teal-600 mt-0.5" />
                  <p className="text-sm text-gray-600">{product.shippingInfo}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => <span key={tag} className="tag tag-teal">#{tag}</span>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Transparent Pricing Breakdown</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-teal-50 rounded-xl">
                <div className="text-2xl font-bold text-teal-700">{formatPrice(product.wholesalePrice)} RWF</div>
                <div className="text-sm text-teal-600 mt-1">Wholesale Price</div>
                <div className="text-xs text-gray-500 mt-2">Direct from manufacturer. No middlemen.</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <div className="text-2xl font-bold text-amber-700">{formatPrice(product.suggestedRetailPrice)} RWF</div>
                <div className="text-sm text-amber-600 mt-1">Suggested Retail</div>
                <div className="text-xs text-gray-500 mt-2">Recommended selling price for retailers.</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-700">{savings}%</div>
                <div className="text-sm text-green-600 mt-1">Your Margin</div>
                <div className="text-xs text-gray-500 mt-2">Potential profit margin for retailers.</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {productReviews.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <Star size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500 text-sm">Be the first to review this product after purchasing</p>
              </div>
            ) : (
              productReviews.map(review => (
                <div key={review.id} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">{review.reviewerName.charAt(0)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">{review.reviewerName}</span>
                        {review.verified && <span className="badge-verified text-[10px]"><CheckCircle size={10} /> Verified Buyer</span>}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />)}
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
