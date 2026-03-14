# Significant Dates — Account Feature

## Context
Users want to track important dates (birthdays, anniversaries, etc.) so we can send email reminders 1 week before. This adds a new "Dates" tab to the account page following the existing Addresses tab CRUD pattern.

---

## Schema (`prisma/schema.prisma`)

Add `SignificantDate` model + relation on `User`:

```prisma
model SignificantDate {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  label       String                  // e.g. "Mum's Birthday", "Wedding Anniversary"
  personName  String                  // who it's for — "Mum", "Sarah", "Dad & Mum"
  date        DateTime               // stored as full date, we use month+day for annual recurrence
  category    String   @default("birthday")  // birthday | anniversary | other
  notes       String?                 // optional reminder note
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}
```

Add to User model: `significantDates SignificantDate[]`

Run `prisma db push` + `prisma generate`.

---

## Type (`types/significant-date.ts`)

```typescript
export interface SignificantDate {
  id: string;
  label: string;
  personName: string;
  date: Date;
  category: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Validation (`lib/utils/validation.ts`)

Add between Saved Designs and Reviews sections:

```typescript
// ─── Significant Dates ──────────────────────────────────

export const significantDateSchema = z.object({
  label: z.string().min(1, 'Label is required').max(100),
  personName: z.string().min(1, 'Name is required').max(100),
  date: z.string().min(1, 'Date is required'),       // ISO string from input[type=date]
  category: z.enum(['birthday', 'anniversary', 'other']),
  notes: z.string().max(500).optional(),
});

export type SignificantDateFormData = z.infer<typeof significantDateSchema>;

export const significantDateUpdateSchema = significantDateSchema.partial();

export type SignificantDateUpdateFormData = z.infer<typeof significantDateUpdateSchema>;
```

---

## DB Layer (`lib/db/significant-dates.ts`)

Follow `lib/db/saved-designs.ts` pattern:

- `getSignificantDatesByUserId(userId)` — ordered by date (month/day) for upcoming-first display
- `getSignificantDateById(id)` — lightweight, returns `{ userId }` for ownership check
- `createSignificantDate(userId, data)` — parse ISO date string to DateTime
- `updateSignificantDate(id, data)`
- `deleteSignificantDate(id)` — returns boolean

---

## API Routes

### `app/api/account/significant-dates/route.ts` — GET, POST

Follow `app/api/account/saved-designs/route.ts` pattern:
- GET: `getCurrentUser()` → `getSignificantDatesByUserId(userId)` → `{ dates }`
- POST: auth + validate with `significantDateSchema` + sanitize → `createSignificantDate()` → 201

### `app/api/account/significant-dates/[id]/route.ts` — PATCH, DELETE

Follow `app/api/account/saved-designs/[id]/route.ts` pattern:
- PATCH: auth + ownership check + validate with `significantDateUpdateSchema` → `updateSignificantDate()`
- DELETE: auth + ownership check → `deleteSignificantDate()` → `{ success: true }`

---

## Account Page (`app/account/page.tsx`)

### Tab changes
- Add `'dates'` to `Tab` type
- Add `{ key: 'dates', label: 'Dates' }` to tabs array (after Orders, before Designs)
- Add `{activeTab === 'dates' && <DatesTab />}` render

### DatesTab component

Follow the AddressesTab pattern closely:
- State: `dates`, `editingId`, `showNew`
- Fetch on mount: GET `/api/account/significant-dates`
- List view: each date card shows label, person name, date formatted nicely (e.g. "15 March"), category badge, days-until-next indicator
- Edit: inline `DateForm` when `editingId` matches
- Delete: `DELETE /api/account/significant-dates/{id}`
- Add new: `DateForm` at bottom when `showNew === true`

### DateForm component (inline in account page)

Follow AddressForm pattern:
- `react-hook-form` + `zodResolver(significantDateSchema)`
- Fields: label, personName, date (input type="date"), category (select), notes (textarea, optional)
- Accept optional `significantDate` prop for edit vs create
- POST or PATCH to appropriate endpoint

### Display extras
- Show how many days until next occurrence (calculated client-side)
- Sort by upcoming date (nearest first)
- Category shown as a subtle badge (Birthday, Anniversary, Other)

---

## Files to Create
1. `types/significant-date.ts`
2. `lib/db/significant-dates.ts`
3. `app/api/account/significant-dates/route.ts`
4. `app/api/account/significant-dates/[id]/route.ts`

## Files to Modify
1. `prisma/schema.prisma` — add SignificantDate model + User relation
2. `lib/utils/validation.ts` — add date schemas
3. `app/account/page.tsx` — add Dates tab + DatesTab + DateForm components

---

## Execution Order
1. Add SignificantDate to schema + `prisma db push` + generate
2. Create `types/significant-date.ts`
3. Add validation schemas to `lib/utils/validation.ts`
4. Create `lib/db/significant-dates.ts`
5. Create API routes (both files)
6. Add DatesTab + DateForm + tab wiring to `app/account/page.tsx`
7. `next build` verification

## Verification
1. `prisma db push` succeeds
2. `next build` passes
3. Account page shows 5 tabs: Profile, Addresses, Orders, Dates, Designs
4. Can add a date (e.g. "Mum's Birthday", "Mum", 15 March, birthday)
5. Can edit and delete dates
6. Days-until display shows correct countdown
