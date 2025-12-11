-- ============================================================================
-- CRAVCARDS MASTER SEED SCRIPT
-- Execute this to populate the entire database
-- Created: December 11, 2025
-- ============================================================================

-- IMPORTANT: Run these files in order:
-- 1. 01_card_catalog_schema.sql - Creates missing tables
-- 2. 02_pokemon_sets.sql - Pokemon sets (130+)
-- 3. 03_pokemon_base_set_cards.sql - Base Set cards (102)
-- 4. 04_trivia_questions.sql - Trivia questions (200+)
-- 5. 05_achievements.sql - Achievements (100+)
-- 6. 06_grading_guides.sql - Grading guides (5)
-- 7. 07_courses_complete.sql - Courses (22)
-- 8. 08_history_museum.sql - History content (25+)

-- ============================================================================
-- SUMMARY OF SEED DATA
-- ============================================================================
-- 
-- TABLES CREATED:
-- - card_sets: Master list of all card sets
-- - card_catalog: Master list of all individual cards
-- - card_history: Museum/history content
-- - card_courses: Academy courses
-- - card_course_modules: Course lesson content
-- - grading_guides: Grading company guides
--
-- DATA SEEDED:
-- - 130+ Pokemon sets (1999-2025)
-- - 102 Pokemon Base Set cards (complete)
-- - 200+ trivia questions (all categories)
-- - 100+ achievements (all categories)
-- - 5 grading guides (PSA, BGS, CGC, SGC, General)
-- - 22 courses (Pokemon, MTG, Sports, Grading, Investment)
-- - 25+ history/museum entries
--
-- TOTAL: ~600+ records across all tables
--
-- ============================================================================

-- Verification queries (run after seeding):
SELECT 'card_sets' as table_name, COUNT(*) as count FROM card_sets
UNION ALL SELECT 'card_catalog', COUNT(*) FROM card_catalog
UNION ALL SELECT 'trivia_questions', COUNT(*) FROM trivia_questions
UNION ALL SELECT 'achievements', COUNT(*) FROM achievements
UNION ALL SELECT 'grading_guides', COUNT(*) FROM grading_guides
UNION ALL SELECT 'card_courses', COUNT(*) FROM card_courses
UNION ALL SELECT 'card_history', COUNT(*) FROM card_history;
