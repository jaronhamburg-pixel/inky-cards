export interface Review {
  id: string;
  userId: string;
  userName: string;
  orderId: string;
  orderNumber: string;
  rating: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteRating {
  average: number;
  count: number;
}
