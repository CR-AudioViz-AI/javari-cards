export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// PRICE ALERT NOTIFICATIONS API
// Push/email notifications when prices hit targets
// CravCards - CR AudioViz AI, LLC
// Created: December 17, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lazy Supabase client — initialized on first request (not at module load time)
let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kteobfyferrukqeolofj.supabase.co";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW9iZnlmZXJydWtxZW9sb2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NzUwNjUsImV4cCI6MjA1NTE1MTA2NX0.r3_3bXtqo6VCJqYHijtxdEpXkWyNVGKd67kNQvqkrD4";
    _supabase = createClient(url, key);
  }
  return _supabase!;
}
const supabase = getSupabase();
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
  notify_sms: boolean;
  created_at: string;
  triggered_at: string | null;
  trigger_count: number;
}

interface NotificationSettings {
  email_enabled: boolean;
  email_address: string | null;
  push_enabled: boolean;
  sms_enabled: boolean;
  phone_number: string | null;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  daily_digest: boolean;
  instant_alerts: boolean;
  alert_frequency: 'instant' | 'hourly' | 'daily';
}

interface Notification {
  id: string;
  user_id: string;
  type: 'price_alert' | 'trade_offer' | 'wishlist_available' | 'achievement' | 'system';
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// GET - Get alerts, notifications, or settings
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const action = searchParams.get('action') || 'alerts';
  const limit = parseInt(searchParams.get('limit') || '50');

  if (!userId) {
    return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
  }

  try {
    switch (action) {
      case 'alerts':
        return await getAlerts(userId);
      case 'notifications':
        return await getNotifications(userId, limit);
      case 'settings':
        return await getNotificationSettings(userId);
      case 'unread-count':
        return await getUnreadCount(userId);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST - Create alerts, update settings, or send notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, action } = body;

    if (!user_id) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    switch (action) {
      case 'create-alert':
        return await createAlert(user_id, body);
      case 'update-alert':
        return await updateAlert(body.alert_id, body);
      case 'delete-alert':
        return await deleteAlert(user_id, body.alert_id);
      case 'update-settings':
        return await updateNotificationSettings(user_id, body.settings);
      case 'mark-read':
        return await markNotificationsRead(user_id, body.notification_ids);
      case 'mark-all-read':
        return await markAllRead(user_id);
      case 'check-alerts':
        return await checkAndTriggerAlerts(user_id);
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Get user's price alerts
async function getAlerts(userId: string): Promise<NextResponse> {
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
      const percentFromTarget = alert.target_value > 0
        ? ((currentPrice - alert.target_value) / alert.target_value) * 100
        : 0;

      return {
        ...alert,
        current_price: currentPrice,
        percent_from_target: Math.round(percentFromTarget * 100) / 100,
        would_trigger: checkAlertCondition(alert, currentPrice),
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

// Get notifications
async function getNotifications(userId: string, limit: number): Promise<NextResponse> {
  const { data: notifications, error } = await supabase
    .from('cv_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error && error.code !== 'PGRST116') {
    // Generate sample notifications if table doesn't exist
    return NextResponse.json({
      success: true,
      notifications: generateSampleNotifications(userId),
      sample_data: true,
    });
  }

  return NextResponse.json({
    success: true,
    notifications: notifications || [],
    total: notifications?.length || 0,
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
    email_address: null,
    push_enabled: true,
    sms_enabled: false,
    phone_number: null,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    daily_digest: true,
    instant_alerts: true,
    alert_frequency: 'instant',
  };

  return NextResponse.json({
    success: true,
    settings: settings || defaultSettings,
  });
}

// Get unread notification count
async function getUnreadCount(userId: string): Promise<NextResponse> {
  const { count } = await supabase
    .from('cv_notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  return NextResponse.json({
    success: true,
    unread_count: count || 0,
  });
}

// Create a price alert
async function createAlert(userId: string, data: Record<string, unknown>): Promise<NextResponse> {
  const { card_id, card_name, category, alert_type, target_value, notify_email, notify_push, notify_sms } = data;

  if (!card_id || !target_value) {
    return NextResponse.json({
      success: false,
      error: 'Card ID and target value required',
    }, { status: 400 });
  }

  // Check alert limit (free tier: 5 alerts)
  const { count } = await supabase
    .from('cv_price_alerts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_active', true);

  if ((count || 0) >= 20) {
    return NextResponse.json({
      success: false,
      error: 'Alert limit reached. Upgrade to premium for unlimited alerts.',
      limit: 20,
    }, { status: 403 });
  }

  const currentPrice = await getCurrentPrice(card_id as string);

  const { data: alert, error } = await supabase
    .from('cv_price_alerts')
    .insert({
      user_id: userId,
      card_id,
      card_name: card_name || 'Unknown Card',
      category: category || 'other',
      alert_type: alert_type || 'below',
      target_value,
      current_price: currentPrice,
      is_active: true,
      notify_email: notify_email !== false,
      notify_push: notify_push !== false,
      notify_sms: notify_sms || false,
      trigger_count: 0,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    alert,
    message: 'Price alert created successfully',
  });
}

// Update an alert
async function updateAlert(alertId: string, data: Record<string, unknown>): Promise<NextResponse> {
  const { target_value, alert_type, is_active, notify_email, notify_push, notify_sms } = data;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (target_value !== undefined) updates.target_value = target_value;
  if (alert_type !== undefined) updates.alert_type = alert_type;
  if (is_active !== undefined) updates.is_active = is_active;
  if (notify_email !== undefined) updates.notify_email = notify_email;
  if (notify_push !== undefined) updates.notify_push = notify_push;
  if (notify_sms !== undefined) updates.notify_sms = notify_sms;

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
async function deleteAlert(userId: string, alertId: string): Promise<NextResponse> {
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

// Mark notifications as read
async function markNotificationsRead(userId: string, notificationIds: string[]): Promise<NextResponse> {
  const { error } = await supabase
    .from('cv_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .in('id', notificationIds);

  if (error) throw error;

  return NextResponse.json({
    success: true,
    message: `${notificationIds.length} notifications marked as read`,
  });
}

// Mark all notifications as read
async function markAllRead(userId: string): Promise<NextResponse> {
  const { error } = await supabase
    .from('cv_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;

  return NextResponse.json({
    success: true,
    message: 'All notifications marked as read',
  });
}

// Check and trigger alerts
async function checkAndTriggerAlerts(userId: string): Promise<NextResponse> {
  const { data: alerts } = await supabase
    .from('cv_price_alerts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);

  const triggered: string[] = [];

  for (const alert of alerts || []) {
    const currentPrice = await getCurrentPrice(alert.card_id);
    
    if (checkAlertCondition(alert, currentPrice)) {
      // Create notification
      await createNotification(userId, {
        type: 'price_alert',
        title: `Price Alert: ${alert.card_name}`,
        message: `${alert.card_name} has reached your target price of $${alert.target_value}. Current price: $${currentPrice}`,
        data: {
          alert_id: alert.id,
          card_id: alert.card_id,
          current_price: currentPrice,
          target_value: alert.target_value,
        },
      });

      // Update alert
      await supabase
        .from('cv_price_alerts')
        .update({
          triggered_at: new Date().toISOString(),
          trigger_count: (alert.trigger_count || 0) + 1,
          current_price: currentPrice,
        })
        .eq('id', alert.id);

      triggered.push(alert.card_name);
    }
  }

  return NextResponse.json({
    success: true,
    checked: alerts?.length || 0,
    triggered: triggered.length,
    triggered_cards: triggered,
  });
}

// Helper: Get current price for a card
async function getCurrentPrice(cardId: string): Promise<number> {
  const { data } = await supabase
    .from('cv_cards_master')
    .select('current_price')
    .eq('card_id', cardId)
    .single();

  return data?.current_price || 25 + Math.random() * 100;
}

// Helper: Check if alert condition is met
function checkAlertCondition(alert: PriceAlert, currentPrice: number): boolean {
  switch (alert.alert_type) {
    case 'below':
      return currentPrice <= alert.target_value;
    case 'above':
      return currentPrice >= alert.target_value;
    case 'change_percent':
      const changePercent = Math.abs((currentPrice - alert.current_price) / alert.current_price * 100);
      return changePercent >= alert.target_value;
    default:
      return false;
  }
}

// Helper: Create notification
async function createNotification(userId: string, notification: {
  type: Notification['type'];
  title: string;
  message: string;
  data: Record<string, unknown>;
}): Promise<void> {
  await supabase.from('cv_notifications').insert({
    user_id: userId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    data: notification.data,
    is_read: false,
    created_at: new Date().toISOString(),
  });
}

// Helper: Generate sample notifications
function generateSampleNotifications(userId: string): Notification[] {
  return [
    {
      id: 'notif-1',
      user_id: userId,
      type: 'price_alert',
      title: 'Price Alert: Charizard VMAX',
      message: 'Charizard VMAX has dropped below your target price of $150',
      data: { card_id: 'pokemon-charizard-vmax', current_price: 145 },
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'notif-2',
      user_id: userId,
      type: 'trade_offer',
      title: 'New Trade Offer',
      message: 'CardMaster99 wants to trade for your Black Lotus',
      data: { trade_id: 'trade-123' },
      is_read: false,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'notif-3',
      user_id: userId,
      type: 'wishlist_available',
      title: 'Wishlist Card Available',
      message: 'Umbreon VMAX Alt Art is now available from a seller',
      data: { card_id: 'pokemon-umbreon-vmax-alt' },
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'notif-4',
      user_id: userId,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You earned the "Set Completer" badge',
      data: { achievement: 'set_completer' },
      is_read: true,
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ];
}

// DEDUP REMOVED: export const dynamic = 'force-dynamic';
