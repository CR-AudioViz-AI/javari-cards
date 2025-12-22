// ============================================================================
// DIGIMON CARD GAME API - FREE ACCESS TO 2,000+ CARDS
// CravCards - CR AudioViz AI, LLC
// Created: December 22, 2025
// Source: digimoncard.io
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const DIGIMON_API = 'https://digimoncard.io/api-public';

// Timeout for API requests
const API_TIMEOUT = 8000;

interface DigimonCard {
  name: string;
  type: string;
  color: string;
  stage?: string;
  digi_type?: string;
  attribute?: string;
  level?: number;
  play_cost?: number;
  evolution_cost?: number;
  cardrarity: string;
  artist?: string;
  dp?: number;
  cardnumber: string;
  maineffect?: string;
  soureeffect?: string;
  set_name: string;
  card_sets?: string[];
  image_url: string;
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
  color: string;
  stage: string;
  level: number | null;
  play_cost: number | null;
  evolution_cost: number | null;
  dp: number | null;
  main_effect: string;
  source_effect: string;
  price_low: number | null;
  price_mid: number | null;
  price_high: number | null;
  price_market: number | null;
  source: string;
}

function transformCard(card: DigimonCard): TransformedCard {
  return {
    id: `digimon-${card.cardnumber}`,
    name: card.name,
    category: 'digimon',
    set_name: card.set_name || (card.card_sets?.[0] || 'Unknown Set'),
    set_id: card.set_name?.toLowerCase().replace(/\s+/g, '-') || '',
    card_number: card.cardnumber,
    rarity: card.cardrarity || 'Unknown',
    image_url: card.image_url,
    image_large: card.image_url,
    artist: card.artist || 'Unknown',
    types: card.digi_type ? [card.digi_type] : [],
    color: card.color || 'Unknown',
    stage: card.stage || '',
    level: card.level || null,
    play_cost: card.play_cost || null,
    evolution_cost: card.evolution_cost || null,
    dp: card.dp || null,
    main_effect: card.maineffect || '',
    source_effect: card.soureeffect || '',
    price_low: null,
    price_mid: null,
    price_high: null,
    price_market: null,
    source: 'digimoncard.io',
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const cardNumber = searchParams.get('id') || searchParams.get('cardnumber');
  const color = searchParams.get('color');
  const type = searchParams.get('type');
  const rarity = searchParams.get('rarity');
  const setName = searchParams.get('set');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || searchParams.get('pageSize') || '20');

  try {
    // Build search URL
    const params = new URLSearchParams();
    params.set('series', 'Digimon Card Game'); // Required parameter
    
    if (query) {
      params.set('n', query); // Name search
    }
    
    if (cardNumber) {
      params.set('card', cardNumber);
    }
    
    if (color) {
      params.set('color', color);
    }
    
    if (type) {
      params.set('type', type);
    }
    
    if (rarity) {
      params.set('rarity', rarity);
    }
    
    if (setName) {
      params.set('pack', setName);
    }

    const url = `${DIGIMON_API}/search.php?${params.toString()}`;
    console.log('Digimon API URL:', url);

    const response = await fetchWithTimeout(url, {
      headers: { 
        'Accept': 'application/json',
        'User-Agent': 'CravCards/1.0'
      },
    });

    if (!response.ok) {
      throw new Error(`Digimon API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle different response formats
    let cards: DigimonCard[] = [];
    if (Array.isArray(data)) {
      cards = data;
    } else if (data.cards && Array.isArray(data.cards)) {
      cards = data.cards;
    } else if (data.error) {
      throw new Error(data.error);
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
      source: 'digimoncard.io',
    });

  } catch (error) {
    console.error('Digimon API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch Digimon cards',
        cards: [],
        source: 'digimoncard.io',
      },
      { status: 500 }
    );
  }
}

// Available colors for filtering
export const DIGIMON_COLORS = [
  'Red',
  'Blue', 
  'Yellow',
  'Green',
  'Black',
  'Purple',
  'White',
];

// Available card types
export const DIGIMON_TYPES = [
  'Digimon',
  'Digi-Egg',
  'Option',
  'Tamer',
];
