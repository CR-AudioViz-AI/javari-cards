// ============================================================================
// CARD COLLECTOR KNOWLEDGE BASE API
// Educational content for all card categories
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

interface KnowledgeArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  tags: string[];
}

const KNOWLEDGE_BASE: KnowledgeArticle[] = [
  // ==================== POKEMON KNOWLEDGE ====================
  {
    id: 'pokemon-intro',
    category: 'pokemon',
    title: 'Introduction to Pokemon TCG Collecting',
    summary: 'Everything beginners need to know about collecting Pokemon cards.',
    difficulty: 'beginner',
    readTime: 5,
    tags: ['pokemon', 'beginner', 'guide'],
    content: `
# Introduction to Pokemon TCG Collecting

Pokemon cards have been captivating collectors since 1996. Here's what you need to know to start your collection.

## History
The Pokemon Trading Card Game was first released in Japan in October 1996 by Media Factory. It came to the United States in January 1999, published by Wizards of the Coast.

## Card Types
- **Pokemon Cards**: The creatures you collect and battle with
- **Trainer Cards**: Items, Supporters, and Stadium cards
- **Energy Cards**: Power your Pokemon's attacks

## Rarity Symbols
- Circle = Common
- Diamond = Uncommon  
- Star = Rare
- Star H = Holo Rare
- Multiple stars = Ultra/Secret Rare

## What Makes Cards Valuable
1. **Rarity**: Limited print runs increase value
2. **Condition**: Mint cards are worth more
3. **Popularity**: Fan-favorite Pokemon command premiums
4. **Age**: Vintage cards, especially sealed, appreciate over time
5. **Grading**: PSA/BGS graded cards sell for more

## Getting Started
1. Decide your focus: collecting vs. playing vs. investing
2. Set a budget
3. Learn about authenticity
4. Protect your cards with sleeves and toploaders
5. Track your collection
    `
  },
  {
    id: 'pokemon-grading-guide',
    category: 'pokemon',
    title: 'Pokemon Card Grading Guide',
    summary: 'Understanding PSA, BGS, and CGC grades for Pokemon cards.',
    difficulty: 'intermediate',
    readTime: 8,
    tags: ['pokemon', 'grading', 'PSA', 'BGS'],
    content: `
# Pokemon Card Grading Guide

Professional grading adds value and authenticity to your cards. Here's what you need to know.

## Why Grade Cards?
- Authenticates the card
- Protects in a tamper-proof case
- Provides objective condition assessment
- Increases resale value
- Makes selling easier

## Major Grading Companies

### PSA (Professional Sports Authenticator)
- Most recognized for Pokemon
- 1-10 scale
- PSA 10 = Gem Mint
- Highest population of graded Pokemon cards

### BGS (Beckett Grading Services)
- Uses subgrades (centering, corners, edges, surface)
- Half-point grades (9.5, 8.5, etc.)
- BGS 10 "Black Label" = all 10 subgrades
- Preferred by some for modern cards

### CGC (Certified Guaranty Company)
- Newer to trading cards (2020)
- Also uses subgrades
- Competitive pricing
- Growing acceptance

## What Affects Grade?
1. **Centering**: 60/40 or better for PSA 10
2. **Corners**: Must be sharp
3. **Edges**: No whitening or chips
4. **Surface**: No scratches, print lines minimal
5. **Creases**: Any crease typically caps at PSA 5

## When to Grade
- Card raw value is significant
- You believe it will grade 9 or higher
- You want long-term protection
- Planning to sell
    `
  },
  {
    id: 'pokemon-vintage',
    category: 'pokemon',
    title: 'Vintage Pokemon Card Guide (1999-2003)',
    summary: 'Guide to collecting WOTC-era Pokemon cards.',
    difficulty: 'advanced',
    readTime: 12,
    tags: ['pokemon', 'vintage', 'WOTC', 'investment'],
    content: `
# Vintage Pokemon Card Guide (WOTC Era)

The Wizards of the Coast era (1999-2003) represents the most collectible period in Pokemon TCG history.

## Key Sets

### Base Set (1999)
- First English set
- 102 cards
- Key cards: Charizard, Blastoise, Venusaur holos
- Variants: 1st Edition, Shadowless, Unlimited

### Jungle (1999)
- First expansion
- 64 cards
- Introduced new Pokemon
- Key cards: Pikachu promo, Jolteon holo

### Fossil (1999)
- 62 cards
- Prehistoric Pokemon theme
- Key cards: Gengar, Dragonite, Mew (promo)

### Base Set 2 (2000)
- Reprint set
- 130 cards
- Less valuable than original Base Set

### Team Rocket (2000)
- Dark Pokemon introduced
- 82 cards
- Key cards: Dark Charizard, Dark Blastoise

### Gym Heroes/Gym Challenge (2000)
- Gym Leader themed
- Key cards: Blaine's Charizard

### Neo Sets (2000-2002)
- Neo Genesis, Discovery, Revelation, Destiny
- Introduced Generation 2 Pokemon
- Key cards: Shining cards, Lugia

## Identifying Variants

### 1st Edition
- "Edition 1" stamp on left side
- Most valuable variant
- Limited initial print run

### Shadowless
- No shadow on right side of image box
- Printed before shadow was added
- Second most valuable Base Set variant

### Unlimited
- Shadow present
- Most common variant
- Still collectible in high grades
    `
  },

  // ==================== MTG KNOWLEDGE ====================
  {
    id: 'mtg-intro',
    category: 'mtg',
    title: 'Introduction to Magic: The Gathering Collecting',
    summary: 'Getting started with MTG card collecting.',
    difficulty: 'beginner',
    readTime: 6,
    tags: ['mtg', 'beginner', 'guide'],
    content: `
# Introduction to Magic: The Gathering Collecting

Magic: The Gathering is the original trading card game, launched in 1993. Here's how to start collecting.

## History
Created by mathematician Richard Garfield and published by Wizards of the Coast, MTG revolutionized gaming.

## The Five Colors
- **White**: Order, protection, healing
- **Blue**: Knowledge, manipulation, control
- **Black**: Power, death, sacrifice
- **Red**: Chaos, fire, aggression
- **Green**: Nature, growth, creatures

## Card Types
- Creatures
- Instants
- Sorceries
- Enchantments
- Artifacts
- Planeswalkers
- Lands

## Rarity
- Common (C)
- Uncommon (U)
- Rare (R)
- Mythic Rare (M) - introduced in 2008

## The Reserved List
Wizards of the Coast promised never to reprint certain cards from early sets. These cards can only go up in value as supply decreases.

Key Reserved List cards:
- Black Lotus
- All original Moxen
- Time Walk
- Ancestral Recall
- Dual Lands
    `
  },
  {
    id: 'mtg-power-nine',
    category: 'mtg',
    title: 'The Power Nine Explained',
    summary: 'Everything about the most powerful and valuable MTG cards.',
    difficulty: 'advanced',
    readTime: 10,
    tags: ['mtg', 'power nine', 'vintage', 'investment'],
    content: `
# The Power Nine

The Power Nine are the most powerful and valuable cards in Magic history.

## The Cards

### Black Lotus
- Cost: 0
- Effect: Add 3 mana of any one color
- Value: $100,000 - $500,000+ (Alpha)
- The most iconic MTG card

### Ancestral Recall
- Cost: U (1 blue)
- Effect: Draw 3 cards
- Value: $10,000 - $100,000+ (Alpha)
- Most efficient card draw ever printed

### Time Walk
- Cost: 1U
- Effect: Take an extra turn
- Value: $10,000 - $80,000+ (Alpha)
- Extra turns win games

### Mox Sapphire
- Cost: 0
- Effect: Tap for 1 blue mana
- Value: $8,000 - $50,000+ (Alpha)

### Mox Jet
- Cost: 0
- Effect: Tap for 1 black mana
- Value: $8,000 - $50,000+ (Alpha)

### Mox Pearl
- Cost: 0
- Effect: Tap for 1 white mana
- Value: $7,000 - $45,000+ (Alpha)

### Mox Ruby
- Cost: 0
- Effect: Tap for 1 red mana
- Value: $8,000 - $50,000+ (Alpha)

### Mox Emerald
- Cost: 0
- Effect: Tap for 1 green mana
- Value: $7,000 - $45,000+ (Alpha)

### Timetwister
- Cost: 2U
- Effect: Shuffle hands and graveyards into libraries, draw 7
- Value: $5,000 - $30,000+ (Alpha)

## Why So Valuable?
1. Never reprinted (Reserved List)
2. Extremely powerful in gameplay
3. Historic significance
4. Extremely rare in high grades
    `
  },

  // ==================== YU-GI-OH KNOWLEDGE ====================
  {
    id: 'yugioh-intro',
    category: 'yugioh',
    title: 'Introduction to Yu-Gi-Oh! Collecting',
    summary: 'Start your Yu-Gi-Oh! card collection the right way.',
    difficulty: 'beginner',
    readTime: 5,
    tags: ['yugioh', 'beginner', 'guide'],
    content: `
# Introduction to Yu-Gi-Oh! Collecting

Yu-Gi-Oh! has been a dominant TCG since 1999. Here's your collecting guide.

## History
Based on the manga by Kazuki Takahashi, the card game launched in Japan in 1999 and internationally in 2002.

## Card Types
- **Normal Monsters**: Yellow border, no effects
- **Effect Monsters**: Orange border, have abilities
- **Ritual Monsters**: Blue border, summoned via Ritual Spells
- **Fusion Monsters**: Purple border, Extra Deck
- **Synchro Monsters**: White border, Extra Deck
- **Xyz Monsters**: Black border, Extra Deck
- **Link Monsters**: Blue arrows, Extra Deck
- **Spell Cards**: Green border
- **Trap Cards**: Purple border

## Rarity Levels
- Common
- Rare
- Super Rare (holographic image)
- Ultra Rare (gold text + holo image)
- Secret Rare (rainbow text + holo)
- Ultimate Rare (embossed)
- Ghost Rare (3D effect)
- Starlight Rare (extremely rare)

## Key Collectible Cards
- Blue-Eyes White Dragon (original)
- Dark Magician (original)
- Exodia pieces
- Tournament prize cards
    `
  },

  // ==================== SPORTS CARDS KNOWLEDGE ====================
  {
    id: 'sports-intro',
    category: 'sports',
    title: 'Introduction to Sports Card Collecting',
    summary: 'Get started with sports card collecting basics.',
    difficulty: 'beginner',
    readTime: 6,
    tags: ['sports', 'beginner', 'guide'],
    content: `
# Introduction to Sports Card Collecting

Sports cards are one of the oldest and most valuable collectibles categories.

## History
- 1860s: First baseball cards as tobacco inserts
- 1950s: Topps dominates the market
- 1980s-90s: Card boom with multiple manufacturers
- 2020s: Record prices, digital integration

## Major Sports
- Baseball (longest history)
- Basketball (hottest market)
- Football (strong following)
- Hockey (dedicated collectors)
- Soccer (growing rapidly)

## Key Manufacturers
- **Topps**: Baseball exclusive since 2021
- **Panini**: Basketball, Football exclusive
- **Upper Deck**: Hockey exclusive
- **Fanatics**: Taking over in 2025-2026

## What to Collect
- Rookie Cards (RC): First official card
- Autographs: Signed by players
- Memorabilia: Contains jersey/bat pieces
- Parallels: Numbered variants
- Inserts: Special themed cards

## Value Factors
1. Player performance and potential
2. Card condition
3. Scarcity/print run
4. Autograph/memorabilia inclusion
5. Historical significance
    `
  },
  {
    id: 'sports-rookie-guide',
    category: 'sports',
    title: 'Understanding Rookie Cards',
    summary: 'Complete guide to identifying and valuing rookie cards.',
    difficulty: 'intermediate',
    readTime: 8,
    tags: ['sports', 'rookie', 'investment'],
    content: `
# Understanding Rookie Cards

Rookie cards are the foundation of sports card collecting.

## What is a Rookie Card?
A player's first officially licensed trading card from a major manufacturer.

## Identifying True Rookies
- Look for "RC" logo (modern cards)
- Check release year vs. player's first season
- Verify it's from a major set, not a promo

## Most Valuable Rookie Cards

### Baseball
1. T206 Honus Wagner (1909) - $6.6 million
2. 1952 Topps Mickey Mantle - $12.6 million
3. 1951 Bowman Mickey Mantle - $5.2 million

### Basketball
1. 1986 Fleer Michael Jordan - $738,000 (PSA 10)
2. 2003 Exquisite LeBron James Auto - $5.2 million
3. 1969 Topps Lew Alcindor - $500,000+

### Football
1. 2000 Playoff Contenders Tom Brady Auto - $3.1 million
2. 1958 Topps Jim Brown - $358,000
3. 1935 National Chicle Bronko Nagurski - $700,000+

## Rookie Card Investing Tips
1. Buy the player, not the card
2. Condition is everything
3. Get significant cards graded
4. Diversify across sports/players
5. Buy during slumps, sell during peaks
    `
  },

  // ==================== GRADING KNOWLEDGE ====================
  {
    id: 'grading-complete-guide',
    category: 'grading',
    title: 'Complete Card Grading Guide',
    summary: 'Everything you need to know about professional card grading.',
    difficulty: 'intermediate',
    readTime: 10,
    tags: ['grading', 'PSA', 'BGS', 'CGC', 'guide'],
    content: `
# Complete Card Grading Guide

Professional grading is essential for serious collectors and investors.

## Why Grade?
1. Authentication
2. Condition verification
3. Protection
4. Increased value
5. Easier selling

## Grading Companies Compared

### PSA
- Most recognized
- 1-10 scale
- Highest resale premiums
- Longest turnaround times

### BGS
- Subgrades included
- Half-point grades
- Black Label for perfect 10s
- Preferred for modern cards

### CGC
- Competitive pricing
- Fast turnaround
- Growing acceptance
- Subgrades available

### SGC
- Fast service
- Growing popularity
- Good for vintage
- Tuxedo holders

## Grade Scale
- 10: Gem Mint/Pristine
- 9: Mint
- 8: Near Mint-Mint
- 7: Near Mint
- 6: Excellent-Mint
- 5: Excellent
- 4: Very Good-Excellent
- 3: Very Good
- 2: Good
- 1: Poor

## Self-Grading Tips
Before submitting, check:
1. Centering (use centering tool)
2. Corners (use loupe)
3. Edges (check for whitening)
4. Surface (check for scratches)
5. Print defects
    `
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const id = searchParams.get('id');
  const difficulty = searchParams.get('difficulty');

  // Get specific article
  if (id) {
    const article = KNOWLEDGE_BASE.find(a => a.id === id);
    if (article) {
      return NextResponse.json({ success: true, article });
    }
    return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
  }

  // Filter articles
  let filtered = [...KNOWLEDGE_BASE];
  
  if (category && category !== 'all') {
    filtered = filtered.filter(a => a.category === category);
  }
  
  if (difficulty) {
    filtered = filtered.filter(a => a.difficulty === difficulty);
  }

  // Return list without full content
  const articles = filtered.map(({ content, ...rest }) => rest);

  return NextResponse.json({
    success: true,
    articles,
    total: articles.length,
    categories: ['pokemon', 'mtg', 'yugioh', 'sports', 'grading'],
    difficulties: ['beginner', 'intermediate', 'advanced'],
  });
}
