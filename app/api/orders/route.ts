import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, createOrder } from '@/lib/data/mock-orders';

export async function GET() {
  try {
    const orders = getAllOrders();
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

    const { items, customer, shipping, videoMessage, subtotal, shipping_cost, tax, total, status } = body;

    if (!items || !customer || !shipping) {
      return NextResponse.json(
        { error: 'Items, customer, and shipping information are required' },
        { status: 400 }
      );
    }

    const newOrder = createOrder({
      items,
      customer,
      shipping,
      videoMessage,
      subtotal,
      shipping_cost,
      tax,
      total,
      status: status || 'pending',
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
