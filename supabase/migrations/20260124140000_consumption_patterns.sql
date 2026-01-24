-- Migration: Consumption Patterns for Predictive Replenishment

CREATE TABLE IF NOT EXISTS user_consumption_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    
    frequency_days INTEGER NOT NULL DEFAULT 30, -- Avg consumption rate
    last_ordered_at TIMESTAMPTZ,
    next_predicted_date TIMESTAMPTZ NOT NULL,
    
    confidence_score DECIMAL(3, 2) DEFAULT 0.5, -- 0.00 to 1.00
    auto_order_enabled BOOLEAN DEFAULT FALSE, -- AP2 Permission
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, product_id) -- One pattern per product per user
);

-- RLS
ALTER TABLE user_consumption_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own patterns" ON user_consumption_patterns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service Role manages patterns" ON user_consumption_patterns
    FOR ALL USING (true);
