# Inky Cards — Production Readiness Plan

## Context

Inky Cards is a luxury greeting card e-commerce platform (Next.js 16.1.6, TypeScript, Tailwind v4, Zustand, Stripe). It currently runs entirely on **in-memory mock data** with **insecure auth**, **no webhooks**, **no email**, **no tests**, and **no deployment config**. This plan takes it from demo to production-ready across 4 phases.

---

## Phase A — Blockers (Must-Do Before Launch)

### A1: Database + Prisma `[XL]` `[No dependencies]`

**What:** Replace all 4 in-memory mock data files with Prisma ORM + PostgreSQL.

**Why:** Data resets on every restart/deploy. Orders, users, and inventory must persist.

**Files to create:**
- `prisma/schema.prisma` — full schema (User, UserAddress, Card, Order, OrderItem, Article)
- `prisma/seed.ts` — seed script migrating all 25 cards, 2 users, 3 orders, 6 articles
- `lib/db/prisma.ts` — singleton Prisma client (globalThis caching pattern)
- `lib/db/cards.ts` — async replacements for `lib/data/mock-cards.ts` exports
- `lib/db/orders.ts` — async replacements for `lib/data/mock-orders.ts` exports
- `lib/db/users.ts` — async replacements for `lib/data/mock-users.ts` exports
- `lib/db/articles.ts` — async replacements for `lib/data/mock-articles.ts` exports

**Files to modify (~19 consumers):**
- All API routes: `app/api/auth/*`, `app/api/orders/*`, `app/api/account/*`, `app/api/checkout/*`
- All pages reading data: `app/page.tsx`, `app/cards/page.tsx`, `app/cards/[id]/page.tsx`, `app/cards/[id]/customize/page.tsx`, `app/admin/page.tsx`, `app/admin/cards/page.tsx`, `app/admin/orders/page.tsx`, `app/the-edit/page.tsx`, `app/the-edit/[slug]/page.tsx`
- `lib/auth/session.ts` — make user lookup async

**New deps:** `prisma` (dev), `@prisma/client`

**Subtasks:**
1. Install Prisma, init with `npx prisma init --datasource-provider postgresql`
2. Define schema models: User, UserAddress, Card (with Json templates), Order, OrderItem, Article (with String[] content)
3. Create `lib/db/prisma.ts` singleton with globalThis caching
4. Create `lib/db/cards.ts`, `orders.ts`, `users.ts`, `articles.ts` — same function signatures, now async with Prisma queries
5. Write `prisma/seed.ts` transplanting all existing mock data
6. Update all ~19 consumer files: change imports from `@/lib/data/mock-*` to `@/lib/db/*`, add `await` to all calls
7. Add `DATABASE_URL` to `.env.local.example`
8. Run `prisma migrate dev` + `prisma db seed` to verify

---

### A2: Secure Authentication `[L]` `[Depends on: A1]`

**What:** Replace `simpleHash()` with bcrypt, implement JWT tokens, add `middleware.ts` for route protection, fix admin auth.

**Why:** `simpleHash()` is trivially reversible. Admin cookie stores the plaintext password. No middleware protects routes.

**Files to create:**
- `lib/auth/jwt.ts` — `signToken(payload)` and `verifyToken(token)` using `jose`
- `middleware.ts` (project root) — protect `/account/*`, `/admin/*`, `/api/account/*`

**Files to modify:**
- `lib/db/users.ts` — `bcrypt.hash`/`bcrypt.compare` instead of `simpleHash`
- `lib/auth/session.ts` — decode JWT from cookie, add `getAdminSession()`
- `app/api/auth/signup/route.ts` — set JWT cookie
- `app/api/auth/signin/route.ts` — set JWT cookie
- `app/api/auth/signout/route.ts` — clear JWT cookie
- `app/api/auth/me/route.ts` — decode JWT
- `app/api/admin/auth/route.ts` — generate admin JWT (never store password in cookie)
- `app/api/admin/logout/route.ts` — clear admin JWT
- `app/admin/layout.tsx` — verify admin JWT via `getAdminSession()`
- `lib/utils/validation.ts` — strengthen password requirements (min 8 chars, require number)

**New deps:** `bcryptjs` (pure JS, serverless-safe), `jose` (Edge-compatible JWT)

**Subtasks:**
1. Install `bcryptjs` and `jose`
2. Create `lib/auth/jwt.ts` with sign (7d user / 24h admin) and verify functions using `JWT_SECRET` env var
3. Update `lib/db/users.ts`: `bcrypt.hash(pw, 12)` for creation, `bcrypt.compare()` for auth
4. Update `lib/auth/session.ts`: read JWT from `user-session` cookie, extract userId, lookup user
5. Update all auth API routes to set/clear JWT cookies (httpOnly, secure in prod, sameSite lax)
6. Fix admin auth: verify against `ADMIN_SECRET` env var (NO `admin123` fallback), generate admin JWT
7. Create `middleware.ts` matching `/account/:path*`, `/admin/:path*`, `/api/account/:path*`
8. Strengthen password validation: min 8 chars, at least 1 letter + 1 number

---

### A3: Stripe Webhooks `[M]` `[Depends on: A1]`

**What:** Add `/api/webhooks/stripe` endpoint for `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`.

**Why:** Current flow relies on client-side PaymentIntent verification — unreliable. Webhooks are Stripe's recommended approach.

**Files to create:**
- `app/api/webhooks/stripe/route.ts` — webhook handler

**Files to modify:**
- `app/api/orders/route.ts` — create orders as `pending_payment`, let webhook confirm
- `lib/db/orders.ts` — add `updateOrderByPaymentIntentId()` function
- `types/order.ts` — add `pending_payment` and `cancelled` to OrderStatus

**New deps:** None (Stripe SDK already installed)

**Subtasks:**
1. Create webhook route: read raw body with `request.text()`, verify signature with `stripe.webhooks.constructEvent()`
2. Handle `payment_intent.succeeded` → update order to `processing`
3. Handle `payment_intent.payment_failed` → update paymentStatus to `failed`
4. Handle `charge.refunded` → update order to `cancelled`
5. Modify order creation: status starts as `pending_payment` when paymentIntentId provided
6. Add `updateOrderByPaymentIntentId()` to `lib/db/orders.ts`
7. Add `STRIPE_WEBHOOK_SECRET` to `.env.local.example`
8. Document local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

---

### A4: Security Hardening `[L]` `[Depends on: A2]`

**What:** Security headers, CSRF protection, rate limiting on auth endpoints, input sanitisation, remove hardcoded credentials.

**Why:** Zero security headers, no CSRF, no rate limiting, hardcoded `admin123` fallback. Baseline requirements for handling payments + PII.

**Files to create:**
- `lib/middleware/rate-limit.ts` — sliding window rate limiter (in-memory initially, Upstash Redis later in C12)
- `lib/utils/sanitize.ts` — strip script tags and event handlers from user text

**Files to modify:**
- `next.config.ts` — add security headers (X-Frame-Options, CSP, HSTS, etc.)
- `middleware.ts` — integrate rate limiting + Origin header CSRF check
- `app/api/admin/auth/route.ts` — remove `admin123` fallback entirely (error if `ADMIN_SECRET` not set)

**New deps:** None initially (in-memory rate limiter). Upstash Redis deferred to C12.

**Subtasks:**
1. Add security headers to `next.config.ts`: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, HSTS, Permissions-Policy (camera/microphone self)
2. Remove `admin123` fallback — throw at startup if `ADMIN_SECRET` not set
3. Create in-memory sliding window rate limiter: 5/min on auth endpoints, 10/min on AI generation, 60/min general
4. Add Origin header checking for CSRF on all POST/PATCH/DELETE API routes
5. Create `lib/utils/sanitize.ts`: strip `<script>`, `on*` event handlers from user text (card customisations, profile fields)
6. Apply sanitisation to all API routes accepting user text
7. Create comprehensive `.env.local.example` with all required env vars

---

## Phase B — UX & Quality

### B5: Transactional Emails `[L]` `[Depends on: A1, A2, A3]`

**What:** Order confirmation, shipping updates, and password reset emails using Resend.

**Why:** Checkout promises email confirmation but none is sent. Password reset requires email.

**Files to create:**
- `lib/email/resend.ts` — Resend client singleton
- `lib/email/templates/order-confirmation.tsx` — React email template
- `lib/email/templates/shipping-update.tsx`
- `lib/email/templates/password-reset.tsx`
- `lib/email/send.ts` — `sendOrderConfirmation()`, `sendShippingUpdate()`, `sendPasswordReset()`
- `app/api/auth/forgot-password/route.ts` — generate reset token, send email
- `app/api/auth/reset-password/route.ts` — validate token, update password

**Files to modify:**
- `app/api/webhooks/stripe/route.ts` — send confirmation after payment succeeds
- `prisma/schema.prisma` — add resetToken/resetTokenExpiry to User model

**New deps:** `resend`, `@react-email/components`

**Subtasks:**
1. Install deps, create Resend client singleton
2. Build 3 email templates with INKY branding (ink/paper/stone colours, Cormorant Garamond headings)
3. Create `lib/email/send.ts` with typed send functions
4. Add password reset flow (time-limited tokens stored in DB)
5. Integrate email into Stripe webhook (send after payment confirmation)
6. Add `RESEND_API_KEY` + `RESEND_FROM_EMAIL` to `.env.local.example`

---

### B6: SEO `[M]` `[No dependencies]`

**What:** Dynamic metadata for all pages, OG/Twitter cards, sitemap.xml, robots.txt, JSON-LD structured data.

**Why:** Only a static title/description on root layout. No OG images, no sitemap, no structured data. Invisible to search engines.

**Files to create:**
- `app/sitemap.ts` — dynamic sitemap generation
- `app/robots.ts` — robots.txt (disallow /admin, /api, /account)
- `lib/seo/json-ld.ts` — Product schema.org structured data helper

**Files to modify:**
- `app/layout.tsx` — metadataBase, title template, OG defaults
- `app/cards/[id]/page.tsx` — `generateMetadata()` with card title/description/image
- `app/the-edit/[slug]/page.tsx` — `generateMetadata()` with article data
- All static pages (`/cards`, `/about`, `/contact`, `/generate`, `/privacy`, `/terms`, `/the-edit`) — add metadata exports

**New deps:** None (Next.js built-in support)

**Subtasks:**
1. Update root layout metadata with template pattern and metadataBase
2. Add `generateMetadata()` to card detail + article pages
3. Add static metadata to all remaining pages
4. Create `app/sitemap.ts` fetching all cards and articles
5. Create `app/robots.ts` with disallow rules
6. Create JSON-LD Product structured data for card detail pages

---

### B7: Video Upload Persistence `[M]` `[Depends on: A1]`

**What:** Replace mock video upload with real file storage using UploadThing (already a dependency).

**Why:** Video uploads currently generate fake URLs — videos are lost immediately. QR codes point to nothing.

**Files to create:**
- `lib/uploadthing/core.ts` — file router (video: 64MB max)
- `app/api/uploadthing/route.ts` — UploadThing API handler
- `app/video/[id]/page.tsx` — public video playback page (QR code destination)

**Files to modify:**
- `app/api/upload-video/route.ts` — use UploadThing instead of mock
- `lib/services/qr-service.ts` — point QR codes to `/video/{id}`

**New deps:** `@uploadthing/react` (may already be available)

---

### B8: Error Monitoring `[S]` `[No dependencies]`

**What:** Sentry integration for error tracking + performance monitoring.

**Why:** Without monitoring, production errors go unnoticed until customers complain. Critical for payment processing.

**Files to create:**
- `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
- `app/global-error.tsx` — global error boundary with Sentry reporting

**Files to modify:**
- `next.config.ts` — wrap with `withSentryConfig`

**New deps:** `@sentry/nextjs`

---

## Phase C — Deploy & Test

### C9: Testing `[XL]` `[Depends on: A1, A2, A3]`

**What:** Vitest (unit/integration) + Playwright (E2E) covering critical paths.

**Tests to write:**
- **Unit:** JWT sign/verify, Zod validation schemas, user/order data access (mock Prisma)
- **Integration:** Auth flow (signup→signin→me→signout), order creation, payment intent
- **E2E:** Full signup→signin→add to cart→checkout→success flow, admin login→manage orders

**New deps:** `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `@playwright/test` (all dev)

---

### C10: Deployment `[M]` `[Depends on: A1-A4, C9]`

**What:** Vercel config, CI/CD pipeline, production build verification.

**Files to create:**
- `vercel.json` — framework config, function durations
- `.github/workflows/ci.yml` — lint → type-check → test → build

**Key steps:** Configure Vercel PostgreSQL (or Neon/Supabase), set up Stripe webhook production URL, configure all env vars.

---

### C11: Analytics `[S]` `[Depends on: C10]`

**What:** Vercel Analytics + Web Vitals + custom event tracking (add to cart, checkout complete, card view).

**New deps:** `@vercel/analytics`, `@vercel/speed-insights`

---

### C12: Rate Limiting (Redis) `[S]` `[Depends on: A4]`

**What:** Upgrade A4's in-memory rate limiter to Upstash Redis for serverless-compatible, cross-instance rate limiting.

**New deps:** `@upstash/ratelimit`, `@upstash/redis`

---

## Phase D — Nice to Have

### D13: Saved Designs `[M]` `[Depends on: A1, A2]`
Save card customisations to user account for later editing/reordering. New `SavedDesign` Prisma model + API routes + account page.

### D14: Wishlist `[S]` `[Depends on: A1, A2]`
Bookmark cards for later. New `Wishlist` Prisma model + heart icon on card grid + account wishlist page.

### D15: Reviews `[M]` `[Depends on: A1, A2, B6]`
Product reviews and ratings on card detail pages. New `Review` Prisma model + star rating component + aggregate in JSON-LD.

### D16: Print Integration `[XL]` `[Depends on: A1, A3]`
Connect to print-on-demand API (Prodigi/Gelato) for automated card printing and fulfilment. Webhook for print status updates.

---

## Execution Order

```
 #  | Task                      | Size | Dependencies     | Parallelisable with
----|---------------------------|------|------------------|---------------------
 1  | B6: SEO                   | M    | None             | B8
 2  | B8: Error Monitoring      | S    | None             | B6
 3  | A1: Database + Prisma     | XL   | None             | —
 4  | A2: Secure Auth           | L    | A1               | A3
 5  | A3: Stripe Webhooks       | M    | A1               | A2
 6  | A4: Security Hardening    | L    | A2               | —
 7  | B5: Transactional Emails  | L    | A1, A2, A3       | B7
 8  | B7: Video Persistence     | M    | A1               | B5
 9  | C9: Testing               | XL   | A1, A2, A3       | —
10  | C10: Deployment           | M    | A1-A4, C9        | —
11  | C11: Analytics            | S    | C10              | C12
12  | C12: Rate Limiting Redis  | S    | A4               | C11
13+ | D13-D16 (Nice to Have)    | Var  | A1, A2           | Each other
```

**Minimum viable launch:** Tasks 1–10 (B6, B8, A1, A2, A3, A4, B5, B7, C9, C10)

---

## Verification

After each phase, verify:
- **A1:** `prisma db seed` succeeds, all pages render with DB data, dev server restart preserves data
- **A2:** Signup/signin/signout work, JWT in cookies (not raw ID), admin login issues JWT (not password), middleware blocks unauthenticated access to /account and /admin
- **A3:** `stripe listen` locally, complete a test payment, verify order moves from `pending_payment` → `processing`
- **A4:** Security headers visible in DevTools Network tab, rate limiting returns 429 after threshold, `admin123` fallback removed
- **Full:** `next build` succeeds, `vitest run` passes, `playwright test` passes, Sentry captures a test error
