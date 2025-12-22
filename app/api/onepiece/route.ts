// ============================================================================
// ONE PIECE CARD GAME API - FREE ACCESS TO CARDS
// CravCards - CR AudioViz AI, LLC
// Created: December 22, 2025
// Note: Uses community-maintained API endpoints
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// One Piece card database API (community maintained)
const ONEPIECE_API = 'https://api.onepiecetcg.info';

// Timeout for API requests
const API_TIMEOUT = 8000;

interface OnePieceCard {
  id: string;
  name: string;
  card_number: string;
  rarity: string;
  type: string; // Leader, Character, Event, Stage
  color: string[];
  cost?: number;
  power?: number;
  counter?: number;
  life?: number;
  attribute?: string;
  effect?: string;
  trigger?: string;
  set_id: string;
  set_name: string;
  image_url: string;
  artist?: string;
}

interface TransformedCard {
  id: string;
  name: string;
  category: string;
  set_name: string;
  set_id: string;
  card_number: string;
  rarity: string;
  image_url: string;
  image_large: string;
  artist: string;
  types: string[];
  colors: string[];
  cost: number | null;
  power: number | null;
  counter: number | null;
  life: number | null;
  effect: string;
  trigger: string;
  price_low: number | null;
  price_mid: number | null;
  price_high: number | null;
  price_market: number | null;
  source: string;
}

function transformCard(card: OnePieceCard): TransformedCard {
  return {
    id: card.id || `onepiece-${card.card_number}`,
    name: card.name,
    category: 'onepiece',
    set_name: card.set_name || 'Unknown Set',
    set_id: card.set_id || '',
    card_number: card.card_number,
    rarity: card.rarity || 'Unknown',
    image_url: card.image_url,
    image_large: card.image_url,
    artist: card.artist || 'Unknown',
    types: card.type ? [card.type] : [],
    colors: card.color || [],
    cost: card.cost ?? null,
    power: card.power ?? null,
    counter: card.counter ?? null,
    life: card.life ?? null,
    effect: card.effect || '',
    trigger: card.trigger || '',
    price_low: null,
    price_mid: null,
    price_high: null,
    price_market: null,
    source: 'onepiecetcg.info',
  };
}

// Fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout: number = API_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Fallback: Use static data if API is unavailable
const SAMPLE_ONEPIECE_CARDS: OnePieceCard[] = [
  {
    id: 'OP01-001',
    name: 'Monkey D. Luffy',
    card_number: 'OP01-001',
    rarity: 'L',
    type: 'Leader',
    color: ['Red'],
    life: 5,
    power: 5000,
    attribute: 'Straw Hat Crew',
    effect: '[Activate: Main] [Once Per Turn] Give up to 1 of your Characters +1000 power during this turn.',
    set_id: 'OP01',
    set_name: 'Romance Dawn',
    image_url: 'https://en.onepiece-cardgame.com/images/cardlist/card/OP01-001.png',
    artist: 'Unknown',
  },
  {
    id: 'OP01-002',
    name: 'Eustass Kid',
    card_number: 'OP01-002',
    rarity: 'L',
    type: 'Leader',
    color: ['Red', 'Green'],
    life: 5,
    power: 5000,
    attribute: 'Kid Pirates',
    effect: '[DON!! x1] [When Attacking] You may add 1 DON!! card from your DON!! deck and set it as active.',
    set_id: 'OP01',
    set_name: 'Romance Dawn',
    image_url: 'https://en.onepiece-cardgame.com/images/cardlist/card/OP01-002.png',
    artist: 'Unknown',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const cardId = searchParams.get('id');
  const color = searchParams.get('color');
  const type = searchParams.get('type');
  const rarity = searchParams.get('rarity');
  const setId = searchParams.get('set');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || searchParams.get('pageSize') || '20');

  try {
    // Try the community API first
    let cards: OnePieceCard[] = [];
    let apiWorked = false;

    try {
      const params = new URLSearchParams();
      if (query) params.set('name', query);
      if (color) params.set('color', color);
      if (type) params.set('type', type);
      if (setId) params.set('set', setId);

      const url = `${ONEPIECE_API}/cards?${params.toString()}`;
      console.log('One Piece API URL:', url);

      const response = await fetchWithTimeout(url, {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'CravCards/1.0'
        },
      });

      if (response.ok) {
        const data = await response.json();
        cards = Array.isArray(data) ? data : (data.cards || []);
        apiWorked = true;
      }
    } catch (error) {
      console.log('One Piece API unavailable, using fallback:', error);
    }

    // If API failed, use sample data
    if (!apiWorked || cards.length === 0) {
      cards = SAMPLE_ONEPIECE_CARDS;
      
      // Filter sample data
      if (query) {
        cards = cards.filter(c => 
          c.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      if (color) {
        cards = cards.filter(c => c.color.includes(color));
      }
      if (type) {
        cards = cards.filter(c => c.type === type);
      }
    }

    // Apply pagination
    const totalCount = cards.length;
    const startIdx = (page - 1) * limit;
    const paginatedCards = cards.slice(startIdx, startIdx + limit);

    return NextResponse.json({
      success: true,
      cards: paginatedCards.map(transformCard),
      totalCount,
      page,
      pageSize: limit,
      source: apiWorked ? 'onepiecetcg.info' : 'fallback',
      note: apiWorked ? undefined : 'Using sample data - full API integration coming soon',
    });

  } catch (error) {
    console.error('One Piece API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch One Piece cards',
        cards: [],
        source: 'onepiece',
      },
      { status: 500 }
    );
  }
}

// Available colors
export const ONEPIECE_COLORS = [
  'Red',
  'Green',
  'Blue',
  'Purple',
  'Black',
  'Yellow',
];

// Available card types
export const ONEPIECE_TYPES = [
  'Leader',
  'Character',
  'Event',
  'Stage',
];

// Available sets
export const ONEPIECE_SETS = [
  { id: 'OP01', name: 'Romance Dawn' },
  { id: 'OP02', name: 'Paramount War' },
  { id: 'OP03', name: 'Pillars of Strength' },
  { id: 'OP04', name: 'Kingdoms of Intrigue' },
  { id: 'OP05', name: 'Awakening of the New Era' },
  { id: 'OP06', name: 'Wings of the Captain' },
  { id: 'OP07', name: '500 Years in the Future' },
  { id: 'OP08', name: 'Two Legends' },
  { id: 'ST01', name: 'Straw Hat Crew' },
  { id: 'ST02', name: 'Worst Generation' },
  { id: 'ST03', name: 'The Seven Warlords of the Sea' },
  { id: 'ST04', name: 'Animal Kingdom Pirates' },
  { id: 'ST05', name: 'Film Edition' },
  { id: 'ST06', name: 'Navy Absolute Justice' },
  { id: 'ST07', name: 'Big Mom Pirates' },
  { id: 'ST08', name: 'Monkey D. Luffy' },
  { id: 'ST09', name: 'Yamato' },
  { id: 'ST10', name: 'The Three Captains' },
];
