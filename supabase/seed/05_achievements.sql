-- ============================================================================
-- CRAVCARDS SEED DATA: ACHIEVEMENTS (100+)
-- Complete gamification achievement system
-- Created: December 11, 2025
-- ============================================================================

INSERT INTO achievements (id, name, description, icon, category, xp, requirement_type, requirement_value, is_secret) VALUES

-- ============================================================================
-- COLLECTION ACHIEVEMENTS (25)
-- ============================================================================
('collect-001', 'First Card', 'Add your first card to your collection', '🎴', 'collection', 10, 'cards_added', 1, false),
('collect-002', 'Getting Started', 'Add 10 cards to your collection', '📦', 'collection', 25, 'cards_added', 10, false),
('collect-003', 'Growing Collection', 'Add 50 cards to your collection', '📚', 'collection', 100, 'cards_added', 50, false),
('collect-004', 'Serious Collector', 'Add 100 cards to your collection', '🏆', 'collection', 250, 'cards_added', 100, false),
('collect-005', 'Dedicated Collector', 'Add 250 cards to your collection', '⭐', 'collection', 500, 'cards_added', 250, false),
('collect-006', 'Master Collector', 'Add 500 cards to your collection', '👑', 'collection', 1000, 'cards_added', 500, false),
('collect-007', 'Legendary Collector', 'Add 1,000 cards to your collection', '💎', 'collection', 2500, 'cards_added', 1000, false),
('collect-008', 'Pokemon Starter', 'Add your first Pokemon card', '⚡', 'collection', 15, 'pokemon_cards', 1, false),
('collect-009', 'Pokemon Fan', 'Collect 25 Pokemon cards', '🔥', 'collection', 75, 'pokemon_cards', 25, false),
('collect-010', 'Pokemon Master', 'Collect 100 Pokemon cards', '🎯', 'collection', 300, 'pokemon_cards', 100, false),
('collect-011', 'MTG Apprentice', 'Add your first MTG card', '🧙', 'collection', 15, 'mtg_cards', 1, false),
('collect-012', 'Planeswalker', 'Collect 25 MTG cards', '✨', 'collection', 75, 'mtg_cards', 25, false),
('collect-013', 'MTG Master', 'Collect 100 MTG cards', '🌟', 'collection', 300, 'mtg_cards', 100, false),
('collect-014', 'Sports Rookie', 'Add your first sports card', '⚾', 'collection', 15, 'sports_cards', 1, false),
('collect-015', 'Sports Fan', 'Collect 25 sports cards', '🏀', 'collection', 75, 'sports_cards', 25, false),
('collect-016', 'Sports Fanatic', 'Collect 100 sports cards', '🏈', 'collection', 300, 'sports_cards', 100, false),
('collect-017', 'First Holo', 'Add your first holographic card', '✨', 'collection', 50, 'holo_cards', 1, false),
('collect-018', 'Holo Hunter', 'Collect 10 holographic cards', '🌈', 'collection', 150, 'holo_cards', 10, false),
('collect-019', 'Graded Starter', 'Add your first graded card', '🎖️', 'collection', 50, 'graded_cards', 1, false),
('collect-020', 'Slab Collector', 'Collect 10 graded cards', '📊', 'collection', 200, 'graded_cards', 10, false),
('collect-021', 'Gem Mint Hunter', 'Own a PSA 10 card', '💎', 'collection', 500, 'psa_10_cards', 1, false),
('collect-022', 'Perfect Ten', 'Own 5 PSA 10 cards', '🏆', 'collection', 1500, 'psa_10_cards', 5, false),
('collect-023', 'Vintage Lover', 'Add a card from before 2000', '📜', 'collection', 100, 'vintage_cards', 1, false),
('collect-024', 'First Rookie', 'Add your first rookie card', '⭐', 'collection', 75, 'rookie_cards', 1, false),
('collect-025', 'Rookie Hunter', 'Collect 10 rookie cards', '🎯', 'collection', 300, 'rookie_cards', 10, false),

-- ============================================================================
-- TRADING ACHIEVEMENTS (15)
-- ============================================================================
('trade-001', 'First Trade', 'Complete your first trade', '🤝', 'trading', 50, 'trades_completed', 1, false),
('trade-002', 'Active Trader', 'Complete 5 trades', '📦', 'trading', 150, 'trades_completed', 5, false),
('trade-003', 'Trade Expert', 'Complete 25 trades', '💼', 'trading', 500, 'trades_completed', 25, false),
('trade-004', 'Trade Master', 'Complete 100 trades', '🏆', 'trading', 2000, 'trades_completed', 100, false),
('trade-005', 'First Sale', 'Sell your first card', '💰', 'trading', 50, 'cards_sold', 1, false),
('trade-006', 'Seller', 'Sell 10 cards', '💵', 'trading', 200, 'cards_sold', 10, false),
('trade-007', 'Top Seller', 'Sell 50 cards', '🤑', 'trading', 750, 'cards_sold', 50, false),
('trade-008', 'First Purchase', 'Buy your first card', '🛒', 'trading', 25, 'cards_bought', 1, false),
('trade-009', 'Shopper', 'Buy 10 cards', '🛍️', 'trading', 150, 'cards_bought', 10, false),
('trade-010', 'Big Spender', 'Buy 50 cards', '💎', 'trading', 500, 'cards_bought', 50, false),
('trade-011', 'First Listing', 'Create your first marketplace listing', '📝', 'trading', 25, 'listings_created', 1, false),
('trade-012', 'Active Seller', 'Have 10 active listings', '📋', 'trading', 100, 'active_listings', 10, false),
('trade-013', 'Store Owner', 'Have 50 active listings', '🏪', 'trading', 400, 'active_listings', 50, false),
('trade-014', 'Trusted Seller', 'Get 5 positive reviews', '⭐', 'trading', 200, 'positive_reviews', 5, false),
('trade-015', 'Top Rated', 'Get 25 positive reviews', '🌟', 'trading', 1000, 'positive_reviews', 25, false),

-- ============================================================================
-- TRIVIA ACHIEVEMENTS (15)
-- ============================================================================
('trivia-001', 'First Quiz', 'Complete your first trivia game', '❓', 'trivia', 10, 'trivia_games', 1, false),
('trivia-002', 'Quiz Fan', 'Complete 10 trivia games', '🎮', 'trivia', 50, 'trivia_games', 10, false),
('trivia-003', 'Trivia Enthusiast', 'Complete 50 trivia games', '🎯', 'trivia', 200, 'trivia_games', 50, false),
('trivia-004', 'First Perfect', 'Get a perfect score in trivia', '💯', 'trivia', 100, 'perfect_scores', 1, false),
('trivia-005', 'Perfectionist', 'Get 5 perfect trivia scores', '🏆', 'trivia', 500, 'perfect_scores', 5, false),
('trivia-006', 'Knowledge Seeker', 'Answer 100 questions correctly', '📚', 'trivia', 150, 'correct_answers', 100, false),
('trivia-007', 'Trivia Master', 'Answer 500 questions correctly', '🧠', 'trivia', 750, 'correct_answers', 500, false),
('trivia-008', 'Pokemon Expert', 'Answer 50 Pokemon questions correctly', '⚡', 'trivia', 200, 'pokemon_correct', 50, false),
('trivia-009', 'MTG Scholar', 'Answer 50 MTG questions correctly', '🧙', 'trivia', 200, 'mtg_correct', 50, false),
('trivia-010', 'Sports Genius', 'Answer 50 sports questions correctly', '⚾', 'trivia', 200, 'sports_correct', 50, false),
('trivia-011', 'Grading Guru', 'Answer 25 grading questions correctly', '📊', 'trivia', 150, 'grading_correct', 25, false),
('trivia-012', 'Quick Thinker', 'Answer 10 questions in under 5 seconds each', '⚡', 'trivia', 100, 'fast_answers', 10, false),
('trivia-013', 'Streak Starter', 'Get a 5-question streak', '🔥', 'trivia', 50, 'best_streak', 5, false),
('trivia-014', 'On Fire', 'Get a 10-question streak', '💥', 'trivia', 200, 'best_streak', 10, false),
('trivia-015', 'Unstoppable', 'Get a 20-question streak', '🌟', 'trivia', 500, 'best_streak', 20, false),

-- ============================================================================
-- SOCIAL ACHIEVEMENTS (15)
-- ============================================================================
('social-001', 'Club Member', 'Join your first club', '👥', 'social', 25, 'clubs_joined', 1, false),
('social-002', 'Social Butterfly', 'Join 5 clubs', '🦋', 'social', 100, 'clubs_joined', 5, false),
('social-003', 'Club Founder', 'Create your own club', '⭐', 'social', 150, 'clubs_created', 1, false),
('social-004', 'Community Builder', 'Your club reaches 10 members', '🏗️', 'social', 300, 'club_members', 10, false),
('social-005', 'Club Leader', 'Your club reaches 50 members', '👑', 'social', 1000, 'club_members', 50, false),
('social-006', 'First Post', 'Make your first club post', '💬', 'social', 15, 'club_posts', 1, false),
('social-007', 'Active Member', 'Make 25 club posts', '📝', 'social', 100, 'club_posts', 25, false),
('social-008', 'Helpful Hand', 'Help 5 new collectors', '🤝', 'social', 150, 'newbies_helped', 5, false),
('social-009', 'Mentor', 'Help 25 new collectors', '🎓', 'social', 500, 'newbies_helped', 25, false),
('social-010', 'First Follower', 'Get your first follower', '👤', 'social', 25, 'followers', 1, false),
('social-011', 'Rising Star', 'Get 10 followers', '⭐', 'social', 100, 'followers', 10, false),
('social-012', 'Influencer', 'Get 100 followers', '🌟', 'social', 1000, 'followers', 100, false),
('social-013', 'Networker', 'Follow 25 collectors', '🔗', 'social', 50, 'following', 25, false),
('social-014', 'Community Champion', 'Win a club competition', '🏆', 'social', 500, 'competitions_won', 1, false),
('social-015', 'Competition King', 'Win 10 club competitions', '👑', 'social', 2500, 'competitions_won', 10, false),

-- ============================================================================
-- MILESTONE ACHIEVEMENTS (15)
-- ============================================================================
('mile-001', 'Welcome', 'Create your account', '🎉', 'milestone', 10, 'account_created', 1, false),
('mile-002', 'Profile Complete', 'Fill out your full profile', '✅', 'milestone', 25, 'profile_complete', 1, false),
('mile-003', 'First Login Streak', 'Log in 3 days in a row', '📅', 'milestone', 25, 'login_streak', 3, false),
('mile-004', 'Weekly Warrior', 'Log in 7 days in a row', '🔥', 'milestone', 75, 'login_streak', 7, false),
('mile-005', 'Monthly Master', 'Log in 30 days in a row', '💫', 'milestone', 500, 'login_streak', 30, false),
('mile-006', 'Level 5', 'Reach level 5', '📈', 'milestone', 100, 'level', 5, false),
('mile-007', 'Level 10', 'Reach level 10', '📊', 'milestone', 250, 'level', 10, false),
('mile-008', 'Level 25', 'Reach level 25', '🎯', 'milestone', 750, 'level', 25, false),
('mile-009', 'Level 50', 'Reach level 50', '🏆', 'milestone', 2000, 'level', 50, false),
('mile-010', 'First Course', 'Complete your first course', '🎓', 'milestone', 50, 'courses_completed', 1, false),
('mile-011', 'Lifelong Learner', 'Complete 5 courses', '📚', 'milestone', 300, 'courses_completed', 5, false),
('mile-012', 'Educator', 'Complete all courses', '🎖️', 'milestone', 2000, 'courses_completed', 20, false),
('mile-013', '$100 Collection', 'Collection value reaches $100', '💵', 'milestone', 50, 'collection_value', 100, false),
('mile-014', '$1000 Collection', 'Collection value reaches $1,000', '💰', 'milestone', 250, 'collection_value', 1000, false),
('mile-015', '$10000 Collection', 'Collection value reaches $10,000', '💎', 'milestone', 1000, 'collection_value', 10000, false),

-- ============================================================================
-- SECRET ACHIEVEMENTS (15)
-- ============================================================================
('secret-001', 'Night Owl', 'Use the app between 2-4 AM', '🦉', 'milestone', 50, 'night_login', 1, true),
('secret-002', 'Early Bird', 'Use the app before 6 AM', '🐦', 'milestone', 50, 'early_login', 1, true),
('secret-003', 'Hidden Gem', 'Find a hidden digital card', '💎', 'milestone', 200, 'hidden_cards_found', 1, true),
('secret-004', 'Treasure Hunter', 'Find 10 hidden digital cards', '🗺️', 'milestone', 1000, 'hidden_cards_found', 10, true),
('secret-005', 'Charizard Fan', 'Add any Charizard card to collection', '🔥', 'collection', 100, 'charizard_owned', 1, true),
('secret-006', 'OG Collector', 'Own a card from 1999 or earlier', '📜', 'collection', 200, 'og_card', 1, true),
('secret-007', 'Black Label', 'Own a BGS Black Label card', '🏷️', 'collection', 500, 'black_label_owned', 1, true),
('secret-008', 'Six Figures', 'Collection value reaches $100,000', '🤑', 'milestone', 5000, 'collection_value', 100000, true),
('secret-009', 'Anniversary', 'Use app on your account anniversary', '🎂', 'milestone', 100, 'anniversary_login', 1, true),
('secret-010', 'Lucky 7', 'Get 7 perfect trivia scores in a row', '🍀', 'trivia', 777, 'perfect_streak', 7, true),
('secret-011', 'Completionist', 'Complete a full set', '✨', 'collection', 500, 'sets_completed', 1, true),
('secret-012', 'Error Card', 'Add an error/misprint card', '🔍', 'collection', 150, 'error_cards', 1, true),
('secret-013', 'Rainbow', 'Own cards of all 5 Pokemon types', '🌈', 'collection', 100, 'type_variety', 5, true),
('secret-014', 'Sports Variety', 'Own cards from 4 different sports', '🏅', 'collection', 150, 'sport_variety', 4, true),
('secret-015', 'The Whale', 'Make a purchase over $1,000', '🐋', 'trading', 1000, 'big_purchase', 1000, true)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  xp = EXCLUDED.xp,
  is_secret = EXCLUDED.is_secret;
