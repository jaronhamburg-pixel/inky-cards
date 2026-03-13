import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order for premium personalised greeting cards.',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
