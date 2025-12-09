'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  ArrowLeft,
  Upload,
  X,
  DollarSign,
  Tag,
  Image as ImageIcon,
  AlertCircle,
  Check,
  Loader2,
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

const CONDITIONS = [
  { id: 'mint', name: 'Mint', desc: 'Perfect condition' },
  { id: 'near_mint', name: 'Near Mint', desc: 'Almost perfect' },
  { id: 'excellent', name: 'Excellent', desc: 'Light wear' },
  { id: 'good', name: 'Good', desc: 'Moderate wear' },
  { id: 'fair', name: 'Fair', desc: 'Heavy wear' },
  { id: 'poor', name: 'Poor', desc: 'Damaged' },
]

const LISTING_TYPES = [
  { id: 'sell', name: 'Sell', desc: 'Fixed price sale', icon: DollarSign },
  { id: 'trade', name: 'Trade', desc: 'Open to trades', icon: Tag },
  { id: 'auction', name: 'Auction', desc: 'Bidding', icon: Tag },
]

export default function CreateListingPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    listing_type: 'sell',
    price: '',
    accepts_offers: false,
    minimum_offer: '',
    images: [] as string[],
  })

  // Check auth
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/marketplace/create')
        return
      }
      setUser(user)
    }
    checkUser()
  }, [supabase, router])

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    // For now, create object URLs (in production, upload to Supabase Storage)
    const newImages = Array.from(files).map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 6) // Max 6 images
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (!formData.title) {
      setError('Please enter a title')
      return
    }
    if (!formData.category) {
      setError('Please select a category')
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price')
      return
    }
    
    setLoading(true)
    
    try {
      const { data, error: insertError } = await supabase
        .from('marketplace_listings')
        .insert({
          seller_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          condition: formData.condition,
          listing_type: formData.listing_type,
          price: parseFloat(formData.price),
          accepts_offers: formData.accepts_offers,
          minimum_offer: formData.minimum_offer ? parseFloat(formData.minimum_offer) : null,
          images: formData.images,
          status: 'active',
        })
        .select()
        .single()
      
      if (insertError) throw insertError
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/marketplace')
      }, 2000)
    } catch (err: any) {
      console.error('Error creating listing:', err)
      setError(err.message || 'Failed to create listing. Please try again.')
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
          <h2 className="text-2xl font-bold text-white mb-2">Listing Created!</h2>
          <p className="text-gray-400">Redirecting to marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link 
          href="/marketplace"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Create Listing</h1>
        <p className="text-gray-400 mb-8">List your card for sale or trade</p>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <label className="block text-sm font-medium text-white mb-4">
              Photos <span className="text-gray-500">(up to 6)</span>
            </label>
            
            <div className="grid grid-cols-3 gap-4">
              {formData.images.map((img, i) => (
                <div key={i} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                  <img src={img} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {formData.images.length < 6 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center hover:border-purple-500 transition"
                >
                  <Upload className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="text-sm text-gray-500">Add Photo</span>
                </button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Title & Description */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., PSA 10 Charizard Base Set 1st Edition"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                maxLength={100}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your card's condition, history, and any notable details..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                maxLength={2000}
              />
            </div>
          </div>

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
                  <div className="text-sm mt-1">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <label className="block text-sm font-medium text-white mb-4">Condition</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: cond.id })}
                  className={`p-3 rounded-lg border text-left transition ${
                    formData.condition === cond.id
                      ? 'border-purple-500 bg-purple-900/30'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className={formData.condition === cond.id ? 'text-white' : 'text-gray-300'}>{cond.name}</div>
                  <div className="text-xs text-gray-500">{cond.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Listing Type */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <label className="block text-sm font-medium text-white mb-4">Listing Type</label>
            <div className="grid grid-cols-3 gap-3">
              {LISTING_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, listing_type: type.id })}
                  className={`p-4 rounded-lg border text-center transition ${
                    formData.listing_type === type.id
                      ? 'border-purple-500 bg-purple-900/30'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                    formData.listing_type === type.id ? 'text-purple-400' : 'text-gray-500'
                  }`} />
                  <div className={formData.listing_type === type.id ? 'text-white' : 'text-gray-300'}>{type.name}</div>
                  <div className="text-xs text-gray-500">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Price *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accepts_offers: !formData.accepts_offers })}
                className={`w-12 h-6 rounded-full transition ${formData.accepts_offers ? 'bg-purple-600' : 'bg-gray-700'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition transform ${formData.accepts_offers ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-gray-300">Accept offers</span>
            </div>

            {formData.accepts_offers && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Minimum Offer</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.minimum_offer}
                    onChange={(e) => setFormData({ ...formData, minimum_offer: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}
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
                Creating...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Create Listing
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
