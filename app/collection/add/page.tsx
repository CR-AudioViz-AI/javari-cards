'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  ArrowLeft,
  Save,
  DollarSign,
  Loader2,
  AlertCircle,
  Check,
  Upload,
} from 'lucide-react'

const CATEGORIES = [
  { id: 'pokemon', name: 'Pokémon', emoji: '⚡' },
  { id: 'sports', name: 'Sports Cards', emoji: '⚾' },
  { id: 'mtg', name: 'Magic: The Gathering', emoji: '⚔️' },
  { id: 'yugioh', name: 'Yu-Gi-Oh!', emoji: '🎴' },
  { id: 'disney', name: 'Disney', emoji: '🏰' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
  { id: 'other', name: 'Other', emoji: '📦' },
]

const RARITIES = [
  { id: 'common', name: 'Common' },
  { id: 'uncommon', name: 'Uncommon' },
  { id: 'rare', name: 'Rare' },
  { id: 'epic', name: 'Epic' },
  { id: 'legendary', name: 'Legendary' },
  { id: 'mythic', name: 'Mythic' },
]

const CONDITIONS = [
  { id: 'mint', name: 'Mint' },
  { id: 'near_mint', name: 'Near Mint' },
  { id: 'excellent', name: 'Excellent' },
  { id: 'good', name: 'Good' },
  { id: 'fair', name: 'Fair' },
  { id: 'poor', name: 'Poor' },
]

const GRADING_COMPANIES = ['PSA', 'BGS', 'CGC', 'SGC']

export default function AddCardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    set_name: '',
    card_number: '',
    year: '',
    rarity: 'common',
    condition: 'near_mint',
    is_graded: false,
    grading_company: '',
    grade: '',
    purchase_price: '',
    current_value: '',
    quantity: '1',
    location: '',
    notes: '',
    image_url: '',
  })

  // Check auth
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/collection/add')
        return
      }
      setUser(user)
    }
    checkUser()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (!formData.name.trim()) {
      setError('Please enter a card name')
      return
    }
    if (!formData.category) {
      setError('Please select a category')
      return
    }
    
    setLoading(true)
    
    try {
      // First check if profile exists, create if not
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()
      
      if (!profile) {
        // Create profile
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name,
          avatar_url: user.user_metadata?.avatar_url,
        })
      }
      
      // Insert card
      const { data, error: insertError } = await supabase
        .from('cards')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          category: formData.category,
          set_name: formData.set_name.trim() || null,
          card_number: formData.card_number.trim() || null,
          year: formData.year ? parseInt(formData.year) : null,
          rarity: formData.rarity,
          condition: formData.condition,
          is_graded: formData.is_graded,
          grading_company: formData.is_graded ? formData.grading_company : null,
          grade: formData.is_graded && formData.grade ? parseFloat(formData.grade) : null,
          purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
          current_value: formData.current_value ? parseFloat(formData.current_value) : null,
          quantity: parseInt(formData.quantity) || 1,
          location: formData.location.trim() || null,
          notes: formData.notes.trim() || null,
          image_url: formData.image_url.trim() || null,
        })
        .select()
        .single()
      
      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error(insertError.message)
      }
      
      // Update profile stats
      await supabase.rpc('increment_card_count', { user_id: user.id })
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/collection?added=true')
      }, 1500)
    } catch (err: any) {
      console.error('Error adding card:', err)
      setError(err.message || 'Failed to add card. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
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
          <h2 className="text-2xl font-bold text-white mb-2">Card Added!</h2>
          <p className="text-gray-400">Redirecting to your collection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link 
          href="/collection"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collection
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Add New Card</h1>
        <p className="text-gray-400 mb-8">Enter the details of your card</p>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <label className="block text-sm font-medium text-white mb-4">Category *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`p-3 rounded-lg border text-center transition ${
                    formData.category === cat.id
                      ? 'border-purple-500 bg-purple-900/30 text-white'
                      : 'border-gray-700 hover:border-gray-600 text-gray-400'
                  }`}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <div className="text-xs mt-1">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Card Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Charizard Holo 1st Edition"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Set Name</label>
                <input
                  type="text"
                  value={formData.set_name}
                  onChange={(e) => setFormData({ ...formData, set_name: e.target.value })}
                  placeholder="e.g., Base Set"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Card Number</label>
                <input
                  type="text"
                  value={formData.card_number}
                  onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                  placeholder="e.g., 4/102"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="e.g., 1999"
                  min="1900"
                  max="2100"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  min="1"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Rarity</label>
                <select
                  value={formData.rarity}
                  onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  {RARITIES.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grading */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 space-y-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_graded: !formData.is_graded })}
                className={`w-12 h-6 rounded-full transition ${formData.is_graded ? 'bg-purple-600' : 'bg-gray-700'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition transform ${formData.is_graded ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-white">Professionally Graded</span>
            </div>

            {formData.is_graded && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Grading Company</label>
                  <select
                    value={formData.grading_company}
                    onChange={(e) => setFormData({ ...formData, grading_company: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select company</option>
                    {GRADING_COMPANIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Grade</label>
                  <input
                    type="number"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="e.g., 10, 9.5"
                    min="1"
                    max="10"
                    step="0.5"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Value */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Purchase Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Current Value</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.current_value}
                    onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Storage Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Binder #3, Toploader Box"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes about this card..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold rounded-xl transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Add to Collection
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
