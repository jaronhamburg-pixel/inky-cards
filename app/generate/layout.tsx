import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Card Generator',
  description: 'Create a unique, personalised greeting card using our AI-powered designer.',
};

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
