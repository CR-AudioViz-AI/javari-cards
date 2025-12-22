-- ============================================================================
-- CRAVCARDS ENHANCED FEATURES - DATABASE MIGRATION
-- CR AudioViz AI, LLC
-- Created: December 22, 2025
-- Features: Image Quests, Card Images with Rights, Price History, User Stats
-- ============================================================================

-- ============================================================================
-- 1. CARD IMAGES TABLE (with rights tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_card_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL,
  card_source TEXT NOT NULL, -- 'pokemon', 'mtg', 'yugioh', 'digimon', 'onepiece', 'fab', 'sports', 'lorcana'
  card_name TEXT,
  image_url TEXT NOT NULL,
  image_type TEXT DEFAULT 'primary', -- 'primary', 'back', 'alternate', 'user_photo'
  source TEXT NOT NULL, -- 'api', 'user', 'wikimedia', 'openverse', 'tcgplayer'
  license TEXT, -- 'public_domain', 'cc0', 'cc_by', 'cc_by_sa', 'proprietary', 'user_submitted'
  attribution TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  quality_score INTEGER DEFAULT 0, -- 0-100 quality rating
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_card_images_card_id ON cv_card_images(card_id, card_source);
CREATE INDEX IF NOT EXISTS idx_card_images_source ON cv_card_images(source);
CREATE INDEX IF NOT EXISTS idx_card_images_verified ON cv_card_images(verified);

-- ============================================================================
-- 2. IMAGE QUESTS TABLE (gamified image collection)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_image_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  card_source TEXT NOT NULL,
  set_name TEXT,
  rarity TEXT DEFAULT 'common',
  quest_type TEXT DEFAULT 'missing_image', -- 'missing_image', 'better_quality', 'alternate_art'
  reward_xp INTEGER DEFAULT 10,
  reward_credits INTEGER DEFAULT 5,
  bonus_multiplier DECIMAL(3,2) DEFAULT 1.0,
  status TEXT DEFAULT 'open', -- 'open', 'claimed', 'submitted', 'verified', 'rejected', 'expired'
  claimed_by UUID REFERENCES auth.users(id),
  claimed_at TIMESTAMPTZ,
  submitted_image_id UUID REFERENCES cv_card_images(id),
  submitted_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  expires_at TIMESTAMPTZ,
  priority INTEGER DEFAULT 0, -- Higher = more important
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_image_quests_status ON cv_image_quests(status);
CREATE INDEX IF NOT EXISTS idx_image_quests_card ON cv_image_quests(card_id, card_source);
CREATE INDEX IF NOT EXISTS idx_image_quests_claimed_by ON cv_image_quests(claimed_by);

-- ============================================================================
-- 3. PRICE HISTORY TABLE (for charts and analytics)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL,
  card_source TEXT NOT NULL,
  card_name TEXT,
  price_low DECIMAL(10,2),
  price_mid DECIMAL(10,2),
  price_high DECIMAL(10,2),
  price_market DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  data_source TEXT, -- 'tcgplayer', 'cardmarket', 'ebay', 'user_reported'
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for time-series queries
CREATE INDEX IF NOT EXISTS idx_price_history_card ON cv_price_history(card_id, card_source, recorded_at DESC);

-- ============================================================================
-- 4. USER STATS TABLE (gamification stats)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  cards_collected INTEGER DEFAULT 0,
  cards_scanned INTEGER DEFAULT 0,
  quests_completed INTEGER DEFAULT 0,
  images_submitted INTEGER DEFAULT 0,
  images_verified INTEGER DEFAULT 0,
  trivia_correct INTEGER DEFAULT 0,
  trivia_played INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. DAILY CHALLENGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  challenge_type TEXT NOT NULL, -- 'trivia', 'scan', 'collect', 'quest', 'social'
  title TEXT NOT NULL,
  description TEXT,
  target_count INTEGER DEFAULT 1,
  reward_xp INTEGER DEFAULT 50,
  reward_credits INTEGER DEFAULT 25,
  card_source TEXT, -- Optional: limit to specific card type
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for daily lookup
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON cv_daily_challenges(challenge_date, active);

-- ============================================================================
-- 6. USER CHALLENGE PROGRESS
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_user_challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  challenge_id UUID REFERENCES cv_daily_challenges(id) NOT NULL,
  current_count INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  reward_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- ============================================================================
-- 7. CARD HISTORY / MUSEUM CONTENT
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_card_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT, -- Short version for cards
  category TEXT NOT NULL, -- 'milestone', 'artist', 'set_release', 'notable_card', 'industry', 'culture'
  card_sources TEXT[], -- Which card types this relates to: ['pokemon', 'mtg']
  date_relevance DATE, -- When this happened
  era TEXT, -- 'early' (pre-1990), 'classic' (1990-2000), 'modern' (2000-2015), 'current' (2015+)
  image_url TEXT,
  image_source TEXT,
  image_license TEXT,
  source_url TEXT, -- Original source for citation
  source_name TEXT,
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for browsing
CREATE INDEX IF NOT EXISTS idx_card_history_category ON cv_card_history(category, published);
CREATE INDEX IF NOT EXISTS idx_card_history_date ON cv_card_history(date_relevance DESC);
CREATE INDEX IF NOT EXISTS idx_card_history_sources ON cv_card_history USING GIN(card_sources);

-- ============================================================================
-- 8. LEADERBOARD VIEW
-- ============================================================================
CREATE OR REPLACE VIEW cv_leaderboard AS
SELECT 
  us.user_id,
  u.raw_user_meta_data->>'full_name' as display_name,
  u.raw_user_meta_data->>'avatar_url' as avatar_url,
  us.total_xp,
  us.level,
  us.cards_collected,
  us.quests_completed,
  us.images_verified,
  us.streak_days,
  RANK() OVER (ORDER BY us.total_xp DESC) as rank
FROM cv_user_stats us
JOIN auth.users u ON u.id = us.user_id
WHERE us.total_xp > 0
ORDER BY us.total_xp DESC;

-- ============================================================================
-- 9. ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Card Images: Anyone can view, authenticated users can insert
ALTER TABLE cv_card_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view card images" ON cv_card_images
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload images" ON cv_card_images
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own images" ON cv_card_images
  FOR UPDATE USING (auth.uid() = uploaded_by);

-- Image Quests: Anyone can view open quests, authenticated users can claim
ALTER TABLE cv_image_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quests" ON cv_image_quests
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can claim quests" ON cv_image_quests
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Price History: Read-only for all
ALTER TABLE cv_price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view price history" ON cv_price_history
  FOR SELECT USING (true);

-- User Stats: Users can view all, update their own
ALTER TABLE cv_user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stats" ON cv_user_stats
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own stats" ON cv_user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert stats" ON cv_user_stats
  FOR INSERT WITH CHECK (true);

-- Daily Challenges: Read-only
ALTER TABLE cv_daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view challenges" ON cv_daily_challenges
  FOR SELECT USING (active = true);

-- User Challenge Progress: Users see/update their own
ALTER TABLE cv_user_challenge_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their progress" ON cv_user_challenge_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their progress" ON cv_user_challenge_progress
  FOR ALL USING (auth.uid() = user_id);

-- Card History: Anyone can view published
ALTER TABLE cv_card_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published history" ON cv_card_history
  FOR SELECT USING (published = true);

-- ============================================================================
-- 10. SEED DATA: SAMPLE QUESTS
-- ============================================================================
INSERT INTO cv_image_quests (card_id, card_name, card_source, set_name, rarity, reward_xp, reward_credits, priority)
VALUES 
  ('base1-4', 'Charizard', 'pokemon', 'Base Set', 'rare', 100, 50, 10),
  ('alpha-black-lotus', 'Black Lotus', 'mtg', 'Alpha', 'mythic', 200, 100, 10),
  ('LOB-001', 'Blue-Eyes White Dragon', 'yugioh', 'Legend of Blue Eyes', 'ultra', 100, 50, 10),
  ('OP01-001', 'Monkey D. Luffy', 'onepiece', 'Romance Dawn', 'leader', 75, 35, 8),
  ('BT1-001', 'Agumon', 'digimon', 'BT01', 'common', 25, 10, 5)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 11. SEED DATA: SAMPLE HISTORY
-- ============================================================================
INSERT INTO cv_card_history (title, content, summary, category, card_sources, date_relevance, era, tags)
VALUES 
  (
    'Pokemon TCG Launches in Japan',
    'The Pokemon Trading Card Game was first published in Japan by Media Factory in October 1996. The game was designed by Tsunekazu Ishihara and was based on the popular video game series. The initial release included the Base Set with 102 cards featuring the original 151 Pokemon.',
    'Pokemon TCG launches in Japan with 102 cards',
    'milestone',
    ARRAY['pokemon'],
    '1996-10-20',
    'classic',
    ARRAY['launch', 'japan', 'base set', 'pokemon']
  ),
  (
    'Magic: The Gathering - The First TCG',
    'Magic: The Gathering was created by Richard Garfield and published by Wizards of the Coast in 1993. It was the first trading card game ever created and established many of the conventions that would be used by subsequent TCGs.',
    'Magic: The Gathering becomes the first TCG',
    'milestone',
    ARRAY['mtg'],
    '1993-08-05',
    'early',
    ARRAY['launch', 'first tcg', 'richard garfield', 'wizards']
  ),
  (
    'Yu-Gi-Oh! Manga Debuts',
    'The Yu-Gi-Oh! manga by Kazuki Takahashi began serialization in Weekly Shonen Jump in September 1996. The trading card game within the manga would later become a real product.',
    'Yu-Gi-Oh! manga begins serialization',
    'milestone',
    ARRAY['yugioh'],
    '1996-09-30',
    'classic',
    ARRAY['manga', 'japan', 'kazuki takahashi']
  ),
  (
    'One Piece Card Game Launch',
    'Bandai launched the One Piece Card Game in July 2022, based on the popular manga and anime series by Eiichiro Oda. The game quickly became one of the fastest-growing TCGs worldwide.',
    'One Piece Card Game launches globally',
    'milestone',
    ARRAY['onepiece'],
    '2022-07-22',
    'current',
    ARRAY['launch', 'bandai', 'one piece', 'anime']
  ),
  (
    'Disney Lorcana Announced',
    'Ravensburger announced Disney Lorcana in August 2022, a new trading card game featuring Disney characters. The game launched in 2023 and became an instant hit with collectors.',
    'Disney Lorcana TCG announced',
    'milestone',
    ARRAY['lorcana'],
    '2022-08-19',
    'current',
    ARRAY['disney', 'ravensburger', 'announcement']
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 12. SEED DATA: DAILY CHALLENGES
-- ============================================================================
INSERT INTO cv_daily_challenges (challenge_date, challenge_type, title, description, target_count, reward_xp, reward_credits)
VALUES 
  (CURRENT_DATE, 'collect', 'Add 3 Cards', 'Add 3 cards to your collection today', 3, 30, 15),
  (CURRENT_DATE, 'trivia', 'Trivia Master', 'Answer 5 trivia questions correctly', 5, 50, 25),
  (CURRENT_DATE, 'quest', 'Quest Hunter', 'Complete 1 image quest', 1, 75, 40),
  (CURRENT_DATE + 1, 'scan', 'Scanner Pro', 'Scan 5 cards using the card scanner', 5, 40, 20),
  (CURRENT_DATE + 1, 'social', 'Social Butterfly', 'Share a card from your collection', 1, 25, 10)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DONE!
-- ============================================================================
