"use client";

import { useState } from "react";
import { getAllPricingPlans, formatPrice, type BillingPeriod } from "@/lib/stripe-config";
import { Navbar } from "../components/Navbar";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<BillingPeriod>("monthly");
  const [tenantName, setTenantName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canceled = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("canceled") === "true";

  const plans = getAllPricingPlans();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate form
    if (!tenantName.trim()) {
      setError("Tenant name is required");
      setLoading(false);
      return;
    }
    if (!adminName.trim()) {
      setError("Admin name is required");
      setLoading(false);
      return;
    }
    if (!adminEmail.trim() || !adminEmail.includes("@")) {
      setError("Valid admin email is required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billingPeriod: selectedPlan,
          tenantName: tenantName.trim(),
          adminName: adminName.trim(),
          adminEmail: adminEmail.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-16 pt-32">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-slate-300">
            Select a billing period that works best for you
          </p>
        </div>

        {canceled && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg text-yellow-200">
            Payment was canceled. You can try again below.
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? "border-blue-500 bg-blue-900/20"
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  {selectedPlan === plan.id && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-slate-400 ml-2">
                    /{plan.id === "monthly" ? "month" : plan.id === "quarterly" ? "quarter" : "year"}
                  </span>
                </div>
                <p className="text-slate-300 mb-2">{plan.description}</p>
                {plan.savings && (
                  <p className="text-green-400 text-sm font-semibold">{plan.savings}</p>
                )}
              </div>
            ))}
          </div>

          {/* Tenant Information Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Tenant Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="tenantName" className="block text-sm font-medium text-slate-300 mb-2">
                    Organization/Tenant Name *
                  </label>
                  <input
                    type="text"
                    id="tenantName"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your organization name"
                  />
                </div>

                <div>
                  <label htmlFor="adminName" className="block text-sm font-medium text-slate-300 mb-2">
                    Admin Name *
                  </label>
                  <input
                    type="text"
                    id="adminName"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter admin full name"
                  />
                </div>

                <div>
                  <label htmlFor="adminEmail" className="block text-sm font-medium text-slate-300 mb-2">
                    Admin Email *
                  </label>
                  <input
                    type="email"
                    id="adminEmail"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter admin email address"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? "Processing..." : `Subscribe - ${formatPrice(plans.find(p => p.id === selectedPlan)?.price || 0)}`}
              </button>

              <p className="mt-4 text-sm text-slate-400 text-center">
                You will be redirected to Stripe to complete your payment securely
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}




