# LitLens AI Codebase Analysis Report

## 1. Existing Routes
- `/` (`app/page.tsx`): Main marketing/landing page.
- `/sign-in/[[...sign-in]]/page.tsx`: Clerk authentication sign-in.
- `/sign-up/[[...sign-up]]/page.tsx`: Clerk authentication sign-up.
- `/dashboard` (`app/dashboard/page.tsx`): Dashboard overview containing the hero command, latest synthesis, and library grid.
- `/dashboard/upload` (`app/dashboard/upload/page.tsx`): Dedicated interface for paper uploads.
- `/dashboard/projects/[projectId]` (`app/dashboard/projects/[projectId]/page.tsx`): Project workspace overview.
- `/dashboard/projects/[projectId]/compare` (`app/dashboard/projects/[projectId]/compare/page.tsx`): Comparison engine interface.
- `/dashboard/projects/[projectId]/review` (`app/dashboard/projects/[projectId]/review/page.tsx`): Literature review generator workspace.

## 2. Existing Components
Organized into three functional categories:
- **Dashboard (`components/dashboard/`)**: `HeroCommand.tsx`, `LatestSynthesis.tsx`, `QuickActionUpload.tsx`, `RecentLibrary.tsx`.
- **Layout (`components/layout/`)**: `SideNavBar.tsx`, `TopNavBar.tsx`.
- **Library (`components/library/`)**: `PaperCard.tsx`.

## 3. Existing Layouts
- `app/layout.tsx`: Root layout, wrapped in `<ClerkProvider>`, setting up global typography (`Inter` and `Geist`), Google Material Symbols, background colors, and global CSS.
- `app/dashboard/layout.tsx`: Dashboard-specific shell integrating the `SideNavBar` and `TopNavBar` with a custom-scrollable main content area.
- `middleware.ts`: Secures `/dashboard(.*)` routes utilizing `clerkMiddleware`.

## 4. Existing Design System
- Custom Tailwind CSS configuration utilizing v4 (`@tailwindcss/postcss`).
- Global tokens mapped in `globals.css` (e.g., `bg-background`, `text-on-surface`).
- Custom typography utility classes are present (e.g., `font-body-md`).
- Dark mode is hardcoded (`className="dark"` in `RootLayout`).
- Material Symbols Outlined used heavily for iconography.

## 5. Existing APIs & Infrastructure
- **Supabase**: Client configured in `lib/supabase/client.ts` with strict typings in `lib/types/database.ts` tracking `projects` and `documents` schema.
- **Domain Types**: Centralized interfaces located in `lib/types.ts`.

## 6. Missing Infrastructure Required for MVP
Based on the `IMPLEMENTATION.md` phases, the following backend routes and integrations are pending:
- **Backend API Routes**:
  - `/api/upload/route.ts` (Arcjet + Supabase Storage)
  - `/api/inngest/route.ts` (LangChain Extraction & OpenAI calls)
  - `/api/search/route.ts` (Qdrant Semantic Search)
- **AI Core**:
  - Implementation of LangChain utilities (`lib/ai/langchain.ts`, `lib/ai/prompts.ts`)

---

## Recommended Next Actions
1. **Initialize shadcn/ui**: Run `npx shadcn@latest init` to formally set up the `components/ui` directory, update `tailwind.config`, and allow installation of pre-built accessible components.
2. **Setup Inngest Client**: Install Inngest and define the event schemas for `paper/uploaded` triggering the asynchronous processing pipeline.
3. **Configure Arcjet**: Protect the `/api/upload` endpoint from abuse by configuring arcjet rate-limiting policies.
