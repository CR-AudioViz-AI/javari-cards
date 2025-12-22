// ============================================================================
// FLESH AND BLOOD TCG API - FREE ACCESS TO CARDS
// CravCards - CR AudioViz AI, LLC
// Created: December 22, 2025
// Source: fabdb.net / flesh-and-blood-cards API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// FAB DB API (community maintained)
const FABDB_API = 'https://api.fabdb.net';

// Timeout for API requests
const API_TIMEOUT = 8000;

interface FABCard {
  identifier: string;
  name: string;
  pitch?: string;
  cost?: string;
  power?: string;
  defense?: string;
  health?: string;
  intelligence?: string;
  types: string[];
  card_keywords?: string[];
  abilities?: string[];
  ability_and_effect_keywords?: string[];
  granted_keywords?: string[];
  removed_keywords?: string[];
  interacts_with_keywords?: string[];
  functional_text?: string;
  functional_text_plain?: string;
  type_text?: string;
  played_horizontally?: boolean;
  blitz_legal?: boolean;
  cc_legal?: boolean;
  commoner_legal?: boolean;
  blitz_living_legend?: boolean;
  cc_living_legend?: boolean;
  blitz_banned?: boolean;
  cc_banned?: boolean;
  commoner_banned?: boolean;
  upf_banned?: boolean;
  blitz_suspended?: boolean;
  cc_suspended?: boolean;
  commoner_suspended?: boolean;
  ll_restricted?: boolean;
  printings?: FABPrinting[];
}

interface FABPrinting {
  unique_id: string;
  set_printing_unique_id: string;
  id: string;
  set_id: string;
  edition: string;
  foiling: string;
  rarity: string;
  artist?: string;
  art_variation?: string;
  flavor_text?: string;
  flavor_text_plain?: string;
  image_url?: string;
  set?: {
    id: string;
    name: string;
  };
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
  pitch: string | null;
  cost: string | null;
  power: string | null;
  defense: string | null;
  health: string | null;
  functional_text: string;
  keywords: string[];
  legality: {
    blitz: boolean;
    cc: boolean;
    commoner: boolean;
  };
  price_low: number | null;
  price_mid: number | null;
  price_high: number | null;
  price_market: number | null;
  source: string;
}

function transformCard(card: FABCard): TransformedCard {
  const firstPrinting = card.printings?.[0];
  
  return {
    id: card.identifier,
    name: card.name,
    category: 'fab',
    set_name: firstPrinting?.set?.name || 'Unknown Set',
    set_id: firstPrinting?.set_id || '',
    card_number: firstPrinting?.id || card.identifier,
    rarity: firstPrinting?.rarity || 'Unknown',
    image_url: firstPrinting?.image_url || '',
    image_large: firstPrinting?.image_url || '',
    artist: firstPrinting?.artist || 'Unknown',
    types: card.types || [],
    pitch: card.pitch || null,
    cost: card.cost || null,
    power: card.power || null,
    defense: card.defense || null,
    health: card.health || null,
    functional_text: card.functional_text_plain || card.functional_text || '',
    keywords: [
      ...(card.card_keywords || []),
      ...(card.ability_and_effect_keywords || []),
    ],
    legality: {
      blitz: card.blitz_legal === true && !card.blitz_banned,
      cc: card.cc_legal === true && !card.cc_banned,
      commoner: card.commoner_legal === true && !card.commoner_banned,
    },
    price_low: null,
    price_mid: null,
    price_high: null,
    price_market: null,
    source: 'fabdb.net',
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
  const cardId = searchParams.get('id');
  const cardClass = searchParams.get('class');
  const cardType = searchParams.get('type');
  const rarity = searchParams.get('rarity');
  const setId = searchParams.get('set');
  const pitch = searchParams.get('pitch');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || searchParams.get('pageSize') || '20');

  try {
    // Get specific card by ID
    if (cardId) {
      const url = `${FABDB_API}/cards/${cardId}`;
      console.log('FAB API card URL:', url);

      const response = await fetchWithTimeout(url, {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'CravCards/1.0'
        },
      });

      if (!response.ok) {
        throw new Error(`FAB API error: ${response.status}`);
      }

      const card = await response.json();
      return NextResponse.json({
        success: true,
        card: transformCard(card),
        source: 'fabdb.net',
      });
    }

    // Search cards
    const params = new URLSearchParams();
    params.set('per_page', limit.toString());
    params.set('page', page.toString());
    
    if (query) {
      params.set('keywords', query);
    }
    if (cardClass) {
      params.set('class', cardClass);
    }
    if (cardType) {
      params.set('type', cardType);
    }
    if (pitch) {
      params.set('pitch', pitch);
    }

    const url = `${FABDB_API}/cards?${params.toString()}`;
    console.log('FAB API URL:', url);

    const response = await fetchWithTimeout(url, {
      headers: { 
        'Accept': 'application/json',
        'User-Agent': 'CravCards/1.0'
      },
    });

    if (!response.ok) {
      throw new Error(`FAB API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle different response formats
    let cards: FABCard[] = [];
    let totalCount = 0;

    if (Array.isArray(data)) {
      cards = data;
      totalCount = data.length;
    } else if (data.data && Array.isArray(data.data)) {
      cards = data.data;
      totalCount = data.total || data.data.length;
    }

    return NextResponse.json({
      success: true,
      cards: cards.map(transformCard),
      totalCount,
      page,
      pageSize: limit,
      source: 'fabdb.net',
    });

  } catch (error) {
    console.error('FAB API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch FAB cards',
        cards: [],
        source: 'fabdb.net',
      },
      { status: 500 }
    );
  }
}

// Available classes
export const FAB_CLASSES = [
  'Generic',
  'Brute',
  'Guardian',
  'Ninja',
  'Warrior',
  'Mechanologist',
  'Ranger',
  'Runeblade',
  'Wizard',
  'Illusionist',
  'Elemental',
  'Bard',
  'Assassin',
  'Merchant',
  'Adjudicator',
  'Necromancer',
];

// Available card types
export const FAB_TYPES = [
  'Action',
  'Attack',
  'Defense',
  'Equipment',
  'Hero',
  'Instant',
  'Weapon',
  'Resource',
  'Token',
  'Mentor',
];

// Available pitch values
export const FAB_PITCH_VALUES = ['1', '2', '3'];
