import { describe, it, expect } from 'vitest';
import { productService } from '@/services';
import { products } from '@/data/mockData';

describe('productService', () => {
  it('getAll returns all products', async () => {
    const result = await productService.getAll();
    expect(result).toHaveLength(products.length);
  });

  it('getById returns a product by slug', async () => {
    const result = await productService.getBySlug('filescope');
    expect(result).toBeDefined();
    expect(result!.slug).toBe('filescope');
  });

  it('getById returns undefined for invalid slug', async () => {
    const result = await productService.getBySlug('nonexistent');
    expect(result).toBeUndefined();
  });

  it('search returns matching products by keyword', async () => {
    const result = await productService.search('code');
    expect(result.length).toBeGreaterThan(0);
    // CodePilot should match by name
    expect(result.some((p) => p.name === 'CodePilot')).toBe(true);
  });

  it('search returns empty array for no match', async () => {
    const result = await productService.search('zzzzzzzzz');
    expect(result).toHaveLength(0);
  });

  it('getFiltered filters by category', async () => {
    const result = await productService.getFiltered({
      category: 'Developer Tools',
      priceRange: '',
      platforms: [],
      rating: null,
      search: '',
      sort: 'Featured',
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.category === 'Developer Tools')).toBe(true);
  });

  it('getFiltered filters by priceRange Free', async () => {
    const result = await productService.getFiltered({
      category: 'All',
      priceRange: 'Free',
      platforms: [],
      rating: null,
      search: '',
      sort: 'Featured',
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.price === 0)).toBe(true);
  });

  it('getFiltered filters by priceRange Under $20', async () => {
    const result = await productService.getFiltered({
      category: 'All',
      priceRange: 'Under $20',
      platforms: [],
      rating: null,
      search: '',
      sort: 'Featured',
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.price > 0 && p.price < 20)).toBe(true);
  });

  it('getFiltered filters by platform', async () => {
    const result = await productService.getFiltered({
      category: 'All',
      priceRange: '',
      platforms: ['macOS'],
      rating: null,
      search: '',
      sort: 'Featured',
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.platforms.includes('macOS'))).toBe(true);
  });

  it('getFiltered sorts by price ascending', async () => {
    const result = await productService.getFiltered({
      category: 'All',
      priceRange: 'Under $20',
      platforms: [],
      rating: null,
      search: '',
      sort: 'PriceLowHigh',
    });
    for (let i = 1; i < result!.length; i++) {
      expect(result![i].price).toBeGreaterThanOrEqual(result![i - 1].price);
    }
  });

  it('getFiltered sorts by price descending', async () => {
    const result = await productService.getFiltered({
      category: 'All',
      priceRange: '$20–$50',
      platforms: [],
      rating: null,
      search: '',
      sort: 'PriceHighLow',
    });
    for (let i = 1; i < result!.length; i++) {
      expect(result[i].price).toBeLessThanOrEqual(result[i - 1].price);
    }
  });

  it('getFiltered sorts by rating descending', async () => {
    const result = await productService.getFiltered({
      category: 'All',
      priceRange: '',
      platforms: [],
      rating: null,
      search: '',
      sort: 'HighestRated',
    });
    for (let i = 1; i < result!.length; i++) {
      expect(result![i].rating).toBeLessThanOrEqual(result![i - 1].rating);
    }
  });

  it('getFiltered with combined filters works', async () => {
    const result = await productService.getFiltered({
      category: 'Developer Tools',
      priceRange: '$50+',
      platforms: ['Linux'],
      rating: 4,
      search: '',
      sort: 'HighestRated',
    });
    // CodePilot matches: Developer Tools, $50+, has Linux, rating 4.9
    expect(result.some((p) => p.name === 'CodePilot')).toBe(true);
  });
});
