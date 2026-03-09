export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================================
// CARD SCAN API - IMAGE-BASED CARD IDENTIFICATION
// Uses OCR + fuzzy matching to identify cards from photos
// CravCards - CR AudioViz AI, LLC
// Created: December 12, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cravcards.com';

// POST - Process card image and identify
export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({
        success: false,
        error: 'No image provided',
      }, { status: 400 });
    }

    // Extract text from image using OCR
    const extractedText = await extractTextFromImage(image);
    
    if (!extractedText || extractedText.length < 3) {
      return NextResponse.json({
        success: false,
        error: 'Could not read card text. Try a clearer, well-lit image.',
      });
    }

    // Search for card using extracted text
    const cardResult = await searchCardByText(extractedText);

    if (cardResult) {
      return NextResponse.json({
        success: true,
        card: cardResult,
        extractedText,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Card not found. Try typing the card name manually.',
      extractedText,
    });
  } catch (error) {
    console.error('Card scan error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Scan processing failed',
    }, { status: 500 });
  }
}

// Extract text from image using Tesseract.js or external OCR
async function extractTextFromImage(base64Image: string): Promise<string> {
  // Method 1: Use Google Cloud Vision (if configured)
  if (process.env.GOOGLE_CLOUD_VISION_API_KEY) {
    try {
      const visionResult = await callGoogleVision(base64Image);
      if (visionResult) return visionResult;
    } catch (err) {
      console.error('Google Vision error:', err);
    }
  }

  // Method 2: Use OpenAI Vision (if configured) 
  if (process.env.OPENAI_API_KEY) {
    try {
      const openaiResult = await callOpenAIVision(base64Image);
      if (openaiResult) return openaiResult;
    } catch (err) {
      console.error('OpenAI Vision error:', err);
    }
  }

  // Method 3: Basic pattern extraction (fallback)
  // In production, you'd use Tesseract.js on the server
  return '';
}

// Call Google Cloud Vision API
async function callGoogleVision(base64Image: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
  if (!apiKey) return null;

  // Remove data URL prefix if present
  const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: imageData },
          features: [
            { type: 'TEXT_DETECTION', maxResults: 10 },
            { type: 'LOGO_DETECTION', maxResults: 5 },
          ],
        }],
      }),
    }
  );

  const data = await response.json();
  
  if (data.responses?.[0]?.textAnnotations?.[0]?.description) {
    return data.responses[0].textAnnotations[0].description;
  }

  return null;
}

// Call OpenAI Vision API
async function callOpenAIVision(base64Image: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: `This is a trading card image. Extract the following information if visible:
1. Card name (the main title)
2. Set name or symbol
3. Card number
4. Any visible text that could help identify this specific card

Respond in JSON format: {"name": "", "set": "", "number": "", "category": "pokemon|mtg|sports"}`,
          },
          {
            type: 'image_url',
            image_url: { url: base64Image },
          },
        ],
      }],
      max_tokens: 200,
    }),
  });

  const data = await response.json();
  
  if (data.choices?.[0]?.message?.content) {
    try {
      const parsed = JSON.parse(data.choices[0].message.content);
      return parsed.name || '';
    } catch {
      return data.choices[0].message.content;
    }
  }

  return null;
}

// Search for card using extracted text
async function searchCardByText(text: string): Promise<any | null> {
  // Clean up extracted text
  const cleanedText = text
    .split('\n')
    .filter(line => line.trim().length > 2)
    .slice(0, 5) // Take first 5 lines (usually includes card name)
    .join(' ')
    .replace(/[^\w\s-]/g, ' ')
    .trim();

  // Try searching with different parts of the text
  const searchTerms = [
    cleanedText.split(' ').slice(0, 3).join(' '), // First 3 words
    cleanedText.split(' ')[0], // Just first word
    cleanedText, // Full text
  ];

  for (const term of searchTerms) {
    if (term.length < 3) continue;

    try {
      const response = await fetch(
        `${BASE_URL}/api/cards/search?q=${encodeURIComponent(term)}&limit=5`
      );
      const data = await response.json();

      if (data.success && data.results?.length > 0) {
        // Return best match with confidence score
        const bestMatch = data.results[0];
        const confidence = calculateConfidence(term, bestMatch.name);
        
        return {
          ...bestMatch,
          confidence,
        };
      }
    } catch (err) {
      console.error('Search error for term:', term, err);
    }
  }

  return null;
}

// Calculate match confidence (0-100)
function calculateConfidence(searchTerm: string, cardName: string): number {
  const search = searchTerm.toLowerCase();
  const name = cardName.toLowerCase();

  // Exact match
  if (search === name) return 100;

  // Card name starts with search term
  if (name.startsWith(search)) return 90;

  // Search term is contained in card name
  if (name.includes(search)) return 80;

  // Word match
  const searchWords = search.split(' ').filter(w => w.length > 2);
  const nameWords = name.split(' ').filter(w => w.length > 2);
  const matchedWords = searchWords.filter(sw => 
    nameWords.some(nw => nw.includes(sw) || sw.includes(nw))
  );
  
  if (matchedWords.length > 0) {
    return Math.round((matchedWords.length / searchWords.length) * 70);
  }

  return 30; // Low confidence default
}
