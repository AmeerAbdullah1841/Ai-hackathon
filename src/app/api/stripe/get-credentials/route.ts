import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { findTenantById, createTenant } from "@/lib/store";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
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

    console.log(`[GET-CREDENTIALS] Retrieving credentials for session: ${sessionId}`);

    // Retrieve checkout session from Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["subscription"],
      });
    } catch (stripeError) {
      console.error("[GET-CREDENTIALS] Stripe error:", stripeError);
      return NextResponse.json(
        { error: `Failed to retrieve Stripe session: ${stripeError instanceof Error ? stripeError.message : "Unknown error"}` },
        { status: 400 }
      );
    }

    if (!session.subscription) {
      console.error("[GET-CREDENTIALS] No subscription found in session");
      return NextResponse.json(
        { error: "No subscription found for this session" },
        { status: 400 }
      );
    }

    const subscription = session.subscription as Stripe.Subscription;
    const customerId = subscription.customer as string;

    console.log(`[GET-CREDENTIALS] Customer ID: ${customerId}`);

    // Get metadata from session
    const tenantName = session.metadata?.tenantName;
    const adminName = session.metadata?.adminName;
    const adminEmail = session.metadata?.adminEmail || session.customer_email;
    const billingPeriod = session.metadata?.billingPeriod;

    console.log(`[GET-CREDENTIALS] Metadata - Tenant: ${tenantName}, Admin: ${adminName}, Email: ${adminEmail}, Period: ${billingPeriod}`);

    // Find tenant by Stripe customer ID with retry logic
    const { getDb } = await import("@/lib/db.server");
    let db;
    try {
      db = await getDb();
    } catch (dbError) {
      console.error("[GET-CREDENTIALS] Database connection error:", dbError);
      return NextResponse.json(
        { error: `Database connection failed: ${dbError instanceof Error ? dbError.message : "Unknown error"}` },
        { status: 500 }
      );
    }
    
    let result;
    try {
      result = await db`
        SELECT * FROM tenants WHERE "stripeCustomerId" = ${customerId} LIMIT 1
      `;
    } catch (queryError) {
      console.error("[GET-CREDENTIALS] Database query error:", queryError);
      return NextResponse.json(
        { error: `Database query failed: ${queryError instanceof Error ? queryError.message : "Unknown error"}` },
        { status: 500 }
      );
    }

    // If tenant not found, wait and retry (webhook might be processing)
    if (result.rows.length === 0) {
      console.log("[GET-CREDENTIALS] Tenant not found, waiting for webhook...");
      
      // Retry up to 6 times with shorter delays (total ~10 seconds instead of 15)
      for (let attempt = 0; attempt < 6; attempt++) {
        const delay = attempt === 0 ? 500 : 1000 * attempt; // 0.5s, 1s, 2s, 3s, 4s, 5s
        await wait(delay);
        
        console.log(`[GET-CREDENTIALS] Retry attempt ${attempt + 1}/6, checking for tenant...`);
        
        try {
          result = await db`
            SELECT * FROM tenants WHERE "stripeCustomerId" = ${customerId} LIMIT 1
          `;
        } catch (queryError) {
          console.error(`[GET-CREDENTIALS] Retry ${attempt + 1} query error:`, queryError);
          continue;
        }
        
        if (result.rows.length > 0) {
          console.log(`[GET-CREDENTIALS] ✅ Tenant found after ${attempt + 1} retry attempts`);
          break;
        }
      }
    }

    // If still not found, create tenant directly (fallback if webhook failed or is delayed)
    if (result.rows.length === 0) {
      console.log("[GET-CREDENTIALS] Tenant still not found, creating tenant directly from session data...");
      
      if (!tenantName || !adminName || !adminEmail || !billingPeriod) {
        console.error("[GET-CREDENTIALS] Missing required metadata:", { tenantName, adminName, adminEmail, billingPeriod });
        return NextResponse.json(
          { error: "Missing required metadata. Please contact support." },
          { status: 400 }
        );
      }

      // Calculate subscription dates
      const startDate = new Date(subscription.current_period_start * 1000).toISOString();
      const endDate = new Date(subscription.current_period_end * 1000).toISOString();

      // Create tenant directly
      let tenant;
      try {
        tenant = await createTenant(tenantName, {
          adminEmail,
          adminName,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          billingPeriod,
          subscriptionStartDate: startDate,
          subscriptionEndDate: endDate,
        });
      } catch (createError) {
        console.error("[GET-CREDENTIALS] Error creating tenant:", createError);
        return NextResponse.json(
          { error: `Failed to create tenant: ${createError instanceof Error ? createError.message : "Unknown error"}` },
          { status: 500 }
        );
      }

      console.log(`[GET-CREDENTIALS] ✅ Tenant created directly: ${tenant.name}`);

      return NextResponse.json({
        tenantName: tenant.name,
        adminUsername: tenant.adminUsername,
        adminPassword: tenant.adminPassword,
        adminEmail: tenant.adminEmail || adminEmail,
        billingPeriod: tenant.billingPeriod,
      });
    }

    const tenant = result.rows[0];
    console.log(`[GET-CREDENTIALS] ✅ Tenant found: ${tenant.name}`);

    return NextResponse.json({
      tenantName: tenant.name,
      adminUsername: tenant.adminUsername,
      adminPassword: tenant.adminPassword,
      adminEmail: tenant.adminEmail || session.customer_email,
      billingPeriod: tenant.billingPeriod,
    });
  } catch (error) {
    console.error("[GET-CREDENTIALS] Unexpected error:", error);
    console.error("[GET-CREDENTIALS] Error stack:", error instanceof Error ? error.stack : "No stack trace");
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to retrieve credentials",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}




