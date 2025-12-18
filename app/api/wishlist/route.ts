// ============================================================================
// WISHLIST API
// Track cards users want to acquire
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch user's wishlist
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Please sign in to view your wishlist',
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');

    let query = supabaseAdmin
      .from('cv_wishlist')
      .select('*')
      .eq('user_id', user.id)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (category) query = query.eq('category', category);
    if (priority) query = query.eq('priority', priority);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      wishlist: data || [],
      count: data?.length || 0,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// POST - Add card to wishlist
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Please sign in to add to wishlist',
      }, { status: 401 });
    }

    const body = await request.json();
    const {
      card_id,
      card_name,
      category,
      set_name,
      image_url,
      target_price,
      priority = 'medium',
      notes,
    } = body;

    if (!card_name) {
      return NextResponse.json({
        success: false,
        error: 'card_name is required',
      }, { status: 400 });
    }

    // Check if already in wishlist
    const { data: existing } = await supabaseAdmin
      .from('cv_wishlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('card_id', card_id)
      .single();

    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'Card already in wishlist',
      }, { status: 409 });
    }

    const { data, error } = await supabaseAdmin
      .from('cv_wishlist')
      .insert({
        user_id: user.id,
        card_id,
        card_name,
        category,
        set_name,
        image_url,
        target_price,
        priority,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      item: data,
      message: `${card_name} added to wishlist`,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// DELETE - Remove from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Please sign in',
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'id is required',
      }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('cv_wishlist')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Removed from wishlist',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// PATCH - Update wishlist item (priority, target price, notes)
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Please sign in',
      }, { status: 401 });
    }

    const body = await request.json();
    const { id, target_price, priority, notes } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'id is required',
      }, { status: 400 });
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (target_price !== undefined) updates.target_price = target_price;
    if (priority !== undefined) updates.priority = priority;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabaseAdmin
      .from('cv_wishlist')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      item: data,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
