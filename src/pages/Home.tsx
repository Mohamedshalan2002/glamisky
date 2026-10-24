import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories, getNewArrivals, getProductById, getSaleProducts, getTrendingProducts, products } from '../data/products';
import { ProductGrid } from '../components/ProductGrid';
import { Coupon } from '../components/Coupon';
import { Price } from '../components/ProductCard';
import { BRAND } from '../lib/brand';
import { EXPRESS_SHIPPING, FREE_ALLOWANCE_CAP, SERVICE_FEE_RATE, STANDARD_SHIPPING } from '../contexts/CartContext';

const lowest = Math.min(...products.map((p) => p.price));
const ceiling = Math.ceil(Math.max(...products.map((p) => p.price)) / 10) * 10;

// Three real products shown in the hero, each linking to its page.
const HERO = [
  { id: 'dress-001', offset: 'sm:mt-16' },
  { id: 'dress-003', offset: 'sm:mt-0' },
  { id: 'dress-002', offset: 'sm:mt-24' },
]
  .map((h) => ({ ...h, product: getProductById(h.id) }))
  .filter((h): h is typeof h & { product: NonNullable<typeof h.product> } => Boolean(h.product));

function SectionHead({ title, to, cta }: { title: string; to: string; cta: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
      <Link to={to} className="inline-flex min-h-[2.75rem] items-center gap-1.5 whitespace-nowrap text-[0.95rem] font-semibold underline-offset-4 hover:underline">
        {cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

export function Home() {
  return (
    <>
      <section className="page grid items-center gap-10 pb-12 pt-8 lg:grid-cols-[1fr_1.25fr] lg:gap-10 lg:pb-20 lg:pt-14">
        <div>
          <h1 className="text-[2.9rem] font-medium leading-[1.02] sm:text-7xl lg:text-[5.75rem]">
            Dress up for under&nbsp;${ceiling}.
          </h1>
          <p className="mt-5 max-w-md text-lg text-mute">
            The {BRAND.season} collection: dresses, sets, bags, jewelry and sunglasses, from ${lowest.toFixed(2)}.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/new-arrivals" className="btn-primary">Shop new arrivals</Link>
            <Link to="/sale" className="btn-line">See the sale</Link>
          </div>
        </div>

        <ul className="grid grid-cols-3 gap-2.5 sm:gap-5" aria-label="Featured pieces">
          {HERO.map(({ product, offset }) => (
            <li key={product.id} className={offset}>
              <Link to={`/product/${product.id}`} className="group block">
                <div className="aspect-[3/5] overflow-hidden rounded-arch bg-blush">
                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" loading="eager" />
                </div>
                <div className="mt-2.5 px-1">
                  <p className="truncate text-sm font-medium group-hover:underline">{product.name}</p>
                  <Price product={product} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Why shop with Glamisky" className="border-y border-line bg-white">
        <dl className="page grid gap-6 py-8 md:grid-cols-3">
          {[
            ['Secure checkout', BRAND.security],
            ['Express shipping', BRAND.shipping],
            ['Conscious sourcing', BRAND.sourcing],
          ].map(([t, d]) => (
            <div key={t}>
              <dt className="font-semibold">{t}</dt>
              <dd className="mt-1 text-mute">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-label="Shop by category" className="page py-14 lg:py-20">
        <ul className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
          {categories.map((c) => (
            <li key={c.id} className="w-32 shrink-0 sm:mx-auto sm:w-full sm:max-w-[10rem]">
              <Link to={`/category/${c.id}`} className="group block text-center">
                <div className="aspect-square overflow-hidden rounded-full bg-blush ring-2 ring-transparent ring-offset-2 ring-offset-paper transition group-hover:ring-ink">
                  <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <span className="mt-3 block font-medium">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="page pb-16 lg:pb-24">
        <SectionHead title="Trending now" to="/trending" cta="View all" />
        <ProductGrid products={getTrendingProducts().slice(0, 4)} eagerCount={0} />
      </section>

      <section className="bg-ink py-14 text-paper lg:py-20" aria-labelledby="offer-title">
        <div className="page grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 id="offer-title" className="text-4xl sm:text-5xl">Your first order is on us.</h2>
            <p className="mt-4 max-w-md text-lg text-paper/80">
              Fill a bag with up to ${FREE_ALLOWANCE_CAP} of pieces and we cover them. The {SERVICE_FEE_RATE * 100}% service fee is waived too.
              You only pay express shipping: ${EXPRESS_SHIPPING} flat instead of the usual ${STANDARD_SHIPPING}.
            </p>
          </div>
          <div className="lg:justify-self-end"><Coupon tone="dark" /></div>
        </div>
      </section>

      <section className="page py-16 lg:py-24">
        <SectionHead title="New arrivals" to="/new-arrivals" cta="View all" />
        <ProductGrid products={getNewArrivals().slice(0, 4)} eagerCount={0} />
      </section>

      <section className="page">
        <SectionHead title="Sale" to="/sale" cta="View all" />
        <ProductGrid products={getSaleProducts().slice(0, 4)} eagerCount={0} />
      </section>
    </>
  );
}
