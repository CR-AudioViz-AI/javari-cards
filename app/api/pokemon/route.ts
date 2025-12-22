// ============================================================================
// POKEMON TCG API - FREE ACCESS TO 18,000+ CARDS
// CravCards - CR AudioViz AI, LLC
// Created: December 12, 2025
// Updated: December 22, 2025 - Added TCGdex fallback, improved timeout handling
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const POKEMON_TCG_API = 'https://api.pokemontcg.io/v2';
const TCGDEX_API = 'https://api.tcgdex.net/v2/en';

// Timeout for API requests (8 seconds)
const API_TIMEOUT = 8000;

interface PokemonCard {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  hp?: string;
  types?: string[];
  set: {
    id: string;
    name: string;
    series: string;
    releaseDate: string;
    images: {
      symbol: string;
      logo: string;
    };
  };
  number: string;
  artist?: string;
  rarity?: string;
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices?: Record<string, { low?: number; mid?: number; high?: number; market?: number }>;
  };
  cardmarket?: {
    url: string;
    updatedAt: string;
    prices?: { averageSellPrice?: number; trendPrice?: number };
  };
}

// TCGdex card structure
interface TCGdexCard {
  id: string;
  localId: string;
  name: string;
  image?: string;
  category: string;
  hp?: number;
  types?: string[];
  set: {
    id: string;
    name: string;
    logo?: string;
    symbol?: string;
    releaseDate?: string;
  };
  rarity?: string;
  illustrator?: string;
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
  hp: string;
  price_low: number | null;
  price_mid: number | null;
  price_high: number | null;
  price_market: number | null;
  tcgplayer_url: string | null;
  cardmarket_url: string | null;
  release_date: string;
  source: string;
}

function transformPokemonTCGCard(card: PokemonCard): TransformedCard {
  const prices = card.tcgplayer?.prices;
  let priceData = { low: null as number | null, mid: null as number | null, high: null as number | null, market: null as number | null };
  
  if (prices) {
    const variants = ['holofoil', 'reverseHolofoil', 'normal', '1stEditionHolofoil', '1stEditionNormal'];
    for (const variant of variants) {
      if (prices[variant]) {
        priceData = {
          low: prices[variant].low ?? null,
          mid: prices[variant].mid ?? null,
          high: prices[variant].high ?? null,
          market: prices[variant].market ?? null,
        };
        break;
      }
    }
  }

  return {
    id: card.id,
    name: card.name,
    category: 'pokemon',
    set_name: card.set.name,
    set_id: card.set.id,
    card_number: card.number,
    rarity: card.rarity || 'Unknown',
    image_url: card.images.small,
    image_large: card.images.large,
    artist: card.artist || 'Unknown',
    types: card.types || [],
    hp: card.hp || 'N/A',
    price_low: priceData.low,
    price_mid: priceData.mid,
    price_high: priceData.high,
    price_market: priceData.market,
    tcgplayer_url: card.tcgplayer?.url || null,
    cardmarket_url: card.cardmarket?.url || null,
    release_date: card.set.releaseDate,
    source: 'pokemontcg.io',
  };
}

function transformTCGdexCard(card: TCGdexCard): TransformedCard {
  // TCGdex provides images in a different format
  const baseImageUrl = card.image || `https://assets.tcgdex.net/en/${card.set?.id}/${card.localId}`;
  
  return {
    id: card.id,
    name: card.name,
    category: 'pokemon',
    set_name: card.set?.name || 'Unknown Set',
    set_id: card.set?.id || '',
    card_number: card.localId,
    rarity: card.rarity || 'Unknown',
    image_url: `${baseImageUrl}/low.webp`,
    image_large: `${baseImageUrl}/high.webp`,
    artist: card.illustrator || 'Unknown',
    types: card.types || [],
    hp: card.hp?.toString() || 'N/A',
    price_low: null,
    price_mid: null,
    price_high: null,
    price_market: null,
    tcgplayer_url: null,
    cardmarket_url: null,
    release_date: card.set?.releaseDate || '',
    source: 'tcgdex.net',
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

// Try Pokemon TCG API first, fallback to TCGdex
async function searchPokemonCards(query: string, page: string, limit: string): Promise<{
  cards: TransformedCard[];
  totalCount: number;
  source: string;
}> {
  // Try Pokemon TCG API first
  try {
    const url = new URL(`${POKEMON_TCG_API}/cards`);
    url.searchParams.set('q', `name:${query}`);
    url.searchParams.set('page', page);
    url.searchParams.set('pageSize', limit);
    url.searchParams.set('orderBy', '-set.releaseDate');

    console.log('Trying Pokemon TCG API:', url.toString());

    const response = await fetchWithTimeout(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        cards: (data.data || []).map(transformPokemonTCGCard),
        totalCount: data.totalCount || 0,
        source: 'pokemontcg.io',
      };
    }
    
    console.log('Pokemon TCG API failed:', response.status);
    throw new Error(`Pokemon TCG API returned ${response.status}`);
  } catch (error) {
    console.log('Pokemon TCG API error, trying TCGdex fallback:', error);
  }

  // Fallback to TCGdex
  try {
    const url = `${TCGDEX_API}/cards?name=${encodeURIComponent(query)}`;
    console.log('Trying TCGdex API:', url);

    const response = await fetchWithTimeout(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      const cards = Array.isArray(data) ? data : [];
      
      // TCGdex returns brief card info, we need to get full details for images
      const detailedCards: TransformedCard[] = [];
      const pageNum = parseInt(page);
      const pageSize = parseInt(limit);
      const startIdx = (pageNum - 1) * pageSize;
      const endIdx = startIdx + pageSize;
      const pageCards = cards.slice(startIdx, endIdx);

      for (const card of pageCards) {
        try {
          // Get full card details for image URLs
          const detailResponse = await fetchWithTimeout(
            `${TCGDEX_API}/cards/${card.id}`,
            { headers: { 'Accept': 'application/json' } },
            3000 // Shorter timeout for individual cards
          );
          
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            detailedCards.push(transformTCGdexCard(detailData));
          } else {
            // Use basic info if detail fetch fails
            detailedCards.push(transformTCGdexCard(card));
          }
        } catch {
          detailedCards.push(transformTCGdexCard(card));
        }
      }

      return {
        cards: detailedCards,
        totalCount: cards.length,
        source: 'tcgdex.net',
      };
    }

    throw new Error(`TCGdex API returned ${response.status}`);
  } catch (error) {
    console.error('Both Pokemon APIs failed:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const cardId = searchParams.get('id');
  const setId = searchParams.get('set');
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || searchParams.get('pageSize') || '20';
  const type = searchParams.get('type');

  try {
    // Get specific card by ID
    if (cardId) {
      // Try Pokemon TCG API first
      try {
        const response = await fetchWithTimeout(`${POKEMON_TCG_API}/cards/${cardId}`, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            success: true,
            card: transformPokemonTCGCard(data.data),
          });
        }
      } catch {
        console.log('Pokemon TCG API card fetch failed, trying TCGdex');
      }

      // Fallback to TCGdex
      try {
        const response = await fetchWithTimeout(`${TCGDEX_API}/cards/${cardId}`, {
          headers: { 'Accept': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            success: true,
            card: transformTCGdexCard(data),
          });
        }
      } catch {
        console.log('TCGdex card fetch also failed');
      }

      throw new Error('Card not found in any source');
    }

    // List all sets
    if (type === 'sets') {
      try {
        const response = await fetchWithTimeout(`${POKEMON_TCG_API}/sets?orderBy=-releaseDate`, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            success: true,
            sets: data.data,
            totalCount: data.totalCount,
            source: 'pokemontcg.io',
          });
        }
      } catch {
        console.log('Pokemon TCG API sets failed, trying TCGdex');
      }

      // Fallback to TCGdex sets
      try {
        const response = await fetchWithTimeout(`${TCGDEX_API}/sets`, {
          headers: { 'Accept': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            success: true,
            sets: data,
            totalCount: Array.isArray(data) ? data.length : 0,
            source: 'tcgdex.net',
          });
        }
      } catch {
        throw new Error('Failed to fetch sets from any source');
      }
    }

    // Search cards by set
    if (setId && !query) {
      try {
        const url = new URL(`${POKEMON_TCG_API}/cards`);
        url.searchParams.set('q', `set.id:${setId}`);
        url.searchParams.set('page', page);
        url.searchParams.set('pageSize', limit);
        url.searchParams.set('orderBy', 'number');

        const response = await fetchWithTimeout(url.toString(), {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            success: true,
            cards: (data.data || []).map(transformPokemonTCGCard),
            totalCount: data.totalCount || 0,
            page: parseInt(page),
            pageSize: parseInt(limit),
            source: 'pokemontcg.io',
          });
        }
      } catch {
        console.log('Set cards fetch failed');
      }

      // Fallback to TCGdex
      try {
        const response = await fetchWithTimeout(`${TCGDEX_API}/sets/${setId}`, {
          headers: { 'Accept': 'application/json' },
        });

        if (response.ok) {
          const setData = await response.json();
          const cards = setData.cards || [];
          const pageNum = parseInt(page);
          const pageSize = parseInt(limit);
          const startIdx = (pageNum - 1) * pageSize;
          const pageCards = cards.slice(startIdx, startIdx + pageSize);

          return NextResponse.json({
            success: true,
            cards: pageCards.map((c: TCGdexCard) => transformTCGdexCard({ ...c, set: { id: setId, name: setData.name } })),
            totalCount: cards.length,
            page: pageNum,
            pageSize: pageSize,
            source: 'tcgdex.net',
          });
        }
      } catch {
        throw new Error('Failed to fetch set cards');
      }
    }

    // Search cards by query
    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Search query required',
        cards: [],
      }, { status: 400 });
    }

    const result = await searchPokemonCards(query, page, limit);

    return NextResponse.json({
      success: true,
      cards: result.cards,
      totalCount: result.totalCount,
      page: parseInt(page),
      pageSize: parseInt(limit),
      source: result.source,
    });

  } catch (error) {
    console.error('Pokemon API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch Pokemon cards',
        cards: [],
        source: 'error',
      },
      { status: 500 }
    );
  }
}
