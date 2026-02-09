# Inky Cards - Luxury Greeting Card Platform

A complete luxury greeting card e-commerce platform built with Next.js 16, featuring AI-powered card generation, video greetings, and a full admin dashboard.

## Features

### 🎨 Customer Features
- **Browse Cards**: Marketplace with 25+ luxury greeting cards
- **Advanced Filtering**: Filter by category, occasion, and price
- **AI Card Generator**: Create custom cards using Google Gemini AI
- **Card Editor**: Customize text, fonts, and preview changes
- **Video Greetings**: Add personal video messages with QR codes
- **Shopping Cart**: Full cart management with quantity controls
- **Checkout Flow**: Multi-step checkout with form validation
- **Order Tracking**: View order status and details

### 🔧 Admin Features
- **Dashboard**: Overview of orders, revenue, and inventory
- **Order Management**: View and update order statuses
- **Card Inventory**: Manage card catalog
- **Analytics**: Basic metrics and reporting

### 🎯 Technical Features
- Next.js 16 App Router
- TypeScript (strict mode)
- Tailwind CSS v4 with luxury design system
- Zustand for state management
- Google Gemini AI integration
- React Hook Form + Zod validation
- Responsive design (mobile-first)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key (free tier available)

### Installation

1. Clone the repository (if applicable)

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:
- `GOOGLE_AI_API_KEY`: Get from https://ai.google.dev/
- `ADMIN_SECRET`: Set a secure password for admin access

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Project Structure

```
/app
  /(pages)           # User-facing pages
    page.tsx         # Homepage
    /cards           # Card marketplace
    /generate        # AI generator
    /cart            # Shopping cart
    /checkout        # Checkout flow
    /orders          # Order details
  /admin             # Admin dashboard
  /api               # API routes
/components
  /ui                # Reusable UI components
  /layout            # Layout components
  /cards             # Card-specific components
/lib
  /data              # Mock data
  /services          # Business logic
  /store             # Zustand stores
  /utils             # Utilities
/types               # TypeScript types
```

## Mock Data

This implementation uses in-memory mock data instead of a database for simplicity:

- **Cards**: 25 pre-defined luxury cards in `/lib/data/mock-cards.ts`
- **Orders**: Sample orders stored in memory in `/lib/data/mock-orders.ts`
- Cart state persists in localStorage via Zustand

To add a real database:
1. Install Prisma: `npm install prisma @prisma/client`
2. Create schema in `prisma/schema.prisma`
3. Replace mock data functions with Prisma queries

## AI Integration

The platform uses Google Gemini 2.0 Flash (free tier) for card text generation:

- Model: `gemini-2.0-flash-exp`
- Free tier: 60 requests/minute
- Features: Text generation for card messages
- Location: `/lib/services/ai-service.ts`

Images are sourced from Unsplash (no API key needed for development).

## Environment Variables

Required:
- `GOOGLE_AI_API_KEY`: Google Gemini API key for AI generation

Optional:
- `UPLOADTHING_TOKEN`: For video upload functionality
- `ADMIN_SECRET`: Password for admin access
- `NEXT_PUBLIC_APP_URL`: Base URL for the app

## Design System

### Colors
- **Luxury Gold**: `#D4AF37`
- **Dark Gold**: `#B8941E`
- **Luxury Cream**: `#F5F5DC`
- **Charcoal**: `#2C2C2C`
- **Stone**: `#8B8680`

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

This project is for demonstration purposes.
