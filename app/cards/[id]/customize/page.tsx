'use client';

import { use, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCardById } from '@/lib/data/mock-cards';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';
import { VideoRecorder } from '@/components/video/video-recorder';
import { PhotoCapture } from '@/components/video/photo-capture';

type EditorView = 'front' | 'inside';
type TextAlignment = 'left' | 'center' | 'right';
type MediaMode = 'video' | 'photo';

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

function getCard(id: string) {
  // Try mock data first, then check sessionStorage for AI-generated cards
  const mockCard = getCardById(id);
  if (mockCard) return mockCard;
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('inky-ai-card');
      if (stored) {
        const aiCard = JSON.parse(stored);
        if (aiCard.id === id) return aiCard;
      }
    } catch {}
  }
  return null;
}

export default function CustomizePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const card = getCard(id);
  const addItem = useCartStore((state) => state.addItem);

  // Start on inside view (auto-open)
  const [currentView, setCurrentView] = useState<EditorView>('inside');
  const [frontText, setFrontText] = useState(card?.templates.front?.placeholder || '');
  const [insideText, setInsideText] = useState('');
  const [fontFamily, setFontFamily] = useState('Cormorant Garamond');
  const [fontSize, setFontSize] = useState(25);
  const [textColor, setTextColor] = useState('#1a1a1a');
  const [textAlign, setTextAlign] = useState<TextAlignment>('center');
  const [quantity, setQuantity] = useState(1);

  // Font scale: smaller on mobile so text fits the smaller card preview
  const [fontScale, setFontScale] = useState(0.6);
  useEffect(() => {
    const updateScale = () => setFontScale(window.innerWidth < 640 ? 0.36 : 0.6);
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Video / Photo / QR
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [showCapture, setShowCapture] = useState(false);
  const [mediaMode, setMediaMode] = useState<MediaMode>('video');
  const [qrImageUrl, setQrImageUrl] = useState<string>('');

  // Generate actual QR code image when media is added
  useEffect(() => {
    if (!mediaUrl) {
      setQrImageUrl('');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        const dataUrl = await QRCode.toDataURL(mediaUrl, {
          width: 200,
          margin: 2,
          color: { dark: '#1a1a1a', light: '#FFFFFF' },
          errorCorrectionLevel: 'M',
        });
        if (!cancelled) setQrImageUrl(dataUrl);
      } catch (err) {
        console.error('Failed to generate QR code:', err);
      }
    })();
    return () => { cancelled = true; };
  }, [mediaUrl]);

  // Undo/Redo
  const [history, setHistory] = useState<HistoryEntry[]>([
    { frontText: card?.templates.front?.placeholder || '', insideText: '', fontFamily: 'Cormorant Garamond', fontSize: 28, textColor: '#1a1a1a', textAlign: 'center' },
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
      price: mediaUrl ? card.price + 2 : card.price,
    });
    router.push('/cart');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMediaBlob(file);
    setMediaUrl(url);
    setShowRecorder(false);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMediaBlob(file);
    setMediaUrl(url);
    setShowRecorder(false);
  };

  const currentTemplate = currentView === 'front' ? card.templates.front : card.templates.inside;
  const currentText = currentView === 'front' ? frontText : insideText;
  const setCurrentText = currentView === 'front' ? setFrontText : setInsideText;
  const isCustomizable = currentView === 'front' ? false : card.customizable.insideText;

  return (
    <div className="container-luxury py-8 animate-fade-in">
      <div className="mb-6">
        <Link href={card.id.startsWith('ai-') ? '/generate' : `/cards/${card.id}`} className="text-stone hover:text-ink text-sm transition-colors mb-2 inline-block">
          &larr; {card.id.startsWith('ai-') ? 'Back to designer' : 'Back to card'}
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 invisible">
            <div className="p-2 w-8 h-8" />
            <div className="p-2 w-8 h-8" />
          </div>
          <div className="text-center flex-1">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview — smaller to fit viewport */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-silk rounded-lg p-6 sticky top-20">
            {/* View Toggle */}
            <div className="flex gap-2 mb-4">
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

            {/* Card Preview — smaller aspect ratio to fit screen */}
            {currentView === 'front' ? (
              <div className="aspect-[4/5] max-h-[55vh] relative overflow-hidden rounded-lg bg-silk card-3d-face mx-auto">
                {card.images.front.startsWith('data:') ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={card.images.front} alt={card.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <Image src={card.images.front} alt={card.title} fill className="object-cover" />
                )}
              </div>
            ) : (
              <div className="aspect-[3/2] max-h-[55vh] relative overflow-hidden rounded-lg border border-silk card-3d-face mx-auto flex">
                {/* Left half — back of front cover */}
                <div className="w-1/2 h-full relative bg-white">
                  {qrImageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <img src={qrImageUrl} alt="QR Code" className="w-24 h-24 mx-auto mb-2" />
                        <p className="text-xs text-stone">Scan for greeting</p>
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
                  className="w-1/2 h-full bg-white flex items-center justify-center p-6 cursor-text overflow-hidden"
                  onClick={() => {
                    const el = document.getElementById('card-text-input');
                    if (el) el.focus();
                  }}
                >
                  {isCustomizable ? (
                    <textarea
                      id="card-text-input"
                      value={currentText}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const el = e.target as HTMLTextAreaElement;
                          // Test if adding a newline would overflow
                          const testVal = el.value.slice(0, el.selectionStart) + '\n' + el.value.slice(el.selectionEnd);
                          const origVal = el.value;
                          el.value = testVal;
                          if (el.scrollHeight > el.clientHeight) {
                            el.value = origVal;
                            e.preventDefault();
                          } else {
                            el.value = origVal;
                          }
                        }
                      }}
                      onChange={(e) => {
                        const el = e.target;
                        if (el.scrollHeight > el.clientHeight) {
                          el.value = currentText;
                          return;
                        }
                        setCurrentText(e.target.value);
                      }}
                      onBlur={pushHistory}
                      placeholder="Your Message"
                      maxLength={currentTemplate?.maxLength}
                      className="w-full h-full resize-none border-0 bg-transparent focus:outline-none placeholder:text-neutral-300 overflow-hidden"
                      style={{
                        fontFamily,
                        fontSize: `${Math.round(fontSize * fontScale)}px`,
                        color: textColor,
                        textAlign,
                        lineHeight: 1.5,
                        paddingTop: '1rem',
                      }}
                    />
                  ) : (
                    <p
                      className="w-full text-neutral-300 italic text-center"
                      style={{
                        fontFamily,
                        fontSize: `${Math.round(fontSize * fontScale)}px`,
                        lineHeight: 1.5,
                      }}
                    >
                      Your message here...
                    </p>
                  )}
                </div>
              </div>
            )}

            {!isCustomizable && currentView === 'inside' && (
              <div className="text-center p-3 bg-neutral-50 rounded text-sm text-stone mt-3">
                This side of the card is not customisable
              </div>
            )}
          </div>
        </div>

        {/* Controls — 1/3 */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-silk rounded-lg p-5 space-y-5">
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

            {/* Video / Photo / QR Section */}
            <div className="pt-5 border-t border-silk">
              <label className="block text-sm font-medium text-ink mb-2 uppercase tracking-wider">
                Add Video or Photo (+£2)
              </label>
              {!mediaUrl && !showRecorder && !showCapture && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setMediaMode('video'); setShowRecorder(true); }}
                    className="py-3 px-4 border border-dashed border-silk rounded text-sm text-stone hover:border-ink hover:text-ink transition-colors normal-case"
                  >
                    Record video
                  </button>
                  <button
                    onClick={() => setShowCapture(true)}
                    className="py-3 px-4 border border-dashed border-silk rounded text-sm text-stone hover:border-ink hover:text-ink transition-colors normal-case"
                  >
                    Take photo
                  </button>
                  <label className="py-3 px-4 border border-dashed border-silk rounded text-sm text-stone hover:border-ink hover:text-ink transition-colors cursor-pointer text-center normal-case">
                    Upload video
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoUpload}
                    />
                  </label>
                  <label className="py-3 px-4 border border-dashed border-silk rounded text-sm text-stone hover:border-ink hover:text-ink transition-colors cursor-pointer text-center normal-case">
                    Upload photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>
              )}
              {showRecorder && !mediaUrl && mediaMode === 'video' && (
                <VideoRecorder
                  maxDuration={60}
                  onVideoReady={(blob, previewUrl) => {
                    setMediaBlob(blob);
                    setMediaUrl(previewUrl);
                    setShowRecorder(false);
                  }}
                  onCancel={() => setShowRecorder(false)}
                />
              )}
              {showCapture && !mediaUrl && (
                <PhotoCapture
                  onPhotoReady={(blob, previewUrl) => {
                    setMediaBlob(blob);
                    setMediaUrl(previewUrl);
                    setShowCapture(false);
                  }}
                  onCancel={() => setShowCapture(false)}
                />
              )}
              {mediaUrl && (
                <div className="p-3 bg-neutral-50 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ink font-medium">
                      {mediaBlob?.type?.startsWith('image') ? 'Photo' : 'Video'} added
                    </span>
                    <button
                      onClick={() => {
                        if (mediaUrl) URL.revokeObjectURL(mediaUrl);
                        setMediaUrl('');
                        setMediaBlob(null);
                      }}
                      className="text-xs text-stone hover:text-ink transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  {mediaBlob?.type?.startsWith('image') && (
                    <img src={mediaUrl} alt="Uploaded photo" className="w-full h-24 object-cover rounded mt-2" />
                  )}
                  {qrImageUrl && (
                    <div className="mt-2 flex justify-center">
                      <img src={qrImageUrl} alt="QR Code" className="w-20 h-20" />
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
            <div className="pt-5 border-t border-silk">
              <div className="flex justify-between text-sm text-stone mb-1">
                <span>Card</span>
                <span>£{card.price.toFixed(2)}</span>
              </div>
              {mediaUrl && (
                <div className="flex justify-between text-sm text-stone mb-1">
                  <span>{mediaBlob?.type?.startsWith('image') ? 'Photo' : 'Video'} greeting</span>
                  <span>£2.00</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold mt-2">
                <span className="text-ink">Total</span>
                <span className="text-ink">£{((mediaUrl ? card.price + 2 : card.price) * quantity).toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-5 border-t border-silk">
              <Button size="lg" variant="primary" className="w-full" onClick={handleAddToCart}>
                Add to Basket
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFrontText(card.templates.front?.placeholder || '');
                  setInsideText('');
                  setFontFamily('Cormorant Garamond');
                  setFontSize(28);
                  setTextColor('#1a1a1a');
                  setTextAlign('center');
                  setHistory([{ frontText: card.templates.front?.placeholder || '', insideText: '', fontFamily: 'Cormorant Garamond', fontSize: 28, textColor: '#1a1a1a', textAlign: 'center' }]);
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
