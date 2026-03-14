'use client';

import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function StarRating({ rating, size = 'md', interactive = false, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const displayRating = interactive && hovered > 0 ? hovered : rating;

  return (
    <div
      className="flex gap-0.5"
      onMouseLeave={interactive ? () => setHovered(0) : undefined}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.min(1, Math.max(0, displayRating - (star - 1)));

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            className={`${sizes[size]} relative ${
              interactive ? 'cursor-pointer' : 'cursor-default'
            } disabled:opacity-100`}
            onMouseEnter={interactive ? () => setHovered(star) : undefined}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
          >
            {/* Empty star (background) */}
            <svg
              className="absolute inset-0 w-full h-full text-silk"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {/* Filled star with clip */}
            {fill > 0 && (
              <svg
                className="absolute inset-0 w-full h-full text-ink"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
