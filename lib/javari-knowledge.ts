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
- Understanding of modern chase cards: Alt Arts, Special Art Rares, Illustration Rares
- Grading nuances specific to Pokémon cards (centering issues, print lines, etc.)

### MAGIC: THE GATHERING
- Complete set knowledge from Alpha (1993) to present
- Reserved List cards and their investment implications
- Format-specific card values (Commander, Modern, Legacy, Vintage, Standard)
- Understanding of card conditions and their impact on value
- Knowledge of famous cards: Black Lotus, Moxen, dual lands, etc.
- Print variations: Alpha vs Beta, 7th Edition foils, Judge promos, etc.

### SPORTS CARDS
- Baseball: T206, Goudey, Bowman, Topps, Upper Deck, Panini
- Basketball: Fleer, Topps Chrome, Prizm, National Treasures
- Football: Topps, Panini, National Treasures, Contenders
- Hockey: O-Pee-Chee, Upper Deck, SP Authentic
- Soccer: Topps, Panini Prizm, Topps Chrome
- Understanding of rookie cards, autos, patches, and serial numbered cards
- Historical sales data and market trends

### YU-GI-OH!
- Knowledge from LOB to present sets
- 1st Edition vs Unlimited pricing
- Ghost Rares, Starlight Rares, and other premium variants
- Understanding of OCG vs TCG differences

### GRADING KNOWLEDGE
- PSA: Population reports, turnaround times, grading standards
- BGS: Subgrades importance, black label 10s, pristine vs gem mint
- CGC: Their grading scale and how it compares
- SGC: Historical significance and modern resurgence
- When to grade vs keep raw
- Cost-benefit analysis of grading submissions

### MARKET INTELLIGENCE
- Price trends and market cycles
- Investment strategies for different budgets
- When to buy and sell for maximum profit
- Red flags for counterfeits and reprints
- Authentication tips

### CARD HISTORY & CULTURE
- The T206 Honus Wagner story
- The Junk Wax Era (1986-1993) and its aftermath
- The COVID-19 sports card boom
- Pokémania and the 1999 collector frenzy
- Famous collections and record-breaking sales

## Your Personality:
- Enthusiastic but professional
- Patient with beginners, deep with experts
- Honest about market risks and uncertainties
- Protective of collectors from scams and bad deals
- Encouraging of all collectors regardless of budget

## Response Guidelines:
1. Always be helpful and informative
2. Provide specific examples when possible
3. Include price ranges when discussing values
4. Warn about common pitfalls and scams
5. Suggest resources for further learning
6. Encourage responsible collecting within means

## Important Notes:
- You're part of CardVerse by CR AudioViz AI
- You can help with collection management, pricing, and education
- You support the clubs, trivia, academy, and museum features
- You're available to all CardVerse users`

// Card History Knowledge Base
export const CARD_HISTORY = {
  eras: {
    tobacco: {
      name: 'Tobacco Card Era',
      years: '1880s-1945',
      description: 'The birth of trading cards as tobacco company inserts',
      key_sets: ['T206', 'T205', 'T207', 'E90-1', 'Goudey'],
      famous_cards: [
        {
          name: 'T206 Honus Wagner',
          description: 'The Holy Grail of baseball cards. Only 50-200 known to exist.',
          record_sale: '$7.25 million (2022)',
          why_valuable: 'Wagner reportedly demanded his card be pulled from production due to his opposition to tobacco.',
        },
        {
          name: '1933 Goudey Babe Ruth #53',
          description: 'One of four Ruth cards in the 1933 Goudey set',
          record_sale: '$4.212 million (2023)',
        },
      ],
    },
    postwar: {
      name: 'Post-War Boom',
      years: '1945-1980',
      description: 'Topps establishes dominance, modern card design emerges',
      key_sets: ['1952 Topps', '1951 Bowman', '1954 Topps', '1955 Topps'],
      famous_cards: [
        {
          name: '1952 Topps Mickey Mantle #311',
          description: 'The most iconic post-war baseball card',
          record_sale: '$12.6 million (2022)',
          why_valuable: 'High print numbers were dumped in the ocean, creating artificial scarcity',
        },
      ],
    },
    junkwax: {
      name: 'Junk Wax Era',
      years: '1986-1993',
      description: 'Mass production era that flooded the market',
      key_sets: ['1989 Upper Deck', '1986 Fleer', '1987 Donruss', '1988 Score'],
      lesson: 'Overproduction destroyed values. Millions of "valuable" cards became worthless.',
      exceptions: [
        {
          name: '1989 Upper Deck Ken Griffey Jr. #1',
          note: 'Still maintains value due to iconic status and condition sensitivity',
        },
      ],
    },
    modern_sports: {
      name: 'Modern Sports Card Era',
      years: '1993-2010',
      description: 'Inserts, parallels, autos, and game-used materials emerge',
      key_sets: ['1997 PMG', '2003 Exquisite Collection', '1996 Topps Chrome'],
      innovations: ['Serial numbering', 'Game-used memorabilia', 'On-card autographs'],
    },
    investment_era: {
      name: 'Investment Era',
      years: '2010-Present',
      description: 'Cards become alternative investments, PSA boom occurs',
      key_events: [
        '2020 COVID boom - card values skyrocketed',
        'PWCC marketplace scandals',
        'Logan Paul $3.5M pack opening',
        'Fanatics acquisition of Topps',
      ],
    },
  },
  tcg_history: {
    mtg: {
      name: 'Magic: The Gathering',
      founded: 1993,
      creator: 'Richard Garfield',
      company: 'Wizards of the Coast',
      milestones: [
        { year: 1993, event: 'Alpha released with 295 cards' },
        { year: 1994, event: 'Reserved List created (cards never to be reprinted)' },
        { year: 1999, event: 'Hasbro acquires Wizards of the Coast' },
        { year: 2019, event: 'MTG Arena launches, digital boom begins' },
      ],
    },
    pokemon: {
      name: 'Pokémon Trading Card Game',
      founded: 1996,
      creator: 'Media Factory (Japan)',
      us_launch: 1999,
      milestones: [
        { year: 1996, event: 'Japanese Base Set released' },
        { year: 1999, event: 'US Base Set released, Pokémania begins' },
        { year: 2000, event: 'Neo Genesis introduces shinies' },
        { year: 2020, event: 'COVID boom, 1st Ed Charizard hits $400K' },
        { year: 2021, event: 'Logan Paul wears PSA 10 Charizard to boxing match' },
      ],
    },
    yugioh: {
      name: 'Yu-Gi-Oh!',
      founded: 1999,
      creator: 'Kazuki Takahashi',
      milestones: [
        { year: 1999, event: 'OCG launches in Japan' },
        { year: 2002, event: 'TCG launches in North America' },
        { year: 2004, event: 'Ghost Rares introduced' },
      ],
    },
  },
}

// Grading Knowledge
export const GRADING_KNOWLEDGE = {
  companies: {
    psa: {
      name: 'Professional Sports Authenticator',
      founded: 1991,
      scale: '1-10 (with half points)',
      market_share: '~60%',
      strengths: [
        'Largest population reports',
        'Most liquid market',
        'Best brand recognition',
      ],
      weaknesses: [
        'Long turnaround times',
        'Inconsistent grading at times',
        'Premium pricing',
      ],
      gem_mint: 'PSA 10',
      tips: [
        'PSA 10 commands significant premium over PSA 9',
        'Population reports affect value - low pop = higher value',
        'Vintage cards rarely get 10s due to print quality',
      ],
    },
    bgs: {
      name: 'Beckett Grading Services',
      founded: 1999,
      scale: '1-10 with subgrades',
      subgrades: ['Centering', 'Corners', 'Edges', 'Surface'],
      market_share: '~25%',
      strengths: [
        'Subgrades provide detailed condition info',
        'Black Label 10 is most prestigious grade',
        'Strong for modern cards',
      ],
      weaknesses: [
        'Slower adoption in some markets',
        'Complex pricing with subgrades',
      ],
      gem_mint: 'BGS 9.5 Gem Mint',
      pristine: 'BGS 10 Pristine',
      black_label: 'BGS 10 Black Label (all 10 subgrades)',
    },
    cgc: {
      name: 'Certified Guaranty Company',
      founded: 2020,
      scale: '1-10',
      market_share: '~10%',
      strengths: [
        'Fast turnaround',
        'Competitive pricing',
        'Good for Pokémon',
      ],
      weaknesses: [
        'Newer, less established',
        'Smaller population reports',
      ],
    },
    sgc: {
      name: 'Sportscard Guaranty Corporation',
      founded: 1998,
      scale: '1-10',
      strengths: [
        'Preferred for vintage cards',
        'Consistent grading standards',
        'Beautiful tuxedo cases',
      ],
    },
  },
  grading_tips: [
    'Always check centering before submitting - 60/40 or worse is usually not a 10',
    'Use a loupe to check corners and edges',
    'Print lines and surface scratches kill grades',
    'Consider the cost-benefit: $20 card + $50 grading = tough ROI',
    'Raw cards in excellent condition often sell near graded prices',
    'Bulk submissions save money if you have many cards',
  ],
  when_to_grade: [
    'High-value cards worth 10x+ the grading fee',
    'Cards you plan to sell (graded commands premium)',
    'Cards for long-term storage (protection)',
    'Cards with exceptional centering and corners',
  ],
  when_not_to_grade: [
    'Common cards with low value ceiling',
    'Cards with obvious condition issues',
    'Cards you plan to play with',
    'During high-volume periods (long waits)',
  ],
}

// Counterfeit Detection
export const COUNTERFEIT_DETECTION = {
  general_tips: [
    'Always buy from reputable sellers with return policies',
    'If the deal seems too good to be true, it probably is',
    'Request detailed photos of front, back, and edges',
    'Use the light test for Pokémon cards',
    'Check print patterns under magnification',
  ],
  pokemon: {
    light_test: 'Real Pokémon cards have a black layer in the middle visible when held to light',
    texture_test: 'Holo patterns should have specific textures',
    font_check: 'Counterfeiters often get fonts slightly wrong',
    color_saturation: 'Fakes often have oversaturated or washed out colors',
  },
  mtg: {
    bend_test: 'Real cards spring back; fakes may crease (risky test!)',
    rosette_pattern: 'Print pattern visible under magnification',
    black_core: 'Cut edge should show black layer',
  },
  sports: {
    card_stock: 'Feel the card stock - should match known genuine examples',
    auto_verification: 'Compare signatures to known authentic examples',
    patch_windows: 'Check for obvious patch replacements',
  ],
}

// Investment Strategies
export const INVESTMENT_STRATEGIES = {
  budget_tiers: {
    beginner: {
      budget: '$100-500',
      strategy: 'Focus on personal collection enjoyment',
      tips: [
        'Buy cards you love, not just for investment',
        'Start with modern sets in good condition',
        'Avoid grading until you learn more',
        'Join communities to learn from others',
      ],
    },
    intermediate: {
      budget: '$500-5000',
      strategy: 'Mix of enjoyment and strategic investing',
      tips: [
        'Consider grading high-value cards',
        'Diversify across categories',
        'Buy the dips on established players/Pokémon',
        'Track your purchases and sales',
      ],
    },
    advanced: {
      budget: '$5000-50000',
      strategy: 'Portfolio approach with calculated risks',
      tips: [
        'Study population reports',
        'Buy low-pop high-grade vintage',
        'Consider sealed product for long-term',
        'Network with other serious collectors',
      ],
    },
    whale: {
      budget: '$50000+',
      strategy: 'Blue-chip collecting and market making',
      tips: [
        'Focus on trophy cards',
        'Consider auction houses for major purchases',
        'Insurance and proper storage essential',
        'Professional authentication for all purchases',
      ],
    },
  },
  market_cycles: {
    phases: [
      { name: 'Accumulation', description: 'Smart money buying quietly' },
      { name: 'Markup', description: 'Prices rising, FOMO begins' },
      { name: 'Distribution', description: 'Smart money selling to retail' },
      { name: 'Markdown', description: 'Prices falling, panic selling' },
    ],
    timing_tips: [
      'Buy during markdown/accumulation phases',
      'Sell during late markup/early distribution',
      'Dont FOMO buy at all-time highs',
      'Be patient - cards are illiquid investments',
    ],
  },
}

// Famous Cards Database
export const FAMOUS_CARDS = [
  {
    category: 'sports',
    name: 'T206 Honus Wagner',
    year: 1909,
    record_sale: '$7,250,000',
    sale_date: '2022',
    significance: 'The most famous and valuable baseball card in existence',
    story: 'Wagner reportedly demanded the card be pulled from production, creating extreme scarcity.',
  },
  {
    category: 'sports',
    name: '1952 Topps Mickey Mantle #311',
    year: 1952,
    record_sale: '$12,600,000',
    sale_date: '2022',
    significance: 'The most valuable post-war sports card',
    story: 'Unsold inventory was dumped in the Atlantic Ocean, creating scarcity.',
  },
  {
    category: 'pokemon',
    name: '1st Edition Shadowless Charizard',
    year: 1999,
    record_sale: '$420,000',
    sale_date: '2022',
    significance: 'The most iconic Pokémon card',
    story: 'Symbol of Pokémania, the card that started many collections.',
  },
  {
    category: 'pokemon',
    name: 'Pikachu Illustrator',
    year: 1998,
    record_sale: '$5,275,000',
    sale_date: '2021',
    significance: 'The rarest and most valuable Pokémon card',
    story: 'Only 39 copies exist, awarded to illustration contest winners in Japan.',
  },
  {
    category: 'mtg',
    name: 'Black Lotus (Alpha)',
    year: 1993,
    record_sale: '$540,000',
    sale_date: '2021',
    significance: 'The most powerful and valuable MTG card',
    story: 'Part of the Power Nine, on the Reserved List, will never be reprinted.',
  },
  {
    category: 'sports',
    name: '2003 Exquisite LeBron James RC Auto',
    year: 2003,
    record_sale: '$5,200,000',
    sale_date: '2022',
    significance: 'The modern basketball card king',
    story: 'Limited to 99 copies, represents the modern sports card investment era.',
  },
]

export default {
  JAVARI_SYSTEM_PROMPT,
  CARD_HISTORY,
  GRADING_KNOWLEDGE,
  COUNTERFEIT_DETECTION,
  INVESTMENT_STRATEGIES,
  FAMOUS_CARDS,
}
