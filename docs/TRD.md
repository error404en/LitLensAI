# Technical Requirements Document (TRD)

## 1. System Architecture
LitLens AI uses a decoupled client-server architecture. 
- A **Next.js frontend** handles the user interface, file uploads, and displaying AI results.
- A **FastAPI backend** manages API requests, orchestrates AI tasks (using OpenAI), and interfaces with databases.
- **Clerk** handles authentication.
- **PostgreSQL** stores relational data (users, projects, document metadata).
- **ChromaDB** acts as the vector database for storing text chunk embeddings for RAG (Retrieval-Augmented Generation).

## 2. Technology Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Vector Search**: ChromaDB
- **Authentication**: Clerk
- **AI/LLM**: OpenAI API

## 3. System Components
### 3.1. Frontend (Next.js)
- Implements Server Components and App Router for optimal performance.
- Integrates `@clerk/nextjs` for secure authentication routes.
- Tailwind CSS for responsive and modern UI styling.

### 3.2. Backend (FastAPI)
- Exposes RESTful endpoints for document upload, processing, and AI generation.
- Validates Clerk JWT tokens for protected routes.
- Uses standard Python tools (e.g., `pypdf`, `langchain`) for PDF parsing and chunking.

### 3.3. Data Storage
- **PostgreSQL**: Stores users, projects, and document references.
- **ChromaDB**: Stores vector embeddings of document chunks to enable semantic search across papers.

## 4. Security & Compliance
- Passwords are not handled directly; Clerk manages all auth.
- Backend validates Clerk session tokens via JWKS.
- PDFs are temporarily stored or stored securely with presigned URLs.
