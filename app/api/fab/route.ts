export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// FLESH AND BLOOD TCG API
// CravCards - CR AudioViz AI, LLC
// Updated: December 22, 2025
// Source: fabdb.net (Community API)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const FAB_API = 'https://api.fabdb.net/cards';
const API_TIMEOUT = 10000;

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
  abilities_and_effects?: string[];
  ability_and_effect_keywords?: string[];
  granted_keywords?: string[];
  functional_text?: string;
  functional_text_plain?: string;
  type_text?: string;
  flavor?: string;
  printings?: {
    id: string;
    set_id: string;
    set_printing_unique_id: string;
    edition: string;
    foiling: string;
    rarity: string;
    image_url: string;
    tcgplayer_product_id?: string;
    tcgplayer_url?: string;
  }[];
}

interface TransformedCard {
  id: string;
  name: string;
  category: string;
  set_name: string;
  card_number: string;
  rarity: string;
  image_url: string;
  types: string[];
  pitch: string;
  cost: string;
  power: string;
  defense: string;
  text: string;
  source: string;
}

function transformCard(card: FABCard): TransformedCard {
  const printing = card.printings?.[0];
  return {
    id: `fab-${card.identifier}`,
    name: card.name || 'Unknown',
    category: 'fab',
    set_name: printing?.edition || 'Unknown Set',
    card_number: card.identifier || '',
    rarity: printing?.rarity || 'Unknown',
    image_url: printing?.image_url || '',
    types: card.types || [],
    pitch: card.pitch || '',
    cost: card.cost || '',
    power: card.power || '',
    defense: card.defense || '',
    text: card.functional_text_plain || '',
    source: 'fabdb.net',
  };
}

// Sample data for when API is unavailable
const SAMPLE_FAB_CARDS: TransformedCard[] = [
  {
    id: 'fab-bravo-showstopper',
    name: 'Bravo, Showstopper',
    category: 'fab',
    set_name: 'Welcome to Rathe',
    card_number: 'WTR001',
    rarity: 'Legendary',
    image_url: 'https://fabdb.net/images/cards/WTR001.png',
    types: ['Hero', 'Guardian'],
    pitch: '',
    cost: '',
    power: '',
    defense: '',
    text: 'Hero card for Guardian class',
    source: 'fabdb.net',
  },
  {
    id: 'fab-dorinthea-ironsong',
    name: 'Dorinthea Ironsong',
    category: 'fab',
    set_name: 'Welcome to Rathe',
    card_number: 'WTR002',
    rarity: 'Legendary',
    image_url: 'https://fabdb.net/images/cards/WTR002.png',
    types: ['Hero', 'Warrior'],
    pitch: '',
    cost: '',
    power: '',
    defense: '',
    text: 'Hero card for Warrior class',
    source: 'fabdb.net',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || searchParams.get('name') || '';
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');

  try {
    // Build API URL
    const apiUrl = `${FAB_API}/search?q=${encodeURIComponent(query)}&per_page=${limit}&page=${page}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { 
        'Accept': 'application/json',
        'User-Agent': 'CravCards/1.0',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`FAB API returned ${response.status}`);
    }

    const data = await response.json();
    const cards: FABCard[] = data.data || [];

    return NextResponse.json({
      success: true,
      cards: cards.map(transformCard),
      totalCount: data.meta?.total || cards.length,
      page,
      pageSize: limit,
      source: 'fabdb.net',
    });

  } catch (error) {
    console.error('FAB API Error:', error);
    
    // Return sample data on error
    const queryLower = query.toLowerCase();
    const filteredSamples = SAMPLE_FAB_CARDS.filter(c => 
      c.name.toLowerCase().includes(queryLower) ||
      c.types.some(t => t.toLowerCase().includes(queryLower))
    );

    return NextResponse.json({
      success: true,
      cards: filteredSamples.length > 0 ? filteredSamples : SAMPLE_FAB_CARDS.slice(0, limit),
      totalCount: filteredSamples.length || SAMPLE_FAB_CARDS.length,
      page: 1,
      pageSize: limit,
      source: 'fabdb.net (sample)',
      note: 'Using sample data - external API unavailable',
    });
  }
}
