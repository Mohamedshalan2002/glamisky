import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Product } from '../types';
import { useWishlist } from '../contexts/WishlistContext';
import { discountPercent } from '../lib/pricing';
import { SafeImage } from './SafeImage';

export function Price({ product, large = false }: { product: Product; large?: boolean }) {
  const off = discountPercent(product);
  return (
    <p className={`flex items-baseline gap-2 ${large ? 'text-2xl' : 'text-[0.95rem]'}`}>
      <span className={`font-semibold ${off ? 'text-magenta' : ''}`}>${product.price.toFixed(2)}</span>
      {off && (
        <>
          <span className="text-mute line-through">${product.originalPrice!.toFixed(2)}</span>
          <span className="sr-only">{off}% off</span>
        </>
      )}
    </p>
  );
}

export function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const { has, toggle } = useWishlist();
  const saved = has(product.id);
  const off = discountPercent(product);
  const second = product.images[1];

  return (
    <article className="group relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-blush">
          <SafeImage
            src={product.images[0]}
            alt={product.name}
            loading={eager ? 'eager' : 'lazy'}
            className="h-full w-full object-cover"
          />
          {second && (
            <SafeImage
              hideOnError
              src={second}
              alt=""
              loading="lazy"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100"
            />
          )}
          <div className="absolute left-3 top-3 flex gap-1.5">
            {off && <span className="rounded-full bg-magenta px-2.5 py-1 text-xs font-bold text-white">−{off}%</span>}
            {product.isNew && <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-paper">New</span>}
          </div>
        </div>
        <div className="mt-3 space-y-0.5">
          <h3 className="font-sans text-[0.95rem] font-medium leading-snug tracking-normal">{product.name}</h3>
          <Price product={product} />
          <p className="text-sm text-mute">{product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}</p>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggle(product.id)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        className="absolute right-2.5 top-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-paper/90 text-ink transition-colors hover:bg-white"
      >
        <Heart className={`h-5 w-5 ${saved ? 'fill-magenta text-magenta' : ''}`} />
      </button>
    </article>
  );
}
