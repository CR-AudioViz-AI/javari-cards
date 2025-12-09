'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Search,
  Plus,
  Grid3X3,
  List,
  Filter,
  ChevronDown,
  Loader2,
  FolderOpen,
  Edit3,
  Trash2,
  Eye,
  DollarSign,
  Tag,
  TrendingUp,
  Package,
  MoreVertical,
  Upload,
  Camera,
} from 'lucide-react'

interface Card {
  id: string
  name: string
  category: string
  set_name: string
  card_number: string
  year: number
  image_url: string
  rarity: string
  condition: string
  is_graded: boolean
  grading_company: string
  grade: number
  purchase_price: number
  current_value: number
  quantity: number
  created_at: string
}

interface CollectionStats {
  totalCards: number
  totalValue: number
  avgValue: number
  categories: Record<string, number>
}

const CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'pokemon', name: 'Pokémon' },
  { id: 'sports', name: 'Sports' },
  { id: 'mtg', name: 'MTG' },
  { id: 'yugioh', name: 'Yu-Gi-Oh!' },
  { id: 'disney', name: 'Disney' },
  { id: 'other', name: 'Other' },
]

const SORT_OPTIONS = [
  { id: 'newest', name: 'Recently Added' },
  { id: 'oldest', name: 'Oldest First' },
  { id: 'value-high', name: 'Highest Value' },
  { id: 'value-low', name: 'Lowest Value' },
  { id: 'name', name: 'Name A-Z' },
]

export default function CollectionPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [user, setUser] = useState<any>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [stats, setStats] = useState<CollectionStats>({
    totalCards: 0,
    totalValue: 0,
    avgValue: 0,
    categories: {},
  })
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Modal
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  // Check auth and fetch cards
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Show public collection view or redirect
        setLoading(false)
        return
      }
      
      setUser(user)
      await fetchCards(user.id)
    }
    
    init()
  }, [supabase])

  const fetchCards = async (userId: string) => {
    setLoading(true)
    try {
      let query = supabase
        .from('cards')
        .select('*')
        .eq('user_id', userId)
      
      // Apply category filter
      if (category !== 'all') {
        query = query.eq('category', category)
      }
      
      // Apply search
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`)
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'value-high':
          query = query.order('current_value', { ascending: false, nullsFirst: false })
          break
        case 'value-low':
          query = query.order('current_value', { ascending: true, nullsFirst: false })
          break
        case 'name':
          query = query.order('name', { ascending: true })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      setCards(data || [])
      
      // Calculate stats
      if (data && data.length > 0) {
        const totalValue = data.reduce((sum, c) => sum + (c.current_value || 0), 0)
        const categories: Record<string, number> = {}
        data.forEach(c => {
          categories[c.category] = (categories[c.category] || 0) + 1
        })
        
        setStats({
          totalCards: data.length,
          totalValue,
          avgValue: totalValue / data.length,
          categories,
        })
      } else {
        setStats({ totalCards: 0, totalValue: 0, avgValue: 0, categories: {} })
      }
    } catch (error) {
      console.error('Error fetching cards:', error)
    } finally {
      setLoading(false)
    }
  }

  // Re-fetch when filters change
  useEffect(() => {
    if (user) {
      fetchCards(user.id)
    }
  }, [category, sortBy, searchQuery])

  const deleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return
    
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId)
        .eq('user_id', user.id)
      
      if (error) throw error
      
      setCards(cards.filter(c => c.id !== cardId))
      setSelectedCard(null)
    } catch (error) {
      console.error('Error deleting card:', error)
    }
  }

  // Not logged in view
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Package className="w-20 h-20 text-gray-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Your Collection Awaits</h1>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Sign in to start building your card collection. Track values, organize by category, and showcase your best finds.
          </p>
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My Collection</h1>
            <p className="text-gray-400">Manage and organize your card collection</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/collection/add"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Add Card
            </Link>
            <Link
              href="/collection/import"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
            >
              <Upload className="w-5 h-5" />
              Import
            </Link>
            <Link
              href="/collection/scan"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
            >
              <Camera className="w-5 h-5" />
              Scan
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Package className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalCards}</div>
                <div className="text-sm text-gray-400">Total Cards</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">${stats.totalValue.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Value</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">${stats.avgValue.toFixed(0)}</div>
                <div className="text-sm text-gray-400">Avg Value</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <FolderOpen className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{Object.keys(stats.categories).length}</div>
                <div className="text-sm text-gray-400">Categories</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your cards..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
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
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && cards.length === 0 && (
          <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Cards Yet</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || category !== 'all'
                ? 'No cards match your filters. Try adjusting your search.'
                : 'Start building your collection by adding your first card!'
              }
            </p>
            <Link
              href="/collection/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Add Your First Card
            </Link>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && cards.length > 0 && (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
            : 'flex flex-col gap-3'
          }>
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className={`group bg-gray-900/50 rounded-xl border border-gray-800 hover:border-purple-500/50 transition cursor-pointer overflow-hidden ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative bg-gray-800 ${viewMode === 'list' ? 'w-24 h-24' : 'aspect-[3/4]'}`}>
                  {card.image_url ? (
                    <img
                      src={card.image_url}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Rarity Badge */}
                  {card.rarity && card.rarity !== 'common' && (
                    <div className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-bold rounded ${
                      card.rarity === 'legendary' ? 'bg-amber-500 text-black' :
                      card.rarity === 'epic' ? 'bg-purple-500 text-white' :
                      card.rarity === 'rare' ? 'bg-blue-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {card.rarity.toUpperCase()}
                    </div>
                  )}
                  
                  {/* Graded Badge */}
                  {card.is_graded && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                      {card.grading_company} {card.grade}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className={`p-3 ${viewMode === 'list' ? 'flex-1 flex items-center justify-between' : ''}`}>
                  <div>
                    <h3 className="font-medium text-white text-sm line-clamp-2 group-hover:text-purple-400 transition">
                      {card.name}
                    </h3>
                    {card.set_name && (
                      <p className="text-xs text-gray-500 mt-0.5">{card.set_name}</p>
                    )}
                  </div>
                  
                  {card.current_value && (
                    <div className={`text-green-400 font-bold ${viewMode === 'list' ? '' : 'mt-2'}`}>
                      ${card.current_value.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Card Detail Modal */}
        {selectedCard && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Image */}
                <div className="aspect-[3/4] bg-gray-800 rounded-xl mb-4 overflow-hidden">
                  {selectedCard.image_url ? (
                    <img src={selectedCard.image_url} alt={selectedCard.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <h2 className="text-xl font-bold text-white mb-2">{selectedCard.name}</h2>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {selectedCard.set_name && (
                    <div>
                      <span className="text-gray-500 text-sm">Set</span>
                      <p className="text-white">{selectedCard.set_name}</p>
                    </div>
                  )}
                  {selectedCard.card_number && (
                    <div>
                      <span className="text-gray-500 text-sm">Number</span>
                      <p className="text-white">{selectedCard.card_number}</p>
                    </div>
                  )}
                  {selectedCard.year && (
                    <div>
                      <span className="text-gray-500 text-sm">Year</span>
                      <p className="text-white">{selectedCard.year}</p>
                    </div>
                  )}
                  {selectedCard.condition && (
                    <div>
                      <span className="text-gray-500 text-sm">Condition</span>
                      <p className="text-white capitalize">{selectedCard.condition.replace('_', ' ')}</p>
                    </div>
                  )}
                  {selectedCard.is_graded && (
                    <div>
                      <span className="text-gray-500 text-sm">Grade</span>
                      <p className="text-white">{selectedCard.grading_company} {selectedCard.grade}</p>
                    </div>
                  )}
                  {selectedCard.current_value && (
                    <div>
                      <span className="text-gray-500 text-sm">Value</span>
                      <p className="text-green-400 font-bold">${selectedCard.current_value.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/collection/edit/${selectedCard.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCard(selectedCard.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
