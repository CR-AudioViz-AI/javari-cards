// ============================================================================
// CARD VALUES & PRICE HISTORY API
// Track card values, price history, and portfolio analytics
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// Sample price history data (would be from database in production)
const PRICE_HISTORY = {
  'charizard-base-1st': {
    name: '1st Edition Base Set Charizard',
    category: 'pokemon',
    grade: 'PSA 10',
    currentPrice: 420000,
    history: [
      { date: '2024-01', price: 380000 },
      { date: '2024-03', price: 350000 },
      { date: '2024-06', price: 390000 },
      { date: '2024-09', price: 400000 },
      { date: '2024-12', price: 420000 },
    ],
    allTimeHigh: { price: 420000, date: '2021-10' },
    allTimeLow: { price: 50000, date: '2016-01' },
    change30d: '+5.2%',
    change1y: '+10.5%',
  },
  'jordan-fleer-86': {
    name: '1986 Fleer Michael Jordan RC',
    category: 'sports',
    grade: 'PSA 10',
    currentPrice: 738000,
    history: [
      { date: '2024-01', price: 650000 },
      { date: '2024-03', price: 680000 },
      { date: '2024-06', price: 700000 },
      { date: '2024-09', price: 720000 },
      { date: '2024-12', price: 738000 },
    ],
    allTimeHigh: { price: 738000, date: '2024-12' },
    allTimeLow: { price: 25000, date: '2015-01' },
    change30d: '+2.5%',
    change1y: '+13.5%',
  },
  'black-lotus-alpha': {
    name: 'Alpha Black Lotus',
    category: 'mtg',
    grade: 'BGS 9.5',
    currentPrice: 350000,
    history: [
      { date: '2024-01', price: 320000 },
      { date: '2024-03', price: 330000 },
      { date: '2024-06', price: 340000 },
      { date: '2024-09', price: 345000 },
      { date: '2024-12', price: 350000 },
    ],
    allTimeHigh: { price: 540000, date: '2021-02' },
    allTimeLow: { price: 15000, date: '2010-01' },
    change30d: '+1.5%',
    change1y: '+9.4%',
  },
};

// Value multipliers by grade
const GRADE_MULTIPLIERS = {
  PSA: {
    10: 5.0, 9: 2.5, 8: 1.5, 7: 1.2, 6: 0.9, 5: 0.6, 4: 0.4, 3: 0.25, 2: 0.15, 1: 0.1
  },
  BGS: {
    10: 10.0, 9.5: 4.0, 9: 2.0, 8.5: 1.5, 8: 1.3, 7.5: 1.1, 7: 1.0
  },
  CGC: {
    10: 6.0, 9.5: 3.5, 9: 2.0, 8.5: 1.4, 8: 1.2
  },
  SGC: {
    10: 4.5, 9.5: 2.5, 9: 1.8, 8.5: 1.3, 8: 1.1
  },
};

// Price estimate ranges by category
const CATEGORY_BENCHMARKS = {
  pokemon: {
    vintage_holo: { low: 50, mid: 200, high: 1000 },
    modern_chase: { low: 20, mid: 100, high: 500 },
    ultra_rare: { low: 5, mid: 25, high: 100 },
    common_rare: { low: 0.10, mid: 1, high: 5 },
  },
  mtg: {
    reserved_list: { low: 50, mid: 500, high: 10000 },
    modern_staple: { low: 5, mid: 30, high: 100 },
    standard: { low: 0.25, mid: 3, high: 20 },
    common: { low: 0.05, mid: 0.25, high: 1 },
  },
  yugioh: {
    meta_staple: { low: 10, mid: 50, high: 200 },
    collector_rare: { low: 20, mid: 100, high: 1000 },
    tournament: { low: 5, mid: 25, high: 100 },
    common: { low: 0.10, mid: 0.50, high: 2 },
  },
  sports: {
    vintage_star: { low: 100, mid: 1000, high: 50000 },
    modern_rookie: { low: 5, mid: 50, high: 500 },
    auto_relic: { low: 10, mid: 75, high: 300 },
    base: { low: 0.10, mid: 0.50, high: 2 },
  },
  lorcana: {
    enchanted: { low: 50, mid: 150, high: 500 },
    legendary: { low: 5, mid: 20, high: 75 },
    rare: { low: 1, mid: 5, high: 15 },
    common: { low: 0.10, mid: 0.25, high: 1 },
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  const cardId = searchParams.get('card');
  const category = searchParams.get('category');

  // Get specific card history
  if (section === 'history' && cardId) {
    const card = PRICE_HISTORY[cardId as keyof typeof PRICE_HISTORY];
    if (card) {
      return NextResponse.json({ success: true, data: card });
    }
    return NextResponse.json({ success: false, error: 'Card not found' }, { status: 404 });
  }

  // Get grade multipliers
  if (section === 'multipliers') {
    return NextResponse.json({
      success: true,
      data: GRADE_MULTIPLIERS,
      description: 'Multiply raw card value by grade multiplier for estimated graded value',
    });
  }

  // Get category benchmarks
  if (section === 'benchmarks') {
    if (category && CATEGORY_BENCHMARKS[category as keyof typeof CATEGORY_BENCHMARKS]) {
      return NextResponse.json({
        success: true,
        data: CATEGORY_BENCHMARKS[category as keyof typeof CATEGORY_BENCHMARKS],
      });
    }
    return NextResponse.json({ success: true, data: CATEGORY_BENCHMARKS });
  }

  // Get all tracked cards
  if (section === 'tracked') {
    return NextResponse.json({
      success: true,
      data: Object.entries(PRICE_HISTORY).map(([id, card]) => ({
        id,
        name: card.name,
        category: card.category,
        currentPrice: card.currentPrice,
        change30d: card.change30d,
      })),
    });
  }

  // Overview
  return NextResponse.json({
    success: true,
    data: {
      trackedCards: Object.keys(PRICE_HISTORY).length,
      categories: Object.keys(CATEGORY_BENCHMARKS),
      gradingCompanies: Object.keys(GRADE_MULTIPLIERS),
    },
    sections: ['history', 'multipliers', 'benchmarks', 'tracked'],
    usage: {
      'Get card history': '/api/values?section=history&card=charizard-base-1st',
      'Get multipliers': '/api/values?section=multipliers',
      'Get benchmarks': '/api/values?section=benchmarks&category=pokemon',
      'Get tracked cards': '/api/values?section=tracked',
    },
  });
}
