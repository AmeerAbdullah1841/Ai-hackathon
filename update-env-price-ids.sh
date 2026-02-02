#!/bin/bash
# Script to update Stripe Price IDs in .env.local

ENV_FILE=".env.local"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env.local not found!"
    exit 1
fi

echo "Current Price IDs:"
grep "STRIPE_PRICE_ID" "$ENV_FILE"
echo ""

# Get Price IDs from user
read -p "Enter Monthly Price ID (or press Enter to skip): " MONTHLY_ID
read -p "Enter Quarterly Price ID (or press Enter to skip): " QUARTERLY_ID
read -p "Enter Annual Price ID (or press Enter to skip): " ANNUAL_ID

# Update Monthly
if [ ! -z "$MONTHLY_ID" ]; then
    sed -i "s/STRIPE_PRICE_ID_MONTHLY=.*/STRIPE_PRICE_ID_MONTHLY=$MONTHLY_ID/" "$ENV_FILE"
    echo "✅ Updated STRIPE_PRICE_ID_MONTHLY"
fi

# Update Quarterly
if [ ! -z "$QUARTERLY_ID" ]; then
    sed -i "s/STRIPE_PRICE_ID_QUARTERLY=.*/STRIPE_PRICE_ID_QUARTERLY=$QUARTERLY_ID/" "$ENV_FILE"
    echo "✅ Updated STRIPE_PRICE_ID_QUARTERLY"
fi

# Update Annual
if [ ! -z "$ANNUAL_ID" ]; then
    sed -i "s/STRIPE_PRICE_ID_ANNUAL=.*/STRIPE_PRICE_ID_ANNUAL=$ANNUAL_ID/" "$ENV_FILE"
    echo "✅ Updated STRIPE_PRICE_ID_ANNUAL"
fi

echo ""
echo "Updated Price IDs:"
grep "STRIPE_PRICE_ID" "$ENV_FILE"


