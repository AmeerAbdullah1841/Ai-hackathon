import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { findTenantById, createTenant } from "@/lib/store";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export const dynamic = "force-dynamic";

// Helper function to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (!session.subscription) {
      return NextResponse.json(
        { error: "No subscription found for this session" },
        { status: 400 }
      );
    }

    const subscription = session.subscription as Stripe.Subscription;
    const customerId = subscription.customer as string;

    // Get metadata from session
    const tenantName = session.metadata?.tenantName;
    const adminName = session.metadata?.adminName;
    const adminEmail = session.metadata?.adminEmail || session.customer_email;
    const billingPeriod = session.metadata?.billingPeriod;

    // Find tenant by Stripe customer ID with retry logic
    const { getDb } = await import("@/lib/db.server");
    const db = await getDb();
    
    let result = await db`
      SELECT * FROM tenants WHERE "stripeCustomerId" = ${customerId} LIMIT 1
    `;

    // If tenant not found, wait and retry (webhook might be processing)
    if (result.rows.length === 0) {
      console.log("Tenant not found, waiting for webhook...");
      
      // Retry up to 5 times with increasing delays
      for (let attempt = 0; attempt < 5; attempt++) {
        await wait(1000 * (attempt + 1)); // 1s, 2s, 3s, 4s, 5s
        
        result = await db`
          SELECT * FROM tenants WHERE "stripeCustomerId" = ${customerId} LIMIT 1
        `;
        
        if (result.rows.length > 0) {
          console.log(`Tenant found after ${attempt + 1} retry attempts`);
          break;
        }
      }
    }

    // If still not found, create tenant directly (fallback if webhook failed or is delayed)
    if (result.rows.length === 0) {
      console.log("Tenant still not found, creating tenant directly from session data...");
      
      if (!tenantName || !adminName || !adminEmail || !billingPeriod) {
        return NextResponse.json(
          { error: "Missing required metadata. Please contact support." },
          { status: 400 }
        );
      }

      // Calculate subscription dates
      const startDate = new Date(subscription.current_period_start * 1000).toISOString();
      const endDate = new Date(subscription.current_period_end * 1000).toISOString();

      // Create tenant directly
      const tenant = await createTenant(tenantName, {
        adminEmail,
        adminName,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        billingPeriod,
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
      });

      console.log(`Tenant created directly: ${tenant.name}`);

      return NextResponse.json({
        tenantName: tenant.name,
        adminUsername: tenant.adminUsername,
        adminPassword: tenant.adminPassword,
        adminEmail: tenant.adminEmail || adminEmail,
        billingPeriod: tenant.billingPeriod,
      });
    }

    const tenant = result.rows[0];

    return NextResponse.json({
      tenantName: tenant.name,
      adminUsername: tenant.adminUsername,
      adminPassword: tenant.adminPassword,
      adminEmail: tenant.adminEmail || session.customer_email,
      billingPeriod: tenant.billingPeriod,
    });
  } catch (error) {
    console.error("Error retrieving credentials:", error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to retrieve credentials" },
      { status: 500 }
    );
  }
}




