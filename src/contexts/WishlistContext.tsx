import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface WishlistContextType {
  wishlist: string[];
  isInWishlist: (id: string) => boolean;
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const isInWishlist = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const addToWishlist = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist((prev) => prev.filter((x) => x !== id));
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (ctx === undefined) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
