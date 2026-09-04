import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppRoutes } from '@/App';
import { AuthProvider } from '@/contexts/AuthContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { LibraryProvider } from '@/contexts/LibraryContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import HomePage from '@/pages/HomePage';
import BrowsePage from '@/pages/BrowsePage';

function TestProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <LibraryProvider>
            {children}
          </LibraryProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

describe('App Routes', () => {
  it('renders the Home page hero text', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TestProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </TestProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('Discover software built by developers.')).toBeInTheDocument();
  });

  it('renders the Browse page heading', () => {
    render(
      <MemoryRouter initialEntries={['/browse']}>
        <TestProvider>
          <Routes>
            <Route path="/browse" element={<BrowsePage />} />
          </Routes>
        </TestProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('Browse Software')).toBeInTheDocument();
  });

  it('renders AppRoutes with Header and Footer', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TestProvider>
          <AppRoutes />
        </TestProvider>
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('SoftMarket Home')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
