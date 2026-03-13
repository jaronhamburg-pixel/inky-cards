'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate, formatOrderNumber } from '@/lib/utils/formatting';
import { QRDisplay } from '@/components/video/qr-display';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setOrder({ ...data, createdAt: new Date(data.createdAt), updatedAt: new Date(data.updatedAt) });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container-luxury py-20 text-center">
        <div className="w-20 h-20 bg-silk rounded-full mx-auto mb-6 animate-pulse" />
        <div className="h-8 bg-silk rounded w-64 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-silk rounded w-48 mx-auto animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-luxury py-20 text-center">
        <h1 className="heading-display text-luxury-charcoal mb-4">Order Not Found</h1>
        <p className="text-neutral-600 mb-8">The order you're looking for doesn't exist.</p>
        <Link href="/cards">
          <Button>Browse Cards</Button>
        </Link>
      </div>
    );
  }

  const statusColors: Record<typeof order.status, 'default' | 'warning' | 'success' | 'info'> = {
    pending: 'warning',
    pending_payment: 'warning',
    processing: 'info',
    printing: 'info',
    shipped: 'success',
    delivered: 'success',
    cancelled: 'default',
  };

  return (
    <div className="container-luxury py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="heading-display text-luxury-charcoal mb-2">
                Order {formatOrderNumber(order.orderNumber)}
              </h1>
              <p className="text-neutral-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <Badge variant={statusColors[order.status]} className="capitalize text-base px-4 py-2">
              {order.status}
            </Badge>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-neutral-200 rounded-lg p-8 mb-8">
          <h2 className="font-semibold text-lg text-luxury-charcoal mb-6">Order Items</h2>
          <div className="space-y-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-6 pb-6 border-b border-neutral-200 last:border-0 last:pb-0">
                <div className="w-24 h-32 relative overflow-hidden rounded-md flex-shrink-0">
                  <Image
                    src={item.card.images.thumbnail}
                    alt={item.card.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-luxury-charcoal mb-2">{item.card.title}</h3>
                  <p className="text-sm text-neutral-600 mb-3">{item.card.description}</p>
                  {(item.customization.frontText || item.customization.insideText) && (
                    <div className="bg-luxury-cream rounded-lg p-3 mb-3">
                      <p className="text-xs font-semibold text-luxury-charcoal mb-1">
                        Customization:
                      </p>
                      {item.customization.frontText && (
                        <p className="text-xs text-neutral-700">
                          <span className="font-medium">Front:</span> {item.customization.frontText}
                        </p>
                      )}
                      {item.customization.insideText && (
                        <p className="text-xs text-neutral-700">
                          <span className="font-medium">Inside:</span>{' '}
                          {item.customization.insideText}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
                    <p className="font-semibold text-luxury-gold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-6 border-t border-neutral-200 space-y-2">
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

        {/* Video Message */}
        {order.videoMessage && (
          <div className="bg-white border border-neutral-200 rounded-lg p-8 mb-8">
            <h2 className="font-semibold text-lg text-ink mb-4">Video Greeting</h2>
            <div className="rounded-lg overflow-hidden bg-black mb-4">
              <video
                src={order.videoMessage.url}
                controls
                playsInline
                className="w-full aspect-video"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="flex items-center gap-4">
              {order.videoMessage.videoId && (
                <Link
                  href={`/video/${order.videoMessage.videoId}`}
                  className="text-sm text-stone hover:text-ink transition-colors"
                >
                  Open video page &rarr;
                </Link>
              )}
              <a
                href={order.videoMessage.url}
                download
                className="text-sm text-stone hover:text-ink transition-colors"
              >
                Download video
              </a>
            </div>
            {order.videoMessage.qrCodeUrl && (
              <div className="flex items-start gap-6 mt-4 pt-4 border-t border-silk">
                <QRDisplay
                  url={`${typeof window !== 'undefined' ? window.location.origin : ''}/video/${order.videoMessage.videoId || order.id}`}
                  size={120}
                  downloadable={true}
                />
                <div className="flex-1">
                  <p className="text-sm text-stone">
                    Scan the QR code on your card to view this video greeting on any device.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="font-semibold text-luxury-charcoal mb-4">Customer Information</h3>
            <div className="space-y-2 text-sm text-neutral-600">
              <p className="font-medium text-luxury-charcoal">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p>{order.customer.email}</p>
              {order.customer.phone && <p>{order.customer.phone}</p>}
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="font-semibold text-luxury-charcoal mb-4">Shipping Address</h3>
            <div className="space-y-1 text-sm text-neutral-600">
              <p>{order.shipping.address}</p>
              <p>
                {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
              </p>
              <p>{order.shipping.country}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/cards">
            <Button variant="secondary" size="lg">
              Shop More Cards
            </Button>
          </Link>
          <a href="mailto:support@inkycards.com" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              Contact Support
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
