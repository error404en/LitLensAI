-- Phase 11B: AI Orchestration & Conversation Memory Schema

-- 1. Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    -- Contextual linkages
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Conversation Messages
CREATE TABLE IF NOT EXISTS public.conversation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('system', 'user', 'assistant')),
    content TEXT NOT NULL,
    
    -- References (JSON containing used chunks, sources, citations)
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Prompt Logs (Optional for analytics/debugging)
CREATE TABLE IF NOT EXISTS public.prompt_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    feature TEXT NOT NULL, -- e.g., 'copilot', 'compare', 'summary'
    prompt TEXT NOT NULL,
    response TEXT,
    tokens_used INTEGER,
    provider TEXT, -- e.g., 'openai'
    model TEXT,
    duration_ms INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_project_id ON public.conversations(project_id);
CREATE INDEX IF NOT EXISTS idx_conversations_paper_id ON public.conversations(paper_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation_id ON public.conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_prompt_logs_user_id ON public.prompt_logs(user_id);

-- RLS Policies
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own conversations
CREATE POLICY "Users can manage their own conversations"
    ON public.conversations
    FOR ALL
    USING (auth.uid() = user_id);

-- Allow users to manage messages in their conversations
CREATE POLICY "Users can manage messages in their conversations"
    ON public.conversation_messages
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations c 
            WHERE c.id = conversation_messages.conversation_id AND c.user_id = auth.uid()
        )
    );

-- Backend mostly handles prompt logs, but allow user select if needed
CREATE POLICY "Users can view their prompt logs"
    ON public.prompt_logs
    FOR SELECT
    USING (auth.uid() = user_id);
