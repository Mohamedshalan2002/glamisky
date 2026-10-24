import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useCart, EXPRESS_SHIPPING, FREE_ALLOWANCE_CAP } from '../contexts/CartContext';

export function Coupon({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { applyPromo, state } = useCart();
  const [copied, setCopied] = useState(false);
  const applied = state.appliedPromo !== null;

  const use = async () => {
    applyPromo('NEWCOMERS');
    try {
      await navigator.clipboard.writeText('NEWCOMERS');
    } catch {
      /* clipboard blocked */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const dark = tone === 'dark';
  return (
    <div
      className={`flex w-full max-w-md items-stretch rounded-2xl border-2 border-dashed ${
        dark ? 'border-paper/50 bg-paper/5' : 'border-ink/40 bg-white'
      }`}
    >
      <div className="flex-1 px-5 py-4">
        <p className={`text-sm ${dark ? 'text-paper/80' : 'text-mute'}`}>First order code</p>
        <p className="font-display text-2xl font-semibold tracking-wider">NEWCOMERS</p>
        <p className={`mt-1 text-sm ${dark ? 'text-paper/80' : 'text-mute'}`}>
          Up to ${FREE_ALLOWANCE_CAP} of items on us. You pay ${EXPRESS_SHIPPING} express shipping.
        </p>
      </div>
      <button
        type="button"
        onClick={use}
        className={`flex w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-r-[0.85rem] border-l-2 border-dashed text-sm font-semibold transition-colors ${
          dark ? 'border-paper/50 hover:bg-paper/10' : 'border-ink/40 hover:bg-blush'
        }`}
      >
        {copied || applied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        {copied ? 'Applied' : applied ? 'In bag' : 'Use code'}
      </button>
    </div>
  );
}
