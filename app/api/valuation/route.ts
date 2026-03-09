// ============================================================================
// CARD VALUATION CALCULATOR API
// Estimate card values based on condition, grading, and market data
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Grading multipliers by company and grade
const GRADING_MULTIPLIERS: Record<string, Record<string, number>> = {
  PSA: { '10': 5.0, '9': 2.5, '8': 1.5, '7': 1.2, '6': 0.9, '5': 0.6, '4': 0.4, '3': 0.25, '2': 0.15, '1': 0.1 },
  BGS: { '10': 10.0, '9.5': 4.0, '9': 2.0, '8.5': 1.5, '8': 1.3, '7.5': 1.1, '7': 1.0 },
  CGC: { '10': 6.0, '9.5': 3.5, '9': 2.0, '8.5': 1.4, '8': 1.2 },
  SGC: { '10': 4.5, '9.5': 2.5, '9': 1.8, '8.5': 1.3, '8': 1.1 },
};

// Raw condition multipliers
const RAW_MULTIPLIERS: Record<string, number> = {
  'mint': 1.0,
  'near_mint': 0.8,
  'excellent': 0.5,
  'very_good': 0.3,
  'good': 0.15,
  'fair': 0.08,
  'poor': 0.03,
};

// Category-specific factors (vintage cards, chase cards, etc.)
const CATEGORY_FACTORS: Record<string, Record<string, number>> = {
  pokemon: {
    'first_edition': 3.0,
    'shadowless': 2.0,
    'holo': 1.5,
    'reverse_holo': 1.2,
    'full_art': 1.8,
    'secret_rare': 2.5,
    'alt_art': 2.2,
  },
  mtg: {
    'alpha': 10.0,
    'beta': 5.0,
    'unlimited': 2.0,
    'foil': 2.0,
    'extended_art': 1.5,
    'borderless': 1.8,
    'retro_frame': 1.4,
  },
  yugioh: {
    'first_edition': 2.0,
    'limited_edition': 1.5,
    'ghost_rare': 5.0,
    'starlight_rare': 8.0,
    'ultimate_rare': 3.0,
    'secret_rare': 2.0,
  },
  sports: {
    'rookie': 3.0,
    'auto': 2.5,
    'patch': 2.0,
    'numbered': 1.5,
    'refractor': 1.8,
    'parallel': 1.3,
    'ssp': 4.0,
  },
  lorcana: {
    'enchanted': 5.0,
    'legendary': 2.0,
    'super_rare': 1.5,
    'rare': 1.2,
  },
};

interface ValuationRequest {
  base_price: number;
  condition?: string;
  is_graded?: boolean;
  grading_company?: string;
  grade?: string;
  category?: string;
  special_factors?: string[];
}

function calculateValue(params: ValuationRequest): {
  estimated_low: number;
  estimated_mid: number;
  estimated_high: number;
  multipliers_applied: Array<{ name: string; value: number }>;
  confidence: string;
} {
  let totalMultiplier = 1.0;
  const multipliersApplied: Array<{ name: string; value: number }> = [];

  // Apply grading or raw condition multiplier
  if (params.is_graded && params.grading_company && params.grade) {
    const company = params.grading_company.toUpperCase();
    const gradeMultipliers = GRADING_MULTIPLIERS[company];
    if (gradeMultipliers && gradeMultipliers[params.grade]) {
      const mult = gradeMultipliers[params.grade];
      totalMultiplier *= mult;
      multipliersApplied.push({ name: `${company} ${params.grade}`, value: mult });
    }
  } else if (params.condition) {
    const condMult = RAW_MULTIPLIERS[params.condition.toLowerCase()] || 0.8;
    totalMultiplier *= condMult;
    multipliersApplied.push({ name: `Raw (${params.condition})`, value: condMult });
  }

  // Apply special factors
  if (params.category && params.special_factors && params.special_factors.length > 0) {
    const categoryFactors = CATEGORY_FACTORS[params.category.toLowerCase()] || {};
    for (const factor of params.special_factors) {
      const factorMult = categoryFactors[factor.toLowerCase()];
      if (factorMult) {
        totalMultiplier *= factorMult;
        multipliersApplied.push({ name: factor, value: factorMult });
      }
    }
  }

  const midValue = params.base_price * totalMultiplier;
  
  return {
    estimated_low: Math.round(midValue * 0.8 * 100) / 100,
    estimated_mid: Math.round(midValue * 100) / 100,
    estimated_high: Math.round(midValue * 1.25 * 100) / 100,
    multipliers_applied: multipliersApplied,
    confidence: multipliersApplied.length > 0 ? 'medium' : 'low',
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const params: ValuationRequest = {
    base_price: parseFloat(searchParams.get('base_price') || '0'),
    condition: searchParams.get('condition') || undefined,
    is_graded: searchParams.get('is_graded') === 'true',
    grading_company: searchParams.get('grading_company') || undefined,
    grade: searchParams.get('grade') || undefined,
    category: searchParams.get('category') || undefined,
    special_factors: searchParams.get('special_factors')?.split(',').filter(Boolean) || [],
  };

  if (params.base_price <= 0) {
    return NextResponse.json({
      success: false,
      error: 'base_price is required and must be positive',
    }, { status: 400 });
  }

  const valuation = calculateValue(params);

  return NextResponse.json({
    success: true,
    input: params,
    valuation,
    disclaimer: 'Estimates are for reference only. Actual market values may vary based on demand, population, and market conditions.',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.base_price || body.base_price <= 0) {
      return NextResponse.json({
        success: false,
        error: 'base_price is required and must be positive',
      }, { status: 400 });
    }

    const valuation = calculateValue(body);

    return NextResponse.json({
      success: true,
      input: body,
      valuation,
      disclaimer: 'Estimates are for reference only. Actual market values may vary.',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
