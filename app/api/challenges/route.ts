// ============================================================================
// DAILY CHALLENGES API - Gamification System
// CravCards - CR AudioViz AI, LLC
// Updated: December 22, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.error('Supabase credentials missing');
    return null;
  }
  
  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'today';
  const userId = searchParams.get('userId');

  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured',
      }, { status: 500 });
    }

    // Get today's challenges
    if (action === 'today') {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: challenges, error } = await supabase
        .from('cv_daily_challenges')
        .select('*')
        .eq('challenge_date', today)
        .eq('active', true)
        .order('reward_xp', { ascending: false });

      if (error) throw error;

      // If user is provided, get their progress
      let progress: Record<string, any> = {};
      if (userId && challenges && challenges.length > 0) {
        const { data: userProgress } = await supabase
          .from('cv_user_challenge_progress')
          .select('*')
          .eq('user_id', userId)
          .in('challenge_id', challenges.map(c => c.id));

        if (userProgress) {
          progress = userProgress.reduce((acc, p) => {
            acc[p.challenge_id] = p;
            return acc;
          }, {} as Record<string, any>);
        }
      }

      const challengesWithProgress = (challenges || []).map(c => ({
        ...c,
        progress: progress[c.id] || { current_count: 0, completed: false, reward_claimed: false },
      }));

      return NextResponse.json({
        success: true,
        date: today,
        challenges: challengesWithProgress,
        totalXp: challengesWithProgress.reduce((sum, c) => sum + (c.progress.completed ? 0 : c.reward_xp), 0),
      });
    }

    // Get user's challenge history
    if (action === 'history' && userId) {
      const { data, error } = await supabase
        .from('cv_user_challenge_progress')
        .select(`*, challenge:cv_daily_challenges(*)`)
        .eq('user_id', userId)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return NextResponse.json({ success: true, history: data || [] });
    }

    // Get challenge leaderboard
    if (action === 'leaderboard') {
      const { data, error } = await supabase
        .from('cv_user_stats')
        .select('user_id, total_xp, level, streak_days')
        .order('total_xp', { ascending: false })
        .limit(100);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        leaderboard: data?.map((user, index) => ({ rank: index + 1, ...user })) || [],
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Challenges API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch challenges',
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

    // Update challenge progress
    if (action === 'progress') {
      const { userId, challengeId, increment = 1 } = body;

      if (!userId || !challengeId) {
        return NextResponse.json({
          success: false,
          error: 'User ID and Challenge ID required',
        }, { status: 400 });
      }

      const { data: challenge } = await supabase
        .from('cv_daily_challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (!challenge) {
        return NextResponse.json({
          success: false,
          error: 'Challenge not found',
        }, { status: 404 });
      }

      const { data: existing } = await supabase
        .from('cv_user_challenge_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('challenge_id', challengeId)
        .single();

      if (existing?.completed) {
        return NextResponse.json({
          success: true,
          progress: existing,
          message: 'Challenge already completed',
        });
      }

      const newCount = (existing?.current_count || 0) + increment;
      const completed = newCount >= challenge.target_count;

      const { data, error } = await supabase
        .from('cv_user_challenge_progress')
        .upsert({
          user_id: userId,
          challenge_id: challengeId,
          current_count: newCount,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        progress: data,
        completed,
        reward: completed ? { xp: challenge.reward_xp, credits: challenge.reward_credits } : null,
      });
    }

    // Create new challenge (admin)
    if (action === 'create') {
      const { challenge_date, challenge_type, title, description, target_count, reward_xp, reward_credits } = body;

      const { data, error } = await supabase
        .from('cv_daily_challenges')
        .insert({
          challenge_date: challenge_date || new Date().toISOString().split('T')[0],
          challenge_type,
          title,
          description,
          target_count: target_count || 1,
          reward_xp: reward_xp || 50,
          reward_credits: reward_credits || 25,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, challenge: data });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Challenges API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process challenge action',
    }, { status: 500 });
  }
}
