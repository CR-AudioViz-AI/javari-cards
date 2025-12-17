// ============================================================================
// CARD GAMES API - Multiple Game Types
// Trivia, Matching, Price Guessing, Flashcards, Collection Challenge
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// Price Guessing Game Data
const PRICE_GUESS_CARDS = [
  { id: 'pg-1', name: '1952 Topps Mickey Mantle PSA 9', image: '/cards/mantle-52.jpg', actual_price: 4200000, category: 'sports', hint: 'Most valuable post-war baseball card' },
  { id: 'pg-2', name: 'PSA 10 Base Set Charizard 1st Ed', image: '/cards/charizard-base.jpg', actual_price: 420000, category: 'pokemon', hint: 'The most iconic Pokemon card' },
  { id: 'pg-3', name: 'Alpha Black Lotus BGS 9.5', image: '/cards/black-lotus.jpg', actual_price: 350000, category: 'mtg', hint: 'The most powerful Magic card ever printed' },
  { id: 'pg-4', name: '1986 Fleer Michael Jordan RC PSA 10', image: '/cards/jordan-86.jpg', actual_price: 738000, category: 'sports', hint: 'The GOAT basketball player\'s rookie' },
  { id: 'pg-5', name: 'Pikachu Illustrator PSA 9', image: '/cards/pikachu-illustrator.jpg', actual_price: 2000000, category: 'pokemon', hint: 'Only 39 ever made' },
  { id: 'pg-6', name: '1909 T206 Honus Wagner PSA 5', image: '/cards/wagner.jpg', actual_price: 3700000, category: 'sports', hint: 'The "Holy Grail" of baseball cards' },
  { id: 'pg-7', name: 'Blue-Eyes White Dragon 1st Ed LOB PSA 10', image: '/cards/blue-eyes.jpg', actual_price: 85000, category: 'yugioh', hint: 'Kaiba\'s signature card' },
  { id: 'pg-8', name: 'Alpha Ancestral Recall PSA 10', image: '/cards/ancestral-recall.jpg', actual_price: 150000, category: 'mtg', hint: 'Part of the Power Nine' },
  { id: 'pg-9', name: '2009 Bowman Chrome Mike Trout Auto', image: '/cards/trout-auto.jpg', actual_price: 3900000, category: 'sports', hint: 'The defining modern baseball card' },
  { id: 'pg-10', name: 'Shining Charizard 1st Ed PSA 10', image: '/cards/shining-charizard.jpg', actual_price: 50000, category: 'pokemon', hint: 'From Neo Destiny set' },
];

// Matching Game Pairs
const MATCHING_PAIRS = {
  pokemon: [
    { id: 1, pairs: [{ text: 'Pikachu', match: 'Electric Type' }, { text: 'Charizard', match: 'Fire/Flying Type' }, { text: 'Bulbasaur', match: 'Grass/Poison Type' }, { text: 'Squirtle', match: 'Water Type' }, { text: 'Mewtwo', match: 'Psychic Type' }, { text: 'Gengar', match: 'Ghost/Poison Type' }] },
    { id: 2, pairs: [{ text: 'Base Set', match: '1999' }, { text: 'Neo Genesis', match: '2000' }, { text: 'EX Ruby & Sapphire', match: '2003' }, { text: 'Diamond & Pearl', match: '2007' }, { text: 'Scarlet & Violet', match: '2023' }, { text: 'Jungle', match: '1999' }] },
  ],
  mtg: [
    { id: 1, pairs: [{ text: 'Black Lotus', match: 'Power Nine' }, { text: 'Lightning Bolt', match: '3 Damage for 1 Mana' }, { text: 'Counterspell', match: 'Counter target spell' }, { text: 'Wrath of God', match: 'Destroy all creatures' }, { text: 'Sol Ring', match: 'Add 2 colorless mana' }, { text: 'Force of Will', match: 'Free counterspell' }] },
    { id: 2, pairs: [{ text: 'White', match: 'Plains' }, { text: 'Blue', match: 'Island' }, { text: 'Black', match: 'Swamp' }, { text: 'Red', match: 'Mountain' }, { text: 'Green', match: 'Forest' }, { text: 'Colorless', match: 'Wastes' }] },
  ],
  grading: [
    { id: 1, pairs: [{ text: 'PSA 10', match: 'Gem Mint' }, { text: 'PSA 9', match: 'Mint' }, { text: 'PSA 8', match: 'NM-MT' }, { text: 'BGS 9.5', match: 'Gem Mint (Beckett)' }, { text: 'BGS Black Label', match: 'All 10 Subgrades' }, { text: 'SGC 10', match: 'Pristine (SGC)' }] },
  ],
};

// Flashcard Decks
const FLASHCARD_DECKS = {
  grading: [
    { front: 'What does PSA stand for?', back: 'Professional Sports Authenticator' },
    { front: 'What is the highest PSA grade?', back: '10 (Gem Mint)' },
    { front: 'What are the 4 BGS subgrades?', back: 'Centering, Corners, Edges, Surface' },
    { front: 'What is a "slab"?', back: 'A graded card in its protective holder' },
    { front: 'What is a BGS Black Label?', back: 'A card with all 10 subgrades' },
    { front: 'What does CGC stand for?', back: 'Certified Guaranty Company' },
    { front: 'What percentage of cards get PSA 10?', back: 'About 2-5%' },
    { front: 'What company uses "tuxedo" labels?', back: 'SGC' },
  ],
  pokemon: [
    { front: 'What year was English Base Set released?', back: '1999' },
    { front: 'What is the rarest Pokemon card?', back: 'Pikachu Illustrator' },
    { front: 'What does "shadowless" mean?', back: 'No shadow on the artwork box (Base Set)' },
    { front: 'Who illustrated Base Set Charizard?', back: 'Mitsuhiro Arita' },
    { front: 'How many 1st Ed Base Set Charizards exist in PSA 10?', back: 'Around 120' },
    { front: 'What was the last WOTC set?', back: 'Skyridge' },
  ],
  mtg: [
    { front: 'What year was MTG created?', back: '1993' },
    { front: 'Who created Magic: The Gathering?', back: 'Richard Garfield' },
    { front: 'Name 3 cards from the Power Nine', back: 'Black Lotus, Mox Sapphire, Time Walk, Ancestral Recall, Timetwister' },
    { front: 'What is the Reserved List?', back: 'Cards Wizards promised never to reprint' },
    { front: 'What was the first MTG expansion?', back: 'Arabian Nights (1993)' },
  ],
  sports: [
    { front: 'What is the most valuable sports card?', back: '1952 Topps Mickey Mantle (sold for $12.6M)' },
    { front: 'What year is Jordan\'s Fleer rookie from?', back: '1986-87' },
    { front: 'What does RC mean?', back: 'Rookie Card' },
    { front: 'What was the "Junk Wax Era"?', back: '1987-1994, era of massive overproduction' },
    { front: 'What company is taking over from Topps for MLB?', back: 'Fanatics' },
  ],
};

// Daily Challenges
const DAILY_CHALLENGES = [
  { type: 'trivia', title: 'Daily Quiz', description: 'Answer 10 questions correctly', xp_reward: 100, goal: 10 },
  { type: 'price_guess', title: 'Price Master', description: 'Guess within 20% of actual price 5 times', xp_reward: 150, goal: 5 },
  { type: 'matching', title: 'Match Maker', description: 'Complete 3 matching games', xp_reward: 75, goal: 3 },
  { type: 'flashcards', title: 'Study Session', description: 'Review 20 flashcards', xp_reward: 50, goal: 20 },
  { type: 'collection', title: 'Card Hunter', description: 'Add 5 cards to your collection', xp_reward: 100, goal: 5 },
];

// Achievements
const GAME_ACHIEVEMENTS = [
  { id: 'trivia-novice', name: 'Trivia Novice', description: 'Answer 10 questions correctly', icon: '🎯', xp: 50 },
  { id: 'trivia-expert', name: 'Trivia Expert', description: 'Answer 100 questions correctly', icon: '🧠', xp: 200 },
  { id: 'trivia-master', name: 'Trivia Master', description: 'Answer 500 questions correctly', icon: '👑', xp: 500 },
  { id: 'price-eye', name: 'Appraiser', description: 'Guess 10 prices within 20%', icon: '💰', xp: 100 },
  { id: 'match-fast', name: 'Quick Matcher', description: 'Complete a match game in under 30 seconds', icon: '⚡', xp: 75 },
  { id: 'streak-7', name: 'Week Warrior', description: 'Play games 7 days in a row', icon: '🔥', xp: 150 },
  { id: 'all-categories', name: 'Well Rounded', description: 'Play trivia in all categories', icon: '🌈', xp: 100 },
  { id: 'perfect-game', name: 'Perfect Score', description: 'Get 100% on any trivia round', icon: '✨', xp: 200 },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get('game');
  const category = searchParams.get('category') || 'all';
  const count = Math.min(parseInt(searchParams.get('count') || '5'), 20);

  // Price Guessing Game
  if (game === 'price-guess') {
    let cards = [...PRICE_GUESS_CARDS];
    if (category !== 'all') {
      cards = cards.filter(c => c.category === category);
    }
    const shuffled = cards.sort(() => Math.random() - 0.5).slice(0, count);
    return NextResponse.json({
      success: true,
      game: 'price-guess',
      data: shuffled.map(c => ({
        id: c.id,
        name: c.name,
        image: c.image,
        category: c.category,
        hint: c.hint,
        // Don't send actual price - client submits guess, server validates
      })),
    });
  }

  // Matching Game
  if (game === 'matching') {
    const matchData = category !== 'all' 
      ? MATCHING_PAIRS[category as keyof typeof MATCHING_PAIRS] 
      : Object.values(MATCHING_PAIRS).flat();
    
    if (!matchData || matchData.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid category' }, { status: 400 });
    }

    const randomSet = matchData[Math.floor(Math.random() * matchData.length)];
    return NextResponse.json({
      success: true,
      game: 'matching',
      data: {
        pairs: randomSet.pairs.sort(() => Math.random() - 0.5),
        timeLimit: 60,
      },
    });
  }

  // Flashcards
  if (game === 'flashcards') {
    const deck = category !== 'all' 
      ? FLASHCARD_DECKS[category as keyof typeof FLASHCARD_DECKS]
      : Object.values(FLASHCARD_DECKS).flat();

    if (!deck) {
      return NextResponse.json({ success: false, error: 'Invalid category' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      game: 'flashcards',
      data: deck.sort(() => Math.random() - 0.5).slice(0, count),
      total: deck.length,
    });
  }

  // Daily Challenges
  if (game === 'daily') {
    const today = new Date().toISOString().split('T')[0];
    return NextResponse.json({
      success: true,
      game: 'daily',
      date: today,
      challenges: DAILY_CHALLENGES,
    });
  }

  // Achievements
  if (game === 'achievements') {
    return NextResponse.json({
      success: true,
      game: 'achievements',
      data: GAME_ACHIEVEMENTS,
    });
  }

  // Return all available games
  return NextResponse.json({
    success: true,
    games: [
      { id: 'trivia', name: 'Trivia', description: 'Test your card knowledge', endpoint: '/api/trivia' },
      { id: 'price-guess', name: 'Price Guess', description: 'Guess the value of famous cards', endpoint: '/api/games?game=price-guess' },
      { id: 'matching', name: 'Card Match', description: 'Match cards with their attributes', endpoint: '/api/games?game=matching' },
      { id: 'flashcards', name: 'Flashcards', description: 'Study and learn card facts', endpoint: '/api/games?game=flashcards' },
      { id: 'daily', name: 'Daily Challenges', description: 'Complete daily tasks for XP', endpoint: '/api/games?game=daily' },
    ],
    categories: ['all', 'pokemon', 'mtg', 'yugioh', 'sports', 'grading'],
    achievements: GAME_ACHIEVEMENTS.length,
  });
}

// POST endpoint for validating guesses
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { game, cardId, guess } = body;

  if (game === 'price-guess') {
    const card = PRICE_GUESS_CARDS.find(c => c.id === cardId);
    if (!card) {
      return NextResponse.json({ success: false, error: 'Card not found' }, { status: 404 });
    }

    const percentOff = Math.abs((guess - card.actual_price) / card.actual_price * 100);
    const isCorrect = percentOff <= 20;
    
    let xp = 0;
    if (percentOff <= 5) xp = 50;
    else if (percentOff <= 10) xp = 30;
    else if (percentOff <= 20) xp = 20;
    else if (percentOff <= 50) xp = 5;

    return NextResponse.json({
      success: true,
      result: {
        guess,
        actual_price: card.actual_price,
        percent_off: Math.round(percentOff),
        is_correct: isCorrect,
        xp_earned: xp,
        feedback: percentOff <= 5 ? 'Amazing! Expert appraiser!' :
                  percentOff <= 10 ? 'Great guess!' :
                  percentOff <= 20 ? 'Close enough!' :
                  percentOff <= 50 ? 'Getting there...' : 'Way off!',
      },
    });
  }

  return NextResponse.json({ success: false, error: 'Invalid game type' }, { status: 400 });
}
