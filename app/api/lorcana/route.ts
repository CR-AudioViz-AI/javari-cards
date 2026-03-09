// ============================================================================
// LORCANA CARD API - FIXED
// Free API from lorcana-api.com - Disney TCG cards
// API only supports /cards/all - we fetch and filter locally
// CravCards - CR AudioViz AI, LLC
// Created: December 14, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LORCANA_API = 'https://api.lorcana-api.com/cards/all';

// Cache the full card list (it's not that big)
let cachedCards: any[] | null = null;
let cacheTime = 0;
const CACHE_DURATION = 3600000; // 1 hour

interface LorcanaCard {
  Name: string;
  Title?: string;
  Cost: number;
  Inkwell: boolean;
  Color: string;
  Type: string;
  Classifications?: string[];
  Body_Text?: string;
  Flavor_Text?: string;
  Strength?: number;
  Willpower?: number;
  Lore?: number;
  Rarity: string;
  Set_Name: string;
  Set_Num: number;
  Card_Num: number;
  Image: string;
  Franchise?: string;
  Artist?: string;
}

async function getAllCards(): Promise<LorcanaCard[]> {
  const now = Date.now();
  
  // Return cached if valid
  if (cachedCards && (now - cacheTime) < CACHE_DURATION) {
    return cachedCards;
  }

  const response = await fetch(LORCANA_API, {
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Lorcana API error: ${response.status}`);
  }

  cachedCards = await response.json();
  cacheTime = now;
  
  return cachedCards || [];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || searchParams.get('query') || '';
  const color = searchParams.get('color')?.toLowerCase();
  const rarity = searchParams.get('rarity')?.toLowerCase();
  const set = searchParams.get('set')?.toLowerCase();
  const limit = Math.min(parseInt(searchParams.get('limit') || '30'), 100);

  if (!query && !color && !set) {
    return NextResponse.json({
      success: false,
      error: 'Search query required. Use ?q=card_name',
      examples: [
        '/api/lorcana?q=mickey',
        '/api/lorcana?q=elsa',
        '/api/lorcana?color=amber',
        '/api/lorcana?q=stitch&color=sapphire',
      ],
      colors: ['Amber', 'Amethyst', 'Emerald', 'Ruby', 'Sapphire', 'Steel'],
    });
  }

  try {
    // Fetch all cards (cached)
    const allCards = await getAllCards();
    const queryLower = query.toLowerCase();

    // Filter cards
    let filtered = allCards.filter(card => {
      // Name filter
      if (query) {
        const name = (card.Name || '').toLowerCase();
        const title = (card.Title || '').toLowerCase();
        if (!name.includes(queryLower) && !title.includes(queryLower)) {
          return false;
        }
      }

      // Color filter
      if (color && (card.Color || '').toLowerCase() !== color) {
        return false;
      }

      // Rarity filter
      if (rarity && (card.Rarity || '').toLowerCase() !== rarity) {
        return false;
      }

      // Set filter
      if (set && !(card.Set_Name || '').toLowerCase().includes(set)) {
        return false;
      }

      return true;
    });

    // Sort by relevance (exact matches first)
    filtered.sort((a, b) => {
      const aExact = (a.Name || '').toLowerCase() === queryLower ? 0 : 1;
      const bExact = (b.Name || '').toLowerCase() === queryLower ? 0 : 1;
      return aExact - bExact;
    });

    // Transform to CravCards format
    const cards = filtered.slice(0, limit).map(card => {
      const fullName = card.Title ? `${card.Name} - ${card.Title}` : card.Name;

      return {
        id: `lorcana-${card.Set_Num}-${card.Card_Num}`,
        name: fullName,
        category: 'lorcana',
        type: card.Type,
        
        // Card details
        cost: card.Cost,
        inkwell: card.Inkwell,
        color: card.Color,
        classifications: card.Classifications || [],
        text: card.Body_Text,
        flavor_text: card.Flavor_Text,
        
        // Character stats
        strength: card.Strength,
        willpower: card.Willpower,
        lore: card.Lore,

        // Set info
        set_name: card.Set_Name,
        set_number: card.Set_Num,
        card_number: card.Card_Num,
        rarity: card.Rarity,
        
        // Franchise (Disney property)
        franchise: card.Franchise,
        artist: card.Artist,

        // Images
        image_url: card.Image,
        image_large: card.Image,

        // Price placeholder
        market_price: null,

        source: 'Lorcana-API',
      };
    });

    return NextResponse.json({
      success: true,
      cards,
      query,
      totalResults: filtered.length,
      returnedResults: cards.length,
      totalInDatabase: allCards.length,
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
