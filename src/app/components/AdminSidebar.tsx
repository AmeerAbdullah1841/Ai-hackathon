"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/assignments", label: "Assignments" },
  { href: "/submissions", label: "Submissions" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/teams", label: "Teams" },
  { href: "/tenants", label: "Tenants", superAdminOnly: true },
  { href: "/learning", label: "Learning Materials" }, // Accessible to all admins (super and tenant)
];

export function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();
  const [adminType, setAdminType] = useState<"super" | "tenant" | null>(null);

  useEffect(() => {
    // Fetch admin type from session
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.adminType) {
          setAdminType(data.adminType);
        }
      })
      .catch(() => {
        // Ignore errors
      });
  }, []);

  return (
    <aside className="sticky top-8 hidden w-56 flex-shrink-0 rounded-3xl bg-white/80 p-6 shadow lg:block">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Control
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">
          {adminType === "tenant" ? "Tenant Admin Hub" : "Admin Hub"}
        </h2>
      </div>
      <nav className="mt-6 space-y-2 text-sm font-semibold">
        {navItems.map((item) => {
          // Hide super admin only items if not super admin
          if (item.superAdminOnly && adminType !== "super") {
            return null;
          }
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-2xl px-4 py-2 transition ${
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={onLogout}
        className="mt-8 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        Log out
      </button>
    </aside>
  );
}

