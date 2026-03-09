export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// SET COMPLETION TRACKER API
// Visual progress tracking for completing card sets
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
interface SetProgress {
  set_id: string;
  set_name: string;
  category: string;
  total_cards: number;
  owned_cards: number;
  completion_percent: number;
  missing_cards: string[];
  owned_value: number;
  set_value: number;
  rarity_breakdown: Record<string, { owned: number; total: number }>;
  last_card_added: string | null;
  estimated_completion_cost: number;
}

// GET - Get set completion progress
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const setId = searchParams.get('set_id');
  const category = searchParams.get('category');
  const action = searchParams.get('action') || 'progress';

  if (!userId) {
    return NextResponse.json({
      success: false,
      error: 'User ID required',
    }, { status: 400 });
  }

  try {
    if (action === 'available') {
      // Get all available sets to track
      return await getAvailableSets(category);
    }

    if (setId) {
      // Get progress for specific set
      return await getSetProgress(userId, setId);
    }

    // Get all tracked sets progress
    return await getAllSetsProgress(userId, category);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 });
  }
}

// POST - Start tracking a set or update progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, set_id, action } = body;

    if (!user_id || !set_id) {
      return NextResponse.json({
        success: false,
        error: 'User ID and Set ID required',
      }, { status: 400 });
    }

    if (action === 'untrack') {
      // Stop tracking this set
      const { error } = await supabase
        .from('cv_set_tracking')
        .delete()
        .eq('user_id', user_id)
        .eq('set_id', set_id);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: 'Set tracking removed',
      });
    }

    // Start tracking or update
    const { data, error } = await supabase
      .from('cv_set_tracking')
      .upsert({
        user_id,
        set_id,
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,set_id' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      tracking: data,
      message: 'Now tracking set completion',
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 });
  }
}

// Get available sets to track
async function getAvailableSets(category: string | null) {
  // Sample set data - in production would come from database
  const allSets = [
    // Pokemon Sets
    { id: 'sv-151', name: 'Pokemon 151', category: 'pokemon', total: 165, release: '2023-09-22', image: null },
    { id: 'sv-paldea', name: 'Paldea Evolved', category: 'pokemon', total: 279, release: '2023-06-09', image: null },
    { id: 'sv-obsidian', name: 'Obsidian Flames', category: 'pokemon', total: 230, release: '2023-08-11', image: null },
    { id: 'swsh-brilliant', name: 'Brilliant Stars', category: 'pokemon', total: 216, release: '2022-02-25', image: null },
    { id: 'swsh-evolving', name: 'Evolving Skies', category: 'pokemon', total: 237, release: '2021-08-27', image: null },
    // MTG Sets
    { id: 'mtg-mh3', name: 'Modern Horizons 3', category: 'mtg', total: 303, release: '2024-06-14', image: null },
    { id: 'mtg-otj', name: 'Outlaws of Thunder Junction', category: 'mtg', total: 286, release: '2024-04-19', image: null },
    { id: 'mtg-mkm', name: 'Murders at Karlov Manor', category: 'mtg', total: 286, release: '2024-02-09', image: null },
    { id: 'mtg-lci', name: 'Lost Caverns of Ixalan', category: 'mtg', total: 291, release: '2023-11-17', image: null },
    // Yu-Gi-Oh Sets
    { id: 'ygo-phni', name: 'Phantom Nightmare', category: 'yugioh', total: 100, release: '2024-02-09', image: null },
    { id: 'ygo-agov', name: 'Age of Overlord', category: 'yugioh', total: 100, release: '2023-10-20', image: null },
    { id: 'ygo-dune', name: 'Duelist Nexus', category: 'yugioh', total: 100, release: '2023-07-28', image: null },
    // Sports Sets
    { id: 'topps-2024', name: '2024 Topps Series 1', category: 'sports', total: 330, release: '2024-02-14', image: null },
    { id: 'panini-prizm-24', name: '2023-24 Prizm Basketball', category: 'sports', total: 400, release: '2024-01-17', image: null },
    { id: 'panini-select-24', name: '2023-24 Select Basketball', category: 'sports', total: 250, release: '2024-03-06', image: null },
  ];

  const sets = category 
    ? allSets.filter(s => s.category === category)
    : allSets;

  return NextResponse.json({
    success: true,
    sets,
    total: sets.length,
    categories: ['pokemon', 'mtg', 'yugioh', 'sports'],
  });
}

// Get progress for a specific set
async function getSetProgress(userId: string, setId: string): Promise<NextResponse> {
  // Get user's cards from this set
  const { data: userCards, error: cardsError } = await supabase
    .from('cv_user_cards')
    .select('card_id, card_name, card_number, rarity, current_value')
    .eq('user_id', userId)
    .eq('set_id', setId);

  if (cardsError) throw cardsError;

  // Get set info (in production from cv_sets table)
  const setInfo = await getSetInfo(setId);
  
  const ownedCount = userCards?.length || 0;
  const completionPercent = setInfo.total > 0 
    ? Math.round((ownedCount / setInfo.total) * 10000) / 100 
    : 0;

  // Calculate rarity breakdown
  const rarityBreakdown: Record<string, { owned: number; total: number }> = {};
  for (const rarity of ['common', 'uncommon', 'rare', 'holo', 'ultra_rare', 'secret_rare']) {
    const ownedOfRarity = userCards?.filter(c => c.rarity === rarity).length || 0;
    const totalOfRarity = Math.floor(setInfo.total * getRarityDistribution(rarity));
    rarityBreakdown[rarity] = { owned: ownedOfRarity, total: totalOfRarity };
  }

  // Calculate values
  const ownedValue = userCards?.reduce((sum, c) => sum + (c.current_value || 0), 0) || 0;
  const avgCardValue = ownedValue / Math.max(ownedCount, 1);
  const estimatedSetValue = avgCardValue * setInfo.total;
  const estimatedCompletionCost = (setInfo.total - ownedCount) * avgCardValue;

  // Get missing card numbers (simplified)
  const ownedNumbers = new Set(userCards?.map(c => c.card_number));
  const missingCards: string[] = [];
  for (let i = 1; i <= setInfo.total && missingCards.length < 20; i++) {
    if (!ownedNumbers.has(String(i))) {
      missingCards.push(`#${i}`);
    }
  }

  const progress: SetProgress = {
    set_id: setId,
    set_name: setInfo.name,
    category: setInfo.category,
    total_cards: setInfo.total,
    owned_cards: ownedCount,
    completion_percent: completionPercent,
    missing_cards: missingCards,
    owned_value: Math.round(ownedValue * 100) / 100,
    set_value: Math.round(estimatedSetValue * 100) / 100,
    rarity_breakdown: rarityBreakdown,
    last_card_added: userCards?.[0]?.card_name || null,
    estimated_completion_cost: Math.round(estimatedCompletionCost * 100) / 100,
  };

  return NextResponse.json({
    success: true,
    progress,
    cards: userCards,
  });
}

// Get all tracked sets progress
async function getAllSetsProgress(userId: string, category: string | null): Promise<NextResponse> {
  // Get tracked sets
  const { data: tracked, error: trackError } = await supabase
    .from('cv_set_tracking')
    .select('set_id')
    .eq('user_id', userId);

  // If no tracked sets table or no tracked sets, show progress for sets user has cards from
  const { data: userCards, error: cardsError } = await supabase
    .from('cv_user_cards')
    .select('set_id, set_name, category, card_id, current_value')
    .eq('user_id', userId);

  if (cardsError) throw cardsError;

  // Group cards by set
  const setMap = new Map<string, { cards: typeof userCards; name: string; category: string }>();
  userCards?.forEach(card => {
    if (!card.set_id) return;
    if (category && card.category !== category) return;
    
    if (!setMap.has(card.set_id)) {
      setMap.set(card.set_id, { cards: [], name: card.set_name || card.set_id, category: card.category || 'other' });
    }
    setMap.get(card.set_id)!.cards.push(card);
  });

  const progressList: SetProgress[] = [];
  
  for (const [setId, data] of setMap) {
    const setInfo = await getSetInfo(setId);
    const ownedCount = data.cards.length;
    const ownedValue = data.cards.reduce((sum, c) => sum + (c.current_value || 0), 0);
    
    progressList.push({
      set_id: setId,
      set_name: data.name,
      category: data.category,
      total_cards: setInfo.total,
      owned_cards: ownedCount,
      completion_percent: setInfo.total > 0 ? Math.round((ownedCount / setInfo.total) * 10000) / 100 : 0,
      missing_cards: [],
      owned_value: Math.round(ownedValue * 100) / 100,
      set_value: 0,
      rarity_breakdown: {},
      last_card_added: null,
      estimated_completion_cost: 0,
    });
  }

  // Sort by completion percent descending
  progressList.sort((a, b) => b.completion_percent - a.completion_percent);

  return NextResponse.json({
    success: true,
    sets: progressList,
    total_sets: progressList.length,
    overall_stats: {
      total_cards_owned: userCards?.length || 0,
      total_value: userCards?.reduce((sum, c) => sum + (c.current_value || 0), 0) || 0,
      sets_started: progressList.length,
      sets_completed: progressList.filter(s => s.completion_percent >= 100).length,
    },
  });
}

// Helper: Get set info
async function getSetInfo(setId: string): Promise<{ name: string; category: string; total: number }> {
  // Try database first
  const { data } = await supabase
    .from('cv_sets')
    .select('name, category, total_cards')
    .eq('set_id', setId)
    .single();

  if (data) {
    return { name: data.name, category: data.category, total: data.total_cards };
  }

  // Fallback to hardcoded data
  const setData: Record<string, { name: string; category: string; total: number }> = {
    'sv-151': { name: 'Pokemon 151', category: 'pokemon', total: 165 },
    'sv-paldea': { name: 'Paldea Evolved', category: 'pokemon', total: 279 },
    'swsh-evolving': { name: 'Evolving Skies', category: 'pokemon', total: 237 },
    'mtg-mh3': { name: 'Modern Horizons 3', category: 'mtg', total: 303 },
    'ygo-phni': { name: 'Phantom Nightmare', category: 'yugioh', total: 100 },
  };

  return setData[setId] || { name: setId, category: 'other', total: 100 };
}

// Helper: Get rarity distribution percentages
function getRarityDistribution(rarity: string): number {
  const distributions: Record<string, number> = {
    common: 0.40,
    uncommon: 0.30,
    rare: 0.15,
    holo: 0.08,
    ultra_rare: 0.05,
    secret_rare: 0.02,
  };
  return distributions[rarity] || 0.1;
}
