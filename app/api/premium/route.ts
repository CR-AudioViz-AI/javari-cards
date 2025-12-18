// ============================================================================
// PREMIUM FEATURES API
// Subscription management and premium feature access
// CravCards - CR AudioViz AI, LLC
// Created: December 17, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SubscriptionTier {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  limits: {
    cards: number;
    alerts: number;
    exports_per_month: number;
    api_calls_per_day: number;
    storage_mb: number;
  };
  badge: string;
  color: string;
}

interface UserSubscription {
  user_id: string;
  tier: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
}

interface FeatureAccess {
  feature: string;
  has_access: boolean;
  tier_required: string;
  usage: number;
  limit: number;
  upgrade_url: string | null;
}

// Subscription tiers configuration
const TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free Forever',
    price_monthly: 0,
    price_yearly: 0,
    features: [
      'Track up to 100 cards',
      '5 price alerts',
      'Basic analytics',
      'Community access',
      'Card scanner (10/month)',
    ],
    limits: {
      cards: 100,
      alerts: 5,
      exports_per_month: 2,
      api_calls_per_day: 100,
      storage_mb: 50,
    },
    badge: '🆓',
    color: '#6B7280',
  },
  {
    id: 'collector',
    name: 'Collector',
    price_monthly: 9.99,
    price_yearly: 99,
    features: [
      'Track up to 1,000 cards',
      '25 price alerts',
      'Advanced analytics',
      'Portfolio history (1 year)',
      'Card scanner (100/month)',
      'Export to CSV/PDF',
      'Priority support',
    ],
    limits: {
      cards: 1000,
      alerts: 25,
      exports_per_month: 10,
      api_calls_per_day: 1000,
      storage_mb: 500,
    },
    badge: '⭐',
    color: '#3B82F6',
  },
  {
    id: 'pro',
    name: 'Pro Collector',
    price_monthly: 24.99,
    price_yearly: 249,
    features: [
      'Unlimited cards',
      'Unlimited price alerts',
      'Full analytics suite',
      'Portfolio history (all time)',
      'Unlimited card scanning',
      'AI grading predictions',
      'Market predictions',
      'Trade matching',
      'API access',
      'White-label showcase',
      'Dedicated support',
    ],
    limits: {
      cards: -1, // unlimited
      alerts: -1,
      exports_per_month: -1,
      api_calls_per_day: 10000,
      storage_mb: 5000,
    },
    badge: '👑',
    color: '#8B5CF6',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price_monthly: 99.99,
    price_yearly: 999,
    features: [
      'Everything in Pro',
      'Multi-user accounts',
      'Custom branding',
      'Dedicated API',
      'SLA guarantee',
      'Custom integrations',
      'Account manager',
      'Training sessions',
    ],
    limits: {
      cards: -1,
      alerts: -1,
      exports_per_month: -1,
      api_calls_per_day: 100000,
      storage_mb: 50000,
    },
    badge: '🏢',
    color: '#F59E0B',
  },
];

// GET - Get subscription info, tiers, or feature access
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const action = searchParams.get('action') || 'tiers';
  const feature = searchParams.get('feature');

  try {
    switch (action) {
      case 'tiers':
        return getTiers();
      case 'subscription':
        if (!userId) return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
        return await getSubscription(userId);
      case 'check-feature':
        if (!userId || !feature) return NextResponse.json({ success: false, error: 'User ID and feature required' }, { status: 400 });
        return await checkFeatureAccess(userId, feature);
      case 'usage':
        if (!userId) return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
        return await getUsageStats(userId);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST - Manage subscriptions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, action } = body;

    if (!user_id) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    switch (action) {
      case 'create-checkout':
        return await createCheckoutSession(user_id, body.tier, body.billing_period);
      case 'cancel':
        return await cancelSubscription(user_id);
      case 'resume':
        return await resumeSubscription(user_id);
      case 'change-tier':
        return await changeTier(user_id, body.new_tier);
      case 'apply-promo':
        return await applyPromoCode(user_id, body.promo_code);
      case 'record-usage':
        return await recordUsage(user_id, body.feature, body.amount);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Get all available tiers
function getTiers(): NextResponse {
  return NextResponse.json({
    success: true,
    tiers: TIERS,
    comparison: {
      headers: ['Feature', 'Free', 'Collector', 'Pro', 'Enterprise'],
      rows: [
        ['Card Tracking', '100', '1,000', 'Unlimited', 'Unlimited'],
        ['Price Alerts', '5', '25', 'Unlimited', 'Unlimited'],
        ['Card Scanner', '10/mo', '100/mo', 'Unlimited', 'Unlimited'],
        ['Analytics', 'Basic', 'Advanced', 'Full Suite', 'Full Suite'],
        ['Portfolio History', '30 days', '1 year', 'All time', 'All time'],
        ['Exports', '2/mo', '10/mo', 'Unlimited', 'Unlimited'],
        ['API Access', '❌', '❌', '✅', '✅'],
        ['Trade Matching', '❌', '❌', '✅', '✅'],
        ['Market Predictions', '❌', '❌', '✅', '✅'],
        ['Support', 'Community', 'Email', 'Priority', 'Dedicated'],
      ],
    },
  });
}

// Get user's subscription
async function getSubscription(userId: string): Promise<NextResponse> {
  const { data: subscription } = await supabase
    .from('cv_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Default to free tier if no subscription
  const currentTier = subscription?.tier || 'free';
  const tierInfo = TIERS.find(t => t.id === currentTier) || TIERS[0];

  return NextResponse.json({
    success: true,
    subscription: subscription || {
      user_id: userId,
      tier: 'free',
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: null,
      cancel_at_period_end: false,
    },
    tier_info: tierInfo,
    is_premium: currentTier !== 'free',
  });
}

// Check feature access
async function checkFeatureAccess(userId: string, feature: string): Promise<NextResponse> {
  // Get user's tier
  const { data: subscription } = await supabase
    .from('cv_subscriptions')
    .select('tier')
    .eq('user_id', userId)
    .single();

  const currentTier = subscription?.tier || 'free';
  const tierIndex = TIERS.findIndex(t => t.id === currentTier);
  
  // Feature requirements mapping
  const featureRequirements: Record<string, number> = {
    'unlimited_cards': 2, // Pro
    'unlimited_alerts': 2,
    'api_access': 2,
    'trade_matching': 2,
    'market_predictions': 2,
    'advanced_analytics': 1, // Collector
    'portfolio_history': 1,
    'priority_support': 1,
    'export_pdf': 1,
    'card_scanner_unlimited': 2,
    'white_label': 2,
    'multi_user': 3, // Enterprise
    'custom_branding': 3,
    'sla_guarantee': 3,
  };

  const requiredTierIndex = featureRequirements[feature] ?? 0;
  const hasAccess = tierIndex >= requiredTierIndex;
  const requiredTier = TIERS[requiredTierIndex]?.name || 'Free';

  // Get usage if applicable
  const usage = await getFeatureUsage(userId, feature);
  const limit = getFeatureLimit(currentTier, feature);

  const access: FeatureAccess = {
    feature,
    has_access: hasAccess && (limit === -1 || usage < limit),
    tier_required: requiredTier,
    usage,
    limit,
    upgrade_url: hasAccess ? null : '/pricing',
  };

  return NextResponse.json({
    success: true,
    access,
    current_tier: currentTier,
  });
}

// Get usage statistics
async function getUsageStats(userId: string): Promise<NextResponse> {
  const { data: subscription } = await supabase
    .from('cv_subscriptions')
    .select('tier')
    .eq('user_id', userId)
    .single();

  const currentTier = subscription?.tier || 'free';
  const tierInfo = TIERS.find(t => t.id === currentTier) || TIERS[0];

  // Get actual usage
  const { count: cardCount } = await supabase
    .from('cv_user_cards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const { count: alertCount } = await supabase
    .from('cv_price_alerts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_active', true);

  const { data: monthlyUsage } = await supabase
    .from('cv_usage_log')
    .select('feature, amount')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const exports = monthlyUsage?.filter(u => u.feature === 'export').reduce((sum, u) => sum + u.amount, 0) || 0;
  const scans = monthlyUsage?.filter(u => u.feature === 'scan').reduce((sum, u) => sum + u.amount, 0) || 0;

  return NextResponse.json({
    success: true,
    usage: {
      cards: { used: cardCount || 0, limit: tierInfo.limits.cards },
      alerts: { used: alertCount || 0, limit: tierInfo.limits.alerts },
      exports: { used: exports, limit: tierInfo.limits.exports_per_month },
      scans: { used: scans, limit: tierInfo.limits.cards === -1 ? -1 : tierInfo.limits.cards * 10 },
      storage_mb: { used: 0, limit: tierInfo.limits.storage_mb },
    },
    tier: currentTier,
    tier_info: tierInfo,
  });
}

// Create Stripe checkout session
async function createCheckoutSession(userId: string, tier: string, billingPeriod: 'monthly' | 'yearly'): Promise<NextResponse> {
  const tierInfo = TIERS.find(t => t.id === tier);
  
  if (!tierInfo || tier === 'free') {
    return NextResponse.json({
      success: false,
      error: 'Invalid tier selected',
    }, { status: 400 });
  }

  // In production, this would create a real Stripe checkout session
  // For now, return a mock checkout URL
  const price = billingPeriod === 'yearly' ? tierInfo.price_yearly : tierInfo.price_monthly;
  
  return NextResponse.json({
    success: true,
    checkout_url: `/checkout?tier=${tier}&period=${billingPeriod}&price=${price}`,
    tier: tierInfo,
    billing_period: billingPeriod,
    price,
    message: 'Redirect user to checkout URL',
  });
}

// Cancel subscription
async function cancelSubscription(userId: string): Promise<NextResponse> {
  const { error } = await supabase
    .from('cv_subscriptions')
    .update({
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) throw error;

  return NextResponse.json({
    success: true,
    message: 'Subscription will cancel at end of billing period',
  });
}

// Resume cancelled subscription
async function resumeSubscription(userId: string): Promise<NextResponse> {
  const { error } = await supabase
    .from('cv_subscriptions')
    .update({
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) throw error;

  return NextResponse.json({
    success: true,
    message: 'Subscription resumed',
  });
}

// Change subscription tier
async function changeTier(userId: string, newTier: string): Promise<NextResponse> {
  const tierInfo = TIERS.find(t => t.id === newTier);
  
  if (!tierInfo) {
    return NextResponse.json({
      success: false,
      error: 'Invalid tier',
    }, { status: 400 });
  }

  // In production, this would handle proration through Stripe
  const { error } = await supabase
    .from('cv_subscriptions')
    .update({
      tier: newTier,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) throw error;

  return NextResponse.json({
    success: true,
    new_tier: tierInfo,
    message: `Subscription changed to ${tierInfo.name}`,
  });
}

// Apply promo code
async function applyPromoCode(userId: string, promoCode: string): Promise<NextResponse> {
  // Check promo code validity
  const { data: promo } = await supabase
    .from('cv_promo_codes')
    .select('*')
    .eq('code', promoCode.toUpperCase())
    .eq('is_active', true)
    .single();

  if (!promo) {
    return NextResponse.json({
      success: false,
      error: 'Invalid or expired promo code',
    }, { status: 400 });
  }

  // Check if already used
  const { data: used } = await supabase
    .from('cv_promo_usage')
    .select('id')
    .eq('user_id', userId)
    .eq('promo_code', promoCode.toUpperCase())
    .single();

  if (used) {
    return NextResponse.json({
      success: false,
      error: 'Promo code already used',
    }, { status: 400 });
  }

  // Apply promo
  await supabase.from('cv_promo_usage').insert({
    user_id: userId,
    promo_code: promoCode.toUpperCase(),
    discount_percent: promo.discount_percent,
    applied_at: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    discount: promo.discount_percent,
    message: `${promo.discount_percent}% discount applied!`,
  });
}

// Record feature usage
async function recordUsage(userId: string, feature: string, amount: number): Promise<NextResponse> {
  await supabase.from('cv_usage_log').insert({
    user_id: userId,
    feature,
    amount: amount || 1,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    message: 'Usage recorded',
  });
}

// Helper: Get feature usage
async function getFeatureUsage(userId: string, feature: string): Promise<number> {
  const { data } = await supabase
    .from('cv_usage_log')
    .select('amount')
    .eq('user_id', userId)
    .eq('feature', feature)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  return data?.reduce((sum, u) => sum + u.amount, 0) || 0;
}

// Helper: Get feature limit for tier
function getFeatureLimit(tier: string, feature: string): number {
  const tierInfo = TIERS.find(t => t.id === tier) || TIERS[0];
  
  const limitMapping: Record<string, keyof typeof tierInfo.limits> = {
    'cards': 'cards',
    'alerts': 'alerts',
    'exports': 'exports_per_month',
    'api_calls': 'api_calls_per_day',
    'storage': 'storage_mb',
  };

  const limitKey = limitMapping[feature];
  return limitKey ? tierInfo.limits[limitKey] : 0;
}

export const dynamic = 'force-dynamic';
