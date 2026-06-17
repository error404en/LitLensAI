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
│   │   ├── projects/[projectId]/intelligence/page.tsx
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
│   ├── intelligence/
│   └── search/
├── lib/
│   ├── ai/
│   │   ├── orchestrator/
│   │   ├── providers/
│   │   ├── retriever/
│   │   └── ranking/
│   ├── db/
│   │   ├── schema.ts
│   │   └── supabase.ts
│   ├── inngest/
│   │   └── client.ts
│   └── arcjet/
│       └── client.ts
├── types/
└── docs/
```

## Database Schema Overview (PostgreSQL via Supabase)
- **Projects**: `id`, `user_id`, `title`, `description`, `status`, `created_at`
- **Papers**: `id`, `project_id`, `user_id`, `file_url`, `status`
- **Summaries**: `id`, `paper_id`, `abstract_summary`, `methodology`, `key_findings`
- **Conversations/Messages**: For tracking RAG interactions via `AIOrchestrator`
- **Activities**: Chronological audit trail of project updates

---

## ✅ Phase 1: Frontend Foundation & Design System (COMPLETE)
**Objective:** Set up the Next.js application, basic styling, and component library.

## ✅ Phase 2: Authentication & Security (COMPLETE)
**Objective:** Implement secure user authentication and basic route protection via Clerk and Arcjet.

## ✅ Phase 3: Database & Storage Setup (COMPLETE)
**Objective:** Configure Supabase PostgreSQL and Storage.

## ✅ Phase 4: Project and Paper Management (COMPLETE)
**Objective:** Build the core UI and logic for managing projects and uploading papers.

## ✅ Phase 5: Document Processing Pipeline (COMPLETE)
**Objective:** Set up asynchronous background processing for uploaded papers via Inngest and LangChain.

## ✅ Phase 6: AI Summarization System (COMPLETE)
**Objective:** Generate structured metadata and summaries from the extracted text.

## ✅ Phase 7: Semantic Search & Retrieval (COMPLETE)
**Objective:** Implement semantic search across all uploaded papers using vector embeddings in Qdrant.

## ✅ Phase 8: Comparison Engine (COMPLETE)
**Objective:** Enable comparison across multiple papers.

## ✅ Phase 9: Research Gap Analysis (COMPLETE)
**Objective:** Identify unexplored directions across a project's papers.

## ✅ Phase 10: Literature Review Generator (COMPLETE)
**Objective:** Generate a structured literature review based on selected papers.

## ✅ Phase 11 & 11.5: AI Processing Infrastructure & Optimization (COMPLETE)
**Objective:** Re-architect the AI backend for maximum reusability, multi-tier caching, provider-agnostic orchestrators, and strict TypeScript compliance.

## ✅ Phase 12: Research Intelligence Hub (COMPLETE)
**Objective:** Launch the flagship, high-performance UI unifying all previously built AI architectures into a Notion/Linear-like workspace.

---

## MVP Scope vs Future Scope
**MVP Scope (FULLY IMPLEMENTED):**
- Upload up to 10 papers per project.
- Semantic vector search and RAG integration.
- Intelligent timeline feeds and real-time processing listeners.
- Comparison matrix, Gap Analysis, and Literature Review Generation via unified `AIOrchestrator`.

**Future Scope:**
- Collaborative projects (multi-user).
- Support for complex mathematical formulas (LaTeX extraction).
- Graph visualization of paper citations.
