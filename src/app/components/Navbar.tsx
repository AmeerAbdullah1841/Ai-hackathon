"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if user is authenticated (admin or team)
  useEffect(() => {
    // Check for admin session
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated === true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, [pathname]);

  // Don't show navbar on signin page
  if (pathname === "/signin") {
    return null;
  }

  // Don't show navbar on team dashboard pages (students have their own UI)
  if (pathname.startsWith("/team/")) {
    return null;
  }

  // Don't show navbar on learning page if user is authenticated (they'll see sidebar instead)
  if (pathname === "/learning" && isAuthenticated === true) {
    return null;
  }

  // Don't show navbar on admin pages (they have sidebar)
  const adminPages = ["/", "/assignments", "/submissions", "/leaderboard", "/teams", "/tenants"];
  if (adminPages.includes(pathname) && isAuthenticated === true) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">AI HACKATHON</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/learning"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Learning
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Leaderboard
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            onClick={() => router.push("/signin")}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}

