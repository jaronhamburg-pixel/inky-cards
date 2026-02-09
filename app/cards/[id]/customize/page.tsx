'use client';

import { use, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCardById } from '@/lib/data/mock-cards';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';

type EditorView = 'front' | 'inside';
type TextAlignment = 'left' | 'center' | 'right';

const fontOptions = [
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Inter', value: 'Inter' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Courier New', value: 'Courier New' },
];

const colorPresets = [
  '#2C2C2C', '#FFFFFF', '#D4AF37', '#8B0000', '#1B4332',
  '#1E3A5F', '#4A0E4E', '#B8860B', '#2F4F4F', '#800020',
];

interface HistoryEntry {
  frontText: string;
  insideText: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  textAlign: TextAlignment;
}

export default function CustomizePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const card = getCardById(id);
  const addItem = useCartStore((state) => state.addItem);

  const [currentView, setCurrentView] = useState<EditorView>('front');
  const [frontText, setFrontText] = useState(card?.templates.front?.placeholder || '');
  const [insideText, setInsideText] = useState(card?.templates.inside?.placeholder || '');
  const [fontFamily, setFontFamily] = useState('Playfair Display');
  const [fontSize, setFontSize] = useState(28);
  const [textColor, setTextColor] = useState('#2C2C2C');
  const [textAlign, setTextAlign] = useState<TextAlignment>('center');
  const [quantity, setQuantity] = useState(1);

  // Undo/Redo
  const [history, setHistory] = useState<HistoryEntry[]>([
    { frontText: card?.templates.front?.placeholder || '', insideText: card?.templates.inside?.placeholder || '', fontFamily: 'Playfair Display', fontSize: 28, textColor: '#2C2C2C', textAlign: 'center' },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = useCallback(() => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ frontText, insideText, fontFamily, fontSize, textColor, textAlign });
      return newHistory;
    });
    setHistoryIndex((prev) => prev + 1);
  }, [frontText, insideText, fontFamily, fontSize, textColor, textAlign, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const entry = history[historyIndex - 1];
      setFrontText(entry.frontText);
      setInsideText(entry.insideText);
      setFontFamily(entry.fontFamily);
      setFontSize(entry.fontSize);
      setTextColor(entry.textColor);
      setTextAlign(entry.textAlign);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const entry = history[historyIndex + 1];
      setFrontText(entry.frontText);
      setInsideText(entry.insideText);
      setFontFamily(entry.fontFamily);
      setFontSize(entry.fontSize);
      setTextColor(entry.textColor);
      setTextAlign(entry.textAlign);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  if (!card) {
    return (
      <div className="container-luxury py-20 text-center">
        <h1 className="heading-display text-luxury-charcoal mb-4">Card Not Found</h1>
        <Link href="/cards">
          <Button>Browse All Cards</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      cardId: card.id,
      card,
      customization: {
        frontText: card.customizable.frontText ? frontText : undefined,
        insideText: card.customizable.insideText ? insideText : undefined,
        fontFamily,
        fontSize,
        textColor,
      },
      quantity,
      price: card.price,
    });
    router.push('/cart');
  };

  const currentTemplate = currentView === 'front' ? card.templates.front : card.templates.inside;
  const currentText = currentView === 'front' ? frontText : insideText;
  const setCurrentText = currentView === 'front' ? setFrontText : setInsideText;
  const isCustomizable =
    currentView === 'front' ? false : card.customizable.insideText;

  return (
    <div className="container-luxury py-12 animate-fade-in">
      <div className="mb-8">
        <Link href={`/cards/${card.id}`} className="text-luxury-gold hover:underline text-sm mb-2 inline-block">
          &larr; Back to card
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-display text-luxury-charcoal mb-2">Customize Your Card</h1>
            <p className="text-neutral-600">{card.title}</p>
          </div>
          {/* Undo/Redo Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 rounded-lg border border-neutral-200 hover:border-luxury-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Undo"
            >
              <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4m-4 4l4 4" />
              </svg>
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded-lg border border-neutral-200 hover:border-luxury-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Redo"
            >
              <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v2m15-7l-4-4m4 4l-4 4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview - 60% */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-neutral-200 rounded-lg p-8 sticky top-24">
            {/* View Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setCurrentView('front')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  currentView === 'front'
                    ? 'bg-luxury-gold text-luxury-charcoal'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setCurrentView('inside')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  currentView === 'inside'
                    ? 'bg-luxury-gold text-luxury-charcoal'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Inside
              </button>
            </div>

            {/* Card Preview */}
            {currentView === 'front' ? (
              <div className="aspect-[4/5] relative overflow-hidden rounded-lg bg-neutral-100 mb-4">
                <Image
                  src={card.images.front}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
                {/* Text Overlay */}
                {isCustomizable && currentText && (
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <p
                      className="w-full whitespace-pre-wrap"
                      style={{
                        fontFamily: fontFamily,
                        fontSize: `${fontSize}px`,
                        color: textColor,
                        textAlign: textAlign,
                        textShadow: textColor === '#FFFFFF' ? '0 1px 4px rgba(0,0,0,0.5)' : 'none',
                        lineHeight: 1.4,
                      }}
                    >
                      {currentText}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[3/2] relative overflow-hidden rounded-lg border border-neutral-200 mb-4 flex">
                {/* Left half - back of front cover */}
                <div className="card-inside-left w-1/2 h-full" />
                {/* Center fold */}
                <div className="flex h-full">
                  <div className="card-fold-shadow-left h-full" />
                  <div className="card-fold-line h-full" />
                  <div className="card-fold-shadow-right h-full" />
                </div>
                {/* Right half - message area */}
                <div className="w-1/2 h-full bg-white flex items-center justify-center p-6">
                  {isCustomizable && currentText ? (
                    <p
                      className="w-full whitespace-pre-wrap"
                      style={{
                        fontFamily: fontFamily,
                        fontSize: `${Math.round(fontSize * 0.7)}px`,
                        color: textColor,
                        textAlign: textAlign,
                        lineHeight: 1.4,
                      }}
                    >
                      {currentText}
                    </p>
                  ) : (
                    <p
                      className="w-full text-neutral-300 italic"
                      style={{
                        fontFamily: fontFamily,
                        fontSize: `${Math.round(fontSize * 0.7)}px`,
                        textAlign: textAlign,
                        lineHeight: 1.4,
                      }}
                    >
                      Your message here...
                    </p>
                  )}
                </div>
              </div>
            )}

            {!isCustomizable && (
              <div className="text-center p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600">
                  This side of the card is not customizable
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls - 40% */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
            {/* Text Input */}
            <div>
              <h2 className="font-semibold text-lg text-luxury-charcoal mb-4">
                Customize Text
              </h2>

              {isCustomizable ? (
                <>
                  <Textarea
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    onBlur={pushHistory}
                    placeholder={currentTemplate?.placeholder}
                    maxLength={currentTemplate?.maxLength}
                    className="mb-2"
                  />
                  <p className="text-xs text-neutral-500">
                    {currentText.length}/{currentTemplate?.maxLength} characters
                  </p>
                </>
              ) : (
                <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                  Switch to {currentView === 'front' ? 'inside' : 'front'} view to customize text
                </p>
              )}
            </div>

            {/* Font Selector */}
            <div>
              <label className="block font-medium text-neutral-700 mb-2 text-sm">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  pushHistory();
                }}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold text-sm"
              >
                {fontOptions.map((font) => (
                  <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="block font-medium text-neutral-700 mb-2 text-sm">
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="14"
                max="64"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                onMouseUp={pushHistory}
                onTouchEnd={pushHistory}
                className="w-full accent-luxury-gold"
              />
              <div className="flex justify-between text-xs text-neutral-400 mt-1">
                <span>14px</span>
                <span>64px</span>
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block font-medium text-neutral-700 mb-2 text-sm">Text Color</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setTextColor(color);
                      pushHistory();
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      textColor === color ? 'border-luxury-gold scale-110' : 'border-neutral-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  onBlur={pushHistory}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <span className="text-xs text-neutral-500 font-mono">{textColor}</span>
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <label className="block font-medium text-neutral-700 mb-2 text-sm">Alignment</label>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as TextAlignment[]).map((align) => (
                  <button
                    key={align}
                    onClick={() => {
                      setTextAlign(align);
                      pushHistory();
                    }}
                    className={`flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-all ${
                      textAlign === align
                        ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-charcoal'
                        : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'
                    }`}
                  >
                    {align === 'left' && (
                      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeWidth={2} d="M3 6h18M3 12h12M3 18h16" />
                      </svg>
                    )}
                    {align === 'center' && (
                      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeWidth={2} d="M3 6h18M6 12h12M4 18h16" />
                      </svg>
                    )}
                    {align === 'right' && (
                      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeWidth={2} d="M3 6h18M9 12h12M5 18h16" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-medium text-neutral-700 mb-2 text-sm">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-neutral-300 rounded-md hover:border-luxury-gold transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-neutral-300 rounded-md hover:border-luxury-gold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="pt-6 border-t border-neutral-200">
              <div className="flex justify-between text-neutral-600 mb-2">
                <span>Price per card</span>
                <span>${card.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-luxury-charcoal">Total</span>
                <span className="text-luxury-gold">${(card.price * quantity).toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-6 border-t border-neutral-200">
              <Button size="lg" variant="secondary" className="w-full" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFrontText(card.templates.front?.placeholder || '');
                  setInsideText(card.templates.inside?.placeholder || '');
                  setFontFamily('Playfair Display');
                  setFontSize(28);
                  setTextColor('#2C2C2C');
                  setTextAlign('center');
                  setHistory([{ frontText: card.templates.front?.placeholder || '', insideText: card.templates.inside?.placeholder || '', fontFamily: 'Playfair Display', fontSize: 28, textColor: '#2C2C2C', textAlign: 'center' }]);
                  setHistoryIndex(0);
                }}
              >
                Reset
              </Button>
            </div>

            {/* Tips */}
            <div className="bg-luxury-cream rounded-lg p-4">
              <h3 className="font-semibold text-luxury-charcoal text-sm mb-2">
                Customization Tips:
              </h3>
              <ul className="text-xs text-neutral-700 space-y-1">
                <li>&#8226; Keep front text short and impactful</li>
                <li>&#8226; Make inside message personal</li>
                <li>&#8226; Use the color picker for creative touches</li>
                <li>&#8226; Preview both sides before adding to cart</li>
                <li>&#8226; You can add a video greeting at checkout</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
