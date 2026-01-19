-- Function to match related products based on embedding similarity
CREATE OR REPLACE FUNCTION match_products (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  embedding vector(768),
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    products.id,
    products.name,
    products.description,
    products.embedding,
    1 - (products.embedding <=> query_embedding) as similarity
  FROM products
  WHERE 1 - (products.embedding <=> query_embedding) > match_threshold
  ORDER BY products.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function to match system knowledge
CREATE OR REPLACE FUNCTION match_knowledge (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    system_knowledge.id,
    system_knowledge.content,
    system_knowledge.metadata,
    1 - (system_knowledge.embedding <=> query_embedding) as similarity
  FROM system_knowledge
  WHERE 1 - (system_knowledge.embedding <=> query_embedding) > match_threshold
  ORDER BY system_knowledge.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
