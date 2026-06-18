-- Phase 11: AI Processing Pipeline Schema

-- Enable pgvector extension (if using postgres for vectors too, though we are using Qdrant primarily)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Pipeline Jobs
CREATE TABLE IF NOT EXISTS IF NOT EXISTS public.pipeline_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'chunking', 'embedding', 'completed', 'failed', 'cancelled')),
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Processing Logs
CREATE TABLE IF NOT EXISTS IF NOT EXISTS public.processing_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.pipeline_jobs(id) ON DELETE CASCADE,
    step TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Paper Chunks
CREATE TABLE IF NOT EXISTS IF NOT EXISTS public.paper_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    token_count INTEGER NOT NULL,
    chunk_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Vector Metadata
-- Links postgres chunks to Qdrant UUIDs
CREATE TABLE IF NOT EXISTS IF NOT EXISTS public.vector_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
    chunk_id UUID NOT NULL REFERENCES public.paper_chunks(id) ON DELETE CASCADE,
    qdrant_point_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: 'embeddings' table mentioned in prompt is skipped in Postgres if using Qdrant directly, 
-- but we create it here just to satisfy the explicit database schema requirement if not using pgvector.
-- In our setup, Qdrant handles the actual vector. 
-- Wait, the prompt says "Create tables: paper_chunks, embeddings...". Let's create an embeddings table just in case they meant for pgvector.
CREATE TABLE IF NOT EXISTS IF NOT EXISTS public.embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chunk_id UUID NOT NULL REFERENCES public.paper_chunks(id) ON DELETE CASCADE,
    -- vector column would go here if using pgvector: embedding vector(1536)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_pipeline_jobs_paper_id ON public.pipeline_jobs(paper_id);
CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_pipeline_jobs_status ON public.pipeline_jobs(status);
CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_paper_chunks_paper_id ON public.paper_chunks(paper_id);
CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_vector_metadata_paper_id ON public.vector_metadata(paper_id);
CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_vector_metadata_chunk_id ON public.vector_metadata(chunk_id);

-- RLS (Restrict to server-side only for these tables to prevent frontend exposure)
ALTER TABLE public.pipeline_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vector_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embeddings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read pipeline_jobs for their papers
CREATE POLICY "Users can read their own pipeline jobs"
    ON public.pipeline_jobs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.papers p 
            WHERE p.id = pipeline_jobs.paper_id AND p.user_id = auth.uid()
        )
    );

-- Allow authenticated users to read paper_chunks for their papers
CREATE POLICY "Users can read their own paper chunks"
    ON public.paper_chunks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.papers p 
            WHERE p.id = paper_chunks.paper_id AND p.user_id = auth.uid()
        )
    );

-- Other tables remain backend-only (Service Role bypasses RLS)
