'use client';

import { useState, useMemo } from 'react';
import { CardCategory, CardOccasion } from '@/types/card';
import { mockCards } from '@/lib/data/mock-cards';
import { CardGrid } from '@/components/cards/card-grid';
import { CardFilters } from '@/components/cards/card-filters';
import { Input } from '@/components/ui/input';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'newest';

export default function CardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<CardCategory[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<CardOccasion[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30]);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const filteredCards = useMemo(() => {
    let filtered = mockCards;

    // Search filter
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

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((card) => selectedCategories.includes(card.category));
    }

    // Occasion filter
    if (selectedOccasions.length > 0) {
      filtered = filtered.filter((card) =>
        card.occasions.some((occ) => selectedOccasions.includes(occ))
      );
    }

    // Price filter
    filtered = filtered.filter((card) => card.price >= priceRange[0] && card.price <= priceRange[1]);

    // Sort
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
  }, [searchQuery, selectedCategories, selectedOccasions, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setPriceRange([0, 30]);
  };

  return (
    <div className="container-luxury py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-display text-luxury-charcoal mb-4">Browse Cards</h1>
        <p className="body-large text-neutral-600">
          Discover our collection of luxury greeting cards for every occasion
        </p>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
            />
          </div>
        </div>
        <div className="md:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-neutral-600">
          Showing <span className="font-semibold">{filteredCards.length}</span> of{' '}
          <span className="font-semibold">{mockCards.length}</span> cards
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <CardFilters
            selectedCategories={selectedCategories}
            selectedOccasions={selectedOccasions}
            priceRange={priceRange}
            onCategoryChange={setSelectedCategories}
            onOccasionChange={setSelectedOccasions}
            onPriceRangeChange={setPriceRange}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Card Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <CardGrid cards={filteredCards} />
          </div>
        </div>
      </div>
    </div>
  );
}
