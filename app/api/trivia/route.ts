import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabase
      .from('cv_trivia_questions')
      .select('*')
      .eq('is_active', true)

    if (category && category !== 'all') query = query.eq('category', category)
    if (difficulty && difficulty !== 'all') query = query.eq('difficulty', difficulty)

    // Get random questions
    const { data, error } = await query.limit(limit * 3) // Fetch more to randomize

    if (error) throw error

    // Shuffle and limit
    const shuffled = data?.sort(() => Math.random() - 0.5).slice(0, limit) || []

    return NextResponse.json({ success: true, data: shuffled })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, question_id, answer, session_id } = body

    // Get the question
    const { data: question, error: qError } = await supabase
      .from('cv_trivia_questions')
      .select('correct_answer, xp_reward, explanation')
      .eq('id', question_id)
      .single()

    if (qError) throw qError

    const is_correct = question.correct_answer === answer
    const xp_earned = is_correct ? question.xp_reward : 0

    // Update session if provided
    if (session_id) {
      await supabase.rpc('update_trivia_session', {
        p_session_id: session_id,
        p_is_correct: is_correct,
        p_xp_earned: xp_earned
      })
    }

    // Award XP if correct
    if (is_correct && user_id) {
      await supabase.rpc('update_user_xp', {
        p_user_id: user_id,
        p_xp_amount: xp_earned
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        is_correct,
        correct_answer: question.correct_answer,
        explanation: question.explanation,
        xp_earned
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
