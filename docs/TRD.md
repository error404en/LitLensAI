# Technical Requirements Document (TRD)

## 1. System Architecture
LitLens AI uses a unified Next.js full-stack architecture leveraging Server Components and API Routes. 
- **Next.js (App Router)** handles the user interface, routing, and backend API handlers.
- **Inngest** manages background jobs and event-driven orchestration for processing long-running tasks like document chunking and AI summarization.
- **Clerk** handles robust user authentication and session management.
- **Supabase (PostgreSQL & Storage)** stores relational data (projects, documents, summaries) and securely hosts the uploaded PDF files.
- **Qdrant** acts as the vector database for storing text chunk embeddings for RAG (Retrieval-Augmented Generation).
- **LangChain** orchestrates LLM prompt chains and document parsing using the OpenAI API.

## 2. Technology Stack
- **Core Framework**: Next.js 15, TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Relational Database & Blob Storage**: Supabase
- **Vector Search**: Qdrant
- **Background Jobs**: Inngest
- **AI/LLM Engine**: OpenAI API + LangChain
- **Security**: Arcjet (for rate limiting and bot protection)

## 3. System Components
### 3.1. Frontend & API Routing (Next.js)
- Implements React Server Components (RSC) for optimal performance and secure data fetching.
- Integrates `@clerk/nextjs` middleware to protect `/dashboard` and API routes.
- Exposes `/api/upload`, `/api/inngest`, and `/api/search` endpoints.

### 3.2. Background Worker Pipeline (Inngest + LangChain)
- Intercepts `paper/uploaded` events to decouple heavy AI workloads from user-facing API routes.
- Uses LangChain loaders (`PDFLoader`) and text splitters to securely parse Supabase-hosted PDFs.
- Generates structured summaries (JSON format) using LLM chains and saves them to PostgreSQL.

### 3.3. Data Storage
- **Supabase (PostgreSQL)**: Stores user references, project state, document statuses, and structured AI summaries.
- **Qdrant**: Stores high-dimensional vector embeddings (`text-embedding-3-small`) of document chunks mapped with `paper_id` and `project_id` payload filters to enable highly targeted semantic search.

## 4. Security & Compliance
- **Authentication**: No passwords stored; Clerk handles all login and 2FA flows securely.
- **Authorization**: Supabase Row Level Security (RLS) policies strictly isolate data by user ID.
- **File Security**: PDFs are stored securely in Supabase Storage buckets with strict RLS policies prohibiting public access.
- **API Protection**: Arcjet protects backend upload and AI endpoints from abuse or rate-limit exhaustion.
