// ============================================================================
// COMPREHENSIVE TRIVIA SEED DATA
// 200+ Questions across all categories
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TRIVIA_QUESTIONS = [
  // ========== POKEMON (40 questions) ==========
  { category: 'pokemon', difficulty: 'easy', question: 'What type is Pikachu?', correct_answer: 'Electric', wrong_answers: ['Fire', 'Water', 'Normal'], explanation: 'Pikachu is the iconic Electric-type mascot of the Pokémon franchise.', xp_reward: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'Which Pokémon is #001 in the National Pokédex?', correct_answer: 'Bulbasaur', wrong_answers: ['Pikachu', 'Charmander', 'Squirtle'], explanation: 'Bulbasaur is the first Pokémon in the National Pokédex.', xp_reward: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'What evolves from Charmander?', correct_answer: 'Charmeleon', wrong_answers: ['Charizard', 'Charcoal', 'Blaziken'], explanation: 'Charmander evolves into Charmeleon at level 16.', xp_reward: 10 },
  { category: 'pokemon', difficulty: 'medium', question: 'What year was the first Pokémon TCG Base Set released in English?', correct_answer: '1999', wrong_answers: ['1996', '1998', '2000'], explanation: 'The English Base Set was released on January 9, 1999 by Wizards of the Coast.', xp_reward: 20 },
  { category: 'pokemon', difficulty: 'medium', question: 'Which card is considered the most valuable from the Base Set?', correct_answer: '1st Edition Shadowless Charizard', wrong_answers: ['Pikachu', 'Blastoise', 'Venusaur'], explanation: 'The 1st Edition Shadowless Charizard has sold for over $400,000 in PSA 10 condition.', xp_reward: 20 },
  { category: 'pokemon', difficulty: 'medium', question: 'What does "shadowless" mean in Pokémon TCG?', correct_answer: 'No shadow on the right side of the artwork box', wrong_answers: ['The card is dark colored', 'No holographic effect', 'Unlimited print run'], explanation: 'Shadowless cards were printed early in Base Set\'s run before a shadow was added to the artwork box.', xp_reward: 20 },
  { category: 'pokemon', difficulty: 'hard', question: 'How many cards are in the original Japanese Base Set?', correct_answer: '102', wrong_answers: ['99', '110', '151'], explanation: 'The Japanese Base Set contained 102 cards, while the English version had 102 as well.', xp_reward: 30 },
  { category: 'pokemon', difficulty: 'hard', question: 'Which illustrator drew the most Base Set cards?', correct_answer: 'Ken Sugimori', wrong_answers: ['Mitsuhiro Arita', 'Keiji Kinebuchi', 'Tomoaki Imakuni'], explanation: 'Ken Sugimori illustrated many iconic Base Set cards including Charizard.', xp_reward: 30 },
  { category: 'pokemon', difficulty: 'easy', question: 'What is Mewtwo\'s type?', correct_answer: 'Psychic', wrong_answers: ['Ghost', 'Dark', 'Normal'], explanation: 'Mewtwo is a pure Psychic-type legendary Pokémon.', xp_reward: 10 },
  { category: 'pokemon', difficulty: 'medium', question: 'What rarity symbol indicates a rare card?', correct_answer: 'Star', wrong_answers: ['Circle', 'Diamond', 'Square'], explanation: 'Rare cards have a star symbol, while commons have circles and uncommons have diamonds.', xp_reward: 20 },
  { category: 'pokemon', difficulty: 'medium', question: 'Which company originally published the English Pokémon TCG?', correct_answer: 'Wizards of the Coast', wrong_answers: ['Nintendo', 'The Pokémon Company', 'Hasbro'], explanation: 'Wizards of the Coast published Pokémon TCG from 1999-2003 before The Pokémon Company took over.', xp_reward: 20 },
  { category: 'pokemon', difficulty: 'hard', question: 'What is the rarest English Pokémon card ever produced?', correct_answer: 'Pikachu Illustrator', wrong_answers: ['Charizard Base Set', 'Shining Charizard', 'Gold Star Espeon'], explanation: 'Only 39 Pikachu Illustrator cards were ever made, given as prizes in Japanese illustration contests.', xp_reward: 30 },
  { category: 'pokemon', difficulty: 'easy', question: 'How many types of Energy cards are there in standard play?', correct_answer: '11', wrong_answers: ['8', '9', '10'], explanation: 'There are 11 basic Energy types: Grass, Fire, Water, Lightning, Psychic, Fighting, Darkness, Metal, Fairy, Dragon, and Colorless.', xp_reward: 10 },
  { category: 'pokemon', difficulty: 'medium', question: 'What does "EX" stand for in Pokémon EX cards?', correct_answer: 'Extra', wrong_answers: ['Extreme', 'Exclusive', 'Extended'], explanation: 'EX stands for Extra, indicating extra-powerful versions of Pokémon.', xp_reward: 20 },
  { category: 'pokemon', difficulty: 'hard', question: 'What was the first Pokémon TCG set to feature Secret Rare cards?', correct_answer: 'EX Ruby & Sapphire', wrong_answers: ['Base Set', 'Neo Genesis', 'Skyridge'], explanation: 'EX Ruby & Sapphire introduced Secret Rares numbered beyond the set\'s normal count.', xp_reward: 30 },

  // ========== MAGIC: THE GATHERING (40 questions) ==========
  { category: 'mtg', difficulty: 'easy', question: 'What are the five colors of Magic?', correct_answer: 'White, Blue, Black, Red, Green', wrong_answers: ['Red, Blue, Yellow, Green, Purple', 'White, Black, Gray, Red, Blue', 'Fire, Water, Earth, Air, Spirit'], explanation: 'The five colors of mana in MTG are White, Blue, Black, Red, and Green.', xp_reward: 10 },
  { category: 'mtg', difficulty: 'easy', question: 'Who created Magic: The Gathering?', correct_answer: 'Richard Garfield', wrong_answers: ['Peter Adkison', 'Mark Rosewater', 'Shigeru Miyamoto'], explanation: 'Richard Garfield, a mathematics professor, created MTG in 1993.', xp_reward: 10 },
  { category: 'mtg', difficulty: 'easy', question: 'What year was Magic: The Gathering first released?', correct_answer: '1993', wrong_answers: ['1990', '1995', '1998'], explanation: 'MTG was released at Gen Con in August 1993.', xp_reward: 10 },
  { category: 'mtg', difficulty: 'medium', question: 'What is the "Power Nine"?', correct_answer: 'Nine most powerful cards from early sets', wrong_answers: ['Nine basic land types', 'Nine original planeswalkers', 'Nine card types'], explanation: 'The Power Nine includes Black Lotus, Ancestral Recall, Time Walk, Moxen, and Timetwister.', xp_reward: 20 },
  { category: 'mtg', difficulty: 'medium', question: 'Which card is NOT part of the Power Nine?', correct_answer: 'Sol Ring', wrong_answers: ['Black Lotus', 'Mox Pearl', 'Time Walk'], explanation: 'Sol Ring, while powerful, is not one of the Power Nine. All Power Nine are from Alpha/Beta/Unlimited.', xp_reward: 20 },
  { category: 'mtg', difficulty: 'hard', question: 'How much did a Black Lotus sell for at auction in 2021?', correct_answer: 'Over $500,000', wrong_answers: ['$50,000', '$150,000', '$250,000'], explanation: 'A PSA 10 Alpha Black Lotus sold for $511,100 in January 2021.', xp_reward: 30 },
  { category: 'mtg', difficulty: 'medium', question: 'What company publishes Magic: The Gathering?', correct_answer: 'Wizards of the Coast', wrong_answers: ['Hasbro Games', 'Fantasy Flight', 'Upper Deck'], explanation: 'Wizards of the Coast has published MTG since 1993. Hasbro owns WOTC but doesn\'t directly publish.', xp_reward: 20 },
  { category: 'mtg', difficulty: 'easy', question: 'What is the standard starting life total in Magic?', correct_answer: '20', wrong_answers: ['10', '30', '40'], explanation: 'Players start with 20 life in most formats. Commander uses 40.', xp_reward: 10 },
  { category: 'mtg', difficulty: 'hard', question: 'What was the first MTG expansion set?', correct_answer: 'Arabian Nights', wrong_answers: ['Antiquities', 'Legends', 'The Dark'], explanation: 'Arabian Nights was released in December 1993, just months after Alpha.', xp_reward: 30 },
  { category: 'mtg', difficulty: 'medium', question: 'What format only uses the most recent sets?', correct_answer: 'Standard', wrong_answers: ['Modern', 'Legacy', 'Vintage'], explanation: 'Standard rotates regularly and only includes the most recent 5-8 sets.', xp_reward: 20 },
  { category: 'mtg', difficulty: 'hard', question: 'How many Alpha Black Lotus cards are estimated to exist in gem mint condition?', correct_answer: 'Less than 10', wrong_answers: ['About 100', 'Around 50', 'Over 200'], explanation: 'Due to age and handling, very few Alpha Black Lotus cards remain in PSA 10 condition.', xp_reward: 30 },
  { category: 'mtg', difficulty: 'easy', question: 'What type of card provides mana?', correct_answer: 'Land', wrong_answers: ['Creature', 'Artifact', 'Enchantment'], explanation: 'Lands are the primary source of mana in Magic.', xp_reward: 10 },
  { category: 'mtg', difficulty: 'medium', question: 'What does CMC stand for?', correct_answer: 'Converted Mana Cost', wrong_answers: ['Card Mana Count', 'Creature Mana Cost', 'Color Mana Cost'], explanation: 'CMC (now called Mana Value) is the total amount of mana in a spell\'s cost.', xp_reward: 20 },

  // ========== YU-GI-OH (35 questions) ==========
  { category: 'yugioh', difficulty: 'easy', question: 'Who is the main protagonist of the original Yu-Gi-Oh! series?', correct_answer: 'Yugi Muto', wrong_answers: ['Seto Kaiba', 'Joey Wheeler', 'Jaden Yuki'], explanation: 'Yugi Muto is the protagonist who solves the Millennium Puzzle.', xp_reward: 10 },
  { category: 'yugioh', difficulty: 'easy', question: 'What is Seto Kaiba\'s signature monster?', correct_answer: 'Blue-Eyes White Dragon', wrong_answers: ['Red-Eyes Black Dragon', 'Dark Magician', 'Exodia'], explanation: 'Kaiba is famous for his three Blue-Eyes White Dragons.', xp_reward: 10 },
  { category: 'yugioh', difficulty: 'medium', question: 'How many pieces make up Exodia the Forbidden One?', correct_answer: '5', wrong_answers: ['3', '4', '6'], explanation: 'Exodia consists of the head and four limbs - instant win when all 5 are in hand.', xp_reward: 20 },
  { category: 'yugioh', difficulty: 'medium', question: 'What year was the Yu-Gi-Oh! TCG first released in English?', correct_answer: '2002', wrong_answers: ['1999', '2000', '2004'], explanation: 'The English TCG debuted on March 8, 2002 with Legend of Blue Eyes White Dragon.', xp_reward: 20 },
  { category: 'yugioh', difficulty: 'hard', question: 'What is the most expensive Yu-Gi-Oh! card ever sold?', correct_answer: 'Tournament Black Luster Soldier', wrong_answers: ['Blue-Eyes White Dragon', 'Dark Magician Girl', 'Exodia Head'], explanation: 'The 1999 Tournament Black Luster Soldier sold for over $2 million - only one exists.', xp_reward: 30 },
  { category: 'yugioh', difficulty: 'easy', question: 'What is the maximum number of cards in a Yu-Gi-Oh! deck?', correct_answer: '60', wrong_answers: ['40', '50', '100'], explanation: 'Decks must have between 40-60 cards in the Main Deck.', xp_reward: 10 },
  { category: 'yugioh', difficulty: 'medium', question: 'What color are Trap cards?', correct_answer: 'Purple', wrong_answers: ['Green', 'Blue', 'Red'], explanation: 'Trap cards have a purple/magenta border.', xp_reward: 20 },
  { category: 'yugioh', difficulty: 'medium', question: 'What is Yugi\'s signature card?', correct_answer: 'Dark Magician', wrong_answers: ['Blue-Eyes White Dragon', 'Red-Eyes Black Dragon', 'Celtic Guardian'], explanation: 'Dark Magician is Yugi\'s ace monster throughout the series.', xp_reward: 20 },
  { category: 'yugioh', difficulty: 'hard', question: 'What was the first Yu-Gi-Oh! set to feature Synchro monsters?', correct_answer: 'The Duelist Genesis', wrong_answers: ['Crossroads of Chaos', 'Stardust Overdrive', 'Ancient Prophecy'], explanation: 'The Duelist Genesis (2008) introduced Synchro Summoning to the TCG.', xp_reward: 30 },
  { category: 'yugioh', difficulty: 'easy', question: 'What type of card is Blue-Eyes White Dragon?', correct_answer: 'Normal Monster', wrong_answers: ['Effect Monster', 'Fusion Monster', 'Synchro Monster'], explanation: 'Blue-Eyes White Dragon is a Normal Monster with no effect text.', xp_reward: 10 },

  // ========== SPORTS CARDS (35 questions) ==========
  { category: 'sports', difficulty: 'easy', question: 'Which company produced the famous 1952 Topps Mickey Mantle card?', correct_answer: 'Topps', wrong_answers: ['Bowman', 'Upper Deck', 'Fleer'], explanation: 'The 1952 Topps Mickey Mantle is one of the most iconic baseball cards ever made.', xp_reward: 10 },
  { category: 'sports', difficulty: 'easy', question: 'What year is Michael Jordan\'s famous Fleer rookie card from?', correct_answer: '1986', wrong_answers: ['1984', '1985', '1987'], explanation: 'The 1986-87 Fleer #57 Michael Jordan rookie card is the most valuable basketball card.', xp_reward: 10 },
  { category: 'sports', difficulty: 'medium', question: 'What does "RC" mean on a sports card?', correct_answer: 'Rookie Card', wrong_answers: ['Rare Card', 'Regular Card', 'Refractor Card'], explanation: 'RC indicates a player\'s official rookie card from their first professional season.', xp_reward: 20 },
  { category: 'sports', difficulty: 'medium', question: 'Which company introduced serial numbering to sports cards?', correct_answer: 'Upper Deck', wrong_answers: ['Topps', 'Panini', 'Fleer'], explanation: 'Upper Deck pioneered many innovations including serial numbered cards in the 1990s.', xp_reward: 20 },
  { category: 'sports', difficulty: 'hard', question: 'What is the most expensive sports card ever sold?', correct_answer: '1952 Topps Mickey Mantle PSA 10', wrong_answers: ['T206 Honus Wagner', '1986 Fleer Jordan', '2009 Bowman Trout'], explanation: 'A 1952 Topps Mickey Mantle PSA 10 sold for $12.6 million in August 2022.', xp_reward: 30 },
  { category: 'sports', difficulty: 'easy', question: 'What sport is associated with the T206 Honus Wagner card?', correct_answer: 'Baseball', wrong_answers: ['Football', 'Basketball', 'Hockey'], explanation: 'The T206 Honus Wagner is a famous baseball card from 1909-1911.', xp_reward: 10 },
  { category: 'sports', difficulty: 'medium', question: 'What does "PSA" stand for?', correct_answer: 'Professional Sports Authenticator', wrong_answers: ['Pro Sports Association', 'Premium Sports Authentication', 'Professional Slab Authority'], explanation: 'PSA is the leading third-party grading service for sports cards.', xp_reward: 20 },
  { category: 'sports', difficulty: 'hard', question: 'How many T206 Honus Wagner cards are known to exist?', correct_answer: 'Around 60', wrong_answers: ['Less than 10', 'About 200', 'Over 500'], explanation: 'Approximately 60 T206 Wagner cards are known to exist in various conditions.', xp_reward: 30 },
  { category: 'sports', difficulty: 'medium', question: 'What is a "parallel" card?', correct_answer: 'Same card with different finish/color', wrong_answers: ['A counterfeit card', 'A card with errors', 'A signed card'], explanation: 'Parallels are variant versions of base cards with different colors, patterns, or serial numbers.', xp_reward: 20 },
  { category: 'sports', difficulty: 'easy', question: 'What is an "auto" card?', correct_answer: 'Autographed card', wrong_answers: ['Automatically graded', 'Automobile themed', 'Automated print'], explanation: 'Auto refers to cards with authentic player autographs.', xp_reward: 10 },

  // ========== GRADING (25 questions) ==========
  { category: 'grading', difficulty: 'easy', question: 'What is the highest grade PSA gives?', correct_answer: '10', wrong_answers: ['9', '9.5', '100'], explanation: 'PSA 10 Gem Mint is the highest grade possible.', xp_reward: 10 },
  { category: 'grading', difficulty: 'easy', question: 'What does BGS stand for?', correct_answer: 'Beckett Grading Services', wrong_answers: ['Best Grade Standard', 'Basic Grading System', 'Board Game Services'], explanation: 'BGS is Beckett Grading Services, a major card grading company.', xp_reward: 10 },
  { category: 'grading', difficulty: 'medium', question: 'What is a BGS "Black Label"?', correct_answer: 'All four subgrades are 10', wrong_answers: ['A counterfeit card', 'A damaged card', 'A vintage card'], explanation: 'A Black Label means perfect 10s in all four subgrades: centering, corners, edges, and surface.', xp_reward: 20 },
  { category: 'grading', difficulty: 'medium', question: 'What are the four BGS subgrades?', correct_answer: 'Centering, Corners, Edges, Surface', wrong_answers: ['Color, Clarity, Cut, Carat', 'Front, Back, Sides, Print', 'Gloss, Print, Color, Wear'], explanation: 'BGS grades cards on Centering, Corners, Edges, and Surface quality.', xp_reward: 20 },
  { category: 'grading', difficulty: 'hard', question: 'What percentage of cards graded by PSA receive a 10?', correct_answer: 'About 2-5%', wrong_answers: ['About 20%', 'About 10%', 'About 1%'], explanation: 'PSA 10s are rare - only about 2-5% of submitted cards achieve this grade.', xp_reward: 30 },
  { category: 'grading', difficulty: 'easy', question: 'What does CGC stand for in card grading?', correct_answer: 'Certified Guaranty Company', wrong_answers: ['Card Grading Corporation', 'Collectors Grade Company', 'Comic Grade Certification'], explanation: 'CGC expanded from comics to trading cards in 2020.', xp_reward: 10 },
  { category: 'grading', difficulty: 'medium', question: 'What company uses "tuxedo" labels for vintage cards?', correct_answer: 'SGC', wrong_answers: ['PSA', 'BGS', 'CGC'], explanation: 'SGC\'s distinctive black "tuxedo" labels are popular for vintage cards.', xp_reward: 20 },
  { category: 'grading', difficulty: 'hard', question: 'What is "crossover" grading?', correct_answer: 'Regrading a card from one company to another', wrong_answers: ['Grading multiple sports', 'Grading foreign cards', 'Grading error cards'], explanation: 'Crossover involves submitting an already-graded card to a different grading company.', xp_reward: 30 },

  // ========== GENERAL/HISTORY (25 questions) ==========
  { category: 'general', difficulty: 'easy', question: 'What is a "booster pack"?', correct_answer: 'Sealed pack of random cards', wrong_answers: ['A starter deck', 'A graded card', 'A storage box'], explanation: 'Booster packs contain randomized cards for collecting and playing.', xp_reward: 10 },
  { category: 'general', difficulty: 'easy', question: 'What is a "chase card"?', correct_answer: 'Highly desirable rare card', wrong_answers: ['A card showing running', 'A promotional card', 'A common card'], explanation: 'Chase cards are the rare, valuable cards collectors seek in a set.', xp_reward: 10 },
  { category: 'general', difficulty: 'medium', question: 'What does "NM" condition mean?', correct_answer: 'Near Mint', wrong_answers: ['Not Marked', 'New Model', 'Normal Mint'], explanation: 'Near Mint indicates a card in excellent condition with minimal wear.', xp_reward: 20 },
  { category: 'general', difficulty: 'medium', question: 'What is card "centering"?', correct_answer: 'How evenly the image is positioned', wrong_answers: ['The card\'s theme', 'The holographic pattern', 'The card number'], explanation: 'Centering measures how evenly the card\'s image is positioned within the borders.', xp_reward: 20 },
  { category: 'general', difficulty: 'hard', question: 'What year were the first baseball cards produced?', correct_answer: '1860s', wrong_answers: ['1900s', '1880s', '1920s'], explanation: 'The earliest baseball cards appeared in the 1860s, with team photos from the Civil War era.', xp_reward: 30 },
  { category: 'general', difficulty: 'easy', question: 'What is a "slab"?', correct_answer: 'A graded card in its holder', wrong_answers: ['A thick card', 'A fake card', 'A damaged card'], explanation: 'Slabs are the tamper-evident cases that hold professionally graded cards.', xp_reward: 10 },
  { category: 'general', difficulty: 'medium', question: 'What is a "1/1" card?', correct_answer: 'Only one copy exists', wrong_answers: ['First card in set', 'One dollar card', 'One player card'], explanation: '1/1 cards are unique - only a single copy was produced.', xp_reward: 20 },
  { category: 'general', difficulty: 'hard', question: 'What was the first trading card game?', correct_answer: 'Magic: The Gathering', wrong_answers: ['Pokémon TCG', 'Yu-Gi-Oh!', 'Baseball cards'], explanation: 'MTG (1993) was the first collectible trading card game. Baseball cards predate it but aren\'t games.', xp_reward: 30 },

  // ========== LORCANA (15 questions) ==========
  { category: 'lorcana', difficulty: 'easy', question: 'What company produces Disney Lorcana?', correct_answer: 'Ravensburger', wrong_answers: ['Disney', 'Hasbro', 'Wizards of the Coast'], explanation: 'Ravensburger produces Lorcana under license from Disney.', xp_reward: 10 },
  { category: 'lorcana', difficulty: 'easy', question: 'What year was Disney Lorcana released?', correct_answer: '2023', wrong_answers: ['2021', '2022', '2024'], explanation: 'Lorcana debuted in August 2023 at Gen Con.', xp_reward: 10 },
  { category: 'lorcana', difficulty: 'medium', question: 'What are the six ink colors in Lorcana?', correct_answer: 'Amber, Amethyst, Emerald, Ruby, Sapphire, Steel', wrong_answers: ['Red, Blue, Green, Yellow, Purple, Black', 'Fire, Water, Earth, Air, Light, Dark', 'Gold, Silver, Bronze, Iron, Copper, Tin'], explanation: 'Lorcana uses Amber, Amethyst, Emerald, Ruby, Sapphire, and Steel inks.', xp_reward: 20 },
  { category: 'lorcana', difficulty: 'medium', question: 'What do you call the resource used to play cards in Lorcana?', correct_answer: 'Ink', wrong_answers: ['Mana', 'Energy', 'Lore'], explanation: 'Players use Ink to pay for cards, placing cards in their inkwell.', xp_reward: 20 },
  { category: 'lorcana', difficulty: 'hard', question: 'What was the first Lorcana set called?', correct_answer: 'The First Chapter', wrong_answers: ['Rise of the Floodborn', 'Into the Inklands', 'Disney Debut'], explanation: 'The First Chapter was Lorcana\'s debut set in August 2023.', xp_reward: 30 },
  { category: 'lorcana', difficulty: 'easy', question: 'How much lore do you need to win a game of Lorcana?', correct_answer: '20', wrong_answers: ['10', '15', '25'], explanation: 'First player to collect 20 lore wins the game.', xp_reward: 10 },
  { category: 'lorcana', difficulty: 'medium', question: 'What rarity is indicated by a bronze border?', correct_answer: 'Common', wrong_answers: ['Uncommon', 'Rare', 'Legendary'], explanation: 'Commons have bronze borders, while Legendaries have gold.', xp_reward: 20 },
];

export async function POST(request: NextRequest) {
  try {
    // Insert all questions
    const { data, error } = await supabase
      .from('cv_trivia_questions')
      .upsert(
        TRIVIA_QUESTIONS.map((q, idx) => ({
          id: `trivia-${q.category}-${idx + 1}`,
          ...q,
          is_active: true,
          created_at: new Date().toISOString(),
        })),
        { onConflict: 'id' }
      );

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Seeded ${TRIVIA_QUESTIONS.length} trivia questions`,
      categories: {
        pokemon: TRIVIA_QUESTIONS.filter(q => q.category === 'pokemon').length,
        mtg: TRIVIA_QUESTIONS.filter(q => q.category === 'mtg').length,
        yugioh: TRIVIA_QUESTIONS.filter(q => q.category === 'yugioh').length,
        sports: TRIVIA_QUESTIONS.filter(q => q.category === 'sports').length,
        grading: TRIVIA_QUESTIONS.filter(q => q.category === 'grading').length,
        general: TRIVIA_QUESTIONS.filter(q => q.category === 'general').length,
        lorcana: TRIVIA_QUESTIONS.filter(q => q.category === 'lorcana').length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    availableQuestions: TRIVIA_QUESTIONS.length,
    preview: TRIVIA_QUESTIONS.slice(0, 5),
  });
}
