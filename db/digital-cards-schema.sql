-- ============================================================================
-- CARDVERSE HIDDEN DIGITAL CARD SYSTEM - Database Schema
-- Created: December 6, 2025
-- Purpose: Gamification system that hides collectible digital cards throughout
--          the platform to drive engagement and feature discovery
-- ============================================================================

-- Digital Card Definitions (What cards exist)
CREATE TABLE IF NOT EXISTS digital_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'FOUNDER_001', 'EXPLORER_025'
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  
  -- Rarity System
  rarity VARCHAR(20) NOT NULL DEFAULT 'common', -- common, uncommon, rare, epic, legendary, mythic
  rarity_weight INTEGER DEFAULT 100, -- Lower = rarer (used for drop calculations)
  
  -- Card Series/Collection
  series VARCHAR(100), -- 'Founder Series', 'Explorer Series', 'Master Series'
  series_number INTEGER, -- Card number within series
  total_in_series INTEGER, -- How many cards in this series
  
  -- Discovery Requirements
  discovery_type VARCHAR(50) NOT NULL, -- 'feature_use', 'achievement', 'secret', 'event', 'random', 'purchase'
  discovery_trigger JSONB, -- Specific trigger conditions
  discovery_hint TEXT, -- Hint shown to users
  
  -- Card Stats/Attributes (for trading/collecting)
  power_level INTEGER DEFAULT 1,
  element VARCHAR(50), -- 'fire', 'water', 'earth', 'air', 'light', 'dark', 'neutral'
  card_type VARCHAR(50), -- 'character', 'artifact', 'location', 'event', 'boost'
  
  -- Availability
  is_active BOOLEAN DEFAULT true,
  max_supply INTEGER, -- NULL = unlimited
  current_supply INTEGER DEFAULT 0, -- How many have been claimed
  available_from TIMESTAMPTZ,
  available_until TIMESTAMPTZ, -- For limited-time cards
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's Digital Card Collection
CREATE TABLE IF NOT EXISTS user_digital_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES digital_cards(id) ON DELETE CASCADE,
  
  -- Acquisition Details
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  discovery_location VARCHAR(255), -- Where they found it
  discovery_method VARCHAR(100), -- How they triggered it
  
  -- Card Instance Details
  instance_number INTEGER, -- Their specific copy number (e.g., #47 of 1000)
  is_foil BOOLEAN DEFAULT false, -- Special variant
  is_first_edition BOOLEAN DEFAULT false, -- First 100 claims
  
  -- Trading (future feature)
  is_tradeable BOOLEAN DEFAULT true,
  is_listed_for_trade BOOLEAN DEFAULT false,
  
  -- Display
  is_favorite BOOLEAN DEFAULT false,
  display_order INTEGER,
  
  UNIQUE(user_id, card_id) -- One of each card per user (unless duplicates allowed)
);

-- Card Discovery Triggers (tracks what users have done)
CREATE TABLE IF NOT EXISTS card_discovery_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Progress Tracking
  feature_uses JSONB DEFAULT '{}', -- {"trivia": 5, "museum": 3, "clubs": 2}
  achievements_unlocked TEXT[] DEFAULT '{}',
  secrets_found TEXT[] DEFAULT '{}',
  total_cards_discovered INTEGER DEFAULT 0,
  
  -- Streaks & Engagement
  daily_login_streak INTEGER DEFAULT 0,
  last_login_date DATE,
  weekly_discoveries INTEGER DEFAULT 0,
  
  -- Stats
  rarest_card_found VARCHAR(20) DEFAULT 'common',
  complete_series TEXT[] DEFAULT '{}', -- Series IDs they've completed
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Discovery Events Log (for analytics and verification)
CREATE TABLE IF NOT EXISTS card_discovery_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES digital_cards(id) ON DELETE CASCADE,
  
  -- Event Details
  trigger_type VARCHAR(50) NOT NULL,
  trigger_details JSONB,
  page_location VARCHAR(255),
  
  -- Verification
  is_legitimate BOOLEAN DEFAULT true,
  verification_hash VARCHAR(255),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Card Series/Collections Metadata
CREATE TABLE IF NOT EXISTS digital_card_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  
  -- Series Details
  total_cards INTEGER NOT NULL,
  theme VARCHAR(100),
  
  -- Rewards for Completion
  completion_reward_type VARCHAR(50), -- 'badge', 'title', 'special_card', 'credits'
  completion_reward_value TEXT,
  
  -- Availability
  is_active BOOLEAN DEFAULT true,
  release_date TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_digital_cards_rarity ON digital_cards(rarity);
CREATE INDEX IF NOT EXISTS idx_digital_cards_series ON digital_cards(series);
CREATE INDEX IF NOT EXISTS idx_digital_cards_discovery_type ON digital_cards(discovery_type);
CREATE INDEX IF NOT EXISTS idx_user_digital_cards_user ON user_digital_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_digital_cards_card ON user_digital_cards(card_id);
CREATE INDEX IF NOT EXISTS idx_card_discovery_progress_user ON card_discovery_progress(user_id);

-- Enable RLS
ALTER TABLE digital_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_digital_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_discovery_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_discovery_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_card_series ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Digital cards are viewable by everyone" ON digital_cards
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their own digital cards" ON user_digital_cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own digital cards" ON user_digital_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own progress" ON card_discovery_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON card_discovery_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own discovery log" ON card_discovery_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Series are viewable by everyone" ON digital_card_series
  FOR SELECT USING (is_active = true);

