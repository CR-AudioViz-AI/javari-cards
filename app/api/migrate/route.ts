export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// DATABASE MIGRATION API
// Creates necessary tables for CravCards features
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// Fixed: December 17, 2025 - TypeScript .catch() error
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lazy Supabase client — initialized on first request (not at module load time)
let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kteobfyferrukqeolofj.supabase.co";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW9iZnlmZXJydWtxZW9sb2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NzUwNjUsImV4cCI6MjA1NTE1MTA2NX0.r3_3bXtqo6VCJqYHijtxdEpXkWyNVGKd67kNQvqkrD4";
    _supabase = createClient(url, key);
  }
  return _supabase!;
}
const supabase = getSupabase();
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const secret = searchParams.get('secret');

  // Basic protection
  if (secret !== 'cr-migrate-2025') {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized',
    }, { status: 401 });
  }

  const results: Record<string, string> = {};

  try {
    // Create wishlist table
    if (!action || action === 'wishlist' || action === 'all') {
      try {
        const { error: wishlistError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS cv_wishlist (
              id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
              card_id text,
              card_name text NOT NULL,
              category text,
              set_name text,
              image_url text,
              target_price decimal(10,2),
              priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
              notes text,
              created_at timestamptz DEFAULT now(),
              updated_at timestamptz DEFAULT now()
            );
            CREATE INDEX IF NOT EXISTS idx_cv_wishlist_user ON cv_wishlist(user_id);
          `
        });
        results.wishlist = wishlistError ? `error: ${wishlistError.message}` : 'created or exists';
      } catch {
        results.wishlist = 'rpc not available';
      }
    }

    // Add more trivia questions
    if (!action || action === 'trivia' || action === 'all') {
      const newQuestions = [
        {
          category: 'pokemon',
          difficulty: 'medium', 
          question: 'What year was the first Pokemon video game released in Japan?',
          correct_answer: '1996',
          wrong_answers: ['1995', '1997', '1998'],
          explanation: 'Pokemon Red and Green were released in Japan on February 27, 1996.',
          xp_reward: 15,
          is_active: true,
        },
        {
          category: 'pokemon',
          difficulty: 'hard',
          question: 'What is the rarest Pokemon card ever sold at auction?',
          correct_answer: 'Pikachu Illustrator',
          wrong_answers: ['1st Edition Charizard', 'Shadowless Charizard', 'Trophy Pikachu'],
          explanation: 'A Pikachu Illustrator card sold for $5.275 million in 2021.',
          xp_reward: 25,
          is_active: true,
        },
        {
          category: 'mtg',
          difficulty: 'easy',
          question: 'How many cards are in a standard Magic booster pack?',
          correct_answer: '15',
          wrong_answers: ['10', '12', '20'],
          explanation: 'Standard Magic boosters contain 15 cards.',
          xp_reward: 10,
          is_active: true,
        },
        {
          category: 'yugioh',
          difficulty: 'medium',
          question: 'What was the first Yu-Gi-Oh set released in English?',
          correct_answer: 'Legend of Blue Eyes White Dragon',
          wrong_answers: ['Metal Raiders', 'Pharaohs Servant', 'Magic Ruler'],
          explanation: 'LOB was released March 8, 2002 in North America.',
          xp_reward: 15,
          is_active: true,
        },
        {
          category: 'sports',
          difficulty: 'easy',
          question: 'What company produced the iconic 1952 Mickey Mantle card?',
          correct_answer: 'Topps',
          wrong_answers: ['Bowman', 'Fleer', 'Upper Deck'],
          explanation: 'The 1952 Topps set is considered the most iconic baseball card set ever.',
          xp_reward: 10,
          is_active: true,
        },
        {
          category: 'grading',
          difficulty: 'easy',
          question: 'What does PSA stand for?',
          correct_answer: 'Professional Sports Authenticator',
          wrong_answers: ['Premium Sports Authentication', 'Professional Slab Association', 'Primary Sports Assessor'],
          explanation: 'PSA was founded in 1991 and is the largest card grading company.',
          xp_reward: 10,
          is_active: true,
        },
        {
          category: 'grading',
          difficulty: 'medium',
          question: 'What is a BGS Black Label?',
          correct_answer: 'All four subgrades are 10',
          wrong_answers: ['The card is damaged', 'The label is limited edition', 'The case is premium'],
          explanation: 'Black Label indicates perfect 10s in Centering, Corners, Edges, and Surface.',
          xp_reward: 15,
          is_active: true,
        },
        {
          category: 'general',
          difficulty: 'easy',
          question: 'What does NM stand for in card grading?',
          correct_answer: 'Near Mint',
          wrong_answers: ['No Marks', 'New Mint', 'Nearly Marked'],
          explanation: 'Near Mint indicates excellent condition with minimal wear.',
          xp_reward: 10,
          is_active: true,
        },
        {
          category: 'pokemon',
          difficulty: 'medium',
          question: 'Which Pokemon set introduced Full Art cards?',
          correct_answer: 'Black & White',
          wrong_answers: ['HeartGold SoulSilver', 'Diamond & Pearl', 'XY'],
          explanation: 'Full Art cards debuted in the Black & White base set in 2011.',
          xp_reward: 15,
          is_active: true,
        },
        {
          category: 'sports',
          difficulty: 'hard',
          question: 'What year did PSA grade its first card?',
          correct_answer: '1991',
          wrong_answers: ['1986', '1995', '1989'],
          explanation: 'PSA was founded in 1991 and revolutionized the card grading industry.',
          xp_reward: 25,
          is_active: true,
        },
      ];

      const { data, error } = await supabase
        .from('cv_trivia_questions')
        .upsert(newQuestions, { onConflict: 'question' })
        .select();

      results.trivia = error ? `error: ${error.message}` : `added ${data?.length || 0} questions`;
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 });
  }
}
