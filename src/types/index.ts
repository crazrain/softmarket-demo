export type Category =
  | 'Productivity'
  | 'Developer Tools'
  | 'Graphics'
  | 'Video'
  | 'Audio'
  | 'AI'
  | 'Security'
  | 'System Utilities';

export type Platform = 'Windows' | 'macOS' | 'Linux';

export type ProductStatus = 'Draft' | 'Review' | 'Published' | 'Suspended';

export type SortOption =
  | 'Featured'
  | 'MostPopular'
  | 'HighestRated'
  | 'Newest'
  | 'PriceLowHigh'
  | 'PriceHighLow';

export type LicenseType = 'Single' | 'Team' | 'Enterprise';

export type PurchaseStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded';

export type SaleStatus = 'Completed' | 'Pending' | 'Refunded';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'buyer' | 'seller' | 'admin';
  joinDate: string;
}

export interface Developer {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  productCount: number;
  averageRating: number;
}

export interface ProductVersion {
  version: string;
  date: string;
  notes: string[];
}

export interface SystemRequirements {
  windows?: {
    os: string;
    cpu: string;
    ram: string;
    storage: string;
    architecture: string;
  };
  macos?: {
    os: string;
    cpu: string;
    ram: string;
    storage: string;
    architecture: string;
  };
  linux?: {
    os: string;
    cpu: string;
    ram: string;
    storage: string;
    architecture: string;
  };
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  content: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  developerId: string;
  category: Category;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  platforms: Platform[];
  screenshots: string[];
  icon: string;
  versions: ProductVersion[];
  requirements: SystemRequirements;
  status: ProductStatus;
  features: { icon: string; title: string; description: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  tax: number;
  status: PurchaseStatus;
  date: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'sale' | 'review' | 'system';
  title: string;
  message: string;
  read: boolean;
  date: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  status: SaleStatus;
  date: string;
}

export interface FilterOptions {
  category: Category | 'All';
  priceRange: string;
  platforms: Platform[];
  rating: number | null;
  search: string;
  sort: SortOption;
}

export interface ProductFormData {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: Category;
  price: number | null;
  platforms: Platform[];
  screenshots: string[];
  version: string;
  releaseNotes: string;
  requirements: Partial<SystemRequirements>;
}
