// ============================================================================
// SET CHECKLIST & COMPLETION TRACKING API
// Track collection completion for card sets
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// Popular sets data (would be database-driven in production)
const POPULAR_SETS = {
  pokemon: [
    { id: 'base1', name: 'Base Set', year: 1999, total_cards: 102, category: 'pokemon' },
    { id: 'jungle', name: 'Jungle', year: 1999, total_cards: 64, category: 'pokemon' },
    { id: 'fossil', name: 'Fossil', year: 1999, total_cards: 62, category: 'pokemon' },
    { id: 'base2', name: 'Base Set 2', year: 2000, total_cards: 130, category: 'pokemon' },
    { id: 'teamrocket', name: 'Team Rocket', year: 2000, total_cards: 83, category: 'pokemon' },
    { id: 'gym1', name: 'Gym Heroes', year: 2000, total_cards: 132, category: 'pokemon' },
    { id: 'neo1', name: 'Neo Genesis', year: 2000, total_cards: 111, category: 'pokemon' },
    { id: 'swsh1', name: 'Sword & Shield', year: 2020, total_cards: 216, category: 'pokemon' },
    { id: 'sv1', name: 'Scarlet & Violet', year: 2023, total_cards: 258, category: 'pokemon' },
    { id: 'sv3pt5', name: '151', year: 2023, total_cards: 207, category: 'pokemon' },
  ],
  mtg: [
    { id: 'lea', name: 'Alpha', year: 1993, total_cards: 295, category: 'mtg' },
    { id: 'leb', name: 'Beta', year: 1993, total_cards: 302, category: 'mtg' },
    { id: '2ed', name: 'Unlimited', year: 1993, total_cards: 302, category: 'mtg' },
    { id: 'arn', name: 'Arabian Nights', year: 1993, total_cards: 92, category: 'mtg' },
    { id: 'atq', name: 'Antiquities', year: 1994, total_cards: 100, category: 'mtg' },
    { id: 'leg', name: 'Legends', year: 1994, total_cards: 310, category: 'mtg' },
    { id: 'dom', name: 'Dominaria', year: 2018, total_cards: 280, category: 'mtg' },
    { id: 'one', name: 'Phyrexia: All Will Be One', year: 2023, total_cards: 271, category: 'mtg' },
    { id: 'mom', name: 'March of the Machine', year: 2023, total_cards: 281, category: 'mtg' },
  ],
  yugioh: [
    { id: 'lob', name: 'Legend of Blue Eyes White Dragon', year: 2002, total_cards: 126, category: 'yugioh' },
    { id: 'mrd', name: 'Metal Raiders', year: 2002, total_cards: 144, category: 'yugioh' },
    { id: 'mrl', name: 'Magic Ruler', year: 2002, total_cards: 104, category: 'yugioh' },
    { id: 'psv', name: "Pharaoh's Servant", year: 2002, total_cards: 104, category: 'yugioh' },
    { id: 'lod', name: 'Legacy of Darkness', year: 2003, total_cards: 101, category: 'yugioh' },
    { id: 'duel', name: 'Duelist Pack', year: 2006, total_cards: 30, category: 'yugioh' },
  ],
  sports: [
    { id: 'topps1952', name: '1952 Topps Baseball', year: 1952, total_cards: 407, category: 'sports' },
    { id: 'fleer86', name: '1986 Fleer Basketball', year: 1986, total_cards: 132, category: 'sports' },
    { id: 'topps86', name: '1986 Topps Football', year: 1986, total_cards: 396, category: 'sports' },
    { id: 'upper89', name: '1989 Upper Deck Baseball', year: 1989, total_cards: 800, category: 'sports' },
    { id: 'prizm12', name: '2012 Panini Prizm Basketball', year: 2012, total_cards: 300, category: 'sports' },
    { id: 'bowman2001', name: '2001 Bowman Chrome Baseball', year: 2001, total_cards: 350, category: 'sports' },
  ],
  lorcana: [
    { id: 'tfc', name: 'The First Chapter', year: 2023, total_cards: 204, category: 'lorcana' },
    { id: 'rotf', name: 'Rise of the Floodborn', year: 2023, total_cards: 204, category: 'lorcana' },
    { id: 'itl', name: 'Into the Inklands', year: 2024, total_cards: 204, category: 'lorcana' },
    { id: 'ursula', name: "Ursula's Return", year: 2024, total_cards: 204, category: 'lorcana' },
  ],
};

// Rarity breakdowns (example for base set)
const SET_DETAILS: Record<string, any> = {
  'base1': {
    breakdown: {
      holo: 16,
      rare: 16,
      uncommon: 32,
      common: 38,
    },
    chase_cards: [
      { number: '4', name: 'Charizard', rarity: 'Holo Rare' },
      { number: '2', name: 'Blastoise', rarity: 'Holo Rare' },
      { number: '15', name: 'Venusaur', rarity: 'Holo Rare' },
    ],
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category')?.toLowerCase();
  const setId = searchParams.get('set_id')?.toLowerCase();

  // Get specific set details
  if (setId) {
    const allSets = Object.values(POPULAR_SETS).flat();
    const set = allSets.find(s => s.id === setId);
    
    if (!set) {
      return NextResponse.json({
        success: false,
        error: `Set "${setId}" not found`,
      }, { status: 404 });
    }

    const details = SET_DETAILS[setId] || {};

    return NextResponse.json({
      success: true,
      set: {
        ...set,
        ...details,
      },
    });
  }

  // Filter by category
  if (category && POPULAR_SETS[category as keyof typeof POPULAR_SETS]) {
    return NextResponse.json({
      success: true,
      category,
      sets: POPULAR_SETS[category as keyof typeof POPULAR_SETS],
    });
  }

  // Return all sets
  return NextResponse.json({
    success: true,
    sets: POPULAR_SETS,
    totalSets: Object.values(POPULAR_SETS).flat().length,
    categories: Object.keys(POPULAR_SETS),
  });
}
