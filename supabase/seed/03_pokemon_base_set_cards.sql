-- ============================================================================
-- CRAVCARDS SEED DATA: POKEMON BASE SET CARDS (102 Cards)
-- The Original 102 Cards That Started It All
-- Created: December 11, 2025
-- ============================================================================

-- First, get the set_id for Base Set
DO $$
DECLARE
  base_set_id UUID;
BEGIN
  SELECT id INTO base_set_id FROM card_sets WHERE slug = 'pokemon-base-set';
  
  -- If Base Set doesn't exist yet, we'll use NULL and rely on set_code
END $$;

INSERT INTO card_catalog (name, slug, set_code, card_number, category, rarity, year_released, description, image_url, metadata, price_raw, price_psa_10, is_featured) VALUES

-- ============================================================================
-- HOLO RARE CARDS (1-16)
-- ============================================================================
('Alakazam', 'base-set-alakazam', 'BS', '1/102', 'pokemon', 'holo_rare', 1999, 'Psychic Pokemon with powerful Damage Swap ability.', 'https://images.pokemontcg.io/base1/1_hires.png', '{"hp": 80, "type": "Psychic", "weakness": "Psychic", "retreat_cost": 3, "abilities": ["Damage Swap"], "attacks": ["Confuse Ray"]}', 25.00, 800.00, false),

('Blastoise', 'base-set-blastoise', 'BS', '2/102', 'pokemon', 'holo_rare', 1999, 'Water Pokemon with Rain Dance ability for energy acceleration.', 'https://images.pokemontcg.io/base1/2_hires.png', '{"hp": 100, "type": "Water", "weakness": "Lightning", "retreat_cost": 3, "abilities": ["Rain Dance"], "attacks": ["Hydro Pump"]}', 80.00, 4500.00, true),

('Chansey', 'base-set-chansey', 'BS', '3/102', 'pokemon', 'holo_rare', 1999, 'Normal Pokemon with massive HP and Double-edge attack.', 'https://images.pokemontcg.io/base1/3_hires.png', '{"hp": 120, "type": "Normal", "weakness": "Fighting", "retreat_cost": 1, "attacks": ["Scrunch", "Double-edge"]}', 20.00, 600.00, false),

('Charizard', 'base-set-charizard', 'BS', '4/102', 'pokemon', 'holo_rare', 1999, 'The most iconic and valuable card from Base Set. Fire Spin does 100 damage.', 'https://images.pokemontcg.io/base1/4_hires.png', '{"hp": 120, "type": "Fire", "weakness": "Water", "retreat_cost": 3, "abilities": ["Energy Burn"], "attacks": ["Fire Spin"]}', 350.00, 50000.00, true),

('Clefairy', 'base-set-clefairy', 'BS', '5/102', 'pokemon', 'holo_rare', 1999, 'Fairy Pokemon with Metronome attack that copies opponent.', 'https://images.pokemontcg.io/base1/5_hires.png', '{"hp": 40, "type": "Normal", "weakness": "Fighting", "retreat_cost": 1, "attacks": ["Sing", "Metronome"]}', 15.00, 400.00, false),

('Gyarados', 'base-set-gyarados', 'BS', '6/102', 'pokemon', 'holo_rare', 1999, 'Powerful Water Pokemon with Dragon Rage attack.', 'https://images.pokemontcg.io/base1/6_hires.png', '{"hp": 100, "type": "Water", "weakness": "Lightning", "retreat_cost": 3, "attacks": ["Dragon Rage", "Bubblebeam"]}', 30.00, 1200.00, true),

('Hitmonchan', 'base-set-hitmonchan', 'BS', '7/102', 'pokemon', 'holo_rare', 1999, 'Fighting Pokemon, key card in early competitive play.', 'https://images.pokemontcg.io/base1/7_hires.png', '{"hp": 70, "type": "Fighting", "weakness": "Psychic", "retreat_cost": 2, "attacks": ["Jab", "Special Punch"]}', 25.00, 800.00, false),

('Machamp', 'base-set-machamp', 'BS', '8/102', 'pokemon', 'holo_rare', 1999, 'Fighting Pokemon only available in starter decks. 1st Edition very rare.', 'https://images.pokemontcg.io/base1/8_hires.png', '{"hp": 100, "type": "Fighting", "weakness": "Psychic", "retreat_cost": 3, "abilities": ["Strikes Back"], "attacks": ["Seismic Toss"]}', 20.00, 700.00, false),

('Magneton', 'base-set-magneton', 'BS', '9/102', 'pokemon', 'holo_rare', 1999, 'Electric Pokemon with Selfdestruct attack.', 'https://images.pokemontcg.io/base1/9_hires.png', '{"hp": 60, "type": "Lightning", "weakness": "Fighting", "retreat_cost": 1, "attacks": ["Thunder Wave", "Selfdestruct"]}', 15.00, 500.00, false),

('Mewtwo', 'base-set-mewtwo', 'BS', '10/102', 'pokemon', 'holo_rare', 1999, 'Legendary Psychic Pokemon with Psychic and Barrier attacks.', 'https://images.pokemontcg.io/base1/10_hires.png', '{"hp": 60, "type": "Psychic", "weakness": "Psychic", "retreat_cost": 3, "attacks": ["Psychic", "Barrier"]}', 40.00, 2000.00, true),

('Nidoking', 'base-set-nidoking', 'BS', '11/102', 'pokemon', 'holo_rare', 1999, 'Poison Pokemon with Thrash and Toxic attacks.', 'https://images.pokemontcg.io/base1/11_hires.png', '{"hp": 90, "type": "Grass", "weakness": "Psychic", "retreat_cost": 3, "attacks": ["Thrash", "Toxic"]}', 20.00, 700.00, false),

('Ninetales', 'base-set-ninetales', 'BS', '12/102', 'pokemon', 'holo_rare', 1999, 'Fire Pokemon with Lure and Fire Blast attacks.', 'https://images.pokemontcg.io/base1/12_hires.png', '{"hp": 80, "type": "Fire", "weakness": "Water", "retreat_cost": 1, "attacks": ["Lure", "Fire Blast"]}', 20.00, 800.00, false),

('Poliwrath', 'base-set-poliwrath', 'BS', '13/102', 'pokemon', 'holo_rare', 1999, 'Water/Fighting Pokemon with Water Gun attack.', 'https://images.pokemontcg.io/base1/13_hires.png', '{"hp": 90, "type": "Water", "weakness": "Lightning", "retreat_cost": 3, "attacks": ["Water Gun", "Whirlpool"]}', 18.00, 600.00, false),

('Raichu', 'base-set-raichu', 'BS', '14/102', 'pokemon', 'holo_rare', 1999, 'Electric Pokemon, evolution of Pikachu with Agility and Thunder.', 'https://images.pokemontcg.io/base1/14_hires.png', '{"hp": 80, "type": "Lightning", "weakness": "Fighting", "retreat_cost": 1, "attacks": ["Agility", "Thunder"]}', 25.00, 1000.00, false),

('Venusaur', 'base-set-venusaur', 'BS', '15/102', 'pokemon', 'holo_rare', 1999, 'Grass Pokemon with Energy Trans ability. One of the original starter trio.', 'https://images.pokemontcg.io/base1/15_hires.png', '{"hp": 100, "type": "Grass", "weakness": "Fire", "retreat_cost": 2, "abilities": ["Energy Trans"], "attacks": ["Solarbeam"]}', 70.00, 4000.00, true),

('Zapdos', 'base-set-zapdos', 'BS', '16/102', 'pokemon', 'holo_rare', 1999, 'Legendary Electric bird with Thunder and Thunderbolt attacks.', 'https://images.pokemontcg.io/base1/16_hires.png', '{"hp": 90, "type": "Lightning", "weakness": "Fighting", "retreat_cost": 3, "attacks": ["Thunder", "Thunderbolt"]}', 30.00, 1200.00, true),

-- ============================================================================
-- RARE CARDS (17-32)
-- ============================================================================
('Beedrill', 'base-set-beedrill', 'BS', '17/102', 'pokemon', 'rare', 1999, 'Grass Pokemon with Twin Needle attack.', 'https://images.pokemontcg.io/base1/17_hires.png', '{"hp": 80, "type": "Grass", "weakness": "Fire", "retreat_cost": 0, "attacks": ["Twineedle", "Poison Sting"]}', 5.00, 150.00, false),

('Dragonair', 'base-set-dragonair', 'BS', '18/102', 'pokemon', 'rare', 1999, 'Dragon Pokemon with Slam and Hyper Beam attacks.', 'https://images.pokemontcg.io/base1/18_hires.png', '{"hp": 80, "type": "Normal", "weakness": "Psychic", "retreat_cost": 2, "attacks": ["Slam", "Hyper Beam"]}', 8.00, 200.00, false),

('Dugtrio', 'base-set-dugtrio', 'BS', '19/102', 'pokemon', 'rare', 1999, 'Ground Pokemon with Slash and Earthquake attacks.', 'https://images.pokemontcg.io/base1/19_hires.png', '{"hp": 70, "type": "Fighting", "weakness": "Grass", "retreat_cost": 2, "attacks": ["Slash", "Earthquake"]}', 4.00, 120.00, false),

('Electabuzz', 'base-set-electabuzz', 'BS', '20/102', 'pokemon', 'rare', 1999, 'Electric Pokemon, staple of early competitive play (Haymaker decks).', 'https://images.pokemontcg.io/base1/20_hires.png', '{"hp": 70, "type": "Lightning", "weakness": "Fighting", "retreat_cost": 2, "attacks": ["Thundershock", "Thunderpunch"]}', 6.00, 180.00, true),

('Electrode', 'base-set-electrode', 'BS', '21/102', 'pokemon', 'rare', 1999, 'Electric Pokemon with Buzzap ability for energy.', 'https://images.pokemontcg.io/base1/21_hires.png', '{"hp": 80, "type": "Lightning", "weakness": "Fighting", "retreat_cost": 1, "abilities": ["Buzzap"], "attacks": ["Electric Shock"]}', 5.00, 150.00, false),

('Pidgeotto', 'base-set-pidgeotto', 'BS', '22/102', 'pokemon', 'rare', 1999, 'Flying Pokemon with Whirlwind and Mirror Move.', 'https://images.pokemontcg.io/base1/22_hires.png', '{"hp": 60, "type": "Normal", "weakness": "Lightning", "retreat_cost": 1, "attacks": ["Whirlwind", "Mirror Move"]}', 3.00, 100.00, false),

('Arcanine', 'base-set-arcanine', 'BS', '23/102', 'pokemon', 'uncommon', 1999, 'Fire Pokemon with Flamethrower and Take Down attacks.', 'https://images.pokemontcg.io/base1/23_hires.png', '{"hp": 100, "type": "Fire", "weakness": "Water", "retreat_cost": 3, "attacks": ["Flamethrower", "Take Down"]}', 4.00, 120.00, false),

('Charmeleon', 'base-set-charmeleon', 'BS', '24/102', 'pokemon', 'uncommon', 1999, 'Fire Pokemon, middle evolution to Charizard.', 'https://images.pokemontcg.io/base1/24_hires.png', '{"hp": 80, "type": "Fire", "weakness": "Water", "retreat_cost": 1, "attacks": ["Slash", "Flamethrower"]}', 8.00, 200.00, true),

('Dewgong', 'base-set-dewgong', 'BS', '25/102', 'pokemon', 'uncommon', 1999, 'Water/Ice Pokemon with Aurora Beam attack.', 'https://images.pokemontcg.io/base1/25_hires.png', '{"hp": 80, "type": "Water", "weakness": "Lightning", "retreat_cost": 3, "attacks": ["Aurora Beam", "Ice Beam"]}', 2.00, 80.00, false),

('Dratini', 'base-set-dratini', 'BS', '26/102', 'pokemon', 'uncommon', 1999, 'Dragon Pokemon, first stage of Dragonite evolution.', 'https://images.pokemontcg.io/base1/26_hires.png', '{"hp": 40, "type": "Normal", "weakness": "Psychic", "retreat_cost": 1, "attacks": ["Pound"]}', 3.00, 100.00, false),

('Farfetchd', 'base-set-farfetchd', 'BS', '27/102', 'pokemon', 'uncommon', 1999, 'Normal Pokemon with Leek Slap attack.', 'https://images.pokemontcg.io/base1/27_hires.png', '{"hp": 50, "type": "Normal", "weakness": "Lightning", "retreat_cost": 1, "attacks": ["Leek Slap", "Pot Smash"]}', 2.00, 60.00, false),

('Growlithe', 'base-set-growlithe', 'BS', '28/102', 'pokemon', 'uncommon', 1999, 'Fire Pokemon, basic for Arcanine evolution.', 'https://images.pokemontcg.io/base1/28_hires.png', '{"hp": 60, "type": "Fire", "weakness": "Water", "retreat_cost": 1, "attacks": ["Flare"]}', 2.00, 70.00, false),

('Haunter', 'base-set-haunter', 'BS', '29/102', 'pokemon', 'uncommon', 1999, 'Ghost Pokemon with Hypnosis and Dream Eater.', 'https://images.pokemontcg.io/base1/29_hires.png', '{"hp": 60, "type": "Psychic", "weakness": "None", "retreat_cost": 1, "attacks": ["Hypnosis", "Dream Eater"]}', 3.00, 90.00, false),

('Ivysaur', 'base-set-ivysaur', 'BS', '30/102', 'pokemon', 'uncommon', 1999, 'Grass Pokemon, middle evolution to Venusaur.', 'https://images.pokemontcg.io/base1/30_hires.png', '{"hp": 60, "type": "Grass", "weakness": "Fire", "retreat_cost": 1, "attacks": ["Vine Whip", "Poisonpowder"]}', 5.00, 150.00, false),

('Jynx', 'base-set-jynx', 'BS', '31/102', 'pokemon', 'uncommon', 1999, 'Ice/Psychic Pokemon with Doubleslap and Meditate.', 'https://images.pokemontcg.io/base1/31_hires.png', '{"hp": 70, "type": "Psychic", "weakness": "Psychic", "retreat_cost": 2, "attacks": ["Doubleslap", "Meditate"]}', 2.00, 60.00, false),

('Kadabra', 'base-set-kadabra', 'BS', '32/102', 'pokemon', 'uncommon', 1999, 'Psychic Pokemon, middle evolution to Alakazam.', 'https://images.pokemontcg.io/base1/32_hires.png', '{"hp": 60, "type": "Psychic", "weakness": "Psychic", "retreat_cost": 3, "attacks": ["Recover", "Super Psy"]}', 3.00, 100.00, false),

('Kakuna', 'base-set-kakuna', 'BS', '33/102', 'pokemon', 'uncommon', 1999, 'Bug Pokemon, middle evolution of Beedrill line.', 'https://images.pokemontcg.io/base1/33_hires.png', '{"hp": 80, "type": "Grass", "weakness": "Fire", "retreat_cost": 2, "attacks": ["Stiffen", "Poisonpowder"]}', 1.50, 50.00, false),

('Machoke', 'base-set-machoke', 'BS', '34/102', 'pokemon', 'uncommon', 1999, 'Fighting Pokemon, middle evolution to Machamp.', 'https://images.pokemontcg.io/base1/34_hires.png', '{"hp": 80, "type": "Fighting", "weakness": "Psychic", "retreat_cost": 3, "attacks": ["Karate Chop", "Submission"]}', 2.00, 60.00, false),

('Magikarp', 'base-set-magikarp', 'BS', '35/102', 'pokemon', 'uncommon', 1999, 'Water Pokemon known for evolving into powerful Gyarados.', 'https://images.pokemontcg.io/base1/35_hires.png', '{"hp": 30, "type": "Water", "weakness": "Lightning", "retreat_cost": 1, "attacks": ["Tackle", "Flail"]}', 3.00, 80.00, false),

('Magmar', 'base-set-magmar', 'BS', '36/102', 'pokemon', 'uncommon', 1999, 'Fire Pokemon with Fire Punch and Flamethrower.', 'https://images.pokemontcg.io/base1/36_hires.png', '{"hp": 50, "type": "Fire", "weakness": "Water", "retreat_cost": 2, "attacks": ["Fire Punch", "Flamethrower"]}', 2.00, 70.00, false),

('Nidorino', 'base-set-nidorino', 'BS', '37/102', 'pokemon', 'uncommon', 1999, 'Poison Pokemon, middle evolution to Nidoking.', 'https://images.pokemontcg.io/base1/37_hires.png', '{"hp": 60, "type": "Grass", "weakness": "Psychic", "retreat_cost": 1, "attacks": ["Double Kick", "Horn Drill"]}', 2.00, 60.00, false),

('Poliwhirl', 'base-set-poliwhirl', 'BS', '38/102', 'pokemon', 'uncommon', 1999, 'Water Pokemon, evolves to Poliwrath or Politoed.', 'https://images.pokemontcg.io/base1/38_hires.png', '{"hp": 60, "type": "Water", "weakness": "Lightning", "retreat_cost": 1, "attacks": ["Amnesia", "Doubleslap"]}', 2.00, 60.00, false),

('Porygon', 'base-set-porygon', 'BS', '39/102', 'pokemon', 'uncommon', 1999, 'Normal/Digital Pokemon with Conversion attacks.', 'https://images.pokemontcg.io/base1/39_hires.png', '{"hp": 30, "type": "Normal", "weakness": "Fighting", "retreat_cost": 1, "attacks": ["Conversion 1", "Conversion 2"]}', 3.00, 80.00, false),

('Raticate', 'base-set-raticate', 'BS', '40/102', 'pokemon', 'uncommon', 1999, 'Normal Pokemon with Super Fang attack.', 'https://images.pokemontcg.io/base1/40_hires.png', '{"hp": 60, "type": "Normal", "weakness": "Fighting", "retreat_cost": 1, "attacks": ["Bite", "Super Fang"]}', 1.50, 50.00, false),

('Seel', 'base-set-seel', 'BS', '41/102', 'pokemon', 'uncommon', 1999, 'Water Pokemon, basic for Dewgong evolution.', 'https://images.pokemontcg.io/base1/41_hires.png', '{"hp": 60, "type": "Water", "weakness": "Lightning", "retreat_cost": 1, "attacks": ["Headbutt"]}', 1.50, 50.00, false),

('Wartortle', 'base-set-wartortle', 'BS', '42/102', 'pokemon', 'uncommon', 1999, 'Water Pokemon, middle evolution to Blastoise.', 'https://images.pokemontcg.io/base1/42_hires.png', '{"hp": 70, "type": "Water", "weakness": "Lightning", "retreat_cost": 1, "attacks": ["Withdraw", "Bite"]}', 6.00, 180.00, false),

-- ============================================================================
-- COMMON CARDS (43-69)
-- ============================================================================
('Abra', 'base-set-abra', 'BS', '43/102', 'pokemon', 'common', 1999, 'Psychic Pokemon, basic for Alakazam evolution.', 'https://images.pokemontcg.io/base1/43_hires.png', '{"hp": 30, "type": "Psychic", "weakness": "Psychic", "retreat_cost": 0, "attacks": ["Psyshock"]}', 1.00, 40.00, false),

('Bulbasaur', 'base-set-bulbasaur', 'BS', '44/102', 'pokemon', 'common', 1999, 'Grass Pokemon, the first Pokemon in the Pokedex (#001).', 'https://images.pokemontcg.io/base1/44_hires.png', '{"hp": 40, "type": "Grass", "weakness": "Fire", "retreat_cost": 1, "attacks": ["Leech Seed"]}', 3.00, 100.00, true),

('Caterpie', 'base-set-caterpie', 'BS', '45/102', 'pokemon', 'common', 1999, 'Bug Pokemon, basic stage of Butterfree line.', 'https://images.pokemontcg.io/base1/45_hires.png', '{"hp": 40, "type": "Grass", "weakness": "Fire", "retreat_cost": 1, "attacks": ["String Shot"]}', 1.00, 35.00, false),

('Charmander', 'base-set-charmander', 'BS', '46/102', 'pokemon', 'common', 1999, 'Fire Pokemon, the beloved fire starter. Basic for Charizard.', 'https://images.pokemontcg.io/base1/46_hires.png', '{"hp": 50, "type": "Fire", "weakness": "Water", "retreat_cost": 1, "attacks": ["Scratch", "Ember"]}', 8.00, 250.00, true),

('Diglett', 'base-set-diglett', 'BS', '47/102', 'pokemon', 'common', 1999, 'Ground Pokemon, basic for Dugtrio evolution.', 'https://images.pokemontcg.io/base1/47_hires.png', '{"hp": 30, "type": "Fighting", "weakness": "Grass", "retreat_cost": 0, "attacks": ["Dig", "Mud Slap"]}', 1.00, 35.00, false),

('Doduo', 'base-set-doduo', 'BS', '48/102', 'pokemon', 'common', 1999, 'Normal/Flying Pokemon with Fury Attack.', 'https://images.pokemontcg.io/base1/48_hires.png', '{"hp": 50, "type": "Normal", "weakness": "Lightning", "retreat_cost": 0, "attacks": ["Fury Attack"]}', 1.00, 35.00, false),

('Drowzee', 'base-set-drowzee', 'BS', '49/102', 'pokemon', 'common', 1999, 'Psychic Pokemon with Pound and Confuse Ray.', 'https://images.pokemontcg.io/base1/49_hires.png', '{"hp": 50, "type": "Psychic", "weakness": "Psychic", "retreat_cost": 1, "attacks": ["Pound", "Confuse Ray"]}', 1.00, 35.00, false),

('Gastly', 'base-set-gastly', 'BS', '50/102', 'pokemon', 'common', 1999, 'Ghost Pokemon, basic for Gengar evolution line.', 'https://images.pokemontcg.io/base1/50_hires.png', '{"hp": 30, "type": "Psychic", "weakness": "None", "retreat_cost": 0, "attacks": ["Sleeping Gas", "Destiny Bond"]}', 2.00, 60.00, false),

('Koffing', 'base-set-koffing', 'BS', '51/102', 'pokemon', 'common', 1999, 'Poison Pokemon with Foul Gas attack.', 'https://images.pokemontcg.io/base1/51_hires.png', '{"hp": 50, "type": "Grass", "weakness": "Psychic", "retreat_cost": 1, "attacks": ["Foul Gas", "Smog"]}', 1.00, 35.00, false),

('Machop', 'base-set-machop', 'BS', '52/102', 'pokemon', 'common', 1999, 'Fighting Pokemon, basic for Machamp evolution.', 'https://images.pokemontcg.io/base1/52_hires.png', '{"hp": 50, "type": "Fighting", "weakness": "Psychic", "retreat_cost": 1, "attacks": ["Low Kick"]}', 1.00, 35.00, false),

('Magnemite', 'base-set-magnemite', 'BS', '53/102', 'pokemon', 'common', 1999, 'Electric Pokemon, basic for Magneton evolution.', 'https://images.pokemontcg.io/base1/53_hires.png', '{"hp": 40, "type": "Lightning", "weakness": "Fighting", "retreat_cost": 1, "attacks": ["Thunder Wave", "Selfdestruct"]}', 1.00, 35.00, false),

('Metapod', 'base-set-metapod', 'BS', '54/102', 'pokemon', 'common', 1999, 'Bug Pokemon, middle evolution of Butterfree line.', 'https://images.pokemontcg.io/base1/54_hires.png', '{"hp": 70, "type": "Grass", "weakness": "Fire", "retreat_cost": 2, "attacks": ["Stiffen", "Stun Spore"]}', 1.00, 35.00, false),

('Nidoran Male', 'base-set-nidoran-m', 'BS', '55/102', 'pokemon', 'common', 1999, 'Poison Pokemon, basic for Nidoking evolution.', 'https://images.pokemontcg.io/base1/55_hires.png', '{"hp": 40, "type": "Grass", "weakness": "Psychic", "retreat_cost": 1, "attacks": ["Horn Hazard"]}', 1.00, 35.00, false),

('Onix', 'base-set-onix', 'BS', '56/102', 'pokemon', 'common', 1999, 'Rock Pokemon with high HP for a basic Pokemon.', 'https://images.pokemontcg.io/base1/56_hires.png', '{"hp": 90, "type": "Fighting", "weakness": "Grass", "retreat_cost": 3, "attacks": ["Rock Throw", "Harden"]}', 2.00, 50.00, false),

('Pidgey', 'base-set-pidgey', 'BS', '57/102', 'pokemon', 'common', 1999, 'Normal/Flying Pokemon, basic of Pidgeot line.', 'https://images.pokemontcg.io/base1/57_hires.png', '{"hp": 40, "type": "Normal", "weakness": "Lightning", "retreat_cost": 1, "attacks": ["Whirlwind"]}', 1.00, 35.00, false),

('Pikachu', 'base-set-pikachu', 'BS', '58/102', 'pokemon', 'common', 1999, 'The iconic Electric mouse Pokemon. Mascot of the franchise.', 'https://images.pokemontcg.io/base1/58_hires.png', '{"hp": 40, "type": "Lightning", "weakness": "Fighting", "retreat_cost": 1, "attacks": ["Gnaw", "Thunder Jolt"]}', 6.00, 250.00, true),

('Poliwag', 'base-set-poliwag', 'BS', '59/102', 'pokemon', 'common', 1999, 'Water Pokemon, basic for Poliwrath evolution.', 'https://images.pokemontcg.io/base1/59_hires.png', '{"hp": 40, "type": "Water", "weakness": "Lightning", "retreat_cost": 1, "attacks": ["Water Gun"]}', 1.00, 35.00, false),

('Ponyta', 'base-set-ponyta', 'BS', '60/102', 'pokemon', 'common', 1999, 'Fire horse Pokemon with Smash Kick attack.', 'https://images.pokemontcg.io/base1/60_hires.png', '{"hp": 40, "type": "Fire", "weakness": "Water", "retreat_cost": 1, "attacks": ["Smash Kick", "Flame Tail"]}', 1.50, 40.00, false),

('Rattata', 'base-set-rattata', 'BS', '61/102', 'pokemon', 'common', 1999, 'Normal Pokemon, basic for Raticate evolution.', 'https://images.pokemontcg.io/base1/61_hires.png', '{"hp": 30, "type": "Normal", "weakness": "Fighting", "retreat_cost": 0, "attacks": ["Bite"]}', 1.00, 35.00, false),

('Sandshrew', 'base-set-sandshrew', 'BS', '62/102', 'pokemon', 'common', 1999, 'Ground Pokemon with Sand-attack.', 'https://images.pokemontcg.io/base1/62_hires.png', '{"hp": 40, "type": "Fighting", "weakness": "Grass", "retreat_cost": 1, "attacks": ["Sand-attack"]}', 1.00, 35.00, false),

('Squirtle', 'base-set-squirtle', 'BS', '63/102', 'pokemon', 'common', 1999, 'Water Pokemon starter. Basic for Blastoise evolution.', 'https://images.pokemontcg.io/base1/63_hires.png', '{"hp": 40, "type": "Water", "weakness": "Lightning", "retreat_cost": 1, "attacks": ["Bubble", "Withdraw"]}', 5.00, 180.00, true),

('Starmie', 'base-set-starmie', 'BS', '64/102', 'pokemon', 'common', 1999, 'Water/Psychic Pokemon with Recover ability.', 'https://images.pokemontcg.io/base1/64_hires.png', '{"hp": 60, "type": "Water", "weakness": "Lightning", "retreat_cost": 1, "attacks": ["Recover", "Star Freeze"]}', 1.50, 40.00, false),

('Staryu', 'base-set-staryu', 'BS', '65/102', 'pokemon', 'common', 1999, 'Water Pokemon, basic for Starmie evolution.', 'https://images.pokemontcg.io/base1/65_hires.png', '{"hp": 40, "type": "Water", "weakness": "Lightning", "retreat_cost": 1, "attacks": ["Slap"]}', 1.00, 35.00, false),

('Tangela', 'base-set-tangela', 'BS', '66/102', 'pokemon', 'common', 1999, 'Grass Pokemon with Bind and Poisonpowder.', 'https://images.pokemontcg.io/base1/66_hires.png', '{"hp": 50, "type": "Grass", "weakness": "Fire", "retreat_cost": 2, "attacks": ["Bind", "Poisonpowder"]}', 1.00, 35.00, false),

('Voltorb', 'base-set-voltorb', 'BS', '67/102', 'pokemon', 'common', 1999, 'Electric Pokemon, basic for Electrode evolution.', 'https://images.pokemontcg.io/base1/67_hires.png', '{"hp": 40, "type": "Lightning", "weakness": "Fighting", "retreat_cost": 1, "attacks": ["Tackle"]}', 1.00, 35.00, false),

('Vulpix', 'base-set-vulpix', 'BS', '68/102', 'pokemon', 'common', 1999, 'Fire Pokemon, basic for Ninetales evolution.', 'https://images.pokemontcg.io/base1/68_hires.png', '{"hp": 50, "type": "Fire", "weakness": "Water", "retreat_cost": 1, "attacks": ["Confuse Ray"]}', 2.00, 50.00, false),

('Weedle', 'base-set-weedle', 'BS', '69/102', 'pokemon', 'common', 1999, 'Bug Pokemon, basic for Beedrill evolution.', 'https://images.pokemontcg.io/base1/69_hires.png', '{"hp": 40, "type": "Grass", "weakness": "Fire", "retreat_cost": 1, "attacks": ["Poison Sting"]}', 1.00, 35.00, false),

-- ============================================================================
-- TRAINER CARDS (70-96)
-- ============================================================================
('Clefairy Doll', 'base-set-clefairy-doll', 'BS', '70/102', 'pokemon', 'rare', 1999, 'Trainer card that acts as a Pokemon in play.', 'https://images.pokemontcg.io/base1/70_hires.png', '{"card_type": "Trainer"}', 2.00, 50.00, false),

('Computer Search', 'base-set-computer-search', 'BS', '71/102', 'pokemon', 'rare', 1999, 'Powerful search card, staple in competitive play.', 'https://images.pokemontcg.io/base1/71_hires.png', '{"card_type": "Trainer"}', 8.00, 150.00, true),

('Devolution Spray', 'base-set-devolution-spray', 'BS', '72/102', 'pokemon', 'rare', 1999, 'De-evolve your Pokemon to heal damage.', 'https://images.pokemontcg.io/base1/72_hires.png', '{"card_type": "Trainer"}', 2.00, 50.00, false),

('Impostor Professor Oak', 'base-set-impostor-oak', 'BS', '73/102', 'pokemon', 'rare', 1999, 'Disruption card that shuffles opponents hand.', 'https://images.pokemontcg.io/base1/73_hires.png', '{"card_type": "Trainer"}', 3.00, 60.00, false),

('Item Finder', 'base-set-item-finder', 'BS', '74/102', 'pokemon', 'rare', 1999, 'Retrieve Trainer cards from discard pile.', 'https://images.pokemontcg.io/base1/74_hires.png', '{"card_type": "Trainer"}', 6.00, 120.00, true),

('Lass', 'base-set-lass', 'BS', '75/102', 'pokemon', 'rare', 1999, 'Both players shuffle Trainers into deck.', 'https://images.pokemontcg.io/base1/75_hires.png', '{"card_type": "Trainer"}', 2.00, 50.00, false),

('Pokemon Breeder', 'base-set-pokemon-breeder', 'BS', '76/102', 'pokemon', 'rare', 1999, 'Skip evolution stage to evolve directly.', 'https://images.pokemontcg.io/base1/76_hires.png', '{"card_type": "Trainer"}', 3.00, 70.00, false),

('Pokemon Trader', 'base-set-pokemon-trader', 'BS', '77/102', 'pokemon', 'rare', 1999, 'Trade a Pokemon from hand for one in deck.', 'https://images.pokemontcg.io/base1/77_hires.png', '{"card_type": "Trainer"}', 2.00, 50.00, false),

('Scoop Up', 'base-set-scoop-up', 'BS', '78/102', 'pokemon', 'rare', 1999, 'Return Pokemon and all cards to hand.', 'https://images.pokemontcg.io/base1/78_hires.png', '{"card_type": "Trainer"}', 3.00, 60.00, false),

('Super Energy Removal', 'base-set-super-energy-removal', 'BS', '79/102', 'pokemon', 'rare', 1999, 'Discard energy from opponent, powerful disruption.', 'https://images.pokemontcg.io/base1/79_hires.png', '{"card_type": "Trainer"}', 4.00, 80.00, true),

('Defender', 'base-set-defender', 'BS', '80/102', 'pokemon', 'uncommon', 1999, 'Reduce damage to your Pokemon.', 'https://images.pokemontcg.io/base1/80_hires.png', '{"card_type": "Trainer"}', 1.00, 30.00, false),

('Energy Retrieval', 'base-set-energy-retrieval', 'BS', '81/102', 'pokemon', 'uncommon', 1999, 'Get energy cards from discard pile.', 'https://images.pokemontcg.io/base1/81_hires.png', '{"card_type": "Trainer"}', 1.00, 30.00, false),

('Full Heal', 'base-set-full-heal', 'BS', '82/102', 'pokemon', 'uncommon', 1999, 'Remove all status conditions from Pokemon.', 'https://images.pokemontcg.io/base1/82_hires.png', '{"card_type": "Trainer"}', 1.00, 30.00, false),

('Maintenance', 'base-set-maintenance', 'BS', '83/102', 'pokemon', 'uncommon', 1999, 'Shuffle cards back to draw new ones.', 'https://images.pokemontcg.io/base1/83_hires.png', '{"card_type": "Trainer"}', 1.00, 30.00, false),

('PlusPower', 'base-set-pluspower', 'BS', '84/102', 'pokemon', 'uncommon', 1999, 'Add 10 damage to attacks for one turn.', 'https://images.pokemontcg.io/base1/84_hires.png', '{"card_type": "Trainer"}', 2.00, 40.00, false),

('Pokemon Center', 'base-set-pokemon-center', 'BS', '85/102', 'pokemon', 'uncommon', 1999, 'Heal all damage from all your Pokemon.', 'https://images.pokemontcg.io/base1/85_hires.png', '{"card_type": "Trainer"}', 2.00, 40.00, false),

('Pokemon Flute', 'base-set-pokemon-flute', 'BS', '86/102', 'pokemon', 'uncommon', 1999, 'Put basic Pokemon from opponents discard to their bench.', 'https://images.pokemontcg.io/base1/86_hires.png', '{"card_type": "Trainer"}', 1.00, 30.00, false),

('Pokedex', 'base-set-pokedex', 'BS', '87/102', 'pokemon', 'uncommon', 1999, 'Look at top 5 cards, rearrange them.', 'https://images.pokemontcg.io/base1/87_hires.png', '{"card_type": "Trainer"}', 1.00, 30.00, false),

('Professor Oak', 'base-set-professor-oak', 'BS', '88/102', 'pokemon', 'uncommon', 1999, 'The original draw power card. Draw 7 cards.', 'https://images.pokemontcg.io/base1/88_hires.png', '{"card_type": "Trainer"}', 4.00, 80.00, true),

('Revive', 'base-set-revive', 'BS', '89/102', 'pokemon', 'uncommon', 1999, 'Return basic Pokemon from discard to bench.', 'https://images.pokemontcg.io/base1/89_hires.png', '{"card_type": "Trainer"}', 1.50, 35.00, false),

('Super Potion', 'base-set-super-potion', 'BS', '90/102', 'pokemon', 'uncommon', 1999, 'Heal 40 damage but discard energy.', 'https://images.pokemontcg.io/base1/90_hires.png', '{"card_type": "Trainer"}', 1.50, 35.00, false),

('Bill', 'base-set-bill', 'BS', '91/102', 'pokemon', 'common', 1999, 'Draw 2 cards. Simple and effective.', 'https://images.pokemontcg.io/base1/91_hires.png', '{"card_type": "Trainer"}', 1.50, 40.00, false),

('Energy Removal', 'base-set-energy-removal', 'BS', '92/102', 'pokemon', 'common', 1999, 'Remove energy from opponents Pokemon.', 'https://images.pokemontcg.io/base1/92_hires.png', '{"card_type": "Trainer"}', 1.50, 40.00, false),

('Gust of Wind', 'base-set-gust-of-wind', 'BS', '93/102', 'pokemon', 'common', 1999, 'Switch opponents active Pokemon. Predecessor to Boss Orders.', 'https://images.pokemontcg.io/base1/93_hires.png', '{"card_type": "Trainer"}', 2.00, 50.00, true),

('Potion', 'base-set-potion', 'BS', '94/102', 'pokemon', 'common', 1999, 'Heal 20 damage from your Pokemon.', 'https://images.pokemontcg.io/base1/94_hires.png', '{"card_type": "Trainer"}', 1.00, 30.00, false),

('Switch', 'base-set-switch', 'BS', '95/102', 'pokemon', 'common', 1999, 'Switch your active Pokemon with a benched one.', 'https://images.pokemontcg.io/base1/95_hires.png', '{"card_type": "Trainer"}', 1.50, 40.00, false),

-- ============================================================================
-- ENERGY CARDS (96-102)
-- ============================================================================
('Double Colorless Energy', 'base-set-double-colorless', 'BS', '96/102', 'pokemon', 'uncommon', 1999, 'Provides 2 colorless energy. Staple card.', 'https://images.pokemontcg.io/base1/96_hires.png', '{"card_type": "Energy"}', 3.00, 60.00, true),

('Fighting Energy', 'base-set-fighting-energy', 'BS', '97/102', 'pokemon', 'common', 1999, 'Basic Fighting Energy card.', 'https://images.pokemontcg.io/base1/97_hires.png', '{"card_type": "Energy"}', 0.50, 20.00, false),

('Fire Energy', 'base-set-fire-energy', 'BS', '98/102', 'pokemon', 'common', 1999, 'Basic Fire Energy card.', 'https://images.pokemontcg.io/base1/98_hires.png', '{"card_type": "Energy"}', 0.50, 20.00, false),

('Grass Energy', 'base-set-grass-energy', 'BS', '99/102', 'pokemon', 'common', 1999, 'Basic Grass Energy card.', 'https://images.pokemontcg.io/base1/99_hires.png', '{"card_type": "Energy"}', 0.50, 20.00, false),

('Lightning Energy', 'base-set-lightning-energy', 'BS', '100/102', 'pokemon', 'common', 1999, 'Basic Lightning Energy card.', 'https://images.pokemontcg.io/base1/100_hires.png', '{"card_type": "Energy"}', 0.50, 20.00, false),

('Psychic Energy', 'base-set-psychic-energy', 'BS', '101/102', 'pokemon', 'common', 1999, 'Basic Psychic Energy card.', 'https://images.pokemontcg.io/base1/101_hires.png', '{"card_type": "Energy"}', 0.50, 20.00, false),

('Water Energy', 'base-set-water-energy', 'BS', '102/102', 'pokemon', 'common', 1999, 'Basic Water Energy card.', 'https://images.pokemontcg.io/base1/102_hires.png', '{"card_type": "Energy"}', 0.50, 20.00, false)

ON CONFLICT (set_code, card_number) DO UPDATE SET
  price_raw = EXCLUDED.price_raw,
  price_psa_10 = EXCLUDED.price_psa_10,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();
