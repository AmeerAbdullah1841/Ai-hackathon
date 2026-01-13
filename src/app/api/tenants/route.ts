import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { findAdminSession, listTenants, createTenant } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
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

    const tenants = await listTenants();
    return NextResponse.json(tenants);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Tenant name is required" },
        { status: 400 }
      );
    }

    const tenant = await createTenant(name.trim());
    
    return NextResponse.json(tenant, { status: 201 });
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create tenant" },
      { status: 500 }
    );
  }
}


