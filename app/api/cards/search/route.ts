// ============================================================================
// UNIFIED CARD SEARCH API - FAST FIRST
// Returns results as soon as ANY source responds
// CravCards - CR AudioViz AI, LLC
// Fixed: December 15, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  set_name: string;
  card_number: string;
  rarity: string;
  image_url: string;
  market_price: number | null;
  source: string;
  type?: string;
  team?: string;
  sport?: string;
}

// Helper function with timeout
async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => resolve(fallback), ms);
  });
  
  return Promise.race([
    promise.then(result => {
      clearTimeout(timeoutId);
      return result;
    }),
    timeoutPromise
  ]);
}

// Search Pokemon TCG (fastest API ~3-5s)
async function searchPokemon(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(query)}*&pageSize=10`
    );
    if (!response.ok) return [];
    
    const data = await response.json();
    return (data.data || []).slice(0, 10).map((card: any) => ({
      id: `pokemon-${card.id}`,
      name: card.name,
      category: 'pokemon',
      set_name: card.set?.name || 'Pokemon TCG',
      card_number: card.number || '',
      rarity: card.rarity || 'Common',
      image_url: card.images?.small || card.images?.large || '',
      market_price: card.cardmarket?.prices?.averageSellPrice || null,
      source: 'Pokemon TCG',
    }));
  } catch {
    return [];
  }
}

// Search Magic: The Gathering (fast API ~1-2s)
async function searchMTG(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&unique=cards`
    );
    if (!response.ok) return [];
    
    const data = await response.json();
    return (data.data || []).slice(0, 10).map((card: any) => ({
      id: `mtg-${card.id}`,
      name: card.name,
      category: 'mtg',
      set_name: card.set_name || 'Magic: The Gathering',
      card_number: card.collector_number || '',
      rarity: card.rarity || 'common',
      image_url: card.image_uris?.normal || card.image_uris?.small || '',
      market_price: card.prices?.usd ? parseFloat(card.prices.usd) : null,
      source: 'Scryfall',
    }));
  } catch {
    return [];
  }
}

// Search Yu-Gi-Oh (fast API ~1s)
async function searchYuGiOh(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(query)}&num=10&offset=0`
    );
    if (!response.ok) return [];
    
    const data = await response.json();
    if (data.error) return [];
    
    return (data.data || []).slice(0, 10).map((card: any) => ({
      id: `yugioh-${card.id}`,
      name: card.name,
      category: 'yugioh',
      set_name: card.card_sets?.[0]?.set_name || 'Yu-Gi-Oh',
      card_number: card.card_sets?.[0]?.set_code || '',
      rarity: card.card_sets?.[0]?.set_rarity || 'Common',
      image_url: card.card_images?.[0]?.image_url_small || '',
      market_price: card.card_prices?.[0]?.tcgplayer_price ? parseFloat(card.card_prices[0].tcgplayer_price) : null,
      source: 'YGOProDeck',
    }));
  } catch {
    return [];
  }
}

// Search Sports (usually fast ~1-2s)
async function searchSports(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(query)}`
    );
    if (!response.ok) return [];
    
    const data = await response.json();
    if (!data.player) return [];
    
    const sportToCategory: Record<string, string> = {
      'Baseball': 'sports_baseball',
      'Basketball': 'sports_basketball',
      'American Football': 'sports_football',
      'Ice Hockey': 'sports_hockey',
      'Soccer': 'sports_soccer',
    };
    
    return data.player.slice(0, 10).map((player: any) => ({
      id: `athlete-${player.idPlayer}`,
      name: player.strPlayer,
      category: sportToCategory[player.strSport] || 'sports',
      set_name: `${player.strPlayer} Trading Cards`,
      card_number: 'Various',
      rarity: 'Various',
      image_url: player.strThumb || player.strCutout || '',
      market_price: null,
      source: 'TheSportsDB',
      type: 'Athlete',
      team: player.strTeam || player.strSport,
      sport: player.strSport,
    }));
  } catch {
    return [];
  }
}

// Main search handler - returns quickly with whatever results we get
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || searchParams.get('query');
  const category = searchParams.get('category')?.toLowerCase();
  const limit = Math.min(parseInt(searchParams.get('limit') || '30'), 50);

  if (!query || query.length < 2) {
    return NextResponse.json({
      success: false,
      error: 'Search query must be at least 2 characters',
    }, { status: 400 });
  }

  const searchAll = !category || category === 'all';
  const TIMEOUT = 8000; // 8 second timeout per source
  
  // Run all searches in parallel with individual timeouts
  const [pokemonResults, mtgResults, yugiohResults, sportsResults] = await Promise.all([
    (searchAll || category === 'pokemon') 
      ? withTimeout(searchPokemon(query), TIMEOUT, []) 
      : Promise.resolve([]),
    (searchAll || category === 'mtg') 
      ? withTimeout(searchMTG(query), TIMEOUT, []) 
      : Promise.resolve([]),
    (searchAll || category === 'yugioh') 
      ? withTimeout(searchYuGiOh(query), TIMEOUT, []) 
      : Promise.resolve([]),
    (searchAll || category === 'sports' || category?.startsWith('sports_')) 
      ? withTimeout(searchSports(query), TIMEOUT, []) 
      : Promise.resolve([]),
  ]);

  // Combine all results
  let allResults = [...pokemonResults, ...mtgResults, ...yugiohResults, ...sportsResults];

  // Sort: exact matches first
  const queryLower = query.toLowerCase();
  allResults.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    if (aName === queryLower && bName !== queryLower) return -1;
    if (bName === queryLower && aName !== queryLower) return 1;
    if (aName.startsWith(queryLower) && !bName.startsWith(queryLower)) return -1;
    if (bName.startsWith(queryLower) && !aName.startsWith(queryLower)) return 1;
    return aName.localeCompare(bName);
  });

  const finalResults = allResults.slice(0, limit);
  const responseTime = Date.now() - startTime;

  return NextResponse.json({
    success: true,
    query,
    results: finalResults,
    totalCount: allResults.length,
    returnedCount: finalResults.length,
    responseTimeMs: responseTime,
    sources: {
      pokemon: pokemonResults.length > 0,
      mtg: mtgResults.length > 0,
      yugioh: yugiohResults.length > 0,
      sports: sportsResults.length > 0,
    },
  });
}

export const maxDuration = 15;
