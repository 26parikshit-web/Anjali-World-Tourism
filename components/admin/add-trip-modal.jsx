"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Edit3, Eye, CheckCircle2 } from "lucide-react";
import { parseTripMessage } from "@/lib/trip-message-parser";

export function AddTripModal({ isOpen, onClose }) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null);
  const [uploadedText, setUploadedText] = useState("");
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [parsedPreview, setParsedPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedText(event.target.result);
      setError(null);
      setShowPreview(false);
      setParsedPreview(null);
    };
    reader.onerror = () => {
      setError("Failed to read file. Please try again.");
    };
    reader.readAsText(file);
  };

  const handleTextAreaChange = (e) => {
    setUploadedText(e.target.value);
    setError(null);
    setShowPreview(false);
    setParsedPreview(null);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".txt") && !file.name.endsWith(".md")) {
      setError("Please upload a .txt or .md file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedText(event.target.result);
      setError(null);
      setShowPreview(false);
      setParsedPreview(null);
    };
    reader.onerror = () => {
      setError("Failed to read file. Please try again.");
    };
    reader.readAsText(file);
  };

  const handlePreview = () => {
    if (!uploadedText.trim()) {
      setError("Please upload or paste trip details first.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const parsedData = parseTripMessage(uploadedText);
      setParsedPreview(parsedData);
      setShowPreview(true);
      setProcessing(false);
    } catch (err) {
      console.error("Parse error:", err);
      setError(err.message || "Failed to parse trip details. Please check the format.");
      setProcessing(false);
    }
  };

  const handleParseAndContinue = () => {
    // If preview is already shown, use that data
    if (showPreview && parsedPreview) {
      sessionStorage.setItem("tripDraft", JSON.stringify(parsedPreview));
      router.push("/admin/trips/new");
      return;
    }

    if (!uploadedText.trim()) {
      setError("Please upload or paste trip details.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const parsedData = parseTripMessage(uploadedText);

      // Validate that we got some data
      if (!parsedData.name && parsedData.itinerary.length === 0) {
        throw new Error("No valid trip data found in the text.");
      }

      // Store in sessionStorage to pass to the form
      sessionStorage.setItem("tripDraft", JSON.stringify(parsedData));

      // Navigate to the form
      router.push("/admin/trips/new");
    } catch (err) {
      console.error("Parse error:", err);
      setError(
        err.message ||
          "Failed to parse trip details. Please check the format and try again."
      );
      setProcessing(false);
    }
  };

  const handleManualEntry = () => {
    sessionStorage.removeItem("tripDraft");
    router.push("/admin/trips/new");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Add New Trip
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Choose how you'd like to add trip details
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!selectedOption ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Option 1: Upload/Paste */}
              <button
                onClick={() => setSelectedOption("upload")}
                className="group relative p-6 rounded-xl border-2 border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition text-left"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-zinc-100 group-hover:bg-zinc-900 transition">
                    <Upload className="w-6 h-6 text-zinc-600 group-hover:text-white transition" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 mb-1">
                      Upload Message
                    </h3>
                    <p className="text-sm text-zinc-500">
                      Upload or paste formatted trip details
                    </p>
                  </div>
                </div>
              </button>

              {/* Option 2: Manual Entry */}
              <button
                onClick={handleManualEntry}
                className="group relative p-6 rounded-xl border-2 border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition text-left"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-zinc-100 group-hover:bg-zinc-900 transition">
                    <Edit3 className="w-6 h-6 text-zinc-600 group-hover:text-white transition" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 mb-1">
                      Fill Manually
                    </h3>
                    <p className="text-sm text-zinc-500">
                      Enter trip details using the form
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setSelectedOption(null);
                  setUploadedText("");
                  setError(null);
                }}
                className="text-sm text-zinc-500 hover:text-zinc-700 flex items-center gap-1"
              >
                ← Back to options
              </button>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {!showPreview ? (
                <div className="space-y-3">
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 transition ${
                      isDragging
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-300"
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                      <p className="text-sm text-zinc-600 mb-2">
                        Drag and drop a text file here
                      </p>
                      <p className="text-xs text-zinc-500 mb-4">or</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm font-semibold text-zinc-900 hover:text-zinc-700"
                      >
                        Browse files
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.md"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-2 text-zinc-500">
                        OR PASTE TEXT BELOW
                      </span>
                    </div>
                  </div>

                  <textarea
                    value={uploadedText}
                    onChange={handleTextAreaChange}
                    placeholder="Paste trip details here..."
                    rows={10}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-400 focus:bg-white resize-none font-mono"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-700">
                      <p className="font-semibold">Trip data parsed successfully!</p>
                      <p className="mt-0.5">Review the details below before continuing.</p>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto space-y-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 mb-1">Trip Name</p>
                      <p className="text-sm text-zinc-900">{parsedPreview?.name || "Not found"}</p>
                    </div>
                    
                    {parsedPreview?.category && (
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 mb-1">Category</p>
                        <p className="text-sm text-zinc-900">{parsedPreview.category}</p>
                      </div>
                    )}

                    {parsedPreview?.short_description && (
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 mb-1">Short Description</p>
                        <p className="text-sm text-zinc-900">{parsedPreview.short_description}</p>
                      </div>
                    )}
                    
                    {parsedPreview?.duration && (
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 mb-1">Duration</p>
                        <p className="text-sm text-zinc-900">{parsedPreview.duration}</p>
                      </div>
                    )}

                    {parsedPreview?.price && (
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 mb-1">Price</p>
                        <p className="text-sm text-zinc-900">{parsedPreview.price}</p>
                      </div>
                    )}

                    {parsedPreview?.itinerary?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 mb-1">Itinerary Days</p>
                        <p className="text-sm text-zinc-900">{parsedPreview.itinerary.length} days found</p>
                      </div>
                    )}

                    {parsedPreview?.highlights?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 mb-1">Highlights</p>
                        <p className="text-sm text-zinc-900">{parsedPreview.highlights.length} highlights found</p>
                      </div>
                    )}

                    {parsedPreview?.inclusions?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 mb-1">Inclusions</p>
                        <p className="text-sm text-zinc-900">{parsedPreview.inclusions.length} items</p>
                      </div>
                    )}

                    {parsedPreview?.exclusions?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 mb-1">Exclusions</p>
                        <p className="text-sm text-zinc-900">{parsedPreview.exclusions.length} items</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setShowPreview(false);
                      setParsedPreview(null);
                    }}
                    className="text-sm text-zinc-500 hover:text-zinc-700"
                  >
                    ← Edit text
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                {!showPreview ? (
                  <>
                    <button
                      onClick={handlePreview}
                      disabled={!uploadedText.trim() || processing}
                      className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-sm font-semibold px-6 py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      {processing ? "Processing..." : "Preview"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleParseAndContinue}
                    className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-semibold px-6 py-2.5 rounded-xl transition"
                  >
                    Continue to Form
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm text-zinc-500 hover:text-zinc-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
