'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AccountPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="container-luxury py-20 animate-fade-in">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="heading-display text-ink mb-3">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h1>
          <p className="text-stone text-sm">
            {isSignUp
              ? 'Join INKY for personalised card recommendations and order tracking.'
              : 'Welcome back. Sign in to your account.'}
          </p>
        </div>

        <div className="bg-white border border-silk rounded-lg p-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" placeholder="Jane" required />
                <Input label="Last Name" placeholder="Smith" required />
              </div>
            )}
            <Input label="Email" type="email" placeholder="you@example.com" required />
            <Input label="Password" type="password" placeholder="Enter your password" required />
            {isSignUp && (
              <Input label="Confirm Password" type="password" placeholder="Confirm your password" required />
            )}
            <Button size="lg" variant="primary" className="w-full" type="submit">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-silk text-center">
            <p className="text-sm text-stone">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-ink font-medium hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-stone mt-6">
          This is a demo. No account will be created.
        </p>
      </div>
    </div>
  );
}
