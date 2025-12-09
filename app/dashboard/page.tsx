'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/components/AuthProvider'
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Trophy,
  Gamepad2,
  Users,
  TrendingUp,
  Plus,
  ChevronRight,
  Zap,
  ShoppingBag,
  Loader2,
  Settings,
  LogOut,
} from 'lucide-react'

interface UserStats {
  totalCards: number
  collectionValue: number
  achievements: number
  triviaWins: number
  clubsJoined: number
}

interface RecentCard {
  id: string
  name: string
  category: string
  current_value: number
  image_url: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { user, loading: authLoading, signOut } = useAuth()
  
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<UserStats>({
    totalCards: 0,
    collectionValue: 0,
    achievements: 0,
    triviaWins: 0,
    clubsJoined: 0,
  })
  const [recentCards, setRecentCards] = useState<RecentCard[]>([])

  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    fetchUserData()
  }, [user, authLoading, router])

  const fetchUserData = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Get or create profile
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (!profile) {
        // Create profile
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name,
            avatar_url: user.user_metadata?.avatar_url,
          })
          .select()
          .single()
        profile = newProfile
      }
      
      setProfile(profile)
      
      // Fetch stats
      await fetchStats(user.id)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async (userId: string) => {
    try {
      // Get cards
      const { data: cards } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', userId)
      
      // Calculate total value
      const totalValue = cards?.reduce((sum, c) => sum + (c.current_value || 0), 0) || 0
      
      // Get recent cards
      const { data: recent } = await supabase
        .from('cards')
        .select('id, name, category, current_value, image_url, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)
      
      setRecentCards(recent || [])
      
      // Get achievements count
      const { count: achievementCount } = await supabase
        .from('user_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
      
      // Get trivia wins
      const { count: triviaWins } = await supabase
        .from('trivia_games')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed', true)
      
      // Get clubs joined
      const { count: clubsJoined } = await supabase
        .from('club_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
      
      setStats({
        totalCards: cards?.length || 0,
        collectionValue: totalValue,
        achievements: achievementCount || 0,
        triviaWins: triviaWins || 0,
        clubsJoined: clubsJoined || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  // Not logged in - redirect handled by useEffect
  if (!user) {
    return null
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Collector'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-gray-900/50 border-r border-gray-800 p-4 hidden lg:block">
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-purple-600/20 text-purple-400 rounded-lg">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link href="/collection" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg transition">
              <Package className="w-5 h-5" />
              Collection
            </Link>
            <Link href="/marketplace" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg transition">
              <ShoppingBag className="w-5 h-5" />
              Marketplace
            </Link>
            <Link href="/trivia" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg transition">
              <Gamepad2 className="w-5 h-5" />
              Trivia
            </Link>
            <Link href="/clubs" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg transition">
              <Users className="w-5 h-5" />
              Clubs
            </Link>
            <Link href="/achievements" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg transition">
              <Trophy className="w-5 h-5" />
              Achievements
            </Link>
          </nav>
          
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg transition">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {displayName}!</h1>
            <p className="text-gray-400">Here&apos;s your collection overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/50 rounded-xl p-5 border border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Package className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-xs text-purple-400 font-medium">Collection</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalCards}</div>
              <div className="text-sm text-gray-400">Total Cards</div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-5 border border-green-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-xs text-green-400 font-medium">Value</span>
              </div>
              <div className="text-3xl font-bold text-white">${stats.collectionValue.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Collection Value</div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-5 border border-amber-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-xs text-amber-400 font-medium">Rewards</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.achievements}</div>
              <div className="text-sm text-gray-400">Achievements</div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-5 border border-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Gamepad2 className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xs text-blue-400 font-medium">Trivia</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.triviaWins}</div>
              <div className="text-sm text-gray-400">Games Won</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Link
              href="/collection/add"
              className="flex items-center gap-4 p-5 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition group"
            >
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition">
                <Plus className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="font-semibold text-white">Add Cards</div>
                <div className="text-sm text-gray-400">Expand your collection</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 ml-auto" />
            </Link>

            <Link
              href="/marketplace"
              className="flex items-center gap-4 p-5 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700 transition group"
            >
              <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition">
                <ShoppingBag className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="font-semibold text-white">Marketplace</div>
                <div className="text-sm text-gray-400">Buy & sell cards</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 ml-auto" />
            </Link>

            <Link
              href="/trivia"
              className="flex items-center gap-4 p-5 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700 transition group"
            >
              <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="font-semibold text-white">Play Trivia</div>
                <div className="text-sm text-gray-400">Test your knowledge</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 ml-auto" />
            </Link>
          </div>

          {/* Recent Cards */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Recent Cards</h2>
              <Link href="/collection" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {recentCards.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">No cards in your collection yet</p>
                <Link
                  href="/collection/add"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Card
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {recentCards.map((card) => (
                  <Link
                    key={card.id}
                    href="/collection"
                    className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition"
                  >
                    <div className="aspect-[3/4] bg-gray-700 rounded mb-2 overflow-hidden">
                      {card.image_url ? (
                        <img src={card.image_url} alt={card.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-medium text-white truncate">{card.name}</div>
                    {card.current_value && (
                      <div className="text-xs text-green-400">${card.current_value.toLocaleString()}</div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Subscription Banner */}
          {profile?.subscription_tier === 'free' && (
            <div className="mt-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Upgrade Your Experience</h3>
                  <p className="text-gray-400">Get unlimited cards, advanced analytics, and more with Premium</p>
                </div>
                <Link
                  href="/pricing"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
