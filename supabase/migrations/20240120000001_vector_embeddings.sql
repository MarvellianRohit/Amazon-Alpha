-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- Add a vector column to the products table
-- We use 768 dimensions which is standard for Gemini Pro / PaLM text-embedding-004
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS embedding vector(768);

-- Create an index for faster similarity search
-- lists = 100 is a good starting point for small to medium datasets
CREATE INDEX IF NOT EXISTS products_embedding_idx 
ON public.products 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
