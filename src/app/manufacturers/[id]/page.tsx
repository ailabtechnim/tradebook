'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  MapPin, Star, CheckCircle, Heart, Award, Users, Package, Truck, Clock, Shield,
  Globe, Phone, Mail, MessageCircle, ExternalLink, Eye, ShoppingCart, Calendar,
  Building2, ArrowLeft, Send, X, MoreVertical, Search, Check, FileText
} from 'lucide-react';

export default function ManufacturerDetailPage() {
  const params = useParams();
  const { manufacturers, products, stories, isFollowing, toggleFollow, addToCart } = useApp();
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews' | 'stories'>('products');

  // Interactive WhatsApp chat state
  const [showWaWidget, setShowWaWidget] = useState(false);
  const [waMessages, setWaMessages] = useState<Array<{ sender: 'user' | 'mfr', text: string, time: string }>>([]);
  const [waInput, setWaInput] = useState('');
  const [mfrIsTyping, setMfrIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mfr = manufacturers.find(m => m.id === params.id);
  const mfrProducts = products.filter(p => p.manufacturerId === params.id);
  const mfrStories = stories.filter(s => s.manufacturerId === params.id);

  // Scroll to bottom of WhatsApp chat whenever messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [waMessages, mfrIsTyping]);

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

  const handleOpenWaWidget = () => {
    setShowWaWidget(true);
    if (waMessages.length === 0) {
      setWaMessages([
        {
          sender: 'mfr',
          text: `Hi! Welcome to ${mfr.name} Wholesale Support. 🇷🇼 I am the sales head. Ask me about our wholesale products, custom volume contracts, or transport!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleSendWaMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waInput.trim()) return;

    const userMsg = waInput;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    setWaMessages(prev => [...prev, { sender: 'user', text: userMsg, time: currentTime }]);
    setWaInput('');
    setMfrIsTyping(true);

    // Simulate manufacturer chatbot response after 1.5 seconds
    setTimeout(() => {
      let reply = '';
      const textLower = userMsg.toLowerCase();

      if (textLower.includes('moq') || textLower.includes('minimum') || textLower.includes('least')) {
        reply = `For our wholesale items, the MOQ is listed on the page. However, if you are a verified TradeBook retailer, we can negotiate a starter bundle with mixed items to accommodate your shop shelves!`;
      } else if (textLower.includes('price') || textLower.includes('discount') || textLower.includes('wholesale')) {
        reply = `We provide strict tier-based wholesale pricing shown in TradeBook. If your target monthly ordering exceeds 1,000,000 RWF, please request a custom trade agreement and we can authorize a 5% to 10% additional loyalty rebate!`;
      } else if (textLower.includes('delivery') || textLower.includes('ship') || textLower.includes('kigali') || textLower.includes('transport')) {
        reply = `Our processing facility is located at ${mfr.location}. We run daily delivery trucks in Kigali. For provincial orders, we coordinate group shipping to save you transport costs. Plus, all payments are safe in TradeBook Escrow!`;
      } else if (textLower.includes('sample') || textLower.includes('try') || textLower.includes('free')) {
        reply = `We would be happy to send a product sample package to your retail shop in ${mfr.city}! Simply place a mock order or send us your trade credentials, and our rep will dispatch samples tomorrow.`;
      } else {
        reply = `That sounds great! We value wholesale partnerships. Let's arrange a call, or click 'Redirect to Real WhatsApp' below to speak directly with our team on our official numbers!`;
      }

      setWaMessages(prev => [...prev, { sender: 'mfr', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setMfrIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Cover */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-teal-400 to-teal-700 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-app relative h-full flex items-end pb-4">
          <Link href="/manufacturers" className="absolute top-4 left-4 flex items-center gap-1 text-white/80 hover:text-white text-sm transition font-semibold">
            <ArrowLeft size={16} /> Back to Directory
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
              <p className="text-gray-600 text-sm leading-relaxed">{mfr.description}</p>

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
            <div className="flex flex-col gap-2 shrink-0 justify-start sm:w-48">
              <button onClick={() => toggleFollow(mfr.id)}
                className={`w-full py-2.5 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 ${isFollowing(mfr.id) ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'gradient-primary text-white shadow-sm'}`}>
                {isFollowing(mfr.id) ? <><CheckCircle size={16} /> Following</> : <><Heart size={16} /> Follow Manufacturer</>}
              </button>
              
              {/* Simulated/Real WhatsApp Multi-Trigger Button */}
              <button
                onClick={handleOpenWaWidget}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100">
            {[
              { key: 'products' as const, label: `Products (${mfrProducts.length})` },
              { key: 'about' as const, label: 'About Manufacturer' },
              { key: 'reviews' as const, label: 'Reviews' },
              { key: 'stories' as const, label: 'Stories' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3.5 text-sm font-semibold transition-all ${activeTab === tab.key ? 'text-teal-700 border-b-2 border-teal-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
            {mfrProducts.map(product => {
              const savings = Math.round((1 - product.wholesalePrice / product.suggestedRetailPrice) * 100);
              return (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow card-hover">
                  <div className="relative h-44 bg-gray-100">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl">📦</div>
                    {savings > 0 && <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">-{savings}%</div>}
                  </div>
                  <div className="p-4">
                    <Link href={`/products/${product.id}`} className="font-bold text-gray-900 hover:text-teal-700 transition text-sm leading-tight line-clamp-1">{product.name}</Link>
                    <div className="flex items-center gap-1 mt-1"><Star size={12} className="text-amber-400 fill-amber-400" /><span className="text-xs font-medium">{product.rating}</span></div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="price-wholesale font-bold text-base">{formatPrice(product.wholesalePrice)} {product.currency}</span>
                      <span className="price-retail text-xs">{formatPrice(product.suggestedRetailPrice)}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">MOQ: {product.moq} {product.unit}s</div>
                    <button onClick={() => addToCart({ productId: product.id, productName: product.name, productImage: '', manufacturerId: product.manufacturerId, manufacturerName: product.manufacturerName, quantity: product.moq, unitPrice: product.wholesalePrice, moq: product.moq })}
                      className="w-full mt-4 py-2.5 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-1.5 shadow-sm">
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">About {mfr.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{mfr.longDescription}</p>

              <h4 className="font-bold text-gray-900 mt-6 mb-3 text-sm">Industrial Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {mfr.certifications.map(cert => (
                  <span key={cert} className="tag tag-green text-xs">✓ {cert}</span>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm"><Phone size={16} className="text-teal-600" /><span>{mfr.contactPhone}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Mail size={16} className="text-teal-600" /><span>{mfr.contactEmail}</span></div>
                  <div className="flex items-center gap-3 text-sm"><MessageCircle size={16} className="text-emerald-600" /><span>{mfr.whatsapp}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Globe size={16} className="text-teal-600" /><a href="#" className="text-teal-600 hover:underline font-medium">{mfr.website}</a></div>
                  <div className="flex items-center gap-3 text-sm"><MapPin size={16} className="text-teal-600" /><span>{mfr.location}, {mfr.city}, {mfr.country}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Business Profile</h3>
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500 font-medium">Business Registration</span><span className="font-bold text-gray-800">{mfr.businessRegistration}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 font-medium">Established Year</span><span className="font-bold text-gray-800">{mfr.established}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 font-medium">Corporate Employees</span><span className="font-bold text-gray-800">{mfr.employees}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 font-medium">TradeBook Member Since</span><span className="font-bold text-gray-800">{new Date(mfr.joinedDate).toLocaleDateString()}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="text-center py-8">
              <Star size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reviews coming soon</h3>
              <p className="text-gray-500 text-sm">Product reviews are available on individual product pages</p>
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="space-y-6 animate-fade-in">
            {mfrStories.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-6 text-center py-12 shadow-sm">
                <Eye size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
                <p className="text-gray-500 text-sm">This manufacturer hasn&apos;t published any stories yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {mfrStories.map(story => (
                  <div key={story.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                    {/* HTML5 Video Player or Image */}
                    {story.mediaType === 'video' ? (
                      <div className="relative aspect-video bg-black">
                        <video
                          src={story.mediaUrl}
                          controls
                          poster="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                          <span>Factory Story</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative aspect-video bg-gray-100">
                        <img src={story.thumbnail} alt={story.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-base mb-2 leading-tight">{story.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">{story.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {story.tags.map(tag => (
                          <span key={tag} className="tag text-[10px]">#{tag}</span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-gray-400 border-t pt-3 border-gray-50">
                        <span>Published on {new Date(story.createdAt).toLocaleDateString()}</span>
                        <div className="flex gap-3">
                          <span>👁️ {story.views.toLocaleString()} views</span>
                          <span>❤️ {story.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/*              FLOATING WHATSAPP CHATBOT SIMULATOR WIDGET                    */}
      {/* ========================================================================= */}
      {showWaWidget && (
        <div className="fixed bottom-6 right-6 w-full max-w-[340px] h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-150 flex flex-col overflow-hidden z-50 animate-slide-up">
          
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow">
                {mfr.logo}
              </div>
              <div>
                <div className="font-bold text-sm flex items-center gap-1">
                  {mfr.name}
                  <CheckCircle size={12} className="text-teal-400 fill-teal-400" />
                </div>
                <span className="text-[10px] text-teal-100 block">
                  {mfrIsTyping ? 'typing...' : 'Typically replies instantly'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowWaWidget(false)}
              className="text-teal-100 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Feed */}
          <div className="flex-1 bg-[#efeae2] p-4 overflow-y-auto space-y-3.5 relative">
            
            {/* Background design styling */}
            <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

            {/* Chat Messages */}
            {waMessages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] rounded-xl p-2.5 text-xs shadow-sm leading-normal flex flex-col relative ${msg.sender === 'user' ? 'bg-[#d9fdd3] text-gray-900 ml-auto' : 'bg-white text-gray-900 mr-auto'}`}
              >
                <p>{msg.text}</p>
                <div className="text-[9px] text-gray-400 text-right mt-1 font-mono flex items-center justify-end gap-1 select-none">
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && (
                    <span className="text-sky-500 font-bold">✔✔</span>
                  )}
                </div>
              </div>
            ))}

            {/* Simulated Typing Indicator */}
            {mfrIsTyping && (
              <div className="bg-white text-gray-500 rounded-xl p-2.5 text-xs shadow-sm mr-auto max-w-[80px] flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input & Click-To-Chat Redirector */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 shrink-0">
            <form onSubmit={handleSendWaMessage} className="flex gap-2 mb-2">
              <input
                type="text"
                value={waInput}
                onChange={(e) => setWaInput(e.target.value)}
                placeholder="Type wholesale message..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#075E54]/20 focus:border-[#075E54] bg-white font-medium"
              />
              <button
                type="submit"
                className="p-2 bg-[#075E54] hover:opacity-90 text-white rounded-xl transition shrink-0"
              >
                <Send size={15} />
              </button>
            </form>

            {/* REAL WHATSAPP DIRECT-LINK TRIGGERS */}
            <a
              href={`https://api.whatsapp.com/send?phone=${mfr.whatsapp.replace('+', '')}&text=${encodeURIComponent(waMessages[waMessages.length - 1]?.sender === 'user' ? waMessages[waMessages.length - 1].text : 'Hello! I am interested in wholesale partnerships.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg text-center flex items-center justify-center gap-1 transition shadow-sm"
            >
              <ExternalLink size={11} /> Redirect to Real WhatsApp
            </a>
          </div>

        </div>
      )}
    </div>
  );
}
