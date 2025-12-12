import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const results: Record<string, unknown> = {};
  
  results.hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  results.hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  results.urlStart = process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30);
  results.keyStart = process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20);
  
  if (!results.hasUrl || !results.hasKey) {
    return NextResponse.json({ success: false, results, error: 'Missing env vars' });
  }
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
    
    const { data, error, count } = await supabase
      .from('card_catalog')
      .select('id, name, category', { count: 'exact' })
      .like('category', 'sports%')
      .limit(5);
    
    if (error) {
      results.queryError = error;
    } else {
      results.data = data;
      results.count = count;
    }
    
    return NextResponse.json({ success: !error, results });
  } catch (e) {
    results.exception = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, results });
  }
}
