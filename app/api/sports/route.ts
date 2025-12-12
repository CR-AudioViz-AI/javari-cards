// ============================================================================
// SPORTS CARDS API - MULTI-SOURCE INTEGRATION
// CravCards - CR AudioViz AI, LLC
// Created: December 12, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Sports cards don't have a universal free API like Pokemon/MTG
// Strategy: Use our seeded database + allow user submissions + eBay completed listings
// Future: Integrate SportsCardsPro API when budget allows ($99/month)

interface SportsCardSearch {
  query: string;
  sport?: 'baseball' | 'basketball' | 'football' | 'hockey' | 'soccer';
  year?: string;
  manufacturer?: string;
  player?: string;
}

// GET - Search sports cards from database + external sources
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const sport = searchParams.get('sport');
  const year = searchParams.get('year');
  const manufacturer = searchParams.get('manufacturer');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  const type = searchParams.get('type'); // sets, cards

  try {
    // List all sports sets
    if (type === 'sets') {
      let setsQuery = supabase
        .from('card_sets')
        .select('*')
        .like('category', 'sports%')
        .order('release_year', { ascending: false });

      if (sport) {
        setsQuery = setsQuery.eq('category', `sports_${sport}`);
      }

      const { data: sets, error } = await setsQuery;

      if (error) throw error;

      return NextResponse.json({
        success: true,
        sets: sets || [],
        totalCount: sets?.length || 0,
      });
    }

    // Search cards from database
    let cardsQuery = supabase
      .from('card_catalog')
      .select('*', { count: 'exact' })
      .like('category', 'sports%');

    if (query) {
      cardsQuery = cardsQuery.ilike('name', `%${query}%`);
    }

    if (sport) {
      cardsQuery = cardsQuery.eq('category', `sports_${sport}`);
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    cardsQuery = cardsQuery.range(from, to);

    const { data: cards, error, count } = await cardsQuery;

    if (error) throw error;

    // Transform to consistent format
    const transformedCards = (cards || []).map(card => ({
      id: card.id,
      name: card.name,
      category: card.category,
      set_name: card.set_name,
      set_code: card.set_code,
      card_number: card.card_number,
      rarity: card.rarity,
      type: card.type,
      image_url: card.image_url,
      market_price: card.avg_price,
      source: 'database',
    }));

    return NextResponse.json({
      success: true,
      cards: transformedCards,
      page,
      pageSize,
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize),
      note: 'Sports card data from CravCards database. Submit missing cards to grow the collection!',
    });
  } catch (error) {
    console.error('Sports API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch sports data',
      },
      { status: 500 }
    );
  }
}

// POST - Submit a new sports card to the database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      sport,
      year,
      manufacturer,
      set_name,
      card_number,
      player_name,
      team,
      rarity,
      type, // rookie, base, insert, autograph, relic
      image_url,
    } = body;

    // Validate required fields
    if (!name || !sport) {
      return NextResponse.json(
        { success: false, error: 'Name and sport are required' },
        { status: 400 }
      );
    }

    // Check for duplicates
    const { data: existing } = await supabase
      .from('card_catalog')
      .select('id')
      .eq('name', name)
      .eq('set_name', set_name || '')
      .eq('card_number', card_number || '')
      .single();

    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'This card already exists in the database',
        existingId: existing.id,
      }, { status: 409 });
    }

    // Insert new card
    const { data: newCard, error } = await supabase
      .from('card_catalog')
      .insert({
        name,
        category: `sports_${sport}`,
        set_name: set_name || `${year} ${manufacturer}`,
        set_code: `${year?.slice(-2) || 'XX'}${manufacturer?.slice(0, 3).toUpperCase() || 'UNK'}`,
        card_number,
        rarity: rarity || 'base',
        type: type || 'Base',
        image_url,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Card submitted successfully! Thank you for contributing.',
      card: newCard,
    });
  } catch (error) {
    console.error('Sports card submission error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit card',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// EBAY COMPLETED LISTINGS SCRAPER (For price data)
// Note: This would require eBay Browse API or web scraping
// eBay Browse API: https://developer.ebay.com/api-docs/buy/browse/overview.html
// Free tier: 5,000 calls/day
// ============================================================================

export async function getEbayPrices(cardName: string, year?: string) {
  // Placeholder for eBay integration
  // Would return recent sold prices for valuation
  return {
    available: false,
    message: 'eBay price integration coming soon',
    cardName,
    year,
  };
}

// ============================================================================
// SPORTS DATA PROVIDERS (For future integration)
// ============================================================================

/*
FREE/AFFORDABLE SPORTS CARD APIs:

1. SportsCardsPro API
   - URL: https://www.sportscardspro.com/api
   - Cost: $99/month
   - Coverage: Most sports cards with prices
   
2. TCDB (Trading Card Database)
   - URL: https://www.tcdb.com/
   - Community-driven
   - No official API but scrapable
   
3. eBay Browse API
   - URL: https://developer.ebay.com/api-docs/buy/browse/overview.html
   - Cost: Free (5000 calls/day)
   - Real sold prices
   
4. Beckett API
   - URL: https://www.beckett.com/
   - Industry standard pricing
   - Expensive, enterprise-focused
   
5. PSA Pop Report
   - URL: https://www.psacard.com/pop
   - Population reports for graded cards
   - Scrapable, no official API

RECOMMENDATION:
- Start with eBay Browse API for real market prices
- Use community submissions to build database
- Add SportsCardsPro when revenue justifies $99/month
*/
