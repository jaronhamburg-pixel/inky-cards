'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCartStore } from '@/lib/store/cart-store';
import { useAuth } from '@/lib/context/auth-context';
import { checkoutSchema, type CheckoutFormData } from '@/lib/utils/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils/formatting';
import Link from 'next/link';

type CheckoutStep = 1 | 2 | 3;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);

  const defaultAddress = useMemo(() => {
    if (!user) return null;
    return user.addresses.find((a) => a.isDefault) || user.addresses[0] || null;
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      address: defaultAddress?.address || '',
      city: defaultAddress?.city || '',
      state: defaultAddress?.state || '',
      zip: defaultAddress?.zip || '',
      country: defaultAddress?.country || 'GB',
    },
  });

  const subtotal = getTotal();
  const shipping = subtotal > 50 ? 0 : 8.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container-luxury py-20 text-center">
        <h1 className="heading-display text-ink mb-4">Your Basket is Empty</h1>
        <p className="body-large text-stone mb-8">Add some cards before checking out</p>
        <Link href="/cards"><Button>Shop Cards</Button></Link>
      </div>
    );
  }

  const handleNext = async () => {
    let fieldsToValidate: (keyof CheckoutFormData)[] = [];
    if (currentStep === 1) fieldsToValidate = ['email', 'firstName', 'lastName'];
    else if (currentStep === 2) fieldsToValidate = ['address', 'city', 'state', 'zip'];

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }
    setCurrentStep((prev) => Math.min(3, prev + 1) as CheckoutStep);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as CheckoutStep);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(user ? { userId: user.id } : {}),
        items,
        customer: { email: data.email, firstName: data.firstName, lastName: data.lastName, phone: data.phone },
        shipping: { address: data.address, city: data.city, state: data.state, zip: data.zip, country: data.country || 'GB' },
        subtotal,
        shipping_cost: shipping,
        tax,
        total,
        status: 'pending',
      }),
    });
    const order = await res.json();
    clearCart();
    router.push(`/checkout/success?orderId=${order.id}`);
  };

  const steps = [
    { number: 1, label: 'Contact' },
    { number: 2, label: 'Shipping' },
    { number: 3, label: 'Review' },
  ];

  return (
    <div className="container-luxury py-12 animate-fade-in">
      <h1 className="heading-display text-ink mb-8">Checkout</h1>

      {/* Progress */}
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep >= step.number ? 'bg-ink text-white' : 'bg-silk text-stone'
                }`}>
                  {step.number}
                </div>
                <span className={`mt-2 text-xs uppercase tracking-wider ${
                  currentStep >= step.number ? 'text-ink font-medium' : 'text-stone'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 transition-colors ${
                  currentStep > step.number ? 'bg-ink' : 'bg-silk'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-silk rounded-lg p-8">
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-ink mb-4">Contact Information</h2>
                <Input {...register('email')} label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input {...register('firstName')} label="First Name" placeholder="Jane" error={errors.firstName?.message} required />
                  <Input {...register('lastName')} label="Last Name" placeholder="Smith" error={errors.lastName?.message} required />
                </div>
                <Input {...register('phone')} label="Phone (optional)" type="tel" placeholder="(555) 555-5555" error={errors.phone?.message} />
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-ink mb-4">Shipping Address</h2>
                <Input {...register('address')} label="Street Address" placeholder="123 Main Street" error={errors.address?.message} required />
                <Input {...register('city')} label="City" placeholder="Portland" error={errors.city?.message} required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input {...register('state')} label="State" placeholder="OR" error={errors.state?.message} required />
                  <Input {...register('zip')} label="ZIP Code" placeholder="97201" error={errors.zip?.message} required />
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-ink mb-4">Review Your Order</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-paper border border-silk rounded">
                      <div className="font-medium text-ink flex-1 text-sm">
                        {item.card.title} &times; {item.quantity}
                      </div>
                      <div className="text-ink font-semibold text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-silk pt-4 mt-6">
                  <p className="text-sm text-stone mb-4">
                    This is a demo checkout. No payment will be processed.
                  </p>
                  <div className="bg-neutral-50 rounded p-4 text-sm text-stone">
                    <p className="font-medium text-ink mb-2">In production, you would:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Integrate with Stripe for real payments</li>
                      <li>Process credit card information</li>
                      <li>Send confirmation emails</li>
                      <li>Trigger order fulfilment</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Nav */}
            <div className="flex gap-4 mt-8 pt-8 border-t border-silk">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
              )}
              {currentStep < 3 ? (
                <Button type="button" variant="primary" onClick={handleNext} className="ml-auto">Continue</Button>
              ) : (
                <Button type="submit" variant="primary" className="ml-auto">Place Order</Button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-silk rounded-lg p-6 sticky top-24">
            <h3 className="text-lg font-medium text-ink mb-4">Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-stone">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="pt-3 border-t border-silk flex justify-between text-lg font-semibold">
                <span className="text-ink">Total</span>
                <span className="text-ink">{formatPrice(total)}</span>
              </div>
            </div>
            <div className="space-y-2 text-xs text-stone">
              <p>Secure checkout</p>
              <p>Free returns within 30 days</p>
              <p>Premium quality guarantee</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
