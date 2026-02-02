"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/app/components/Navbar";

interface TenantCredentials {
  tenantName: string;
  adminUsername: string;
  adminPassword: string;
  adminEmail: string;
  billingPeriod: string;
}

function PricingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState<TenantCredentials | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    const fetchCredentials = async () => {
      try {
        console.log(`[PricingSuccess] Fetching credentials for session: ${sessionId}`);
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        try {
          const response = await fetch(`/api/stripe/get-credentials?session_id=${sessionId}`, {
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
            throw new Error(errorData.error || `HTTP ${response.status}: Failed to retrieve credentials`);
          }
          
          const data = await response.json();
          console.log(`[PricingSuccess] Credentials received:`, { tenantName: data.tenantName });
          setCredentials(data);
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            throw new Error("Request timed out. The tenant may still be being created. Please wait a moment and refresh the page.");
          }
          throw fetchError;
        }
      } catch (err) {
        console.error("[PricingSuccess] Error fetching credentials:", err);
        setError(err instanceof Error ? err.message : "An error occurred while loading credentials");
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, [sessionId]);

  const handleAutoLogin = async () => {
    if (!credentials) return;

    setSigningIn(true);
    setLoginError("");

    try {
      // Try tenant admin login
      const response = await fetch("/api/tenant/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials.adminUsername,
          password: credentials.adminPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.authenticated) {
        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        throw new Error("Authentication failed");
      }
    } catch (err) {
      console.error("Auto-login error:", err);
      setLoginError(err instanceof Error ? err.message : "Auto-login failed. Please sign in manually.");
      setSigningIn(false);
    }
  };

  // Auto-login after credentials are loaded
  useEffect(() => {
    if (credentials && !autoLoginAttempted) {
      setAutoLoginAttempted(true);
      handleAutoLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials, autoLoginAttempted]);

  const handleManualSignIn = async () => {
    await handleAutoLogin();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16 pt-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div className="text-white text-xl">Loading your credentials...</div>
              <div className="text-slate-400 text-sm mt-2">This may take a few moments while we create your tenant</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16 pt-32">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-red-200">
              <h2 className="text-2xl font-bold mb-4">Error</h2>
              <p>{error}</p>
              <Link
                href="/pricing"
                className="mt-4 inline-block text-blue-400 hover:text-blue-300"
              >
                Return to pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!credentials) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-16 pt-32">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
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
            <h1 className="text-4xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-slate-300">
              Your subscription has been activated. Your tenant has been created.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">Your Tenant Admin Credentials</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tenant Name
                </label>
                <div className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white">
                  {credentials.tenantName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Admin Username
                </label>
                <div className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono">
                  {credentials.adminUsername}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Admin Password
                </label>
                <div className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono">
                  {credentials.adminPassword}
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Please save these credentials securely. You will need them to access your tenant admin panel.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Admin Email
                </label>
                <div className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white">
                  {credentials.adminEmail}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Billing Period
                </label>
                <div className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white capitalize">
                  {credentials.billingPeriod}
                </div>
              </div>
            </div>
          </div>

          {signingIn && (
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg text-blue-200 text-center">
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing you in automatically...</span>
              </div>
            </div>
          )}

          {loginError && (
            <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg text-yellow-200">
              <p className="font-semibold mb-1">Auto-login failed</p>
              <p className="text-sm">{loginError}</p>
            </div>
          )}

          <div className="text-center space-y-4">
            {!signingIn && (
              <>
                <button
                  onClick={handleManualSignIn}
                  disabled={signingIn}
                  className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {signingIn ? "Signing In..." : "Sign In Now & Access Dashboard"}
                </button>
                <div className="pt-2">
                  <Link
                    href="/signin"
                    className="text-blue-400 hover:text-blue-300 text-sm underline"
                  >
                    Or sign in manually
                  </Link>
                </div>
                <p className="mt-4 text-sm text-slate-400">
                  You've been automatically signed in! You can now access your tenant admin dashboard, create teams, and manage your organization.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16 pt-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-white text-xl">Loading...</div>
          </div>
        </div>
      </div>
    }>
      <PricingSuccessContent />
    </Suspense>
  );
}




