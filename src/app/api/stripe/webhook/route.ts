import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createTenant, updateTenantSubscription } from "@/lib/store";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  console.log(`[WEBHOOK] Received webhook request`);

  if (!signature) {
    console.error("[WEBHOOK] ERROR: No signature provided");
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log(`[WEBHOOK] Event verified: ${event.type} (ID: ${event.id})`);
  } catch (err) {
    console.error("[WEBHOOK] ERROR: Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log(`[WEBHOOK] checkout.session.completed received - Session ID: ${session.id}`);
        
        // Only process subscription checkouts
        if (session.mode !== "subscription") {
          console.log("[WEBHOOK] Not a subscription checkout, skipping");
          return NextResponse.json({ received: true });
        }

        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        console.log(`[WEBHOOK] Processing subscription - Customer: ${customerId}, Subscription: ${subscriptionId}`);

        // Retrieve subscription to get more details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;
        
        // Get metadata from session
        const tenantName = session.metadata?.tenantName;
        const adminName = session.metadata?.adminName;
        const adminEmail = session.metadata?.adminEmail;
        const billingPeriod = session.metadata?.billingPeriod;

        console.log(`[WEBHOOK] Metadata - Tenant: ${tenantName}, Admin: ${adminName}, Email: ${adminEmail}, Period: ${billingPeriod}`);

        if (!tenantName || !adminName || !adminEmail || !billingPeriod) {
          console.error("[WEBHOOK] ERROR: Missing required metadata in checkout session");
          return NextResponse.json(
            { error: "Missing required metadata" },
            { status: 400 }
          );
        }

        // Calculate subscription dates
        const startDate = new Date(subscription.current_period_start * 1000).toISOString();
        const endDate = new Date(subscription.current_period_end * 1000).toISOString();

        console.log(`[WEBHOOK] Creating tenant: ${tenantName}...`);

        // Create tenant with Stripe subscription information
        const tenant = await createTenant(tenantName, {
          adminEmail,
          adminName,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          billingPeriod,
          subscriptionStartDate: startDate,
          subscriptionEndDate: endDate,
        });

        console.log(`[WEBHOOK] ✅ Tenant created successfully!`);
        console.log(`[WEBHOOK]    - Tenant ID: ${tenant.id}`);
        console.log(`[WEBHOOK]    - Tenant Name: ${tenant.name}`);
        console.log(`[WEBHOOK]    - Admin Username: ${tenant.adminUsername}`);
        console.log(`[WEBHOOK]    - Customer ID: ${customerId}`);
        console.log(`[WEBHOOK]    - Subscription ID: ${subscriptionId}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find tenant by customer ID
        const { getDb } = await import("@/lib/db.server");
        const db = await getDb();
        const result = await db`
          SELECT id FROM tenants WHERE "stripeCustomerId" = ${customerId} LIMIT 1
        `;

        if (result.rows.length > 0) {
          const tenantId = result.rows[0].id;
          const status = subscription.status;
          const endDate = new Date(subscription.current_period_end * 1000).toISOString();

          await updateTenantSubscription(tenantId, {
            subscriptionStatus: status,
            subscriptionEndDate: endDate,
          });

          console.log(`Subscription updated for tenant ${tenantId}: ${status}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find tenant by customer ID
        const { getDb } = await import("@/lib/db.server");
        const db = await getDb();
        const result = await db`
          SELECT id FROM tenants WHERE "stripeCustomerId" = ${customerId} LIMIT 1
        `;

        if (result.rows.length > 0) {
          const tenantId = result.rows[0].id;

          await updateTenantSubscription(tenantId, {
            subscriptionStatus: "canceled",
          });

          console.log(`Subscription canceled for tenant ${tenantId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}




