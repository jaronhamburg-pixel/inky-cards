'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { useCartStore } from '@/lib/store/cart-store';
import { Card as CardType } from '@/types/card';
import { formatPrice } from '@/lib/utils/formatting';

type Occasion = 'birthday' | 'wedding' | 'anniversary' | 'thank-you' | 'sympathy' | 'congratulations' | 'holiday' | 'just-because';
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasion, prompt, tone, style }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate card');
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
      images: { front: generatedCard.imageUrl, back: generatedCard.imageUrl, thumbnail: generatedCard.imageUrl },
      customizable: { frontText: true, backText: false, insideText: true },
      templates: {
        front: { placeholder: generatedCard.frontText, maxLength: 50, fontFamily: 'Cormorant Garamond', fontSize: 24, color: '#1a1a1a', position: { x: 400, y: 700 }, alignment: 'center' },
        inside: { placeholder: generatedCard.insideText, maxLength: 200, fontFamily: 'DM Sans', fontSize: 16, color: '#404040', position: { x: 100, y: 300 }, alignment: 'left' },
      },
    };

    addItem({
      cardId: card.id,
      card,
      customization: { frontText: generatedCard.frontText, insideText: generatedCard.insideText },
      quantity: 1,
      price: card.price,
    });
    router.push('/cart');
  };

  const occasions: { value: Occasion; label: string }[] = [
    { value: 'birthday', label: 'Birthday' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'thank-you', label: 'Thank You' },
    { value: 'sympathy', label: 'Sympathy' },
    { value: 'congratulations', label: 'Congratulations' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'just-because', label: 'Just Because' },
  ];

  return (
    <div className="container-luxury py-12 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="heading-display text-ink mb-4">Create with AI</h1>
          <p className="body-large text-stone max-w-xl mx-auto">
            Describe your vision and our AI will craft a unique, personalised card
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="bg-white border border-silk rounded-lg p-8">
            <h2 className="font-serif text-lg font-medium text-ink mb-6">Design Your Card</h2>

            {/* Occasion */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-ink mb-3 uppercase tracking-wider">Occasion</label>
              <div className="grid grid-cols-2 gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ.value}
                    onClick={() => setOccasion(occ.value)}
                    className={`p-3 rounded border text-left text-sm transition-all ${
                      occasion === occ.value
                        ? 'border-ink bg-ink/5 font-medium'
                        : 'border-silk text-stone hover:border-ink'
                    }`}
                  >
                    {occ.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div className="mb-6">
              <Textarea
                label="Describe Your Card"
                placeholder="A birthday card for my best friend who loves hiking and dogs. Make it fun and personal."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                className="min-h-[120px]"
              />
              <p className="text-xs text-stone mt-1">{prompt.length}/500 characters</p>
            </div>

            {/* Tone */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-ink mb-3 uppercase tracking-wider">Tone</label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: 'heartfelt', label: 'Heartfelt' },
                  { value: 'formal', label: 'Formal' },
                  { value: 'casual', label: 'Casual' },
                  { value: 'humorous', label: 'Humorous' },
                ] as const).map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTone(t.value)}
                    className={`p-3 rounded border text-sm transition-all ${
                      tone === t.value
                        ? 'border-ink bg-ink/5 font-medium'
                        : 'border-silk text-stone hover:border-ink'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-ink mb-3 uppercase tracking-wider">Visual Style</label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: 'elegant', label: 'Elegant' },
                  { value: 'minimalist', label: 'Minimalist' },
                  { value: 'artistic', label: 'Artistic' },
                  { value: 'modern', label: 'Modern' },
                ] as const).map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`p-3 rounded border text-sm transition-all ${
                      style === s.value
                        ? 'border-ink bg-ink/5 font-medium'
                        : 'border-silk text-stone hover:border-ink'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              size="lg"
              variant="primary"
              className="w-full"
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={!prompt.trim() || isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Card'}
            </Button>

            <p className="text-xs text-stone mt-4 text-center">Powered by Google Gemini AI</p>
          </div>

          {/* Right: Preview */}
          <div className="bg-white border border-silk rounded-lg p-8">
            <h2 className="font-serif text-lg font-medium text-ink mb-6">Preview</h2>

            {!generatedCard && !isGenerating && (
              <div className="flex items-center justify-center h-[500px] border border-dashed border-silk rounded-lg">
                <div className="text-center text-stone">
                  <svg className="w-12 h-12 mx-auto mb-4 text-silk" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-sm">Your generated card will appear here</p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="flex items-center justify-center h-[500px]">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-12 h-12 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-ink font-medium text-sm">Creating your card...</p>
                  <p className="text-xs text-stone mt-1">This may take a moment</p>
                </motion.div>
              </div>
            )}

            {generatedCard && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-md">
                  <Image src={generatedCard.imageUrl} alt="Generated card" fill className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <p className="text-white text-xl font-serif px-6 text-center">{generatedCard.frontText}</p>
                  </div>
                </div>

                <div className="bg-paper border border-silk rounded-lg p-5">
                  <h3 className="text-sm font-medium text-ink mb-2 uppercase tracking-wider">Inside Message</h3>
                  <p className="text-stone text-sm italic">{generatedCard.insideText}</p>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-silk">
                  <span className="text-stone text-sm">Price</span>
                  <span className="text-xl font-serif font-semibold text-ink">{formatPrice(14.99)}</span>
                </div>

                <div className="space-y-3">
                  <Button size="lg" variant="primary" className="w-full" onClick={handleAddToCart}>
                    Add to Basket
                  </Button>
                  <Button size="lg" variant="outline" className="w-full" onClick={handleGenerate}>
                    Generate Another
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
