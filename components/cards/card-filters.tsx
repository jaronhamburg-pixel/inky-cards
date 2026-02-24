'use client';

import { CardCategory } from '@/types/card';

interface CardFiltersProps {
  selectedCategories: CardCategory[];
  priceRange: [number, number];
  onCategoryChange: (categories: CardCategory[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onReset: () => void;
}

const categories: { value: CardCategory; label: string }[] = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'congratulations', label: 'Congratulations' },
  { value: 'new-baby', label: 'New Baby' },
  { value: 'new-home', label: 'New Home' },
  { value: 'new-job', label: 'New Job' },
  { value: 'good-luck', label: 'Good Luck' },
  { value: 'get-well-soon', label: 'Get Well Soon' },
  { value: 'thinking-of-you', label: 'Thinking of You' },
  { value: 'for-you', label: 'For You' },
  { value: 'misc', label: 'Misc' },
];

export function CardFilters({
  selectedCategories,
  priceRange,
  onCategoryChange,
  onPriceRangeChange,
  onReset,
}: CardFiltersProps) {
  const handleCategoryToggle = (category: CardCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const hasFilters =
    selectedCategories.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 30;

  return (
    <div className="bg-white p-6 rounded-lg border border-silk">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-ink">Filters</h3>
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-sm text-stone hover:text-ink transition-colors"
          >
            Reset All
          </button>
        )}
      </div>

      <div className="mb-8">
        <h4 className="font-medium text-neutral-700 mb-3 text-sm">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.value} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.value)}
                onChange={() => handleCategoryToggle(category.value)}
                className="w-4 h-4 text-ink border-silk rounded focus:ring-ink"
              />
              <span className="ml-3 text-sm text-neutral-700 group-hover:text-ink transition-colors">
                {category.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-neutral-700 mb-3 text-sm">Price Range</h4>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-silk rounded-lg appearance-none cursor-pointer accent-ink"
          />
          <div className="flex items-center justify-between text-sm text-stone">
            <span>&pound;{priceRange[0]}</span>
            <span>&pound;{priceRange[1]}+</span>
          </div>
        </div>
      </div>
    </div>
  );
}
