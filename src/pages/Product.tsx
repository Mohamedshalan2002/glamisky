import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Heart } from 'lucide-react';
import { categories, getProductById, products } from '../data/products';
import { useCart, EXPRESS_SHIPPING, STANDARD_SHIPPING } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Price } from '../components/ProductCard';
import { discountPercent } from '../lib/pricing';
import { ProductGrid } from '../components/ProductGrid';
import { NotFound } from './NotFound';
import { needsRing, swatchBackground } from '../lib/swatch';
import { SafeImage } from '../components/SafeImage';

export function ProductPage() {
  const { productId } = useParams();
  const product = productId ? getProductById(productId) : undefined;
  if (!product) return <NotFound />;
  // key resets selections when navigating between products
  return <Detail key={product.id} productId={product.id} />;
}

function Detail({ productId }: { productId: string }) {
  const product = getProductById(productId)!;
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const [image, setImage] = useState(0);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : '');
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const category = categories.find((c) => c.id === product.category);
  const saved = has(product.id);
  const off = discountPercent(product);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  useEffect(() => {
    document.title = `${product.name} | Glamisky`;
  }, [product.name]);

  const add = () => {
    if (!size) {
      setSizeError(true);
      document.getElementById('size-group')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    addItem(product, color, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="page pb-28 pt-6 lg:pb-8 lg:pt-10">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-mute">
        <Link to="/" className="hover:underline">Home</Link> /{' '}
        {category && <><Link to={`/category/${category.id}`} className="hover:underline">{category.name}</Link> / </>}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className={`grid gap-3 lg:items-start ${product.images.length > 1 ? 'lg:grid-cols-[5rem_1fr]' : ''}`}>
          {product.images.length > 1 && (
          <div className="order-2 flex gap-2 lg:order-1 lg:flex-col" role="group" aria-label="Product images">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setImage(i)}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={i === image}
                className={`h-24 w-[4.5rem] overflow-hidden rounded-xl border-2 lg:h-24 lg:w-full ${i === image ? 'border-ink' : 'border-transparent'}`}
              >
                <SafeImage src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          )}
          <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-3xl bg-blush lg:order-2">
            <SafeImage src={product.images[image]} alt={product.name} className="h-full w-full object-cover" />
            {off && <span className="absolute left-4 top-4 rounded-full bg-magenta px-3 py-1 text-sm font-bold text-white">−{off}%</span>}
          </div>
        </div>

        <div className="lg:pt-2">
          <h1 className="text-4xl sm:text-5xl">{product.name}</h1>
          <div className="mt-3">
            <Price product={product} large />
          </div>
          <p className="mt-5 max-w-prose leading-relaxed text-mute">{product.description}</p>

          <fieldset className="mt-7">
            <legend className="label">Color: <span className="font-normal text-mute">{color}</span></legend>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={c}
                  aria-pressed={c === color}
                  className={`h-11 w-11 rounded-full p-[3px] ring-offset-2 ring-offset-paper ${c === color ? 'ring-2 ring-ink' : 'ring-1 ring-transparent hover:ring-ink/40'}`}
                >
                  <span className={`block h-full w-full rounded-full ${needsRing(c) ? 'border border-ink/25' : ''}`} style={{ background: swatchBackground(c) }} />
                </button>
              ))}
            </div>
          </fieldset>

          {product.sizes.length > 1 && (
            <fieldset id="size-group" className="mt-6">
              <legend className="label">Size</legend>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setSize(s); setSizeError(false); }}
                    aria-pressed={s === size}
                    className="chip min-w-[3.25rem] justify-center"
                  >
                    {s}
                  </button>
                ))}
              </div>
              {sizeError && <p role="alert" className="error-text">Choose a size to add this to your bag.</p>}
            </fieldset>
          )}

          <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-paper/95 p-3 backdrop-blur lg:static lg:mt-8 lg:border-0 lg:bg-transparent lg:p-0">
            <button type="button" onClick={add} className="btn-primary flex-1">
              {added ? <><Check className="h-5 w-5" /> Added to bag</> : `Add to bag · $${product.price.toFixed(2)}`}
            </button>
            <button
              type="button"
              onClick={() => toggle(product.id)}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              className="btn-line w-12 shrink-0 px-0"
            >
              <Heart className={`h-5 w-5 ${saved ? 'fill-magenta text-magenta' : ''}`} />
            </button>
          </div>
          <p className="sr-only" role="status">{added ? `${product.name} added to your bag` : ''}</p>

          <dl className="mt-8 divide-y divide-line border-y border-line text-[0.95rem]">
            <div className="flex justify-between gap-6 py-3"><dt className="font-semibold">Shipping</dt><dd className="text-right text-mute">${STANDARD_SHIPPING} standard, ${EXPRESS_SHIPPING} express</dd></div>
            <div className="flex justify-between gap-6 py-3"><dt className="font-semibold">Tags</dt><dd className="text-right text-mute">{product.tags.join(', ')}</dd></div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20" aria-labelledby="related">
          <h2 id="related" className="mb-6 text-3xl sm:text-4xl">More {category?.name.toLowerCase()}</h2>
          <ProductGrid products={related} eagerCount={0} />
        </section>
      )}
    </div>
  );
}
