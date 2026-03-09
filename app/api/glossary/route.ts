export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// CARD COLLECTING GLOSSARY API
// Comprehensive terminology for all trading card games
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const GLOSSARY: Record<string, { term: string; definition: string; category: string; related?: string[] }> = {
  // Grading Terms
  'psa': { term: 'PSA', definition: 'Professional Sports Authenticator - The largest and most popular card grading company, founded in 1991.', category: 'grading', related: ['bgs', 'cgc', 'sgc'] },
  'bgs': { term: 'BGS', definition: 'Beckett Grading Services - Known for subgrades and the prestigious Black Label designation.', category: 'grading', related: ['psa', 'cgc'] },
  'cgc': { term: 'CGC', definition: 'Certified Guaranty Company - Originally for comics, expanded to cards in 2020.', category: 'grading', related: ['psa', 'bgs'] },
  'sgc': { term: 'SGC', definition: 'Sportscard Guaranty Corporation - Known for vintage card grading and tuxedo holders.', category: 'grading' },
  'gem_mint': { term: 'Gem Mint', definition: 'The highest grade designation (PSA 10, BGS 9.5+), indicating a virtually perfect card.', category: 'grading' },
  'black_label': { term: 'Black Label', definition: 'BGS designation when all four subgrades are perfect 10s. Extremely rare and valuable.', category: 'grading' },
  'subgrades': { term: 'Subgrades', definition: 'Individual scores for Centering, Corners, Edges, and Surface used by BGS and CGC.', category: 'grading' },
  'pop_report': { term: 'Population Report', definition: 'Database showing how many cards of each grade exist. Lower population = higher value.', category: 'grading' },
  'crossover': { term: 'Crossover', definition: 'Submitting a graded card to a different company hoping for a higher grade.', category: 'grading' },
  'cracked': { term: 'Cracked', definition: 'Removing a card from its graded case, usually to resubmit or sell raw.', category: 'grading' },

  // Condition Terms
  'mint': { term: 'Mint', definition: 'Near perfect condition with no visible wear or defects.', category: 'condition' },
  'nm': { term: 'Near Mint (NM)', definition: 'Excellent condition with only minor wear visible under close inspection.', category: 'condition' },
  'whitening': { term: 'Whitening', definition: 'White spots or lines on card edges caused by wear or production.', category: 'condition' },
  'centering': { term: 'Centering', definition: 'How well the card image is aligned within the borders. 60/40 or better is typically acceptable.', category: 'condition' },
  'dinged': { term: 'Dinged', definition: 'Small dent or ding on the card, usually on corners or edges.', category: 'condition' },
  'surface_scratch': { term: 'Surface Scratch', definition: 'Light scratching on the card surface, common on holos and foils.', category: 'condition' },
  'print_line': { term: 'Print Line', definition: 'Factory defect appearing as a line across the card from the printing process.', category: 'condition' },
  'oc': { term: 'Off-Center (OC)', definition: 'Card with noticeably uneven borders, reducing grade potential.', category: 'condition' },

  // Pokemon Terms
  'shadowless': { term: 'Shadowless', definition: 'Early Pokemon Base Set cards without shadow on the right side of the image box. More valuable than Unlimited.', category: 'pokemon', related: ['first_edition', 'unlimited'] },
  'first_edition': { term: 'First Edition', definition: 'First print run of a set, marked with a 1st Edition stamp. Highly collectible.', category: 'pokemon' },
  'unlimited': { term: 'Unlimited', definition: 'Standard print run after First Edition, has shadow and no stamp.', category: 'pokemon' },
  'holo': { term: 'Holo/Holographic', definition: 'Card with holographic foil pattern in the artwork area.', category: 'pokemon' },
  'reverse_holo': { term: 'Reverse Holo', definition: 'Card with holographic pattern on everything except the artwork.', category: 'pokemon' },
  'full_art': { term: 'Full Art', definition: 'Card where artwork extends to the edges with no border.', category: 'pokemon' },
  'alt_art': { term: 'Alt Art/Alternate Art', definition: 'Alternative artwork version of a card, often more valuable.', category: 'pokemon' },
  'secret_rare': { term: 'Secret Rare', definition: 'Cards numbered beyond the set size (e.g., 201/200). Very rare.', category: 'pokemon' },
  'god_pack': { term: 'God Pack', definition: 'Extremely rare pack containing all holographic/rare cards.', category: 'pokemon' },
  'booster_box': { term: 'Booster Box', definition: 'Sealed box containing 36 booster packs. Factory sealed boxes command premium prices.', category: 'pokemon' },

  // MTG Terms
  'alpha': { term: 'Alpha', definition: 'First Magic: The Gathering print run (1993). Extremely rare and valuable.', category: 'mtg', related: ['beta', 'unlimited'] },
  'beta': { term: 'Beta', definition: 'Second MTG print run with corrected errors. Still very valuable.', category: 'mtg' },
  'reserved_list': { term: 'Reserved List', definition: 'List of MTG cards Wizards promised never to reprint. Includes Black Lotus, Moxen.', category: 'mtg' },
  'foil': { term: 'Foil', definition: 'Premium card with reflective foil layer. First introduced in 1999.', category: 'mtg' },
  'mana': { term: 'Mana', definition: 'Resource used to cast spells in MTG. Five colors plus colorless.', category: 'mtg' },
  'power_nine': { term: 'Power Nine', definition: 'Nine most powerful vintage MTG cards including Black Lotus and Moxen.', category: 'mtg' },
  'fetch_land': { term: 'Fetch Land', definition: 'Land cards that sacrifice to search for other lands. Highly playable and valuable.', category: 'mtg' },
  'dual_land': { term: 'Dual Land', definition: 'Original lands producing two colors with no drawback. On Reserved List.', category: 'mtg' },

  // Yu-Gi-Oh Terms
  'ghost_rare': { term: 'Ghost Rare', definition: 'Extremely rare Yu-Gi-Oh rarity with 3D holographic effect. Highly sought after.', category: 'yugioh' },
  'starlight_rare': { term: 'Starlight Rare', definition: 'Rarest modern Yu-Gi-Oh rarity, approximately 1 per case.', category: 'yugioh' },
  'ultimate_rare': { term: 'Ultimate Rare', definition: 'Textured foil pattern covering card name and artwork borders.', category: 'yugioh' },
  'short_print': { term: 'Short Print', definition: 'Card printed in lower quantities than others of same rarity.', category: 'yugioh' },
  'lob': { term: 'LOB', definition: 'Legend of Blue Eyes White Dragon - First English Yu-Gi-Oh set (2002).', category: 'yugioh' },

  // Sports Card Terms
  'rookie_card': { term: 'Rookie Card (RC)', definition: 'First officially licensed card of a player. Most valuable year for athletes.', category: 'sports', related: ['prospect', 'parallel'] },
  'auto': { term: 'Auto/Autograph', definition: 'Card with authentic player signature, often serial numbered.', category: 'sports' },
  'patch': { term: 'Patch/Memorabilia', definition: 'Card containing piece of game-worn jersey or equipment.', category: 'sports' },
  'refractor': { term: 'Refractor', definition: 'Topps Chrome/Bowman technology creating rainbow-like reflection.', category: 'sports' },
  'parallel': { term: 'Parallel', definition: 'Same card design in different colors, numbering, or finishes.', category: 'sports' },
  'ssp': { term: 'SSP (Super Short Print)', definition: 'Extremely limited print run variation, often photo variations.', category: 'sports' },
  'rpa': { term: 'RPA', definition: 'Rookie Patch Auto - Combines rookie card with patch and autograph. Premium cards.', category: 'sports' },
  'numbered': { term: 'Numbered/Serial Numbered', definition: 'Card stamped with production number (e.g., 25/99). Lower = more valuable.', category: 'sports' },
  'wax': { term: 'Wax', definition: 'Slang for unopened packs/boxes, from original wax paper packaging.', category: 'sports' },
  'hits': { term: 'Hits', definition: 'Autographs, memorabilia cards, or valuable inserts pulled from packs.', category: 'sports' },
  'case_hit': { term: 'Case Hit', definition: 'Card appearing approximately once per sealed case of boxes.', category: 'sports' },

  // General Terms
  'raw': { term: 'Raw', definition: 'Ungraded card, not in a professional holder.', category: 'general' },
  'slab': { term: 'Slab', definition: 'Plastic case containing a graded card. Also called a holder.', category: 'general' },
  'comp': { term: 'Comp/Comparable', definition: 'Recent sale of same card used to estimate value.', category: 'general' },
  'flip': { term: 'Flip', definition: 'Buy card intending to resell quickly for profit.', category: 'general' },
  'pc': { term: 'PC (Personal Collection)', definition: 'Cards kept for personal enjoyment, not for sale.', category: 'general' },
  'lcs': { term: 'LCS (Local Card Shop)', definition: 'Physical store selling trading cards and supplies.', category: 'general' },
  'penny_sleeve': { term: 'Penny Sleeve', definition: 'Basic plastic sleeve for card protection. First line of defense.', category: 'general' },
  'top_loader': { term: 'Top Loader', definition: 'Rigid plastic holder providing better protection than sleeves alone.', category: 'general' },
  'one_touch': { term: 'One-Touch', definition: 'Magnetic display case for valuable cards. Premium protection.', category: 'general' },
  'brick': { term: 'Brick', definition: 'Stack of cards, typically 100+, wrapped together.', category: 'general' },
};

const CATEGORIES = ['all', 'grading', 'condition', 'pokemon', 'mtg', 'yugioh', 'sports', 'general'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term')?.toLowerCase();
  const category = searchParams.get('category')?.toLowerCase() || 'all';
  const search = searchParams.get('search')?.toLowerCase();

  // Single term lookup
  if (term) {
    const entry = GLOSSARY[term];
    if (entry) {
      // Get related terms
      const relatedTerms = entry.related?.map(r => GLOSSARY[r]).filter(Boolean) || [];
      return NextResponse.json({
        success: true,
        result: entry,
        related: relatedTerms,
      });
    }
    return NextResponse.json({
      success: false,
      error: `Term "${term}" not found`,
      suggestion: 'Try searching with ?search= for partial matches',
    }, { status: 404 });
  }

  // Search/filter
  let results = Object.values(GLOSSARY);

  if (category !== 'all') {
    results = results.filter(entry => entry.category === category);
  }

  if (search) {
    results = results.filter(entry => 
      entry.term.toLowerCase().includes(search) ||
      entry.definition.toLowerCase().includes(search)
    );
  }

  // Sort alphabetically
  results.sort((a, b) => a.term.localeCompare(b.term));

  return NextResponse.json({
    success: true,
    terms: results,
    count: results.length,
    categories: CATEGORIES,
  });
}
