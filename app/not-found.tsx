import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container-luxury py-32 text-center animate-fade-in">
      <div className="max-w-md mx-auto">
        <h1 className="heading-hero text-luxury-gold mb-4">404</h1>
        <h2 className="heading-display text-luxury-charcoal mb-4">Page Not Found</h2>
        <p className="body-large text-neutral-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" variant="primary">
              Go Home
            </Button>
          </Link>
          <Link href="/cards">
            <Button size="lg" variant="outline">
              Browse Cards
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
