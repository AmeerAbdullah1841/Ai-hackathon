# Stripe Setup Guide

This guide will walk you through setting up Stripe for your AI Hackathon Platform.

## 🔗 Important Links

### Create Stripe Account
**👉 [https://stripe.com/signup](https://stripe.com/signup)**

### Stripe Dashboard (After Signup)
**👉 [https://dashboard.stripe.com](https://dashboard.stripe.com)**

### Stripe Products & Prices
**👉 [https://dashboard.stripe.com/products](https://dashboard.stripe.com/products)**

### Stripe API Keys
**👉 [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)**

### Stripe Webhooks
**👉 [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)**

---

## Step-by-Step Setup Instructions

### Step 1: Create Stripe Account

1. Go to **[https://stripe.com/signup](https://stripe.com/signup)**
2. Fill in your business information:
   - Email address
   - Password
   - Business name
   - Country/Region
3. Complete the account verification process
4. You'll be taken to the Stripe Dashboard

### Step 2: Get Your API Keys

1. Go to **[https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)**
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)
3. **For testing**, use the **Test mode** keys (they have `_test_` in them)
4. **Important**: Click "Reveal test key" to see your secret key
5. Copy both keys - you'll need them for environment variables

### Step 3: Create Products and Prices

Your application needs **3 subscription products**:
- Monthly Plan: $29/month
- Quarterly Plan: $79/quarter (billed every 3 months)
- Annual Plan: $299/year

#### Create Monthly Product:

1. Go to **[https://dashboard.stripe.com/products](https://dashboard.stripe.com/products)**
2. Click **"+ Add product"** button
3. Fill in the form:
   - **Name**: `Monthly Subscription`
   - **Description**: `Billed monthly`
   - **Pricing model**: Select **"Recurring"**
   - **Price**: `$29.00`
   - **Billing period**: `Monthly`
   - **Currency**: `USD`
4. Click **"Save product"**
5. **IMPORTANT**: After saving, copy the **Price ID** (starts with `price_...`)
   - You'll see it in the product details page
   - It looks like: `price_1ABC123xyz...`

#### Create Quarterly Product:

1. Click **"+ Add product"** again
2. Fill in:
   - **Name**: `Quarterly Subscription`
   - **Description**: `Billed every 3 months`
   - **Pricing model**: **"Recurring"**
   - **Price**: `$79.00`
   - **Billing period**: `Every 3 months`
   - **Currency**: `USD`
3. Click **"Save product"**
4. Copy the **Price ID** (starts with `price_...`)

#### Create Annual Product:

1. Click **"+ Add product"** again
2. Fill in:
   - **Name**: `Annual Subscription`
   - **Description**: `Billed annually`
   - **Pricing model**: **"Recurring"**
   - **Price**: `$299.00`
   - **Billing period**: `Yearly` or `Every 12 months`
   - **Currency**: `USD`
3. Click **"Save product"**
4. Copy the **Price ID** (starts with `price_...`)

### Step 4: Set Up Webhook Endpoint

Webhooks allow Stripe to notify your application when payments are completed.

1. Go to **[https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)**
2. Click **"+ Add endpoint"**
3. Fill in:
   - **Endpoint URL**: 
     - For local testing: `http://localhost:3004/api/stripe/webhook`
     - For production: `https://your-domain.com/api/stripe/webhook`
   - **Description**: `AI Hackathon Platform Webhook`
   - **Events to send**: Select these events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
4. Click **"Add endpoint"**
5. **IMPORTANT**: Copy the **Signing secret** (starts with `whsec_...`)
   - Click on the webhook endpoint you just created
   - Click "Reveal" next to "Signing secret"
   - Copy this value - you'll need it for `STRIPE_WEBHOOK_SECRET`

### Step 5: Configure Environment Variables

Add these to your `.env.local` file (for local development):

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Stripe Price IDs (from Step 3)
STRIPE_PRICE_ID_MONTHLY=price_your_monthly_price_id_here
STRIPE_PRICE_ID_QUARTERLY=price_your_quarterly_price_id_here
STRIPE_PRICE_ID_ANNUAL=price_your_annual_price_id_here

# Stripe Webhook Secret (from Step 4)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App URL (for webhook callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3004
```

### Step 6: Configure Vercel Environment Variables (For Production)

If deploying to Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all the Stripe variables from Step 5
4. **Important**: For production, use **Live mode** keys instead of test keys:
   - Switch to **Live mode** in Stripe Dashboard
   - Get your live API keys
   - Update the environment variables with live keys
5. Update `NEXT_PUBLIC_APP_URL` to your production domain:
   ```
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```
6. Update the webhook URL in Stripe to your production URL

### Step 7: Test Your Setup

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test the checkout flow**:
   - Navigate to `http://localhost:3004/pricing`
   - Fill in the form
   - Click "Subscribe"
   - You'll be redirected to Stripe Checkout
   - Use Stripe test card: `4242 4242 4242 4242`
   - Use any future expiry date (e.g., `12/34`)
   - Use any 3-digit CVC
   - Use any ZIP code

3. **Verify webhook is working**:
   - After completing a test payment, check your Stripe Dashboard → Webhooks
   - You should see successful webhook deliveries
   - Check your application logs for webhook events

## 🔍 Quick Reference: What You Need

After completing the setup, you should have:

- ✅ Stripe Account created
- ✅ **Secret Key**: `sk_test_...` or `sk_live_...`
- ✅ **Publishable Key**: `pk_test_...` or `pk_live_...`
- ✅ **Monthly Price ID**: `price_...`
- ✅ **Quarterly Price ID**: `price_...`
- ✅ **Annual Price ID**: `price_...`
- ✅ **Webhook Secret**: `whsec_...`
- ✅ Webhook endpoint configured
- ✅ Environment variables set in `.env.local` and Vercel

## 🧪 Testing Cards

Stripe provides test cards for testing different scenarios:

| Card Number | Scenario |
|------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |

Use any future expiry date, any CVC, and any ZIP code.

## 🚨 Important Notes

1. **Test Mode vs Live Mode**:
   - Use **Test mode** for development
   - Switch to **Live mode** only when ready for production
   - Test and Live keys are different - make sure you use the right ones

2. **Webhook Security**:
   - Never expose your webhook secret
   - Always verify webhook signatures in production
   - Use HTTPS for webhook endpoints in production

3. **Price IDs**:
   - Price IDs are unique and permanent
   - If you change a price, you'll need to create a new product/price
   - Update the environment variable with the new Price ID

4. **Local Webhook Testing**:
   - For local development, use Stripe CLI to forward webhooks:
     ```bash
     stripe listen --forward-to localhost:3004/api/stripe/webhook
     ```
   - This will give you a webhook signing secret for local testing

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

## 🆘 Troubleshooting

### "Invalid API Key" Error
- Check that you copied the full key (they're long!)
- Make sure you're using test keys in test mode
- Verify the key starts with `sk_test_` or `sk_live_`

### "Invalid Price ID" Error
- Verify the Price ID is correct (starts with `price_`)
- Make sure the price exists in your Stripe account
- Check that you're using the correct Stripe mode (test vs live)

### Webhook Not Working
- Verify the webhook URL is correct
- Check that the webhook secret matches
- Ensure your server is accessible (for production)
- Use Stripe CLI for local testing

### Payment Succeeds But Tenant Not Created
- Check webhook logs in Stripe Dashboard
- Verify webhook endpoint is receiving events
- Check application logs for errors
- Ensure database connection is working

---

**Need Help?** Check the Stripe Dashboard logs or contact Stripe support at [https://support.stripe.com](https://support.stripe.com)

