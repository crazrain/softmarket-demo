import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/95 backdrop-blur-sm dark:bg-surface-900/95 dark:border-surface-700">
      <div className="container-narrow">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="SoftMarket Home">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">SoftMarket</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            <NavLink to="/browse">Browse</NavLink>
            <NavLink to="/category/Developer+Tools">Categories</NavLink>
            {isAuthenticated && <NavLink to="/seller">Sell Software</NavLink>}
          </nav>

          {/* Search */}
          <div ref={searchRef} className="relative hidden sm:block">
            {!searchOpen ? (
              <button onClick={() => setSearchOpen(true)} className="btn-ghost gap-1.5" aria-label="Search">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            ) : (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search software..."
                  className="input-field !pr-10 w-56 lg:w-72"
                  autoFocus
                  aria-label="Search software"
                />
                <button type="submit" className="btn-ghost" aria-label="Submit search">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="btn-ghost" aria-label="Close search">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </form>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Mobile search toggle */}
            <button onClick={() => setSearchOpen(true)} className="btn-ghost md:hidden p-2" aria-label="Search">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="btn-ghost p-2 relative" aria-label={`Wishlist (${wishlist.length} items)`}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {wishlist.length > 0 && <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary-600 text-[10px] font-bold text-white flex items-center justify-center">{wishlist.length}</span>}
            </Link>

            {/* Theme toggle */}
            <button onClick={toggleTheme} className="btn-ghost p-2" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>

            {/* User menu */}
            {isAuthenticated ? (
              <div ref={menuRef} className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 rounded-full p-1 focus-visible:ring-2 focus-visible:ring-primary-500" aria-label="User menu" aria-expanded={menuOpen}>
                  <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-sm">👤</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-surface-200 bg-white py-2 shadow-lg" role="menu">
                    <div className="px-4 py-2 border-b border-surface-100 mb-1">
                      <p className="text-sm font-medium text-surface-900">{user?.name}</p>
                      <p className="text-xs text-surface-500">{user?.email}</p>
                    </div>
                    <NavLink to="/account" closeMenu={() => setMenuOpen(false)}>Account</NavLink>
                    {user?.role === 'seller' && <NavLink to="/seller" closeMenu={() => setMenuOpen(false)}>Seller Dashboard</NavLink>}
                    <NavLink to="/library" closeMenu={() => setMenuOpen(false)}>My Library</NavLink>
                    <div className="border-t border-surface-100 mt-1 pt-1" />
                    <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50" role="menuitem">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm">Sign In</Link>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="btn-ghost p-2 md:hidden" aria-label="Menu" aria-expanded={menuOpen}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-3 sm:hidden">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search software..."
              className="input-field"
              autoFocus
              aria-label="Search software"
            />
          </form>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden border-t border-surface-200 py-3 space-y-1" aria-label="Mobile navigation">
            <NavLink to="/browse" closeMenu={() => setMenuOpen(false)}>Browse</NavLink>
            <NavLink to="/category/Developer+Tools" closeMenu={() => setMenuOpen(false)}>Categories</NavLink>
            {isAuthenticated && <NavLink to="/seller" closeMenu={() => setMenuOpen(false)}>Sell Software</NavLink>}
            {isAuthenticated && <NavLink to="/library" closeMenu={() => setMenuOpen(false)}>My Library</NavLink>}
            {isAuthenticated && <NavLink to="/wishlist" closeMenu={() => setMenuOpen(false)}>Wishlist</NavLink>}
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({ to, children, closeMenu }: { to: string; children: React.ReactNode; closeMenu?: () => void }) {
  const isActive = false;
  return (
    <Link
      to={to}
      onClick={closeMenu}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
      }`}
    >
      {children}
    </Link>
  );
}
