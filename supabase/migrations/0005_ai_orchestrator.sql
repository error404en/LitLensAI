-- Phase 11C: Universal AI Orchestrator Schema

-- 1. AI Executions
CREATE TABLE IF NOT EXISTS public.ai_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
    
    task_name TEXT NOT NULL, -- e.g. 'summarize', 'compare'
    feature_name TEXT NOT NULL, -- e.g. 'AI Chat', 'Review'
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    error_message TEXT,
    
    execution_time_ms INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Usage Metrics
CREATE TABLE IF NOT EXISTS public.ai_usage_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES public.ai_executions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    
    estimated_cost_usd DECIMAL(10, 6) NOT NULL DEFAULT 0.0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Citations
CREATE TABLE IF NOT EXISTS public.ai_citations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES public.ai_executions(id) ON DELETE CASCADE,
    paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
    
    chunk_id TEXT,
    page_number INTEGER,
    text_content TEXT,
    confidence_score DECIMAL(4, 3),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_executions_user_id ON public.ai_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_executions_project_id ON public.ai_executions(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_metrics_user_id ON public.ai_usage_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_citations_execution_id ON public.ai_citations(execution_id);
CREATE INDEX IF NOT EXISTS idx_ai_citations_paper_id ON public.ai_citations(paper_id);

-- RLS
ALTER TABLE public.ai_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_citations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their executions"
    ON public.ai_executions FOR SELECT USING (get_current_user_id()::text = user_id::text);
CREATE POLICY "Users can view their usage"
    ON public.ai_usage_metrics FOR SELECT USING (get_current_user_id()::text = user_id::text);
CREATE POLICY "Users can view their citations"
    ON public.ai_citations FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.ai_executions e 
            WHERE e.id = ai_citations.execution_id AND e.user_id::text = get_current_user_id()::text
        )
    );
