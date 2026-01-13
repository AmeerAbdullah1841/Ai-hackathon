import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { findAdminSession, createTeam, listTeams } from "@/lib/store";

export async function GET() {
  try {
    // Check if user is tenant admin and filter teams
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";
    
    let allTeams = await listTeams();
    
    if (token) {
      const session = await findAdminSession(token);
      if (session && session.adminType === "tenant" && session.tenantId) {
        // Filter teams by tenantId for tenant admin
        allTeams = allTeams.filter((team) => team.tenantId === session.tenantId);
      }
    }
    
    return NextResponse.json(allTeams);
  } catch (error) {
    console.error("Teams GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch teams" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    const name = payload?.name?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 },
      );
    }

    // Check session for tenantId
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";
    let tenantId: string | null = null;

    if (token) {
      const session = await findAdminSession(token);
      if (session && session.adminType === "tenant" && session.tenantId) {
        tenantId = session.tenantId;
      }
    }

    const team = await createTeam(name, tenantId);
    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("Teams POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create team" },
      { status: 500 },
    );
  }
}
