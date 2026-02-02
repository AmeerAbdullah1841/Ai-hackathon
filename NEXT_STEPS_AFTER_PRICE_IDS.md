# Next Steps After Adding Price IDs

## ✅ Step 1: Verify All Price IDs Are Set

Make sure all 3 Price IDs in `.env.local` are real (not placeholders):

```bash
grep "STRIPE_PRICE_ID" .env.local
```

You should see:
```
STRIPE_PRICE_ID_MONTHLY=price_1ABC123...    # ✅ Real Price ID
STRIPE_PRICE_ID_QUARTERLY=price_1DEF456...  # ✅ Real Price ID  
STRIPE_PRICE_ID_ANNUAL=price_1GHI789...     # ✅ Real Price ID
```

**NOT:**
```
STRIPE_PRICE_ID_MONTHLY=price_placeholder_monthly    # ❌ Placeholder
```

---

## ✅ Step 2: Update Placeholders (If Needed)

If you still see placeholders, update them using one of these methods:

### Option A: Command Line (Easiest)
```bash
# Replace YOUR_PRICE_ID with actual Price ID from Stripe
sed -i 's/STRIPE_PRICE_ID_MONTHLY=.*/STRIPE_PRICE_ID_MONTHLY=YOUR_PRICE_ID/' .env.local
sed -i 's/STRIPE_PRICE_ID_QUARTERLY=.*/STRIPE_PRICE_ID_QUARTERLY=YOUR_PRICE_ID/' .env.local
```

### Option B: Use the Helper Script
```bash
./update-price-ids.sh monthly price_1ABC123...
./update-price-ids.sh quarterly price_1DEF456...
```

---

## ✅ Step 3: Restart Your Dev Server

**IMPORTANT:** Environment variables are only loaded when the server starts. You MUST restart!

1. **Stop the current server** (press `Ctrl+C` in the terminal)
2. **Start it again:**
   ```bash
   npm run dev
   ```

---

## ✅ Step 4: Test the Checkout Flow

1. **Open your browser** and go to: `http://localhost:3004/pricing`
2. **Fill out the form:**
   - Select a plan (Monthly, Quarterly, or Annual)
   - Enter Tenant Name
   - Enter Admin Name
   - Enter Admin Email
3. **Click "Subscribe"**
4. **Expected result:**
   - ✅ You should be redirected to Stripe Checkout (not get a 400 error)
   - ✅ You'll see the Stripe payment form
5. **Test with Stripe test card:**
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

---

## ✅ Step 5: Verify Webhook (Optional but Recommended)

After a successful test payment:

1. **Check Stripe Dashboard:**
   - Go to: https://dashboard.stripe.com/test/webhooks
   - You should see webhook events being delivered
   - Status should be "200 OK"

2. **Check your application:**
   - The tenant should be created automatically
   - You should see credentials on the success page

---

## 🐛 Troubleshooting

### Still Getting 400 Error?

1. **Check server logs** - Look at the terminal where `npm run dev` is running
2. **Verify Price IDs** - Make sure they start with `price_` and are from test mode
3. **Check error message** - The improved error handling will tell you which Price ID is missing

### Price IDs Not Working?

1. **Verify in Stripe Dashboard:**
   - Go to: https://dashboard.stripe.com/test/products
   - Click on each product
   - Click on the price entry
   - Verify the Price ID matches what's in `.env.local`

2. **Check Test vs Live Mode:**
   - Make sure you're using **Test mode** Price IDs
   - Test Price IDs work with test API keys
   - Live Price IDs work with live API keys

### Server Not Picking Up Changes?

1. **Make sure you restarted** - Environment variables only load on startup
2. **Check file location** - `.env.local` should be in the project root
3. **Verify syntax** - No quotes around Price IDs (unless they have spaces, which they shouldn't)

---

## ✅ Success Checklist

- [ ] All 3 Price IDs are set in `.env.local` (no placeholders)
- [ ] Dev server has been restarted after adding Price IDs
- [ ] Can access `/pricing` page without errors
- [ ] Clicking "Subscribe" redirects to Stripe Checkout (not 400 error)
- [ ] Test payment completes successfully
- [ ] Webhook receives events (check Stripe Dashboard)
- [ ] Tenant is created after payment

---

## 🎉 You're Done!

Once the checkout flow works, your Stripe integration is complete! Users can now:
- Select a subscription plan
- Complete payment via Stripe Checkout
- Get automatically created tenant accounts
- Receive their admin credentials


