// ============================================================================
// JAVARI AI KNOWLEDGE BASE - Comprehensive Card Expert
// ============================================================================

export const JAVARI_SYSTEM_PROMPT = `You are Javari, the world's most knowledgeable AI trading card expert. You are part of CardVerse, the premium trading card collection platform by CR AudioViz AI.

## Your Expertise Areas:

### POKÉMON TRADING CARD GAME
- Complete knowledge of all sets from Base Set (1999) to present
- Understanding of Japanese vs English releases and pricing differences
- Expertise in identifying 1st Edition, Shadowless, and Unlimited printings
- Knowledge of every Charizard variant and their market values

### MAGIC: THE GATHERING
- Complete set knowledge from Alpha (1993) to present
- Reserved List cards and their investment implications
- Format-specific card values (Commander, Modern, Legacy, Vintage, Standard)

### SPORTS CARDS
- Baseball: T206, Goudey, Bowman, Topps, Upper Deck, Panini
- Basketball: Fleer, Topps Chrome, Prizm, National Treasures
- Football: Topps, Panini, National Treasures, Contenders

### GRADING KNOWLEDGE
- PSA: Population reports, turnaround times, grading standards
- BGS: Subgrades importance, black label 10s
- CGC: Their grading scale and comparisons

### MARKET INTELLIGENCE
- Price trends and market cycles
- Investment strategies for different budgets
- Red flags for counterfeits

## Your Personality:
- Enthusiastic but professional
- Patient with beginners, deep with experts
- Honest about market risks
- Protective of collectors from scams

## Important Notes:
- You're part of CardVerse by CR AudioViz AI
- You can help with collection management, pricing, and education`;

// Card History Knowledge Base
export const CARD_HISTORY = {
  eras: {
    tobacco: {
      name: 'Tobacco Card Era',
      years: '1880s-1945',
      description: 'The birth of trading cards as tobacco company inserts',
      key_sets: ['T206', 'T205', 'T207', 'E90-1', 'Goudey'],
    },
    postwar: {
      name: 'Post-War Boom',
      years: '1945-1980',
      description: 'Topps establishes dominance, modern card design emerges',
    },
    junkwax: {
      name: 'Junk Wax Era',
      years: '1986-1993',
      description: 'Mass production era that flooded the market',
    },
    modern: {
      name: 'Modern Era',
      years: '1993-2010',
      description: 'Inserts, parallels, autos, and game-used materials emerge',
    },
    investment: {
      name: 'Investment Era',
      years: '2010-Present',
      description: 'Cards become alternative investments, PSA boom occurs',
    },
  },
};

// Grading Knowledge
export const GRADING_KNOWLEDGE = {
  companies: {
    psa: {
      name: 'Professional Sports Authenticator',
      founded: 1991,
      scale: '1-10',
      market_share: '60%',
    },
    bgs: {
      name: 'Beckett Grading Services',
      founded: 1999,
      scale: '1-10 with subgrades',
      market_share: '25%',
    },
    cgc: {
      name: 'Certified Guaranty Company',
      founded: 2020,
      scale: '1-10',
      market_share: '10%',
    },
  },
  tips: [
    'Always check centering before submitting',
    'Use a loupe to check corners and edges',
    'Consider the cost-benefit of grading',
  ],
};

// Counterfeit Detection
export const COUNTERFEIT_DETECTION = {
  general_tips: [
    'Always buy from reputable sellers',
    'If the deal seems too good, it probably is',
    'Request detailed photos',
  ],
  pokemon: {
    light_test: 'Real cards have a black layer in the middle',
    texture_test: 'Holo patterns should have specific textures',
    font_check: 'Counterfeiters often get fonts wrong',
  },
  mtg: {
    bend_test: 'Real cards spring back',
    rosette_pattern: 'Print pattern visible under magnification',
  },
  sports: {
    card_stock: 'Feel the card stock quality',
    auto_verification: 'Compare signatures to authentic examples',
    patch_windows: 'Check for obvious patch replacements',
  },
};

// Investment Strategies
export const INVESTMENT_STRATEGIES = {
  budget_tiers: {
    beginner: {
      budget: '$100-500',
      strategy: 'Focus on personal collection enjoyment',
    },
    intermediate: {
      budget: '$500-5000',
      strategy: 'Mix of enjoyment and strategic investing',
    },
    advanced: {
      budget: '$5000-50000',
      strategy: 'Portfolio approach with calculated risks',
    },
  },
};

// Famous Cards Database
export const FAMOUS_CARDS = [
  {
    category: 'sports',
    name: 'T206 Honus Wagner',
    year: 1909,
    record_sale: '$7,250,000',
    significance: 'The most famous baseball card',
  },
  {
    category: 'sports',
    name: '1952 Topps Mickey Mantle',
    year: 1952,
    record_sale: '$12,600,000',
    significance: 'Most valuable post-war sports card',
  },
  {
    category: 'pokemon',
    name: 'Pikachu Illustrator',
    year: 1998,
    record_sale: '$5,275,000',
    significance: 'Rarest Pokemon card',
  },
  {
    category: 'mtg',
    name: 'Black Lotus (Alpha)',
    year: 1993,
    record_sale: '$540,000',
    significance: 'Most powerful MTG card',
  },
];

export default {
  JAVARI_SYSTEM_PROMPT,
  CARD_HISTORY,
  GRADING_KNOWLEDGE,
  COUNTERFEIT_DETECTION,
  INVESTMENT_STRATEGIES,
  FAMOUS_CARDS,
};
