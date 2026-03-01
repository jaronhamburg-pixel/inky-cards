'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Card as CardType } from '@/types/card';
import { formatPrice } from '@/lib/utils/formatting';

type Occasion = 'birthday' | 'wedding' | 'anniversary' | 'thank-you' | 'sympathy' | 'congratulations' | 'holiday' | 'other';
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

  const [occasion, setOccasion] = useState<Occasion>('birthday');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<Tone>('heartfelt');
  const [style, setStyle] = useState<Style>('elegant');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<GeneratedCard | null>(null);
  const [responseId, setResponseId] = useState('');
  const [refinementPrompt, setRefinementPrompt] = useState('');
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
      // Clear inside text — user should personalise it themselves
      setGeneratedCard({ ...data.card, insideText: '' });
      setResponseId(data.responseId || '');
      setRefinementPrompt('');
    } catch (err: any) {
      setError(err.message || 'Failed to generate card. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async () => {
    if (!refinementPrompt.trim() || !responseId) return;

    setIsRefining(true);
    setError('');
    try {
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ previousResponseId: responseId, refinementPrompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to refine card');

      setGeneratedCard((prev) => prev ? { ...prev, imageUrl: data.imageUrl } : prev);
      setResponseId(data.responseId || responseId);
      setRefinementPrompt('');
    } catch (err: any) {
      setError(err.message || 'Failed to refine card. Please try again.');
    } finally {
      setIsRefining(false);
    }
  };

  const handlePersonalise = () => {
    if (!generatedCard) return;
    const cardId = `ai-${Date.now()}`;
    const card: CardType = {
      id: cardId,
      title: `Custom ${occasion} Card`,
      description: `AI-generated card: ${prompt.slice(0, 100)}`,
      category: occasion === 'other' ? 'misc' : occasion === 'thank-you' ? 'for-you' : occasion === 'sympathy' ? 'thinking-of-you' : occasion === 'holiday' ? 'misc' : occasion as any,
      price: 4.99,
      images: { front: generatedCard.imageUrl, back: generatedCard.imageUrl, thumbnail: generatedCard.imageUrl },
      customizable: { frontText: true, backText: false, insideText: true },
      templates: {
        front: { placeholder: generatedCard.frontText, maxLength: 50, fontFamily: 'Cormorant Garamond', fontSize: 24, color: '#1a1a1a', position: { x: 400, y: 700 }, alignment: 'center' },
        inside: { placeholder: '', maxLength: 200, fontFamily: 'Cormorant Garamond', fontSize: 16, color: '#404040', position: { x: 100, y: 300 }, alignment: 'center' },
      },
    };

    // Store AI card in sessionStorage so the customize page can load it
    sessionStorage.setItem('inky-ai-card', JSON.stringify(card));
    router.push(`/cards/${cardId}/customize`);
  };

  const occasions: { value: Occasion; label: string }[] = [
    { value: 'birthday', label: 'Birthday' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'thank-you', label: 'Thank You' },
    { value: 'sympathy', label: 'Sympathy' },
    { value: 'congratulations', label: 'Congratulations' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="container-luxury py-12 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="heading-display text-ink mb-4">Inky AI Designer</h1>
          <p className="body-large text-stone max-w-xl mx-auto">
            Describe your vision and our AI will craft a unique, personalised card
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="bg-white border border-silk rounded-lg p-8">
            <h2 className="text-lg font-medium text-ink mb-6">Design Your Card</h2>

            {/* Occasion — centered in grid */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-ink mb-3 uppercase tracking-wider">Occasion</label>
              <div className="grid grid-cols-2 gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ.value}
                    onClick={() => setOccasion(occ.value)}
                    className={`p-3 rounded border text-center text-sm transition-all ${
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

            {/* Tone — centered */}
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
                    className={`p-3 rounded border text-center text-sm transition-all ${
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

            {/* Style — centered */}
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
                    className={`p-3 rounded border text-center text-sm transition-all ${
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

            <p className="text-xs text-stone mt-4 text-center">Powered by Gemini</p>
          </div>

          {/* Right: Preview */}
          <div className="bg-white border border-silk rounded-lg p-8 relative">
            <h2 className="text-lg font-medium text-ink mb-6">Preview</h2>

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

            {(isGenerating || (isRefining && !generatedCard)) && (
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
              isRefining && (
                <div className="absolute inset-0 z-10 bg-paper/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <div className="w-10 h-10 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-ink font-medium text-sm">Refining design...</p>
                  </div>
                </div>
              )
            )}
            {generatedCard && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Card preview */}
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden card-3d-face">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={generatedCard.imageUrl} alt="Generated card" className="absolute inset-0 w-full h-full object-cover" />
                </div>

                {/* Refine design */}
                {responseId && (
                  <div className="border border-silk rounded-lg p-4 space-y-3">
                    <label className="block text-sm font-medium text-ink uppercase tracking-wider">Tweak Design</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. Make the flowers larger, add more blue..."
                        value={refinementPrompt}
                        onChange={(e) => setRefinementPrompt(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleRefine(); }}
                      />
                      <Button
                        variant="outline"
                        onClick={handleRefine}
                        isLoading={isRefining}
                        disabled={!refinementPrompt.trim() || isRefining}
                        className="shrink-0"
                      >
                        Refine
                      </Button>
                    </div>
                    <p className="text-[11px] text-stone">Describe what to change — the AI will adjust your existing design</p>
                  </div>
                )}

                <div className="flex items-center justify-between py-4 border-t border-silk">
                  <span className="text-stone text-sm">Price</span>
                  <span className="text-xl font-semibold text-ink">{formatPrice(4.99)}</span>
                </div>

                <div className="space-y-3">
                  <Button size="lg" variant="primary" className="w-full" onClick={handlePersonalise}>
                    Personalise
                  </Button>
                  <Button size="lg" variant="outline" className="w-full" onClick={handleGenerate}>
                    Start Over
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
