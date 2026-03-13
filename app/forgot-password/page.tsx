'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container-luxury py-20 animate-fade-in">
        <div className="max-w-md mx-auto text-center">
          <h1 className="heading-display text-ink mb-4">Check Your Email</h1>
          <p className="text-stone mb-8">
            If an account exists for {email}, we&apos;ve sent a password reset link.
            The link expires in 1 hour.
          </p>
          <Link href="/signin">
            <Button variant="outline">Back to Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-luxury py-20 animate-fade-in">
      <div className="max-w-md mx-auto">
        <h1 className="heading-display text-ink mb-4 text-center">Forgot Password</h1>
        <p className="text-stone text-center mb-8">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={!email.trim() || isLoading}
          >
            Send Reset Link
          </Button>
        </form>

        <p className="text-center text-sm text-stone mt-6">
          Remember your password?{' '}
          <Link href="/signin" className="text-ink hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
