'use client'

import { useState } from 'react'
import {
  Trophy,
  Star,
  Zap,
  Crown,
  Target,
  Flame,
  Gift,
  Users,
  TrendingUp,
  Lock,
} from 'lucide-react'

const ACHIEVEMENTS = [
  {
    id: 'first-card',
    name: 'First Card',
    description: 'Add your first card to your collection',
    icon: Star,
    color: 'from-yellow-500 to-orange-500',
    xp: 50,
    unlocked: true,
    unlockedAt: '2024-01-15',
  },
  {
    id: 'collector-10',
    name: 'Collector',
    description: 'Collect 10 cards',
    icon: Trophy,
    color: 'from-blue-500 to-cyan-500',
    xp: 100,
    unlocked: true,
    unlockedAt: '2024-01-20',
  },
  {
    id: 'trivia-master',
    name: 'Trivia Master',
    description: 'Win 10 trivia games',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    xp: 150,
    unlocked: true,
    unlockedAt: '2024-02-01',
  },
  {
    id: 'rare-find',
    name: 'Rare Find',
    description: 'Own a Rare or higher card',
    icon: Crown,
    color: 'from-amber-500 to-yellow-500',
    xp: 200,
    unlocked: false,
    progress: 0,
    total: 1,
  },
  {
    id: 'collector-50',
    name: 'Serious Collector',
    description: 'Collect 50 cards',
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    xp: 250,
    unlocked: false,
    progress: 12,
    total: 50,
  },
  {
    id: 'hot-streak',
    name: 'Hot Streak',
    description: 'Win 5 trivia games in a row',
    icon: Flame,
    color: 'from-red-500 to-orange-500',
    xp: 300,
    unlocked: false,
    progress: 2,
    total: 5,
  },
  {
    id: 'first-trade',
    name: 'Trader',
    description: 'Complete your first trade',
    icon: Gift,
    color: 'from-pink-500 to-rose-500',
    xp: 150,
    unlocked: false,
    progress: 0,
    total: 1,
  },
  {
    id: 'club-member',
    name: 'Club Member',
    description: 'Join a collector club',
    icon: Users,
    color: 'from-indigo-500 to-purple-500',
    xp: 100,
    unlocked: false,
    progress: 0,
    total: 1,
  },
  {
    id: 'value-1000',
    name: 'Rising Value',
    description: 'Collection worth $1,000+',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    xp: 500,
    unlocked: false,
    progress: 450,
    total: 1000,
  },
]

export default function AchievementsPage() {
  const totalXP = ACHIEVEMENTS.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0)
  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Achievements</h1>
          <p className="text-gray-400">Track your collecting milestones</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900/50 rounded-xl p-4 text-center border border-purple-900/30">
            <div className="text-3xl font-bold text-purple-400">{unlockedCount}</div>
            <div className="text-sm text-gray-400">Unlocked</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4 text-center border border-purple-900/30">
            <div className="text-3xl font-bold text-yellow-400">{totalXP}</div>
            <div className="text-sm text-gray-400">Total XP</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4 text-center border border-purple-900/30">
            <div className="text-3xl font-bold text-green-400">{Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%</div>
            <div className="text-sm text-gray-400">Complete</div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative rounded-xl p-5 border transition ${
                achievement.unlocked
                  ? 'bg-gray-900/50 border-purple-500/50'
                  : 'bg-gray-900/30 border-gray-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  achievement.unlocked
                    ? `bg-gradient-to-br ${achievement.color}`
                    : 'bg-gray-800'
                }`}>
                  {achievement.unlocked ? (
                    <achievement.icon className="w-7 h-7 text-white" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                      {achievement.name}
                    </h3>
                    <span className={`text-sm font-medium ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-600'}`}>
                      +{achievement.xp} XP
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${achievement.unlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                    {achievement.description}
                  </p>
                  
                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress} / {achievement.total}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                          style={{ width: `${(achievement.progress! / achievement.total!) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
