# Technical Requirements Document (TRD)

## 1. System Architecture
LitLens AI uses a highly modular, decoupled Next.js full-stack architecture adhering strictly to Clean Architecture (`UI → Hooks → Zustand → Services → Repositories → DB/AI`).
- **Next.js (App Router)** handles the user interface, routing, and backend API handlers.
- **Inngest** manages background jobs and event-driven orchestration for processing long-running tasks.
- **Clerk** handles robust user authentication and session management.
- **Supabase (PostgreSQL & Storage)** stores relational data and securely hosts the uploaded PDF files.
- **Qdrant** acts as the vector database for storing text chunk embeddings for RAG.
- **AI Orchestrator** is a custom-built, enterprise-level gateway that safely funnels all prompt generation, semantic retrieval, cache checks, and API executions to generic Providers.

## 2. Technology Stack
- **Core Framework**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **State Management**: Zustand, TanStack Query
- **Authentication**: Clerk
- **Relational Database & Blob Storage**: Supabase
- **Vector Search**: Qdrant
- **Background Jobs**: Inngest
- **AI/LLM Engine**: OpenAI API + LangChain via Unified Provider Registry
- **Security**: Arcjet

## 3. System Components
### 3.1. Frontend & Architecture
- Localized Zustand stores (`intelligence.store.ts`, `chat.store.ts`) prevent global re-renders.
- TanStack Query hooks fetch data directly from abstract `services/`.
- Strict UI decoupling: Views never call Supabase or OpenAI directly.

### 3.2. Background Worker Pipeline (Inngest + LangChain)
- Intercepts `paper/uploaded` events.
- Uses LangChain loaders (`PDFLoader`) and recursive chunkers.
- Generates structured summaries (JSON format) using LLM chains and saves them to PostgreSQL.

### 3.3. Data Storage
- **Supabase (PostgreSQL)**: Stores user references, project state, timelines, conversations, and summaries.
- **Qdrant**: Stores high-dimensional vector embeddings (`text-embedding-3-small`) mapped with `paper_id` and `project_id`.

### 3.4. AI Infrastructure Core
- **Semantic Retriever**: Encapsulates Qdrant vector retrieval.
- **Hybrid Ranker**: Applies custom scoring formulas weighting cosine similarity with metadata metrics like recency.
- **Provider Registry**: A swappable interface layer (OpenAI, Claude, Gemini).
- **Streaming Manager & Estimator**: Safely handles chunk streaming and parses prompt token costs dynamically.

## 4. Security & Compliance
- **Authentication**: Clerk handles all login flows securely.
- **Authorization**: Supabase Row Level Security (RLS) policies strictly isolate data by user ID.
- **File Security**: PDFs are stored securely in Supabase Storage buckets.
- **API Protection**: Arcjet protects backend upload and AI endpoints.
