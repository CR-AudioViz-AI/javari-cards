// ============================================================================
// CARD HISTORY / MUSEUM API - Historical Content & Stories
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
  const action = searchParams.get('action') || 'list';
  const id = searchParams.get('id');
  const category = searchParams.get('category');
  const cardSource = searchParams.get('source');
  const era = searchParams.get('era');
  const featured = searchParams.get('featured');
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');

  try {
    // Get specific history entry
    if (action === 'get' && id) {
      const { data, error } = await supabase
        .from('cv_card_history')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) throw error;

      // Increment view count
      await supabase
        .from('cv_card_history')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id);

      return NextResponse.json({
        success: true,
        entry: data,
      });
    }

    // List history entries
    if (action === 'list') {
      let query = supabase
        .from('cv_card_history')
        .select('*', { count: 'exact' })
        .eq('published', true)
        .order('date_relevance', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (category) {
        query = query.eq('category', category);
      }

      if (cardSource) {
        query = query.contains('card_sources', [cardSource]);
      }

      if (era) {
        query = query.eq('era', era);
      }

      if (featured === 'true') {
        query = query.eq('featured', true);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return NextResponse.json({
        success: true,
        entries: data,
        totalCount: count,
        page,
        pageSize: limit,
      });
    }

    // Get today in history
    if (action === 'today') {
      const today = new Date();
      const monthDay = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('cv_card_history')
        .select('*')
        .eq('published', true)
        .not('date_relevance', 'is', null)
        .order('date_relevance', { ascending: false });

      if (error) throw error;

      // Filter entries that match today's month and day
      const todayEntries = (data || []).filter(entry => {
        if (!entry.date_relevance) return false;
        const entryDate = new Date(entry.date_relevance);
        const entryMonthDay = `${(entryDate.getMonth() + 1).toString().padStart(2, '0')}-${entryDate.getDate().toString().padStart(2, '0')}`;
        return entryMonthDay === monthDay;
      });

      return NextResponse.json({
        success: true,
        date: today.toISOString().split('T')[0],
        entries: todayEntries,
      });
    }

    // Get timeline
    if (action === 'timeline') {
      const { data, error } = await supabase
        .from('cv_card_history')
        .select('id, title, summary, category, card_sources, date_relevance, era, image_url')
        .eq('published', true)
        .not('date_relevance', 'is', null)
        .order('date_relevance', { ascending: true });

      if (error) throw error;

      // Group by era
      const timeline = {
        early: [] as any[],
        classic: [] as any[],
        modern: [] as any[],
        current: [] as any[],
      };

      (data || []).forEach(entry => {
        const era = entry.era || 'current';
        if (timeline[era as keyof typeof timeline]) {
          timeline[era as keyof typeof timeline].push(entry);
        }
      });

      return NextResponse.json({
        success: true,
        timeline,
        totalEntries: data?.length || 0,
      });
    }

    // Get categories with counts
    if (action === 'categories') {
      const { data, error } = await supabase
        .from('cv_card_history')
        .select('category')
        .eq('published', true);

      if (error) throw error;

      // Count by category
      const categoryCounts: Record<string, number> = {};
      (data || []).forEach(entry => {
        categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
      });

      const categories = Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count,
        label: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
      }));

      return NextResponse.json({
        success: true,
        categories: categories.sort((a, b) => b.count - a.count),
      });
    }

    // Search history
    if (action === 'search') {
      const query = searchParams.get('q');

      if (!query || query.length < 2) {
        return NextResponse.json({
          success: false,
          error: 'Search query must be at least 2 characters',
        }, { status: 400 });
      }

      const { data, error } = await supabase
        .from('cv_card_history')
        .select('*')
        .eq('published', true)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
        .order('view_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        query,
        entries: data,
      });
    }

    // Get featured entries
    if (action === 'featured') {
      const { data, error } = await supabase
        .from('cv_card_history')
        .select('*')
        .eq('published', true)
        .eq('featured', true)
        .order('view_count', { ascending: false })
        .limit(10);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        entries: data,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
    }, { status: 400 });

  } catch (error) {
    console.error('History API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch history',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    const body = await request.json();

    // Create new history entry (admin)
    if (action === 'create') {
      const {
        title,
        content,
        summary,
        category,
        card_sources,
        date_relevance,
        era,
        image_url,
        image_source,
        image_license,
        source_url,
        source_name,
        tags,
        featured,
      } = body;

      if (!title || !content || !category) {
        return NextResponse.json({
          success: false,
          error: 'Title, content, and category are required',
        }, { status: 400 });
      }

      const { data, error } = await supabase
        .from('cv_card_history')
        .insert({
          title,
          content,
          summary: summary || content.substring(0, 200) + '...',
          category,
          card_sources: card_sources || [],
          date_relevance,
          era: era || 'current',
          image_url,
          image_source,
          image_license,
          source_url,
          source_name,
          tags: tags || [],
          featured: featured || false,
          published: true,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        entry: data,
      });
    }

    // Update history entry (admin)
    if (action === 'update') {
      const { id, ...updates } = body;

      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'Entry ID required',
        }, { status: 400 });
      }

      const { data, error } = await supabase
        .from('cv_card_history')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        entry: data,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
    }, { status: 400 });

  } catch (error) {
    console.error('History API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process history action',
    }, { status: 500 });
  }
}
