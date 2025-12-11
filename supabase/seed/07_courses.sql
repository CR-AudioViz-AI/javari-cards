-- ============================================================================
-- CRAVCARDS SEED DATA: COURSES (20 Courses)
-- Complete academy curriculum
-- Created: December 11, 2025
-- ============================================================================

INSERT INTO card_courses (title, slug, description, category, difficulty, thumbnail_url, estimated_time, module_count, is_free, is_featured, status) VALUES

-- ============================================================================
-- POKEMON COURSES (5)
-- ============================================================================
('Pokemon Collecting 101', 'pokemon-collecting-101', 'Start your Pokemon card collecting journey with this comprehensive beginner course. Learn about card types, rarities, sets, and how to identify valuable cards.', 'pokemon', 'beginner', '/images/courses/pokemon-101.jpg', 45, 5, true, true, 'published'),

('Pokemon Card Grading Guide', 'pokemon-grading-guide', 'Master the art of evaluating Pokemon card condition. Learn what graders look for and how to estimate grades before submitting.', 'pokemon', 'intermediate', '/images/courses/pokemon-grading.jpg', 60, 6, true, true, 'published'),

('Vintage Pokemon Cards', 'vintage-pokemon-cards', 'Dive deep into WOTC-era Pokemon cards (1999-2003). Learn about Base Set, shadowless, 1st Edition, and why these cards are so valuable.', 'pokemon', 'intermediate', '/images/courses/vintage-pokemon.jpg', 90, 8, false, true, 'published'),

('Modern Pokemon Investing', 'modern-pokemon-investing', 'Learn strategies for investing in modern Pokemon sets. Understand chase cards, pull rates, and market dynamics.', 'pokemon', 'advanced', '/images/courses/modern-pokemon.jpg', 75, 6, false, false, 'published'),

('Japanese Pokemon Cards', 'japanese-pokemon-cards', 'Explore the world of Japanese Pokemon cards including exclusive sets, art variants, and collection strategies.', 'pokemon', 'intermediate', '/images/courses/japanese-pokemon.jpg', 60, 5, false, false, 'published'),

-- ============================================================================
-- MTG COURSES (4)
-- ============================================================================
('Magic: The Gathering Basics', 'mtg-basics', 'Introduction to MTG card collecting. Learn about card types, sets, formats, and what makes MTG cards valuable.', 'mtg', 'beginner', '/images/courses/mtg-basics.jpg', 45, 5, true, true, 'published'),

('The Reserved List Explained', 'mtg-reserved-list', 'Everything you need to know about the Reserved List - why it exists, what cards are on it, and investment implications.', 'mtg', 'intermediate', '/images/courses/reserved-list.jpg', 45, 4, true, false, 'published'),

('MTG Investment Strategies', 'mtg-investment', 'Advanced strategies for MTG collecting and investing. Learn about specs, buyouts, and long-term holds.', 'mtg', 'advanced', '/images/courses/mtg-investment.jpg', 90, 7, false, false, 'published'),

('Commander Cards Guide', 'mtg-commander', 'Focus on Commander format cards - the most popular casual format and its impact on card values.', 'mtg', 'intermediate', '/images/courses/mtg-commander.jpg', 60, 5, false, false, 'published'),

-- ============================================================================
-- SPORTS CARDS COURSES (5)
-- ============================================================================
('Sports Card Collecting 101', 'sports-cards-101', 'Complete beginners guide to sports card collecting. Learn about brands, rookie cards, parallels, and authentication.', 'sports', 'beginner', '/images/courses/sports-101.jpg', 60, 6, true, true, 'published'),

('Rookie Card Investing', 'rookie-card-investing', 'Master the art of rookie card investing. Learn how to identify breakout players and time your purchases.', 'sports', 'intermediate', '/images/courses/rookie-investing.jpg', 75, 6, false, true, 'published'),

('Baseball Card History', 'baseball-card-history', 'From T206 to Topps Chrome - explore the complete history of baseball cards and their most valuable specimens.', 'sports', 'beginner', '/images/courses/baseball-history.jpg', 90, 8, true, false, 'published'),

('Basketball Card Guide', 'basketball-card-guide', 'Complete guide to basketball card collecting including Prizm, Optic, Select, and other popular products.', 'sports', 'intermediate', '/images/courses/basketball-guide.jpg', 60, 5, false, false, 'published'),

('Football Card Fundamentals', 'football-card-fundamentals', 'Learn football card collecting from the ground up. Understand products, parallels, and key rookie cards.', 'sports', 'beginner', '/images/courses/football-fundamentals.jpg', 45, 5, true, false, 'published'),

-- ============================================================================
-- GRADING COURSES (3)
-- ============================================================================
('Card Grading Masterclass', 'card-grading-masterclass', 'The ultimate guide to card grading. Learn to assess condition, choose grading companies, and maximize value.', 'grading', 'intermediate', '/images/courses/grading-masterclass.jpg', 120, 10, false, true, 'published'),

('PSA Submission Guide', 'psa-submission-guide', 'Step-by-step guide to submitting cards to PSA. Learn submission tiers, pricing, and how to maximize your grades.', 'grading', 'beginner', '/images/courses/psa-guide.jpg', 45, 4, true, false, 'published'),

('Detecting Fake Cards', 'detecting-fakes', 'Protect yourself from counterfeit cards. Learn authentication techniques for Pokemon, MTG, and sports cards.', 'grading', 'advanced', '/images/courses/detecting-fakes.jpg', 60, 5, true, true, 'published'),

-- ============================================================================
-- BUSINESS/INVESTMENT COURSES (3)
-- ============================================================================
('Building a Card Portfolio', 'building-card-portfolio', 'Learn professional strategies for building a diversified card investment portfolio with proper risk management.', 'investment', 'advanced', '/images/courses/card-portfolio.jpg', 90, 7, false, false, 'published'),

('Card Storage & Preservation', 'card-storage-preservation', 'Protect your investment with proper storage techniques. Learn about sleeves, toploaders, climate control, and long-term preservation.', 'general', 'beginner', '/images/courses/card-storage.jpg', 30, 4, true, false, 'published'),

('Selling Cards Online', 'selling-cards-online', 'Master the art of selling cards online. Learn about eBay, marketplaces, shipping, and maximizing your profits.', 'business', 'intermediate', '/images/courses/selling-online.jpg', 60, 6, false, false, 'published')

ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  estimated_time = EXCLUDED.estimated_time,
  is_featured = EXCLUDED.is_featured;

-- ============================================================================
-- COURSE MODULES (Sample modules for first course)
-- ============================================================================
INSERT INTO card_course_modules (course_id, title, description, content, sort_order, estimated_time, has_quiz) 
SELECT 
  c.id,
  m.title,
  m.description,
  m.content,
  m.sort_order,
  m.estimated_time,
  m.has_quiz
FROM card_courses c
CROSS JOIN (
  VALUES
    ('Introduction to Pokemon Cards', 'Learn the basics of Pokemon card collecting', 
     '# Welcome to Pokemon Collecting!

Pokemon trading cards have been captivating collectors since 1996. Whether you''re nostalgic for the cards of your childhood or discovering the hobby for the first time, this course will teach you everything you need to know.

## What You''ll Learn

- The history of Pokemon cards
- Different card types and rarities
- How to identify valuable cards
- Building your first collection
- Storage and protection basics

## Why Collect Pokemon Cards?

Pokemon cards offer a unique combination of:

1. **Nostalgia** - Reconnecting with childhood memories
2. **Investment Potential** - Some cards appreciate significantly
3. **Community** - Active trading and collecting community
4. **Gameplay** - The TCG is still actively played worldwide
5. **Artistry** - Beautiful illustrations by talented artists

Let''s begin your journey to becoming a Pokemon card expert!', 
     1, 10, false),
    
    ('Understanding Card Types', 'Learn about Pokemon, Trainer, and Energy cards',
     '# Pokemon Card Types

Every Pokemon card falls into one of three main categories:

## Pokemon Cards

The stars of the show! Pokemon cards feature the creatures you battle with.

**Key Information on Pokemon Cards:**
- **HP (Hit Points)** - How much damage they can take
- **Type** - Fire, Water, Grass, etc.
- **Attacks** - What moves they can use
- **Weakness/Resistance** - Type matchups
- **Retreat Cost** - Energy needed to switch out

## Trainer Cards

Support cards that help you in battle:
- **Item Cards** - One-time effects
- **Supporter Cards** - Powerful but limited to one per turn
- **Stadium Cards** - Affect the whole field
- **Tool Cards** - Attach to Pokemon

## Energy Cards

The fuel for your Pokemon''s attacks:
- **Basic Energy** - Fire, Water, Grass, Lightning, Psychic, Fighting, Darkness, Metal, Fairy
- **Special Energy** - Unique effects beyond just providing energy

Understanding these three types is fundamental to both collecting and playing!',
     2, 8, true),
    
    ('Rarity Symbols Explained', 'Decode the symbols that indicate card rarity',
     '# Understanding Rarity

Every Pokemon card has a rarity symbol in the bottom right corner. Here''s what they mean:

## Common (Circle ●)
The most frequently printed cards. Easy to find, usually low value.

## Uncommon (Diamond ◆)
Slightly harder to find than commons. Mid-tier playability.

## Rare (Star ★)
Harder to pull from packs. Often includes evolution Pokemon.

## Holo Rare (Star ★ with Holo)
Same rarity symbol as rare, but the artwork has holographic foil. These are what most collectors chase!

## Modern Rarities

Recent sets have introduced many new rarity levels:
- **Ultra Rare** - Full art cards, Pokemon ex/V/VMAX
- **Secret Rare** - Numbered beyond the set count (e.g., 200/198)
- **Special Art Rare** - Stunning alternate artwork
- **Illustration Rare** - Extended art illustrations
- **Hyper Rare** - Gold or rainbow textured cards

The rarer the card, generally the more valuable - but condition and demand also matter!',
     3, 10, true),
    
    ('Identifying Valuable Cards', 'Learn what makes certain cards worth more',
     '# What Makes Cards Valuable?

Not all rare cards are valuable, and some common cards can be worth money. Here''s what actually drives value:

## Key Value Factors

### 1. Popularity
- Charizard will always command premiums
- Pikachu variations are highly collected
- Eeveelutions have dedicated fans

### 2. Rarity
- First printings (1st Edition, Shadowless)
- Low print runs
- Error cards and misprints

### 3. Condition
- A PSA 10 can be worth 10-100x a raw card
- Centering, corners, edges, and surface all matter

### 4. Age
- Vintage WOTC cards (1999-2003) are especially valuable
- Base Set remains the holy grail for many

### 5. Competitive Playability
- Cards used in tournament decks spike in value
- This fluctuates as the meta changes

## Red Flags for Fakes
- Wrong font or text alignment
- Incorrect coloring
- Missing texture on textured cards
- Wrong card stock thickness

Always buy from reputable sellers and learn authentication basics!',
     4, 12, false),
    
    ('Building Your Collection', 'Strategies for starting and growing your collection',
     '# Starting Your Collection

Ready to start collecting? Here are proven strategies for beginners:

## Define Your Focus

Trying to collect everything is overwhelming. Consider focusing on:
- **A Specific Pokemon** - Collect all Pikachu cards
- **A Set** - Complete a full set like Evolving Skies
- **An Era** - Focus on vintage WOTC or modern Scarlet & Violet
- **Art Style** - Collect specific artists or full arts
- **Graded Cards** - Build a PSA 10 collection

## Budget Strategies

### Sealed Product
- Buying packs is fun but expensive per card
- Better for chase cards and hits
- Hold some sealed for potential appreciation

### Singles
- Most cost-effective for specific cards
- Buy from TCGPlayer, eBay, or local shops
- Always check multiple sources for pricing

### Lots and Collections
- Bulk purchases can hide gems
- Good for building binder collections
- Research before buying blindly

## Storage Basics

From day one, protect your cards:
1. **Penny Sleeves** - First layer of protection
2. **Toploaders or Card Savers** - Rigid protection
3. **Binder Pages** - For display collections
4. **Storage Boxes** - For organized bulk storage

Never store cards in direct sunlight, humidity, or extreme temperatures!',
     5, 10, true)
) AS m(title, description, content, sort_order, estimated_time, has_quiz)
WHERE c.slug = 'pokemon-collecting-101';
