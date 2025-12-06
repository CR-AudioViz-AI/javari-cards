-- ============================================================================
-- CARDVERSE DATABASE SCHEMA
-- Complete schema for the CardVerse trading card collection platform
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER PROFILES
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    favorite_category TEXT DEFAULT 'pokemon',
    collection_visibility TEXT DEFAULT 'public' CHECK (collection_visibility IN ('public', 'friends', 'private')),
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'collector', 'pro', 'dealer')),
    subscription_expires_at TIMESTAMPTZ,
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CARDS COLLECTION
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('pokemon', 'mtg', 'yugioh', 'sports', 'other')),
    set_name TEXT NOT NULL,
    set_code TEXT,
    card_number TEXT,
    year INTEGER,
    image_url TEXT,
    image_back_url TEXT,
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
    grading_company TEXT CHECK (grading_company IN ('PSA', 'BGS', 'CGC', 'SGC', 'raw')),
    grade DECIMAL(3,1),
    cert_number TEXT,
    condition TEXT CHECK (condition IN ('mint', 'near_mint', 'excellent', 'good', 'fair', 'poor')),
    purchase_price DECIMAL(12,2),
    purchase_date DATE,
    current_value DECIMAL(12,2),
    last_price_update TIMESTAMPTZ,
    quantity INTEGER DEFAULT 1,
    location TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    is_for_sale BOOLEAN DEFAULT FALSE,
    is_for_trade BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cv_cards_user_id ON cv_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_cards_category ON cv_cards(category);
CREATE INDEX IF NOT EXISTS idx_cv_cards_name ON cv_cards(name);

-- ============================================================================
-- PRICE HISTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID REFERENCES cv_cards(id) ON DELETE CASCADE,
    price DECIMAL(12,2) NOT NULL,
    source TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cv_price_history_card_id ON cv_price_history(card_id);

-- ============================================================================
-- CLUBS SYSTEM
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    club_type TEXT NOT NULL CHECK (club_type IN ('braggers', 'regional', 'team', 'player', 'set', 'grading', 'tcg', 'investment', 'vintage', 'newbie', 'custom')),
    banner_url TEXT,
    icon_url TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT TRUE,
    member_count INTEGER DEFAULT 0,
    requirements JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cv_clubs_slug ON cv_clubs(slug);
CREATE INDEX IF NOT EXISTS idx_cv_clubs_type ON cv_clubs(club_type);

-- Club Members
CREATE TABLE IF NOT EXISTS cv_club_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES cv_clubs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(club_id, user_id)
);

-- Club Posts/Discussions
CREATE TABLE IF NOT EXISTS cv_club_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES cv_clubs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    image_urls TEXT[],
    card_ids UUID[],
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TRIVIA SYSTEM
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_trivia_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL CHECK (category IN ('pokemon', 'mtg', 'sports', 'yugioh', 'history', 'grading', 'general')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT,
    image_url TEXT,
    xp_reward INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cv_trivia_category ON cv_trivia_questions(category);
CREATE INDEX IF NOT EXISTS idx_cv_trivia_difficulty ON cv_trivia_questions(difficulty);

-- Trivia Sessions
CREATE TABLE IF NOT EXISTS cv_trivia_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT,
    difficulty TEXT,
    questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

-- ============================================================================
-- DIGITAL CARDS (Gamification)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_digital_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    series TEXT NOT NULL CHECK (series IN ('location', 'academy', 'game', 'achievement', 'streak', 'social', 'special', 'crossover')),
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
    image_url TEXT,
    unlock_method TEXT NOT NULL,
    xp_value INTEGER DEFAULT 10,
    is_tradeable BOOLEAN DEFAULT FALSE,
    max_supply INTEGER,
    current_supply INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Digital Cards
CREATE TABLE IF NOT EXISTS cv_user_digital_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    digital_card_id UUID REFERENCES cv_digital_cards(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    is_displayed BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, digital_card_id)
);

-- ============================================================================
-- ACADEMY SYSTEM
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
    duration_minutes INTEGER,
    thumbnail_url TEXT,
    digital_card_reward UUID REFERENCES cv_digital_cards(id),
    xp_reward INTEGER DEFAULT 100,
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cv_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES cv_courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    order_index INTEGER NOT NULL,
    quiz_questions UUID[],
    xp_reward INTEGER DEFAULT 25,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cv_user_course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES cv_courses(id) ON DELETE CASCADE,
    lessons_completed UUID[],
    quiz_scores JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, course_id)
);

-- ============================================================================
-- MUSEUM / HISTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_history_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    era TEXT,
    featured_image_url TEXT,
    gallery_images TEXT[],
    tags TEXT[],
    author TEXT DEFAULT 'CardVerse Team',
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cv_famous_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    year INTEGER,
    description TEXT,
    historical_significance TEXT,
    record_sale_price DECIMAL(12,2),
    record_sale_date DATE,
    image_url TEXT,
    article_id UUID REFERENCES cv_history_articles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ACHIEVEMENTS & BADGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT,
    rarity TEXT DEFAULT 'common',
    xp_reward INTEGER DEFAULT 50,
    requirements JSONB,
    is_secret BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cv_user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES cv_achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- MARKETPLACE
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id UUID REFERENCES cv_cards(id) ON DELETE CASCADE,
    price DECIMAL(12,2) NOT NULL,
    condition_notes TEXT,
    images TEXT[],
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled', 'expired')),
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS cv_trade_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_cards UUID[],
    receiver_cards UUID[],
    cash_adjustment DECIMAL(12,2),
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    responded_at TIMESTAMPTZ
);

-- ============================================================================
-- JAVARI AI CONVERSATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_javari_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    messages JSONB DEFAULT '[]',
    context JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS cv_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cv_notifications_user_id ON cv_notifications(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE cv_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_trivia_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_digital_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_user_digital_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all public profiles, update their own
CREATE POLICY "Public profiles are viewable by everyone" ON cv_profiles
    FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON cv_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Cards: Users can CRUD their own cards
CREATE POLICY "Users can view own cards" ON cv_cards
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cards" ON cv_cards
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cards" ON cv_cards
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cards" ON cv_cards
    FOR DELETE USING (auth.uid() = user_id);

-- Clubs: Public clubs viewable by all
CREATE POLICY "Public clubs viewable by all" ON cv_clubs
    FOR SELECT USING (is_public = true);

-- Trivia: Questions viewable by all
CREATE POLICY "Trivia questions viewable by all" ON cv_trivia_questions
    FOR SELECT USING (is_active = true);

-- Digital cards: Viewable by all
CREATE POLICY "Digital cards viewable by all" ON cv_digital_cards
    FOR SELECT USING (is_active = true);

-- Courses: Viewable by all (premium filtered in app)
CREATE POLICY "Courses viewable by all" ON cv_courses
    FOR SELECT USING (is_active = true);

-- Notifications: Users see their own
CREATE POLICY "Users see own notifications" ON cv_notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Grant service role full access
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update user XP and level
CREATE OR REPLACE FUNCTION update_user_xp(p_user_id UUID, p_xp_amount INTEGER)
RETURNS void AS $$
DECLARE
    current_xp INTEGER;
    current_level INTEGER;
    xp_for_next_level INTEGER;
BEGIN
    SELECT xp, level INTO current_xp, current_level
    FROM cv_profiles WHERE user_id = p_user_id;
    
    current_xp := current_xp + p_xp_amount;
    xp_for_next_level := current_level * 500; -- Each level requires level * 500 XP
    
    WHILE current_xp >= xp_for_next_level LOOP
        current_xp := current_xp - xp_for_next_level;
        current_level := current_level + 1;
        xp_for_next_level := current_level * 500;
    END LOOP;
    
    UPDATE cv_profiles 
    SET xp = current_xp, level = current_level, updated_at = NOW()
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get collection stats
CREATE OR REPLACE FUNCTION get_collection_stats(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_cards', COALESCE(SUM(quantity), 0),
        'total_value', COALESCE(SUM(current_value * quantity), 0),
        'total_invested', COALESCE(SUM(purchase_price * quantity), 0),
        'categories', jsonb_object_agg(category, cat_count)
    )
    INTO result
    FROM (
        SELECT category, COUNT(*) as cat_count
        FROM cv_cards WHERE user_id = p_user_id
        GROUP BY category
    ) sub,
    (SELECT SUM(quantity) as quantity, SUM(current_value * quantity) as current_value, 
            SUM(purchase_price * quantity) as purchase_price
     FROM cv_cards WHERE user_id = p_user_id) totals;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default achievements
INSERT INTO cv_achievements (name, description, icon, category, rarity, xp_reward, requirements) VALUES
('First Card', 'Add your first card to the collection', '🎴', 'collection', 'common', 10, '{"cards_added": 1}'),
('Century Club', 'Reach 100 cards in your collection', '💯', 'collection', 'uncommon', 100, '{"cards_added": 100}'),
('Thousand Strong', 'Reach 1000 cards', '🏆', 'collection', 'rare', 500, '{"cards_added": 1000}'),
('Graded Guru', 'Add 10 graded cards', '📊', 'collection', 'uncommon', 150, '{"graded_cards": 10}'),
('PSA 10 Hunter', 'Own a PSA 10 card', '💎', 'collection', 'rare', 200, '{"psa_10_count": 1}'),
('Trivia Novice', 'Answer 50 trivia questions', '🧠', 'trivia', 'common', 50, '{"trivia_answered": 50}'),
('Trivia Master', 'Answer 500 trivia questions', '🎓', 'trivia', 'epic', 300, '{"trivia_answered": 500}'),
('Perfect Score', 'Get 10 questions right in a row', '🎯', 'trivia', 'rare', 150, '{"trivia_streak": 10}'),
('Club Founder', 'Create a club', '👑', 'social', 'uncommon', 100, '{"clubs_created": 1}'),
('Social Butterfly', 'Join 5 clubs', '🦋', 'social', 'common', 75, '{"clubs_joined": 5}'),
('Scholar', 'Complete 5 academy courses', '📚', 'academy', 'uncommon', 200, '{"courses_completed": 5}'),
('Historian', 'Read 20 museum articles', '🏛️', 'museum', 'common', 100, '{"articles_read": 20}'),
('Big Spender', 'Collection value exceeds $10,000', '💰', 'collection', 'epic', 500, '{"collection_value": 10000}'),
('Whale', 'Collection value exceeds $100,000', '🐋', 'collection', 'legendary', 1000, '{"collection_value": 100000}')
ON CONFLICT DO NOTHING;

-- Insert sample trivia questions
INSERT INTO cv_trivia_questions (category, difficulty, question, options, correct_answer, explanation, xp_reward) VALUES
('pokemon', 'easy', 'What is the first Pokémon in the National Pokédex?', ARRAY['Pikachu', 'Bulbasaur', 'Charmander', 'Squirtle'], 1, 'Bulbasaur is #001 in the National Pokédex.', 10),
('pokemon', 'medium', 'Which Pokémon card is known as the "Holy Grail" of Pokémon collecting?', ARRAY['Pikachu Illustrator', '1st Ed Charizard', 'Ancient Mew', 'Shining Charizard'], 0, 'The Pikachu Illustrator card is the rarest, with only 39 copies known to exist.', 20),
('pokemon', 'hard', 'What year was the Pokémon Base Set released in Japan?', ARRAY['1996', '1997', '1998', '1999'], 0, 'The Base Set was released in Japan in October 1996.', 30),
('mtg', 'easy', 'What is the most valuable Magic: The Gathering card?', ARRAY['Black Lotus', 'Time Walk', 'Ancestral Recall', 'Mox Sapphire'], 0, 'Black Lotus from Alpha is the most valuable MTG card.', 10),
('mtg', 'medium', 'What year was Magic: The Gathering created?', ARRAY['1991', '1992', '1993', '1994'], 2, 'MTG was created by Richard Garfield and released in 1993.', 20),
('mtg', 'hard', 'How many cards were in the original Alpha set?', ARRAY['265', '295', '302', '310'], 1, 'The Alpha set contained 295 unique cards.', 30),
('sports', 'easy', 'Which card is considered the most valuable sports card?', ARRAY['T206 Honus Wagner', '1952 Topps Mickey Mantle', '1986 Fleer Michael Jordan', '2003 LeBron James RC'], 0, 'The T206 Honus Wagner has sold for over $7 million.', 10),
('sports', 'medium', 'What was the "Junk Wax Era"?', ARRAY['1970-1979', '1980-1985', '1986-1993', '1994-2000'], 2, 'The Junk Wax Era (1986-1993) saw massive overproduction of sports cards.', 20),
('grading', 'easy', 'What is the highest grade a card can receive from PSA?', ARRAY['9', '9.5', '10', '11'], 2, 'PSA 10 Gem Mint is the highest grade.', 10),
('grading', 'medium', 'What does BGS stand for?', ARRAY['Best Grading Service', 'Beckett Grading Services', 'Baseball Grading System', 'Basic Grade Score'], 1, 'BGS stands for Beckett Grading Services.', 20),
('history', 'medium', 'Why did Topps dump 1952 baseball cards into the ocean?', ARRAY['They were defective', 'Unsold inventory', 'Licensing dispute', 'Storage fire'], 1, 'Topps dumped unsold inventory, inadvertently creating scarcity.', 25),
('general', 'easy', 'What does "RC" stand for on a sports card?', ARRAY['Rare Card', 'Rookie Card', 'Regular Card', 'Rated Card'], 1, 'RC stands for Rookie Card - a player''s first officially licensed card.', 10)
ON CONFLICT DO NOTHING;

-- Insert default clubs
INSERT INTO cv_clubs (name, slug, description, club_type, is_public, requirements) VALUES
('Braggers Club', 'braggers', 'For collectors with impressive $10K+ collections', 'braggers', true, '{"min_collection_value": 10000}'),
('Vintage Baseball', 'vintage-baseball', 'Pre-war and vintage baseball card enthusiasts', 'vintage', true, '{}'),
('PSA 10 Hunters', 'psa-10-hunters', 'Collectors chasing gem mint perfection', 'grading', true, '{"min_psa_10s": 5}'),
('Pokemon Masters', 'pokemon-masters', 'For serious Pokemon TCG collectors', 'tcg', true, '{}'),
('MTG Commander Club', 'mtg-commander', 'Commander format enthusiasts', 'tcg', true, '{}'),
('New Collectors', 'new-collectors', 'Welcome space for those just starting out', 'newbie', true, '{}'),
('Card Flippers', 'card-flippers', 'Discussion of card investing strategies', 'investment', true, '{}'),
('Reds Fan Club', 'reds-fan-club', 'Cincinnati Reds baseball card collectors', 'team', true, '{}')
ON CONFLICT DO NOTHING;

-- Insert digital cards
INSERT INTO cv_digital_cards (name, description, series, rarity, unlock_method, xp_value, is_tradeable) VALUES
('Welcome Card', 'Earned by joining CardVerse', 'special', 'common', 'signup', 10, false),
('First Scan', 'Scanned your first card', 'achievement', 'common', 'first_scan', 15, false),
('Trivia Champion', 'Won a trivia game', 'game', 'uncommon', 'trivia_win', 25, true),
('Century Milestone', 'Reached 100 cards', 'achievement', 'rare', 'cards_100', 50, true),
('Club Founder', 'Created a club', 'social', 'rare', 'create_club', 40, false),
('Academy Graduate', 'Completed all beginner courses', 'academy', 'epic', 'courses_complete', 100, true),
('History Buff', 'Read all museum articles', 'academy', 'epic', 'museum_complete', 75, true),
('Day One OG', 'Joined during launch week', 'special', 'legendary', 'launch_week', 200, false),
('Crossover Champion', 'Also uses BarrelVerse', 'crossover', 'mythic', 'barrelverse_user', 150, true)
ON CONFLICT DO NOTHING;

-- Insert sample courses
INSERT INTO cv_courses (title, description, category, difficulty, duration_minutes, xp_reward, order_index) VALUES
('Introduction to Card Collecting', 'Learn the basics of trading card collecting', 'general', 'beginner', 30, 100, 1),
('Understanding Card Grading', 'Everything you need to know about PSA, BGS, and CGC', 'general', 'beginner', 45, 150, 2),
('Pokemon Card Fundamentals', 'A deep dive into Pokemon TCG collecting', 'pokemon', 'beginner', 60, 200, 3),
('Vintage Sports Cards 101', 'Introduction to pre-war and vintage sports cards', 'sports', 'intermediate', 90, 300, 4),
('MTG Collecting for Beginners', 'Getting started with Magic: The Gathering', 'mtg', 'beginner', 45, 150, 5),
('Identifying Counterfeit Cards', 'Protect yourself from fakes', 'general', 'intermediate', 60, 250, 6),
('Card Investment Strategies', 'Smart approaches to card collecting as investment', 'general', 'advanced', 120, 400, 7),
('The History of Trading Cards', 'From tobacco cards to modern collectibles', 'general', 'intermediate', 90, 300, 8)
ON CONFLICT DO NOTHING;

COMMIT;
