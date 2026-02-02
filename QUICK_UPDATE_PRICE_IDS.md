# Quick Guide: Update Your Price IDs

## Current Status
✅ Annual Price ID is already set: `price_1SuAj9BcXT6Mle710KTp7Btd`
⏳ Monthly and Quarterly need real Price IDs (currently placeholders)

## Method 1: Use Command Line (Easiest - No Editor Needed)

### Step 1: Stop your dev server (Ctrl+C)

### Step 2: Update Price IDs using sed commands

Replace `YOUR_MONTHLY_PRICE_ID` and `YOUR_QUARTERLY_PRICE_ID` with the actual Price IDs from Stripe:

```bash
# Update Monthly Price ID
sed -i 's/STRIPE_PRICE_ID_MONTHLY=.*/STRIPE_PRICE_ID_MONTHLY=YOUR_MONTHLY_PRICE_ID/' .env.local

# Update Quarterly Price ID  
sed -i 's/STRIPE_PRICE_ID_QUARTERLY=.*/STRIPE_PRICE_ID_QUARTERLY=YOUR_QUARTERLY_PRICE_ID/' .env.local
```

### Example:
If your Monthly Price ID is `price_1ABC123xyz`, run:
```bash
sed -i 's/STRIPE_PRICE_ID_MONTHLY=.*/STRIPE_PRICE_ID_MONTHLY=price_1ABC123xyz/' .env.local
```

### Step 3: Verify the changes
```bash
grep "STRIPE_PRICE_ID" .env.local
```

### Step 4: Restart your dev server
```bash
npm run dev
```

---

## Method 2: Use the Helper Script

I've created a helper script for you:

```bash
# Update Monthly
./update-price-ids.sh monthly price_1ABC123xyz

# Update Quarterly
./update-price-ids.sh quarterly price_1DEF456abc

# Update Annual (if needed)
./update-price-ids.sh annual price_1GHI789def
```

---

## Method 3: Manual Edit (If Editor Works)

1. **Stop your dev server** (Ctrl+C) - this releases the file lock
2. Open `.env.local` in your editor
3. Find these lines:
   ```
   STRIPE_PRICE_ID_MONTHLY=price_placeholder_monthly
   STRIPE_PRICE_ID_QUARTERLY=price_placeholder_quarterly
   ```
4. Replace the placeholders with your actual Price IDs:
   ```
   STRIPE_PRICE_ID_MONTHLY=price_1ABC123xyz
   STRIPE_PRICE_ID_QUARTERLY=price_1DEF456abc
   ```
5. Save the file
6. Restart dev server: `npm run dev`

---

## Method 4: Copy-Paste Complete Section

If nothing else works, you can replace the entire Stripe section:

1. Stop dev server
2. Open `.env.local`
3. Find the section that starts with `# Stripe Price IDs`
4. Replace it with:
   ```bash
   # Stripe Price IDs
   STRIPE_PRICE_ID_MONTHLY=price_YOUR_MONTHLY_ID_HERE
   STRIPE_PRICE_ID_QUARTERLY=price_YOUR_QUARTERLY_ID_HERE
   STRIPE_PRICE_ID_ANNUAL=price_1SuAj9BcXT6Mle710KTp7Btd
   ```
5. Save and restart

---

## Troubleshooting "Failed to Save"

If you're getting "failed to save" errors:

1. **Stop the dev server first** - It might be locking the file
2. **Check file permissions**: 
   ```bash
   ls -la .env.local
   ```
   Should show `-rw-rw-r--` (writable)
3. **Try a different editor**: Use `nano` or `vim` from terminal
4. **Use command line method** (Method 1) - This always works

---

## Verify It Worked

After updating, check your Price IDs:
```bash
grep "STRIPE_PRICE_ID" .env.local
```

You should see:
```
STRIPE_PRICE_ID_MONTHLY=price_1ABC123...
STRIPE_PRICE_ID_QUARTERLY=price_1DEF456...
STRIPE_PRICE_ID_ANNUAL=price_1SuAj9BcXT6Mle710KTp7Btd
```

All three should have real Price IDs (starting with `price_`), not placeholders!


