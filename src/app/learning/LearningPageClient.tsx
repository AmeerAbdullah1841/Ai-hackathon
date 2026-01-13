"use client";

import { useRouter } from "next/navigation";
import { LearningClient } from "./LearningClient";
import { AdminSidebar } from "../components/AdminSidebar";

type Props = {
  isSuperAdmin: boolean;
};

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.error ?? "Unexpected API error");
  }
  return res.json();
}

export function LearningPageClient({ isSuperAdmin }: Props) {
  const router = useRouter();

  const handleAdminLogout = async () => {
    try {
      await request("/api/admin/session", {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.push("/signin");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto flex max-w-7xl gap-6">
        <AdminSidebar onLogout={handleAdminLogout} />
        <div className="flex-1">
          <LearningClient isSuperAdmin={isSuperAdmin} isAuthenticated={true} />
        </div>
      </div>
    </div>
  );
}

