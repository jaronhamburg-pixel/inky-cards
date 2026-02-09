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
}

export type OrderStatus = 'pending' | 'processing' | 'printing' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  customer: CustomerInfo;
  shipping: ShippingInfo;
  videoMessage?: {
    url: string;
    qrCodeUrl: string;
  };
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
