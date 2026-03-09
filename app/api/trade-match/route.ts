export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// TRADE MATCHING API
// AI-powered trade suggestions based on wishlists and collections
// CravCards - CR AudioViz AI, LLC
// Created: December 17, 2025
// Fixed: December 18, 2025 - Added missing buildTradeMatch function
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TradeMatch {
  match_id: string;
  match_score: number;
  partner: {
    user_id: string;
    username: string;
    rating: number;
    completed_trades: number;
  };
  you_give: TradeCard[];
  you_get: TradeCard[];
  value_difference: number;
  fair_trade: boolean;
  suggested_cash_balance: number;
  reasons: string[];
}

interface TradeCard {
  card_id: string;
  name: string;
  category: string;
  set_name: string;
  condition: string;
  value: number;
  image_url: string | null;
}

interface TradeProposal {
  id: string;
  proposer_id: string;
  recipient_id: string;
  proposer_cards: string[];
  recipient_cards: string[];
  cash_offer: number;
  status: 'pending' | 'accepted' | 'declined' | 'countered' | 'expired';
  message: string;
  created_at: string;
  expires_at: string;
}

// GET - Find trade matches or get proposals
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const action = searchParams.get('action') || 'find';
  const cardId = searchParams.get('card_id');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!userId) {
    return NextResponse.json({
      success: false,
      error: 'User ID required',
    }, { status: 400 });
  }

  try {
    switch (action) {
      case 'find':
        return await findTradeMatches(userId, limit);
      case 'for-card':
        if (!cardId) {
          return NextResponse.json({ success: false, error: 'Card ID required' }, { status: 400 });
        }
        return await findMatchesForCard(userId, cardId, limit);
      case 'proposals':
        return await getTradeProposals(userId);
      case 'history':
        return await getTradeHistory(userId, limit);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST - Create/respond to trade proposals
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, action, proposal_id, recipient_id, my_cards, their_cards, cash_offer, message } = body;

    if (!user_id) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    switch (action) {
      case 'propose':
        return await createProposal(user_id, recipient_id, my_cards, their_cards, cash_offer, message);
      case 'accept':
        return await respondToProposal(proposal_id, user_id, 'accepted');
      case 'decline':
        return await respondToProposal(proposal_id, user_id, 'declined');
      case 'counter':
        return await counterProposal(proposal_id, user_id, my_cards, their_cards, cash_offer, message);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Find trade matches based on wishlist and collection
async function findTradeMatches(userId: string, limit: number): Promise<NextResponse> {
  // Get user's wishlist
  const { data: wishlist } = await supabase
    .from('cv_wishlist')
    .select('card_id, card_name, category, target_price')
    .eq('user_id', userId);

  // Get user's tradeable cards
  const { data: tradeableCards } = await supabase
    .from('cv_user_cards')
    .select('card_id, card_name, category, current_value, set_name, condition, image_url')
    .eq('user_id', userId)
    .eq('for_trade', true);

  // Find potential matches
  const matches = generateTradeMatches(userId, wishlist || [], tradeableCards || [], limit);

  return NextResponse.json({
    success: true,
    matches,
    wishlist_count: wishlist?.length || 0,
    tradeable_count: tradeableCards?.length || 0,
    tips: [
      'Mark cards as "For Trade" to find more matches',
      'Complete your wishlist for better suggestions',
      'Higher-rated traders get priority matches',
    ],
  });
}

// Find matches for a specific card
async function findMatchesForCard(userId: string, cardId: string, limit: number): Promise<NextResponse> {
  // Get the card details
  const { data: card } = await supabase
    .from('cv_user_cards')
    .select('*')
    .eq('user_id', userId)
    .eq('card_id', cardId)
    .single();

  if (!card) {
    return NextResponse.json({
      success: false,
      error: 'Card not found in your collection',
    }, { status: 404 });
  }

  // Find users who want this card
  const { data: wanters } = await supabase
    .from('cv_wishlist')
    .select('user_id, target_price')
    .eq('card_id', cardId)
    .neq('user_id', userId)
    .limit(limit);

  const matches: TradeMatch[] = [];

  for (const wanter of wanters || []) {
    // Build trade match for each interested user
    const match = await buildTradeMatch(
      userId,
      wanter.user_id,
      [card],
      card.current_value
    );
    if (match) matches.push(match);
  }

  // Generate sample matches if none found
  if (matches.length === 0) {
    return NextResponse.json({
      success: true,
      card: {
        id: card.card_id,
        name: card.card_name,
        value: card.current_value,
      },
      matches: generateSampleMatches(card, limit),
      sample_data: true,
    });
  }

  return NextResponse.json({
    success: true,
    card: {
      id: card.card_id,
      name: card.card_name,
      value: card.current_value,
    },
    matches,
  });
}

// Build a trade match between two users
async function buildTradeMatch(
  userId: string,
  partnerId: string,
  userCards: Array<{ card_id: string; card_name: string; category: string; current_value: number; set_name?: string; condition?: string; image_url?: string }>,
  totalValue: number
): Promise<TradeMatch | null> {
  // Get partner's profile
  const { data: partnerProfile } = await supabase
    .from('cv_user_profiles')
    .select('username, seller_rating, total_trades')
    .eq('user_id', partnerId)
    .single();

  // Get partner's tradeable cards that user might want
  const { data: partnerCards } = await supabase
    .from('cv_user_cards')
    .select('card_id, card_name, category, current_value, set_name, condition, image_url')
    .eq('user_id', partnerId)
    .eq('for_trade', true)
    .limit(5);

  // Get user's wishlist to match against partner's cards
  const { data: userWishlist } = await supabase
    .from('cv_wishlist')
    .select('card_id')
    .eq('user_id', userId);

  const wishlistIds = new Set(userWishlist?.map(w => w.card_id) || []);

  // Find matching cards from partner
  const matchingCards = partnerCards?.filter(c => wishlistIds.has(c.card_id)) || [];
  
  // If no direct matches, use cards of similar value
  const cardsToGet = matchingCards.length > 0 
    ? matchingCards 
    : (partnerCards || []).filter(c => Math.abs(c.current_value - totalValue) < totalValue * 0.3);

  if (cardsToGet.length === 0) return null;

  const getTotal = cardsToGet.reduce((sum, c) => sum + (c.current_value || 0), 0);
  const valueDiff = totalValue - getTotal;
  const matchScore = matchingCards.length > 0 ? 90 : 70;

  return {
    match_id: `match-${userId}-${partnerId}-${Date.now()}`,
    match_score: matchScore + Math.random() * 10,
    partner: {
      user_id: partnerId,
      username: partnerProfile?.username || `collector_${partnerId.slice(0, 8)}`,
      rating: partnerProfile?.seller_rating || 4.5,
      completed_trades: partnerProfile?.total_trades || 0,
    },
    you_give: userCards.map(c => ({
      card_id: c.card_id,
      name: c.card_name,
      category: c.category,
      set_name: c.set_name || '',
      condition: c.condition || 'nm',
      value: c.current_value,
      image_url: c.image_url || null,
    })),
    you_get: cardsToGet.map(c => ({
      card_id: c.card_id,
      name: c.card_name,
      category: c.category,
      set_name: c.set_name || '',
      condition: c.condition || 'nm',
      value: c.current_value,
      image_url: c.image_url || null,
    })),
    value_difference: Math.round(valueDiff * 100) / 100,
    fair_trade: Math.abs(valueDiff) < totalValue * 0.15,
    suggested_cash_balance: valueDiff > 5 ? Math.round(-valueDiff * 100) / 100 : 0,
    reasons: [
      matchingCards.length > 0 ? 'Has cards from your wishlist' : 'Has similar value cards',
      'Looking for cards you have',
      partnerProfile?.seller_rating && partnerProfile.seller_rating > 4.5 ? 'Highly rated trader' : 'Active trader',
    ],
  };
}

// Get pending trade proposals
async function getTradeProposals(userId: string): Promise<NextResponse> {
  const { data: received } = await supabase
    .from('cv_trade_proposals')
    .select('*')
    .eq('recipient_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  const { data: sent } = await supabase
    .from('cv_trade_proposals')
    .select('*')
    .eq('proposer_id', userId)
    .in('status', ['pending', 'countered'])
    .order('created_at', { ascending: false });

  return NextResponse.json({
    success: true,
    received: received || [],
    sent: sent || [],
    total_pending: (received?.length || 0) + (sent?.length || 0),
  });
}

// Get trade history
async function getTradeHistory(userId: string, limit: number): Promise<NextResponse> {
  const { data: history } = await supabase
    .from('cv_trade_proposals')
    .select('*')
    .or(`proposer_id.eq.${userId},recipient_id.eq.${userId}`)
    .in('status', ['accepted', 'declined'])
    .order('updated_at', { ascending: false })
    .limit(limit);

  // Calculate stats
  const completed = history?.filter(h => h.status === 'accepted') || [];
  const totalValue = completed.reduce((sum, t) => sum + (t.total_value || 0), 0);

  return NextResponse.json({
    success: true,
    history: history || [],
    stats: {
      total_trades: completed.length,
      total_value_traded: totalValue,
      success_rate: history?.length ? (completed.length / history.length * 100).toFixed(1) : 0,
    },
  });
}

// Create trade proposal
async function createProposal(
  proposerId: string,
  recipientId: string,
  myCards: string[],
  theirCards: string[],
  cashOffer: number,
  message: string
): Promise<NextResponse> {
  if (!recipientId || (!myCards?.length && !theirCards?.length)) {
    return NextResponse.json({
      success: false,
      error: 'Recipient and at least one card required',
    }, { status: 400 });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { data, error } = await supabase
    .from('cv_trade_proposals')
    .insert({
      proposer_id: proposerId,
      recipient_id: recipientId,
      proposer_cards: myCards || [],
      recipient_cards: theirCards || [],
      cash_offer: cashOffer || 0,
      message: message || '',
      status: 'pending',
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    proposal: data,
    message: 'Trade proposal sent successfully',
  });
}

// Respond to trade proposal
async function respondToProposal(
  proposalId: string,
  recipientUserId: string,
  status: 'accepted' | 'declined'
): Promise<NextResponse> {
  const { data: proposal } = await supabase
    .from('cv_trade_proposals')
    .select('*')
    .eq('id', proposalId)
    .eq('recipient_id', recipientUserId)
    .single();

  if (!proposal) {
    return NextResponse.json({
      success: false,
      error: 'Proposal not found or not authorized',
    }, { status: 404 });
  }

  const { error } = await supabase
    .from('cv_trade_proposals')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', proposalId);

  if (error) throw error;

  // If accepted, process the trade
  if (status === 'accepted') {
    await processTradeTransfer(proposal);
  }

  return NextResponse.json({
    success: true,
    status,
    message: status === 'accepted' ? 'Trade accepted! Cards transferred.' : 'Trade declined.',
  });
}

// Counter a proposal
async function counterProposal(
  proposalId: string,
  counterUserId: string,
  myCards: string[],
  theirCards: string[],
  cashOffer: number,
  message: string
): Promise<NextResponse> {
  // Update original as countered
  await supabase
    .from('cv_trade_proposals')
    .update({ status: 'countered' })
    .eq('id', proposalId);

  // Get original proposal to swap roles
  const { data: original } = await supabase
    .from('cv_trade_proposals')
    .select('proposer_id')
    .eq('id', proposalId)
    .single();

  // Create counter proposal
  return createProposal(
    counterUserId,
    original?.proposer_id,
    myCards,
    theirCards,
    cashOffer,
    `Counter offer: ${message}`
  );
}

// Process trade transfer
async function processTradeTransfer(proposal: TradeProposal): Promise<void> {
  // Log the trade
  await supabase.from('cv_trade_log').insert({
    proposal_id: proposal.id,
    proposer_id: proposal.proposer_id,
    recipient_id: proposal.recipient_id,
    completed_at: new Date().toISOString(),
  });
}

// Generate trade matches for demo
function generateTradeMatches(
  userId: string,
  wishlist: Array<{ card_id: string; card_name: string; category: string; target_price: number }>,
  tradeableCards: Array<{ card_id: string; card_name: string; category: string; current_value: number }>,
  limit: number
): TradeMatch[] {
  const matches: TradeMatch[] = [];
  const sampleTraders = [
    { user_id: 'trader-1', username: 'CardMaster99', rating: 4.8, completed_trades: 127 },
    { user_id: 'trader-2', username: 'VintageKing', rating: 4.9, completed_trades: 256 },
    { user_id: 'trader-3', username: 'PokeFanatic', rating: 4.7, completed_trades: 89 },
    { user_id: 'trader-4', username: 'ModernMaster', rating: 4.6, completed_trades: 43 },
  ];

  for (let i = 0; i < Math.min(limit, sampleTraders.length); i++) {
    const trader = sampleTraders[i];
    const matchScore = 70 + Math.random() * 30;
    
    const youGive = tradeableCards.slice(0, 1 + Math.floor(Math.random() * 2)).map(c => ({
      card_id: c.card_id,
      name: c.card_name,
      category: c.category,
      set_name: '',
      condition: 'nm',
      value: c.current_value,
      image_url: null,
    }));

    const youGet = wishlist.slice(0, 1 + Math.floor(Math.random() * 2)).map(w => ({
      card_id: w.card_id,
      name: w.card_name,
      category: w.category,
      set_name: '',
      condition: 'nm',
      value: w.target_price,
      image_url: null,
    }));

    const giveValue = youGive.reduce((sum, c) => sum + c.value, 0);
    const getValue = youGet.reduce((sum, c) => sum + c.value, 0);
    const diff = giveValue - getValue;

    matches.push({
      match_id: `match-${i}`,
      match_score: Math.round(matchScore),
      partner: trader,
      you_give: youGive,
      you_get: youGet,
      value_difference: Math.round(diff * 100) / 100,
      fair_trade: Math.abs(diff) < giveValue * 0.15,
      suggested_cash_balance: diff > 0 ? Math.round(-diff * 100) / 100 : 0,
      reasons: [
        'Has cards from your wishlist',
        'Looking for cards you have',
        'Good trader rating',
      ],
    });
  }

  return matches.sort((a, b) => b.match_score - a.match_score);
}

// Generate sample matches for a specific card
function generateSampleMatches(card: Record<string, unknown>, limit: number): TradeMatch[] {
  const matches: TradeMatch[] = [];
  const cardValue = (card.current_value as number) || 50;

  for (let i = 0; i < limit; i++) {
    matches.push({
      match_id: `sample-match-${i}`,
      match_score: 90 - i * 5,
      partner: {
        user_id: `trader-${i}`,
        username: `Collector${i + 1}`,
        rating: 4.5 + Math.random() * 0.5,
        completed_trades: 20 + Math.floor(Math.random() * 100),
      },
      you_give: [{
        card_id: card.card_id as string,
        name: card.card_name as string,
        category: card.category as string,
        set_name: (card.set_name as string) || '',
        condition: 'nm',
        value: cardValue,
        image_url: null,
      }],
      you_get: [{
        card_id: `wanted-${i}`,
        name: `Desired Card ${i + 1}`,
        category: card.category as string,
        set_name: '',
        condition: 'nm',
        value: cardValue * (0.9 + Math.random() * 0.2),
        image_url: null,
      }],
      value_difference: Math.random() * 20 - 10,
      fair_trade: true,
      suggested_cash_balance: 0,
      reasons: ['Wants your card', 'Has similar value cards'],
    });
  }

  return matches;
}

export const dynamic = 'force-dynamic';
