import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  IS_PRODUCTION,
} from "@/lib/admin-auth";
import { findTenantByAdminCredentials, createAdminSession } from "@/lib/store";

type TenantLoginBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const { username, password } =
      (await request.json().catch(() => ({}))) as TenantLoginBody;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    const tenant = await findTenantByAdminCredentials(username, password);

    if (!tenant) {
      return NextResponse.json(
        { error: "Invalid tenant admin credentials" },
        { status: 401 },
      );
    }

    const session = await createAdminSession("tenant", tenant.id);
    const response = NextResponse.json({ authenticated: true, tenantId: tenant.id });

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: session.token,
      httpOnly: true,
      sameSite: "lax",
      secure: IS_PRODUCTION,
      maxAge: ADMIN_SESSION_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Tenant admin login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { 
        error: "Login failed",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}


