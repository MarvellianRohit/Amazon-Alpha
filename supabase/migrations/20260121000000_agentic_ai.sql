-- Agentic AI Layer Migration

-- 1. Browsing Signals
CREATE TABLE IF NOT EXISTS browsing_signals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    product_id UUID REFERENCES products(id),
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User DNA (Style/Utility Profile)
CREATE TABLE IF NOT EXISTS user_dna (
    user_id UUID REFERENCES profiles(id) PRIMARY KEY,
    dna_summary TEXT,
    embedding vector(1536),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Negotiation Room
CREATE TYPE negotiation_status_enum AS ENUM ('active', 'accepted', 'rejected', 'expired');

CREATE TABLE IF NOT EXISTS negotiations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    vendor_id UUID REFERENCES vendors(id) NOT NULL,
    status negotiation_status_enum DEFAULT 'active',
    current_offer_price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS negotiation_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    negotiation_id UUID REFERENCES negotiations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- 'user' or 'vendor_agent'
    content TEXT NOT NULL,
    offer_price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE browsing_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiation_messages ENABLE ROW LEVEL SECURITY;

-- Users can only see/insert their own signals
CREATE POLICY "Users manage own signals" ON browsing_signals FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own DNA" ON user_dna FOR ALL USING (user_id = auth.uid());

-- Negotiations RLS (User can see theirs, Vendor can see theirs)
CREATE POLICY "Negotiation Access" ON negotiations FOR ALL 
USING (user_id = auth.uid() OR vendor_id IN (SELECT id FROM vendors WHERE profile_id = auth.uid()));

CREATE POLICY "Messages Access" ON negotiation_messages FOR ALL
USING (negotiation_id IN (
    SELECT id FROM negotiations 
    WHERE user_id = auth.uid() 
       OR vendor_id IN (SELECT id FROM vendors WHERE profile_id = auth.uid())
));
