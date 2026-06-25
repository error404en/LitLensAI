# API Reference

LitLens AI relies heavily on Next.js 15 Server Actions for data mutation and direct database RPCs for querying, minimizing traditional REST endpoints. 

However, several background Webhook endpoints exist for asynchronous processing.

## 📡 REST Endpoints

### `GET /api/health`
Monitors the uptime and configuration of the production environment.
**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2026-06-20T12:00:00Z",
  "services": {
    "database": "up",
    "ai_provider": "configured"
  },
  "environment": "production"
}
```

### `POST /api/inngest`
The primary webhook receiver for the Inngest background job queue. This endpoint is secured automatically by the `INNGEST_SIGNING_KEY`.
- Executes `processPaper` events when a PDF is uploaded.
- Handles PDF Parsing, LangChain Vector Chunking, embeddings to Qdrant, and LLM summary generation.

### `POST /api/chat`
Handles AI streaming for the interactive conversational interface.
**Payload:**
```json
{
  "messages": [{ "role": "user", "content": "What are the limitations of paper X?" }],
  "projectId": "uuid"
}
```
**Response:** `text/event-stream` (SSE chunked stream).

## ⚡ Core Domain APIs

LitLens AI relies heavily on Next.js 15 Server Actions and service layer abstractions rather than standard REST controllers. 

### 🔐 Authentication
- **Provider**: Clerk.
- **Implementation**: Handled entirely via standard Clerk middleware (`middleware.ts`) and Clerk React hooks (`useUser`, `useAuth`).
- **Database Link**: Supabase RLS is tied to the Clerk user ID via a custom JWT session exchange.
- **Server Verification**: `auth()` from `@clerk/nextjs` is used in Server Actions to assert ownership.

### 📁 Projects
- **`createProject(payload)`**: Validates schema and scaffolds a new workspace, creating the Supabase row and establishing RLS ownership.
- **`getProjects()`**: Fetches an array of projects ordered by recent activity.
- **`deleteProject(id)`**: Soft or hard deletes a workspace and cascades deletions to related papers.

### 📄 Papers
- **`getPapersByProject(projectId)`**: Queries the `papers` table by the foreign key `project_id`.
- **`getPaper(id)`**: Fetches metadata and the generated AI summary for a single document.
- **`deletePaper(id)`**: Removes the document from the database and triggers vector store cleanup.

### 📤 Uploads
- **`uploadPaperAction(formData)`**: Validates PDF mime-types, uploads the binary to Supabase Storage, and creates a database row marking the status as `processing`.
- **Background Event**: The upload action fires a `paper/uploaded` Inngest event, offloading the CPU-heavy parsing and Qdrant embedding.

### 💬 Chat
- **`streamAssistantResponse(conversationId, prompt, context)`**: Calls the `AIOrchestrator` to stream an SSE chunked response back to the client.
- **`saveUserMessage(conversationId, content)`**: Optimistically persists a user's prompt into the `chat_messages` table.
- **`loadConversations(paperId)`**: Fetches historical chat threads associated with a specific document or project.

## 🛡️ Rate Limiting
All endpoints, including server actions, are inherently protected by Arcjet middleware against bot-nets and DDoS floods.
