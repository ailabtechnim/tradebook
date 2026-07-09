'use client';

import React from 'react';
import Link from 'next/link';
import { stories } from '@/data/mockData';
import { Eye, Heart, MessageCircle, Play, Calendar, Tag, ArrowRight } from 'lucide-react';

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="gradient-hero py-12">
        <div className="container-app text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur rounded-full text-teal-100 text-sm mb-4">
            📱 Manufacturer Stories
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Behind the Products</h1>
          <p className="text-teal-100 max-w-lg mx-auto">See how your favorite products are made. Stories from Rwanda&apos;s top manufacturers — real people, real processes, real quality.</p>
        </div>
      </div>

      <div className="container-app py-8">
        {/* Featured Story */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 mb-8 hover:shadow-lg transition-shadow">
          <div className="grid md:grid-cols-2">
            <div className="relative h-64 md:h-auto bg-gray-200">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg flex items-center gap-1"><Play size={12} /> FEATURED</span>
              </div>
              <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-6xl">
                🏭
              </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{stories[0].manufacturerLogo}</span>
                <span className="font-medium text-gray-700">{stories[0].manufacturerName}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{stories[0].title}</h2>
              <p className="text-gray-500 mb-4">{stories[0].description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                <span className="flex items-center gap-1"><Eye size={14} /> {stories[0].views.toLocaleString()} views</span>
                <span className="flex items-center gap-1"><Heart size={14} /> {stories[0].likes} likes</span>
                <span className="flex items-center gap-1"><MessageCircle size={14} /> {stories[0].comments} comments</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {stories[0].tags.map(tag => (
                  <span key={tag} className="tag tag-teal text-xs">#{tag}</span>
                ))}
              </div>
              <button className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition w-fit">
                <Play size={18} /> Watch Story
              </button>
            </div>
          </div>
        </div>

        {/* All Stories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map(story => (
            <div key={story.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow card-hover group">
              <div className="relative h-48 bg-gray-200">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl">
                  {story.mediaType === 'video' ? '🎬' : '📸'}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                {story.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:bg-white/30 transition">
                      <Play size={24} className="text-white ml-1" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="text-lg">{story.manufacturerLogo}</span>
                  <span className="text-white text-sm font-medium">{story.manufacturerName}</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur text-white text-[10px] font-medium rounded-full">
                    {story.mediaType === 'video' ? '▶ VIDEO' : '📸 IMAGE'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-teal-700 transition">{story.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{story.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {story.tags.map(tag => (
                    <span key={tag} className="tag text-[10px]">#{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye size={12} /> {story.views.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Heart size={12} /> {story.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={12} /> {story.comments}</span>
                  </div>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(story.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-white rounded-xl border border-gray-100 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Are You a Manufacturer?</h2>
          <p className="text-gray-500 max-w-lg mx-auto mb-6">Share your story with thousands of retailers. Show your production process, quality standards, and team. Build trust and attract more buyers.</p>
          <Link href="/manufacturers" className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition">
            Share Your Story <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
