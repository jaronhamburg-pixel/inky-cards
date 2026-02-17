import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="container-luxury py-20 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="heading-display text-ink mb-8 text-center">Terms &amp; Conditions</h1>

        <div className="prose-inky space-y-8">
          <section>
            <h2 className="text-xl font-medium text-ink mb-3">1. Introduction</h2>
            <p className="text-stone leading-relaxed text-sm">
              Welcome to Inky Cards. These terms and conditions govern your use of our website
              and the purchase of products through our platform. By using our website, you agree
              to be bound by these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">2. Products &amp; Pricing</h2>
            <p className="text-stone leading-relaxed text-sm">
              All prices are displayed in USD and include applicable taxes unless otherwise stated.
              We reserve the right to update pricing at any time. Cards are printed to order and
              personalised items are non-refundable unless faulty.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">3. Orders &amp; Delivery</h2>
            <p className="text-stone leading-relaxed text-sm">
              Orders are typically dispatched within 2&ndash;3 business days. Standard delivery
              takes 3&ndash;5 business days within the US. Express delivery options are available
              at checkout. Free shipping is offered on orders over £20.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">4. AI-Generated Content</h2>
            <p className="text-stone leading-relaxed text-sm">
              Cards created using our AI generator are unique designs produced for your personal use.
              You retain the right to use your personalised card for its intended purpose. We do not
              claim ownership of AI-generated designs created through your prompts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">5. Returns &amp; Refunds</h2>
            <p className="text-stone leading-relaxed text-sm">
              We offer a 30-day return policy on non-personalised cards in their original condition.
              Personalised and AI-generated cards are non-refundable unless there is a manufacturing
              defect. Contact support@inkycards.com for any issues with your order.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink mb-3">6. Video &amp; Media Content</h2>
            <p className="text-stone leading-relaxed text-sm">
              Videos and photos uploaded for QR code greetings are stored securely and are accessible
              only via the unique QR code provided with your card. Media content is retained for
              12 months from the date of upload unless you request earlier deletion.
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
