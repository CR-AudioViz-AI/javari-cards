// ============================================================================
// TRENDING CARDS & PRICE ALERTS API
// Track hot cards, price changes, and market trends
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// Simulated trending data (in production, this would come from database)
const TRENDING_CARDS = [
  {
    id: 'pokemon-charizard-base-4',
    name: 'Charizard',
    category: 'pokemon',
    set: 'Base Set',
    trend: 'up',
    change_percent: 12.5,
    current_price: 350,
    image_url: 'https://images.pokemontcg.io/base1/4.png',
    reason: 'High demand after streaming reveal',
  },
  {
    id: 'mtg-black-lotus',
    name: 'Black Lotus',
    category: 'mtg',
    set: 'Alpha',
    trend: 'stable',
    change_percent: 0.5,
    current_price: 500000,
    image_url: 'https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg',
    reason: 'Consistent collector demand',
  },
  {
    id: 'sports-jordan-rookie',
    name: 'Michael Jordan Rookie',
    category: 'sports',
    set: '1986 Fleer',
    trend: 'up',
    change_percent: 8.3,
    current_price: 25000,
    image_url: 'https://thesportsdb.com/images/media/player/thumb/h9y6s31547838080.jpg',
    reason: 'Documentary anniversary bump',
  },
  {
    id: 'yugioh-blue-eyes',
    name: 'Blue-Eyes White Dragon',
    category: 'yugioh',
    set: 'LOB-001',
    trend: 'up',
    change_percent: 15.2,
    current_price: 2500,
    image_url: 'https://images.ygoprodeck.com/images/cards_small/89631139.jpg',
    reason: 'New support cards announced',
  },
  {
    id: 'lorcana-mickey',
    name: 'Mickey Mouse - Brave Little Tailor',
    category: 'lorcana',
    set: 'The First Chapter',
    trend: 'down',
    change_percent: -5.1,
    current_price: 85,
    image_url: 'https://lorcana-api.com/images/cards/TFC/1.png',
    reason: 'New set rotation',
  },
];

const CATEGORIES = ['all', 'pokemon', 'mtg', 'yugioh', 'lorcana', 'sports'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category')?.toLowerCase() || 'all';
  const trend = searchParams.get('trend')?.toLowerCase(); // 'up', 'down', 'stable'
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);

  let filtered = [...TRENDING_CARDS];

  // Filter by category
  if (category !== 'all') {
    filtered = filtered.filter(card => card.category === category);
  }

  // Filter by trend direction
  if (trend) {
    filtered = filtered.filter(card => card.trend === trend);
  }

  // Sort by change percent (biggest movers first)
  filtered.sort((a, b) => Math.abs(b.change_percent) - Math.abs(a.change_percent));

  return NextResponse.json({
    success: true,
    trending: filtered.slice(0, limit),
    categories: CATEGORIES,
    lastUpdated: new Date().toISOString(),
    marketSummary: {
      totalTracked: TRENDING_CARDS.length,
      trending_up: TRENDING_CARDS.filter(c => c.trend === 'up').length,
      trending_down: TRENDING_CARDS.filter(c => c.trend === 'down').length,
      stable: TRENDING_CARDS.filter(c => c.trend === 'stable').length,
    },
  });
}
