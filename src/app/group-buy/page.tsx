'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { groupBuys } from '@/data/mockData';
import { Clock, MapPin, Users, Package, ArrowRight, TrendingDown, Shield, CheckCircle } from 'lucide-react';

export default function GroupBuyPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'my'>('active');

  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="gradient-hero py-12">
        <div className="container-app text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur rounded-full text-teal-100 text-sm mb-4">
            <Users size={14} /> Save up to 30% with Group Buying
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">🤝 Group Buying</h1>
          <p className="text-teal-100 max-w-lg mx-auto mb-6">Pool your orders with other retailers to unlock bulk discounts. Small orders, big savings.</p>

          {/* How it works */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
            {[
              { icon: <Users size={24} />, title: 'Join a Group', desc: 'Find a group buy for products you need' },
              { icon: <Package size={24} />, title: 'Add Your Order', desc: 'Specify your quantity and commit' },
              { icon: <TrendingDown size={24} />, title: 'Unlock Savings', desc: 'When target is met, everyone saves' },
            ].map(step => (
              <div key={step.title} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="text-teal-300 mb-2 flex justify-center">{step.icon}</div>
                <h3 className="text-white font-semibold text-sm mb-1">{step.title}</h3>
                <p className="text-teal-200 text-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-app py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'active' as const, label: 'Active Group Buys', count: groupBuys.filter(g => g.status === 'active').length },
            { key: 'completed' as const, label: 'Completed', count: 0 },
            { key: 'my' as const, label: 'My Groups', count: 0 },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.key ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
              {tab.label} <span className="ml-1 text-xs opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Group Buys */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupBuys.filter(g => activeTab === 'active' ? g.status === 'active' : false).map(gb => {
            const progress = Math.round((gb.currentQuantity / gb.targetQuantity) * 100);
            const groupPrice = Math.round(gb.wholesalePrice * (1 - gb.savingsPercent / 100));

            return (
              <div key={gb.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl shrink-0">📦</div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900 truncate">{gb.productName}</h3>
                      <p className="text-xs text-gray-500">by {gb.manufacturerName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={10} className="text-gray-400" />
                        <span className="text-xs text-gray-400">{gb.location}</span>
                      </div>
                    </div>
                    <div className="badge-verified text-xs">{gb.status.toUpperCase()}</div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-600">{gb.currentParticipants} of {gb.minParticipants} participants</span>
                      <span className="font-bold text-teal-600">{gb.savingsPercent}% OFF</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{gb.currentQuantity} / {gb.targetQuantity} units</span>
                      <span>{progress}% complete</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-gray-400 mb-0.5">Regular Wholesale</div>
                        <div className="text-sm text-gray-500 line-through">{formatPrice(gb.wholesalePrice)} RWF</div>
                      </div>
                      <ArrowRight size={16} className="text-teal-600" />
                      <div className="text-right">
                        <div className="text-xs text-gray-400 mb-0.5">Group Price</div>
                        <div className="text-xl font-bold text-green-600">{formatPrice(groupPrice)} RWF</div>
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-sm font-medium text-green-600">You save {formatPrice(gb.wholesalePrice - groupPrice)} RWF per unit!</span>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Participants</h4>
                    <div className="space-y-2">
                      {gb.participants.slice(0, 3).map(p => (
                        <div key={p.userId} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 text-xs font-bold">{p.userName.charAt(0)}</div>
                            <span className="text-gray-700">{p.userName}</span>
                          </div>
                          <span className="text-gray-500">{p.quantity} units</span>
                        </div>
                      ))}
                      {gb.participants.length > 3 && (
                        <div className="text-xs text-teal-600 font-medium">+{gb.participants.length - 3} more participants</div>
                      )}
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock size={14} />
                    <span>Ends {new Date(gb.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  {/* Action */}
                  <button className="w-full py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2">
                    <CheckCircle size={18} /> Join This Group Buy
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {activeTab !== 'active' && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'completed' ? 'No completed group buys yet' : 'You haven\'t joined any group buys yet'}
            </h3>
            <p className="text-gray-500 text-sm mb-4">Browse active group buys and start saving!</p>
            <button onClick={() => setActiveTab('active')} className="px-6 py-2.5 gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition">
              View Active Group Buys
            </button>
          </div>
        )}

        {/* Benefits */}
        <div className="mt-12 bg-white rounded-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Group Buy?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <TrendingDown size={28} />, title: 'Lower Prices', desc: 'Combine orders with other retailers to hit bulk quantity thresholds and unlock wholesale discounts.' },
              { icon: <Users size={28} />, title: 'Community Power', desc: 'Small retailers can compete with big buyers by pooling their purchasing power together.' },
              { icon: <Shield size={28} />, title: 'Safe & Secure', desc: 'Escrow protection ensures your money is safe. Payments released only after delivery confirmation.' },
            ].map(benefit => (
              <div key={benefit.title} className="text-center p-4">
                <div className="text-teal-600 mb-3 flex justify-center">{benefit.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-500 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
