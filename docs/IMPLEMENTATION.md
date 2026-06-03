# Implementation Plan - LitLens AI (Phase 1)

## Phase 1: Environment Setup & Infrastructure (Days 1-2)
- [ ] Initialize Next.js app with TypeScript and Tailwind CSS.
- [ ] Initialize FastAPI backend environment (Poetry or venv, `requirements.txt`).
- [ ] Set up PostgreSQL database (e.g., via Supabase) and enable the `pgvector` extension.
- [ ] Configure AWS S3 or Supabase Storage for PDF file handling.

## Phase 2: Core API & Database Models (Days 3-4)
- [ ] Define SQLAlchemy / SQLModel schemas based on `SCHEMA.md`.
- [ ] Implement backend CRUD endpoints for Projects and Documents.
- [ ] Set up basic authentication (JWT or Supabase Auth) on backend and frontend.

## Phase 3: Document Processing Pipeline (Days 5-7)
- [ ] Implement PDF upload endpoint in FastAPI.
- [ ] Integrate PDF text extraction (e.g., `PyMuPDF` or `pdfplumber`).
- [ ] Implement text chunking strategy (e.g., recursive character splitter).
- [ ] Generate embeddings using OpenAI API (`text-embedding-3-small`) and store in `document_chunks`.

## Phase 4: AI Feature Implementation (Days 8-10)
- [ ] **Summarization:** Prompt engineering to extract structured summaries post-upload. Store in `documents.summary_json`.
- [ ] **Comparison Matrix:** Endpoint that retrieves summaries and key chunks of selected papers and prompts LLM to generate a comparison table.
- [ ] **Gap Analysis & Drafter:** Endpoints utilizing RAG to generate literature review drafts and identify gaps across project documents.

## Phase 5: Frontend Integration & UI/UX (Days 11-14)
- [ ] Build Dashboard and Project creation UI.
- [ ] Build Document Upload interface with progress indicators.
- [ ] Implement Library view displaying paper metadata and summaries.
- [ ] Build the "Workspace" UI with tabs for Summary, Comparison, and Review Draft.
- [ ] Final end-to-end testing, bug fixing, and deployment to Vercel/Render.
