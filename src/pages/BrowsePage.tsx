import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '@/services';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Badge from '@/components/Badge';
import type { Product, FilterOptions, Category, Platform } from '@/types';

const categories: Category[] = ['Productivity', 'Developer Tools', 'Graphics', 'Video', 'Audio', 'AI', 'Security', 'System Utilities'];
const platforms: Platform[] = ['Windows', 'macOS', 'Linux'];
const priceRanges = ['Free', 'Under $20', '$20–$50', '$50+'];
const sortOptions: FilterOptions['sort'][] = ['Featured', 'MostPopular', 'HighestRated', 'Newest', 'PriceLowHigh', 'PriceHighLow'];
const ratingOptions: { label: string; value: number | null }[] = [
  { label: 'All ratings', value: null },
  { label: '4+ Stars', value: 4 },
  { label: '4.5+ Stars', value: 4.5 },
];

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterOptions>({
    category: (searchParams.get('category') as Category | 'All') || 'All',
    priceRange: searchParams.get('price') || '',
    platforms: (searchParams.get('platforms')?.split(',') as Platform[]) || [],
    rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : null,
    search: searchParams.get('q') || '',
    sort: (searchParams.get('sort') as FilterOptions['sort']) || 'Featured',
  });

  useEffect(() => {
    setLoading(true);
    productService.getFiltered(filters).then((data) => { setProducts(data); setLoading(false); });
  }, [filters]);

  const updateFilter = (key: string, value: string | string[]) => {
    const next = { ...filters };
    if (key === 'platforms') {
      const arr = typeof value === 'string' ? value.split(',') as Platform[] : value as Platform[];
      next.platforms = arr;
    } else {
      (next as Record<string, any>)[key] = value;
    }
    setFilters(next);
    const params = new URLSearchParams();
    if (next.category !== 'All') params.set('category', next.category);
    if (next.priceRange) params.set('price', next.priceRange);
    if (next.platforms.length > 0) params.set('platforms', next.platforms.join(','));
    if (next.rating) params.set('rating', String(next.rating));
    if (next.search) params.set('q', next.search);
    if (next.sort !== 'Featured') params.set('sort', next.sort);
    setSearchParams(params);
  };

  const togglePlatform = (p: Platform) => {
    const next = filters.platforms.includes(p) ? filters.platforms.filter(x => x !== p) : [...filters.platforms, p];
    updateFilter('platforms', next);
  };

  const filtered = useMemo(() => products.length, [products]);

  return (
    <div className="min-h-screen bg-surface-50 py-8 dark:bg-surface-950">
      <div className="container-narrow">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Browse Software</h1>
            <p className="text-sm text-surface-500">{filtered} results found</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="sort-select" className="text-sm text-surface-600">Sort by:</label>
            <select id="sort-select" value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="input-field !py-2 !text-sm w-48">
              {sortOptions.map(s => <option key={s} value={s}>{s === 'PriceLowHigh' ? 'Price: Low to High' : s === 'PriceHighLow' ? 'Price: High to Low' : s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-60 shrink-0 space-y-6">
            {/* Category */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-surface-900">Category</h3>
              <div className="space-y-1">
                <button onClick={() => updateFilter('category', 'All')} className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${filters.category === 'All' ? 'bg-primary-50 font-semibold text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'text-surface-600 hover:bg-surface-100'}`}>All</button>
                {categories.map(cat => (
                  <button key={cat} onClick={() => updateFilter('category', cat)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${filters.category === cat ? 'bg-primary-50 font-semibold text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'text-surface-600 hover:bg-surface-100'}`}>{cat}</button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-surface-900">Price</h3>
              <div className="space-y-1">
                {priceRanges.map(pr => (
                  <button key={pr} onClick={() => updateFilter('priceRange', pr === filters.priceRange ? '' : pr)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${filters.priceRange === pr ? 'bg-primary-50 font-semibold text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'text-surface-600 hover:bg-surface-100'}`}>{pr}</button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-surface-900">Platform</h3>
              <div className="space-y-2">
                {platforms.map(p => (
                  <label key={p} className="flex items-center gap-2 text-sm text-surface-700">
                    <input type="checkbox" checked={filters.platforms.includes(p)} onChange={() => togglePlatform(p)} className="rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-surface-900">Rating</h3>
              <select value={filters.rating ?? ''} onChange={(e) => updateFilter('rating', e.target.value || '')} className="input-field !py-2 text-sm w-full">
                {ratingOptions.map(r => <option key={r.label} value={r.value ?? ''}>{r.label}</option>)}
              </select>
            </div>

            {/* Clear */}
            <button onClick={() => { setFilters({ category: 'All', priceRange: '', platforms: [], rating: null, search: '', sort: 'Featured' }); setSearchParams({}); }} className="text-sm text-primary-600 hover:text-primary-700 underline">Clear all filters</button>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? <LoadingSpinner message="Loading products..." /> : (
              <>
                {filtered > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {filters.category !== 'All' && <Badge>{filters.category} <button onClick={() => updateFilter('category', 'All')} className="ml-1 font-bold">&times;</button></Badge>}
                    {filters.priceRange && <Badge>Price: {filters.priceRange} <button onClick={() => updateFilter('priceRange', '')} className="ml-1 font-bold">&times;</button></Badge>}
                    {filters.platforms.map(p => <Badge key={p}>{p} <button onClick={() => togglePlatform(p)} className="ml-1 font-bold">&times;</button></Badge>)}
                    {filters.rating && <Badge>Rating: {filters.rating}+ <button onClick={() => updateFilter('rating', '')} className="ml-1 font-bold">&times;</button></Badge>}
                  </div>
                )}
                {filtered === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-lg font-medium text-surface-700">No software found.</p>
                    <p className="mt-1 text-surface-500">Try another search term or adjust your filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
