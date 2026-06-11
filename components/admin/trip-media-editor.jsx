"use client";

import { useRef, useState } from "react";
import { uploadTripMedia } from "@/lib/upload-trip-media";
import {
  cloudinaryGalleryUrl,
  cloudinaryHeroUrl,
  cloudinaryVideoUrl,
} from "@/lib/cloudinary";
import {
  detectMediaType,
  maxUploadBytes,
  mediaAcceptForType,
  normalizeGalleryItem,
} from "@/lib/trip-media";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Link2,
  Loader2,
  Star,
  Trash2,
  Upload,
  Video,
} from "lucide-react";

const emptyItem = () => ({ type: "image", src: "", alt: "" });

export function TripMediaEditor({
  gallery = [],
  heroImage = "",
  tripSlug = "",
  onGalleryChange,
  onHeroChange,
}) {
  const fileInputRef = useRef(null);
  const heroInputRef = useRef(null);

  const [addMode, setAddMode] = useState("upload");
  const [newItem, setNewItem] = useState(emptyItem());
  const [uploading, setUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState(null);
  const [error, setError] = useState(null);

  const items = gallery.map(normalizeGalleryItem).filter(Boolean);

  const handleFileUpload = async (file, { target = "gallery", index = null } = {}) => {
    if (!file) return;

    const mediaType = file.type.startsWith("video/") ? "video" : "image";
    const limit = maxUploadBytes(mediaType);
    if (file.size > limit) {
      setError(
        mediaType === "video"
          ? "Video must be under 30 MB. Keep clips short (~30 seconds)."
          : "Image must be under 10 MB."
      );
      return;
    }

    setError(null);
    setUploading(true);
    setUploadTarget(target === "hero" ? "hero" : index ?? "new");

    try {
      const publicUrl = await uploadTripMedia(file, {
        tripSlug,
        folder: target === "hero" ? "hero" : "gallery",
      });

      if (target === "hero") {
        onHeroChange?.(publicUrl);
      } else if (index !== null) {
        updateItem(index, { src: publicUrl, type: mediaType });
      } else {
        onGalleryChange?.([
          ...items,
          { type: mediaType, src: publicUrl, alt: file.name.replace(/\.[^.]+$/, "") },
        ]);
      }
    } catch (err) {
      setError(err.message || "Upload failed. Check Cloudinary env vars.");
    } finally {
      setUploading(false);
      setUploadTarget(null);
    }
  };

  const updateItem = (index, patch) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onGalleryChange?.(next);
  };

  const removeItem = (index) => {
    onGalleryChange?.(items.filter((_, i) => i !== index));
  };

  const moveItem = (index, direction) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onGalleryChange?.(next);
  };

  const addFromUrl = () => {
    const src = newItem.src.trim();
    if (!src) {
      setError("Enter a media URL.");
      return;
    }

    const type =
      newItem.type === "video" || detectMediaType(src) === "video" ? "video" : "image";

    onGalleryChange?.([...items, { type, src, alt: newItem.alt.trim() || "" }]);
    setNewItem(emptyItem());
    setError(null);
  };

  const renderPreview = (item) => {
    if (item.type === "video") {
      return (
        <video
          src={cloudinaryVideoUrl(item.src)}
          className="h-full w-full object-cover"
          muted
          playsInline
          controls
        />
      );
    }

    return (
      <img
        src={cloudinaryGalleryUrl(item.src)}
        alt={item.alt || "Trip media"}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/400x300?text=Invalid+URL";
        }}
      />
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-900">Hero image</p>
            <p className="text-xs text-zinc-500">Shown at the top of the trip page</p>
          </div>
          <input
            ref={heroInputRef}
            type="file"
            accept={mediaAcceptForType("image")}
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files?.[0], { target: "hero" })}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => heroInputRef.current?.click()}
            className="rounded-lg text-xs"
          >
            {uploading && uploadTarget === "hero" ? (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="mr-1 h-3.5 w-3.5" />
            )}
            Upload to Cloudinary
          </Button>
        </div>
        <input
          type="text"
          value={heroImage}
          onChange={(e) => onHeroChange?.(e.target.value)}
          placeholder="Cloudinary URL or paste existing image URL"
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-400"
        />
        {heroImage && (
          <div className="mt-3 aspect-[21/9] overflow-hidden rounded-xl border border-zinc-200">
            <img
              src={cloudinaryHeroUrl(heroImage)}
              alt="Hero preview"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      <div>
        <div className="mb-3">
          <p className="text-sm font-semibold text-zinc-900">Gallery</p>
          <p className="text-xs text-zinc-500">
            Images + short MP4/WebM clips (muted loop on hover on the trip page)
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 py-10 text-center">
            <ImageIcon className="mx-auto mb-2 h-8 w-8 text-zinc-300" />
            <p className="text-sm text-zinc-500">No media yet — upload files below</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={`${item.src}-${index}`}
                className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3"
              >
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  {renderPreview(item)}
                  <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-white">
                    {item.type}
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    type="text"
                    value={item.src}
                    onChange={(e) => updateItem(index, { src: e.target.value })}
                    placeholder="Cloudinary URL"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs outline-none focus:border-zinc-400"
                  />
                  <input
                    type="text"
                    value={item.alt}
                    onChange={(e) => updateItem(index, { alt: e.target.value })}
                    placeholder="Caption / alt text (optional)"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs outline-none focus:border-zinc-400"
                  />
                </div>

                <div className="flex shrink-0 flex-col gap-1">
                  {item.type === "image" && (
                    <button
                      type="button"
                      title="Set as hero"
                      onClick={() => onHeroChange?.(item.src)}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-amber-50 hover:text-amber-600"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === items.length - 1}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 p-4">
        <p className="mb-3 text-sm font-semibold text-zinc-900">Add media</p>

        <div className="mb-3 flex flex-wrap gap-2">
          {[
            { id: "upload", label: "Upload file", icon: Upload },
            { id: "url", label: "Paste URL", icon: Link2 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setAddMode(id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                addMode === id
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {addMode === "upload" ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept={`${mediaAcceptForType("image")},${mediaAcceptForType("video")}`}
              className="hidden"
              onChange={(e) => {
                handleFileUpload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 py-8 text-sm text-zinc-600 transition hover:border-zinc-400 hover:bg-zinc-100"
            >
              {uploading && uploadTarget === "new" ? (
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
              ) : (
                <Upload className="h-6 w-6 text-zinc-400" />
              )}
              <span>
                {uploading
                  ? "Uploading to Cloudinary…"
                  : "Image (10 MB) or short video MP4/WebM (30 MB)"}
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {[
                { type: "image", label: "Image URL", icon: ImageIcon },
                { type: "video", label: "Video URL", icon: Video },
              ].map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setNewItem((prev) => ({ ...prev, type }))}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs ${
                    newItem.type === type
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={newItem.src}
              onChange={(e) => setNewItem((prev) => ({ ...prev, src: e.target.value }))}
              placeholder={
                newItem.type === "video"
                  ? "https://res.cloudinary.com/.../video.mp4"
                  : "https://res.cloudinary.com/.../image.jpg"
              }
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            />
            <input
              type="text"
              value={newItem.alt}
              onChange={(e) => setNewItem((prev) => ({ ...prev, alt: e.target.value }))}
              placeholder="Caption (optional)"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            />
            <Button
              type="button"
              onClick={addFromUrl}
              className="rounded-xl bg-zinc-900 text-sm text-white hover:bg-zinc-800"
            >
              Add to gallery
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
