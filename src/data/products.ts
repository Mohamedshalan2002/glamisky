import type { Product, Category } from '../types';

export type { Product, Category };

export const categories: { id: Category; name: string; description: string; image: string }[] = [
  {
    id: 'dresses',
    name: 'Dresses',
    description: 'Effortless elegance for every occasion',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
  },
  {
    id: 'tops-sets',
    name: 'Tops & Sets',
    description: 'Curated coordinates for instant style',
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80',
  },
  {
    id: 'bags',
    name: 'Luxury Bags',
    description: 'Arm candy that elevates any ensemble',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Accessories',
    description: 'The finishing touches that define you',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    description: 'Shield your gaze in sophisticated style',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
  },
];

export const products: Product[] = [
  // DRESSES
  {
    id: 'dress-001',
    name: 'Satin Ruched Mini Dress',
    description: 'Luxurious satin fabric with delicate ruching detail. Perfect for evening soirées or elevated daytime looks. Features a flattering cowl neckline and adjustable spaghetti straps.',
    price: 18.99,
    originalPrice: 28.99,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
      'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&q=80',
    ],
    category: 'dresses',
    rating: 4.8,
    reviewCount: 234,
    tags: ['evening', 'satin', 'mini', 'party'],
    isNew: true,
    isTrending: true,
    colors: ['Champagne', 'Obsidian', 'Blush', 'Sage'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'dress-002',
    name: 'Floral Chiffon Midi Dress',
    description: 'Romantic floral print on flowing chiffon. Empire waist with subtle pleating creates an ethereal silhouette. Fully lined with a concealed back zipper.',
    price: 22.99,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
      'https://images.unsplash.com/photo-1610026400463-ec78c1eb2e5f?w=600&q=80',
    ],
    category: 'dresses',
    rating: 4.7,
    reviewCount: 189,
    tags: ['floral', 'chiffon', 'midi', 'daytime'],
    isTrending: true,
    colors: ['Ivory/Blue', 'Blush/Multi', 'Sage/Cream'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'dress-003',
    name: 'Velvet Wrap Maxi Dress',
    description: 'Sumptuous crushed velvet in a timeless wrap silhouette. Deep V-neckline with internal snap closure. Long sleeves with elasticized cuffs. The ultimate holiday statement piece.',
    price: 26.99,
    originalPrice: 36.99,
    images: [
      'https://images.unsplash.com/photo-1610026400463-ec78c1eb2e5f?w=600&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80',
    ],
    category: 'dresses',
    rating: 4.9,
    reviewCount: 156,
    tags: ['velvet', 'maxi', 'wrap', 'holiday'],
    isSale: true,
    colors: ['Midnight', 'Burgundy', 'Emerald', 'Champagne'],
    sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: 'dress-004',
    name: 'Linen-Blend Shirt Dress',
    description: 'Effortless chic in breathable linen-blend. Oversized fit with removable belt. Mother-of-pearl buttons and curved hem. Roll-tab sleeves for versatile styling.',
    price: 19.99,
    images: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80',
      'https://images.unsplash.com/photo-1572804013563-5b77d8b8b5a3?w=600&q=80',
    ],
    category: 'dresses',
    rating: 4.6,
    reviewCount: 203,
    tags: ['linen', 'shirt-dress', 'casual', 'belted'],
    isNew: true,
    colors: ['White', 'Sand', 'Navy', 'Terracotta'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },

  // TOPS & SETS
  {
    id: 'top-001',
    name: 'Silk Camisole & Shorts Set',
    description: 'Luxurious 19-momme mulberry silk. Adjustable straps with French lace trim. Elasticized waist shorts with side slits. Packaged in a signature Glamisky gift box.',
    price: 24.99,
    originalPrice: 34.99,
    images: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
    ],
    category: 'tops-sets',
    rating: 4.9,
    reviewCount: 312,
    tags: ['silk', 'set', 'camisole', 'luxury'],
    isTrending: true,
    colors: ['Champagne', 'Obsidian', 'Pearl', 'Rose'],
    sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: 'top-002',
    name: 'Cashmere-Blend Ribbed Tank',
    description: 'Ultra-soft cashmere blend with a second-skin fit. Wide rib texture adds dimension. Perfect for layering or wearing alone. Machine washable on delicate cycle.',
    price: 16.99,
    images: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80',
    ],
    category: 'tops-sets',
    rating: 4.7,
    reviewCount: 445,
    tags: ['cashmere', 'tank', 'ribbed', 'basic'],
    isNew: true,
    colors: ['Cream', 'Charcoal', 'Camel', 'Black', 'Dusty Rose'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'top-003',
    name: 'Structured Blazer & Trouser Set',
    description: 'Power dressing reimagined. Italian wool-blend with subtle stretch. Notch lapels, double-button closure, functional cuff buttons. High-waisted trousers with pressed creases.',
    price: 29.99,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80',
    ],
    category: 'tops-sets',
    rating: 4.8,
    reviewCount: 178,
    tags: ['blazer', 'trousers', 'set', 'workwear'],
    isTrending: true,
    colors: ['Obsidian', 'Camel', 'Slate', 'Cream'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'top-004',
    name: 'Puff-Sleeve Cotton Poplin Blouse',
    description: 'Crisp cotton poplin with dramatic balloon sleeves. Keyhole button closure at back. Peplum hem for a flattering silhouette. A modern romantic essential.',
    price: 14.99,
    originalPrice: 21.99,
    images: [
      'https://images.unsplash.com/photo-1564257577-450cb5f5a1a0?w=600&q=80',
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80',
    ],
    category: 'tops-sets',
    rating: 4.5,
    reviewCount: 267,
    tags: ['blouse', 'puff-sleeve', 'cotton', 'feminine'],
    isSale: true,
    colors: ['White', 'Pale Blue', 'Lavender', 'Butter'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },

  // LUXURY BAGS
  {
    id: 'bag-001',
    name: 'Quilted Crossbody Bag',
    description: 'Iconic diamond quilting in premium vegan leather. Gold-tone chain strap with leather shoulder pad. Magnetic flap closure with interior slip pocket. Dimensions: 22x15x7cm.',
    price: 14.50,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    ],
    category: 'bags',
    rating: 4.8,
    reviewCount: 567,
    tags: ['crossbody', 'quilted', 'chain-strap', 'classic'],
    isTrending: true,
    colors: ['Obsidian', 'Champagne', 'Blush', 'White'],
    sizes: ['One Size'],
  },
  {
    id: 'bag-002',
    name: 'Structured Tote with Top Handles',
    description: 'Architectural silhouette in smooth vegan leather. Dual top handles with 22cm drop. Detachable crossbody strap included. Laptop compartment fits 13". Magnetic snap closure.',
    price: 19.99,
    originalPrice: 27.99,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
    ],
    category: 'bags',
    rating: 4.7,
    reviewCount: 334,
    tags: ['tote', 'structured', 'work', 'laptop'],
    isSale: true,
    colors: ['Cognac', 'Obsidian', 'Taupe', 'Navy'],
    sizes: ['One Size'],
  },
  {
    id: 'bag-003',
    name: 'Mini Baguette Bag',
    description: 'Nostalgic 2000s silhouette reimagined. Compact yet fits essentials: phone, cardholder, lipstick. Gold-tone hardware. Adjustable shoulder strap. Magnetic closure.',
    price: 12.99,
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    ],
    category: 'bags',
    rating: 4.6,
    reviewCount: 421,
    tags: ['baguette', 'mini', 'y2k', 'trendy'],
    isNew: true,
    isTrending: true,
    colors: ['Silver', 'Gold', 'Obsidian', 'White', 'Red'],
    sizes: ['One Size'],
  },
  {
    id: 'bag-004',
    name: 'Woven Raffia Tote',
    description: 'Artisan-woven natural raffia with leather trim. Spacious interior with zippered pocket. Sturdy leather handles. Perfect for market days or beach getaways.',
    price: 16.99,
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    ],
    category: 'bags',
    rating: 4.5,
    reviewCount: 198,
    tags: ['raffia', 'woven', 'summer', 'beach'],
    colors: ['Natural', 'Natural/Black', 'Natural/Tan'],
    sizes: ['One Size'],
  },

  // JEWELRY & ACCESSORIES
  {
    id: 'jewelry-001',
    name: 'Layered 18K Gold-Plated Necklace Set',
    description: 'Three delicate chains in varying lengths: 16", 18", 20". Cubic zirconia accents. Hypoallergenic brass base with 3-micron 18K gold plating. Tarnish-resistant coating.',
    price: 5.49,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80',
    ],
    category: 'jewelry',
    rating: 4.9,
    reviewCount: 892,
    tags: ['layered', 'gold-plated', 'necklace', 'set'],
    isTrending: true,
    colors: ['Gold', 'Rose Gold', 'Silver'],
    sizes: ['One Size'],
  },
  {
    id: 'jewelry-002',
    name: 'Freshwater Pearl Drop Earrings',
    description: 'Genuine freshwater pearls (8-9mm) on 18K gold-plated hooks. Each pearl hand-selected for luster and shape. Silicone backs for secure wear. Comes in velvet pouch.',
    price: 8.99,
    originalPrice: 14.99,
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    ],
    category: 'jewelry',
    rating: 4.8,
    reviewCount: 445,
    tags: ['pearl', 'drop', 'elegant', 'gold'],
    isSale: true,
    colors: ['White Pearl', 'Pink Pearl', 'Lavender Pearl'],
    sizes: ['One Size'],
  },
  {
    id: 'jewelry-003',
    name: 'Stackable Minimalist Ring Set',
    description: 'Set of 5 ultra-thin bands: 2 plain, 2 twisted rope, 1 cubic zirconia pavé. 18K gold-plated stainless steel. Hypoallergenic, water-resistant, won\'t tarnish or turn green.',
    price: 4.99,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80',
    ],
    category: 'jewelry',
    rating: 4.7,
    reviewCount: 623,
    tags: ['stackable', 'minimalist', 'ring-set', 'gold'],
    isNew: true,
    colors: ['Gold', 'Silver', 'Rose Gold', 'Mixed'],
    sizes: ['5', '6', '7', '8', '9'],
  },
  {
    id: 'jewelry-004',
    name: 'Silk Twilly Scarf',
    description: '100% mulberry silk twill, 5x86cm. Hand-rolled edges. Exclusive Glamisky archive print. Wear on hair, wrist, bag handle, or as a choker. Dry clean only.',
    price: 9.99,
    images: [
      'https://images.unsplash.com/photo-1584030373213-c1b5e8b8b5a3?w=600&q=80',
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80',
    ],
    category: 'jewelry',
    rating: 4.6,
    reviewCount: 156,
    tags: ['silk', 'scarf', 'twilly', 'accessory'],
    colors: ['Noir Floral', 'Champagne Geo', 'Emerald Paisley', 'Burgundy Stripe'],
    sizes: ['One Size'],
  },

  // SUNGLASSES
  {
    id: 'sunglasses-001',
    name: 'Retro Cat-Eye Sunglasses',
    description: 'Vintage-inspired upswept frames in premium acetate. UV400 polarized lenses with anti-reflective coating. Spring hinges for comfort. Includes leatherette case and microfiber cloth.',
    price: 6.99,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
    ],
    category: 'sunglasses',
    rating: 4.8,
    reviewCount: 534,
    tags: ['cat-eye', 'retro', 'polarized', 'vintage'],
    isTrending: true,
    colors: ['Black/Gold', 'Tortoise/Brown', 'White/Grey', 'Red/Gradient'],
    sizes: ['One Size'],
  },
  {
    id: 'sunglasses-002',
    name: 'Oversized Square Frames',
    description: 'Bold geometric silhouette in lightweight TR90. Gradient UV400 lenses. Integrated nose pads. Statement piece that flatters all face shapes. Includes hard case.',
    price: 7.99,
    originalPrice: 12.99,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    ],
    category: 'sunglasses',
    rating: 4.7,
    reviewCount: 312,
    tags: ['oversized', 'square', 'gradient', 'statement'],
    isSale: true,
    colors: ['Black/Smoke', 'Translucent/Pink', 'Havana/Amber', 'Clear/Grey'],
    sizes: ['One Size'],
  },
  {
    id: 'sunglasses-003',
    name: 'Slim Rectangular 90s Frames',
    description: 'Minimalist wire-thin metal frames with adjustable silicone nose pads. Flat UV400 lenses. Ultra-lightweight at 18g. The cool-girl essential. Includes slim leather case.',
    price: 5.99,
    images: [
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
    ],
    category: 'sunglasses',
    rating: 4.6,
    reviewCount: 278,
    tags: ['rectangular', '90s', 'wire', 'minimalist'],
    isNew: true,
    colors: ['Gold/Grey', 'Silver/Blue', 'Gunmetal/Green', 'Rose Gold/Pink'],
    sizes: ['One Size'],
  },
  {
    id: 'sunglasses-004',
    name: 'Aviator Double Bridge',
    description: 'Classic teardrop shape with distinctive double bridge. Premium stainless steel with spring hinges. Polarized UV400 lenses reduce glare. Unisex fit. Includes premium case.',
    price: 8.99,
    images: [
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    ],
    category: 'sunglasses',
    rating: 4.7,
    reviewCount: 389,
    tags: ['aviator', 'double-bridge', 'polarized', 'classic'],
    colors: ['Gold/Grey', 'Gunmetal/Green', 'Black/Grey', 'Rose Gold/Brown'],
    sizes: ['One Size'],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter(p => p.category === category);
}

export function getTrendingProducts(): Product[] {
  return products.filter(p => p.isTrending).slice(0, 8);
}

export function getNewArrivals(): Product[] {
  return products.filter(p => p.isNew).slice(0, 8);
}

export function getSaleProducts(): Product[] {
  return products.filter(p => p.isSale).slice(0, 8);
}