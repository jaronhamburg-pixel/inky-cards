import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Inky Cards — combining timeless craft with modern AI to create greeting cards that truly matter.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
