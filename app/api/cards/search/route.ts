// ============================================================================
// UNIFIED CARD SEARCH API - COMPREHENSIVE
// Searches ALL card sources simultaneously:
// - Pokemon TCG (pokemontcg.io) - 18,000+ cards
// - Magic: The Gathering (Scryfall) - 27,000+ cards
// - Yu-Gi-Oh (YGOProDeck) - 10,000+ cards
// - Disney Lorcana (via internal API) - 1,000+ cards
// - Sports (TheSportsDB) - 100,000+ athletes
// 
// CravCards - CR AudioViz AI, LLC
// Updated: December 14, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cravcards.com';

// External API endpoints
const POKEMON_API = 'https://api.pokemontcg.io/v2/cards';
const SCRYFALL_API = 'https://api.scryfall.com/cards/search';
const YUGIOH_API = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
const SPORTSDB_API = 'https://www.thesportsdb.com/api/v1/json/3';

// Lorcana full card list (cached)
const LORCANA_API = 'https://api.lorcana-api.com/cards/all';
let lorcanaCache: any[] | null = null;
let lorcanaCacheTime = 0;

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

// GET - Universal card search across ALL sources
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || searchParams.get('query');
  const category = searchParams.get('category')?.toLowerCase();
  const limit = Math.min(parseInt(searchParams.get('limit') || '30'), 100);

  if (!query || query.length < 2) {
    return NextResponse.json({
      success: false,
      error: 'Search query must be at least 2 characters',
      availableSources: [
        'pokemon - 18,000+ Pokemon TCG cards',
        'mtg - 27,000+ Magic: The Gathering cards',
        'yugioh - 10,000+ Yu-Gi-Oh cards',
        'lorcana - 1,000+ Disney Lorcana cards',
        'sports - 100,000+ athletes (MLB, NBA, NFL, NHL, Soccer)',
      ],
    }, { status: 400 });
  }

  const results: SearchResult[] = [];
  const errors: string[] = [];
  const sourcesSearched: Record<string, boolean> = {};
  const queryLower = query.toLowerCase();

  // Determine which sources to search
  const searchAll = !category || category === 'all';
  const shouldSearch = {
    pokemon: searchAll || category === 'pokemon',
    mtg: searchAll || category === 'mtg',
    yugioh: searchAll || category === 'yugioh',
    lorcana: searchAll || category === 'lorcana',
    sports: searchAll || category === 'sports',
  };

  const searchPromises: Promise<void>[] = [];

  // ============================================
  // 1. POKEMON TCG API
  // ============================================
  if (shouldSearch.pokemon) {
    sourcesSearched.pokemon = true;
    searchPromises.push(
      fetch(`${POKEMON_API}?q=name:${encodeURIComponent(query)}*&pageSize=${limit}`, {
        headers: { 'X-Api-Key': process.env.POKEMON_TCG_API_KEY || '' },
      })
        .then(res => res.json())
        .then(data => {
          const cards = data.data || [];
          cards.forEach((card: any) => {
            const prices = card.tcgplayer?.prices;
            const marketPrice = prices?.holofoil?.market || 
                               prices?.reverseHolofoil?.market || 
                               prices?.normal?.market || null;

            results.push({
              id: card.id,
              name: card.name,
              category: 'pokemon',
              set_name: card.set?.name || 'Unknown Set',
              card_number: `${card.number}/${card.set?.total || '?'}`,
              rarity: card.rarity || 'Common',
              image_url: card.images?.small || card.images?.large || '',
              market_price: marketPrice,
              source: 'Pokemon TCG API',
              type: card.supertype,
            });
          });
        })
        .catch(err => {
          console.error('Pokemon search error:', err);
          errors.push('Pokemon API error');
        })
    );
  }

  // ============================================
  // 2. MAGIC: THE GATHERING (Scryfall)
  // ============================================
  if (shouldSearch.mtg) {
    sourcesSearched.mtg = true;
    searchPromises.push(
      fetch(`${SCRYFALL_API}?q=${encodeURIComponent(query)}&unique=cards`, {
        headers: { 'Accept': 'application/json' },
      })
        .then(res => res.ok ? res.json() : { data: [] })
        .then(data => {
          const cards = data.data || [];
          cards.slice(0, limit).forEach((card: any) => {
            const price = parseFloat(card.prices?.usd) || 
                         parseFloat(card.prices?.usd_foil) || null;

            results.push({
              id: card.id,
              name: card.name,
              category: 'mtg',
              set_name: card.set_name || 'Unknown Set',
              card_number: card.collector_number || '',
              rarity: card.rarity || 'common',
              image_url: card.image_uris?.normal || card.image_uris?.small || '',
              market_price: price,
              source: 'Scryfall',
              type: card.type_line,
            });
          });
        })
        .catch(err => {
          console.error('MTG search error:', err);
          errors.push('MTG API error');
        })
    );
  }

  // ============================================
  // 3. YU-GI-OH (YGOProDeck)
  // ============================================
  if (shouldSearch.yugioh) {
    sourcesSearched.yugioh = true;
    searchPromises.push(
      fetch(`${YUGIOH_API}?fname=${encodeURIComponent(query)}`)
        .then(res => res.ok ? res.json() : { data: [] })
        .then(data => {
          const cards = data.data || [];
          cards.slice(0, limit).forEach((card: any) => {
            const prices = card.card_prices?.[0] || {};
            const price = parseFloat(prices.tcgplayer_price) || 
                         parseFloat(prices.cardmarket_price) || null;
            const firstSet = card.card_sets?.[0];

            results.push({
              id: `ygo-${card.id}`,
              name: card.name,
              category: 'yugioh',
              set_name: firstSet?.set_name || 'Various Sets',
              card_number: firstSet?.set_code || '',
              rarity: firstSet?.set_rarity || 'Common',
              image_url: card.card_images?.[0]?.image_url_small || '',
              market_price: price,
              source: 'YGOProDeck',
              type: card.type,
            });
          });
        })
        .catch(err => {
          console.error('Yu-Gi-Oh search error:', err);
          errors.push('Yu-Gi-Oh API error');
        })
    );
  }

  // ============================================
  // 4. DISNEY LORCANA (fetch all, filter locally)
  // ============================================
  if (shouldSearch.lorcana) {
    sourcesSearched.lorcana = true;
    searchPromises.push(
      (async () => {
        try {
          // Cache Lorcana cards (they don't change often)
          const now = Date.now();
          if (!lorcanaCache || (now - lorcanaCacheTime) > 3600000) {
            const res = await fetch(LORCANA_API);
            if (res.ok) {
              lorcanaCache = await res.json();
              lorcanaCacheTime = now;
            }
          }

          if (lorcanaCache) {
            const filtered = lorcanaCache.filter((card: any) => {
              const name = (card.Name || '').toLowerCase();
              const title = (card.Title || '').toLowerCase();
              return name.includes(queryLower) || title.includes(queryLower);
            });

            filtered.slice(0, limit).forEach((card: any) => {
              const fullName = card.Title ? `${card.Name} - ${card.Title}` : card.Name;
              results.push({
                id: `lorcana-${card.Set_Num}-${card.Card_Num}`,
                name: fullName,
                category: 'lorcana',
                set_name: card.Set_Name || 'Unknown Set',
                card_number: card.Card_Num?.toString() || '',
                rarity: card.Rarity || 'Common',
                image_url: card.Image || '',
                market_price: null,
                source: 'Lorcana API',
                type: card.Type,
              });
            });
          }
        } catch (err) {
          console.error('Lorcana search error:', err);
          errors.push('Lorcana API error');
        }
      })()
    );
  }

  // ============================================
  // 5. SPORTS (TheSportsDB Athletes)
  // ============================================
  if (shouldSearch.sports) {
    sourcesSearched.sports = true;
    searchPromises.push(
      fetch(`${SPORTSDB_API}/searchplayers.php?p=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          const players = data.player || [];
          players.slice(0, limit).forEach((player: any) => {
            const sportMap: Record<string, string> = {
              'Baseball': 'sports_baseball',
              'Basketball': 'sports_basketball',
              'American Football': 'sports_football',
              'Ice Hockey': 'sports_hockey',
              'Soccer': 'sports_soccer',
              'Golf': 'sports_golf',
              'Tennis': 'sports_tennis',
              'Boxing': 'sports_boxing',
              'MMA': 'sports_mma',
            };
            
            const category = sportMap[player.strSport] || 'sports_other';
            const team = player.strTeam?.replace('_Retired ', '').replace('_', ' ') || 'Free Agent';

            results.push({
              id: `athlete-${player.idPlayer}`,
              name: player.strPlayer,
              category: category,
              set_name: `${player.strPlayer} Trading Cards`,
              card_number: 'Various',
              rarity: 'Various',
              image_url: player.strThumb || player.strCutout || '',
              market_price: null,
              source: 'TheSportsDB',
              type: 'Athlete',
              team: team,
              sport: player.strSport,
            });
          });
        })
        .catch(err => {
          console.error('Sports search error:', err);
          errors.push('Sports API error');
        })
    );
  }

  // Wait for all searches
  await Promise.allSettled(searchPromises);

  // Sort results
  results.sort((a, b) => {
    const aExact = a.name.toLowerCase() === queryLower ? 0 : 1;
    const bExact = b.name.toLowerCase() === queryLower ? 0 : 1;
    if (aExact !== bExact) return aExact - bExact;

    const aStarts = a.name.toLowerCase().startsWith(queryLower) ? 0 : 1;
    const bStarts = b.name.toLowerCase().startsWith(queryLower) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;

    return a.name.localeCompare(b.name);
  });

  const limitedResults = results.slice(0, limit);

  return NextResponse.json({
    success: true,
    query,
    results: limitedResults,
    totalCount: results.length,
    returnedCount: limitedResults.length,
    sources: sourcesSearched,
    errors: errors.length > 0 ? errors : undefined,
    coverage: {
      pokemon: '18,000+ cards from pokemontcg.io',
      mtg: '27,000+ cards from Scryfall',
      yugioh: '10,000+ cards from YGOProDeck',
      lorcana: '1,000+ cards from Lorcana API',
      sports: '100,000+ athletes from TheSportsDB',
    },
  });
}
