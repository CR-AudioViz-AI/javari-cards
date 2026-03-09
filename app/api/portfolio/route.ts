export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// PORTFOLIO VALUE TRACKER API
// Historical collection value tracking with charts data
// CravCards - CR AudioViz AI, LLC
// Created: December 17, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lazy Supabase client — initialized on first request (not at module load time)
let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kteobfyferrukqeolofj.supabase.co";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW9iZnlmZXJydWtxZW9sb2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NzUwNjUsImV4cCI6MjA1NTE1MTA2NX0.r3_3bXtqo6VCJqYHijtxdEpXkWyNVGKd67kNQvqkrD4";
    _supabase = createClient(url, key);
  }
  return _supabase!;
}
const supabase = getSupabase();
interface PortfolioSnapshot {
  date: string;
  total_value: number;
  card_count: number;
  top_gainer: string | null;
  top_loser: string | null;
  daily_change: number;
  daily_change_percent: number;
}

interface PortfolioSummary {
  current_value: number;
  previous_value: number;
  all_time_high: number;
  all_time_low: number;
  total_invested: number;
  total_profit: number;
  profit_percent: number;
  card_count: number;
  unique_sets: number;
  categories: Record<string, number>;
}

// GET - Retrieve portfolio history and summary
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y, all
  const action = searchParams.get('action') || 'summary';

  if (!userId) {
    return NextResponse.json({
      success: false,
      error: 'User ID required',
    }, { status: 400 });
  }

  try {
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date('2020-01-01');
    }

    if (action === 'history') {
      // Get portfolio snapshots for chart
      const { data: snapshots, error } = await supabase
        .from('cv_portfolio_snapshots')
        .select('*')
        .eq('user_id', userId)
        .gte('snapshot_date', startDate.toISOString())
        .order('snapshot_date', { ascending: true });

      if (error) throw error;

      // If no snapshots, generate sample data based on collection
      if (!snapshots || snapshots.length === 0) {
        const generatedHistory = await generatePortfolioHistory(userId, startDate);
        return NextResponse.json({
          success: true,
          history: generatedHistory,
          period,
          generated: true,
        });
      }

      return NextResponse.json({
        success: true,
        history: snapshots,
        period,
        generated: false,
      });
    }

    // Default: Get portfolio summary
    const summary = await getPortfolioSummary(userId);

    return NextResponse.json({
      success: true,
      summary,
      period,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 });
  }
}

// POST - Record a portfolio snapshot (called daily by cron or on demand)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, force } = body;

    if (!user_id) {
      return NextResponse.json({
        success: false,
        error: 'User ID required',
      }, { status: 400 });
    }

    // Check if snapshot already exists for today
    const today = new Date().toISOString().split('T')[0];
    
    if (!force) {
      const { data: existing } = await supabase
        .from('cv_portfolio_snapshots')
        .select('id')
        .eq('user_id', user_id)
        .eq('snapshot_date', today)
        .single();

      if (existing) {
        return NextResponse.json({
          success: true,
          message: 'Snapshot already exists for today',
          skipped: true,
        });
      }
    }

    // Calculate current portfolio value
    const { data: cards, error: cardsError } = await supabase
      .from('cv_user_cards')
      .select('card_id, card_name, category, current_value, purchase_price')
      .eq('user_id', user_id);

    if (cardsError) throw cardsError;

    const totalValue = cards?.reduce((sum, card) => sum + (card.current_value || 0), 0) || 0;
    const cardCount = cards?.length || 0;

    // Get yesterday's snapshot for comparison
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const { data: prevSnapshot } = await supabase
      .from('cv_portfolio_snapshots')
      .select('total_value')
      .eq('user_id', user_id)
      .lt('snapshot_date', today)
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .single();

    const prevValue = prevSnapshot?.total_value || totalValue;
    const dailyChange = totalValue - prevValue;
    const dailyChangePercent = prevValue > 0 ? (dailyChange / prevValue) * 100 : 0;

    // Find top gainer and loser (would need price history table)
    // For now, we'll leave these null
    const topGainer = null;
    const topLoser = null;

    // Insert snapshot
    const { data: snapshot, error: insertError } = await supabase
      .from('cv_portfolio_snapshots')
      .upsert({
        user_id,
        snapshot_date: today,
        total_value: totalValue,
        card_count: cardCount,
        top_gainer: topGainer,
        top_loser: topLoser,
        daily_change: dailyChange,
        daily_change_percent: dailyChangePercent,
      }, { onConflict: 'user_id,snapshot_date' })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      snapshot,
      message: 'Portfolio snapshot recorded',
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 });
  }
}

// Helper: Generate portfolio history based on collection
async function generatePortfolioHistory(userId: string, startDate: Date): Promise<PortfolioSnapshot[]> {
  // Get user's current collection
  const { data: cards } = await supabase
    .from('cv_user_cards')
    .select('current_value, created_at')
    .eq('user_id', userId);

  const currentValue = cards?.reduce((sum, card) => sum + (card.current_value || 0), 0) || 0;
  const cardCount = cards?.length || 0;

  // Generate synthetic history (with realistic market variance)
  const history: PortfolioSnapshot[] = [];
  const days = Math.ceil((Date.now() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  
  let value = currentValue * 0.85; // Start at 85% of current value
  
  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    // Random daily variance (-3% to +4%)
    const variance = (Math.random() * 7 - 3) / 100;
    const prevValue = value;
    value = value * (1 + variance);
    
    // Trend towards current value
    const daysRemaining = days - i;
    if (daysRemaining > 0 && daysRemaining < 10) {
      value = value + (currentValue - value) * (0.1 * (10 - daysRemaining));
    }

    const dailyChange = value - prevValue;
    const dailyChangePercent = prevValue > 0 ? (dailyChange / prevValue) * 100 : 0;

    history.push({
      date: dateStr,
      total_value: Math.round(value * 100) / 100,
      card_count: cardCount,
      top_gainer: null,
      top_loser: null,
      daily_change: Math.round(dailyChange * 100) / 100,
      daily_change_percent: Math.round(dailyChangePercent * 100) / 100,
    });
  }

  return history;
}

// Helper: Get portfolio summary
async function getPortfolioSummary(userId: string): Promise<PortfolioSummary> {
  // Get user's cards
  const { data: cards } = await supabase
    .from('cv_user_cards')
    .select('card_id, card_name, category, set_name, current_value, purchase_price')
    .eq('user_id', userId);

  const currentValue = cards?.reduce((sum, card) => sum + (card.current_value || 0), 0) || 0;
  const totalInvested = cards?.reduce((sum, card) => sum + (card.purchase_price || 0), 0) || 0;
  const cardCount = cards?.length || 0;

  // Get unique sets
  const uniqueSets = new Set(cards?.map(c => c.set_name).filter(Boolean)).size;

  // Get category breakdown
  const categories: Record<string, number> = {};
  cards?.forEach(card => {
    const cat = card.category || 'other';
    categories[cat] = (categories[cat] || 0) + (card.current_value || 0);
  });

  // Get historical data for ATH/ATL
  const { data: snapshots } = await supabase
    .from('cv_portfolio_snapshots')
    .select('total_value')
    .eq('user_id', userId)
    .order('total_value', { ascending: false });

  const allTimeHigh = snapshots?.[0]?.total_value || currentValue;
  const allTimeLow = snapshots?.[snapshots.length - 1]?.total_value || currentValue;

  // Get previous value (yesterday or most recent)
  const { data: prevSnapshot } = await supabase
    .from('cv_portfolio_snapshots')
    .select('total_value')
    .eq('user_id', userId)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single();

  const previousValue = prevSnapshot?.total_value || currentValue;
  const totalProfit = currentValue - totalInvested;
  const profitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  return {
    current_value: currentValue,
    previous_value: previousValue,
    all_time_high: allTimeHigh,
    all_time_low: allTimeLow,
    total_invested: totalInvested,
    total_profit: totalProfit,
    profit_percent: Math.round(profitPercent * 100) / 100,
    card_count: cardCount,
    unique_sets: uniqueSets,
    categories,
  };
}
