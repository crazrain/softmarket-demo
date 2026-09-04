import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Product } from '@/types';

const categories = [
  { name: 'Productivity', icon: 'list-todo', emoji: '📋' },
  { name: 'Developer Tools', icon: 'code', emoji: '💻' },
  { name: 'Graphics', icon: 'palette', emoji: '🎨' },
  { name: 'Video', icon: 'film', emoji: '🎬' },
  { name: 'Audio', icon: 'music', emoji: '🎵' },
  { name: 'AI', icon: 'brain', emoji: '🧠' },
  { name: 'Security', icon: 'shield', emoji: '🛡️' },
  { name: 'System Utilities', icon: 'settings', emoji: '⚙️' },
] as const;

export default function HomePage() {
  const { isAuthenticated, login } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getAll().then((data) => { setProducts(data); setLoading(false); });
  }, []);

  const featured = products.slice(0, 6);
  const trending = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 4);
  const newest = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface-900 via-primary-900 to-surface-900 py-16 sm:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container-narrow relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover software built by developers.
            </h1>
            <p className="mt-4 text-lg text-surface-300 sm:text-xl">
              Powerful tools. Independent creators. One marketplace.
            </p>
            <p className="mt-2 text-base text-surface-400">
              Find the tools that make your work faster, smarter and more productive.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); const form = e.target as HTMLFormElement; const input = form.querySelector('input') as HTMLInputElement; if (input.value.trim()) window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`; }} className="mt-8">
              <div className="flex max-w-lg mx-auto rounded-xl bg-white/10 backdrop-blur-sm p-1.5">
                <input type="search" placeholder="Search software, tools and utilities..." className="flex-1 rounded-lg bg-transparent px-4 py-3 text-white placeholder:text-surface-400 focus:outline-none" aria-label="Search software" />
                <button type="submit" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-surface-900 hover:bg-surface-100 transition-colors">Search</button>
              </div>
            </form>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/browse" className="btn-primary text-base px-8 py-3">Explore Software</Link>
              {isAuthenticated ? (
                <Link to="/seller/products/new" className="btn-secondary text-base px-8 py-3">Sell Your Software</Link>
              ) : (
                <button onClick={() => login()} className="btn-secondary text-base px-8 py-3">Sell Your Software</button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-narrow py-12 sm:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-surface-900">Featured Software</h2>
            <p className="mt-1 text-surface-500">Hand-picked tools recommended by our team</p>
          </div>
          <Link to="/browse" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all &rarr;</Link>
        </div>
        {loading ? <LoadingSpinner message="Loading products..." /> : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="border-y border-surface-200 bg-surface-50 py-12 sm:py-16 dark:bg-surface-900/50 dark:border-surface-800">
        <div className="container-narrow">
          <h2 className="mb-8 text-center text-2xl font-bold text-surface-900">Browse Categories</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {categories.map((cat) => (
              <Link key={cat.name} to={`/category/${encodeURIComponent(cat.name)}`} className="card flex flex-col items-center gap-2 text-center transition-colors hover:border-primary-200">
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-sm font-semibold text-surface-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="container-narrow py-12 sm:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-surface-900">Trending Software</h2>
            <p className="mt-1 text-surface-500">Most popular tools right now</p>
          </div>
          <Link to="/browse?sort=MostPopular" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* New Releases */}
      <section className="border-t border-surface-200 py-12 sm:py-16 dark:border-surface-800">
        <div className="container-narrow">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-surface-900">New Releases</h2>
              <p className="mt-1 text-surface-500">Recently added software</p>
            </div>
            <Link to="/browse?sort=Newest" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {newest.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
