import type { PaymentDetails, PaymentMethod, Order } from '../types';

export interface PaymentProviderConfig {
  provider: '2checkout' | 'lemonsqueezy' | 'paypal' | 'simulated';
  apiKey?: string;
  publicKey?: string;
  merchantId?: string;
  environment?: 'sandbox' | 'production';
  webhookSecret?: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  clientSecret?: string;
  paymentMethod?: PaymentMethod;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  orderId?: string;
  transactionId?: string;
  error?: string;
  requiresAction?: boolean;
  actionUrl?: string;
}

export type { PaymentDetails, PaymentMethod, Order };

class PaymentGatewayService {
  private config: PaymentProviderConfig;
  private isInitialized = false;

  constructor(config: PaymentProviderConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    switch (this.config.provider) {
      case '2checkout':
        await this.init2Checkout();
        break;
      case 'lemonsqueezy':
        await this.initLemonSqueezy();
        break;
      case 'paypal':
        await this.initPayPal();
        break;
      case 'simulated':
      default:
        this.isInitialized = true;
        break;
    }
  }

  private async init2Checkout(): Promise<void> {
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="2checkout"]')) {
      const script = document.createElement('script');
      script.src = this.config.environment === 'sandbox' 
        ? 'https://sandbox.2checkout.com/checkout/api/2co.min.js'
        : 'https://www.2checkout.com/checkout/api/2co.min.js';
      script.async = true;
      document.head.appendChild(script);
      await new Promise(resolve => script.onload = resolve);
    }
    this.isInitialized = true;
  }

  private async initLemonSqueezy(): Promise<void> {
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="lemonsqueezy"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.lemonsqueezy.com/lemonsqueezy.js';
      script.async = true;
      document.head.appendChild(script);
      await new Promise(resolve => script.onload = resolve);
    }
    this.isInitialized = true;
  }

  private async initPayPal(): Promise<void> {
    if (typeof window !== 'undefined' && !(window as any).paypal) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.config.apiKey}&currency=USD&intent=capture&vault=true`;
      script.async = true;
      document.head.appendChild(script);
      await new Promise(resolve => script.onload = resolve);
    }
    this.isInitialized = true;
  }

  async createPaymentIntent(amount: number, currency: string = 'USD', metadata?: Record<string, string>): Promise<PaymentIntent> {
    await this.initialize();

    switch (this.config.provider) {
      case '2checkout':
        return this.create2CheckoutIntent(amount, currency, metadata);
      case 'lemonsqueezy':
        return this.createLemonSqueezyIntent(amount, currency, metadata);
      case 'paypal':
        return this.createPayPalIntent(amount, currency, metadata);
      case 'simulated':
      default:
        return this.createSimulatedIntent(amount, currency, metadata);
    }
  }

  private async create2CheckoutIntent(amount: number, currency: string, metadata?: Record<string, string>): Promise<PaymentIntent> {
    return {
      id: `2co_${Date.now()}`,
      amount,
      currency,
      status: 'pending',
      metadata,
    };
  }

  private async createLemonSqueezyIntent(amount: number, currency: string, metadata?: Record<string, string>): Promise<PaymentIntent> {
    return {
      id: `ls_${Date.now()}`,
      amount,
      currency,
      status: 'pending',
      metadata,
    };
  }

  private async createPayPalIntent(amount: number, currency: string, metadata?: Record<string, string>): Promise<PaymentIntent> {
    return {
      id: `pp_${Date.now()}`,
      amount,
      currency,
      status: 'pending',
      metadata,
    };
  }

  private createSimulatedIntent(amount: number, currency: string, metadata?: Record<string, string>): PaymentIntent {
    return {
      id: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      amount,
      currency,
      status: 'pending',
      metadata,
    };
  }

  async processPayment(paymentDetails: PaymentDetails, paymentIntent: PaymentIntent): Promise<PaymentResult> {
    await this.initialize();

    switch (this.config.provider) {
      case '2checkout':
        return this.process2Checkout(paymentDetails, paymentIntent);
      case 'lemonsqueezy':
        return this.processLemonSqueezy(paymentDetails, paymentIntent);
      case 'paypal':
        return this.processPayPal(paymentDetails, paymentIntent);
      case 'simulated':
      default:
        return this.processSimulated(paymentDetails, paymentIntent);
    }
  }

  private async process2Checkout(_paymentDetails: PaymentDetails, _paymentIntent: PaymentIntent): Promise<PaymentResult> {
    return { success: false, error: '2Checkout integration requires server-side implementation' };
  }

  private async processLemonSqueezy(_paymentDetails: PaymentDetails, _paymentIntent: PaymentIntent): Promise<PaymentResult> {
    return { success: false, error: 'Lemon Squeezy integration requires server-side implementation' };
  }

  private async processPayPal(_paymentDetails: PaymentDetails, _paymentIntent: PaymentIntent): Promise<PaymentResult> {
    return { success: false, error: 'PayPal integration requires server-side implementation' };
  }

  private async processSimulated(paymentDetails: PaymentDetails, _paymentIntent: PaymentIntent): Promise<PaymentResult> {
    await this.simulateProcessingSteps();
    
    if (paymentDetails.method === 'card') {
      await this.simulate3DSecure();
    }
    
    if (paymentDetails.method === 'apple-pay' || paymentDetails.method === 'google-pay') {
      await this.simulateBiometricAuth();
    }
    
    if (paymentDetails.method === 'paypal') {
      await this.simulatePayPalPopup();
    }

    return {
      success: true,
      orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
      transactionId: `TXN-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    };
  }

  private async simulateProcessingSteps(): Promise<void> {
    const steps = [
      'Validating card details...',
      'Encrypting payment data...',
      'Contacting secure payment network...',
      'Verifying with issuing bank...',
      'Authorizing transaction...',
      'Securing confirmation...',
    ];
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
      console.log(`[Payment] ${step}`);
    }
  }

  private async simulate3DSecure(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('[Payment] 3D Secure challenge simulated');
  }

  private async simulateBiometricAuth(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('[Payment] Biometric authentication simulated');
  }

  private async simulatePayPalPopup(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('[Payment] PayPal checkout flow simulated');
  }

  async handleWebhook(_payload: any, _signature: string): Promise<{ received: boolean; order?: Order }> {
    switch (this.config.provider) {
      case '2checkout':
        return this.verify2CheckoutWebhook();
      case 'lemonsqueezy':
        return this.verifyLemonSqueezyWebhook();
      case 'paypal':
        return this.verifyPayPalWebhook();
      default:
        return { received: true };
    }
  }

  private verify2CheckoutWebhook(): { received: boolean; order?: Order } {
    return { received: true };
  }

  private verifyLemonSqueezyWebhook(): { received: boolean; order?: Order } {
    return { received: true };
  }

  private verifyPayPalWebhook(): { received: boolean; order?: Order } {
    return { received: true };
  }

  detectCardBrand(cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown' {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';
    return 'unknown';
  }

  formatCardNumber(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ').slice(0, 19);
  }

  formatExpiry(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  }

  formatCvv(value: string, cardBrand: string): string {
    const maxLength = cardBrand === 'amex' ? 4 : 3;
    return value.replace(/\D/g, '').slice(0, maxLength);
  }

  validateCardNumber(number: string): boolean {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) return false;
    
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  }

  validateExpiry(expiry: string): boolean {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10);
    if (month < 1 || month > 12) return false;
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
    return true;
  }

  validateCvv(cvv: string, cardBrand: string): boolean {
    const expectedLength = cardBrand === 'amex' ? 4 : 3;
    return cvv.length === expectedLength && /^\d+$/.test(cvv);
  }
}

export function createPaymentGateway(config: PaymentProviderConfig): PaymentGatewayService {
  return new PaymentGatewayService(config);
}

export const simulatedGateway = createPaymentGateway({ provider: 'simulated' });

export const cardBrandIcons: Record<string, string> = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
  discover: '💳',
  unknown: '💳',
};

export const cardBrandColors: Record<string, string> = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
  amex: '#006FCF',
  discover: '#FF6000',
  unknown: '#6B7280',
};

// Export utility functions as standalone functions for easier use
export function detectCardBrand(cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown' {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  return 'unknown';
}

export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(' ').slice(0, 19);
}

export function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
}

export function formatCvv(value: string, cardBrand: string): string {
  const maxLength = cardBrand === 'amex' ? 4 : 3;
  return value.replace(/\D/g, '').slice(0, maxLength);
}

export function validateCardNumber(number: string): boolean {
  const cleaned = number.replace(/\s/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

export function validateExpiry(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
  return true;
}

export function validateCvv(cvv: string, cardBrand: string): boolean {
  const expectedLength = cardBrand === 'amex' ? 4 : 3;
  return cvv.length === expectedLength && /^\d+$/.test(cvv);
}