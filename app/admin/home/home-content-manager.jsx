"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadAdminMedia, deleteAdminMedia } from "@/lib/admin-media";
import { cloudinaryHeroUrl, isCloudinaryUrl } from "@/lib/cloudinary";
import { maxUploadBytes, mediaAcceptForType } from "@/lib/trip-media";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Upload, X } from "lucide-react";

function SectionMediaField({
  label,
  sectionKey,
  mediaType,
  mediaUrl,
  posterUrl,
  publicId,
  onChange,
  onError,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file) => {
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const expectedType = mediaType === "video" ? "video" : "image";

    if ((isVideo && expectedType !== "video") || (!isVideo && expectedType !== "image")) {
      onError(`Upload a ${expectedType} file for this section.`);
      return;
    }

    if (file.size > maxUploadBytes(expectedType)) {
      onError(
        expectedType === "video"
          ? "Video must be under 30 MB."
          : "Image must be under 10 MB."
      );
      return;
    }

    setUploading(true);
    onError("");

    try {
      const uploaded = await uploadAdminMedia(file, {
        scope: "home",
        homeSection: sectionKey,
      });

      onChange({
        media_url: uploaded.url,
        media_type: uploaded.resourceType === "video" ? "video" : "image",
        cloudinary_public_id: uploaded.publicId || "",
      });
    } catch (err) {
      onError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (mediaUrl && isCloudinaryUrl(mediaUrl) && publicId) {
      try {
        await deleteAdminMedia({
          url: mediaUrl,
          publicId,
          resourceType: mediaType,
        });
      } catch (err) {
        onError(err.message || "Failed to remove media from Cloudinary.");
        return;
      }
    }

    onChange({
      media_url: null,
      cloudinary_public_id: null,
      poster_url: sectionKey === "getaway" ? null : posterUrl,
    });
  };

  const previewUrl =
    mediaUrl && mediaType === "image" ? cloudinaryHeroUrl(mediaUrl) : mediaUrl;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-medium text-zinc-700">{label}</label>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={mediaAcceptForType(mediaType)}
            className="sr-only"
            id={`home-media-${sectionKey}`}
            onChange={(e) => handleUpload(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg text-xs"
          >
            {uploading ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="mr-1.5 h-3.5 w-3.5" />
            )}
            {uploading ? "Uploading…" : "Upload"}
          </Button>
          {mediaUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={handleRemove}
              className="rounded-lg text-xs text-red-600 hover:text-red-700"
            >
              <X className="mr-1.5 h-3.5 w-3.5" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {previewUrl ? (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950">
          {mediaType === "video" ? (
            <video
              src={previewUrl}
              controls
              playsInline
              className="h-40 w-full object-cover"
              poster={posterUrl || undefined}
            />
          ) : (
            <img
              src={previewUrl}
              alt={`${sectionKey} background`}
              className="h-40 w-full object-cover"
            />
          )}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center text-xs text-zinc-500">
          No custom media — site default background is used.
        </p>
      )}
    </div>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function HomeContentManager({ initialContent }) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateSection = (section, patch) => {
    setContent((current) => ({
      ...current,
      [section]: { ...current[section], ...patch },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/home-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save home content.");
      }

      setContent(data.content);
      setMessage("Homepage content saved. Changes appear on the site within a minute.");
      router.refresh();
    } catch (err) {
      setError(err.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Hero section"
        description="Main headline, intro text, and full-screen background video."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-zinc-700">
              Headline line 1
            </span>
            <input
              type="text"
              value={content.hero.headline_line_1}
              onChange={(e) => updateSection("hero", { headline_line_1: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-zinc-700">
              Headline line 2
            </span>
            <input
              type="text"
              value={content.hero.headline_line_2}
              onChange={(e) => updateSection("hero", { headline_line_2: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-700">Description</span>
          <textarea
            value={content.hero.description}
            onChange={(e) => updateSection("hero", { description: e.target.value })}
            rows={3}
            className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
          />
        </label>

        <SectionMediaField
          label="Background video"
          sectionKey="hero"
          mediaType="video"
          mediaUrl={content.hero.media_url}
          posterUrl={content.hero.poster_url}
          publicId={content.hero.cloudinary_public_id}
          onChange={(patch) => updateSection("hero", patch)}
          onError={setError}
        />
      </SectionCard>

      <SectionCard
        title="Spiritual journeys section"
        description="Pinned horizontal scroll block with pilgrimage trip cards."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-zinc-700">Eyebrow</span>
            <input
              type="text"
              value={content.spiritual.subtitle}
              onChange={(e) => updateSection("spiritual", { subtitle: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-zinc-700">Title</span>
            <input
              type="text"
              value={content.spiritual.title}
              onChange={(e) => updateSection("spiritual", { title: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-700">Description</span>
          <textarea
            value={content.spiritual.description}
            onChange={(e) => updateSection("spiritual", { description: e.target.value })}
            rows={2}
            className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-700">
            Background type
          </span>
          <select
            value={content.spiritual.media_type}
            onChange={(e) =>
              updateSection("spiritual", {
                media_type: e.target.value,
                media_url: null,
                cloudinary_public_id: null,
              })
            }
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
          >
            <option value="video">Video</option>
            <option value="image">Image</option>
          </select>
        </label>

        <SectionMediaField
          label={`Background ${content.spiritual.media_type}`}
          sectionKey="spiritual"
          mediaType={content.spiritual.media_type}
          mediaUrl={content.spiritual.media_url}
          posterUrl={content.spiritual.poster_url}
          publicId={content.spiritual.cloudinary_public_id}
          onChange={(patch) => updateSection("spiritual", patch)}
          onError={setError}
        />
      </SectionCard>

      <SectionCard
        title="Friends getaway section"
        description="Pinned horizontal scroll block with group adventure trip cards."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-zinc-700">Eyebrow</span>
            <input
              type="text"
              value={content.getaway.subtitle}
              onChange={(e) => updateSection("getaway", { subtitle: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-zinc-700">Title</span>
            <input
              type="text"
              value={content.getaway.title}
              onChange={(e) => updateSection("getaway", { title: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-700">Description</span>
          <textarea
            value={content.getaway.description}
            onChange={(e) => updateSection("getaway", { description: e.target.value })}
            rows={2}
            className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-700">
            Background type
          </span>
          <select
            value={content.getaway.media_type}
            onChange={(e) =>
              updateSection("getaway", {
                media_type: e.target.value,
                media_url: null,
                cloudinary_public_id: null,
              })
            }
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </label>

        <SectionMediaField
          label={`Background ${content.getaway.media_type}`}
          sectionKey="getaway"
          mediaType={content.getaway.media_type}
          mediaUrl={content.getaway.media_url}
          posterUrl={content.getaway.poster_url}
          publicId={content.getaway.cloudinary_public_id}
          onChange={(patch) => updateSection("getaway", patch)}
          onError={setError}
        />
      </SectionCard>

      {message && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {loading ? "Saving…" : "Save homepage"}
        </Button>
      </div>
    </div>
  );
}
