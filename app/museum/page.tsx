'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Landmark,
  Clock,
  Trophy,
  ChevronRight,
  BookOpen,
  Sparkles,
  Calendar,
  Loader2,
  Filter,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase'
import GlobalHeader from '@/components/GlobalHeader'

// Types matching cv_history_articles table
interface HistoryArticle {
  id: string
  title: string
  slug: string
  content: string
  category: string
  era: string
  featured_image_url?: string
  author: string
  view_count: number
  is_featured: boolean
  is_published: boolean
  published_at: string
  created_at: string
}

const CATEGORIES = [
  { id: 'all', name: 'All History', icon: '📚' },
  { id: 'pokemon', name: 'Pokemon', icon: '⚡' },
  { id: 'sports', name: 'Sports Cards', icon: '⚾' },
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'tcg', name: 'TCG/MTG', icon: '🎴' },
  { id: 'grading', name: 'Grading', icon: '🏆' },
  { id: 'market', name: 'Market', icon: '📈' },
  { id: 'general', name: 'General', icon: '📜' },
]

function getEraColor(era: string) {
  if (era.includes('18')) return 'bg-amber-500/20 text-amber-400 border-amber-500/50'
  if (era.includes('194') || era.includes('195') || era.includes('196')) return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
  if (era.includes('197') || era.includes('198')) return 'bg-purple-500/20 text-purple-400 border-purple-500/50'
  if (era.includes('199')) return 'bg-pink-500/20 text-pink-400 border-pink-500/50'
  if (era.includes('200') || era.includes('201') || era.includes('202')) return 'bg-green-500/20 text-green-400 border-green-500/50'
  return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
}

export default function MuseumPage() {
  const [articles, setArticles] = useState<HistoryArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const supabase = createClient()

  useEffect(() => {
    fetchHistory()
  }, [selectedCategory])

  async function fetchHistory() {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('cv_history_articles')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setArticles(data || [])
    } catch (err) {
      console.error('Error fetching history:', err)
      setError('Failed to load museum content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Group by era
  const articlesByEra = articles.reduce((acc, article) => {
    const era = article.era || 'Unknown'
    if (!acc[era]) acc[era] = []
    acc[era].push(article)
    return acc
  }, {} as Record<string, HistoryArticle[]>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-2 rounded-full mb-6">
              <Landmark className="w-4 h-4" />
              <span className="text-sm font-medium">The Card Museum</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              History of
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text">
                {' '}Trading Cards
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Explore the rich history of collecting, from 19th century tobacco cards 
              to modern-day Pokemon phenomena. Every card has a story.
            </p>

            <div className="flex items-center justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>150+ Years of History</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>{articles.length} Articles</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-gray-900/30 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">Filter by Category</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 'bg-amber-500 hover:bg-amber-600' : ''}
              >
                {category.icon} {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-amber-400 animate-spin mb-4" />
              <p className="text-gray-400">Loading museum exhibits...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={fetchHistory} variant="outline">
                Try Again
              </Button>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <Landmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Articles Found</h3>
              <p className="text-gray-400 mb-4">
                {selectedCategory !== 'all'
                  ? 'Try selecting a different category.'
                  : 'The museum is being curated. Check back soon!'}
              </p>
              {selectedCategory !== 'all' && (
                <Button variant="outline" onClick={() => setSelectedCategory('all')}>
                  View All
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(articlesByEra)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([era, eraArticles]) => (
                  <div key={era}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold px-4 py-2 rounded-lg">
                        {era}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {eraArticles.map((article, index) => (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="bg-gray-800/50 border-gray-700 hover:border-amber-500/50 transition-all h-full">
                            {article.featured_image_url && (
                              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                <img
                                  src={article.featured_image_url}
                                  alt={article.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <Badge variant="outline" className={getEraColor(article.era)}>
                                  {article.era}
                                </Badge>
                                {article.is_featured && (
                                  <Badge className="bg-amber-500/20 text-amber-400">
                                    ⭐ Featured
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-white mt-2">{article.title}</CardTitle>
                              <CardDescription className="text-gray-400">
                                By {article.author}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                                {article.content}
                              </p>
                              <div className="mt-4 flex items-center justify-between">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {article.category}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Eye className="w-3 h-3" />
                                  {article.view_count}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Did You Know Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              <Sparkles className="w-8 h-8 text-amber-400 inline mr-2" />
              Did You Know?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-700/50">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-amber-400 mb-2">$12.6M</div>
                <p className="text-gray-300">
                  The record price for a 1952 Topps Mickey Mantle card, sold in 2022.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-700/50">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-purple-400 mb-2">1996</div>
                <p className="text-gray-300">
                  The year Pokemon TCG was first released in Japan, starting a global phenomenon.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-700/50">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
                <p className="text-gray-300">
                  Billion Pokemon cards have been produced since 1996, making it the most printed TCG ever.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Collection?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of collectors tracking their cards, learning about the hobby, 
            and connecting with fellow enthusiasts.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              <BookOpen className="w-5 h-5 mr-2" />
              Visit Academy
            </Button>
            <Button size="lg" variant="outline" className="border-amber-500 text-amber-400 hover:bg-amber-500/10">
              Start Collecting
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
