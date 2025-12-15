// ============================================================================
// SPORTS CARDS API - ENHANCED
// Uses TheSportsDB free API for athlete data + local database for user cards
// Covers: MLB, NBA, NFL, NHL, Soccer, and more
// CravCards - CR AudioViz AI, LLC
// Created: December 14, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SPORTSDB_API = 'https://www.thesportsdb.com/api/v1/json/3';

// Initialize Supabase for user-submitted cards
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SportsDBPlayer {
  idPlayer: string;
  strPlayer: string;
  strTeam: string;
  strSport: string;
  strPosition: string;
  strNationality: string;
  dateBorn: string;
  strThumb: string;
  strCutout: string;
  strStatus: string;
  strGender: string;
  strDescriptionEN?: string;
  strHeight?: string;
  strWeight?: string;
}

// Sport to category mapping
const SPORT_CATEGORIES: Record<string, string> = {
  'Baseball': 'sports_baseball',
  'Basketball': 'sports_basketball',
  'American Football': 'sports_football',
  'Ice Hockey': 'sports_hockey',
  'Soccer': 'sports_soccer',
  'Golf': 'sports_golf',
  'Tennis': 'sports_tennis',
  'Boxing': 'sports_boxing',
  'MMA': 'sports_mma',
  'Motorsport': 'sports_racing',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || searchParams.get('query') || '';
  const sport = searchParams.get('sport'); // baseball, basketball, football, hockey, soccer
  const team = searchParams.get('team');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');

  if (!query && !team) {
    return NextResponse.json({
      success: false,
      error: 'Search query required. Use ?q=player_name or ?team=team_name',
      examples: [
        '/api/sports?q=pete%20rose',
        '/api/sports?q=michael%20jordan',
        '/api/sports?q=tom%20brady',
        '/api/sports?team=yankees',
      ],
      sports: ['baseball', 'basketball', 'football', 'hockey', 'soccer'],
    });
  }

  try {
    const allCards: any[] = [];

    // 1. Search TheSportsDB for athletes
    if (query) {
      const sportsDbResponse = await fetch(
        `${SPORTSDB_API}/searchplayers.php?p=${encodeURIComponent(query)}`,
        { next: { revalidate: 3600 } }
      );

      if (sportsDbResponse.ok) {
        const sportsData = await sportsDbResponse.json();
        const players: SportsDBPlayer[] = sportsData.player || [];

        // Filter by sport if specified
        const filteredPlayers = sport
          ? players.filter(p => p.strSport.toLowerCase().includes(sport.toLowerCase()))
          : players;

        // Transform athletes to "virtual cards"
        const athleteCards = filteredPlayers.map(player => {
          const sportCategory = SPORT_CATEGORIES[player.strSport] || 'sports_other';
          const birthYear = player.dateBorn ? new Date(player.dateBorn).getFullYear() : null;
          
          // Create virtual card representing this athlete
          // Users can have cards from any year/set of this player
          return {
            id: `athlete-${player.idPlayer}`,
            name: player.strPlayer,
            category: sportCategory,
            type: 'athlete',
            
            // Player info
            team: player.strTeam?.replace('_Retired ', '') || 'Free Agent',
            sport: player.strSport,
            position: player.strPosition || 'N/A',
            nationality: player.strNationality,
            birth_year: birthYear,
            status: player.strStatus,
            
            // Bio
            description: player.strDescriptionEN?.slice(0, 300) || null,
            height: player.strHeight,
            weight: player.strWeight,

            // This is a placeholder - real cards would have set info
            set_name: `${player.strPlayer} Cards`,
            card_number: 'Various',
            rarity: 'Various',

            // Images from SportsDB
            image_url: player.strThumb || player.strCutout || null,
            image_large: player.strCutout || player.strThumb || null,

            // Price placeholder - would need integration with PSA, eBay, etc.
            market_price: null,
            
            // Metadata
            source: 'TheSportsDB',
            note: 'Search for specific cards of this player in your collection',
            
            // For sports, we track the athlete
            athlete_id: player.idPlayer,
          };
        });

        allCards.push(...athleteCards);
      }
    }

    // 2. Search team players if team specified
    if (team) {
      // First find the team
      const teamResponse = await fetch(
        `${SPORTSDB_API}/searchteams.php?t=${encodeURIComponent(team)}`,
        { next: { revalidate: 3600 } }
      );

      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        const teams = teamData.teams || [];

        if (teams.length > 0) {
          const teamId = teams[0].idTeam;
          
          // Get players for this team
          const playersResponse = await fetch(
            `${SPORTSDB_API}/lookup_all_players.php?id=${teamId}`,
            { next: { revalidate: 3600 } }
          );

          if (playersResponse.ok) {
            const playersData = await playersResponse.json();
            const teamPlayers: SportsDBPlayer[] = playersData.player || [];

            const teamCards = teamPlayers.slice(0, 30).map(player => ({
              id: `athlete-${player.idPlayer}`,
              name: player.strPlayer,
              category: SPORT_CATEGORIES[player.strSport] || 'sports_other',
              type: 'athlete',
              team: player.strTeam,
              sport: player.strSport,
              position: player.strPosition || 'N/A',
              image_url: player.strThumb || player.strCutout || null,
              source: 'TheSportsDB',
              athlete_id: player.idPlayer,
            }));

            allCards.push(...teamCards);
          }
        }
      }
    }

    // 3. Also search our local database for user-submitted cards
    if (query) {
      try {
        const { data: localCards } = await supabase
          .from('cv_cards')
          .select('*')
          .or(`name.ilike.%${query}%,player_name.ilike.%${query}%`)
          .eq('category', 'sports')
          .limit(20);

        if (localCards && localCards.length > 0) {
          const formattedLocal = localCards.map(card => ({
            ...card,
            source: 'CravCards Database',
          }));
          allCards.push(...formattedLocal);
        }
      } catch (dbError) {
        console.log('Local DB search skipped:', dbError);
      }
    }

    // Deduplicate by athlete_id
    const seen = new Set();
    const uniqueCards = allCards.filter(card => {
      const key = card.athlete_id || card.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Paginate
    const start = (page - 1) * pageSize;
    const paginatedCards = uniqueCards.slice(start, start + pageSize);

    return NextResponse.json({
      success: true,
      cards: paginatedCards,
      query,
      sport,
      team,
      page,
      pageSize,
      totalCount: uniqueCards.length,
      totalPages: Math.ceil(uniqueCards.length / pageSize),
      sources: ['TheSportsDB', 'CravCards Database'],
      note: 'Sports cards show athletes - add your specific cards (rookie, auto, etc.) to your collection',
    });

  } catch (error) {
    console.error('Sports API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch sports cards',
      cards: [],
    }, { status: 500 });
  }
}

// POST - Submit a new sports card to the database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      player_name,
      year,
      set_name,
      card_number,
      manufacturer, // Topps, Panini, Upper Deck, etc.
      rarity,
      parallel,
      auto,
      memorabilia,
      graded,
      grade,
      grading_company,
      image_url,
    } = body;

    if (!player_name || !year) {
      return NextResponse.json({
        success: false,
        error: 'player_name and year are required',
      }, { status: 400 });
    }

    const cardName = name || `${year} ${manufacturer || ''} ${player_name} ${parallel || ''}`.trim();

    const { data, error } = await supabase
      .from('cv_cards')
      .insert({
        name: cardName,
        player_name,
        year: parseInt(year),
        set_name,
        card_number,
        manufacturer,
        category: 'sports',
        rarity: rarity || 'Base',
        parallel,
        is_auto: auto || false,
        is_memorabilia: memorabilia || false,
        is_graded: graded || false,
        grade,
        grading_company,
        image_url,
        created_at: new Date().toISOString(),
        submitted_by: 'community',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      card: data,
      message: 'Card submitted successfully! Thank you for contributing.',
    });

  } catch (error) {
    console.error('Sports card submission error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit card',
    }, { status: 500 });
  }
}
