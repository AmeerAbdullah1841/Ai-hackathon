import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { findAdminSession } from "@/lib/store";
import { LearningClient } from "./LearningClient";
import { LearningPageClient } from "./LearningPageClient";

export const dynamic = "force-dynamic";

export default async function LearningPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";

  // Check if user is authenticated (super admin, tenant admin, or student)
  // Learning materials are accessible to everyone - no authentication required for viewing
  let isSuperAdmin = false;
  let isAuthenticated = false;

  if (token) {
    try {
      const session = await findAdminSession(token);
      if (session) {
        isAuthenticated = true;
        isSuperAdmin = session.adminType === "super";
      }
    } catch (error) {
      // If session check fails, still allow access (students can view without admin session)
      console.error("Error checking session:", error);
    }
  }

  // If authenticated as admin, show with sidebar (no navbar)
  if (isAuthenticated) {
    return <LearningPageClient isSuperAdmin={isSuperAdmin} />;
  }

  // If not authenticated, show with navbar (no sidebar)
  return (
    <div className="min-h-screen bg-slate-100 px-4 pt-24 pb-10 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <LearningClient isSuperAdmin={false} />
      </div>
    </div>
  );
}


