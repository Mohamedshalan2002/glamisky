import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star, TrendingUp } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
}

export function ProductCard({ product, index = 0, priority = false }: ProductCardProps) {
  const { addItem, state } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { ref: scrollRef, isInView } = useScrollAnimation({ 
    threshold: 0.1, 
    delay: index * 50,
    triggerOnce: true 
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    setTilt({ x: -deltaY * 8, y: deltaX * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addItem(product, selectedColor, selectedSize);
  };

  const isInCart = state.items.some(
    item => item.product.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
  );

  return (
    <motion.div
      ref={(el) => { if (el) scrollRef.current = el; }}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ 
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="card-product group"
    >
      {/* Product Image */}
      <div className="card-product-image relative overflow-hidden">
        <motion.img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
          style={{ transform: `translateZ(20px) scale(${1 + Math.abs(tilt.x) * 0.01})` }}
        />
        
        {/* Second image on hover */}
        <motion.img
          src={product.images[1] || product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ transform: 'translateZ(10px)' }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 500 }}
              className="badge badge-new"
            >
              New
            </motion.span>
          )}
          {product.isTrending && (
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 500 }}
              className="badge badge-trending flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3" />
              Trending
            </motion.span>
          )}
          {product.isSale && product.originalPrice && (
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 500 }}
              className="badge badge-sale"
            >
              -{Math.round((1 - product.price / product.originalPrice!) * 100)}%
            </motion.span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-obsidian-600 hover:text-red-500 hover:bg-white transition-all group-hover:opacity-100 opacity-0"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <motion.span
            animate={{ scale: isWishlisted ? 1.2 : 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </motion.span>
        </button>

        {/* Quick View */}
        <button
          onClick={(e) => { e.stopPropagation(); setShowQuickView(true); }}
          className="absolute bottom-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-obsidian-600 hover:text-obsidian-950 hover:bg-white transition-all group-hover:opacity-100 opacity-0"
          aria-label="Quick view"
        >
          <Eye className="w-5 h-5" />
        </button>

        {/* Quick Add Button */}
        <motion.button
          onClick={handleQuickAdd}
          disabled={isInCart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="quick-add-btn"
          style={{ transform: 'translateZ(30px)' }}
        >
          {isInCart ? (
            <span className="flex items-center gap-1 text-gold-400">
              <ShoppingBag className="w-4 h-4" />
              Added
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <ShoppingBag className="w-4 h-4" />
              Quick Add
            </span>
          )}
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-5 pt-4" style={{ transform: 'translateZ(10px)' }}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold-500">
            {product.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
            <span className="text-sm font-medium text-obsidian-700">{product.rating}</span>
            <span className="text-xs text-obsidian-400">({product.reviewCount})</span>
          </div>
        </div>
        
        <h3 className="font-heading text-lg font-medium text-obsidian-950 mb-1 line-clamp-1 group-hover:text-gold-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-3">
          <span className="font-heading text-xl font-medium text-obsidian-950">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-obsidian-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Color Swatches */}
        <div className="mt-3 flex items-center gap-1.5">
          {product.colors.slice(0, 5).map((color) => (
            <button
              key={color}
              onClick={(e) => { e.stopPropagation(); setSelectedColor(color); }}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                selectedColor === color 
                  ? 'border-gold-400 scale-110 shadow-gold-glow' 
                  : 'border-transparent hover:border-obsidian-300'
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
              aria-label={`Select color ${color}`}
              aria-pressed={selectedColor === color}
            />
          ))}
          {product.colors.length > 5 && (
            <span className="text-xs text-obsidian-400 ml-1">+{product.colors.length - 5}</span>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <QuickViewModal
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onColorChange={setSelectedColor}
            onSizeChange={setSelectedSize}
            onClose={() => setShowQuickView(false)}
            onAddToCart={() => {
              addItem(product, selectedColor, selectedSize);
              setShowQuickView(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function QuickViewModal({
  product,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  onClose,
  onAddToCart,
}: {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
  onClose: () => void;
  onAddToCart: () => void;
}) {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-dark rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors"
          aria-label="Close quick view"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="grid lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-[3/4] bg-obsidian-900 relative overflow-hidden">
              <motion.img
                key={currentImage}
                src={product.images[currentImage]}
                alt={`${product.name} - view ${currentImage + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <div className="flex gap-2 mt-4 justify-center">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-16 h-16 rounded-none overflow-hidden border-2 transition-all ${
                    i === currentImage ? 'border-gold-400' : 'border-transparent hover:border-obsidian-600'
                  }`}
                  aria-label={`View image ${i + 1}`}
                  aria-current={i === currentImage ? 'true' : 'false'}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 lg:p-8 flex flex-col">
            <span className="text-xs font-semibold tracking-widest uppercase text-gold-400 mb-2">
              {product.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            
            <h2 id="quick-view-title" className="font-heading text-3xl font-medium text-white mb-3">
              {product.name}
            </h2>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                <span className="font-medium text-white">{product.rating}</span>
                <span className="text-obsidian-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <p className="text-obsidian-300 mb-6 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-heading text-3xl font-medium text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-obsidian-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="label-luxury">Color</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onColorChange(color)}
                    className={`w-10 h-10 rounded-none border-2 transition-all ${
                      selectedColor === color 
                        ? 'border-gold-400 shadow-gold-glow' 
                        : 'border-obsidian-700 hover:border-gold-400/50'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    aria-label={`Select ${color}`}
                    aria-pressed={selectedColor === color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="label-luxury">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => onSizeChange(size)}
                    className={`px-4 py-2 rounded-none text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'bg-gold-500 text-obsidian-950 border-gold-500'
                        : 'bg-obsidian-900 text-white border-obsidian-700 hover:border-gold-400'
                    } border`}
                    aria-label={`Select size ${size}`}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs font-medium tracking-wider uppercase bg-obsidian-900 text-obsidian-300 border border-obsidian-700 rounded-none">
                  {tag}
                </span>
              ))}
            </div>

            {/* Add to Cart */}
            <button
              onClick={onAddToCart}
              className="btn-gold w-full py-5"
              style={{ transform: 'translateZ(20px)' }}
            >
              <span>Add to Cart — ${product.price.toFixed(2)}</span>
            </button>

            <p className="text-center text-xs text-obsidian-500 mt-4">
              Free express shipping on orders over $499 with code NEWCOMERS
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}