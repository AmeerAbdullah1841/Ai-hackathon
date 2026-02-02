#!/bin/bash
# Script to check tenants in the database

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=== Tenant Database Check ==="
echo ""

# Check if POSTGRES_URL is set
if [ -z "$POSTGRES_URL" ]; then
    echo -e "${RED}ERROR: POSTGRES_URL environment variable is not set${NC}"
    echo "Please set it in your .env.local file or export it:"
    echo "  export POSTGRES_URL='your_connection_string'"
    exit 1
fi

echo -e "${GREEN}✓ Database connection string found${NC}"
echo ""

# Check recent tenants
echo "=== Recent Tenants (Last 10) ==="
psql "$POSTGRES_URL" -c "
SELECT 
    name as \"Tenant Name\",
    \"adminUsername\" as \"Admin Username\",
    \"subscriptionStatus\" as \"Status\",
    \"billingPeriod\" as \"Billing\",
    \"createdAt\"::timestamp as \"Created\"
FROM tenants
ORDER BY \"createdAt\" DESC
LIMIT 10;
" 2>/dev/null

if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to connect to database${NC}"
    echo "Please check your POSTGRES_URL connection string"
    exit 1
fi

echo ""
echo "=== Statistics ==="
psql "$POSTGRES_URL" -c "
SELECT 
    COUNT(*) as \"Total Tenants\",
    COUNT(CASE WHEN \"subscriptionStatus\" = 'active' THEN 1 END) as \"Active Subscriptions\",
    COUNT(CASE WHEN \"subscriptionStatus\" = 'canceled' THEN 1 END) as \"Canceled Subscriptions\",
    COUNT(CASE WHEN \"stripeCustomerId\" IS NOT NULL THEN 1 END) as \"With Stripe Customer ID\"
FROM tenants;
" 2>/dev/null

echo ""
echo "=== Tenants Created Today ==="
psql "$POSTGRES_URL" -c "
SELECT 
    name as \"Tenant Name\",
    \"adminUsername\" as \"Admin Username\",
    \"subscriptionStatus\" as \"Status\",
    \"createdAt\"::timestamp as \"Created\"
FROM tenants
WHERE DATE(\"createdAt\"::timestamp) = CURRENT_DATE
ORDER BY \"createdAt\" DESC;
" 2>/dev/null

echo ""
echo -e "${GREEN}✓ Check complete${NC}"

