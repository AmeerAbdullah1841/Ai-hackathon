#!/bin/bash
# Helper script to update Stripe Price IDs in .env.local

ENV_FILE=".env.local"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env.local file not found!"
    exit 1
fi

echo "Current Stripe Price IDs in .env.local:"
echo "----------------------------------------"
grep "STRIPE_PRICE_ID" "$ENV_FILE" || echo "No Price IDs found"
echo ""

echo "To update Price IDs, use one of these methods:"
echo ""
echo "Method 1: Use sed command (replace YOUR_PRICE_ID with actual ID):"
echo "  sed -i 's/STRIPE_PRICE_ID_MONTHLY=.*/STRIPE_PRICE_ID_MONTHLY=YOUR_PRICE_ID/' $ENV_FILE"
echo "  sed -i 's/STRIPE_PRICE_ID_QUARTERLY=.*/STRIPE_PRICE_ID_QUARTERLY=YOUR_PRICE_ID/' $ENV_FILE"
echo "  sed -i 's/STRIPE_PRICE_ID_ANNUAL=.*/STRIPE_PRICE_ID_ANNUAL=YOUR_PRICE_ID/' $ENV_FILE"
echo ""
echo "Method 2: Edit manually with nano (stops dev server first):"
echo "  nano $ENV_FILE"
echo ""
echo "Method 3: Use this script with arguments:"
echo "  ./update-price-ids.sh monthly price_1ABC123..."
echo "  ./update-price-ids.sh quarterly price_1DEF456..."
echo "  ./update-price-ids.sh annual price_1GHI789..."

if [ "$1" != "" ] && [ "$2" != "" ]; then
    PERIOD=$1
    PRICE_ID=$2
    
    case $PERIOD in
        monthly)
            sed -i "s/STRIPE_PRICE_ID_MONTHLY=.*/STRIPE_PRICE_ID_MONTHLY=$PRICE_ID/" "$ENV_FILE"
            echo "✅ Updated STRIPE_PRICE_ID_MONTHLY to $PRICE_ID"
            ;;
        quarterly)
            sed -i "s/STRIPE_PRICE_ID_QUARTERLY=.*/STRIPE_PRICE_ID_QUARTERLY=$PRICE_ID/" "$ENV_FILE"
            echo "✅ Updated STRIPE_PRICE_ID_QUARTERLY to $PRICE_ID"
            ;;
        annual)
            sed -i "s/STRIPE_PRICE_ID_ANNUAL=.*/STRIPE_PRICE_ID_ANNUAL=$PRICE_ID/" "$ENV_FILE"
            echo "✅ Updated STRIPE_PRICE_ID_ANNUAL to $PRICE_ID"
            ;;
        *)
            echo "❌ Invalid period. Use: monthly, quarterly, or annual"
            exit 1
            ;;
    esac
    
    echo ""
    echo "Updated Price IDs:"
    grep "STRIPE_PRICE_ID" "$ENV_FILE"
fi


