'use client';

import { use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getOrderById } from '@/lib/data/mock-orders';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate, formatOrderNumber } from '@/lib/utils/formatting';
import { QRDisplay } from '@/components/video/qr-display';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return (
      <div className="container-luxury py-20 text-center">
        <h1 className="heading-display text-luxury-charcoal mb-4">Order Not Found</h1>
        <Link href="/cards">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="container-luxury py-20 text-center">
        <h1 className="heading-display text-luxury-charcoal mb-4">Order Not Found</h1>
        <Link href="/cards">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxury py-12 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="heading-display text-luxury-charcoal mb-4">Order Confirmed!</h1>
          <p className="body-large text-neutral-600 mb-2">
            Thank you for your order, {order.customer.firstName}!
          </p>
          <p className="text-neutral-500">
            Order {formatOrderNumber(order.orderNumber)} • {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white border border-neutral-200 rounded-lg p-8 mb-8">
          <h2 className="font-semibold text-lg text-luxury-charcoal mb-6">Order Details</h2>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-20 relative overflow-hidden rounded-md flex-shrink-0">
                  <Image
                    src={item.card.images.thumbnail}
                    alt={item.card.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-luxury-charcoal">{item.card.title}</h3>
                  <p className="text-sm text-neutral-500">Quantity: {item.quantity}</p>
                  {item.customization.frontText && (
                    <p className="text-xs text-neutral-500 mt-1">
                      Customized: {item.customization.frontText}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-luxury-gold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t border-neutral-200 pt-4 space-y-2">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping_cost)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-neutral-200">
              <span className="text-luxury-charcoal">Total</span>
              <span className="text-luxury-gold">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white border border-neutral-200 rounded-lg p-8 mb-8">
          <h2 className="font-semibold text-lg text-luxury-charcoal mb-4">
            Shipping Information
          </h2>
          <div className="text-neutral-600">
            <p className="font-medium">
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p>{order.shipping.address}</p>
            <p>
              {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
            </p>
            <p className="mt-2">{order.customer.email}</p>
          </div>
        </div>

        {/* Video Message */}
        {order.videoMessage && (
          <div className="bg-luxury-cream border border-luxury-gold rounded-lg p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-luxury-charcoal"
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
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-luxury-charcoal mb-2">Video Greeting Included</h3>
                <p className="text-sm text-neutral-600 mb-3">
                  We've included a QR code on your card that links to your video message. The
                  recipient can scan it with their phone to watch your greeting.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <QRDisplay
                url={`${typeof window !== 'undefined' ? window.location.origin : ''}/orders/${order.id}`}
                size={160}
                label="Scan to view video greeting"
                downloadable={true}
              />
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white border border-neutral-200 rounded-lg p-8 mb-8">
          <h2 className="font-semibold text-lg text-luxury-charcoal mb-4">What Happens Next?</h2>
          <ul className="space-y-3 text-neutral-600">
            <li className="flex gap-3">
              <span className="text-luxury-gold font-bold">1.</span>
              <span>
                You'll receive an email confirmation at <strong>{order.customer.email}</strong>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-luxury-gold font-bold">2.</span>
              <span>Your cards will be professionally printed on premium cardstock</span>
            </li>
            <li className="flex gap-3">
              <span className="text-luxury-gold font-bold">3.</span>
              <span>We'll send you tracking information once your order ships</span>
            </li>
            <li className="flex gap-3">
              <span className="text-luxury-gold font-bold">4.</span>
              <span>Expected delivery: 5-7 business days</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/orders/${order.id}`}>
            <Button size="lg" variant="outline">
              View Order Details
            </Button>
          </Link>
          <Link href="/cards">
            <Button size="lg" variant="secondary">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-12 pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-600">
            Need help? Contact us at{' '}
            <a href="mailto:support@inkycards.com" className="text-luxury-gold hover:underline">
              support@inkycards.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container-luxury py-20 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
