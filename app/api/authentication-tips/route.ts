// ============================================================================
// CARD AUTHENTICATION TIPS API
// How to spot fakes, reprints, and counterfeits
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const AUTHENTICATION_TIPS = {
  general: {
    title: 'General Authentication Tips',
    tips: [
      {
        name: 'The Light Test',
        description: 'Hold card up to bright light. Real cards have a dark layer in the middle that blocks light. Fakes often let light through.',
        difficulty: 'easy',
        tools_needed: ['Bright light source'],
      },
      {
        name: 'The Bend Test',
        description: 'Gently bend the card. Real cards have spring and return to shape. Fakes may crease or feel stiff/flimsy.',
        difficulty: 'easy',
        tools_needed: ['None'],
        warning: 'Be careful not to damage valuable cards!',
      },
      {
        name: 'The Rip Test',
        description: 'Real cards have a blue or black core layer visible when torn. Only use on worthless cards for practice.',
        difficulty: 'easy',
        tools_needed: ['Bulk common card'],
        warning: 'Destructive test - never do on valuable cards!',
      },
      {
        name: 'Surface Texture',
        description: 'Examine with magnification. Real cards have consistent print patterns. Fakes often show dot patterns or blurry text.',
        difficulty: 'medium',
        tools_needed: ['Jewelers loupe', '10x magnification or higher'],
      },
      {
        name: 'Weight/Feel',
        description: 'Compare to known authentic card. Fakes often feel lighter, thinner, or have different texture.',
        difficulty: 'medium',
        tools_needed: ['Known authentic card for comparison'],
      },
      {
        name: 'Edge Color',
        description: 'Look at card edges. Real cards have clean, consistent colored core. Fakes may show white or inconsistent coloring.',
        difficulty: 'easy',
        tools_needed: ['Good lighting'],
      },
    ],
  },
  pokemon: {
    title: 'Pokemon Card Authentication',
    tips: [
      {
        name: 'Font Consistency',
        description: 'Pokemon uses specific fonts. Fake cards often have slightly different letter spacing or font weights.',
        difficulty: 'medium',
        tools_needed: ['Reference images'],
      },
      {
        name: 'Holo Pattern',
        description: 'Real holos have consistent, fine patterns. Fakes may have larger, irregular, or overly shiny patterns.',
        difficulty: 'medium',
        tools_needed: ['Good lighting'],
      },
      {
        name: 'Color Saturation',
        description: 'Fakes often have oversaturated or washed-out colors compared to authentic cards.',
        difficulty: 'medium',
        tools_needed: ['Authentic card comparison'],
      },
      {
        name: 'Energy Symbols',
        description: 'Check energy symbols are crisp and correctly colored. Fakes often have blurry or wrong-colored symbols.',
        difficulty: 'easy',
        tools_needed: ['Magnification helps'],
      },
      {
        name: 'Card Stock',
        description: 'Japanese and English Pokemon cards use different card stocks. Be suspicious of cards that feel wrong.',
        difficulty: 'medium',
        tools_needed: ['Known authentic cards'],
      },
    ],
    red_flags: [
      'Price too good to be true',
      'Seller has no history or feedback',
      'Card from unusual source/country',
      'No close-up photos provided',
      'Seller refuses additional photos',
    ],
  },
  mtg: {
    title: 'Magic: The Gathering Authentication',
    tips: [
      {
        name: 'Rosette Pattern',
        description: 'Under magnification, real MTG cards show a rosette (circular dot) print pattern. Fakes show different patterns.',
        difficulty: 'hard',
        tools_needed: ['30x+ jewelers loupe'],
      },
      {
        name: 'Green Dot Test',
        description: 'On the back, examine the green mana symbol. Real cards have distinct red dots in the green ink visible under magnification.',
        difficulty: 'hard',
        tools_needed: ['60x+ magnification'],
      },
      {
        name: 'Black Light Test',
        description: 'Real MTG cards glow dull blue under UV. Fakes often glow bright white or not at all.',
        difficulty: 'medium',
        tools_needed: ['UV/black light'],
      },
      {
        name: 'Card Back Comparison',
        description: 'Compare card back to known authentic. Color, centering, and print quality should match.',
        difficulty: 'easy',
        tools_needed: ['Authentic card'],
      },
      {
        name: 'Set Symbol',
        description: 'Verify set symbol matches known authentic. Fakes may have wrong color, size, or detail.',
        difficulty: 'easy',
        tools_needed: ['Reference database'],
      },
    ],
    red_flags: [
      'Reserved List cards at steep discount',
      'Alpha/Beta cards without provenance',
      'Perfect condition vintage cards',
      'Unusual card feel or smell',
      'Ink that smudges when rubbed',
    ],
  },
  yugioh: {
    title: 'Yu-Gi-Oh Card Authentication',
    tips: [
      {
        name: 'Eye of Anubis',
        description: 'Real cards have a holographic Eye of Anubis in bottom right. Should have 3D depth effect when tilted.',
        difficulty: 'easy',
        tools_needed: ['Good lighting'],
      },
      {
        name: 'Card Code',
        description: 'Every card has unique set code. Verify code matches the set the card claims to be from.',
        difficulty: 'easy',
        tools_needed: ['Database reference'],
      },
      {
        name: 'Foil Quality',
        description: 'Real ultra/secret rares have specific foil patterns. Fakes often have generic or wrong patterns.',
        difficulty: 'medium',
        tools_needed: ['Authentic comparison'],
      },
      {
        name: 'Card Number',
        description: 'Check card number format matches era. Older cards have different numbering systems.',
        difficulty: 'easy',
        tools_needed: ['Reference guide'],
      },
    ],
    red_flags: [
      'Ghost Rares at low prices',
      'Starlight Rares without certification',
      'First Edition LOB cards without authentication',
      'Wrong language text for region',
    ],
  },
  sports: {
    title: 'Sports Card Authentication',
    tips: [
      {
        name: 'Hologram Verification',
        description: 'Modern sports cards have security holograms. Verify hologram is genuine and not a sticker.',
        difficulty: 'medium',
        tools_needed: ['Reference images'],
      },
      {
        name: 'Autograph Inspection',
        description: 'Real autos have pen indentation and natural flow. Fakes may look printed or have no depth.',
        difficulty: 'hard',
        tools_needed: ['Magnification', 'known exemplars'],
      },
      {
        name: 'Patch/Memorabilia',
        description: 'Verify patch matches team colors/era. Window should show genuine material, not printed image.',
        difficulty: 'medium',
        tools_needed: ['Reference knowledge'],
      },
      {
        name: 'Serial Number',
        description: 'Numbered cards should have clean, consistent numbering. Check format matches manufacturer.',
        difficulty: 'easy',
        tools_needed: ['Reference'],
      },
      {
        name: 'Rookie Card Year',
        description: 'Verify player was actually a rookie that year. Fake vintage rookies are common.',
        difficulty: 'easy',
        tools_needed: ['Sports reference database'],
      },
    ],
    red_flags: [
      'Pre-1980 cards in perfect condition',
      'Autos without COA from graders',
      'Patches that look printed',
      'Wrong team jerseys for player/era',
      'Trimmed edges (altered borders)',
    ],
  },
  graded_cards: {
    title: 'Authenticating Graded Cards',
    tips: [
      {
        name: 'Verify Certification',
        description: 'Look up certification number on grading company website. Ensure grade, card, and year match.',
        difficulty: 'easy',
        tools_needed: ['Internet access'],
      },
      {
        name: 'Case Inspection',
        description: 'Examine case for signs of tampering. Look for tool marks, resealing, or misaligned labels.',
        difficulty: 'medium',
        tools_needed: ['Good lighting'],
      },
      {
        name: 'Label Authenticity',
        description: 'Compare label to known authentic. Check font, hologram, barcode format.',
        difficulty: 'medium',
        tools_needed: ['Reference images'],
      },
      {
        name: 'Case Model',
        description: 'Ensure case style matches era. Old cert numbers in new cases may indicate reslab or fake.',
        difficulty: 'hard',
        tools_needed: ['Knowledge of case history'],
      },
    ],
    red_flags: [
      'Certification number not found online',
      'Grade seems too high for card condition',
      'Case appears opened/resealed',
      'Label quality differs from authentic',
      'Significantly below market price',
    ],
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category')?.toLowerCase();

  if (category && AUTHENTICATION_TIPS[category as keyof typeof AUTHENTICATION_TIPS]) {
    return NextResponse.json({
      success: true,
      data: AUTHENTICATION_TIPS[category as keyof typeof AUTHENTICATION_TIPS],
    });
  }

  return NextResponse.json({
    success: true,
    categories: Object.keys(AUTHENTICATION_TIPS),
    data: AUTHENTICATION_TIPS,
    importantNote: 'When in doubt, buy from reputable sellers and consider third-party authentication for valuable cards.',
  });
}
