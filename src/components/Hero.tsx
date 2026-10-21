import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Crown, Shield, Truck, Lock } from 'lucide-react';
import { useScrollAnimation, useParallax, useMouseParallax } from '../hooks/useScrollAnimation';

const features = [
  { icon: Crown, title: 'First Order Free', desc: 'Up to $499 on us with code NEWCOMERS' },
  { icon: Shield, title: 'Secure Checkout', desc: '256-bit SSL encryption & PCI-DSS' },
  { icon: Truck, title: 'Express Shipping', desc: 'DHL/FedEx worldwide delivery' },
  { icon: Lock, title: 'Easy Returns', desc: '30-day hassle-free returns' },
];

export function Hero() {
  const { ref: heroRef } = useScrollAnimation({ threshold: 0.1, delay: 100 });
  const { ref: parallaxRef, offset } = useParallax(0.3);
  const { ref: mouseRef, position } = useMouseParallax(30);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32"
      style={{ zIndex: 10 }}
    >
      {/* Background Layers */}
      <div className="absolute inset-0 z-[-10]">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,168,58,0.08)_0%,_transparent_70%)]" />
        
        {/* Parallax background image */}
        <motion.div
          ref={parallaxRef}
          className="absolute inset-0 -z-10"
          style={{ 
            transform: `translateY(${offset}px)`,
            backgroundImage: 'url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/60 via-transparent to-obsidian-950/80" />
        </motion.div>

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gold-gradient/10 blur-3xl"
              style={{
                width: `${150 + i * 50}px`,
                height: `${150 + i * 50}px`,
                top: `${20 + i * 15}%`,
                left: `${10 + i * 20}%`,
              }}
              animate={{
                x: [0, 30 * (i % 2 === 0 ? 1 : -1), 0],
                y: [0, 20 * (i % 3 === 0 ? 1 : -1), 0],
              }}
              transition={{ duration: 15 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>

      {/* Mouse parallax content */}
      <motion.div
        ref={mouseRef}
        className="relative z-10 section-container px-4"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-none mb-8"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gold-400"
            >
              <Sparkles className="w-4 h-4" />
            </motion.span>
            <span className="text-sm font-semibold tracking-widest uppercase text-white">
              NEW SEASON COLLECTION — SPRING 2025
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white leading-[1.1] mb-6"
          >
            <span className="block">DISCOVER</span>
            <span className="block bg-gold-gradient bg-clip-text text-transparent">GLAMISKY</span>
            <span className="block text-3xl md:text-4xl lg:text-5xl font-light mt-2">Where Luxury Meets Accessibility</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          >
            Curated women\'s fashion & accessories at unprecedented value. 
            Experience the privilege of luxury without compromise.
          </motion.p>

          {/* VIP Offer Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5, type: 'spring', stiffness: 300 }}
            className="inline-flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-xl border border-gold-400/30 rounded-none mb-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gold-gradient opacity-10" />
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="relative p-2 bg-gold-gradient rounded-none"
            >
              <Crown className="w-6 h-6 text-obsidian-950" />
            </motion.div>
            <div className="relative text-left">
              <p className="text-xs font-semibold tracking-widest uppercase text-gold-300">VIP NEWCOMER PRIVILEGE</p>
              <p className="text-sm font-medium text-white">First Order On Us — Up to <span className="font-bold text-gold-300">$499</span> Covered</p>
              <p className="text-xs text-white/60 mt-1">Code: <span className="font-mono text-gold-300">NEWCOMERS</span> • Express Shipping $32.99</p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.a
              whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(212, 168, 58, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              href="#collections"
              className="group relative px-10 py-5 text-sm font-semibold tracking-widest uppercase text-obsidian-950 bg-gold-gradient rounded-none overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Claim Your $499 Wardrobe
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ delay: 0.5, duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.98 }}
              href="#collections"
              className="px-10 py-5 text-sm font-semibold tracking-widest uppercase text-white bg-white/10 backdrop-blur-xl border border-white/20 rounded-none hover:bg-white/20 transition-all"
            >
              Explore Collections
            </motion.a>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-none hover:border-gold-400/30 transition-all"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-12 h-12 bg-gold-gradient/20 border border-gold-400/30 rounded-none mb-4 text-gold-400"
                >
                  <feature.icon className="w-6 h-6" />
                </motion.div>
                <h3 className="font-heading text-lg font-medium text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-xs font-semibold tracking-widest uppercase">Scroll to Explore</span>
        <motion.svg
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </motion.svg>
      </motion.div>
    </section>
  );
}