import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { findAdminSession, findTenantById, deleteTenant, listTeams } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const session = await findAdminSession(token);
    if (!session || session.adminType !== "super") {
      return NextResponse.json(
        { error: "Unauthorized - Super admin access required" },
        { status: 403 }
      );
    }

    const { tenantId } = await params;
    const tenant = await findTenantById(tenantId);

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    // Get teams for this tenant
    const allTeams = await listTeams();
    const tenantTeams = allTeams.filter((team) => team.tenantId === tenantId);

    return NextResponse.json({
      ...tenant,
      teams: tenantTeams,
    });
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch tenant" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const session = await findAdminSession(token);
    if (!session || session.adminType !== "super") {
      return NextResponse.json(
        { error: "Unauthorized - Super admin access required" },
        { status: 403 }
      );
    }

    const { tenantId } = await params;
    await deleteTenant(tenantId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tenant:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete tenant" },
      { status: 500 }
    );
  }
}


