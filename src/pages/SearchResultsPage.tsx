import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '@/services';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Product } from '@/types';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!query) { setLoading(false); return; }
    productService.search(query).then((data) => { setProducts(data); setLoading(false); });
  }, [query]);

  return (
    <div className="min-h-screen bg-surface-50 py-8 dark:bg-surface-950">
      <div className="container-narrow">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-surface-900">
            Search results for "{query}"
          </h1>
          <p className="mt-1 text-sm text-surface-500">{products.length} results</p>
        </div>
        {loading ? (
          <LoadingSpinner message="Searching..." />
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-medium text-surface-700">No software found.</p>
            <p className="mt-1 text-surface-500">Try another search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
