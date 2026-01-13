"use client";

import { useState } from "react";

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

export function LearningMaterialUpload({
  onUploadSuccess,
}: {
  onUploadSuccess?: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    module: "ai" as "ai" | "cybersecurity",
    file: null as File | null,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const allowedExtensions = ["pdf", "doc", "docx"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (
        !allowedTypes.includes(file.type) &&
        !allowedExtensions.includes(fileExtension || "")
      ) {
        setError("Only PDF, DOC, and DOCX files are allowed");
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setFormData({ ...formData, file });
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.file || !formData.title) {
      setError("Title and file are required");
      return;
    }

    setUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", formData.file);
      uploadFormData.append("title", formData.title);
      uploadFormData.append("description", formData.description);
      uploadFormData.append("module", formData.module);

      const response = await fetch("/api/learning/upload", {
        method: "POST",
        body: uploadFormData,
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        module: "ai",
        file: null,
      });
      
      // Reset file input
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-900">Upload Learning Material</h3>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 min-h-[80px]"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Module <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.module}
          onChange={(e) =>
            setFormData({
              ...formData,
              module: e.target.value as "ai" | "cybersecurity",
            })
          }
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
          required
        >
          <option value="ai">AI</option>
          <option value="cybersecurity">Cyber Security</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          File (PDF, DOC, DOCX) <span className="text-red-500">*</span>
        </label>
        <input
          id="file-input"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
          required
        />
        {formData.file && (
          <p className="mt-2 text-sm text-slate-500">
            Selected: {formData.file.name} ({formatFileSize(formData.file.size)})
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Learning material uploaded successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={uploading || !formData.file || !formData.title}
        className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? "Uploading..." : "Upload Material"}
      </button>
    </form>
  );
}


