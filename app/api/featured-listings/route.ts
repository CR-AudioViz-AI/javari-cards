// ============================================================================
// FEATURED LISTINGS API
// Marketplace boost options for sellers
// CravCards - CR AudioViz AI, LLC
// Created: December 17, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface BoostPackage {
  id: string;
  name: string;
  description: string;
  duration_days: number;
  price: number;
  features: string[];
  visibility_multiplier: number;
  badge: string;
  color: string;
}

interface FeaturedListing {
  id: string;
  user_id: string;
  card_id: string;
  card_name: string;
  category: string;
  image_url: string | null;
  asking_price: number;
  condition: string;
  description: string;
  boost_package: string;
  boost_start: string;
  boost_end: string;
  views: number;
  inquiries: number;
  is_active: boolean;
  seller: {
    username: string;
    rating: number;
    total_sales: number;
  };
}

const BOOST_PACKAGES: BoostPackage[] = [
  {
    id: 'basic',
    name: 'Basic Boost',
    description: 'Get noticed with basic highlighting',
    duration_days: 7,
    price: 2.99,
    features: [
      'Highlighted border',
      '2x visibility in search',
      'Basic analytics',
    ],
    visibility_multiplier: 2,
    badge: '⭐',
    color: 'blue',
  },
  {
    id: 'premium',
    name: 'Premium Boost',
    description: 'Stand out with premium placement',
    duration_days: 14,
    price: 7.99,
    features: [
      'Premium gold border',
      '5x visibility in search',
      'Featured on category page',
      'Priority in recommendations',
      'Detailed analytics',
    ],
    visibility_multiplier: 5,
    badge: '💫',
    color: 'gold',
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    description: 'Maximum exposure for high-value cards',
    duration_days: 30,
    price: 19.99,
    features: [
      'Spotlight animation',
      '10x visibility in search',
      'Homepage feature rotation',
      'Featured in newsletter',
      'Social media promotion',
      'Complete analytics suite',
      'Dedicated support',
    ],
    visibility_multiplier: 10,
    badge: '🔥',
    color: 'red',
  },
];

// GET - Get featured listings or packages
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'browse';
  const category = searchParams.get('category');
  const userId = searchParams.get('user_id');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    switch (action) {
      case 'packages':
        return getBoostPackages();
      case 'browse':
        return browseFeaturedListings(category, limit);
      case 'my-listings':
        if (!userId) {
          return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
        }
        return getMyListings(userId);
      case 'stats':
        const listingId = searchParams.get('listing_id');
        if (!listingId) {
          return NextResponse.json({ success: false, error: 'Listing ID required' }, { status: 400 });
        }
        return getListingStats(listingId, userId);
      case 'homepage':
        return getHomepageFeatured();
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
    const { action, user_id } = body;

    if (!user_id) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    switch (action) {
      case 'create':
        return await createFeaturedListing(user_id, body);
      case 'boost':
        return await boostListing(user_id, body);
      case 'update':
        return await updateListing(user_id, body);
      case 'end':
        return await endListing(user_id, body.listing_id);
      case 'renew':
        return await renewBoost(user_id, body);
      case 'inquiry':
        return await sendInquiry(body);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Get available boost packages
function getBoostPackages(): NextResponse {
  return NextResponse.json({
    success: true,
    packages: BOOST_PACKAGES,
    comparison: {
      headers: ['Feature', 'Basic', 'Premium', 'Spotlight'],
      rows: [
        ['Duration', '7 days', '14 days', '30 days'],
        ['Price', '$2.99', '$7.99', '$19.99'],
        ['Visibility Boost', '2x', '5x', '10x'],
        ['Search Priority', '✅', '✅', '✅'],
        ['Category Feature', '❌', '✅', '✅'],
        ['Homepage Feature', '❌', '❌', '✅'],
        ['Newsletter', '❌', '❌', '✅'],
        ['Social Promo', '❌', '❌', '✅'],
      ],
    },
    tips: [
      'Higher-value cards benefit most from Spotlight',
      'Premium is best for mid-range cards',
      'Basic works great for completing sales quickly',
    ],
  });
}

// Browse featured listings
async function browseFeaturedListings(category: string | null, limit: number): Promise<NextResponse> {
  let query = supabase
    .from('cv_featured_listings')
    .select('*')
    .eq('is_active', true)
    .gt('boost_end', new Date().toISOString())
    .order('boost_package', { ascending: false }) // Spotlight first
    .order('created_at', { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq('category', category);
  }

  const { data: listings, error } = await query;

  // Generate sample data if none exists
  if (!listings || listings.length === 0) {
    const sampleListings = generateSampleListings(category, limit);
    return NextResponse.json({
      success: true,
      listings: sampleListings,
      total: sampleListings.length,
      sample_data: true,
    });
  }

  // Enrich with seller info
  const enrichedListings = await Promise.all(
    listings.map(async (listing) => {
      const seller = await getSellerInfo(listing.user_id);
      return {
        ...listing,
        seller,
        boost_badge: BOOST_PACKAGES.find(p => p.id === listing.boost_package)?.badge || '',
      };
    })
  );

  return NextResponse.json({
    success: true,
    listings: enrichedListings,
    total: enrichedListings.length,
  });
}

// Get user's listings
async function getMyListings(userId: string): Promise<NextResponse> {
  const { data: listings } = await supabase
    .from('cv_featured_listings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const active = listings?.filter(l => l.is_active && new Date(l.boost_end) > new Date()) || [];
  const expired = listings?.filter(l => !l.is_active || new Date(l.boost_end) <= new Date()) || [];

  // Calculate stats
  const totalViews = listings?.reduce((sum, l) => sum + (l.views || 0), 0) || 0;
  const totalInquiries = listings?.reduce((sum, l) => sum + (l.inquiries || 0), 0) || 0;
  const totalSpent = listings?.reduce((sum, l) => {
    const pkg = BOOST_PACKAGES.find(p => p.id === l.boost_package);
    return sum + (pkg?.price || 0);
  }, 0) || 0;

  return NextResponse.json({
    success: true,
    active_listings: active,
    expired_listings: expired.slice(0, 10),
    stats: {
      total_listings: listings?.length || 0,
      active_count: active.length,
      total_views: totalViews,
      total_inquiries: totalInquiries,
      total_spent: Math.round(totalSpent * 100) / 100,
      avg_views_per_listing: listings?.length ? Math.round(totalViews / listings.length) : 0,
    },
  });
}

// Get listing stats
async function getListingStats(listingId: string, userId: string | null): Promise<NextResponse> {
  const { data: listing } = await supabase
    .from('cv_featured_listings')
    .select('*')
    .eq('id', listingId)
    .single();

  if (!listing) {
    return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
  }

  // Verify ownership if userId provided
  if (userId && listing.user_id !== userId) {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }

  // Get daily views
  const { data: dailyViews } = await supabase
    .from('cv_listing_views')
    .select('viewed_at')
    .eq('listing_id', listingId)
    .gte('viewed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  // Aggregate by day
  const viewsByDay: Record<string, number> = {};
  dailyViews?.forEach(v => {
    const day = v.viewed_at.split('T')[0];
    viewsByDay[day] = (viewsByDay[day] || 0) + 1;
  });

  const boostPackage = BOOST_PACKAGES.find(p => p.id === listing.boost_package);
  const daysRemaining = Math.max(0, Math.ceil((new Date(listing.boost_end).getTime() - Date.now()) / (24 * 60 * 60 * 1000)));

  return NextResponse.json({
    success: true,
    listing,
    stats: {
      total_views: listing.views || 0,
      total_inquiries: listing.inquiries || 0,
      conversion_rate: listing.views ? ((listing.inquiries || 0) / listing.views * 100).toFixed(2) : 0,
      views_by_day: viewsByDay,
      days_remaining: daysRemaining,
      boost_package: boostPackage,
      estimated_impressions: (listing.views || 0) * (boostPackage?.visibility_multiplier || 1),
    },
  });
}

// Get homepage featured listings
async function getHomepageFeatured(): Promise<NextResponse> {
  // Get spotlight listings for homepage
  const { data: spotlights } = await supabase
    .from('cv_featured_listings')
    .select('*')
    .eq('is_active', true)
    .eq('boost_package', 'spotlight')
    .gt('boost_end', new Date().toISOString())
    .order('views', { ascending: false })
    .limit(6);

  // Get category highlights
  const categories = ['pokemon', 'mtg', 'sports', 'yugioh'];
  const categoryHighlights: Record<string, FeaturedListing[]> = {};

  for (const cat of categories) {
    const { data: catListings } = await supabase
      .from('cv_featured_listings')
      .select('*')
      .eq('is_active', true)
      .eq('category', cat)
      .gt('boost_end', new Date().toISOString())
      .order('boost_package', { ascending: false })
      .limit(4);

    categoryHighlights[cat] = catListings || [];
  }

  return NextResponse.json({
    success: true,
    spotlight: spotlights || generateSampleListings(null, 6),
    by_category: categoryHighlights,
  });
}

// Create featured listing
async function createFeaturedListing(userId: string, body: Record<string, unknown>): Promise<NextResponse> {
  const { card_id, card_name, category, image_url, asking_price, condition, description, boost_package } = body;

  if (!card_id || !asking_price || !boost_package) {
    return NextResponse.json({
      success: false,
      error: 'card_id, asking_price, and boost_package required',
    }, { status: 400 });
  }

  const pkg = BOOST_PACKAGES.find(p => p.id === boost_package);
  if (!pkg) {
    return NextResponse.json({ success: false, error: 'Invalid boost package' }, { status: 400 });
  }

  // Calculate boost end date
  const boostEnd = new Date();
  boostEnd.setDate(boostEnd.getDate() + pkg.duration_days);

  const { data: listing, error } = await supabase
    .from('cv_featured_listings')
    .insert({
      user_id: userId,
      card_id,
      card_name: card_name || 'Unknown Card',
      category: category || 'other',
      image_url,
      asking_price,
      condition: condition || 'nm',
      description: description || '',
      boost_package,
      boost_start: new Date().toISOString(),
      boost_end: boostEnd.toISOString(),
      views: 0,
      inquiries: 0,
      is_active: true,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    listing,
    package: pkg,
    message: `Listing created with ${pkg.name}! Active for ${pkg.duration_days} days.`,
    charge: pkg.price,
  });
}

// Boost an existing listing
async function boostListing(userId: string, body: Record<string, unknown>): Promise<NextResponse> {
  const { listing_id, boost_package } = body;

  const pkg = BOOST_PACKAGES.find(p => p.id === boost_package);
  if (!pkg) {
    return NextResponse.json({ success: false, error: 'Invalid boost package' }, { status: 400 });
  }

  const boostEnd = new Date();
  boostEnd.setDate(boostEnd.getDate() + pkg.duration_days);

  const { data: listing, error } = await supabase
    .from('cv_featured_listings')
    .update({
      boost_package,
      boost_start: new Date().toISOString(),
      boost_end: boostEnd.toISOString(),
      is_active: true,
    })
    .eq('id', listing_id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    listing,
    package: pkg,
    message: `Listing boosted with ${pkg.name}!`,
    charge: pkg.price,
  });
}

// Update listing
async function updateListing(userId: string, body: Record<string, unknown>): Promise<NextResponse> {
  const { listing_id, asking_price, condition, description } = body;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (asking_price !== undefined) updates.asking_price = asking_price;
  if (condition !== undefined) updates.condition = condition;
  if (description !== undefined) updates.description = description;

  const { data: listing, error } = await supabase
    .from('cv_featured_listings')
    .update(updates)
    .eq('id', listing_id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    listing,
    message: 'Listing updated',
  });
}

// End listing early
async function endListing(userId: string, listingId: string): Promise<NextResponse> {
  const { error } = await supabase
    .from('cv_featured_listings')
    .update({
      is_active: false,
      ended_at: new Date().toISOString(),
    })
    .eq('id', listingId)
    .eq('user_id', userId);

  if (error) throw error;

  return NextResponse.json({
    success: true,
    message: 'Listing ended',
  });
}

// Renew boost
async function renewBoost(userId: string, body: Record<string, unknown>): Promise<NextResponse> {
  const { listing_id, boost_package } = body;

  // Get current listing
  const { data: current } = await supabase
    .from('cv_featured_listings')
    .select('boost_end')
    .eq('id', listing_id)
    .eq('user_id', userId)
    .single();

  if (!current) {
    return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
  }

  const pkg = BOOST_PACKAGES.find(p => p.id === (boost_package || 'basic'));
  if (!pkg) {
    return NextResponse.json({ success: false, error: 'Invalid boost package' }, { status: 400 });
  }

  // Extend from current end date
  const currentEnd = new Date(current.boost_end);
  const newEnd = new Date(Math.max(currentEnd.getTime(), Date.now()));
  newEnd.setDate(newEnd.getDate() + pkg.duration_days);

  const { data: listing, error } = await supabase
    .from('cv_featured_listings')
    .update({
      boost_package: boost_package || 'basic',
      boost_end: newEnd.toISOString(),
      is_active: true,
    })
    .eq('id', listing_id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    listing,
    message: `Boost renewed! New end date: ${newEnd.toLocaleDateString()}`,
    charge: pkg.price,
  });
}

// Send inquiry
async function sendInquiry(body: Record<string, unknown>): Promise<NextResponse> {
  const { listing_id, buyer_id, message } = body;

  // Update inquiry count
  await supabase.rpc('increment_inquiries', { listing_id });

  // Create inquiry record
  const { data: inquiry, error } = await supabase
    .from('cv_listing_inquiries')
    .insert({
      listing_id,
      buyer_id,
      message,
      sent_at: new Date().toISOString(),
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    inquiry,
    message: 'Inquiry sent to seller',
  });
}

// Helper: Get seller info
async function getSellerInfo(userId: string): Promise<{ username: string; rating: number; total_sales: number }> {
  const { data: profile } = await supabase
    .from('cv_user_profiles')
    .select('username, seller_rating, total_sales')
    .eq('user_id', userId)
    .single();

  return {
    username: profile?.username || 'Seller',
    rating: profile?.seller_rating || 4.5,
    total_sales: profile?.total_sales || 0,
  };
}

// Helper: Generate sample listings
function generateSampleListings(category: string | null, limit: number): FeaturedListing[] {
  const categories = category ? [category] : ['pokemon', 'mtg', 'sports', 'yugioh'];
  const cardNames: Record<string, string[]> = {
    pokemon: ['Charizard VMAX', 'Pikachu VMAX', 'Umbreon VMAX Alt Art', 'Mew ex SAR'],
    mtg: ['Black Lotus', 'Mox Ruby', 'Force of Will', 'Ragavan'],
    sports: ['Michael Jordan RC', 'Tom Brady RC', 'LeBron James RC', 'Wembanyama RC'],
    yugioh: ['Blue-Eyes White Dragon', 'Dark Magician', 'Exodia', 'Starlight Rare'],
  };

  const listings: FeaturedListing[] = [];
  const packages = ['spotlight', 'premium', 'basic'];

  for (let i = 0; i < limit; i++) {
    const cat = categories[i % categories.length];
    const names = cardNames[cat] || cardNames.pokemon;
    const name = names[i % names.length];
    const pkg = packages[i % packages.length];
    const pkgDetails = BOOST_PACKAGES.find(p => p.id === pkg)!;

    const boostEnd = new Date();
    boostEnd.setDate(boostEnd.getDate() + Math.floor(Math.random() * pkgDetails.duration_days));

    listings.push({
      id: `sample-${i}`,
      user_id: `seller-${i}`,
      card_id: `${cat}-${name.toLowerCase().replace(/\s+/g, '-')}`,
      card_name: name,
      category: cat,
      image_url: null,
      asking_price: 50 + Math.random() * 500,
      condition: 'nm',
      description: `High-quality ${name} for sale. Excellent condition.`,
      boost_package: pkg,
      boost_start: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      boost_end: boostEnd.toISOString(),
      views: Math.floor(Math.random() * 500),
      inquiries: Math.floor(Math.random() * 20),
      is_active: true,
      seller: {
        username: `collector${i + 1}`,
        rating: 4.5 + Math.random() * 0.5,
        total_sales: Math.floor(Math.random() * 100),
      },
    });
  }

  return listings;
}

export const dynamic = 'force-dynamic';
