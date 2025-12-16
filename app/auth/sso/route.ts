import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * SSO Callback Handler
 * 
 * This receives auth tokens from the central login at craudiovizai.com
 * and establishes a local session for the app.
 * 
 * URL: /auth/sso?access_token=xxx&refresh_token=xxx
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const accessToken = requestUrl.searchParams.get('access_token')
  const refreshToken = requestUrl.searchParams.get('refresh_token')
  const redirect = requestUrl.searchParams.get('redirect') || '/dashboard'
  const origin = requestUrl.origin

  // Validate tokens are present
  if (!accessToken || !refreshToken) {
    // No tokens - redirect to central login
    const centralLoginUrl = new URL('https://craudiovizai.com/login')
    centralLoginUrl.searchParams.set('app', `${origin}${redirect}`)
    return NextResponse.redirect(centralLoginUrl.toString())
  }

  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Set the session using the tokens from central auth
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (error) {
      console.error('SSO session error:', error)
      // Token invalid - redirect to central login
      const centralLoginUrl = new URL('https://craudiovizai.com/login')
      centralLoginUrl.searchParams.set('app', `${origin}${redirect}`)
      centralLoginUrl.searchParams.set('error', 'session_expired')
      return NextResponse.redirect(centralLoginUrl.toString())
    }

    if (data.session && data.user) {
      // Session established successfully
      // Sync user profile if needed
      const { data: profile } = await supabase
        .from('cv_profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (!profile) {
        // Create profile for this user
        await supabase.from('cv_profiles').insert({
          id: data.user.id,
          email: data.user.email,
          username: data.user.email?.split('@')[0] || 'user',
          display_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'Collector',
          avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }

      // Redirect to intended destination
      return NextResponse.redirect(`${origin}${redirect}`)
    }
  } catch (err) {
    console.error('SSO error:', err)
  }

  // Fallback - redirect to central login
  const centralLoginUrl = new URL('https://craudiovizai.com/login')
  centralLoginUrl.searchParams.set('app', `${origin}${redirect}`)
  return NextResponse.redirect(centralLoginUrl.toString())
}
