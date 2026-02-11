import { Card } from '@/types/card';

export const mockCards: Card[] = [
  {
    id: '1',
    title: 'Golden Elegance',
    description: 'A luxurious card featuring gold foil accents and classic typography, perfect for life\'s most significant celebrations.',
    category: 'luxury',
    occasions: ['wedding', 'anniversary'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1608496099924-f863c6f1eaf3?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1703379943328-bfe13999c988?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1608496099924-f863c6f1eaf3?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Your Special Message',
        maxLength: 50,
        fontFamily: 'Cormorant Garamond',
        fontSize: 24,
        color: '#2C2C2C',
        position: { x: 400, y: 700 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Write your heartfelt message here...',
        maxLength: 200,
        fontFamily: 'Inter',
        fontSize: 16,
        color: '#404040',
        position: { x: 100, y: 300 },
        alignment: 'left',
      },
    },
  },
  {
    id: '2',
    title: 'Minimalist Marble',
    description: 'Clean lines and sophisticated marble textures create a modern statement piece for any occasion.',
    category: 'minimalist',
    occasions: ['birthday', 'thank-you', 'just-because'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1645830849105-b0f0ab3ca332?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1515096788709-a3cf4ce0a4a6?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1645830849105-b0f0ab3ca332?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Celebrate',
        maxLength: 30,
        fontFamily: 'Inter',
        fontSize: 32,
        color: '#171717',
        position: { x: 400, y: 600 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Your message...',
        maxLength: 180,
        fontFamily: 'Inter',
        fontSize: 14,
        color: '#262626',
        position: { x: 100, y: 350 },
        alignment: 'left',
      },
    },
  },
  {
    id: '3',
    title: 'Vintage Romance',
    description: 'Delicate floral illustrations and vintage typography evoke timeless romance and elegance.',
    category: 'vintage',
    occasions: ['wedding', 'anniversary', 'congratulations'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1562048048-86d659689440?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1581345629038-4792b67c379c?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1562048048-86d659689440?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'With Love',
        maxLength: 40,
        fontFamily: 'Cormorant Garamond',
        fontSize: 28,
        color: '#8B8680',
        position: { x: 400, y: 650 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Write your love story...',
        maxLength: 220,
        fontFamily: 'Cormorant Garamond',
        fontSize: 15,
        color: '#404040',
        position: { x: 120, y: 320 },
        alignment: 'left',
      },
    },
  },
  {
    id: '4',
    title: 'Contemporary Gold',
    description: 'Bold geometric patterns with luxurious gold detailing for the modern celebration.',
    category: 'modern',
    occasions: ['birthday', 'congratulations', 'just-because'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1707338252277-3f66895b0532?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1769538012116-b26a4cecbcf7?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1707338252277-3f66895b0532?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Congratulations',
        maxLength: 35,
        fontFamily: 'Inter',
        fontSize: 30,
        color: '#D4AF37',
        position: { x: 400, y: 700 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Share your congratulations...',
        maxLength: 190,
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#2C2C2C',
        position: { x: 100, y: 340 },
        alignment: 'left',
      },
    },
  },
  {
    id: '5',
    title: 'Artistic Watercolor',
    description: 'Hand-painted watercolor designs bring warmth and artistic expression to your message.',
    category: 'artistic',
    occasions: ['birthday', 'thank-you', 'just-because'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1446475157725-e6dada23994e?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1610926950521-ab7e8b45f377?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1446475157725-e6dada23994e?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Happy Birthday',
        maxLength: 40,
        fontFamily: 'Cormorant Garamond',
        fontSize: 26,
        color: '#2C2C2C',
        position: { x: 400, y: 680 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Your birthday wishes...',
        maxLength: 200,
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#404040',
        position: { x: 110, y: 330 },
        alignment: 'left',
      },
    },
  },
  {
    id: '6',
    title: 'Sympathy Serenity',
    description: 'Gentle tones and thoughtful design express comfort and support during difficult times.',
    category: 'minimalist',
    occasions: ['sympathy'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1627329074338-d8c602f34c3e?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1515096788709-a3cf4ce0a4a6?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1627329074338-d8c602f34c3e?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'With Sympathy',
        maxLength: 30,
        fontFamily: 'Inter',
        fontSize: 22,
        color: '#737373',
        position: { x: 400, y: 700 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Express your condolences...',
        maxLength: 150,
        fontFamily: 'Inter',
        fontSize: 14,
        color: '#525252',
        position: { x: 100, y: 360 },
        alignment: 'left',
      },
    },
  },
  {
    id: '7',
    title: 'Holiday Splendor',
    description: 'Festive elegance with rich colors and seasonal details for your holiday greetings.',
    category: 'luxury',
    occasions: ['holiday'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1638589766792-c5ef5e417025?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1703379943328-bfe13999c988?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1638589766792-c5ef5e417025?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Season\'s Greetings',
        maxLength: 45,
        fontFamily: 'Cormorant Garamond',
        fontSize: 28,
        color: '#B8941E',
        position: { x: 400, y: 720 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Share your holiday wishes...',
        maxLength: 210,
        fontFamily: 'Cormorant Garamond',
        fontSize: 16,
        color: '#2C2C2C',
        position: { x: 100, y: 310 },
        alignment: 'left',
      },
    },
  },
  {
    id: '8',
    title: 'Modern Thank You',
    description: 'Contemporary design with heartfelt appreciation, perfect for expressing gratitude.',
    category: 'modern',
    occasions: ['thank-you'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1717590432421-8ae3f6753545?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1769538012116-b26a4cecbcf7?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1717590432421-8ae3f6753545?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Thank You',
        maxLength: 25,
        fontFamily: 'Inter',
        fontSize: 32,
        color: '#171717',
        position: { x: 400, y: 680 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Express your gratitude...',
        maxLength: 170,
        fontFamily: 'Inter',
        fontSize: 14,
        color: '#404040',
        position: { x: 100, y: 350 },
        alignment: 'left',
      },
    },
  },
  {
    id: '9',
    title: 'Anniversary Bliss',
    description: 'Timeless elegance celebrating enduring love and cherished memories.',
    category: 'luxury',
    occasions: ['anniversary'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1616504204011-554922b202b2?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1703379943328-bfe13999c988?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1616504204011-554922b202b2?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Happy Anniversary',
        maxLength: 50,
        fontFamily: 'Cormorant Garamond',
        fontSize: 26,
        color: '#D4AF37',
        position: { x: 400, y: 690 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Celebrate your love story...',
        maxLength: 230,
        fontFamily: 'Cormorant Garamond',
        fontSize: 15,
        color: '#2C2C2C',
        position: { x: 110, y: 320 },
        alignment: 'left',
      },
    },
  },
  {
    id: '10',
    title: 'Just Because Moments',
    description: 'Thoughtful design for spontaneous expressions of care and connection.',
    category: 'minimalist',
    occasions: ['just-because'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1743356629167-343e188d100b?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1515096788709-a3cf4ce0a4a6?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1743356629167-343e188d100b?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Thinking of You',
        maxLength: 35,
        fontFamily: 'Inter',
        fontSize: 28,
        color: '#404040',
        position: { x: 400, y: 700 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Share your thoughts...',
        maxLength: 180,
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#525252',
        position: { x: 100, y: 340 },
        alignment: 'left',
      },
    },
  },
  {
    id: '11',
    title: 'Wedding Grandeur',
    description: 'Opulent design with intricate details for the most special day.',
    category: 'luxury',
    occasions: ['wedding'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1549576351-2b0829ac81f8?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1703379943328-bfe13999c988?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1549576351-2b0829ac81f8?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Our Wedding Day',
        maxLength: 45,
        fontFamily: 'Cormorant Garamond',
        fontSize: 30,
        color: '#B8941E',
        position: { x: 400, y: 710 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Your wedding message...',
        maxLength: 250,
        fontFamily: 'Cormorant Garamond',
        fontSize: 16,
        color: '#2C2C2C',
        position: { x: 100, y: 300 },
        alignment: 'left',
      },
    },
  },
  {
    id: '12',
    title: 'Artistic Birthday',
    description: 'Vibrant and creative design that celebrates life with artistic flair.',
    category: 'artistic',
    occasions: ['birthday'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1749855333713-0f4ad9d033e3?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1610926950521-ab7e8b45f377?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1749855333713-0f4ad9d033e3?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Happy Birthday',
        maxLength: 40,
        fontFamily: 'Cormorant Garamond',
        fontSize: 27,
        color: '#D4AF37',
        position: { x: 400, y: 680 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Birthday wishes...',
        maxLength: 200,
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#2C2C2C',
        position: { x: 110, y: 330 },
        alignment: 'left',
      },
    },
  },
  {
    id: '13',
    title: 'Vintage Congratulations',
    description: 'Classic design celebrating achievements with timeless sophistication.',
    category: 'vintage',
    occasions: ['congratulations'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1525268771113-32d9e9021a97?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1581345629038-4792b67c379c?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1525268771113-32d9e9021a97?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Congratulations',
        maxLength: 38,
        fontFamily: 'Cormorant Garamond',
        fontSize: 28,
        color: '#8B8680',
        position: { x: 400, y: 690 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Share your pride...',
        maxLength: 210,
        fontFamily: 'Cormorant Garamond',
        fontSize: 15,
        color: '#404040',
        position: { x: 110, y: 320 },
        alignment: 'left',
      },
    },
  },
  {
    id: '14',
    title: 'Modern Minimalist Wedding',
    description: 'Clean and contemporary wedding card with elegant simplicity.',
    category: 'minimalist',
    occasions: ['wedding'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1745605443018-030f36ce90e7?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1515096788709-a3cf4ce0a4a6?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1745605443018-030f36ce90e7?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Together Forever',
        maxLength: 40,
        fontFamily: 'Inter',
        fontSize: 30,
        color: '#171717',
        position: { x: 400, y: 700 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Wedding wishes...',
        maxLength: 220,
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#262626',
        position: { x: 100, y: 330 },
        alignment: 'left',
      },
    },
  },
  {
    id: '15',
    title: 'Luxury Thank You Gold',
    description: 'Sophisticated gratitude with luxurious gold foil embellishments.',
    category: 'luxury',
    occasions: ['thank-you'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1566305977571-5666677c6e98?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1703379943328-bfe13999c988?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1566305977571-5666677c6e98?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Thank You',
        maxLength: 30,
        fontFamily: 'Cormorant Garamond',
        fontSize: 32,
        color: '#D4AF37',
        position: { x: 400, y: 690 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Express gratitude...',
        maxLength: 190,
        fontFamily: 'Cormorant Garamond',
        fontSize: 15,
        color: '#2C2C2C',
        position: { x: 100, y: 340 },
        alignment: 'left',
      },
    },
  },
  {
    id: '16',
    title: 'Artistic Nature',
    description: 'Hand-illustrated botanical elements create a natural, organic aesthetic.',
    category: 'artistic',
    occasions: ['birthday', 'thank-you', 'just-because'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1584284621485-c955b915f5cb?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1610926950521-ab7e8b45f377?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1584284621485-c955b915f5cb?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Best Wishes',
        maxLength: 35,
        fontFamily: 'Cormorant Garamond',
        fontSize: 26,
        color: '#2C2C2C',
        position: { x: 400, y: 680 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Your message...',
        maxLength: 195,
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#404040',
        position: { x: 110, y: 335 },
        alignment: 'left',
      },
    },
  },
  {
    id: '17',
    title: 'Modern Holiday Cheer',
    description: 'Contemporary holiday design with festive elegance.',
    category: 'modern',
    occasions: ['holiday'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1704739308671-96dd994617d8?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1769538012116-b26a4cecbcf7?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1704739308671-96dd994617d8?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Happy Holidays',
        maxLength: 40,
        fontFamily: 'Inter',
        fontSize: 30,
        color: '#B8941E',
        position: { x: 400, y: 700 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Holiday wishes...',
        maxLength: 200,
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#2C2C2C',
        position: { x: 100, y: 330 },
        alignment: 'left',
      },
    },
  },
  {
    id: '18',
    title: 'Vintage Anniversary',
    description: 'Romantic vintage design celebrating years of love and commitment.',
    category: 'vintage',
    occasions: ['anniversary'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1756187793625-4a29fef1f4f8?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1581345629038-4792b67c379c?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1756187793625-4a29fef1f4f8?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Anniversaire',
        maxLength: 45,
        fontFamily: 'Cormorant Garamond',
        fontSize: 28,
        color: '#8B8680',
        position: { x: 400, y: 690 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Anniversary message...',
        maxLength: 220,
        fontFamily: 'Cormorant Garamond',
        fontSize: 15,
        color: '#404040',
        position: { x: 110, y: 320 },
        alignment: 'left',
      },
    },
  },
  {
    id: '19',
    title: 'Minimalist Sympathy',
    description: 'Gentle and comforting design offering peace during difficult times.',
    category: 'minimalist',
    occasions: ['sympathy'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1610926950521-ab7e8b45f377?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1515096788709-a3cf4ce0a4a6?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1610926950521-ab7e8b45f377?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'In Sympathy',
        maxLength: 30,
        fontFamily: 'Inter',
        fontSize: 24,
        color: '#737373',
        position: { x: 400, y: 700 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Share your condolences...',
        maxLength: 160,
        fontFamily: 'Inter',
        fontSize: 14,
        color: '#525252',
        position: { x: 100, y: 350 },
        alignment: 'left',
      },
    },
  },
  {
    id: '20',
    title: 'Luxury Congratulations',
    description: 'Celebrate success with opulent design and gold accents.',
    category: 'luxury',
    occasions: ['congratulations'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1515711660811-48832a4c6f69?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1703379943328-bfe13999c988?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1515711660811-48832a4c6f69?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Bravo!',
        maxLength: 35,
        fontFamily: 'Cormorant Garamond',
        fontSize: 36,
        color: '#D4AF37',
        position: { x: 400, y: 690 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Congratulatory message...',
        maxLength: 210,
        fontFamily: 'Cormorant Garamond',
        fontSize: 15,
        color: '#2C2C2C',
        position: { x: 100, y: 330 },
        alignment: 'left',
      },
    },
  },
  {
    id: '21',
    title: 'Artistic Watercolor Birthday',
    description: 'Soft watercolor strokes create a dreamy birthday celebration.',
    category: 'artistic',
    occasions: ['birthday'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1743657166982-9e3ff272122b?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1610926950521-ab7e8b45f377?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1743657166982-9e3ff272122b?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Celebrate You',
        maxLength: 40,
        fontFamily: 'Cormorant Garamond',
        fontSize: 27,
        color: '#2C2C2C',
        position: { x: 400, y: 680 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Birthday message...',
        maxLength: 200,
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#404040',
        position: { x: 110, y: 330 },
        alignment: 'left',
      },
    },
  },
  {
    id: '22',
    title: 'Modern Just Because',
    description: 'Contemporary design for spontaneous moments of connection.',
    category: 'modern',
    occasions: ['just-because'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1530735270084-64865de16524?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1769538012116-b26a4cecbcf7?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1530735270084-64865de16524?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Hello Friend',
        maxLength: 35,
        fontFamily: 'Inter',
        fontSize: 28,
        color: '#171717',
        position: { x: 400, y: 700 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Your thoughts...',
        maxLength: 180,
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#262626',
        position: { x: 100, y: 340 },
        alignment: 'left',
      },
    },
  },
  {
    id: '23',
    title: 'Vintage Thank You',
    description: 'Classic gratitude with vintage charm and delicate details.',
    category: 'vintage',
    occasions: ['thank-you'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1495231916356-a86217efff12?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1581345629038-4792b67c379c?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1495231916356-a86217efff12?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Merci',
        maxLength: 30,
        fontFamily: 'Cormorant Garamond',
        fontSize: 32,
        color: '#8B8680',
        position: { x: 400, y: 690 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Thank you message...',
        maxLength: 180,
        fontFamily: 'Cormorant Garamond',
        fontSize: 15,
        color: '#404040',
        position: { x: 110, y: 335 },
        alignment: 'left',
      },
    },
  },
  {
    id: '24',
    title: 'Luxury Holiday Gold',
    description: 'Opulent holiday design with rich gold and elegant typography.',
    category: 'luxury',
    occasions: ['holiday'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1513885251266-04dcfa26e979?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1703379943328-bfe13999c988?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1513885251266-04dcfa26e979?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Joy & Peace',
        maxLength: 45,
        fontFamily: 'Cormorant Garamond',
        fontSize: 30,
        color: '#D4AF37',
        position: { x: 400, y: 710 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Holiday greetings...',
        maxLength: 220,
        fontFamily: 'Cormorant Garamond',
        fontSize: 16,
        color: '#2C2C2C',
        position: { x: 100, y: 320 },
        alignment: 'left',
      },
    },
  },
  {
    id: '25',
    title: 'Minimalist Birthday',
    description: 'Clean and modern birthday card with sophisticated simplicity.',
    category: 'minimalist',
    occasions: ['birthday'],
    price: 4.99,
    images: {
      front: 'https://images.unsplash.com/photo-1698285439446-2ad560e31a17?w=800&h=1200&fit=crop&q=80',
      back: 'https://images.unsplash.com/photo-1515096788709-a3cf4ce0a4a6?w=800&h=1200&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1698285439446-2ad560e31a17?w=400&h=600&fit=crop&q=80',
    },
    customizable: {
      frontText: true,
      backText: false,
      insideText: true,
    },
    templates: {
      front: {
        placeholder: 'Happy Birthday',
        maxLength: 35,
        fontFamily: 'Inter',
        fontSize: 30,
        color: '#171717',
        position: { x: 400, y: 700 },
        alignment: 'center',
      },
      inside: {
        placeholder: 'Birthday wishes...',
        maxLength: 185,
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#262626',
        position: { x: 100, y: 335 },
        alignment: 'left',
      },
    },
  },
];

// In-memory mutable storage for admin CRUD
let cardStorage: Card[] = [...mockCards];
let cardCounter = mockCards.length + 1;

export function getAllCards(): Card[] {
  return cardStorage;
}

export function getCardById(id: string): Card | undefined {
  return cardStorage.find((card) => card.id === id);
}

export function getCardsByCategory(category: string): Card[] {
  return cardStorage.filter((card) => card.category === category);
}

export function getCardsByOccasion(occasion: string): Card[] {
  return cardStorage.filter((card) => card.occasions.includes(occasion as any));
}

export function searchCards(query: string): Card[] {
  const lowerQuery = query.toLowerCase();
  return cardStorage.filter(
    (card) =>
      card.title.toLowerCase().includes(lowerQuery) ||
      card.description.toLowerCase().includes(lowerQuery) ||
      card.category.toLowerCase().includes(lowerQuery) ||
      card.occasions.some((occ) => occ.toLowerCase().includes(lowerQuery))
  );
}

export function addCard(card: Omit<Card, 'id'>): Card {
  const newCard: Card = {
    ...card,
    id: String(cardCounter++),
  };
  cardStorage.push(newCard);
  return newCard;
}

export function updateCard(id: string, updates: Partial<Omit<Card, 'id'>>): Card | undefined {
  const index = cardStorage.findIndex((c) => c.id === id);
  if (index === -1) return undefined;
  cardStorage[index] = { ...cardStorage[index], ...updates };
  return cardStorage[index];
}

export function deleteCard(id: string): boolean {
  const index = cardStorage.findIndex((c) => c.id === id);
  if (index === -1) return false;
  cardStorage.splice(index, 1);
  return true;
}
