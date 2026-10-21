import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, Sparkles, Gift, Truck, Shield, Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { FREE_ALLOWANCE_CAP, STANDARD_SHIPPING, EXPRESS_SHIPPING, SERVICE_FEE_RATE } from '../contexts/CartContext';

export function CartDrawer() {
  const { state, totals, closeCart, removeItem, updateQuantity, applyPromo, removePromo, openCheckout, getItemCount } = useCart();
  const [promoInput, setPromoInput] = useState('');

  const handlePromoSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromo(promoInput.trim());
      setPromoInput('');
    }
  }, [promoInput, applyPromo]);

  const handleQuickApply = useCallback(() => {
    applyPromo('NEWCOMERS');
  }, [applyPromo]);

  if (!state.isCartOpen) return null;

  const itemCount = getItemCount();
  const freeAllowanceProgress = totals.isFirstOrderFree 
    ? Math.min(100, (totals.freeAllowanceUsed / FREE_ALLOWANCE_CAP) * 100)
    : 0;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[95] bg-obsidian-950/60 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-md lg:max-w-xl z-[96] glass-dark flex flex-col"
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-obsidian-800">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="p-2 bg-gold-gradient rounded-none"
            >
              <Sparkles className="w-6 h-6 text-obsidian-950" />
            </motion.div>
            <div>
              <h2 className="font-heading text-xl font-medium text-white">Shopping Bag</h2>
              <p className="text-sm text-obsidian-400">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-obsidian-400 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {state.items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-64 text-center text-obsidian-400"
            >
              <ShoppingBag className="w-16 h-16 mb-4 opacity-30" />
              <p className="font-heading text-lg font-medium text-white mb-2">Your bag is empty</p>
              <p className="text-sm max-w-xs">Discover pieces you'll love and add them here.</p>
            </motion.div>
          ) : (
            <motion.ul className="space-y-4" role="list">
              {state.items.map((item, index) => (
                <CartItemCard
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${index}`}
                  item={item}
                  index={index}
                  onRemove={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}
                  onQuantityChange={(qty) => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, qty)}
                />
              ))}
            </motion.ul>
          )}
        </div>

        {/* Promo Code & Progress */}
        <div className="p-4 border-t border-obsidian-800 space-y-4">
          {/* Free Allowance Progress Bar */}
          <AnimatePresence>
            {totals.isFirstOrderFree && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 p-4 bg-gold-500/10 border border-gold-400/30 rounded-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-gold-400" />
                    <span className="font-semibold text-gold-300">$499 Welcome Allowance</span>
                  </div>
                  <span className="text-sm font-mono text-gold-400">
                    {formatCurrency(totals.freeAllowanceUsed)} / {formatCurrency(FREE_ALLOWANCE_CAP)}
                  </span>
                </div>
                <div className="h-2 bg-obsidian-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${freeAllowanceProgress}%` }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="h-full bg-gold-gradient rounded-full"
                  />
                </div>
                <p className="text-xs text-gold-300/80">
                  {totals.freeAllowanceRemaining > 0
                    ? `You have ${formatCurrency(totals.freeAllowanceRemaining)} remaining on your first order`
                    : 'Welcome allowance fully utilized!'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Promo Code Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <label className="label-luxury">Promo Code</label>
            <form onSubmit={handlePromoSubmit} className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="Enter code..."
                className="input-luxury flex-1 text-sm uppercase tracking-wider"
                aria-label="Promo code"
              />
              <button
                type="submit"
                disabled={!promoInput.trim()}
                className="btn-primary px-4 py-3 text-xs whitespace-nowrap disabled:opacity-50"
              >
                Apply
              </button>
            </form>
            
            {/* Quick Apply NEWCOMERS */}
            <button
              onClick={handleQuickApply}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold tracking-wider uppercase text-obsidian-950 bg-gold-gradient/20 border border-gold-400/50 rounded-none hover:bg-gold-gradient/40 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              One-Click: Apply NEWCOMERS
            </button>

            {/* Applied Promo Badge */}
            <AnimatePresence>
              {state.appliedPromo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-start gap-3 p-3 bg-gold-500/10 border border-gold-400/30 rounded-none"
                >
                  <div className="flex-shrink-0 p-1.5 bg-gold-500 rounded-none">
                    <Sparkles className="w-4 h-4 text-obsidian-950" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gold-300">VIP Newcomer Privilege Applied</p>
                    <p className="text-xs text-gold-300/80 mt-0.5">
                      First Order On Us (Up to $499 Covered) + Zero Service Fees!
                    </p>
                  </div>
                  <button
                    onClick={removePromo}
                    className="p-1 text-gold-300/60 hover:text-gold-300 transition-colors"
                    aria-label="Remove promo code"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Totals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 border-t border-obsidian-800 pt-4"
          >
            <div className="flex justify-between text-sm">
              <span className="text-obsidian-400">Subtotal</span>
              <span className="font-medium text-white">{formatCurrency(totals.subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-obsidian-400">Service & Handling (10%)</span>
              <span className="font-medium text-white">
                {totals.isFirstOrderFree ? (
                  <>
                    <s className="text-obsidian-500">{formatCurrency(totals.subtotal * SERVICE_FEE_RATE)}</s>
                    <span className="ml-2 text-gold-400 font-semibold">Waived</span>
                  </>
                ) : (
                  formatCurrency(totals.serviceFee)
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-obsidian-400">Shipping</span>
              <span className="font-medium text-white">
                {totals.isFirstOrderFree ? (
                  <>
                    <s className="text-obsidian-500">{formatCurrency(STANDARD_SHIPPING)}</s>
                    <span className="ml-2 text-white">{formatCurrency(EXPRESS_SHIPPING)}</span>
                    <span className="ml-1 text-xs text-gold-400">Express</span>
                  </>
                ) : (
                  formatCurrency(STANDARD_SHIPPING)
                )}
              </span>
            </div>

            {totals.discount > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between text-sm text-gold-400"
              >
                <span>VIP Discount (NEWCOMERS)</span>
                <span className="font-semibold">-{formatCurrency(totals.discount)}</span>
              </motion.div>
            )}

            <div className="flex justify-between text-lg font-semibold text-white border-t border-obsidian-800 pt-3">
              <span>Total</span>
              <span className="text-gold-300">{formatCurrency(totals.total)}</span>
            </div>

            {totals.isFirstOrderFree && (
              <p className="text-xs text-center text-gold-300/70 bg-gold-500/10 px-3 py-2 rounded-none border border-gold-400/20">
                Final total: <span className="font-bold">{formatCurrency(totals.total)}</span> (Express shipping included)
              </p>
            )}
          </motion.div>

          {/* Checkout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openCheckout}
            disabled={state.items.length === 0}
            className="btn-gold w-full py-5 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Proceed to Checkout
              <Truck className="w-4 h-4" />
            </span>
          </motion.button>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 text-xs text-obsidian-500">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>PCI-DSS Level 1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>DHL/FedEx</span>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function CartItemCard({ item, index, onRemove, onQuantityChange }: {
  item: { product: any; quantity: number; selectedColor: string; selectedSize: string };
  index: number;
  onRemove: () => void;
  onQuantityChange: (qty: number) => void;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-4 p-3 bg-white/5 backdrop-blur-sm border border-obsidian-800/50 rounded-none"
    >
      <div className="relative w-20 h-28 flex-shrink-0 overflow-hidden bg-obsidian-900">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="font-heading text-sm font-medium text-white line-clamp-1">{item.product.name}</p>
          <p className="text-xs text-obsidian-400 mt-1">
            {item.selectedColor} / {item.selectedSize}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 bg-obsidian-900 border border-obsidian-700 rounded-none">
            <button
              onClick={() => onQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="px-2 py-1 text-obsidian-400 hover:text-white disabled:opacity-30 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 font-mono text-sm text-white w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(item.quantity + 1)}
              className="px-2 py-1 text-obsidian-400 hover:text-white transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <span className="font-heading font-medium text-white">
            ${(item.product.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={onRemove}
        className="p-2 text-obsidian-500 hover:text-red-400 transition-colors flex-shrink-0"
        aria-label="Remove item"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </motion.li>
  );
}