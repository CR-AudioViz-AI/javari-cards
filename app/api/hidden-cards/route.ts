export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { HIDDEN_CARD_DATABASE, RARITY_CONFIG } from '@/lib/hidden-cards-system';

// GET /api/hidden-cards - List all available cards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const includeSecret = searchParams.get('includeSecret') === 'true';
    const category = searchParams.get('category');
    const rarity = searchParams.get('rarity');

    // Filter cards
    let cards = [...HIDDEN_CARD_DATABASE];

    // Filter out secrets unless discovered or explicitly requested
    if (!includeSecret) {
      cards = cards.filter(c => !c.isSecret);
    }

    if (category) {
      cards = cards.filter(c => c.category === category);
    }

    if (rarity) {
      cards = cards.filter(c => c.rarity === rarity);
    }

    // Filter by availability (release/retire dates)
    const now = new Date();
    cards = cards.filter(card => {
      const releaseDate = new Date(card.releaseDate);
      const retireDate = card.retireDate ? new Date(card.retireDate) : null;
      return releaseDate <= now && (!retireDate || retireDate > now);
    });

    // If userId provided, include discovery status
    if (userId) {
      const supabase = createClient();
      const { data: discovered } = await supabase
        .from('user_hidden_cards')
        .select('card_id')
        .eq('user_id', userId);

      const discoveredIds = new Set(discovered?.map(d => d.card_id) || []);

      cards = cards.map(card => ({
        ...card,
        isDiscovered: discoveredIds.has(card.id),
        // Hide secret card details if not discovered
        ...(card.isSecret && !discoveredIds.has(card.id) ? {
          name: '???',
          description: '???',
          discoveryHint: '???'
        } : {})
      }));
    }

    // Calculate stats
    const stats = {
      total: cards.length,
      byRarity: {
        common: cards.filter(c => c.rarity === 'common').length,
        uncommon: cards.filter(c => c.rarity === 'uncommon').length,
        rare: cards.filter(c => c.rarity === 'rare').length,
        epic: cards.filter(c => c.rarity === 'epic').length,
        legendary: cards.filter(c => c.rarity === 'legendary').length,
        mythic: cards.filter(c => c.rarity === 'mythic').length
      },
      byCategory: cards.reduce((acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalXP: cards.reduce((sum, c) => sum + c.xpReward, 0),
      totalCredits: cards.reduce((sum, c) => sum + c.creditReward, 0)
    };

    return NextResponse.json({
      cards,
      stats,
      rarityConfig: RARITY_CONFIG
    });
  } catch (error) {
    console.error('Error fetching hidden cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hidden cards' },
      { status: 500 }
    );
  }
}

// POST /api/hidden-cards - Discover a card
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, cardId, location, triggerData } = body;

    if (!userId || !cardId) {
      return NextResponse.json(
        { error: 'userId and cardId are required' },
        { status: 400 }
      );
    }

    // Find the card
    const card = HIDDEN_CARD_DATABASE.find(c => c.id === cardId);
    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    // Check if already discovered
    const supabase = createClient();
    const { data: existing } = await supabase
      .from('user_hidden_cards')
      .select('id')
      .eq('user_id', userId)
      .eq('card_id', cardId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Card already discovered', alreadyDiscovered: true },
        { status: 409 }
      );
    }

    // Check availability
    const now = new Date();
    const releaseDate = new Date(card.releaseDate);
    const retireDate = card.retireDate ? new Date(card.retireDate) : null;

    if (releaseDate > now) {
      return NextResponse.json(
        { error: 'Card not yet available' },
        { status: 403 }
      );
    }

    if (retireDate && retireDate < now) {
      return NextResponse.json(
        { error: 'Card no longer available' },
        { status: 403 }
      );
    }

    // Check max supply
    if (card.maxSupply && card.currentSupply >= card.maxSupply) {
      return NextResponse.json(
        { error: 'Card supply exhausted' },
        { status: 403 }
      );
    }

    // Record the discovery
    const { data: discovery, error: insertError } = await supabase
      .from('user_hidden_cards')
      .insert({
        user_id: userId,
        card_id: cardId,
        discovery_location: location,
        discovery_context: JSON.stringify(triggerData || {})
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error recording discovery:', insertError);
      return NextResponse.json(
        { error: 'Failed to record discovery' },
        { status: 500 }
      );
    }

    // Log the discovery
    await supabase.from('card_discovery_logs').insert({
      user_id: userId,
      card_id: cardId,
      trigger_type: card.discoveryMethod,
      trigger_location: location,
      trigger_data: triggerData || {},
      discovered: true
    });

    // Return the discovered card with rewards
    return NextResponse.json({
      success: true,
      card: {
        ...card,
        isDiscovered: true
      },
      rewards: {
        xp: card.xpReward,
        credits: card.creditReward
      },
      discovery: {
        id: discovery.id,
        discoveredAt: discovery.discovered_at
      }
    });
  } catch (error) {
    console.error('Error discovering card:', error);
    return NextResponse.json(
      { error: 'Failed to discover card' },
      { status: 500 }
    );
  }
}
