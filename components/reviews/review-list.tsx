'use client';

import { StarRating } from '@/components/ui/star-rating';
import type { Review, SiteRating } from '@/types/review';

interface ReviewListProps {
  reviews: Review[];
  siteRating: SiteRating;
}

export function ReviewList({ reviews, siteRating }: ReviewListProps) {
  return (
    <div>
      {/* Reviews */}
      {reviews.length === 0 ? (
        <div className="bg-white border border-silk rounded-lg p-8 text-center">
          <p className="text-stone text-sm">No reviews yet. Be the first to share your experience.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-silk rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={review.rating} size="sm" />
              </div>
              <h4 className="font-medium text-ink mb-1">{review.title}</h4>
              <p className="text-sm text-stone mb-3 line-clamp-3">{review.content}</p>
              <div className="flex items-center gap-2 text-xs text-stone">
                <span>{review.userName}</span>
                <span>&middot;</span>
                <span>Order {review.orderNumber}</span>
                <span>&middot;</span>
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
