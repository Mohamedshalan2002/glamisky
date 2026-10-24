# Glamisky

Storefront for Glamisky: women's dresses, sets, bags, jewelry and sunglasses.
React 19 + TypeScript + Vite + Tailwind 3 + React Router 7.

## Run

```bash
npm install
npm run dev        # http://localhost:5173/glamisky/
npm run build      # type-check + production build (also writes dist/404.html)
npm run deploy     # builds, then publishes dist/ to GitHub Pages
```

`dist/404.html` is a copy of `index.html`. GitHub Pages serves it for deep links such as `/glamisky/product/dress-001`, so the router handles them.

## Structure

- `src/pages`: Home, Collection (category, sale, new arrivals, trending, wishlist, search), Product, NotFound
- `src/components`: Header, PromoBar, ProductCard, CartDrawer, CheckoutModal, Coupon, Footer
- `src/contexts`: cart (bag, promo, checkout) and wishlist
- `src/data/products.ts`: catalog (images, prices, colors, sizes)
- `src/services/paymentGateway.ts`: payment gateway. Currently **simulated**: no money is charged.

## Before going live

- Payments are simulated (`PAYMENTS_SIMULATED` in `src/lib/payments.ts`). Card charging must happen on a server with your secret key. The "Test mode" notice in checkout disappears when you set that flag to `false`.
- Ratings and review counts in `products.ts` are placeholder data. Replace them with real reviews or remove them from the product page.
- Add real shipping and returns policies, then link them from the footer.

## Deploy to Vercel

`vite.config.ts` uses base `/` when building on Vercel (it sets `VERCEL=1`) and `/glamisky/` otherwise, and `vercel.json` rewrites every path to `index.html` so deep links work.

```bash
npx vercel --prod      # from this folder; log in once, accept the defaults (Vite preset)
```

Or import the repo at vercel.com/new. Every push to the default branch (`master`) then deploys automatically.
