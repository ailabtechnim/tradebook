'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ShoppingBag, Heart, Bell, Package, Truck, CheckCircle, Clock, Shield,
  DollarSign, TrendingUp, Users, MapPin, Star, Eye, ChevronRight, ArrowRight,
  AlertTriangle, X, Check, LogIn, Store, Building2, Plus, Loader2
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoggedIn, authHydrated, manufacturers, isFollowing, orders, confirmDelivery, disputeOrder, notifications, unreadCount, markAllAsRead, setShowAuthModal, setAuthModalType } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'following' | 'alerts'>('overview');

  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);
  const followedMfrs = manufacturers.filter(m => isFollowing(m.id));

  // Role-aware order scoping: retailers see their purchases, manufacturers
  // see incoming orders for THEIR company.
  const isManufacturer = user?.type === 'manufacturer';
  const myOrders = user
    ? orders.filter(o => (isManufacturer ? o.manufacturerId === user.manufacturerId : o.buyerId === user.id))
    : [];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    disputed: 'bg-red-100 text-red-700 border border-red-200',
  };

  const paymentStatusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    escrow: 'bg-blue-100 text-blue-700 border border-blue-200',
    released: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    refunded: 'bg-red-100 text-red-700',
  };

  // Wait for session hydration to avoid flashing the wrong state.
  if (!authHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="text-teal-600 animate-spin" />
      </div>
    );
  }

  // Auth gate: the dashboard is personal — anonymous users must sign in.
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md mx-4 animate-fade-in">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-5">
            <LogIn size={28} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Sign in to view your dashboard</h1>
          <p className="text-sm text-gray-500 mb-6">Your orders, followed manufacturers, notifications and escrow controls live here — they belong to your account.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => { setAuthModalType('login'); setShowAuthModal(true); }} className="px-6 py-3 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition">
              Sign In
            </button>
            <button onClick={() => { setAuthModalType('register'); setShowAuthModal(true); }} className="px-6 py-3 bg-white border border-teal-200 text-teal-700 text-sm font-semibold rounded-xl hover:bg-teal-50 transition">
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-app py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                {user?.name.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin size={12} className="text-gray-400" /> {user?.location || 'Rwanda'}
                  <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-semibold rounded-full">
                    {user?.type === 'retailer' ? '🏪 Retailer' : '🏭 Manufacturer'}
                  </span>
                </p>
              </div>
            </div>

            {/* Manufacturer quick links to their own catalog */}
            {isManufacturer && (
              <div className="flex gap-2">
                {user.manufacturerId ? (
                  <Link href={`/manufacturers/${user.manufacturerId}`} className="inline-flex items-center gap-2 px-4 py-2.5 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-95 transition shadow-sm">
                    <Building2 size={16} /> Manage My Catalog
                  </Link>
                ) : (
                  <Link href="/manufacturers/onboarding" className="inline-flex items-center gap-2 px-4 py-2.5 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-95 transition shadow-sm">
                    <Plus size={16} /> Complete Factory Profile
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-app py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Package size={20} />, value: myOrders.length, label: isManufacturer ? 'Incoming Orders' : 'Total Orders', color: 'bg-blue-50 text-blue-600' },
            ...(isManufacturer
              ? [{ icon: <Store size={20} />, value: user?.manufacturerId ? 1 : 0, label: 'Live Catalog', color: 'bg-teal-50 text-teal-600' }]
              : [{ icon: <Heart size={20} />, value: followedMfrs.length, label: 'Following', color: 'bg-pink-50 text-pink-600' }]),
            {
              icon: <Shield size={20} />,
              value: `${formatPrice(myOrders.reduce((sum, o) => sum + (o.paymentStatus === 'escrow' && o.status !== 'completed' ? o.totalAmount : 0), 0))} RWF`,
              label: isManufacturer ? 'Pending in Escrow' : 'Secured in Escrow',
              color: 'bg-amber-50 text-amber-600'
            },
            { icon: <Bell size={20} />, value: unreadCount, label: 'Notifications', color: 'bg-purple-50 text-purple-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>{stat.icon}</div>
              <div className="text-lg md:text-xl font-bold text-gray-900 truncate">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[
            { key: 'overview' as const, label: 'Overview' },
            { key: 'orders' as const, label: `${isManufacturer ? 'Incoming Orders' : 'Orders'} (${myOrders.length})` },
            { key: 'following' as const, label: `Following (${followedMfrs.length})` },
            { key: 'alerts' as const, label: 'Price Alerts' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-3">
                <h3 className="font-bold text-gray-900">Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-semibold text-teal-600 hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {myOrders.length === 0 ? (
                  <div className="text-center py-6 text-sm text-gray-400">
                    {isManufacturer ? 'No incoming orders yet — retailers will appear here once they order from you.' : 'No recent orders found.'}
                  </div>
                ) : (
                  myOrders.slice(0, 3).map(order => (
                    <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100/50">
                      <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center border border-teal-100">
                        <Package size={18} className="text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{order.manufacturerName}</p>
                        <p className="text-xs text-gray-500">{order.products.length} products • {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-gray-900">{formatPrice(order.totalAmount)} RWF</div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${statusColors[order.status] || 'bg-gray-100'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-3">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <button onClick={markAllAsRead} className="text-xs font-semibold text-teal-600 hover:underline">Mark all read</button>
              </div>
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-sm text-gray-400">No notifications yet — order updates and price alerts will appear here.</div>
                ) : (
                notifications.slice(0, 4).map(notif => (
                  <div key={notif.id} className={`flex items-start gap-3 p-3 rounded-xl border ${!notif.read ? 'bg-teal-50/40 border-teal-100' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${notif.type === 'price_drop' ? 'bg-green-100 text-green-600' : notif.type === 'group_buy' ? 'bg-blue-100 text-blue-600' : notif.type === 'order_update' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                      {notif.type === 'price_drop' ? '💰' : notif.type === 'group_buy' ? '🤝' : notif.type === 'order_update' ? '📦' : '🔔'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{notif.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                    </div>
                    {!notif.read && <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 shrink-0"></div>}
                  </div>
                ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fade-in">
            {myOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">{isManufacturer ? 'No incoming orders yet' : 'No orders placed yet'}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {isManufacturer
                    ? 'When retailers order from your catalog, the orders will appear here for fulfillment.'
                    : 'Your wholesale orders with secure escrow protection will appear here.'}
                </p>
                {isManufacturer ? (
                  user.manufacturerId ? (
                    <Link href={`/manufacturers/${user.manufacturerId}`} className="inline-flex items-center gap-2 px-6 py-2.5 gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition">
                      Open My Catalog <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <Link href="/manufacturers/onboarding" className="inline-flex items-center gap-2 px-6 py-2.5 gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition">
                      Complete Factory Profile <ArrowRight size={16} />
                    </Link>
                  )
                ) : (
                  <Link href="/products" className="inline-flex items-center gap-2 px-6 py-2.5 gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition">
                    Browse Wholesale Products <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            ) : (
              myOrders.map(order => (
                <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-gray-150 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="font-bold text-gray-900 text-base">Order #{order.id.toUpperCase()}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusColors[order.status] || 'bg-gray-100'}`}>
                          {order.status}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${paymentStatusColors[order.paymentStatus] || 'bg-gray-100'}`}>
                          Escrow: {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-600">From {order.manufacturerName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-lg font-bold text-teal-700">{formatPrice(order.totalAmount)} RWF</div>
                      {order.trackingNumber && <p className="text-xs text-gray-400 mt-1">Tracking ID: <span className="font-mono font-semibold">{order.trackingNumber}</span></p>}
                    </div>
                  </div>

                  {/* Products */}
                  <div className="space-y-2.5 mb-4">
                    {order.products.map(prod => (
                      <div key={prod.productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-teal-50 border rounded flex items-center justify-center text-sm font-bold shrink-0">📦</div>
                        <span className="text-sm font-semibold text-gray-800 flex-1 truncate">{prod.productName}</span>
                        <span className="text-xs text-gray-500 shrink-0">{prod.quantity} × {formatPrice(prod.unitPrice)} RWF</span>
                        <span className="text-sm font-bold text-gray-900 shrink-0">{formatPrice(prod.totalPrice)} RWF</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Location */}
                  <div className="text-xs text-gray-500 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 flex items-center gap-1.5 mb-4">
                    <MapPin size={13} className="text-gray-400" />
                    <span><strong>Delivery:</strong> {order.shippingAddress}</span>
                  </div>

                  {/* Interactive Escrow Controls — only the BUYER can
                      release or dispute; the seller just sees the lock. */}
                  {isManufacturer && order.paymentStatus === 'escrow' && order.status !== 'completed' && order.status !== 'disputed' && (
                    <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 space-y-2">
                      <div className="flex items-start gap-2.5">
                        <Shield size={18} className="text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-blue-900">🔒 Buyer payment secured in escrow</p>
                          <p className="text-[11px] text-blue-700 mt-0.5 leading-relaxed">
                            Fulfill this order and share tracking updates with <strong>{order.buyerName}</strong>. Funds release automatically when the buyer confirms delivery.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isManufacturer && order.paymentStatus === 'escrow' && order.status !== 'completed' && order.status !== 'disputed' && (
                    <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 space-y-4">
                      <div className="flex items-start gap-2.5">
                        <Shield size={18} className="text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-amber-900">🛡️ Protected by TradeBook Escrow</p>
                          <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                            Your payment is held securely. Please inspect and confirm receipt of goods from <strong>{order.manufacturerName}</strong> before releasing funds.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to release the escrowed funds to the manufacturer? Only do this if you have physically received and verified the wholesale products.')) {
                              confirmDelivery(order.id);
                            }
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <Check size={14} /> Confirm Delivery (Release Funds)
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to open a dispute? This locks the escrowed funds indefinitely. A TradeBook mediator will contact you and the manufacturer within 24 hours to review your claim.')) {
                              disputeOrder(order.id);
                            }
                          }}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <AlertTriangle size={14} /> Dispute Order
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Finalized Escrow Status display */}
                  {order.paymentStatus === 'released' && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center gap-2 text-xs text-emerald-800">
                      <CheckCircle size={15} className="text-emerald-600" />
                      <span><strong>Escrow Released:</strong> Funds have been successfully deposited to the manufacturer&apos;s bank ledger.</span>
                    </div>
                  )}

                  {order.status === 'disputed' && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-2 text-xs text-red-800">
                      <AlertTriangle size={15} className="text-red-600" />
                      <span><strong>Dispute Open:</strong> A TradeBook agent is conducting a review of your order. Escrow remains LOCKED.</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Following Tab */}
        {activeTab === 'following' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {followedMfrs.map(mfr => (
              <div key={mfr.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">{mfr.logo}</div>
                  <div className="min-w-0">
                    <Link href={`/manufacturers/${mfr.id}`} className="font-bold text-gray-900 hover:text-teal-700 transition text-sm truncate block">{mfr.name}</Link>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star size={10} className="text-amber-400 fill-amber-400" /> {mfr.rating}
                      <span className="mx-1">•</span>
                      <MapPin size={10} /> {mfr.city}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{mfr.description}</p>
                <div className="flex gap-2">
                  <Link href={`/manufacturers/${mfr.id}`} className="flex-1 py-2 text-center text-xs font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition">
                    View Products
                  </Link>
                  <Link href={`/manufacturers/${mfr.id}`} className="px-3 py-2 text-xs text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <Eye size={14} />
                  </Link>
                </div>
              </div>
            ))}
            {followedMfrs.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No manufacturers followed yet</h3>
                <p className="text-gray-500 text-sm mb-4">Follow manufacturers to get price alerts and updates</p>
                <Link href="/manufacturers" className="inline-flex items-center gap-2 px-6 py-2.5 gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition">
                  Browse Manufacturers <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Price Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Price Alerts</h3>
            <p className="text-gray-500 text-sm mb-4">Set alerts for products you&apos;re interested in. Get notified when prices drop!</p>
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-2.5 gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition">
              Browse Products <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
