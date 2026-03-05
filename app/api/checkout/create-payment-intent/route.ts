import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    // Recalculate total server-side (never trust client amounts)
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
    const shippingCost = subtotal > 50 ? 0 : 1.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    // Stripe expects amount in smallest currency unit (pence for GBP)
    const amountInPence = Math.round(total * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: 'gbp',
      payment_method_types: ['card', 'klarna'],
      metadata: {
        customerEmail: customer?.email || '',
        customerName: customer
          ? `${customer.firstName} ${customer.lastName}`
          : '',
        itemCount: String(items.length),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
