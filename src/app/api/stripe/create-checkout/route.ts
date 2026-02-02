import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPricingPlan, type BillingPeriod } from "@/lib/stripe-config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { billingPeriod, tenantName, adminName, adminEmail } = body;

    // Validate input
    if (!billingPeriod || !["monthly", "quarterly", "annual"].includes(billingPeriod)) {
      return NextResponse.json(
        { error: "Invalid billing period" },
        { status: 400 }
      );
    }

    if (!tenantName || typeof tenantName !== "string" || tenantName.trim().length === 0) {
      return NextResponse.json(
        { error: "Tenant name is required" },
        { status: 400 }
      );
    }

    if (!adminName || typeof adminName !== "string" || adminName.trim().length === 0) {
      return NextResponse.json(
        { error: "Admin name is required" },
        { status: 400 }
      );
    }

    if (!adminEmail || typeof adminEmail !== "string" || !adminEmail.includes("@")) {
      return NextResponse.json(
        { error: "Valid admin email is required" },
        { status: 400 }
      );
    }

    // Get pricing plan
    const plan = getPricingPlan(billingPeriod as BillingPeriod);
    
    // Validate Price ID is set
    if (!plan.priceId || plan.priceId.includes("placeholder")) {
      return NextResponse.json(
        { 
          error: `Stripe Price ID for ${billingPeriod} plan is not configured. Please set STRIPE_PRICE_ID_${billingPeriod.toUpperCase()} in your environment variables.` 
        },
        { status: 400 }
      );
    }

    // Validate Stripe secret key is set
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.trim() === "") {
      return NextResponse.json(
        { error: "Stripe secret key is not configured. Please set STRIPE_SECRET_KEY in your environment variables." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3004";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: adminEmail.trim(),
      metadata: {
        tenantName: tenantName.trim(),
        adminName: adminName.trim(),
        adminEmail: adminEmail.trim(),
        billingPeriod: billingPeriod,
      },
      success_url: `${baseUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      subscription_data: {
        metadata: {
          tenantName: tenantName.trim(),
          adminName: adminName.trim(),
          adminEmail: adminEmail.trim(),
          billingPeriod: billingPeriod,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}




