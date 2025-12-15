// ============================================================================
// LORCANA CARD API
// Free API from lorcana-api.com - Disney TCG cards
// CravCards - CR AudioViz AI, LLC
// Created: December 14, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const LORCANA_API = 'https://api.lorcana-api.com/cards';

interface LorcanaCard {
  id: string;
  name: string;
  title?: string;
  cost: number;
  inkwell: boolean;
  color: string;
  type: string;
  classifications?: string[];
  text?: string;
  flavor_text?: string;
  strength?: number;
  willpower?: number;
  lore?: number;
  rarity: string;
  set_name: string;
  set_num: number;
  set_id: string;
  image: string;
  franchise?: string;
  artist?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || searchParams.get('query') || '';
  const color = searchParams.get('color'); // Amber, Amethyst, Emerald, Ruby, Sapphire, Steel
  const rarity = searchParams.get('rarity');
  const set = searchParams.get('set');

  if (!query && !color && !set) {
    return NextResponse.json({
      success: false,
      error: 'Search query required. Use ?q=card_name',
      example: '/api/lorcana?q=mickey',
      colors: ['Amber', 'Amethyst', 'Emerald', 'Ruby', 'Sapphire', 'Steel'],
    });
  }

  try {
    // Lorcana API uses different endpoint for search
    let url = `${LORCANA_API}/search`;
    const params = new URLSearchParams();
    
    if (query) {
      params.append('name', query);
    }
    if (color) {
      params.append('color', color);
    }
    if (rarity) {
      params.append('rarity', rarity);
    }
    if (set) {
      params.append('set', set);
    }

    const fullUrl = params.toString() ? `${url}?${params.toString()}` : `${LORCANA_API}/all`;

    const response = await fetch(fullUrl, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Lorcana API error: ${response.status}`);
    }

    const rawCards: LorcanaCard[] = await response.json();

    // Transform to CravCards format
    const cards = (Array.isArray(rawCards) ? rawCards : []).slice(0, 50).map(card => {
      const fullName = card.title ? `${card.name} - ${card.title}` : card.name;

      return {
        id: `lorcana-${card.id || card.set_id}-${card.set_num}`,
        name: fullName,
        category: 'lorcana',
        type: card.type,
        
        // Card details
        cost: card.cost,
        inkwell: card.inkwell,
        color: card.color,
        classifications: card.classifications || [],
        text: card.text,
        flavor_text: card.flavor_text,
        
        // Character stats
        strength: card.strength,
        willpower: card.willpower,
        lore: card.lore,

        // Set info
        set_name: card.set_name,
        set_number: card.set_num,
        rarity: card.rarity,
        
        // Franchise (Disney property)
        franchise: card.franchise,
        artist: card.artist,

        // Images
        image_url: card.image,
        image_large: card.image,

        // Prices (Lorcana API doesn't include prices, would need TCGPlayer)
        market_price: null,

        source: 'Lorcana-API',
      };
    });

    return NextResponse.json({
      success: true,
      cards,
      query,
      totalResults: Array.isArray(rawCards) ? rawCards.length : 0,
      returnedResults: cards.length,
      source: 'lorcana-api.com',
    });

  } catch (error) {
    console.error('Lorcana API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Lorcana cards',
      cards: [],
    }, { status: 500 });
  }
}
