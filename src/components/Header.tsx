import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { categories, products } from '../data/products';
import { SafeImage } from './SafeImage';

const SHORT: Record<string, string> = {
  dresses: 'Dresses',
  'tops-sets': 'Tops & Sets',
  bags: 'Bags',
  jewelry: 'Jewelry',
  sunglasses: 'Sunglasses',
};

const links = [
  ...categories.map((c) => ({ to: `/category/${c.id}`, label: SHORT[c.id] ?? c.name })),
  { to: '/sale', label: 'Sale' },
];

function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export function Header() {
  const { openCart, getItemCount } = useCart();
  const { ids } = useWishlist();
  // The menu is open only on the page it was opened from, so navigating closes it.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const count = getItemCount();
  const menuOpen = menuPath === location.pathname;

  useLockBody(menuOpen);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="page flex h-16 items-center gap-4">
        <button
          type="button"
          className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full hover:bg-blush lg:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuPath(location.pathname)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link to="/" className="flex min-h-11 items-center font-display text-[1.7rem] font-medium italic leading-none tracking-tight">
          Glamisky
        </Link>

        <nav aria-label="Main" className="ml-8 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `inline-flex min-h-11 items-center rounded-full px-4 text-[0.95rem] font-medium transition-colors hover:bg-blush ${
                  l.to === '/sale' ? 'text-magenta' : ''
                } ${isActive ? 'underline decoration-2 underline-offset-[10px]' : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center">
          <IconButton label="Search" onClick={() => setSearchOpen(true)}>
            <Search className="h-[1.35rem] w-[1.35rem]" />
          </IconButton>
          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${ids.length} saved`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-blush"
          >
            <Heart className="h-[1.35rem] w-[1.35rem]" />
            {ids.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[0.65rem] font-bold text-paper">
                {ids.length}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-blush"
          >
            <ShoppingBag className="h-[1.35rem] w-[1.35rem]" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full bg-magenta px-1 text-[0.7rem] font-bold text-white">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuPath(null)} />}
        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-blush"
    >
      {children}
    </button>
  );
}

function useEscape(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  useEscape(onClose);
  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-50 flex flex-col bg-paper lg:hidden"
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="page flex h-16 items-center justify-between">
        <span className="font-display text-[1.7rem] font-medium italic">Glamisky</span>
        <button type="button" aria-label="Close menu" onClick={onClose} className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full hover:bg-blush">
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav aria-label="Mobile" className="page flex flex-1 flex-col overflow-y-auto pb-10">
        {[{ to: '/new-arrivals', label: 'New arrivals' }, ...links].map((l) => (
          <Link
            key={l.to}
            to={l.to}
            onClick={onClose}
            className={`border-b border-line py-4 font-display text-3xl ${l.to === '/sale' ? 'text-magenta' : ''}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </motion.div>,
    document.body,
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  useEscape(onClose);
  useLockBody(true);
  useEffect(() => input.current?.focus(), []);

  const term = q.trim().toLowerCase();
  const results = term
    ? products
        .filter((p) => `${p.name} ${p.tags.join(' ')} ${p.category}`.toLowerCase().includes(term))
        .slice(0, 6)
    : [];

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-50 bg-ink/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-paper pb-6 shadow-xl"
        initial={{ y: -24 }}
        animate={{ y: 0 }}
        exit={{ y: -24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <form
          className="page flex h-16 items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!term) return;
            navigate(`/search?q=${encodeURIComponent(q.trim())}`);
            onClose();
          }}
        >
          <Search className="h-5 w-5 shrink-0 text-mute" aria-hidden="true" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="search"
            placeholder="Search dresses, bags, gold hoops…"
            aria-label="Search products"
            className="h-full flex-1 bg-transparent text-lg placeholder:text-mute/70 focus:outline-none"
          />
          <button type="button" aria-label="Close search" onClick={onClose} className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full hover:bg-blush">
            <X className="h-6 w-6" />
          </button>
        </form>

        {term && (
          <div className="page border-t border-line pt-4">
            {results.length === 0 ? (
              <p className="py-6 text-mute">Nothing matches “{q.trim()}”. Try a category like dresses or bags.</p>
            ) : (
              <ul className="grid gap-1 sm:grid-cols-2">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link to={`/product/${p.id}`} onClick={onClose} className="flex items-center gap-4 rounded-xl p-2 hover:bg-blush">
                      <SafeImage src={p.images[0]} alt="" className="h-16 w-14 shrink-0 rounded-lg object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{p.name}</span>
                        <span className="text-sm text-mute">${p.price.toFixed(2)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  );
}
