// ============================================================================
// CARD MUSEUM API - HALL OF FAME & LEGENDARY CARDS
// Historical exhibits and iconic card showcases
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

interface MuseumExhibit {
  id: string;
  category: string;
  title: string;
  description: string;
  era: string;
  significance: string;
  cards: Array<{
    name: string;
    year: number;
    image: string;
    value: string;
    story: string;
  }>;
  funFacts: string[];
}

const MUSEUM_EXHIBITS: MuseumExhibit[] = [
  // ==================== POKEMON HALL OF FAME ====================
  {
    id: 'pokemon-base-set',
    category: 'pokemon',
    title: 'The Original 1999 Base Set',
    description: 'Where it all began - the legendary first Pokemon TCG set that changed collecting forever.',
    era: '1999',
    significance: 'The Base Set introduced Pokemon cards to the Western world and created a collecting phenomenon.',
    cards: [
      {
        name: 'Charizard (1st Edition)',
        year: 1999,
        image: 'https://images.pokemontcg.io/base1/4.png',
        value: '$300,000 - $500,000 (PSA 10)',
        story: 'The most sought-after Pokemon card ever. A PSA 10 1st Edition sold for $420,000 in 2022.',
      },
      {
        name: 'Blastoise (1st Edition)',
        year: 1999,
        image: 'https://images.pokemontcg.io/base1/2.png',
        value: '$30,000 - $80,000 (PSA 10)',
        story: 'The Water-type starter holo is the second most valuable Base Set card.',
      },
      {
        name: 'Venusaur (1st Edition)',
        year: 1999,
        image: 'https://images.pokemontcg.io/base1/15.png',
        value: '$20,000 - $55,000 (PSA 10)',
        story: 'Completing the starter trio, Venusaur commands strong prices in high grades.',
      },
    ],
    funFacts: [
      'Only about 1% of 1st Edition Base Set cards survive in PSA 10 condition',
      'The Base Set was printed by Wizards of the Coast under license from Nintendo',
      'Original booster packs retailed for $3.29 in 1999',
      'A sealed 1st Edition box can sell for over $400,000 today',
    ],
  },
  {
    id: 'pokemon-trophy-cards',
    category: 'pokemon',
    title: 'Pokemon Trophy Cards',
    description: 'The rarest Pokemon cards ever created - tournament prizes and promotional legends.',
    era: '1997-Present',
    significance: 'These ultra-rare cards were awarded to tournament winners and exist in extremely limited quantities.',
    cards: [
      {
        name: 'Pikachu Illustrator',
        year: 1998,
        image: 'https://images.pokemontcg.io/p/1.png',
        value: '$5,000,000+',
        story: 'Only 39 copies exist. Given to winners of the CoroCoro Comic illustration contest. One sold for $5.275 million in 2021.',
      },
      {
        name: 'No. 1 Trainer',
        year: 1999,
        image: 'https://images.pokemontcg.io/pop1/17.png',
        value: '$100,000 - $500,000',
        story: 'Awarded to regional tournament champions in Japan. Features holographic Mewtwo artwork.',
      },
      {
        name: 'Master\'s Key',
        year: 2010,
        image: 'https://images.pokemontcg.io/bw1/1.png',
        value: '$20,000 - $100,000',
        story: 'Given to Pokemon World Championship competitors. Only 36 copies exist.',
      },
    ],
    funFacts: [
      'The Pikachu Illustrator is considered the "Holy Grail" of Pokemon cards',
      'Some trophy cards have only single-digit copies in existence',
      'Trophy cards cannot be used in official gameplay',
    ],
  },

  // ==================== MTG HALL OF FAME ====================
  {
    id: 'mtg-power-nine',
    category: 'mtg',
    title: 'The Power Nine',
    description: 'The nine most powerful cards ever printed in Magic: The Gathering history.',
    era: '1993',
    significance: 'These cards from Alpha/Beta/Unlimited sets are the pinnacle of MTG collecting.',
    cards: [
      {
        name: 'Black Lotus',
        year: 1993,
        image: 'https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg',
        value: '$500,000+ (Alpha PSA 10)',
        story: 'The most iconic card in TCG history. Provides 3 mana of any color for zero cost.',
      },
      {
        name: 'Ancestral Recall',
        year: 1993,
        image: 'https://cards.scryfall.io/normal/front/2/3/2398892d-28e9-4009-81ec-0d544af79d2b.jpg',
        value: '$50,000 - $150,000 (Alpha)',
        story: 'Draw 3 cards for 1 blue mana. The most efficient card draw ever printed.',
      },
      {
        name: 'Time Walk',
        year: 1993,
        image: 'https://cards.scryfall.io/normal/front/7/0/70901356-3266-4bd9-aacc-f06c27571c66.jpg',
        value: '$40,000 - $100,000 (Alpha)',
        story: 'Take an extra turn for just 2 mana. Game-breaking power.',
      },
    ],
    funFacts: [
      'All Power Nine cards are on the Reserved List and will never be reprinted',
      'Less than 1,100 copies of each Alpha rare exist',
      'A complete set of Alpha Power Nine is worth over $1 million',
      'Black Lotus was designed to be a one-time use card but became legendary',
    ],
  },
  {
    id: 'mtg-alpha-rares',
    category: 'mtg',
    title: 'Alpha Edition Legends',
    description: 'The original 1993 Alpha set cards that started a revolution.',
    era: '1993',
    significance: 'Alpha was the first MTG set ever printed, with only 2.6 million cards produced.',
    cards: [
      {
        name: 'Underground Sea',
        year: 1993,
        image: 'https://cards.scryfall.io/normal/front/2/6/26cee543-6eab-494e-a803-33a5d48d7d74.jpg',
        value: '$15,000 - $50,000 (Alpha)',
        story: 'The Blue/Black dual land is essential for Vintage and Legacy play.',
      },
      {
        name: 'Volcanic Island',
        year: 1993,
        image: 'https://cards.scryfall.io/normal/front/2/f/2f607e7e-30c0-45e9-8f61-bf6e9fe63f2b.jpg',
        value: '$15,000 - $45,000 (Alpha)',
        story: 'The Blue/Red dual land powers some of the best decks in Eternal formats.',
      },
    ],
    funFacts: [
      'Alpha cards have rounded corners compared to later sets',
      'The entire Alpha print run sold out in one week',
      'Richard Garfield designed the game in a single weekend',
    ],
  },

  // ==================== YU-GI-OH HALL OF FAME ====================
  {
    id: 'yugioh-legends',
    category: 'yugioh',
    title: 'Yu-Gi-Oh! Legendary Cards',
    description: 'The most iconic and valuable Yu-Gi-Oh! cards from two decades of dueling.',
    era: '1999-Present',
    significance: 'These cards define the history and culture of Yu-Gi-Oh! collecting.',
    cards: [
      {
        name: 'Tournament Black Luster Soldier',
        year: 1999,
        image: 'https://images.ygoprodeck.com/images/cards/5405694.jpg',
        value: '$2,000,000+',
        story: 'The most valuable Yu-Gi-Oh! card. Only one copy exists, awarded at the first Yu-Gi-Oh! tournament.',
      },
      {
        name: 'Blue-Eyes White Dragon (LOB-001)',
        year: 2002,
        image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
        value: '$5,000 - $20,000 (PSA 10)',
        story: 'Seto Kaiba\'s signature card from the first English booster set.',
      },
      {
        name: 'Dark Magician (LOB-005)',
        year: 2002,
        image: 'https://images.ygoprodeck.com/images/cards/46986414.jpg',
        value: '$2,000 - $10,000 (PSA 10)',
        story: 'Yugi\'s ace monster from Legend of Blue-Eyes White Dragon.',
      },
    ],
    funFacts: [
      'The Tournament Black Luster Soldier has never been sold publicly',
      'Yu-Gi-Oh! cards were originally meant to be a one-time manga story element',
      'The anime and card game have run for over 25 years',
    ],
  },

  // ==================== SPORTS CARDS HALL OF FAME ====================
  {
    id: 'sports-vintage',
    category: 'sports',
    title: 'Vintage Baseball Card Legends',
    description: 'The most iconic baseball cards from the golden era of the hobby.',
    era: '1909-1952',
    significance: 'These cards predate modern collecting and represent baseball history.',
    cards: [
      {
        name: 'T206 Honus Wagner',
        year: 1909,
        image: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/T206_Honus_Wagner.jpg',
        value: '$6,600,000+',
        story: 'The "Mona Lisa of baseball cards." Only ~60 exist due to Wagner requesting production stop.',
      },
      {
        name: '1952 Topps Mickey Mantle',
        year: 1952,
        image: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/1952_Topps_311_Mickey_Mantle.jpg',
        value: '$12,600,000 (PSA 10)',
        story: 'The most expensive sports card ever sold. The "rookie" card of the Yankees legend.',
      },
      {
        name: '1914 Babe Ruth Rookie',
        year: 1914,
        image: 'https://www.thesportsdb.com/images/media/player/thumb/1914_babe_ruth.jpg',
        value: '$4,200,000+',
        story: 'The Sultan of Swat\'s earliest card from his time with the Baltimore Orioles.',
      },
    ],
    funFacts: [
      'The T206 Wagner was pulled because Wagner opposed tobacco company products',
      'Most 1952 Topps Mantles were dumped in the ocean by Topps to clear inventory',
      'Condition dramatically affects vintage card values - a PSA 1 might be worth 100x less than PSA 10',
    ],
  },
  {
    id: 'sports-modern',
    category: 'sports',
    title: 'Modern Sports Card Icons',
    description: 'The most valuable modern sports cards from basketball, football, and beyond.',
    era: '1980-Present',
    significance: 'Modern cards with autographs and limited print runs command record prices.',
    cards: [
      {
        name: '1986 Fleer Michael Jordan Rookie',
        year: 1986,
        image: 'https://www.thesportsdb.com/images/media/player/thumb/h9y6s31547838080.jpg',
        value: '$738,000 (PSA 10)',
        story: 'The GOAT\'s rookie card. Only 318 PSA 10s exist from the entire print run.',
      },
      {
        name: '2003 Exquisite LeBron James Auto Patch',
        year: 2003,
        image: 'https://www.thesportsdb.com/images/media/player/thumb/lebron_james.jpg',
        value: '$5,200,000',
        story: 'Numbered /99, this card combines rookie status with a patch and autograph.',
      },
      {
        name: '2000 Playoff Contenders Tom Brady Auto',
        year: 2000,
        image: 'https://www.thesportsdb.com/images/media/player/thumb/tom_brady.jpg',
        value: '$3,100,000',
        story: 'The 7-time Super Bowl champion\'s signed rookie sold for a football record.',
      },
    ],
    funFacts: [
      'The Jordan Fleer rookie was worth $3 raw in 1986',
      'LeBron\'s Exquisite rookie was pulled from a $500 pack',
      'Tom Brady was the 199th pick in the 2000 NFL Draft',
    ],
  },
];

// ==================== TIMELINE DATA ====================
const TIMELINE = [
  { year: 1909, event: 'T206 baseball cards released by American Tobacco Company' },
  { year: 1933, event: 'Goudey Gum Company releases first modern baseball card set' },
  { year: 1952, event: 'Topps releases iconic set featuring Mickey Mantle #311' },
  { year: 1981, event: 'Donruss and Fleer break Topps monopoly' },
  { year: 1986, event: 'Fleer releases first modern basketball set with Jordan rookie' },
  { year: 1989, event: 'Upper Deck revolutionizes sports cards with holograms' },
  { year: 1991, event: 'PSA founded, begins professional card grading' },
  { year: 1993, event: 'Magic: The Gathering released by Wizards of the Coast' },
  { year: 1996, event: 'Pokemon TCG released in Japan' },
  { year: 1999, event: 'Pokemon TCG released in USA; Yu-Gi-Oh! TCG launches in Japan' },
  { year: 2002, event: 'Yu-Gi-Oh! TCG released internationally' },
  { year: 2020, event: 'Card collecting boom during pandemic; record prices set' },
  { year: 2022, event: '1952 Topps Mantle sells for $12.6 million' },
  { year: 2023, event: 'Disney Lorcana TCG launches' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const exhibitId = searchParams.get('id');

  // Get specific exhibit
  if (exhibitId) {
    const exhibit = MUSEUM_EXHIBITS.find(e => e.id === exhibitId);
    if (exhibit) {
      return NextResponse.json({ success: true, exhibit });
    }
    return NextResponse.json({ success: false, error: 'Exhibit not found' }, { status: 404 });
  }

  // Filter by category
  let exhibits = MUSEUM_EXHIBITS;
  if (category && category !== 'all') {
    exhibits = exhibits.filter(e => e.category === category);
  }

  return NextResponse.json({
    success: true,
    exhibits: exhibits.map(({ cards, ...rest }) => ({
      ...rest,
      cardCount: cards.length,
    })),
    timeline: TIMELINE,
    categories: ['pokemon', 'mtg', 'yugioh', 'sports'],
    totalExhibits: MUSEUM_EXHIBITS.length,
  });
}
