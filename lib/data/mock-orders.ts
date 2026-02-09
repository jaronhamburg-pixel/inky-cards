import { Order } from '@/types/order';
import { mockCards } from './mock-cards';

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'INK-2026-001',
    items: [
      {
        id: '1',
        cardId: '1',
        card: mockCards[0],
        customization: {
          frontText: 'Sarah & Michael',
          insideText: 'Wishing you a lifetime of love and happiness together.',
        },
        quantity: 50,
        price: 12.99,
      },
    ],
    customer: {
      email: 'sarah@example.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '555-0123',
    },
    shipping: {
      address: '123 Maple Street',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
      country: 'US',
    },
    subtotal: 649.50,
    shipping_cost: 12.50,
    tax: 55.75,
    total: 717.75,
    status: 'shipped',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-18'),
  },
  {
    id: '2',
    orderNumber: 'INK-2026-002',
    items: [
      {
        id: '2',
        cardId: '5',
        card: mockCards[4],
        customization: {
          frontText: 'Happy Birthday Emma!',
          insideText: 'May your special day be filled with joy and laughter.',
        },
        quantity: 1,
        price: 11.99,
      },
    ],
    customer: {
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Smith',
    },
    shipping: {
      address: '456 Oak Avenue',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'US',
    },
    videoMessage: {
      url: '/videos/sample-greeting.mp4',
      qrCodeUrl: '/qr-codes/order-2.png',
    },
    subtotal: 11.99,
    shipping_cost: 4.99,
    tax: 1.35,
    total: 18.33,
    status: 'delivered',
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-25'),
  },
  {
    id: '3',
    orderNumber: 'INK-2026-003',
    items: [
      {
        id: '3',
        cardId: '15',
        card: mockCards[14],
        customization: {
          frontText: 'Thank You',
          insideText: 'Your kindness means the world to us.',
        },
        quantity: 10,
        price: 14.99,
      },
    ],
    customer: {
      email: 'maria@example.com',
      firstName: 'Maria',
      lastName: 'Garcia',
      phone: '555-0456',
    },
    shipping: {
      address: '789 Pine Road',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'US',
    },
    subtotal: 149.90,
    shipping_cost: 8.50,
    tax: 13.25,
    total: 171.65,
    status: 'processing',
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-02'),
  },
];

// In-memory storage for new orders (simulates database)
let orderStorage: Order[] = [...mockOrders];
let orderCounter = mockOrders.length + 1;

export function getAllOrders(): Order[] {
  return orderStorage.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getOrderById(id: string): Order | undefined {
  return orderStorage.find((order) => order.id === id);
}

export function createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
  const newOrder: Order = {
    ...order,
    id: String(orderCounter),
    orderNumber: `INK-2026-${String(orderCounter).padStart(3, '0')}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  orderStorage.push(newOrder);
  orderCounter++;
  return newOrder;
}

export function updateOrderStatus(id: string, status: Order['status']): Order | undefined {
  const order = orderStorage.find((o) => o.id === id);
  if (order) {
    order.status = status;
    order.updatedAt = new Date();
  }
  return order;
}

export function deleteOrder(id: string): boolean {
  const index = orderStorage.findIndex((o) => o.id === id);
  if (index > -1) {
    orderStorage.splice(index, 1);
    return true;
  }
  return false;
}
