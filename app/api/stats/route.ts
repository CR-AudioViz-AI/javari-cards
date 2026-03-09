export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// COLLECTION STATISTICS & ANALYTICS API
// Portfolio value, category breakdown, growth tracking
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

// Lazy Supabase client — initialized on first request (not at module load time)
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;
function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kteobfyferrukqeolofj.supabase.co";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW9iZnlmZXJydWtxZW9sb2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NzUwNjUsImV4cCI6MjA1NTE1MTA2NX0.r3_3bXtqo6VCJqYHijtxdEpXkWyNVGKd67kNQvqkrD4";
    _supabaseAdmin = createClient(url, key);
  }
  return _supabaseAdmin!;
}
const supabaseAdmin = getSupabaseAdmin();
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Please sign in to view statistics',
      }, { status: 401 });
    }

    // Get all user's cards
    const { data: collection, error } = await supabaseAdmin
      .from('cv_collections')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    const cards = collection || [];

    // Calculate statistics
    const stats = {
      totalCards: cards.length,
      totalValue: {
        estimated: 0,
        purchase: 0,
        profit: 0,
      },
      byCategory: {} as Record<string, { count: number; value: number }>,
      byCondition: {} as Record<string, number>,
      byRarity: {} as Record<string, number>,
      graded: {
        count: 0,
        byCompany: {} as Record<string, number>,
        byGrade: {} as Record<string, number>,
      },
      recentAdditions: [] as any[],
      topValueCards: [] as any[],
    };

    for (const card of cards) {
      // Total values
      const marketPrice = card.market_price || 0;
      const purchasePrice = card.purchase_price || 0;
      stats.totalValue.estimated += marketPrice;
      stats.totalValue.purchase += purchasePrice;

      // By category
      const category = card.category || 'uncategorized';
      if (!stats.byCategory[category]) {
        stats.byCategory[category] = { count: 0, value: 0 };
      }
      stats.byCategory[category].count++;
      stats.byCategory[category].value += marketPrice;

      // By condition
      const condition = card.condition || 'unknown';
      stats.byCondition[condition] = (stats.byCondition[condition] || 0) + 1;

      // By rarity
      const rarity = card.rarity || 'unknown';
      stats.byRarity[rarity] = (stats.byRarity[rarity] || 0) + 1;

      // Graded cards
      if (card.is_graded) {
        stats.graded.count++;
        const company = card.grading_company || 'unknown';
        const grade = card.grade || 'unknown';
        stats.graded.byCompany[company] = (stats.graded.byCompany[company] || 0) + 1;
        stats.graded.byGrade[grade] = (stats.graded.byGrade[grade] || 0) + 1;
      }
    }

    // Calculate profit
    stats.totalValue.profit = stats.totalValue.estimated - stats.totalValue.purchase;

    // Recent additions (last 10)
    stats.recentAdditions = [...cards]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map(c => ({
        id: c.id,
        name: c.card_name,
        category: c.category,
        image_url: c.image_url,
        added: c.created_at,
      }));

    // Top value cards
    stats.topValueCards = [...cards]
      .filter(c => c.market_price > 0)
      .sort((a, b) => (b.market_price || 0) - (a.market_price || 0))
      .slice(0, 10)
      .map(c => ({
        id: c.id,
        name: c.card_name,
        category: c.category,
        image_url: c.image_url,
        value: c.market_price,
        grade: c.is_graded ? `${c.grading_company} ${c.grade}` : 'Raw',
      }));

    // Round values
    stats.totalValue.estimated = Math.round(stats.totalValue.estimated * 100) / 100;
    stats.totalValue.purchase = Math.round(stats.totalValue.purchase * 100) / 100;
    stats.totalValue.profit = Math.round(stats.totalValue.profit * 100) / 100;

    return NextResponse.json({
      success: true,
      stats,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
