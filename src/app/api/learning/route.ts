import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { findAdminSession, listLearningMaterials, deleteLearningMaterial } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const module = searchParams.get("module") as "ai" | "cybersecurity" | null;

    // Learning materials are accessible to everyone (no auth required for viewing)
    const materials = await listLearningMaterials(module || undefined);

    return NextResponse.json(materials);
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


