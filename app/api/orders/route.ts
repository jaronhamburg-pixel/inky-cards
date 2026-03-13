import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, createOrder } from '@/lib/db/orders';
import { stripe } from '@/lib/stripe';
import { sanitizeObject } from '@/lib/utils/sanitize';

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const sanitized = sanitizeObject(body);
    const { items, customer, shipping, videoMessage, subtotal, shipping_cost, tax, total, status, userId, paymentIntentId } = sanitized;

    if (!items || !customer || !shipping) {
      return NextResponse.json(
        { error: 'Items, customer, and shipping information are required' },
        { status: 400 }
      );
    }

    // Verify payment with Stripe if paymentIntentId is provided
    let paymentStatus: 'pending' | 'succeeded' | 'failed' = 'pending';
    if (paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return NextResponse.json(
          { error: 'Payment has not been completed' },
          { status: 400 }
        );
      }
      paymentStatus = 'succeeded';
    }

    const newOrder = await createOrder({
      ...(userId ? { userId } : {}),
      items,
      customer,
      shipping,
      videoMessage,
      subtotal,
      shipping_cost,
      tax,
      total,
      status: paymentIntentId ? 'pending_payment' : (status || 'pending'),
      paymentIntentId,
      paymentStatus,
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
