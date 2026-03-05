'use client';

import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';

interface PaymentFormProps {
  onPaymentSuccess: (paymentIntentId: string) => void;
}

export function PaymentForm({ onPaymentSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'An error occurred');
      setProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } =
      await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed');
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentSuccess(paymentIntent.id);
    } else {
      setError('Payment was not completed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-ink mb-4">Payment</h2>
      <PaymentElement
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['card', 'klarna', 'apple_pay', 'google_pay'],
        }}
      />
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
      <Button
        type="button"
        variant="primary"
        disabled={!stripe || processing}
        className="w-full"
        onClick={handleConfirm}
      >
        {processing ? 'Processing...' : 'Confirm Payment'}
      </Button>
    </div>
  );
}
