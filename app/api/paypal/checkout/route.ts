export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API_URL = 'https://api-m.paypal.com'; // Live URL

// Price mapping (same as Stripe)
const PAYPAL_PRICES: Record<string, { name: string; amount: string; description: string }> = {
  collector_monthly: {
    name: 'CravCards Collector',
    amount: '9.00',
    description: 'CravCards Collector Plan - 500 cards, trading access, priority support',
  },
  premium_monthly: {
    name: 'CravCards Premium',
    amount: '29.00',
    description: 'CravCards Premium Plan - Unlimited cards, VIP access, all features',
  },
};

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userId } = body;

    if (!planId || !PAYPAL_PRICES[planId]) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      );
    }

    const plan = PAYPAL_PRICES[planId];
    const accessToken = await getAccessToken();

    // Create PayPal order
    const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: plan.amount,
            },
            description: plan.description,
            custom_id: userId || 'guest',
          },
        ],
        application_context: {
          brand_name: 'CravCards',
          landing_page: 'LOGIN',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cravcards.com'}/dashboard?paypal=success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cravcards.com'}/pricing?paypal=cancelled`,
        },
      }),
    });

    const order = await orderResponse.json();

    if (order.id) {
      // Find approval URL
      const approvalLink = order.links?.find((link: any) => link.rel === 'approve');
      return NextResponse.json({
        orderId: order.id,
        approvalUrl: approvalLink?.href,
      });
    }

    return NextResponse.json(
      { error: 'Failed to create PayPal order', details: order },
      { status: 500 }
    );
  } catch (error: unknown) {
    console.error('PayPal checkout error:', error);
    const message = error instanceof Error ? error.message : 'PayPal checkout failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST with { planId, userId? }' },
    { status: 405 }
  );
}
