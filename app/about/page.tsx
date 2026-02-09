import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-b from-luxury-cream to-white py-20 md:py-32">
        <div className="container-luxury text-center">
          <h1 className="heading-hero text-luxury-charcoal mb-6">About Inky Cards</h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Combining timeless elegance with cutting-edge AI technology to create greeting cards
            that truly matter.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container-luxury max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="heading-display text-luxury-charcoal mb-6">Our Mission</h2>
            <p className="body-large text-neutral-600">
              In a digital world, physical greeting cards remain one of the most meaningful ways to
              express emotion. We believe every card should be as unique as the sentiment it
              carries. That's why we've created a platform that merges luxury craftsmanship with AI
              innovation, allowing you to create truly personalized cards that recipients will
              treasure forever.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-neutral-50">
        <div className="container-luxury">
          <h2 className="heading-display text-luxury-charcoal text-center mb-12">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-neutral-200">
              <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-luxury-charcoal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="heading-card mb-3">AI-Powered Creativity</h3>
              <p className="text-neutral-600">
                Our advanced AI helps you craft the perfect message and design, tailored to your
                specific occasion and recipient.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-neutral-200">
              <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-luxury-charcoal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="heading-card mb-3">Premium Quality</h3>
              <p className="text-neutral-600">
                Every card is printed on premium cardstock with luxury finishes, ensuring your
                message is delivered with elegance.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-neutral-200">
              <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-luxury-charcoal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="heading-card mb-3">Video Integration</h3>
              <p className="text-neutral-600">
                Add a personal video greeting with QR code integration, bringing your card to life
                in a whole new dimension.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20">
        <div className="container-luxury max-w-4xl">
          <h2 className="heading-display text-luxury-charcoal text-center mb-12">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center text-luxury-charcoal font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="heading-card mb-2">Choose or Create</h3>
                <p className="text-neutral-600">
                  Browse our curated collection or use our AI generator to create a unique design
                  from scratch.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center text-luxury-charcoal font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="heading-card mb-2">Personalize</h3>
                <p className="text-neutral-600">
                  Customize your message, choose fonts, and add optional video greetings with our
                  intuitive editor.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center text-luxury-charcoal font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="heading-card mb-2">We Print & Ship</h3>
                <p className="text-neutral-600">
                  Your card is professionally printed on premium materials and shipped with care,
                  ready to make someone's day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-luxury-charcoal text-luxury-cream">
        <div className="container-luxury text-center">
          <h2 className="heading-display mb-6">Ready to Create Something Special?</h2>
          <p className="body-large mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of customers who trust Inky Cards for their most important moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button size="lg" variant="secondary">
                Try AI Generator
              </Button>
            </Link>
            <Link href="/cards">
              <Button
                size="lg"
                variant="outline"
                className="border-luxury-cream text-luxury-cream hover:bg-luxury-cream hover:text-luxury-charcoal"
              >
                Browse Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
