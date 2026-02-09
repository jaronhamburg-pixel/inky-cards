# Quick Start Guide - Inky Cards

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment
```bash
# Create .env.local file
cp .env.local.example .env.local
```

Edit `.env.local` and add your Google Gemini API key:
```bash
GOOGLE_AI_API_KEY=your_key_here
```

**Get a free API key**: https://ai.google.dev/ (takes 2 minutes)

### Step 3: Start the Server
```bash
npm run dev
```

Open http://localhost:3000 🎉

---

## 🎯 What to Test

### Customer Flow
1. **Homepage** → Click "Browse Cards"
2. **Cards Marketplace** → Filter by occasion, try search
3. **Card Detail** → Click any card → "Customize This Card"
4. **Editor** → Edit text, change font → "Add to Cart"
5. **Cart** → Review items → "Proceed to Checkout"
6. **Checkout** → Fill form (4 steps) → "Place Order"
7. **Success** → View confirmation

### AI Generator Flow
1. **Homepage** → Click "AI Generator"
2. **Generate Page** → Select occasion, describe card → "Generate Card"
3. **Preview** → Review generated text → "Add to Cart"
4. Follow cart/checkout flow above

### Admin Dashboard
1. Visit http://localhost:3000/admin
2. View dashboard metrics
3. Click "Orders" → Change order status
4. View order details

---

## 📂 Key Files to Explore

### Pages
- `app/page.tsx` - Homepage
- `app/cards/page.tsx` - Marketplace
- `app/generate/page.tsx` - AI Generator
- `app/checkout/page.tsx` - Checkout flow

### Components
- `components/ui/` - Design system
- `components/layout/header.tsx` - Navigation with cart
- `components/cards/card-filters.tsx` - Filtering logic

### Data & Logic
- `lib/data/mock-cards.ts` - 25 sample cards
- `lib/store/cart-store.ts` - Cart state management
- `lib/services/ai-service.ts` - Gemini AI integration

### Styles
- `app/globals.css` - Luxury design system

---

## 🎨 Sample Data Included

- **25 Luxury Cards** across 5 categories
- **3 Sample Orders** with different statuses
- **All occasions covered**: Birthday, Wedding, Anniversary, etc.

---

## 🔑 Features Available

### Without API Key
✅ Browse cards
✅ Filter and search
✅ Customize cards
✅ Add to cart
✅ Complete checkout
✅ View orders
✅ Admin dashboard

### With API Key (Gemini)
✅ All above features
✅ AI card generation
✅ Custom message creation

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### TypeScript errors
```bash
# Check TypeScript version
npm run build
```

### AI generation not working
1. Check `.env.local` has valid `GOOGLE_AI_API_KEY`
2. Verify API key at https://ai.google.dev/
3. Check console for error messages
4. Free tier limit: 60 requests/minute

---

## 📱 Test on Mobile

The app is fully responsive. Test on:
- Mobile browsers (iOS Safari, Chrome)
- Tablet (iPad)
- Desktop (all modern browsers)

---

## 💡 Tips

1. **Cart persists** in localStorage - clear browser data to reset
2. **Orders are in-memory** - they reset when server restarts
3. **Images load from Unsplash** - may be slow on first load
4. **AI generation** takes 2-5 seconds
5. **Admin has no auth** - anyone can access (add in production)

---

## 🎓 Learning the Codebase

### Good Starting Points
1. `app/page.tsx` - See how homepage is structured
2. `components/ui/button.tsx` - Example of design system component
3. `lib/store/cart-store.ts` - Learn Zustand state management
4. `lib/data/mock-cards.ts` - Understand data structure

### Key Patterns
- **Server vs Client Components**: Note `'use client'` directives
- **Type Safety**: All TypeScript with strict mode
- **State Management**: Zustand for global, useState for local
- **Styling**: Tailwind with custom classes

---

## 🚀 Next Steps

### To Make Production-Ready
1. Add database (PostgreSQL + Prisma)
2. Integrate Stripe for payments
3. Add authentication (Clerk/NextAuth)
4. Set up email service (Resend/SendGrid)
5. Implement video upload (UploadThing)

### To Enhance Features
1. Add user accounts and order history
2. Implement saved card designs
3. Add review/rating system
4. Create bulk ordering
5. Add gift wrapping options

---

## 📚 Documentation

- **README.md** - Full documentation
- **IMPLEMENTATION_SUMMARY.md** - Technical details
- **Inline comments** - Throughout codebase

---

## 🎉 You're Ready!

The platform is fully functional with mock data. Start exploring and customizing!

Need help? Check the README or review the code comments.
