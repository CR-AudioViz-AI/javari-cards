'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Layers,
  Trophy,
  Users,
  GraduationCap,
  Landmark,
  Camera,
  ShoppingCart,
  Settings,
  Bot,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Star,
  Zap,
  Target,
  Gift,
  Search,
  Bell,
  Menu,
  X,
  ChevronRight,
  Crown,
  Flame,
  Shield,
  Award,
  Gamepad2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

// Sample data for demonstration
const COLLECTION_STATS = {
  total_cards: 1247,
  total_value: 45892.50,
  total_invested: 28450.00,
  profit: 17442.50,
  roi: 61.3,
  cards_added_this_week: 12,
  value_change_week: 2340.00,
  value_change_percent: 5.4,
}

const TOP_CARDS = [
  { id: '1', name: '1st Edition Charizard', set: 'Base Set', grade: 'PSA 9', value: 12500, change: 8.2, category: 'pokemon', image: '🔥' },
  { id: '2', name: 'Black Lotus', set: 'Alpha', grade: 'BGS 8.5', value: 8900, change: -2.1, category: 'mtg', image: '🌸' },
  { id: '3', name: 'Mickey Mantle RC', set: '1952 Topps', grade: 'PSA 6', value: 7200, change: 5.5, category: 'sports', image: '⚾' },
  { id: '4', name: 'Blue-Eyes White Dragon', set: 'LOB-001', grade: 'PSA 10', value: 4500, change: 12.3, category: 'yugioh', image: '🐉' },
  { id: '5', name: 'LeBron James RC', set: '2003 Topps Chrome', grade: 'PSA 10', value: 3800, change: -1.8, category: 'sports', image: '🏀' },
]

const RECENT_ACTIVITY = [
  { type: 'add', message: 'Added 3 Pokémon cards to collection', time: '2 hours ago', icon: '➕' },
  { type: 'price', message: 'Charizard VMAX increased 15%', time: '5 hours ago', icon: '📈' },
  { type: 'badge', message: 'Earned "Century Collector" badge', time: '1 day ago', icon: '🏆' },
  { type: 'club', message: 'Joined "Vintage Baseball" club', time: '2 days ago', icon: '👥' },
  { type: 'trivia', message: 'Completed MTG History quiz - 95%', time: '3 days ago', icon: '🎯' },
]

const CLUBS_PREVIEW = [
  { name: 'Braggers Club', members: 245, icon: '👑', requirement: '$10K+ collection' },
  { name: 'Reds Fan Club', members: 1832, icon: '⚾', requirement: 'Open to all' },
  { name: 'PSA 10 Hunters', members: 567, icon: '💎', requirement: 'Own 5+ PSA 10s' },
  { name: 'MTG Commander', members: 3421, icon: '⚔️', requirement: 'Open to all' },
]

const ACHIEVEMENTS = [
  { name: 'First Card', icon: '🎴', earned: true },
  { name: 'Century Club', icon: '💯', earned: true },
  { name: 'Graded Guru', icon: '📊', earned: true },
  { name: 'Trivia Master', icon: '🧠', earned: false },
  { name: 'Club Leader', icon: '👑', earned: false },
  { name: 'Trade Tycoon', icon: '🤝', earned: false },
]

const NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/', active: true },
  { name: 'Collection', icon: Layers, href: '/collection' },
  { name: 'Scanner', icon: Camera, href: '/scanner' },
  { name: 'Clubs', icon: Users, href: '/clubs' },
  { name: 'Trivia', icon: Gamepad2, href: '/trivia' },
  { name: 'Academy', icon: GraduationCap, href: '/academy' },
  { name: 'Museum', icon: Landmark, href: '/museum' },
  { name: 'Marketplace', icon: ShoppingCart, href: '/marketplace' },
  { name: 'Javari AI', icon: Bot, href: '/javari' },
]

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-40 h-screen w-72 border-r bg-card"
          >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b px-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-card" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    CardVerse
                  </h1>
                  <p className="text-xs text-muted-foreground">Pro Collector</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    item.active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                  {item.name === 'Javari AI' && (
                    <Badge variant="secondary" className="ml-auto text-xs">AI</Badge>
                  )}
                </a>
              ))}
            </nav>

            {/* User Level Progress */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Level 24</span>
                    <span className="text-xs text-muted-foreground">3,450 / 5,000 XP</span>
                  </div>
                  <Progress value={69} className="h-2 mt-1" />
                </div>
              </div>
              <Button className="w-full" variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : ''}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 border-b bg-background/80 backdrop-blur-lg">
          <div className="flex h-full items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div className="relative w-96 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cards, sets, players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted border-0"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center text-white">
                  3
                </span>
              </Button>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                RH
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-8"
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold text-white mb-2">
                Welcome back, Roy! 👋
              </h2>
              <p className="text-white/80 max-w-xl">
                Your collection is up {COLLECTION_STATS.value_change_percent}% this week. 
                You have 3 cards that might be good to sell at peak value.
              </p>
              <div className="flex gap-3 mt-4">
                <Button className="bg-white text-purple-600 hover:bg-white/90">
                  <Camera className="h-4 w-4 mr-2" />
                  Scan Card
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  View Insights
                </Button>
              </div>
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-9xl opacity-20">
              🎴
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Total Collection Value',
                value: `$${COLLECTION_STATS.total_value.toLocaleString()}`,
                change: `+$${COLLECTION_STATS.value_change_week.toLocaleString()}`,
                changePercent: COLLECTION_STATS.value_change_percent,
                icon: TrendingUp,
                color: 'from-green-500 to-emerald-500',
              },
              {
                title: 'Total Cards',
                value: COLLECTION_STATS.total_cards.toLocaleString(),
                change: `+${COLLECTION_STATS.cards_added_this_week} this week`,
                icon: Layers,
                color: 'from-blue-500 to-cyan-500',
              },
              {
                title: 'Portfolio ROI',
                value: `${COLLECTION_STATS.roi}%`,
                change: `$${COLLECTION_STATS.profit.toLocaleString()} profit`,
                icon: Target,
                color: 'from-purple-500 to-pink-500',
              },
              {
                title: 'Collector Level',
                value: 'Level 24',
                change: '1,550 XP to next level',
                icon: Award,
                color: 'from-yellow-500 to-orange-500',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                        <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                          {stat.changePercent && <TrendingUp className="h-3 w-3" />}
                          {stat.change}
                        </p>
                      </div>
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Top Cards */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Value Cards</CardTitle>
                    <CardDescription>Your most valuable cards by current market price</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TOP_CARDS.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="text-3xl">{card.image}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{card.name}</p>
                          <Badge variant={card.category as any} className="text-xs">
                            {card.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{card.set}</span>
                          <span>•</span>
                          <span className="text-yellow-500">{card.grade}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${card.value.toLocaleString()}</p>
                        <p className={`text-sm flex items-center gap-1 ${card.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {card.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {card.change >= 0 ? '+' : ''}{card.change}%
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest collection updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {RECENT_ACTIVITY.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="text-xl">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clubs & Achievements */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Clubs Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Your Clubs
                    </CardTitle>
                    <CardDescription>Connect with fellow collectors</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">Browse Clubs</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {CLUBS_PREVIEW.map((club, index) => (
                    <motion.div
                      key={club.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{club.icon}</div>
                        <div>
                          <p className="font-medium">{club.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {club.members.toLocaleString()} members
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{club.requirement}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Achievements
                    </CardTitle>
                    <CardDescription>3 of 6 earned • 150 XP available</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {ACHIEVEMENTS.map((achievement, index) => (
                    <motion.div
                      key={achievement.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex flex-col items-center p-4 rounded-xl ${
                        achievement.earned 
                          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                          : 'bg-muted/50 opacity-50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <p className="text-xs text-center font-medium">{achievement.name}</p>
                      {achievement.earned && (
                        <Badge variant="secondary" className="mt-2 text-xs">Earned</Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump into CardVerse features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { name: 'Scan Card', icon: Camera, color: 'from-purple-500 to-pink-500', description: 'AI-powered card recognition' },
                  { name: 'Play Trivia', icon: Gamepad2, color: 'from-blue-500 to-cyan-500', description: 'Test your card knowledge' },
                  { name: 'Ask Javari', icon: Bot, color: 'from-green-500 to-emerald-500', description: 'Your AI card expert' },
                  { name: 'Card Academy', icon: GraduationCap, color: 'from-orange-500 to-red-500', description: 'Learn from experts' },
                ].map((action, index) => (
                  <motion.div
                    key={action.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <div className="p-6 rounded-xl bg-muted/50 hover:bg-muted transition-all group-hover:scale-[1.02]">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-medium mb-1">{action.name}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
