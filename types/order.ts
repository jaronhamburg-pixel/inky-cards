import { Card, CardCustomization } from './card';

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderItem {
  id: string;
  cardId: string;
  card: Card;
  customization: CardCustomization;
  quantity: number;
  price: number;
  videoMessage?: {
    url: string;
    qrCodeUrl: string;
    videoId?: string;
  };
}

export type OrderStatus = 'pending' | 'pending_payment' | 'processing' | 'printing' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentStatus = 'pending' | 'succeeded' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: OrderItem[];
  customer: CustomerInfo;
  shipping: ShippingInfo;
  videoMessage?: {
    url: string;
    qrCodeUrl: string;
    videoId?: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentIntentId?: string;
  paymentStatus?: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}
