'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCartStore } from '@/lib/store/cart-store';
import { checkoutSchema, type CheckoutFormData } from '@/lib/utils/validation';
import { createOrder } from '@/lib/data/mock-orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils/formatting';
import { VideoRecorder } from '@/components/video/video-recorder';
import Link from 'next/link';

type CheckoutStep = 1 | 2 | 3 | 4;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'US',
    },
  });

  const subtotal = getTotal();
  const shipping = subtotal > 50 ? 0 : 8.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container-luxury py-20 text-center">
        <h1 className="heading-display text-luxury-charcoal mb-4">Your Cart is Empty</h1>
        <p className="body-large text-neutral-600 mb-8">
          Add some cards to your cart before checking out
        </p>
        <Link href="/cards">
          <Button>Browse Cards</Button>
        </Link>
      </div>
    );
  }

  const handleNext = async () => {
    let fieldsToValidate: (keyof CheckoutFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['email', 'firstName', 'lastName'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['address', 'city', 'state', 'zip'];
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }

    setCurrentStep((prev) => Math.min(4, prev + 1) as CheckoutStep);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as CheckoutStep);
  };

  const onSubmit = (data: CheckoutFormData) => {
    const order = createOrder({
      items,
      customer: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
      shipping: {
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country || 'US',
      },
      videoMessage: videoUrl
        ? {
            url: videoUrl,
            qrCodeUrl: `/qr-codes/order-${Date.now()}.png`,
          }
        : undefined,
      subtotal,
      shipping_cost: shipping,
      tax,
      total,
      status: 'pending',
    });

    clearCart();
    router.push(`/checkout/success?orderId=${order.id}`);
  };

  const steps = [
    { number: 1, label: 'Contact' },
    { number: 2, label: 'Shipping' },
    { number: 3, label: 'Video' },
    { number: 4, label: 'Review' },
  ];

  return (
    <div className="container-luxury py-12 animate-fade-in">
      <h1 className="heading-display text-luxury-charcoal mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step.number
                      ? 'bg-luxury-gold text-luxury-charcoal'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`mt-2 text-sm ${
                    currentStep >= step.number ? 'text-luxury-gold font-medium' : 'text-neutral-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-colors ${
                    currentStep > step.number ? 'bg-luxury-gold' : 'bg-neutral-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Steps */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-neutral-200 rounded-lg p-8">
            {/* Step 1: Contact Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="heading-card text-luxury-charcoal mb-4">Contact Information</h2>
                <Input
                  {...register('email')}
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  error={errors.email?.message}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    {...register('firstName')}
                    label="First Name"
                    placeholder="John"
                    error={errors.firstName?.message}
                    required
                  />
                  <Input
                    {...register('lastName')}
                    label="Last Name"
                    placeholder="Smith"
                    error={errors.lastName?.message}
                    required
                  />
                </div>
                <Input
                  {...register('phone')}
                  label="Phone (optional)"
                  type="tel"
                  placeholder="(555) 555-5555"
                  error={errors.phone?.message}
                />
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="heading-card text-luxury-charcoal mb-4">Shipping Address</h2>
                <Input
                  {...register('address')}
                  label="Street Address"
                  placeholder="123 Main Street"
                  error={errors.address?.message}
                  required
                />
                <Input
                  {...register('city')}
                  label="City"
                  placeholder="Portland"
                  error={errors.city?.message}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    {...register('state')}
                    label="State"
                    placeholder="OR"
                    error={errors.state?.message}
                    required
                  />
                  <Input
                    {...register('zip')}
                    label="ZIP Code"
                    placeholder="97201"
                    error={errors.zip?.message}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Video Message */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="heading-card text-luxury-charcoal mb-4">
                  Video Greeting (Optional)
                </h2>
                <p className="text-neutral-600 mb-4">
                  Add a personal video message with your card. We'll generate a QR code that the
                  recipient can scan to watch your message.
                </p>

                {!videoUrl && !showRecorder ? (
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                    <svg
                      className="w-12 h-12 text-neutral-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="font-semibold text-luxury-charcoal mb-2">
                      No Video Added Yet
                    </h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      Record a video or skip this step
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowRecorder(true)}
                    >
                      Record Video
                    </Button>
                    <p className="text-xs text-neutral-400 mt-4">Max duration: 60 seconds</p>
                  </div>
                ) : showRecorder && !videoUrl ? (
                  <VideoRecorder
                    maxDuration={60}
                    onVideoReady={(blob, previewUrl) => {
                      setVideoBlob(blob);
                      setVideoUrl(previewUrl);
                      setShowRecorder(false);
                    }}
                    onCancel={() => setShowRecorder(false)}
                  />
                ) : (
                  <div className="bg-neutral-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-luxury-charcoal"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-luxury-charcoal">Video Added</p>
                          <p className="text-sm text-neutral-500">Ready to include with order</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          if (videoUrl) URL.revokeObjectURL(videoUrl);
                          setVideoUrl('');
                          setVideoBlob(null);
                        }}
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review & Payment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="heading-card text-luxury-charcoal mb-4">Review Your Order</h2>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-neutral-50 rounded-lg">
                      <div className="font-medium text-luxury-charcoal flex-1">
                        {item.card.title} × {item.quantity}
                      </div>
                      <div className="text-luxury-gold font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 pt-4 mt-6">
                  <p className="text-sm text-neutral-600 mb-4">
                    This is a demo checkout. No payment will be processed.
                  </p>
                  <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-600">
                    <p className="font-semibold mb-2">In production, you would:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Integrate with Stripe for real payments</li>
                      <li>Process the credit card information</li>
                      <li>Send confirmation emails</li>
                      <li>Trigger order fulfillment</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-8 border-t border-neutral-200">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              {currentStep < 4 ? (
                <Button type="button" variant="secondary" onClick={handleNext} className="ml-auto">
                  Continue
                </Button>
              ) : (
                <Button type="submit" variant="secondary" className="ml-auto">
                  Place Order
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-neutral-200 rounded-lg p-6 sticky top-24">
            <h3 className="font-semibold text-lg text-luxury-charcoal mb-4">Order Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex justify-between text-lg font-semibold">
                <span className="text-luxury-charcoal">Total</span>
                <span className="text-luxury-gold">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-neutral-500">
              <p>✓ Secure checkout</p>
              <p>✓ Free returns within 30 days</p>
              <p>✓ Premium quality guarantee</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
