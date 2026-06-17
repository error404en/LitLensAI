# LitLens AI Development History & Phase Documentation

This document serves as a comprehensive, highly detailed record of the development phases, tracking the evolution of the architecture, specific files, features, and production hardening of LitLens AI.

---

## Phase 1: Frontend Foundation & Design System
**Objective:** Establish the foundational web application shell and design parameters.
- **Framework Initialization:** Bootstrapped the Next.js 15 application utilizing the App Router and strict TypeScript configuration.
- **Styling Architecture:** Configured Tailwind CSS v4 alongside `shadcn/ui` to build a modular, accessible, and easily themeable component library.
- **Core Layouts:** 
  - `app/layout.tsx`: Root layout implementing global providers and fonts (Inter & Geist).
  - `app/page.tsx`: Marketing landing page.
  - `app/dashboard/layout.tsx`: Dashboard shell featuring the `SideNavBar` and `TopNavBar`.
- **Design Tokens:** Established core design tokens, typography scales, and dark mode foundations in `app/globals.css` and `tailwind.config.ts`.
- **Iconography:** Integrated Google Material Symbols Outlined for a clean, consistent visual language.

## Phase 2: Authentication & Security
**Objective:** Secure the platform, manage user sessions, and prevent abuse.
- **Clerk Integration:** Wrapped the root layout with `<ClerkProvider>` for seamless and secure user authentication.
- **Auth UI:** Built custom Sign-In (`app/(auth)/sign-in`) and Sign-Up (`app/(auth)/sign-up`) routing flows.
- **Route Protection:** Created `middleware.ts` utilizing `clerkMiddleware` to secure all `/dashboard(.*)` routes.
- **Arcjet Policies:** Implemented `lib/arcjet/client.ts` to configure strict rate-limiting and bot protection policies, ensuring secure access to critical backend API endpoints.

## Phase 3: Database & Storage Setup
**Objective:** Implement persistent relational data storage and binary file handling.
- **Supabase Configuration:** Configured Supabase PostgreSQL as the primary relational database.
- **Schema Design:** Designed and applied the database schema including:
  - `projects`, `papers`, `summaries`
  - `conversations`, `messages` (for AI chat)
  - `annotations`, `bookmarks`, `highlights` (for document interactions)
- **Object Storage:** Configured Supabase Storage buckets (`litlens-papers`) specifically for secure PDF uploads.
- **Database Clients:** Developed strongly typed database clients in `lib/supabase/client.ts` handling edge cases with Next.js dev server types (`@ts-expect-error`).

## Phase 4: Project and Paper Management
**Objective:** Enable users to create workspaces and upload research material.
- **Dashboard Interfaces:** Developed the Projects Dashboard UI (`app/dashboard/page.tsx`).
- **Data Access Layer:** Implemented `services/projects.service.ts` to handle Project CRUD (Create, Read, Update, Delete) operations.
- **Upload Component:** Built the `UploadDropzone.tsx` interface featuring drag-and-drop support, progress tracking (`UploadProgress.tsx`), and file preview (`UploadFilePreview.tsx`).
- **Upload Routing:** Created the `/api/upload/route.ts` API route linking Arcjet validation, Supabase Storage uploads, and the insertion of initial database records with "pending" statuses.
- **State Management:** Set up Zustand stores (`stores/project.store.ts`, `stores/upload.store.ts`) and TanStack React Query hooks (`hooks/useProject.ts`) to manage client-side state.

## Phase 5: Document Processing Pipeline
**Objective:** Set up robust, scalable asynchronous background processing for heavy document parsing.
- **Inngest Configuration:** Configured Inngest (`lib/inngest/client.ts`) for asynchronous background job processing to avoid API route timeouts.
- **Event Triggers:** Created the `paper.uploaded` event trigger and the `processPaper` function (`lib/ai/pipeline/functions.ts`).
- **PDF Extraction:** Integrated `pdf-parse` in `lib/ai/parser/pdf.parser.ts` to reliably execute text extraction from binary buffers stored in Supabase.
- **Text Chunking:** Developed recursive character text splitting logic in `services/ai-pipeline.service.ts` to cleanly break down large academic documents into contextually aware chunks.

## Phase 6: AI Summarization System
**Objective:** Auto-generate structured metadata upon document ingestion.
- **Prompt Engineering:** Developed LangChain prompt templates in the pipeline service for structured information extraction.
- **LLM Integration:** Integrated OpenAI models to automatically analyze text and generate abstract summaries, methodology extraction, keywords, and key findings.
- **Metadata Persistence:** Saved structured metadata back into the `papers` table in Supabase as a `JSONB` payload.
- **Live UI Updates:** Built `hooks/useSupabaseRealtime.ts` to subscribe to PostgreSQL changes, proactively updating the UI to track processing states (pending → processing → chunking → embedding → completed) in real-time.

## Phase 7: Semantic Search & Retrieval
**Objective:** Enable high-performance, vector-based semantic search across academic literature.
- **Qdrant Vector DB:** Set up Qdrant collections for fast, scalable vector storage (`lib/ai/vector/qdrant.client.ts`).
- **Embedding Generation:** Configured the pipeline to generate dense vector embeddings for text chunks using OpenAI's `text-embedding-3-small` model.
- **Vector Payloads:** Attached detailed payloads to Qdrant points containing `paperId`, `projectId`, `chunkId`, and text content for highly scoped and pre-filtered vector searches.
- **Search Repositories:** Developed `lib/repositories/retriever.repository.ts` to execute similarity searches against the Qdrant database.

## Phase 8: Comparison Engine
**Objective:** Contrast methodologies and findings across multiple papers.
- **Compare UI:** Scaffolded the Comparison Engine interface inside the project workspace (`app/dashboard/projects/[projectId]/compare/page.tsx`).
- **Selection Logic:** Enabled multi-paper selection functionality across the project grid.
- **Synthesis:** Utilized the orchestration layer to synthesize comparison matrices, summarizing key differences and similarities utilizing structured LLM outputs based on the pre-extracted metadata and retrieved chunks.

## Phase 9: Research Gap Analysis
**Objective:** Auto-identify missing research areas and literature voids.
- **Data Aggregation:** Aggregated 'Future Work' and 'Limitations' sections from all processed papers within a specific project.
- **LLM Analysis:** Synthesized project-wide research gap reports using deep LLM analysis.
- **Insights Display:** Displayed generated actionable insights within the project dashboard, guiding researchers toward high-value areas of study.

## Phase 10: Literature Review Generator
**Objective:** Auto-draft complex academic reviews based on selected literature.
- **Generation Pipeline:** Built a multi-step generation pipeline consisting of Outline Generation → Drafting via Retrieval-Augmented Generation (RAG) → Document Assembly.
- **Citation Injection:** Implemented logic to intelligently inject inline citations mapping back to specific uploaded papers, chunks, and exact page numbers.
- **Document Export:** Allowed users to generate cohesive, exportable review documents directly in the platform.

---

## Phase 11: AI Processing Infrastructure
**Objective:** Re-architect the AI backend for maximum reusability, decoupling it entirely from UI logic.
- **Architecture Restructuring:** Established a clean, modular AI folder structure (`lib/ai/retriever`, `context`, `prompt`, `memory`, `stream`, `providers`, `ranking`).
- **Separation of Concerns:** Strictly decoupled business logic from orchestration logic, prepping the codebase to scale cleanly for highly complex, multi-agent AI interactions.

## Phase 11B: Semantic Retrieval & AI Orchestration
**Objective:** Build heavily typed, reusable semantic retrieval and context assembly layers.
- **Retriever Layer:** Developed `SemanticRetriever` (`lib/ai/retriever/semantic-retriever.ts`) offering specialized operations for `retrieveTopK`, `retrieveByProject`, `retrieveByPaper`, and `retrieveBySelection`.
- **Ranking Layer:** Developed the `RankingStrategy` interface and `HybridRanker` (`lib/ai/ranking/hybrid-ranker.ts`), introducing metadata, recency, and project weighting over raw cosine similarity to massively improve search relevance.
- **Context Builders:** Implemented robust `ContextBuilder` (`lib/ai/context/context-builder.ts`) and `PromptBuilder` utilities to deterministically construct LLM contexts without string-concatenation errors.
- **Memory Management:** Defined `ConversationMemory` logic mapping directly to the `conversations` database table.

## Phase 11C: Universal AI Orchestrator
**Objective:** Funnel all AI features through a single, observable, and strictly managed entry point.
- **The Orchestrator:** Created `AIOrchestrator` (`lib/ai/orchestrator/AIOrchestrator.ts`) as the central, unbreakable gateway for all AI tasks (Chat, Summarize, Compare, Review).
- **Registries:** Defined `TaskRegistry` and `FeatureRegistry` to map broad UI requests to exact, immutable backend execution paths and default instructions.
- **Execution Context:** Implemented strictly typed `ExecutionContext` to prevent payload drift.
- **Infrastructure Modules:** Developed `ResponseFormatter` (handling JSON parsing fallbacks), `StreamingManager` (guaranteeing stable `AsyncIterable` event yields), `RetryPolicy` (exponential backoff), and `RateLimiter`.
- **Cost Estimation:** Integrated `TokenEstimator` (`lib/ai/stream/token-estimator.ts`) for real-time heuristic usage tracking during streaming.

## Phase 11.5: Production Hardening & AI Core Optimization
**Objective:** Transform the codebase to meet enterprise production standards, eliminating all structural vulnerabilities.
- **Strict TypeScript:** Conducted a massive sweep purging all `any`, `ts-ignore`, and unknown casts across `lib/repositories/*` and `lib/ai/*`. Enforced strict interfaces for all Supabase mapped rows (e.g., `ProjectRow`, `MessageRow`, `HighlightRow`).
- **Multi-tier Caching:** Built a caching interface (`lib/ai/cache/interface.ts`) with a fully typed `MemoryCache` implementation (handling Prompts and Retrievals), architecturally ready to be hot-swapped for Redis/Upstash.
- **Multi-Provider Architecture:** Abstracted AI providers into the `AIProvider` interface. Fully implemented `OpenAIProvider`, and created strictly typed stubs for `ClaudeProvider`, `GeminiProvider`, and `LocalProvider`, seamlessly mapped inside a dynamic `ProviderRegistry` (`lib/ai/providers/registry.ts`).
- **Observability:** Implemented `StructuredLogger` (`lib/ai/orchestrator/StructuredLogger.ts`) for outputting logs in easily parsed JSON formats for DataDog/ELK. Created a heavily typed error hierarchy (`lib/errors/index.ts` including `DatabaseError`, `ProviderError`, `ValidationError`).
- **Health Checks:** Created the `HealthCheckService` (`services/health-check.service.ts`) to dynamically and asynchronously probe Supabase, Qdrant, and OpenAI uptime statuses.
- **Linting & Hooks:** Cleared all critical ESLint errors across the project, cleanly mitigating React hook cascading render edge cases in legacy hooks (`useProject.ts`, `useProjectActivity.ts`, `useProjectStats.ts`) without redesigning UI flows.

---

## Phase 12: Research Intelligence Hub
**Objective:** Build a unified, high-performance, Notion/Linear-style workspace mapping papers, AI insights, and chronological activities together.
- **Layout Engine:** Designed a responsive, multi-zone layout structure (`HubLayout.tsx`) integrating dynamic sidebars and floating action centers for `/dashboard/projects/[id]/intelligence`.
- **Local State Management:** Built a localized Zustand store (`stores/intelligence.store.ts`) isolating the hub's UI state (sidebar toggles, saved views, insight expansions) to avoid global state clashes.
- **Service Layer Abstraction:** Aggregated complex computations into headless services: `intelligence.service.ts`, `project-health.service.ts`, `insights.service.ts`, and `research-feed.service.ts`.
- **Custom Hooks:** Constructed deeply-typed, composable TanStack Query hooks (`useProjectIntelligence`, `useResearchFeed`, `useProjectHealth`, `useInsights`) wrapping the hub services.
- **Dynamic AI Contexts:** Engineered the `InsightCard` component. Each card acts independently, managing its own loading states while asynchronously executing `AIOrchestrator` payloads (Novel Contributions, Trends, Methodologies).
- **Activity Feed & Health Stats:** Created chronological timeline rendering (`ResearchFeed`) and `ProjectHealth` visual metric tracking (knowledge coverage, completion percentage, AI interaction counts).
- **Strict Compliance:** Verified that the entirely new frontend infrastructure generated 0 `any` overrides and 0 ESLint errors during compilation.
