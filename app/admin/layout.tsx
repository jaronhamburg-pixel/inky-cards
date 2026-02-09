import Link from 'next/link';
import { cookies } from 'next/headers';
import { AdminNav } from './admin-nav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session');
  const isAuthenticated = session?.value === (process.env.ADMIN_SECRET || 'admin123');

  if (!isAuthenticated) {
    // Render children without sidebar so the login page works
    return <>{children}</>;
  }

  // Render full admin layout with sidebar
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Admin Header */}
      <header className="bg-luxury-charcoal text-luxury-cream border-b border-luxury-stone">
        <div className="container-luxury py-4">
          <div className="flex items-center justify-between">
            <h1 className="heading-card">Inky Cards Admin</h1>
            <Link href="/" className="text-sm hover:text-luxury-gold transition-colors">
              &larr; Back to Store
            </Link>
          </div>
        </div>
      </header>

      <div className="container-luxury py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <AdminNav />
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
