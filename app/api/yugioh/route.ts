// ============================================================================
// YU-GI-OH CARD API
// Free API from ygoprodeck.com - 10,000+ cards with images and prices
// CravCards - CR AudioViz AI, LLC
// Created: December 14, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const YUGIOH_API = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

interface YuGiOhCard {
  id: number;
  name: string;
  type: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race: string;
  attribute?: string;
  archetype?: string;
  card_sets?: Array<{
    set_name: string;
    set_code: string;
    set_rarity: string;
    set_rarity_code: string;
    set_price: string;
  }>;
  card_images: Array<{
    id: number;
    image_url: string;
    image_url_small: string;
    image_url_cropped: string;
  }>;
  card_prices: Array<{
    cardmarket_price: string;
    tcgplayer_price: string;
    ebay_price: string;
    amazon_price: string;
    coolstuffinc_price: string;
  }>;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || searchParams.get('query') || '';
  const type = searchParams.get('type'); // monster, spell, trap
  const attribute = searchParams.get('attribute'); // DARK, LIGHT, etc.
  const level = searchParams.get('level');

  if (!query && !type) {
    return NextResponse.json({
      success: false,
      error: 'Search query required. Use ?q=card_name',
      example: '/api/yugioh?q=dark%20magician',
    });
  }

  try {
    // Build API URL
    const params = new URLSearchParams();
    
    if (query) {
      params.append('fname', query); // Fuzzy name search
    }
    if (type) {
      params.append('type', type);
    }
    if (attribute) {
      params.append('attribute', attribute);
    }
    if (level) {
      params.append('level', level);
    }

    const response = await fetch(`${YUGIOH_API}?${params.toString()}`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      // YGOProDeck returns 400 for no results
      if (response.status === 400) {
        return NextResponse.json({
          success: true,
          cards: [],
          query,
          message: 'No cards found matching your search',
        });
      }
      throw new Error(`YGOProDeck API error: ${response.status}`);
    }

    const data = await response.json();
    const rawCards: YuGiOhCard[] = data.data || [];

    // Transform to CravCards format
    const cards = rawCards.slice(0, 50).map(card => {
      const prices = card.card_prices?.[0] || {};
      const tcgPrice = parseFloat(prices.tcgplayer_price) || null;
      const marketPrice = parseFloat(prices.cardmarket_price) || null;
      const bestPrice = tcgPrice || marketPrice;

      // Get first set info
      const firstSet = card.card_sets?.[0];

      return {
        id: `ygo-${card.id}`,
        name: card.name,
        category: 'yugioh',
        type: card.type,
        description: card.desc,
        
        // Card details
        atk: card.atk,
        def: card.def,
        level: card.level,
        race: card.race, // e.g., "Spellcaster", "Dragon"
        attribute: card.attribute, // e.g., "DARK", "LIGHT"
        archetype: card.archetype,

        // Set info
        set_name: firstSet?.set_name || 'Various Sets',
        set_code: firstSet?.set_code || '',
        rarity: firstSet?.set_rarity || 'Common',

        // Images
        image_url: card.card_images?.[0]?.image_url_small || '',
        image_large: card.card_images?.[0]?.image_url || '',

        // Prices
        price_tcgplayer: tcgPrice,
        price_cardmarket: marketPrice,
        price_ebay: parseFloat(prices.ebay_price) || null,
        price_amazon: parseFloat(prices.amazon_price) || null,
        market_price: bestPrice,

        // All printings
        all_sets: card.card_sets?.map(set => ({
          name: set.set_name,
          code: set.set_code,
          rarity: set.set_rarity,
          price: parseFloat(set.set_price) || null,
        })) || [],

        source: 'YGOProDeck',
      };
    });

    return NextResponse.json({
      success: true,
      cards,
      query,
      totalResults: rawCards.length,
      returnedResults: cards.length,
      source: 'ygoprodeck.com',
    });

  } catch (error) {
    console.error('Yu-Gi-Oh API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Yu-Gi-Oh cards',
      cards: [],
    }, { status: 500 });
  }
}
