// ============================================================================
// CARDVERSE TYPES - Comprehensive Type Definitions
// ============================================================================

// Card Categories
export type CardCategory = 'pokemon' | 'mtg' | 'yugioh' | 'sports' | 'other'

// Card Rarity Levels
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'

// Grading Companies
export type GradingCompany = 'PSA' | 'BGS' | 'CGC' | 'SGC' | 'raw'

// Card Condition (for raw cards)
export type CardCondition = 'mint' | 'near_mint' | 'excellent' | 'good' | 'fair' | 'poor'

// Sports Card Types
export type SportType = 'baseball' | 'basketball' | 'football' | 'hockey' | 'soccer' | 'other'

// Pokemon Types
export type PokemonType = 
  | 'fire' | 'water' | 'grass' | 'electric' | 'psychic' | 'fighting'
  | 'dark' | 'dragon' | 'fairy' | 'steel' | 'normal' | 'colorless'

// MTG Colors
export type MTGColor = 'white' | 'blue' | 'black' | 'red' | 'green' | 'colorless' | 'multicolor'

// Base Card Interface
export interface Card {
  id: string
  user_id: string
  name: string
  category: CardCategory
  set_name: string
  set_code?: string
  card_number: string
  year?: number
  image_url?: string
  image_back_url?: string
  rarity: CardRarity
  
  // Grading Info
  grading_company?: GradingCompany
  grade?: number
  cert_number?: string
  
  // Raw Card Condition
  condition?: CardCondition
  
  // Value Tracking
  purchase_price?: number
  purchase_date?: string
  current_value?: number
  last_price_update?: string
  
  // Inventory
  quantity: number
  location?: string
  notes?: string
  
  // Card-specific metadata (JSON)
  metadata?: Record<string, any>
  
  // Timestamps
  created_at: string
  updated_at: string
}

// Pokemon Card Extension
export interface PokemonCard extends Card {
  category: 'pokemon'
  metadata: {
    pokemon_type: PokemonType
    hp?: number
    stage?: 'basic' | 'stage1' | 'stage2' | 'vmax' | 'vstar' | 'ex' | 'gx'
    is_holo?: boolean
    is_reverse_holo?: boolean
    is_first_edition?: boolean
    is_shadowless?: boolean
    illustrator?: string
  }
}

// MTG Card Extension
export interface MTGCard extends Card {
  category: 'mtg'
  metadata: {
    colors: MTGColor[]
    mana_cost?: string
    cmc?: number
    type_line?: string
    oracle_text?: string
    power?: string
    toughness?: string
    is_foil?: boolean
    is_extended_art?: boolean
    is_borderless?: boolean
    is_retro_frame?: boolean
    legality?: Record<string, 'legal' | 'banned' | 'restricted'>
  }
}

// Sports Card Extension
export interface SportsCard extends Card {
  category: 'sports'
  metadata: {
    sport: SportType
    player_name: string
    team?: string
    is_rookie?: boolean
    is_auto?: boolean
    is_patch?: boolean
    is_numbered?: boolean
    serial_number?: string
    print_run?: number
    manufacturer?: string
  }
}

// Yu-Gi-Oh Card Extension
export interface YuGiOhCard extends Card {
  category: 'yugioh'
  metadata: {
    card_type: 'monster' | 'spell' | 'trap'
    attribute?: string
    level?: number
    atk?: number
    def?: number
    is_first_edition?: boolean
    is_limited_edition?: boolean
  }
}

// Collection Statistics
export interface CollectionStats {
  total_cards: number
  total_value: number
  total_invested: number
  total_profit: number
  roi_percentage: number
  cards_by_category: Record<CardCategory, number>
  cards_by_rarity: Record<CardRarity, number>
  top_cards: Card[]
  recent_additions: Card[]
  price_history: PricePoint[]
}

export interface PricePoint {
  date: string
  value: number
}

// Club System
export interface Club {
  id: string
  name: string
  slug: string
  description: string
  club_type: 'braggers' | 'regional' | 'team' | 'player' | 'set' | 'grading' | 'tcg' | 'investment' | 'vintage' | 'newbie'
  banner_url?: string
  icon_url?: string
  owner_id: string
  is_public: boolean
  member_count: number
  requirements?: ClubRequirements
  created_at: string
}

export interface ClubRequirements {
  min_collection_value?: number
  min_cards?: number
  required_cards?: string[] // specific card IDs
  required_grade?: number
  invite_only?: boolean
}

export interface ClubMember {
  id: string
  club_id: string
  user_id: string
  role: 'owner' | 'admin' | 'moderator' | 'member'
  joined_at: string
  user?: UserProfile
}

// User Profile
export interface UserProfile {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  bio?: string
  location?: string
  favorite_category?: CardCategory
  collection_visibility: 'public' | 'friends' | 'private'
  level: number
  xp: number
  badges: Badge[]
  stats: UserStats
  created_at: string
}

export interface UserStats {
  total_cards: number
  total_value: number
  clubs_joined: number
  trivia_score: number
  trades_completed: number
  achievements_earned: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: CardRarity
  earned_at: string
}

// Trivia System
export interface TriviaQuestion {
  id: string
  category: 'pokemon' | 'mtg' | 'sports' | 'yugioh' | 'history' | 'grading' | 'general'
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
  image_url?: string
  xp_reward: number
}

export interface TriviaSession {
  id: string
  user_id: string
  category: string
  questions_answered: number
  correct_answers: number
  xp_earned: number
  streak: number
  started_at: string
  ended_at?: string
}

// Digital Cards (Gamification)
export interface DigitalCard {
  id: string
  name: string
  description: string
  series: 'location' | 'academy' | 'game' | 'achievement' | 'streak' | 'social' | 'special'
  rarity: CardRarity
  image_url: string
  unlock_method: string
  xp_value: number
  is_tradeable: boolean
  max_supply?: number
  current_supply?: number
}

export interface UserDigitalCard {
  id: string
  user_id: string
  digital_card_id: string
  earned_at: string
  is_displayed: boolean
  digital_card: DigitalCard
}

// Academy System
export interface Course {
  id: string
  title: string
  description: string
  category: CardCategory | 'general'
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  duration_minutes: number
  lessons: Lesson[]
  digital_card_reward?: string
  xp_reward: number
  thumbnail_url?: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  content: string
  video_url?: string
  order: number
  quiz?: TriviaQuestion[]
}

export interface UserCourseProgress {
  id: string
  user_id: string
  course_id: string
  lessons_completed: string[]
  quiz_scores: Record<string, number>
  completed_at?: string
  started_at: string
}

// Museum / History
export interface HistoryArticle {
  id: string
  title: string
  slug: string
  content: string
  category: CardCategory | 'general'
  era?: string
  featured_image_url?: string
  gallery_images?: string[]
  tags: string[]
  author: string
  published_at: string
}

export interface FamousCard {
  id: string
  name: string
  category: CardCategory
  year: number
  description: string
  historical_significance: string
  record_sale_price?: number
  record_sale_date?: string
  image_url: string
  article_id?: string
}

// Marketplace
export interface Listing {
  id: string
  seller_id: string
  card_id: string
  price: number
  condition_notes?: string
  images: string[]
  status: 'active' | 'sold' | 'cancelled' | 'expired'
  created_at: string
  expires_at?: string
  card?: Card
  seller?: UserProfile
}

export interface TradeOffer {
  id: string
  sender_id: string
  receiver_id: string
  sender_cards: string[]
  receiver_cards: string[]
  cash_adjustment?: number
  message?: string
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed'
  created_at: string
  responded_at?: string
}

// Subscription Plans
export interface SubscriptionPlan {
  id: string
  name: 'free' | 'collector' | 'pro' | 'dealer'
  price_monthly: number
  price_yearly: number
  features: string[]
  card_limit: number
  scan_limit: number
  api_access: boolean
}

// Javari AI Context
export interface JavariContext {
  user_profile: UserProfile
  recent_cards: Card[]
  collection_stats: CollectionStats
  active_questions: string[]
  conversation_history: JavariMessage[]
}

export interface JavariMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  metadata?: {
    cards_referenced?: string[]
    action_taken?: string
  }
}
