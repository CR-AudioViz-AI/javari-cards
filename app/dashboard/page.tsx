'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  LayoutDashboard,
  CreditCard,
  Trophy,
  Gamepad2,
  Store,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  Star,
  Clock,
  Zap,
  FolderPlus,
} from 'lucide-react';
import { CrossSellBanner } from '@/components/cross-sell-banner';
import { UpgradeModal } from '@/components/upgrade-modal';
import { TIER_CONFIGS, SubscriptionTier, getRemainingCards } from '@/lib/tier-limits';

// Mock data - replace with real Supabase queries
const mockUserData = {
  name: 'Collector',
  tier: 'free' as SubscriptionTier,
  cardCount: 12,
  collectionValue: 450,
  achievements: 3,
  triviaPlayed: 15,
};

const mockRecentCards = [
  { id: 1, name: 'Rare Dragon', rarity: 'Rare', image: '🐉', value: 120 },
  { id: 2, name: 'Golden Phoenix', rarity: 'Epic', image: '🦅', value: 280 },
  { id: 3, name: 'Crystal Unicorn', rarity: 'Legendary', image: '🦄', value: 500 },
];

const mockActivity = [
  { id: 1, action: 'Added new card', item: 'Rare Dragon', time: '2 hours ago' },
  { id: 2, action: 'Won trivia', item: '+50 points', time: '5 hours ago' },
  { id: 3, action: 'Traded card', item: 'Common Wolf', time: '1 day ago' },
];

export default function DashboardPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [userData, setUserData] = useState(mockUserData);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const tierConfig = TIER_CONFIGS[userData.tier];
  const remainingCards = getRemainingCards(userData.cardCount, userData.tier);
  const usagePercent = tierConfig.maxCards === Infinity 
    ? 0 
    : Math.round((userData.cardCount / tierConfig.maxCards) * 100);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
      <div className="flex">
        {/* Sidebar - Fixed position, below global header */}
        <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-black/50 border-r border-purple-900/30 p-4 overflow-y-auto">
          <nav className="space-y-2">
            {[
              { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
              { icon: CreditCard, label: 'My Collection', href: '/collection' },
              { icon: Store, label: 'Marketplace', href: '/marketplace' },
              { icon: Gamepad2, label: 'Trivia', href: '/trivia' },
              { icon: Trophy, label: 'Achievements', href: '/achievements' },
              { icon: Settings, label: 'Settings', href: '/settings' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  item.active
                    ? 'bg-purple-600/30 text-purple-300'
                    : 'text-gray-400 hover:bg-purple-900/20 hover:text-purple-300'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition w-full"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content - Offset for sidebar */}
        <main className="flex-1 ml-64 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
              <p className="text-purple-300">Here&apos;s your collection overview</p>
            </div>
            <button
              onClick={() => setShowAddCard(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Add Cards
            </button>
          </div>

          {/* Cross-sell Banner */}
          <CrossSellBanner />

          {/* Tier Status */}
          <div className="mb-8 p-4 bg-black/30 rounded-xl border border-purple-900/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-medium text-white">{tierConfig.name}</span>
                {userData.tier !== 'premium' && (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded transition"
                  >
                    Upgrade
                  </button>
                )}
              </div>
              <span className="text-gray-400">
                {userData.cardCount} / {tierConfig.maxCards === Infinity ? '∞' : tierConfig.maxCards} cards
              </span>
            </div>
            {tierConfig.maxCards !== Infinity && (
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-6 bg-black/30 rounded-xl border border-purple-900/30">
              <CreditCard className="w-8 h-8 text-purple-400 mb-2" />
              <div className="text-3xl font-bold text-white">{userData.cardCount}</div>
              <div className="text-gray-400">Total Cards</div>
            </div>
            <div className="p-6 bg-black/30 rounded-xl border border-purple-900/30">
              <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
              <div className="text-3xl font-bold text-white">${userData.collectionValue}</div>
              <div className="text-gray-400">Collection Value</div>
            </div>
            <div className="p-6 bg-black/30 rounded-xl border border-purple-900/30">
              <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
              <div className="text-3xl font-bold text-white">{userData.achievements}</div>
              <div className="text-gray-400">Achievements</div>
            </div>
            <div className="p-6 bg-black/30 rounded-xl border border-purple-900/30">
              <Gamepad2 className="w-8 h-8 text-pink-400 mb-2" />
              <div className="text-3xl font-bold text-white">{userData.triviaPlayed}</div>
              <div className="text-gray-400">Trivia Played</div>
            </div>
          </div>

          {/* Recent Cards & Activity */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Cards */}
            <div className="bg-black/30 rounded-xl border border-purple-900/30 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Recent Cards</h2>
              </div>
              <div className="space-y-3">
                {mockRecentCards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{card.image}</span>
                      <div>
                        <div className="font-medium text-white">{card.name}</div>
                        <div className={`text-sm ${getRarityColor(card.rarity)}`}>{card.rarity}</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-medium">${card.value}</div>
                  </div>
                ))}
              </div>
              <Link 
                href="/collection"
                className="block mt-4 text-center text-purple-400 hover:text-purple-300 transition"
              >
                View all cards →
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-black/30 rounded-xl border border-purple-900/30 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              </div>
              <div className="space-y-3">
                {mockActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg">
                    <div>
                      <div className="font-medium text-white">{activity.action}</div>
                      <div className="text-sm text-purple-300">{activity.item}</div>
                    </div>
                    <div className="text-gray-500 text-sm">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Upgrade Modal - with all required props */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        currentTier={userData.tier}
        currentCount={userData.cardCount}
        maxAllowed={tierConfig.maxCards === Infinity ? 999999 : tierConfig.maxCards}
        onClose={() => setShowUpgradeModal(false)}
      />

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full border border-purple-900/50">
            <h2 className="text-2xl font-bold text-white mb-4">Add Cards</h2>
            <p className="text-gray-400 mb-6">Choose how you want to add cards to your collection:</p>
            
            <div className="space-y-3">
              <Link
                href="/collection/add"
                className="flex items-center gap-4 p-4 bg-purple-900/30 hover:bg-purple-900/50 rounded-xl transition"
              >
                <Plus className="w-8 h-8 text-purple-400" />
                <div>
                  <div className="font-medium text-white">Add Single Card</div>
                  <div className="text-sm text-gray-400">Manually enter card details</div>
                </div>
              </Link>
              
              <Link
                href="/collection/import"
                className="flex items-center gap-4 p-4 bg-purple-900/30 hover:bg-purple-900/50 rounded-xl transition"
              >
                <FolderPlus className="w-8 h-8 text-green-400" />
                <div>
                  <div className="font-medium text-white">Import from CSV</div>
                  <div className="text-sm text-gray-400">Bulk import your collection</div>
                </div>
              </Link>
              
              <Link
                href="/collection/scan"
                className="flex items-center gap-4 p-4 bg-purple-900/30 hover:bg-purple-900/50 rounded-xl transition"
              >
                <CreditCard className="w-8 h-8 text-blue-400" />
                <div>
                  <div className="font-medium text-white">Scan Card</div>
                  <div className="text-sm text-gray-400">Use your camera to identify cards</div>
                </div>
              </Link>
            </div>
            
            <button
              onClick={() => setShowAddCard(false)}
              className="mt-6 w-full py-3 text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="ml-64 py-6 text-center text-gray-500 text-sm border-t border-gray-800">
        © 2025 CR AudioViz AI, LLC. Part of the CRAV ecosystem.
      </footer>
    </div>
  );
}
