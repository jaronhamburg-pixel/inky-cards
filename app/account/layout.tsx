import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your Inky Cards account, orders, and addresses.',
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
