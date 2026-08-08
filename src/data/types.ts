// TradeBook Data Types & Models

export interface Manufacturer {
  id: string;
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  description: string;
  longDescription: string;
  location: string;
  city: string;
  country: string;
  verified: boolean;
  premium: boolean;
  rating: number;
  reviewCount: number;
  followerCount: number;
  productCount: number;
  joinedDate: string;
  categories: string[];
  contactPhone: string;
  contactEmail: string;
  whatsapp: string;
  website: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  businessRegistration: string;
  established: string;
  employees: string;
  certifications: string[];
  story: Story | null;
  stats: {
    totalOrders: number;
    responseTime: string;
    fulfillmentRate: number;
    repeatBuyers: number;
  };
}

export interface Product {
  id: string;
  manufacturerId: string;
  manufacturerName: string;
  manufacturerLogo: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  images: string[];
  wholesalePrice: number;
  suggestedRetailPrice: number;
  currency: string;
  moq: number;
  unit: string;
  tieredPricing: TieredPrice[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  orderCount: number;
  tags: string[];
  specifications: Record<string, string>;
  shippingInfo: string;
  verified: boolean;
  priceGuaranteeDays: number;
  lastUpdated: string;
}

export interface TieredPrice {
  minQty: number;
  maxQty: number | null;
  price: number;
  label: string;
}

export interface Story {
  id: string;
  manufacturerId: string;
  manufacturerName: string;
  manufacturerLogo: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  tags: string[];
}

export interface GroupBuy {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  manufacturerId: string;
  manufacturerName: string;
  wholesalePrice: number;
  targetQuantity: number;
  currentQuantity: number;
  minParticipants: number;
  currentParticipants: number;
  deadline: string;
  status: 'active' | 'completed' | 'expired';
  participants: GroupBuyParticipant[];
  savingsPercent: number;
  createdBy: string;
  location: string;
}

export interface GroupBuyParticipant {
  userId: string;
  userName: string;
  quantity: number;
  joinedAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  manufacturerId: string;
  manufacturerName: string;
  products: OrderProduct[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'disputed';
  paymentStatus: 'pending' | 'escrow' | 'released' | 'refunded';
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  trackingNumber: string | null;
  escrowDetails: EscrowDetails;
}

export interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface EscrowDetails {
  amount: number;
  status: 'held' | 'released' | 'refunded';
  heldSince: string;
  releaseDate: string | null;
  conditions: string[];
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  manufacturerId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  images: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'manufacturer' | 'retailer' | 'buyer';
  avatar: string;
  location: string;
  followedManufacturers: string[];
  orders: string[];
  cart: CartItem[];
  joinedDate: string;
  verified: boolean;
  /** For manufacturer accounts: the id of the Manufacturer entity they own. */
  manufacturerId?: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  manufacturerId: string;
  manufacturerName: string;
  quantity: number;
  unitPrice: number;
  moq: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'price_drop' | 'group_buy' | 'order_update' | 'new_product' | 'story' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  targetPrice: number;
  currentPrice: number;
  active: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
  subcategories: string[];
}

export interface SearchFilters {
  query: string;
  category: string;
  location: string;
  priceMin: number;
  priceMax: number;
  rating: number;
  verified: boolean;
  inStock: boolean;
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest';
}
