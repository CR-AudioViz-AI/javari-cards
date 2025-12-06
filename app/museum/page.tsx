'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Landmark,
  ChevronLeft,
  ChevronRight,
  Clock,
  Star,
  BookOpen,
  Play,
  Award,
  Calendar,
  DollarSign,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ERAS = [
  {
    id: 'tobacco',
    name: 'Tobacco Era',
    years: '1880s-1945',
    icon: '🚬',
    color: 'from-amber-700 to-amber-900',
    description: 'The birth of trading cards as tobacco company inserts',
    keyFacts: [
      'First sports cards appeared in cigarette packs',
      'T206 set is the most famous tobacco card set',
      'Cards were used as stiffeners for cigarette packages',
    ],
  },
  {
    id: 'postwar',
    name: 'Post-War Boom',
    years: '1945-1980',
    icon: '🏭',
    color: 'from-blue-700 to-blue-900',
    description: 'Topps establishes dominance, modern card design emerges',
    keyFacts: [
      'Topps became the dominant card manufacturer',
      '1952 Topps set revolutionized card design',
      'Bubble gum became standard inclusion',
    ],
  },
  {
    id: 'junkwax',
    name: 'Junk Wax Era',
    years: '1986-1993',
    icon: '📦',
    color: 'from-gray-600 to-gray-800',
    description: 'Mass production era that flooded the market',
    keyFacts: [
      'Multiple manufacturers led to overproduction',
      'Millions of cards became essentially worthless',
      'Upper Deck introduced premium cards in 1989',
    ],
  },
  {
    id: 'modern',
    name: 'Modern Era',
    years: '1993-2010',
    icon: '✨',
    color: 'from-purple-700 to-purple-900',
    description: 'Inserts, parallels, autos, and game-used materials emerge',
    keyFacts: [
      'Serial numbering became standard',
      'Game-used memorabilia cards introduced',
      'On-card autographs gained popularity',
    ],
  },
  {
    id: 'investment',
    name: 'Investment Era',
    years: '2010-Present',
    icon: '📈',
    color: 'from-green-700 to-green-900',
    description: 'Cards become alternative investments, PSA boom occurs',
    keyFacts: [
      '2020 COVID boom sent values skyrocketing',
      'PSA submissions increased 10x',
      'Record-breaking sales became common',
    ],
  },
]

const FAMOUS_CARDS = [
  {
    id: '1',
    name: 'T206 Honus Wagner',
    category: 'sports',
    year: 1909,
    image: '⚾',
    record_sale: '$7,250,000',
    sale_date: '2022',
    description: 'The most famous and valuable baseball card in existence.',
    story: 'Wagner reportedly demanded the card be pulled from production due to his opposition to tobacco, creating extreme scarcity. Only 50-200 copies are known to exist.',
    rarity: 'mythic',
  },
  {
    id: '2',
    name: '1952 Topps Mickey Mantle #311',
    category: 'sports',
    year: 1952,
    image: '🏟️',
    record_sale: '$12,600,000',
    sale_date: '2022',
    description: 'The most valuable post-war sports card.',
    story: 'Unsold 1952 Topps inventory was famously dumped into the Atlantic Ocean, inadvertently creating scarcity for this iconic card.',
    rarity: 'legendary',
  },
  {
    id: '3',
    name: 'Pikachu Illustrator',
    category: 'pokemon',
    year: 1998,
    image: '⚡',
    record_sale: '$5,275,000',
    sale_date: '2021',
    description: 'The rarest and most valuable Pokémon card.',
    story: 'Only 39 copies were awarded to winners of illustration contests in Japanese CoroCoro magazine. It says "Illustrator" instead of "Trainer."',
    rarity: 'mythic',
  },
  {
    id: '4',
    name: '1st Edition Charizard',
    category: 'pokemon',
    year: 1999,
    image: '🔥',
    record_sale: '$420,000',
    sale_date: '2022',
    description: 'The most iconic Pokémon card, symbol of Pokémania.',
    story: 'The 1st Edition Shadowless Charizard became the face of the 90s Pokémon craze and remains the most sought-after Pokémon card for collectors.',
    rarity: 'legendary',
  },
  {
    id: '5',
    name: 'Black Lotus (Alpha)',
    category: 'mtg',
    year: 1993,
    image: '🌸',
    record_sale: '$540,000',
    sale_date: '2021',
    description: 'The most powerful and valuable MTG card.',
    story: 'Part of the Power Nine, Black Lotus is on the Reserved List and will never be reprinted. It provides 3 mana of any color for free, making it absurdly powerful.',
    rarity: 'mythic',
  },
  {
    id: '6',
    name: '2003 Exquisite LeBron RC',
    category: 'sports',
    year: 2003,
    image: '🏀',
    record_sale: '$5,200,000',
    sale_date: '2022',
    description: 'The modern basketball card king.',
    story: 'Limited to just 99 copies, this on-card autograph patch card represents the modern sports card investment era and LeBron\'s status as an all-time great.',
    rarity: 'legendary',
  },
]

const ARTICLES = [
  {
    id: '1',
    title: 'The T206 Honus Wagner Story',
    category: 'history',
    read_time: '8 min',
    image: '⚾',
    preview: 'The fascinating story behind the most valuable baseball card ever made...',
  },
  {
    id: '2',
    title: 'The Rise and Fall of Junk Wax',
    category: 'history',
    read_time: '12 min',
    image: '📦',
    preview: 'How overproduction destroyed an entire generation of card values...',
  },
  {
    id: '3',
    title: 'The Birth of Magic: The Gathering',
    category: 'tcg',
    read_time: '10 min',
    image: '✨',
    preview: 'Richard Garfield\'s revolutionary game that created a new hobby...',
  },
  {
    id: '4',
    title: 'Pokémania: When Cards Took Over the World',
    category: 'pokemon',
    read_time: '15 min',
    image: '⚡',
    preview: 'The explosive 1999 phenomenon that changed collecting forever...',
  },
  {
    id: '5',
    title: 'Understanding Card Grading',
    category: 'education',
    read_time: '6 min',
    image: '📊',
    preview: 'PSA, BGS, CGC: What the grades mean and why they matter...',
  },
]

export default function MuseumPage() {
  const [selectedEra, setSelectedEra] = useState(ERAS[0])
  const [activeTab, setActiveTab] = useState('eras')

  const getRarityClass = (rarity: string) => {
    const classes: Record<string, string> = {
      legendary: 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10',
      mythic: 'border-red-500/50 bg-gradient-to-br from-red-500/10 to-purple-500/10',
    }
    return classes[rarity] || ''
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <Landmark className="h-8 w-8" />
            Card History Museum
          </h1>
          <p className="text-muted-foreground">Explore the rich history of trading cards</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="eras">Historical Eras</TabsTrigger>
          <TabsTrigger value="famous">Famous Cards</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
        </TabsList>

        {/* ERAS TAB */}
        <TabsContent value="eras" className="space-y-6">
          {/* Timeline */}
          <div className="flex gap-2 overflow-x-auto pb-4">
            {ERAS.map((era) => (
              <Button
                key={era.id}
                variant={selectedEra.id === era.id ? 'default' : 'outline'}
                className={`min-w-fit gap-2 ${selectedEra.id === era.id ? `bg-gradient-to-r ${era.color}` : ''}`}
                onClick={() => setSelectedEra(era)}
              >
                <span>{era.icon}</span>
                <span>{era.name}</span>
              </Button>
            ))}
          </div>

          {/* Selected Era Details */}
          <motion.div
            key={selectedEra.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden">
              <div className={`h-48 bg-gradient-to-r ${selectedEra.color} flex items-center justify-center`}>
                <div className="text-center text-white">
                  <span className="text-6xl mb-4 block">{selectedEra.icon}</span>
                  <h2 className="text-3xl font-display font-bold">{selectedEra.name}</h2>
                  <p className="text-white/80">{selectedEra.years}</p>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-lg mb-6">{selectedEra.description}</p>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Key Facts
                </h3>
                <ul className="space-y-2">
                  {selectedEra.keyFacts.map((fact, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-1 text-primary" />
                      <span className="text-muted-foreground">{fact}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* FAMOUS CARDS TAB */}
        <TabsContent value="famous" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FAMOUS_CARDS.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`overflow-hidden h-full ${getRarityClass(card.rarity)}`}>
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-7xl relative">
                    {card.image}
                    <Badge 
                      variant={card.rarity as any} 
                      className="absolute top-3 right-3"
                    >
                      {card.rarity}
                    </Badge>
                    <Badge 
                      variant={card.category as any} 
                      className="absolute top-3 left-3"
                    >
                      {card.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{card.name}</h3>
                      <span className="text-sm text-muted-foreground">{card.year}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">Record Sale</p>
                        <p className="font-bold text-green-400">{card.record_sale}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Year</p>
                        <p className="font-medium">{card.sale_date}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Full Story
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* ARTICLES TAB */}
        <TabsContent value="articles" className="space-y-4">
          {ARTICLES.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
                    {article.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{article.preview}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline" className="text-xs">{article.category}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.read_time}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
