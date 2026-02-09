import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-luxury-charcoal text-luxury-cream mt-24">
      <div className="container-luxury py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="heading-card text-luxury-gold mb-4">Inky Cards</h3>
            <p className="body-small text-luxury-cream opacity-80">
              Luxury greeting cards with AI customization and video messaging.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 body-small">
              <li>
                <Link href="/cards" className="opacity-80 hover:opacity-100 transition-opacity">
                  Browse Cards
                </Link>
              </li>
              <li>
                <Link href="/generate" className="opacity-80 hover:opacity-100 transition-opacity">
                  AI Generator
                </Link>
              </li>
              <li>
                <Link href="/cart" className="opacity-80 hover:opacity-100 transition-opacity">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 body-small">
              <li>
                <Link href="/about" className="opacity-80 hover:opacity-100 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="opacity-80 hover:opacity-100 transition-opacity">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 body-small">
              <li>
                <Link href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-luxury-stone mt-8 pt-8 text-center body-small opacity-60">
          <p>&copy; 2026 Inky Cards. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
