import { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { PaymentDetails, ShippingAddress } from '../types';
import { COUNTRIES } from '../lib/countries';
import { PAYMENTS_SIMULATED } from '../lib/payments';
import {
  detectCardBrand,
  formatCardNumber,
  formatCvv,
  formatExpiry,
  validateCardNumber,
  validateCvv,
  validateExpiry,
} from '../services/paymentGateway';

const money = (n: number) => `$${n.toFixed(2)}`;

type Errors = Record<string, string>;

const emptyAddress: ShippingAddress = {
  fullName: '', email: '', phone: '', countryCode: 'US', country: 'United States',
  city: '', postalCode: '', streetAddress: '', apartment: '',
};

export function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { state, totals, processPayment, clearCart } = useCart();
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [payError, setPayError] = useState('');
  const dialog = useRef<HTMLDivElement>(null);
  const order = state.order;
  const brand = detectCardBrand(card.number);

  useEffect(() => {
    dialog.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const close = () => (order ? clearCart() : onClose());
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const setA = (k: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setAddress((a) => ({ ...a, [k]: e.target.value }));

  const submitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (!address.fullName.trim()) er.fullName = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) er.email = 'Enter a valid email, like name@example.com.';
    if (address.phone.replace(/\D/g, '').length < 7) er.phone = 'Enter a phone number the courier can call.';
    if (!address.streetAddress.trim()) er.streetAddress = 'Enter your street address.';
    if (!address.city.trim()) er.city = 'Enter your city.';
    if (!address.postalCode.trim()) er.postalCode = 'Enter your postal code.';
    setErrors(er);
    if (Object.keys(er).length) {
      document.getElementById(`co-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    setStep('payment');
    dialog.current?.scrollTo({ top: 0 });
  };

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (!validateCardNumber(card.number)) er.number = 'Check the card number.';
    if (!card.name.trim()) er.name = 'Enter the name on the card.';
    if (!validateExpiry(card.expiry)) er.expiry = 'Use MM/YY, in the future.';
    if (!validateCvv(card.cvv, brand)) er.cvv = `Enter the ${brand === 'amex' ? 4 : 3}-digit code.`;
    setErrors(er);
    if (Object.keys(er).length) {
      document.getElementById(`co-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    const details: PaymentDetails = {
      method: 'card',
      cardNumber: card.number.replace(/\s/g, ''),
      cardHolderName: card.name,
      expiryDate: card.expiry,
      cvv: card.cvv,
      cardBrand: brand,
    };
    setBusy(true);
    setPayError('');
    try {
      await processPayment({ ...address, apartment: address.apartment || undefined }, details);
    } catch (err) {
      setPayError(err instanceof Error ? err.message : 'The payment didn’t go through. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-stretch justify-center bg-ink/60 sm:items-center sm:p-6">
      <div
        ref={dialog}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="co-title"
        className="relative flex max-h-full w-full max-w-5xl flex-col overflow-y-auto bg-paper outline-none sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-line bg-paper px-5 sm:px-8">
          <h2 id="co-title" className="font-display text-2xl">{order ? 'Order placed' : 'Checkout'}</h2>
          <button type="button" onClick={close} disabled={busy} aria-label="Close checkout" className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full hover:bg-blush disabled:opacity-40">
            <X className="h-6 w-6" />
          </button>
        </div>

        {order ? (
          <Confirmation onDone={clearCart} />
        ) : (
          <div className="grid gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
            <div>
              <ol className="mb-6 flex gap-2 text-sm font-semibold" aria-label="Checkout steps">
                <li aria-current={step === 'shipping' ? 'step' : undefined} className={`rounded-full px-4 py-1.5 ${step === 'shipping' ? 'bg-ink text-paper' : 'bg-blush'}`}>Shipping</li>
                <li aria-current={step === 'payment' ? 'step' : undefined} className={`rounded-full px-4 py-1.5 ${step === 'payment' ? 'bg-ink text-paper' : 'bg-blush text-mute'}`}>Payment</li>
              </ol>

              <details className="mb-6 rounded-2xl border border-line bg-white lg:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-semibold">
                  <span>Order summary</span><span>{money(totals.total)}</span>
                </summary>
                <div className="border-t border-line p-4"><Summary /></div>
              </details>

              {step === 'shipping' ? (
                <form onSubmit={submitShipping} noValidate className="grid gap-4 sm:grid-cols-2">
                  <Field id="fullName" label="Full name" error={errors.fullName} className="sm:col-span-2">
                    <input className="field" autoComplete="name" value={address.fullName} onChange={setA('fullName')} />
                  </Field>
                  <Field id="email" label="Email" error={errors.email}>
                    <input className="field" type="email" autoComplete="email" value={address.email} onChange={setA('email')} />
                  </Field>
                  <Field id="phone" label="Phone" error={errors.phone}>
                    <input className="field" type="tel" autoComplete="tel" value={address.phone} onChange={setA('phone')} />
                  </Field>
                  <Field id="country" label="Country" className="sm:col-span-2">
                    <select
                      className="field"
                      autoComplete="country"
                      value={address.countryCode}
                      onChange={(e) => {
                        const c = COUNTRIES.find((x) => x.code === e.target.value)!;
                        setAddress((a) => ({ ...a, countryCode: c.code, country: c.name }));
                      }}
                    >
                      {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </Field>
                  <Field id="streetAddress" label="Street address" error={errors.streetAddress} className="sm:col-span-2">
                    <input className="field" autoComplete="address-line1" value={address.streetAddress} onChange={setA('streetAddress')} />
                  </Field>
                  <Field id="apartment" label="Apartment, suite (optional)" className="sm:col-span-2">
                    <input className="field" autoComplete="address-line2" value={address.apartment ?? ''} onChange={setA('apartment')} />
                  </Field>
                  <Field id="city" label="City" error={errors.city}>
                    <input className="field" autoComplete="address-level2" value={address.city} onChange={setA('city')} />
                  </Field>
                  <Field id="postalCode" label="Postal code" error={errors.postalCode}>
                    <input className="field" autoComplete="postal-code" value={address.postalCode} onChange={setA('postalCode')} />
                  </Field>
                  <button type="submit" className="btn-primary mt-2 sm:col-span-2">Continue to payment</button>
                </form>
              ) : (
                <form onSubmit={submitPayment} noValidate className="grid gap-4 sm:grid-cols-2">
                  {PAYMENTS_SIMULATED && (
                    <p className="rounded-xl bg-lilac px-4 py-3 text-sm sm:col-span-2" role="note">
                      <strong>Test mode.</strong> No real payment is taken here, so please don’t enter a real card number.
                    </p>
                  )}
                  <Field id="number" label="Card number" error={errors.number} className="sm:col-span-2">
                    <input
                      className="field"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 5678 9012 3456"
                      value={card.number}
                      onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
                    />
                  </Field>
                  <Field id="name" label="Name on card" error={errors.name} className="sm:col-span-2">
                    <input className="field" autoComplete="cc-name" value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} />
                  </Field>
                  <Field id="expiry" label="Expiry" error={errors.expiry}>
                    <input
                      className="field"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                    />
                  </Field>
                  <Field id="cvv" label="Security code" error={errors.cvv}>
                    <input
                      className="field"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={card.cvv}
                      onChange={(e) => setCard((c) => ({ ...c, cvv: formatCvv(e.target.value, brand) }))}
                    />
                  </Field>
                  {payError && <p role="alert" className="error-text sm:col-span-2">{payError}</p>}
                  <button type="submit" disabled={busy} className="btn-primary mt-2 sm:col-span-2">
                    {busy ? 'Processing payment…' : `Pay ${money(totals.total)}`}
                  </button>
                  <button type="button" disabled={busy} onClick={() => setStep('shipping')} className="text-sm underline underline-offset-4 sm:col-span-2">
                    Back to shipping
                  </button>
                </form>
              )}
            </div>

            <aside className="hidden lg:block" aria-label="Order summary">
              <div className="sticky top-24 rounded-2xl border border-line bg-white p-5"><Summary /></div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ id, label, error, className = '', children }: { id: string; label: string; error?: string; className?: string; children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>> }) {
  const inputId = `co-${id}`;
  const child = {
    ...children,
    props: {
      ...children.props,
      id: inputId,
      'aria-invalid': error ? ('true' as const) : undefined,
      'aria-describedby': error ? `${inputId}-error` : undefined,
    },
  };
  return (
    <div className={className}>
      <label htmlFor={inputId} className="label">{label}</label>
      {child}
      {error && <p id={`${inputId}-error`} className="error-text">{error}</p>}
    </div>
  );
}

function Summary() {
  const { state, totals } = useCart();
  return (
    <>
      <ul className="space-y-3">
        {state.items.map((i) => (
          <li key={`${i.product.id}-${i.selectedColor}-${i.selectedSize}`} className="flex items-center gap-3 text-sm">
            <img src={i.product.images[0]} alt="" className="h-16 w-12 rounded-lg object-cover" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{i.product.name}</span>
              <span className="text-mute">{i.selectedColor}{i.selectedSize !== 'One Size' && ` · ${i.selectedSize}`} · Qty {i.quantity}</span>
            </span>
            <span className="font-semibold">{money(i.product.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
        <Line label="Subtotal" value={money(totals.subtotal)} />
        {totals.isFirstOrderFree && <Line label="First-order credit" value={`−${money(totals.discount)}`} accent />}
        <Line label="Service fee" value={totals.isFirstOrderFree ? 'Waived' : money(totals.serviceFee)} />
        <Line label={totals.isFirstOrderFree ? 'Express shipping' : 'Shipping'} value={money(totals.shippingFee)} />
        <div className="flex justify-between border-t border-line pt-3 text-lg font-bold"><dt>Total</dt><dd>{money(totals.total)}</dd></div>
      </dl>
    </>
  );
}

function Line({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`flex justify-between ${accent ? 'font-semibold text-magenta' : ''}`}>
      <dt className={accent ? '' : 'text-mute'}>{label}</dt><dd>{value}</dd>
    </div>
  );
}

function Confirmation({ onDone }: { onDone: () => void }) {
  const { state } = useCart();
  const order = state.order!;
  const last4 = order.paymentDetails.cardNumber;
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-12 text-center sm:px-8">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-magenta text-white"><Check className="h-7 w-7" /></span>
      <h3 className="mt-5 text-4xl">Thank you, {order.shippingAddress.fullName.split(' ')[0]}.</h3>
      <p className="mt-3 text-mute">We’ve sent a confirmation to {order.shippingAddress.email}.</p>
      <dl className="mx-auto mt-8 grid max-w-sm gap-3 rounded-2xl border border-line bg-white p-5 text-left text-sm">
        <div className="flex justify-between"><dt className="text-mute">Order</dt><dd className="font-semibold">{order.id}</dd></div>
        {order.trackingNumber && <div className="flex justify-between"><dt className="text-mute">Tracking</dt><dd className="font-semibold">{order.trackingNumber}</dd></div>}
        <div className="flex justify-between"><dt className="text-mute">Total paid</dt><dd className="font-semibold">{money(order.totals.total)}</dd></div>
        {last4 && <div className="flex justify-between"><dt className="text-mute">Card</dt><dd className="font-semibold">•••• {last4}</dd></div>}
        <div className="flex justify-between"><dt className="text-mute">Ship to</dt><dd className="text-right font-semibold">{order.shippingAddress.city}, {order.shippingAddress.country}</dd></div>
      </dl>
      <button type="button" onClick={onDone} className="btn-primary mt-8">Continue shopping</button>
    </div>
  );
}
