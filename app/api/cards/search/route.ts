// ============================================================================
// UNIFIED CARD SEARCH API - FAST VERSION
// Uses timeouts and parallel fetching for quick responses
// CravCards - CR AudioViz AI, LLC
// Fixed: December 15, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// External API endpoints
const POKEMON_API = 'https://api.pokemontcg.io/v2/cards';
const SCRYFALL_API = 'https://api.scryfall.com/cards/search';
const YUGIOH_API = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
const SPORTSDB_API = 'https://www.thesportsdb.com/api/v1/json/3';

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

// Helper: Fetch with timeout
async function fetchWithTimeout(url: string, timeout: number = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Search Pokemon TCG
async function searchPokemon(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetchWithTimeout(
      `${POKEMON_API}?q=name:${encodeURIComponent(query)}*&pageSize=10`,
      12000  // Pokemon API is slow - needs 12 seconds
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

// Search Magic: The Gathering (Scryfall)
async function searchMTG(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetchWithTimeout(
      `${SCRYFALL_API}?q=${encodeURIComponent(query)}&unique=cards`,
      5000
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

// Search Yu-Gi-Oh
async function searchYuGiOh(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetchWithTimeout(
      `${YUGIOH_API}?fname=${encodeURIComponent(query)}&num=10&offset=0`,
      5000
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
      image_url: card.card_images?.[0]?.image_url_small || card.card_images?.[0]?.image_url || '',
      market_price: card.card_prices?.[0]?.tcgplayer_price ? parseFloat(card.card_prices[0].tcgplayer_price) : null,
      source: 'YGOProDeck',
    }));
  } catch {
    return [];
  }
}

// Search Sports (TheSportsDB)
async function searchSports(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetchWithTimeout(
      `${SPORTSDB_API}/searchplayers.php?p=${encodeURIComponent(query)}`,
      5000
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
      'Golf': 'sports_golf',
      'Tennis': 'sports_tennis',
      'Boxing': 'sports_boxing',
      'Fighting': 'sports_mma',
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

// Main search handler
export async function GET(request: NextRequest) {
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
  const promises: Promise<SearchResult[]>[] = [];
  const sources: string[] = [];

  // Add search promises based on category
  if (searchAll || category === 'pokemon') {
    promises.push(searchPokemon(query));
    sources.push('pokemon');
  }
  if (searchAll || category === 'mtg') {
    promises.push(searchMTG(query));
    sources.push('mtg');
  }
  if (searchAll || category === 'yugioh') {
    promises.push(searchYuGiOh(query));
    sources.push('yugioh');
  }
  if (searchAll || category === 'sports' || category?.startsWith('sports_')) {
    promises.push(searchSports(query));
    sources.push('sports');
  }
  // NOTE: Lorcana skipped for now - API is too slow (fetches all 1000+ cards)

  // Execute all searches in parallel with a global timeout
  let allResults: SearchResult[] = [];
  
  try {
    const results = await Promise.race([
      Promise.allSettled(promises),
      new Promise<PromiseSettledResult<SearchResult[]>[]>((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 15000)  // 15 second global timeout
      )
    ]);
    
    // Collect results from successful promises
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        allResults.push(...result.value);
      }
    });
  } catch (error) {
    // Timeout - return whatever we have
    console.log('Search timeout, returning partial results');
  }

  // Sort: exact matches first, then starts-with, then contains
  const queryLower = query.toLowerCase();
  allResults.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    
    // Exact match first
    if (aName === queryLower && bName !== queryLower) return -1;
    if (bName === queryLower && aName !== queryLower) return 1;
    
    // Starts with query
    if (aName.startsWith(queryLower) && !bName.startsWith(queryLower)) return -1;
    if (bName.startsWith(queryLower) && !aName.startsWith(queryLower)) return 1;
    
    // Alphabetical
    return aName.localeCompare(bName);
  });

  // Limit results
  const finalResults = allResults.slice(0, limit);

  return NextResponse.json({
    success: true,
    query,
    results: finalResults,
    totalCount: allResults.length,
    returnedCount: finalResults.length,
    sources: Object.fromEntries(sources.map(s => [s, true])),
    coverage: {
      pokemon: '18,000+ cards from pokemontcg.io',
      mtg: '27,000+ cards from Scryfall',
      yugioh: '10,000+ cards from YGOProDeck',
      sports: '100,000+ athletes from TheSportsDB',
    },
  });
}
