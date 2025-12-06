import { NextRequest, NextResponse } from 'next/server'
import { JAVARI_SYSTEM_PROMPT, CARD_HISTORY, GRADING_KNOWLEDGE, INVESTMENT_STRATEGIES, FAMOUS_CARDS } from '@/lib/javari-knowledge'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversation_history = [], user_context = {} } = body

    // Build context-aware system prompt
    let contextPrompt = JAVARI_SYSTEM_PROMPT

    // Add user context if available
    if (user_context.collection_stats) {
      contextPrompt += `\n\nUser Collection Context:
- Total Cards: ${user_context.collection_stats.total_cards}
- Collection Value: $${user_context.collection_stats.total_value}
- Favorite Category: ${user_context.favorite_category || 'Not set'}`
    }

    // Build messages array
    const messages = [
      { role: 'system', content: contextPrompt },
      ...conversation_history.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ]

    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'OpenAI API error')
    }

    const data = await response.json()
    const assistantMessage = data.choices[0]?.message?.content

    return NextResponse.json({
      success: true,
      data: {
        message: assistantMessage,
        tokens_used: data.usage?.total_tokens
      }
    })
  } catch (error: any) {
    console.error('Javari API Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// GET endpoint for knowledge base queries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get('topic')

    let data: any = {}

    switch (topic) {
      case 'history':
        data = CARD_HISTORY
        break
      case 'grading':
        data = GRADING_KNOWLEDGE
        break
      case 'investment':
        data = INVESTMENT_STRATEGIES
        break
      case 'famous_cards':
        data = FAMOUS_CARDS
        break
      default:
        data = {
          topics: ['history', 'grading', 'investment', 'famous_cards'],
          description: 'Use ?topic=<topic_name> to get specific knowledge'
        }
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
