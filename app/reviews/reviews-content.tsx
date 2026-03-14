'use client';

import { motion } from 'framer-motion';
import { StarRating } from '@/components/ui/star-rating';
import { ReviewList } from '@/components/reviews/review-list';
import type { Review, SiteRating } from '@/types/review';

export default function ReviewsContent({
  reviews,
  siteRating,
}: {
  reviews: Review[];
  siteRating: SiteRating;
}) {
  return (
    <div className="container-luxury py-12 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Centered page header */}
        <div className="mb-10 text-center">
          <h1 className="heading-display text-ink mb-3">What Our Customers Say</h1>
          {siteRating.count > 0 && (
            <div className="flex items-center justify-center gap-2">
              <StarRating rating={siteRating.average} size="sm" />
              <p className="text-stone">
                {siteRating.average.toFixed(1)} from {siteRating.count} review{siteRating.count !== 1 ? 's' : ''}
              </p>
            </div>
          )}
          {siteRating.count === 0 && (
            <p className="text-stone">Reviews from verified orders</p>
          )}
        </div>

        <ReviewList reviews={reviews} siteRating={siteRating} />
      </motion.div>
    </div>
  );
}
