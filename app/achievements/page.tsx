'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/components/AuthProvider'
import { ArrowLeft, Loader2, AlertCircle, Trophy, Lock, Star, Sparkles, TrendingUp, Users, Package, Target } from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  category: string
  icon: string
  xp_reward: number
  requirement_value: number
}

interface UserAchievement {
  achievement_id: string
  unlocked_at: string
  progress: number
}

const CATEGORY_ICONS: Record<string, any> = {
  collection: Package,
  trading: TrendingUp,
  trivia: Star,
  social: Users,
  milestone: Target,
}

const CATEGORY_COLORS: Record<string, string> = {
  collection: 'from-purple-500 to-pink-500',
  trading: 'from-green-500 to-emerald-500',
  trivia: 'from-yellow-500 to-orange-500',
  social: 'from-blue-500 to-cyan-500',
  milestone: 'from-red-500 to-pink-500',
}

export default function AchievementsPage() {
  const supabase = createClientComponentClient()
  const { user, loading: authLoading } = useAuth()
  
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    if (authLoading) return
    fetchAchievements()
  }, [authLoading, user])

  const fetchAchievements = async () => {
    setLoading(true)
    try {
      // Get all achievements
      const { data: allAchievements } = await supabase
        .from('achievements')
        .select('*')
        .order('category', { ascending: true })
      
      setAchievements(allAchievements || [])
      
      // Get user's unlocked achievements
      if (user) {
        const { data: unlocked } = await supabase
          .from('user_achievements')
          .select('achievement_id, unlocked_at, progress')
          .eq('user_id', user.id)
        
        setUserAchievements(unlocked || [])
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId)
  }

  const getProgress = (achievementId: string) => {
    const ua = userAchievements.find(u => u.achievement_id === achievementId)
    return ua?.progress || 0
  }

  const categories = ['all', ...new Set(achievements.map(a => a.category))]
  
  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory)

  const totalXP = userAchievements.reduce((sum, ua) => {
    const achievement = achievements.find(a => a.id === ua.achievement_id)
    return sum + (achievement?.xp_reward || 0)
  }, 0)

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Achievements</h1>
            <p className="text-gray-400">Track your progress and unlock rewards</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900/50 rounded-xl p-5 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{userAchievements.length}</div>
                <div className="text-sm text-gray-400">Unlocked</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-5 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalXP.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total XP</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-700 rounded-lg">
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{achievements.length - userAchievements.length}</div>
                <div className="text-sm text-gray-400">Locked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        )}

        {/* Achievements Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => {
              const unlocked = isUnlocked(achievement.id)
              const progress = getProgress(achievement.id)
              const Icon = CATEGORY_ICONS[achievement.category] || Trophy
              const colorClass = CATEGORY_COLORS[achievement.category] || 'from-gray-500 to-gray-600'
              
              return (
                <div
                  key={achievement.id}
                  className={`bg-gray-900/50 rounded-xl p-5 border transition ${
                    unlocked 
                      ? 'border-amber-500/50' 
                      : 'border-gray-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClass} ${!unlocked && 'grayscale'}`}>
                      {unlocked ? (
                        <span className="text-2xl">{achievement.icon}</span>
                      ) : (
                        <Lock className="w-6 h-6 text-white/50" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{achievement.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                      
                      {!unlocked && achievement.requirement_value > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{progress} / {achievement.requirement_value}</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${colorClass}`}
                              style={{ width: `${Math.min(100, (progress / achievement.requirement_value) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-amber-400 font-medium">+{achievement.xp_reward} XP</span>
                        {unlocked && (
                          <span className="ml-auto text-xs text-green-400">✓ Unlocked</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Not logged in prompt */}
        {!user && !authLoading && (
          <div className="mt-8 text-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30">
            <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Sign In to Track Progress</h3>
            <p className="text-gray-400 mb-6">Create an account to start unlocking achievements and earning XP.</p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition"
            >
              Get Started Free
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
