<div align="center">
  <img src="https://raw.githubusercontent.com/error404en/LitLensAI/main/public/logo.png" alt="LitLens AI Logo" width="120" />

  # LitLens AI

  **Enterprise-grade AI research assistant for navigating, understanding, and synthesizing academic literature via RAG.**

  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://semver.org)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  
  <p align="center">
    <a href="#-features">Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-documentation">Documentation</a>
  </p>
</div>

---

## 📖 Introduction

### The Problem
Modern academic research is fundamentally broken by volume. Researchers, graduate students, and corporate R&D teams are forced to download hundreds of static PDFs, manually extract insights, and juggle fragmented notes across different applications. This leads to information silos, lost citations, and weeks of wasted time synthesizing literature.

### The Solution
**LitLens AI** transforms static academic PDFs into an interactive, dynamically cross-referenced knowledge base. By leveraging **Retrieval-Augmented Generation (RAG)**, LitLens AI allows researchers to upload vast libraries of literature, chat with their documents, automatically extract key findings, and instantly generate complex literature reviews with 100% accurate inline citations.

It was built with a strict adherence to **Clean Architecture**, decoupled state management, and an enterprise-grade AI orchestration pipeline capable of switching between OpenAI, Claude, and Local models dynamically.

### Screenshots
*(Add your screenshots here)*
![LitLens AI Dashboard](public/logo.png)

## ✨ Features

- **Automated Literature Processing**: Upload PDFs to instantly extract text, chunk content intelligently, and generate vector embeddings via Inngest background workers.
- **AI Document Summarization**: Automatically generate structured overviews (Abstract, Methodology, Key Findings, Limitations) for any uploaded paper.
- **Semantic Vector Search**: Search across your entire project’s literature library using natural language, retrieving the exact paragraphs and pages where your query is answered.
- **Research Intelligence Hub**: A unified workspace combining timeline activity feeds, dynamic AI insights, project health metrics, and saved views.
- **Cross-Paper Comparison Engine**: Select multiple papers and automatically generate a comparative matrix highlighting differences in methodology and empirical findings.
- **Literature Review Generator**: Draft complex, multi-page literature reviews, complete with inline citations mapping directly back to the uploaded source PDFs.
- **Zero-Latency UI**: Built on React 19 concurrent features with optimistic updates, pre-fetching, and decoupled Zustand state stores to eliminate prop-drilling.

## 🏗️ Architecture & Tech Stack

LitLens AI strictly separates concerns using a `UI → Hooks → Zustand → Services → Repositories → DB` layer model.

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **State Management**: Zustand, TanStack React Query
- **Authentication**: Clerk
- **Security**: Arcjet (Bot protection & Rate limiting)
- **Database**: PostgreSQL (Supabase) with Row-Level Security
- **Vector Database**: Qdrant Cloud (Cosine Similarity, Hybrid Search)
- **Background Jobs**: Inngest (Event-driven background processing)
- **AI Orchestration**: LangChain, OpenAI API (GPT-4o/mini)

### AI Pipeline
1. **Ingestion**: PDF texts are extracted via `pdf-parse` within an asynchronous Inngest worker.
2. **Chunking**: Text is split into semantically meaningful chunks using LangChain's `RecursiveCharacterTextSplitter`.
3. **Embedding**: Chunks are embedded using `text-embedding-3-small` and indexed in Qdrant.
4. **Retrieval**: User queries trigger a hybrid search against the Qdrant index.
5. **Generation**: The context is passed to the LLM (GPT-4o) alongside the `AIOrchestrator` to generate responses with direct citation mappings.

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18.x)
- `npm` or `pnpm`

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/error404en/LitLensAI.git
   cd litlens-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys for Clerk, Supabase, Qdrant, Inngest, and OpenAI. LitLens AI utilizes a strictly typed Zod boot sequence; missing keys will prevent the server from starting to ensure production safety.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) and start researching!

## 📂 Documentation

Deep dive into the engineering decisions and architecture of LitLens AI:

- [Architecture & State Management](docs/ARCHITECTURE.md)
- [AI Pipeline & Orchestration](docs/AI_PIPELINE.md)
- [API Reference](docs/API.md)
- [Database & Schema](docs/SCHEMA.md)
- [Deployment & Production Operations](docs/DEPLOYMENT.md)
- [Troubleshooting & Limitations](docs/TROUBLESHOOTING.md)

## 🛡️ Production Operations & Deployment

LitLens AI is engineered for high availability and deep observability:

- **Health Monitoring**: Poll `/api/health` for structured DB and AI connectivity checks.
- **Telemetry**: `StructuredLogger` intercepts all AI events, securely redacting (`[REDACTED]`) API keys, prompts, and tokens before streaming to stdout.
- **Rollback Safety**: Vercel Git-revert compatible. Database migrations are additive-only to prevent catastrophic data loss during rollbacks.

## 📂 Folder Structure

```text
litlens-ai/
├── app/               # Next.js 15 App Router pages and API routes
├── components/        # React components (UI, Layout, Domain-specific)
├── docs/              # Architectural and system documentation
├── hooks/             # Custom React hooks (Data fetching, logic)
├── lib/               # Utilities, Types, AI Providers, Repositories
├── public/            # Static assets
├── services/          # Business logic and external integrations
├── stores/            # Zustand global state stores
└── supabase/          # Database migrations and seed files
```

## 🚀 Future Roadmap

- **v1.1**: Shared Team Workspaces & Collaborative Highlighting.
- **v1.2**: Export literature reviews directly to Microsoft Word (`.docx`).
- **v2.0**: Native Local LLM Support (Ollama integration) for fully offline, privacy-first research.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 📬 Contact

Created by [error404en](https://github.com/error404en) — feel free to reach out with questions or feedback!
