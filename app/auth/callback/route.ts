import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const origin = requestUrl.origin

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Check if profile exists, create if not
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (!profile) {
        // Create profile in central profiles table for OAuth users
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0],
          avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.user.email || 'User')}`,
          role: 'user',
          is_active: true,
        })

        // Initialize user credits
        await supabase.from('user_credits').insert({
          user_id: data.user.id,
          balance: 100, // Welcome bonus
        }).catch(() => {}) // Non-critical
      }

      // Redirect to dashboard after successful auth
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth failed, redirect to login with error
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
}
