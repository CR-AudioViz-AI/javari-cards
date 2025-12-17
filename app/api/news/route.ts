// ============================================================================
// CARD NEWS & MARKET UPDATES API
// Real-time news aggregation from free sources
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// Simulated news data (in production would pull from RSS/APIs)
const CARD_NEWS = [
  {
    id: 'news-1',
    title: 'New Pokémon TCG Set Announced: Prismatic Evolutions',
    source: 'CravCards News',
    category: 'pokemon',
    date: '2024-12-15',
    summary: 'The Pokémon Company announces the next expansion featuring all-new Terastal ex cards.',
    image: '/news/pokemon-new-set.jpg',
    tags: ['pokemon', 'new-release', 'announcement'],
  },
  {
    id: 'news-2',
    title: 'PSA Announces New Grading Tiers for 2025',
    source: 'CravCards News',
    category: 'grading',
    date: '2024-12-14',
    summary: 'PSA introduces faster turnaround options and new pricing structure for the new year.',
    image: '/news/psa-2025.jpg',
    tags: ['grading', 'psa', 'news'],
  },
  {
    id: 'news-3',
    title: 'Magic: The Gathering Releases Foundation Set',
    source: 'CravCards News',
    category: 'mtg',
    date: '2024-12-13',
    summary: 'Wizards of the Coast launches new evergreen set designed for new players.',
    image: '/news/mtg-foundations.jpg',
    tags: ['mtg', 'new-release'],
  },
  {
    id: 'news-4',
    title: 'Record-Breaking Sports Card Sale: $15M for Wagner',
    source: 'CravCards News',
    category: 'sports',
    date: '2024-12-12',
    summary: 'A T206 Honus Wagner in SGC 6 condition sets new auction record.',
    image: '/news/wagner-sale.jpg',
    tags: ['sports', 'auction', 'record'],
  },
  {
    id: 'news-5',
    title: 'Disney Lorcana Fourth Set: Shimmering Skies Released',
    source: 'CravCards News',
    category: 'lorcana',
    date: '2024-12-11',
    summary: 'Ravensburger releases the fourth Lorcana expansion with new game mechanics.',
    image: '/news/lorcana-set4.jpg',
    tags: ['lorcana', 'new-release'],
  },
  {
    id: 'news-6',
    title: 'Yu-Gi-Oh! Banlist Update January 2025',
    source: 'CravCards News',
    category: 'yugioh',
    date: '2024-12-10',
    summary: 'Konami announces significant changes to the Forbidden & Limited list.',
    image: '/news/yugioh-banlist.jpg',
    tags: ['yugioh', 'competitive', 'banlist'],
  },
  {
    id: 'news-7',
    title: 'Market Report: Vintage Sports Cards Up 15% in Q4',
    source: 'CravCards News',
    category: 'market',
    date: '2024-12-09',
    summary: 'Pre-war baseball cards continue to outperform other segments.',
    image: '/news/market-report.jpg',
    tags: ['market', 'investing', 'vintage'],
  },
  {
    id: 'news-8',
    title: 'Fanatics Takes Over MLB Card Production',
    source: 'CravCards News',
    category: 'sports',
    date: '2024-12-08',
    summary: 'The sports memorabilia giant officially begins producing MLB licensed cards.',
    image: '/news/fanatics-mlb.jpg',
    tags: ['sports', 'industry', 'mlb'],
  },
];

// Market Insights
const MARKET_INSIGHTS = {
  weekly_movers: {
    gainers: [
      { name: 'Charizard ex (151)', change: '+12%', price: '$45' },
      { name: 'LeBron James RC Prizm', change: '+8%', price: '$2,500' },
      { name: 'Blue-Eyes Alternative', change: '+15%', price: '$120' },
    ],
    losers: [
      { name: 'Pikachu VMAX', change: '-5%', price: '$35' },
      { name: 'Mike Trout Topps RC', change: '-3%', price: '$180' },
      { name: 'Liliana of the Veil', change: '-7%', price: '$45' },
    ],
  },
  market_summary: {
    pokemon: { trend: 'up', change: '+5.2%', volume: 'high' },
    mtg: { trend: 'stable', change: '+0.8%', volume: 'medium' },
    sports: { trend: 'up', change: '+3.1%', volume: 'high' },
    yugioh: { trend: 'up', change: '+4.5%', volume: 'medium' },
    lorcana: { trend: 'down', change: '-2.1%', volume: 'high' },
  },
  hot_topics: [
    'Prizm Basketball release incoming',
    'Pokémon 151 prices stabilizing',
    'Vintage baseball card boom continues',
    'Modern Yu-Gi-Oh! tournament results affecting prices',
  ],
};

// Release Calendar
const RELEASE_CALENDAR = [
  { date: '2025-01-10', product: 'Pokémon TCG: Prismatic Evolutions', category: 'pokemon' },
  { date: '2025-01-17', product: 'Magic: The Gathering - Aetherdrift', category: 'mtg' },
  { date: '2025-01-24', product: 'Yu-Gi-Oh! Rage of the Abyss', category: 'yugioh' },
  { date: '2025-02-07', product: 'Topps Series 1 Baseball', category: 'sports' },
  { date: '2025-02-14', product: 'Disney Lorcana: Azurite Sea', category: 'lorcana' },
  { date: '2025-02-21', product: 'Panini Prizm Basketball', category: 'sports' },
  { date: '2025-03-07', product: 'Magic: The Gathering - Tarkir Dragonstorm', category: 'mtg' },
  { date: '2025-03-14', product: 'Pokémon TCG: Journey Together', category: 'pokemon' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  const category = searchParams.get('category') || 'all';
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);

  if (section === 'news') {
    let news = [...CARD_NEWS];
    if (category !== 'all') {
      news = news.filter(n => n.category === category);
    }
    return NextResponse.json({
      success: true,
      data: news.slice(0, limit),
      total: news.length,
    });
  }

  if (section === 'market') {
    return NextResponse.json({
      success: true,
      data: MARKET_INSIGHTS,
      lastUpdated: new Date().toISOString(),
    });
  }

  if (section === 'calendar') {
    let events = [...RELEASE_CALENDAR];
    if (category !== 'all') {
      events = events.filter(e => e.category === category);
    }
    return NextResponse.json({
      success: true,
      data: events,
      total: events.length,
    });
  }

  // Return everything
  return NextResponse.json({
    success: true,
    data: {
      latestNews: CARD_NEWS.slice(0, 5),
      marketSummary: MARKET_INSIGHTS.market_summary,
      upcomingReleases: RELEASE_CALENDAR.slice(0, 5),
      hotTopics: MARKET_INSIGHTS.hot_topics,
    },
    sections: ['news', 'market', 'calendar'],
  });
}
