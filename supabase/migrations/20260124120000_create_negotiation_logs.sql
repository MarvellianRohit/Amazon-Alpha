-- Migration: Create negotiation_logs table for Agent Transparency

CREATE TABLE IF NOT EXISTS negotiation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    negotiation_id UUID NOT NULL,
    sender TEXT NOT NULL, -- 'BUYER', 'VENDOR', 'SYSTEM'
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup of a specific negotiation history
CREATE INDEX IF NOT EXISTS idx_negotiation_logs_negotiation_id ON negotiation_logs(negotiation_id);

-- RLS Policies (Optional but good practice)
ALTER TABLE negotiation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON negotiation_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert for service role only" ON negotiation_logs FOR INSERT WITH CHECK (true); 
-- Note: In a real app, INSERT might be restricted to the AI service role
