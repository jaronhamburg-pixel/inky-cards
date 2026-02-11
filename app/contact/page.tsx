import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <div className="container-luxury py-20 animate-fade-in">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="heading-display text-ink mb-6">Contact Us</h1>
        <p className="body-large text-stone mb-12">
          We&apos;d love to hear from you. Whether you have a question about our cards,
          need help with an order, or just want to say hello.
        </p>

        <div className="bg-white border border-silk rounded-lg p-8 text-left space-y-6 mb-12">
          <div>
            <h3 className="font-serif text-lg font-medium text-ink mb-2">Email</h3>
            <p className="text-stone">hello@inkycards.com</p>
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-ink mb-2">Customer Support</h3>
            <p className="text-stone">support@inkycards.com</p>
            <p className="text-sm text-stone/60 mt-1">Monday &ndash; Friday, 9am &ndash; 5pm GMT</p>
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-ink mb-2">Press &amp; Partnerships</h3>
            <p className="text-stone">press@inkycards.com</p>
          </div>
        </div>

        <Link href="/">
          <Button variant="outline" size="lg">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
