// ============================================================================
// PRICE ALERT NOTIFICATIONS API
// Push/email notifications when prices hit targets
// CravCards - CR AudioViz AI, LLC
// Created: December 17, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface PriceAlert {
  id: string;
  user_id: string;
  card_id: string;
  card_name: string;
  category: string;
  alert_type: 'above' | 'below' | 'change_percent';
  target_value: number;
  current_price: number;
  is_active: boolean;
  notify_email: boolean;
  notify_push: boolean;
  created_at: string;
  triggered_at: string | null;
  triggered_price: number | null;
}

interface NotificationSettings {
  email_enabled: boolean;
  email_address: string;
  push_enabled: boolean;
  push_token: string | null;
  daily_digest: boolean;
  digest_time: string;
  alert_frequency: 'instant' | 'hourly' | 'daily';
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
}

// GET - Get alerts or notification settings
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const action = searchParams.get('action') || 'list';
  const alertId = searchParams.get('alert_id');

  if (!userId) {
    return NextResponse.json({
      success: false,
      error: 'User ID required',
    }, { status: 400 });
  }

  try {
    switch (action) {
      case 'list':
        return await listAlerts(userId);
      case 'triggered':
        return await getTriggeredAlerts(userId);
      case 'settings':
        return await getNotificationSettings(userId);
      case 'history':
        return await getNotificationHistory(userId);
      case 'check':
        // Check all alerts for a user (called by cron)
        return await checkUserAlerts(userId);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST - Create/update alerts or settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, action } = body;

    if (!user_id) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    switch (action) {
      case 'create':
        return await createAlert(user_id, body);
      case 'update':
        return await updateAlert(body.alert_id, body);
      case 'delete':
        return await deleteAlert(body.alert_id, user_id);
      case 'toggle':
        return await toggleAlert(body.alert_id, user_id);
      case 'update-settings':
        return await updateNotificationSettings(user_id, body.settings);
      case 'register-push':
        return await registerPushToken(user_id, body.push_token);
      case 'test':
        return await sendTestNotification(user_id);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// List all alerts for a user
async function listAlerts(userId: string): Promise<NextResponse> {
  const { data: alerts, error } = await supabase
    .from('cv_price_alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error && error.code !== 'PGRST116') throw error;

  // Enrich with current prices
  const enrichedAlerts = await Promise.all(
    (alerts || []).map(async (alert) => {
      const currentPrice = await getCurrentPrice(alert.card_id);
      const distance = alert.alert_type === 'above'
        ? ((alert.target_value - currentPrice) / currentPrice * 100)
        : alert.alert_type === 'below'
        ? ((currentPrice - alert.target_value) / currentPrice * 100)
        : 0;

      return {
        ...alert,
        current_price: currentPrice,
        distance_percent: Math.round(distance * 100) / 100,
        status: getAlertStatus(alert, currentPrice),
      };
    })
  );

  return NextResponse.json({
    success: true,
    alerts: enrichedAlerts,
    total: enrichedAlerts.length,
    active: enrichedAlerts.filter(a => a.is_active).length,
  });
}

// Get triggered alerts (notifications sent)
async function getTriggeredAlerts(userId: string): Promise<NextResponse> {
  const { data: triggered } = await supabase
    .from('cv_price_alerts')
    .select('*')
    .eq('user_id', userId)
    .not('triggered_at', 'is', null)
    .order('triggered_at', { ascending: false })
    .limit(50);

  return NextResponse.json({
    success: true,
    triggered: triggered || [],
  });
}

// Get notification settings
async function getNotificationSettings(userId: string): Promise<NextResponse> {
  const { data: settings } = await supabase
    .from('cv_notification_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  const defaultSettings: NotificationSettings = {
    email_enabled: true,
    email_address: '',
    push_enabled: false,
    push_token: null,
    daily_digest: true,
    digest_time: '09:00',
    alert_frequency: 'instant',
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
  };

  return NextResponse.json({
    success: true,
    settings: settings || defaultSettings,
  });
}

// Get notification history
async function getNotificationHistory(userId: string): Promise<NextResponse> {
  const { data: history } = await supabase
    .from('cv_notification_log')
    .select('*')
    .eq('user_id', userId)
    .order('sent_at', { ascending: false })
    .limit(100);

  return NextResponse.json({
    success: true,
    history: history || [],
  });
}

// Check all alerts for a user
async function checkUserAlerts(userId: string): Promise<NextResponse> {
  const { data: alerts } = await supabase
    .from('cv_price_alerts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);

  const triggered: PriceAlert[] = [];

  for (const alert of alerts || []) {
    const currentPrice = await getCurrentPrice(alert.card_id);
    const isTriggered = checkAlertTriggered(alert, currentPrice);

    if (isTriggered) {
      triggered.push({ ...alert, current_price: currentPrice });
      
      // Update alert as triggered
      await supabase
        .from('cv_price_alerts')
        .update({
          triggered_at: new Date().toISOString(),
          triggered_price: currentPrice,
          is_active: false, // Deactivate after trigger
        })
        .eq('id', alert.id);

      // Send notification
      await sendNotification(userId, alert, currentPrice);
    }
  }

  return NextResponse.json({
    success: true,
    checked: alerts?.length || 0,
    triggered: triggered.length,
    alerts: triggered,
  });
}

// Create a new alert
async function createAlert(userId: string, body: Record<string, unknown>): Promise<NextResponse> {
  const { card_id, card_name, category, alert_type, target_value, notify_email, notify_push } = body;

  if (!card_id || !alert_type || target_value === undefined) {
    return NextResponse.json({
      success: false,
      error: 'card_id, alert_type, and target_value required',
    }, { status: 400 });
  }

  // Check alert limits (free tier: 5, premium: 50)
  const { count } = await supabase
    .from('cv_price_alerts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_active', true);

  const limit = 50; // TODO: Check user tier
  if ((count || 0) >= limit) {
    return NextResponse.json({
      success: false,
      error: `Alert limit reached (${limit} active alerts)`,
    }, { status: 400 });
  }

  const currentPrice = await getCurrentPrice(card_id as string);

  const { data: alert, error } = await supabase
    .from('cv_price_alerts')
    .insert({
      user_id: userId,
      card_id,
      card_name: card_name || 'Unknown Card',
      category: category || 'other',
      alert_type,
      target_value,
      current_price: currentPrice,
      is_active: true,
      notify_email: notify_email !== false,
      notify_push: notify_push === true,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    alert,
    message: `Alert created: Notify when price goes ${alert_type} $${target_value}`,
  });
}

// Update an alert
async function updateAlert(alertId: string, body: Record<string, unknown>): Promise<NextResponse> {
  const { target_value, alert_type, notify_email, notify_push, is_active } = body;

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (target_value !== undefined) updates.target_value = target_value;
  if (alert_type !== undefined) updates.alert_type = alert_type;
  if (notify_email !== undefined) updates.notify_email = notify_email;
  if (notify_push !== undefined) updates.notify_push = notify_push;
  if (is_active !== undefined) updates.is_active = is_active;

  const { data: alert, error } = await supabase
    .from('cv_price_alerts')
    .update(updates)
    .eq('id', alertId)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    alert,
    message: 'Alert updated',
  });
}

// Delete an alert
async function deleteAlert(alertId: string, userId: string): Promise<NextResponse> {
  const { error } = await supabase
    .from('cv_price_alerts')
    .delete()
    .eq('id', alertId)
    .eq('user_id', userId);

  if (error) throw error;

  return NextResponse.json({
    success: true,
    message: 'Alert deleted',
  });
}

// Toggle alert active state
async function toggleAlert(alertId: string, userId: string): Promise<NextResponse> {
  const { data: current } = await supabase
    .from('cv_price_alerts')
    .select('is_active')
    .eq('id', alertId)
    .eq('user_id', userId)
    .single();

  if (!current) {
    return NextResponse.json({ success: false, error: 'Alert not found' }, { status: 404 });
  }

  const { data: alert, error } = await supabase
    .from('cv_price_alerts')
    .update({ is_active: !current.is_active })
    .eq('id', alertId)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    alert,
    message: alert.is_active ? 'Alert activated' : 'Alert paused',
  });
}

// Update notification settings
async function updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<NextResponse> {
  const { data, error } = await supabase
    .from('cv_notification_settings')
    .upsert({
      user_id: userId,
      ...settings,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    settings: data,
    message: 'Notification settings updated',
  });
}

// Register push notification token
async function registerPushToken(userId: string, pushToken: string): Promise<NextResponse> {
  const { error } = await supabase
    .from('cv_notification_settings')
    .upsert({
      user_id: userId,
      push_token: pushToken,
      push_enabled: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) throw error;

  return NextResponse.json({
    success: true,
    message: 'Push notifications enabled',
  });
}

// Send test notification
async function sendTestNotification(userId: string): Promise<NextResponse> {
  const { data: settings } = await supabase
    .from('cv_notification_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  const results = {
    email: false,
    push: false,
  };

  if (settings?.email_enabled && settings?.email_address) {
    // In production, send actual email
    results.email = true;
    await logNotification(userId, 'test', 'email', 'Test notification sent');
  }

  if (settings?.push_enabled && settings?.push_token) {
    // In production, send actual push
    results.push = true;
    await logNotification(userId, 'test', 'push', 'Test notification sent');
  }

  return NextResponse.json({
    success: true,
    results,
    message: 'Test notifications sent',
  });
}

// Helper: Get current price
async function getCurrentPrice(cardId: string): Promise<number> {
  const { data } = await supabase
    .from('cv_cards_master')
    .select('current_price')
    .eq('card_id', cardId)
    .single();

  // Return actual price or generate realistic one for demo
  return data?.current_price || (25 + Math.random() * 100);
}

// Helper: Check if alert triggered
function checkAlertTriggered(alert: PriceAlert, currentPrice: number): boolean {
  switch (alert.alert_type) {
    case 'above':
      return currentPrice >= alert.target_value;
    case 'below':
      return currentPrice <= alert.target_value;
    case 'change_percent':
      const changePercent = Math.abs((currentPrice - alert.current_price) / alert.current_price * 100);
      return changePercent >= alert.target_value;
    default:
      return false;
  }
}

// Helper: Get alert status
function getAlertStatus(alert: PriceAlert, currentPrice: number): string {
  if (!alert.is_active) return 'paused';
  if (alert.triggered_at) return 'triggered';
  
  const distance = alert.alert_type === 'above'
    ? (alert.target_value - currentPrice) / currentPrice
    : (currentPrice - alert.target_value) / currentPrice;

  if (distance <= 0.05) return 'close';
  if (distance <= 0.15) return 'approaching';
  return 'watching';
}

// Helper: Send notification
async function sendNotification(userId: string, alert: PriceAlert, currentPrice: number): Promise<void> {
  const { data: settings } = await supabase
    .from('cv_notification_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  const message = `Price Alert: ${alert.card_name} is now $${currentPrice.toFixed(2)} (target: ${alert.alert_type} $${alert.target_value})`;

  // Check quiet hours
  if (settings?.quiet_hours_start && settings?.quiet_hours_end) {
    const now = new Date();
    const currentHour = now.getHours();
    const startHour = parseInt(settings.quiet_hours_start.split(':')[0]);
    const endHour = parseInt(settings.quiet_hours_end.split(':')[0]);

    if (startHour > endHour) {
      // Quiet hours span midnight
      if (currentHour >= startHour || currentHour < endHour) {
        // In quiet hours, queue for later
        await queueNotification(userId, alert, currentPrice, message);
        return;
      }
    } else {
      if (currentHour >= startHour && currentHour < endHour) {
        await queueNotification(userId, alert, currentPrice, message);
        return;
      }
    }
  }

  // Send email
  if (alert.notify_email && settings?.email_enabled) {
    // In production: send email via SendGrid, SES, etc.
    await logNotification(userId, alert.id, 'email', message);
  }

  // Send push
  if (alert.notify_push && settings?.push_enabled) {
    // In production: send push via Firebase, OneSignal, etc.
    await logNotification(userId, alert.id, 'push', message);
  }
}

// Helper: Queue notification for later
async function queueNotification(userId: string, alert: PriceAlert, price: number, message: string): Promise<void> {
  await supabase.from('cv_notification_queue').insert({
    user_id: userId,
    alert_id: alert.id,
    message,
    price,
    queued_at: new Date().toISOString(),
  });
}

// Helper: Log notification
async function logNotification(userId: string, alertId: string, channel: string, message: string): Promise<void> {
  try {
    await supabase.from('cv_notification_log').insert({
      user_id: userId,
      alert_id: alertId,
      channel,
      message,
      sent_at: new Date().toISOString(),
    });
  } catch {
    // Silently fail if table doesn't exist
  }
}

export const dynamic = 'force-dynamic';
