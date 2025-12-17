// ============================================================================
// CARD ACADEMY - EDUCATIONAL CONTENT API
// Complete learning system for trading card collectors
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const ACADEMY_CONTENT = {
  courses: [
    // ========== BEGINNER COURSES ==========
    {
      id: 'collecting-101',
      title: 'Card Collecting 101',
      level: 'beginner',
      duration: '45 minutes',
      description: 'Everything you need to know to start your card collection journey.',
      lessons: [
        {
          id: 'lesson-1',
          title: 'What Are Trading Cards?',
          content: `Trading cards are collectible cards featuring various subjects - sports athletes, game characters, or fantasy creatures. They come in different rarities and can be played as games or collected for value.

KEY TYPES:
• Sports Cards: Feature real athletes (baseball, basketball, football, hockey, soccer)
• Trading Card Games (TCGs): Pokemon, Magic, Yu-Gi-Oh - playable games with collectible elements
• Non-Sport Cards: Movies, TV shows, comics

WHY COLLECT?
1. Nostalgia and personal connection
2. Investment potential
3. Community and trading
4. Game play enjoyment
5. Historical preservation`,
          quiz: [
            { question: 'What does TCG stand for?', answer: 'Trading Card Game' },
            { question: 'Name three major sports card categories', answer: 'Baseball, Basketball, Football' },
          ],
        },
        {
          id: 'lesson-2',
          title: 'Understanding Card Rarity',
          content: `Card rarity determines how difficult a card is to find and often affects its value.

COMMON RARITY SYMBOLS:
• Circle (●) = Common - Found in almost every pack
• Diamond (◆) = Uncommon - Several per box
• Star (★) = Rare - One per pack typically
• Holofoil/Secret = Ultra Rare - One per several packs

SPECIAL RARITIES:
• 1/1 - Only one exists worldwide
• Numbered cards - Limited print run (e.g., /25, /100)
• Autographs - Hand-signed by players/artists
• Parallels - Variant versions with different colors/patterns

RARITY DOESN'T ALWAYS = VALUE:
A common card of a superstar rookie can be worth more than a rare card of an unknown player.`,
          quiz: [
            { question: 'What symbol indicates a rare card?', answer: 'Star' },
            { question: 'What does "1/1" mean?', answer: 'Only one copy exists' },
          ],
        },
        {
          id: 'lesson-3',
          title: 'Card Conditions Explained',
          content: `Card condition dramatically affects value. A card in perfect condition can be worth 100x more than the same card in poor condition.

RAW CARD CONDITIONS:
• Mint (M) - Perfect, no visible flaws
• Near Mint (NM) - Nearly perfect, minor wear under magnification
• Excellent (EX) - Light wear on corners/edges
• Very Good (VG) - Noticeable wear but presentable
• Good (G) - Significant wear, creases possible
• Fair (F) - Heavy wear, still identifiable
• Poor (P) - Major damage, missing pieces possible

WHAT TO LOOK FOR:
1. Centering - Is the image centered in the borders?
2. Corners - Sharp or rounded?
3. Edges - Chips, whitening, or fraying?
4. Surface - Scratches, print lines, or stains?

TIP: Always examine cards under good lighting before purchasing!`,
          quiz: [
            { question: 'What is the best raw card condition?', answer: 'Mint' },
            { question: 'Name the four areas graders examine', answer: 'Centering, corners, edges, surface' },
          ],
        },
      ],
      certificate: 'Card Collecting Fundamentals Certificate',
    },
    {
      id: 'grading-mastery',
      title: 'Professional Grading Mastery',
      level: 'intermediate',
      duration: '60 minutes',
      description: 'Learn everything about professional card grading services.',
      lessons: [
        {
          id: 'grade-1',
          title: 'What is Professional Grading?',
          content: `Professional grading services authenticate and evaluate trading cards, encapsulating them in tamper-evident cases called "slabs."

WHY GRADE CARDS?
1. Authentication - Proves the card is genuine
2. Condition documentation - Objective grade
3. Protection - Sealed in protective case
4. Increased value - Graded cards often sell for more
5. Easier selling - Buyers trust third-party grades

THE MAJOR GRADING COMPANIES:
• PSA (Professional Sports Authenticator) - Industry leader, most recognized
• BGS (Beckett Grading Services) - Subgrades, Black Labels
• CGC (Certified Guaranty Company) - Growing competitor, excellent cases
• SGC (Sportscard Guaranty) - Vintage specialty, "tux" labels

WHEN TO GRADE:
- High-value cards worth more than grading cost
- Mint/near-mint condition cards
- Cards you want protected long-term
- Cards you plan to sell`,
          quiz: [
            { question: 'What is a "slab"?', answer: 'The protective case holding a graded card' },
            { question: 'Which company is the industry leader?', answer: 'PSA' },
          ],
        },
        {
          id: 'grade-2',
          title: 'Understanding the Grading Scale',
          content: `Most companies use a 1-10 scale, with 10 being perfect.

PSA SCALE:
• PSA 10 (Gem Mint) - Perfect or virtually perfect
• PSA 9 (Mint) - One minor flaw
• PSA 8 (NM-MT) - Several minor flaws
• PSA 7 (NM) - Slight wear visible
• PSA 6 (EX-MT) - Visible wear
• PSA 5 (EX) - Moderate wear
• PSA 1-4 - Varying levels of heavy wear

BGS UNIQUE FEATURES:
• Uses subgrades: Centering, Corners, Edges, Surface
• Half grades (9.5) available
• Black Label = All 10s (rarer than PSA 10)
• Pristine 10 = Perfect in every way

VALUE MULTIPLIERS (approximate):
• Raw card: 1x base value
• PSA 7: 1.2x
• PSA 8: 1.5x
• PSA 9: 2.5x
• PSA 10: 5-10x (varies by card)`,
          quiz: [
            { question: 'What is a BGS Black Label?', answer: 'All four subgrades are 10' },
            { question: 'What four areas does BGS grade?', answer: 'Centering, Corners, Edges, Surface' },
          ],
        },
      ],
      certificate: 'Certified Grading Specialist',
    },
    {
      id: 'pokemon-expert',
      title: 'Pokémon TCG Expert Course',
      level: 'intermediate',
      duration: '90 minutes',
      description: 'Master the world of Pokémon card collecting.',
      lessons: [
        {
          id: 'poke-1',
          title: 'History of Pokémon TCG',
          content: `The Pokémon Trading Card Game launched in Japan in 1996 and changed collecting forever.

TIMELINE:
• 1996: Japanese release by Media Factory
• 1998: Licensing deal with Wizards of the Coast
• 1999: English Base Set releases
• 2003: The Pokémon Company takes over from WOTC
• 2020-2021: COVID boom sends prices to record highs

KEY VINTAGE SETS:
1. Base Set (1999) - The original, most iconic
2. Jungle (1999) - First expansion
3. Fossil (1999) - Fossil Pokémon debut
4. Team Rocket (2000) - Dark Pokémon introduced
5. Neo Genesis (2000) - Johto Pokémon arrive
6. Skyridge (2003) - Last WOTC set, Crystal Pokémon

MODERN ERA SETS:
• Scarlet & Violet series (current)
• Sword & Shield era (2020-2023)
• Sun & Moon era (2017-2020)`,
          quiz: [
            { question: 'What year was the English Base Set released?', answer: '1999' },
            { question: 'Which company originally published English Pokémon cards?', answer: 'Wizards of the Coast' },
          ],
        },
        {
          id: 'poke-2',
          title: 'Identifying Valuable Pokémon Cards',
          content: `Not all Pokémon cards are created equal. Here's how to spot the valuable ones.

KEY VALUE FACTORS:
1. First Edition - "1st Edition" stamp on left side
2. Shadowless - No shadow on artwork box (Base Set only)
3. Holographic - Shiny artwork
4. Error cards - Misprints can be valuable
5. Population - How many PSA 10s exist

MOST VALUABLE POKÉMON CARDS:
1. Pikachu Illustrator - $5+ million
2. 1st Ed Shadowless Charizard - $400,000+
3. No Rarity Base Set Charizard (Japanese) - $300,000+
4. Gold Star Charizard - $50,000+
5. Shining Charizard (Neo Destiny) - $30,000+

RED FLAGS FOR FAKES:
• Wrong cardstock weight/texture
• Colors too dark or light
• Blurry text or images
• Missing copyright info
• Energy symbol errors`,
          quiz: [
            { question: 'What is the most valuable Pokémon card?', answer: 'Pikachu Illustrator' },
            { question: 'What does "shadowless" mean?', answer: 'No shadow on the artwork box' },
          ],
        },
      ],
      certificate: 'Pokémon TCG Specialist',
    },
    {
      id: 'investment-pro',
      title: 'Card Investment Professional',
      level: 'advanced',
      duration: '120 minutes',
      description: 'Advanced strategies for trading card investment.',
      lessons: [
        {
          id: 'invest-1',
          title: 'Cards as Alternative Investments',
          content: `Trading cards have become a legitimate alternative asset class.

MARKET SIZE:
• Global market estimated at $15+ billion
• Growing 20%+ annually
• Fractional ownership platforms emerging
• Major auction houses now handle cards

ADVANTAGES:
1. Tangible assets you can hold
2. Passion-driven market (emotional buyers)
3. Lower entry point than art/real estate
4. Tax advantages in some jurisdictions
5. Historically outperformed S&P 500 in some periods

RISKS:
1. Liquidity can be limited
2. Authentication concerns
3. Market volatility (COVID boom/bust)
4. Storage and insurance costs
5. Condition degradation over time

DIVERSIFICATION:
Don't put all eggs in one basket:
• Mix sports and TCG
• Mix vintage and modern
• Mix graded and raw
• Mix high-end and mid-tier`,
          quiz: [
            { question: 'What is the estimated global card market size?', answer: '$15+ billion' },
            { question: 'Name two risks of card investing', answer: 'Liquidity, authentication concerns' },
          ],
        },
      ],
      certificate: 'Certified Card Investment Advisor',
    },
  ],

  glossary: {
    A: [
      { term: 'Auto', definition: 'A card with an authentic signature' },
      { term: 'Acetate', definition: 'Clear plastic card material' },
    ],
    B: [
      { term: 'Base Card', definition: 'A standard, non-parallel card from the main set' },
      { term: 'Blaster', definition: 'A retail box containing multiple packs' },
      { term: 'Box Break', definition: 'Opening packs on livestream, often selling spots' },
    ],
    C: [
      { term: 'Centering', definition: 'How evenly the image is positioned within borders' },
      { term: 'Chase Card', definition: 'A highly desirable, hard-to-find card' },
      { term: 'Chromium', definition: 'Shiny, chrome-like card finish' },
    ],
    H: [
      { term: 'Hobby Box', definition: 'Higher-end product sold at card shops' },
      { term: 'Hit', definition: 'A valuable pull (auto, relic, numbered card)' },
    ],
    P: [
      { term: 'Parallel', definition: 'Variant version of a card with different finish' },
      { term: 'PSA', definition: 'Professional Sports Authenticator - grading company' },
      { term: 'Pull', definition: 'A card obtained from opening a pack' },
    ],
    R: [
      { term: 'Raw', definition: 'An ungraded card' },
      { term: 'Relic', definition: 'A card containing game-used memorabilia' },
      { term: 'Refractor', definition: 'A shiny, rainbow-reflecting parallel' },
    ],
    S: [
      { term: 'Slab', definition: 'A graded card in its protective holder' },
      { term: 'Short Print', definition: 'A card with limited production' },
      { term: 'Superfractor', definition: 'A 1/1 ultra-rare parallel' },
    ],
    W: [
      { term: 'Wax', definition: 'Vintage card packs with wax wrappers' },
      { term: 'Whitening', definition: 'White marks on card edges from wear' },
    ],
  },

  tips: [
    'Always buy from reputable sellers with return policies',
    'Store valuable cards in penny sleeves inside toploaders',
    'Never touch the face of a card with bare fingers',
    'Check PSA/BGS population reports before buying graded cards',
    'Take photos of all purchases for insurance purposes',
    'Join collector communities to learn and network',
    'Start with what you love, not what\'s "hot"',
    'Be patient - the best deals require waiting',
    'Always verify authenticity before major purchases',
    'Keep receipts and certificates of authenticity',
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  const courseId = searchParams.get('course');
  const letter = searchParams.get('letter');

  if (section === 'courses') {
    if (courseId) {
      const course = ACADEMY_CONTENT.courses.find(c => c.id === courseId);
      if (course) {
        return NextResponse.json({ success: true, data: course });
      }
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: ACADEMY_CONTENT.courses.map(c => ({
        id: c.id,
        title: c.title,
        level: c.level,
        duration: c.duration,
        description: c.description,
        lessonCount: c.lessons.length,
        certificate: c.certificate,
      })),
    });
  }

  if (section === 'glossary') {
    if (letter) {
      const terms = ACADEMY_CONTENT.glossary[letter.toUpperCase() as keyof typeof ACADEMY_CONTENT.glossary];
      return NextResponse.json({ success: true, data: terms || [] });
    }
    return NextResponse.json({ success: true, data: ACADEMY_CONTENT.glossary });
  }

  if (section === 'tips') {
    return NextResponse.json({ success: true, data: ACADEMY_CONTENT.tips });
  }

  return NextResponse.json({
    success: true,
    data: {
      totalCourses: ACADEMY_CONTENT.courses.length,
      totalLessons: ACADEMY_CONTENT.courses.reduce((sum, c) => sum + c.lessons.length, 0),
      glossaryTerms: Object.values(ACADEMY_CONTENT.glossary).flat().length,
      tips: ACADEMY_CONTENT.tips.length,
    },
    sections: ['courses', 'glossary', 'tips'],
  });
}
