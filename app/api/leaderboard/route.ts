// ============================================================================
// LEADERBOARD API - User Rankings & Stats
// CravCards - CR AudioViz AI, LLC
// Created: December 22, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// XP required for each level
function getXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

function getLevelFromXp(xp: number): number {
  let level = 1;
  let requiredXp = 100;
  while (xp >= requiredXp) {
    level++;
    requiredXp += getXpForLevel(level);
  }
  return level;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'global';
  const userId = searchParams.get('userId');
  const timeframe = searchParams.get('timeframe') || 'all'; // 'day', 'week', 'month', 'all'
  const category = searchParams.get('category'); // 'xp', 'cards', 'quests', 'streak'
  const limit = parseInt(searchParams.get('limit') || '100');

  try {
    // Get global leaderboard
    if (action === 'global') {
      let orderColumn = 'total_xp';
      if (category === 'cards') orderColumn = 'cards_collected';
      if (category === 'quests') orderColumn = 'quests_completed';
      if (category === 'streak') orderColumn = 'streak_days';

      const { data, error } = await supabase
        .from('cv_user_stats')
        .select('*')
        .order(orderColumn, { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Add rank and level info
      const leaderboard = (data || []).map((user, index) => ({
        rank: index + 1,
        ...user,
        level: getLevelFromXp(user.total_xp),
        nextLevelXp: getXpForLevel(getLevelFromXp(user.total_xp) + 1),
      }));

      return NextResponse.json({
        success: true,
        leaderboard,
        category: category || 'xp',
        timeframe,
      });
    }

    // Get user's rank and stats
    if (action === 'user' && userId) {
      // Get user stats
      const { data: userStats, error: userError } = await supabase
        .from('cv_user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (userError && userError.code !== 'PGRST116') throw userError;

      // If no stats exist, return default
      if (!userStats) {
        return NextResponse.json({
          success: true,
          user: {
            user_id: userId,
            total_xp: 0,
            level: 1,
            rank: null,
            cards_collected: 0,
            quests_completed: 0,
            streak_days: 0,
          },
        });
      }

      // Get user's rank
      const { count: higherXpCount } = await supabase
        .from('cv_user_stats')
        .select('id', { count: 'exact', head: true })
        .gt('total_xp', userStats.total_xp);

      const rank = (higherXpCount || 0) + 1;
      const level = getLevelFromXp(userStats.total_xp);

      return NextResponse.json({
        success: true,
        user: {
          ...userStats,
          rank,
          level,
          currentLevelXp: userStats.total_xp - (level > 1 ? getXpForLevel(level) : 0),
          nextLevelXp: getXpForLevel(level + 1),
          progressPercent: Math.floor(((userStats.total_xp % getXpForLevel(level + 1)) / getXpForLevel(level + 1)) * 100),
        },
      });
    }

    // Get nearby users (users with similar rank)
    if (action === 'nearby' && userId) {
      const { data: userStats } = await supabase
        .from('cv_user_stats')
        .select('total_xp')
        .eq('user_id', userId)
        .single();

      if (!userStats) {
        return NextResponse.json({
          success: true,
          nearby: [],
        });
      }

      // Get 5 above and 5 below
      const { data: above } = await supabase
        .from('cv_user_stats')
        .select('*')
        .gt('total_xp', userStats.total_xp)
        .order('total_xp', { ascending: true })
        .limit(5);

      const { data: below } = await supabase
        .from('cv_user_stats')
        .select('*')
        .lt('total_xp', userStats.total_xp)
        .order('total_xp', { ascending: false })
        .limit(5);

      const { data: self } = await supabase
        .from('cv_user_stats')
        .select('*')
        .eq('user_id', userId);

      // Combine and sort
      const nearby = [
        ...(above || []).reverse(),
        ...(self || []),
        ...(below || []),
      ];

      // Add ranks
      const { count: totalAbove } = await supabase
        .from('cv_user_stats')
        .select('id', { count: 'exact', head: true })
        .gt('total_xp', nearby[0]?.total_xp || 0);

      const startRank = (totalAbove || 0) + 1;

      return NextResponse.json({
        success: true,
        nearby: nearby.map((user, index) => ({
          rank: startRank + index,
          ...user,
          level: getLevelFromXp(user.total_xp),
          isCurrentUser: user.user_id === userId,
        })),
      });
    }

    // Get top collectors by card type
    if (action === 'by-category') {
      const cardSource = searchParams.get('source');

      // This would require a more complex query with card counting by source
      // For now, return general leaderboard
      const { data, error } = await supabase
        .from('cv_user_stats')
        .select('*')
        .order('cards_collected', { ascending: false })
        .limit(50);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        leaderboard: data?.map((user, index) => ({
          rank: index + 1,
          ...user,
        })),
        category: cardSource || 'all',
      });
    }

    // Get achievement leaders
    if (action === 'achievements') {
      const { data, error } = await supabase
        .from('cv_user_achievements')
        .select('user_id')
        .order('earned_at', { ascending: false });

      if (error) throw error;

      // Count achievements per user
      const achievementCounts: Record<string, number> = {};
      (data || []).forEach(a => {
        achievementCounts[a.user_id] = (achievementCounts[a.user_id] || 0) + 1;
      });

      const leaderboard = Object.entries(achievementCounts)
        .map(([user_id, count]) => ({ user_id, achievement_count: count }))
        .sort((a, b) => b.achievement_count - a.achievement_count)
        .slice(0, limit)
        .map((user, index) => ({ rank: index + 1, ...user }));

      return NextResponse.json({
        success: true,
        leaderboard,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
    }, { status: 400 });

  } catch (error) {
    console.error('Leaderboard API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch leaderboard',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    const body = await request.json();

    // Initialize or update user stats
    if (action === 'update') {
      const { userId, xp, cards, quests, images, trivia_correct, trivia_played } = body;

      if (!userId) {
        return NextResponse.json({
          success: false,
          error: 'User ID required',
        }, { status: 400 });
      }

      // Get current stats
      const { data: existing } = await supabase
        .from('cv_user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Calculate streak
      const lastActivity = existing?.last_activity_at ? new Date(existing.last_activity_at) : null;
      const now = new Date();
      const daysSinceLastActivity = lastActivity 
        ? Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      let newStreakDays = existing?.streak_days || 0;
      let newLongestStreak = existing?.longest_streak || 0;

      if (daysSinceLastActivity === 1) {
        newStreakDays = (existing?.streak_days || 0) + 1;
        newLongestStreak = Math.max(newStreakDays, existing?.longest_streak || 0);
      } else if (daysSinceLastActivity > 1) {
        newStreakDays = 1;
      }

      const updates = {
        user_id: userId,
        total_xp: (existing?.total_xp || 0) + (xp || 0),
        cards_collected: (existing?.cards_collected || 0) + (cards || 0),
        quests_completed: (existing?.quests_completed || 0) + (quests || 0),
        images_submitted: (existing?.images_submitted || 0) + (images || 0),
        trivia_correct: (existing?.trivia_correct || 0) + (trivia_correct || 0),
        trivia_played: (existing?.trivia_played || 0) + (trivia_played || 0),
        streak_days: newStreakDays,
        longest_streak: newLongestStreak,
        last_activity_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('cv_user_stats')
        .upsert(updates)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        stats: {
          ...data,
          level: getLevelFromXp(data.total_xp),
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
    }, { status: 400 });

  } catch (error) {
    console.error('Leaderboard API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update stats',
    }, { status: 500 });
  }
}
