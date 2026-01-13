import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { findAdminSession, deleteLearningMaterial } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ materialId: string }> }
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

    const { materialId } = await params;

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


