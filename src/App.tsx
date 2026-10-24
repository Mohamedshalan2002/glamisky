import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CartProvider, useCart } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { PromoBar } from './components/PromoBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { ProductPage } from './pages/Product';
import { NotFound } from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function Shell() {
  const { state, dispatch, closeCheckout } = useCart();

  // Fire confetti once per completed order, then reset the flag.
  useEffect(() => {
    if (!state.showConfetti) return;
    dispatch({ type: 'SET_SHOW_CONFETTI', payload: false });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ['#C8196E', '#F3DDE8', '#E4DAF5', '#1A1022'] });
  }, [state.showConfetti, dispatch]);

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      <PromoBar />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<Collection kind="category" />} />
          <Route path="/sale" element={<Collection kind="sale" />} />
          <Route path="/new-arrivals" element={<Collection kind="new" />} />
          <Route path="/trending" element={<Collection kind="trending" />} />
          <Route path="/wishlist" element={<Collection kind="wishlist" />} />
          <Route path="/search" element={<Collection kind="search" />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      {state.isCheckoutOpen && <CheckoutModal onClose={closeCheckout} />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <CartProvider>
        <WishlistProvider>
          <ScrollToTop />
          <Shell />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
