export type CardCategory =
  | 'anniversary'
  | 'birthday'
  | 'congratulations'
  | 'for-you'
  | 'get-well-soon'
  | 'good-luck'
  | 'misc'
  | 'new-baby'
  | 'new-home'
  | 'new-job'
  | 'thinking-of-you'
  | 'wedding';

export interface TextTemplate {
  placeholder: string;
  maxLength: number;
  fontFamily: string;
  fontSize: number;
  color: string;
  position: { x: number; y: number };
  alignment: 'left' | 'center' | 'right';
}

export interface Card {
  id: string;
  title: string;
  description: string;
  category: CardCategory;
  price: number;
  images: {
    front: string;
    back: string;
    thumbnail: string;
  };
  customizable: {
    frontText: boolean;
    backText: boolean;
    insideText: boolean;
  };
  templates: {
    front?: TextTemplate;
    back?: TextTemplate;
    inside?: TextTemplate;
  };
}

export interface CardCustomization {
  frontText?: string;
  backText?: string;
  insideText?: string;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
}
