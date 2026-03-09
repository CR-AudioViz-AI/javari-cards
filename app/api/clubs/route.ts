export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const club_type = searchParams.get('type')
    const slug = searchParams.get('slug')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (slug) {
      const { data, error } = await supabase
        .from('cv_clubs')
        .select('*, cv_club_members(count)')
        .eq('slug', slug)
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    let query = supabase
      .from('cv_clubs')
      .select('*')
      .eq('is_public', true)
      .order('member_count', { ascending: false })
      .limit(limit)

    if (club_type) query = query.eq('club_type', club_type)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'create') {
      // Create club
      const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      
      const { data: club, error } = await supabase
        .from('cv_clubs')
        .insert([{ ...data, slug, member_count: 1 }])
        .select()
        .single()

      if (error) throw error

      // Add owner as member
      await supabase.from('cv_club_members').insert([{
        club_id: club.id,
        user_id: data.owner_id,
        role: 'owner'
      }])

      return NextResponse.json({ success: true, data: club })
    }

    if (action === 'join') {
      const { club_id, user_id } = data

      const { error } = await supabase
        .from('cv_club_members')
        .insert([{ club_id, user_id, role: 'member' }])

      if (error) throw error

      // Increment member count
      await supabase.rpc('increment_club_members', { p_club_id: club_id })

      return NextResponse.json({ success: true })
    }

    if (action === 'leave') {
      const { club_id, user_id } = data

      const { error } = await supabase
        .from('cv_club_members')
        .delete()
        .eq('club_id', club_id)
        .eq('user_id', user_id)

      if (error) throw error

      // Decrement member count
      await supabase.rpc('decrement_club_members', { p_club_id: club_id })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
