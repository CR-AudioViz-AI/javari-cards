// app/api/seed/route.ts
// CravCards Database Seed API - One-time initialization endpoint
// Created: December 12, 2025

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// SEED DATA
// ============================================================================

const POKEMON_SETS = [
  { name: 'Base Set', slug: 'base-set', code: 'BS', category: 'pokemon', release_year: 1999, total_cards: 102 },
  { name: 'Jungle', slug: 'jungle', code: 'JU', category: 'pokemon', release_year: 1999, total_cards: 64 },
  { name: 'Fossil', slug: 'fossil', code: 'FO', category: 'pokemon', release_year: 1999, total_cards: 62 },
  { name: 'Base Set 2', slug: 'base-set-2', code: 'B2', category: 'pokemon', release_year: 2000, total_cards: 130 },
  { name: 'Team Rocket', slug: 'team-rocket', code: 'TR', category: 'pokemon', release_year: 2000, total_cards: 83 },
  { name: 'Gym Heroes', slug: 'gym-heroes', code: 'GH', category: 'pokemon', release_year: 2000, total_cards: 132 },
  { name: 'Gym Challenge', slug: 'gym-challenge', code: 'GC', category: 'pokemon', release_year: 2000, total_cards: 132 },
  { name: 'Neo Genesis', slug: 'neo-genesis', code: 'NG', category: 'pokemon', release_year: 2000, total_cards: 111 },
  { name: 'Neo Discovery', slug: 'neo-discovery', code: 'ND', category: 'pokemon', release_year: 2001, total_cards: 75 },
  { name: 'Neo Revelation', slug: 'neo-revelation', code: 'NR', category: 'pokemon', release_year: 2001, total_cards: 66 },
  { name: 'Neo Destiny', slug: 'neo-destiny', code: 'N4', category: 'pokemon', release_year: 2002, total_cards: 113 },
  { name: 'Legendary Collection', slug: 'legendary-collection', code: 'LC', category: 'pokemon', release_year: 2002, total_cards: 110 },
  { name: 'Expedition Base Set', slug: 'expedition', code: 'EX', category: 'pokemon', release_year: 2002, total_cards: 165 },
  { name: 'Aquapolis', slug: 'aquapolis', code: 'AQ', category: 'pokemon', release_year: 2003, total_cards: 186 },
  { name: 'Skyridge', slug: 'skyridge', code: 'SK', category: 'pokemon', release_year: 2003, total_cards: 182 },
  { name: 'Scarlet & Violet', slug: 'scarlet-violet', code: 'SV', category: 'pokemon', release_year: 2023, total_cards: 258 },
  { name: 'Paldea Evolved', slug: 'paldea-evolved', code: 'PAL', category: 'pokemon', release_year: 2023, total_cards: 279 },
  { name: 'Obsidian Flames', slug: 'obsidian-flames', code: 'OBF', category: 'pokemon', release_year: 2023, total_cards: 230 },
  { name: '151', slug: '151', code: 'MEW', category: 'pokemon', release_year: 2023, total_cards: 207 },
  { name: 'Paradox Rift', slug: 'paradox-rift', code: 'PAR', category: 'pokemon', release_year: 2023, total_cards: 266 },
  { name: 'Temporal Forces', slug: 'temporal-forces', code: 'TEF', category: 'pokemon', release_year: 2024, total_cards: 218 },
  { name: 'Twilight Masquerade', slug: 'twilight-masquerade', code: 'TWM', category: 'pokemon', release_year: 2024, total_cards: 226 },
  { name: 'Shrouded Fable', slug: 'shrouded-fable', code: 'SFA', category: 'pokemon', release_year: 2024, total_cards: 99 },
  { name: 'Stellar Crown', slug: 'stellar-crown', code: 'SCR', category: 'pokemon', release_year: 2024, total_cards: 175 },
  { name: 'Surging Sparks', slug: 'surging-sparks', code: 'SSP', category: 'pokemon', release_year: 2024, total_cards: 252 },
];

const BASE_SET_CARDS = [
  { name: 'Alakazam', card_number: '1/102', rarity: 'holo_rare', type: 'Psychic' },
  { name: 'Blastoise', card_number: '2/102', rarity: 'holo_rare', type: 'Water' },
  { name: 'Chansey', card_number: '3/102', rarity: 'holo_rare', type: 'Colorless' },
  { name: 'Charizard', card_number: '4/102', rarity: 'holo_rare', type: 'Fire' },
  { name: 'Clefairy', card_number: '5/102', rarity: 'holo_rare', type: 'Colorless' },
  { name: 'Gyarados', card_number: '6/102', rarity: 'holo_rare', type: 'Water' },
  { name: 'Hitmonchan', card_number: '7/102', rarity: 'holo_rare', type: 'Fighting' },
  { name: 'Machamp', card_number: '8/102', rarity: 'holo_rare', type: 'Fighting' },
  { name: 'Magneton', card_number: '9/102', rarity: 'holo_rare', type: 'Lightning' },
  { name: 'Mewtwo', card_number: '10/102', rarity: 'holo_rare', type: 'Psychic' },
  { name: 'Nidoking', card_number: '11/102', rarity: 'holo_rare', type: 'Grass' },
  { name: 'Ninetales', card_number: '12/102', rarity: 'holo_rare', type: 'Fire' },
  { name: 'Poliwrath', card_number: '13/102', rarity: 'holo_rare', type: 'Water' },
  { name: 'Raichu', card_number: '14/102', rarity: 'holo_rare', type: 'Lightning' },
  { name: 'Venusaur', card_number: '15/102', rarity: 'holo_rare', type: 'Grass' },
  { name: 'Zapdos', card_number: '16/102', rarity: 'holo_rare', type: 'Lightning' },
  { name: 'Beedrill', card_number: '17/102', rarity: 'rare', type: 'Grass' },
  { name: 'Dragonair', card_number: '18/102', rarity: 'rare', type: 'Colorless' },
  { name: 'Dugtrio', card_number: '19/102', rarity: 'rare', type: 'Fighting' },
  { name: 'Electabuzz', card_number: '20/102', rarity: 'rare', type: 'Lightning' },
  { name: 'Electrode', card_number: '21/102', rarity: 'rare', type: 'Lightning' },
  { name: 'Pidgeotto', card_number: '22/102', rarity: 'rare', type: 'Colorless' },
  { name: 'Arcanine', card_number: '23/102', rarity: 'uncommon', type: 'Fire' },
  { name: 'Charmeleon', card_number: '24/102', rarity: 'uncommon', type: 'Fire' },
  { name: 'Dewgong', card_number: '25/102', rarity: 'uncommon', type: 'Water' },
  { name: 'Dratini', card_number: '26/102', rarity: 'uncommon', type: 'Colorless' },
  { name: 'Farfetchd', card_number: '27/102', rarity: 'uncommon', type: 'Colorless' },
  { name: 'Growlithe', card_number: '28/102', rarity: 'uncommon', type: 'Fire' },
  { name: 'Haunter', card_number: '29/102', rarity: 'uncommon', type: 'Psychic' },
  { name: 'Ivysaur', card_number: '30/102', rarity: 'uncommon', type: 'Grass' },
  { name: 'Jynx', card_number: '31/102', rarity: 'uncommon', type: 'Psychic' },
  { name: 'Kadabra', card_number: '32/102', rarity: 'uncommon', type: 'Psychic' },
  { name: 'Kakuna', card_number: '33/102', rarity: 'uncommon', type: 'Grass' },
  { name: 'Machoke', card_number: '34/102', rarity: 'uncommon', type: 'Fighting' },
  { name: 'Magikarp', card_number: '35/102', rarity: 'uncommon', type: 'Water' },
  { name: 'Magmar', card_number: '36/102', rarity: 'uncommon', type: 'Fire' },
  { name: 'Nidorino', card_number: '37/102', rarity: 'uncommon', type: 'Grass' },
  { name: 'Poliwhirl', card_number: '38/102', rarity: 'uncommon', type: 'Water' },
  { name: 'Porygon', card_number: '39/102', rarity: 'uncommon', type: 'Colorless' },
  { name: 'Raticate', card_number: '40/102', rarity: 'uncommon', type: 'Colorless' },
  { name: 'Seel', card_number: '41/102', rarity: 'uncommon', type: 'Water' },
  { name: 'Wartortle', card_number: '42/102', rarity: 'uncommon', type: 'Water' },
  { name: 'Abra', card_number: '43/102', rarity: 'common', type: 'Psychic' },
  { name: 'Bulbasaur', card_number: '44/102', rarity: 'common', type: 'Grass' },
  { name: 'Caterpie', card_number: '45/102', rarity: 'common', type: 'Grass' },
  { name: 'Charmander', card_number: '46/102', rarity: 'common', type: 'Fire' },
  { name: 'Diglett', card_number: '47/102', rarity: 'common', type: 'Fighting' },
  { name: 'Doduo', card_number: '48/102', rarity: 'common', type: 'Colorless' },
  { name: 'Drowzee', card_number: '49/102', rarity: 'common', type: 'Psychic' },
  { name: 'Gastly', card_number: '50/102', rarity: 'common', type: 'Psychic' },
];

const TRIVIA_QUESTIONS = [
  { question: 'What year was the first Pokémon TCG set released in Japan?', correct_answer: '1996', options: ['1995', '1996', '1997', '1998'], category: 'pokemon', difficulty: 'medium' },
  { question: 'Which Pokémon card from Base Set is considered the most valuable?', correct_answer: 'Charizard', options: ['Blastoise', 'Venusaur', 'Charizard', 'Pikachu'], category: 'pokemon', difficulty: 'easy' },
  { question: 'What does PSA stand for in card grading?', correct_answer: 'Professional Sports Authenticator', options: ['Professional Sports Authenticator', 'Premium Sports Authority', 'Professional Stamp Authority', 'Premium Service Authenticator'], category: 'grading', difficulty: 'easy' },
  { question: 'What is the highest grade a card can receive from PSA?', correct_answer: '10', options: ['9', '9.5', '10', '100'], category: 'grading', difficulty: 'easy' },
  { question: 'Which company created Magic: The Gathering?', correct_answer: 'Wizards of the Coast', options: ['Hasbro', 'Wizards of the Coast', 'Upper Deck', 'Topps'], category: 'mtg', difficulty: 'easy' },
  { question: 'What year was the first Magic: The Gathering set released?', correct_answer: '1993', options: ['1991', '1992', '1993', '1994'], category: 'mtg', difficulty: 'medium' },
  { question: 'What is the rarest Magic: The Gathering card?', correct_answer: 'Black Lotus', options: ['Black Lotus', 'Mox Pearl', 'Time Walk', 'Ancestral Recall'], category: 'mtg', difficulty: 'easy' },
  { question: 'How many cards are in a standard Base Set Pokémon booster pack?', correct_answer: '11', options: ['10', '11', '12', '15'], category: 'pokemon', difficulty: 'medium' },
  { question: 'What does BGS stand for?', correct_answer: 'Beckett Grading Services', options: ['Best Grading Services', 'Beckett Grading Services', 'Basic Grade Standard', 'Better Grading System'], category: 'grading', difficulty: 'easy' },
  { question: 'Which Pokémon type was NOT in the original Base Set?', correct_answer: 'Dark', options: ['Fire', 'Water', 'Dark', 'Psychic'], category: 'pokemon', difficulty: 'hard' },
  { question: 'What is the maximum subgrade score in BGS grading?', correct_answer: '10', options: ['9', '9.5', '10', '10.5'], category: 'grading', difficulty: 'medium' },
  { question: 'Who illustrated the original Base Set Charizard?', correct_answer: 'Mitsuhiro Arita', options: ['Ken Sugimori', 'Mitsuhiro Arita', 'Atsuko Nishida', 'Keiji Kinebuchi'], category: 'pokemon', difficulty: 'hard' },
  { question: 'What is the CGC equivalent of a PSA 10?', correct_answer: '10 Pristine', options: ['10 Perfect', '10 Pristine', '10 Gem Mint', '10 Flawless'], category: 'grading', difficulty: 'hard' },
  { question: 'In what year did Topps release their first baseball cards?', correct_answer: '1951', options: ['1948', '1951', '1952', '1954'], category: 'sports', difficulty: 'hard' },
  { question: 'What is the most expensive sports card ever sold?', correct_answer: 'Mickey Mantle 1952 Topps', options: ['Babe Ruth T206', 'Mickey Mantle 1952 Topps', 'Honus Wagner T206', 'Michael Jordan Fleer Rookie'], category: 'sports', difficulty: 'medium' },
];

const ACHIEVEMENTS = [
  { name: 'First Steps', description: 'Add your first card to collection', icon: '🎯', category: 'collection', xp_reward: 10 },
  { name: 'Collector', description: 'Add 10 cards to collection', icon: '📦', category: 'collection', xp_reward: 50 },
  { name: 'Hoarder', description: 'Add 100 cards to collection', icon: '🏆', category: 'collection', xp_reward: 200 },
  { name: 'Trivia Newbie', description: 'Complete your first trivia game', icon: '🧠', category: 'trivia', xp_reward: 10 },
  { name: 'Quiz Master', description: 'Score 100% on a trivia game', icon: '💯', category: 'trivia', xp_reward: 100 },
  { name: 'Scholar', description: 'Complete your first course', icon: '📚', category: 'academy', xp_reward: 50 },
  { name: 'Graduate', description: 'Complete 5 courses', icon: '🎓', category: 'academy', xp_reward: 250 },
  { name: 'Social Butterfly', description: 'Join your first club', icon: '🦋', category: 'social', xp_reward: 25 },
  { name: 'Club Leader', description: 'Create a club', icon: '👑', category: 'social', xp_reward: 100 },
  { name: 'Trader', description: 'Complete your first trade', icon: '🤝', category: 'marketplace', xp_reward: 50 },
  { name: 'Pokemon Master', description: 'Collect 50 Pokemon cards', icon: '⚡', category: 'collection', xp_reward: 150 },
  { name: 'MTG Planeswalker', description: 'Collect 50 MTG cards', icon: '🔮', category: 'collection', xp_reward: 150 },
  { name: 'Sports Fan', description: 'Collect 50 sports cards', icon: '⚾', category: 'collection', xp_reward: 150 },
  { name: 'Daily Devotee', description: 'Login 7 days in a row', icon: '🔥', category: 'engagement', xp_reward: 75 },
  { name: 'Monthly Maven', description: 'Login 30 days in a row', icon: '📅', category: 'engagement', xp_reward: 300 },
];

const CARD_HISTORY = [
  { title: 'The Birth of Trading Cards', year: 1868, category: 'general', content: 'The first trading cards appeared in the United States, initially used as trade cards by businesses to advertise products. These early cards featured colorful lithographic images.', significance: 'high' },
  { title: 'Honus Wagner T206', year: 1909, category: 'sports', content: 'The famous T206 Honus Wagner card was produced by the American Tobacco Company. Wagner reportedly demanded his card be pulled from production, making it incredibly rare.', significance: 'legendary' },
  { title: 'Topps Enters Baseball', year: 1951, category: 'sports', content: 'Topps Chewing Gum Company released their first baseball cards, beginning a dynasty that would dominate the sports card industry for decades.', significance: 'high' },
  { title: 'Magic: The Gathering Launch', year: 1993, category: 'tcg', content: 'Richard Garfield and Wizards of the Coast released Magic: The Gathering, creating the first trading card game and revolutionizing the hobby forever.', significance: 'legendary' },
  { title: 'Pokemon TCG Japan Release', year: 1996, category: 'pokemon', content: 'The Pokemon Trading Card Game was first released in Japan by Media Factory, based on the popular video game. It would become the most successful TCG in history.', significance: 'legendary' },
  { title: 'Pokemon TCG US Launch', year: 1999, category: 'pokemon', content: 'Wizards of the Coast brought Pokemon TCG to the United States, sparking a global phenomenon. Kids across America rushed to stores to get their hands on booster packs.', significance: 'legendary' },
  { title: 'PSA Founded', year: 1991, category: 'grading', content: 'Professional Sports Authenticator (PSA) was founded, introducing standardized third-party grading to the hobby. This would transform how collectors valued and traded cards.', significance: 'high' },
  { title: 'BGS Launches', year: 1999, category: 'grading', content: 'Beckett Grading Services introduced their subgrade system, offering more detailed analysis of card condition. The BGS 10 "Black Label" became the holy grail of graded cards.', significance: 'high' },
  { title: 'First $1 Million Card Sale', year: 2016, category: 'market', content: 'A PSA 10 1952 Topps Mickey Mantle sold for over $1 million at auction, marking a historic milestone in the sports card market.', significance: 'high' },
  { title: 'Pokemon 25th Anniversary', year: 2021, category: 'pokemon', content: 'Pokemon celebrated 25 years with special anniversary sets and collaborations. The celebrations coincided with unprecedented market growth.', significance: 'medium' },
  { title: 'CGC Cards Launch', year: 2020, category: 'grading', content: 'CGC, known for comic book grading, entered the trading card market, offering another option for collectors seeking third-party authentication.', significance: 'medium' },
  { title: 'Covid Card Boom', year: 2020, category: 'market', content: 'The COVID-19 pandemic sparked an unprecedented boom in the trading card market as homebound collectors drove prices to new heights.', significance: 'high' },
  { title: 'Base Set Charizard Record', year: 2021, category: 'pokemon', content: 'A PSA 10 1st Edition Base Set Charizard sold for $420,000, setting a record for Pokemon cards at auction.', significance: 'high' },
  { title: 'Fanatics Acquires Topps', year: 2022, category: 'sports', content: 'Fanatics acquired Topps trading cards business, signaling major changes in the sports card licensing landscape.', significance: 'high' },
  { title: 'Pokemon Scarlet & Violet Era', year: 2023, category: 'pokemon', content: 'The Scarlet & Violet era began, introducing new game mechanics and continuing the franchise\'s dominance in the TCG market.', significance: 'medium' },
];

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function createTables() {
  const createTablesSQL = `
    -- Enable extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";

    -- Card Sets Table
    CREATE TABLE IF NOT EXISTS card_sets (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      code TEXT NOT NULL,
      category TEXT NOT NULL,
      release_year INTEGER,
      total_cards INTEGER,
      description TEXT,
      logo_url TEXT,
      is_featured BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Card Catalog Table
    CREATE TABLE IF NOT EXISTS card_catalog (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      set_id UUID REFERENCES card_sets(id),
      set_name TEXT,
      set_code TEXT,
      card_number TEXT,
      category TEXT NOT NULL,
      rarity TEXT,
      type TEXT,
      image_url TEXT,
      avg_price DECIMAL(10,2),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Trivia Questions Table
    CREATE TABLE IF NOT EXISTS trivia_questions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      question TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      options JSONB NOT NULL,
      category TEXT NOT NULL,
      difficulty TEXT DEFAULT 'medium',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Achievements Table
    CREATE TABLE IF NOT EXISTS achievements (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      category TEXT,
      xp_reward INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Card History Table (Museum)
    CREATE TABLE IF NOT EXISTS card_history (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      year INTEGER NOT NULL,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      significance TEXT DEFAULT 'medium',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Trivia Scores Table
    CREATE TABLE IF NOT EXISTS trivia_scores (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id),
      category TEXT,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      time_taken INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- User Achievements Table
    CREATE TABLE IF NOT EXISTS user_achievements (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id),
      achievement_id UUID REFERENCES achievements(id),
      earned_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, achievement_id)
    );

    -- Grading Guides Table
    CREATE TABLE IF NOT EXISTS grading_guides (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      company TEXT NOT NULL,
      grade TEXT NOT NULL,
      grade_name TEXT,
      description TEXT,
      centering TEXT,
      corners TEXT,
      edges TEXT,
      surface TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_card_catalog_name ON card_catalog USING gin(name gin_trgm_ops);
    CREATE INDEX IF NOT EXISTS idx_card_catalog_category ON card_catalog(category);
    CREATE INDEX IF NOT EXISTS idx_card_catalog_set_id ON card_catalog(set_id);
    CREATE INDEX IF NOT EXISTS idx_trivia_questions_category ON trivia_questions(category);
    CREATE INDEX IF NOT EXISTS idx_card_history_year ON card_history(year);

    -- Enable RLS
    ALTER TABLE card_sets ENABLE ROW LEVEL SECURITY;
    ALTER TABLE card_catalog ENABLE ROW LEVEL SECURITY;
    ALTER TABLE trivia_questions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
    ALTER TABLE card_history ENABLE ROW LEVEL SECURITY;
    ALTER TABLE trivia_scores ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
    ALTER TABLE grading_guides ENABLE ROW LEVEL SECURITY;

    -- Public read policies
    CREATE POLICY IF NOT EXISTS "Public read card_sets" ON card_sets FOR SELECT USING (true);
    CREATE POLICY IF NOT EXISTS "Public read card_catalog" ON card_catalog FOR SELECT USING (true);
    CREATE POLICY IF NOT EXISTS "Public read trivia_questions" ON trivia_questions FOR SELECT USING (true);
    CREATE POLICY IF NOT EXISTS "Public read achievements" ON achievements FOR SELECT USING (true);
    CREATE POLICY IF NOT EXISTS "Public read card_history" ON card_history FOR SELECT USING (true);
    CREATE POLICY IF NOT EXISTS "Public read grading_guides" ON grading_guides FOR SELECT USING (true);

    -- User-specific policies
    CREATE POLICY IF NOT EXISTS "Users read own trivia_scores" ON trivia_scores FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY IF NOT EXISTS "Users insert own trivia_scores" ON trivia_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY IF NOT EXISTS "Users read own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY IF NOT EXISTS "Users insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
  `;

  // Execute via RPC if available, otherwise return the SQL
  try {
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql: createTablesSQL });
    if (error) throw error;
    return { success: true };
  } catch {
    // RPC not available, tables may need manual creation
    return { success: false, sql: createTablesSQL };
  }
}

async function seedSets() {
  const { data, error } = await supabaseAdmin
    .from('card_sets')
    .upsert(POKEMON_SETS, { onConflict: 'slug' });
  
  if (error) throw error;
  return { inserted: POKEMON_SETS.length };
}

async function seedCards() {
  // Get Base Set ID first
  const { data: sets } = await supabaseAdmin
    .from('card_sets')
    .select('id')
    .eq('slug', 'base-set')
    .single();

  const cards = BASE_SET_CARDS.map(card => ({
    ...card,
    set_id: sets?.id,
    set_name: 'Base Set',
    set_code: 'BS',
    category: 'pokemon',
  }));

  const { error } = await supabaseAdmin
    .from('card_catalog')
    .upsert(cards, { onConflict: 'id' });

  if (error) throw error;
  return { inserted: cards.length };
}

async function seedTrivia() {
  const questions = TRIVIA_QUESTIONS.map(q => ({
    ...q,
    options: JSON.stringify(q.options),
  }));

  const { error } = await supabaseAdmin
    .from('trivia_questions')
    .upsert(questions, { onConflict: 'id' });

  if (error) throw error;
  return { inserted: questions.length };
}

async function seedAchievements() {
  const { error } = await supabaseAdmin
    .from('achievements')
    .upsert(ACHIEVEMENTS, { onConflict: 'id' });

  if (error) throw error;
  return { inserted: ACHIEVEMENTS.length };
}

async function seedHistory() {
  const { error } = await supabaseAdmin
    .from('card_history')
    .upsert(CARD_HISTORY, { onConflict: 'id' });

  if (error) throw error;
  return { inserted: CARD_HISTORY.length };
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function POST(request: Request) {
  try {
    // Verify admin/secret key
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.SEED_SECRET_KEY || 'cravcards-seed-2025';
    
    if (authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const results: Record<string, unknown> = {};
    const errors: string[] = [];

    // Step 1: Create tables
    try {
      results.tables = await createTables();
    } catch (e) {
      errors.push(`Tables: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }

    // Step 2: Seed sets
    try {
      results.sets = await seedSets();
    } catch (e) {
      errors.push(`Sets: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }

    // Step 3: Seed cards
    try {
      results.cards = await seedCards();
    } catch (e) {
      errors.push(`Cards: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }

    // Step 4: Seed trivia
    try {
      results.trivia = await seedTrivia();
    } catch (e) {
      errors.push(`Trivia: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }

    // Step 5: Seed achievements
    try {
      results.achievements = await seedAchievements();
    } catch (e) {
      errors.push(`Achievements: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }

    // Step 6: Seed history
    try {
      results.history = await seedHistory();
    } catch (e) {
      errors.push(`History: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }

    return NextResponse.json({
      success: errors.length === 0,
      timestamp: new Date().toISOString(),
      results,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Seed failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Check current state
  try {
    const checks: Record<string, { exists: boolean; count?: number }> = {};

    const tables = ['card_sets', 'card_catalog', 'trivia_questions', 'achievements', 'card_history'];
    
    for (const table of tables) {
      try {
        const { count, error } = await supabaseAdmin
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        checks[table] = { exists: !error, count: count || 0 };
      } catch {
        checks[table] = { exists: false };
      }
    }

    const allExist = Object.values(checks).every(c => c.exists);
    const hasData = Object.values(checks).some(c => (c.count || 0) > 0);

    return NextResponse.json({
      status: allExist ? (hasData ? 'seeded' : 'empty') : 'missing_tables',
      tables: checks,
      message: allExist 
        ? (hasData ? 'Database is seeded' : 'Tables exist but empty - POST to seed')
        : 'Tables missing - POST to create and seed',
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Check failed' },
      { status: 500 }
    );
  }
}
