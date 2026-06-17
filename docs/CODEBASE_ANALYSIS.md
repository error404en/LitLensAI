# LitLens AI Codebase Analysis Report

## 1. Existing Routes
- `/` (`app/page.tsx`): Main marketing/landing page.
- `/sign-in/[[...sign-in]]/page.tsx`: Clerk authentication sign-in.
- `/sign-up/[[...sign-up]]/page.tsx`: Clerk authentication sign-up.
- `/dashboard` (`app/dashboard/page.tsx`): Global Dashboard overview.
- `/dashboard/upload` (`app/dashboard/upload/page.tsx`): Dedicated interface for paper uploads.
- `/dashboard/projects/[projectId]/intelligence` (`app/dashboard/projects/[projectId]/intelligence/page.tsx`): The flagship Research Intelligence Hub workspace.
- `/dashboard/projects/[projectId]/compare` (`app/dashboard/projects/[projectId]/compare/page.tsx`): Comparison engine interface.
- `/dashboard/projects/[projectId]/review` (`app/dashboard/projects/[projectId]/review/page.tsx`): Literature review generator workspace.

## 2. Architectural Layers (Clean Architecture)
The codebase strictly separates concerns across the following layers:
1. **UI Components** (`components/`): Dumb presentational components utilizing `shadcn/ui`.
2. **React Hooks** (`hooks/`): TanStack Query data fetching and mutation hooks (e.g., `useProjectIntelligence.ts`).
3. **Zustand Stores** (`stores/`): Pure client-side UI state management (e.g., `intelligence.store.ts`).
4. **Services** (`services/`): Business logic aggregators interacting with repositories (e.g., `insights.service.ts`).
5. **Repositories** (`lib/repositories/`): Data access objects abstracting Supabase logic (e.g., `projects.repository.ts`).
6. **AI Orchestration** (`lib/ai/orchestrator/`): The unified `AIOrchestrator` handling all LangChain/OpenAI calls, parsing, streaming, and rate-limiting.

## 3. Existing AI Infrastructure
- **Providers (`lib/ai/providers/`)**: Provider registry mapping LLM implementations (`OpenAIProvider`, `ClaudeProvider`, `GeminiProvider`).
- **Retrieval (`lib/ai/retriever/`)**: `SemanticRetriever` abstracting Qdrant searches.
- **Ranking (`lib/ai/ranking/`)**: `HybridRanker` weighting embeddings by recency and project alignment.
- **Context & Prompts (`lib/ai/context/`)**: Strict deterministic context builders ensuring safe RAG injections.
- **Observability (`lib/ai/orchestrator/StructuredLogger.ts`)**: Enterprise-grade JSON logging for all AI execution steps.
- **Cost Tracking (`lib/ai/stream/token-estimator.ts`)**: Heuristic logic for tracking prompt tokens in real-time.

## 4. Existing Design System
- Custom Tailwind CSS configuration utilizing v4 (`@tailwindcss/postcss`).
- Global tokens mapped in `globals.css` (e.g., `bg-background`, `text-on-surface`).
- Complex custom layouts combining multiple sidebars with responsive hiding for dashboards.
- Material Symbols Outlined and Lucide React used for iconography.

## 5. Existing APIs & Infrastructure
- **Supabase**: Client configured in `lib/supabase/client.ts` with strict typings in `lib/types.ts`.
- **Inngest**: Background worker functions for chunking PDFs located in `lib/inngest/`.
- **Qdrant**: High-performance semantic vector repository.
- **Arcjet**: Middleware API security routing.

## 6. Current Status
The project has successfully reached MVP completion (Phase 12 complete). The codebase features 0 `any` casts, 0 ESLint errors in core modules, and heavily optimized modular caching layers.
