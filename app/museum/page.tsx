'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Landmark,
  Clock,
  Trophy,
  Star,
  ChevronRight,
  BookOpen,
  Sparkles,
  TrendingUp,
  Calendar,
  Loader2,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase'
import GlobalHeader from '@/components/GlobalHeader'

// Types
interface HistoryEvent {
  id: string
  title: string
  year: number
  category: string
  content: string
  image_url?: string
  significance: 'low' | 'medium' | 'high' | 'legendary'
}

// Static Eras data (for timeline context)
const ERAS = [
  {
    id: 'tobacco',
    name: 'Tobacco Card Era',
    years: '1880s-1945',
    icon: '🚬',
    color: 'from-amber-700 to-amber-500',
    description: 'The birth of trading cards as tobacco company inserts.',
    yearRange: [1880, 1945],
  },
  {
    id: 'postwar',
    name: 'Post-War Boom',
    years: '1945-1980',
    icon: '⚾',
    color: 'from-blue-600 to-blue-400',
    description: 'Topps establishes dominance. Modern card design emerges.',
    yearRange: [1945, 1980],
  },
  {
    id: 'junkwax',
    name: 'Junk Wax Era',
    years: '1986-1993',
    icon: '📦',
    color: 'from-gray-600 to-gray-400',
    description: 'Mass production era that flooded the market.',
    yearRange: [1986, 1993],
  },
  {
    id: 'modern',
    name: 'Modern Era',
    years: '1993-2010',
    icon: '✨',
    color: 'from-purple-600 to-pink-500',
    description: 'Innovation with inserts, parallels, and memorabilia cards.',
    yearRange: [1993, 2010],
  },
  {
    id: 'investment',
    name: 'Investment Era',
    years: '2010-Present',
    icon: '📈',
    color: 'from-green-600 to-emerald-500',
    description: 'Cards become alternative investments.',
    yearRange: [2010, 2100],
  },
]

const CATEGORIES = [
  { id: 'all', name: 'All History', icon: '📚' },
  { id: 'pokemon', name: 'Pokemon', icon: '⚡' },
  { id: 'sports', name: 'Sports Cards', icon: '⚾' },
  { id: 'tcg', name: 'TCG/MTG', icon: '🎴' },
  { id: 'grading', name: 'Grading', icon: '🏆' },
  { id: 'market', name: 'Market', icon: '📈' },
  { id: 'general', name: 'General', icon: '📜' },
]

function getSignificanceBadge(significance: string) {
  const styles = {
    legendary: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    high: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    medium: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    low: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  }
  return styles[significance as keyof typeof styles] || styles.medium
}

function getEraForYear(year: number) {
  return ERAS.find(era => year >= era.yearRange[0] && year <= era.yearRange[1])
}

export default function MuseumPage() {
  const [events, setEvents] = useState<HistoryEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedEra, setSelectedEra] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchHistory()
  }, [selectedCategory])

  async function fetchHistory() {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('card_history')
        .select('*')
        .order('year', { ascending: true })

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setEvents(data || [])
    } catch (err) {
      console.error('Error fetching history:', err)
      setError('Failed to load museum content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Filter events by era if selected
  const filteredEvents = selectedEra
    ? events.filter(event => {
        const era = ERAS.find(e => e.id === selectedEra)
        return era && event.year >= era.yearRange[0] && event.year <= era.yearRange[1]
      })
    : events

  // Group events by decade for timeline view
  const eventsByDecade = filteredEvents.reduce((acc, event) => {
    const decade = Math.floor(event.year / 10) * 10
    if (!acc[decade]) acc[decade] = []
    acc[decade].push(event)
    return acc
  }, {} as Record<number, HistoryEvent[]>)

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
                <span>{events.length} Historic Events</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Era Timeline */}
      <section className="py-8 border-y border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">Filter by Era</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedEra === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedEra(null)}
              className={selectedEra === null ? 'bg-amber-500 hover:bg-amber-600' : ''}
            >
              All Eras
            </Button>
            {ERAS.map(era => (
              <Button
                key={era.id}
                variant={selectedEra === era.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedEra(era.id)}
                className={selectedEra === era.id ? `bg-gradient-to-r ${era.color}` : ''}
              >
                {era.icon} {era.name} ({era.years})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-gray-900/30">
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
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <Landmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
              <p className="text-gray-400 mb-4">
                {selectedCategory !== 'all' || selectedEra
                  ? 'Try adjusting your filters to see more content.'
                  : 'The museum is being curated. Check back soon!'}
              </p>
              {(selectedCategory !== 'all' || selectedEra) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedEra(null)
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(eventsByDecade)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([decade, decadeEvents]) => (
                  <div key={decade}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold px-4 py-2 rounded-lg">
                        {decade}s
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {decadeEvents.map((event, index) => {
                        const era = getEraForYear(event.year)
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="bg-gray-800/50 border-gray-700 hover:border-amber-500/50 transition-all h-full">
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                  <Badge variant="outline" className="bg-gray-700/50 text-amber-400">
                                    {event.year}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={getSignificanceBadge(event.significance)}
                                  >
                                    {event.significance === 'legendary' && '⭐ '}
                                    {event.significance.charAt(0).toUpperCase() + event.significance.slice(1)}
                                  </Badge>
                                </div>
                                <CardTitle className="text-white mt-2">{event.title}</CardTitle>
                                <CardDescription className="text-gray-400">
                                  {era && (
                                    <span className="text-xs">
                                      {era.icon} {era.name}
                                    </span>
                                  )}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                  {event.content}
                                </p>
                                <div className="mt-4 flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {event.category}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      })}
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
