export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// COLLECTION SHOWCASES API
// Public profile pages for displaying collections
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
interface ShowcaseSettings {
  is_public: boolean;
  show_values: boolean;
  show_graded_only: boolean;
  featured_cards: string[];
  custom_url: string | null;
  theme: string;
  bio: string;
  banner_url: string | null;
  social_links: Record<string, string>;
}

interface ShowcaseCard {
  card_id: string;
  name: string;
  category: string;
  set_name: string;
  image_url: string | null;
  rarity: string;
  condition: string;
  graded: boolean;
  grade: string | null;
  grading_company: string | null;
  value: number | null; // null if values hidden
  is_featured: boolean;
}

interface PublicShowcase {
  username: string;
  display_name: string;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string;
  theme: string;
  stats: {
    total_cards: number;
    total_value: number | null;
    graded_cards: number;
    categories: Record<string, number>;
    member_since: string;
  };
  featured_cards: ShowcaseCard[];
  recent_additions: ShowcaseCard[];
  achievements: string[];
  social_links: Record<string, string>;
}

// GET - View showcase or settings
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const username = searchParams.get('username');
  const action = searchParams.get('action') || 'view';

  try {
    if (action === 'settings' && userId) {
      return await getShowcaseSettings(userId);
    }

    if (action === 'view') {
      const targetId = userId || await getUserIdFromUsername(username);
      if (!targetId) {
        return NextResponse.json({
          success: false,
          error: 'User not found',
        }, { status: 404 });
      }
      return await getPublicShowcase(targetId);
    }

    if (action === 'browse') {
      return await browseFeaturedShowcases();
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST - Update showcase settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, action, settings, card_ids } = body;

    if (!user_id) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    switch (action) {
      case 'update-settings':
        return await updateShowcaseSettings(user_id, settings);
      case 'set-featured':
        return await setFeaturedCards(user_id, card_ids);
      case 'claim-url':
        return await claimCustomUrl(user_id, settings.custom_url);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Get showcase settings for owner
async function getShowcaseSettings(userId: string): Promise<NextResponse> {
  const { data: settings } = await supabase
    .from('cv_showcase_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Return defaults if no settings
  const defaultSettings: ShowcaseSettings = {
    is_public: false,
    show_values: false,
    show_graded_only: false,
    featured_cards: [],
    custom_url: null,
    theme: 'default',
    bio: '',
    banner_url: null,
    social_links: {},
  };

  return NextResponse.json({
    success: true,
    settings: settings || defaultSettings,
    available_themes: ['default', 'dark', 'neon', 'vintage', 'minimal', 'premium'],
  });
}

// Get public showcase
async function getPublicShowcase(userId: string): Promise<NextResponse> {
  // Get settings
  const { data: settings } = await supabase
    .from('cv_showcase_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Check if public
  if (!settings?.is_public) {
    return NextResponse.json({
      success: false,
      error: 'This showcase is private',
    }, { status: 403 });
  }

  // Get profile
  const { data: profile } = await supabase
    .from('cv_user_profiles')
    .select('username, display_name, avatar_url, created_at')
    .eq('user_id', userId)
    .single();

  // Get cards
  let cardsQuery = supabase
    .from('cv_user_cards')
    .select('*')
    .eq('user_id', userId);

  if (settings.show_graded_only) {
    cardsQuery = cardsQuery.eq('is_graded', true);
  }

  const { data: cards } = await cardsQuery.order('current_value', { ascending: false });

  // Build showcase
  const showcaseCards: ShowcaseCard[] = (cards || []).map(card => ({
    card_id: card.card_id,
    name: card.card_name,
    category: card.category,
    set_name: card.set_name || '',
    image_url: card.image_url,
    rarity: card.rarity || '',
    condition: card.condition || 'nm',
    graded: card.is_graded || false,
    grade: card.grade,
    grading_company: card.grading_company,
    value: settings.show_values ? card.current_value : null,
    is_featured: settings.featured_cards?.includes(card.card_id) || false,
  }));

  // Calculate stats
  const categoryBreakdown: Record<string, number> = {};
  cards?.forEach(card => {
    const cat = card.category || 'other';
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
  });

  const totalValue = cards?.reduce((sum, c) => sum + (c.current_value || 0), 0) || 0;

  // Get achievements
  const { data: achievements } = await supabase
    .from('cv_user_achievements')
    .select('achievement_name')
    .eq('user_id', userId);

  const showcase: PublicShowcase = {
    username: profile?.username || 'collector',
    display_name: profile?.display_name || 'Collector',
    avatar_url: profile?.avatar_url || null,
    banner_url: settings.banner_url,
    bio: settings.bio || '',
    theme: settings.theme || 'default',
    stats: {
      total_cards: cards?.length || 0,
      total_value: settings.show_values ? totalValue : null,
      graded_cards: cards?.filter(c => c.is_graded).length || 0,
      categories: categoryBreakdown,
      member_since: profile?.created_at || new Date().toISOString(),
    },
    featured_cards: showcaseCards.filter(c => c.is_featured).slice(0, 6),
    recent_additions: showcaseCards.slice(0, 12),
    achievements: achievements?.map(a => a.achievement_name) || [],
    social_links: settings.social_links || {},
  };

  return NextResponse.json({
    success: true,
    showcase,
  });
}

// Browse featured showcases
async function browseFeaturedShowcases(): Promise<NextResponse> {
  const { data: showcases } = await supabase
    .from('cv_showcase_settings')
    .select(`
      user_id,
      theme,
      bio,
      banner_url
    `)
    .eq('is_public', true)
    .eq('is_featured', true)
    .limit(20);

  // Enrich with user data
  const featured = await Promise.all(
    (showcases || []).map(async (s) => {
      const { data: profile } = await supabase
        .from('cv_user_profiles')
        .select('username, display_name, avatar_url, collection_value, card_count')
        .eq('user_id', s.user_id)
        .single();

      return {
        user_id: s.user_id,
        username: profile?.username || 'collector',
        display_name: profile?.display_name || 'Collector',
        avatar_url: profile?.avatar_url,
        banner_url: s.banner_url,
        bio: s.bio?.slice(0, 100) || '',
        theme: s.theme,
        card_count: profile?.card_count || 0,
        collection_value: profile?.collection_value || 0,
      };
    })
  );

  // Generate samples if none found
  if (featured.length === 0) {
    return NextResponse.json({
      success: true,
      featured: generateSampleShowcases(8),
      sample_data: true,
    });
  }

  return NextResponse.json({
    success: true,
    featured,
  });
}

// Update showcase settings
async function updateShowcaseSettings(userId: string, settings: Partial<ShowcaseSettings>): Promise<NextResponse> {
  const { data, error } = await supabase
    .from('cv_showcase_settings')
    .upsert({
      user_id: userId,
      ...settings,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    settings: data,
    message: 'Showcase settings updated',
  });
}

// Set featured cards
async function setFeaturedCards(userId: string, cardIds: string[]): Promise<NextResponse> {
  if (cardIds.length > 6) {
    return NextResponse.json({
      success: false,
      error: 'Maximum 6 featured cards allowed',
    }, { status: 400 });
  }

  const { error } = await supabase
    .from('cv_showcase_settings')
    .upsert({
      user_id: userId,
      featured_cards: cardIds,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) throw error;

  return NextResponse.json({
    success: true,
    featured_cards: cardIds,
    message: 'Featured cards updated',
  });
}

// Claim custom URL
async function claimCustomUrl(userId: string, customUrl: string): Promise<NextResponse> {
  // Validate URL
  const urlRegex = /^[a-z0-9_-]{3,30}$/;
  if (!urlRegex.test(customUrl)) {
    return NextResponse.json({
      success: false,
      error: 'Custom URL must be 3-30 characters, lowercase letters, numbers, hyphens, and underscores only',
    }, { status: 400 });
  }

  // Check if available
  const { data: existing } = await supabase
    .from('cv_showcase_settings')
    .select('user_id')
    .eq('custom_url', customUrl)
    .neq('user_id', userId)
    .single();

  if (existing) {
    return NextResponse.json({
      success: false,
      error: 'This URL is already taken',
    }, { status: 409 });
  }

  // Claim it
  const { error } = await supabase
    .from('cv_showcase_settings')
    .upsert({
      user_id: userId,
      custom_url: customUrl,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) throw error;

  return NextResponse.json({
    success: true,
    custom_url: customUrl,
    full_url: `https://cravcards.vercel.app/u/${customUrl}`,
    message: 'Custom URL claimed successfully',
  });
}

// Get user ID from username
async function getUserIdFromUsername(username: string | null): Promise<string | null> {
  if (!username) return null;

  // Check custom URLs first
  const { data: showcase } = await supabase
    .from('cv_showcase_settings')
    .select('user_id')
    .eq('custom_url', username)
    .single();

  if (showcase) return showcase.user_id;

  // Check usernames
  const { data: profile } = await supabase
    .from('cv_user_profiles')
    .select('user_id')
    .eq('username', username)
    .single();

  return profile?.user_id || null;
}

// Generate sample showcases for demo
function generateSampleShowcases(count: number): Array<Record<string, unknown>> {
  const themes = ['default', 'dark', 'neon', 'vintage'];
  const names = ['CardMaster', 'PokeFanatic', 'VintageKing', 'ModernMaster', 'GradedGuru', 'SetBuilder', 'RareHunter', 'InvestorPro'];

  return Array.from({ length: count }, (_, i) => ({
    user_id: `sample-${i}`,
    username: names[i % names.length].toLowerCase(),
    display_name: names[i % names.length],
    avatar_url: null,
    banner_url: null,
    bio: 'Passionate collector showcasing their prized cards',
    theme: themes[i % themes.length],
    card_count: 50 + Math.floor(Math.random() * 500),
    collection_value: 1000 + Math.floor(Math.random() * 50000),
  }));
}

// DEDUP REMOVED: export const dynamic = 'force-dynamic';
