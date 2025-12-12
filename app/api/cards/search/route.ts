// ============================================================================
// UNIFIED CARD SEARCH API
// Searches Pokemon, MTG, Sports, and Database simultaneously
// CravCards - CR AudioViz AI, LLC
// Created: December 12, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cravcards.com';

interface SearchResult {
  id: string;
  name: string;
  category: 'pokemon' | 'mtg' | 'sports_baseball' | 'sports_basketball' | 'sports_football' | 'sports_hockey';
  set_name: string;
  card_number: string;
  rarity: string;
  image_url: string;
  market_price: number | null;
  source: string;
}

// GET - Universal card search
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category'); // pokemon, mtg, sports, all
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!query || query.length < 2) {
    return NextResponse.json({
      success: false,
      error: 'Search query must be at least 2 characters',
    }, { status: 400 });
  }

  try {
    const results: SearchResult[] = [];
    const searchPromises: Promise<void>[] = [];

    // Determine which APIs to search
    const searchPokemon = !category || category === 'all' || category === 'pokemon';
    const searchMtg = !category || category === 'all' || category === 'mtg';
    const searchSports = !category || category === 'all' || category === 'sports';

    // Search Pokemon TCG API
    if (searchPokemon) {
      searchPromises.push(
        fetch(`${BASE_URL}/api/pokemon?q=${encodeURIComponent(query)}&pageSize=${limit}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.cards) {
              data.cards.forEach((card: any) => {
                results.push({
                  id: card.id,
                  name: card.name,
                  category: 'pokemon',
                  set_name: card.set_name,
                  card_number: `${card.card_number}/${card.total_in_set}`,
                  rarity: card.rarity,
                  image_url: card.image_small,
                  market_price: card.market_price,
                  source: 'Pokemon TCG API',
                });
              });
            }
          })
          .catch(err => console.error('Pokemon search error:', err))
      );
    }

    // Search Scryfall MTG API
    if (searchMtg) {
      searchPromises.push(
        fetch(`${BASE_URL}/api/mtg?q=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.cards) {
              data.cards.slice(0, limit).forEach((card: any) => {
                results.push({
                  id: card.id,
                  name: card.name,
                  category: 'mtg',
                  set_name: card.set_name,
                  card_number: card.card_number,
                  rarity: card.rarity,
                  image_url: card.image_normal,
                  market_price: card.market_price,
                  source: 'Scryfall',
                });
              });
            }
          })
          .catch(err => console.error('MTG search error:', err))
      );
    }

    // Search Sports Cards Database
    if (searchSports) {
      searchPromises.push(
        fetch(`${BASE_URL}/api/sports?q=${encodeURIComponent(query)}&pageSize=${limit}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.cards) {
              data.cards.forEach((card: any) => {
                results.push({
                  id: card.id,
                  name: card.name,
                  category: card.category,
                  set_name: card.set_name,
                  card_number: card.card_number,
                  rarity: card.rarity,
                  image_url: card.image_url,
                  market_price: card.market_price,
                  source: 'CravCards Database',
                });
              });
            }
          })
          .catch(err => console.error('Sports search error:', err))
      );
    }

    // Wait for all searches to complete
    await Promise.all(searchPromises);

    // Sort by relevance (exact matches first, then partial)
    const lowerQuery = query.toLowerCase();
    results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === lowerQuery ? 0 : 1;
      const bExact = b.name.toLowerCase() === lowerQuery ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;
      
      const aStarts = a.name.toLowerCase().startsWith(lowerQuery) ? 0 : 1;
      const bStarts = b.name.toLowerCase().startsWith(lowerQuery) ? 0 : 1;
      return aStarts - bStarts;
    });

    return NextResponse.json({
      success: true,
      query,
      results: results.slice(0, limit * 3), // Return more results since we searched multiple sources
      totalCount: results.length,
      sources: {
        pokemon: searchPokemon,
        mtg: searchMtg,
        sports: searchSports,
      },
    });
  } catch (error) {
    console.error('Unified search error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Search failed',
    }, { status: 500 });
  }
}
