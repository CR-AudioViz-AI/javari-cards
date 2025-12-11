-- ============================================================================
-- CRAVCARDS MASTER CARD CATALOG SCHEMA
-- This is the DATABASE of all cards users can add to their collections
-- Created: December 11, 2025
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================================================
-- CARD SETS (Master list of all card sets)
-- ============================================================================
CREATE TABLE IF NOT EXISTS card_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  code TEXT NOT NULL, -- Set code (e.g., "BS" for Base Set, "NEO" for Neo Genesis)
  
  -- Classification
  category TEXT NOT NULL CHECK (category IN ('pokemon', 'mtg', 'yugioh', 'sports_baseball', 'sports_basketball', 'sports_football', 'sports_hockey', 'sports_soccer', 'disney', 'entertainment')),
  subcategory TEXT, -- e.g., "expansion", "promo", "special"
  
  -- Release Info
  release_date DATE,
  release_year INTEGER,
  
  -- Content
  total_cards INTEGER,
  description TEXT,
  
  -- Media
  logo_url TEXT,
  pack_image_url TEXT,
  box_image_url TEXT,
  
  -- Market Data
  avg_box_price DECIMAL(10,2),
  avg_pack_price DECIMAL(10,2),
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'discontinued', 'upcoming')),
  is_featured BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CARD CATALOG (Master list of all individual cards)
-- ============================================================================
CREATE TABLE IF NOT EXISTS card_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  
  -- Set Reference
  set_id UUID REFERENCES card_sets(id),
  set_code TEXT NOT NULL,
  card_number TEXT NOT NULL,
  
  -- Classification
  category TEXT NOT NULL CHECK (category IN ('pokemon', 'mtg', 'yugioh', 'sports_baseball', 'sports_basketball', 'sports_football', 'sports_hockey', 'sports_soccer', 'disney', 'entertainment')),
  
  -- Rarity
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'holo_rare', 'ultra_rare', 'secret_rare', 'chase', 'legendary', 'mythic')),
  
  -- Card Details
  year_released INTEGER,
  description TEXT,
  
  -- Images
  image_url TEXT,
  image_back_url TEXT,
  
  -- POKEMON SPECIFIC (stored in metadata if category = 'pokemon')
  -- SPORTS SPECIFIC (stored in metadata if category starts with 'sports_')
  -- MTG SPECIFIC (stored in metadata if category = 'mtg')
  metadata JSONB DEFAULT '{}',
  
  -- Price Data (updated periodically)
  price_raw DECIMAL(12,2),
  price_psa_10 DECIMAL(12,2),
  price_psa_9 DECIMAL(12,2),
  price_bgs_10 DECIMAL(12,2),
  price_updated_at TIMESTAMPTZ,
  price_trend TEXT CHECK (price_trend IN ('up', 'down', 'stable')),
  
  -- Population Data
  pop_psa_10 INTEGER,
  pop_psa_9 INTEGER,
  pop_total INTEGER,
  
  -- Status
  is_featured BOOLEAN DEFAULT false,
  is_rookie BOOLEAN DEFAULT false, -- For sports cards
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(set_code, card_number)
);

-- ============================================================================
-- HISTORY/MUSEUM CONTENT
-- ============================================================================
CREATE TABLE IF NOT EXISTS card_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Content
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL, -- Full article content
  summary TEXT, -- Short summary
  
  -- Classification
  category TEXT NOT NULL CHECK (category IN ('pokemon', 'mtg', 'yugioh', 'sports', 'industry', 'collecting', 'grading', 'scandals', 'famous_sales', 'cultural_impact')),
  subcategory TEXT,
  
  -- Media
  image_url TEXT,
  video_url TEXT,
  
  -- Timeline
  event_date DATE,
  era TEXT, -- e.g., "1990s", "Golden Age", "Modern Era"
  
  -- Importance
  importance INTEGER DEFAULT 5, -- 1-10 scale
  is_featured BOOLEAN DEFAULT false,
  
  -- SEO/Tags
  tags TEXT[],
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COURSES / ACADEMY
-- ============================================================================
CREATE TABLE IF NOT EXISTS card_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  
  -- Classification
  category TEXT NOT NULL CHECK (category IN ('pokemon', 'mtg', 'yugioh', 'sports', 'grading', 'investment', 'business', 'general')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  
  -- Content
  thumbnail_url TEXT,
  estimated_time INTEGER, -- in minutes
  
  -- Structure
  module_count INTEGER DEFAULT 0,
  
  -- Pricing
  is_free BOOLEAN DEFAULT true,
  price_credits INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  
  -- Stats
  enrollment_count INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2),
  avg_rating DECIMAL(3,2),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COURSE MODULES / LESSONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS card_course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Reference
  course_id UUID NOT NULL REFERENCES card_courses(id) ON DELETE CASCADE,
  
  -- Identity
  title TEXT NOT NULL,
  description TEXT,
  
  -- Content
  content TEXT NOT NULL, -- Markdown content
  video_url TEXT,
  
  -- Order
  sort_order INTEGER NOT NULL,
  
  -- Duration
  estimated_time INTEGER, -- in minutes
  
  -- Quiz (optional)
  has_quiz BOOLEAN DEFAULT false,
  quiz_questions JSONB, -- Array of quiz questions
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- GRADING GUIDES
-- ============================================================================
CREATE TABLE IF NOT EXISTS grading_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  company TEXT NOT NULL CHECK (company IN ('PSA', 'BGS', 'CGC', 'SGC', 'General')),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  
  -- Content
  content TEXT NOT NULL, -- Full guide content in Markdown
  summary TEXT,
  
  -- Grade Scale
  grade_scale JSONB, -- {min: 1, max: 10, increments: [1, 1.5, 2, ...]}
  
  -- Pricing
  pricing_info JSONB, -- Array of pricing tiers
  
  -- Submission
  submission_info JSONB,
  turnaround_times JSONB,
  
  -- Tips
  tips TEXT[],
  
  -- Media
  image_url TEXT,
  video_url TEXT,
  
  -- Status
  is_featured BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_card_sets_category ON card_sets(category);
CREATE INDEX IF NOT EXISTS idx_card_sets_slug ON card_sets(slug);
CREATE INDEX IF NOT EXISTS idx_card_catalog_category ON card_catalog(category);
CREATE INDEX IF NOT EXISTS idx_card_catalog_set_id ON card_catalog(set_id);
CREATE INDEX IF NOT EXISTS idx_card_catalog_name_trgm ON card_catalog USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_card_catalog_rarity ON card_catalog(rarity);
CREATE INDEX IF NOT EXISTS idx_card_history_category ON card_history(category);
CREATE INDEX IF NOT EXISTS idx_card_courses_category ON card_courses(category);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE card_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_guides ENABLE ROW LEVEL SECURITY;

-- Public read access (everyone can read card data)
CREATE POLICY "Card sets are public" ON card_sets FOR SELECT USING (true);
CREATE POLICY "Card catalog is public" ON card_catalog FOR SELECT USING (true);
CREATE POLICY "Card history is public" ON card_history FOR SELECT USING (true);
CREATE POLICY "Courses are public" ON card_courses FOR SELECT USING (status = 'published');
CREATE POLICY "Course modules are public" ON card_course_modules FOR SELECT USING (true);
CREATE POLICY "Grading guides are public" ON grading_guides FOR SELECT USING (true);

-- Service role can do everything
GRANT ALL ON card_sets TO service_role;
GRANT ALL ON card_catalog TO service_role;
GRANT ALL ON card_history TO service_role;
GRANT ALL ON card_courses TO service_role;
GRANT ALL ON card_course_modules TO service_role;
GRANT ALL ON grading_guides TO service_role;
