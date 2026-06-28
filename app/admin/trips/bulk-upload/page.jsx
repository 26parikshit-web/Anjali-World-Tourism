"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, FileJson } from "lucide-react";
import { showError } from "@/lib/toast";

export default function BulkUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [file, setFile] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setJsonText(event.target.result);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessResult(null);

    try {
      if (!jsonText.trim()) {
        throw new Error("Please provide JSON data either via text or file upload.");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(jsonText);
      } catch (err) {
        throw new Error("Invalid JSON format. Please check your data.");
      }

      if (!Array.isArray(parsedData)) {
        throw new Error("JSON data must be an array of trip objects.");
      }

      const res = await fetch("/api/trips/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to bulk upload trips.");
      }

      setSuccessResult(data);
      setJsonText("");
      setFile(null);
      
      // Optionally route back
      // router.push("/admin/trips");
      // router.refresh();
      
    } catch (err) {
      showError(err.message, e.currentTarget);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/trips"
          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Bulk Upload Trips</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Upload multiple travel packages via JSON
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6" data-error-anchor>
          {successResult && (
            <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl">
              <p className="font-medium">Successfully uploaded {successResult.count} trips!</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Upload JSON File
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center justify-center gap-2 px-4 py-2 border border-zinc-200 border-dashed rounded-xl cursor-pointer hover:bg-zinc-50 transition-colors">
                <FileJson className="w-5 h-5 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-600">Select File</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              {file && (
                <span className="text-sm text-zinc-500">
                  {file.name}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-zinc-700">
                Or Paste JSON Data
              </label>
              <Link href="/TRIPS_BULK_UPLOAD.md" target="_blank" className="text-xs text-blue-600 hover:underline">
                View Documentation & Payload Format
              </Link>
            </div>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="[\n  {\n    &#34;name&#34;: &#34;My Trip&#34;,\n    &#34;slug&#34;: &#34;my-trip&#34;,\n    ...\n  }\n]"
              className="w-full h-64 p-4 font-mono text-sm border border-zinc-200 rounded-xl bg-zinc-50 outline-none focus:border-zinc-400 focus:bg-white resize-y"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-100">
            <button
              type="submit"
              disabled={loading || !jsonText.trim()}
              className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
