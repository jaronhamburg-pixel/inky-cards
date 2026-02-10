'use client';

import { use, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCardById } from '@/lib/data/mock-cards';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';
import { VideoRecorder } from '@/components/video/video-recorder';
import { QRDisplay } from '@/components/video/qr-display';

type EditorView = 'front' | 'inside';
type TextAlignment = 'left' | 'center' | 'right';

const fontOptions = [
  { name: 'Cormorant Garamond', value: 'Cormorant Garamond' },
  { name: 'DM Sans', value: 'DM Sans' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Courier New', value: 'Courier New' },
];

const colorPresets = [
  '#1a1a1a', '#FFFFFF', '#6b6b6b', '#8B0000', '#1B4332',
  '#1E3A5F', '#4A0E4E', '#2F4F4F', '#800020', '#3d3d3d',
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
  const [fontFamily, setFontFamily] = useState('Cormorant Garamond');
  const [fontSize, setFontSize] = useState(28);
  const [textColor, setTextColor] = useState('#1a1a1a');
  const [textAlign, setTextAlign] = useState<TextAlignment>('center');
  const [quantity, setQuantity] = useState(1);

  // Video / QR
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Undo/Redo
  const [history, setHistory] = useState<HistoryEntry[]>([
    { frontText: card?.templates.front?.placeholder || '', insideText: card?.templates.inside?.placeholder || '', fontFamily: 'Cormorant Garamond', fontSize: 28, textColor: '#1a1a1a', textAlign: 'center' },
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
        <h1 className="heading-display text-ink mb-4">Card Not Found</h1>
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
      price: videoUrl ? card.price + 2 : card.price,
    });
    router.push('/cart');
  };

  const currentTemplate = currentView === 'front' ? card.templates.front : card.templates.inside;
  const currentText = currentView === 'front' ? frontText : insideText;
  const setCurrentText = currentView === 'front' ? setFrontText : setInsideText;
  const isCustomizable = currentView === 'front' ? false : card.customizable.insideText;

  return (
    <div className="container-luxury py-12 animate-fade-in">
      <div className="mb-8">
        <Link href={`/cards/${card.id}`} className="text-stone hover:text-ink text-sm transition-colors mb-2 inline-block">
          &larr; Back to card
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-display text-ink mb-1">Personalise</h1>
            <p className="text-stone text-sm">{card.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 rounded border border-silk hover:border-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Undo"
            >
              <svg className="w-4 h-4 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a5 5 0 015 5v2M3 10l4-4m-4 4l4 4" />
              </svg>
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded border border-silk hover:border-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Redo"
            >
              <svg className="w-4 h-4 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 10H11a5 5 0 00-5 5v2m15-7l-4-4m4 4l-4 4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview — 2/3 */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-silk rounded-lg p-8 sticky top-24">
            {/* View Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setCurrentView('front')}
                className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-all ${
                  currentView === 'front'
                    ? 'bg-ink text-white'
                    : 'bg-neutral-100 text-stone hover:bg-neutral-200'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setCurrentView('inside')}
                className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-all ${
                  currentView === 'inside'
                    ? 'bg-ink text-white'
                    : 'bg-neutral-100 text-stone hover:bg-neutral-200'
                }`}
              >
                Inside
              </button>
            </div>

            {/* Card Preview */}
            {currentView === 'front' ? (
              <div className="aspect-[4/5] relative overflow-hidden rounded-lg bg-silk shadow-md mb-4">
                <Image
                  src={card.images.front}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
                {isCustomizable && currentText && (
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <p
                      className="w-full whitespace-pre-wrap"
                      style={{
                        fontFamily,
                        fontSize: `${fontSize}px`,
                        color: textColor,
                        textAlign,
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
              <div className="aspect-[3/2] relative overflow-hidden rounded-lg border border-silk shadow-md mb-4 flex">
                {/* Left half — back of front cover */}
                <div className="card-inside-left w-1/2 h-full relative">
                  {/* QR code on left side */}
                  {qrDataUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <img src={qrDataUrl} alt="QR Code" className="w-24 h-24 mx-auto mb-2" />
                        <p className="text-xs text-stone">Scan for video</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Center fold */}
                <div className="flex h-full">
                  <div className="card-fold-shadow-left h-full" />
                  <div className="card-fold-line h-full" />
                  <div className="card-fold-shadow-right h-full" />
                </div>
                {/* Right half — editable message area */}
                <div
                  className="w-1/2 h-full bg-white flex items-center justify-center p-6 cursor-text"
                  onClick={() => {
                    const el = document.getElementById('card-text-input');
                    if (el) el.focus();
                  }}
                >
                  {isCustomizable ? (
                    <textarea
                      id="card-text-input"
                      value={currentText}
                      onChange={(e) => setCurrentText(e.target.value)}
                      onBlur={pushHistory}
                      placeholder="Type your message here..."
                      maxLength={currentTemplate?.maxLength}
                      className="w-full h-full resize-none border-0 bg-transparent focus:outline-none placeholder:text-neutral-300"
                      style={{
                        fontFamily,
                        fontSize: `${Math.round(fontSize * 0.6)}px`,
                        color: textColor,
                        textAlign,
                        lineHeight: 1.5,
                      }}
                    />
                  ) : (
                    <p
                      className="w-full text-neutral-300 italic"
                      style={{
                        fontFamily,
                        fontSize: `${Math.round(fontSize * 0.6)}px`,
                        textAlign,
                        lineHeight: 1.5,
                      }}
                    >
                      Your message here...
                    </p>
                  )}
                </div>
              </div>
            )}

            {!isCustomizable && (
              <div className="text-center p-3 bg-neutral-50 rounded text-sm text-stone">
                This side of the card is not customisable
              </div>
            )}
          </div>
        </div>

        {/* Controls — 1/3 */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-silk rounded-lg p-6 space-y-6">
            {/* Font Selector */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2 uppercase tracking-wider">Font</label>
              <select
                value={fontFamily}
                onChange={(e) => { setFontFamily(e.target.value); pushHistory(); }}
                className="w-full px-4 py-2 border border-silk rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ink"
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
              <label className="block text-sm font-medium text-ink mb-2 uppercase tracking-wider">
                Size: {fontSize}px
              </label>
              <input
                type="range"
                min="14"
                max="64"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                onMouseUp={pushHistory}
                onTouchEnd={pushHistory}
                className="w-full accent-ink"
              />
              <div className="flex justify-between text-xs text-stone mt-1">
                <span>14px</span>
                <span>64px</span>
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2 uppercase tracking-wider">Colour</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    onClick={() => { setTextColor(color); pushHistory(); }}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      textColor === color ? 'border-ink scale-110' : 'border-silk'
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
                  className="w-7 h-7 rounded cursor-pointer"
                />
                <span className="text-xs text-stone font-mono">{textColor}</span>
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2 uppercase tracking-wider">Alignment</label>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as TextAlignment[]).map((align) => (
                  <button
                    key={align}
                    onClick={() => { setTextAlign(align); pushHistory(); }}
                    className={`flex-1 py-2 px-3 rounded border text-sm transition-all ${
                      textAlign === align
                        ? 'border-ink bg-ink/5 text-ink'
                        : 'border-silk text-stone hover:border-ink'
                    }`}
                  >
                    {align === 'left' && (
                      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeWidth={1.5} d="M3 6h18M3 12h12M3 18h16" />
                      </svg>
                    )}
                    {align === 'center' && (
                      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeWidth={1.5} d="M3 6h18M6 12h12M4 18h16" />
                      </svg>
                    )}
                    {align === 'right' && (
                      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeWidth={1.5} d="M3 6h18M9 12h12M5 18h16" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Video / QR Section */}
            <div className="pt-6 border-t border-silk">
              <label className="block text-sm font-medium text-ink mb-2 uppercase tracking-wider">
                Add Video Message (+$2)
              </label>
              {!videoUrl && !showRecorder && (
                <button
                  onClick={() => setShowRecorder(true)}
                  className="w-full py-3 px-4 border border-dashed border-silk rounded text-sm text-stone hover:border-ink hover:text-ink transition-colors"
                >
                  Record or upload a video
                </button>
              )}
              {showRecorder && !videoUrl && (
                <VideoRecorder
                  maxDuration={60}
                  onVideoReady={(blob, previewUrl) => {
                    setVideoBlob(blob);
                    setVideoUrl(previewUrl);
                    setShowRecorder(false);
                    setQrDataUrl(previewUrl);
                  }}
                  onCancel={() => setShowRecorder(false)}
                />
              )}
              {videoUrl && (
                <div className="p-3 bg-neutral-50 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ink font-medium">Video added</span>
                    <button
                      onClick={() => {
                        if (videoUrl) URL.revokeObjectURL(videoUrl);
                        setVideoUrl('');
                        setVideoBlob(null);
                        setQrDataUrl('');
                      }}
                      className="text-xs text-stone hover:text-ink transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  {qrDataUrl && (
                    <div className="mt-2">
                      <QRDisplay url={qrDataUrl} size={80} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2 uppercase tracking-wider">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-silk rounded hover:border-ink transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center px-3 py-2 border border-silk rounded focus:outline-none focus:ring-2 focus:ring-ink"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-silk rounded hover:border-ink transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="pt-6 border-t border-silk">
              <div className="flex justify-between text-sm text-stone mb-1">
                <span>Card</span>
                <span>${card.price.toFixed(2)}</span>
              </div>
              {videoUrl && (
                <div className="flex justify-between text-sm text-stone mb-1">
                  <span>Video greeting</span>
                  <span>$2.00</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-serif font-semibold mt-2">
                <span className="text-ink">Total</span>
                <span className="text-ink">${((videoUrl ? card.price + 2 : card.price) * quantity).toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-6 border-t border-silk">
              <Button size="lg" variant="primary" className="w-full" onClick={handleAddToCart}>
                Add to Basket
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFrontText(card.templates.front?.placeholder || '');
                  setInsideText(card.templates.inside?.placeholder || '');
                  setFontFamily('Cormorant Garamond');
                  setFontSize(28);
                  setTextColor('#1a1a1a');
                  setTextAlign('center');
                  setHistory([{ frontText: card.templates.front?.placeholder || '', insideText: card.templates.inside?.placeholder || '', fontFamily: 'Cormorant Garamond', fontSize: 28, textColor: '#1a1a1a', textAlign: 'center' }]);
                  setHistoryIndex(0);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
