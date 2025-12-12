// ============================================================================
// USER COLLECTION API
// Manages user's personal card collection with photos, grades, values
// CravCards - CR AudioViz AI, LLC
// Created: December 12, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// First, we need to ensure the user_collection table exists
// Run this SQL in Supabase if not already created:
/*
CREATE TABLE IF NOT EXISTS user_collection (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  category TEXT NOT NULL,
  set_name TEXT,
  card_number TEXT,
  rarity TEXT,
  image_url TEXT,
  user_image_url TEXT,
  condition TEXT DEFAULT 'near_mint',
  grade TEXT,
  grading_company TEXT,
  purchase_price DECIMAL(10,2),
  current_value DECIMAL(10,2),
  purchase_date DATE,
  notes TEXT,
  is_for_sale BOOLEAN DEFAULT false,
  is_for_trade BOOLEAN DEFAULT false,
  asking_price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_collection_user ON user_collection(user_id);
CREATE INDEX idx_user_collection_category ON user_collection(category);
CREATE INDEX idx_user_collection_card ON user_collection(card_id);

-- RLS
ALTER TABLE user_collection ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own collection" ON user_collection
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cards" ON user_collection
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards" ON user_collection
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards" ON user_collection
  FOR DELETE USING (auth.uid() = user_id);

-- Public policy for viewing cards marked for sale/trade
CREATE POLICY "Public can view cards for sale" ON user_collection
  FOR SELECT USING (is_for_sale = true OR is_for_trade = true);
*/

// GET - Get user's collection
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const sort = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') || 'desc';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  const forSale = searchParams.get('forSale') === 'true';
  const forTrade = searchParams.get('forTrade') === 'true';

  try {
    // Get user from session
    const cookieStore = cookies();
    const authToken = cookieStore.get('sb-access-token')?.value;
    
    let query = supabase
      .from('user_collection')
      .select('*', { count: 'exact' });

    // If viewing public marketplace
    if (forSale || forTrade) {
      if (forSale) query = query.eq('is_for_sale', true);
      if (forTrade) query = query.eq('is_for_trade', true);
    } else if (authToken) {
      // Get user's own collection - need to verify token
      const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
      if (authError || !user) {
        return NextResponse.json({
          success: false,
          error: 'Please sign in to view your collection',
        }, { status: 401 });
      }
      query = query.eq('user_id', user.id);
    } else {
      return NextResponse.json({
        success: false,
        error: 'Please sign in to view your collection',
      }, { status: 401 });
    }

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Apply sorting
    const validSorts = ['created_at', 'card_name', 'purchase_price', 'current_value'];
    const sortField = validSorts.includes(sort) ? sort : 'created_at';
    query = query.order(sortField, { ascending: order === 'asc' });

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: cards, error, count } = await query;

    if (error) throw error;

    // Calculate collection stats
    const stats = cards ? calculateStats(cards) : null;

    return NextResponse.json({
      success: true,
      cards: cards || [],
      stats,
      pagination: {
        page,
        pageSize,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (error) {
    console.error('Collection fetch error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch collection',
    }, { status: 500 });
  }
}

// POST - Add card to collection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get user from session
    const cookieStore = cookies();
    const authToken = cookieStore.get('sb-access-token')?.value;
    
    if (!authToken) {
      return NextResponse.json({
        success: false,
        error: 'Please sign in to add cards to your collection',
      }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid session. Please sign in again.',
      }, { status: 401 });
    }

    const {
      card_id,
      card_name,
      category,
      set_name,
      card_number,
      rarity,
      image_url,
      user_image_url,
      condition,
      grade,
      grading_company,
      purchase_price,
      purchase_date,
      notes,
    } = body;

    // Validate required fields
    if (!card_name || !category) {
      return NextResponse.json({
        success: false,
        error: 'Card name and category are required',
      }, { status: 400 });
    }

    // Handle user image upload (if base64)
    let finalUserImageUrl = user_image_url;
    if (user_image_url?.startsWith('data:image')) {
      // In production, upload to Supabase Storage
      // For now, we'll store the reference
      // TODO: Implement Supabase Storage upload
      finalUserImageUrl = user_image_url; // Placeholder
    }

    // Insert card into collection
    const { data: newCard, error: insertError } = await supabase
      .from('user_collection')
      .insert({
        user_id: user.id,
        card_id: card_id || `custom_${Date.now()}`,
        card_name,
        category,
        set_name,
        card_number,
        rarity,
        image_url,
        user_image_url: finalUserImageUrl,
        condition: condition || 'near_mint',
        grade,
        grading_company,
        purchase_price: purchase_price ? parseFloat(purchase_price) : null,
        purchase_date: purchase_date || null,
        notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      message: 'Card added to collection!',
      card: newCard,
    });
  } catch (error) {
    console.error('Add card error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add card',
    }, { status: 500 });
  }
}

// PUT - Update card in collection
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Card ID is required',
      }, { status: 400 });
    }

    // Get user from session
    const cookieStore = cookies();
    const authToken = cookieStore.get('sb-access-token')?.value;
    
    if (!authToken) {
      return NextResponse.json({
        success: false,
        error: 'Please sign in',
      }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid session',
      }, { status: 401 });
    }

    // Update card (RLS ensures user can only update their own)
    const { data: updatedCard, error: updateError } = await supabase
      .from('user_collection')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id) // Extra safety
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: 'Card updated',
      card: updatedCard,
    });
  } catch (error) {
    console.error('Update card error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update card',
    }, { status: 500 });
  }
}

// DELETE - Remove card from collection
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Card ID is required',
      }, { status: 400 });
    }

    // Get user from session
    const cookieStore = cookies();
    const authToken = cookieStore.get('sb-access-token')?.value;
    
    if (!authToken) {
      return NextResponse.json({
        success: false,
        error: 'Please sign in',
      }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid session',
      }, { status: 401 });
    }

    // Delete card (RLS ensures user can only delete their own)
    const { error: deleteError } = await supabase
      .from('user_collection')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Extra safety

    if (deleteError) throw deleteError;

    return NextResponse.json({
      success: true,
      message: 'Card removed from collection',
    });
  } catch (error) {
    console.error('Delete card error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete card',
    }, { status: 500 });
  }
}

// Calculate collection statistics
function calculateStats(cards: any[]) {
  const totalCards = cards.length;
  const totalValue = cards.reduce((sum, card) => sum + (card.current_value || card.purchase_price || 0), 0);
  const totalCost = cards.reduce((sum, card) => sum + (card.purchase_price || 0), 0);
  
  const byCategory: Record<string, number> = {};
  const byCondition: Record<string, number> = {};
  
  cards.forEach(card => {
    byCategory[card.category] = (byCategory[card.category] || 0) + 1;
    byCondition[card.condition] = (byCondition[card.condition] || 0) + 1;
  });

  return {
    totalCards,
    totalValue,
    totalCost,
    profit: totalValue - totalCost,
    byCategory,
    byCondition,
    gradedCount: cards.filter(c => c.grade).length,
    forSaleCount: cards.filter(c => c.is_for_sale).length,
    forTradeCount: cards.filter(c => c.is_for_trade).length,
  };
}
