import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { LibraryProvider } from '@/contexts/LibraryContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import BrowsePage from '@/pages/BrowsePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import SearchResultsPage from '@/pages/SearchResultsPage';
import CategoryPage from '@/pages/CategoryPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import LibraryPage from '@/pages/LibraryPage';
import WishlistPage from '@/pages/WishlistPage';
import AccountPage from '@/pages/AccountPage';
import SellerDashboardPage from '@/pages/SellerDashboardPage';
import CreateProductPage from '@/pages/CreateProductPage';
import SalesPage from '@/pages/SalesPage';

function AppRoutes() {
  return (
    <>
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/seller" element={<SellerDashboardPage />} />
          <Route path="/seller/products/new" element={<CreateProductPage />} />
          <Route path="/seller/sales" element={<SalesPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <LibraryProvider>
            <BrowserRouter>
              <div className="flex min-h-screen flex-col">
                <AppRoutes />
              </div>
            </BrowserRouter>
          </LibraryProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export { AppRoutes };
export default App;
