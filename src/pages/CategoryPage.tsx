import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '@/services';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Product } from '@/types';

const CATEGORY_NAMES: Record<string, string> = {
  'all': '모든 소프트웨어',
  'developer-tools': '개발자 도구',
  'productivity': '생산성',
  'design-tools': '디자인 도구',
  'communication': '커뮤니케이션',
  'analytics': '분석',
  'security': '보안',
  'games': '게임',
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!category) { setLoading(false); return; }
    const decoded = decodeURIComponent(category).replace(/\+/g, ' ');
    productService.getFiltered({ category: decoded as any, priceRange: '', platforms: [], rating: null, search: '', sort: 'Featured' }).then((data) => { setProducts(data); setLoading(false); });
  }, [category]);

  const title = CATEGORY_NAMES[category?.toLowerCase() || 'all'] || category;

  return (
    <div className="min-h-screen bg-surface-50 py-8 dark:bg-surface-950">
      <div className="container-narrow">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-surface-900">{title}</h1>
          <p className="mt-1 text-sm text-surface-500">{products.length} software found</p>
        </div>
        {loading ? <LoadingSpinner message="Loading..." /> : products.length === 0 ? (
          <div className="py-16 text-center"><p className="text-lg text-surface-700">No software in this category yet.</p></div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
