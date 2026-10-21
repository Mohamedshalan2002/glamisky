import { motion } from 'framer-motion';
import {
  Mail,
  Truck, Shield, Lock, Heart, Crown, ArrowUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const footerLinks = {
  shop: [
    { label: 'New Arrivals', href: '/category/dresses?filter=new-arrivals' },
    { label: 'Dresses', href: '/category/dresses' },
    { label: 'Tops & Sets', href: '/category/tops-sets' },
    { label: 'Luxury Bags', href: '/category/bags' },
    { label: 'Jewelry', href: '/category/jewelry' },
    { label: 'Sunglasses', href: '/category/sunglasses' },
    { label: 'Sale', href: '/sale' },
    { label: 'Gift Cards', href: '/gift-cards' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Track Order', href: '/track' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Store Locator', href: '/stores' },
  ],
  company: [
    { label: 'About Glamisky', href: '/about' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Affiliate Program', href: '/affiliates' },
    { label: 'Wholesale', href: '/wholesale' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Accessibility', href: '/accessibility' },
    { label: 'Do Not Sell My Info', href: '/privacy#dnsmi' },
  ],
};

const socialLinks = [
  { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Mail, href: 'mailto:hello@glamisky.com', label: 'Email' },
  { icon: XIcon, href: 'https://twitter.com', label: 'Twitter / X' },
  { icon: YoutubeIcon, href: 'https://youtube.com', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="relative bg-obsidian-950 border-t border-obsidian-800">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(212,168,58,0.05)_0%,_transparent_70%)]" />
      
      <div className="section-container relative py-16 lg:py-24">
        {/* Brand Section */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Link to="/" className="flex items-center gap-2 mb-6">
              <span className="text-3xl font-display font-medium text-white tracking-tight">GLAMISKY</span>
            </Link>
            <p className="text-obsidian-400 text-base leading-relaxed mb-8 max-w-xs">
              Redefining luxury fashion with accessible pricing. Every piece tells a story of craftsmanship, 
              consciousness, and timeless style.
            </p>
            
            {/* VIP Badge */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gold-500/10 border border-gold-400/30 rounded-none">
              <div className="p-2 bg-gold-500 rounded-none">
                <Crown className="w-5 h-5 text-obsidian-950" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gold-300">VIP Newcomer Privilege</p>
                <p className="text-xs text-gold-300/70">First order free up to $499 with code NEWCOMERS</p>
              </div>
            </div>

            {/* Social */}
            <div className="mt-8 flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-obsidian-900 border border-obsidian-700 rounded-full text-obsidian-400 hover:text-gold-400 hover:border-gold-400/50 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-heading text-lg font-medium text-white mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-obsidian-400 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-heading text-lg font-medium text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-obsidian-400 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-heading text-lg font-medium text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-obsidian-400 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>

        {/* Newsletter & Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-16"
        >
          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="font-heading text-lg font-medium text-white mb-4">Join the Inner Circle</h4>
            <p className="text-obsidian-400 text-sm mb-6">
              Get early access to new collections, exclusive offers, and style inspiration.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-luxury flex-1"
                autoComplete="email"
              />
              <button type="submit" className="btn-primary whitespace-nowrap px-6">
                Subscribe
              </button>
            </form>
            <p className="text-xs text-obsidian-500 mt-3">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </div>

          {/* Benefits */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {[
              { icon: Truck, title: 'Free Express Shipping', desc: 'On orders $499+ with code NEWCOMERS' },
              { icon: Shield, title: '30-Day Returns', desc: 'Hassle-free returns & exchanges' },
              { icon: Lock, title: 'Secure Checkout', desc: '256-bit SSL encryption' },
              { icon: Heart, title: 'VIP Rewards', desc: 'Earn points on every purchase' },
            ].map((benefit) => (
              <motion.div
                key={benefit.title}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-none hover:border-gold-400/30 transition-all"
              >
                <div className="p-2 bg-obsidian-900 rounded-none">
                  <benefit.icon className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{benefit.title}</p>
                  <p className="text-obsidian-500 text-xs mt-0.5">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-obsidian-800">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <p className="text-obsidian-500 text-sm">
              © 2026 Glamisky. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6 text-sm text-obsidian-500">
              {footerLinks.legal.map((link) => (
                <Link key={link.href} to={link.href} className="hover:text-gold-400 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Back to top */}
            <a
              href="#top"
              className="fixed bottom-6 right-6 p-3 bg-gold-gradient text-obsidian-950 rounded-full shadow-gold-glow opacity-0 pointer-events-none transition-all z-50"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}