import { prisma } from './prisma';
import type { Order, OrderItem } from '@/types/order';
import type {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  Card as PrismaCard,
  Prisma,
} from '@/lib/generated/prisma';

type JsonInput = Prisma.InputJsonValue;
import type { Card, CardCustomization } from '@/types/card';

type PrismaOrderWithItems = PrismaOrder & {
  items: (PrismaOrderItem & { card: PrismaCard })[];
};

function toCard(row: PrismaCard): Card {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as Card['category'],
    price: row.price,
    images: row.images as Card['images'],
    customizable: row.customizable as Card['customizable'],
    templates: row.templates as Card['templates'],
  };
}

function toOrderItem(row: PrismaOrderItem & { card: PrismaCard }): OrderItem {
  return {
    id: row.id,
    cardId: row.cardId,
    card: toCard(row.card),
    customization: row.customization as CardCustomization,
    quantity: row.quantity,
    price: row.price,
  };
}

function toOrder(row: PrismaOrderWithItems): Order {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    userId: row.userId ?? undefined,
    items: row.items.map(toOrderItem),
    customer: {
      email: row.customerEmail,
      firstName: row.customerFirstName,
      lastName: row.customerLastName,
      phone: row.customerPhone ?? undefined,
    },
    shipping: {
      address: row.shippingAddress,
      city: row.shippingCity,
      state: row.shippingState,
      zip: row.shippingZip,
      country: row.shippingCountry,
    },
    videoMessage: row.videoUrl
      ? { url: row.videoUrl, qrCodeUrl: row.videoQrCodeUrl!, videoId: row.videoId ?? undefined }
      : undefined,
    subtotal: row.subtotal,
    shipping_cost: row.shippingCost,
    tax: row.tax,
    total: row.total,
    status: row.status as Order['status'],
    paymentIntentId: row.paymentIntentId ?? undefined,
    paymentStatus: row.paymentStatus as Order['paymentStatus'],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

const includeItems = { items: { include: { card: true } } } as const;

export async function getAllOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    include: includeItems,
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(toOrder);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const row = await prisma.order.findUnique({
    where: { id },
    include: includeItems,
  });
  return row ? toOrder(row) : undefined;
}

export async function createOrder(
  order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
): Promise<Order> {
  const count = await prisma.order.count();
  const orderNumber = `INK-2026-${String(count + 1).padStart(3, '0')}`;

  const row = await prisma.order.create({
    data: {
      orderNumber,
      userId: order.userId || null,
      customerEmail: order.customer.email,
      customerFirstName: order.customer.firstName,
      customerLastName: order.customer.lastName,
      customerPhone: order.customer.phone || null,
      shippingAddress: order.shipping.address,
      shippingCity: order.shipping.city,
      shippingState: order.shipping.state,
      shippingZip: order.shipping.zip,
      shippingCountry: order.shipping.country,
      videoId: order.videoMessage?.videoId || null,
      videoUrl: order.videoMessage?.url || null,
      videoQrCodeUrl: order.videoMessage?.qrCodeUrl || null,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      tax: order.tax,
      total: order.total,
      status: order.status,
      paymentIntentId: order.paymentIntentId || null,
      paymentStatus: order.paymentStatus || null,
      items: {
        create: order.items.map((item) => ({
          cardId: item.cardId,
          customization: item.customization as unknown as JsonInput,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: includeItems,
  });
  return toOrder(row);
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | undefined> {
  try {
    const row = await prisma.order.update({
      where: { id },
      data: { status },
      include: includeItems,
    });
    return toOrder(row);
  } catch {
    return undefined;
  }
}

export async function deleteOrder(id: string): Promise<boolean> {
  try {
    await prisma.order.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: { userId },
    include: includeItems,
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(toOrder);
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: { customerEmail: { equals: email, mode: 'insensitive' } },
    include: includeItems,
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(toOrder);
}

export async function updateOrderByPaymentIntentId(
  paymentIntentId: string,
  updates: { status?: string; paymentStatus?: string }
): Promise<Order | undefined> {
  try {
    const existing = await prisma.order.findFirst({ where: { paymentIntentId } });
    if (!existing) return undefined;

    const row = await prisma.order.update({
      where: { id: existing.id },
      data: updates,
      include: includeItems,
    });
    return toOrder(row);
  } catch {
    return undefined;
  }
}
