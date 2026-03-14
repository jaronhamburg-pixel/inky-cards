'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StarRating } from '@/components/ui/star-rating';
import { reviewSchema, type ReviewFormData } from '@/lib/utils/validation';
import type { Review } from '@/types/review';

interface ReviewFormProps {
  orderId: string;
  review?: Review;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReviewForm({ orderId, review, onSuccess, onCancel }: ReviewFormProps) {
  const [error, setError] = useState('');
  const [rating, setRating] = useState(review?.rating || 0);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: review?.rating || 0,
      title: review?.title || '',
      content: review?.content || '',
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    setError('');
    const payload = { ...data, rating };

    const url = `/api/orders/${orderId}/review`;

    const res = await fetch(url, {
      method: review ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || 'Failed to submit review');
      return;
    }

    onSuccess();
  };

  return (
    <div className="bg-white border border-silk rounded-lg p-6">
      <h3 className="text-lg font-medium text-ink mb-4">
        {review ? 'Edit Review' : 'Rate Your Experience'}
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-2 uppercase tracking-wider">Rating</label>
          <StarRating rating={rating} size="lg" interactive onChange={setRating} />
          {rating === 0 && (
            <p className="text-xs text-red-600 mt-1">Please select a rating</p>
          )}
        </div>

        <Input
          {...register('title')}
          label="Title"
          placeholder="Summarise your experience"
          error={errors.title?.message}
          required
        />

        <div>
          <label className="block text-sm font-medium text-ink mb-1 uppercase tracking-wider">
            Review
          </label>
          <textarea
            {...register('content')}
            placeholder="Share your thoughts about your order..."
            rows={4}
            className="w-full px-4 py-2 border border-silk rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ink resize-none"
          />
          {errors.content?.message && (
            <p className="text-xs text-red-600 mt-1">{errors.content.message}</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} disabled={rating === 0}>
            {review ? 'Update Review' : 'Submit Review'}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
