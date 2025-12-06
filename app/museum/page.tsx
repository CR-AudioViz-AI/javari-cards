'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ERAS = [
  {
    id: 'tobacco',
    name: 'Tobacco Card Era',
    years: '1880s-1945',
    icon: '🚬',
    color: 'from-amber-700 to-amber-500',
    description: 'The birth of trading cards as tobacco company inserts. These cards were designed to stiffen cigarette packs and became the first collectible cards.',
    key_events: [
      { year: 1886, event: 'Old Judge cigarettes release first baseball cards' },
      { year: 1909, event: 'T206 set released, including the legendary Honus Wagner' },
      { year: 1933, event: 'Goudey Gum produces iconic baseball card set' },
    ],
    famous_cards: [
      { name: 'T206 Honus Wagner', value: '$7.25M', year: 1909 },
      { name: '1933 Goudey Babe Ruth', value: '$4.2M', year: 1933 },
    ],
  },
  {
    id: 'postwar',
    name: 'Post-War Boom',
    years: '1945-1980',
    icon: '⚾',
    color: 'from-blue-600 to-blue-400',
    description: 'Topps establishes dominance in the market. Modern card design emerges with color photography and statistics on card backs.',
    key_events: [
      { year: 1951, event: 'Topps enters the baseball card market' },
      { year: 1952, event: 'Iconic Mickey Mantle rookie card released' },
      { year: 1956, event: 'Topps secures exclusive MLB licensing deal' },
    ],
    famous_cards: [
      { name: '1952 Topps Mickey Mantle', value: '$12.6M', year: 1952 },
      { name: '1951 Bowman Mickey Mantle RC', value: '$5.2M', year: 1951 },
    ],
  },
  {
    id: 'junkwax',
    name: 'Junk Wax Era',
    years: '1986-1993',
    icon: '📦',
    color: 'from-gray-600 to-gray-400',
    description: 'Mass production era that flooded the market. Cards were printed in enormous quantities, destroying most values.',
    key_events: [
      { year: 1986, event: 'Fleer and Donruss break Topps monopoly' },
      { year: 1989, event: 'Upper Deck revolutionizes card quality' },
      { year: 1993, event: 'Market begins to collapse from overproduction' },
    ],
    lesson: 'This era taught collectors that scarcity matters. Millions of "valuable" cards became worthless.',
    famous_cards: [
      { name: '1989 Upper Deck Ken Griffey Jr.', value: '$500K (PSA 10)', year: 1989 },
    ],
  },
  {
    id: 'modern',
    name: 'Modern Era',
    years: '1993-2010',
    icon: '✨',
    color: 'from-purple-600 to-pink-500',
    description: 'Innovation explodes with inserts, parallels, autographs, and game-used memorabilia cards.',
    key_events: [
      { year: 1993, event: 'First officially licensed autograph cards appear' },
      { year: 1996, event: 'Game-used memorabilia cards introduced' },
      { year: 2003, event: 'Exquisite Collection debuts at ultra-premium tier' },
    ],
    famous_cards: [
      { name: '2003 Exquisite LeBron James RC Auto', value: '$5.2M', year: 2003 },
      { name: '1997 PMG Michael Jordan', value: '$2.7M', year: 1997 },
    ],
  },
  {
    id: 'investment',
    name: 'Investment Era',
    years: '2010-Present',
    icon: '📈',
    color: 'from-green-600 to-emerald-500',
    description: 'Cards become alternative investments. PSA grading boom, COVID surge, and mainstream acceptance of cards as assets.',
    key_events: [
      { year: 2016, event: 'PSA submission volumes begin exponential growth' },
      { year: 2020, event: 'COVID pandemic causes massive card market boom' },
      { year: 2021, event: 'Multiple record-breaking sales above $5M' },
      { year: 2022, event: 'Fanatics acquires Topps, reshapes industry' },
    ],
    famous_cards: [
      { name: 'Pikachu Illustrator', value: '$5.275M', year: 1998 },
      { name: 'Mickey Mantle 1952 Topps', value: '$12.6M', year: 1952 },
    ],
  },
]

const TCG_HISTORY = [
  {
    id: 'mtg',
    name: 'Magic: The Gathering',
    founded: 1993,
    icon: '🌀',
    color: 'from-indigo-600 to-purple-500',
    description: 'Created by Richard Garfield and published by Wizards of the Coast, MTG invented the collectible card game genre.',
    milestones: [
      { year: 1993, event: 'Alpha set releases with 295 cards' },
      { year: 1994, event: 'Reserved List created to protect card values' },
      { year: 1999, event: 'Hasbro acquires Wizards of the Coast' },
      { year: 2019, event: 'MTG Arena launches, bringing digital play' },
    ],
    famous_cards: [
      { name: 'Black Lotus (Alpha)', value: '$540K+', year: 1993 },
      { name: 'Ancestral Recall (Beta)', value: '$120K+', year: 1993 },
    ],
  },
  {
    id: 'pokemon',
    name: 'Pokémon TCG',
    founded: 1996,
    icon: '⚡',
    color: 'from-yellow-500 to-orange-500',
    description: 'Born from the video game phenomenon, Pokémon cards became a global cultural sensation and remain one of the most popular TCGs.',
    milestones: [
      { year: 1996, event: 'Japanese Base Set released' },
      { year: 1999, event: 'US Base Set launches, Pokémania begins' },
      { year: 2000, event: 'Neo Genesis introduces Shining Pokémon' },
      { year: 2020, event: 'COVID boom sends vintage prices soaring' },
    ],
    famous_cards: [
      { name: 'Pikachu Illustrator', value: '$5.275M', year: 1998 },
      { name: '1st Ed Charizard PSA 10', value: '$420K', year: 1999 },
    ],
  },
  {
    id: 'yugioh',
    name: 'Yu-Gi-Oh!',
    founded: 1999,
    icon: '🐉',
    color: 'from-indigo-500 to-purple-600',
    description: 'Based on the manga and anime, Yu-Gi-Oh! became one of the best-selling TCGs worldwide with complex gameplay mechanics.',
    milestones: [
      { year: 1999, event: 'OCG launches in Japan' },
      { year: 2002, event: 'TCG launches in North America' },
      { year: 2004, event: 'Ghost Rares introduced' },
    ],
    famous_cards: [
      { name: 'Tournament Black Luster Soldier', value: '$2M+', year: 1999 },
      { name: 'Blue-Eyes White Dragon 1st Ed', value: '$50K+', year: 2002 },
    ],
  },
]

const LEGENDARY_CARDS = [
  {
    name: 'T206 Honus Wagner',
    category: 'Sports',
    year: 1909,
    value: '$7,250,000',
    image: '⚾',
    story: 'The "Holy Grail" of baseball cards. Honus Wagner reportedly demanded his card be pulled from production due to his opposition to tobacco, creating extreme scarcity. Only 50-200 copies are known to exist.',
  },
  {
    name: '1952 Topps Mickey Mantle #311',
    category: 'Sports',
    year: 1952,
    value: '$12,600,000',
    image: '🏆',
    story: 'The most valuable post-war sports card. Topps dumped unsold inventory into the Atlantic Ocean, accidentally creating the scarcity that makes this card legendary.',
  },
  {
    name: 'Pikachu Illustrator',
    category: 'Pokémon',
    year: 1998,
    value: '$5,275,000',
    image: '⚡',
    story: 'The rarest Pokémon card in existence. Only 39 copies were awarded to winners of a Japanese illustration contest. It was never sold commercially.',
  },
  {
    name: 'Black Lotus (Alpha)',
    category: 'MTG',
    year: 1993,
    value: '$540,000+',
    image: '🌸',
    story: 'The most powerful and iconic Magic card. Provides 3 mana of any color for free. Part of the "Power Nine" and protected by the Reserved List.',
  },
  {
    name: '1st Edition Charizard',
    category: 'Pokémon',
    year: 1999,
    value: '$420,000',
    image: '🔥',
    story: 'The symbol of Pokémania. The 1st Edition Shadowless Charizard in PSA 10 condition represents the peak of 90s nostalgia and modern collecting.',
  },
]

export default function MuseumPage() {
  const [selectedEra, setSelectedEra] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4">
            <Landmark className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold">Card History Museum</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Explore the rich history of trading cards, from tobacco inserts to modern investments. 
            Learn the stories behind the hobby legendary cards.
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="timeline">
              <Clock className="h-4 w-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="tcg">
              <Sparkles className="h-4 w-4 mr-2" />
              TCG History
            </TabsTrigger>
            <TabsTrigger value="legends">
              <Trophy className="h-4 w-4 mr-2" />
              Legends
            </TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <div className="grid gap-4">
              {ERAS.map((era, index) => (
                <motion.div
                  key={era.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
                    onClick={() => setSelectedEra(selectedEra === era.id ? null : era.id)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${era.color}`} />
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${era.color} flex items-center justify-center text-3xl flex-shrink-0`}>
                          {era.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold">{era.name}</h3>
                            <Badge variant="outline">{era.years}</Badge>
                          </div>
                          <p className="text-muted-foreground">{era.description}</p>
                          
                          {selectedEra === era.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-4 space-y-4"
                            >
                              {/* Key Events */}
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  Key Events
                                </h4>
                                <div className="space-y-2">
                                  {era.key_events.map((event, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm">
                                      <Badge variant="secondary" className="flex-shrink-0">{event.year}</Badge>
                                      <span>{event.event}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Famous Cards */}
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <Star className="h-4 w-4" />
                                  Famous Cards
                                </h4>
                                <div className="grid gap-2 sm:grid-cols-2">
                                  {era.famous_cards.map((card, i) => (
                                    <div key={i} className="p-3 rounded-lg bg-muted/50">
                                      <p className="font-medium">{card.name}</p>
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>{card.year}</span>
                                        <span>•</span>
                                        <span className="text-green-400">{card.value}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {era.lesson && (
                                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                                  <p className="text-sm text-yellow-400">
                                    <strong>Lesson:</strong> {era.lesson}
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${selectedEra === era.id ? 'rotate-90' : ''}`} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* TCG History Tab */}
          <TabsContent value="tcg" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {TCG_HISTORY.map((tcg, index) => (
                <motion.div
                  key={tcg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <div className={`h-24 bg-gradient-to-br ${tcg.color} flex items-center justify-center`}>
                      <span className="text-5xl">{tcg.icon}</span>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold">{tcg.name}</h3>
                        <Badge variant="outline">{tcg.founded}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{tcg.description}</p>
                      
                      <div className="space-y-2">
                        {tcg.milestones.slice(0, 3).map((m, i) => (
                          <div key={i} className="text-xs flex gap-2">
                            <Badge variant="secondary" className="flex-shrink-0">{m.year}</Badge>
                            <span className="text-muted-foreground">{m.event}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Legendary Cards Tab */}
          <TabsContent value="legends" className="space-y-6">
            <div className="grid gap-4">
              {LEGENDARY_CARDS.map((card, index) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="h-32 w-32 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-5xl flex-shrink-0 mx-auto md:mx-0">
                          {card.image}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                            <h3 className="text-xl font-bold">{card.name}</h3>
                            <Badge variant="outline">{card.category}</Badge>
                            <Badge variant="secondary">{card.year}</Badge>
                          </div>
                          <p className="text-3xl font-bold text-green-400 mb-3">{card.value}</p>
                          <p className="text-muted-foreground">{card.story}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Academy CTA */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Want to Learn More?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Visit the Card Academy for in-depth courses on collecting, grading, and investing.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500">
              <BookOpen className="h-5 w-5 mr-2" />
              Explore Academy
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
