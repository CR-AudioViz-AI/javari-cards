'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/components/AuthProvider'
import { ArrowLeft, Loader2, AlertCircle, Check, Users, Crown, MapPin, Trophy, Sparkles, Shield, TrendingUp } from 'lucide-react'

const CLUB_TYPES = [
  { id: 'braggers', name: 'Braggers Club', description: 'Show off your best cards', icon: Crown, emoji: '👑' },
  { id: 'regional', name: 'Regional', description: 'Connect with local collectors', icon: MapPin, emoji: '📍' },
  { id: 'team', name: 'Team Fans', description: 'Unite with fellow fans', icon: Trophy, emoji: '🏆' },
  { id: 'tcg', name: 'TCG', description: 'Trading card game focused', icon: Sparkles, emoji: '✨' },
  { id: 'grading', name: 'Grading', description: 'Professional grade discussion', icon: Shield, emoji: '🛡️' },
  { id: 'investment', name: 'Investment', description: 'Value and market analysis', icon: TrendingUp, emoji: '📈' },
]

export default function CreateClubPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { user, loading: authLoading } = useAuth()
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [clubType, setClubType] = useState('braggers')
  const [isPrivate, setIsPrivate] = useState(false)
  const [requirement, setRequirement] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setError('')
    setSaving(true)

    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const selectedType = CLUB_TYPES.find(t => t.id === clubType)
      
      const { data, error: insertError } = await supabase
        .from('clubs')
        .insert({
          name,
          slug,
          description,
          club_type: clubType,
          owner_id: user.id,
          is_private: isPrivate,
          requirement: requirement || null,
          banner_emoji: selectedType?.emoji || '🎴',
          member_count: 1,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Add owner as first member
      await supabase.from('club_members').insert({
        club_id: data.id,
        user_id: user.id,
        role: 'owner',
      })

      setSuccess(true)
      setTimeout(() => {
        router.push('/clubs')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to create club')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center pt-20">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-gray-400 mb-6">You need to be signed in to create a club.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/login?redirect=/clubs/create" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition">
              Sign In
            </Link>
            <Link href="/clubs" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition">
              Back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Club Created!</h2>
          <p className="text-gray-400">Redirecting to clubs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/clubs" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Create Club</h1>
            <p className="text-gray-400">Start a new community</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Club Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Pokémon Masters"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Club Type</label>
            <div className="grid grid-cols-2 gap-3">
              {CLUB_TYPES.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setClubType(type.id)}
                    className={`p-4 rounded-lg border text-left transition ${
                      clubType === type.id
                        ? 'bg-purple-600 border-purple-500'
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{type.emoji}</span>
                      <span className="font-medium text-white">{type.name}</span>
                    </div>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What is your club about?"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Join Requirement (optional)</label>
            <input
              type="text"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="e.g., Own at least 10 graded cards"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="private"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="private" className="text-white">Make this club private (invite only)</label>
          </div>

          <div className="flex gap-4">
            <Link
              href="/clubs"
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || !name}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  Create Club
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
