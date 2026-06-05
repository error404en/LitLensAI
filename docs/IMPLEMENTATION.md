# Implementation Plan: LitLens AI

## Project Overview
LitLens AI is an AI-powered research assistant for processing and interacting with research papers (PDFs). The system helps researchers quickly understand, compare, and synthesize knowledge from academic literature.

## Architecture Flow
User Upload PDF → Arcjet Validation → Store File in Supabase Storage → Create Database Record → Trigger Inngest Event → LangChain PDF Processing → Text Chunking → Generate Embeddings → Store Vectors in Qdrant → Generate Structured Summary → Save Results to PostgreSQL → Expose Through UI

## Recommended Folder Structure
```text
/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── projects/[projectId]/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── inngest/route.ts
│   │   ├── upload/route.ts
│   │   └── search/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn/ui)
│   ├── shared/
│   ├── projects/
│   ├── papers/
│   └── search/
├── lib/
│   ├── ai/
│   │   ├── langchain.ts
│   │   ├── embeddings.ts
│   │   └── prompts.ts
│   ├── db/
│   │   ├── schema.ts
│   │   └── supabase.ts
│   ├── inngest/
│   │   ├── client.ts
│   │   └── functions.ts
│   ├── qdrant/
│   │   └── client.ts
│   └── arcjet/
│       └── client.ts
├── types/
└── docs/
```

## Database Schema Overview (PostgreSQL via Supabase)
- **Users**: Managed primarily via Clerk.
- **Projects**: `id`, `user_id`, `title`, `description`, `created_at`, `updated_at`
- **Papers**: `id`, `project_id`, `user_id`, `file_url`, `file_name`, `status` (pending, processing, completed, failed), `metadata` (JSONB), `created_at`
- **Summaries**: `id`, `paper_id`, `abstract_summary`, `methodology`, `datasets_used`, `key_findings`, `limitations`, `future_work`

## Inngest Event Structure
- `paper/uploaded`: Triggers the document processing pipeline.
  - Data payload: `paperId`, `fileUrl`, `userId`, `projectId`
- `paper/processed`: Triggers notification or UI update upon completion.
- `paper/failed`: Handles error logging and user notification.

## Qdrant Collection Design
- **Collection Name**: `litlens_paper_chunks`
- **Vector Size**: `1536` (OpenAI `text-embedding-3-small`)
- **Distance Metric**: Cosine
- **Payload Indexing**:
  - `paper_id` (Keyword) for filtering by specific papers.
  - `project_id` (Keyword) for cross-paper search within a project.
  - `chunk_index` (Integer) for ordering.
  - `text` (Text) - not indexed, stored for retrieval.

---

## Phase 1: Frontend Foundation & Design System
**Objective:** Set up the Next.js application, basic styling, and component library.
**Tasks:**
- Initialize Next.js 15 app with App Router and TypeScript.
- Configure Tailwind CSS.
- Install and configure `shadcn/ui`.
- Create base layouts (Marketing, Dashboard).
**Deliverables:** Empty functional shell with a working design system and layout.
**Folder Structure Impact:** Creates base `/app`, `/components/ui`.
**Estimated Time:** 1 Day
**Risks:** Compatibility issues between Next.js 15 and `shadcn/ui` components (needs careful installation).
**Success Criteria:** Application runs locally, typography and colors are set, basic UI components render correctly.

## Phase 2: Authentication & Security
**Objective:** Implement secure user authentication and basic route protection.
**Tasks:**
- Set up Clerk application and obtain API keys.
- Integrate Clerk provider in root layout.
- Build Sign In / Sign Up pages.
- Implement Arcjet for rate-limiting and bot protection on key routes.
**Deliverables:** Working authentication flow and protected dashboard routes.
**Folder Structure Impact:** Creates `/app/(auth)` and Arcjet client in `/lib/arcjet`.
**Estimated Time:** 1 Day
**Risks:** Improper configuration leading to exposed protected routes.
**Success Criteria:** Users can sign up, log in, log out, and are redirected appropriately. Arcjet blocks abuse attempts.

## Phase 3: Database & Storage Setup
**Objective:** Configure Supabase PostgreSQL and Storage.
**Tasks:**
- Create Supabase project.
- Define database schema (Projects, Papers, Summaries).
- Create Supabase Storage bucket for PDFs.
- Implement `/lib/db/supabase.ts` for backend database interaction.
**Deliverables:** Working database connection and schema applied. Storage bucket ready.
**Folder Structure Impact:** Creates `/lib/db` schema definitions.
**Estimated Time:** 1 Day
**Risks:** RLS (Row Level Security) misconfigurations causing data leaks or access blocks.
**Success Criteria:** Able to programmatically insert and read database records and upload to the storage bucket.

## Phase 4: Project and Paper Management
**Objective:** Build the core UI and logic for managing projects and uploading papers.
**Tasks:**
- Build Projects Dashboard UI.
- Implement Create/Edit/Delete Project API routes and UI.
- Build Paper Upload UI with drag-and-drop support.
- Implement API route to handle upload (Arcjet validation -> Supabase Storage -> DB Record creation).
**Deliverables:** Functional dashboard to create projects and upload papers.
**Folder Structure Impact:** Expands `/app/(dashboard)` and adds `/api/upload`.
**Estimated Time:** 2 Days
**Risks:** Handling large PDF uploads efficiently.
**Success Criteria:** Users can create a project, upload a PDF, see it in the list with a "pending" status.

## Phase 5: Document Processing Pipeline
**Objective:** Set up asynchronous background processing for uploaded papers.
**Tasks:**
- Integrate Inngest and set up the `/api/inngest` endpoint.
- Create `paper/uploaded` Inngest function.
- Integrate LangChain `PDFLoader` to extract text from the stored PDF.
- Implement LangChain text chunking (e.g., `RecursiveCharacterTextSplitter`).
**Deliverables:** Background job that successfully downloads a PDF and extracts/chunks the text.
**Folder Structure Impact:** Creates `/lib/inngest` and `/lib/ai/langchain.ts`.
**Estimated Time:** 2 Days
**Risks:** Parsing complex PDFs (multi-column, heavily math-based) accurately.
**Success Criteria:** Uploading a PDF successfully triggers a background job that parses the document into text chunks.

## Phase 6: AI Summarization System
**Objective:** Generate structured metadata and summaries from the extracted text.
**Tasks:**
- Create LangChain prompt templates for extracting abstract, methodology, findings, etc.
- Call OpenAI GPT-5 (or equivalent) to process the full text or aggregated chunks into the required structured format.
- Save the structured summary back to the Supabase database.
- Update the paper status to "completed".
**Deliverables:** Structured summary generated and saved per paper.
**Folder Structure Impact:** Adds `/lib/ai/prompts.ts`.
**Estimated Time:** 2 Days
**Risks:** Hitting OpenAI token limits for very large papers; prompt hallucination.
**Success Criteria:** Paper view UI correctly displays the generated structured summary.

## Phase 7: Semantic Search & Retrieval
**Objective:** Implement semantic search across all uploaded papers using vector embeddings.
**Tasks:**
- Generate embeddings for text chunks using OpenAI `text-embedding-3-small` during the processing pipeline (Phase 5 extension).
- Set up Qdrant Cloud and create collections.
- Store chunks and embeddings in Qdrant with `paper_id` and `project_id` payloads.
- Build Search UI and `/api/search` endpoint utilizing Qdrant similarity search.
**Deliverables:** Working search bar returning relevant chunks and citations.
**Folder Structure Impact:** Creates `/lib/qdrant` and expands `/components/search`.
**Estimated Time:** 3 Days
**Risks:** Poor search relevance due to sub-optimal chunk sizes or missing metadata.
**Success Criteria:** Searching for a concept returns accurately retrieved chunks with source citations.

## Phase 8: Comparison Engine
**Objective:** Enable comparison across multiple papers.
**Tasks:**
- Build UI to select multiple papers within a project.
- Implement an endpoint that retrieves the summaries of selected papers.
- Use an LLM prompt to generate a comparison matrix based on the summaries and key extracted attributes.
**Deliverables:** A visual comparison matrix or table between selected papers.
**Folder Structure Impact:** Creates `/app/(dashboard)/projects/[projectId]/compare/page.tsx`.
**Estimated Time:** 2 Days
**Risks:** Comparing highly disparate papers yielding generic or unhelpful matrices.
**Success Criteria:** User can select 2-5 papers and view a generated comparison matrix highlighting differences in methodology and findings.

## Phase 9: Research Gap Analysis
**Objective:** Identify unexplored directions across a project's papers.
**Tasks:**
- Implement an API endpoint that aggregates all 'Future Work' and 'Limitations' sections of a project.
- Use an LLM to analyze these combined inputs and synthesize a "Research Gap" report.
- Build UI to display the generated insights.
**Deliverables:** A dedicated view for Research Gaps within a project.
**Folder Structure Impact:** Creates `/app/(dashboard)/projects/[projectId]/gaps/page.tsx`.
**Estimated Time:** 2 Days
**Risks:** Generating redundant or overly broad gaps rather than actionable insights.
**Success Criteria:** Generating a coherent report pointing out specific unexplored intersections in the uploaded literature.

## Phase 10: Literature Review Generator
**Objective:** Generate a structured literature review based on selected papers.
**Tasks:**
- Build UI for Literature Review generation configuration (e.g., topic input, paper selection).
- Implement multi-step generation pipeline (Outline generation -> Section drafting using RAG -> Assembly).
- Ensure citations refer back to specific uploaded papers.
**Deliverables:** A drafted literature review document with inline citations.
**Folder Structure Impact:** Creates `/app/(dashboard)/projects/[projectId]/review/page.tsx`.
**Estimated Time:** 3 Days
**Risks:** The generated review might read disjointedly or fail to properly synthesize the narrative.
**Success Criteria:** The system successfully outputs a structured review combining insights from multiple papers.

## Phase 11: Testing & Optimization
**Objective:** Ensure reliability, security, and performance.
**Tasks:**
- Write unit/integration tests for critical paths (Inngest functions, Qdrant retrieval).
- Optimize slow LangChain operations using batching.
- Implement error boundary and toast notifications on the UI.
**Deliverables:** Stabilized application with test coverage.
**Folder Structure Impact:** Adds `__tests__` directories or `*.test.ts` files.
**Estimated Time:** 2 Days
**Risks:** Edge cases in PDF parsing or concurrent uploads failing silently.
**Success Criteria:** Core upload and search workflows pass automated tests reliably.

## Phase 12: Deployment & Monitoring
**Objective:** Launch to production securely and reliably.
**Tasks:**
- Configure Vercel deployment and environment variables.
- Set up Vercel Analytics / Speed Insights.
- Deploy Inngest to production Vercel branch.
- Final security audit on Arcjet rules and Supabase RLS.
**Deliverables:** Live application on a production domain.
**Folder Structure Impact:** None.
**Estimated Time:** 1 Day
**Risks:** Environment variable mismatches or CORS issues between Vercel and background workers.
**Success Criteria:** The application is live, accessible, and correctly processes PDFs end-to-end in production.

---

## Security Considerations
- **Arcjet**: Protect against bot attacks on authentication and rate-limit API routes (especially AI endpoints).
- **Supabase RLS**: Ensure users can only access `projects`, `papers`, and `summaries` where `user_id == auth.uid()`.
- **Clerk**: Strict session validation.
- **Qdrant**: Ensure payload filtering includes `user_id` or `project_id` to strictly isolate vector search results.

## Cost Optimization Strategies
- Use `text-embedding-3-small` over larger models for fast, cheap, and effective embeddings.
- Limit uploaded PDF sizes and maximum page counts for the MVP.
- Cache common queries and their generated responses if applicable.
- Leverage Supabase Storage and DB free tiers or predictable pricing models.

## MVP Scope vs Future Scope
**MVP Scope:**
- Upload up to 10 papers per project.
- Basic summaries and search within a project.
- Simple cross-paper comparison matrix.
- Linear literature review draft.

**Future Scope:**
- Chat-with-paper interface (conversational RAG).
- Web search integration to automatically find related papers.
- Collaborative projects (multi-user).
- Support for complex mathematical formulas (LaTeX extraction).
- Graph visualization of paper citations.

## Roadmaps
**1-Week Accelerated Roadmap (Hackathon/Prototype Mode):**
- Days 1-2: Setup Next.js, Clerk, Supabase (Phases 1-3).
- Days 3-4: Paper Upload & Basic LangChain summarization synchronously (Skip Inngest/Qdrant initially, basic text extraction) (Phases 4-6).
- Day 5-6: UI polish, Comparison Engine based on summaries (Phase 8).
- Day 7: Deploy to Vercel (Phase 12).

**1-Month Production Roadmap:**
- Week 1: Foundation, Auth, Database, UI Setup (Phases 1-4).
- Week 2: Robust Document Processing, Inngest, LangChain, Summaries (Phases 5-6).
- Week 3: Qdrant, Vector Search, Comparison Engine, Gap Analysis (Phases 7-9).
- Week 4: Lit Review Generator, Testing, Optimization, Deployment (Phases 10-12).
