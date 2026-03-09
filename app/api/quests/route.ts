export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// IMAGE QUESTS API - Gamified Card Image Collection
// CravCards - CR AudioViz AI, LLC
// Updated: December 22, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase with fallbacks
function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.error('Supabase credentials missing:', { url: !!url, key: !!key });
    return null;
  }
  
  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'list';
  const questId = searchParams.get('id');
  const cardSource = searchParams.get('source');
  const status = searchParams.get('status') || 'open';
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');

  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured',
        debug: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        }
      }, { status: 500 });
    }

    // Get specific quest
    if (action === 'get' && questId) {
      const { data, error } = await supabase
        .from('cv_image_quests')
        .select('*')
        .eq('id', questId)
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, quest: data });
    }

    // Get quest stats
    if (action === 'stats') {
      const { count: openCount } = await supabase
        .from('cv_image_quests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'open');

      const { count: completedCount } = await supabase
        .from('cv_image_quests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'verified');

      const { data: xpData } = await supabase
        .from('cv_image_quests')
        .select('reward_xp')
        .eq('status', 'open');

      const availableXp = xpData?.reduce((sum, q) => sum + (q.reward_xp || 0), 0) || 0;

      return NextResponse.json({
        success: true,
        stats: {
          openQuests: openCount || 0,
          completedQuests: completedCount || 0,
          availableXp,
        },
      });
    }

    // List available quests
    if (action === 'list') {
      let query = supabase
        .from('cv_image_quests')
        .select('*', { count: 'exact' })
        .eq('status', status)
        .order('priority', { ascending: false })
        .order('reward_xp', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (cardSource) {
        query = query.eq('card_source', cardSource);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return NextResponse.json({
        success: true,
        quests: data || [],
        totalCount: count || 0,
        page,
        pageSize: limit,
      });
    }

    // Get featured quests
    if (action === 'featured') {
      const { data, error } = await supabase
        .from('cv_image_quests')
        .select('*')
        .eq('status', 'open')
        .gte('priority', 5)
        .order('priority', { ascending: false })
        .limit(10);

      if (error) throw error;

      return NextResponse.json({ success: true, quests: data || [] });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Quests API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch quests',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured',
      }, { status: 500 });
    }

    const body = await request.json();

    // Claim a quest
    if (action === 'claim') {
      const { questId, userId } = body;

      if (!questId || !userId) {
        return NextResponse.json({
          success: false,
          error: 'Quest ID and User ID required',
        }, { status: 400 });
      }

      const { data: quest, error: fetchError } = await supabase
        .from('cv_image_quests')
        .select('*')
        .eq('id', questId)
        .eq('status', 'open')
        .single();

      if (fetchError || !quest) {
        return NextResponse.json({
          success: false,
          error: 'Quest not available',
        }, { status: 404 });
      }

      const { data, error } = await supabase
        .from('cv_image_quests')
        .update({
          status: 'claimed',
          claimed_by: userId,
          claimed_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', questId)
        .eq('status', 'open')
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        quest: data,
        message: 'Quest claimed! You have 24 hours to submit an image.',
      });
    }

    // Create new quest (admin)
    if (action === 'create') {
      const { card_id, card_name, card_source, set_name, rarity, reward_xp, reward_credits, priority } = body;

      const { data, error } = await supabase
        .from('cv_image_quests')
        .insert({
          card_id,
          card_name,
          card_source,
          set_name,
          rarity: rarity || 'common',
          reward_xp: reward_xp || 10,
          reward_credits: reward_credits || 5,
          priority: priority || 0,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, quest: data });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Quests API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process quest action',
    }, { status: 500 });
  }
}
