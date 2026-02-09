'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { useCartStore } from '@/lib/store/cart-store';
import { Card as CardType } from '@/types/card';
import { formatPrice } from '@/lib/utils/formatting';

type Occasion =
  | 'birthday'
  | 'wedding'
  | 'anniversary'
  | 'thank-you'
  | 'sympathy'
  | 'congratulations'
  | 'holiday'
  | 'just-because';

type Tone = 'formal' | 'casual' | 'heartfelt' | 'humorous';
type Style = 'elegant' | 'minimalist' | 'artistic' | 'modern';

interface GeneratedCard {
  frontText: string;
  insideText: string;
  imageUrl: string;
  occasion: string;
  style: string;
}

export default function GeneratePage() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [occasion, setOccasion] = useState<Occasion>('birthday');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<Tone>('heartfelt');
  const [style, setStyle] = useState<Style>('elegant');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<GeneratedCard | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your card');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          occasion,
          prompt,
          tone,
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate card');
      }

      setGeneratedCard(data.card);
    } catch (err: any) {
      setError(err.message || 'Failed to generate card. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = () => {
    if (!generatedCard) return;

    const card: CardType = {
      id: `ai-${Date.now()}`,
      title: `Custom ${occasion} Card`,
      description: `AI-generated card: ${prompt.slice(0, 100)}`,
      category: style === 'minimalist' ? 'minimalist' : 'artistic',
      occasions: [occasion],
      price: 14.99,
      images: {
        front: generatedCard.imageUrl,
        back: generatedCard.imageUrl,
        thumbnail: generatedCard.imageUrl,
      },
      customizable: {
        frontText: true,
        backText: false,
        insideText: true,
      },
      templates: {
        front: {
          placeholder: generatedCard.frontText,
          maxLength: 50,
          fontFamily: 'Playfair Display',
          fontSize: 24,
          color: '#2C2C2C',
          position: { x: 400, y: 700 },
          alignment: 'center',
        },
        inside: {
          placeholder: generatedCard.insideText,
          maxLength: 200,
          fontFamily: 'Inter',
          fontSize: 16,
          color: '#404040',
          position: { x: 100, y: 300 },
          alignment: 'left',
        },
      },
    };

    addItem({
      cardId: card.id,
      card,
      customization: {
        frontText: generatedCard.frontText,
        insideText: generatedCard.insideText,
      },
      quantity: 1,
      price: card.price,
    });

    router.push('/cart');
  };

  const occasions: { value: Occasion; label: string; icon: string }[] = [
    { value: 'birthday', label: 'Birthday', icon: '🎂' },
    { value: 'wedding', label: 'Wedding', icon: '💒' },
    { value: 'anniversary', label: 'Anniversary', icon: '💕' },
    { value: 'thank-you', label: 'Thank You', icon: '🙏' },
    { value: 'sympathy', label: 'Sympathy', icon: '🕊️' },
    { value: 'congratulations', label: 'Congratulations', icon: '🎉' },
    { value: 'holiday', label: 'Holiday', icon: '🎄' },
    { value: 'just-because', label: 'Just Because', icon: '💝' },
  ];

  return (
    <div className="container-luxury py-12 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-display text-luxury-charcoal mb-4">AI Card Generator</h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Describe your vision, and our AI will create a unique, personalized card just for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input Form */}
          <div className="bg-white border border-neutral-200 rounded-lg p-8">
            <h2 className="font-semibold text-lg text-luxury-charcoal mb-6">
              Create Your Card
            </h2>

            {/* Occasion Selector */}
            <div className="mb-6">
              <label className="block font-medium text-neutral-700 mb-3">
                Select Occasion<span className="text-red-600 ml-1">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {occasions.map((occ) => (
                  <button
                    key={occ.value}
                    onClick={() => setOccasion(occ.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      occasion === occ.value
                        ? 'border-luxury-gold bg-luxury-cream'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{occ.icon}</span>
                    <span className="text-sm font-medium">{occ.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="mb-6">
              <Textarea
                label="Describe Your Card"
                placeholder="e.g., A birthday card for my best friend who loves hiking and dogs. Make it fun and personal!"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                className="min-h-[120px]"
              />
              <p className="text-xs text-neutral-500 mt-1">
                {prompt.length}/500 characters
              </p>
            </div>

            {/* Tone Selector */}
            <div className="mb-6">
              <label className="block font-medium text-neutral-700 mb-3">Tone</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'heartfelt', label: 'Heartfelt' },
                  { value: 'formal', label: 'Formal' },
                  { value: 'casual', label: 'Casual' },
                  { value: 'humorous', label: 'Humorous' },
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTone(t.value as Tone)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      tone === t.value
                        ? 'border-luxury-gold bg-luxury-cream'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selector */}
            <div className="mb-6">
              <label className="block font-medium text-neutral-700 mb-3">Visual Style</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'elegant', label: 'Elegant' },
                  { value: 'minimalist', label: 'Minimalist' },
                  { value: 'artistic', label: 'Artistic' },
                  { value: 'modern', label: 'Modern' },
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value as Style)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      style === s.value
                        ? 'border-luxury-gold bg-luxury-cream'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={!prompt.trim() || isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Card'}
            </Button>

            <p className="text-xs text-neutral-500 mt-4 text-center">
              Powered by Google Gemini AI
            </p>
          </div>

          {/* Right: Preview */}
          <div className="bg-white border border-neutral-200 rounded-lg p-8">
            <h2 className="font-semibold text-lg text-luxury-charcoal mb-6">Preview</h2>

            {!generatedCard && !isGenerating && (
              <div className="flex items-center justify-center h-[500px] border-2 border-dashed border-neutral-300 rounded-lg">
                <div className="text-center text-neutral-400">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <p className="text-sm">Your generated card will appear here</p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="flex items-center justify-center h-[500px]">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-luxury-charcoal font-medium">Creating your card...</p>
                  <p className="text-sm text-neutral-500 mt-2">This may take a few moments</p>
                </div>
              </div>
            )}

            {generatedCard && !isGenerating && (
              <div className="space-y-6">
                {/* Card Image */}
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                  <Image
                    src={generatedCard.imageUrl}
                    alt="Generated card"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <p className="text-white text-2xl font-serif px-6 text-center">
                      {generatedCard.frontText}
                    </p>
                  </div>
                </div>

                {/* Card Text */}
                <div className="bg-luxury-cream rounded-lg p-6">
                  <h3 className="font-semibold text-luxury-charcoal mb-2">Inside Message:</h3>
                  <p className="text-neutral-700 italic">{generatedCard.insideText}</p>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between py-4 border-t border-neutral-200">
                  <span className="text-neutral-600">Price:</span>
                  <span className="text-2xl font-bold text-luxury-gold">
                    {formatPrice(14.99)}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={handleGenerate}
                  >
                    Generate Another
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
