// ============================================================================
// PREMIUM FEATURES API
// Advanced analytics and features for paid subscription tiers
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
    scan_credits_per_month: number;
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
  features_used: {
    cards: number;
    alerts: number;
    exports_this_month: number;
    api_calls_today: number;
    scans_this_month: number;
  };
}

const TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free Forever',
    price_monthly: 0,
    price_yearly: 0,
    features: [
      'Track up to 100 cards',
      '5 price alerts',
      'Basic portfolio tracking',
      'Community access',
      '3 card scans per month',
    ],
    limits: {
      cards: 100,
      alerts: 5,
      exports_per_month: 1,
      api_calls_per_day: 100,
      scan_credits_per_month: 3,
    },
    badge: '🎴',
    color: 'gray',
  },
  {
    id: 'collector',
    name: 'Collector',
    price_monthly: 4.99,
    price_yearly: 49.99,
    features: [
      'Track up to 1,000 cards',
      '25 price alerts',
      'Advanced portfolio analytics',
      'Price history charts',
      'Set completion tracking',
      'Export to CSV/PDF',
      '25 card scans per month',
      'Priority support',
    ],
    limits: {
      cards: 1000,
      alerts: 25,
      exports_per_month: 10,
      api_calls_per_day: 1000,
      scan_credits_per_month: 25,
    },
    badge: '⭐',
    color: 'blue',
  },
  {
    id: 'pro',
    name: 'Pro Collector',
    price_monthly: 9.99,
    price_yearly: 99.99,
    features: [
      'Track up to 10,000 cards',
      '100 price alerts',
      'AI market predictions',
      'Advanced condition grading',
      'Trade matching',
      'Public showcase page',
      'Unlimited exports',
      '100 card scans per month',
      'API access',
      'Priority support',
    ],
    limits: {
      cards: 10000,
      alerts: 100,
      exports_per_month: -1, // Unlimited
      api_calls_per_day: 5000,
      scan_credits_per_month: 100,
    },
    badge: '💎',
    color: 'purple',
  },
  {
    id: 'dealer',
    name: 'Dealer',
    price_monthly: 29.99,
    price_yearly: 299.99,
    features: [
      'Unlimited cards',
      'Unlimited price alerts',
      'All Pro features',
      'Inventory management',
      'Bulk import/export',
      'Sales tracking',
      'Customer management',
      'Invoice generation',
      'Unlimited scans',
      'White-label reports',
      'Dedicated support',
    ],
    limits: {
      cards: -1, // Unlimited
      alerts: -1,
      exports_per_month: -1,
      api_calls_per_day: 50000,
      scan_credits_per_month: -1,
    },
    badge: '👑',
    color: 'gold',
  },
];

// GET - Get subscription info, tiers, or feature access
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const action = searchParams.get('action') || 'tiers';

  try {
    switch (action) {
      case 'tiers':
        return getTiers();
      case 'subscription':
        if (!userId) {
          return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
        }
        return getSubscription(userId);
      case 'check-feature':
        if (!userId) {
          return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
        }
        const feature = searchParams.get('feature');
        return checkFeatureAccess(userId, feature);
      case 'usage':
        if (!userId) {
          return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
        }
        return getUsageStats(userId);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST - Subscribe, upgrade, downgrade, or cancel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, action, tier_id, payment_method } = body;

    if (!user_id) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    switch (action) {
      case 'subscribe':
        return await subscribe(user_id, tier_id, payment_method);
      case 'upgrade':
        return await changeTier(user_id, tier_id, 'upgrade');
      case 'downgrade':
        return await changeTier(user_id, tier_id, 'downgrade');
      case 'cancel':
        return await cancelSubscription(user_id);
      case 'reactivate':
        return await reactivateSubscription(user_id);
      case 'use-credit':
        return await useCredit(user_id, body.credit_type);
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
      headers: ['Feature', 'Free', 'Collector', 'Pro', 'Dealer'],
      rows: [
        ['Cards Tracked', '100', '1,000', '10,000', 'Unlimited'],
        ['Price Alerts', '5', '25', '100', 'Unlimited'],
        ['Card Scans/mo', '3', '25', '100', 'Unlimited'],
        ['Price History', '❌', '✅', '✅', '✅'],
        ['AI Predictions', '❌', '❌', '✅', '✅'],
        ['Trade Matching', '❌', '❌', '✅', '✅'],
        ['Public Showcase', '❌', '❌', '✅', '✅'],
        ['API Access', '❌', '❌', '✅', '✅'],
        ['Inventory Mgmt', '❌', '❌', '❌', '✅'],
        ['White-label', '❌', '❌', '❌', '✅'],
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

  // Get current tier details
  const tier = TIERS.find(t => t.id === (subscription?.tier || 'free')) || TIERS[0];

  // Get usage
  const usage = await getUserUsage(userId);

  const sub: UserSubscription = {
    user_id: userId,
    tier: subscription?.tier || 'free',
    status: subscription?.status || 'active',
    current_period_start: subscription?.current_period_start || new Date().toISOString(),
    current_period_end: subscription?.current_period_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancel_at_period_end: subscription?.cancel_at_period_end || false,
    stripe_subscription_id: subscription?.stripe_subscription_id || null,
    features_used: usage,
  };

  return NextResponse.json({
    success: true,
    subscription: sub,
    tier_details: tier,
    limits_remaining: {
      cards: tier.limits.cards === -1 ? 'Unlimited' : Math.max(0, tier.limits.cards - usage.cards),
      alerts: tier.limits.alerts === -1 ? 'Unlimited' : Math.max(0, tier.limits.alerts - usage.alerts),
      exports: tier.limits.exports_per_month === -1 ? 'Unlimited' : Math.max(0, tier.limits.exports_per_month - usage.exports_this_month),
      scans: tier.limits.scan_credits_per_month === -1 ? 'Unlimited' : Math.max(0, tier.limits.scan_credits_per_month - usage.scans_this_month),
    },
  });
}

// Check if user can access a feature
async function checkFeatureAccess(userId: string, feature: string | null): Promise<NextResponse> {
  if (!feature) {
    return NextResponse.json({ success: false, error: 'Feature name required' }, { status: 400 });
  }

  const { data: subscription } = await supabase
    .from('cv_subscriptions')
    .select('tier')
    .eq('user_id', userId)
    .single();

  const userTier = subscription?.tier || 'free';
  const tier = TIERS.find(t => t.id === userTier) || TIERS[0];

  // Feature access matrix
  const featureAccess: Record<string, string[]> = {
    'price_history': ['collector', 'pro', 'dealer'],
    'ai_predictions': ['pro', 'dealer'],
    'trade_matching': ['pro', 'dealer'],
    'public_showcase': ['pro', 'dealer'],
    'api_access': ['pro', 'dealer'],
    'inventory_management': ['dealer'],
    'bulk_import': ['collector', 'pro', 'dealer'],
    'unlimited_exports': ['pro', 'dealer'],
    'white_label': ['dealer'],
    'advanced_analytics': ['collector', 'pro', 'dealer'],
  };

  const allowedTiers = featureAccess[feature] || [];
  const hasAccess = allowedTiers.includes(userTier);

  // Find minimum tier required
  const minTierIndex = TIERS.findIndex(t => allowedTiers.includes(t.id));
  const minTier = minTierIndex >= 0 ? TIERS[minTierIndex] : null;

  return NextResponse.json({
    success: true,
    feature,
    has_access: hasAccess,
    user_tier: userTier,
    required_tier: minTier?.id || 'unknown',
    upgrade_prompt: !hasAccess && minTier ? {
      message: `Upgrade to ${minTier.name} to unlock ${feature.replace(/_/g, ' ')}`,
      tier: minTier.id,
      price: minTier.price_monthly,
    } : null,
  });
}

// Get usage statistics
async function getUsageStats(userId: string): Promise<NextResponse> {
  const usage = await getUserUsage(userId);
  
  const { data: subscription } = await supabase
    .from('cv_subscriptions')
    .select('tier')
    .eq('user_id', userId)
    .single();

  const tier = TIERS.find(t => t.id === (subscription?.tier || 'free')) || TIERS[0];

  return NextResponse.json({
    success: true,
    usage,
    limits: tier.limits,
    percentages: {
      cards: tier.limits.cards === -1 ? 0 : (usage.cards / tier.limits.cards * 100),
      alerts: tier.limits.alerts === -1 ? 0 : (usage.alerts / tier.limits.alerts * 100),
      exports: tier.limits.exports_per_month === -1 ? 0 : (usage.exports_this_month / tier.limits.exports_per_month * 100),
      scans: tier.limits.scan_credits_per_month === -1 ? 0 : (usage.scans_this_month / tier.limits.scan_credits_per_month * 100),
    },
  });
}

// Subscribe to a tier
async function subscribe(userId: string, tierId: string, paymentMethod: string): Promise<NextResponse> {
  const tier = TIERS.find(t => t.id === tierId);
  if (!tier) {
    return NextResponse.json({ success: false, error: 'Invalid tier' }, { status: 400 });
  }

  // Check if already subscribed
  const { data: existing } = await supabase
    .from('cv_subscriptions')
    .select('tier')
    .eq('user_id', userId)
    .single();

  if (existing && existing.tier !== 'free') {
    return NextResponse.json({
      success: false,
      error: 'Already subscribed. Use upgrade/downgrade instead.',
    }, { status: 400 });
  }

  // In production: Create Stripe subscription
  // For now, create local subscription record

  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const { data: subscription, error } = await supabase
    .from('cv_subscriptions')
    .upsert({
      user_id: userId,
      tier: tierId,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: periodEnd.toISOString(),
      payment_method: paymentMethod,
      created_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;

  // Grant badge
  await grantBadge(userId, tier.badge, tier.name);

  return NextResponse.json({
    success: true,
    subscription,
    message: `Welcome to ${tier.name}! Your subscription is now active.`,
    tier_details: tier,
  });
}

// Change tier (upgrade or downgrade)
async function changeTier(userId: string, newTierId: string, direction: 'upgrade' | 'downgrade'): Promise<NextResponse> {
  const newTier = TIERS.find(t => t.id === newTierId);
  if (!newTier) {
    return NextResponse.json({ success: false, error: 'Invalid tier' }, { status: 400 });
  }

  const { data: current } = await supabase
    .from('cv_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!current) {
    return NextResponse.json({ success: false, error: 'No active subscription' }, { status: 400 });
  }

  const currentTierIndex = TIERS.findIndex(t => t.id === current.tier);
  const newTierIndex = TIERS.findIndex(t => t.id === newTierId);

  if (direction === 'upgrade' && newTierIndex <= currentTierIndex) {
    return NextResponse.json({ success: false, error: 'New tier must be higher for upgrade' }, { status: 400 });
  }

  if (direction === 'downgrade' && newTierIndex >= currentTierIndex) {
    return NextResponse.json({ success: false, error: 'New tier must be lower for downgrade' }, { status: 400 });
  }

  // In production: Prorate and update Stripe subscription

  const { data: subscription, error } = await supabase
    .from('cv_subscriptions')
    .update({
      tier: newTierId,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    subscription,
    message: `Successfully ${direction}d to ${newTier.name}`,
    tier_details: newTier,
  });
}

// Cancel subscription
async function cancelSubscription(userId: string): Promise<NextResponse> {
  const { data: subscription, error } = await supabase
    .from('cv_subscriptions')
    .update({
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    subscription,
    message: 'Subscription cancelled. You will retain access until the end of your billing period.',
  });
}

// Reactivate cancelled subscription
async function reactivateSubscription(userId: string): Promise<NextResponse> {
  const { data: subscription, error } = await supabase
    .from('cv_subscriptions')
    .update({
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    subscription,
    message: 'Subscription reactivated! Your subscription will continue.',
  });
}

// Use a credit (scan, export, etc.)
async function useCredit(userId: string, creditType: string): Promise<NextResponse> {
  const { data: subscription } = await supabase
    .from('cv_subscriptions')
    .select('tier')
    .eq('user_id', userId)
    .single();

  const tier = TIERS.find(t => t.id === (subscription?.tier || 'free')) || TIERS[0];
  const usage = await getUserUsage(userId);

  // Check limits
  let limit = 0;
  let used = 0;
  switch (creditType) {
    case 'scan':
      limit = tier.limits.scan_credits_per_month;
      used = usage.scans_this_month;
      break;
    case 'export':
      limit = tier.limits.exports_per_month;
      used = usage.exports_this_month;
      break;
    default:
      return NextResponse.json({ success: false, error: 'Invalid credit type' }, { status: 400 });
  }

  if (limit !== -1 && used >= limit) {
    return NextResponse.json({
      success: false,
      error: 'Credit limit reached',
      limit,
      used,
      upgrade_required: true,
    }, { status: 403 });
  }

  // Record usage
  await supabase.from('cv_usage_log').insert({
    user_id: userId,
    credit_type: creditType,
    used_at: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    credit_type: creditType,
    remaining: limit === -1 ? 'Unlimited' : limit - used - 1,
  });
}

// Helper: Get user usage
async function getUserUsage(userId: string): Promise<UserSubscription['features_used']> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Count cards
  const { count: cardCount } = await supabase
    .from('cv_user_cards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Count active alerts
  const { count: alertCount } = await supabase
    .from('cv_price_alerts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_active', true);

  // Count exports this month
  const { count: exportCount } = await supabase
    .from('cv_exports')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());

  // Count API calls today
  const { count: apiCount } = await supabase
    .from('cv_api_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfDay.toISOString());

  // Count scans this month
  const { count: scanCount } = await supabase
    .from('cv_scan_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());

  return {
    cards: cardCount || 0,
    alerts: alertCount || 0,
    exports_this_month: exportCount || 0,
    api_calls_today: apiCount || 0,
    scans_this_month: scanCount || 0,
  };
}

// Helper: Grant badge
async function grantBadge(userId: string, badge: string, tierName: string): Promise<void> {
  try {
    await supabase.from('cv_user_badges').insert({
      user_id: userId,
      badge,
      badge_name: `${tierName} Member`,
      granted_at: new Date().toISOString(),
    });
  } catch {
    // Ignore if badge already exists
  }
}

export const dynamic = 'force-dynamic';
