import { create } from 'zustand';
import { Card, CardCustomization } from '@/types/card';
import { EditorView } from '@/types/editor';

interface EditorStore {
  card: Card | null;
  currentView: EditorView;
  customization: CardCustomization;
  history: CardCustomization[];
  historyIndex: number;

  // Actions
  setCard: (card: Card) => void;
  updateText: (field: keyof CardCustomization, value: string) => void;
  changeView: (view: EditorView) => void;
  updateFont: (fontFamily: string) => void;
  updateFontSize: (fontSize: number) => void;
  updateColor: (color: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  getCustomization: () => CardCustomization;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  card: null,
  currentView: 'front',
  customization: {},
  history: [{}],
  historyIndex: 0,

  setCard: (card) => {
    set({
      card,
      currentView: 'front',
      customization: {},
      history: [{}],
      historyIndex: 0,
    });
  },

  updateText: (field, value) => {
    const newCustomization = {
      ...get().customization,
      [field]: value,
    };
    const newHistory = get().history.slice(0, get().historyIndex + 1);
    newHistory.push(newCustomization);
    set({
      customization: newCustomization,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  changeView: (view) => {
    set({ currentView: view });
  },

  updateFont: (fontFamily) => {
    const newCustomization = {
      ...get().customization,
      fontFamily,
    };
    const newHistory = get().history.slice(0, get().historyIndex + 1);
    newHistory.push(newCustomization);
    set({
      customization: newCustomization,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  updateFontSize: (fontSize) => {
    const newCustomization = {
      ...get().customization,
      fontSize,
    };
    const newHistory = get().history.slice(0, get().historyIndex + 1);
    newHistory.push(newCustomization);
    set({
      customization: newCustomization,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  updateColor: (color) => {
    const newCustomization = {
      ...get().customization,
      textColor: color,
    };
    const newHistory = get().history.slice(0, get().historyIndex + 1);
    newHistory.push(newCustomization);
    set({
      customization: newCustomization,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        customization: history[newIndex],
        historyIndex: newIndex,
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        customization: history[newIndex],
        historyIndex: newIndex,
      });
    }
  },

  reset: () => {
    set({
      customization: {},
      history: [{}],
      historyIndex: 0,
    });
  },

  getCustomization: () => {
    return get().customization;
  },
}));
