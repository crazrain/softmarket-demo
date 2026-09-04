import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-surface-50 dark:bg-surface-900 dark:border-surface-800">
      <div className="container-narrow py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-surface-900">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/browse" className="text-sm text-surface-600 hover:text-primary-600">Browse</Link></li>
              <li><Link to="/browse" className="text-sm text-surface-600 hover:text-primary-600">Categories</Link></li>
              <li><Link to="/browse?sort=Newest" className="text-sm text-surface-600 hover:text-primary-600">New Releases</Link></li>
              <li><Link to="/browse?sort=MostPopular" className="text-sm text-surface-600 hover:text-primary-600">Popular</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-surface-900">Developers</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-sm text-surface-600 hover:text-primary-600">Sell Software</Link></li>
              <li><Link to="/login" className="text-sm text-surface-600 hover:text-primary-600">Seller Dashboard</Link></li>
              <li><Link to="/login" className="text-sm text-surface-600 hover:text-primary-600">Developer Resources</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-surface-900">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-surface-600 hover:text-primary-600">About</Link></li>
              <li><Link to="/" className="text-sm text-surface-600 hover:text-primary-600">Contact</Link></li>
              <li><Link to="/" className="text-sm text-surface-600 hover:text-primary-600">Terms</Link></li>
              <li><Link to="/" className="text-sm text-surface-600 hover:text-primary-600">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-surface-900">SoftMarket</h3>
            <p className="text-sm text-surface-500">Discover software built by developers. Powerful tools. Independent creators. One marketplace.</p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-surface-400 hover:text-surface-600" aria-label="Twitter"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg></a>
              <a href="#" className="text-surface-400 hover:text-surface-600" aria-label="GitHub"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-surface-200 pt-6 text-center text-sm text-surface-500 dark:border-surface-800">
          &copy; 2026 SoftMarket. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
