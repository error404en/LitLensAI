# LitLens AI Codebase Analysis Report

## 1. Existing Routes
- `/` (`app/page.tsx`): Main marketing/landing page.
- `/dashboard` (`app/dashboard/page.tsx`): Dashboard overview containing the hero command, latest synthesis, and library grid.
- `/dashboard/upload` (`app/dashboard/upload/page.tsx`): Dedicated interface for paper uploads.

## 2. Existing Components
Organized into three functional categories:
- **Dashboard (`components/dashboard/`)**: `HeroCommand.tsx`, `LatestSynthesis.tsx`, `QuickActionUpload.tsx`, `RecentLibrary.tsx`.
- **Layout (`components/layout/`)**: `SideNavBar.tsx`, `TopNavBar.tsx`.
- **Library (`components/library/`)**: `PaperCard.tsx`.

## 3. Existing Layouts
- `app/layout.tsx`: Root layout, setting up global typography (`Inter` and `Geist`), Google Material Symbols, background colors, and global CSS.
- `app/dashboard/layout.tsx`: Dashboard-specific shell integrating the `SideNavBar` and `TopNavBar` with a custom-scrollable main content area.

## 4. Existing Design System
- Custom Tailwind CSS configuration utilizing v4 (`@tailwindcss/postcss`).
- Global tokens mapped in `globals.css` (e.g., `bg-background`, `text-on-surface`).
- Custom typography utility classes are present (e.g., `font-body-md`).
- Dark mode is hardcoded (`className="dark"` in `RootLayout`).
- Material Symbols Outlined used heavily for iconography.

## 5. Existing shadcn/ui Components
- **None currently installed.**
- Despite the implementation plan specifying `shadcn/ui`, the `components/ui` folder does not exist, nor are `lucide-react` or Radix primitives installed in `package.json`. The current components are built using raw custom Tailwind classes.

## 6. Reusable Patterns Already Present
- **Utility Functions**: `lib/utils.ts` is present (likely containing the standard `cn` utility for `clsx` and `tailwind-merge` which are installed).
- **Component Categorization**: UI components are logically separated by domain (`dashboard`, `layout`, `library`).
- **Mock Data Injection**: The dashboard currently relies on mocked domain objects (e.g., `mockSynthesis` in `dashboard/page.tsx`) to render UI states.

## 7. Missing Pages Required for MVP
Based on the `IMPLEMENTATION.md` phases, the following core routes are missing:
- **Authentication**:
  - `/sign-in/[[...sign-in]]/page.tsx`
  - `/sign-up/[[...sign-up]]/page.tsx`
- **Project & Paper Management**:
  - `/dashboard/projects/[projectId]/page.tsx`
  - `/dashboard/projects/[projectId]/papers/[paperId]/page.tsx` (optional but recommended)
- **AI Features & Synthesis Workspaces**:
  - `/dashboard/projects/[projectId]/compare/page.tsx` (Comparison Engine)
  - `/dashboard/projects/[projectId]/gaps/page.tsx` (Research Gap Analysis)
  - `/dashboard/projects/[projectId]/review/page.tsx` (Literature Review Generator)
- **Backend API Routes**:
  - `/api/upload/route.ts`
  - `/api/inngest/route.ts`
  - `/api/search/route.ts`

---

## Recommended Next Actions
1. **Initialize shadcn/ui**: Run `npx shadcn@latest init` to formally set up the `components/ui` directory, update `tailwind.config`, and allow installation of pre-built accessible components.
2. **Install Authentication**: Follow Phase 2 of the implementation plan to install `@clerk/nextjs` and configure the `/sign-in` and `/sign-up` routes.
3. **Migrate Icons**: Consider replacing Google Material Symbols with `lucide-react` for better compatibility with shadcn/ui, or standardize the usage of Material Symbols.
4. **Database Scaffolding**: Setup `supabase-js` and create the `/lib/db/supabase.ts` file to prepare for dynamic data replacing the current mock data.
