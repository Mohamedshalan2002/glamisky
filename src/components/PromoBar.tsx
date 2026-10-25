import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

export function PromoBar() {
  const { applyPromo, state } = useCart();
  const [copied, setCopied] = useState(false);
  const applied = state.appliedPromo !== null;

  const apply = async () => {
    applyPromo('NEWCOMERS');
    try {
      await navigator.clipboard.writeText('NEWCOMERS');
    } catch {
      /* clipboard blocked: the code is applied to the bag anyway */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-ink text-paper">
      <div className="page flex flex-wrap items-center justify-center gap-x-3 text-sm">
        <p className="py-1">
          First order: up to <strong className="font-semibold">$499</strong> on us with code{' '}
          <strong className="font-semibold tracking-wide">NEWCOMERS</strong>
        </p>
        <button
          type="button"
          onClick={apply}
          disabled={applied && !copied}
          className="inline-flex min-h-[2.75rem] items-center font-semibold underline underline-offset-4 hover:text-blush disabled:no-underline disabled:opacity-80"
        >
          {copied ? 'Applied to your bag' : applied ? 'Code applied' : 'Apply code'}
        </button>
      </div>
    </div>
  );
}
