'use client';

// hooks/useDigitalCards.ts
// React hook for tracking user actions and discovering hidden digital cards

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface DigitalCard {
  id: string;
  cardCode: string;
  name: string;
  description: string;
  rarity: string;
  series: string;
  seriesNumber: number;
  totalInSeries: number;
  powerLevel: number;
  element: string;
  cardType: string;
  maxSupply?: number;
  currentSupply?: number;
}

interface DiscoveredCard extends DigitalCard {
  instanceNumber: number;
  isFirstEdition: boolean;
  isFoil: boolean;
  discoveredAt: string;
}

interface UserProgress {
  featureUses: Record<string, number>;
  achievementsUnlocked: string[];
  secretsFound: string[];
  totalCardsDiscovered: number;
  dailyLoginStreak: number;
  lastLoginDate: string;
  weeklyDiscoveries: number;
  rarestCardFound: string;
  completeSeries: string[];
}

interface DiscoveryState {
  isDiscovering: boolean;
  discoveredCard: DiscoveredCard | null;
  pendingDiscovery: { cardCode: string; triggerType: string } | null;
}

// ============================================================================
// SECRET TRIGGERS - Easter Eggs
// ============================================================================

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const SECRET_SEARCHES = [
  { query: 't206 honus wagner', cardCode: 'SECRETS_004' },
  { query: 'black lotus alpha', cardCode: 'SECRETS_005' },
  { query: 'pikachu illustrator', cardCode: 'SECRETS_006' },
];

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useDigitalCards(userId: string | null) {
  const [userCards, setUserCards] = useState<DiscoveredCard[]>([]);
  const [allCards, setAllCards] = useState<DigitalCard[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [discoveryState, setDiscoveryState] = useState<DiscoveryState>({
    isDiscovering: false,
    discoveredCard: null,
    pendingDiscovery: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs for tracking
  const konamiProgress = useRef<string[]>([]);
  const scrollDistance = useRef(0);
  const clickCount = useRef(0);
  const searchQueries = useRef<string[]>([]);
  const featureVisits = useRef<Set<string>>(new Set());
  
  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  
  const fetchUserCards = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(
        `/api/digital-cards?action=user-cards&userId=${userId}`
      );
      const data = await response.json();
      if (data.success) {
        setUserCards(data.cards);
      }
    } catch (error) {
      console.error('Failed to fetch user cards:', error);
    }
  }, [userId]);
  
  const fetchAllCards = useCallback(async () => {
    try {
      const response = await fetch('/api/digital-cards?action=all-cards');
      const data = await response.json();
      if (data.success) {
        setAllCards(data.cards);
      }
    } catch (error) {
      console.error('Failed to fetch all cards:', error);
    }
  }, []);
  
  const fetchProgress = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(
        `/api/digital-cards?action=user-progress&userId=${userId}`
      );
      const data = await response.json();
      if (data.success && data.progress) {
        setProgress({
          featureUses: data.progress.feature_uses || {},
          achievementsUnlocked: data.progress.achievements_unlocked || [],
          secretsFound: data.progress.secrets_found || [],
          totalCardsDiscovered: data.progress.total_cards_discovered || 0,
          dailyLoginStreak: data.progress.daily_login_streak || 0,
          lastLoginDate: data.progress.last_login_date || '',
          weeklyDiscoveries: data.progress.weekly_discoveries || 0,
          rarestCardFound: data.progress.rarest_card_found || 'common',
          completeSeries: data.progress.complete_series || [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  }, [userId]);
  
  // ============================================================================
  // CARD DISCOVERY
  // ============================================================================
  
  const discoverCard = useCallback(async (
    cardCode: string,
    triggerType: string,
    triggerDetails: Record<string, unknown> = {},
    pageLocation: string = window.location.pathname
  ) => {
    if (!userId) return null;
    
    setDiscoveryState(prev => ({ ...prev, isDiscovering: true }));
    
    try {
      const response = await fetch('/api/digital-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'discover',
          userId,
          cardCode,
          triggerType,
          triggerDetails,
          pageLocation,
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.card) {
        setDiscoveryState({
          isDiscovering: false,
          discoveredCard: data.card,
          pendingDiscovery: null,
        });
        
        // Refresh user cards
        await fetchUserCards();
        await fetchProgress();
        
        return data.card;
      } else {
        setDiscoveryState(prev => ({ ...prev, isDiscovering: false }));
        return null;
      }
    } catch (error) {
      console.error('Failed to discover card:', error);
      setDiscoveryState(prev => ({ ...prev, isDiscovering: false }));
      return null;
    }
  }, [userId, fetchUserCards, fetchProgress]);
  
  const clearDiscoveredCard = useCallback(() => {
    setDiscoveryState({
      isDiscovering: false,
      discoveredCard: null,
      pendingDiscovery: null,
    });
  }, []);
  
  // ============================================================================
  // PROGRESS TRACKING
  // ============================================================================
  
  const trackFeatureUse = useCallback(async (feature: string) => {
    if (!userId) return;
    
    featureVisits.current.add(feature);
    
    try {
      const response = await fetch('/api/digital-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-progress',
          userId,
          progressType: 'feature_use',
          feature,
        }),
      });
      
      const data = await response.json();
      
      // Check if a card was unlocked
      if (data.unlockedCard) {
        setDiscoveryState(prev => ({
          ...prev,
          pendingDiscovery: data.unlockedCard,
        }));
      }
    } catch (error) {
      console.error('Failed to track feature use:', error);
    }
  }, [userId]);
  
  const trackDailyLogin = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/digital-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-progress',
          userId,
          progressType: 'daily_login',
        }),
      });
      
      const data = await response.json();
      
      if (data.unlockedCard) {
        setDiscoveryState(prev => ({
          ...prev,
          pendingDiscovery: data.unlockedCard,
        }));
      }
    } catch (error) {
      console.error('Failed to track daily login:', error);
    }
  }, [userId]);
  
  const trackSearch = useCallback(async (query: string) => {
    const normalizedQuery = query.toLowerCase().trim();
    searchQueries.current.push(normalizedQuery);
    
    // Check for secret search triggers
    const secretMatch = SECRET_SEARCHES.find(s => 
      normalizedQuery.includes(s.query)
    );
    
    if (secretMatch && userId) {
      // Check if user already has this card
      const alreadyOwned = userCards.some(c => c.cardCode === secretMatch.cardCode);
      if (!alreadyOwned) {
        await discoverCard(
          secretMatch.cardCode,
          'secret',
          { search_query: normalizedQuery },
          'search'
        );
      }
    }
  }, [userId, userCards, discoverCard]);
  
  const trackSecret = useCallback(async (secretId: string) => {
    if (!userId) return;
    
    try {
      await fetch('/api/digital-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-progress',
          userId,
          progressType: 'secret',
          secretId,
        }),
      });
    } catch (error) {
      console.error('Failed to track secret:', error);
    }
  }, [userId]);
  
  // ============================================================================
  // EASTER EGG LISTENERS
  // ============================================================================
  
  useEffect(() => {
    if (!userId) return;
    
    // Konami Code Detection
    const handleKeyDown = (e: KeyboardEvent) => {
      konamiProgress.current.push(e.key);
      
      // Keep only the last N keys where N is the length of the code
      if (konamiProgress.current.length > KONAMI_CODE.length) {
        konamiProgress.current.shift();
      }
      
      // Check if code matches
      if (konamiProgress.current.join(',') === KONAMI_CODE.join(',')) {
        const alreadyOwned = userCards.some(c => c.cardCode === 'EXPLORER_008');
        if (!alreadyOwned) {
          discoverCard('EXPLORER_008', 'secret', { easter_egg: 'konami_code' });
        }
        konamiProgress.current = [];
      }
    };
    
    // Scroll Distance Tracking
    const handleScroll = () => {
      scrollDistance.current += Math.abs(window.scrollY);
      
      // Award card at 10000px scroll
      if (scrollDistance.current >= 10000) {
        const alreadyOwned = userCards.some(c => c.cardCode === 'EXPLORER_004');
        if (!alreadyOwned) {
          discoverCard('EXPLORER_004', 'feature_use', { scroll_distance: scrollDistance.current });
        }
      }
    };
    
    // Click Tracking
    const handleClick = () => {
      clickCount.current++;
      
      // Award card at 50 clicks
      if (clickCount.current === 50) {
        const alreadyOwned = userCards.some(c => c.cardCode === 'EXPLORER_001');
        if (!alreadyOwned) {
          discoverCard('EXPLORER_001', 'feature_use', { clicks: 50 });
        }
      }
    };
    
    // Dev Console Detection
    const detectDevTools = () => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        const alreadyOwned = userCards.some(c => c.cardCode === 'SECRETS_003');
        if (!alreadyOwned) {
          discoverCard('SECRETS_003', 'secret', { easter_egg: 'dev_console' });
        }
      }
    };
    
    // Time-based Easter Eggs
    const checkTimeBasedEasterEggs = () => {
      const hour = new Date().getHours();
      
      // Night Owl (midnight to 4am)
      if (hour >= 0 && hour < 4) {
        const alreadyOwned = userCards.some(c => c.cardCode === 'EXPLORER_002');
        if (!alreadyOwned) {
          discoverCard('EXPLORER_002', 'secret', { time_range: { start: '00:00', end: '04:00' } });
        }
      }
      
      // Early Bird (5am to 7am)
      if (hour >= 5 && hour < 7) {
        const alreadyOwned = userCards.some(c => c.cardCode === 'EXPLORER_003');
        if (!alreadyOwned) {
          discoverCard('EXPLORER_003', 'secret', { time_range: { start: '05:00', end: '07:00' } });
        }
      }
    };
    
    // Add listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', detectDevTools);
    
    // Run time check once on mount
    checkTimeBasedEasterEggs();
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', detectDevTools);
    };
  }, [userId, userCards, discoverCard]);
  
  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchAllCards(),
        fetchUserCards(),
        fetchProgress(),
      ]);
      setIsLoading(false);
      
      // Track daily login
      if (userId) {
        trackDailyLogin();
      }
    };
    
    init();
  }, [fetchAllCards, fetchUserCards, fetchProgress, trackDailyLogin, userId]);
  
  // Process pending discoveries
  useEffect(() => {
    if (discoveryState.pendingDiscovery && !discoveryState.discoveredCard) {
      const { cardCode, triggerType } = discoveryState.pendingDiscovery;
      discoverCard(cardCode, triggerType);
    }
  }, [discoveryState.pendingDiscovery, discoveryState.discoveredCard, discoverCard]);
  
  // ============================================================================
  // HELPERS
  // ============================================================================
  
  const hasCard = useCallback((cardCode: string) => {
    return userCards.some(c => c.cardCode === cardCode);
  }, [userCards]);
  
  const getSeriesProgress = useCallback((seriesCode: string) => {
    const seriesCards = allCards.filter(c => c.series === seriesCode);
    const ownedInSeries = userCards.filter(c => c.series === seriesCode);
    return {
      owned: ownedInSeries.length,
      total: seriesCards.length,
      percentage: seriesCards.length > 0 
        ? Math.round((ownedInSeries.length / seriesCards.length) * 100)
        : 0,
      isComplete: ownedInSeries.length >= seriesCards.length,
    };
  }, [allCards, userCards]);
  
  const getCardsByRarity = useCallback((rarity: string) => {
    return {
      all: allCards.filter(c => c.rarity === rarity),
      owned: userCards.filter(c => c.rarity === rarity),
    };
  }, [allCards, userCards]);
  
  // ============================================================================
  // RETURN
  // ============================================================================
  
  return {
    // Data
    userCards,
    allCards,
    progress,
    isLoading,
    
    // Discovery
    discoveryState,
    discoverCard,
    clearDiscoveredCard,
    
    // Tracking
    trackFeatureUse,
    trackDailyLogin,
    trackSearch,
    trackSecret,
    
    // Helpers
    hasCard,
    getSeriesProgress,
    getCardsByRarity,
    
    // Refresh
    refreshCards: fetchUserCards,
    refreshProgress: fetchProgress,
  };
}

export default useDigitalCards;
