// ============================================================================
// POKEMON TCG API - FREE ACCESS TO 18,000+ CARDS
// CravCards - CR AudioViz AI, LLC
// Created: December 12, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const POKEMON_TCG_API = 'https://api.pokemontcg.io/v2';

// Note: Pokemon TCG API is FREE and doesn't require an API key for basic use
// Rate limit: 1000 requests/day without key, 20,000/day with free key
// Get free API key at: https://dev.pokemontcg.io/

interface PokemonCard {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp?: string;
  types?: string[];
  evolvesFrom?: string;
  evolvesTo?: string[];
  rules?: string[];
  attacks?: Array<{
    name: string;
    cost: string[];
    convertedEnergyCost: number;
    damage: string;
    text: string;
  }>;
  weaknesses?: Array<{ type: string; value: string }>;
  resistances?: Array<{ type: string; value: string }>;
  retreatCost?: string[];
  convertedRetreatCost?: number;
  set: {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    releaseDate: string;
    images: {
      symbol: string;
      logo: string;
    };
  };
  number: string;
  artist: string;
  rarity: string;
  flavorText?: string;
  nationalPokedexNumbers?: number[];
  legalities: {
    unlimited?: string;
    standard?: string;
    expanded?: string;
  };
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices?: {
      holofoil?: { low: number; mid: number; high: number; market: number };
      reverseHolofoil?: { low: number; mid: number; high: number; market: number };
      normal?: { low: number; mid: number; high: number; market: number };
      '1stEditionHolofoil'?: { low: number; mid: number; high: number; market: number };
    };
  };
  cardmarket?: {
    url: string;
    updatedAt: string;
    prices?: {
      averageSellPrice: number;
      lowPrice: number;
      trendPrice: number;
    };
  };
}

interface PokemonSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  releaseDate: string;
  updatedAt: string;
  images: {
    symbol: string;
    logo: string;
  };
}

// GET - Search cards or get card by ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const cardId = searchParams.get('id');
  const setId = searchParams.get('set');
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('pageSize') || '20';
  const type = searchParams.get('type'); // cards, sets

  try {
    // Get specific card by ID
    if (cardId) {
      const response = await fetch(`${POKEMON_TCG_API}/cards/${cardId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error(`Pokemon API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({
        success: true,
        card: transformCard(data.data),
      });
    }

    // List all sets
    if (type === 'sets') {
      const response = await fetch(`${POKEMON_TCG_API}/sets?orderBy=-releaseDate`, {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      });

      if (!response.ok) {
        throw new Error(`Pokemon API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({
        success: true,
        sets: data.data.map(transformSet),
        totalCount: data.totalCount,
      });
    }

    // Search cards
    let searchQuery = '';
    
    if (query) {
      // Smart search - handles partial names
      searchQuery = `name:"*${query}*"`;
    }
    
    if (setId) {
      searchQuery += searchQuery ? ` set.id:${setId}` : `set.id:${setId}`;
    }

    const url = new URL(`${POKEMON_TCG_API}/cards`);
    if (searchQuery) {
      url.searchParams.set('q', searchQuery);
    }
    url.searchParams.set('page', page);
    url.searchParams.set('pageSize', pageSize);
    url.searchParams.set('orderBy', '-set.releaseDate');

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Pokemon API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      cards: data.data.map(transformCard),
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalCount: data.totalCount,
      totalPages: Math.ceil(data.totalCount / parseInt(pageSize)),
    });
  } catch (error) {
    console.error('Pokemon API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch Pokemon data',
      },
      { status: 500 }
    );
  }
}

// Transform Pokemon API card to CravCards format
function transformCard(card: PokemonCard) {
  // Get best available price
  let marketPrice = null;
  let priceSource = null;

  if (card.tcgplayer?.prices) {
    const prices = card.tcgplayer.prices;
    if (prices.holofoil?.market) {
      marketPrice = prices.holofoil.market;
      priceSource = 'TCGPlayer (Holofoil)';
    } else if (prices['1stEditionHolofoil']?.market) {
      marketPrice = prices['1stEditionHolofoil'].market;
      priceSource = 'TCGPlayer (1st Edition Holo)';
    } else if (prices.reverseHolofoil?.market) {
      marketPrice = prices.reverseHolofoil.market;
      priceSource = 'TCGPlayer (Reverse Holo)';
    } else if (prices.normal?.market) {
      marketPrice = prices.normal.market;
      priceSource = 'TCGPlayer (Normal)';
    }
  } else if (card.cardmarket?.prices?.trendPrice) {
    marketPrice = card.cardmarket.prices.trendPrice;
    priceSource = 'Cardmarket';
  }

  return {
    id: card.id,
    name: card.name,
    category: 'pokemon',
    set_name: card.set.name,
    set_code: card.set.id,
    set_series: card.set.series,
    card_number: card.number,
    total_in_set: card.set.total,
    rarity: card.rarity || 'Common',
    type: card.types?.join(', ') || card.supertype,
    supertype: card.supertype,
    subtypes: card.subtypes,
    hp: card.hp,
    artist: card.artist,
    image_small: card.images.small,
    image_large: card.images.large,
    set_logo: card.set.images.logo,
    set_symbol: card.set.images.symbol,
    release_date: card.set.releaseDate,
    market_price: marketPrice,
    price_source: priceSource,
    tcgplayer_url: card.tcgplayer?.url,
    tcgplayer_prices: card.tcgplayer?.prices,
    cardmarket_url: card.cardmarket?.url,
    cardmarket_prices: card.cardmarket?.prices,
    attacks: card.attacks,
    weaknesses: card.weaknesses,
    resistances: card.resistances,
    retreat_cost: card.retreatCost,
    flavor_text: card.flavorText,
    legalities: card.legalities,
    national_pokedex: card.nationalPokedexNumbers,
  };
}

// Transform set data
function transformSet(set: PokemonSet) {
  return {
    id: set.id,
    name: set.name,
    series: set.series,
    total_cards: set.total,
    printed_total: set.printedTotal,
    release_date: set.releaseDate,
    logo: set.images.logo,
    symbol: set.images.symbol,
    category: 'pokemon',
  };
}
