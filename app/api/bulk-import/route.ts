export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// BULK IMPORT API
// Import collections from TCGPlayer, eBay, CSV, and other platforms
// CravCards - CR AudioViz AI, LLC
// Created: December 17, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lazy Supabase client — initialized on first request (not at module load time)
let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kteobfyferrukqeolofj.supabase.co";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW9iZnlmZXJydWtxZW9sb2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NzUwNjUsImV4cCI6MjA1NTE1MTA2NX0.r3_3bXtqo6VCJqYHijtxdEpXkWyNVGKd67kNQvqkrD4";
    _supabase = createClient(url, key);
  }
  return _supabase!;
}
const supabase = getSupabase();
interface ImportCard {
  name: string;
  set_name?: string;
  card_number?: string;
  quantity: number;
  condition?: string;
  purchase_price?: number;
  purchase_date?: string;
  graded?: boolean;
  grade?: string;
  grading_company?: string;
  notes?: string;
}

interface ImportResult {
  import_id: string;
  status: 'processing' | 'completed' | 'partial' | 'failed';
  total_rows: number;
  successful: number;
  failed: number;
  duplicates: number;
  errors: Array<{ row: number; error: string }>;
  cards_added: Array<{ name: string; card_id: string }>;
}

// POST - Start import
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // File upload
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const userId = formData.get('user_id') as string;
      const source = formData.get('source') as string || 'csv';
      const options = JSON.parse(formData.get('options') as string || '{}');

      if (!file || !userId) {
        return NextResponse.json({
          success: false,
          error: 'File and user_id required',
        }, { status: 400 });
      }

      const fileContent = await file.text();
      return await processImport(userId, source, fileContent, options);
    } else {
      // JSON body
      const body = await request.json();
      const { user_id, source, data, options } = body;

      if (!user_id || !data) {
        return NextResponse.json({
          success: false,
          error: 'user_id and data required',
        }, { status: 400 });
      }

      return await processImport(user_id, source || 'json', data, options || {});
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// GET - Get import status or templates
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'templates';
  const importId = searchParams.get('import_id');
  const userId = searchParams.get('user_id');

  switch (action) {
    case 'status':
      if (!importId) {
        return NextResponse.json({ success: false, error: 'import_id required' }, { status: 400 });
      }
      return await getImportStatus(importId);
    
    case 'history':
      if (!userId) {
        return NextResponse.json({ success: false, error: 'user_id required' }, { status: 400 });
      }
      return await getImportHistory(userId);
    
    case 'templates':
    default:
      return getImportTemplates();
  }
}

// Process import from various sources
async function processImport(
  userId: string,
  source: string,
  data: string | ImportCard[],
  options: Record<string, unknown>
): Promise<NextResponse> {
  // Create import record
  const importId = `import-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  
  let cards: ImportCard[] = [];
  let parseErrors: Array<{ row: number; error: string }> = [];

  // Parse based on source
  switch (source.toLowerCase()) {
    case 'tcgplayer':
      const tcgResult = parseTCGPlayerExport(data as string);
      cards = tcgResult.cards;
      parseErrors = tcgResult.errors;
      break;
    
    case 'ebay':
      const ebayResult = parseEbayExport(data as string);
      cards = ebayResult.cards;
      parseErrors = ebayResult.errors;
      break;
    
    case 'csv':
      const csvResult = parseCSV(data as string, options);
      cards = csvResult.cards;
      parseErrors = csvResult.errors;
      break;
    
    case 'json':
      if (Array.isArray(data)) {
        cards = data as ImportCard[];
      } else {
        try {
          cards = JSON.parse(data as string);
        } catch {
          return NextResponse.json({
            success: false,
            error: 'Invalid JSON data',
          }, { status: 400 });
        }
      }
      break;
    
    default:
      return NextResponse.json({
        success: false,
        error: `Unsupported source: ${source}`,
        supported: ['tcgplayer', 'ebay', 'csv', 'json'],
      }, { status: 400 });
  }

  // Process cards
  const result = await importCards(userId, cards, importId, options);
  result.errors = [...parseErrors, ...result.errors];

  // Save import record
  await supabase.from('cv_imports').insert({
    import_id: importId,
    user_id: userId,
    source,
    total_rows: cards.length,
    successful: result.successful,
    failed: result.failed,
    duplicates: result.duplicates,
    status: result.status,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    import: result,
  });
}

// Parse TCGPlayer export format
function parseTCGPlayerExport(data: string): { cards: ImportCard[]; errors: Array<{ row: number; error: string }> } {
  const cards: ImportCard[] = [];
  const errors: Array<{ row: number; error: string }> = [];
  
  const lines = data.split('\n');
  const headers = lines[0]?.toLowerCase().split(',').map(h => h.trim());
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    try {
      const values = parseCSVLine(lines[i]);
      const card: ImportCard = {
        name: values[headers.indexOf('product name')] || values[headers.indexOf('name')] || '',
        set_name: values[headers.indexOf('set name')] || values[headers.indexOf('set')] || '',
        quantity: parseInt(values[headers.indexOf('quantity')] || '1'),
        condition: mapCondition(values[headers.indexOf('condition')] || 'nm'),
        purchase_price: parseFloat(values[headers.indexOf('price')] || values[headers.indexOf('purchase price')] || '0'),
      };
      
      if (card.name) {
        cards.push(card);
      }
    } catch (e) {
      errors.push({ row: i + 1, error: `Parse error: ${e}` });
    }
  }
  
  return { cards, errors };
}

// Parse eBay purchase history
function parseEbayExport(data: string): { cards: ImportCard[]; errors: Array<{ row: number; error: string }> } {
  const cards: ImportCard[] = [];
  const errors: Array<{ row: number; error: string }> = [];
  
  const lines = data.split('\n');
  const headers = lines[0]?.toLowerCase().split(',').map(h => h.trim());
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    try {
      const values = parseCSVLine(lines[i]);
      
      // eBay format typically has: Item Title, Sale Price, Purchase Date, etc.
      const title = values[headers.indexOf('item title')] || values[headers.indexOf('title')] || '';
      
      // Try to parse card name from eBay listing title
      const card: ImportCard = {
        name: extractCardName(title),
        quantity: 1,
        purchase_price: parseFloat(values[headers.indexOf('sale price')] || values[headers.indexOf('total')] || '0'),
        purchase_date: values[headers.indexOf('sale date')] || values[headers.indexOf('date')],
        notes: `Imported from eBay: ${title}`,
      };
      
      if (card.name) {
        cards.push(card);
      }
    } catch (e) {
      errors.push({ row: i + 1, error: `Parse error: ${e}` });
    }
  }
  
  return { cards, errors };
}

// Parse generic CSV
function parseCSV(data: string, options: Record<string, unknown>): { cards: ImportCard[]; errors: Array<{ row: number; error: string }> } {
  const cards: ImportCard[] = [];
  const errors: Array<{ row: number; error: string }> = [];
  
  const lines = data.split('\n');
  const hasHeaders = options.has_headers !== false;
  const headers = hasHeaders 
    ? lines[0]?.toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''))
    : ['name', 'set', 'number', 'quantity', 'condition', 'price'];
  
  const startRow = hasHeaders ? 1 : 0;
  
  // Column mapping from options or auto-detect
  const mapping = (options.column_mapping as Record<string, number>) || {
    name: headers.indexOf('name') !== -1 ? headers.indexOf('name') : 0,
    set_name: headers.findIndex(h => h.includes('set')),
    card_number: headers.findIndex(h => h.includes('number') || h.includes('#')),
    quantity: headers.findIndex(h => h.includes('qty') || h.includes('quantity')),
    condition: headers.findIndex(h => h.includes('condition')),
    purchase_price: headers.findIndex(h => h.includes('price') || h.includes('cost')),
  };
  
  for (let i = startRow; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    try {
      const values = parseCSVLine(lines[i]);
      
      const card: ImportCard = {
        name: values[mapping.name] || '',
        set_name: mapping.set_name >= 0 ? values[mapping.set_name] : undefined,
        card_number: mapping.card_number >= 0 ? values[mapping.card_number] : undefined,
        quantity: mapping.quantity >= 0 ? parseInt(values[mapping.quantity] || '1') : 1,
        condition: mapping.condition >= 0 ? mapCondition(values[mapping.condition] || '') : 'nm',
        purchase_price: mapping.purchase_price >= 0 ? parseFloat(values[mapping.purchase_price] || '0') : undefined,
      };
      
      if (card.name) {
        cards.push(card);
      }
    } catch (e) {
      errors.push({ row: i + 1, error: `Parse error: ${e}` });
    }
  }
  
  return { cards, errors };
}

// Import cards to database
async function importCards(
  userId: string,
  cards: ImportCard[],
  importId: string,
  options: Record<string, unknown>
): Promise<ImportResult> {
  const result: ImportResult = {
    import_id: importId,
    status: 'processing',
    total_rows: cards.length,
    successful: 0,
    failed: 0,
    duplicates: 0,
    errors: [],
    cards_added: [],
  };

  const skipDuplicates = options.skip_duplicates !== false;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    
    try {
      // Check for duplicates
      if (skipDuplicates) {
        const { data: existing } = await supabase
          .from('cv_user_cards')
          .select('id')
          .eq('user_id', userId)
          .eq('card_name', card.name)
          .eq('set_name', card.set_name || '')
          .limit(1)
          .single();

        if (existing) {
          result.duplicates++;
          continue;
        }
      }

      // Look up card in master database to get ID and current value
      const cardId = await lookupCardId(card);
      const currentValue = await lookupCurrentValue(card);

      // Insert card
      const { data: inserted, error } = await supabase
        .from('cv_user_cards')
        .insert({
          user_id: userId,
          card_id: cardId,
          card_name: card.name,
          set_name: card.set_name,
          card_number: card.card_number,
          quantity: card.quantity,
          condition: card.condition || 'nm',
          purchase_price: card.purchase_price || 0,
          current_value: currentValue,
          purchase_date: card.purchase_date,
          is_graded: card.graded || false,
          grade: card.grade,
          grading_company: card.grading_company,
          notes: card.notes,
          import_id: importId,
          created_at: new Date().toISOString(),
        })
        .select('card_id')
        .single();

      if (error) throw error;

      result.successful++;
      result.cards_added.push({ name: card.name, card_id: inserted.card_id });

    } catch (error) {
      result.failed++;
      result.errors.push({
        row: i + 1,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  result.status = result.failed === 0 ? 'completed' 
    : result.successful === 0 ? 'failed' 
    : 'partial';

  return result;
}

// Get import status
async function getImportStatus(importId: string): Promise<NextResponse> {
  const { data: importRecord } = await supabase
    .from('cv_imports')
    .select('*')
    .eq('import_id', importId)
    .single();

  if (!importRecord) {
    return NextResponse.json({
      success: false,
      error: 'Import not found',
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    import: importRecord,
  });
}

// Get import history
async function getImportHistory(userId: string): Promise<NextResponse> {
  const { data: history } = await supabase
    .from('cv_imports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  return NextResponse.json({
    success: true,
    history: history || [],
  });
}

// Get import templates
function getImportTemplates(): NextResponse {
  return NextResponse.json({
    success: true,
    templates: {
      csv: {
        headers: ['name', 'set_name', 'card_number', 'quantity', 'condition', 'purchase_price', 'purchase_date', 'notes'],
        example: 'Charizard VMAX,Darkness Ablaze,20/189,1,nm,150.00,2023-01-15,Pack pulled',
        download_url: '/api/bulk-import/template.csv',
      },
      tcgplayer: {
        description: 'Export your TCGPlayer collection and upload the CSV file',
        steps: [
          'Go to TCGPlayer.com',
          'Navigate to My Collection',
          'Click Export',
          'Upload the downloaded CSV here',
        ],
      },
      ebay: {
        description: 'Export your eBay purchase history',
        steps: [
          'Go to eBay My eBay > Purchase History',
          'Download as CSV',
          'Upload the file here',
        ],
      },
    },
    supported_sources: ['csv', 'json', 'tcgplayer', 'ebay'],
    limits: {
      max_rows_per_import: 1000,
      max_file_size: '5MB',
    },
  });
}

// Helper: Parse CSV line handling quotes
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

// Helper: Map condition strings
function mapCondition(condition: string): string {
  const conditionMap: Record<string, string> = {
    'mint': 'nm',
    'near mint': 'nm',
    'nm': 'nm',
    'nm-m': 'nm',
    'excellent': 'lp',
    'lightly played': 'lp',
    'lp': 'lp',
    'moderately played': 'mp',
    'mp': 'mp',
    'heavily played': 'hp',
    'hp': 'hp',
    'damaged': 'dmg',
    'poor': 'dmg',
  };
  
  return conditionMap[condition.toLowerCase()] || 'nm';
}

// Helper: Extract card name from eBay listing
function extractCardName(title: string): string {
  // Remove common eBay listing extras
  let name = title
    .replace(/\bpsa\s*\d+/gi, '')
    .replace(/\bbgs\s*[\d.]+/gi, '')
    .replace(/\bcgc\s*[\d.]+/gi, '')
    .replace(/\bsgc\s*[\d.]+/gi, '')
    .replace(/\bgraded\b/gi, '')
    .replace(/\brare\b/gi, '')
    .replace(/\bholo\b/gi, '')
    .replace(/\bfoil\b/gi, '')
    .replace(/\bfree shipping\b/gi, '')
    .replace(/\bnm\b/gi, '')
    .replace(/\bmint\b/gi, '')
    .replace(/[!@#$%^&*()]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Truncate if too long
  if (name.length > 100) {
    name = name.substring(0, 100);
  }
  
  return name;
}

// Helper: Look up card ID
async function lookupCardId(card: ImportCard): Promise<string> {
  // Try to find in master database
  const { data } = await supabase
    .from('cv_cards_master')
    .select('card_id')
    .ilike('name', card.name)
    .limit(1)
    .single();
  
  if (data) return data.card_id;
  
  // Generate ID if not found
  return `imported-${card.name.toLowerCase().replace(/\s+/g, '-').slice(0, 50)}-${Date.now()}`;
}

// Helper: Look up current value
async function lookupCurrentValue(card: ImportCard): Promise<number> {
  // Try to find current market price
  const { data } = await supabase
    .from('cv_cards_master')
    .select('current_price')
    .ilike('name', card.name)
    .limit(1)
    .single();
  
  return data?.current_price || card.purchase_price || 0;
}

export const dynamic = 'force-dynamic';
