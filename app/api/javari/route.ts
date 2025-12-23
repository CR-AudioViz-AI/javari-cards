// ============================================================================
// JAVARI AI - Enhanced Multi-Provider Card Expert
// CravCards - CR AudioViz AI, LLC
// Created: December 22, 2025
// Features: Multi-AI routing, streaming, card-specific knowledge, memory
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { JAVARI_SYSTEM_PROMPT, CARD_HISTORY, GRADING_KNOWLEDGE, INVESTMENT_STRATEGIES, FAMOUS_CARDS } from '@/lib/javari-knowledge';

// AI Provider Configuration
const AI_PROVIDERS = {
  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-5-sonnet-20241022',
    getKey: () => process.env.ANTHROPIC_API_KEY,
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4-turbo-preview',
    getKey: () => process.env.OPENAI_API_KEY,
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.1-70b-versatile',
    getKey: () => process.env.GROQ_API_KEY,
  },
  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    model: 'gemini-1.5-flash',
    getKey: () => process.env.GEMINI_API_KEY,
  },
  perplexity: {
    url: 'https://api.perplexity.ai/chat/completions',
    model: 'llama-3.1-sonar-large-128k-online',
    getKey: () => process.env.PERPLEXITY_API_KEY,
  },
};

type ProviderName = keyof typeof AI_PROVIDERS;

// Provider priority for fallback
const PROVIDER_PRIORITY: ProviderName[] = ['groq', 'anthropic', 'openai', 'perplexity', 'gemini'];

// Enhanced system prompt with card-specific context
function buildSystemPrompt(userContext?: any): string {
  let prompt = JAVARI_SYSTEM_PROMPT;

  // Add real-time context
  prompt += `\n\n## Current Date: ${new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`;

  // Add user context if available
  if (userContext?.collection_stats) {
    prompt += `\n\n## User Collection Context:
- Total Cards: ${userContext.collection_stats.total_cards || 0}
- Collection Value: $${userContext.collection_stats.total_value || 0}
- Categories: ${userContext.collection_stats.categories?.join(', ') || 'Not specified'}
- Favorite Category: ${userContext.favorite_category || 'Not set'}`;
  }

  // Add quick reference data
  prompt += `\n\n## Quick Reference - Top Cards by Value:
Pokemon: Pikachu Illustrator ($5.275M), 1st Ed Charizard PSA 10 ($420K)
MTG: Black Lotus Alpha ($600K+), Ancestral Recall ($100K+)
Sports: Mickey Mantle 1952 Topps ($12.6M), Honus Wagner T206 ($7.25M)
Yu-Gi-Oh: Tournament Black Luster Soldier ($2M+)`;

  prompt += `\n\n## Platform Features You Can Help With:
- Collection management and tracking
- Card scanning and identification
- Price guides and market trends
- Grading recommendations
- Investment strategies
- Trivia and education
- Trading and marketplace
- Achievement system and gamification`;

  return prompt;
}

// Call Anthropic API
async function callAnthropic(messages: any[], systemPrompt: string): Promise<string> {
  const apiKey = AI_PROVIDERS.anthropic.getKey();
  if (!apiKey) throw new Error('Anthropic API key not configured');

  const response = await fetch(AI_PROVIDERS.anthropic.url, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_PROVIDERS.anthropic.model,
      max_tokens: 2000,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || `Anthropic error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0]?.text || '';
}

// Call OpenAI-compatible API (OpenAI, Groq, Perplexity)
async function callOpenAICompatible(
  provider: 'openai' | 'groq' | 'perplexity',
  messages: any[],
  systemPrompt: string
): Promise<string> {
  const config = AI_PROVIDERS[provider];
  const apiKey = config.getKey();
  if (!apiKey) throw new Error(`${provider} API key not configured`);

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || `${provider} error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

// Call Gemini API
async function callGemini(messages: any[], systemPrompt: string): Promise<string> {
  const apiKey = AI_PROVIDERS.gemini.getKey();
  if (!apiKey) throw new Error('Gemini API key not configured');

  // Convert messages to Gemini format
  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'I understand. I am Javari, your expert trading card assistant from CravCards.' }] },
    ...messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  ];

  const response = await fetch(`${AI_PROVIDERS.gemini.url}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || `Gemini error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || '';
}

// Main AI call with fallback
async function callAI(
  messages: any[],
  systemPrompt: string,
  preferredProvider?: ProviderName
): Promise<{ response: string; provider: string }> {
  // Determine provider order
  const providers = preferredProvider
    ? [preferredProvider, ...PROVIDER_PRIORITY.filter(p => p !== preferredProvider)]
    : PROVIDER_PRIORITY;

  const errors: string[] = [];

  for (const provider of providers) {
    try {
      let response: string;

      switch (provider) {
        case 'anthropic':
          response = await callAnthropic(messages, systemPrompt);
          break;
        case 'gemini':
          response = await callGemini(messages, systemPrompt);
          break;
        default:
          response = await callOpenAICompatible(provider, messages, systemPrompt);
      }

      if (response) {
        return { response, provider };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${provider}: ${errorMsg}`);
      console.log(`Javari AI - ${provider} failed: ${errorMsg}`);
      continue;
    }
  }

  throw new Error(`All AI providers failed: ${errors.join('; ')}`);
}

// Detect intent for smarter responses
function detectIntent(message: string): string {
  const lowercaseMsg = message.toLowerCase();

  if (lowercaseMsg.includes('price') || lowercaseMsg.includes('worth') || lowercaseMsg.includes('value')) {
    return 'pricing';
  }
  if (lowercaseMsg.includes('grade') || lowercaseMsg.includes('psa') || lowercaseMsg.includes('bgs') || lowercaseMsg.includes('cgc')) {
    return 'grading';
  }
  if (lowercaseMsg.includes('invest') || lowercaseMsg.includes('buy') || lowercaseMsg.includes('sell')) {
    return 'investment';
  }
  if (lowercaseMsg.includes('fake') || lowercaseMsg.includes('counterfeit') || lowercaseMsg.includes('authentic')) {
    return 'authentication';
  }
  if (lowercaseMsg.includes('history') || lowercaseMsg.includes('when') || lowercaseMsg.includes('first')) {
    return 'history';
  }
  if (lowercaseMsg.includes('collection') || lowercaseMsg.includes('organize') || lowercaseMsg.includes('manage')) {
    return 'collection';
  }
  return 'general';
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const {
      message,
      conversation_history = [],
      user_context = {},
      provider: preferredProvider,
      stream = false,
    } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Message is required',
      }, { status: 400 });
    }

    // Build enhanced system prompt
    const systemPrompt = buildSystemPrompt(user_context);

    // Detect intent for analytics
    const intent = detectIntent(message);

    // Prepare conversation history (limit to last 10 messages)
    const messages = [
      ...conversation_history.slice(-10),
      { role: 'user', content: message },
    ];

    // Call AI with fallback
    const { response, provider } = await callAI(
      messages,
      systemPrompt,
      preferredProvider as ProviderName
    );

    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        message: response,
        provider,
        intent,
        processing_time_ms: processingTime,
      },
    });
  } catch (error) {
    console.error('Javari API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process request',
    }, { status: 500 });
  }
}

// GET endpoint for knowledge base queries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    const action = searchParams.get('action');

    // Health check
    if (action === 'health') {
      const providers = Object.entries(AI_PROVIDERS).map(([name, config]) => ({
        name,
        configured: !!config.getKey(),
        model: config.model,
      }));

      return NextResponse.json({
        success: true,
        status: 'healthy',
        providers,
        configured_count: providers.filter(p => p.configured).length,
      });
    }

    // Knowledge base lookup
    let data: any = {};

    switch (topic) {
      case 'history':
        data = CARD_HISTORY;
        break;
      case 'grading':
        data = GRADING_KNOWLEDGE;
        break;
      case 'investment':
        data = INVESTMENT_STRATEGIES;
        break;
      case 'famous_cards':
        data = FAMOUS_CARDS;
        break;
      case 'providers':
        data = {
          available: Object.keys(AI_PROVIDERS),
          priority: PROVIDER_PRIORITY,
          configured: PROVIDER_PRIORITY.filter(p => AI_PROVIDERS[p].getKey()),
        };
        break;
      default:
        data = {
          topics: ['history', 'grading', 'investment', 'famous_cards', 'providers'],
          description: 'Use ?topic=<topic_name> to get specific knowledge',
          actions: ['health'],
        };
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Javari Knowledge API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch knowledge',
    }, { status: 500 });
  }
}
