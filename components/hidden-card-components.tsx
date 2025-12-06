'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================

interface HiddenCard {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  category: string;
  imageUrl: string;
  backgroundGradient: string;
  glowColor: string;
  xpReward: number;
  creditReward: number;
  isSecret: boolean;
}

interface UserCardProgress {
  discoveredCards: string[];
  totalXP: number;
  totalCredits: number;
  discoveryHistory: Array<{
    cardId: string;
    discoveredAt: string;
    location: string;
  }>;
}

interface CardDiscoveryContextType {
  userProgress: UserCardProgress;
  discoverCard: (cardId: string, location: string) => Promise<boolean>;
  hasDiscovered: (cardId: string) => boolean;
  showDiscoveryModal: boolean;
  discoveredCard: HiddenCard | null;
  closeModal: () => void;
}

// ============================================================================
// RARITY STYLES
// ============================================================================

const RARITY_STYLES = {
  common: {
    border: 'border-gray-400',
    bg: 'bg-gray-800',
    glow: '',
    text: 'text-gray-400',
    badge: 'bg-gray-700 text-gray-300'
  },
  uncommon: {
    border: 'border-green-500',
    bg: 'bg-green-900/30',
    glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]',
    text: 'text-green-400',
    badge: 'bg-green-900 text-green-300'
  },
  rare: {
    border: 'border-blue-500',
    bg: 'bg-blue-900/30',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
    text: 'text-blue-400',
    badge: 'bg-blue-900 text-blue-300'
  },
  epic: {
    border: 'border-purple-500',
    bg: 'bg-purple-900/30',
    glow: 'shadow-[0_0_25px_rgba(168,85,247,0.5)]',
    text: 'text-purple-400',
    badge: 'bg-purple-900 text-purple-300'
  },
  legendary: {
    border: 'border-amber-500',
    bg: 'bg-amber-900/30',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.6)]',
    text: 'text-amber-400',
    badge: 'bg-amber-900 text-amber-300'
  },
  mythic: {
    border: 'border-red-500',
    bg: 'bg-red-900/30',
    glow: 'shadow-[0_0_40px_rgba(239,68,68,0.7)] animate-pulse',
    text: 'text-red-400',
    badge: 'bg-red-900 text-red-300'
  }
};

// ============================================================================
// CONTEXT PROVIDER
// ============================================================================

const CardDiscoveryContext = createContext<CardDiscoveryContextType | null>(null);

export function CardDiscoveryProvider({ children }: { children: React.ReactNode }) {
  const [userProgress, setUserProgress] = useState<UserCardProgress>({
    discoveredCards: [],
    totalXP: 0,
    totalCredits: 0,
    discoveryHistory: []
  });
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [discoveredCard, setDiscoveredCard] = useState<HiddenCard | null>(null);

  // Load user progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cardverse-hidden-progress');
    if (saved) {
      try {
        setUserProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load card progress:', e);
      }
    }
  }, []);

  // Save progress when it changes
  useEffect(() => {
    localStorage.setItem('cardverse-hidden-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const hasDiscovered = useCallback((cardId: string) => {
    return userProgress.discoveredCards.includes(cardId);
  }, [userProgress.discoveredCards]);

  const discoverCard = useCallback(async (cardId: string, location: string): Promise<boolean> => {
    if (hasDiscovered(cardId)) return false;

    // Fetch card details (in real app, from API)
    try {
      const response = await fetch(`/api/hidden-cards/${cardId}`);
      if (!response.ok) return false;
      
      const card: HiddenCard = await response.json();
      
      // Update progress
      setUserProgress(prev => ({
        discoveredCards: [...prev.discoveredCards, cardId],
        totalXP: prev.totalXP + card.xpReward,
        totalCredits: prev.totalCredits + card.creditReward,
        discoveryHistory: [
          ...prev.discoveryHistory,
          { cardId, discoveredAt: new Date().toISOString(), location }
        ]
      }));

      // Show discovery modal
      setDiscoveredCard(card);
      setShowDiscoveryModal(true);

      // Play discovery sound
      try {
        const audio = new Audio('/sounds/card-discover.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch {}

      return true;
    } catch (error) {
      console.error('Failed to discover card:', error);
      return false;
    }
  }, [hasDiscovered]);

  const closeModal = useCallback(() => {
    setShowDiscoveryModal(false);
    setTimeout(() => setDiscoveredCard(null), 300);
  }, []);

  return (
    <CardDiscoveryContext.Provider value={{
      userProgress,
      discoverCard,
      hasDiscovered,
      showDiscoveryModal,
      discoveredCard,
      closeModal
    }}>
      {children}
      <CardDiscoveryModal />
    </CardDiscoveryContext.Provider>
  );
}

export function useCardDiscovery() {
  const context = useContext(CardDiscoveryContext);
  if (!context) {
    throw new Error('useCardDiscovery must be used within CardDiscoveryProvider');
  }
  return context;
}

// ============================================================================
// DISCOVERY MODAL - Celebration when card is found
// ============================================================================

function CardDiscoveryModal() {
  const context = useContext(CardDiscoveryContext);
  if (!context) return null;

  const { showDiscoveryModal, discoveredCard, closeModal } = context;
  const rarity = discoveredCard?.rarity || 'common';
  const styles = RARITY_STYLES[rarity];

  return (
    <AnimatePresence>
      {showDiscoveryModal && discoveredCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* Particle effects for legendary+ */}
          {(rarity === 'legendary' || rarity === 'mythic') && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ 
                    background: discoveredCard.glowColor,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [1, 0.8, 0],
                    y: [0, -100 - Math.random() * 200],
                    x: [(Math.random() - 0.5) * 200]
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 0.5,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          )}

          {/* Card Container */}
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, rotateY: -180 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow effect */}
            <div 
              className="absolute inset-0 blur-3xl opacity-50"
              style={{ background: discoveredCard.backgroundGradient }}
            />

            {/* Card */}
            <div className={`
              relative w-80 rounded-2xl overflow-hidden
              ${styles.border} border-4 ${styles.glow}
            `}>
              {/* Card Header */}
              <div 
                className="p-6 text-center"
                style={{ background: discoveredCard.backgroundGradient }}
              >
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-xs uppercase tracking-widest text-white/70">
                    🎉 New Card Discovered!
                  </span>
                </motion.div>
              </div>

              {/* Card Image */}
              <div className="relative h-48 bg-black/50 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-8xl"
                >
                  {rarity === 'mythic' ? '🌟' : 
                   rarity === 'legendary' ? '⭐' :
                   rarity === 'epic' ? '💎' :
                   rarity === 'rare' ? '💠' :
                   rarity === 'uncommon' ? '🔹' : '🃏'}
                </motion.div>
              </div>

              {/* Card Info */}
              <div className="p-6 bg-gray-900">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {/* Rarity Badge */}
                  <div className="flex justify-center mb-3">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-bold uppercase
                      ${styles.badge}
                    `}>
                      {rarity}
                    </span>
                  </div>

                  {/* Card Name */}
                  <h3 className={`text-2xl font-bold text-center mb-2 ${styles.text}`}>
                    {discoveredCard.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-center text-sm mb-4">
                    {discoveredCard.description}
                  </p>

                  {/* Rewards */}
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">⚡</span>
                      <span className="text-white font-bold">+{discoveredCard.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">💰</span>
                      <span className="text-white font-bold">+{discoveredCard.creditReward} Credits</span>
                    </div>
                  </div>
                </motion.div>

                {/* Close Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={closeModal}
                  className="
                    w-full mt-6 py-3 rounded-xl font-bold
                    bg-gradient-to-r from-purple-600 to-pink-600
                    hover:from-purple-500 hover:to-pink-500
                    transition-all duration-300 text-white
                  "
                >
                  Awesome! 🎴
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// HIDDEN CARD DISPLAY - Shows a card in collection
// ============================================================================

interface HiddenCardDisplayProps {
  card: HiddenCard;
  isDiscovered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showHint?: boolean;
  onClick?: () => void;
}

export function HiddenCardDisplay({ 
  card, 
  isDiscovered = false, 
  size = 'md',
  showHint = false,
  onClick 
}: HiddenCardDisplayProps) {
  const styles = RARITY_STYLES[card.rarity];
  
  const sizeClasses = {
    sm: 'w-32 h-44',
    md: 'w-48 h-64',
    lg: 'w-64 h-80'
  };

  if (!isDiscovered) {
    return (
      <div 
        className={`
          ${sizeClasses[size]} rounded-xl bg-gray-800 border-2 border-gray-700
          flex flex-col items-center justify-center p-4 cursor-pointer
          hover:border-gray-600 transition-all duration-300
          ${card.isSecret ? 'border-dashed' : ''}
        `}
        onClick={onClick}
      >
        <div className="text-4xl mb-2 opacity-30">❓</div>
        <div className="text-gray-500 text-xs text-center">
          {card.isSecret ? '???' : 'Undiscovered'}
        </div>
        {showHint && !card.isSecret && (
          <div className="mt-2 text-gray-600 text-xs text-center italic">
            Hint: {card.discoveryHint || 'Keep exploring...'}
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${sizeClasses[size]} rounded-xl overflow-hidden cursor-pointer
        ${styles.border} border-2 ${styles.glow}
        transition-all duration-300
      `}
      onClick={onClick}
    >
      {/* Card Background */}
      <div 
        className="h-1/2 flex items-center justify-center"
        style={{ background: card.backgroundGradient }}
      >
        <span className="text-5xl">
          {card.rarity === 'mythic' ? '🌟' : 
           card.rarity === 'legendary' ? '⭐' :
           card.rarity === 'epic' ? '💎' :
           card.rarity === 'rare' ? '💠' :
           card.rarity === 'uncommon' ? '🔹' : '🃏'}
        </span>
      </div>

      {/* Card Info */}
      <div className={`h-1/2 p-3 ${styles.bg}`}>
        <span className={`
          px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
          ${styles.badge}
        `}>
          {card.rarity}
        </span>
        <h4 className={`font-bold mt-1 text-sm ${styles.text}`}>
          {card.name}
        </h4>
        <p className="text-gray-500 text-xs line-clamp-2">
          {card.description}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// COLLECTION GRID - Shows all hidden cards
// ============================================================================

interface CollectionGridProps {
  cards: HiddenCard[];
  discoveredIds: string[];
  showSecrets?: boolean;
  onCardClick?: (card: HiddenCard) => void;
}

export function HiddenCardCollectionGrid({ 
  cards, 
  discoveredIds,
  showSecrets = false,
  onCardClick 
}: CollectionGridProps) {
  const visibleCards = showSecrets ? cards : cards.filter(c => !c.isSecret || discoveredIds.includes(c.id));
  
  const discovered = visibleCards.filter(c => discoveredIds.includes(c.id));
  const undiscovered = visibleCards.filter(c => !discoveredIds.includes(c.id));

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white">
            {discovered.length}/{visibleCards.length}
          </div>
          <div className="text-gray-400 text-sm">Cards Found</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">
            {Math.round((discovered.length / visibleCards.length) * 100)}%
          </div>
          <div className="text-gray-400 text-sm">Completion</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">
            {discovered.reduce((sum, c) => sum + c.xpReward, 0)}
          </div>
          <div className="text-gray-400 text-sm">Total XP</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">
            {discovered.reduce((sum, c) => sum + c.creditReward, 0)}
          </div>
          <div className="text-gray-400 text-sm">Credits Earned</div>
        </div>
      </div>

      {/* Discovered Cards */}
      {discovered.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🎴</span> Discovered ({discovered.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {discovered.map(card => (
              <HiddenCardDisplay
                key={card.id}
                card={card}
                isDiscovered={true}
                size="sm"
                onClick={() => onCardClick?.(card)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Undiscovered Cards */}
      {undiscovered.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-500 mb-4 flex items-center gap-2">
            <span>❓</span> Undiscovered ({undiscovered.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {undiscovered.map(card => (
              <HiddenCardDisplay
                key={card.id}
                card={card}
                isDiscovered={false}
                size="sm"
                showHint={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DISCOVERY TRIGGER HOOK - Use in pages to trigger card discovery
// ============================================================================

interface DiscoveryTriggerOptions {
  cardId: string;
  location: string;
  condition?: () => boolean;
  delay?: number;
}

export function useDiscoveryTrigger({ 
  cardId, 
  location, 
  condition = () => true,
  delay = 0 
}: DiscoveryTriggerOptions) {
  const { discoverCard, hasDiscovered } = useCardDiscovery();

  useEffect(() => {
    if (hasDiscovered(cardId)) return;
    if (!condition()) return;

    const timer = setTimeout(() => {
      discoverCard(cardId, location);
    }, delay);

    return () => clearTimeout(timer);
  }, [cardId, location, condition, delay, discoverCard, hasDiscovered]);
}

// ============================================================================
// KONAMI CODE HOOK - Easter egg listener
// ============================================================================

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function useKonamiCode(onActivate: () => void) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase() === 'b' || e.key.toLowerCase() === 'a' 
        ? e.key.toLowerCase() 
        : e.key;
      
      if (key === KONAMI_CODE[index] || key === KONAMI_CODE[index].toLowerCase()) {
        if (index === KONAMI_CODE.length - 1) {
          onActivate();
          setIndex(0);
        } else {
          setIndex(i => i + 1);
        }
      } else {
        setIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, onActivate]);
}

// ============================================================================
// SCROLL DEPTH TRACKER
// ============================================================================

export function useScrollDepthTracker(threshold: number = 100) {
  const [maxDepth, setMaxDepth] = useState(0);
  const [reachedThreshold, setReachedThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      
      if (depth > maxDepth) {
        setMaxDepth(depth);
        if (depth >= threshold && !reachedThreshold) {
          setReachedThreshold(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [maxDepth, threshold, reachedThreshold]);

  return { maxDepth, reachedThreshold };
}

// ============================================================================
// HIDDEN ELEMENT COMPONENT
// ============================================================================

interface HiddenTriggerProps {
  cardId: string;
  location: string;
  clicksRequired?: number;
  className?: string;
  children: React.ReactNode;
}

export function HiddenCardTrigger({ 
  cardId, 
  location, 
  clicksRequired = 3,
  className = '',
  children 
}: HiddenTriggerProps) {
  const [clicks, setClicks] = useState(0);
  const { discoverCard, hasDiscovered } = useCardDiscovery();

  const handleClick = useCallback(() => {
    if (hasDiscovered(cardId)) return;
    
    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks >= clicksRequired) {
      discoverCard(cardId, location);
    }
  }, [clicks, clicksRequired, cardId, location, discoverCard, hasDiscovered]);

  return (
    <div 
      className={`cursor-pointer select-none ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  RARITY_STYLES,
  CardDiscoveryContext
};

export type {
  HiddenCard,
  UserCardProgress,
  CardDiscoveryContextType
};
