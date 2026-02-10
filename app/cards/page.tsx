'use client';

import { useState, useMemo } from 'react';
import { CardCategory, CardOccasion } from '@/types/card';
import { mockCards } from '@/lib/data/mock-cards';
import { CardGrid } from '@/components/cards/card-grid';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'newest';

const occasions: { value: CardOccasion | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'thank-you', label: 'Thank You' },
  { value: 'congratulations', label: 'Congratulations' },
  { value: 'sympathy', label: 'Sympathy' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'just-because', label: 'Just Because' },
];

const styles: { value: CardCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Styles' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'artistic', label: 'Artistic' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'modern', label: 'Modern' },
];

export default function CardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState<CardOccasion | 'all'>('all');
  const [selectedStyle, setSelectedStyle] = useState<CardCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const filteredCards = useMemo(() => {
    let filtered = [...mockCards];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (card) =>
          card.title.toLowerCase().includes(query) ||
          card.description.toLowerCase().includes(query) ||
          card.category.toLowerCase().includes(query) ||
          card.occasions.some((occ) => occ.toLowerCase().includes(query))
      );
    }

    if (selectedOccasion !== 'all') {
      filtered = filtered.filter((card) => card.occasions.includes(selectedOccasion));
    }

    if (selectedStyle !== 'all') {
      filtered = filtered.filter((card) => card.category === selectedStyle);
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.reverse();
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedOccasion, selectedStyle, sortBy]);

  return (
    <div className="container-luxury py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <h1 className="heading-display text-ink mb-3">Shop Cards</h1>
        <p className="text-stone">
          {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-8 pb-8 border-b border-silk space-y-5">
        {/* Occasion pills — primary filter */}
        <div className="flex flex-wrap gap-2">
          {occasions.map((occ) => (
            <button
              key={occ.value}
              onClick={() => setSelectedOccasion(occ.value)}
              className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                selectedOccasion === occ.value
                  ? 'bg-ink text-white border-ink'
                  : 'border-silk text-stone hover:border-ink hover:text-ink'
              }`}
            >
              {occ.label}
            </button>
          ))}
        </div>

        {/* Style pills + search + sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => (
              <button
                key={style.value}
                onClick={() => setSelectedStyle(style.value)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedStyle === style.value
                    ? 'bg-stone text-white border-stone'
                    : 'border-silk text-stone/70 hover:border-stone hover:text-stone'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-9 pr-4 py-2 text-sm border border-silk rounded bg-white focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 text-sm border border-silk rounded bg-white focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Card Grid — 4 columns */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <CardGrid cards={filteredCards} />
      </div>
    </div>
  );
}
