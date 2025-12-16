// ============================================================================
// CARD GRADING REFERENCE API
// Comprehensive grading scales, multipliers, and submission info
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const GRADING_COMPANIES = {
  PSA: {
    name: 'Professional Sports Authenticator',
    founded: 1991,
    headquarters: 'Santa Ana, CA',
    website: 'https://www.psacard.com',
    turnaround: {
      economy: '65+ business days',
      regular: '45+ business days',
      express: '15+ business days',
      super_express: '5 business days',
      walk_through: '1-2 business days',
    },
    grades: [
      { grade: 10, name: 'Gem Mint', multiplier: 5.0, description: 'Virtually perfect card' },
      { grade: 9, name: 'Mint', multiplier: 2.5, description: 'Minor flaw visible under close inspection' },
      { grade: 8, name: 'NM-MT', multiplier: 1.5, description: 'Near Mint to Mint condition' },
      { grade: 7, name: 'NM', multiplier: 1.2, description: 'Near Mint with slight wear' },
      { grade: 6, name: 'EX-MT', multiplier: 0.9, description: 'Excellent to Mint' },
      { grade: 5, name: 'EX', multiplier: 0.6, description: 'Excellent condition' },
      { grade: 4, name: 'VG-EX', multiplier: 0.4, description: 'Very Good to Excellent' },
      { grade: 3, name: 'VG', multiplier: 0.25, description: 'Very Good' },
      { grade: 2, name: 'GOOD', multiplier: 0.15, description: 'Good condition' },
      { grade: 1, name: 'PR', multiplier: 0.1, description: 'Poor - major defects' },
    ],
    specialLabels: ['Autograph', 'DNA', 'Dual Cert'],
  },
  BGS: {
    name: 'Beckett Grading Services',
    founded: 1999,
    headquarters: 'Dallas, TX',
    website: 'https://www.beckett.com/grading',
    turnaround: {
      economy: '90+ business days',
      standard: '30+ business days',
      express: '10 business days',
      premium: '5 business days',
    },
    grades: [
      { grade: 10, name: 'Pristine', multiplier: 10.0, description: 'Absolutely perfect card' },
      { grade: 9.5, name: 'Gem Mint', multiplier: 4.0, description: 'Near perfect' },
      { grade: 9, name: 'Mint', multiplier: 2.0, description: 'Outstanding condition' },
      { grade: 8.5, name: 'NM-MT+', multiplier: 1.5, description: 'Near Mint to Mint Plus' },
      { grade: 8, name: 'NM-MT', multiplier: 1.3, description: 'Near Mint to Mint' },
      { grade: 7.5, name: 'NM+', multiplier: 1.1, description: 'Near Mint Plus' },
      { grade: 7, name: 'NM', multiplier: 1.0, description: 'Near Mint' },
    ],
    subgrades: ['Centering', 'Corners', 'Edges', 'Surface'],
    specialLabels: ['Black Label (all 10s)', 'Pristine'],
  },
  CGC: {
    name: 'Certified Guaranty Company',
    founded: 2020,
    headquarters: 'Sarasota, FL',
    website: 'https://www.cgccomics.com/trading-cards',
    turnaround: {
      economy: '50+ business days',
      standard: '20+ business days',
      express: '10 business days',
      walkthrough: '2 business days',
    },
    grades: [
      { grade: 10, name: 'Pristine', multiplier: 6.0, description: 'Perfect card' },
      { grade: 9.5, name: 'Gem Mint', multiplier: 3.5, description: 'Gem quality' },
      { grade: 9, name: 'Mint', multiplier: 2.0, description: 'Mint condition' },
      { grade: 8.5, name: 'NM/Mint+', multiplier: 1.4, description: 'NM to Mint Plus' },
      { grade: 8, name: 'NM/Mint', multiplier: 1.2, description: 'Near Mint to Mint' },
    ],
    subgrades: ['Centering', 'Corners', 'Edges', 'Surface'],
    specialLabels: ['Perfect 10 (all subgrades 10)'],
  },
  SGC: {
    name: 'Sportscard Guaranty Corporation',
    founded: 1998,
    headquarters: 'Parsippany, NJ',
    website: 'https://www.sgccard.com',
    turnaround: {
      economy: '45+ business days',
      regular: '20+ business days',
      express: '5 business days',
    },
    grades: [
      { grade: 10, name: 'Gem Mint', multiplier: 4.5, description: 'Gem quality' },
      { grade: 9.5, name: 'Mint+', multiplier: 2.5, description: 'Mint Plus' },
      { grade: 9, name: 'Mint', multiplier: 1.8, description: 'Mint condition' },
      { grade: 8.5, name: 'NM-MT+', multiplier: 1.3, description: 'Near Mint to Mint Plus' },
      { grade: 8, name: 'NM-MT', multiplier: 1.1, description: 'Near Mint to Mint' },
    ],
    specialLabels: ['Tux Label (vintage)'],
  },
};

const RAW_CONDITIONS = [
  { code: 'mint', name: 'Mint', multiplier: 1.0, description: 'No visible wear, sharp corners, pristine surface' },
  { code: 'near_mint', name: 'Near Mint', multiplier: 0.8, description: 'Minor wear only visible on close inspection' },
  { code: 'excellent', name: 'Excellent', multiplier: 0.5, description: 'Light wear on corners or edges' },
  { code: 'very_good', name: 'Very Good', multiplier: 0.3, description: 'Noticeable wear but still displayable' },
  { code: 'good', name: 'Good', multiplier: 0.15, description: 'Moderate wear, creases, or damage' },
  { code: 'fair', name: 'Fair', multiplier: 0.08, description: 'Heavy wear, may have tears or major creases' },
  { code: 'poor', name: 'Poor', multiplier: 0.03, description: 'Heavily damaged, missing pieces possible' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company')?.toUpperCase();
  const grade = searchParams.get('grade');
  const basePrice = parseFloat(searchParams.get('base_price') || '0');

  // If specific company requested
  if (company && GRADING_COMPANIES[company as keyof typeof GRADING_COMPANIES]) {
    const companyData = GRADING_COMPANIES[company as keyof typeof GRADING_COMPANIES];
    
    // Calculate price if grade and base_price provided
    let estimatedPrice = null;
    if (grade && basePrice > 0) {
      const gradeData = companyData.grades.find(g => 
        g.grade.toString() === grade || g.name.toLowerCase() === grade.toLowerCase()
      );
      if (gradeData) {
        estimatedPrice = Math.round(basePrice * gradeData.multiplier * 100) / 100;
      }
    }

    return NextResponse.json({
      success: true,
      company: companyData,
      estimatedPrice,
    });
  }

  // Return all grading info
  return NextResponse.json({
    success: true,
    gradingCompanies: GRADING_COMPANIES,
    rawConditions: RAW_CONDITIONS,
    tips: [
      'PSA 10 and BGS 9.5+ command the highest premiums',
      'Centering is often the hardest subgrade to achieve',
      'Vintage cards (pre-1980) are graded more leniently',
      'Consider the cost of grading vs potential value increase',
      'Population reports affect value - lower pop = higher value',
    ],
  });
}
