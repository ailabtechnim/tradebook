// TradeBook Platform Reference Data — Rwanda & East Africa Focused
//
// IMPORTANT: This file intentionally contains NO demo users, manufacturers,
// products, stories, group buys, orders, reviews or notifications.
// The marketplace starts empty — every record you see at runtime was
// created by a REAL registered user through the onboarding flows.
// Only the industry category taxonomy (a platform constant) lives here.

import { Category } from './types';

// ============================================================
// CATEGORIES (platform taxonomy — not user data)
// productCount is computed dynamically from live products.
// ============================================================
export const categories: Category[] = [
  { id: '1', name: 'Food & Beverages', slug: 'food-beverages', icon: '🍎', productCount: 0, subcategories: ['Processed Foods', 'Beverages', 'Dairy', 'Spices', 'Snacks'] },
  { id: '2', name: 'Construction Materials', slug: 'construction', icon: '🏗️', productCount: 0, subcategories: ['Cement', 'Steel', 'Timber', 'Paint', 'Roofing'] },
  { id: '3', name: 'Textiles & Clothing', slug: 'textiles', icon: '👕', productCount: 0, subcategories: ['Fabric', 'Ready-Made', 'Accessories', 'Uniforms'] },
  { id: '4', name: 'Agriculture', slug: 'agriculture', icon: '🌾', productCount: 0, subcategories: ['Seeds', 'Fertilizers', 'Tools', 'Irrigation'] },
  { id: '5', name: 'Electronics', slug: 'electronics', icon: '📱', productCount: 0, subcategories: ['Solar', 'Batteries', 'Accessories', 'Appliances'] },
  { id: '6', name: 'Household Goods', slug: 'household', icon: '🏠', productCount: 0, subcategories: ['Cleaning', 'Kitchen', 'Furniture', 'Decor'] },
  { id: '7', name: 'Health & Beauty', slug: 'health-beauty', icon: '💊', productCount: 0, subcategories: ['Skincare', 'Haircare', 'Supplements', 'Hygiene'] },
  { id: '8', name: 'Packaging & Supplies', slug: 'packaging', icon: '📦', productCount: 0, subcategories: ['Bags', 'Boxes', 'Labels', 'Wrapping'] },
];
