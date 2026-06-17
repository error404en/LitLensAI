# LitLens AI

**LitLens AI** is an AI-powered research assistant designed to help researchers efficiently navigate, understand, and synthesize large volumes of academic literature. By leveraging advanced Language Models and Vector Search, LitLens AI turns static PDFs into an interactive knowledge base.

---

## 🚀 Features

- **Document Processing**: Upload academic PDFs to automatically extract text, chunk content, and generate vector embeddings.
- **AI Summarization**: Automatically generate structured summaries of uploaded papers (Abstract, Methodology, Key Findings, Limitations, etc.).
- **Semantic Search**: Search across your entire project’s literature library using natural language, retrieving the most relevant sections of your papers.
- **Research Intelligence Hub**: A unified workspace combining timeline activity feeds, dynamic AI insights, project health metrics, and saved views.
- **Cross-Paper Comparison**: Select multiple papers to automatically generate a comparative matrix highlighting differences in methodology and findings.
- **Research Gap Analysis**: Identify unexplored areas and potential future work by aggregating limitations and future directions across multiple papers.
- **Literature Review Generator**: Draft complex literature reviews, complete with inline citations mapping directly back to the uploaded papers.

## 📊 Project Metrics & Status

- **Development Progress**: 12 Engineering Phases Completed (MVP Fully Launched).
  - Core Modules: Research Intelligence Hub, Comparison Engine, Gap Analysis, Literature Review Generation.
  - Platform Foundation: Clerk Authentication, Supabase, Qdrant Vector Search, Arcjet security.
  - AI Infrastructure: Enterprise-grade Provider-Agnostic AI Orchestrator, Multi-tier Caching, Context Building, and Token Tracking.
- **Architecture Compliance**: 100% adherence to Clean Architecture (`UI → Hooks → Zustand → Services → Repositories → Supabase/Qdrant`).
- **State Management**: Zero prop-drilling. Fully decoupled state using localized Zustand stores per workspace.
- **Performance Targets**: 
  - **Sub-100ms** UI interactions leveraging React 19 concurrent features.
  - **Streaming RAG Responses** simulating real-time token yield with <200ms TTFB.
  - **O(1) Data Retrieval** through optimized repositories.
- **Code Quality**: Strict TypeScript enforcement (0 `any`, 0 `ts-ignore`), robust Zod schemas, and comprehensive custom error classes.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **State Management**: Zustand, TanStack Query
- **Authentication**: Clerk
- **Security**: Arcjet (Bot protection & Rate limiting)
- **Database & Storage**: PostgreSQL via Supabase, Supabase Storage
- **Background Jobs**: Inngest
- **AI & Orchestration**: LangChain, OpenAI API (GPT-4o/mini), Claude Provider Stubs, Gemini Provider Stubs.
- **Vector Database**: Qdrant Cloud (Cosine Similarity, Hybrid Search)
- **Deployment**: Vercel

## 🏗️ Architecture Flow

1. **User Uploads PDF** via the frontend interface.
2. **Arcjet Validation** ensures the request is secure and within rate limits.
3. The file is stored in **Supabase Storage** and a metadata record is created in **PostgreSQL**.
4. An **Inngest Event** (`paper/uploaded`) is triggered for background processing.
5. **LangChain** loads and chunks the PDF text.
6. Embeddings are generated and stored securely in **Qdrant**.
7. An LLM generates a structured summary, saving metadata back to PostgreSQL.
8. The **Research Intelligence Hub** updates in real-time, providing immediate access to dynamically generated AI insights and semantic retrieval tools.

---

## 💻 Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (>= 18.x)
- npm or yarn or pnpm
- Git

You will also need accounts for:
- [Clerk](https://clerk.com/)
- [Supabase](https://supabase.com/)
- [Qdrant](https://qdrant.tech/)
- [Inngest](https://www.inngest.com/)
- [Arcjet](https://arcjet.com/)
- [OpenAI](https://openai.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/litlens-ai.git
   cd litlens-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy the example environment file and populate it with your keys.
   ```bash
   cp .env.example .env.local
   ```
   *Required Variables:*
   - Clerk Keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)
   - Supabase Keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
   - Inngest Key (`INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`)
   - Qdrant Keys (`QDRANT_URL`, `QDRANT_API_KEY`)
   - OpenAI Key (`OPENAI_API_KEY`)
   - Arcjet Key (`ARCJET_KEY`)

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Documentation

Detailed documentation and plans can be found in the `/docs` directory:
- [Development Phases History](docs/PHASES_DOCUMENTATION.md)
- [Implementation Plan](docs/IMPLEMENTATION.md)
- [Architecture Flow](docs/APP_FLOW.md)
- [Product Requirements (PRD)](docs/PRD.md)
- [Technical Requirements (TRD)](docs/TRD.md)
- [Database Schema](docs/SCHEMA.md)
- [Codebase Analysis](docs/CODEBASE_ANALYSIS.md)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/litlens-ai/issues).

## 📄 License

This project is licensed under the MIT License.
