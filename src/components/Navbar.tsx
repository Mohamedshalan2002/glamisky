import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, User, Search, Heart, Crown } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { categories } from '../data/products';
import { useScrollProgress } from '../hooks/useScrollAnimation';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function NavLink({ to, children, className = '', onMouseEnter, onMouseLeave }: NavLinkProps) {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <Link
      to={to}
      onMouseEnter={() => { setIsActive(true); onMouseEnter?.(); }}
      onMouseLeave={() => { setIsActive(false); onMouseLeave?.(); }}
      className={`relative px-3 py-2 text-sm font-medium tracking-wide uppercase text-obsidian-700 hover:text-obsidian-950 transition-colors ${className}`}
    >
      {children}
      <motion.span
        layoutId="underline"
        className="absolute bottom-0 left-0 h-0.5 bg-gold-400 origin-left"
        initial={false}
        animate={{ scaleX: isActive ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </Link>
  );
}

export function Navbar() {
  const { openCart, getItemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const scrollProgress = useScrollProgress();
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const itemCount = getItemCount();

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-0.5 bg-gold-gradient z-[99] transform origin-left"
        style={{ scaleX: scrollProgress }}
        animate={{ scaleX: scrollProgress }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
      
      <motion.nav
        ref={navbarRef}
        className={`relative w-full transition-all duration-300 ${
          isScrolled 
            ? 'glass-dark py-3 shadow-glass' 
            : 'bg-transparent py-5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="section-container">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 z-10"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <motion.span
                whileHover={{ rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.9 }}
                className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight"
              >
                GLAMISKY
              </motion.span>
              <span className="hidden sm:block w-px h-6 bg-gold-400/50 mx-2" />
              <span className="hidden md:block text-xs font-semibold tracking-widest uppercase text-gold-400">
                EST. 2024
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="relative group"
                  onMouseEnter={() => setActiveMegaMenu(cat.id)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <NavLink
                    to={`/category/${cat.id}`}
                    onMouseEnter={() => setActiveMegaMenu(cat.id)}
                    onMouseLeave={() => setActiveMegaMenu(null)}
                  >
                    {cat.name}
                  </NavLink>
                  
                  {/* Mega Menu */}
                  <AnimatePresence>
                    {activeMegaMenu === cat.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scaleY: 0.9 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -10, scaleY: 0.9 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="absolute top-full left-0 mt-4 w-80 glass-dark rounded-none p-6 shadow-glass-hover border border-obsidian-700/50"
                        style={{ zIndex: 50 }}
                      >
                        <div className="grid gap-4">
                          <Link
                            to={`/category/${cat.id}`}
                            className="font-heading text-lg font-medium text-gold-300 hover:text-gold-100 transition-colors"
                          >
                            Shop All {cat.name}
                          </Link>
                          <div className="grid grid-cols-2 gap-3">
                            {['New Arrivals', 'Best Sellers', 'Sale', 'Gift Ideas'].map((item) => (
                              <Link
                                key={item}
                                to={`/category/${cat.id}?filter=${item.toLowerCase().replace(' ', '-')}`}
                                className="text-sm text-obsidian-300 hover:text-white transition-colors px-3 py-2 hover:bg-obsidian-800/50 rounded-none"
                              >
                                {item}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <button
                  className="p-2 text-obsidian-600 hover:text-obsidian-950 transition-colors relative"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Wishlist */}
              <button
                className="p-2 text-obsidian-600 hover:text-obsidian-950 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 text-obsidian-950 text-xs font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* VIP Crown */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                className="p-2 text-gold-400 hover:text-gold-300 transition-colors relative"
                aria-label="VIP Benefits"
              >
                <Crown className="w-5 h-5" />
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openCart}
                className="relative p-2 text-obsidian-600 hover:text-obsidian-950 transition-colors"
                aria-label={`Shopping cart, ${itemCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-obsidian-950 text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Account */}
              <button
                className="p-2 text-obsidian-600 hover:text-obsidian-950 transition-colors lg:hidden"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-obsidian-600 hover:text-obsidian-950 transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[89] bg-obsidian-950/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="section-container py-16">
              <div className="flex flex-col gap-8">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className="font-heading text-2xl font-medium text-white hover:text-gold-400 transition-colors pb-4 border-b border-obsidian-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
                <div className="flex items-center gap-6 pt-4 border-t border-obsidian-800">
                  <Link to="/cart" className="flex items-center gap-3 text-white" onClick={() => { setIsMobileMenuOpen(false); openCart(); }}>
                    <ShoppingBag className="w-6 h-6" />
                    <span className="font-medium">Cart ({itemCount})</span>
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-3 text-obsidian-400" onClick={() => setIsMobileMenuOpen(false)}>
                    <Heart className="w-6 h-6" />
                    <span className="font-medium">Wishlist</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}