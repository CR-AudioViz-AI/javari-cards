export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// GAMES API - Multiple Card Collection Games
// CravCards - CR AudioViz AI, LLC
// Created: December 2024
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// Game Definitions
const GAMES = {
  trivia: {
    id: 'trivia',
    name: 'Card Collector Trivia',
    description: 'Test your knowledge across all card categories',
    icon: '🧠',
    difficulty: ['easy', 'medium', 'hard'],
    categories: ['pokemon', 'mtg', 'yugioh', 'sports', 'lorcana', 'grading', 'general'],
    rewards: { xp: '10-30 per question', badges: true },
    instructions: [
      'Choose a category or play all categories',
      'Answer questions within the time limit',
      'Earn XP based on difficulty',
      'Build streaks for bonus points',
    ],
  },
  priceGuess: {
    id: 'priceGuess',
    name: 'Price is Right: Card Edition',
    description: 'Guess the market value of rare cards',
    icon: '💰',
    difficulty: ['casual', 'expert'],
    categories: ['pokemon', 'mtg', 'yugioh', 'sports'],
    rewards: { xp: '15-50 per correct guess', badges: true },
    instructions: [
      'A card will be shown with details',
      'Guess the current market price',
      'Closer guesses earn more points',
      'Learn card values as you play',
    ],
  },
  setMatcher: {
    id: 'setMatcher',
    name: 'Set Matcher',
    description: 'Match cards to their correct sets',
    icon: '🎯',
    difficulty: ['easy', 'hard'],
    categories: ['pokemon', 'mtg', 'yugioh'],
    rewards: { xp: '5-20 per match', badges: true },
    instructions: [
      'Cards will appear on screen',
      'Match each card to its set',
      'Race against the clock',
      'Perfect matches earn bonuses',
    ],
  },
  rarityRank: {
    id: 'rarityRank',
    name: 'Rarity Ranker',
    description: 'Rank cards from common to rare',
    icon: '⭐',
    difficulty: ['beginner', 'advanced'],
    categories: ['all'],
    rewards: { xp: '10-40 per round', badges: true },
    instructions: [
      'Five cards will appear',
      'Drag them into rarity order',
      'Most rare at top, common at bottom',
      'Speed and accuracy matter',
    ],
  },
  memoryMatch: {
    id: 'memoryMatch',
    name: 'Card Memory',
    description: 'Classic memory game with trading cards',
    icon: '🃏',
    difficulty: ['easy', 'medium', 'hard'],
    categories: ['pokemon', 'mtg', 'yugioh', 'lorcana'],
    rewards: { xp: '20-60 per game', badges: true },
    instructions: [
      'Cards are placed face down',
      'Flip two cards to find matches',
      'Remember card positions',
      'Clear the board to win',
    ],
  },
  dailyChallenge: {
    id: 'dailyChallenge',
    name: 'Daily Challenge',
    description: 'New challenge every day',
    icon: '📅',
    difficulty: ['varies'],
    categories: ['all'],
    rewards: { xp: '100+ per completion', badges: true, streak: true },
    instructions: [
      'One unique challenge per day',
      'Complete for daily rewards',
      'Build streaks for bonus XP',
      'Compete on leaderboards',
    ],
  },
  collectionQuest: {
    id: 'collectionQuest',
    name: 'Collection Quest',
    description: 'Complete set challenges to earn rewards',
    icon: '🏆',
    difficulty: ['varies'],
    categories: ['all'],
    rewards: { xp: '50-500 per quest', badges: true, items: true },
    instructions: [
      'Accept collection quests',
      'Add specific cards to your collection',
      'Track progress toward goals',
      'Earn special rewards on completion',
    ],
  },
  gradeGuesser: {
    id: 'gradeGuesser',
    name: 'Grade Guesser',
    description: 'Predict what grade a card would receive',
    icon: '🔍',
    difficulty: ['novice', 'expert'],
    categories: ['all'],
    rewards: { xp: '20-50 per guess', badges: true },
    instructions: [
      'Examine a card closely',
      'Check centering, corners, edges, surface',
      'Predict the PSA/BGS grade',
      'Learn grading standards as you play',
    ],
  },
};

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'trivia_beginner', name: 'Quiz Novice', description: 'Answer 10 trivia questions correctly', xp: 50, icon: '🎓' },
  { id: 'trivia_master', name: 'Trivia Master', description: 'Answer 100 trivia questions correctly', xp: 500, icon: '🧙' },
  { id: 'price_expert', name: 'Price Expert', description: 'Guess 20 card prices within 10%', xp: 200, icon: '💎' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Complete daily challenges 7 days in a row', xp: 300, icon: '🔥' },
  { id: 'streak_30', name: 'Monthly Master', description: 'Complete daily challenges 30 days in a row', xp: 1000, icon: '⚡' },
  { id: 'collector_100', name: 'Centurion', description: 'Add 100 cards to your collection', xp: 400, icon: '💯' },
  { id: 'all_categories', name: 'Renaissance Collector', description: 'Add cards from all 5 categories', xp: 150, icon: '🌟' },
  { id: 'perfect_memory', name: 'Perfect Memory', description: 'Complete memory game with no mistakes', xp: 100, icon: '🧠' },
  { id: 'grading_ace', name: 'Grading Ace', description: 'Correctly guess 10 card grades', xp: 250, icon: '🔬' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete any timed game under 30 seconds', xp: 150, icon: '⏱️' },
];

// Leaderboard data structure
interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  games: number;
  streak: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('game');
  const action = searchParams.get('action');

  // Get specific game
  if (gameId && GAMES[gameId as keyof typeof GAMES]) {
    return NextResponse.json({
      success: true,
      game: GAMES[gameId as keyof typeof GAMES],
    });
  }

  // Get achievements
  if (action === 'achievements') {
    return NextResponse.json({
      success: true,
      achievements: ACHIEVEMENTS,
      totalXP: ACHIEVEMENTS.reduce((sum, a) => sum + a.xp, 0),
    });
  }

  // Get all games
  return NextResponse.json({
    success: true,
    games: Object.values(GAMES),
    totalGames: Object.keys(GAMES).length,
    achievements: ACHIEVEMENTS,
    features: [
      'XP system across all games',
      'Daily challenges with streaks',
      'Category-specific leaderboards',
      'Achievement badges',
      'Collection integration',
    ],
  });
}

export async function POST(request: NextRequest) {
  // Handle game submissions, score tracking, etc.
  try {
    const body = await request.json();
    const { gameId, userId, score, data } = body;

    // In production, this would update Supabase
    return NextResponse.json({
      success: true,
      message: 'Score recorded',
      xpEarned: score * 10,
      newAchievements: [],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
