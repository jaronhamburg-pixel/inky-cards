'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="container-luxury text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="heading-hero text-ink mb-6"
          >
            About Inky Cards
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="body-large text-stone max-w-xl mx-auto"
          >
            Combining timeless craft with modern AI technology to create greeting
            cards that truly matter.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="pb-24">
        <div className="container-luxury max-w-3xl">
          <div className="text-center">
            <h2 className="heading-display text-ink mb-8">Our Mission</h2>
            <p className="text-stone leading-relaxed">
              In a digital world, physical greeting cards remain one of the most
              meaningful ways to express emotion. We believe every card should be as
              unique as the sentiment it carries. That&apos;s why we created a platform
              that merges craft with AI innovation, allowing you to create
              personalised cards that recipients will treasure.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24 border-t border-silk">
        <div className="container-luxury">
          <h2 className="heading-display text-ink text-center mb-14">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-medium text-ink mb-3 tracking-tight">
                AI-Powered Creativity
              </h3>
              <p className="text-stone text-sm leading-relaxed">
                Our advanced AI helps you craft the perfect message and design,
                tailored to your specific occasion and recipient.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl font-medium text-ink mb-3 tracking-tight">
                Premium Quality
              </h3>
              <p className="text-stone text-sm leading-relaxed">
                Every card is printed on premium cardstock with luxury finishes,
                ensuring your message is delivered with elegance.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-medium text-ink mb-3 tracking-tight">
                Video Integration
              </h3>
              <p className="text-stone text-sm leading-relaxed">
                Add a personal video greeting with QR code integration, bringing your
                card to life in a whole new dimension.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-silk">
        <div className="container-luxury max-w-3xl">
          <h2 className="heading-display text-ink text-center mb-14">How It Works</h2>
          <div className="space-y-10">
            {[
              { step: '01', title: 'Choose or Create', desc: 'Browse our curated collection or use our AI generator to create a unique design from scratch.' },
              { step: '02', title: 'Personalise', desc: 'Customise your message, choose fonts, and add optional video greetings with our intuitive editor.' },
              { step: '03', title: 'We Print & Ship', desc: 'Your card is professionally printed on premium materials and shipped with care, ready to make someone\'s day.' },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex gap-8"
              >
                <span className="text-3xl font-semibold text-silk flex-shrink-0 w-12">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-xl font-medium text-ink mb-2 tracking-tight">{item.title}</h3>
                  <p className="text-stone text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-paper py-24 md:py-32">
        <div className="container-luxury text-center">
          <h2 className="heading-display text-paper mb-6">Make it personal.</h2>
          <p className="body-large text-paper/60 mb-12 max-w-lg mx-auto">
            Join thousands of customers who trust Inky Cards for their most important moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button size="lg" variant="outline" className="border-paper text-paper hover:bg-paper hover:text-ink">
                Try Inky AI Generator
              </Button>
            </Link>
            <Link href="/cards">
              <Button size="lg" variant="outline" className="border-paper/30 text-paper/60 hover:bg-paper hover:text-ink">
                View All Cards
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
