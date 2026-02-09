'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-luxury-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg border border-neutral-200 p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-luxury-charcoal tracking-tight">
              Admin Access
            </h1>
            <p className="text-sm text-neutral-500 mt-2">
              Enter the admin password to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="password"
              label="Password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={error || undefined}
              autoFocus
            />

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-luxury-gold hover:text-luxury-charcoal transition-colors"
            >
              Back to Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
