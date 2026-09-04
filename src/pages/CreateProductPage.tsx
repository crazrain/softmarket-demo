import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import type { Category, Platform } from '@/types';

const categories: Category[] = ['Productivity', 'Developer Tools', 'Graphics', 'Video', 'Audio', 'AI', 'Security', 'System Utilities'];
const platforms: Platform[] = ['Windows', 'macOS', 'Linux'];

const defaultRequirements = {
  windows: { os: 'Windows 10 / 11', cpu: 'Intel Core i5 or equivalent', ram: '8 GB RAM', storage: '500 MB', architecture: 'x64' },
  macos: { os: 'macOS 12+', cpu: 'Apple M1 or Intel', ram: '8 GB RAM', storage: '300 MB', architecture: 'ARM64' },
  linux: { os: 'Ubuntu 22.04+ / Fedora 38+', cpu: 'x86_64', ram: '8 GB RAM', storage: '500 MB', architecture: 'x64' },
};

export default function CreateProductPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', slug: '', tagline: '', description: '', category: 'Productivity' as Category,
    price: null as number | null, platforms: ['Windows'] as Platform[],
    version: '', releaseNotes: '', screenshots: ['Screenshot 1', 'Screenshot 2'] as string[],
    requirements: defaultRequirements,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-surface-700">Sign in to create a product.</p>
          <button onClick={() => window.location.href = '/login'} className="mt-4 btn-primary">Sign In</button>
        </div>
      </div>
    );
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Product name is required.';
    if (!formData.tagline.trim()) errs.tagline = 'Tagline is required.';
    if (!formData.description.trim()) errs.description = 'Description is required.';
    if (formData.price !== null && formData.price < 0) errs.price = 'Price cannot be negative.';
    if (formData.price !== null && formData.price === 0 && formData.platforms.length === 0) errs.platforms = 'Select at least one platform.';
    if (!formData.version.trim()) errs.version = 'Version is required.';
    if (/^[vV]?[0-9]/.test(formData.version) && !/^\d+(\.\d+)*$/.test(formData.version)) {
      // lenient: accept common version formats
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePublish = async () => {
    if (!validate()) return;
    try {
      await sellerService.createProduct(formData);
      setSuccess(true);
    } catch {
      setErrors({ submit: 'Failed to create product. Please try again.' });
    }
  };

  const handleSaveDraft = async () => {
    const draftFormData = { ...formData, name: formData.name || 'Untitled Draft' };
    try {
      await sellerService.createProduct(draftFormData);
      setDraftSaved(true);
    } catch { /* ignore */ }
  };

  return (
    <div className="container-narrow py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Create Product</h1>
        <p className="mt-1 text-sm text-surface-500">Register a new software product on SoftMarket</p>
      </div>

      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">&#10003; Product created successfully!</p>
          <p className="text-sm text-green-700 mt-1">The product is now in Draft status. You can publish it later.</p>
        </div>
      )}

      {draftSaved && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">&#9998; Draft saved.</p>
        </div>
      )}

      <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); }}>
        {/* Basic Information */}
        <div className="rounded-xl border border-surface-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-surface-900">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="prod-name" className="mb-1.5 block text-sm font-medium text-surface-700">Product Name *</label>
              <input id="prod-name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className={`input-field ${errors.name ? '!border-red-500' : ''}`} placeholder="e.g. FileScope" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="prod-slug" className="mb-1.5 block text-sm font-medium text-surface-700">URL Slug</label>
              <input id="prod-slug" type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="input-field" placeholder="e.g. filescope" />
            </div>
            <div>
              <label htmlFor="prod-tagline" className="mb-1.5 block text-sm font-medium text-surface-700">Tagline *</label>
              <input id="prod-tagline" type="text" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} className={`input-field ${errors.tagline ? '!border-red-500' : ''}`} placeholder="A short description of your product" />
              {errors.tagline && <p className="mt-1 text-xs text-red-500">{errors.tagline}</p>}
            </div>
            <div>
              <label htmlFor="prod-desc" className="mb-1.5 block text-sm font-medium text-surface-700">Description *</label>
              <textarea id="prod-desc" rows={5} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`input-field resize-none ${errors.description ? '!border-red-500' : ''}`} placeholder="Describe your product in detail..." />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>
            <div>
              <label htmlFor="prod-cat" className="mb-1.5 block text-sm font-medium text-surface-700">Category *</label>
              <select id="prod-cat" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })} className="input-field">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-xl border border-surface-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-surface-900">Pricing</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" checked={formData.price === 0} onChange={() => setFormData({ ...formData, price: 0 })} className="text-primary-600" />
                <span className="text-sm">Free</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={formData.price !== null && formData.price !== 0} onChange={() => setFormData({ ...formData, price: 29 })} className="text-primary-600" />
                <span className="text-sm">Paid</span>
              </label>
            </div>
            {formData.price !== 0 && formData.price !== null && (
              <div>
                <label htmlFor="prod-price" className="mb-1.5 block text-sm font-medium text-surface-700">Price (USD)</label>
                <input id="prod-price" type="number" min="0" step="1" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} className={`input-field w-32 ${errors.price ? '!border-red-500' : ''}`} />
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Platforms */}
        <div className="rounded-xl border border-surface-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-surface-900">Platforms</h2>
          <div className="flex gap-4">
            {platforms.map(p => (
              <label key={p} className="flex items-center gap-2">
                <input type="checkbox" checked={formData.platforms.includes(p)} onChange={() => setFormData({ ...formData, platforms: formData.platforms.includes(p) ? formData.platforms.filter(x => x !== p) : [...formData.platforms, p] })} className="rounded border-surface-300 text-primary-600" />
                <span className="text-sm">{p}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Version */}
        <div className="rounded-xl border border-surface-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-surface-900">Version</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="prod-version" className="mb-1.5 block text-sm font-medium text-surface-700">Version Number *</label>
              <input id="prod-version" type="text" value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} className={`input-field w-32 ${errors.version ? '!border-red-500' : ''}`} placeholder="1.0.0" />
              {errors.version && <p className="mt-1 text-xs text-red-500">{errors.version}</p>}
            </div>
            <div>
              <label htmlFor="prod-notes" className="mb-1.5 block text-sm font-medium text-surface-700">Release Notes</label>
              <textarea id="prod-notes" rows={3} value={formData.releaseNotes} onChange={(e) => setFormData({ ...formData, releaseNotes: e.target.value })} className="input-field resize-none" placeholder="What's new in this version?" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleSaveDraft} className="btn-secondary">Save Draft</button>
          <button type="button" onClick={handlePublish} className="btn-primary">Publish</button>
          <button type="button" onClick={() => navigate(`/product/${formData.slug || 'preview'}`)} className="btn-ghost">Preview</button>
        </div>
      </form>
    </div>
  );
}
