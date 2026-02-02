# Webhook Monitoring & Testing Guide

## How to Check if Webhooks Are Working

### Method 1: Check Stripe Dashboard (Easiest)

1. **Go to Stripe Webhooks Dashboard:**
   - **Test Mode:** https://dashboard.stripe.com/test/webhooks
   - **Live Mode:** https://dashboard.stripe.com/webhooks

2. **Click on your webhook endpoint** (the one you created)

3. **Check the "Events" tab:**
   - You'll see all webhook events sent to your endpoint
   - Look for `checkout.session.completed` events
   - Check the status:
     - ✅ **200 OK** = Webhook delivered successfully
     - ❌ **4xx/5xx** = Webhook failed
     - ⏳ **Pending** = Webhook is being retried

4. **Click on an event** to see:
   - Request payload (what Stripe sent)
   - Response (what your server returned)
   - Response time
   - Number of retry attempts

### Method 2: Check Your Application Logs

#### In Development (Terminal):

When running `npm run dev`, you should see logs like:

```
Tenant created successfully for [TenantName]
```

Or errors like:
```
Error processing webhook: [error message]
```

#### Check Server Logs:

Look for these log messages in your terminal:
- `Tenant created successfully for [name]` ✅
- `Subscription updated for tenant [id]: [status]` ✅
- `Error processing webhook:` ❌

### Method 3: Check Database Directly

Verify tenants were created in your database:

#### Using SQL Query:

```sql
-- Check all tenants
SELECT id, name, "adminUsername", "stripeCustomerId", "stripeSubscriptionId", 
       "subscriptionStatus", "billingPeriod", "createdAt"
FROM tenants
ORDER BY "createdAt" DESC;

-- Check recent tenants (last hour)
SELECT id, name, "adminUsername", "stripeCustomerId", "subscriptionStatus", "createdAt"
FROM tenants
WHERE "createdAt" > NOW() - INTERVAL '1 hour'
ORDER BY "createdAt" DESC;

-- Check tenants with active subscriptions
SELECT id, name, "adminUsername", "stripeCustomerId", "subscriptionStatus", "billingPeriod"
FROM tenants
WHERE "subscriptionStatus" = 'active'
ORDER BY "createdAt" DESC;
```

#### Using Command Line (if using PostgreSQL):

```bash
# Connect to your database
psql $POSTGRES_URL

# Then run SQL queries above
```

### Method 4: Test Webhook Locally (Stripe CLI)

For local development, use Stripe CLI to forward webhooks:

1. **Install Stripe CLI:**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Linux
   # Download from: https://github.com/stripe/stripe-cli/releases
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to your local server:**
   ```bash
   stripe listen --forward-to localhost:3004/api/stripe/webhook
   ```

4. **Trigger a test event:**
   ```bash
   # In another terminal, trigger a test checkout.session.completed event
   stripe trigger checkout.session.completed
   ```

5. **You'll see webhook events in real-time:**
   ```
   Ready! Your webhook signing secret is whsec_... (^C to quit)
   --> checkout.session.completed [evt_...]
   <-- [200] POST http://localhost:3004/api/stripe/webhook [evt_...]
   ```

### Method 5: Check Webhook Endpoint Status

Verify your webhook endpoint is configured correctly:

1. **Go to:** https://dashboard.stripe.com/test/webhooks
2. **Click on your webhook endpoint**
3. **Check:**
   - ✅ Endpoint URL is correct
   - ✅ Events selected: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - ✅ Status is "Enabled"
   - ✅ Signing secret is set (starts with `whsec_...`)

## How to Verify a New Tenant Payment

### Step-by-Step Verification:

1. **Check Stripe Dashboard:**
   - Go to: https://dashboard.stripe.com/test/payments
   - Look for recent successful payments
   - Click on a payment to see customer details

2. **Check Webhook Events:**
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click on your webhook
   - Look for recent `checkout.session.completed` events
   - Check if status is "200 OK"

3. **Check Your Database:**
   ```sql
   -- Find tenant by Stripe Customer ID
   SELECT * FROM tenants 
   WHERE "stripeCustomerId" = 'cus_...' 
   LIMIT 1;
   
   -- Or find by subscription ID
   SELECT * FROM tenants 
   WHERE "stripeSubscriptionId" = 'sub_...' 
   LIMIT 1;
   ```

4. **Check Application Logs:**
   - Look for: `Tenant created successfully for [name]`
   - Check for any errors

## Common Issues & Solutions

### Issue 1: Webhook Not Receiving Events

**Symptoms:**
- No events in Stripe dashboard
- No logs in application

**Solutions:**
- ✅ Verify webhook URL is correct
- ✅ Check webhook is enabled in Stripe
- ✅ Verify webhook endpoint is accessible (for production)
- ✅ Check firewall/network settings

### Issue 2: Webhook Returns 400/500 Error

**Symptoms:**
- Events show error status in Stripe dashboard
- Error logs in application

**Common Causes:**
- ❌ Webhook secret mismatch
- ❌ Missing environment variables
- ❌ Database connection issues
- ❌ Missing metadata in checkout session

**Solutions:**
- ✅ Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- ✅ Check all required env variables are set
- ✅ Verify database connection
- ✅ Check checkout session includes all metadata

### Issue 3: Tenant Not Created

**Symptoms:**
- Webhook received but tenant not in database
- "Tenant not found" error

**Solutions:**
- ✅ Check webhook logs for errors
- ✅ Verify `createTenant` function is being called
- ✅ Check database connection
- ✅ Verify metadata is present in checkout session

## Monitoring Dashboard (Quick Check)

Create a simple script to check webhook health:

```bash
#!/bin/bash
# check-webhook-health.sh

echo "=== Webhook Health Check ==="
echo ""

# Check recent tenants
echo "Recent Tenants (last 5):"
psql $POSTGRES_URL -c "
SELECT name, \"adminUsername\", \"subscriptionStatus\", \"createdAt\"
FROM tenants
ORDER BY \"createdAt\" DESC
LIMIT 5;
"

echo ""
echo "Active Subscriptions:"
psql $POSTGRES_URL -c "
SELECT COUNT(*) as active_count
FROM tenants
WHERE \"subscriptionStatus\" = 'active';
"
```

## Real-Time Monitoring

### Add Webhook Logging to Your Code

You can enhance webhook logging by adding more detailed logs:

```typescript
// In webhook route.ts
console.log(`[WEBHOOK] Event received: ${event.type}`);
console.log(`[WEBHOOK] Customer ID: ${customerId}`);
console.log(`[WEBHOOK] Subscription ID: ${subscriptionId}`);
console.log(`[WEBHOOK] Tenant Name: ${tenantName}`);
```

### Check Logs in Production

If deployed on Vercel:
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to "Logs" tab
4. Filter by `/api/stripe/webhook`

## Testing Checklist

After a payment, verify:

- [ ] Payment shows as successful in Stripe Dashboard
- [ ] `checkout.session.completed` event appears in webhook logs
- [ ] Webhook returns 200 OK status
- [ ] Tenant appears in database
- [ ] Tenant has correct `stripeCustomerId` and `stripeSubscriptionId`
- [ ] Tenant has `subscriptionStatus = 'active'`
- [ ] Credentials can be retrieved via `/api/stripe/get-credentials`
- [ ] User can login with tenant admin credentials

## Quick Test Command

Test if webhook endpoint is accessible:

```bash
# Test webhook endpoint (will fail signature check, but confirms endpoint is reachable)
curl -X POST http://localhost:3004/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

If you get a response (even an error about signature), the endpoint is working!

## Production Monitoring

For production, set up:

1. **Error Tracking:** Use Sentry or similar to catch webhook errors
2. **Logging:** Use structured logging (e.g., Winston, Pino)
3. **Alerts:** Set up alerts for webhook failures
4. **Dashboard:** Create admin dashboard to view recent tenants/subscriptions

