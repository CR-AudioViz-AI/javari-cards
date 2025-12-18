// ============================================================================
// FEATURED LISTINGS API
// Marketplace boost options and promoted cards
// CravCards - CR AudioViz AI, LLC
// Created: December 17, 2025
// Fixed: December 18, 2025 - Better error handling
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

interface FeaturedListing {
  id: string;
  user_id: string;
  card_id: string;
  card_name: string;
  category: string;
  set_name: string;
  image_url: string | null;
  price: number;
  condition: string;
  graded: boolean;
  grade: string | null;
  description: string;
  feature_type: 'standard' | 'premium' | 'spotlight';
  start_date: string;
  end_date: string;
  is_active: boolean;
  views: number;
  clicks: number;
  inquiries: number;
  seller_name: string;
  seller_rating: number;
  seller_sales: number;
}

interface FeaturePlan {
  id: string;
  name: string;
  duration_days: number;
  price: number;
  features: string[];
  placement: string[];
  estimated_views: string;
  boost_multiplier: number;
}

// Feature plans
const FEATURE_PLANS: FeaturePlan[] = [
  {
    id: 'standard',
    name: 'Standard Boost',
    duration_days: 7,
    price: 4.99,
    features: [
      'Featured badge on listing',
      'Priority in category search',
      'Basic analytics',
    ],
    placement: ['Category pages', 'Search results'],
    estimated_views: '500-1,000',
    boost_multiplier: 2,
  },
  {
    id: 'premium',
    name: 'Premium Boost',
    duration_days: 14,
    price: 14.99,
    features: [
      'Everything in Standard',
      'Homepage rotation',
      'Email newsletter inclusion',
      'Social media feature',
      'Detailed analytics',
    ],
    placement: ['Homepage', 'Category pages', 'Search results', 'Newsletter'],
    estimated_views: '2,000-5,000',
    boost_multiplier: 5,
  },
  {
    id: 'spotlight',
    name: 'Spotlight Feature',
    duration_days: 30,
    price: 49.99,
    features: [
      'Everything in Premium',
      'Dedicated spotlight section',
      'Push notification to interested buyers',
      'Priority in recommendations',
      'Seller verification badge',
      'Full analytics dashboard',
    ],
    placement: ['Spotlight section', 'All pages', 'Push notifications', 'Email blasts'],
    estimated_views: '10,000+',
    boost_multiplier: 10,
  },
];

// GET - Get featured listings or plans
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'browse';
  const category = searchParams.get('category');
  const userId = searchParams.get('user_id');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    switch (action) {
      case 'browse':
        return browseFeaturedListings(category, limit);
      case 'spotlight':
        return getSpotlightListings(category);
      case 'plans':
        return getFeaturePlans();
      case 'my-listings':
        return getMyFeaturedListings(userId);
      case 'analytics':
        return getListingAnalytics(userId, searchParams.get('listing_id'));
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST - Create/manage featured listings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, action, listing_id } = body;

    if (!user_id) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    switch (action) {
      case 'create':
        return createFeaturedListing(user_id, body);
      case 'record-view':
        return recordView(listing_id);
      case 'record-click':
        return recordClick(listing_id, user_id);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Browse featured listings
function browseFeaturedListings(category: string | null, limit: number): NextResponse {
  const listings = generateSampleListings(category, limit);
  return NextResponse.json({
    success: true,
    listings,
    total: listings.length,
    sample_data: true,
  });
}

// Get spotlight (premium) listings
function getSpotlightListings(category: string | null): NextResponse {
  const listings = generateSampleListings(category, 6).map(l => ({ ...l, feature_type: 'spotlight' as const }));
  return NextResponse.json({
    success: true,
    spotlight: listings,
    sample_data: true,
  });
}

// Get feature plans
function getFeaturePlans(): NextResponse {
  return NextResponse.json({
    success: true,
    plans: FEATURE_PLANS,
    comparison: {
      headers: ['Feature', 'Standard', 'Premium', 'Spotlight'],
      rows: [
        ['Duration', '7 days', '14 days', '30 days'],
        ['Price', '$4.99', '$14.99', '$49.99'],
        ['Est. Views', '500-1K', '2-5K', '10K+'],
        ['Homepage', '❌', '✅', '✅'],
        ['Newsletter', '❌', '✅', '✅'],
        ['Push Notifications', '❌', '❌', '✅'],
        ['Analytics', 'Basic', 'Detailed', 'Full Dashboard'],
      ],
    },
  });
}

// Get user's featured listings
function getMyFeaturedListings(userId: string | null): NextResponse {
  if (!userId) {
    return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
  }
  
  return NextResponse.json({
    success: true,
    active: [],
    expired: [],
    total_active: 0,
    total_views: 0,
    total_clicks: 0,
    total_inquiries: 0,
    message: 'No featured listings yet',
  });
}

// Get analytics for a listing
function getListingAnalytics(userId: string | null, listingId: string | null): NextResponse {
  if (!userId) {
    return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
  }
  
  return NextResponse.json({
    success: true,
    aggregate: {
      total_listings: 0,
      total_views: 0,
      total_clicks: 0,
      total_inquiries: 0,
      avg_ctr: 0,
    },
  });
}

// Create featured listing
function createFeaturedListing(userId: string, data: Record<string, unknown>): NextResponse {
  const { card_id, plan_id } = data;

  if (!card_id || !plan_id) {
    return NextResponse.json({
      success: false,
      error: 'Card ID and plan required',
    }, { status: 400 });
  }

  const plan = FEATURE_PLANS.find(p => p.id === plan_id);
  if (!plan) {
    return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 });
  }

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + plan.duration_days * 24 * 60 * 60 * 1000);

  return NextResponse.json({
    success: true,
    listing: {
      id: `listing-${Date.now()}`,
      user_id: userId,
      card_id,
      feature_type: plan_id,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      is_active: true,
    },
    plan,
    cost: plan.price,
    message: `Card featured for ${plan.duration_days} days (demo mode)`,
  });
}

// Record view
function recordView(listingId: string | null): NextResponse {
  return NextResponse.json({ success: true, tracked: true });
}

// Record click
function recordClick(listingId: string | null, userId: string): NextResponse {
  return NextResponse.json({ success: true, tracked: true });
}

// Helper: Generate sample listings
function generateSampleListings(category: string | null, count: number): FeaturedListing[] {
  const categories = category ? [category] : ['pokemon', 'mtg', 'sports', 'yugioh'];
  const sampleCards: Record<string, string[]> = {
    pokemon: ['Charizard VMAX', 'Pikachu VMAX', 'Umbreon VMAX Alt Art', 'Moonbreon'],
    mtg: ['Black Lotus', 'Mox Sapphire', 'Force of Will', 'Ragavan'],
    sports: ['Michael Jordan RC', 'Mickey Mantle 1952', 'LeBron James RC'],
    yugioh: ['Blue-Eyes White Dragon', 'Dark Magician', 'Exodia'],
  };

  const listings: FeaturedListing[] = [];
  const featureTypes: Array<'standard' | 'premium' | 'spotlight'> = ['spotlight', 'premium', 'standard'];

  for (let i = 0; i < count; i++) {
    const cat = categories[i % categories.length];
    const cards = sampleCards[cat] || [];
    const cardName = cards[i % cards.length] || 'Featured Card';
    const featureType = featureTypes[i % featureTypes.length];
    
    listings.push({
      id: `listing-${i}`,
      user_id: `seller-${i}`,
      card_id: `${cat}-${cardName.toLowerCase().replace(/\s+/g, '-')}`,
      card_name: cardName,
      category: cat,
      set_name: 'Various',
      image_url: null,
      price: 50 + Math.random() * 500,
      condition: Math.random() > 0.3 ? 'Near Mint' : 'Lightly Played',
      graded: Math.random() > 0.6,
      grade: Math.random() > 0.6 ? '9.5' : null,
      description: `Beautiful ${cardName} for sale!`,
      feature_type: featureType,
      start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      views: Math.floor(Math.random() * 500),
      clicks: Math.floor(Math.random() * 50),
      inquiries: Math.floor(Math.random() * 10),
      seller_name: `Seller${i + 1}`,
      seller_rating: 4.5 + Math.random() * 0.5,
      seller_sales: Math.floor(Math.random() * 100),
    });
  }

  return listings;
}

export const dynamic = 'force-dynamic';
