import { Link } from 'react-router-dom';
import { categories } from '../data/products';
import { BRAND } from '../lib/brand';

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-blush/50">
      <div className="page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl font-medium italic">Glamisky</p>
          <p className="mt-3 max-w-xs text-mute">Dresses, sets, bags, jewelry and sunglasses. Every piece under $30.</p>
        </div>
        <nav aria-label="Shop">
          <h2 className="font-sans text-base font-bold tracking-normal">Shop</h2>
          <ul className="mt-3 space-y-2">
            <li><Link className="hover:underline" to="/new-arrivals">New arrivals</Link></li>
            {categories.map((c) => (
              <li key={c.id}><Link className="hover:underline" to={`/category/${c.id}`}>{c.name}</Link></li>
            ))}
            <li><Link className="font-medium text-magenta hover:underline" to="/sale">Sale</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="font-sans text-base font-bold tracking-normal">Help</h2>
          <p className="mt-3 text-mute">Questions about an order?</p>
          <a className="font-medium underline underline-offset-4" href="mailto:hello@glamisky.com">hello@glamisky.com</a>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="page py-5 text-sm text-mute">© {YEAR} Glamisky · {BRAND.established}</p>
      </div>
    </footer>
  );
}
