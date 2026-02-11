import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  return (
    <div className="container-luxury py-20 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="heading-display text-ink mb-8 text-center">Privacy Policy</h1>

        <div className="prose-inky space-y-8">
          <section>
            <h2 className="font-serif text-xl font-medium text-ink mb-3">1. Information We Collect</h2>
            <p className="text-stone leading-relaxed text-sm">
              We collect information you provide directly: name, email, shipping address, and payment
              details when placing an order. We also collect device and usage information through
              cookies and analytics to improve our service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-ink mb-3">2. How We Use Your Data</h2>
            <p className="text-stone leading-relaxed text-sm">
              Your data is used to process and deliver orders, provide customer support, improve our
              products and services, and send marketing communications (only with your consent).
              We never sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-ink mb-3">3. Media Uploads</h2>
            <p className="text-stone leading-relaxed text-sm">
              Videos and photos uploaded for QR code greetings are stored securely using encrypted
              cloud storage. Access is restricted to the unique QR code URL generated for each
              upload. You may request deletion of your media at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-ink mb-3">4. Payment Security</h2>
            <p className="text-stone leading-relaxed text-sm">
              Payment processing is handled by our secure payment partner. We do not store your
              full credit card details on our servers. All transactions are encrypted using
              industry-standard TLS/SSL protocols.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-ink mb-3">5. Cookies</h2>
            <p className="text-stone leading-relaxed text-sm">
              We use essential cookies to maintain your shopping basket and session. Analytics
              cookies help us understand how visitors use our site. You can manage cookie
              preferences in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-ink mb-3">6. Your Rights</h2>
            <p className="text-stone leading-relaxed text-sm">
              You have the right to access, correct, or delete your personal data. You may also
              opt out of marketing communications at any time. To exercise these rights, contact
              us at privacy@inkycards.com.
            </p>
          </section>
        </div>

        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline" size="lg">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
