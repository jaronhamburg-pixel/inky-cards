'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="container-luxury py-20 text-center animate-fade-in">
      <h1 className="heading-display text-ink mb-4">Something went wrong</h1>
      <p className="body-large text-stone mb-8">
        We&apos;re sorry for the inconvenience. Please try again.
      </p>
      <Button size="lg" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
