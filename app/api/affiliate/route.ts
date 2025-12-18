// ============================================================================
// AFFILIATE INTEGRATION API
// TCGPlayer, eBay, and other marketplace buy links with commission tracking
// CravCards - CR AudioViz AI, LLC
// Created: December 17, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface AffiliateLink {
  marketplace: string;
  url: string;
  price: number | null;
  condition: string;
  seller_rating: number | null;
  shipping: string;
  in_stock: boolean;
  affiliate_id: string;
}

interface MarketplaceListing {
  marketplace: string;
  title: string;
  price: number;
  shipping_cost: number;
  condition: string;
  seller: string;
  seller_rating: number;
  url: string;
  image_url: string | null;
  quantity_available: number;
}

interface AffiliateConfig {
  tcgplayer: { affiliate_id: string; enabled: boolean };
  ebay: { campaign_id: string; enabled: boolean };
  amazon: { tag: string; enabled: boolean };
  cardmarket: { affiliate_id: string; enabled: boolean };
}

// Affiliate configuration
const AFFILIATE_CONFIG: AffiliateConfig = {
  tcgplayer: {
    affiliate_id: process.env.TCGPLAYER_AFFILIATE_ID || 'cravcards',
    enabled: true,
  },
  ebay: {
    campaign_id: process.env.EBAY_CAMPAIGN_ID || '5338000000',
    enabled: true,
  },
  amazon: {
    tag: process.env.AMAZON_AFFILIATE_TAG || 'cravcards-20',
    enabled: true,
  },
  cardmarket: {
    affiliate_id: process.env.CARDMARKET_AFFILIATE_ID || 'cravcards',
    enabled: false, // EU only
  },
};

// GET - Get affiliate links or listings
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cardId = searchParams.get('card_id');
  const cardName = searchParams.get('name');
  const category = searchParams.get('category');
  const action = searchParams.get('action') || 'links';
  const marketplace = searchParams.get('marketplace');

  if (!cardId && !cardName) {
    return NextResponse.json({
      success: false,
      error: 'Card ID or name required',
    }, { status: 400 });
  }

  try {
    switch (action) {
      case 'links':
        return await getAffiliateLinks(cardId, cardName, category);
      case 'listings':
        return await getMarketplaceListings(cardId, cardName, category, marketplace);
      case 'best-price':
        return await getBestPrice(cardId, cardName, category);
      case 'track-click':
        return await trackClick(searchParams.get('user_id'), cardId, marketplace);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST - Track conversions or manage affiliate settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'track-conversion':
        return await trackConversion(body);
      case 'webhook':
        return await handleAffiliateWebhook(body);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Get affiliate links for all marketplaces
async function getAffiliateLinks(
  cardId: string | null,
  cardName: string | null,
  category: string | null
): Promise<NextResponse> {
  const name = cardName || await getCardName(cardId);
  const searchQuery = encodeURIComponent(name || '');
  
  const links: AffiliateLink[] = [];

  // TCGPlayer
  if (AFFILIATE_CONFIG.tcgplayer.enabled) {
    const tcgCategory = mapCategoryToTCGPlayer(category);
    links.push({
      marketplace: 'TCGPlayer',
      url: `https://www.tcgplayer.com/search/all/product?q=${searchQuery}&partner=${AFFILIATE_CONFIG.tcgplayer.affiliate_id}&utm_campaign=affiliate&utm_medium=cravcards&utm_source=cravcards${tcgCategory ? `&productLineName=${tcgCategory}` : ''}`,
      price: await getTCGPlayerPrice(name, category),
      condition: 'Various',
      seller_rating: null,
      shipping: 'Varies',
      in_stock: true,
      affiliate_id: AFFILIATE_CONFIG.tcgplayer.affiliate_id,
    });
  }

  // eBay
  if (AFFILIATE_CONFIG.ebay.enabled) {
    links.push({
      marketplace: 'eBay',
      url: `https://www.ebay.com/sch/i.html?_nkw=${searchQuery}&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=${AFFILIATE_CONFIG.ebay.campaign_id}&toolid=10001&mkevt=1`,
      price: null,
      condition: 'Various',
      seller_rating: null,
      shipping: 'Varies',
      in_stock: true,
      affiliate_id: AFFILIATE_CONFIG.ebay.campaign_id,
    });
  }

  // Amazon (for accessories, supplies, sealed products)
  if (AFFILIATE_CONFIG.amazon.enabled) {
    links.push({
      marketplace: 'Amazon',
      url: `https://www.amazon.com/s?k=${searchQuery}&tag=${AFFILIATE_CONFIG.amazon.tag}`,
      price: null,
      condition: 'New',
      seller_rating: null,
      shipping: 'Prime eligible',
      in_stock: true,
      affiliate_id: AFFILIATE_CONFIG.amazon.tag,
    });
  }

  // CardMarket (EU)
  if (AFFILIATE_CONFIG.cardmarket.enabled) {
    links.push({
      marketplace: 'CardMarket',
      url: `https://www.cardmarket.com/en/Search?searchString=${searchQuery}&ref=${AFFILIATE_CONFIG.cardmarket.affiliate_id}`,
      price: null,
      condition: 'Various',
      seller_rating: null,
      shipping: 'EU shipping',
      in_stock: true,
      affiliate_id: AFFILIATE_CONFIG.cardmarket.affiliate_id,
    });
  }

  return NextResponse.json({
    success: true,
    card_name: name,
    category,
    links,
    disclaimer: 'Prices shown are estimates. Click through for current pricing. CravCards earns a commission on purchases.',
  });
}

// Get detailed marketplace listings
async function getMarketplaceListings(
  cardId: string | null,
  cardName: string | null,
  category: string | null,
  marketplace: string | null
): Promise<NextResponse> {
  const name = cardName || await getCardName(cardId);
  
  // In production, this would call marketplace APIs
  // For now, generate sample listings
  const listings = generateSampleListings(name || 'Unknown Card', category, marketplace);

  return NextResponse.json({
    success: true,
    card_name: name,
    listings,
    total: listings.length,
    lowest_price: listings.length > 0 ? Math.min(...listings.map(l => l.price + l.shipping_cost)) : null,
    generated: true, // Remove in production
  });
}

// Get best price across all marketplaces
async function getBestPrice(
  cardId: string | null,
  cardName: string | null,
  category: string | null
): Promise<NextResponse> {
  const name = cardName || await getCardName(cardId);
  const listings = generateSampleListings(name || 'Unknown Card', category, null);
  
  // Sort by total price
  listings.sort((a, b) => (a.price + a.shipping_cost) - (b.price + b.shipping_cost));
  
  const best = listings[0];
  const priceComparison = listings.slice(0, 5).map(l => ({
    marketplace: l.marketplace,
    price: l.price,
    shipping: l.shipping_cost,
    total: l.price + l.shipping_cost,
    url: l.url,
  }));

  return NextResponse.json({
    success: true,
    card_name: name,
    best_price: best ? {
      marketplace: best.marketplace,
      price: best.price,
      shipping: best.shipping_cost,
      total: best.price + best.shipping_cost,
      url: best.url,
      savings: listings.length > 1 
        ? (listings[listings.length - 1].price + listings[listings.length - 1].shipping_cost) - (best.price + best.shipping_cost)
        : 0,
    } : null,
    comparison: priceComparison,
  });
}

// Track affiliate link click
async function trackClick(
  userId: string | null,
  cardId: string | null,
  marketplace: string | null
): Promise<NextResponse> {
  await supabase.from('cv_affiliate_clicks').insert({
    user_id: userId,
    card_id: cardId,
    marketplace,
    clicked_at: new Date().toISOString(),
    ip_hash: null, // Could hash IP for analytics
  });

  return NextResponse.json({
    success: true,
    tracked: true,
  });
}

// Track conversion (called by affiliate network webhooks)
async function trackConversion(body: Record<string, unknown>): Promise<NextResponse> {
  const { order_id, marketplace, amount, commission, user_id, card_id } = body;

  await supabase.from('cv_affiliate_conversions').insert({
    order_id,
    marketplace,
    order_amount: amount,
    commission_amount: commission,
    user_id,
    card_id,
    converted_at: new Date().toISOString(),
    status: 'pending',
  });

  return NextResponse.json({
    success: true,
    message: 'Conversion tracked',
  });
}

// Handle affiliate network webhooks
async function handleAffiliateWebhook(body: Record<string, unknown>): Promise<NextResponse> {
  const { network, event_type, data } = body;

  // Log webhook
  await supabase.from('cv_affiliate_webhooks').insert({
    network,
    event_type,
    payload: data,
    received_at: new Date().toISOString(),
  });

  // Process based on event type
  if (event_type === 'sale') {
    await trackConversion(data as Record<string, unknown>);
  }

  return NextResponse.json({
    success: true,
    processed: true,
  });
}

// Helper: Get card name from ID
async function getCardName(cardId: string | null): Promise<string | null> {
  if (!cardId) return null;
  
  const { data } = await supabase
    .from('cv_cards_master')
    .select('name')
    .eq('card_id', cardId)
    .single();

  return data?.name || null;
}

// Helper: Map category to TCGPlayer product line
function mapCategoryToTCGPlayer(category: string | null): string | null {
  const mapping: Record<string, string> = {
    'pokemon': 'Pokemon',
    'mtg': 'Magic',
    'yugioh': 'YuGiOh',
    'sports': 'Sports Cards',
    'lorcana': 'Disney Lorcana',
  };
  return category ? mapping[category] || null : null;
}

// Helper: Get TCGPlayer price estimate
async function getTCGPlayerPrice(cardName: string | null, category: string | null): Promise<number | null> {
  if (!cardName) return null;
  
  // In production, this would call TCGPlayer API
  // For now, return estimate based on card type
  const basePrice = category === 'mtg' ? 15 : category === 'pokemon' ? 12 : 10;
  return basePrice + Math.random() * 30;
}

// Helper: Generate sample listings
function generateSampleListings(
  cardName: string,
  category: string | null,
  marketplace: string | null
): MarketplaceListing[] {
  const marketplaces = marketplace 
    ? [marketplace] 
    : ['TCGPlayer', 'eBay', 'CardMarket', 'Troll and Toad'];
  
  const conditions = ['Near Mint', 'Lightly Played', 'Moderately Played'];
  const listings: MarketplaceListing[] = [];

  const basePrice = category === 'mtg' ? 25 : category === 'pokemon' ? 20 : 15;

  for (const mp of marketplaces) {
    const numListings = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numListings; i++) {
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const conditionMultiplier = condition === 'Near Mint' ? 1 : condition === 'Lightly Played' ? 0.85 : 0.7;
      const price = (basePrice + Math.random() * 20) * conditionMultiplier;
      
      listings.push({
        marketplace: mp,
        title: `${cardName}${condition !== 'Near Mint' ? ` - ${condition}` : ''}`,
        price: Math.round(price * 100) / 100,
        shipping_cost: mp === 'TCGPlayer' ? 0.99 : mp === 'eBay' ? 4.99 : 3.99,
        condition,
        seller: `Seller${Math.floor(Math.random() * 1000)}`,
        seller_rating: 95 + Math.random() * 5,
        url: generateAffiliateUrl(mp, cardName),
        image_url: null,
        quantity_available: 1 + Math.floor(Math.random() * 5),
      });
    }
  }

  return listings.sort((a, b) => (a.price + a.shipping_cost) - (b.price + b.shipping_cost));
}

// Helper: Generate affiliate URL
function generateAffiliateUrl(marketplace: string, cardName: string): string {
  const encoded = encodeURIComponent(cardName);
  
  switch (marketplace) {
    case 'TCGPlayer':
      return `https://www.tcgplayer.com/search/all/product?q=${encoded}&partner=${AFFILIATE_CONFIG.tcgplayer.affiliate_id}`;
    case 'eBay':
      return `https://www.ebay.com/sch/i.html?_nkw=${encoded}&campid=${AFFILIATE_CONFIG.ebay.campaign_id}`;
    case 'Amazon':
      return `https://www.amazon.com/s?k=${encoded}&tag=${AFFILIATE_CONFIG.amazon.tag}`;
    default:
      return `https://www.google.com/search?q=${encoded}+buy`;
  }
}

export const dynamic = 'force-dynamic';
