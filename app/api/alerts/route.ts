// ============================================================================
// PRICE ALERTS API
// Set and manage price alerts for cards
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

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Please sign in to view alerts',
      }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('cv_price_alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      alerts: data || [],
      count: data?.length || 0,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Please sign in to create alerts',
      }, { status: 401 });
    }

    const body = await request.json();
    const {
      card_id,
      card_name,
      category,
      image_url,
      target_price,
      alert_type = 'below', // 'below' or 'above'
      current_price,
    } = body;

    if (!card_name || !target_price) {
      return NextResponse.json({
        success: false,
        error: 'card_name and target_price are required',
      }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('cv_price_alerts')
      .insert({
        user_id: user.id,
        card_id,
        card_name,
        category,
        image_url,
        target_price,
        alert_type,
        current_price,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      alert: data,
      message: `Alert created: Notify when ${card_name} goes ${alert_type} $${target_price}`,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

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
      .from('cv_price_alerts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Alert deleted',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
