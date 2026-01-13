import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { findAdminSession, createLearningMaterial } from "@/lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const module = formData.get("module") as "ai" | "cybersecurity" | null;

    // Validate inputs
    if (!file || !title || !module) {
      return NextResponse.json(
        { error: "Missing required fields: file, title, and module are required" },
        { status: 400 }
      );
    }

    if (module !== "ai" && module !== "cybersecurity") {
      return NextResponse.json(
        { error: "Invalid module. Must be 'ai' or 'cybersecurity'" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, DOC, and DOCX files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Determine file type from extension
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    let fileType: "pdf" | "doc" | "docx" = "pdf";
    
    if (fileExtension === "doc") {
      fileType = "doc";
    } else if (fileExtension === "docx") {
      fileType = "docx";
    } else if (fileExtension !== "pdf") {
      return NextResponse.json(
        { error: "Invalid file extension. Only .pdf, .doc, and .docx files are allowed" },
        { status: 400 }
      );
    }

    // Check for Vercel Blob token
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return NextResponse.json(
        { 
          error: "BLOB_READ_WRITE_TOKEN environment variable is not set. Please configure Vercel Blob storage.",
          details: "To fix this:\n1. Go to Vercel Dashboard → Your Project → Storage\n2. Create a Blob store (if not exists)\n3. Copy the BLOB_READ_WRITE_TOKEN\n4. Add it to .env.local and Vercel environment variables"
        },
        { status: 500 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
      contentType: file.type,
      token: blobToken,
    });

    // Save metadata to database
    const material = await createLearningMaterial(
      title,
      description || null,
      module,
      blob.url,
      fileName,
      fileType,
      file.size,
      "super_admin" // uploadedBy
    );

    return NextResponse.json({
      success: true,
      material,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    );
  }
}


