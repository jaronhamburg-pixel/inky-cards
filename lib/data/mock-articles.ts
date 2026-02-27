export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
}

export const mockArticles: Article[] = [
  {
    slug: 'art-of-the-handwritten-note',
    title: 'The Art of the Handwritten Note',
    excerpt:
      'In an age of instant messaging, the handwritten card has become the ultimate luxury. Here is why putting pen to paper still matters.',
    category: 'Stationery',
    date: '2025-12-10',
    readTime: '4 min read',
    image:
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=500&fit=crop&q=80',
    content: [
      'There is a particular weight to a handwritten card that no digital message can replicate. The texture of the paper beneath your fingertips, the slight imperfections of ink on a page, the knowledge that someone sat down and gave you their undivided attention — these details carry meaning far beyond the words themselves.',
      'Neuroscience backs this up. Studies from the University of Tokyo have shown that writing by hand activates regions of the brain associated with memory and emotion in ways that typing simply does not. When you write a card, you are not just composing a message — you are encoding feeling into a physical object.',
      'The resurgence of greeting cards is not nostalgia. It is a deliberate pushback against the ephemeral nature of digital communication. A text disappears into a scroll of notifications. A card sits on a mantelpiece, tucked into a book, or pinned to a board. It occupies space in someone\'s life.',
      'At INKY, we believe the medium is part of the message. Our heavyweight textured stock and luxury finishes are chosen because they elevate the act of giving. When you hand someone an INKY card, they feel the difference before they read a single word.',
      'So the next time you reach for your phone to send a birthday text, consider this: the three minutes it takes to write a card will be remembered longer than any message that vanishes with a swipe.',
    ],
  },
  {
    slug: 'five-cards-you-should-send-this-year',
    title: 'Five Cards You Should Send This Year',
    excerpt:
      'Forget the obligatory birthday card. These are the unexpected moments that deserve a proper greeting.',
    category: 'Gifting',
    date: '2025-11-28',
    readTime: '3 min read',
    image:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=500&fit=crop&q=80',
    content: [
      'We are conditioned to send cards at birthdays and Christmas, and there is nothing wrong with that. But the cards that people remember — the ones they keep — are the ones that arrive when least expected.',
      'The "just because" card. No occasion, no reason, just a note that says "I was thinking of you." It is disarmingly simple, and in a world of constant noise, simplicity cuts through.',
      'The "I noticed" card. Your colleague got a promotion. Your neighbour\'s garden looks incredible. Your friend ran their first 5K. These small recognitions, committed to paper, become outsized gestures of kindness.',
      'The "thank you, properly" card. Not a quick text after dinner, but a real, considered thank you sent days later. It says: that evening mattered to me, and I wanted you to know.',
      'The "I\'m sorry" card. Some apologies deserve more than a message. A handwritten card shows vulnerability and intention in a way that a screen never can.',
      'The "welcome" card. New neighbours, new babies, new beginnings. A card marks the moment and says: you are seen, you belong here.',
    ],
  },
  {
    slug: 'colour-psychology-in-greeting-cards',
    title: 'Colour Psychology in Greeting Cards',
    excerpt:
      'Why the palette of a card matters as much as the words inside it. A designer\'s guide to choosing the right tone.',
    category: 'Design',
    date: '2025-11-15',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800&h=500&fit=crop&q=80',
    content: [
      'Before a single word is read, a greeting card communicates through colour. The palette sets emotional expectations — warm tones signal intimacy and celebration, cool tones suggest calm and contemplation, and monochrome speaks to sophistication and sincerity.',
      'In card design, restraint is everything. A common mistake is to use too many colours, diluting the emotional signal. The most impactful cards tend to work within a tight palette of two to three colours, using contrast to draw the eye and create hierarchy.',
      'Black and white remains the most powerful combination in greeting card design. It strips away distraction, letting the message and the texture of the paper do the work. There is a reason luxury brands gravitate toward monochrome — it signals confidence and timelessness.',
      'When introducing colour, consider the occasion. Deep burgundies and forest greens carry the weight appropriate for sympathy or formal celebrations. Soft blushes and warm creams feel right for weddings and new arrivals. Saturated primaries bring energy to birthday and congratulations cards.',
      'At INKY, our design team works within a carefully considered colour system for every card in the collection. Each palette is tested for emotional resonance, print fidelity, and how it interacts with our textured stock. The result is a card that feels intentional from the first glance.',
    ],
  },
  {
    slug: 'how-ai-is-changing-personalisation',
    title: 'How AI Is Changing Personalisation',
    excerpt:
      'From generic templates to genuinely unique designs. The technology behind INKY\'s AI card designer.',
    category: 'Technology',
    date: '2025-10-30',
    readTime: '4 min read',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop&q=80',
    content: [
      'The greeting card industry has operated on the same model for decades: a designer creates a template, a printer produces thousands of identical copies, and customers choose the one that feels closest to what they want to say. It works, but it is inherently impersonal.',
      'Generative AI changes this equation fundamentally. Instead of selecting from a finite catalogue, you describe what you want and the technology creates it. A birthday card for a five-year-old who loves dinosaurs and the colour purple. A wedding card that references the couple\'s shared love of wild swimming. A thank you note in the style of Japanese woodblock prints.',
      'The challenge — and the reason most AI card tools feel gimmicky — is quality control. Anyone can generate an image. The hard part is ensuring that image works as a printed card: that the colours translate to CMYK, that the composition leaves space for a message, that the overall aesthetic feels considered rather than chaotic.',
      'INKY\'s AI system is trained with these constraints built in. Every generated design is optimised for our print specifications, our card dimensions, and our quality standards. The result is a card that looks like it was designed by a human, because the AI was taught by humans who understand what makes a great card.',
      'This is not about replacing designers. It is about giving every customer access to bespoke design, regardless of budget or artistic ability. The best cards are personal. AI makes personal possible at scale.',
    ],
  },
  {
    slug: 'seasonal-guide-spring-occasions',
    title: 'The Spring Occasions Guide',
    excerpt:
      'From Mother\'s Day to graduation season, a curated guide to the cards you will need this spring.',
    category: 'Seasonal',
    date: '2025-10-12',
    readTime: '3 min read',
    image:
      'https://images.unsplash.com/photo-1457530378978-8bac673b8062?w=800&h=500&fit=crop&q=80',
    content: [
      'Spring is the busiest season for greeting cards, and for good reason. The calendar is stacked with occasions that call for something more than a text message.',
      'Mother\'s Day sits at the centre of it all. The cards that resonate most are the ones that avoid cliché. Skip the generic florals and think about what actually defines your relationship. Is your mother the person who always has the right book recommendation? The one who sends voice notes instead of texts? The card should reflect the specific, not the universal.',
      'Easter and Passover cards have evolved. Where they once leaned heavily on religious imagery, there is a growing appetite for cards that honour the occasion while feeling contemporary. Think clean typography, subtle references to renewal and gathering, and palettes that feel fresh without being frivolous.',
      'Graduation season arrives in late spring, and the best cards here are the ones that resist the urge to be overly sentimental. Graduates want to feel seen as adults stepping into the world, not children being waved off. A sharp, modern design with a sincere message lands harder than a card covered in mortarboards.',
      'The through-line for spring cards is optimism without saccharine. The season itself does the heavy lifting — your card just needs to match its energy.',
    ],
  },
  {
    slug: 'inside-the-print-studio',
    title: 'Inside the Print Studio',
    excerpt:
      'A look at how INKY cards go from screen to paper. The print processes and materials behind the finish.',
    category: 'Craft',
    date: '2025-09-25',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&h=500&fit=crop&q=80',
    content: [
      'There is a moment in the print process that never gets old: the first sheet coming off the press, still warm, the ink wet enough to smell. It is the point where a digital file becomes a physical object, and it is where most of the craft lives.',
      'Every INKY card is printed on 350gsm textured stock. The weight matters — a flimsy card undermines even the most beautiful design. At 350gsm, you feel the card before you see it. The texture adds a tactile dimension that smooth paper simply cannot match.',
      'We use a combination of digital and lithographic printing depending on the design. Digital printing gives us precision and consistency for photographic and gradient-heavy designs. Litho printing, which transfers ink from plate to paper via a rubber blanket, produces richer, more saturated colour for flat and typographic work.',
      'Finishing is where the luxury happens. Select cards in our collection receive spot UV coating — a clear, glossy layer applied to specific areas of the design that catches the light and creates contrast against the matte stock. Others feature blind embossing, where a die presses a raised pattern into the paper without any ink at all. It is pure texture.',
      'The envelope is not an afterthought. Each INKY card ships with a matched envelope in a complementary tone, chosen to extend the design language of the card itself. First impressions happen at the envelope, and we take that seriously.',
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return mockArticles.find((a) => a.slug === slug);
}
