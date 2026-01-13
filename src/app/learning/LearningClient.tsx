"use client";

import { useState, useEffect, useCallback } from "react";
import { LearningMaterialUpload } from "../components/LearningMaterialUpload";

type LearningMaterial = {
  id: string;
  title: string;
  description: string | null;
  module: "ai" | "cybersecurity";
  fileUrl: string;
  fileName: string;
  fileType: "pdf" | "doc" | "docx";
  fileSize: number | null;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.error ?? "Unexpected API error");
  }
  return res.json();
}

export function LearningClient({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<"ai" | "cybersecurity" | "all">("all");

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      const moduleParam = selectedModule === "all" ? "" : `?module=${selectedModule}`;
      const data = await request<LearningMaterial[]>(`/api/learning${moduleParam}`);
      setMaterials(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch learning materials");
    } finally {
      setLoading(false);
    }
  }, [selectedModule]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleDelete = async (materialId: string) => {
    if (!confirm("Are you sure you want to delete this learning material?")) {
      return;
    }

    try {
      await request(`/api/learning/${materialId}`, {
        method: "DELETE",
      });
      setMaterials(materials.filter((m) => m.id !== materialId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete material");
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const filteredMaterials = selectedModule === "all" 
    ? materials 
    : materials.filter((m) => m.module === selectedModule);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-semibold">Learning Materials</h1>
        <p className="mt-2 text-slate-600">
          Access learning resources organized by AI and Cyber Security modules.
        </p>
      </header>

      {isSuperAdmin && (
        <LearningMaterialUpload onUploadSuccess={fetchMaterials} />
      )}

      <div className="rounded-3xl bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Materials</h2>
          <div className="flex gap-2 rounded-xl border border-slate-200 p-1">
            <button
              type="button"
              onClick={() => setSelectedModule("all")}
              className={`rounded-lg px-3 py-1 text-sm font-semibold transition ${
                selectedModule === "all"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedModule("ai")}
              className={`rounded-lg px-3 py-1 text-sm font-semibold transition ${
                selectedModule === "ai"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              AI
            </button>
            <button
              type="button"
              onClick={() => setSelectedModule("cybersecurity")}
              className={`rounded-lg px-3 py-1 text-sm font-semibold transition ${
                selectedModule === "cybersecurity"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Cyber Security
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading materials...</p>
        ) : error ? (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : filteredMaterials.length === 0 ? (
          <p className="text-slate-500">No learning materials available.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 uppercase">
                        {material.module}
                      </span>
                      <span className="text-xs text-slate-500">
                        {material.fileType.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      {material.title}
                    </h3>
                    {material.description && (
                      <p className="mt-1 text-sm text-slate-600">
                        {material.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-500">
                      {formatFileSize(material.fileSize)} •{" "}
                      {new Date(material.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {isSuperAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDelete(material.id)}
                      className="ml-2 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Delete material"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="mt-4">
                  {material.fileType === "pdf" ? (
                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                      View PDF
                    </a>
                  ) : (
                    <a
                      href={material.fileUrl}
                      download={material.fileName}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


