export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// ACADEMY & KNOWLEDGE API - Educational Card Collecting Content
// CravCards - CR AudioViz AI, LLC
// Created: December 2024
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const COURSES = [
  {
    id: 'basics-101',
    title: 'Card Collecting 101',
    description: 'Learn the fundamentals of trading card collecting',
    level: 'beginner',
    duration: '30 minutes',
    xpReward: 100,
    icon: '📚',
    modules: [
      { id: 1, title: 'Introduction to Trading Cards', content: 'Trading cards have been a beloved hobby since the 1860s. This module covers the basic concepts of card collecting.', quiz: true },
      { id: 2, title: 'Understanding Card Conditions', content: 'Learn the difference between Mint, Near Mint, Excellent, and other condition grades.', quiz: true },
      { id: 3, title: 'Your First Collection', content: 'How to start and organize your first card collection.', quiz: true },
      { id: 4, title: 'Storage & Protection', content: 'Proper storage methods including sleeves, top loaders, and binders.', quiz: true },
    ],
  },
  {
    id: 'grading-mastery',
    title: 'Card Grading Mastery',
    description: 'Master the art of evaluating and grading trading cards',
    level: 'intermediate',
    duration: '45 minutes',
    xpReward: 200,
    icon: '🔍',
    modules: [
      { id: 1, title: 'PSA Grading Scale', content: 'Understand PSA grades from 1 (Poor) to 10 (Gem Mint).', quiz: true },
      { id: 2, title: 'BGS Subgrades Explained', content: 'Learn about Centering, Corners, Edges, and Surface subgrades.', quiz: true },
      { id: 3, title: 'When to Grade', content: 'Cost-benefit analysis of professional grading services.', quiz: true },
      { id: 4, title: 'Submission Process', content: 'Step-by-step guide to submitting cards for grading.', quiz: true },
      { id: 5, title: 'Population Reports', content: 'How to use population data for investment decisions.', quiz: true },
    ],
  },
  {
    id: 'pokemon-expert',
    title: 'Pokemon TCG Expert',
    description: 'Become an expert in Pokemon card collecting',
    level: 'intermediate',
    duration: '60 minutes',
    xpReward: 300,
    icon: '⚡',
    modules: [
      { id: 1, title: 'History of Pokemon TCG', content: 'From 1996 Japan to global phenomenon.', quiz: true },
      { id: 2, title: 'Set Identification', content: 'Learn to identify sets, editions, and print runs.', quiz: true },
      { id: 3, title: 'Valuable Variants', content: '1st Edition, Shadowless, and other premium variants.', quiz: true },
      { id: 4, title: 'Modern Era Collecting', content: 'Scarlet & Violet era and current releases.', quiz: true },
      { id: 5, title: 'Investment Strategies', content: 'Long-term holds vs short-term flips.', quiz: true },
    ],
  },
  {
    id: 'mtg-fundamentals',
    title: 'Magic: The Gathering Fundamentals',
    description: 'Comprehensive guide to MTG collecting',
    level: 'intermediate',
    duration: '50 minutes',
    xpReward: 250,
    icon: '🌀',
    modules: [
      { id: 1, title: 'MTG History', content: 'Richard Garfield and the birth of TCGs.', quiz: true },
      { id: 2, title: 'The Reserve List', content: 'Understanding cards that will never be reprinted.', quiz: true },
      { id: 3, title: 'Identifying Editions', content: 'Alpha, Beta, Unlimited, and beyond.', quiz: true },
      { id: 4, title: 'Commander Format Cards', content: 'High-value cards for the most popular format.', quiz: true },
    ],
  },
  {
    id: 'sports-cards-pro',
    title: 'Sports Cards Professional',
    description: 'Advanced sports card collecting strategies',
    level: 'advanced',
    duration: '75 minutes',
    xpReward: 400,
    icon: '🏆',
    modules: [
      { id: 1, title: '150 Years of Sports Cards', content: 'From tobacco cards to modern era.', quiz: true },
      { id: 2, title: 'Rookie Card Identification', content: 'What makes a true rookie card?', quiz: true },
      { id: 3, title: 'Parallels & Inserts', content: 'Understanding modern card variations.', quiz: true },
      { id: 4, title: 'Memorabilia & Autographs', content: 'Game-used and certified auto cards.', quiz: true },
      { id: 5, title: 'Market Analysis', content: 'Reading the sports card market.', quiz: true },
      { id: 6, title: 'Investment Timing', content: 'When to buy and sell sports cards.', quiz: true },
    ],
  },
  {
    id: 'yugioh-collector',
    title: 'Yu-Gi-Oh! Collector\'s Guide',
    description: 'Master Yu-Gi-Oh! card collecting',
    level: 'intermediate',
    duration: '45 minutes',
    xpReward: 225,
    icon: '🐉',
    modules: [
      { id: 1, title: 'Yu-Gi-Oh! Origins', content: 'From manga to global card game.', quiz: true },
      { id: 2, title: 'Rarity System', content: 'Common to Secret Rare and beyond.', quiz: true },
      { id: 3, title: 'Valuable Vintage', content: 'LOB, PSV, and early set treasures.', quiz: true },
      { id: 4, title: 'Ghost & Starlight Rares', content: 'The most premium modern rarities.', quiz: true },
    ],
  },
  {
    id: 'authentication',
    title: 'Card Authentication',
    description: 'Learn to identify authentic vs counterfeit cards',
    level: 'advanced',
    duration: '40 minutes',
    xpReward: 350,
    icon: '🛡️',
    modules: [
      { id: 1, title: 'Common Counterfeit Signs', content: 'Red flags that indicate fake cards.', quiz: true },
      { id: 2, title: 'Light Test', content: 'Using light to verify authenticity.', quiz: true },
      { id: 3, title: 'Surface Analysis', content: 'Texture, gloss, and print patterns.', quiz: true },
      { id: 4, title: 'Rosette Patterns', content: 'Understanding print dot patterns.', quiz: true },
    ],
  },
  {
    id: 'market-analysis',
    title: 'Market Analysis & Investment',
    description: 'Financial strategies for card investing',
    level: 'advanced',
    duration: '90 minutes',
    xpReward: 500,
    icon: '📈',
    modules: [
      { id: 1, title: 'Market Fundamentals', content: 'Supply, demand, and price discovery.', quiz: true },
      { id: 2, title: 'Sales Data Analysis', content: 'Using eBay sold data and price guides.', quiz: true },
      { id: 3, title: 'Timing the Market', content: 'Seasonal trends and event timing.', quiz: true },
      { id: 4, title: 'Portfolio Diversification', content: 'Balancing risk across categories.', quiz: true },
      { id: 5, title: 'Exit Strategies', content: 'When and how to sell for profit.', quiz: true },
      { id: 6, title: 'Tax Considerations', content: 'Understanding collectible tax treatment.', quiz: true },
    ],
  },
];

const GLOSSARY = [
  { term: 'PSA', definition: 'Professional Sports Authenticator - largest card grading company', category: 'grading' },
  { term: 'BGS', definition: 'Beckett Grading Services - known for subgrade system', category: 'grading' },
  { term: 'Gem Mint', definition: 'Highest condition grade (PSA 10, BGS 9.5+)', category: 'grading' },
  { term: 'Raw', definition: 'A card that has not been professionally graded', category: 'grading' },
  { term: 'Slab', definition: 'The plastic case a graded card is sealed in', category: 'grading' },
  { term: 'Centering', definition: 'How well the image is centered within card borders', category: 'grading' },
  { term: 'RC', definition: 'Rookie Card - a player\'s first officially licensed card', category: 'general' },
  { term: 'SP', definition: 'Short Print - produced in smaller quantities', category: 'general' },
  { term: 'SSP', definition: 'Super Short Print - extremely limited production', category: 'general' },
  { term: 'Parallel', definition: 'Alternate version of a base card with different finish', category: 'general' },
  { term: 'Insert', definition: 'Special card inserted into packs beyond base set', category: 'general' },
  { term: 'Hit', definition: 'Valuable pull from a pack (auto, relic, numbered)', category: 'general' },
  { term: 'Hobby Box', definition: 'Premium box with guaranteed hits', category: 'general' },
  { term: 'Retail Box', definition: 'Store-sold box without guaranteed hits', category: 'general' },
  { term: 'Case Hit', definition: 'Rare card found approximately once per case', category: 'general' },
  { term: '1/1', definition: 'One-of-one card, only one copy exists', category: 'general' },
  { term: 'Redemption', definition: 'Card exchangeable for unreleased item', category: 'general' },
  { term: 'Wax', definition: 'Vintage unopened packs (named for wax paper wrapping)', category: 'vintage' },
  { term: 'Shadowless', definition: 'Early Pokemon print without shadow on image box', category: 'pokemon' },
  { term: '1st Edition', definition: 'First print run, often most valuable', category: 'general' },
  { term: 'Holo', definition: 'Holographic foil card', category: 'general' },
  { term: 'Refractor', definition: 'Shiny parallel with light-refracting surface', category: 'general' },
  { term: 'Auto', definition: 'Autographed card', category: 'general' },
  { term: 'Relic', definition: 'Card containing piece of game-used material', category: 'general' },
  { term: 'Patch', definition: 'Relic card with jersey patch piece', category: 'general' },
  { term: 'Reserve List', definition: 'MTG cards Wizards promised never to reprint', category: 'mtg' },
  { term: 'Power Nine', definition: 'Nine most powerful vintage MTG cards', category: 'mtg' },
  { term: 'LOB', definition: 'Legend of Blue Eyes White Dragon (first Yu-Gi-Oh set)', category: 'yugioh' },
  { term: 'Enchanted', definition: 'Highest rarity in Disney Lorcana', category: 'lorcana' },
  { term: 'Pop', definition: 'Population - number of cards graded at specific level', category: 'grading' },
];

const QUICK_TIPS = [
  { category: 'storage', tip: 'Always use penny sleeves before top loaders to prevent scratches' },
  { category: 'storage', tip: 'Store cards vertically like books, not stacked flat' },
  { category: 'storage', tip: 'Keep cards away from direct sunlight to prevent fading' },
  { category: 'storage', tip: 'Maintain consistent temperature and humidity (65-70°F, 40-50% humidity)' },
  { category: 'buying', tip: 'Always check completed sales, not just listings, for true values' },
  { category: 'buying', tip: 'Factor in fees when calculating profits (eBay ~13%, PayPal ~3%)' },
  { category: 'buying', tip: 'Buy raw from trusted sellers if you can grade accurately yourself' },
  { category: 'selling', tip: 'Take clear, well-lit photos showing all corners and edges' },
  { category: 'selling', tip: 'List during high-traffic times (Sunday evenings typically best)' },
  { category: 'grading', tip: 'Research population reports before submitting - low pop increases value' },
  { category: 'grading', tip: 'Calculate break-even: grading costs vs expected value increase' },
  { category: 'grading', tip: 'Clean cards gently with microfiber before grading submission' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('course');
  const section = searchParams.get('section');

  // Get specific course
  if (courseId) {
    const course = COURSES.find(c => c.id === courseId);
    if (course) {
      return NextResponse.json({ success: true, course });
    }
    return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
  }

  // Get glossary
  if (section === 'glossary') {
    return NextResponse.json({
      success: true,
      glossary: GLOSSARY,
      categories: [...new Set(GLOSSARY.map(g => g.category))],
    });
  }

  // Get tips
  if (section === 'tips') {
    return NextResponse.json({
      success: true,
      tips: QUICK_TIPS,
      categories: [...new Set(QUICK_TIPS.map(t => t.category))],
    });
  }

  // Return all academy content
  return NextResponse.json({
    success: true,
    courses: COURSES.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      level: c.level,
      duration: c.duration,
      xpReward: c.xpReward,
      icon: c.icon,
      moduleCount: c.modules.length,
    })),
    totalCourses: COURSES.length,
    totalXP: COURSES.reduce((sum, c) => sum + c.xpReward, 0),
    glossaryTerms: GLOSSARY.length,
    tips: QUICK_TIPS.length,
    levels: ['beginner', 'intermediate', 'advanced'],
  });
}
