import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useCart, FREE_ALLOWANCE_CAP, SERVICE_FEE_RATE } from '../contexts/CartContext';
import { swatchBackground } from '../lib/swatch';

const money = (n: number) => `$${n.toFixed(2)}`;

export function CartDrawer() {
  const { state, closeCart } = useCart();
  return <AnimatePresence>{state.isCartOpen && <Drawer key="drawer" onClose={closeCart} />}</AnimatePresence>;
}

function Drawer({ onClose }: { onClose: () => void }) {
  const { state, totals, removeItem, updateQuantity, applyPromo, removePromo, openCheckout } = useCart();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const closeBtn = useRef<HTMLButtonElement>(null);
  const empty = state.items.length === 0;

  useEffect(() => {
    closeBtn.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    if (applyPromo(code)) {
      setCode('');
      setCodeError('');
    } else {
      setCodeError('That code isn’t valid. Check the spelling and try again.');
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[60] bg-ink/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-paper shadow-2xl"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <h2 className="font-display text-2xl">Your bag{!empty && <span className="ml-2 font-sans text-base text-mute">({state.items.reduce((n, i) => n + i.quantity, 0)})</span>}</h2>
          <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close bag" className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full hover:bg-blush">
            <X className="h-6 w-6" />
          </button>
        </div>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBag className="h-10 w-10 text-mute" aria-hidden="true" />
            <p className="font-display text-2xl">Your bag is empty</p>
            <p className="text-mute">Start with what’s new this week.</p>
            <Link to="/new-arrivals" onClick={onClose} className="btn-primary">Shop new arrivals</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {state.items.map((item) => {
                const { product: p, selectedColor: color, selectedSize: size, quantity } = item;
                return (
                  <li key={`${p.id}-${color}-${size}`} className="flex gap-4 py-5">
                    <Link to={`/product/${p.id}`} onClick={onClose} className="shrink-0">
                      <img src={p.images[0]} alt={p.name} className="h-28 w-[5.25rem] rounded-xl object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <Link to={`/product/${p.id}`} onClick={onClose} className="font-medium leading-snug hover:underline">{p.name}</Link>
                        <p className="font-semibold">{money(p.price * quantity)}</p>
                      </div>
                      <p className="mt-1 flex items-center gap-2 text-sm text-mute">
                        <span className="h-3.5 w-3.5 rounded-full border border-ink/20" style={{ background: swatchBackground(color) }} aria-hidden="true" />
                        {color}{size !== 'One Size' && ` · ${size}`}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center rounded-full border border-line bg-white">
                          <button type="button" aria-label={`Decrease quantity of ${p.name}`} onClick={() => updateQuantity(p.id, color, size, quantity - 1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-blush">
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold" aria-live="polite">{quantity}</span>
                          <button type="button" aria-label={`Increase quantity of ${p.name}`} onClick={() => updateQuantity(p.id, color, size, quantity + 1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-blush">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button type="button" onClick={() => removeItem(p.id, color, size)} className="text-sm text-mute underline underline-offset-4 hover:text-ink">
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="shrink-0 space-y-4 border-t border-line bg-white px-5 py-5">
              {totals.isFirstOrderFree ? (
                <div className="rounded-xl bg-lilac px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">NEWCOMERS applied</p>
                    <button type="button" onClick={removePromo} className="underline underline-offset-4">Remove</button>
                  </div>
                  <p className="mt-1">
                    {money(totals.freeAllowanceUsed)} of {money(FREE_ALLOWANCE_CAP)} used
                    {totals.freeAllowanceRemaining > 0 ? `, ${money(totals.freeAllowanceRemaining)} left to spend` : ''}.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitCode} noValidate>
                  <label htmlFor="promo" className="label">Promo code</label>
                  <div className="flex gap-2">
                    <input
                      id="promo"
                      value={code}
                      onChange={(e) => { setCode(e.target.value); setCodeError(''); }}
                      className="field"
                      placeholder="NEWCOMERS"
                      autoCapitalize="characters"
                      aria-invalid={codeError ? 'true' : undefined}
                      aria-describedby={codeError ? 'promo-error' : undefined}
                    />
                    <button type="submit" className="btn-dark px-5">Apply</button>
                  </div>
                  {codeError && <p id="promo-error" className="error-text" role="alert">{codeError}</p>}
                </form>
              )}

              <dl className="space-y-1.5 text-[0.95rem]">
                <Row label="Subtotal" value={money(totals.subtotal)} />
                {totals.isFirstOrderFree && <Row label="First-order credit" value={`−${money(totals.discount)}`} accent />}
                <Row label={totals.isFirstOrderFree ? 'Service fee' : `Service fee (${SERVICE_FEE_RATE * 100}%)`} value={totals.isFirstOrderFree ? 'Waived' : money(totals.serviceFee)} />
                <Row label={totals.isFirstOrderFree ? 'Express shipping' : 'Shipping'} value={money(totals.shippingFee)} />
                <div className="flex justify-between border-t border-line pt-3 text-lg font-bold">
                  <dt>Total</dt>
                  <dd>{money(totals.total)}</dd>
                </div>
              </dl>

              <button type="button" className="btn-primary w-full" onClick={() => { onClose(); openCheckout(); }}>
                Checkout · {money(totals.total)}
              </button>
            </div>
          </>
        )}
      </motion.aside>
    </>
  );
}

function Row({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`flex justify-between ${accent ? 'font-semibold text-magenta' : ''}`}>
      <dt className={accent ? '' : 'text-mute'}>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
