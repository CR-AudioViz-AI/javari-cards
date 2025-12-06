-- ============================================================================
-- CARDVERSE HIDDEN DIGITAL CARDS - Database Schema
-- ============================================================================

-- Hidden Cards Master Table
CREATE TABLE IF NOT EXISTS hidden_cards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
  category TEXT NOT NULL,
  image_url TEXT,
  background_gradient TEXT,
  glow_color TEXT,
  discovery_method TEXT NOT NULL,
  discovery_hint TEXT,
  discovery_location TEXT,
  trigger_condition JSONB NOT NULL DEFAULT '{}',
  xp_reward INTEGER NOT NULL DEFAULT 0,
  credit_reward INTEGER NOT NULL DEFAULT 0,
  is_secret BOOLEAN DEFAULT FALSE,
  season_id TEXT,
  release_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  retire_date TIMESTAMPTZ,
  max_supply INTEGER,
  current_supply INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Card Discoveries
CREATE TABLE IF NOT EXISTS user_hidden_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL REFERENCES hidden_cards(id) ON DELETE CASCADE,
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  discovery_context TEXT,
  discovery_location TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  is_traded BOOLEAN DEFAULT FALSE,
  original_discoverer BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

-- Card Trade History
CREATE TABLE IF NOT EXISTS hidden_card_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL REFERENCES hidden_cards(id),
  from_user_id UUID NOT NULL REFERENCES auth.users(id),
  to_user_id UUID NOT NULL REFERENCES auth.users(id),
  trade_type TEXT NOT NULL CHECK (trade_type IN ('gift', 'trade', 'purchase')),
  credits_exchanged INTEGER DEFAULT 0,
  traded_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress Summary (for quick lookups)
CREATE TABLE IF NOT EXISTS user_card_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_discovered INTEGER DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,
  total_credits_earned INTEGER DEFAULT 0,
  common_count INTEGER DEFAULT 0,
  uncommon_count INTEGER DEFAULT 0,
  rare_count INTEGER DEFAULT 0,
  epic_count INTEGER DEFAULT 0,
  legendary_count INTEGER DEFAULT 0,
  mythic_count INTEGER DEFAULT 0,
  last_discovery_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discovery Triggers Log (for analytics)
CREATE TABLE IF NOT EXISTS card_discovery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  card_id TEXT REFERENCES hidden_cards(id),
  trigger_type TEXT NOT NULL,
  trigger_location TEXT,
  trigger_data JSONB,
  discovered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Card Seasons (for limited time events)
CREATE TABLE IF NOT EXISTS card_seasons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  theme TEXT,
  bonus_xp_multiplier DECIMAL DEFAULT 1.0,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hidden_cards_rarity ON hidden_cards(rarity);
CREATE INDEX IF NOT EXISTS idx_hidden_cards_category ON hidden_cards(category);
CREATE INDEX IF NOT EXISTS idx_hidden_cards_release ON hidden_cards(release_date);
CREATE INDEX IF NOT EXISTS idx_user_hidden_cards_user ON user_hidden_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_hidden_cards_card ON user_hidden_cards(card_id);
CREATE INDEX IF NOT EXISTS idx_card_discovery_logs_user ON card_discovery_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_card_discovery_logs_card ON card_discovery_logs(card_id);

-- Functions
CREATE OR REPLACE FUNCTION update_user_card_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_card_progress (user_id, total_discovered, last_discovery_at)
  VALUES (NEW.user_id, 1, NEW.discovered_at)
  ON CONFLICT (user_id) DO UPDATE SET
    total_discovered = user_card_progress.total_discovered + 1,
    last_discovery_at = NEW.discovered_at,
    updated_at = NOW();
  
  -- Update rarity counts
  UPDATE user_card_progress 
  SET 
    common_count = CASE WHEN (SELECT rarity FROM hidden_cards WHERE id = NEW.card_id) = 'common' 
                        THEN common_count + 1 ELSE common_count END,
    uncommon_count = CASE WHEN (SELECT rarity FROM hidden_cards WHERE id = NEW.card_id) = 'uncommon' 
                          THEN uncommon_count + 1 ELSE uncommon_count END,
    rare_count = CASE WHEN (SELECT rarity FROM hidden_cards WHERE id = NEW.card_id) = 'rare' 
                      THEN rare_count + 1 ELSE rare_count END,
    epic_count = CASE WHEN (SELECT rarity FROM hidden_cards WHERE id = NEW.card_id) = 'epic' 
                      THEN epic_count + 1 ELSE epic_count END,
    legendary_count = CASE WHEN (SELECT rarity FROM hidden_cards WHERE id = NEW.card_id) = 'legendary' 
                           THEN legendary_count + 1 ELSE legendary_count END,
    mythic_count = CASE WHEN (SELECT rarity FROM hidden_cards WHERE id = NEW.card_id) = 'mythic' 
                        THEN mythic_count + 1 ELSE mythic_count END
  WHERE user_id = NEW.user_id;
  
  -- Update XP and credits
  UPDATE user_card_progress 
  SET 
    total_xp_earned = total_xp_earned + (SELECT xp_reward FROM hidden_cards WHERE id = NEW.card_id),
    total_credits_earned = total_credits_earned + (SELECT credit_reward FROM hidden_cards WHERE id = NEW.card_id)
  WHERE user_id = NEW.user_id;
  
  -- Increment card supply
  UPDATE hidden_cards SET current_supply = current_supply + 1 WHERE id = NEW.card_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trigger_update_card_progress ON user_hidden_cards;
CREATE TRIGGER trigger_update_card_progress
AFTER INSERT ON user_hidden_cards
FOR EACH ROW EXECUTE FUNCTION update_user_card_progress();

-- RLS Policies
ALTER TABLE hidden_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hidden_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_card_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_discovery_logs ENABLE ROW LEVEL SECURITY;

-- Everyone can view available cards (not secret ones)
CREATE POLICY "Anyone can view non-secret cards" ON hidden_cards
  FOR SELECT USING (is_secret = FALSE OR current_supply > 0);

-- Users can view their own discoveries
CREATE POLICY "Users can view own discoveries" ON user_hidden_cards
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own discoveries
CREATE POLICY "Users can record discoveries" ON user_hidden_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own progress
CREATE POLICY "Users can view own progress" ON user_card_progress
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- SEED DATA - Insert all hidden cards
-- ============================================================================

INSERT INTO hidden_cards (id, name, description, rarity, category, image_url, background_gradient, glow_color, discovery_method, discovery_hint, discovery_location, trigger_condition, xp_reward, credit_reward, is_secret, release_date) VALUES
-- Explorer Cards
('exp-001', 'First Steps', 'Awarded to those who begin their CardVerse journey', 'common', 'explorer', '/cards/exclusive/first-steps.png', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '#667eea', 'page_visit', 'Every journey begins with a single step...', 'Dashboard', '{"type": "page_visit", "page": "/dashboard", "firstVisit": true}', 50, 10, FALSE, '2025-01-01'),
('exp-002', 'Museum Wanderer', 'You explored the halls of card history', 'common', 'explorer', '/cards/exclusive/museum-wanderer.png', 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', '#f093fb', 'page_visit', 'History holds many secrets...', 'Museum', '{"type": "page_visit", "page": "/museum", "sections": "all"}', 75, 15, FALSE, '2025-01-01'),
('exp-003', 'Deep Diver', 'You scrolled to the bottom of it all', 'uncommon', 'explorer', '/cards/exclusive/deep-diver.png', 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', '#00f2fe', 'scroll_depth', 'Some treasures lie at the bottom...', 'Any Long Page', '{"type": "scroll_depth", "depth": 100, "pages": 5}', 100, 25, FALSE, '2025-01-01'),
('exp-004', 'Night Owl', 'Collecting cards at midnight? Dedicated!', 'rare', 'explorer', '/cards/exclusive/night-owl.png', 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)', '#e94560', 'time_based', 'The night holds secrets for the dedicated...', 'Any Page', '{"type": "time_based", "hourStart": 0, "hourEnd": 4}', 150, 50, FALSE, '2025-01-01'),
('exp-005', 'Early Bird', 'The early collector catches the rare card', 'rare', 'explorer', '/cards/exclusive/early-bird.png', 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', '#fee140', 'time_based', 'Dawn brings new opportunities...', 'Any Page', '{"type": "time_based", "hourStart": 5, "hourEnd": 7}', 150, 50, FALSE, '2025-01-01'),

-- Collector Cards
('col-001', 'Starter Pack', 'Your first 10 cards in the collection', 'common', 'collector', '/cards/exclusive/starter-pack.png', 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', '#a8edea', 'collection_milestone', 'Every collection starts somewhere...', 'Collection', '{"type": "collection_milestone", "cardCount": 10}', 100, 25, FALSE, '2025-01-01'),
('col-002', 'Century Club', 'Welcome to the 100 card club', 'uncommon', 'collector', '/cards/exclusive/century-club.png', 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', '#fcb69f', 'collection_milestone', 'Triple digits await the dedicated...', 'Collection', '{"type": "collection_milestone", "cardCount": 100}', 250, 75, FALSE, '2025-01-01'),
('col-003', 'Vault Keeper', 'A thousand cards under your care', 'epic', 'collector', '/cards/exclusive/vault-keeper.png', 'linear-gradient(135deg, #c79081 0%, #dfa579 100%)', '#dfa579', 'collection_milestone', 'Thousands dream of this achievement...', 'Collection', '{"type": "collection_milestone", "cardCount": 1000}', 1000, 500, FALSE, '2025-01-01'),

-- Scholar Cards
('sch-001', 'Quiz Rookie', 'Completed your first trivia round', 'common', 'scholar', '/cards/exclusive/quiz-rookie.png', 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', '#84fab0', 'trivia_score', 'Test your knowledge to unlock this...', 'Trivia', '{"type": "trivia_score", "gamesCompleted": 1}', 50, 10, FALSE, '2025-01-01'),
('sch-002', 'Perfect Score', 'A flawless trivia performance', 'rare', 'scholar', '/cards/exclusive/perfect-score.png', 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', '#a18cd1', 'trivia_score', 'Perfection in knowledge reveals this...', 'Trivia', '{"type": "trivia_score", "perfectGames": 1}', 300, 100, FALSE, '2025-01-01'),
('sch-003', 'Trivia Master', '50 trivia games completed', 'epic', 'scholar', '/cards/exclusive/trivia-master.png', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '#764ba2', 'trivia_score', 'Dedication to learning unlocks mastery...', 'Trivia', '{"type": "trivia_score", "gamesCompleted": 50}', 750, 250, FALSE, '2025-01-01'),

-- Social Cards  
('soc-001', 'Club Founder', 'You started your own collector club', 'uncommon', 'social', '/cards/exclusive/club-founder.png', 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)', '#ff7eb3', 'social_action', 'Leaders create communities...', 'Clubs', '{"type": "social_action", "action": "create_club"}', 200, 50, FALSE, '2025-01-01'),
('soc-002', 'Social Butterfly', 'Joined 5 different clubs', 'uncommon', 'social', '/cards/exclusive/social-butterfly.png', 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', '#f093fb', 'social_action', 'The more you connect, the more you discover...', 'Clubs', '{"type": "social_action", "action": "join_clubs", "count": 5}', 150, 40, FALSE, '2025-01-01'),

-- Secret Cards
('sec-001', 'Konami Collector', '⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️', 'legendary', 'secret', '/cards/exclusive/konami-collector.png', 'linear-gradient(135deg, #8B0000 0%, #FF4500 100%)', '#FF4500', 'konami_code', '???', 'Anywhere', '{"type": "konami_code"}', 1000, 500, TRUE, '2025-01-01'),
('sec-002', 'Hidden Charizard', 'You found the secret dragon!', 'mythic', 'secret', '/cards/exclusive/hidden-charizard.png', 'linear-gradient(135deg, #ff512f 0%, #f09819 100%)', '#ff512f', 'hidden_element', '???', 'Museum - Pokemon Section', '{"type": "hidden_element", "elementId": "secret-charizard-flame", "clicks": 3}', 2500, 1000, TRUE, '2025-01-01'),
('sec-003', 'Black Lotus Seeker', 'The ultimate MTG secret revealed', 'mythic', 'secret', '/cards/exclusive/black-lotus-seeker.png', 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d1f3d 100%)', '#9b59b6', 'click_sequence', '???', 'Museum - MTG Section', '{"type": "click_sequence", "pattern": ["mox","mox","mox","mox","mox","lotus"]}', 2500, 1000, TRUE, '2025-01-01'),

-- Streak Cards
('str-001', 'Week Warrior', '7 day login streak', 'uncommon', 'achievement', '/cards/exclusive/week-warrior.png', 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', '#38ef7d', 'streak', 'Consistency is key...', 'Login', '{"type": "streak", "days": 7}', 200, 50, FALSE, '2025-01-01'),
('str-002', 'Monthly Master', '30 day login streak', 'rare', 'achievement', '/cards/exclusive/monthly-master.png', 'linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)', '#b06ab3', 'streak', 'A month of dedication unlocks this...', 'Login', '{"type": "streak", "days": 30}', 500, 200, FALSE, '2025-01-01'),
('str-003', 'Year of the Collector', '365 day login streak - LEGENDARY', 'mythic', 'achievement', '/cards/exclusive/year-collector.png', 'linear-gradient(135deg, #c79081 0%, #dfa579 50%, #f5af19 100%)', '#f5af19', 'streak', 'A full year of dedication...', 'Login', '{"type": "streak", "days": 365}', 5000, 2500, FALSE, '2025-01-01'),

-- Founder Cards
('fnd-001', 'Genesis Collector', 'Joined CardVerse in the first month', 'legendary', 'founder', '/cards/exclusive/genesis-collector.png', 'linear-gradient(135deg, #141e30 0%, #243b55 100%)', '#d4af37', 'time_based', 'The beginning is always special...', 'Registration', '{"type": "time_based", "registeredBefore": "2025-02-01"}', 1000, 500, FALSE, '2025-01-01'),

-- Javari AI Cards
('jav-001', 'Javari''s Friend', 'You had your first conversation with Javari', 'common', 'explorer', '/cards/exclusive/javari-friend.png', 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', '#8b5cf6', 'feature_use', 'Chat with the AI to unlock this...', 'Javari Chat', '{"type": "feature_use", "feature": "javari_chat", "messages": 1}', 50, 10, FALSE, '2025-01-01'),
('jav-002', 'Card Whisperer', 'Asked Javari about 50 different cards', 'rare', 'scholar', '/cards/exclusive/card-whisperer.png', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '#667eea', 'feature_use', 'The more you ask, the more you learn...', 'Javari Chat', '{"type": "feature_use", "feature": "javari_card_lookup", "count": 50}', 400, 150, FALSE, '2025-01-01')
ON CONFLICT (id) DO NOTHING;
