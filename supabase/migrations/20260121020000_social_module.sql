-- Social Discovery Module Migration

-- 1. Social Posts (Video Feed)
CREATE TABLE IF NOT EXISTS social_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    creator_id UUID REFERENCES profiles(id) NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    view_count INTEGER DEFAULT 0,
    trust_score_snapshot DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Creator Stats (Trust Score Cache)
CREATE TABLE IF NOT EXISTS creator_stats (
    creator_id UUID REFERENCES profiles(id) PRIMARY KEY,
    trust_score DECIMAL(5, 2) DEFAULT 50.00,
    total_sales INTEGER DEFAULT 0,
    avg_rating DECIMAL(3, 2) DEFAULT 0.00,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view posts" ON social_posts FOR SELECT USING (true);
CREATE POLICY "Public view stats" ON creator_stats FOR SELECT USING (true);
CREATE POLICY "Creators manage own posts" ON social_posts FOR ALL USING (creator_id = auth.uid());
