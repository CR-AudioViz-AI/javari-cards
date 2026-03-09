// ============================================================================
// UNIFIED CARD SEARCH API - ALL TRADING CARD GAMES
// Pokemon, MTG, Yu-Gi-Oh, Lorcana, Sports, Digimon, One Piece, FAB
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// Enhanced: December 22, 2025 - Added Digimon, One Piece, Flesh and Blood
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

// Search Pokemon TCG directly with TCGdex fallback
async function searchPokemon(query: string): Promise<SearchResult[]> {
  try {
    // Try Pokemon TCG API first
    const response = await fetchWithTimeout(
      `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(query)}*&pageSize=15`,
      5000
    );
    if (response && response.ok) {
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        return (data.data || []).map((card: any) => ({
          id: `pokemon-${card.id}`,
          name: card.name,
          category: 'pokemon',
          set_name: card.set?.name || 'Pokemon TCG',
          card_number: card.number || '',
          rarity: card.rarity || 'Common',
          image_url: card.images?.small || card.images?.large || '',
          market_price: card.cardmarket?.prices?.averageSellPrice || card.tcgplayer?.prices?.holofoil?.market || null,
          source: 'Pokemon TCG',
        }));
      }
    }
  } catch { /* Try fallback */ }

  // Fallback to TCGdex
  try {
    const response = await fetchWithTimeout(
      `https://api.tcgdex.net/v2/en/cards?name=${encodeURIComponent(query)}`,
      5000
    );
    if (response && response.ok) {
      const data = await response.json();
      return (Array.isArray(data) ? data : []).slice(0, 15).map((card: any) => ({
        id: `pokemon-${card.id}`,
        name: card.name,
        category: 'pokemon',
        set_name: card.set?.name || 'Pokemon TCG',
        card_number: card.localId || '',
        rarity: card.rarity || 'Common',
        image_url: card.image ? `${card.image}/low.webp` : '',
        market_price: null,
        source: 'TCGdex',
      }));
    }
  } catch { /* Return empty */ }
  
  return [];
}

// Search MTG via Scryfall
async function searchMTG(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetchWithTimeout(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&unique=cards`,
      5000
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
      image_url: card.image_uris?.normal || card.image_uris?.small || (card.card_faces?.[0]?.image_uris?.normal) || '',
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
      5000
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
      image_url: card.card_images?.[0]?.image_url_small || card.card_images?.[0]?.image_url || '',
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
      5000
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

// Search Digimon Card Game
async function searchDigimon(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetchWithTimeout(
      `https://digimoncard.io/api-public/search.php?n=${encodeURIComponent(query)}&series=Digimon%20Card%20Game`,
      5000
    );
    if (!response || !response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.slice(0, 15).map((card: any) => ({
      id: `digimon-${card.cardnumber}`,
      name: card.name,
      category: 'digimon',
      set_name: card.set_name || 'Digimon Card Game',
      card_number: card.cardnumber || '',
      rarity: card.cardrarity || 'Common',
      image_url: card.image_url || '',
      market_price: null,
      source: 'Digimon Card IO',
      type: card.type,
    }));
  } catch { return []; }
}

// Search One Piece Card Game
async function searchOnePiece(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetchWithTimeout(
      `https://api.onepiecetcg.info/cards?name=${encodeURIComponent(query)}`,
      5000
    );
    if (response && response.ok) {
      const data = await response.json();
      const cards = Array.isArray(data) ? data : (data.cards || []);
      return cards.slice(0, 15).map((card: any) => ({
        id: `onepiece-${card.card_number || card.id}`,
        name: card.name,
        category: 'onepiece',
        set_name: card.set_name || 'One Piece Card Game',
        card_number: card.card_number || '',
        rarity: card.rarity || 'Common',
        image_url: card.image_url || '',
        market_price: null,
        source: 'One Piece TCG',
        type: card.type,
      }));
    }
  } catch { /* Return empty */ }
  
  // Fallback with sample data for popular characters
  const queryLower = query.toLowerCase();
  const sampleCards = [
    { name: 'Monkey D. Luffy', id: 'OP01-001', set: 'Romance Dawn', type: 'Leader' },
    { name: 'Roronoa Zoro', id: 'OP01-025', set: 'Romance Dawn', type: 'Character' },
    { name: 'Nami', id: 'OP01-016', set: 'Romance Dawn', type: 'Character' },
    { name: 'Sanji', id: 'OP01-013', set: 'Romance Dawn', type: 'Character' },
    { name: 'Tony Tony Chopper', id: 'OP01-015', set: 'Romance Dawn', type: 'Character' },
  ].filter(c => c.name.toLowerCase().includes(queryLower));

  return sampleCards.map(c => ({
    id: `onepiece-${c.id}`,
    name: c.name,
    category: 'onepiece',
    set_name: c.set,
    card_number: c.id,
    rarity: 'Various',
    image_url: `https://en.onepiece-cardgame.com/images/cardlist/card/${c.id}.png`,
    market_price: null,
    source: 'One Piece TCG (Sample)',
    type: c.type,
  }));
}

// Search Flesh and Blood
async function searchFAB(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetchWithTimeout(
      `https://api.fabdb.net/cards?keywords=${encodeURIComponent(query)}&per_page=15`,
      5000
    );
    if (!response || !response.ok) return [];
    const data = await response.json();
    const cards = Array.isArray(data) ? data : (data.data || []);
    return cards.slice(0, 15).map((card: any) => ({
      id: `fab-${card.identifier}`,
      name: card.name,
      category: 'fab',
      set_name: card.printings?.[0]?.set?.name || 'Flesh and Blood',
      card_number: card.printings?.[0]?.id || card.identifier,
      rarity: card.printings?.[0]?.rarity || 'Common',
      image_url: card.printings?.[0]?.image_url || '',
      market_price: null,
      source: 'FAB DB',
      type: card.types?.join(', '),
    }));
  } catch { return []; }
}

// Search Sports via TheSportsDB
async function searchSports(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetchWithTimeout(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(query)}`,
      5000
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
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

  if (!query || query.length < 2) {
    return NextResponse.json({
      success: false,
      error: 'Search query must be at least 2 characters',
    }, { status: 400 });
  }

  const searchAll = !category || category === 'all';

  // Run all searches in parallel
  const [
    pokemonResults,
    mtgResults,
    yugiohResults,
    lorcanaResults,
    digimonResults,
    onepieceResults,
    fabResults,
    sportsResults,
  ] = await Promise.all([
    (searchAll || category === 'pokemon') ? searchPokemon(query) : Promise.resolve([]),
    (searchAll || category === 'mtg') ? searchMTG(query) : Promise.resolve([]),
    (searchAll || category === 'yugioh') ? searchYuGiOh(query) : Promise.resolve([]),
    (searchAll || category === 'lorcana') ? searchLorcana(query) : Promise.resolve([]),
    (searchAll || category === 'digimon') ? searchDigimon(query) : Promise.resolve([]),
    (searchAll || category === 'onepiece') ? searchOnePiece(query) : Promise.resolve([]),
    (searchAll || category === 'fab') ? searchFAB(query) : Promise.resolve([]),
    (searchAll || category === 'sports') ? searchSports(query) : Promise.resolve([]),
  ]);

  // Combine results
  let allResults = [
    ...pokemonResults,
    ...mtgResults,
    ...yugiohResults,
    ...lorcanaResults,
    ...digimonResults,
    ...onepieceResults,
    ...fabResults,
    ...sportsResults,
  ];

  // Sort: exact matches first, then starts with, then contains
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
      pokemon: pokemonResults.length,
      mtg: mtgResults.length,
      yugioh: yugiohResults.length,
      lorcana: lorcanaResults.length,
      digimon: digimonResults.length,
      onepiece: onepieceResults.length,
      fab: fabResults.length,
      sports: sportsResults.length,
    },
    categories: [
      { id: 'all', name: 'All Cards', count: allResults.length },
      { id: 'pokemon', name: 'Pokemon', count: pokemonResults.length },
      { id: 'mtg', name: 'Magic: The Gathering', count: mtgResults.length },
      { id: 'yugioh', name: 'Yu-Gi-Oh!', count: yugiohResults.length },
      { id: 'lorcana', name: 'Disney Lorcana', count: lorcanaResults.length },
      { id: 'digimon', name: 'Digimon', count: digimonResults.length },
      { id: 'onepiece', name: 'One Piece', count: onepieceResults.length },
      { id: 'fab', name: 'Flesh and Blood', count: fabResults.length },
      { id: 'sports', name: 'Sports', count: sportsResults.length },
    ],
  });
}

export const maxDuration = 20;
