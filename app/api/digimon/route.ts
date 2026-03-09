export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// DIGIMON CARD GAME API - FREE ACCESS TO 2,000+ CARDS
// CravCards - CR AudioViz AI, LLC
// Updated: December 22, 2025
// Source: digimoncard.io
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const DIGIMON_API = 'https://digimoncard.io/api-public';
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
  set_name?: string;
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
  artist: string;
  types: string[];
  color: string;
  source: string;
}

function transformCard(card: DigimonCard): TransformedCard {
  const setName = card.set_name || (card.card_sets?.[0]) || 'Unknown Set';
  return {
    id: `digimon-${card.cardnumber}`,
    name: card.name || 'Unknown',
    category: 'digimon',
    set_name: String(setName),
    set_id: String(setName).toLowerCase().replace(/\s+/g, '-'),
    card_number: card.cardnumber || '',
    rarity: card.cardrarity || 'Unknown',
    image_url: card.image_url || '',
    artist: card.artist || 'Unknown',
    types: card.digi_type ? [card.digi_type] : [],
    color: card.color || 'Unknown',
    source: 'digimoncard.io',
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || searchParams.get('name') || '';
  const color = searchParams.get('color');
  const cardType = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');

  try {
    // Build API URL
    let apiUrl = `${DIGIMON_API}/search.php?n=${encodeURIComponent(query)}`;
    if (color) apiUrl += `&color=${encodeURIComponent(color)}`;
    if (cardType) apiUrl += `&type=${encodeURIComponent(cardType)}`;
    apiUrl += `&series=Digimon Card Game`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Digimon API returned ${response.status}`);
    }

    const data = await response.json();
    const allCards: DigimonCard[] = Array.isArray(data) ? data : [];

    // Paginate results
    const startIndex = (page - 1) * limit;
    const paginatedCards = allCards.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      cards: paginatedCards.map(transformCard),
      totalCount: allCards.length,
      page,
      pageSize: limit,
      source: 'digimoncard.io',
    });

  } catch (error) {
    console.error('Digimon API Error:', error);
    
    // Return empty but successful response on error
    return NextResponse.json({
      success: true,
      cards: [],
      totalCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'digimoncard.io',
    });
  }
}
