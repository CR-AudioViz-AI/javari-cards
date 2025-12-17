// ============================================================================
// UNIFIED CARD SEARCH API - DIRECT EXTERNAL API CALLS
// Pokemon, MTG, Yu-Gi-Oh, Lorcana, Sports
// CravCards - CR AudioViz AI, LLC
// Optimized: December 16, 2025 - Direct external calls, better timeout handling
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

// Fetch with timeout
async function fetchWithTimeout(url: string, timeout: number): Promise<Response | null> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch {
    clearTimeout(id);
    return null;
  }
}

// Search Pokemon TCG directly
async function searchPokemon(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetchWithTimeout(
      `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(query)}*&pageSize=15`,
      6000
    );
    if (!response || !response.ok) return [];
    const data = await response.json();
    return (data.data || []).map((card: any) => ({
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
  } catch { return []; }
}

// Search MTG via Scryfall
async function searchMTG(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetchWithTimeout(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&unique=cards`,
      6000
    );
    if (!response || !response.ok) return [];
    const data = await response.json();
    return (data.data || []).slice(0, 15).map((card: any) => ({
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
  } catch { return []; }
}

// Search Yu-Gi-Oh via YGOProDeck
async function searchYuGiOh(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetchWithTimeout(
      `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(query)}&num=15&offset=0`,
      6000
    );
    if (!response || !response.ok) return [];
    const data = await response.json();
    if (data.error) return [];
    return (data.data || []).slice(0, 15).map((card: any) => ({
      id: `yugioh-${card.id}`,
      name: card.name,
      category: 'yugioh',
      set_name: card.card_sets?.[0]?.set_name || 'Yu-Gi-Oh!',
      card_number: card.card_sets?.[0]?.set_code || '',
      rarity: card.card_sets?.[0]?.set_rarity || 'Common',
      image_url: card.card_images?.[0]?.image_url_small || '',
      market_price: card.card_prices?.[0]?.tcgplayer_price ? parseFloat(card.card_prices[0].tcgplayer_price) : null,
      source: 'YGOProDeck',
    }));
  } catch { return []; }
}

// Search Lorcana
async function searchLorcana(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetchWithTimeout(
      `https://api.lorcana-api.com/cards/search?name=${encodeURIComponent(query)}`,
      6000
    );
    if (!response || !response.ok) return [];
    const data = await response.json();
    return (data || []).slice(0, 15).map((card: any) => ({
      id: `lorcana-${card.id || card.name?.replace(/\s+/g, '-')}`,
      name: card.name || card.Name,
      category: 'lorcana',
      set_name: card.set || card.Set_Name || 'Disney Lorcana',
      card_number: card.card_num || card.Card_Num || '',
      rarity: card.rarity || card.Rarity || 'Common',
      image_url: card.image || card.Image || '',
      market_price: null,
      source: 'Lorcana',
    }));
  } catch { return []; }
}

// Search Sports via TheSportsDB
async function searchSports(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetchWithTimeout(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(query)}`,
      6000
    );
    if (!response || !response.ok) return [];
    const data = await response.json();
    return (data.player || []).slice(0, 15).map((p: any) => ({
      id: `sports-${p.idPlayer}`,
      name: p.strPlayer,
      category: `sports_${(p.strSport || 'other').toLowerCase()}`,
      set_name: `${p.strPlayer} Cards`,
      card_number: 'Various',
      rarity: 'Various',
      image_url: p.strThumb || p.strCutout || '',
      market_price: null,
      source: 'TheSportsDB',
      team: p.strTeam,
      sport: p.strSport,
    }));
  } catch { return []; }
}

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

  // Run all searches in parallel
  const [pokemonResults, mtgResults, yugiohResults, lorcanaResults, sportsResults] = await Promise.all([
    (searchAll || category === 'pokemon') ? searchPokemon(query) : Promise.resolve([]),
    (searchAll || category === 'mtg') ? searchMTG(query) : Promise.resolve([]),
    (searchAll || category === 'yugioh') ? searchYuGiOh(query) : Promise.resolve([]),
    (searchAll || category === 'lorcana') ? searchLorcana(query) : Promise.resolve([]),
    (searchAll || category === 'sports') ? searchSports(query) : Promise.resolve([]),
  ]);

  // Combine results
  let allResults = [...pokemonResults, ...mtgResults, ...yugiohResults, ...lorcanaResults, ...sportsResults];

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
      lorcana: lorcanaResults.length > 0,
      sports: sportsResults.length > 0,
    },
  });
}

export const maxDuration = 15;
