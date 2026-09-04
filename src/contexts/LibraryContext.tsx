import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface LibraryContextType {
  library: string[];
  isInLibrary: (id: string) => boolean;
  addToLibrary: (id: string) => void;
  removeFromLibrary: (id: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [library, setLibrary] = useState<string[]>([]);

  const isInLibrary = useCallback((id: string) => library.includes(id), [library]);

  const addToLibrary = useCallback((id: string) => {
    setLibrary((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeFromLibrary = useCallback((id: string) => {
    setLibrary((prev) => prev.filter((x) => x !== id));
  }, []);

  return (
    <LibraryContext.Provider value={{ library, isInLibrary, addToLibrary, removeFromLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (ctx === undefined) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
}
