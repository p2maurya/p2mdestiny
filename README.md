# p2mdestiny — Next.js Production Rebuild

Full-stack property listing platform (rent/buy), rebuilt from PHP to Next.js 15 + TypeScript + Prisma + PostgreSQL.

## Stack
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Backend:** Next.js API routes
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth v5 (Google OAuth + email/password)
- **Media:** Cloudinary (image + video upload)
- **Maps:** Google Maps embed (no API key required)

## Features
- Property listing with search & filters (city, type, category, bedrooms, price)
- Image slider + video walkthrough on every listing
- Wishlist (heart), share, star ratings & reviews, view counter
- Call & WhatsApp direct-contact buttons on every card and detail page
- 4-step "Post Property" flow with photo/video upload
- User dashboard — my listings, inquiries, wishlist
- Admin panel — approve/reject listings, platform stats
- Cinematic parallax city-skyline hero (pure SVG/CSS, no stock photos)

## Setup

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, NEXTAUTH_SECRET, Google + Cloudinary keys
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Generate `NEXTAUTH_SECRET` with:
```bash
openssl rand -base64 32
```

## Environment variables (see `.env.example`)
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | NextAuth session signing |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google sign-in |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Image/video upload |

## Making the first admin user
New users default to role `USER`. Promote yourself after signing up:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'you@example.com';
```

## Deploy
- **App:** Vercel (recommended for Next.js)
- **Database:** Neon / Render / Supabase Postgres
- Set all env vars from `.env.example` in your hosting provider's dashboard.

## Notes
- Aadhaar/eKYC verification was intentionally left out of this build — add it later via a licensed provider (Setu, Cashfree Verification, Signzy) rather than storing raw Aadhaar numbers.
- `isVerified` field on `Property` is already in the schema, ready for when verification is added — admin can toggle it manually for now.
