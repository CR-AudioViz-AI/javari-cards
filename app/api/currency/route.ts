// ============================================================================
// CURRENCY CONVERSION API
// Free exchange rate conversion for card prices
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// Cache exchange rates (refresh every 6 hours)
let ratesCache: { rates: Record<string, number>; timestamp: number } | null = null;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

async function getExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now();
  
  if (ratesCache && (now - ratesCache.timestamp) < CACHE_DURATION) {
    return ratesCache.rates;
  }
  
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error('Failed to fetch rates');
    
    const data = await response.json();
    ratesCache = {
      rates: data.rates,
      timestamp: now,
    };
    
    return data.rates;
  } catch (error) {
    // Return cached rates even if expired, or defaults
    return ratesCache?.rates || {
      USD: 1,
      EUR: 0.85,
      GBP: 0.75,
      JPY: 110,
      CAD: 1.25,
      AUD: 1.35,
    };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const amount = parseFloat(searchParams.get('amount') || '0');
  const from = (searchParams.get('from') || 'USD').toUpperCase();
  const to = (searchParams.get('to') || 'EUR').toUpperCase();
  
  if (isNaN(amount) || amount < 0) {
    return NextResponse.json({
      success: false,
      error: 'Invalid amount',
    }, { status: 400 });
  }
  
  try {
    const rates = await getExchangeRates();
    
    // Convert to USD first, then to target
    const fromRate = rates[from] || 1;
    const toRate = rates[to] || 1;
    const amountInUSD = amount / fromRate;
    const converted = amountInUSD * toRate;
    
    return NextResponse.json({
      success: true,
      original: { amount, currency: from },
      converted: { 
        amount: Math.round(converted * 100) / 100, 
        currency: to 
      },
      rate: toRate / fromRate,
      availableCurrencies: Object.keys(rates).slice(0, 30),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
