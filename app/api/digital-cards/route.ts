// app/api/digital-cards/route.ts
// API endpoints for the Hidden Digital Card System

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch user's digital cards or all available cards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action') || 'all';
    
    if (action === 'user-cards' && userId) {
      // Get user's owned digital cards
      const { data: userCards, error } = await supabase
        .from('user_digital_cards')
        .select(`
          *,
          card:digital_cards(*)
        `)
        .eq('user_id', userId)
        .order('discovered_at', { ascending: false });
        
      if (error) throw error;
      
      return NextResponse.json({ 
        success: true, 
        cards: userCards || [] 
      });
    }
    
    if (action === 'all-cards') {
      // Get all active digital cards (for collection view)
      const { data: allCards, error } = await supabase
        .from('digital_cards')
        .select('*')
        .eq('is_active', true)
        .order('series', { ascending: true })
        .order('series_number', { ascending: true });
        
      if (error) throw error;
      
      return NextResponse.json({ 
        success: true, 
        cards: allCards || [] 
      });
    }
    
    if (action === 'series') {
      // Get all series with progress
      const { data: series, error } = await supabase
        .from('digital_card_series')
        .select('*')
        .eq('is_active', true);
        
      if (error) throw error;
      
      return NextResponse.json({ 
        success: true, 
        series: series || [] 
      });
    }
    
    if (action === 'user-progress' && userId) {
      // Get user's discovery progress
      const { data: progress, error } = await supabase
        .from('card_discovery_progress')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      return NextResponse.json({ 
        success: true, 
        progress: progress || null 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action parameter' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('Digital Cards GET Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch digital cards' 
    }, { status: 500 });
  }
}

// POST - Discover a card or update progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, cardCode, triggerType, triggerDetails, pageLocation } = body;
    
    if (action === 'discover') {
      // Check if card exists and user doesn't already have it
      const { data: card, error: cardError } = await supabase
        .from('digital_cards')
        .select('*')
        .eq('card_code', cardCode)
        .eq('is_active', true)
        .single();
        
      if (cardError || !card) {
        return NextResponse.json({ 
          success: false, 
          error: 'Card not found or inactive' 
        }, { status: 404 });
      }
      
      // Check if user already has this card
      const { data: existing } = await supabase
        .from('user_digital_cards')
        .select('id')
        .eq('user_id', userId)
        .eq('card_id', card.id)
        .single();
        
      if (existing) {
        return NextResponse.json({ 
          success: false, 
          error: 'Card already owned',
          alreadyOwned: true
        });
      }
      
      // Check supply limits
      if (card.max_supply && card.current_supply >= card.max_supply) {
        return NextResponse.json({ 
          success: false, 
          error: 'Card supply exhausted' 
        });
      }
      
      // Determine instance number
      const instanceNumber = (card.current_supply || 0) + 1;
      
      // Determine if first edition (first 100 claims)
      const isFirstEdition = instanceNumber <= 100;
      
      // Random chance for foil (5% chance)
      const isFoil = Math.random() < 0.05;
      
      // Add card to user's collection
      const { data: newCard, error: insertError } = await supabase
        .from('user_digital_cards')
        .insert({
          user_id: userId,
          card_id: card.id,
          discovery_location: pageLocation,
          discovery_method: triggerType,
          instance_number: instanceNumber,
          is_foil: isFoil,
          is_first_edition: isFirstEdition,
        })
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      // Update supply counter
      await supabase
        .from('digital_cards')
        .update({ current_supply: instanceNumber })
        .eq('id', card.id);
      
      // Log the discovery
      await supabase
        .from('card_discovery_log')
        .insert({
          user_id: userId,
          card_id: card.id,
          trigger_type: triggerType,
          trigger_details: triggerDetails,
          page_location: pageLocation,
        });
      
      // Update user's progress
      await updateUserProgress(userId, card);
      
      return NextResponse.json({
        success: true,
        card: {
          ...card,
          instanceNumber,
          isFirstEdition,
          isFoil,
          discoveredAt: new Date().toISOString(),
        },
      });
    }
    
    if (action === 'update-progress') {
      // Update specific progress metrics
      const { progressType, value } = body;
      
      // Get or create progress record
      const { data: existingProgress } = await supabase
        .from('card_discovery_progress')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!existingProgress) {
        // Create new progress record
        await supabase
          .from('card_discovery_progress')
          .insert({
            user_id: userId,
            feature_uses: {},
            achievements_unlocked: [],
            secrets_found: [],
          });
      }
      
      // Update the specific progress field
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      
      if (progressType === 'feature_use') {
        const { feature } = body;
        const currentUses = existingProgress?.feature_uses || {};
        updateData.feature_uses = {
          ...currentUses,
          [feature]: (currentUses[feature] || 0) + 1,
        };
      } else if (progressType === 'daily_login') {
        const today = new Date().toISOString().split('T')[0];
        const lastLogin = existingProgress?.last_login_date;
        
        if (lastLogin !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          const newStreak = lastLogin === yesterday 
            ? (existingProgress?.daily_login_streak || 0) + 1 
            : 1;
          
          updateData.daily_login_streak = newStreak;
          updateData.last_login_date = today;
        }
      } else if (progressType === 'achievement') {
        const { achievementId } = body;
        const current = existingProgress?.achievements_unlocked || [];
        if (!current.includes(achievementId)) {
          updateData.achievements_unlocked = [...current, achievementId];
        }
      } else if (progressType === 'secret') {
        const { secretId } = body;
        const current = existingProgress?.secrets_found || [];
        if (!current.includes(secretId)) {
          updateData.secrets_found = [...current, secretId];
        }
      }
      
      await supabase
        .from('card_discovery_progress')
        .update(updateData)
        .eq('user_id', userId);
      
      // Check if this progress unlocks any new cards
      const unlockedCard = await checkForUnlockedCards(userId);
      
      return NextResponse.json({
        success: true,
        unlockedCard,
      });
    }
    
    if (action === 'check-triggers') {
      // Check if user has any pending card triggers
      const unlockedCard = await checkForUnlockedCards(userId);
      
      return NextResponse.json({
        success: true,
        unlockedCard,
      });
    }
    
    if (action === 'toggle-favorite') {
      const { userCardId, isFavorite } = body;
      
      await supabase
        .from('user_digital_cards')
        .update({ is_favorite: isFavorite })
        .eq('id', userCardId)
        .eq('user_id', userId);
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('Digital Cards POST Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process request' 
    }, { status: 500 });
  }
}

// Helper: Update user's overall progress after card discovery
async function updateUserProgress(userId: string, card: { rarity: string; series: string }) {
  const { data: progress } = await supabase
    .from('card_discovery_progress')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  const rarityRank: Record<string, number> = {
    common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5, mythic: 6
  };
  
  const currentRarestRank = rarityRank[progress?.rarest_card_found || 'common'];
  const newCardRank = rarityRank[card.rarity];
  
  const updates: Record<string, unknown> = {
    total_cards_discovered: (progress?.total_cards_discovered || 0) + 1,
    weekly_discoveries: (progress?.weekly_discoveries || 0) + 1,
    updated_at: new Date().toISOString(),
  };
  
  if (newCardRank > currentRarestRank) {
    updates.rarest_card_found = card.rarity;
  }
  
  // Check if series is complete
  const { data: seriesCards } = await supabase
    .from('digital_cards')
    .select('id')
    .eq('series', card.series);
  
  const { data: ownedSeriesCards } = await supabase
    .from('user_digital_cards')
    .select('card:digital_cards!inner(series)')
    .eq('user_id', userId);
  
  const ownedInSeries = ownedSeriesCards?.filter(
    c => (c.card as { series: string }).series === card.series
  ).length || 0;
  
  if (ownedInSeries >= (seriesCards?.length || 0)) {
    const completeSeries = progress?.complete_series || [];
    if (!completeSeries.includes(card.series)) {
      updates.complete_series = [...completeSeries, card.series];
    }
  }
  
  await supabase
    .from('card_discovery_progress')
    .upsert({
      user_id: userId,
      ...updates,
    });
}

// Helper: Check if user qualifies for any new cards based on their progress
async function checkForUnlockedCards(userId: string) {
  // Get user's progress
  const { data: progress } = await supabase
    .from('card_discovery_progress')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (!progress) return null;
  
  // Get user's owned cards
  const { data: ownedCards } = await supabase
    .from('user_digital_cards')
    .select('card_id')
    .eq('user_id', userId);
  
  const ownedCardIds = new Set(ownedCards?.map(c => c.card_id) || []);
  
  // Get all cards user doesn't own
  const { data: availableCards } = await supabase
    .from('digital_cards')
    .select('*')
    .eq('is_active', true);
  
  // Check each unowned card's trigger conditions
  for (const card of availableCards || []) {
    if (ownedCardIds.has(card.id)) continue;
    
    const trigger = card.discovery_trigger;
    let qualified = false;
    
    switch (card.discovery_type) {
      case 'streak':
        if (trigger.daily_streak && progress.daily_login_streak >= trigger.daily_streak) {
          qualified = true;
        }
        break;
        
      case 'feature_use':
        if (trigger.feature && trigger.uses) {
          const uses = progress.feature_uses?.[trigger.feature] || 0;
          if (uses >= trigger.uses) {
            qualified = true;
          }
        }
        break;
        
      case 'collection':
        if (trigger.cards_added) {
          if (progress.total_cards_discovered >= trigger.cards_added) {
            qualified = true;
          }
        }
        if (trigger.series_complete) {
          if (progress.complete_series?.includes(trigger.series_complete)) {
            qualified = true;
          }
        }
        break;
        
      case 'achievement':
        if (trigger.achievement_id) {
          if (progress.achievements_unlocked?.includes(trigger.achievement_id)) {
            qualified = true;
          }
        }
        break;
    }
    
    if (qualified) {
      // This card should be awarded
      return {
        cardCode: card.card_code,
        triggerType: card.discovery_type,
      };
    }
  }
  
  return null;
}

export const dynamic = 'force-dynamic';
