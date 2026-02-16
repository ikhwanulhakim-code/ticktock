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
- **Local-first** — Create boards instantly in your browser, no database needed. Share them when you're ready
- **Magic links** — Share a URL, that's it. No "invite user" flow, no permission settings, just a link
- **Live countdowns** — Days, hours, minutes, seconds — all ticking in real-time because who wants stale data
- **Progress bars** — Visual feedback so you can panic appropriately as deadlines approach
- **Urgency mode** — Cards pulse red when you have less than 5 minutes left (subtle anxiety feature)
- **Focus mode** — Fullscreen a single countdown when you need to stare at time passing (dedicated route per event)
- **Search** — Type to filter, because scrolling is for the birds
- **Color coding** — 5 preset colors + custom colors you can save
- **Timer Modes** — "Duration" (e.g. 20m) or "Target Date" (e.g. Feb 20 at 5 PM)
- **Restartable** — Quickly reset duration-based timers with one click
- **Drag & drop** — Reorder things by dragging them around like it's 2010
- **Share button** — Copy board links via Web Share API or clipboard
- **Share local boards** — Promote local boards to server-backed shared boards with one click
- **Multi-tab sync** — Local board changes sync across browser tabs via BroadcastChannel API
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
- Zod v4 validation (no bad data allowed)

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
├── app/                  # Next.js routes + SEO files
│   ├── b/[slug]/         # Server board dashboard (+ focus/[eventId] sub-route)
│   ├── local/[id]/       # Local board dashboard (+ focus/[eventId] sub-route)
│   ├── about/            # About page
│   ├── how-it-works/     # How-to + FAQ
│   └── api/              # REST endpoints (boards, events, share, sync)
├── components/
│   ├── ui/               # shadcn primitives (Button, Dialog, Card, etc.)
│   ├── shared/           # Layout, header, search, share button, error boundary
│   └── features/         # Domain components (event cards, modals, sort, focus timer)
├── hooks/                # TanStack Query wrappers, timer, sort, local board hooks
├── services/             # API clients, localStorage CRUD, share flow, multi-tab sync
├── lib/                  # Pure utilities (cn, date helpers, serialization, Prisma client)
├── types/                # All TypeScript types + Zod schemas
└── generated/prisma/     # Auto-generated Prisma client (never edit)
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

**The flow (server boards):**

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

**The flow (local boards):**

```
User clicks button
  ↓
React component calls TanStack Query hook (use-local-events.ts)
  ↓
Hook calls local-storage-service.ts
  ↓
Service reads/writes localStorage directly
  ↓
Custom event emitted → query invalidated
  ↓
React re-renders with new data
```

**Design decisions (the opinionated parts):**

- **Server vs Client** — Landing/about/how-it-works are server components. Board pages are client. Logo/nav/footer are server. Interactive bits are client islands.
- **Local-first** — Boards can be created entirely in localStorage. Users can share them to the server when needed, migrating all data via the `/api/share` endpoint.
- **Data fetching** — TanStack Query everywhere. Optimistic updates for drag-and-drop. No `useEffect` + `useState` nonsense.
- **Styling** — Tailwind utility classes. No CSS modules, no styled-components, no drama.
- **Timers** — Single `setInterval` in a context provider broadcasts to all countdown hooks. Individual timers derive their state via `useMemo`. No 50 intervals running at once.
- **localStorage** — Recent boards, sort preferences, custom colors, and full local board data. Server event data lives in PostgreSQL.
- **Validation** — Zod v4 `.safeParse()` in API routes. Errors returned as `{errors: {field: message}}`.
- **Serialization** — Prisma returns `Date` objects. We convert to ISO strings before sending JSON (via `serializeEvent()` and `serializeBoard()` helpers). `deserializeLocalData()` safely parses localStorage JSON.
- **Multi-tab sync** — BroadcastChannel API keeps local boards in sync across tabs. Falls back to StorageEvent for older browsers.

---

## Database Schema (the two-table wonder)

```
Board (id, createdAt, updatedAt, isShared, sharedAt)
  ↓ 1:N
Event (id, title, description, targetDate, color, durationMs, timerMode, isCompleted, order, boardId)
```

That's it. No users table. No sessions. No auth. Privacy through simplicity.

- **`isShared`** — Tracks whether a board was created via the share flow (vs direct API creation)
- **`sharedAt`** — Timestamp of when the board was first shared
- **Cascade delete:** When you delete a board, all its events vanish (via `onDelete: Cascade`)
- **Indexes:** `Board` has `[isShared, createdAt]`, `Event` has `[boardId, order]`

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
