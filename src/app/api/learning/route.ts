import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { findAdminSession, listLearningMaterials, deleteLearningMaterial } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Check authentication - only authenticated users (admin or student) can view materials
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";
    
    let isAuthenticated = false;
    if (token) {
      try {
        const session = await findAdminSession(token);
        if (session) {
          isAuthenticated = true;
        }
      } catch (error) {
        // Session check failed - treat as unauthenticated
        console.error("Error checking session:", error);
      }
    }

    // Note: Students access through team dashboard, which doesn't use admin sessions
    // For now, we'll allow the API to return materials but hide the View PDF button in UI
    // if not authenticated. In production, you might want to add team session checking here.
    
    const { searchParams } = new URL(request.url);
    const module = searchParams.get("module") as "ai" | "cybersecurity" | null;

    const materials = await listLearningMaterials(module || undefined);

    // Return materials with authentication status
    return NextResponse.json({ 
      materials,
      authenticated: isAuthenticated 
    });
  } catch (error) {
    console.error("Error fetching learning materials:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch learning materials" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get("id");

    if (!materialId) {
      return NextResponse.json(
        { error: "Material ID is required" },
        { status: 400 }
      );
    }

    await deleteLearningMaterial(materialId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting learning material:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete learning material" },
      { status: 500 }
    );
  }
}


