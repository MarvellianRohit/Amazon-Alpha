-- Create a table to store system knowledge (documentation, architecture, etc.)
CREATE TABLE IF NOT EXISTS public.system_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    embedding vector(768), -- Gemini Pro embedding dimension
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for semantic search
CREATE INDEX IF NOT EXISTS system_knowledge_embedding_idx 
ON public.system_knowledge 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Enable RLS (Optional for now, but good practice)
ALTER TABLE public.system_knowledge ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users (or public for demo)
CREATE POLICY "Allow public read access" ON public.system_knowledge
FOR SELECT USING (true);
