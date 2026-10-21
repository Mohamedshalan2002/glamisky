import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, Check, CreditCard,
  Lock, Shield, Truck, Eye, EyeOff, Loader2,
  Smartphone, Package
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { ShippingAddress } from '../types';
import {
  formatCardNumber, formatExpiry, formatCvv,
  type PaymentMethod, type PaymentDetails,
  detectCardBrand, validateCardNumber, validateExpiry, validateCvv
} from '../services/paymentGateway';
import { formatCurrency } from '../utils/helpers';
import type { CartTotals } from '../types';

const COUNTRIES = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
];

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.83-.17 2.21-.87 3.47-.79 1.61.13 2.83.77 3.63 1.93-3.32 1.99-2.79 6.36.51 7.71-.66 1.66-1.51 3.29-2.69 4.32zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

function PayPalLogo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
    </svg>
  );
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CardFormState {
  number: string;
  holderName: string;
  expiry: string;
  cvv: string;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { state, totals, setShippingAddress, setPaymentDetails, processPayment, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shippingForm, setShippingForm] = useState<ShippingAddress>({
    fullName: '', email: '', phone: '', countryCode: '+1', country: 'US',
    city: '', postalCode: '', streetAddress: '', apartment: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardForm, setCardForm] = useState<CardFormState>({
    number: '', holderName: '', expiry: '', cvv: '',
  });
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'>('unknown');
  const [showCvv, setShowCvv] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [show3DSecure, setShow3DSecure] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<ShippingAddress & { card: string }>>({});

  const cardInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setShowSuccess(false);
      setIsProcessing(false);
      setShow3DSecure(false);
      setProcessingStep('');
    }
  }, [isOpen]);

  useEffect(() => {
    setCardBrand(detectCardBrand(cardForm.number));
  }, [cardForm.number]);

  const validateShippingForm = (): boolean => {
    const errors: Partial<ShippingAddress> = {};
    if (!shippingForm.fullName.trim()) errors.fullName = 'Full name is required';
    if (!shippingForm.email.trim() || !shippingForm.email.includes('@')) errors.email = 'Valid email is required';
    if (!shippingForm.phone.trim() || shippingForm.phone.replace(/\D/g, '').length < 10) errors.phone = 'Valid phone number is required';
    if (!shippingForm.country) errors.country = 'Country is required';
    if (!shippingForm.city.trim()) errors.city = 'City is required';
    if (!shippingForm.postalCode.trim()) errors.postalCode = 'Postal code is required';
    if (!shippingForm.streetAddress.trim()) errors.streetAddress = 'Street address is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCardForm = (): boolean => {
    const errors: { card?: string } = {};
    if (!cardForm.number.replace(/\s/g, '').length) errors.card = 'Card number is required';
    else if (!validateCardNumber(cardForm.number)) errors.card = 'Invalid card number';
    if (!cardForm.holderName.trim()) errors.card = 'Cardholder name is required';
    if (!validateExpiry(cardForm.expiry)) errors.card = 'Invalid expiry date (MM/YY)';
    if (!validateCvv(cardForm.cvv, cardBrand)) errors.card = `Invalid CVV (${cardBrand === 'amex' ? 4 : 3} digits)`;

    setFormErrors(prev => ({ ...prev, ...errors }));
    return !errors.card;
  };

  const handleShippingSubmit = () => {
    if (validateShippingForm()) {
      setShippingAddress(shippingForm);
      setStep(2);
      setFormErrors({});
    }
  };

  const handlePaymentSubmit = async () => {
    if (paymentMethod === 'card' && !validateCardForm()) return;

    setIsProcessing(true);

    const paymentDetails: PaymentDetails = {
      method: paymentMethod,
      cardNumber: cardForm.number.replace(/\s/g, ''),
      cardHolderName: cardForm.holderName,
      expiryDate: cardForm.expiry,
      cvv: cardForm.cvv,
      cardBrand,
    };

    setPaymentDetails(paymentDetails);

    const steps = [
      'Verifying card & securing transaction...',
      'Encrypting payment data (AES-256)...',
      'Contacting secure payment network...',
      'Verifying with issuing bank...',
      'Authorizing transaction...',
      'Securing confirmation...',
    ];

    for (const stepText of steps) {
      setProcessingStep(stepText);
      await new Promise(r => setTimeout(r, 450 + Math.random() * 300));
    }

    if (paymentMethod === 'card') {
      setProcessingStep('Awaiting 3-D Secure verification...');
      setShow3DSecure(true);
      await new Promise(r => setTimeout(r, 2600));
      setShow3DSecure(false);
    } else if (paymentMethod === 'apple-pay' || paymentMethod === 'google-pay') {
      setProcessingStep('Awaiting biometric confirmation...');
      await new Promise(r => setTimeout(r, 1800));
    } else if (paymentMethod === 'paypal') {
      setProcessingStep('Opening secure PayPal window...');
      await new Promise(r => setTimeout(r, 1200));
      setProcessingStep('Awaiting PayPal authorization...');
      await new Promise(r => setTimeout(r, 1800));
    }

    try {
      await processPayment();
      setShowSuccess(true);
      setStep(3);
    } catch {
      setFormErrors(prev => ({ ...prev, card: 'Payment failed. Please try again.' }));
    } finally {
      setIsProcessing(false);
      setShow3DSecure(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-xl"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-dark rounded-none"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            disabled={isProcessing || show3DSecure}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-50"
            aria-label="Close checkout"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Progress Steps */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-obsidian-800">
            {[
              { num: 1, label: 'Shipping', icon: Package },
              { num: 2, label: 'Payment', icon: CreditCard },
              { num: 3, label: 'Confirm', icon: Check },
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <motion.span
                    className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0"
                    animate={{
                      backgroundColor: step >= s.num ? 'rgba(212, 168, 58, 1)' : 'rgba(255,255,255,0.1)',
                      color: step >= s.num ? '#1a1612' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </motion.span>
                  <span className={`hidden sm:block text-xs font-semibold tracking-widest uppercase ${step >= s.num ? 'text-gold-300' : 'text-obsidian-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && (
                  <div className="flex-1 mx-3 h-0.5 bg-obsidian-800 overflow-hidden">
                    <motion.div
                      className="h-full bg-gold-500 origin-left"
                      initial={false}
                      animate={{ scaleX: step > s.num ? 1 : 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {showSuccess && state.order ? (
              <OrderSuccessContent
                key="success"
                order={state.order}
                onClose={() => { onClose(); clearCart(); }}
              />
            ) : step === 1 ? (
              <ShippingStep
                key="shipping"
                form={shippingForm}
                setForm={setShippingForm}
                errors={formErrors}
                onSubmit={handleShippingSubmit}
              />
            ) : (
              <PaymentStep
                key="payment"
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                cardForm={cardForm}
                setCardForm={setCardForm}
                cardBrand={cardBrand}
                showCvv={showCvv}
                setShowCvv={setShowCvv}
                show3DSecure={show3DSecure}
                errors={formErrors}
                isProcessing={isProcessing}
                processingStep={processingStep}
                cardInnerRef={cardInnerRef}
                totals={totals}
                onBack={() => setStep(1)}
                onSubmit={handlePaymentSubmit}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface ShippingStepProps {
  form: ShippingAddress;
  setForm: React.Dispatch<React.SetStateAction<ShippingAddress>>;
  errors: Partial<ShippingAddress>;
  onSubmit: () => void;
}

function ShippingStep({ form, setForm, errors, onSubmit }: ShippingStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="p-6 lg:p-8 space-y-6"
    >
      <div>
        <h2 id="checkout-title" className="font-heading text-3xl font-medium text-white mb-2">Shipping Information</h2>
        <p className="text-obsidian-400">Where should we deliver your order?</p>
      </div>

      <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name" error={errors.fullName}>
            <input
              type="text"
              value={form.fullName}
              onChange={e => setForm(prev => ({ ...prev, fullName: e.target.value }))}
              className="input-luxury"
              placeholder="Jane Doe"
              autoComplete="name"
              required
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              className="input-luxury"
              placeholder="jane@email.com"
              autoComplete="email"
              required
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Phone Number" error={errors.phone}>
            <div className="flex gap-2">
              <select
                value={form.countryCode}
                onChange={e => setForm(prev => ({ ...prev, countryCode: e.target.value }))}
                className="input-luxury w-28 text-center"
                aria-label="Country calling code"
              >
                {COUNTRIES.map(c => <option key={c.code} value={c.dialCode}>{c.flag} {c.dialCode}</option>)}
              </select>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                className="input-luxury flex-1"
                placeholder="Phone number"
                autoComplete="tel"
                required
              />
            </div>
          </Field>

          <Field label="Country" error={errors.country}>
            <select
              value={form.country}
              onChange={e => setForm(prev => ({ ...prev, country: e.target.value }))}
              className="input-luxury w-full"
              required
            >
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="City" error={errors.city}>
            <input
              type="text"
              value={form.city}
              onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))}
              className="input-luxury"
              placeholder="New York"
              autoComplete="address-level2"
              required
            />
          </Field>
          <Field label="Postal / ZIP Code" error={errors.postalCode}>
            <input
              type="text"
              value={form.postalCode}
              onChange={e => setForm(prev => ({ ...prev, postalCode: e.target.value }))}
              className="input-luxury"
              placeholder="10001"
              autoComplete="postal-code"
              required
            />
          </Field>
        </div>

        <Field label="Street Address" error={errors.streetAddress}>
          <input
            type="text"
            value={form.streetAddress}
            onChange={e => setForm(prev => ({ ...prev, streetAddress: e.target.value }))}
            className="input-luxury"
            placeholder="123 Luxury Lane, Apt 4B"
            autoComplete="street-address"
            required
          />
        </Field>

        <Field label="Apartment, Suite, etc. (Optional)">
          <input
            type="text"
            value={form.apartment}
            onChange={e => setForm(prev => ({ ...prev, apartment: e.target.value }))}
            className="input-luxury"
            placeholder="Unit, floor, building"
            autoComplete="address-line2"
          />
        </Field>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="btn-primary w-full py-4 mt-2"
        >
          <span className="flex items-center justify-center gap-2">
            Continue to Payment
            <ChevronRight className="w-4 h-4" />
          </span>
        </motion.button>
      </form>
    </motion.div>
  );
}

interface PaymentStepProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  cardForm: CardFormState;
  setCardForm: React.Dispatch<React.SetStateAction<CardFormState>>;
  cardBrand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';
  showCvv: boolean;
  setShowCvv: (show: boolean) => void;
  show3DSecure: boolean;
  errors: Partial<ShippingAddress & { card: string }>;
  isProcessing: boolean;
  processingStep: string;
  cardInnerRef: React.RefObject<HTMLDivElement | null>;
  totals: CartTotals;
  onBack: () => void;
  onSubmit: () => void;
}

function PaymentStep({
  paymentMethod, setPaymentMethod, cardForm, setCardForm, cardBrand, showCvv, setShowCvv,
  show3DSecure, errors, isProcessing, processingStep, cardInnerRef, totals, onBack, onSubmit
}: PaymentStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 lg:p-8 space-y-6"
    >
      <div>
        <h2 className="font-heading text-3xl font-medium text-white mb-2">Payment Method</h2>
        <p className="text-obsidian-400">Choose how you'd like to pay</p>
      </div>

      {/* Payment Method Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-obsidian-900/50 p-1 rounded-none">
        {[
          { id: 'card' as const, label: 'Card', icon: CreditCard },
          { id: 'apple-pay' as const, label: 'Apple Pay', icon: AppleLogo },
          { id: 'google-pay' as const, label: 'Google Pay', icon: GoogleLogo },
          { id: 'paypal' as const, label: 'PayPal', icon: PayPalLogo },
        ].map(method => (
          <button
            key={method.id}
            onClick={() => setPaymentMethod(method.id)}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium tracking-wide uppercase transition-all ${
              paymentMethod === method.id
                ? 'bg-gold-gradient text-obsidian-950 shadow-gold-glow'
                : 'text-obsidian-400 hover:text-white'
            }`}
          >
            <method.icon className="w-4 h-4" />
            {method.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {paymentMethod === 'card' && (
          <CardPaymentForm
            key="card"
            cardForm={cardForm}
            setCardForm={setCardForm}
            cardBrand={cardBrand}
            showCvv={showCvv}
            setShowCvv={setShowCvv}
            errors={errors}
            cardInnerRef={cardInnerRef}
            onSubmit={onSubmit}
            isProcessing={isProcessing}
            processingStep={processingStep}
            onBack={onBack}
            totals={totals}
          />
        )}
        {paymentMethod === 'apple-pay' && (
          <ExpressWalletForm
            key="apple-pay"
            walletName="Apple Pay"
            walletLogo={<AppleLogo className="w-8 h-8 text-white" />}
            description="Pay securely with Face ID, Touch ID, or your passcode"
            buttonClass="bg-black text-white border border-white/20 hover:border-white/40"
            onSubmit={onSubmit}
            isProcessing={isProcessing}
            processingStep={processingStep}
            onBack={onBack}
            totals={totals}
          />
        )}
        {paymentMethod === 'google-pay' && (
          <ExpressWalletForm
            key="google-pay"
            walletName="Google Pay"
            walletLogo={<GoogleLogo className="w-8 h-8" />}
            description="Pay quickly and securely with your Google account"
            buttonClass="bg-white text-obsidian-950 hover:bg-white/90"
            onSubmit={onSubmit}
            isProcessing={isProcessing}
            processingStep={processingStep}
            onBack={onBack}
            totals={totals}
          />
        )}
        {paymentMethod === 'paypal' && (
          <ExpressWalletForm
            key="paypal"
            walletName="PayPal"
            walletLogo={<PayPalLogo className="w-8 h-8 text-[#0070BA]" />}
            description="Pay securely with your PayPal balance or linked cards"
            buttonClass="bg-[#0070BA] text-white hover:bg-[#003087]"
            extraTrust="Buyer Protection"
            onSubmit={onSubmit}
            isProcessing={isProcessing}
            processingStep={processingStep}
            onBack={onBack}
            totals={totals}
          />
        )}
      </AnimatePresence>

      {/* 3D Secure OTP overlay */}
      <AnimatePresence>
        {show3DSecure && <Secure3DOverlay />}
      </AnimatePresence>
    </motion.div>
  );
}

function Secure3DOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-obsidian-950/90 backdrop-blur-xl p-4"
      role="alertdialog"
      aria-modal="true"
      aria-label="3D Secure verification"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-obsidian-900 border border-gold-400/30 p-8 text-center space-y-5"
      >
        <div className="mx-auto w-14 h-14 bg-gold-gradient rounded-full flex items-center justify-center">
          <Shield className="w-7 h-7 text-obsidian-950" />
        </div>
        <h3 className="font-heading text-2xl font-medium text-white">3-D Secure Verification</h3>
        <p className="text-sm text-obsidian-400">
          A one-time passcode has been sent to your registered mobile device.
        </p>
        <div className="flex justify-center gap-2" aria-hidden="true">
          {'••••••'.split('').map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="w-9 h-11 border border-obsidian-700 bg-obsidian-800 flex items-center justify-center font-mono text-lg text-gold-300"
            >
              •
            </motion.span>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-obsidian-500">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Verifying passcode with your bank…
        </div>
      </motion.div>
    </motion.div>
  );
}

interface CardPaymentFormProps {
  cardForm: CardFormState;
  setCardForm: React.Dispatch<React.SetStateAction<CardFormState>>;
  cardBrand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';
  showCvv: boolean;
  setShowCvv: (show: boolean) => void;
  errors: Partial<ShippingAddress & { card: string }>;
  cardInnerRef: React.RefObject<HTMLDivElement | null>;
  onSubmit: () => void;
  isProcessing: boolean;
  processingStep: string;
  onBack: () => void;
  totals: CartTotals;
}

function CardPaymentForm({
  cardForm, setCardForm, cardBrand, showCvv, setShowCvv, errors, cardInnerRef,
  onSubmit, isProcessing, processingStep, onBack, totals
}: CardPaymentFormProps) {
  const cardNumberDisplay = cardForm.number || '•••• •••• •••• ••••';
  const cardHolderDisplay = cardForm.holderName || 'JANE DOE';
  const expiryDisplay = cardForm.expiry || 'MM/YY';

  const brandGradient: Record<string, string> = {
    visa: 'linear-gradient(135deg, #1A1F71 0%, #3B4CA8 100%)',
    mastercard: 'linear-gradient(135deg, #EB001B 0%, #F79E1B 100%)',
    amex: 'linear-gradient(135deg, #006FCF 0%, #004C8F 100%)',
    discover: 'linear-gradient(135deg, #FF6000 0%, #B44B00 100%)',
    unknown: 'linear-gradient(135deg, #1a1612 0%, #3d352f 100%)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* 3D Credit Card Preview */}
      <div className="perspective-1000" style={{ perspective: '1000px' }}>
        <div
          ref={cardInnerRef}
          className="relative w-full max-w-xs mx-auto transition-transform duration-700"
          style={{
            transform: showCvv ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            height: '190px',
          }}
        >
          {/* Card Front */}
          <div className="absolute inset-0 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-glass-hover" style={{ background: brandGradient[cardBrand] }}>
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }} />

              {/* Chip */}
              <div className="absolute top-6 left-6 w-11 h-8 bg-gradient-to-br from-amber-300 to-amber-600 rounded-md opacity-90" />

              {/* Brand Logo */}
              <div className="absolute top-6 right-6">
                {cardBrand !== 'unknown' ? (
                  <span className="text-white/95 font-bold text-xs tracking-[0.2em] uppercase">{cardBrand}</span>
                ) : (
                  <span className="text-white/40 font-semibold text-[10px] tracking-[0.25em] uppercase">Glamisky Pay</span>
                )}
              </div>

              {/* Card Number */}
              <div className="absolute bottom-16 left-6 right-6 font-mono text-white text-lg sm:text-xl tracking-[0.12em]">
                {cardNumberDisplay}
              </div>

              {/* Card Holder & Expiry */}
              <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end">
                <div>
                  <p className="text-[9px] text-white/60 uppercase tracking-widest">Cardholder</p>
                  <p className="font-medium text-white text-sm">{cardHolderDisplay}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-white/60 uppercase tracking-widest">Valid Thru</p>
                  <p className="font-mono font-medium text-white text-sm">{expiryDisplay}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-glass-hover" style={{ background: brandGradient[cardBrand] }}>
              {/* Magnetic Stripe */}
              <div className="absolute top-7 left-0 right-0 h-10 bg-obsidian-950/90" />

              {/* Signature Panel */}
              <div className="absolute top-24 left-6 right-6 h-10 bg-white/90 rounded-sm relative overflow-hidden">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-16 h-6 bg-obsidian-200/60 rounded-sm" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-obsidian-600 font-semibold tracking-wider">AUTHORIZED SIGNATURE</div>
              </div>

              {/* CVV */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-end items-center gap-3">
                <span className="text-[9px] text-white/70 uppercase tracking-widest">CVV</span>
                <div className="bg-white/20 px-4 py-1.5 rounded-sm font-mono text-white text-sm w-16 text-center tracking-widest">
                  {cardForm.cvv || '•••'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Form Fields */}
      <div className="space-y-4">
        <Field label="Card Number" error={errors.card}>
          <input
            type="text"
            inputMode="numeric"
            value={cardForm.number}
            onChange={e => setCardForm(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
            className="input-luxury font-mono text-lg tracking-wider"
            placeholder="0000 0000 0000 0000"
            autoComplete="cc-number"
            maxLength={19}
            onFocus={() => setShowCvv(false)}
            required
          />
        </Field>

        <Field label="Cardholder Name" error={errors.card}>
          <input
            type="text"
            value={cardForm.holderName}
            onChange={e => setCardForm(prev => ({ ...prev, holderName: e.target.value.toUpperCase() }))}
            className="input-luxury"
            placeholder="JANE DOE"
            autoComplete="cc-name"
            onFocus={() => setShowCvv(false)}
            required
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Expiry Date" error={errors.card}>
            <input
              type="text"
              inputMode="numeric"
              value={cardForm.expiry}
              onChange={e => setCardForm(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
              className="input-luxury font-mono"
              placeholder="MM/YY"
              autoComplete="cc-exp"
              maxLength={5}
              onFocus={() => setShowCvv(false)}
              required
            />
          </Field>

          <Field label="CVV" error={errors.card}>
            <div className="relative">
              <input
                type={showCvv ? 'text' : 'password'}
                inputMode="numeric"
                value={cardForm.cvv}
                onChange={e => setCardForm(prev => ({ ...prev, cvv: formatCvv(e.target.value, cardBrand) }))}
                className="input-luxury font-mono pr-12"
                placeholder="•••"
                autoComplete="cc-csc"
                maxLength={cardBrand === 'amex' ? 4 : 3}
                onFocus={() => setShowCvv(true)}
                required
              />
              <button
                type="button"
                onClick={() => setShowCvv(!showCvv)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-white transition-colors"
                aria-label={showCvv ? 'Hide CVV' : 'Show CVV'}
              >
                {showCvv ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-obsidian-500 mt-1">3-digit code on back (4 for Amex)</p>
          </Field>
        </div>
      </div>

      <OrderSummaryTotals totals={totals} />

      {/* Security Badges */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-obsidian-500">
        <div className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /><span>256-bit SSL Encryption</span></div>
        <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /><span>PCI-DSS Level 1</span></div>
        <div className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /><span>DHL/FedEx Insured</span></div>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: isProcessing ? 1 : 1.02 }}
        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
        disabled={isProcessing}
        onClick={onSubmit}
        className="btn-gold w-full py-4"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            {processingStep || 'Processing...'}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Pay {formatCurrency(totals.total)}
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </motion.button>

      <button
        onClick={onBack}
        className="w-full py-3 text-sm font-medium text-obsidian-400 hover:text-white transition-colors"
      >
        ← Back to Shipping
      </button>
    </motion.div>
  );
}

interface ExpressWalletFormProps {
  walletName: string;
  walletLogo: React.ReactNode;
  description: string;
  buttonClass: string;
  extraTrust?: string;
  onSubmit: () => void;
  isProcessing: boolean;
  processingStep: string;
  onBack: () => void;
  totals: CartTotals;
}

function ExpressWalletForm({
  walletName, walletLogo, description, buttonClass, extraTrust,
  onSubmit, isProcessing, processingStep, onBack, totals
}: ExpressWalletFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-none p-8 text-center">
        <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">{walletLogo}</div>
        <h3 className="font-heading text-xl font-medium text-white mb-2">{walletName}</h3>
        <p className="text-obsidian-400 mb-6 text-sm">{description}</p>

        <button
          onClick={onSubmit}
          disabled={isProcessing}
          className={`w-full py-4 px-6 rounded-none font-semibold tracking-wider uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-3 ${buttonClass}`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{processingStep || 'Processing...'}</span>
            </>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Pay {formatCurrency(totals.total)} with {walletName}
            </span>
          )}
        </button>

        {/* Biometric hint */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-obsidian-500">
          <Smartphone className="w-3.5 h-3.5" />
          <span>A biometric confirmation sheet will appear</span>
        </div>
      </div>

      <OrderSummaryTotals totals={totals} />

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-obsidian-500">
        <div className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /><span>256-bit SSL</span></div>
        <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /><span>Tokenized</span></div>
        {extraTrust && (
          <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /><span>{extraTrust}</span></div>
        )}
      </div>

      <button
        onClick={onBack}
        className="w-full py-3 text-sm font-medium text-obsidian-400 hover:text-white transition-colors"
      >
        ← Back to Shipping
      </button>
    </motion.div>
  );
}

function OrderSummaryTotals({ totals }: { totals: CartTotals }) {
  return (
    <div className="bg-obsidian-900/50 border border-obsidian-800 p-5 rounded-none">
      <h3 className="font-heading text-lg font-medium text-white mb-4">Order Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-obsidian-400">Subtotal</span>
          {totals.isFirstOrderFree ? (
            <span className="text-white">
              <s className="text-obsidian-500">{formatCurrency(totals.subtotal)}</s>
              <span className="ml-2 text-gold-400 font-semibold">Free</span>
            </span>
          ) : (
            <span className="text-white">{formatCurrency(totals.subtotal)}</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-obsidian-400">Service & Handling (10%)</span>
          {totals.isFirstOrderFree ? (
            <span className="text-gold-400 font-semibold">Waived</span>
          ) : (
            <span className="text-white">{formatCurrency(totals.serviceFee)}</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-obsidian-400">Shipping</span>
          <span className="text-white">
            {formatCurrency(totals.shippingFee)}
            {totals.isFirstOrderFree && <span className="text-gold-400 ml-1 text-xs">Express</span>}
          </span>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-gold-400">
            <span>VIP Discount (NEWCOMERS)</span>
            <span>-{formatCurrency(totals.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-semibold text-white border-t border-obsidian-700 pt-2">
          <span>Total</span>
          <span className="text-gold-300">{formatCurrency(totals.total)}</span>
        </div>
      </div>
    </div>
  );
}

interface OrderSuccessProps {
  order: NonNullable<ReturnType<typeof useCart>['state']['order']>;
  onClose: () => void;
}

function OrderSuccessContent({ order, onClose }: OrderSuccessProps) {
  return (
    <div className="p-8 lg:p-12 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-20 h-20 mx-auto mb-6 bg-gold-gradient rounded-full flex items-center justify-center"
      >
        <Check className="w-10 h-10 text-obsidian-950" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-heading text-3xl font-medium text-white mb-2"
      >
        Order Confirmed!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-obsidian-400 mb-8"
      >
        Thank you for your order. A confirmation email has been sent to{' '}
        <span className="text-white font-medium">{order.shippingAddress.email}</span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-obsidian-900/50 border border-obsidian-800 rounded-none p-6 text-left mb-8"
      >
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-obsidian-800">
          <span className="text-obsidian-400">Order Number</span>
          <span className="font-mono font-medium text-white">{order.id}</span>
        </div>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-obsidian-800">
          <span className="text-obsidian-400">Tracking Number (DHL/FedEx)</span>
          <span className="font-mono font-medium text-gold-300">{order.trackingNumber}</span>
        </div>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-obsidian-800">
          <span className="text-obsidian-400">Payment Method</span>
          <span className="font-medium text-white capitalize">{order.paymentDetails.method.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-obsidian-400">Total Paid</span>
          <span className="font-heading text-xl font-medium text-gold-300">{formatCurrency(order.totals.total)}</span>
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClose}
        className="btn-primary w-full py-4"
      >
        <span>Continue Shopping</span>
      </motion.button>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-luxury">{label}</label>
      {children}
      {error && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
          {error}
        </motion.p>
      )}
    </div>
  );
}