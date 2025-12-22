// ============================================================================
// DAILY CHALLENGES API - Gamification System
// CravCards - CR AudioViz AI, LLC
// Created: December 22, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'today';
  const userId = searchParams.get('userId');

  try {
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
      if (userId) {
        const { data: userProgress } = await supabase
          .from('cv_user_challenge_progress')
          .select('*')
          .eq('user_id', userId)
          .in('challenge_id', (challenges || []).map(c => c.id));

        if (userProgress) {
          progress = userProgress.reduce((acc, p) => {
            acc[p.challenge_id] = p;
            return acc;
          }, {} as Record<string, any>);
        }
      }

      // Merge challenges with progress
      const challengesWithProgress = (challenges || []).map(c => ({
        ...c,
        progress: progress[c.id] || { current_count: 0, completed: false, reward_claimed: false },
      }));

      return NextResponse.json({
        success: true,
        date: today,
        challenges: challengesWithProgress,
        totalXp: challengesWithProgress.reduce((sum, c) => sum + (c.completed ? 0 : c.reward_xp), 0),
      });
    }

    // Get user's challenge history
    if (action === 'history' && userId) {
      const { data, error } = await supabase
        .from('cv_user_challenge_progress')
        .select(`
          *,
          challenge:cv_daily_challenges(*)
        `)
        .eq('user_id', userId)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        history: data,
      });
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
        leaderboard: data?.map((user, index) => ({
          rank: index + 1,
          ...user,
        })),
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
    }, { status: 400 });

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

      // Get challenge details
      const { data: challenge, error: challengeError } = await supabase
        .from('cv_daily_challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (challengeError || !challenge) {
        return NextResponse.json({
          success: false,
          error: 'Challenge not found',
        }, { status: 404 });
      }

      // Get or create progress record
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

      // If just completed, award XP
      if (completed && !existing?.completed) {
        await supabase.rpc('increment_user_xp', {
          p_user_id: userId,
          p_xp: challenge.reward_xp,
        });
      }

      return NextResponse.json({
        success: true,
        progress: data,
        completed,
        reward: completed ? {
          xp: challenge.reward_xp,
          credits: challenge.reward_credits,
        } : null,
      });
    }

    // Claim reward
    if (action === 'claim') {
      const { userId, challengeId } = body;

      const { data, error } = await supabase
        .from('cv_user_challenge_progress')
        .update({ reward_claimed: true })
        .eq('user_id', userId)
        .eq('challenge_id', challengeId)
        .eq('completed', true)
        .eq('reward_claimed', false)
        .select()
        .single();

      if (error) {
        return NextResponse.json({
          success: false,
          error: 'Cannot claim reward',
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        progress: data,
        message: 'Reward claimed!',
      });
    }

    // Create new challenge (admin)
    if (action === 'create') {
      const { challenge_date, challenge_type, title, description, target_count, reward_xp, reward_credits, card_source } = body;

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
          card_source,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        challenge: data,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
    }, { status: 400 });

  } catch (error) {
    console.error('Challenges API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process challenge action',
    }, { status: 500 });
  }
}
