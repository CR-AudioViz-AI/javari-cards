'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/components/AuthProvider'
import { ArrowLeft, Loader2, AlertCircle, Check, Users, Crown, MapPin, Trophy, Sparkles, Shield, TrendingUp } from 'lucide-react'

const CLUB_TYPES = [
  { id: 'braggers', name: 'Braggers Club', description: 'Show off your best cards', icon: Crown, emoji: '👑', color: 'from-yellow-500 to-orange-500' },
  { id: 'regional', name: 'Regional', description: 'Connect with local collectors', icon: MapPin, emoji: '📍', color: 'from-blue-500 to-cyan-500' },
  { id: 'team', name: 'Team Fans', description: 'Unite with fellow fans', icon: Trophy, emoji: '🏆', color: 'from-red-500 to-pink-500' },
  { id: 'tcg', name: 'TCG', description: 'Trading card game focused', icon: Sparkles, emoji: '✨', color: 'from-purple-500 to-pink-500' },
  { id: 'grading', name: 'Grading', description: 'Professional grade discussion', icon: Shield, emoji: '🛡️', color: 'from-green-500 to-emerald-500' },
  { id: 'investment', name: 'Investment', description: 'Value and market analysis', icon: TrendingUp, emoji: '📈', color: 'from-indigo-500 to-purple-500' },
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
      // IMPORTANT: Ensure user profile exists first
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url || null,
          })
        
        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Continue anyway - club can still be created
        }
      }

      // Generate slug from name
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 50)
      
      // Check if slug already exists
      const { data: existingClub } = await supabase
        .from('clubs')
        .select('id')
        .eq('slug', slug)
        .single()
      
      const finalSlug = existingClub 
        ? `${slug}-${Date.now().toString(36)}` 
        : slug

      const selectedType = CLUB_TYPES.find(t => t.id === clubType)
      
      // Create the club
      const { data, error: insertError } = await supabase
        .from('clubs')
        .insert({
          name,
          slug: finalSlug,
          description: description || null,
          club_type: clubType,
          owner_id: user.id,
          is_private: isPrivate,
          is_verified: false,
          requirement: requirement || null,
          banner_emoji: selectedType?.emoji || '🎴',
          banner_color: selectedType?.color || 'from-gray-500 to-gray-600',
          member_count: 1,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Club insert error:', insertError)
        throw insertError
      }

      // Add owner as first member
      const { error: memberError } = await supabase
        .from('club_members')
        .insert({
          club_id: data.id,
          user_id: user.id,
          role: 'owner',
        })

      if (memberError) {
        console.error('Member insert error:', memberError)
        // Don't throw - club was created successfully
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/clubs')
      }, 1500)
    } catch (err: any) {
      console.error('Create club error:', err)
      if (err.code === '23505') {
        setError('A club with this name already exists. Please choose a different name.')
      } else if (err.code === '23503') {
        setError('Unable to create club. Please try signing out and back in.')
      } else {
        setError(err.message || 'Failed to create club. Please try again.')
      }
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

  const selectedTypeInfo = CLUB_TYPES.find(t => t.id === clubType)

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
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Preview */}
        <div className="mb-8 bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
          <div className={`h-20 bg-gradient-to-r ${selectedTypeInfo?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
            <span className="text-4xl">{selectedTypeInfo?.emoji || '🎴'}</span>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-white">{name || 'Your Club Name'}</h3>
            <p className="text-sm text-gray-400">{description || 'Club description will appear here...'}</p>
          </div>
        </div>

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
              maxLength={50}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">{name.length}/50 characters</p>
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
              maxLength={500}
              placeholder="What is your club about?"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Join Requirement (optional)</label>
            <input
              type="text"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="e.g., Own at least 10 graded cards"
              maxLength={200}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <input
              type="checkbox"
              id="private"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
            />
            <div>
              <label htmlFor="private" className="text-white font-medium cursor-pointer">Make this club private</label>
              <p className="text-sm text-gray-400">Only invited members can join</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link
              href="/clubs"
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || !name.trim()}
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
