// ============================================================================
// CARDVERSE HIDDEN DIGITAL CARD SYSTEM
// "CardVerse Exclusives" - Digital Collectibles Hidden Throughout Platform
// ============================================================================

// Types for the Hidden Card System
export interface HiddenDigitalCard {
  id: string;
  name: string;
  description: string;
  rarity: CardRarity;
  category: CardCategory;
  imageUrl: string;
  backgroundGradient: string;
  glowColor: string;
  discoveryMethod: DiscoveryMethod;
  discoveryHint: string;
  discoveryLocation: string;
  triggerCondition: TriggerCondition;
  xpReward: number;
  creditReward: number;
  isSecret: boolean;
  seasonId?: string;
  releaseDate: string;
  retireDate?: string;
  maxSupply?: number;
  currentSupply: number;
  createdAt: string;
}

export type CardRarity = 
  | 'common'      // 40% - Found through normal usage
  | 'uncommon'    // 25% - Requires specific actions
  | 'rare'        // 20% - Requires exploration
  | 'epic'        // 10% - Requires dedication
  | 'legendary'   // 4% - Extremely rare conditions
  | 'mythic';     // 1% - Secret, near-impossible conditions

export type CardCategory =
  | 'explorer'      // Found by exploring features
  | 'collector'     // Earned through collection milestones
  | 'social'        // Earned through community actions
  | 'scholar'       // Earned through learning/trivia
  | 'trader'        // Earned through marketplace activity
  | 'achievement'   // Tied to specific achievements
  | 'seasonal'      // Limited time events
  | 'secret'        // Hidden with no hints
  | 'founder'       // Early adopter rewards
  | 'collaboration';// Partnerships & crossovers

export type DiscoveryMethod =
  | 'page_visit'           // Visit a specific page
  | 'feature_use'          // Use a specific feature X times
  | 'time_spent'           // Spend X minutes in area
  | 'scroll_depth'         // Scroll to hidden location
  | 'click_sequence'       // Click pattern (easter egg)
  | 'trivia_score'         // Achieve trivia score
  | 'collection_milestone' // Add X cards to collection
  | 'social_action'        // Share, invite, comment
  | 'streak'               // Login X days in row
  | 'time_based'           // Online at specific time
  | 'random_drop'          // Random chance on action
  | 'konami_code'          // Classic easter egg
  | 'hidden_element'       // Click hidden UI element
  | 'api_discovery'        // Use API/advanced features
  | 'combination';         // Multiple conditions

export interface TriggerCondition {
  type: DiscoveryMethod;
  params: Record<string, unknown>;
  description: string;
}

export interface UserCardCollection {
  id: string;
  userId: string;
  cardId: string;
  discoveredAt: string;
  discoveryContext: string;
  isFavorite: boolean;
  isTraded: boolean;
  tradeHistory: TradeRecord[];
}

export interface TradeRecord {
  fromUserId: string;
  toUserId: string;
  tradedAt: string;
  tradeType: 'gift' | 'trade' | 'purchase';
}

// ============================================================================
// CARD DATABASE - The Complete Collection
// ============================================================================

export const HIDDEN_CARD_DATABASE: HiddenDigitalCard[] = [
  // =========================================================================
  // EXPLORER CARDS - Found by exploring the platform
  // =========================================================================
  {
    id: 'exp-001',
    name: 'First Steps',
    description: 'Awarded to those who begin their CardVerse journey',
    rarity: 'common',
    category: 'explorer',
    imageUrl: '/cards/exclusive/first-steps.png',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    glowColor: '#667eea',
    discoveryMethod: 'page_visit',
    discoveryHint: 'Every journey begins with a single step...',
    discoveryLocation: 'Dashboard',
    triggerCondition: {
      type: 'page_visit',
      params: { page: '/dashboard', firstVisit: true },
      description: 'Visit the dashboard for the first time'
    },
    xpReward: 50,
    creditReward: 10,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'exp-002',
    name: 'Museum Wanderer',
    description: 'You explored the halls of card history',
    rarity: 'common',
    category: 'explorer',
    imageUrl: '/cards/exclusive/museum-wanderer.png',
    backgroundGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    glowColor: '#f093fb',
    discoveryMethod: 'page_visit',
    discoveryHint: 'History holds many secrets...',
    discoveryLocation: 'Museum',
    triggerCondition: {
      type: 'page_visit',
      params: { page: '/museum', sections: ['all'] },
      description: 'Visit all sections of the museum'
    },
    xpReward: 75,
    creditReward: 15,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'exp-003',
    name: 'Deep Diver',
    description: 'You scrolled to the bottom of it all',
    rarity: 'uncommon',
    category: 'explorer',
    imageUrl: '/cards/exclusive/deep-diver.png',
    backgroundGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    glowColor: '#00f2fe',
    discoveryMethod: 'scroll_depth',
    discoveryHint: 'Some treasures lie at the bottom...',
    discoveryLocation: 'Any Long Page',
    triggerCondition: {
      type: 'scroll_depth',
      params: { depth: 100, pages: 5 },
      description: 'Scroll to 100% on 5 different pages'
    },
    xpReward: 100,
    creditReward: 25,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'exp-004',
    name: 'Night Owl',
    description: 'Collecting cards at midnight? Dedicated!',
    rarity: 'rare',
    category: 'explorer',
    imageUrl: '/cards/exclusive/night-owl.png',
    backgroundGradient: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
    glowColor: '#e94560',
    discoveryMethod: 'time_based',
    discoveryHint: 'The night holds secrets for the dedicated...',
    discoveryLocation: 'Any Page',
    triggerCondition: {
      type: 'time_based',
      params: { hourStart: 0, hourEnd: 4, timezone: 'user' },
      description: 'Be active between midnight and 4am'
    },
    xpReward: 150,
    creditReward: 50,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'exp-005',
    name: 'Early Bird',
    description: 'The early collector catches the rare card',
    rarity: 'rare',
    category: 'explorer',
    imageUrl: '/cards/exclusive/early-bird.png',
    backgroundGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    glowColor: '#fee140',
    discoveryMethod: 'time_based',
    discoveryHint: 'Dawn brings new opportunities...',
    discoveryLocation: 'Any Page',
    triggerCondition: {
      type: 'time_based',
      params: { hourStart: 5, hourEnd: 7, timezone: 'user' },
      description: 'Be active between 5am and 7am'
    },
    xpReward: 150,
    creditReward: 50,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },

  // =========================================================================
  // COLLECTOR CARDS - Earned through collection milestones
  // =========================================================================
  {
    id: 'col-001',
    name: 'Starter Pack',
    description: 'Your first 10 cards in the collection',
    rarity: 'common',
    category: 'collector',
    imageUrl: '/cards/exclusive/starter-pack.png',
    backgroundGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    glowColor: '#a8edea',
    discoveryMethod: 'collection_milestone',
    discoveryHint: 'Every collection starts somewhere...',
    discoveryLocation: 'Collection',
    triggerCondition: {
      type: 'collection_milestone',
      params: { cardCount: 10 },
      description: 'Add 10 cards to your collection'
    },
    xpReward: 100,
    creditReward: 25,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'col-002',
    name: 'Century Club',
    description: 'Welcome to the 100 card club',
    rarity: 'uncommon',
    category: 'collector',
    imageUrl: '/cards/exclusive/century-club.png',
    backgroundGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    glowColor: '#fcb69f',
    discoveryMethod: 'collection_milestone',
    discoveryHint: 'Triple digits await the dedicated...',
    discoveryLocation: 'Collection',
    triggerCondition: {
      type: 'collection_milestone',
      params: { cardCount: 100 },
      description: 'Add 100 cards to your collection'
    },
    xpReward: 250,
    creditReward: 75,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'col-003',
    name: 'Vault Keeper',
    description: 'A thousand cards under your care',
    rarity: 'epic',
    category: 'collector',
    imageUrl: '/cards/exclusive/vault-keeper.png',
    backgroundGradient: 'linear-gradient(135deg, #c79081 0%, #dfa579 100%)',
    glowColor: '#dfa579',
    discoveryMethod: 'collection_milestone',
    discoveryHint: 'Thousands dream of this achievement...',
    discoveryLocation: 'Collection',
    triggerCondition: {
      type: 'collection_milestone',
      params: { cardCount: 1000 },
      description: 'Add 1,000 cards to your collection'
    },
    xpReward: 1000,
    creditReward: 500,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'col-004',
    name: 'Graded Guru',
    description: 'Your first PSA/BGS/CGC graded card logged',
    rarity: 'uncommon',
    category: 'collector',
    imageUrl: '/cards/exclusive/graded-guru.png',
    backgroundGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    glowColor: '#ff9a9e',
    discoveryMethod: 'collection_milestone',
    discoveryHint: 'Professional authentication unlocks this...',
    discoveryLocation: 'Collection',
    triggerCondition: {
      type: 'collection_milestone',
      params: { gradedCards: 1 },
      description: 'Add your first graded card'
    },
    xpReward: 200,
    creditReward: 50,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'col-005',
    name: 'Perfect 10',
    description: 'A gem mint PSA 10 in your collection',
    rarity: 'rare',
    category: 'collector',
    imageUrl: '/cards/exclusive/perfect-10.png',
    backgroundGradient: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
    glowColor: '#f5af19',
    discoveryMethod: 'collection_milestone',
    discoveryHint: 'Perfection is rare but achievable...',
    discoveryLocation: 'Collection',
    triggerCondition: {
      type: 'collection_milestone',
      params: { psa10Cards: 1 },
      description: 'Add a PSA 10 graded card'
    },
    xpReward: 300,
    creditReward: 100,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },

  // =========================================================================
  // SCHOLAR CARDS - Earned through learning & trivia
  // =========================================================================
  {
    id: 'sch-001',
    name: 'Quiz Rookie',
    description: 'Completed your first trivia round',
    rarity: 'common',
    category: 'scholar',
    imageUrl: '/cards/exclusive/quiz-rookie.png',
    backgroundGradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    glowColor: '#84fab0',
    discoveryMethod: 'trivia_score',
    discoveryHint: 'Test your knowledge to unlock this...',
    discoveryLocation: 'Trivia',
    triggerCondition: {
      type: 'trivia_score',
      params: { gamesCompleted: 1 },
      description: 'Complete your first trivia game'
    },
    xpReward: 50,
    creditReward: 10,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'sch-002',
    name: 'Perfect Score',
    description: 'A flawless trivia performance',
    rarity: 'rare',
    category: 'scholar',
    imageUrl: '/cards/exclusive/perfect-score.png',
    backgroundGradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    glowColor: '#a18cd1',
    discoveryMethod: 'trivia_score',
    discoveryHint: 'Perfection in knowledge reveals this...',
    discoveryLocation: 'Trivia',
    triggerCondition: {
      type: 'trivia_score',
      params: { perfectGames: 1 },
      description: 'Score 100% on a trivia game'
    },
    xpReward: 300,
    creditReward: 100,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'sch-003',
    name: 'Trivia Master',
    description: '50 trivia games completed',
    rarity: 'epic',
    category: 'scholar',
    imageUrl: '/cards/exclusive/trivia-master.png',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    glowColor: '#764ba2',
    discoveryMethod: 'trivia_score',
    discoveryHint: 'Dedication to learning unlocks mastery...',
    discoveryLocation: 'Trivia',
    triggerCondition: {
      type: 'trivia_score',
      params: { gamesCompleted: 50 },
      description: 'Complete 50 trivia games'
    },
    xpReward: 750,
    creditReward: 250,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'sch-004',
    name: 'History Buff',
    description: 'Completed all Card Academy courses',
    rarity: 'legendary',
    category: 'scholar',
    imageUrl: '/cards/exclusive/history-buff.png',
    backgroundGradient: 'linear-gradient(135deg, #1a1a2e 0%, #4a1942 100%)',
    glowColor: '#d4af37',
    discoveryMethod: 'feature_use',
    discoveryHint: 'Complete knowledge awaits the dedicated student...',
    discoveryLocation: 'Academy',
    triggerCondition: {
      type: 'feature_use',
      params: { feature: 'academy', coursesCompleted: 'all' },
      description: 'Complete all Card Academy courses'
    },
    xpReward: 2000,
    creditReward: 1000,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },

  // =========================================================================
  // SOCIAL CARDS - Earned through community actions
  // =========================================================================
  {
    id: 'soc-001',
    name: 'Club Founder',
    description: 'You started your own collector club',
    rarity: 'uncommon',
    category: 'social',
    imageUrl: '/cards/exclusive/club-founder.png',
    backgroundGradient: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
    glowColor: '#ff7eb3',
    discoveryMethod: 'social_action',
    discoveryHint: 'Leaders create communities...',
    discoveryLocation: 'Clubs',
    triggerCondition: {
      type: 'social_action',
      params: { action: 'create_club' },
      description: 'Create a collector club'
    },
    xpReward: 200,
    creditReward: 50,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'soc-002',
    name: 'Social Butterfly',
    description: 'Joined 5 different clubs',
    rarity: 'uncommon',
    category: 'social',
    imageUrl: '/cards/exclusive/social-butterfly.png',
    backgroundGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    glowColor: '#f093fb',
    discoveryMethod: 'social_action',
    discoveryHint: 'The more you connect, the more you discover...',
    discoveryLocation: 'Clubs',
    triggerCondition: {
      type: 'social_action',
      params: { action: 'join_clubs', count: 5 },
      description: 'Join 5 clubs'
    },
    xpReward: 150,
    creditReward: 40,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'soc-003',
    name: 'Referral Champion',
    description: 'Invited 10 friends to CardVerse',
    rarity: 'rare',
    category: 'social',
    imageUrl: '/cards/exclusive/referral-champion.png',
    backgroundGradient: 'linear-gradient(135deg, #0099f7 0%, #f11712 100%)',
    glowColor: '#0099f7',
    discoveryMethod: 'social_action',
    discoveryHint: 'Sharing is caring...',
    discoveryLocation: 'Profile',
    triggerCondition: {
      type: 'social_action',
      params: { action: 'referral', count: 10 },
      description: 'Refer 10 friends'
    },
    xpReward: 500,
    creditReward: 250,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },

  // =========================================================================
  // SECRET CARDS - Hidden easter eggs
  // =========================================================================
  {
    id: 'sec-001',
    name: 'Konami Collector',
    description: '⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️',
    rarity: 'legendary',
    category: 'secret',
    imageUrl: '/cards/exclusive/konami-collector.png',
    backgroundGradient: 'linear-gradient(135deg, #8B0000 0%, #FF4500 100%)',
    glowColor: '#FF4500',
    discoveryMethod: 'konami_code',
    discoveryHint: '???',
    discoveryLocation: 'Anywhere',
    triggerCondition: {
      type: 'konami_code',
      params: { sequence: ['up','up','down','down','left','right','left','right','b','a'] },
      description: 'Enter the Konami Code'
    },
    xpReward: 1000,
    creditReward: 500,
    isSecret: true,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'sec-002',
    name: 'Hidden Charizard',
    description: 'You found the secret dragon!',
    rarity: 'mythic',
    category: 'secret',
    imageUrl: '/cards/exclusive/hidden-charizard.png',
    backgroundGradient: 'linear-gradient(135deg, #ff512f 0%, #f09819 100%)',
    glowColor: '#ff512f',
    discoveryMethod: 'hidden_element',
    discoveryHint: '???',
    discoveryLocation: 'Museum - Pokemon Section',
    triggerCondition: {
      type: 'hidden_element',
      params: { elementId: 'secret-charizard-flame', clicks: 3 },
      description: 'Click the hidden flame 3 times in the Pokemon museum'
    },
    xpReward: 2500,
    creditReward: 1000,
    isSecret: true,
    maxSupply: 1000,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'sec-003',
    name: 'Black Lotus Seeker',
    description: 'The ultimate MTG secret revealed',
    rarity: 'mythic',
    category: 'secret',
    imageUrl: '/cards/exclusive/black-lotus-seeker.png',
    backgroundGradient: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d1f3d 100%)',
    glowColor: '#9b59b6',
    discoveryMethod: 'click_sequence',
    discoveryHint: '???',
    discoveryLocation: 'Museum - MTG Section',
    triggerCondition: {
      type: 'click_sequence',
      params: { pattern: ['mox','mox','mox','mox','mox','lotus'] },
      description: 'Click all 5 Moxes then Black Lotus in MTG museum'
    },
    xpReward: 2500,
    creditReward: 1000,
    isSecret: true,
    maxSupply: 500,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'sec-004',
    name: 'Developer Mode',
    description: 'You found the dev console easter egg',
    rarity: 'legendary',
    category: 'secret',
    imageUrl: '/cards/exclusive/developer-mode.png',
    backgroundGradient: 'linear-gradient(135deg, #0f0f0f 0%, #1a472a 100%)',
    glowColor: '#00ff00',
    discoveryMethod: 'api_discovery',
    discoveryHint: '???',
    discoveryLocation: 'Console',
    triggerCondition: {
      type: 'api_discovery',
      params: { command: 'cardverse.unlock()' },
      description: 'Type cardverse.unlock() in browser console'
    },
    xpReward: 1500,
    creditReward: 750,
    isSecret: true,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },

  // =========================================================================
  // STREAK CARDS - Daily login rewards
  // =========================================================================
  {
    id: 'str-001',
    name: 'Week Warrior',
    description: '7 day login streak',
    rarity: 'uncommon',
    category: 'achievement',
    imageUrl: '/cards/exclusive/week-warrior.png',
    backgroundGradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    glowColor: '#38ef7d',
    discoveryMethod: 'streak',
    discoveryHint: 'Consistency is key...',
    discoveryLocation: 'Login',
    triggerCondition: {
      type: 'streak',
      params: { days: 7 },
      description: 'Log in 7 days in a row'
    },
    xpReward: 200,
    creditReward: 50,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'str-002',
    name: 'Monthly Master',
    description: '30 day login streak',
    rarity: 'rare',
    category: 'achievement',
    imageUrl: '/cards/exclusive/monthly-master.png',
    backgroundGradient: 'linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)',
    glowColor: '#b06ab3',
    discoveryMethod: 'streak',
    discoveryHint: 'A month of dedication unlocks this...',
    discoveryLocation: 'Login',
    triggerCondition: {
      type: 'streak',
      params: { days: 30 },
      description: 'Log in 30 days in a row'
    },
    xpReward: 500,
    creditReward: 200,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'str-003',
    name: 'Year of the Collector',
    description: '365 day login streak - LEGENDARY',
    rarity: 'mythic',
    category: 'achievement',
    imageUrl: '/cards/exclusive/year-collector.png',
    backgroundGradient: 'linear-gradient(135deg, #c79081 0%, #dfa579 50%, #f5af19 100%)',
    glowColor: '#f5af19',
    discoveryMethod: 'streak',
    discoveryHint: 'A full year of dedication...',
    discoveryLocation: 'Login',
    triggerCondition: {
      type: 'streak',
      params: { days: 365 },
      description: 'Log in 365 days in a row'
    },
    xpReward: 5000,
    creditReward: 2500,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },

  // =========================================================================
  // FOUNDER CARDS - Early adopter rewards
  // =========================================================================
  {
    id: 'fnd-001',
    name: 'Genesis Collector',
    description: 'Joined CardVerse in the first month',
    rarity: 'legendary',
    category: 'founder',
    imageUrl: '/cards/exclusive/genesis-collector.png',
    backgroundGradient: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
    glowColor: '#d4af37',
    discoveryMethod: 'time_based',
    discoveryHint: 'The beginning is always special...',
    discoveryLocation: 'Registration',
    triggerCondition: {
      type: 'time_based',
      params: { registeredBefore: '2025-02-01' },
      description: 'Register before February 2025'
    },
    xpReward: 1000,
    creditReward: 500,
    isSecret: false,
    maxSupply: 10000,
    releaseDate: '2025-01-01',
    retireDate: '2025-02-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'fnd-002',
    name: 'Alpha Tester',
    description: 'Helped shape CardVerse during alpha',
    rarity: 'mythic',
    category: 'founder',
    imageUrl: '/cards/exclusive/alpha-tester.png',
    backgroundGradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    glowColor: '#ff6b6b',
    discoveryMethod: 'feature_use',
    discoveryHint: 'Only true testers know this exists...',
    discoveryLocation: 'Feedback',
    triggerCondition: {
      type: 'feature_use',
      params: { feature: 'bug_report', count: 5 },
      description: 'Submit 5 bug reports during alpha'
    },
    xpReward: 2000,
    creditReward: 1000,
    isSecret: false,
    maxSupply: 1000,
    releaseDate: '2025-01-01',
    retireDate: '2025-03-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },

  // =========================================================================
  // JAVARI AI EXCLUSIVE CARDS
  // =========================================================================
  {
    id: 'jav-001',
    name: 'Javari\'s Friend',
    description: 'You had your first conversation with Javari',
    rarity: 'common',
    category: 'explorer',
    imageUrl: '/cards/exclusive/javari-friend.png',
    backgroundGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    glowColor: '#8b5cf6',
    discoveryMethod: 'feature_use',
    discoveryHint: 'Chat with the AI to unlock this...',
    discoveryLocation: 'Javari Chat',
    triggerCondition: {
      type: 'feature_use',
      params: { feature: 'javari_chat', messages: 1 },
      description: 'Send your first message to Javari'
    },
    xpReward: 50,
    creditReward: 10,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'jav-002',
    name: 'Card Whisperer',
    description: 'Asked Javari about 50 different cards',
    rarity: 'rare',
    category: 'scholar',
    imageUrl: '/cards/exclusive/card-whisperer.png',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    glowColor: '#667eea',
    discoveryMethod: 'feature_use',
    discoveryHint: 'The more you ask, the more you learn...',
    discoveryLocation: 'Javari Chat',
    triggerCondition: {
      type: 'feature_use',
      params: { feature: 'javari_card_lookup', count: 50 },
      description: 'Ask Javari about 50 cards'
    },
    xpReward: 400,
    creditReward: 150,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  },
  {
    id: 'jav-003',
    name: 'AI Apprentice',
    description: 'Completed 100 conversations with Javari',
    rarity: 'epic',
    category: 'social',
    imageUrl: '/cards/exclusive/ai-apprentice.png',
    backgroundGradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    glowColor: '#00d4ff',
    discoveryMethod: 'feature_use',
    discoveryHint: 'Javari remembers loyal friends...',
    discoveryLocation: 'Javari Chat',
    triggerCondition: {
      type: 'feature_use',
      params: { feature: 'javari_chat', conversations: 100 },
      description: 'Have 100 conversations with Javari'
    },
    xpReward: 1000,
    creditReward: 500,
    isSecret: false,
    releaseDate: '2025-01-01',
    currentSupply: 0,
    createdAt: '2025-01-01'
  }
];

// ============================================================================
// RARITY CONFIGURATION
// ============================================================================

export const RARITY_CONFIG = {
  common: {
    name: 'Common',
    color: '#9ca3af',
    backgroundColor: '#1f2937',
    dropChance: 0.40,
    xpMultiplier: 1,
    borderStyle: 'solid 2px #9ca3af'
  },
  uncommon: {
    name: 'Uncommon',
    color: '#22c55e',
    backgroundColor: '#14532d',
    dropChance: 0.25,
    xpMultiplier: 1.5,
    borderStyle: 'solid 2px #22c55e'
  },
  rare: {
    name: 'Rare',
    color: '#3b82f6',
    backgroundColor: '#1e3a8a',
    dropChance: 0.20,
    xpMultiplier: 2,
    borderStyle: 'solid 3px #3b82f6'
  },
  epic: {
    name: 'Epic',
    color: '#a855f7',
    backgroundColor: '#581c87',
    dropChance: 0.10,
    xpMultiplier: 3,
    borderStyle: 'solid 3px #a855f7'
  },
  legendary: {
    name: 'Legendary',
    color: '#f59e0b',
    backgroundColor: '#78350f',
    dropChance: 0.04,
    xpMultiplier: 5,
    borderStyle: 'double 4px #f59e0b'
  },
  mythic: {
    name: 'Mythic',
    color: '#ef4444',
    backgroundColor: '#7f1d1d',
    dropChance: 0.01,
    xpMultiplier: 10,
    borderStyle: 'double 4px #ef4444',
    animation: 'pulse-glow 2s infinite'
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getCardsByRarity(rarity: CardRarity): HiddenDigitalCard[] {
  return HIDDEN_CARD_DATABASE.filter(card => card.rarity === rarity);
}

export function getCardsByCategory(category: CardCategory): HiddenDigitalCard[] {
  return HIDDEN_CARD_DATABASE.filter(card => card.category === category);
}

export function getSecretCards(): HiddenDigitalCard[] {
  return HIDDEN_CARD_DATABASE.filter(card => card.isSecret);
}

export function getAvailableCards(): HiddenDigitalCard[] {
  const now = new Date();
  return HIDDEN_CARD_DATABASE.filter(card => {
    const releaseDate = new Date(card.releaseDate);
    const retireDate = card.retireDate ? new Date(card.retireDate) : null;
    return releaseDate <= now && (!retireDate || retireDate > now);
  });
}

export function getTotalXPPossible(): number {
  return HIDDEN_CARD_DATABASE.reduce((sum, card) => sum + card.xpReward, 0);
}

export function getTotalCreditsPossible(): number {
  return HIDDEN_CARD_DATABASE.reduce((sum, card) => sum + card.creditReward, 0);
}

export const CARD_STATS = {
  total: HIDDEN_CARD_DATABASE.length,
  byRarity: {
    common: getCardsByRarity('common').length,
    uncommon: getCardsByRarity('uncommon').length,
    rare: getCardsByRarity('rare').length,
    epic: getCardsByRarity('epic').length,
    legendary: getCardsByRarity('legendary').length,
    mythic: getCardsByRarity('mythic').length
  },
  totalXP: getTotalXPPossible(),
  totalCredits: getTotalCreditsPossible(),
  secretCount: getSecretCards().length
};

export default {
  HIDDEN_CARD_DATABASE,
  RARITY_CONFIG,
  CARD_STATS,
  getCardsByRarity,
  getCardsByCategory,
  getSecretCards,
  getAvailableCards
};
