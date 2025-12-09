'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  Eye,
  TrendingUp,
  DollarSign,
  Tag,
  Clock,
  ChevronDown,
  Plus,
  Loader2,
  ShoppingBag,
  ArrowUpDown,
} from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string
  category: string
  condition: string
  price: number
  images: string[]
  listing_type: 'sell' | 'trade' | 'auction'
  status: string
  views: number
  favorites: number
  created_at: string
  seller: {
    id: string
    full_name: string
    avatar_url: string
  }
}

interface MarketStats {
  totalListings: number
  totalVolume: number
  activeSellers: number
  avgPrice: number
}

const CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'pokemon', name: 'Pokémon' },
  { id: 'sports', name: 'Sports Cards' },
  { id: 'mtg', name: 'Magic: The Gathering' },
  { id: 'yugioh', name: 'Yu-Gi-Oh!' },
  { id: 'disney', name: 'Disney' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'other', name: 'Other' },
]

const RARITIES = [
  { id: 'all', name: 'All Rarities' },
  { id: 'common', name: 'Common' },
  { id: 'uncommon', name: 'Uncommon' },
  { id: 'rare', name: 'Rare' },
  { id: 'epic', name: 'Epic' },
  { id: 'legendary', name: 'Legendary' },
]

const SORT_OPTIONS = [
  { id: 'newest', name: 'Recently Listed' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'popular', name: 'Most Popular' },
]

export default function MarketplacePage() {
  const supabase = createClientComponentClient()
  
  // State
  const [listings, setListings] = useState<Listing[]>([])
  const [stats, setStats] = useState<MarketStats>({
    totalListings: 0,
    totalVolume: 0,
    activeSellers: 0,
    avgPrice: 0,
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [rarity, setRarity] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  // Fetch user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('marketplace_listings')
          .select(`
            *,
            seller:profiles!seller_id(id, full_name, avatar_url)
          `)
          .eq('status', 'active')
        
        // Apply filters
        if (category !== 'all') {
          query = query.eq('category', category)
        }
        
        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`)
        }
        
        if (priceRange.min) {
          query = query.gte('price', parseFloat(priceRange.min))
        }
        
        if (priceRange.max) {
          query = query.lte('price', parseFloat(priceRange.max))
        }
        
        // Apply sorting
        switch (sortBy) {
          case 'price-low':
            query = query.order('price', { ascending: true })
            break
          case 'price-high':
            query = query.order('price', { ascending: false })
            break
          case 'popular':
            query = query.order('views', { ascending: false })
            break
          default:
            query = query.order('created_at', { ascending: false })
        }
        
        const { data, error } = await query.limit(50)
        
        if (error) throw error
        
        setListings(data || [])
        
        // Calculate stats
        if (data && data.length > 0) {
          const totalValue = data.reduce((sum, l) => sum + (l.price || 0), 0)
          const uniqueSellers = new Set(data.map(l => l.seller_id)).size
          setStats({
            totalListings: data.length,
            totalVolume: totalValue,
            activeSellers: uniqueSellers,
            avgPrice: totalValue / data.length,
          })
        }
      } catch (error) {
        console.error('Error fetching listings:', error)
        // If no database yet, show empty state
        setListings([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchListings()
  }, [supabase, category, searchQuery, sortBy, priceRange])

  // Toggle favorite
  const toggleFavorite = async (listingId: string) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth/login?redirect=/marketplace'
      return
    }
    // TODO: Implement favorites
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-gray-400">Buy, sell, and trade cards with collectors worldwide</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 backdrop-blur rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Tag className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalListings.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Cards Listed</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">${stats.totalVolume.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Value</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.activeSellers}</div>
                <div className="text-sm text-gray-400">Active Sellers</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur rounded-xl p-4 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">${stats.avgPrice.toFixed(0)}</div>
                <div className="text-sm text-gray-400">Avg Price</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-gray-900/50 backdrop-blur rounded-xl p-4 border border-gray-800 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cards..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Rarity */}
            <div className="relative">
              <select
                value={rarity}
                onChange={(e) => setRarity(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {RARITIES.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sell Button */}
            {user && (
              <Link
                href="/marketplace/create"
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition"
              >
                <Plus className="w-5 h-5" />
                List Card
              </Link>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400">
            Showing <span className="text-white font-medium">{listings.length}</span> listings
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800">
            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Listings Found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || category !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Be the first to list a card on the marketplace!'
              }
            </p>
            {user && (
              <Link
                href="/marketplace/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
              >
                <Plus className="w-5 h-5" />
                List Your First Card
              </Link>
            )}
          </div>
        )}

        {/* Listings Grid */}
        {!loading && listings.length > 0 && (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'flex flex-col gap-4'
          }>
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/marketplace/${listing.id}`}
                className={`group bg-gray-900/50 backdrop-blur rounded-xl border border-gray-800 hover:border-purple-500/50 transition overflow-hidden ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative bg-gray-800 ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'}`}>
                  {listing.images?.[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(listing.id)
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur rounded-full text-white hover:bg-black/70 transition"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  
                  {/* Type Badge */}
                  {listing.listing_type === 'auction' && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-black text-xs font-bold rounded">
                      AUCTION
                    </div>
                  )}
                  {listing.listing_type === 'trade' && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
                      TRADE
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded capitalize">
                        {listing.category}
                      </span>
                      {listing.condition && (
                        <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded capitalize">
                          {listing.condition.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition line-clamp-2">
                      {listing.title}
                    </h3>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xl font-bold text-green-400">
                      ${listing.price?.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {listing.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {listing.favorites}
                      </span>
                    </div>
                  </div>

                  {/* Seller */}
                  {listing.seller && (
                    <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {listing.seller.full_name?.[0] || '?'}
                      </div>
                      <span className="text-sm text-gray-400">{listing.seller.full_name}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA for non-users */}
        {!user && !loading && (
          <div className="mt-12 text-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-2">Ready to Start Trading?</h3>
            <p className="text-gray-400 mb-6">Create an account to buy, sell, and trade cards with collectors worldwide.</p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition"
              >
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
