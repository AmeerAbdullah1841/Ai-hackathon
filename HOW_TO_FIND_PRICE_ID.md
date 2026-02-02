# How to Find Your Stripe Price ID

## ⚠️ Important: Product ID ≠ Price ID

- **Product ID** starts with `prod_` (e.g., `prod_TruYxOgE75DJmL`) ❌ **NOT what you need**
- **Price ID** starts with `price_` (e.g., `price_1ABC123xyz...`) ✅ **This is what you need**

## Where to Find the Price ID

### Method 1: On the Product Page (What You're Looking At Now)

1. You're already on the product detail page (e.g., "Annual Subscription")
2. Look at the **"Pricing"** section on the left side
3. You'll see a table with price entries (usually shows "Default")
4. **Click on the price entry** in that table
5. The Price ID will be displayed (starts with `price_...`)
6. **Copy that Price ID**

### Method 2: After Creating a New Product

1. When you create a new product and click "Save product"
2. Stripe will show you a success message
3. **The Price ID is displayed right there** - copy it immediately!
4. It looks like: `price_1ABC123xyz...`

### Method 3: From the Products List

1. Go to **https://dashboard.stripe.com/test/products**
2. Click on any product
3. In the **"Pricing"** section, click on the price entry
4. The Price ID will be shown in the price details

## Visual Guide

On your current page, you should see:

```
┌─────────────────────────────────┐
│ Pricing                         │
├─────────────────────────────────┤
│ $5,000.00 USD                   │
│ Per year                        │
├─────────────────────────────────┤
│ [Default] ← CLICK THIS          │
│ No description                  │
│ 0 active                        │
│ Created Jan 27                  │
└─────────────────────────────────┘
```

**Click on "[Default]" or the price entry**, and you'll see the Price ID!

## What Your Price ID Should Look Like

- ✅ Correct: `price_1ABC123xyzDEF456...` (starts with `price_`, long string)
- ❌ Wrong: `prod_TruYxOgE75DJmL` (this is Product ID, not Price ID)

## For Your Application

You need **3 Price IDs**:
1. **Monthly** - Price ID for $29/month subscription
2. **Quarterly** - Price ID for $79/quarter subscription  
3. **Annual** - Price ID for $299/year subscription

**Note:** I see your Annual product shows $5,000/year, but your app expects $299/year. You may need to:
- Create a new product with $299/year, OR
- Add a new price to the existing product with $299/year

## Quick Steps to Get All 3 Price IDs

1. **For Monthly ($29/month):**
   - Create product: Monthly Subscription, $29, Monthly recurring
   - Copy Price ID after saving

2. **For Quarterly ($79/quarter):**
   - Create product: Quarterly Subscription, $79, Every 3 months
   - Copy Price ID after saving

3. **For Annual ($299/year):**
   - Create product: Annual Subscription, $299, Yearly recurring
   - Copy Price ID after saving
   - OR add a new price to your existing Annual product with $299

## Add to .env.local

Once you have all 3 Price IDs, add them:

```bash
STRIPE_PRICE_ID_MONTHLY=price_1ABC123...
STRIPE_PRICE_ID_QUARTERLY=price_1DEF456...
STRIPE_PRICE_ID_ANNUAL=price_1GHI789...
```

## Still Can't Find It?

1. Make sure you're in **Test mode** (toggle in top right of Stripe dashboard)
2. Click directly on the price entry in the Pricing table
3. The Price ID should be visible in the URL or in the price details panel
4. If you see "Add price" button, you need to create the price first


