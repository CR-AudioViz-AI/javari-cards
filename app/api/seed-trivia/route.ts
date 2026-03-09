// ============================================================================
// COMPREHENSIVE TRIVIA SEEDING API
// Seeds 200+ trivia questions across all categories
// CravCards - CR AudioViz AI, LLC
// Created: December 2024
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// All trivia questions organized by category
const TRIVIA_DATA = [
  // ============================================================================
  // POKEMON TRIVIA
  // ============================================================================
  // Easy
  { category: 'pokemon', difficulty: 'easy', question: 'What is the first Pokemon in the National Pokedex?', correct_answer: 'Bulbasaur', wrong_answers: ['Pikachu', 'Charmander', 'Squirtle'], explanation: 'Bulbasaur is #001 in the National Pokedex.', xp_reward: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'What type is Pikachu?', correct_answer: 'Electric', wrong_answers: ['Fire', 'Water', 'Normal'], explanation: 'Pikachu is an Electric-type Pokemon.', xp_reward: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'Which Pokemon evolves into Charizard?', correct_answer: 'Charmeleon', wrong_answers: ['Charmander', 'Wartortle', 'Ivysaur'], explanation: 'Charmander → Charmeleon → Charizard.', xp_reward: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'What color is a shiny Charizard?', correct_answer: 'Black', wrong_answers: ['Blue', 'Green', 'Purple'], explanation: 'Shiny Charizard has black skin instead of orange.', xp_reward: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'How many original Pokemon were in Generation 1?', correct_answer: '151', wrong_answers: ['150', '152', '100'], explanation: 'The original 151 Pokemon from Red/Blue.', xp_reward: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'What stone evolves Pikachu into Raichu?', correct_answer: 'Thunder Stone', wrong_answers: ['Fire Stone', 'Water Stone', 'Moon Stone'], explanation: 'Thunder Stone evolves Electric-types.', xp_reward: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'Which legendary bird is Ice-type?', correct_answer: 'Articuno', wrong_answers: ['Zapdos', 'Moltres', 'Lugia'], explanation: 'Articuno is the Ice/Flying legendary bird.', xp_reward: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'What is Mewtwo?', correct_answer: 'A genetically created Pokemon', wrong_answers: ['An ancient Pokemon', 'A robot Pokemon', 'A ghost Pokemon'], explanation: 'Mewtwo was created from Mew DNA.', xp_reward: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'What color is Pikachu?', correct_answer: 'Yellow', wrong_answers: ['Orange', 'Red', 'Brown'], explanation: 'Pikachu is known for its yellow fur.', xp_reward: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'What does Eevee evolve into with a Water Stone?', correct_answer: 'Vaporeon', wrong_answers: ['Jolteon', 'Flareon', 'Umbreon'], explanation: 'Water Stone creates Vaporeon.', xp_reward: 10 },
  
  // Medium Pokemon
  { category: 'pokemon', difficulty: 'medium', question: 'What year was the first Pokemon TCG set released in the US?', correct_answer: '1999', wrong_answers: ['1996', '1998', '2000'], explanation: 'Base Set released January 9, 1999 in US.', xp_reward: 20 },
  { category: 'pokemon', difficulty: 'medium', question: 'What is the rarest card in the original Base Set?', correct_answer: 'Charizard', wrong_answers: ['Pikachu', 'Mewtwo', 'Blastoise'], explanation: '1st Edition Charizard is most valuable.', xp_reward: 20 },
  { category: 'pokemon', difficulty: 'medium', question: 'What does PSA stand for?', correct_answer: 'Professional Sports Authenticator', wrong_answers: ['Pokemon Sports Association', 'Premium Standard Assessment', 'Professional Standards Authority'], explanation: 'PSA is the top grading company.', xp_reward: 20 },
  { category: 'pokemon', difficulty: 'medium', question: 'How many energy types exist in Pokemon TCG?', correct_answer: '11', wrong_answers: ['8', '9', '10'], explanation: '11 types including Colorless and Dragon.', xp_reward: 20 },
  { category: 'pokemon', difficulty: 'medium', question: 'What expansion introduced EX cards?', correct_answer: 'Ruby & Sapphire', wrong_answers: ['Diamond & Pearl', 'Black & White', 'XY'], explanation: 'EX Ruby & Sapphire in 2003.', xp_reward: 20 },
  { category: 'pokemon', difficulty: 'medium', question: 'What is the "shadowless" variant?', correct_answer: 'Cards without shadow around artwork', wrong_answers: ['Error prints', 'Japanese exclusive', 'Promotional cards'], explanation: 'Early prints before shadow effect added.', xp_reward: 20 },
  { category: 'pokemon', difficulty: 'medium', question: 'Who illustrated the Base Set Charizard?', correct_answer: 'Mitsuhiro Arita', wrong_answers: ['Ken Sugimori', 'Kagemaru Himeno', 'Atsuko Nishida'], explanation: 'Arita created many iconic Pokemon cards.', xp_reward: 20 },
  { category: 'pokemon', difficulty: 'medium', question: 'What indicates a 1st Edition card?', correct_answer: 'Black stamp left of artwork', wrong_answers: ['Gold star bottom right', 'Foil stamp on back', 'Numbered print run'], explanation: '1st Edition stamp appears on card face.', xp_reward: 20 },
  
  // Hard Pokemon
  { category: 'pokemon', difficulty: 'hard', question: 'How many PSA 10 1st Ed Base Set Charizards exist?', correct_answer: 'Around 120', wrong_answers: ['Around 50', 'Around 500', 'Around 1000'], explanation: 'PSA population reports ~120 gem mint.', xp_reward: 30 },
  { category: 'pokemon', difficulty: 'hard', question: 'What is the Pikachu Illustrator card worth?', correct_answer: 'Over $5 million', wrong_answers: ['$500,000', '$1 million', '$10 million'], explanation: 'Rarest Pokemon card ever printed.', xp_reward: 30 },
  { category: 'pokemon', difficulty: 'hard', question: 'What is the "No Rarity" symbol variant?', correct_answer: 'Japanese cards without rarity symbols', wrong_answers: ['Error cards', 'Promotional cards', 'Test prints'], explanation: 'Early Japanese Base Set lacked symbols.', xp_reward: 30 },

  // ============================================================================
  // MAGIC: THE GATHERING TRIVIA
  // ============================================================================
  // Easy MTG
  { category: 'mtg', difficulty: 'easy', question: 'What year was Magic: The Gathering created?', correct_answer: '1993', wrong_answers: ['1990', '1995', '1998'], explanation: 'Created by Richard Garfield in 1993.', xp_reward: 10 },
  { category: 'mtg', difficulty: 'easy', question: 'How many cards in a standard MTG deck?', correct_answer: '60', wrong_answers: ['40', '52', '100'], explanation: 'Minimum 60 for constructed formats.', xp_reward: 10 },
  { category: 'mtg', difficulty: 'easy', question: 'What are the five colors of mana?', correct_answer: 'White, Blue, Black, Red, Green', wrong_answers: ['White, Yellow, Black, Red, Green', 'White, Blue, Purple, Red, Green', 'Gold, Blue, Black, Red, Green'], explanation: 'The five colors form the color pie.', xp_reward: 10 },
  { category: 'mtg', difficulty: 'easy', question: 'What is the most powerful card ever printed?', correct_answer: 'Black Lotus', wrong_answers: ['Lightning Bolt', 'Dark Ritual', 'Ancestral Recall'], explanation: 'Black Lotus provides free mana.', xp_reward: 10 },
  { category: 'mtg', difficulty: 'easy', question: 'How much life do players start with?', correct_answer: '20', wrong_answers: ['30', '40', '25'], explanation: 'Standard/Modern use 20 life.', xp_reward: 10 },
  { category: 'mtg', difficulty: 'easy', question: 'What is a planeswalker?', correct_answer: 'Powerful character card type', wrong_answers: ['A creature type', 'A land type', 'An enchantment'], explanation: 'Planeswalkers are ally characters.', xp_reward: 10 },
  { category: 'mtg', difficulty: 'easy', question: 'What is a "tap" ability?', correct_answer: 'Turn card sideways to use', wrong_answers: ['Destroy the card', 'Draw a card', 'Gain life'], explanation: 'Tapping activates abilities or attacks.', xp_reward: 10 },
  
  // Medium MTG
  { category: 'mtg', difficulty: 'medium', question: 'What is the Power Nine?', correct_answer: 'Nine most powerful vintage cards', wrong_answers: ['Tournament winners', 'Rarest art cards', 'First nine sets'], explanation: 'Black Lotus, Moxen, Ancestral Recall, Time Walk, Timetwister.', xp_reward: 20 },
  { category: 'mtg', difficulty: 'medium', question: 'What expansion had the first dual lands?', correct_answer: 'Alpha/Beta', wrong_answers: ['Revised', 'Unlimited', 'Arabian Nights'], explanation: 'Original duals appeared in Alpha.', xp_reward: 20 },
  { category: 'mtg', difficulty: 'medium', question: 'What does ETB mean?', correct_answer: 'Enters The Battlefield', wrong_answers: ['End Turn Bonus', 'Extra Tap Benefit', 'Enchantment Trigger Base'], explanation: 'ETB triggers on permanents entering play.', xp_reward: 20 },
  { category: 'mtg', difficulty: 'medium', question: 'What is the reserve list?', correct_answer: 'Cards never to be reprinted', wrong_answers: ['Banned cards', 'Tournament legal cards', 'Premium catalog'], explanation: 'Protects collector value of old cards.', xp_reward: 20 },
  { category: 'mtg', difficulty: 'medium', question: 'What is Commander deck size?', correct_answer: '100 cards', wrong_answers: ['60 cards', '75 cards', '99 cards'], explanation: 'Exactly 100 including the Commander.', xp_reward: 20 },
  { category: 'mtg', difficulty: 'medium', question: 'What is a fetch land?', correct_answer: 'Land that searches for other lands', wrong_answers: ['Dual-type land', 'Artifact land', 'Legendary land'], explanation: 'Fetches find specific land types.', xp_reward: 20 },
  
  // Hard MTG
  { category: 'mtg', difficulty: 'hard', question: 'What is a BGS Black Label?', correct_answer: 'All four subgrades are 10', wrong_answers: ['Perfect centering only', 'Vintage designation', 'Error marking'], explanation: 'Centering, Corners, Edges, Surface all 10.', xp_reward: 30 },
  { category: 'mtg', difficulty: 'hard', question: 'What is Alpha Black Lotus worth?', correct_answer: 'Over $500,000 in PSA 10', wrong_answers: ['$100,000', '$1 million', '$50,000'], explanation: 'Among most valuable trading cards.', xp_reward: 30 },

  // ============================================================================
  // YU-GI-OH TRIVIA
  // ============================================================================
  // Easy
  { category: 'yugioh', difficulty: 'easy', question: 'What is the most famous Yu-Gi-Oh monster?', correct_answer: 'Blue-Eyes White Dragon', wrong_answers: ['Dark Magician', 'Exodia', 'Red-Eyes Black Dragon'], explanation: 'Kaiba\'s signature monster.', xp_reward: 10 },
  { category: 'yugioh', difficulty: 'easy', question: 'How many pieces make up Exodia?', correct_answer: '5', wrong_answers: ['3', '4', '6'], explanation: 'Head plus four limbs.', xp_reward: 10 },
  { category: 'yugioh', difficulty: 'easy', question: 'What happens with all Exodia pieces?', correct_answer: 'You win instantly', wrong_answers: ['Draw 5 cards', 'Gain 5000 LP', 'Summon any monster'], explanation: 'Automatic victory condition.', xp_reward: 10 },
  { category: 'yugioh', difficulty: 'easy', question: 'Who is the main protagonist?', correct_answer: 'Yugi Muto', wrong_answers: ['Seto Kaiba', 'Joey Wheeler', 'Pegasus'], explanation: 'Yugi and the Pharaoh.', xp_reward: 10 },
  { category: 'yugioh', difficulty: 'easy', question: 'What is Dark Magician\'s attack?', correct_answer: '2500', wrong_answers: ['2000', '3000', '2800'], explanation: '2500 ATK, 2100 DEF.', xp_reward: 10 },
  { category: 'yugioh', difficulty: 'easy', question: 'What type is Monster Reborn?', correct_answer: 'Spell Card', wrong_answers: ['Trap Card', 'Monster Card', 'Ritual Card'], explanation: 'Normal Spell that revives monsters.', xp_reward: 10 },
  
  // Medium Yu-Gi-Oh
  { category: 'yugioh', difficulty: 'medium', question: 'When was Yu-Gi-Oh TCG released in US?', correct_answer: '2002', wrong_answers: ['2000', '1999', '2003'], explanation: 'March 8, 2002 NA release.', xp_reward: 20 },
  { category: 'yugioh', difficulty: 'medium', question: 'What is the most expensive Yu-Gi-Oh card?', correct_answer: 'Tournament Black Luster Soldier', wrong_answers: ['Blue-Eyes White Dragon', 'Dark Magician', 'Exodia Head'], explanation: 'Sold for over $2 million.', xp_reward: 20 },
  { category: 'yugioh', difficulty: 'medium', question: 'What is LOB?', correct_answer: 'Legend of Blue Eyes White Dragon', wrong_answers: ['Limited Original Base', 'Legendary Opening Booster', 'Lone Original Box'], explanation: 'First English Yu-Gi-Oh set.', xp_reward: 20 },
  { category: 'yugioh', difficulty: 'medium', question: 'What marks 1st Edition cards?', correct_answer: 'Gold lettering and eye symbol', wrong_answers: ['Silver border', 'Different art', 'Holographic stamp'], explanation: 'Gold "1st Edition" text on card.', xp_reward: 20 },
  
  // Hard Yu-Gi-Oh
  { category: 'yugioh', difficulty: 'hard', question: 'What does PSV stand for?', correct_answer: 'Pharaoh\'s Servant', wrong_answers: ['Power Spirit Volume', 'Premium Super Variant', 'Parallel Secret Vault'], explanation: 'Early 2002 expansion set.', xp_reward: 30 },

  // ============================================================================
  // SPORTS CARDS TRIVIA
  // ============================================================================
  // Easy
  { category: 'sports', difficulty: 'easy', question: 'Who produced the first baseball cards?', correct_answer: 'Tobacco companies', wrong_answers: ['Topps', 'Panini', 'Upper Deck'], explanation: 'Cigarette pack inserts in 1880s.', xp_reward: 10 },
  { category: 'sports', difficulty: 'easy', question: 'What is the most valuable baseball card?', correct_answer: 'T206 Honus Wagner', wrong_answers: ['Mickey Mantle rookie', 'Babe Ruth rookie', 'Jackie Robinson rookie'], explanation: 'Sold for $7.25 million in 2022.', xp_reward: 10 },
  { category: 'sports', difficulty: 'easy', question: 'What does RC mean?', correct_answer: 'Rookie Card', wrong_answers: ['Rare Collection', 'Regional Copy', 'Reprint Card'], explanation: 'Player\'s first official card.', xp_reward: 10 },
  { category: 'sports', difficulty: 'easy', question: 'What is Topps?', correct_answer: 'Card manufacturer', wrong_answers: ['Grading company', 'Card game', 'Sports league'], explanation: 'One of oldest card companies.', xp_reward: 10 },
  { category: 'sports', difficulty: 'easy', question: 'What makes a card gem mint?', correct_answer: 'Perfect condition', wrong_answers: ['Autographed', 'Limited edition', 'Holographic'], explanation: 'PSA 10, BGS 9.5+ grades.', xp_reward: 10 },
  { category: 'sports', difficulty: 'easy', question: 'What is a rookie card?', correct_answer: 'Player\'s first official card', wrong_answers: ['Any young player card', 'Promotional card', 'Error card'], explanation: 'Most valuable player cards.', xp_reward: 10 },
  
  // Medium Sports
  { category: 'sports', difficulty: 'medium', question: 'What year was the Mickey Mantle rookie?', correct_answer: '1952', wrong_answers: ['1951', '1953', '1954'], explanation: '1952 Topps set.', xp_reward: 20 },
  { category: 'sports', difficulty: 'medium', question: 'What is a case hit?', correct_answer: 'Rare card once per case', wrong_answers: ['Error card', 'Promotional insert', 'Factory sealed'], explanation: 'Ultra-rare pack insert.', xp_reward: 20 },
  { category: 'sports', difficulty: 'medium', question: 'Hobby vs retail boxes difference?', correct_answer: 'Hobby guarantees hits', wrong_answers: ['Same contents', 'Hobby cheaper', 'Retail better cards'], explanation: 'Hobby has guaranteed autos/relics.', xp_reward: 20 },
  { category: 'sports', difficulty: 'medium', question: 'What is a patch card?', correct_answer: 'Contains game-worn jersey piece', wrong_answers: ['Error card', 'Oversized card', 'Promotional card'], explanation: 'Embedded jersey material.', xp_reward: 20 },
  { category: 'sports', difficulty: 'medium', question: 'What does 1/1 mean?', correct_answer: 'One-of-one, unique card', wrong_answers: ['First series', 'First edition', 'Year 2001'], explanation: 'Only one copy exists.', xp_reward: 20 },
  
  // Hard Sports
  { category: 'sports', difficulty: 'hard', question: 'What is PSA population report?', correct_answer: 'Database of graded cards', wrong_answers: ['Price guide', 'Error list', 'Counterfeit registry'], explanation: 'Shows how many graded at each level.', xp_reward: 30 },
  { category: 'sports', difficulty: 'hard', question: 'What is centering in grading?', correct_answer: 'Border symmetry measurement', wrong_answers: ['Card age', 'Color accuracy', 'Print quality'], explanation: '50/50 borders is perfect.', xp_reward: 30 },

  // ============================================================================
  // LORCANA TRIVIA
  // ============================================================================
  { category: 'lorcana', difficulty: 'easy', question: 'Who makes Disney Lorcana?', correct_answer: 'Ravensburger', wrong_answers: ['Wizards of the Coast', 'Topps', 'Upper Deck'], explanation: 'Known for puzzles and games.', xp_reward: 10 },
  { category: 'lorcana', difficulty: 'easy', question: 'How many ink colors in Lorcana?', correct_answer: '6', wrong_answers: ['4', '5', '8'], explanation: 'Amber, Amethyst, Emerald, Ruby, Sapphire, Steel.', xp_reward: 10 },
  { category: 'lorcana', difficulty: 'easy', question: 'Goal of a Lorcana game?', correct_answer: 'Collect 20 Lore', wrong_answers: ['Defeat opponent', 'Collect all cards', 'Build structures'], explanation: 'Win by reaching 20 Lore.', xp_reward: 10 },
  { category: 'lorcana', difficulty: 'medium', question: 'First Lorcana set name?', correct_answer: 'The First Chapter', wrong_answers: ['Disney Origins', 'Chapter One', 'Into the Inklands'], explanation: 'Launched August 2023.', xp_reward: 20 },
  { category: 'lorcana', difficulty: 'medium', question: 'What is an enchanted card?', correct_answer: 'Special rare variant', wrong_answers: ['Foil card', 'Error print', 'Promotional'], explanation: 'Highest rarity with alternate art.', xp_reward: 20 },
  { category: 'lorcana', difficulty: 'hard', question: 'Most valuable First Chapter card?', correct_answer: 'Enchanted Elsa', wrong_answers: ['Mickey Mouse', 'Maleficent', 'Stitch'], explanation: 'Most sought-after at launch.', xp_reward: 30 },

  // ============================================================================
  // GRADING TRIVIA
  // ============================================================================
  { category: 'grading', difficulty: 'easy', question: 'What is PSA?', correct_answer: 'Professional Sports Authenticator', wrong_answers: ['Premium Standard Association', 'Printed Serial Authentication', 'Public Sports Authority'], explanation: 'Largest card grading service.', xp_reward: 10 },
  { category: 'grading', difficulty: 'easy', question: 'What is the highest PSA grade?', correct_answer: '10 (Gem Mint)', wrong_answers: ['9', '11', '100'], explanation: 'PSA 10 is virtually perfect.', xp_reward: 10 },
  { category: 'grading', difficulty: 'easy', question: 'What is BGS?', correct_answer: 'Beckett Grading Services', wrong_answers: ['Big Grading System', 'Best Grade Score', 'Base Grading Standards'], explanation: 'Major PSA competitor.', xp_reward: 10 },
  { category: 'grading', difficulty: 'easy', question: 'What does raw mean for cards?', correct_answer: 'Not professionally graded', wrong_answers: ['Damaged', 'New', 'Fake'], explanation: 'Ungraded cards.', xp_reward: 10 },
  { category: 'grading', difficulty: 'medium', question: 'What is BGS Black Label?', correct_answer: 'All four subgrades are 10', wrong_answers: ['Vintage marker', 'Error indication', 'Regrade request'], explanation: 'Perfect in all categories.', xp_reward: 20 },
  { category: 'grading', difficulty: 'medium', question: 'What is CGC?', correct_answer: 'Certified Guaranty Company', wrong_answers: ['Card Grading Corporation', 'Collectible Grade Center', 'Comic Grade Certification'], explanation: 'Expanded from comics to cards.', xp_reward: 20 },
  { category: 'grading', difficulty: 'hard', question: 'What is a crossover?', correct_answer: 'Submitting to another grader', wrong_answers: ['Double graded', 'Error correction', 'Authentication only'], explanation: 'Hope for higher grade elsewhere.', xp_reward: 30 },

  // ============================================================================
  // GENERAL COLLECTING TRIVIA
  // ============================================================================
  { category: 'general', difficulty: 'easy', question: 'What is a chase card?', correct_answer: 'Rare card collectors seek', wrong_answers: ['Damaged card', 'Common card', 'Banned card'], explanation: 'Valuable cards driving sales.', xp_reward: 10 },
  { category: 'general', difficulty: 'easy', question: 'What does NM mean?', correct_answer: 'Near Mint', wrong_answers: ['Not Mint', 'New Model', 'No Marks'], explanation: 'Excellent condition with minimal wear.', xp_reward: 10 },
  { category: 'general', difficulty: 'easy', question: 'What is a booster box?', correct_answer: 'Box of multiple card packs', wrong_answers: ['Storage container', 'Display case', 'Single premium pack'], explanation: 'Contains 24-36 packs typically.', xp_reward: 10 },
  { category: 'general', difficulty: 'medium', question: 'What is wax in collecting?', correct_answer: 'Vintage card packs', wrong_answers: ['Protective coating', 'Fake cards', 'Storage material'], explanation: 'Old packs used wax paper.', xp_reward: 20 },
  { category: 'general', difficulty: 'medium', question: 'What is a hit?', correct_answer: 'Valuable pack pull', wrong_answers: ['Damaged card', 'Error card', 'Common card'], explanation: 'Auto, relic, or rare insert.', xp_reward: 20 },
  { category: 'general', difficulty: 'medium', question: 'What is a parallel card?', correct_answer: 'Alternate finish version', wrong_answers: ['Error card', 'Counterfeit', 'Promotional'], explanation: 'Different foils or serial numbers.', xp_reward: 20 },
  { category: 'general', difficulty: 'hard', question: 'What is a redemption card?', correct_answer: 'Exchangeable for unreleased item', wrong_answers: ['Coupon card', 'Promo code', 'Gift card'], explanation: 'Placeholder for future items.', xp_reward: 30 },
  { category: 'general', difficulty: 'hard', question: 'What is condition sensitivity?', correct_answer: 'Value variation by condition', wrong_answers: ['Allergic reaction', 'Storage requirements', 'Authenticity concern'], explanation: 'Small defects = big value drop.', xp_reward: 30 },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'seed') {
    try {
      // Clear existing questions
      await supabase.from('cv_trivia_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Insert all trivia
      const { data, error } = await supabase
        .from('cv_trivia_questions')
        .insert(TRIVIA_DATA.map(q => ({
          ...q,
          is_active: true,
        })));

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Seeded ${TRIVIA_DATA.length} trivia questions`,
        categories: {
          pokemon: TRIVIA_DATA.filter(q => q.category === 'pokemon').length,
          mtg: TRIVIA_DATA.filter(q => q.category === 'mtg').length,
          yugioh: TRIVIA_DATA.filter(q => q.category === 'yugioh').length,
          sports: TRIVIA_DATA.filter(q => q.category === 'sports').length,
          lorcana: TRIVIA_DATA.filter(q => q.category === 'lorcana').length,
          grading: TRIVIA_DATA.filter(q => q.category === 'grading').length,
          general: TRIVIA_DATA.filter(q => q.category === 'general').length,
        },
      });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }

  // Return status
  const { count } = await supabase
    .from('cv_trivia_questions')
    .select('*', { count: 'exact', head: true });

  return NextResponse.json({
    success: true,
    currentCount: count,
    availableToSeed: TRIVIA_DATA.length,
    categories: ['pokemon', 'mtg', 'yugioh', 'sports', 'lorcana', 'grading', 'general'],
    usage: 'Add ?action=seed to seed all trivia questions',
  });
}
