import { Link } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';
import { products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/contexts/AuthContext';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-surface-700">Please sign in to view your wishlist.</p>
          <Link to="/login" className="mt-4 inline-block btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow py-8">
      <h1 className="text-2xl font-bold text-surface-900">My Wishlist</h1>
      <p className="mt-1 text-sm text-surface-500">{wishlistProducts.length} items</p>

      {wishlistProducts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-medium text-surface-700">Your wishlist is empty.</p>
          <p className="mt-1 text-surface-500">Save software you&apos;re interested in.</p>
          <Link to="/browse" className="mt-4 inline-block btn-primary">Browse Software</Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
