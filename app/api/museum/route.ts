// ============================================================================
// MUSEUM CONTENT API - Card History & Education
// CravCards - CR AudioViz AI, LLC
// Created: December 2024
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const MUSEUM_EXHIBITS = {
  pokemon: {
    title: 'Pokemon Trading Card Game',
    subtitle: 'From Japan to Global Phenomenon',
    founded: '1996 (Japan), 1999 (US)',
    timeline: [
      { year: 1996, event: 'Pokemon TCG launches in Japan' },
      { year: 1999, event: 'Base Set releases in United States' },
      { year: 2000, event: 'Pokemon TCG becomes world\'s best-selling card game' },
      { year: 2003, event: 'EX series introduces powerful EX Pokemon' },
      { year: 2016, event: 'Pokemon GO causes massive resurgence in interest' },
      { year: 2020, event: 'COVID-19 pandemic sparks collecting boom' },
      { year: 2021, event: 'PSA 10 1st Edition Charizard sells for $420,000' },
      { year: 2022, event: 'Celebrations 25th anniversary set released' },
      { year: 2023, event: 'Scarlet & Violet era begins' },
    ],
    iconicCards: [
      { name: 'Charizard - Base Set', year: 1999, value: '$300,000+ (PSA 10 1st Ed)', image: 'https://images.pokemontcg.io/base1/4.png', description: 'The most iconic Pokemon card ever printed' },
      { name: 'Pikachu Illustrator', year: 1998, value: '$5,000,000+', image: 'https://images.pokemontcg.io/basep/1.png', description: 'Rarest Pokemon card - only 39 ever printed' },
      { name: 'Shadowless Blastoise', year: 1999, value: '$50,000+ (PSA 10)', image: 'https://images.pokemontcg.io/base1/2.png', description: 'Early print variant highly sought after' },
      { name: 'Gold Star Rayquaza', year: 2005, value: '$10,000+ (PSA 10)', image: 'https://images.pokemontcg.io/exdeoxys/107.png', description: 'One of the rarest modern Pokemon cards' },
    ],
    facts: [
      'Over 52 billion Pokemon cards have been produced worldwide',
      'The Pokemon TCG is available in 13 languages',
      'There have been over 100 expansion sets released',
      'The first Pokemon TCG World Championship was held in 2004',
    ],
  },
  mtg: {
    title: 'Magic: The Gathering',
    subtitle: 'The Original Trading Card Game',
    founded: '1993',
    timeline: [
      { year: 1993, event: 'Richard Garfield creates Magic: The Gathering' },
      { year: 1993, event: 'Alpha and Beta sets released' },
      { year: 1994, event: 'Antiquities introduces artifacts focus' },
      { year: 1995, event: 'Chronicles and Ice Age released' },
      { year: 1996, event: 'Reserve List established to protect card values' },
      { year: 2002, event: 'Magic Online launches' },
      { year: 2018, event: 'MTG Arena brings game to new generation' },
      { year: 2021, event: 'Alpha Black Lotus sells for $511,100' },
      { year: 2023, event: 'Lord of the Rings crossover set released' },
    ],
    iconicCards: [
      { name: 'Black Lotus', year: 1993, value: '$500,000+ (Alpha PSA 10)', image: 'https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg', description: 'Most powerful and valuable MTG card ever' },
      { name: 'Ancestral Recall', year: 1993, value: '$80,000+ (Alpha)', image: 'https://cards.scryfall.io/normal/front/2/3/2398892d-28e9-4009-81ec-0d544af79d2b.jpg', description: 'Draw 3 cards for 1 blue mana' },
      { name: 'Underground Sea', year: 1993, value: '$15,000+ (Alpha)', image: 'https://cards.scryfall.io/normal/front/2/6/26cee543-6eab-494e-a803-33a5d48d7d74.jpg', description: 'Original dual land, never to be reprinted' },
      { name: 'Mox Sapphire', year: 1993, value: '$80,000+ (Alpha)', image: 'https://cards.scryfall.io/normal/front/e/a/ea1feac0-d3a7-45eb-9719-1cdebb0a9f62.jpg', description: 'Part of the Power Nine' },
    ],
    facts: [
      'Over 20,000 unique cards have been printed',
      'MTG is played in over 70 countries',
      'The Pro Tour has awarded over $50 million in prizes',
      'Richard Garfield holds a PhD in combinatorial mathematics',
    ],
  },
  yugioh: {
    title: 'Yu-Gi-Oh! Trading Card Game',
    subtitle: 'It\'s Time to Duel!',
    founded: '1999 (Japan), 2002 (US)',
    timeline: [
      { year: 1999, event: 'Yu-Gi-Oh! OCG launches in Japan' },
      { year: 2000, event: 'Anime series begins airing' },
      { year: 2002, event: 'TCG launches in North America' },
      { year: 2002, event: 'Legend of Blue Eyes White Dragon released' },
      { year: 2008, event: '5D\'s era introduces Synchro monsters' },
      { year: 2011, event: 'Xyz monsters introduced' },
      { year: 2017, event: 'Link Summoning mechanic added' },
      { year: 2021, event: 'Tournament Black Luster Soldier sells for $2 million' },
    ],
    iconicCards: [
      { name: 'Blue-Eyes White Dragon', year: 1999, value: '$50,000+ (LOB 1st Ed)', image: 'https://images.ygoprodeck.com/images/cards_small/89631139.jpg', description: 'Seto Kaiba\'s legendary dragon' },
      { name: 'Dark Magician', year: 1999, value: '$10,000+ (LOB 1st Ed)', image: 'https://images.ygoprodeck.com/images/cards_small/46986414.jpg', description: 'Yugi\'s signature spellcaster' },
      { name: 'Exodia the Forbidden One', year: 2002, value: '$5,000+ (LOB complete set)', image: 'https://images.ygoprodeck.com/images/cards_small/33396948.jpg', description: 'Instant win condition' },
      { name: 'Tournament Black Luster Soldier', year: 1999, value: '$2,000,000+', image: 'https://images.ygoprodeck.com/images/cards_small/5405694.jpg', description: 'Rarest Yu-Gi-Oh card ever' },
    ],
    facts: [
      'Over 35 billion Yu-Gi-Oh cards have been sold',
      'Guinness World Record: Best-selling trading card game',
      'The anime has aired over 900 episodes across all series',
      'Over 10,000 unique cards exist in the TCG',
    ],
  },
  sports: {
    title: 'Sports Card Collecting',
    subtitle: '150+ Years of Athletic Heroes',
    founded: '1860s',
    timeline: [
      { year: 1868, event: 'First baseball cards produced (Peck & Snyder)' },
      { year: 1909, event: 'T206 Honus Wagner card produced' },
      { year: 1933, event: 'Goudey Gum produces first bubble gum cards' },
      { year: 1952, event: 'Topps produces iconic Mickey Mantle card' },
      { year: 1979, event: 'Wayne Gretzky O-Pee-Chee rookie released' },
      { year: 1986, event: 'Fleer produces Michael Jordan rookie' },
      { year: 1989, event: 'Upper Deck revolutionizes card quality' },
      { year: 2020, event: 'Sports cards boom during pandemic' },
      { year: 2022, event: 'T206 Wagner sells for $7.25 million' },
    ],
    iconicCards: [
      { name: 'T206 Honus Wagner', year: 1909, value: '$7,250,000', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/T206_Honus_Wagner.jpg/220px-T206_Honus_Wagner.jpg', description: 'The Holy Grail of sports cards' },
      { name: '1952 Topps Mickey Mantle', year: 1952, value: '$12,600,000 (PSA 9)', image: 'https://upload.wikimedia.org/wikipedia/en/7/7a/1952_Topps_Mickey_Mantle.jpg', description: 'Most valuable post-war baseball card' },
      { name: '1986 Fleer Michael Jordan', year: 1986, value: '$738,000 (PSA 10)', image: 'https://www.psacard.com/cert/76799843/michaeljordan', description: 'The king of basketball cards' },
      { name: '2000 Playoff Contenders Tom Brady', year: 2000, value: '$3,100,000', image: 'https://www.psacard.com/cert/52885817', description: 'Most valuable football card' },
    ],
    facts: [
      'The sports card industry is worth over $5.4 billion annually',
      'PSA has graded over 50 million cards',
      'Rookie cards typically command the highest premiums',
      'Game-used memorabilia cards were introduced in 1996',
    ],
  },
  lorcana: {
    title: 'Disney Lorcana',
    subtitle: 'Magic Meets Disney',
    founded: '2023',
    timeline: [
      { year: 2022, event: 'Disney Lorcana announced at D23' },
      { year: 2023, event: 'The First Chapter releases' },
      { year: 2023, event: 'Rise of the Floodborn expansion' },
      { year: 2024, event: 'Into the Inklands released' },
      { year: 2024, event: 'Ursula\'s Return expansion' },
      { year: 2024, event: 'Shimmering Skies released' },
    ],
    iconicCards: [
      { name: 'Mickey Mouse - Brave Little Tailor (Enchanted)', year: 2023, value: '$500+', image: 'https://lorcana-api.com/images/cards/TFC/1.png', description: 'First Chapter chase card' },
      { name: 'Elsa - Spirit of Winter (Enchanted)', year: 2023, value: '$800+', image: 'https://lorcana-api.com/images/cards/TFC/2.png', description: 'Most sought-after Enchanted' },
      { name: 'Stitch - Rock Star (Enchanted)', year: 2023, value: '$300+', image: 'https://lorcana-api.com/images/cards/TFC/3.png', description: 'Popular character variant' },
    ],
    facts: [
      'Lorcana sold over 1 billion cards in its first year',
      'The game features 6 ink colors with unique playstyles',
      'Enchanted cards are the highest rarity level',
      'Players collect "Lore" to win instead of attacking opponents directly',
    ],
  },
};

const GRADING_GUIDE = {
  title: 'Card Grading 101',
  companies: [
    { name: 'PSA', fullName: 'Professional Sports Authenticator', founded: 1991, specialty: 'Sports & Pokemon', grades: '1-10 scale', topGrade: 'PSA 10 Gem Mint' },
    { name: 'BGS', fullName: 'Beckett Grading Services', founded: 1999, specialty: 'All TCGs', grades: '1-10 with subgrades', topGrade: 'BGS 10 Pristine/Black Label' },
    { name: 'CGC', fullName: 'Certified Guaranty Company', founded: 2020, specialty: 'Trading Cards', grades: '1-10 with subgrades', topGrade: 'CGC 10 Perfect' },
    { name: 'SGC', fullName: 'Sportscard Guaranty', founded: 1998, specialty: 'Vintage Sports', grades: '1-10 scale', topGrade: 'SGC 10 Gem Mint' },
  ],
  factors: [
    { name: 'Centering', description: 'How well the image is centered within the borders', impact: 'High' },
    { name: 'Corners', description: 'Sharpness and condition of all four corners', impact: 'High' },
    { name: 'Edges', description: 'Smoothness and condition of card edges', impact: 'Medium' },
    { name: 'Surface', description: 'Scratches, print defects, or damage on card face', impact: 'High' },
  ],
  tips: [
    'Always use penny sleeves and top loaders for storage',
    'Never touch the surface of a card with bare fingers',
    'Store cards in a cool, dry environment',
    'Consider the cost vs value before grading',
    'Research population reports before submitting',
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category')?.toLowerCase();
  const section = searchParams.get('section');

  // Return specific exhibit
  if (category && MUSEUM_EXHIBITS[category as keyof typeof MUSEUM_EXHIBITS]) {
    return NextResponse.json({
      success: true,
      exhibit: MUSEUM_EXHIBITS[category as keyof typeof MUSEUM_EXHIBITS],
    });
  }

  // Return grading guide
  if (section === 'grading') {
    return NextResponse.json({
      success: true,
      grading: GRADING_GUIDE,
    });
  }

  // Return all exhibits overview
  return NextResponse.json({
    success: true,
    exhibits: Object.entries(MUSEUM_EXHIBITS).map(([key, exhibit]) => ({
      id: key,
      title: exhibit.title,
      subtitle: exhibit.subtitle,
      founded: exhibit.founded,
      cardCount: exhibit.iconicCards.length,
      timelineEvents: exhibit.timeline.length,
    })),
    gradingGuide: GRADING_GUIDE,
    totalExhibits: Object.keys(MUSEUM_EXHIBITS).length,
  });
}
