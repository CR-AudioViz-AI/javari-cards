'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  ArrowLeft,
  Users,
  Crown,
  MapPin,
  Trophy,
  Sparkles,
  Shield,
  TrendingUp,
  Upload,
  Check,
} from 'lucide-react'

const CLUB_TYPES = [
  { id: 'braggers', name: 'Braggers Club', icon: Crown, color: 'from-yellow-500 to-orange-500', description: 'For collectors with high-value collections' },
  { id: 'regional', name: 'Regional', icon: MapPin, color: 'from-blue-500 to-cyan-500', description: 'Connect with collectors in your area' },
  { id: 'team', name: 'Team Fans', icon: Trophy, color: 'from-red-500 to-pink-500', description: 'Unite fans of a specific team' },
  { id: 'tcg', name: 'TCG', icon: Sparkles, color: 'from-purple-500 to-pink-500', description: 'Trading card game communities' },
  { id: 'grading', name: 'Grading', icon: Shield, color: 'from-green-500 to-emerald-500', description: 'Focus on graded cards' },
  { id: 'investment', name: 'Investment', icon: TrendingUp, color: 'from-indigo-500 to-purple-500', description: 'Card investing strategies' },
  { id: 'general', name: 'General', icon: Users, color: 'from-gray-500 to-gray-600', description: 'Any collecting interest' },
]

export default function CreateClubPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    club_type: '',
    is_private: false,
    requirement: '',
    banner_emoji: '🎴',
  })

  const handleSubmit = async () => {
    if (!formData.name || !formData.club_type) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login?redirect=/clubs/create')
        return
      }

      // Create club in database (we'll add the table later)
      // For now, show success and redirect
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Success - redirect to clubs page
      router.push('/clubs?created=true')
      
    } catch (err) {
      setError('Failed to create club. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/clubs"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clubs
          </Link>
          <h1 className="text-3xl font-bold text-white">Create a Club</h1>
          <p className="text-gray-400 mt-2">Build a community around your collecting passion</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-500'
              }`}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 ${step > s ? 'bg-purple-600' : 'bg-gray-800'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Club Type */}
        {step === 1 && (
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-purple-900/30">
            <h2 className="text-xl font-bold text-white mb-4">Choose Club Type</h2>
            <p className="text-gray-400 mb-6">What kind of community do you want to create?</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CLUB_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData({ ...formData, club_type: type.id })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.club_type === type.id
                      ? 'border-purple-500 bg-purple-900/30'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-semibold text-white">{type.name}</div>
                  <div className="text-sm text-gray-400">{type.description}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => formData.club_type && setStep(2)}
                disabled={!formData.club_type}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Club Details */}
        {step === 2 && (
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-purple-900/30">
            <h2 className="text-xl font-bold text-white mb-4">Club Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Club Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Vintage Baseball Collectors"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell potential members what your club is about..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Club Icon
                </label>
                <div className="flex gap-2">
                  {['🎴', '⚾', '🏀', '🏈', '⚡', '💎', '👑', '🔥', '⭐', '🎮'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setFormData({ ...formData, banner_emoji: emoji })}
                      className={`w-12 h-12 text-2xl rounded-lg border-2 transition ${
                        formData.banner_emoji === emoji
                          ? 'border-purple-500 bg-purple-900/30'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Membership Requirement (optional)
                </label>
                <input
                  type="text"
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                  placeholder="e.g., Must own 10+ graded cards"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFormData({ ...formData, is_private: !formData.is_private })}
                  className={`w-12 h-6 rounded-full transition ${
                    formData.is_private ? 'bg-purple-600' : 'bg-gray-700'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition transform ${
                    formData.is_private ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
                <span className="text-gray-300">Private club (invite only)</span>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 text-gray-400 hover:text-white transition"
              >
                Back
              </button>
              <button
                onClick={() => formData.name && formData.description && setStep(3)}
                disabled={!formData.name || !formData.description}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Create */}
        {step === 3 && (
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-purple-900/30">
            <h2 className="text-xl font-bold text-white mb-4">Review Your Club</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-3xl">
                  {formData.banner_emoji}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{formData.name}</h3>
                  <div className="text-purple-400 text-sm capitalize">{formData.club_type} Club</div>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{formData.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {formData.is_private && (
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                    🔒 Private
                  </span>
                )}
                {formData.requirement && (
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                    📋 {formData.requirement}
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              As the club creator, you&apos;ll be the admin with full control over membership, 
              settings, and content moderation.
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 text-gray-400 hover:text-white transition"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold rounded-lg transition"
              >
                {loading ? 'Creating...' : 'Create Club'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
