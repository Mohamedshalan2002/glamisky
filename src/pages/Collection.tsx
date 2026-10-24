import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { categories, getNewArrivals, getSaleProducts, getTrendingProducts, products } from '../data/products';
import { useWishlist } from '../contexts/WishlistContext';
import { ProductGrid } from '../components/ProductGrid';
import { NotFound } from './NotFound';
import type { Product } from '../types';

export type CollectionKind = 'category' | 'sale' | 'new' | 'trending' | 'wishlist' | 'search';
type Sort = 'featured' | 'price-asc' | 'price-desc';

const sorters: Record<Sort, (a: Product, b: Product) => number> = {
  featured: () => 0,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};

export function Collection({ kind }: { kind: CollectionKind }) {
  const { categoryId } = useParams();
  const [params] = useSearchParams();
  const { ids } = useWishlist();
  const [sort, setSort] = useState<Sort>('featured');
  const q = (params.get('q') ?? '').trim();

  const category = kind === 'category' ? categories.find((c) => c.id === categoryId) : undefined;

  const { title, blurb, items, empty } = useMemo(() => {
    switch (kind) {
      case 'category':
        return {
          title: category?.name ?? '',
          blurb: category?.description ?? '',
          items: products.filter((p) => p.category === categoryId),
          empty: 'Nothing here yet.',
        };
      case 'sale':
        return { title: 'Sale', blurb: 'Marked-down pieces while sizes last.', items: getSaleProducts(), empty: 'No sale items right now.' };
      case 'new':
        return { title: 'New arrivals', blurb: 'The latest pieces to join the shop.', items: getNewArrivals(), empty: 'No new arrivals right now.' };
      case 'trending':
        return { title: 'Trending now', blurb: 'What shoppers are adding to their bags.', items: getTrendingProducts(), empty: 'Nothing trending right now.' };
      case 'wishlist':
        return {
          title: 'Wishlist',
          blurb: 'Pieces you’ve saved.',
          items: products.filter((p) => ids.includes(p.id)),
          empty: 'Tap the heart on any piece to save it here.',
        };
      case 'search': {
        const term = q.toLowerCase();
        return {
          title: q ? `Results for “${q}”` : 'Search',
          blurb: '',
          items: term ? products.filter((p) => `${p.name} ${p.tags.join(' ')} ${p.category}`.toLowerCase().includes(term)) : [],
          empty: q ? 'No pieces match that search. Try “dress”, “gold” or “bag”.' : 'Type something to search.',
        };
      }
    }
  }, [kind, category, categoryId, ids, q]);

  useEffect(() => {
    document.title = `${title || 'Glamisky'} | Glamisky`;
  }, [title]);

  if (kind === 'category' && !category) return <NotFound />;

  const sorted = [...items].sort(sorters[sort]);

  return (
    <div className="page pb-8 pt-8 lg:pt-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-4xl sm:text-6xl">{title}</h1>
        {blurb && <p className="mt-3 text-lg text-mute">{blurb}</p>}
      </header>

      {kind === 'category' && (
        <nav aria-label="Categories" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map((c) => (
            <Link key={c.id} to={`/category/${c.id}`} className="chip shrink-0" aria-current={c.id === categoryId ? 'page' : undefined}>
              {c.name}
            </Link>
          ))}
        </nav>
      )}

      {items.length > 0 ? (
        <>
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-4">
            <p className="text-mute" aria-live="polite">{items.length} {items.length === 1 ? 'piece' : 'pieces'}</p>
            <label className="flex items-center gap-2 text-sm font-medium">
              Sort
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-full border border-line bg-white px-4 py-2.5 text-sm">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
          </div>
          <ProductGrid products={sorted} />
        </>
      ) : (
        <div className="rounded-3xl bg-blush/60 px-6 py-16 text-center">
          <p className="font-display text-2xl">{empty}</p>
          <Link to="/new-arrivals" className="btn-dark mt-6">Shop new arrivals</Link>
        </div>
      )}
    </div>
  );
}
