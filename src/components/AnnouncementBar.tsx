import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, X, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export function AnnouncementBar() {
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { applyPromo } = useCart();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('NEWCOMERS');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const handleApplyAndCopy = useCallback(() => {
    handleCopy();
    applyPromo('NEWCOMERS');
  }, [handleCopy, applyPromo]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full overflow-hidden bg-obsidian-950 border-b border-obsidian-800"
        style={{ zIndex: 100 }}
      >
        {/* Shimmer background */}
        <div className="absolute inset-0 bg-gold-gradient/10" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(212,168,58,0.1),transparent)] animate-shimmer" />
        
        <div className="relative section-container py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="text-gold-400"
            >
              <Sparkles className="w-5 h-5" />
            </motion.span>
            <span className="font-heading text-sm md:text-base text-white tracking-wide">
              ✨ THE GLAMISKY WELCOME PRIVILEGE: YOUR FIRST ORDER IS ON US — ENJOY UP TO 
              <span className="text-gold-300 font-semibold">$499</span> IN COMPLIMENTARY LUXURY ITEMS WITH CODE: 
              <span className="font-mono bg-obsidian-900 px-2 py-0.5 rounded text-gold-300">NEWCOMERS</span>
              ✨
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleApplyAndCopy}
              className="group relative px-4 py-2 text-xs font-semibold tracking-widest uppercase text-obsidian-950 bg-gold-gradient rounded-none transition-all duration-300 hover:shadow-gold-glow flex items-center gap-2"
            >
              <Copy className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>{isCopied ? 'Copied!' : 'Copy & Apply'}</span>
              <AnimatePresence>
                {isCopied && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-obsidian-950 text-gold-300 px-2 py-1 text-xs rounded whitespace-nowrap"
                  >
                    ✓ Applied to cart
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 text-obsidian-400 hover:text-gold-400 transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}