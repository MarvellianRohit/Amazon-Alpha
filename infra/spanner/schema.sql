-- Spanner Schema with Geo-Partitioning and Vector Search

-- 1. Create Regional Partitions
CREATE PLACEMENT KEY RegionKey (
    RegionCode STRING(10)
);

-- 2. Define Table with Placement Key
CREATE TABLE Inventory (
    RegionCode STRING(10) NOT NULL, -- Used for physical data placement
    ProductId STRING(36) NOT NULL, -- UUIDv4 to avoid hotspots
    Stock INT64,
    LastUpdated TIMESTAMP,
    ProductEmbeddings ARRAY<FLOAT64>, -- For Vertex AI
    
    PRIMARY KEY (RegionCode, ProductId)
) PRIMARY KEY (RegionCode) -- Interleave in Parent Region
INTERLEAVE IN PARENT RegionKey;

-- 3. Configure Data Residency (Pseudo-DDL)
-- PARTITION partition_mumbai VALUES IN ('IN-WEST') -> stored in asia-south1
-- PARTITION partition_virginia VALUES IN ('US-EAST') -> stored in us-east1

-- 4. Enable Vertex AI Integration (Model Endpoint)
CREATE MODEL ProductEmbeddingsModel
INPUT (content STRING)
OUTPUT (embedding ARRAY<FLOAT64>)
REMOTE OPTIONS (
  endpoint = '//aiplatform.googleapis.com/projects/my-project/locations/us-central1/publishers/google/models/text-embedding-004'
);
