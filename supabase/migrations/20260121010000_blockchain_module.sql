-- Blockchain Transparency Module Migration

-- 1. NFT Registry (Digital Twins)
CREATE TABLE IF NOT EXISTS nft_registry (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) NOT NULL,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    token_id TEXT,
    contract_address TEXT,
    transaction_hash TEXT,
    status TEXT DEFAULT 'pending_mint',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Resale Market Listings
CREATE TABLE IF NOT EXISTS resale_listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nft_id UUID REFERENCES nft_registry(id) NOT NULL,
    seller_id UUID REFERENCES profiles(id) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE nft_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE resale_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own NFTs" ON nft_registry FOR ALL USING (user_id = auth.uid());
CREATE POLICY "View active resales" ON resale_listings FOR SELECT USING (status = 'active' OR seller_id = auth.uid());
