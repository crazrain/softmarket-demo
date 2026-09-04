import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService, reviewService } from '@/services';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLibrary } from '@/contexts/LibraryContext';
import StarRating from '@/components/StarRating';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import type { Product, Review } from '@/types';
import { developers } from '@/data/mockData';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated, login } = useAuth();
  const { isInLibrary } = useLibrary();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'requirements' | 'reviews'>('overview');
  const [reqOS, setReqOS] = useState('Windows');
  const [showPurchase, setShowPurchase] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([productService.getBySlug(slug!), reviewService.getByProduct(slug ? slug.replace(/-/g, '') : '')]).then(([p, r]) => {
      if (p) { setProduct(p); setLoading(false); }
      setReviews(r);
    });
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading product..." />;
  if (!product) return <div className="py-16 text-center"><p className="text-lg text-surface-700">Product not found.</p><Link to="/browse" className="mt-4 inline-block text-primary-600">Browse all products</Link></div>;

  const developer = developers.find((d) => d.id === product.developerId);
  const inWishlist = isInWishlist(product.id);
  const inLibrary = isInLibrary(product.id);

  const handlePurchase = async () => {
    setPurchasing(true);
    const { orderService } = await import('@/services');
    const result = await orderService.purchase(product.id, product.name, product.price);
    if (result.success) { setPurchasing(false); setPurchaseSuccess(true); setShowPurchase(false); }
  };

  const handleWishlist = () => {
    if (inWishlist) removeFromWishlist(product.id); else addToWishlist(product.id);
  };

  return (
    <main className="py-8">
      <div className="container-narrow">
        {/* Header */}
        <div className="flex flex-col gap-6 border-b border-surface-200 pb-8 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{product.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-surface-900">{product.name}</h1>
              <p className="mt-1 text-lg text-surface-500">{product.tagline}</p>
              <div className="mt-2 flex items-center gap-3">
                <StarRating rating={product.rating} size="sm" />
                <span className="text-sm text-surface-500">({product.reviewCount} reviews)</span>
              </div>
              {developer && (
                <Link to={`/developer/${developer.id}`} className="mt-1 text-sm text-primary-600 hover:text-primary-700">{developer.name} &middot; {developer.productCount} products &middot; {developer.averageRating} avg rating</Link>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <span className="text-3xl font-bold">{product.price === 0 ? <span className="text-green-600">Free</span> : `$${product.price}`}</span>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {!inLibrary ? (
                    <button onClick={() => setShowPurchase(true)} className="btn-primary" disabled={purchasing}>
                      {purchasing ? 'Processing...' : 'Buy Now'}
                    </button>
                  ) : (
                    <span className="text-sm text-green-600 font-medium">&#10003; Owned</span>
                  )}
                </>
              ) : (
                <button onClick={() => { login(); }} className="btn-primary">Sign in to purchase</button>
              )}
              <button onClick={handleWishlist} className={`btn-secondary gap-1.5 ${inWishlist ? 'text-red-500' : ''}`} aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
                <svg className="h-4 w-4" fill={inWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {inWishlist ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-surface-200 -mb-px overflow-x-auto">
          {([
            { key: 'overview', label: 'Overview' },
            { key: 'features', label: 'Features' },
            { key: 'requirements', label: 'Requirements' },
            { key: 'reviews', label: `Reviews (${product.reviewCount})` },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="py-8">
          {activeTab === 'overview' && (
            <div className="max-w-3xl">
              <p className="text-base leading-relaxed text-surface-700">{product.description}</p>
              {/* Screenshots */}
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold text-surface-900">Screenshots</h3>
                <div className="mb-3 aspect-video overflow-hidden rounded-xl bg-surface-100">
                  <img src={product.screenshots[selectedScreenshot]} alt={`${product.name} screenshot ${selectedScreenshot + 1}`} className="h-full w-full object-cover cursor-pointer" onClick={() => setShowLightbox(true)} />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {product.screenshots.map((s, i) => (
                    <button key={i} onClick={() => setSelectedScreenshot(i)} className={`shrink-0 h-16 w-28 overflow-hidden rounded-lg border-2 transition-colors ${selectedScreenshot === i ? 'border-primary-600' : 'border-surface-200'}`} aria-label={`View screenshot ${i + 1}`}>
                      <img src={s} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid gap-6 sm:grid-cols-2">
              {product.features.map((f, i) => (
                <div key={i} className="rounded-xl border border-surface-200 p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-xl">
                      {f.icon === 'zap' ? '⚡' : f.icon === 'search' ? '🔍' : f.icon === 'copy' ? '📋' : f.icon === 'bar-chart-3' ? '📊' : f.icon === 'file-text' ? '📄' : f.icon === 'sliders-vertical' ? '⚙️' : f.icon === 'layers' ? '📚' : f.icon === 'wand' ? '🪄' : f.icon === 'palette' ? '🎨' : f.icon === 'image' ? '🖼️' : f.icon === 'git-branch' ? '🔀' : f.icon === 'download' ? '📥' : f.icon === 'sparkles' ? '✨' : f.icon === 'wrench' ? '🔧' : f.icon === 'file-code' ? '📝' : f.icon === 'play' ? '▶️' : f.icon === 'shield-check' ? '✅' : f.icon === 'puzzle' ? '🧩' : f.icon === 'eye' ? '👁️' : f.icon === 'shield' ? '🛡️' : f.icon === 'wifi' ? '📶' : f.icon === 'bell' ? '🔔' : f.icon === 'scan' ? '🔎' : f.icon === 'layout' ? '📐' : f.icon === 'calendar' ? '📅' : f.icon === 'timer' ? '⏱️' : f.icon === 'users' ? '👥' : f.icon === 'file-branch' ? '🌿' : f.icon === 'chart-bar' ? '📈' : f.icon === 'mic' ? '🎤' : f.icon === 'music' ? '🎶' : f.icon === 'history' ? '↩️' : f.icon === 'brain' ? '🧠' : f.icon === 'cpu' ? '💾' : f.icon === 'globe' ? '🌐' : f.icon === 'database' ? '🗄️' : f.icon === 'lock' ? '🔒' : f.icon === 'key' ? '🔑' : f.icon === 'credit-card' ? '💳' : f.icon === 'alert-circle' ? '⚠️' : f.icon === 'sync' ? '🔄' : f.icon === 'minimize-2' ? '📉' : f.icon === 'file-video' ? '🎞️' : f.icon === 'gauge' ? '🎯' : f.icon === 'clock' ? '⏰' : f.icon === 'refresh-cw' ? '🔄' : f.icon === 'folder' ? '📁' : f.icon === 'type' ? '🔤' : f.icon === 'crosshair' ? '🎯' : f.icon === 'angle' ? '📐' : f.icon === 'ruler' ? '📏' : f.icon === 'droplet' ? '💧' : f.icon === 'hard-drive' ? '💿' : f.icon === 'file-check' ? '✔️' : '🔹'}
                    </span>
                    <h4 className="font-semibold text-surface-900">{f.title}</h4>
                  </div>
                  <p className="text-sm text-surface-600">{f.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'requirements' && (
            <div>
              {product.platforms.length > 1 && (
                <div className="mb-4 flex gap-2">
                  {product.platforms.map(p => (
                    <button key={p} onClick={() => setReqOS(p)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${reqOS === p ? 'bg-primary-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}>{p}</button>
                  ))}
                </div>
              )}
              <div className="rounded-xl border border-surface-200">
                {(reqOS === 'Windows' && product.requirements.windows) && (
                  <ReqTable {...product.requirements.windows} />
                )}
                {(reqOS === 'macOS' && product.requirements.macos) && (
                  <ReqTable {...product.requirements.macos} />
                )}
                {(reqOS === 'Linux' && product.requirements.linux) && (
                  <ReqTable {...product.requirements.linux} />
                )}
              </div>
              {/* Version History */}
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold text-surface-900">Version History</h3>
                <div className="space-y-4">
                  {product.versions.map((v, i) => (
                    <div key={i} className="rounded-xl border border-surface-200 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="font-semibold text-surface-900">v{v.version}</span>
                        <span className="text-sm text-surface-500">{v.date}</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {v.notes.map((n, j) => <li key={j} className="text-sm text-surface-600">{n}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {/* Rating Summary */}
              <div className="mb-8 rounded-xl border border-surface-200 p-6">
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-surface-900">{product.rating}</span>
                  <StarRating rating={product.rating} size="lg" />
                  <span className="text-sm text-surface-500">{product.reviewCount} reviews</span>
                </div>
                <div className="space-y-1.5">
                  {[5, 4, 3, 2, 1].map(star => {
                    const pct = star === 5 ? 82 : star === 4 ? 12 : star === 3 ? 4 : star === 2 ? 1 : 1;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-12 text-sm text-surface-600">{star} stars</span>
                        <div className="flex-1 h-2.5 rounded-full bg-surface-100 overflow-hidden">
                          <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-10 text-right text-sm text-surface-500">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Review List */}
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="rounded-xl border border-surface-200 p-5">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-xl">{r.userAvatar}</span>
                      <div>
                        <span className="font-medium text-surface-900">{r.userName}</span>
                        <span className="ml-2 text-sm text-surface-400">{r.date}</span>
                      </div>
                      <StarRating rating={r.rating} size="sm" />
                    </div>
                    <p className="text-sm text-surface-700 mt-2">{r.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowLightbox(false)}>
          <button className="absolute top-4 right-4 text-white p-2" aria-label="Close lightbox">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={product.screenshots[selectedScreenshot]} alt="" className="max-h-[90vh] max-w-full rounded-lg" onClick={e => e.stopPropagation()} />
          <button className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30" onClick={(e) => { e.stopPropagation(); setSelectedScreenshot(Math.max(0, selectedScreenshot - 1)); }} disabled={selectedScreenshot === 0}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30" onClick={(e) => { e.stopPropagation(); setSelectedScreenshot(Math.min(product.screenshots.length - 1, selectedScreenshot + 1)); }}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}

      {/* Purchase Modal */}
      <Modal isOpen={showPurchase} onClose={() => { setShowPurchase(false); setPurchaseSuccess(false); }} title="Confirm Purchase">
        {purchaseSuccess ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">&#10003;</div>
            <h3 className="text-xl font-bold text-surface-900">Purchase Complete!</h3>
            <p className="mt-2 text-surface-600">{product.name} has been added to your library.</p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row justify-center">
              <button className="btn-primary" onClick={() => { setShowPurchase(false); setPurchaseSuccess(false); }}>Download</button>
              <Link to="/library" className="btn-secondary" onClick={() => setShowPurchase(false)}>Go to My Library</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-surface-600">{product.name}</span><span className="font-medium">${product.price.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-surface-600">Tax</span><span className="font-medium">${(product.price * 0.1).toFixed(2)}</span></div>
              <div className="border-t border-surface-200 pt-2 flex justify-between font-semibold"><span>Total</span><span>${(product.price * 1.1).toFixed(2)}</span></div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="btn-primary flex-1" onClick={handlePurchase} disabled={purchasing}>
                {purchasing ? 'Processing...' : `Pay ${(product.price * 1.1).toFixed(2)}`}
              </button>
              <button className="btn-secondary" onClick={() => { setShowPurchase(false); setPurchaseSuccess(false); }}>Cancel</button>
            </div>
          </>
        )}
      </Modal>
    </main>
  );
}

function ReqTable({ os, cpu, ram, storage, architecture }: { os: string; cpu: string; ram: string; storage: string; architecture?: string }) {
  const items = [
    { label: 'Operating System', value: os },
    { label: 'CPU', value: cpu },
    { label: 'Memory', value: ram },
    { label: 'Storage', value: storage },
    ...(architecture ? [{ label: 'Architecture', value: architecture }] : []),
  ];
  return (
    <div className="divide-y divide-surface-200">
      {items.map(item => (
        <div key={item.label} className="flex items-center justify-between px-5 py-3">
          <span className="text-sm text-surface-500">{item.label}</span>
          <span className="text-sm font-medium text-surface-900">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
