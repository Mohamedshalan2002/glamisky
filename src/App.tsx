import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider, useCart } from './contexts/CartContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { StorySection } from './components/StorySection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { products, getTrendingProducts, getNewArrivals, getSaleProducts, categories } from './data/products';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

function Home() {
  const trendingProducts = getTrendingProducts();
  const newArrivals = getNewArrivals();
  const saleProducts = getSaleProducts();

  return (
    <>
      <Hero />
      
      {/* VIP Welcome Section */}
      <section className="relative py-16 lg:py-24 bg-obsidian-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,168,58,0.1)_0%,_transparent_70%)]" />
        <div className="section-container relative">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-gold-400 text-sm font-semibold tracking-widest uppercase">✨ WELCOME PRIVILEGE</span>
            <h2 className="section-title mt-4">Your First Order Is On Us</h2>
            <p className="section-subtitle mt-6">
              Experience Glamisky with our exclusive newcomer offer. Shop up to $499 in luxury fashion 
              and accessories — we cover the products, service fees, and taxes. You only pay express shipping.
            </p>
            
            <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <FeatureCard icon="Crown" title="Up to $499 Free" desc="Products + fees covered" />
              <FeatureCard icon="Shield" title="Zero Service Fees" desc="10% handling waived" />
              <FeatureCard icon="Truck" title="Express Shipping" desc="Only $32.99 flat rate" />
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#collections" className="btn-gold px-10 py-4">
                <span>Claim Your $499 Wardrobe</span>
              </a>
              <a href="/category/dresses" className="btn-secondary px-10 py-4">
                Explore Collections
              </a>
            </div>
            
            <p className="mt-6 text-sm text-obsidian-500">
              Use code <span className="font-mono text-gold-300 font-semibold">NEWCOMERS</span> at checkout
            </p>
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <ProductGrid
        title="Trending Now"
        subtitle="The pieces everyone is talking about this season"
        products={trendingProducts}
      />

      {/* New Arrivals */}
      <ProductGrid
        title="New Arrivals"
        subtitle="Fresh drops just landed — be the first to wear them"
        products={newArrivals}
      />

      {/* Story Section */}
      <StorySection />

      {/* Sale */}
      <section className="relative py-16 lg:py-24 bg-white">
        <ProductGrid
          title="Last Chance"
          subtitle="Final pieces at exceptional prices — once they're gone, they're gone"
          products={saleProducts}
        />
      </section>

      {/* Category Showcase */}
      <section className="relative py-16 lg:py-24 bg-obsidian-50">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <span className="text-gold-400 text-sm font-semibold tracking-widest uppercase">SHOP BY CATEGORY</span>
            <h2 className="section-title mt-4">Discover Your Style</h2>
            <p className="section-subtitle mt-6">
              Curated collections for every occasion. From everyday essentials to statement pieces.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {categories.map((cat, index) => (
              <a
                key={cat.id}
                href={`/category/${cat.id}`}
                className="relative group overflow-hidden aspect-[3/4] bg-obsidian-100 block"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-center">
                  <h3 className="font-heading text-xl lg:text-2xl font-medium text-white mb-1">{cat.name}</h3>
                  <p className="text-obsidian-300 text-sm">{cat.description}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-gold-400 text-sm font-medium">
                    Shop Now →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative py-16 lg:py-24 bg-obsidian-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,168,58,0.08)_0%,_transparent_70%)]" />
        <div className="section-container relative">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-gold-400 text-sm font-semibold tracking-widest uppercase">STAY INSPIRED</span>
            <h2 className="section-title mt-4 text-white">Join the Glamisky Inner Circle</h2>
            <p className="section-subtitle mt-6 text-obsidian-300">
              Early access to new collections, exclusive VIP offers, and curated style guides delivered to your inbox.
            </p>
            <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="input-luxury flex-1"
                autoComplete="email"
              />
              <button type="submit" className="btn-primary whitespace-nowrap px-8">
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-xs text-obsidian-500">
              By subscribing, you agree to our <a href="/privacy" className="underline hover:text-gold-400">Privacy Policy</a>. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function FeatureCard({ icon: IconName, title, desc }: { icon: string; title: string; desc: string }) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    Crown: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.885.15A9 9 0 0112 21a9 9 0 008.115-7.85l.885-.15M12 6V4.5m0 0l-.885.15A9 9 0 003 13.15l.885-.15M12 6v12m0 0l-.885.15A9 9 0 013 13.15l.885-.15M12 6v12m0 0l.885.15A9 9 0 0112 21a9 9 0 008.115-7.85l.885-.15"/></svg>,
    Shield: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
    Truck: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.885.15A9 9 0 0112 21a9 9 0 008.115-7.85l.885-.15M12 6V4.5m0 0l-.885.15A9 9 0 003 13.15l.885-.15M12 6v12m0 0l-.885.15A9 9 0 013 13.15l.885-.15M12 6v12m0 0l.885.15A9 9 0 0112 21a9 9 0 008.115-7.85l.885-.15"/></svg>,
  };
  
  const Icon = icons[IconName] || icons.Crown;

  return (
    <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-none">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-gold-gradient/20 border border-gold-400/30 rounded-none mb-4 text-gold-400">
        <Icon />
      </div>
      <h3 className="font-heading text-lg font-medium text-white mb-1">{title}</h3>
      <p className="text-sm text-obsidian-400">{desc}</p>
    </div>
  );
}

function CategoryPage({ categoryId }: { categoryId: string }) {
  const category = categories.find(c => c.id === categoryId);
  const categoryProducts = category ? products.filter(p => p.category === categoryId) : products;

  if (!category) return <div className="min-h-screen flex items-center justify-center">Category not found</div>;

  return (
    <>
      <div className="relative min-h-[60vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-obsidian-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,168,58,0.1)_0%,_transparent_70%)]" />
        <img 
          src={category.image} 
          alt={category.name} 
          className="absolute inset-0 w-full h-full object-cover opacity-30" 
        />
        <div className="relative section-container text-center">
          <span className="text-gold-400 text-sm font-semibold tracking-widest uppercase">{category.name.toUpperCase()}</span>
          <h1 className="section-title mt-4 text-white">{category.name}</h1>
          <p className="section-subtitle mt-4 max-w-2xl mx-auto text-obsidian-300">{category.description}</p>
        </div>
      </div>

      <ProductGrid products={categoryProducts} />

      <Footer />
    </>
  );
}

function ProductDetailPage({ productId }: { productId: string }) {
  const product = products.find(p => p.id === productId);
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <>
      <div className="relative min-h-[60vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-obsidian-950" />
        <div className="relative section-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="relative aspect-[3/4] bg-obsidian-100 overflow-hidden">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-gold-400 text-sm font-semibold tracking-widest uppercase">{product.category.replace('-', ' ').toUpperCase()}</span>
              <h1 className="section-title mt-4">{product.name}</h1>
              <div className="flex items-center gap-4 mt-4">
                <span className="font-heading text-3xl font-medium text-obsidian-950">${product.price.toFixed(2)}</span>
                {product.originalPrice && <span className="text-obsidian-400 line-through">${product.originalPrice.toFixed(2)}</span>}
              </div>
              <p className="mt-6 text-obsidian-500 leading-relaxed">{product.description}</p>
              
              <div className="mt-8 space-y-4">
                <div>
                  <label className="label-luxury">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button key={color} className="w-10 h-10 rounded-none border-2 border-obsidian-700 hover:border-gold-400 transition-colors" style={{ backgroundColor: color.toLowerCase() }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label-luxury">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button key={size} className="px-4 py-2 border border-obsidian-700 bg-obsidian-900 text-white text-sm font-medium hover:border-gold-400 transition-colors">{size}</button>
                    ))}
                  </div>
                </div>
              </div>
              
              <button className="btn-gold w-full py-4 mt-4">Add to Bag — ${product.price.toFixed(2)}</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  const { state: cartState, closeCheckout } = useCart();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryId" element={<CategoryPage categoryId={location.pathname.split('/')[2]} />} />
        <Route path="/product/:productId" element={<ProductDetailPage productId={location.pathname.split('/')[2]} />} />
        <Route path="/sale" element={<ProductGrid title="Sale" subtitle="Exceptional pieces at exceptional prices" maxItems={16} />} />
        <Route path="/new-arrivals" element={<ProductGrid title="New Arrivals" subtitle="Fresh drops just landed" maxItems={16} />} />
        <Route path="/trending" element={<ProductGrid title="Trending Now" subtitle="The pieces everyone is talking about" maxItems={16} />} />
      </Routes>
      
      {cartState.isCheckoutOpen && (
        <CheckoutModal 
          isOpen={cartState.isCheckoutOpen} 
          onClose={closeCheckout} 
        />
      )}
    </>
  );
}

function AppContent() {
  const { state: cartState } = useCart();
  const [showConfetti, setShowConfetti] = React.useState(false);
  
  useEffect(() => {
    if (cartState.showConfetti && !showConfetti) {
      setShowConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4a83a', '#f5e9c1', '#c18d28', '#fff'],
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });
      setTimeout(() => setShowConfetti(false), 1000);
    }
  }, [cartState.showConfetti, showConfetti]);

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed luxury header: announcement bar + navbar stay pinned above the hero */}
      <header className="fixed inset-x-0 top-0 z-[90]">
        <AnnouncementBar />
        <Navbar />
      </header>
      <main id="top">
        <AnimatePresence mode="wait">
          <AppRoutes />
        </AnimatePresence>
      </main>
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
}