import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLibrary } from '@/contexts/LibraryContext';
import { products } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function LibraryPage() {
  const { library } = useLibrary();
  const { isAuthenticated } = useAuth();
  const [downloading, setDownloading] = useState<string | null>(null);

  const myProducts = products.filter(p => library.includes(p.id));

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-surface-700">Please sign in to view your library.</p>
          <Link to="/login" className="mt-4 inline-block btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow py-8">
      <h1 className="text-2xl font-bold text-surface-900">My Library</h1>
      <p className="mt-1 text-sm text-surface-500">{myProducts.length} purchased software</p>

      {myProducts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-medium text-surface-700">Your library is empty.</p>
          <p className="mt-1 text-surface-500">Browse software and add tools to your library.</p>
          <Link to="/browse" className="mt-4 inline-block btn-primary">Browse Software</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {myProducts.map(p => (
            <div key={p.id} className="card flex items-center gap-4">
              <span className="text-3xl">{p.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-surface-900">{p.name}</h3>
                <p className="text-sm text-surface-500">
                  v{p.versions[0]?.version || '1.0.0'} &middot; {p.category}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/product/${p.slug}`} className="btn-secondary text-sm">View</Link>
                <button onClick={() => handleDownload(p.id)} className="btn-primary text-sm" disabled={downloading === p.id}>
                  {downloading === p.id ? 'Downloading...' : 'Download'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
