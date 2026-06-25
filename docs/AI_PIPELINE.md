# AI Pipeline & Orchestration

LitLens AI leverages a provider-agnostic, multi-tier AI orchestration pipeline designed to abstract away vendor lock-in and optimize for cost and performance through aggressive caching.

## 🧠 The AI Orchestrator

Located at `lib/ai/orchestrator/AIOrchestrator.ts`, this is the brain of the application. It manages context assembly, prompt engineering, execution caching, and telemetry.

### 1. Provider Agnosticism
The orchestrator talks to an `AIProvider` interface. Currently, we use the `LangChainProvider` (OpenAI GPT-4o), but swapping to Claude or a Local LLM (via Ollama) only requires swapping the class injected into the orchestrator, with zero changes to the business logic.

### 2. Multi-tier Caching
To minimize API costs and latency, the Orchestrator implements determinism checks:
- **`RetrievalCache`**: Wraps the `SemanticRetriever`. If a user asks a similar question within the same project, the system retrieves the vector chunks from memory (`base64` hashed cache) instead of hitting Qdrant and the OpenAI Embedding API.
- **`PromptCache`**: Caches the final LLM string output for identical system/user prompt combinations. If the exact same matrix comparison is requested twice, the second load is instant (<50ms).

## 📚 RAG (Retrieval-Augmented Generation) Pipeline

When a user uploads a PDF, the Inngest background worker triggers `processPaper`.

### Step 1: Ingestion & Parsing
The PDF is piped through `pdf-parse` to extract raw string text, stripping away formatting.

### Step 2: Chunking
LangChain's `RecursiveCharacterTextSplitter` divides the text into 1000-character chunks with a 200-character overlap. This overlap ensures contextual integrity across paragraph breaks.

### Step 3: Embeddings
Each chunk is converted into a high-dimensional vector array via the `AIProvider.embedBatch()` function (defaulting to `text-embedding-3-small`).

### Step 4: Storage
The vectors, along with the raw chunk text and metadata (page numbers, paper ID), are uploaded to **Qdrant Cloud**.

### Step 5: Retrieval
During a chat query or synthesis generation:
1. The `SemanticRetriever` embeds the user's question.
2. Qdrant performs a Cosine Similarity Search to find the top `K` most relevant chunks.
3. The `ContextBuilder` formats these chunks into an XML-like structure (`<context><chunk>...</chunk></context>`).
4. The `AIOrchestrator` feeds this context to the LLM, instructing it to answer *only* using the provided chunks, generating inline citations mapped back to the source UUIDs.
