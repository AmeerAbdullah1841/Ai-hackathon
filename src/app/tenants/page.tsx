import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { findAdminSession } from "@/lib/store";
import { TenantsClient } from "./TenantsClient";

export const dynamic = "force-dynamic";

export default async function TenantsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";

  if (!token) {
    redirect("/signin");
  }

  const session = await findAdminSession(token);
  if (!session || session.adminType !== "super") {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 pt-24 pb-10 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-semibold">Tenant Management</h1>
          <p className="mt-2 text-slate-600">
            Create and manage tenants/schools. Each tenant gets their own admin
            credentials.
          </p>
        </header>
        <TenantsClient />
      </div>
    </div>
  );
}


