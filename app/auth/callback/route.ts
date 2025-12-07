import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Check if profile exists, create if not
      const { data: profile } = await supabase
        .from('cv_profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (!profile) {
        // Create profile for OAuth users
        await supabase.from('cv_profiles').insert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          avatar_url: data.user.user_metadata?.avatar_url || 
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.user.email || 'User')}`,
          level: 1,
          xp: 0,
          credits: 100, // Welcome bonus
          member_since: new Date().toISOString(),
        })

        // Grant welcome achievement
        try {
          await supabase.from('cv_user_achievements').insert({
            user_id: data.user.id,
            achievement_id: 'welcome_collector',
            earned_at: new Date().toISOString(),
          })
        } catch {
          // Non-critical
        }
      }
    }
  }

  // Redirect to the home page or specified next URL
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
