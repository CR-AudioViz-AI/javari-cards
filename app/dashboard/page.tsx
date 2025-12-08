'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  CreditCard, 
  Trophy, 
  Star, 
  Settings, 
  TrendingUp,
  Store,
  Users,
  Gamepad2,
  LogOut,
  Sparkles
} from 'lucide-react';

interface UserStats {
  totalCards: number;
  totalValue: number;
  rareCards: number;
  gamesPlayed: number;
  achievementsUnlocked: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    totalCards: 0,
    totalValue: 0,
    rareCards: 0,
    gamesPlayed: 0,
    achievementsUnlocked: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalCards: 47,
        totalValue: 1250,
        rareCards: 8,
        gamesPlayed: 23,
        achievementsUnlocked: 12,
      });
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard', active: true },
    { icon: CreditCard, label: 'My Cards', href: '/collection' },
    { icon: Store, label: 'Marketplace', href: '/marketplace' },
    { icon: Gamepad2, label: 'Trivia', href: '/trivia' },
    { icon: Trophy, label: 'Achievements', href: '/clubs' },
    { icon: Sparkles, label: 'Exclusives', href: '/exclusives' },
    { icon: Users, label: 'Clubs', href: '/clubs' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const quickActions = [
    { label: 'Open Pack', href: '/collection?action=pack', icon: '🎴' },
    { label: 'Play Trivia', href: '/trivia', icon: '🎮' },
    { label: 'Browse Market', href: '/marketplace', icon: '🛒' },
    { label: 'View Museum', href: '/museum', icon: '🏛️' },
  ];

  const recentCards = [
    { name: 'Mickey Mouse Vintage', rarity: 'Legendary', value: '$450', image: '🏰' },
    { name: 'Cinderella Castle', rarity: 'Rare', value: '$85', image: '👸' },
    { name: 'Space Mountain', rarity: 'Epic', value: '$120', image: '🚀' },
    { name: 'Pirates of Caribbean', rarity: 'Rare', value: '$75', image: '🏴‍☠️' },
  ];

  const rarityColors: Record<string, string> = {
    'Common': 'text-gray-400',
    'Rare': 'text-blue-400',
    'Epic': 'text-purple-400',
    'Legendary': 'text-yellow-400',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 min-h-screen flex-col border-r border-purple-900/30 bg-black/30">
          <div className="p-6 border-b border-purple-900/30">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">🎴</span>
              <span className="text-xl font-bold text-purple-400">CardVerse</span>
            </Link>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    item.active
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-purple-900/30">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, Collector</h1>
            <p className="text-gray-400">Manage your digital card collection</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Cards', value: stats.totalCards, icon: '🎴', color: 'purple' },
              { label: 'Collection Value', value: `$${stats.totalValue.toLocaleString()}`, icon: '💰', color: 'green' },
              { label: 'Rare Cards', value: stats.rareCards, icon: '⭐', color: 'yellow' },
              { label: 'Trivia Played', value: stats.gamesPlayed, icon: '🎮', color: 'blue' },
              { label: 'Achievements', value: stats.achievementsUnlocked, icon: '🏆', color: 'amber' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {loading ? '...' : stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 transition"
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="font-medium text-purple-100">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity & Collection Preview */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Cards */}
            <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Recent Cards</h2>
                <Link href="/collection" className="text-purple-400 text-sm hover:underline">
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {recentCards.map((card, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-purple-950/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{card.image}</span>
                      <div>
                        <p className="text-gray-200 font-medium">{card.name}</p>
                        <p className={`text-xs ${rarityColors[card.rarity]}`}>{card.rarity}</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-semibold">{card.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: 'Opened card pack', item: '3 new cards!', time: '1 hour ago' },
                  { action: 'Won trivia match', item: '+50 points', time: '3 hours ago' },
                  { action: 'Listed on marketplace', item: 'Goofy Classic', time: '1 day ago' },
                  { action: 'Earned achievement', item: 'Card Collector I', time: '2 days ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-purple-700/30 last:border-0">
                    <div>
                      <p className="text-gray-200">{activity.action}</p>
                      <p className="text-sm text-purple-400">{activity.item}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
