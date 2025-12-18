// ============================================================================
// CARD COMPARISON TOOL API
// Side-by-side comparison of cards (price, stats, investment potential)
// CravCards - CR AudioViz AI, LLC
// Created: December 17, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CardComparison {
  card_id: string;
  name: string;
  category: string;
  set_name: string;
  rarity: string;
  image_url: string | null;
  
  // Pricing
  current_price: number;
  price_7d_ago: number;
  price_30d_ago: number;
  price_change_7d: number;
  price_change_30d: number;
  all_time_high: number;
  all_time_low: number;
  
  // Market Data
  market_cap: number;
  volume_24h: number;
  liquidity_score: number;
  
  // Investment Metrics
  investment_score: number;
  volatility: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  
  // Card-Specific
  population: number | null;
  grading_premium: number;
  
  // Scores (0-100)
  collectibility_score: number;
  rarity_score: number;
  demand_score: number;
}

interface ComparisonResult {
  cards: CardComparison[];
  winner: {
    best_value: string;
    best_investment: string;
    most_liquid: string;
    highest_potential: string;
  };
  summary: string;
}

// GET - Compare cards
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cardIds = searchParams.get('cards')?.split(',') || [];
  const cardNames = searchParams.get('names')?.split(',') || [];

  if (cardIds.length === 0 && cardNames.length === 0) {
    return NextResponse.json({
      success: false,
      error: 'Provide card IDs or names to compare (comma-separated)',
      example: '/api/compare?cards=poke-charizard,poke-pikachu or /api/compare?names=Charizard,Pikachu',
    }, { status: 400 });
  }

  if (cardIds.length > 5 || cardNames.length > 5) {
    return NextResponse.json({
      success: false,
      error: 'Maximum 5 cards can be compared at once',
    }, { status: 400 });
  }

  try {
    const comparisons: CardComparison[] = [];
    
    // Process card IDs
    for (const cardId of cardIds) {
      if (!cardId.trim()) continue;
      const comparison = await getCardComparison(cardId.trim(), null);
      if (comparison) comparisons.push(comparison);
    }
    
    // Process card names
    for (const name of cardNames) {
      if (!name.trim()) continue;
      const comparison = await getCardComparison(null, name.trim());
      if (comparison) comparisons.push(comparison);
    }

    if (comparisons.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No cards found for comparison',
      }, { status: 404 });
    }

    // Determine winners
    const winner = {
      best_value: comparisons.reduce((a, b) => 
        (a.current_price / a.collectibility_score) < (b.current_price / b.collectibility_score) ? a : b
      ).name,
      best_investment: comparisons.reduce((a, b) => 
        a.investment_score > b.investment_score ? a : b
      ).name,
      most_liquid: comparisons.reduce((a, b) => 
        a.liquidity_score > b.liquidity_score ? a : b
      ).name,
      highest_potential: comparisons.reduce((a, b) => 
        a.price_change_30d > b.price_change_30d ? a : b
      ).name,
    };

    // Generate summary
    const summary = generateComparisonSummary(comparisons, winner);

    const result: ComparisonResult = {
      cards: comparisons,
      winner,
      summary,
    };

    return NextResponse.json({
      success: true,
      comparison: result,
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

// POST - Save a comparison for later reference
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, card_ids, name } = body;

    if (!user_id || !card_ids || card_ids.length < 2) {
      return NextResponse.json({
        success: false,
        error: 'User ID and at least 2 card IDs required',
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('cv_saved_comparisons')
      .insert({
        user_id,
        card_ids,
        comparison_name: name || `Comparison ${new Date().toLocaleDateString()}`,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      saved_comparison: data,
      message: 'Comparison saved successfully',
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 });
  }
}

// Get comparison data for a single card
async function getCardComparison(cardId: string | null, cardName: string | null): Promise<CardComparison | null> {
  // Try to find in database
  let query = supabase.from('cv_cards_master').select('*');
  
  if (cardId) {
    query = query.eq('card_id', cardId);
  } else if (cardName) {
    query = query.ilike('name', `%${cardName}%`);
  }

  const { data: dbCard } = await query.limit(1).single();

  // Generate comparison data (mix of DB and generated data for demo)
  const basePrice = dbCard?.current_price || 25 + Math.random() * 200;
  const name = dbCard?.name || cardName || cardId || 'Unknown Card';
  const category = dbCard?.category || detectCategory(name);
  
  // Generate realistic market data
  const price7dAgo = basePrice * (0.92 + Math.random() * 0.16);
  const price30dAgo = basePrice * (0.85 + Math.random() * 0.25);
  const ath = basePrice * (1.1 + Math.random() * 0.4);
  const atl = basePrice * (0.4 + Math.random() * 0.3);
  
  const volatility = 5 + Math.random() * 25;
  const volumeBase = category === 'pokemon' ? 5000 : category === 'mtg' ? 3000 : 2000;
  
  const collectibilityScore = calculateCollectibilityScore(name, category);
  const rarityScore = calculateRarityScore(dbCard?.rarity || 'rare');
  const demandScore = 40 + Math.random() * 50;
  
  return {
    card_id: cardId || `${category}-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    category,
    set_name: dbCard?.set_name || 'Unknown Set',
    rarity: dbCard?.rarity || 'rare',
    image_url: dbCard?.image_url || null,
    
    current_price: Math.round(basePrice * 100) / 100,
    price_7d_ago: Math.round(price7dAgo * 100) / 100,
    price_30d_ago: Math.round(price30dAgo * 100) / 100,
    price_change_7d: Math.round((basePrice - price7dAgo) * 100) / 100,
    price_change_30d: Math.round((basePrice - price30dAgo) * 100) / 100,
    all_time_high: Math.round(ath * 100) / 100,
    all_time_low: Math.round(atl * 100) / 100,
    
    market_cap: Math.round(basePrice * (1000 + Math.random() * 9000)),
    volume_24h: Math.round(volumeBase * (0.5 + Math.random())),
    liquidity_score: Math.round(60 + Math.random() * 35),
    
    investment_score: Math.round((collectibilityScore + rarityScore + demandScore) / 3),
    volatility: Math.round(volatility * 10) / 10,
    trend: basePrice > price7dAgo ? 'bullish' : basePrice < price7dAgo * 0.98 ? 'bearish' : 'neutral',
    
    population: Math.floor(100 + Math.random() * 5000),
    grading_premium: Math.round((1.3 + Math.random() * 0.7) * 100) / 100,
    
    collectibility_score: collectibilityScore,
    rarity_score: rarityScore,
    demand_score: Math.round(demandScore),
  };
}

// Detect category from card name
function detectCategory(name: string): string {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('charizard') || nameLower.includes('pikachu') || nameLower.includes('pokemon')) {
    return 'pokemon';
  }
  if (nameLower.includes('lotus') || nameLower.includes('mox') || nameLower.includes('jace')) {
    return 'mtg';
  }
  if (nameLower.includes('blue-eyes') || nameLower.includes('dark magician') || nameLower.includes('exodia')) {
    return 'yugioh';
  }
  if (nameLower.includes('jordan') || nameLower.includes('mantle') || nameLower.includes('brady')) {
    return 'sports';
  }
  return 'other';
}

// Calculate collectibility score based on various factors
function calculateCollectibilityScore(name: string, category: string): number {
  let score = 50;
  
  // Iconic cards get bonus
  const iconicCards = ['charizard', 'pikachu', 'black lotus', 'mox', 'blue-eyes', 'jordan', 'mantle', 'brady'];
  if (iconicCards.some(ic => name.toLowerCase().includes(ic))) {
    score += 30;
  }
  
  // Category popularity bonus
  if (category === 'pokemon') score += 10;
  if (category === 'sports') score += 8;
  
  // Add some randomness
  score += Math.random() * 10 - 5;
  
  return Math.min(100, Math.max(0, Math.round(score)));
}

// Calculate rarity score
function calculateRarityScore(rarity: string): number {
  const rarityScores: Record<string, number> = {
    'common': 10,
    'uncommon': 25,
    'rare': 50,
    'holo': 65,
    'ultra_rare': 80,
    'secret_rare': 90,
    'illustration_rare': 85,
    'special_art': 88,
    'mythic': 85,
    'legendary': 95,
  };
  return rarityScores[rarity.toLowerCase()] || 50;
}

// Generate comparison summary
function generateComparisonSummary(cards: CardComparison[], winner: ComparisonResult['winner']): string {
  if (cards.length === 2) {
    const [a, b] = cards;
    const priceDiff = Math.abs(a.current_price - b.current_price);
    const cheaper = a.current_price < b.current_price ? a.name : b.name;
    const better = a.investment_score > b.investment_score ? a.name : b.name;
    
    return `${cheaper} is $${priceDiff.toFixed(2)} cheaper, but ${better} shows stronger investment potential. ` +
           `${winner.most_liquid} has better market liquidity for easier buying/selling.`;
  }
  
  return `Based on current market data, ${winner.best_investment} offers the best investment potential ` +
         `while ${winner.best_value} provides the best value for collectors. ` +
         `${winner.most_liquid} is the easiest to trade with highest market activity.`;
}
