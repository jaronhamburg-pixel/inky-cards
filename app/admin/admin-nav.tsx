'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/cards', label: 'Cards', icon: '🎴' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white rounded-lg border border-neutral-200 p-4">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                pathname === item.href
                  ? 'bg-luxury-gold text-luxury-charcoal font-semibold'
                  : 'text-neutral-700 hover:bg-neutral-100'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-4 border-t border-neutral-200">
        <a
          href="/api/admin/logout"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <span>🚪</span>
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
