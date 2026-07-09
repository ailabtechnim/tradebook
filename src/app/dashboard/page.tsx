'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { orders, notifications } from '@/data/mockData';
import { ShoppingBag, Heart, Bell, Package, Truck, CheckCircle, Clock, Shield, DollarSign, TrendingUp, Users, MapPin, Star, Eye, ChevronRight, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user, manufacturers, isFollowing } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'following' | 'alerts'>('overview');

  const formatPrice = (price: number) => new Intl.NumberFormat('en-RW').format(price);
  const followedMfrs = manufacturers.filter(m => isFollowing(m.id));

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    completed: 'bg-green-100 text-green-700',
    disputed: 'bg-red-100 text-red-700',
  };

  const paymentStatusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    escrow: 'bg-blue-100 text-blue-700',
    released: 'bg-green-100 text-green-700',
    refunded: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-app py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {user?.name.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin size={12} /> {user?.location || 'Rwanda'}
                <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-semibold rounded-full">
                  {user?.type === 'retailer' ? '🏪 Retailer' : '🏭 Manufacturer'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Package size={20} />, value: orders.length, label: 'Active Orders', color: 'bg-blue-50 text-blue-600' },
            { icon: <Heart size={20} />, value: followedMfrs.length, label: 'Following', color: 'bg-pink-50 text-pink-600' },
            { icon: <Shield size={20} />, value: `${formatPrice(orders.reduce((sum, o) => sum + (o.paymentStatus === 'escrow' ? o.totalAmount : 0), 0))}`, label: 'In Escrow (RWF)', color: 'bg-amber-50 text-amber-600' },
            { icon: <Bell size={20} />, value: notifications.filter(n => !n.read).length, label: 'Notifications', color: 'bg-purple-50 text-purple-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>{stat.icon}</div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[
            { key: 'overview' as const, label: 'Overview' },
            { key: 'orders' as const, label: `Orders (${orders.length})` },
            { key: 'following' as const, label: `Following (${followedMfrs.length})` },
            { key: 'alerts' as const, label: 'Price Alerts' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${activeTab === tab.key ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs text-teal-600 hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center"><Package size={18} className="text-teal-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{order.manufacturerName}</p>
                      <p className="text-xs text-gray-500">{order.products.length} products • {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{formatPrice(order.totalAmount)} RWF</div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <span className="text-xs text-teal-600">Mark all read</span>
              </div>
              <div className="space-y-3">
                {notifications.slice(0, 4).map(notif => (
                  <div key={notif.id} className={`flex items-start gap-3 p-3 rounded-lg ${!notif.read ? 'bg-teal-50' : 'bg-gray-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${notif.type === 'price_drop' ? 'bg-green-100 text-green-600' : notif.type === 'group_buy' ? 'bg-blue-100 text-blue-600' : notif.type === 'order_update' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                      {notif.type === 'price_drop' ? '💰' : notif.type === 'group_buy' ? '🤝' : notif.type === 'order_update' ? '📦' : '🔔'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                    </div>
                    {!notif.read && <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">Order #{order.id.toUpperCase()}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}>{order.status}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${paymentStatusColors[order.paymentStatus]}`}>Payment: {order.paymentStatus}</span>
                    </div>
                    <p className="text-sm text-gray-500">From {order.manufacturerName} • {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">{formatPrice(order.totalAmount)} RWF</div>
                    {order.trackingNumber && <p className="text-xs text-gray-400">Tracking: {order.trackingNumber}</p>}
                  </div>
                </div>

                {/* Products */}
                <div className="space-y-2 mb-4">
                  {order.products.map(prod => (
                    <div key={prod.productId} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-sm">📦</div>
                      <span className="text-sm text-gray-700 flex-1">{prod.productName}</span>
                      <span className="text-sm text-gray-500">{prod.quantity} × {formatPrice(prod.unitPrice)}</span>
                      <span className="text-sm font-medium text-gray-900">{formatPrice(prod.totalPrice)} RWF</span>
                    </div>
                  ))}
                </div>

                {/* Escrow */}
                {order.paymentStatus === 'escrow' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                    <Shield size={16} className="text-blue-600" />
                    <span className="text-sm text-blue-700">{formatPrice(order.escrowDetails.amount)} RWF held in escrow • Released upon delivery confirmation</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Following Tab */}
        {activeTab === 'following' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <Link href={`/manufacturers/${mfr.id}`} className="flex-1 py-2 text-center text-xs font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition">
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No manufacturers followed yet</h3>
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
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Price Alerts</h3>
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
