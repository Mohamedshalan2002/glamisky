export type Category = 'dresses' | 'tops-sets' | 'bags' | 'jewelry' | 'sunglasses';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: Category;
  rating: number;
  reviewCount: number;
  tags: string[];
  isNew?: boolean;
  isTrending?: boolean;
  isSale?: boolean;
  colors: string[];
  sizes: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  country: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  apartment?: string;
}

export type PaymentMethod = 'card' | 'apple-pay' | 'google-pay' | 'paypal';

export interface PaymentDetails {
  method: PaymentMethod;
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
  cardBrand?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed' | 'first-order-free';
  value: number;
  maxDiscount?: number;
  waiveFees?: boolean;
  waiveShipping?: boolean;
  expressShippingFee?: number;
}

export interface CartTotals {
  subtotal: number;
  serviceFee: number;
  shippingFee: number;
  discount: number;
  total: number;
  promoCode?: string;
  isFirstOrderFree: boolean;
  freeAllowanceUsed: number;
  freeAllowanceRemaining: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  totals: CartTotals;
  trackingNumber?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: number;
  rootMargin?: string;
}