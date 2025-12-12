// ============================================================================
// SCRYFALL MTG API - FREE ACCESS TO 27,000+ CARDS
// CravCards - CR AudioViz AI, LLC
// Created: December 12, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const SCRYFALL_API = 'https://api.scryfall.com';

// Scryfall is 100% FREE with no API key required
// Rate limit: ~10 requests/second (be nice to their servers)
// Documentation: https://scryfall.com/docs/api

interface ScryfallCard {
  id: string;
  oracle_id: string;
  name: string;
  lang: string;
  released_at: string;
  uri: string;
  scryfall_uri: string;
  layout: string;
  highres_image: boolean;
  image_status: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  mana_cost?: string;
  cmc: number;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  colors?: string[];
  color_identity: string[];
  keywords: string[];
  legalities: Record<string, string>;
  games: string[];
  reserved: boolean;
  foil: boolean;
  nonfoil: boolean;
  finishes: string[];
  oversized: boolean;
  promo: boolean;
  reprint: boolean;
  variation: boolean;
  set_id: string;
  set: string;
  set_name: string;
  set_type: string;
  set_uri: string;
  set_search_uri: string;
  scryfall_set_uri: string;
  rulings_uri: string;
  prints_search_uri: string;
  collector_number: string;
  digital: boolean;
  rarity: string;
  flavor_text?: string;
  card_back_id?: string;
  artist?: string;
  artist_ids?: string[];
  illustration_id?: string;
  border_color: string;
  frame: string;
  full_art: boolean;
  textless: boolean;
  booster: boolean;
  story_spotlight: boolean;
  edhrec_rank?: number;
  penny_rank?: number;
  prices: {
    usd?: string;
    usd_foil?: string;
    usd_etched?: string;
    eur?: string;
    eur_foil?: string;
    tix?: string;
  };
  related_uris: {
    tcgplayer_infinite_articles?: string;
    tcgplayer_infinite_decks?: string;
    edhrec?: string;
  };
  purchase_uris: {
    tcgplayer?: string;
    cardmarket?: string;
    cardhoarder?: string;
  };
}

interface ScryfallSet {
  id: string;
  code: string;
  name: string;
  uri: string;
  scryfall_uri: string;
  search_uri: string;
  released_at?: string;
  set_type: string;
  card_count: number;
  digital: boolean;
  nonfoil_only: boolean;
  foil_only: boolean;
  icon_svg_uri: string;
}

// GET - Search cards, get card by ID, or list sets
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const cardId = searchParams.get('id');
  const setCode = searchParams.get('set');
  const page = searchParams.get('page') || '1';
  const type = searchParams.get('type'); // cards, sets, random
  const unique = searchParams.get('unique') || 'cards'; // cards, art, prints

  try {
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get random card
    if (type === 'random') {
      const response = await fetch(`${SCRYFALL_API}/cards/random`, {
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Scryfall API error: ${response.status}`);
      }

      const card = await response.json();
      return NextResponse.json({
        success: true,
        card: transformCard(card),
      });
    }

    // Get specific card by ID
    if (cardId) {
      const response = await fetch(`${SCRYFALL_API}/cards/${cardId}`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        throw new Error(`Scryfall API error: ${response.status}`);
      }

      const card = await response.json();
      return NextResponse.json({
        success: true,
        card: transformCard(card),
      });
    }

    // List all sets
    if (type === 'sets') {
      const response = await fetch(`${SCRYFALL_API}/sets`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 86400 },
      });

      if (!response.ok) {
        throw new Error(`Scryfall API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Filter to main sets (exclude tokens, promos, etc. unless requested)
      const mainSets = data.data.filter((set: ScryfallSet) => 
        ['core', 'expansion', 'masters', 'draft_innovation', 'commander'].includes(set.set_type)
      );

      return NextResponse.json({
        success: true,
        sets: mainSets.map(transformSet),
        totalCount: mainSets.length,
      });
    }

    // Search cards
    let searchQuery = query || '';
    
    if (setCode && !searchQuery.includes('set:')) {
      searchQuery += ` set:${setCode}`;
    }

    if (!searchQuery.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Search query required',
      }, { status: 400 });
    }

    const url = new URL(`${SCRYFALL_API}/cards/search`);
    url.searchParams.set('q', searchQuery.trim());
    url.searchParams.set('page', page);
    url.searchParams.set('unique', unique);
    url.searchParams.set('order', 'released');
    url.searchParams.set('dir', 'desc');

    const response = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          success: true,
          cards: [],
          totalCount: 0,
          message: 'No cards found matching your search',
        });
      }
      throw new Error(`Scryfall API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      cards: data.data.map(transformCard),
      hasMore: data.has_more,
      nextPage: data.next_page,
      totalCount: data.total_cards,
      page: parseInt(page),
    });
  } catch (error) {
    console.error('Scryfall API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch MTG data',
      },
      { status: 500 }
    );
  }
}

// Transform Scryfall card to CravCards format
function transformCard(card: ScryfallCard) {
  // Handle double-faced cards
  const imageUri = card.image_uris?.normal || 
    (card as any).card_faces?.[0]?.image_uris?.normal ||
    null;
  const imageLarge = card.image_uris?.large || 
    (card as any).card_faces?.[0]?.image_uris?.large ||
    null;

  // Get best available price
  let marketPrice = null;
  let priceSource = null;

  if (card.prices.usd) {
    marketPrice = parseFloat(card.prices.usd);
    priceSource = 'TCGPlayer';
  } else if (card.prices.usd_foil) {
    marketPrice = parseFloat(card.prices.usd_foil);
    priceSource = 'TCGPlayer (Foil)';
  } else if (card.prices.eur) {
    marketPrice = parseFloat(card.prices.eur);
    priceSource = 'Cardmarket (EUR)';
  }

  return {
    id: card.id,
    oracle_id: card.oracle_id,
    name: card.name,
    category: 'mtg',
    set_name: card.set_name,
    set_code: card.set.toUpperCase(),
    card_number: card.collector_number,
    rarity: card.rarity,
    type: card.type_line,
    mana_cost: card.mana_cost,
    cmc: card.cmc,
    colors: card.colors,
    color_identity: card.color_identity,
    oracle_text: card.oracle_text,
    power: card.power,
    toughness: card.toughness,
    artist: card.artist,
    image_small: card.image_uris?.small,
    image_normal: imageUri,
    image_large: imageLarge,
    image_art: card.image_uris?.art_crop,
    release_date: card.released_at,
    market_price: marketPrice,
    price_source: priceSource,
    prices: card.prices,
    scryfall_uri: card.scryfall_uri,
    tcgplayer_url: card.purchase_uris?.tcgplayer,
    cardmarket_url: card.purchase_uris?.cardmarket,
    edhrec_url: card.related_uris?.edhrec,
    edhrec_rank: card.edhrec_rank,
    legalities: card.legalities,
    keywords: card.keywords,
    flavor_text: card.flavor_text,
    is_foil: card.foil,
    is_nonfoil: card.nonfoil,
    is_promo: card.promo,
    is_reprint: card.reprint,
    is_reserved: card.reserved,
    is_full_art: card.full_art,
    border_color: card.border_color,
    frame: card.frame,
  };
}

// Transform set data
function transformSet(set: ScryfallSet) {
  return {
    id: set.id,
    code: set.code.toUpperCase(),
    name: set.name,
    set_type: set.set_type,
    total_cards: set.card_count,
    release_date: set.released_at,
    icon: set.icon_svg_uri,
    scryfall_uri: set.scryfall_uri,
    category: 'mtg',
    is_digital: set.digital,
    is_foil_only: set.foil_only,
  };
}
