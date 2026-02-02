# Quick Guide: Get Your Stripe Price IDs

## The Problem
You're getting a 400 error because your `.env.local` is missing the **Stripe Price IDs**. You need to create products in Stripe and get their Price IDs.

## Quick Steps

### 1. Go to Stripe Products Page
👉 **https://dashboard.stripe.com/test/products** (for test mode)

### 2. Create the 3 Products

#### Product 1: Monthly ($29/month)
1. Click **"+ Add product"**
2. Fill in:
   - **Name**: `Monthly Subscription`
   - **Description**: `Billed monthly`
   - **Pricing model**: Select **"Recurring"**
   - **Price**: `29.00`
   - **Billing period**: `Monthly`
   - **Currency**: `USD`
3. Click **"Save product"**
4. **Copy the Price ID** - it's shown right after saving (starts with `price_...`)
   - Example: `price_1ABC123xyz...`

#### Product 2: Quarterly ($79/quarter)
1. Click **"+ Add product"** again
2. Fill in:
   - **Name**: `Quarterly Subscription`
   - **Description**: `Billed every 3 months`
   - **Pricing model**: **"Recurring"**
   - **Price**: `79.00`
   - **Billing period**: `Every 3 months`
   - **Currency**: `USD`
3. Click **"Save product"**
4. **Copy the Price ID**

#### Product 3: Annual ($299/year)
1. Click **"+ Add product"** again
2. Fill in:
   - **Name**: `Annual Subscription`
   - **Description**: `Billed annually`
   - **Pricing model**: **"Recurring"**
   - **Price**: `299.00`
   - **Billing period**: `Yearly` or `Every 12 months`
   - **Currency**: `USD`
3. Click **"Save product"**
4. **Copy the Price ID**

### 3. Add Price IDs to `.env.local`

Open your `.env.local` file and add these three lines:

```bash
STRIPE_PRICE_ID_MONTHLY=price_your_monthly_price_id_here
STRIPE_PRICE_ID_QUARTERLY=price_your_quarterly_price_id_here
STRIPE_PRICE_ID_ANNUAL=price_your_annual_price_id_here
```

**Replace** `price_your_monthly_price_id_here` with the actual Price ID you copied from Stripe.

### 4. Restart Your Dev Server

After adding the Price IDs, restart your Next.js server:
```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

### 5. Test Again

Try the checkout flow again. The error should be resolved!

## Where to Find Price IDs After Creation

If you already created products but forgot to copy the Price IDs:

1. Go to **https://dashboard.stripe.com/test/products**
2. Click on each product
3. Look for the **"Pricing"** section
4. You'll see the Price ID listed there (starts with `price_...`)

## Example `.env.local` File

Your complete `.env.local` should look like this:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Stripe Price IDs (ADD THESE!)
STRIPE_PRICE_ID_MONTHLY=price_1ABC123xyz...
STRIPE_PRICE_ID_QUARTERLY=price_1DEF456abc...
STRIPE_PRICE_ID_ANNUAL=price_1GHI789def...

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3004
```

## Still Getting Errors?

1. **Check the error message** - The improved error handling will now tell you exactly which Price ID is missing
2. **Verify Price IDs** - Make sure they start with `price_` and are from the same Stripe account (test vs live mode)
3. **Check server logs** - Look at your terminal where `npm run dev` is running for more details


