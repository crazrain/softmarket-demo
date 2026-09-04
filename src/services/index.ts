import { products, reviews, mockSales } from '@/data/mockData';
import type { Product, Review, Sale, ProductFormData, FilterOptions } from '@/types';

// Simulate async delay
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const publishedProducts = () =>
  products.filter((p) => p.status === 'Published');

export const productService = {
  async getAll(): Promise<Product[]> {
    await delay();
    return publishedProducts();
  },
  async getById(id: string): Promise<Product | undefined> {
    await delay(200);
    return products.find((p) => p.id === id);
  },
  async getBySlug(slug: string): Promise<Product | undefined> {
    await delay(200);
    return products.find((p) => p.slug === slug);
  },
  async search(query: string): Promise<Product[]> {
    await delay(200);
    const q = query.toLowerCase();
    return publishedProducts().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  },
  async getFiltered(filters: FilterOptions): Promise<Product[]> {
    await delay(200);
    let result = publishedProducts();
    if (filters.category !== 'All') result = result.filter((p) => p.category === filters.category);
    if (filters.priceRange === 'Free') result = result.filter((p) => p.price === 0);
    else if (filters.priceRange === 'Under $20') result = result.filter((p) => p.price > 0 && p.price < 20);
    else if (filters.priceRange === '$20–$50') result = result.filter((p) => p.price >= 20 && p.price <= 50);
    else if (filters.priceRange === '$50+') result = result.filter((p) => p.price > 50);
    if (filters.platforms.length > 0) result = result.filter((p) => filters.platforms.some((pl) => p.platforms.includes(pl)));
    if (filters.rating) result = result.filter((p) => p.rating >= filters.rating!);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    switch (filters.sort) {
      case 'MostPopular': result.sort((a, b) => b.salesCount - a.salesCount); break;
      case 'HighestRated': result.sort((a, b) => b.rating - a.rating); break;
      case 'Newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'PriceLowHigh': result.sort((a, b) => a.price - b.price); break;
      case 'PriceHighLow': result.sort((a, b) => b.price - a.price); break;
      default: break;
    }
    return result;
  },
};

let draftProducts: Product[] = [];

export const sellerService = {
  async getProducts(): Promise<Product[]> {
    await delay(200);
    return [...draftProducts, ...products.filter((p) => p.developerId === 'd1' && p.status === 'Published')];
  },
  async getDrafts(): Promise<Product[]> {
    await delay(100);
    return draftProducts;
  },
  async createProduct(data: ProductFormData): Promise<Product> {
    await delay(400);
    const product: Product = {
      id: `draft-${Date.now()}`,
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      tagline: data.tagline,
      description: data.description,
      developerId: 'd1',
      category: data.category,
      price: data.price ?? 0,
      currency: 'USD',
      rating: 0,
      reviewCount: 0,
      salesCount: 0,
      platforms: data.platforms,
      screenshots: data.screenshots,
      icon: '📦',
      versions: [{ version: data.version, date: new Date().toISOString().split('T')[0], notes: data.releaseNotes ? data.releaseNotes.split('\n') : ['Initial version'] }],
      requirements: data.requirements as any,
      status: 'Draft',
      features: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    draftProducts.push(product);
    return product;
  },
  async updateProduct(id: string, data: ProductFormData): Promise<Product> {
    await delay(300);
    const idx = draftProducts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      draftProducts[idx] = { ...draftProducts[idx], ...data, updatedAt: new Date().toISOString().split('T')[0] } as Product;
      return draftProducts[idx];
    }
    const idx2 = products.findIndex((p) => p.id === id);
    if (idx2 !== -1) {
      products[idx2] = { ...products[idx2], ...data, updatedAt: new Date().toISOString().split('T')[0] } as Product;
      return products[idx2];
    }
    throw new Error('Product not found');
  },
  async publishProduct(id: string): Promise<Product> {
    await delay(300);
    const idx = draftProducts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      draftProducts[idx].status = 'Published';
      draftProducts[idx].updatedAt = new Date().toISOString().split('T')[0];
      return draftProducts[idx];
    }
    throw new Error('Product not found');
  },
  async getSales(): Promise<Sale[]> {
    await delay(200);
    return mockSales;
  },
  async getDashboardStats(): Promise<{ totalRevenue: number; totalSales: number; activeProducts: number; avgRating: number }> {
    await delay(300);
    const completed = mockSales.filter((s) => s.status === 'Completed');
    const revenue = completed.reduce((sum, s) => sum + s.amount, 0);
    return { totalRevenue: revenue, totalSales: completed.length, activeProducts: 7, avgRating: 4.7 };
  },
};

export const reviewService = {
  async getByProduct(productId: string): Promise<Review[]> {
    await delay(200);
    return reviews.filter((r) => r.productId === productId);
  },
};

export const orderService = {
  async purchase(_productId: string, _productName: string, price: number): Promise<{ id: string; total: number; tax: number; success: boolean }> {
    await delay(500);
    const tax = Math.round(price * 0.1 * 100) / 100;
    return { id: `ord-${Date.now()}`, total: price + tax, tax, success: true };
  },
};
