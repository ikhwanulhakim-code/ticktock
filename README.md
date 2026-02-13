<div align="center">

# ⏱ TickTock

**A minimalist, shareable countdown manager — no sign-up required.**

Create beautiful countdown timers, organize them on boards, and share with anyone via a magic link.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql)](https://www.postgresql.org/)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 **Board-based organization** | Create unlimited boards, each with its own set of countdowns |
| 🔗 **Shareable magic links** | Share any board via URL — everyone with the link can view & collaborate |
| ⏳ **Real-time countdowns** | Live ticking timers with days, hours, minutes, and seconds |
| 📊 **Visual progress bars** | See how much time has elapsed vs. remaining at a glance |
| 🔴 **Urgency alerts** | Cards pulse red when less than 5 minutes remain |
| 🔍 **Instant search** | Filter events in real-time by title |
| 🎨 **Color-coded events** | 5 preset colors for easy categorization |
| 🖥 **Focus mode** | Fullscreen countdown for a single event |
| ↕️ **Drag & drop reorder** | Custom ordering with `@dnd-kit` |
| 📱 **Fully responsive** | Works beautifully on mobile and desktop |
| 🚀 **No account needed** | Start creating countdowns instantly |

---

## 🛠 Tech Stack

<table>
<tr>
<td><strong>Category</strong></td>
<td><strong>Technology</strong></td>
</tr>
<tr><td>Framework</td><td>Next.js 16 (App Router)</td></tr>
<tr><td>Language</td><td>TypeScript (Strict)</td></tr>
<tr><td>UI</td><td>Tailwind CSS v4 + shadcn/ui (Radix UI)</td></tr>
<tr><td>Database</td><td>PostgreSQL + Prisma ORM</td></tr>
<tr><td>State Management</td><td>TanStack Query (React Query)</td></tr>
<tr><td>Animations</td><td>Framer Motion</td></tr>
<tr><td>Drag & Drop</td><td>@dnd-kit</td></tr>
<tr><td>Validation</td><td>Zod</td></tr>
<tr><td>Date Handling</td><td>date-fns v4</td></tr>
<tr><td>Icons</td><td>Lucide React</td></tr>
<tr><td>Font</td><td>Geist (Sans + Mono)</td></tr>
</table>

---

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (server component, fonts, providers)
│   ├── page.tsx            # Landing page — board creation & recent boards
│   ├── b/[slug]/page.tsx   # Board page — dashboard & focus mode
│   └── api/                # RESTful API routes
│       └── boards/
│           ├── route.ts              # POST  /api/boards
│           └── [boardId]/events/
│               ├── route.ts          # GET | POST  /api/boards/:id/events
│               ├── [eventId]/route.ts # PUT | DELETE /api/boards/:id/events/:eventId
│               └── reorder/route.ts  # PUT  /api/boards/:id/events/reorder
├── components/
│   ├── ui/                 # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   ├── shared/             # Layout components (Header, SearchBar)
│   └── features/           # Domain components (EventCard, FocusTimer, AddEventModal)
├── hooks/                  # Custom React hooks
│   ├── use-events.ts       # TanStack Query CRUD hooks (+ optimistic reorder)
│   ├── use-timer.ts        # Countdown logic (hydration-safe)
│   └── use-sort-preference.ts
├── services/               # Data access layer
│   ├── event-service.ts    # API client for events
│   ├── board-service.ts    # API client for boards
│   └── storage.ts          # localStorage wrapper
├── lib/                    # Pure utilities
│   ├── utils.ts            # cn() helper (clsx + tailwind-merge)
│   ├── date-utils.ts       # Date formatting with date-fns
│   └── prisma.ts           # Prisma client singleton
├── types/                  # TypeScript interfaces + Zod schemas
│   └── index.ts
└── generated/prisma/       # Auto-generated Prisma client
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** database (local or hosted, e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com))

### 1. Clone & Install

```bash
git clone https://github.com/ikhwanulhakim-code/ticktock.git
cd ticktock
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ticktock"
```

### 3. Set Up Database

```bash
npx prisma migrate dev    # Apply migrations
npx prisma generate       # Generate Prisma client
```

### 4. Run

```bash
npm run dev                # Start dev server at http://localhost:3000
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint (flat config) |

---

## 🏗 Architecture Overview

```
┌────────────┐     ┌──────────────┐     ┌──────────────┐     ┌────────────┐
│  Components│────▶│ TanStack     │────▶│  Service     │────▶│  API Route │
│  (React)   │     │ Query Hooks  │     │  Layer       │     │  Handlers  │
└────────────┘     └──────────────┘     └──────────────┘     └─────┬──────┘
                                                                   │
                                                              ┌────▼─────┐
                                                              │  Prisma  │
                                                              │    ORM   │
                                                              └────┬─────┘
                                                              ┌────▼─────┐
                                                              │PostgreSQL│
                                                              └──────────┘
```

**Key principles:**

- **Separation of concerns** — Components never access the database directly. All data flows through service → API → Prisma.
- **Optimistic updates** — Drag-and-drop reorder updates the UI immediately, then syncs to the server.
- **Hydration safety** — Timer hooks return stable defaults during SSR to prevent hydration mismatches.
- **Zod validation** — All inputs are validated with Zod schemas before persisting.

---

## 🗄 Data Model

```
┌──────────┐       ┌──────────────┐
│  Board   │       │    Event     │
├──────────┤       ├──────────────┤
│ id       │◀──┐   │ id           │
│ createdAt│   │   │ title        │
│ updatedAt│   │   │ description  │
└──────────┘   │   │ targetDate   │
               │   │ createdAt    │
               │   │ color        │
               │   │ isCompleted  │
               │   │ order        │
               └───│ boardId (FK) │
                   └──────────────┘
```

---

## 📄 License

This project is for personal/educational use.

---

<div align="center">

**Built with ❤️ using Next.js, Tailwind CSS, and PostgreSQL**

</div>
