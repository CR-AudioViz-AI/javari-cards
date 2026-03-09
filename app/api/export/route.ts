export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// COLLECTION EXPORT API
// Export collection to CSV, PDF, or JSON formats
// CravCards - CR AudioViz AI, LLC
// Created: December 17, 2025
// Fixed: December 18, 2025 - Graceful handling without Supabase
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

interface ExportCard {
  card_id: string;
  card_name: string;
  category: string;
  set_name: string;
  card_number: string;
  condition: string;
  quantity: number;
  purchase_price: number;
  current_value: number;
  date_acquired: string;
  notes: string;
  is_graded: boolean;
  grade: string | null;
  grading_company: string | null;
}

interface ExportOptions {
  format: 'csv' | 'json' | 'pdf' | 'tcgplayer' | 'summary';
  include_images: boolean;
  include_prices: boolean;
  categories?: string[];
  date_range?: { start: string; end: string };
}

// GET - Export collection
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const format = (searchParams.get('format') || 'csv') as ExportOptions['format'];
  const category = searchParams.get('category');

  if (!userId) {
    return NextResponse.json({
      success: false,
      error: 'User ID required',
    }, { status: 400 });
  }

  try {
    // Generate sample export data for demo
    const cards = generateSampleExportData(category);
    
    if (cards.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No cards in collection to export',
        export_url: null,
        card_count: 0,
      });
    }

    switch (format) {
      case 'csv':
        return exportToCSV(cards, userId);
      case 'json':
        return exportToJSON(cards, userId);
      case 'tcgplayer':
        return exportToTCGPlayer(cards, userId);
      case 'summary':
        return exportSummary(cards, userId);
      case 'pdf':
        return NextResponse.json({
          success: true,
          message: 'PDF export requires premium subscription',
          upgrade_url: '/pricing',
          card_count: cards.length,
        });
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid format. Use: csv, json, tcgplayer, summary, or pdf',
        }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 });
  }
}

// POST - Request export with options
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, format, options } = body;

    if (!user_id) {
      return NextResponse.json({
        success: false,
        error: 'User ID required',
      }, { status: 400 });
    }

    // Generate sample data
    const cards = generateSampleExportData(options?.category);

    return NextResponse.json({
      success: true,
      export_id: `export-${Date.now()}`,
      format: format || 'csv',
      card_count: cards.length,
      status: 'ready',
      download_url: `/api/export?user_id=${user_id}&format=${format || 'csv'}`,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 });
  }
}

// Export to CSV format
function exportToCSV(cards: ExportCard[], userId: string): NextResponse {
  const headers = [
    'Card Name',
    'Category',
    'Set',
    'Card Number',
    'Condition',
    'Quantity',
    'Purchase Price',
    'Current Value',
    'Date Acquired',
    'Graded',
    'Grade',
    'Notes',
  ];

  const rows = cards.map(card => [
    card.card_name,
    card.category,
    card.set_name,
    card.card_number,
    card.condition,
    card.quantity.toString(),
    card.purchase_price.toFixed(2),
    card.current_value.toFixed(2),
    card.date_acquired,
    card.is_graded ? 'Yes' : 'No',
    card.grade || '',
    card.notes,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  // Calculate totals
  const totalPurchase = cards.reduce((sum, c) => sum + c.purchase_price * c.quantity, 0);
  const totalValue = cards.reduce((sum, c) => sum + c.current_value * c.quantity, 0);
  const profit = totalValue - totalPurchase;

  return NextResponse.json({
    success: true,
    format: 'csv',
    card_count: cards.length,
    total_quantity: cards.reduce((sum, c) => sum + c.quantity, 0),
    total_purchase_price: Math.round(totalPurchase * 100) / 100,
    total_current_value: Math.round(totalValue * 100) / 100,
    total_profit: Math.round(profit * 100) / 100,
    profit_percent: totalPurchase > 0 ? Math.round((profit / totalPurchase) * 10000) / 100 : 0,
    csv_content: csvContent,
    filename: `cravcards-export-${userId}-${Date.now()}.csv`,
  });
}

// Export to JSON format
function exportToJSON(cards: ExportCard[], userId: string): NextResponse {
  const totalPurchase = cards.reduce((sum, c) => sum + c.purchase_price * c.quantity, 0);
  const totalValue = cards.reduce((sum, c) => sum + c.current_value * c.quantity, 0);

  const exportData = {
    export_info: {
      user_id: userId,
      exported_at: new Date().toISOString(),
      card_count: cards.length,
      total_quantity: cards.reduce((sum, c) => sum + c.quantity, 0),
      total_purchase_price: Math.round(totalPurchase * 100) / 100,
      total_current_value: Math.round(totalValue * 100) / 100,
    },
    cards: cards,
  };

  return NextResponse.json({
    success: true,
    format: 'json',
    card_count: cards.length,
    json_content: exportData,
    filename: `cravcards-export-${userId}-${Date.now()}.json`,
  });
}

// Export to TCGPlayer format
function exportToTCGPlayer(cards: ExportCard[], userId: string): NextResponse {
  // TCGPlayer import format
  const tcgRows = cards.map(card => ({
    'Product Name': card.card_name,
    'Set Name': card.set_name,
    'Number': card.card_number,
    'Condition': mapConditionToTCGPlayer(card.condition),
    'Quantity': card.quantity,
    'Price': card.current_value.toFixed(2),
  }));

  const headers = ['Product Name', 'Set Name', 'Number', 'Condition', 'Quantity', 'Price'];
  const csvContent = [
    headers.join(','),
    ...tcgRows.map(row => headers.map(h => `"${row[h as keyof typeof row]}"`).join(',')),
  ].join('\n');

  return NextResponse.json({
    success: true,
    format: 'tcgplayer',
    card_count: cards.length,
    csv_content: csvContent,
    filename: `tcgplayer-import-${userId}-${Date.now()}.csv`,
    instructions: 'Upload this CSV to TCGPlayer\'s mass entry tool',
  });
}

// Export summary
function exportSummary(cards: ExportCard[], userId: string): NextResponse {
  const totalPurchase = cards.reduce((sum, c) => sum + c.purchase_price * c.quantity, 0);
  const totalValue = cards.reduce((sum, c) => sum + c.current_value * c.quantity, 0);
  const profit = totalValue - totalPurchase;

  // Group by category
  const byCategory: Record<string, { count: number; value: number }> = {};
  cards.forEach(card => {
    if (!byCategory[card.category]) {
      byCategory[card.category] = { count: 0, value: 0 };
    }
    byCategory[card.category].count += card.quantity;
    byCategory[card.category].value += card.current_value * card.quantity;
  });

  // Group by set
  const bySet: Record<string, { count: number; value: number }> = {};
  cards.forEach(card => {
    if (!bySet[card.set_name]) {
      bySet[card.set_name] = { count: 0, value: 0 };
    }
    bySet[card.set_name].count += card.quantity;
    bySet[card.set_name].value += card.current_value * card.quantity;
  });

  // Top 10 most valuable
  const topCards = [...cards]
    .sort((a, b) => b.current_value - a.current_value)
    .slice(0, 10)
    .map(c => ({
      name: c.card_name,
      set: c.set_name,
      value: c.current_value,
      condition: c.condition,
    }));

  return NextResponse.json({
    success: true,
    format: 'summary',
    summary: {
      total_cards: cards.length,
      total_quantity: cards.reduce((sum, c) => sum + c.quantity, 0),
      unique_sets: Object.keys(bySet).length,
      total_purchase_price: Math.round(totalPurchase * 100) / 100,
      total_current_value: Math.round(totalValue * 100) / 100,
      total_profit: Math.round(profit * 100) / 100,
      profit_percent: totalPurchase > 0 ? Math.round((profit / totalPurchase) * 10000) / 100 : 0,
      graded_count: cards.filter(c => c.is_graded).length,
      average_card_value: cards.length > 0 ? Math.round((totalValue / cards.length) * 100) / 100 : 0,
    },
    by_category: byCategory,
    by_set: Object.entries(bySet)
      .sort((a, b) => b[1].value - a[1].value)
      .slice(0, 10)
      .map(([name, data]) => ({ set: name, ...data })),
    top_cards: topCards,
    generated_at: new Date().toISOString(),
  });
}

// Helper: Map condition to TCGPlayer format
function mapConditionToTCGPlayer(condition: string): string {
  const mapping: Record<string, string> = {
    'mint': 'Near Mint',
    'nm': 'Near Mint',
    'near mint': 'Near Mint',
    'lp': 'Lightly Played',
    'lightly played': 'Lightly Played',
    'mp': 'Moderately Played',
    'moderately played': 'Moderately Played',
    'hp': 'Heavily Played',
    'heavily played': 'Heavily Played',
    'damaged': 'Damaged',
  };
  return mapping[condition.toLowerCase()] || 'Near Mint';
}

// Helper: Generate sample export data
function generateSampleExportData(category?: string | null): ExportCard[] {
  const categories = category ? [category] : ['pokemon', 'mtg', 'sports'];
  const sampleCards: Record<string, Array<{ name: string; set: string; number: string }>> = {
    pokemon: [
      { name: 'Charizard VMAX', set: 'Champions Path', number: '74/73' },
      { name: 'Pikachu VMAX', set: 'Vivid Voltage', number: '44/185' },
      { name: 'Umbreon VMAX Alt Art', set: 'Evolving Skies', number: '215/203' },
      { name: 'Mew VMAX', set: 'Fusion Strike', number: '269/264' },
      { name: 'Rayquaza VMAX Alt Art', set: 'Evolving Skies', number: '218/203' },
    ],
    mtg: [
      { name: 'Ragavan, Nimble Pilferer', set: 'Modern Horizons 2', number: '138' },
      { name: 'Force of Will', set: 'Alliances', number: '42' },
      { name: 'Liliana of the Veil', set: 'Innistrad', number: '105' },
      { name: 'Wrenn and Six', set: 'Modern Horizons', number: '217' },
    ],
    sports: [
      { name: 'Michael Jordan RC', set: '1986 Fleer', number: '57' },
      { name: 'LeBron James RC', set: '2003 Topps', number: '221' },
      { name: 'Patrick Mahomes RC', set: '2017 Panini Prizm', number: '269' },
    ],
  };

  const cards: ExportCard[] = [];
  const conditions = ['mint', 'nm', 'lp', 'mp'];

  categories.forEach(cat => {
    const catCards = sampleCards[cat] || [];
    catCards.forEach((card, i) => {
      const purchasePrice = 20 + Math.random() * 100;
      const valueMultiplier = 1 + Math.random() * 0.5;
      
      cards.push({
        card_id: `${cat}-${i}`,
        card_name: card.name,
        category: cat,
        set_name: card.set,
        card_number: card.number,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        quantity: 1 + Math.floor(Math.random() * 2),
        purchase_price: Math.round(purchasePrice * 100) / 100,
        current_value: Math.round(purchasePrice * valueMultiplier * 100) / 100,
        date_acquired: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
        is_graded: Math.random() > 0.7,
        grade: Math.random() > 0.7 ? ['9', '9.5', '10'][Math.floor(Math.random() * 3)] : null,
        grading_company: Math.random() > 0.7 ? ['PSA', 'BGS', 'CGC'][Math.floor(Math.random() * 3)] : null,
      });
    });
  });

  return cards;
}

// DEDUP REMOVED: export const dynamic = 'force-dynamic';
