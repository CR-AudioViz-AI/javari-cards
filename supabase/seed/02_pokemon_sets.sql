-- ============================================================================
-- CRAVCARDS SEED DATA: POKEMON SETS
-- 130+ Pokemon TCG Sets
-- Created: December 11, 2025
-- ============================================================================

INSERT INTO card_sets (name, slug, code, category, subcategory, release_date, release_year, total_cards, description, is_featured) VALUES

-- ============================================================================
-- WOTC ERA (1999-2003)
-- ============================================================================
('Base Set', 'pokemon-base-set', 'BS', 'pokemon', 'expansion', '1999-01-09', 1999, 102, 'The original Pokemon TCG set that started it all. Contains the iconic Charizard, Blastoise, and Venusaur.', true),
('Jungle', 'pokemon-jungle', 'JU', 'pokemon', 'expansion', '1999-06-16', 1999, 64, 'First expansion set featuring jungle-themed Pokemon including Flareon, Jolteon, and Vaporeon.', false),
('Fossil', 'pokemon-fossil', 'FO', 'pokemon', 'expansion', '1999-10-10', 1999, 62, 'Features prehistoric and fossil Pokemon including Aerodactyl, Kabutops, and Omastar.', false),
('Base Set 2', 'pokemon-base-set-2', 'B2', 'pokemon', 'reprint', '2000-02-24', 2000, 130, 'Combined reprint of Base Set and Jungle cards.', false),
('Team Rocket', 'pokemon-team-rocket', 'TR', 'pokemon', 'expansion', '2000-04-24', 2000, 83, 'First set featuring Dark Pokemon owned by Team Rocket.', true),
('Gym Heroes', 'pokemon-gym-heroes', 'G1', 'pokemon', 'expansion', '2000-08-14', 2000, 132, 'Features Pokemon owned by Kanto Gym Leaders.', false),
('Gym Challenge', 'pokemon-gym-challenge', 'G2', 'pokemon', 'expansion', '2000-10-16', 2000, 132, 'Continues Gym Leader theme with remaining leaders.', false),
('Neo Genesis', 'pokemon-neo-genesis', 'N1', 'pokemon', 'expansion', '2000-12-16', 2000, 111, 'First set with Generation 2 Pokemon. Contains Lugia.', true),
('Neo Discovery', 'pokemon-neo-discovery', 'N2', 'pokemon', 'expansion', '2001-06-01', 2001, 75, 'Continues Johto region exploration.', false),
('Neo Revelation', 'pokemon-neo-revelation', 'N3', 'pokemon', 'expansion', '2001-09-21', 2001, 66, 'Features Shining Pokemon mechanic.', false),
('Neo Destiny', 'pokemon-neo-destiny', 'N4', 'pokemon', 'expansion', '2002-02-28', 2002, 113, 'Final Neo series set with Light and Dark Pokemon.', true),
('Legendary Collection', 'pokemon-legendary-collection', 'LC', 'pokemon', 'reprint', '2002-05-24', 2002, 110, 'Reprint set with reverse holos for every card.', false),
('Expedition', 'pokemon-expedition', 'EX', 'pokemon', 'expansion', '2002-09-15', 2002, 165, 'First e-Card series with dot codes.', false),
('Aquapolis', 'pokemon-aquapolis', 'AQ', 'pokemon', 'expansion', '2003-01-15', 2003, 186, 'Water-themed e-Card set.', false),
('Skyridge', 'pokemon-skyridge', 'SK', 'pokemon', 'expansion', '2003-05-12', 2003, 182, 'Final WOTC Pokemon set, highly collectible.', true),

-- ============================================================================
-- EX ERA (2003-2007)
-- ============================================================================
('EX Ruby & Sapphire', 'pokemon-ex-ruby-sapphire', 'RS', 'pokemon', 'expansion', '2003-06-18', 2003, 109, 'First Generation 3 set, introduced Pokemon-ex.', true),
('EX Sandstorm', 'pokemon-ex-sandstorm', 'SS', 'pokemon', 'expansion', '2003-09-18', 2003, 100, 'Desert and ground-themed expansion.', false),
('EX Dragon', 'pokemon-ex-dragon', 'DR', 'pokemon', 'expansion', '2003-11-24', 2003, 100, 'Dragon-type focused expansion.', false),
('EX Team Magma vs Team Aqua', 'pokemon-ex-team-magma-aqua', 'MA', 'pokemon', 'expansion', '2004-03-15', 2004, 97, 'Features team battle mechanic.', false),
('EX Hidden Legends', 'pokemon-ex-hidden-legends', 'HL', 'pokemon', 'expansion', '2004-06-14', 2004, 102, 'Features legendary Pokemon.', false),
('EX FireRed & LeafGreen', 'pokemon-ex-firered-leafgreen', 'RG', 'pokemon', 'expansion', '2004-08-30', 2004, 116, 'Based on GBA remake games.', false),
('EX Team Rocket Returns', 'pokemon-ex-team-rocket-returns', 'TRR', 'pokemon', 'expansion', '2004-11-08', 2004, 111, 'Team Rocket themed with Dark Pokemon-ex.', false),
('EX Deoxys', 'pokemon-ex-deoxys', 'DX', 'pokemon', 'expansion', '2005-02-14', 2005, 108, 'Features Deoxys in multiple forms.', false),
('EX Emerald', 'pokemon-ex-emerald', 'EM', 'pokemon', 'expansion', '2005-05-09', 2005, 107, 'Based on Pokemon Emerald game.', false),
('EX Unseen Forces', 'pokemon-ex-unseen-forces', 'UF', 'pokemon', 'expansion', '2005-08-22', 2005, 145, 'Features Unown and psychic Pokemon.', false),
('EX Delta Species', 'pokemon-ex-delta-species', 'DS', 'pokemon', 'expansion', '2005-10-31', 2005, 114, 'Introduced Delta Species variant Pokemon.', true),
('EX Legend Maker', 'pokemon-ex-legend-maker', 'LM', 'pokemon', 'expansion', '2006-02-13', 2006, 93, 'Mythical and legendary focus.', false),
('EX Holon Phantoms', 'pokemon-ex-holon-phantoms', 'HP', 'pokemon', 'expansion', '2006-05-03', 2006, 111, 'Continues Delta Species storyline.', false),
('EX Crystal Guardians', 'pokemon-ex-crystal-guardians', 'CG', 'pokemon', 'expansion', '2006-08-30', 2006, 100, 'Crystal-themed Pokemon.', false),
('EX Dragon Frontiers', 'pokemon-ex-dragon-frontiers', 'DF', 'pokemon', 'expansion', '2006-11-08', 2006, 101, 'Final Delta Species set.', false),
('EX Power Keepers', 'pokemon-ex-power-keepers', 'PK', 'pokemon', 'expansion', '2007-02-14', 2007, 108, 'Final EX era expansion.', false),

-- ============================================================================
-- DIAMOND & PEARL ERA (2007-2011)
-- ============================================================================
('Diamond & Pearl', 'pokemon-diamond-pearl', 'DP', 'pokemon', 'expansion', '2007-05-23', 2007, 130, 'First Generation 4 set with Level X cards.', true),
('Mysterious Treasures', 'pokemon-mysterious-treasures', 'MT', 'pokemon', 'expansion', '2007-08-22', 2007, 124, 'Treasure and mystery themed.', false),
('Secret Wonders', 'pokemon-secret-wonders', 'SW', 'pokemon', 'expansion', '2007-11-07', 2007, 132, 'Features secret rare cards.', false),
('Great Encounters', 'pokemon-great-encounters', 'GE', 'pokemon', 'expansion', '2008-02-13', 2008, 106, 'Encounter-themed expansion.', false),
('Majestic Dawn', 'pokemon-majestic-dawn', 'MD', 'pokemon', 'expansion', '2008-05-21', 2008, 100, 'Dawn-themed Pokemon set.', false),
('Legends Awakened', 'pokemon-legends-awakened', 'LA', 'pokemon', 'expansion', '2008-08-20', 2008, 146, 'Legendary Pokemon focus.', false),
('Stormfront', 'pokemon-stormfront', 'SF', 'pokemon', 'expansion', '2008-11-05', 2008, 106, 'Storm and weather themed.', false),
('Platinum', 'pokemon-platinum', 'PL', 'pokemon', 'expansion', '2009-02-11', 2009, 133, 'Based on Platinum version, SP Pokemon.', true),
('Rising Rivals', 'pokemon-rising-rivals', 'RR', 'pokemon', 'expansion', '2009-05-20', 2009, 120, 'Gym Leader SP cards.', false),
('Supreme Victors', 'pokemon-supreme-victors', 'SV', 'pokemon', 'expansion', '2009-08-19', 2009, 153, 'Champion and elite focus.', false),
('Arceus', 'pokemon-arceus', 'AR', 'pokemon', 'expansion', '2009-11-04', 2009, 111, 'Features Arceus in all types.', false),
('HeartGold SoulSilver', 'pokemon-heartgold-soulsilver', 'HS', 'pokemon', 'expansion', '2010-02-10', 2010, 124, 'Based on HGSS remakes.', true),
('Unleashed', 'pokemon-unleashed', 'UL', 'pokemon', 'expansion', '2010-05-12', 2010, 96, 'Unleashed power theme.', false),
('Undaunted', 'pokemon-undaunted', 'UD', 'pokemon', 'expansion', '2010-08-18', 2010, 91, 'Brave Pokemon focus.', false),
('Triumphant', 'pokemon-triumphant', 'TM', 'pokemon', 'expansion', '2010-11-03', 2010, 103, 'Victory and triumph theme.', false),
('Call of Legends', 'pokemon-call-of-legends', 'CL', 'pokemon', 'expansion', '2011-02-09', 2011, 106, 'Final HGSS set, Shiny legendaries.', true),

-- ============================================================================
-- BLACK & WHITE ERA (2011-2013)
-- ============================================================================
('Black & White', 'pokemon-black-white', 'BW', 'pokemon', 'expansion', '2011-04-25', 2011, 115, 'Generation 5 debut with full art cards.', true),
('Emerging Powers', 'pokemon-emerging-powers', 'EP', 'pokemon', 'expansion', '2011-08-31', 2011, 98, 'Emerging Pokemon and trainers.', false),
('Noble Victories', 'pokemon-noble-victories', 'NV', 'pokemon', 'expansion', '2011-11-16', 2011, 102, 'Victory and noble Pokemon.', false),
('Next Destinies', 'pokemon-next-destinies', 'ND', 'pokemon', 'expansion', '2012-02-08', 2012, 103, 'First EX cards in BW era.', false),
('Dark Explorers', 'pokemon-dark-explorers', 'DE', 'pokemon', 'expansion', '2012-05-09', 2012, 111, 'Dark type exploration.', false),
('Dragons Exalted', 'pokemon-dragons-exalted', 'DRX', 'pokemon', 'expansion', '2012-08-15', 2012, 128, 'Dragon type celebration.', false),
('Boundaries Crossed', 'pokemon-boundaries-crossed', 'BC', 'pokemon', 'expansion', '2012-11-07', 2012, 153, 'White Kyurem and Black Kyurem debut.', false),
('Plasma Storm', 'pokemon-plasma-storm', 'PS', 'pokemon', 'expansion', '2013-02-06', 2013, 138, 'Team Plasma theme.', false),
('Plasma Freeze', 'pokemon-plasma-freeze', 'PF', 'pokemon', 'expansion', '2013-05-08', 2013, 122, 'Ice and Plasma combo.', false),
('Plasma Blast', 'pokemon-plasma-blast', 'PB', 'pokemon', 'expansion', '2013-08-14', 2013, 105, 'Final Team Plasma set.', false),
('Legendary Treasures', 'pokemon-legendary-treasures', 'LT', 'pokemon', 'expansion', '2013-11-06', 2013, 140, 'Final BW set, radiant collection.', true),

-- ============================================================================
-- XY ERA (2014-2016)
-- ============================================================================
('XY', 'pokemon-xy', 'XY', 'pokemon', 'expansion', '2014-02-05', 2014, 146, 'Generation 6 debut, Mega Evolution.', true),
('Flashfire', 'pokemon-flashfire', 'FF', 'pokemon', 'expansion', '2014-05-07', 2014, 109, 'Fire type and Mega Charizard.', true),
('Furious Fists', 'pokemon-furious-fists', 'FFI', 'pokemon', 'expansion', '2014-08-13', 2014, 113, 'Fighting type focus.', false),
('Phantom Forces', 'pokemon-phantom-forces', 'PHF', 'pokemon', 'expansion', '2014-11-05', 2014, 122, 'Ghost and phantom theme.', false),
('Primal Clash', 'pokemon-primal-clash', 'PRC', 'pokemon', 'expansion', '2015-02-04', 2015, 164, 'Primal Groudon and Kyogre.', false),
('Roaring Skies', 'pokemon-roaring-skies', 'ROS', 'pokemon', 'expansion', '2015-05-06', 2015, 110, 'Flying types and Mega Rayquaza.', true),
('Ancient Origins', 'pokemon-ancient-origins', 'AOR', 'pokemon', 'expansion', '2015-08-12', 2015, 100, 'Ancient trait Pokemon.', false),
('BREAKthrough', 'pokemon-breakthrough', 'BKT', 'pokemon', 'expansion', '2015-11-04', 2015, 164, 'BREAK evolution mechanic.', false),
('BREAKpoint', 'pokemon-breakpoint', 'BKP', 'pokemon', 'expansion', '2016-02-03', 2016, 123, 'More BREAK Pokemon.', false),
('Generations', 'pokemon-generations', 'GEN', 'pokemon', 'expansion', '2016-02-22', 2016, 115, '20th anniversary celebration set.', true),
('Fates Collide', 'pokemon-fates-collide', 'FCO', 'pokemon', 'expansion', '2016-05-02', 2016, 125, 'Zygarde and fate theme.', false),
('Steam Siege', 'pokemon-steam-siege', 'STS', 'pokemon', 'expansion', '2016-08-03', 2016, 116, 'Dual type and steam era.', false),
('Evolutions', 'pokemon-evolutions', 'EVO', 'pokemon', 'expansion', '2016-11-02', 2016, 113, '20th anniversary Base Set remake.', true),

-- ============================================================================
-- SUN & MOON ERA (2017-2019)
-- ============================================================================
('Sun & Moon', 'pokemon-sun-moon', 'SM', 'pokemon', 'expansion', '2017-02-03', 2017, 163, 'Generation 7 with GX cards.', true),
('Guardians Rising', 'pokemon-guardians-rising', 'GRI', 'pokemon', 'expansion', '2017-05-05', 2017, 169, 'Island guardians theme.', true),
('Burning Shadows', 'pokemon-burning-shadows', 'BUS', 'pokemon', 'expansion', '2017-08-04', 2017, 169, 'Fire and Necrozma focus.', false),
('Shining Legends', 'pokemon-shining-legends', 'SHL', 'pokemon', 'expansion', '2017-10-06', 2017, 78, 'Mini set with Shining Pokemon.', true),
('Crimson Invasion', 'pokemon-crimson-invasion', 'CIN', 'pokemon', 'expansion', '2017-11-03', 2017, 124, 'Ultra Beast invasion.', false),
('Ultra Prism', 'pokemon-ultra-prism', 'UPR', 'pokemon', 'expansion', '2018-02-02', 2018, 173, 'Prism Star cards debut.', false),
('Forbidden Light', 'pokemon-forbidden-light', 'FLI', 'pokemon', 'expansion', '2018-05-04', 2018, 146, 'Ultra Necrozma spotlight.', false),
('Celestial Storm', 'pokemon-celestial-storm', 'CES', 'pokemon', 'expansion', '2018-08-03', 2018, 187, 'Rayquaza GX focus.', false),
('Dragon Majesty', 'pokemon-dragon-majesty', 'DRM', 'pokemon', 'expansion', '2018-09-07', 2018, 78, 'Dragon type mini set.', false),
('Lost Thunder', 'pokemon-lost-thunder', 'LOT', 'pokemon', 'expansion', '2018-11-02', 2018, 236, 'Largest Sun & Moon set.', false),
('Team Up', 'pokemon-team-up', 'TEU', 'pokemon', 'expansion', '2019-02-01', 2019, 196, 'Tag Team GX cards.', true),
('Detective Pikachu', 'pokemon-detective-pikachu', 'DET', 'pokemon', 'expansion', '2019-04-05', 2019, 18, 'Movie promotional set.', false),
('Unbroken Bonds', 'pokemon-unbroken-bonds', 'UNB', 'pokemon', 'expansion', '2019-05-03', 2019, 234, 'More Tag Team cards.', false),
('Unified Minds', 'pokemon-unified-minds', 'UNM', 'pokemon', 'expansion', '2019-08-02', 2019, 258, 'Mewtwo Tag Team featured.', false),
('Hidden Fates', 'pokemon-hidden-fates', 'HIF', 'pokemon', 'expansion', '2019-08-23', 2019, 163, 'Shiny Vault subset, highly collectible.', true),
('Cosmic Eclipse', 'pokemon-cosmic-eclipse', 'CEC', 'pokemon', 'expansion', '2019-11-01', 2019, 272, 'Final Sun & Moon expansion.', false),

-- ============================================================================
-- SWORD & SHIELD ERA (2020-2023)
-- ============================================================================
('Sword & Shield', 'pokemon-sword-shield', 'SSH', 'pokemon', 'expansion', '2020-02-07', 2020, 216, 'Generation 8 with V and VMAX cards.', true),
('Rebel Clash', 'pokemon-rebel-clash', 'RCL', 'pokemon', 'expansion', '2020-05-01', 2020, 209, 'Toxtricity VMAX featured.', false),
('Darkness Ablaze', 'pokemon-darkness-ablaze', 'DAA', 'pokemon', 'expansion', '2020-08-14', 2020, 201, 'Charizard VMAX chase card.', true),
('Champions Path', 'pokemon-champions-path', 'CPA', 'pokemon', 'expansion', '2020-09-25', 2020, 80, 'Elite trainer box exclusive set.', true),
('Vivid Voltage', 'pokemon-vivid-voltage', 'VIV', 'pokemon', 'expansion', '2020-11-13', 2020, 203, 'Amazing Rare cards debut.', false),
('Shining Fates', 'pokemon-shining-fates', 'SHF', 'pokemon', 'expansion', '2021-02-19', 2021, 195, 'Shiny Vault 2.0, Charizard VMAX Shiny.', true),
('Battle Styles', 'pokemon-battle-styles', 'BST', 'pokemon', 'expansion', '2021-03-19', 2021, 183, 'Single Strike and Rapid Strike.', false),
('Chilling Reign', 'pokemon-chilling-reign', 'CRE', 'pokemon', 'expansion', '2021-06-18', 2021, 233, 'Ice Rider and Shadow Rider Calyrex.', false),
('Evolving Skies', 'pokemon-evolving-skies', 'EVS', 'pokemon', 'expansion', '2021-08-27', 2021, 237, 'Eeveelution VMAX set.', true),
('Celebrations', 'pokemon-celebrations', 'CEL', 'pokemon', 'expansion', '2021-10-08', 2021, 50, '25th anniversary with classic reprints.', true),
('Fusion Strike', 'pokemon-fusion-strike', 'FST', 'pokemon', 'expansion', '2021-11-12', 2021, 284, 'Largest English set ever.', false),
('Brilliant Stars', 'pokemon-brilliant-stars', 'BRS', 'pokemon', 'expansion', '2022-02-25', 2022, 186, 'VSTAR mechanic debuts.', true),
('Astral Radiance', 'pokemon-astral-radiance', 'ASR', 'pokemon', 'expansion', '2022-05-27', 2022, 216, 'Radiant Pokemon debut.', false),
('Pokemon GO', 'pokemon-go', 'PGO', 'pokemon', 'expansion', '2022-07-01', 2022, 88, 'Pokemon GO crossover set.', false),
('Lost Origin', 'pokemon-lost-origin', 'LOR', 'pokemon', 'expansion', '2022-09-09', 2022, 247, 'Lost Zone returns.', false),
('Silver Tempest', 'pokemon-silver-tempest', 'SIT', 'pokemon', 'expansion', '2022-11-11', 2022, 215, 'Lugia VSTAR featured.', false),
('Crown Zenith', 'pokemon-crown-zenith', 'CRZ', 'pokemon', 'expansion', '2023-01-20', 2023, 230, 'Final Sword & Shield set.', true),

-- ============================================================================
-- SCARLET & VIOLET ERA (2023-PRESENT)
-- ============================================================================
('Scarlet & Violet', 'pokemon-scarlet-violet', 'SVI', 'pokemon', 'expansion', '2023-03-31', 2023, 258, 'Generation 9 with ex cards.', true),
('Paldea Evolved', 'pokemon-paldea-evolved', 'PAL', 'pokemon', 'expansion', '2023-06-09', 2023, 279, 'Paldean Pokemon focus.', false),
('Obsidian Flames', 'pokemon-obsidian-flames', 'OBF', 'pokemon', 'expansion', '2023-08-11', 2023, 230, 'Charizard ex chase card.', true),
('Pokemon 151', 'pokemon-151', 'MEW', 'pokemon', 'expansion', '2023-09-22', 2023, 207, 'Original 151 celebration.', true),
('Paradox Rift', 'pokemon-paradox-rift', 'PAR', 'pokemon', 'expansion', '2023-11-03', 2023, 266, 'Past and Future paradox Pokemon.', false),
('Paldean Fates', 'pokemon-paldean-fates', 'PAF', 'pokemon', 'expansion', '2024-01-26', 2024, 245, 'Shiny Paldean Pokemon.', true),
('Temporal Forces', 'pokemon-temporal-forces', 'TEF', 'pokemon', 'expansion', '2024-03-22', 2024, 218, 'ACE SPEC cards return.', false),
('Twilight Masquerade', 'pokemon-twilight-masquerade', 'TWM', 'pokemon', 'expansion', '2024-05-24', 2024, 226, 'Festival themed Pokemon.', false),
('Shrouded Fable', 'pokemon-shrouded-fable', 'SFA', 'pokemon', 'expansion', '2024-08-02', 2024, 99, 'Mini set with special art rares.', false),
('Stellar Crown', 'pokemon-stellar-crown', 'SCR', 'pokemon', 'expansion', '2024-09-13', 2024, 175, 'Tera Pokemon featured.', false),
('Surging Sparks', 'pokemon-surging-sparks', 'SSP', 'pokemon', 'expansion', '2024-11-08', 2024, 252, 'Electric theme expansion.', false),
('Prismatic Evolutions', 'pokemon-prismatic-evolutions', 'PRE', 'pokemon', 'expansion', '2025-01-17', 2025, 186, 'Eeveelution celebration set.', true)

ON CONFLICT (slug) DO UPDATE SET
  total_cards = EXCLUDED.total_cards,
  description = EXCLUDED.description,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();

-- Update counts
UPDATE card_sets SET 
  updated_at = NOW()
WHERE category = 'pokemon';
