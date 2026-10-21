import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { CartItem, Product, CartTotals, PromoCode, ShippingAddress, PaymentDetails, Order } from '../types';

export const FREE_ALLOWANCE_CAP = 499;
export const SERVICE_FEE_RATE = 0.10;
export const STANDARD_SHIPPING = 12.99;
export const EXPRESS_SHIPPING = 32.99;

const NEWCOMERS_PROMO: PromoCode = {
  code: 'newcomers',
  discountType: 'first-order-free',
  value: FREE_ALLOWANCE_CAP,
  maxDiscount: FREE_ALLOWANCE_CAP,
  waiveFees: true,
  waiveShipping: false,
  expressShippingFee: EXPRESS_SHIPPING,
};

function calculateTotals(items: CartItem[], _promoCode: string | null, appliedPromo: PromoCode | null): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  let discount = 0;
  let serviceFee = 0;
  let shippingFee = STANDARD_SHIPPING;
  let isFirstOrderFree = false;
  let freeAllowanceUsed = 0;
  let freeAllowanceRemaining = FREE_ALLOWANCE_CAP;

  if (appliedPromo && appliedPromo.code === 'newcomers') {
    isFirstOrderFree = true;
    freeAllowanceUsed = Math.min(subtotal, FREE_ALLOWANCE_CAP);
    freeAllowanceRemaining = Math.max(0, FREE_ALLOWANCE_CAP - subtotal);
    discount = freeAllowanceUsed;
    serviceFee = 0;
    shippingFee = EXPRESS_SHIPPING;
  } else {
    serviceFee = subtotal * SERVICE_FEE_RATE;
    shippingFee = STANDARD_SHIPPING;
  }

  const total = subtotal - discount + serviceFee + shippingFee;

  return {
    subtotal,
    serviceFee,
    shippingFee,
    discount,
    total: Math.max(0, total),
    promoCode: appliedPromo?.code,
    isFirstOrderFree,
    freeAllowanceUsed,
    freeAllowanceRemaining,
  };
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  promoCode: string;
  appliedPromo: PromoCode | null;
  shippingAddress: ShippingAddress | null;
  paymentDetails: PaymentDetails | null;
  isCheckoutOpen: boolean;
  checkoutStep: 1 | 2 | 3;
  order: Order | null;
  isProcessingPayment: boolean;
  showConfetti: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; color: string; size: string } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; color: string; size: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; color: string; size: string; quantity: number } }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'APPLY_PROMO'; payload: string }
  | { type: 'REMOVE_PROMO' }
  | { type: 'SET_SHIPPING_ADDRESS'; payload: ShippingAddress }
  | { type: 'SET_PAYMENT_DETAILS'; payload: PaymentDetails }
  | { type: 'OPEN_CHECKOUT' }
  | { type: 'CLOSE_CHECKOUT' }
  | { type: 'SET_CHECKOUT_STEP'; payload: 1 | 2 | 3 }
  | { type: 'SET_PROCESSING_PAYMENT'; payload: boolean }
  | { type: 'COMPLETE_ORDER'; payload: Order }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_SHOW_CONFETTI'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartState };

const initialState: CartState = {
  items: [],
  isCartOpen: false,
  promoCode: '',
  appliedPromo: null,
  shippingAddress: null,
  paymentDetails: null,
  isCheckoutOpen: false,
  checkoutStep: 1,
  order: null,
  isProcessingPayment: false,
  showConfetti: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, color, size } = action.payload;
      const existingIndex = state.items.findIndex(
        item => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
      );
      
      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...state.items, { product, quantity: 1, selectedColor: color, selectedSize: size }];
      }
      
      const newTotals = calculateTotals(newItems, state.promoCode, state.appliedPromo);
      return {
        ...state,
        items: newItems,
        isCartOpen: true,
        appliedPromo: newTotals.isFirstOrderFree ? NEWCOMERS_PROMO : state.appliedPromo,
      };
    }
    
    case 'REMOVE_ITEM': {
      const { productId, color, size } = action.payload;
      const filteredItems = state.items.filter(item => 
        !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
      );
      const newTotals = calculateTotals(filteredItems, state.promoCode, state.appliedPromo);
      return {
        ...state,
        items: filteredItems,
        appliedPromo: newTotals.isFirstOrderFree ? NEWCOMERS_PROMO : (filteredItems.length === 0 ? null : state.appliedPromo),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, color, size, quantity } = action.payload;
      if (quantity <= 0) {
        const filteredItems = state.items.filter(item => 
          !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
        );
        const newTotals = calculateTotals(filteredItems, state.promoCode, state.appliedPromo);
        return {
          ...state,
          items: filteredItems,
          appliedPromo: newTotals.isFirstOrderFree ? NEWCOMERS_PROMO : (filteredItems.length === 0 ? null : state.appliedPromo),
        };
      }
      const newItems = state.items.map(item =>
        item.product.id === productId && item.selectedColor === color && item.selectedSize === size
          ? { ...item, quantity }
          : item
      );
      const newTotals = calculateTotals(newItems, state.promoCode, state.appliedPromo);
      return {
        ...state,
        items: newItems,
        appliedPromo: newTotals.isFirstOrderFree ? NEWCOMERS_PROMO : state.appliedPromo,
      };
    }
    
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };
    
    case 'OPEN_CART':
      return { ...state, isCartOpen: true };
    
    case 'CLOSE_CART':
      return { ...state, isCartOpen: false };
    
    case 'APPLY_PROMO': {
      const code = action.payload.toLowerCase().trim();
      if (code === 'newcomers') {
        return {
          ...state,
          promoCode: code,
          appliedPromo: NEWCOMERS_PROMO,
          showConfetti: true,
        };
      }
      return state;
    }
    
    case 'REMOVE_PROMO': {
      return {
        ...state,
        promoCode: '',
        appliedPromo: null,
        showConfetti: false,
      };
    }
    
    case 'SET_SHIPPING_ADDRESS':
      return { ...state, shippingAddress: action.payload, checkoutStep: 2 };
    
    case 'SET_PAYMENT_DETAILS':
      return { ...state, paymentDetails: action.payload, checkoutStep: 3 };
    
    case 'OPEN_CHECKOUT':
      return { ...state, isCheckoutOpen: true, checkoutStep: 1 };
    
    case 'CLOSE_CHECKOUT':
      return { ...state, isCheckoutOpen: false, checkoutStep: 1, shippingAddress: null, paymentDetails: null };
    
    case 'SET_CHECKOUT_STEP':
      return { ...state, checkoutStep: action.payload };
    
    case 'SET_PROCESSING_PAYMENT':
      return { ...state, isProcessingPayment: action.payload };
    
    case 'COMPLETE_ORDER': {
      const newTotals = calculateTotals(state.items, state.promoCode, state.appliedPromo);
      const order: Order = {
        ...action.payload,
        totals: newTotals,
        status: 'confirmed',
        createdAt: new Date(),
        trackingNumber: `GLM${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      };
      return {
        ...state,
        order,
        isProcessingPayment: false,
        checkoutStep: 3,
        showConfetti: true,
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        promoCode: '',
        appliedPromo: null,
        shippingAddress: null,
        paymentDetails: null,
        isCheckoutOpen: false,
        checkoutStep: 1,
        order: null,
        showConfetti: false,
      };
    
    case 'SET_SHOW_CONFETTI':
      return { ...state, showConfetti: action.payload };
    
    case 'LOAD_CART':
      return { ...action.payload, isProcessingPayment: false };
    
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totals: CartTotals;
  addItem: (product: Product, color: string, size: string) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyPromo: (code: string) => void;
  removePromo: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  setCheckoutStep: (step: 1 | 2 | 3) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setPaymentDetails: (details: PaymentDetails) => void;
  processPayment: () => Promise<void>;
  clearCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    try {
      const stored = localStorage.getItem('glamisky-cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...initialState, ...parsed, isCartOpen: false, isCheckoutOpen: false, isProcessingPayment: false, showConfetti: false };
      }
    } catch {}
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('glamisky-cart', JSON.stringify(state));
  }, [state]);

  const totals = calculateTotals(state.items, state.promoCode, state.appliedPromo);

  const addItem = (product: Product, color: string, size: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, color, size } });
  };

  const removeItem = (productId: string, color: string, size: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, color, size } });
  };

  const updateQuantity = (productId: string, color: string, size: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, color, size, quantity } });
  };

  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });
  const applyPromo = (code: string) => dispatch({ type: 'APPLY_PROMO', payload: code });
  const removePromo = () => dispatch({ type: 'REMOVE_PROMO' });
  const openCheckout = () => dispatch({ type: 'OPEN_CHECKOUT' });
  const closeCheckout = () => dispatch({ type: 'CLOSE_CHECKOUT' });
  const setCheckoutStep = (step: 1 | 2 | 3) => dispatch({ type: 'SET_CHECKOUT_STEP', payload: step });
  const setShippingAddress = (address: ShippingAddress) => dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: address });
  const setPaymentDetails = (details: PaymentDetails) => dispatch({ type: 'SET_PAYMENT_DETAILS', payload: details });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const getItemCount = () => state.items.reduce((sum, item) => sum + item.quantity, 0);

  const processPayment = async () => {
    dispatch({ type: 'SET_PROCESSING_PAYMENT', payload: true });
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const newTotals = calculateTotals(state.items, state.promoCode, state.appliedPromo);
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: state.items,
      shippingAddress: state.shippingAddress!,
      paymentDetails: state.paymentDetails!,
      totals: newTotals,
      status: 'confirmed',
      createdAt: new Date(),
      trackingNumber: `GLM${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    };
    
    // Keep the order in state so the confirmation screen can render it.
    // The cart is emptied when the user clicks "Continue Shopping" (clearCart).
    dispatch({ type: 'COMPLETE_ORDER', payload: order });
  };

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      totals,
      addItem,
      removeItem,
      updateQuantity,
      toggleCart,
      openCart,
      closeCart,
      applyPromo,
      removePromo,
      openCheckout,
      closeCheckout,
      setCheckoutStep,
      setShippingAddress,
      setPaymentDetails,
      processPayment,
      clearCart,
      getItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}