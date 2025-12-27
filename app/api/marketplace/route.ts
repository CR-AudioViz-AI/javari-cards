import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16"
});

// Commission rates for card marketplace
const COMMISSION_RATES = {
  standard: 0.08,      // 8% standard
  graded: 0.06,        // 6% for PSA/BGS graded
  auction: 0.10,       // 10% for auctions
  bulk: 0.05           // 5% for bulk lots
};

const LISTING_FEES = {
  standard: 0,
  featured: 299,       // $2.99 featured
  showcase: 999,       // $9.99 showcase (top visibility)
  auction: 149         // $1.49 auction
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "list_card": {
        const { userId, cardId, price, condition, graded, gradingService, grade, listingType } = body;

        const fee = LISTING_FEES[listingType as keyof typeof LISTING_FEES] || 0;
        const commissionRate = graded ? COMMISSION_RATES.graded : COMMISSION_RATES[listingType as keyof typeof COMMISSION_RATES] || 0.08;

        if (fee > 0) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("stripe_customer_id")
            .eq("id", userId)
            .single();

          const session = await stripe.checkout.sessions.create({
            customer: profile?.stripe_customer_id,
            mode: "payment",
            line_items: [{
              price_data: {
                currency: "usd",
                product_data: { name: `${listingType} Card Listing` },
                unit_amount: fee
              },
              quantity: 1
            }],
            metadata: {
              type: "card_listing_fee",
              user_id: userId,
              card_id: cardId,
              listing_type: listingType,
              price: price.toString()
            },
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/marketplace/cards/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/marketplace/cards/sell`
          });

          return NextResponse.json({ checkoutUrl: session.url });
        }

        const { data: listing, error } = await supabase
          .from("card_listings")
          .insert({
            seller_id: userId,
            card_id: cardId,
            price,
            condition,
            graded,
            grading_service: gradingService,
            grade,
            listing_type: listingType,
            commission_rate: commissionRate,
            status: "active"
          })
          .select()
          .single();

        if (error) throw error;
        return NextResponse.json({ listing });
      }

      case "purchase_card": {
        const { buyerId, listingId } = body;

        const { data: listing } = await supabase
          .from("card_listings")
          .select("*")
          .eq("id", listingId)
          .eq("status", "active")
          .single();

        if (!listing) {
          return NextResponse.json({ error: "Card not available" }, { status: 400 });
        }

        const commission = Math.round(listing.price * listing.commission_rate);

        const { data: buyerProfile } = await supabase
          .from("user_profiles")
          .select("stripe_customer_id")
          .eq("id", buyerId)
          .single();

        const session = await stripe.checkout.sessions.create({
          customer: buyerProfile?.stripe_customer_id,
          mode: "payment",
          line_items: [{
            price_data: {
              currency: "usd",
              product_data: { name: "Trading Card Purchase" },
              unit_amount: listing.price
            },
            quantity: 1
          }],
          metadata: {
            type: "card_purchase",
            listing_id: listingId,
            buyer_id: buyerId,
            seller_id: listing.seller_id,
            commission
          },
          success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/marketplace/cards/purchase/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/marketplace/cards/${listingId}`
        });

        return NextResponse.json({ checkoutUrl: session.url });
      }

      case "price_check": {
        // AI-powered card valuation
        const { cardName, set, condition, graded, grade } = body;

        // Get recent sales data
        const { data: recentSales } = await supabase
          .from("card_listings")
          .select("price, sold_at")
          .eq("status", "sold")
          .ilike("card_name", `%${cardName}%`)
          .order("sold_at", { ascending: false })
          .limit(10);

        const avgPrice = recentSales?.length 
          ? recentSales.reduce((sum, s) => sum + s.price, 0) / recentSales.length 
          : null;

        // Condition multipliers
        const conditionMultipliers: Record<string, number> = {
          mint: 1.0, near_mint: 0.85, excellent: 0.7, good: 0.5, fair: 0.3
        };

        const gradeMultipliers: Record<string, number> = {
          "10": 3.0, "9.5": 2.2, "9": 1.8, "8.5": 1.4, "8": 1.2
        };

        let estimatedValue = avgPrice || 0;
        if (condition) estimatedValue *= conditionMultipliers[condition] || 0.7;
        if (graded && grade) estimatedValue *= gradeMultipliers[grade] || 1.0;

        return NextResponse.json({
          cardName,
          estimatedValue: Math.round(estimatedValue),
          recentSales: recentSales?.length || 0,
          averageSalePrice: avgPrice ? Math.round(avgPrice) : null,
          priceRange: avgPrice ? {
            low: Math.round(avgPrice * 0.7),
            high: Math.round(avgPrice * 1.3)
          } : null
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
