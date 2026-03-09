// ============================================================================
// TRADE VALUE CALCULATOR API
// Calculate fair trades between cards
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface TradeCard {
  name: string;
  value: number;
  condition?: string;
  is_graded?: boolean;
  grade?: string;
}

// Condition multipliers for adjusting raw card values
const CONDITION_MULTIPLIERS: Record<string, number> = {
  'mint': 1.0,
  'near_mint': 0.85,
  'excellent': 0.65,
  'very_good': 0.45,
  'good': 0.25,
  'fair': 0.15,
  'poor': 0.08,
};

// Grading multipliers
const GRADE_MULTIPLIERS: Record<string, number> = {
  '10': 3.5,
  '9.5': 2.5,
  '9': 1.8,
  '8.5': 1.4,
  '8': 1.2,
  '7': 1.0,
  '6': 0.8,
  '5': 0.6,
};

function calculateAdjustedValue(card: TradeCard): number {
  let value = card.value;

  if (card.is_graded && card.grade) {
    const gradeMult = GRADE_MULTIPLIERS[card.grade] || 1.0;
    value *= gradeMult;
  } else if (card.condition) {
    const condMult = CONDITION_MULTIPLIERS[card.condition.toLowerCase()] || 0.85;
    value *= condMult;
  }

  return Math.round(value * 100) / 100;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { offering, receiving } = body as {
      offering: TradeCard[];
      receiving: TradeCard[];
    };

    if (!offering || !receiving || offering.length === 0 || receiving.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Both offering and receiving arrays are required with at least one card each',
      }, { status: 400 });
    }

    // Calculate adjusted values
    const offeringDetails = offering.map(card => ({
      ...card,
      adjusted_value: calculateAdjustedValue(card),
    }));

    const receivingDetails = receiving.map(card => ({
      ...card,
      adjusted_value: calculateAdjustedValue(card),
    }));

    const totalOffering = offeringDetails.reduce((sum, card) => sum + card.adjusted_value, 0);
    const totalReceiving = receivingDetails.reduce((sum, card) => sum + card.adjusted_value, 0);

    const difference = totalOffering - totalReceiving;
    const percentageDiff = totalReceiving > 0 
      ? Math.round(((totalOffering / totalReceiving) - 1) * 100) 
      : 0;

    let fairness: string;
    let recommendation: string;

    if (Math.abs(percentageDiff) <= 5) {
      fairness = 'fair';
      recommendation = 'This trade is balanced. Both parties are getting roughly equal value.';
    } else if (percentageDiff > 5 && percentageDiff <= 15) {
      fairness = 'slightly_favorable';
      recommendation = 'You are offering slightly more value. Consider asking for a small add.';
    } else if (percentageDiff > 15) {
      fairness = 'unfavorable';
      recommendation = `You are overpaying by ~${percentageDiff}%. Consider removing cards or asking for adds worth $${Math.round(difference)}.`;
    } else if (percentageDiff < -5 && percentageDiff >= -15) {
      fairness = 'good_deal';
      recommendation = 'This trade favors you slightly. The other party may want an add.';
    } else {
      fairness = 'great_deal';
      recommendation = `This trade heavily favors you (${Math.abs(percentageDiff)}% in your favor). The other party will likely want adds.`;
    }

    return NextResponse.json({
      success: true,
      analysis: {
        offering: {
          cards: offeringDetails,
          total: Math.round(totalOffering * 100) / 100,
        },
        receiving: {
          cards: receivingDetails,
          total: Math.round(totalReceiving * 100) / 100,
        },
        difference: Math.round(difference * 100) / 100,
        percentageDiff,
        fairness,
        recommendation,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// GET endpoint for documentation
export async function GET() {
  return NextResponse.json({
    success: true,
    documentation: {
      endpoint: '/api/trade',
      method: 'POST',
      description: 'Calculate fair trade values between cards',
      example_request: {
        offering: [
          { name: 'Charizard VSTAR', value: 15, condition: 'near_mint' },
          { name: 'Pikachu VMAX', value: 8, is_graded: true, grade: '9' },
        ],
        receiving: [
          { name: 'Umbreon VMAX Alt Art', value: 180, condition: 'mint' },
        ],
      },
      condition_options: Object.keys(CONDITION_MULTIPLIERS),
      grade_options: Object.keys(GRADE_MULTIPLIERS),
    },
  });
}
