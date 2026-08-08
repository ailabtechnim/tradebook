'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Clock, MapPin, Users, Package, ArrowRight, TrendingDown, Shield, CheckCircle, ArrowLeft } from 'lucide-react';

export default function GroupBuyPage() {
  const { groupBuys, user, joinGroupBuy, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'my'>('active');
  const [joinTarget, setJoinTarget] = useState<string | null>(null);
  const [joinQty, setJoinQty] = useState('');

  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);

  const visibleBuys = groupBuys.filter(gb => {
    if (activeTab === 'active') return gb.status === 'active';
    if (activeTab === 'completed') return gb.status === 'completed';
    // "My Groups": anything the signed-in retailer created or participates in
    return !!user && (gb.createdBy === user.id || gb.participants.some(p => p.userId === user.id));
  });

  const counts = {
    active: groupBuys.filter(g => g.status === 'active').length,
    completed: groupBuys.filter(g => g.status === 'completed').length,
    my: user ? groupBuys.filter(g => g.createdBy === user.id || g.participants.some(p => p.userId === user.id)).length : 0,
  };

  const handleJoin = (gbId: string) => {
    const qty = parseInt(joinQty, 10);
    if (!qty || qty <= 0) {
      showToast('Enter how many units you want to commit.', 'error');
      return;
    }
    const ok = joinGroupBuy(gbId, qty);
    if (ok) {
      setJoinTarget(null);
      setJoinQty('');
    }
  };

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
            { key: 'active' as const, label: 'Active Group Buys', count: counts.active },
            { key: 'completed' as const, label: 'Completed', count: counts.completed },
            { key: 'my' as const, label: 'My Groups', count: counts.my },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.key ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
              {tab.label} <span className="ml-1 text-xs opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {visibleBuys.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'completed'
                ? 'No completed group buys yet'
                : activeTab === 'my'
                  ? (user ? 'You haven\'t joined any group buys yet' : 'Sign in to see your group buys')
                  : 'No active group buys yet'}
            </h3>
            <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
              {activeTab === 'active'
                ? 'Group buys are created by real retailers from any product page. Be the first: open a listed product and tap "Start Group Buy".'
                : 'Browse active group buys and start saving!'}
            </p>
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-2.5 gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition">
              Browse Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleBuys.map(gb => {
              const progress = Math.round((gb.currentQuantity / gb.targetQuantity) * 100);
              const groupPrice = Math.round(gb.wholesalePrice * (1 - gb.savingsPercent / 100));
              const myEntry = user ? gb.participants.find(p => p.userId === user.id) : undefined;

              return (
                <div key={gb.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl shrink-0">📦</div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/products/${gb.productId}`} className="font-bold text-gray-900 hover:text-teal-700 truncate block">{gb.productName}</Link>
                        <p className="text-xs text-gray-500">by {gb.manufacturerName}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-400">{gb.location}</span>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-lg font-bold ${gb.status === 'active' ? 'bg-teal-50 text-teal-700' : 'bg-green-50 text-green-700'}`}>
                        {gb.status.toUpperCase()}
                      </div>
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
                    {gb.participants.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Participants</h4>
                        <div className="space-y-2">
                          {gb.participants.slice(0, 3).map(p => (
                            <div key={p.userId} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 text-xs font-bold">{p.userName.charAt(0)}</div>
                                <span className="text-gray-700">{p.userName}{user?.id === p.userId ? ' (you)' : ''}</span>
                              </div>
                              <span className="text-gray-500">{p.quantity} units</span>
                            </div>
                          ))}
                          {gb.participants.length > 3 && (
                            <div className="text-xs text-teal-600 font-medium">+{gb.participants.length - 3} more participants</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Deadline */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Clock size={14} />
                      <span>Ends {new Date(gb.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {/* Join action */}
                    {gb.status === 'active' && (
                      joinTarget === gb.id ? (
                        <div className="space-y-2 animate-fade-in">
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min={1}
                              value={joinQty}
                              onChange={(e) => setJoinQty(e.target.value)}
                              placeholder="Units to commit"
                              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            />
                            <button onClick={() => handleJoin(gb.id)} className="px-4 py-2.5 gradient-primary text-white text-sm font-bold rounded-xl hover:opacity-90 transition">
                              Commit
                            </button>
                          </div>
                          <button onClick={() => { setJoinTarget(null); setJoinQty(''); }} className="w-full text-center text-xs text-gray-400 hover:text-gray-600">
                            <ArrowLeft size={11} className="inline mr-1" />Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setJoinTarget(gb.id)} className="w-full py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2">
                          <CheckCircle size={18} /> {myEntry ? `Add More Units (you have ${myEntry.quantity})` : 'Join This Group Buy'}
                        </button>
                      )
                    )}

                    {gb.status === 'completed' && (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2 text-xs text-green-800">
                        <CheckCircle size={15} className="text-green-600 shrink-0" />
                        <span><strong>Target reached!</strong> All participants get the group price of {formatPrice(groupPrice)} RWF/unit.</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
