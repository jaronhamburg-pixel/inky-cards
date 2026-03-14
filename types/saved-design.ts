import { Card, CardCustomization } from './card';

export interface SavedDesign {
  id: string;
  cardId: string;
  card: Card;
  name: string;
  customization: CardCustomization;
  createdAt: Date;
  updatedAt: Date;
}
