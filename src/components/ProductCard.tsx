import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isNew = new Date(product.createdAt) > new Date('2026-06-01');

  return (
    <Link to={`/product/${product.slug}`} className="card group flex flex-col gap-3 no-underline text-inherit">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-surface-100">
        <img src={product.screenshots[0]} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        {isNew && (
          <span className="absolute top-2 right-2 rounded-full bg-primary-600 px-2 py-0.5 text-xs font-semibold text-white">NEW</span>
        )}
        <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-surface-700">{product.category}</span>
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{product.icon}</span>
          <div>
            <h3 className="font-semibold text-surface-900 group-hover:text-primary-600">{product.name}</h3>
            <p className="text-sm text-surface-500 line-clamp-1">{product.tagline}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StarRating rating={product.rating} size="sm" />
        <span className="text-xs text-surface-400">({product.reviewCount})</span>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className={`text-lg font-bold ${product.price === 0 ? 'text-green-600' : 'text-surface-900'}`}>
          {product.price === 0 ? 'Free' : `$${product.price}`}
        </span>
        <span className="text-xs text-surface-400">{product.salesCount.toLocaleString()} sales</span>
      </div>
    </Link>
  );
}
