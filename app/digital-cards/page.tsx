'use client';

// app/digital-cards/page.tsx
// The Hidden Digital Card Collection Page

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Trophy, 
  Sparkles, 
  Crown,
  Star,
  TrendingUp,
  Calendar,
  Flame,
  Target,
  BookOpen,
  ChevronRight,
  X
} from 'lucide-react';

// Import components (these would be from the component file)
// In production, use: import { DigitalCard, CardDiscoveryModal, ... } from '@/components/digital-cards';

// ============================================================================
// MOCK DATA FOR DEMO (Replace with actual hook in production)
// ============================================================================

const DEMO_USER_CARDS = [
  {
    id: '1',
    cardCode: 'FOUNDER_001',
    name: 'Genesis Collector',
    description: 'Awarded to those who joined CardVerse in its first month.',
    rarity: 'legendary' as const,
    series: 'Founder Series',
    seriesNumber: 1,
    totalInSeries: 10,
    powerLevel: 100,
    element: 'light' as const,
    cardType: 'character',
    discoveredAt: '2025-12-06T10:00:00Z',
    instanceNumber: 47,
    isFoil: true,
    isFirstEdition: true,
    isFavorite: true,
  },
  {
    id: '2',
    cardCode: 'EXPLORER_001',
    name: 'Curious Wanderer',
    description: 'Clicked on 50 different things in CardVerse.',
    rarity: 'common' as const,
    series: 'Explorer Series',
    seriesNumber: 1,
    totalInSeries: 25,
    powerLevel: 15,
    element: 'air' as const,
    cardType: 'character',
    discoveredAt: '2025-12-06T10:05:00Z',
    instanceNumber: 234,
    isFoil: false,
    isFirstEdition: false,
    isFavorite: false,
  },
];

const DEMO_ALL_CARDS = [
  ...DEMO_USER_CARDS,
  {
    id: '3',
    cardCode: 'KNOWLEDGE_001',
    name: 'Trivia Novice',
    description: 'Answered 10 trivia questions correctly.',
    rarity: 'common' as const,
    series: 'Knowledge Keeper Series',
    seriesNumber: 1,
    totalInSeries: 20,
    powerLevel: 15,
    element: 'light' as const,
    cardType: 'boost',
    discoveryHint: 'Answer 10 trivia questions correctly.',
  },
  {
    id: '4',
    cardCode: 'SECRETS_001',
    name: 'The Hidden One',
    description: 'You found a card that shouldn\'t exist.',
    rarity: 'mythic' as const,
    series: 'Secret Vault',
    seriesNumber: 1,
    totalInSeries: 8,
    powerLevel: 180,
    element: 'dark' as const,
    cardType: 'character',
    discoveryHint: '???',
    maxSupply: 50,
  },
];

const SERIES_DATA = [
  { code: 'FOUNDER', name: 'Founder Series', total: 10, owned: 2, reward: 'Founding Collector Title' },
  { code: 'EXPLORER', name: 'Explorer Series', total: 25, owned: 1, reward: 'Master Explorer Badge' },
  { code: 'KNOWLEDGE', name: 'Knowledge Keeper', total: 20, owned: 0, reward: 'Scholar Card' },
  { code: 'COMMUNITY', name: 'Community Champions', total: 15, owned: 0, reward: 'Champion Title' },
  { code: 'LEGENDS', name: 'Legends of CardVerse', total: 12, owned: 0, reward: 'Historian Card' },
  { code: 'SECRETS', name: 'Secret Vault', total: 8, owned: 0, reward: 'Shadow Card' },
];

// ============================================================================
// RARITY CONFIG
// ============================================================================

const RARITY_CONFIG = {
  common: { name: 'Common', color: '#9CA3AF', bgGradient: 'from-gray-400 to-gray-600' },
  uncommon: { name: 'Uncommon', color: '#22C55E', bgGradient: 'from-green-400 to-green-600' },
  rare: { name: 'Rare', color: '#3B82F6', bgGradient: 'from-blue-400 to-blue-600' },
  epic: { name: 'Epic', color: '#A855F7', bgGradient: 'from-purple-400 to-purple-600' },
  legendary: { name: 'Legendary', color: '#F59E0B', bgGradient: 'from-amber-400 to-orange-600' },
  mythic: { name: 'Mythic', color: '#EC4899', bgGradient: 'from-pink-400 via-rose-500 to-red-600' },
};

const ELEMENT_CONFIG = {
  fire: { icon: '🔥', color: '#EF4444' },
  water: { icon: '💧', color: '#3B82F6' },
  earth: { icon: '🌿', color: '#84CC16' },
  air: { icon: '💨', color: '#06B6D4' },
  light: { icon: '✨', color: '#FBBF24' },
  dark: { icon: '🌙', color: '#6366F1' },
  neutral: { icon: '⚪', color: '#9CA3AF' },
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function DigitalCardsPage() {
  const [selectedTab, setSelectedTab] = useState<'collection' | 'series' | 'stats'>('collection');
  const [selectedCard, setSelectedCard] = useState<typeof DEMO_ALL_CARDS[0] | null>(null);
  const [showHint, setShowHint] = useState(false);
  
  // In production, use the hook:
  // const { userCards, allCards, progress, discoveryState, ... } = useDigitalCards(userId);
  
  const userCards = DEMO_USER_CARDS;
  const allCards = DEMO_ALL_CARDS;
  const ownedCardCodes = new Set(userCards.map(c => c.cardCode));
  
  const stats = {
    total: 90, // Total possible cards
    owned: userCards.length,
    percentage: Math.round((userCards.length / 90) * 100),
    legendaryOwned: userCards.filter(c => c.rarity === 'legendary' || c.rarity === 'mythic').length,
    longestStreak: 7,
    favoriteCount: userCards.filter(c => c.isFavorite).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Hidden Digital Cards
            </h1>
            <Sparkles className="w-8 h-8 text-pink-400" />
          </div>
          <p className="text-gray-400">
            Discover secret cards hidden throughout CardVerse
          </p>
        </motion.div>
        
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-sm">Cards Discovered</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.owned} <span className="text-gray-500 text-sm">/ {stats.total}</span>
            </div>
            <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentage}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Rare+ Cards</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {stats.legendaryOwned}
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm">Login Streak</span>
            </div>
            <div className="text-2xl font-bold text-orange-400">
              {stats.longestStreak} days
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Star className="w-4 h-4 text-red-400" />
              <span className="text-sm">Favorites</span>
            </div>
            <div className="text-2xl font-bold text-red-400">
              {stats.favoriteCount}
            </div>
          </div>
        </motion.div>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'collection', label: 'My Collection', icon: Gift },
            { id: 'series', label: 'Card Series', icon: BookOpen },
            { id: 'stats', label: 'Discovery Tips', icon: Target },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'collection' && (
            <motion.div
              key="collection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Rarity Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(RARITY_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    className="px-3 py-1 rounded-full text-sm border transition-all hover:scale-105"
                    style={{ 
                      borderColor: config.color + '50',
                      color: config.color,
                    }}
                  >
                    {config.name}
                  </button>
                ))}
              </div>
              
              {/* Card Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {allCards.map((card, index) => {
                  const isOwned = ownedCardCodes.has(card.cardCode);
                  const rarityConfig = RARITY_CONFIG[card.rarity];
                  const elementConfig = ELEMENT_CONFIG[card.element];
                  
                  return (
                    <motion.div
                      key={card.cardCode}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedCard(card)}
                      className="cursor-pointer"
                    >
                      <div
                        className={`
                          relative rounded-xl overflow-hidden transition-all duration-300
                          ${isOwned ? 'hover:scale-105' : 'opacity-50 grayscale hover:opacity-70'}
                        `}
                        style={{
                          background: `linear-gradient(135deg, ${rarityConfig.color}20, ${rarityConfig.color}10)`,
                          border: `2px solid ${rarityConfig.color}${isOwned ? '80' : '30'}`,
                        }}
                      >
                        {/* Card Inner */}
                        <div className="p-3">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-2">
                            <span 
                              className="text-xs font-bold"
                              style={{ color: rarityConfig.color }}
                            >
                              {rarityConfig.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              #{card.seriesNumber}
                            </span>
                          </div>
                          
                          {/* Image Area */}
                          <div className="relative h-20 rounded-lg bg-gray-800 flex items-center justify-center mb-2">
                            {isOwned ? (
                              <span className="text-4xl">{elementConfig.icon}</span>
                            ) : (
                              <div className="text-center">
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mx-auto">
                                  <span className="text-gray-500 text-lg">?</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Foil indicator */}
                            {'isFoil' in card && card.isFoil && (
                              <div className="absolute top-1 right-1">
                                <Sparkles className="w-3 h-3 text-purple-400" />
                              </div>
                            )}
                          </div>
                          
                          {/* Name */}
                          <h3 className={`text-sm font-bold truncate ${isOwned ? 'text-white' : 'text-gray-500'}`}>
                            {isOwned ? card.name : '???'}
                          </h3>
                          
                          {/* Series */}
                          <p className="text-xs text-gray-500 truncate">
                            {card.series}
                          </p>
                          
                          {/* Power Level */}
                          {isOwned && (
                            <div className="flex items-center gap-1 mt-1">
                              <TrendingUp className="w-3 h-3 text-yellow-400" />
                              <span className="text-xs text-yellow-400 font-bold">{card.powerLevel}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
          
          {selectedTab === 'series' && (
            <motion.div
              key="series"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {SERIES_DATA.map((series, index) => {
                const percentage = Math.round((series.owned / series.total) * 100);
                const isComplete = series.owned >= series.total;
                
                return (
                  <motion.div
                    key={series.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      p-4 rounded-xl border cursor-pointer transition-all hover:scale-102
                      ${isComplete 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50' 
                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        {isComplete && <Trophy className="w-4 h-4 text-yellow-400" />}
                        {series.name}
                      </h3>
                      <span className="text-sm text-gray-400">
                        {series.owned}/{series.total}
                      </span>
                    </div>
                    
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-full ${
                          isComplete 
                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500' 
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Gift className="w-3 h-3" />
                        <span>{series.reward}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
          
          {selectedTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* How to Find Cards */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  How to Discover Cards
                </h2>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { icon: '🎯', title: 'Use Features', desc: 'Visit Trivia, Museum, Clubs, and Javari to unlock feature cards' },
                    { icon: '🔥', title: 'Login Streaks', desc: 'Log in daily to build streaks and unlock special cards' },
                    { icon: '🔍', title: 'Search Secrets', desc: 'Some searches unlock rare cards. Try famous card names!' },
                    { icon: '🎮', title: 'Easter Eggs', desc: 'Hidden secrets are everywhere. Can you find them all?' },
                    { icon: '🏆', title: 'Complete Series', desc: 'Finish a series to unlock the ultimate series card' },
                    { icon: '🌙', title: 'Time Matters', desc: 'Some cards only appear at certain times of day' },
                  ].map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3 p-3 bg-gray-900/50 rounded-lg"
                    >
                      <span className="text-2xl">{tip.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white">{tip.title}</h4>
                        <p className="text-sm text-gray-400">{tip.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Secret Hints */}
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  Secret Hints
                </h2>
                
                <div className="space-y-3">
                  <p className="text-gray-300 text-sm">
                    🎮 <em>"Those who know the code shall be rewarded..."</em>
                  </p>
                  <p className="text-gray-300 text-sm">
                    🔎 <em>"The holy grail of baseball awaits those who seek it by name..."</em>
                  </p>
                  <p className="text-gray-300 text-sm">
                    🌙 <em>"Night owls and early birds each have their treasures..."</em>
                  </p>
                  <p className="text-gray-300 text-sm">
                    👁️ <em>"Look closely at the footer. Something hides there..."</em>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Card Detail Modal */}
        <AnimatePresence>
          {selectedCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setSelectedCard(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="bg-gray-900 rounded-2xl max-w-md w-full p-6 border border-gray-700"
                onClick={e => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                
                {/* Card Content */}
                <div className="text-center">
                  <div 
                    className="w-20 h-20 rounded-xl mx-auto mb-4 flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${RARITY_CONFIG[selectedCard.rarity].color}40, ${RARITY_CONFIG[selectedCard.rarity].color}20)`,
                    }}
                  >
                    <span className="text-4xl">{ELEMENT_CONFIG[selectedCard.element].icon}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-1">{selectedCard.name}</h2>
                  <p 
                    className="text-sm font-semibold mb-4"
                    style={{ color: RARITY_CONFIG[selectedCard.rarity].color }}
                  >
                    {RARITY_CONFIG[selectedCard.rarity].name} • {selectedCard.series}
                  </p>
                  
                  <p className="text-gray-300 text-sm mb-6">{selectedCard.description}</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-xs text-gray-400">Power</div>
                      <div className="text-lg font-bold text-yellow-400">{selectedCard.powerLevel}</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-xs text-gray-400">Element</div>
                      <div className="text-lg">{ELEMENT_CONFIG[selectedCard.element].icon}</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-xs text-gray-400">Number</div>
                      <div className="text-lg font-bold text-white">
                        #{selectedCard.seriesNumber}/{selectedCard.totalInSeries}
                      </div>
                    </div>
                  </div>
                  
                  {/* Hint for locked cards */}
                  {!ownedCardCodes.has(selectedCard.cardCode) && selectedCard.discoveryHint && (
                    <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                      <p className="text-purple-300 text-sm">
                        <strong>Hint:</strong> {selectedCard.discoveryHint}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
