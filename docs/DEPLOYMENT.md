# Deployment & Production Operations

LitLens AI is designed to be deployed on Vercel, utilizing Supabase for managed PostgreSQL storage and Qdrant for managed Vector DB storage.

## 🚀 Deployment Steps

1. **Clone & Push**: Push the repository to your own GitHub organization.
2. **Vercel Setup**: Import the repository into Vercel. Select `Next.js` as the framework preset.
3. **Environment Variables**: Copy all variables from `.env.example` into the Vercel Environment Variables settings.
   - *CRITICAL*: Ensure `SUPABASE_SERVICE_ROLE_KEY` is set securely. If missing, the app will refuse to boot due to the Zod environment schema.
4. **Deploy**: Trigger a Vercel deployment.

## 🗄️ Database Migrations

LitLens AI uses Supabase local development for migrations.

1. **Link Project**: `npx supabase link --project-ref <your-ref>`
2. **Push Schema**: `npx supabase db push`

*Note on Rollbacks*: Always write **additive-only** migrations. Do not drop columns that the currently deployed codebase relies on. If you need to roll back a Vercel deployment, the database schema must remain compatible with the older code.

## 📡 Background Workers (Inngest)

Vercel Serverless Functions have a maximum timeout (usually 10s on Hobby, 60s on Pro). Processing a 50-page PDF takes longer than this.

We use **Inngest** to bypass this limit.
1. Connect your Vercel project to the Inngest dashboard.
2. Inngest will automatically discover the `/api/inngest` webhook.
3. When a user uploads a file, the API immediately responds with a 200 OK to the client, while Inngest queues the `paper/uploaded` event and executes the heavy LLM/Embedding pipeline asynchronously in the background.

## 🛑 Rollback Strategy

1. **Identify Failure**: Use `/api/health` and Vercel Logs (or DataDog if configured via `StructuredLogger`).
2. **Revert Static Assets**: In the Vercel Dashboard, click "Promote to Production" on the previous successful deployment. This is instantaneous.
3. **Data Integrity**: Because migrations are additive-only, no database rollback is required. User data remains intact.
