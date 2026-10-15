import React, { useState, useMemo } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { ProductCategory } from './types';
import { Navbar } from './components/Navbar';
import { HeroPromo } from './components/HeroPromo';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MidtransPayment } from './components/MidtransPayment';
import { RentalTermsModal } from './components/RentalTermsModal';
import { PromoModal } from './components/PromoModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AIFloatingTrigger } from './components/AIFloatingTrigger';
import { AdminProductManager } from './components/AdminProductManager';
import { Footer } from './components/Footer';
import { Frown } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { MobileEstimator } from './components/MobileEstimator';
import { PostPurchaseModal } from './components/PostPurchaseModal';
import { MobileBottomNav } from './components/MobileBottomNav';

const MainShop: React.FC = () => {
  const { products, activeBooking, setActiveBooking } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'Semua' && product.category !== selectedCategory) {
        return false;
      }

      // Stock filter
      if (onlyInStock && product.stock <= 0) {
        return false;
      }

      // Promo filter
      if (onlyPromo && !product.isPromo) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        return matchesName || matchesBrand || matchesCategory || matchesDesc;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') {
        const priceA = a.isPromo && a.promoDiscountPercent ? a.dailyPrice * (1 - a.promoDiscountPercent / 100) : a.dailyPrice;
        const priceB = b.isPromo && b.promoDiscountPercent ? b.dailyPrice * (1 - b.promoDiscountPercent / 100) : b.dailyPrice;
        return priceA - priceB;
      }
      if (sortBy === 'price_desc') {
        const priceA = a.isPromo && a.promoDiscountPercent ? a.dailyPrice * (1 - a.promoDiscountPercent / 100) : a.dailyPrice;
        const priceB = b.isPromo && b.promoDiscountPercent ? b.dailyPrice * (1 - b.promoDiscountPercent / 100) : b.dailyPrice;
        return priceB - priceA;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // Featured / default: Promos first, then higher stock
      if (a.isPromo && !b.isPromo) return -1;
      if (!a.isPromo && b.isPromo) return 1;
      return b.stock - a.stock;
    });
  }, [products, selectedCategory, onlyInStock, onlyPromo, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] pb-20 md:pb-0">
      {/* Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenPromo={() => setIsPromoModalOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenEstimator={() => setIsEstimatorOpen(true)}
      />

      {/* Hero and Promotions */}
      <HeroPromo />

      {/* Category and Filters */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onlyInStock={onlyInStock}
        setOnlyInStock={setOnlyInStock}
        onlyPromo={onlyPromo}
        setOnlyPromo={setOnlyPromo}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalProductsCount={filteredProducts.length}
      />

      {/* Product Catalog Grid */}
      <main id="catalog-grid" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4 flex-1 w-full">
        {filteredProducts.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
              <Frown className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-1 font-['Outfit']">Tidak ada alat yang cocok</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-6">
              Coba kurangi filter atau cari dengan kata kunci alat musik / DJ lainnya.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
                setOnlyInStock(false);
                setOnlyPromo(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <MidtransPayment />
      <RentalTermsModal />
      <PromoModal isOpen={isPromoModalOpen} onClose={() => setIsPromoModalOpen(false)} />
      <AIAssistantModal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      <AIFloatingTrigger isOpen={isAIOpen} onClick={() => setIsAIOpen(true)} />
      <AdminProductManager />
      <AuthModal />
      <AdminDashboard open={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />

      {/* New UI components */}
      <PWAInstallPrompt />
      <MobileEstimator
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
        onOpen={() => setIsEstimatorOpen(true)}
      />
      <PostPurchaseModal
        order={activeBooking}
        isOpen={!!activeBooking}
        onClose={() => setActiveBooking(null)}
      />

      {/* Mobile Bottom Navigation Bar (Khusus Layar HP) */}
      <MobileBottomNav
        onOpenPromo={() => setIsPromoModalOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenEstimator={() => setIsEstimatorOpen(true)}
        onGoToCatalog={() => {
          const el = document.getElementById('catalog-grid');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider><CartProvider><MainShop /></CartProvider></AuthProvider>
  );
}

export default App;
