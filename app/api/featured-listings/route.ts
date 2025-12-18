// ============================================================================
// FEATURED LISTINGS API
// Marketplace boost options and promoted cards
// CravCards - CR AudioViz AI, LLC
// Created: December 17, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
  
  // Featuring details
  feature_type: 'standard' | 'premium' | 'spotlight';
  start_date: string;
  end_date: string;
  is_active: boolean;
  views: number;
  clicks: number;
  inquiries: number;
  
  // Seller info
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
        return await browseFeaturedListings(category, limit);
      case 'spotlight':
        return await getSpotlightListings(category);
      case 'plans':
        return getFeaturePlans();
      case 'my-listings':
        if (!userId) return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
        return await getMyFeaturedListings(userId);
      case 'analytics':
        if (!userId) return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
        return await getListingAnalytics(userId, searchParams.get('listing_id'));
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
    const { user_id, action } = body;

    if (!user_id) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    switch (action) {
      case 'create':
        return await createFeaturedListing(user_id, body);
      case 'renew':
        return await renewListing(user_id, body.listing_id, body.plan_id);
      case 'cancel':
        return await cancelListing(user_id, body.listing_id);
      case 'update':
        return await updateListing(user_id, body.listing_id, body.updates);
      case 'record-view':
        return await recordView(body.listing_id);
      case 'record-click':
        return await recordClick(body.listing_id, user_id);
      case 'inquire':
        return await createInquiry(body.listing_id, user_id, body.message);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Browse featured listings
async function browseFeaturedListings(category: string | null, limit: number): Promise<NextResponse> {
  let query = supabase
    .from('cv_featured_listings')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', new Date().toISOString())
    .gte('end_date', new Date().toISOString())
    .order('feature_type', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq('category', category);
  }

  const { data: listings, error } = await query;

  if (error && error.code !== 'PGRST116') throw error;

  // If no real listings, generate samples
  if (!listings || listings.length === 0) {
    return NextResponse.json({
      success: true,
      listings: generateSampleListings(category, limit),
      total: limit,
      sample_data: true,
    });
  }

  return NextResponse.json({
    success: true,
    listings,
    total: listings.length,
  });
}

// Get spotlight (premium) listings
async function getSpotlightListings(category: string | null): Promise<NextResponse> {
  let query = supabase
    .from('cv_featured_listings')
    .select('*')
    .eq('is_active', true)
    .eq('feature_type', 'spotlight')
    .lte('start_date', new Date().toISOString())
    .gte('end_date', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(6);

  if (category) {
    query = query.eq('category', category);
  }

  const { data: listings, error } = await query;

  if (error && error.code !== 'PGRST116') throw error;

  // Generate samples if none
  if (!listings || listings.length === 0) {
    return NextResponse.json({
      success: true,
      spotlight: generateSampleListings(category, 6).map(l => ({ ...l, feature_type: 'spotlight' })),
      sample_data: true,
    });
  }

  return NextResponse.json({
    success: true,
    spotlight: listings,
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
async function getMyFeaturedListings(userId: string): Promise<NextResponse> {
  const { data: listings } = await supabase
    .from('cv_featured_listings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const active = listings?.filter(l => l.is_active && new Date(l.end_date) > new Date()) || [];
  const expired = listings?.filter(l => !l.is_active || new Date(l.end_date) <= new Date()) || [];

  return NextResponse.json({
    success: true,
    active,
    expired,
    total_active: active.length,
    total_views: listings?.reduce((sum, l) => sum + (l.views || 0), 0) || 0,
    total_clicks: listings?.reduce((sum, l) => sum + (l.clicks || 0), 0) || 0,
    total_inquiries: listings?.reduce((sum, l) => sum + (l.inquiries || 0), 0) || 0,
  });
}

// Get analytics for a listing
async function getListingAnalytics(userId: string, listingId: string | null): Promise<NextResponse> {
  if (!listingId) {
    // Get aggregate analytics
    const { data: listings } = await supabase
      .from('cv_featured_listings')
      .select('views, clicks, inquiries, feature_type, start_date, end_date')
      .eq('user_id', userId);

    return NextResponse.json({
      success: true,
      aggregate: {
        total_listings: listings?.length || 0,
        total_views: listings?.reduce((sum, l) => sum + (l.views || 0), 0) || 0,
        total_clicks: listings?.reduce((sum, l) => sum + (l.clicks || 0), 0) || 0,
        total_inquiries: listings?.reduce((sum, l) => sum + (l.inquiries || 0), 0) || 0,
        avg_ctr: listings && listings.length > 0
          ? (listings.reduce((sum, l) => sum + (l.clicks || 0), 0) / Math.max(listings.reduce((sum, l) => sum + (l.views || 0), 0), 1) * 100).toFixed(2)
          : 0,
      },
    });
  }

  // Get specific listing analytics
  const { data: listing } = await supabase
    .from('cv_featured_listings')
    .select('*')
    .eq('id', listingId)
    .eq('user_id', userId)
    .single();

  if (!listing) {
    return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
  }

  // Get daily breakdown (mock for now)
  const dailyStats = generateDailyStats(listing.start_date, listing.end_date, listing.views, listing.clicks);

  return NextResponse.json({
    success: true,
    listing,
    analytics: {
      views: listing.views || 0,
      clicks: listing.clicks || 0,
      inquiries: listing.inquiries || 0,
      ctr: listing.views ? ((listing.clicks || 0) / listing.views * 100).toFixed(2) : 0,
      inquiry_rate: listing.clicks ? ((listing.inquiries || 0) / listing.clicks * 100).toFixed(2) : 0,
      days_remaining: Math.max(0, Math.ceil((new Date(listing.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
    },
    daily_breakdown: dailyStats,
  });
}

// Create featured listing
async function createFeaturedListing(userId: string, data: Record<string, unknown>): Promise<NextResponse> {
  const { card_id, plan_id, price, description } = data;

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

  // Get card details
  const { data: card } = await supabase
    .from('cv_user_cards')
    .select('*')
    .eq('card_id', card_id)
    .eq('user_id', userId)
    .single();

  if (!card) {
    return NextResponse.json({
      success: false,
      error: 'Card not found in your collection',
    }, { status: 404 });
  }

  // Get seller info
  const { data: profile } = await supabase
    .from('cv_user_profiles')
    .select('username, display_name, seller_rating, total_sales')
    .eq('user_id', userId)
    .single();

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + plan.duration_days * 24 * 60 * 60 * 1000);

  const { data: listing, error } = await supabase
    .from('cv_featured_listings')
    .insert({
      user_id: userId,
      card_id,
      card_name: card.card_name,
      category: card.category,
      set_name: card.set_name,
      image_url: card.image_url,
      price: price || card.current_value,
      condition: card.condition,
      graded: card.is_graded,
      grade: card.grade,
      description: description || '',
      feature_type: plan_id,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      is_active: true,
      views: 0,
      clicks: 0,
      inquiries: 0,
      seller_name: profile?.display_name || profile?.username || 'Seller',
      seller_rating: profile?.seller_rating || 0,
      seller_sales: profile?.total_sales || 0,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    listing,
    plan,
    cost: plan.price,
    message: `Card featured for ${plan.duration_days} days`,
  });
}

// Renew listing
async function renewListing(userId: string, listingId: string, planId: string): Promise<NextResponse> {
  const plan = FEATURE_PLANS.find(p => p.id === planId);
  if (!plan) {
    return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 });
  }

  const { data: listing } = await supabase
    .from('cv_featured_listings')
    .select('end_date')
    .eq('id', listingId)
    .eq('user_id', userId)
    .single();

  if (!listing) {
    return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
  }

  // Extend from current end date or now, whichever is later
  const extendFrom = new Date(Math.max(new Date(listing.end_date).getTime(), Date.now()));
  const newEndDate = new Date(extendFrom.getTime() + plan.duration_days * 24 * 60 * 60 * 1000);

  const { error } = await supabase
    .from('cv_featured_listings')
    .update({
      feature_type: planId,
      end_date: newEndDate.toISOString(),
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', listingId);

  if (error) throw error;

  return NextResponse.json({
    success: true,
    new_end_date: newEndDate.toISOString(),
    cost: plan.price,
    message: `Listing renewed for ${plan.duration_days} more days`,
  });
}

// Cancel listing
async function cancelListing(userId: string, listingId: string): Promise<NextResponse> {
  const { error } = await supabase
    .from('cv_featured_listings')
    .update({
      is_active: false,
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', listingId)
    .eq('user_id', userId);

  if (error) throw error;

  return NextResponse.json({
    success: true,
    message: 'Listing cancelled',
  });
}

// Update listing
async function updateListing(userId: string, listingId: string, updates: Record<string, unknown>): Promise<NextResponse> {
  const allowedUpdates = ['price', 'description'];
  const filteredUpdates: Record<string, unknown> = {};
  
  for (const key of allowedUpdates) {
    if (updates[key] !== undefined) {
      filteredUpdates[key] = updates[key];
    }
  }
  filteredUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('cv_featured_listings')
    .update(filteredUpdates)
    .eq('id', listingId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    listing: data,
  });
}

// Record view
async function recordView(listingId: string): Promise<NextResponse> {
  await supabase.rpc('increment_listing_views', { listing_id: listingId });

  return NextResponse.json({ success: true });
}

// Record click
async function recordClick(listingId: string, userId: string): Promise<NextResponse> {
  await supabase.rpc('increment_listing_clicks', { listing_id: listingId });

  await supabase.from('cv_listing_clicks').insert({
    listing_id: listingId,
    user_id: userId,
    clicked_at: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}

// Create inquiry
async function createInquiry(listingId: string, userId: string, message: string): Promise<NextResponse> {
  const { data: listing } = await supabase
    .from('cv_featured_listings')
    .select('user_id, card_name')
    .eq('id', listingId)
    .single();

  if (!listing) {
    return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
  }

  await supabase.from('cv_listing_inquiries').insert({
    listing_id: listingId,
    seller_id: listing.user_id,
    buyer_id: userId,
    message,
    created_at: new Date().toISOString(),
  });

  await supabase.rpc('increment_listing_inquiries', { listing_id: listingId });

  return NextResponse.json({
    success: true,
    message: 'Inquiry sent to seller',
  });
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

// Helper: Generate daily stats
function generateDailyStats(startDate: string, endDate: string, totalViews: number, totalClicks: number): Array<{date: string; views: number; clicks: number}> {
  const stats = [];
  const start = new Date(startDate);
  const end = new Date(Math.min(new Date(endDate).getTime(), Date.now()));
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  let remainingViews = totalViews || 0;
  let remainingClicks = totalClicks || 0;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const dayViews = i === days - 1 ? remainingViews : Math.floor(remainingViews * Math.random() * 0.3);
    const dayClicks = i === days - 1 ? remainingClicks : Math.floor(remainingClicks * Math.random() * 0.3);
    
    stats.push({
      date: date.toISOString().split('T')[0],
      views: dayViews,
      clicks: dayClicks,
    });
    
    remainingViews -= dayViews;
    remainingClicks -= dayClicks;
  }
  
  return stats;
}

export const dynamic = 'force-dynamic';
