import { Card, CardCustomization } from './card';

export type EditorView = 'front' | 'back' | 'inside';

export interface EditorState {
  card: Card;
  currentView: EditorView;
  customization: CardCustomization;
  history: CardCustomization[];
  historyIndex: number;
}

export interface FontOption {
  name: string;
  value: string;
  preview: string;
}
