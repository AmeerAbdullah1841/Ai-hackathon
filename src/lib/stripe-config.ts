export type BillingPeriod = "monthly" | "quarterly" | "annual";

export interface PricingPlan {
  id: BillingPeriod;
  name: string;
  price: number;
  priceId: string; // Stripe Price ID - update after creating products in Stripe Dashboard
  description: string;
  savings?: string;
}

export const PRICING_PLANS: Record<BillingPeriod, PricingPlan> = {
  monthly: {
    id: "monthly",
    name: "Monthly",
    price: 29,
    priceId: process.env.STRIPE_PRICE_ID_MONTHLY || "price_monthly_placeholder",
    description: "Billed monthly",
  },
  quarterly: {
    id: "quarterly",
    name: "Quarterly",
    price: 79,
    priceId: process.env.STRIPE_PRICE_ID_QUARTERLY || "price_quarterly_placeholder",
    description: "Billed every 3 months",
    savings: "Save ~9%",
  },
  annual: {
    id: "annual",
    name: "Annual",
    price: 299,
    priceId: process.env.STRIPE_PRICE_ID_ANNUAL || "price_annual_placeholder",
    description: "Billed annually",
    savings: "Save ~14%",
  },
};

export function getPricingPlan(period: BillingPeriod): PricingPlan {
  return PRICING_PLANS[period];
}

export function getAllPricingPlans(): PricingPlan[] {
  return Object.values(PRICING_PLANS);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}




