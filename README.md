<div align="center">

# TickTock ⏱

**The countdown timer that doesn't ask for your email**

Create, share, and manage countdown timers without the hassle of sign-ups, logins, or "please accept cookies" popups. Just paste a link and watch time tick away.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql)](https://www.postgresql.org/)

[Live Demo](https://tryticktock.vercel.app) | [About the "Seminar"](https://tryticktock.vercel.app/about)

</div>

---

## What You Get

> No feature creep. No premium tiers. Just countdown timers that actually work.



### The Basics (that actually matter)

- **Board-based everything** — Organize your countdowns into boards (fancy word for "folders but cooler")
- **Magic links** — Share a URL, that's it. No "invite user" flow, no permission settings, just a link
- **Live countdowns** — Days, hours, minutes, seconds — all ticking in real-time because who wants stale data
- **Progress bars** — Visual feedback so you can panic appropriately as deadlines approach
- **Urgency mode** — Cards pulse red when you have less than 5 minutes left (subtle anxiety feature)
- **Search** — Type to filter, because scrolling is for the birds
- **Color coding** — 5 colors to choose from (we didn't overthink this)
- **Focus mode** — Fullscreen a single countdown when you need to stare at time passing
- **Drag & drop** — Reorder things by dragging them around like it's 2010
- **Share button** — Copy board links via Web Share API or clipboard (finally added this)
- **Mobile responsive** — Works on your phone, your tablet, your friend's ancient iPad
- **Zero friction** — No accounts, no tracking, no analytics, no cookie banners

### The "Wait, really?" parts

- Built entirely with AI as a coding buddy during a late-night Discord "seminar"
- Privacy by design (read: too lazy to implement user accounts)
- Open source (because gatekeeping code is weird)
- Actually free (no "free trial" nonsense)

---

## The Stack (for the nerds)

**Frontend**
- Next.js 16 (App Router + Server Components + React Compiler enabled)
- React 19 (the one with the new hooks)
- TypeScript in strict mode (because `any` is a code smell)
- Tailwind CSS v4 (utility-first but make it oklch)
- shadcn/ui (Radix primitives wrapped in better styles)
- Framer Motion (for the smooth animations)
- TanStack Query (optimistic updates, because instant feedback feels good)

**Backend**
- PostgreSQL (the database you can trust)
- Prisma 7 (ORM with the best TypeScript integration)
- Next.js API routes (REST-ish endpoints)
- Zod validation (no bad data allowed)

**Misc**
- @dnd-kit (drag-and-drop without the headache)
- date-fns v4 (date math that makes sense)
- Lucide icons (pretty SVGs)
- Geist font (the Vercel aesthetic)
- sonner (toast notifications done right)

---

## Project Structure (aka where stuff lives)

```
src/
├── app/
│   ├── layout.tsx               # Root layout (fonts, metadata, providers)
│   ├── page.tsx                 # Landing page (server component, client islands)
│   ├── about/page.tsx           # About page (the Discord "seminar" story)
│   ├── how-it-works/page.tsx    # How-to + FAQ (with JSON-LD for rich results)
│   ├── robots.ts                # robots.txt (disallows /api/ and /b/)
│   ├── sitemap.ts               # Sitemap (3 pages: /, /about, /how-it-works)
│   ├── manifest.ts              # PWA manifest
│   ├── opengraph-image.tsx      # Dynamic OG image (edge runtime)
│   ├── twitter-image.tsx        # Twitter card image
│   ├── b/[slug]/
│   │   ├── layout.tsx           # Board layout (noindex metadata)
│   │   └── page.tsx             # Board dashboard + focus mode
│   └── api/boards/
│       ├── route.ts             # POST /api/boards (create board)
│       └── [boardId]/events/
│           ├── route.ts         # GET | POST /api/boards/:id/events
│           ├── [eventId]/route.ts   # PUT | DELETE /api/boards/:id/events/:eid
│           └── reorder/route.ts     # PUT /api/boards/:id/events/reorder
├── components/
│   ├── ui/                      # shadcn primitives (Button, Dialog, Card, etc.)
│   ├── shared/
│   │   ├── page-header.tsx      # Header for landing/about/how-it-works
│   │   ├── page-footer.tsx      # Footer with links
│   │   ├── header.tsx           # Board page header (with share button)
│   │   ├── search-bar.tsx       # Search input with clear button
│   │   └── error-boundary.tsx   # React error boundary
│   └── features/
│       ├── event-card.tsx       # Single countdown card
│       ├── event-list.tsx       # List with drag-and-drop
│       ├── add-event-modal.tsx  # Create/edit event modal
│       ├── focus-timer.tsx      # Fullscreen countdown view
│       ├── sort-toggle.tsx      # Urgency vs custom sort
│       ├── share-button.tsx     # Web Share API + clipboard fallback
│       ├── email-link.tsx       # Email button (copies to clipboard)
│       ├── hero-animation.tsx   # Framer Motion wrapper
│       └── create-board-button.tsx
├── hooks/
│   ├── use-events.ts            # TanStack Query CRUD + optimistic updates
│   ├── use-timer.ts             # Countdown logic (SSR-safe)
│   ├── use-ticker.tsx           # Global interval context
│   └── use-sort-preference.ts   # localStorage for sort mode
├── services/
│   ├── event-service.ts         # API client for events (fetch wrapper)
│   ├── board-service.ts         # API client for boards
│   └── storage.ts               # localStorage helpers (recent boards, sort prefs)
├── lib/
│   ├── utils.ts                 # cn() helper (clsx + twMerge)
│   ├── date-utils.ts            # Date formatting with date-fns
│   ├── serialize.ts             # Prisma Date → ISO string
│   └── prisma.ts                # Prisma client singleton with pg pool
├── types/
│   └── index.ts                 # All TypeScript types + Zod schemas
└── generated/prisma/            # Auto-generated (never edit)
    └── client.ts
```

---

## Getting Started (the speedrun version)

**What you need:**
- Node.js 18+ (if you're still on 16, it's time to update)
- PostgreSQL database ([Neon](https://neon.tech) or [Supabase](https://supabase.com) work great if you don't want to run local)

**Step 1: Clone this thing**

```bash
git clone https://github.com/ikhwanulhakim-code/ticktock.git
cd ticktock
npm install
```

**Step 2: Environment variables (the `.env` dance)**

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ticktock"
```

**Step 3: Database setup**

```bash
npx prisma migrate dev      # Run migrations
npx prisma generate         # Generate Prisma client (happens automatically on install too)
```

**Step 4: Run it**

```bash
npm run dev                 # Dev server at localhost:3000
npm run build               # Production build
npm run start               # Serve production build
npm run lint                # Check for code crimes
```

---

## Architecture (or "how it all fits together")

**The flow:**

```
User clicks button
  ↓
React component calls TanStack Query hook
  ↓
Hook calls service layer function
  ↓
Service function does fetch() to API route
  ↓
API route validates with Zod
  ↓
API route talks to Prisma
  ↓
Prisma talks to PostgreSQL
  ↓
Response flows back up the chain
  ↓
TanStack Query updates cache (optimistically if needed)
  ↓
React re-renders with new data
```

**Design decisions (the opinionated parts):**

- **Server vs Client** — Landing/about/how-it-works are server components. Board page is client. Logo/nav/footer are server. Interactive bits are client islands.
- **Data fetching** — TanStack Query everywhere. Optimistic updates for drag-and-drop. No `useEffect` + `useState` nonsense.
- **Styling** — Tailwind utility classes. No CSS modules, no styled-components, no drama.
- **Timers** — Single `setInterval` in a context provider broadcasts to all countdown hooks. Individual timers derive their state via `useMemo`. No 50 intervals running at once.
- **localStorage** — Only for recent boards and sort preferences. Event data lives in PostgreSQL.
- **Validation** — Zod `.safeParse()` in API routes. Errors returned as `{errors: {field: message}}`.
- **Serialization** — Prisma returns `Date` objects. We convert to ISO strings before sending JSON (via `serializeEvent()` helper).

---

## Database Schema (the two-table wonder)

```
Board (id, createdAt, updatedAt)
  ↓ 1:N
Event (id, title, description, targetDate, color, isCompleted, order, boardId)
```

That's it. No users table. No sessions. No auth. Privacy through simplicity.

**Cascade delete:** When you delete a board, all its events vanish (via `onDelete: Cascade`).

---

## The Origin Story

This whole thing was built live during a Discord "seminar" (read: me screen-sharing to friends at 10 PM). A friend asked me to do a sharing session about building with AI, so I figured: let's just build something from scratch and show the whole process.

Zero to production in one stream. Brainstorming, architecture, prototyping, database, UI polish, SEO — all done with AI as my pair programmer. Every line of code was written via prompts, tweaks, and "does this actually work?" testing.

The result? A fully functional countdown app that doesn't ask for your email, doesn't track you, and actually works. No "coming soon" features, no waitlist, just a URL and you're in.

---

## SEO (because discoverability matters)

- **Metadata** — Every page has proper `<title>`, `<meta description>`, Open Graph tags, Twitter cards
- **Structured data** — JSON-LD schemas for `WebApplication`, `AboutPage`, and `FAQPage` (helps with rich results)
- **Sitemap** — Auto-generated at `/sitemap.xml` with 3 URLs (/, /about, /how-it-works)
- **robots.txt** — Allows `/`, disallows `/api/` and `/b/` (board URLs are private, no need to crawl)
- **Canonical URLs** — Every indexable page has `<link rel="canonical">`
- **Semantic HTML** — Proper heading hierarchy, `<main>`, `<nav>`, `<footer>`, no `<div>` soup
- **Accessibility** — `aria-labels`, keyboard navigation, focus management

---

## Contributing

This is a personal project, but if you find bugs or have ideas, open an issue. Pull requests welcome if they're well-thought-out.

---

## License

Personal/educational use. If you want to fork it and build something cool, go for it.

---

<div align="center">

Built with Next.js, PostgreSQL, and way too much caffeine.

[tryticktock.vercel.app](https://tryticktock.vercel.app)

</div>
