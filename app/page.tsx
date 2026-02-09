import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { mockCards } from '@/lib/data/mock-cards';
import { formatPrice } from '@/lib/utils/formatting';

export default function Home() {
  const featuredCards = mockCards.slice(0, 6);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-luxury-cream to-white py-20 md:py-32">
        <div className="container-luxury text-center">
          <h1 className="heading-hero text-luxury-charcoal mb-6">
            Luxury Greeting Cards,
            <br />
            <span className="text-luxury-gold">Reimagined</span>
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto mb-10">
            Create personalized, premium greeting cards with AI-powered customization and
            heartfelt video messages. Every card is a masterpiece.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cards">
              <Button size="lg" variant="primary">
                Browse Cards
              </Button>
            </Link>
            <Link href="/generate">
              <Button size="lg" variant="secondary">
                AI Generator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-luxury-charcoal"
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
              <h3 className="heading-card mb-3">AI Customization</h3>
              <p className="body-regular text-neutral-600">
                Generate unique card designs and messages with our AI-powered creativity engine.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-luxury-charcoal"
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
              <h3 className="heading-card mb-3">Video Messages</h3>
              <p className="body-regular text-neutral-600">
                Add personal video greetings with QR codes that bring your cards to life.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-luxury-charcoal"
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
              <p className="body-regular text-neutral-600">
                Exquisite materials and elegant finishes that reflect luxury in every detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cards Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container-luxury">
          <div className="text-center mb-12">
            <h2 className="heading-display text-luxury-charcoal mb-4">Featured Cards</h2>
            <p className="body-large text-neutral-600">
              Discover our curated selection of luxury greeting cards
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-stagger">
            {featuredCards.map((card) => (
              <Link
                key={card.id}
                href={`/cards/${card.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={card.images.thumbnail}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="heading-card mb-2 text-luxury-charcoal group-hover:text-luxury-gold transition-colors">
                    {card.title}
                  </h3>
                  <p className="body-small text-neutral-600 mb-3 line-clamp-2">
                    {card.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-luxury-gold">
                      {formatPrice(card.price)}
                    </span>
                    <span className="text-sm text-neutral-500 capitalize">{card.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/cards">
              <Button size="lg" variant="outline">
                View All Cards
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-luxury-charcoal text-luxury-cream">
        <div className="container-luxury text-center">
          <h2 className="heading-display mb-6">Ready to Create Something Special?</h2>
          <p className="body-large mb-10 max-w-2xl mx-auto opacity-90">
            Whether you choose from our collection or create with AI, every card tells your
            unique story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button size="lg" variant="secondary">
                Start with AI
              </Button>
            </Link>
            <Link href="/cards">
              <Button size="lg" variant="outline" className="border-luxury-cream text-luxury-cream hover:bg-luxury-cream hover:text-luxury-charcoal">
                Browse Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
