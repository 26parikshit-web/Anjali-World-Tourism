"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { uploadAdminMedia, deleteAdminMedia } from "@/lib/admin-media";
import { cloudinaryGalleryUrl, isCloudinaryUrl } from "@/lib/cloudinary";
import { maxUploadBytes, mediaAcceptForType } from "@/lib/trip-media";
import { Button } from "@/components/ui/button";
import { ModalPortal, MODAL_LAYER_CLASS } from "@/components/modal-portal";
import { cn } from "@/lib/utils";
import { Plus, Trash2, X, Image as ImageIcon, ExternalLink, Upload, Loader2 } from "lucide-react";
import { showError } from "@/lib/toast";

const categories = [
  "Destinations",
  "Spiritual",
  "Adventure",
  "Beach",
  "Mountains",
  "Culture",
  "Wildlife",
  "Other",
];

function categoryFolder(category) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function GalleryManager({ gallery, trips }) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    cloudinary_public_id: "",
    resource_type: "image",
    category: categories[0],
    trip_id: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      image_url: "",
      cloudinary_public_id: "",
      resource_type: "image",
      category: categories[0],
      trip_id: "",
    });
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Gallery uploads support images only (JPEG, PNG, WebP, GIF).", "media");
      return;
    }

    if (file.size > maxUploadBytes("image")) {
      showError("Image must be under 10 MB.", "media");
      return;
    }

    setUploading(true);

    try {
      const uploaded = await uploadAdminMedia(file, {
        scope: "site-gallery",
        category: categoryFolder(formData.category),
      });

      setFormData((prev) => ({
        ...prev,
        image_url: uploaded.url,
        cloudinary_public_id: uploaded.publicId || "",
        resource_type: uploaded.resourceType || "image",
        title: prev.title || file.name.replace(/\.[^.]+$/, ""),
      }));
    } catch (err) {
      showError(err.message || "Upload failed. Check Cloudinary env vars.", "media");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_url) {
      showError("Upload an image first.", "media");
      return;
    }

    setLoading(true);

    try {
      const base = {
        title: formData.title || null,
        image_url: formData.image_url,
        category: formData.category,
        trip_id: formData.trip_id || null,
      };

      let insertError;
      ({ error: insertError } = await supabase.from("gallery").insert([
        {
          ...base,
          cloudinary_public_id: formData.cloudinary_public_id || null,
          resource_type: formData.resource_type || "image",
        },
      ]));

      if (insertError?.message?.includes("cloudinary_public_id")) {
        ({ error: insertError } = await supabase.from("gallery").insert([base]));
      }

      if (insertError) throw insertError;

      setShowModal(false);
      resetForm();
      router.refresh();
    } catch (err) {
      showError(err.message || "Failed to save gallery item.", "media");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm("Delete this image from the gallery and Cloudinary?")) return;

    try {
      if (item.image_url && isCloudinaryUrl(item.image_url)) {
        await deleteAdminMedia({
          url: item.image_url,
          publicId: item.cloudinary_public_id,
          resourceType: item.resource_type || "image",
        });
      }

      const { error: deleteError } = await supabase.from("gallery").delete().eq("id", item.id);
      if (deleteError) throw deleteError;

      router.refresh();
    } catch (err) {
      showError(err.message);
    }
  };

  const filteredGallery =
    selectedCategory === "all"
      ? gallery
      : gallery.filter((item) => item.category === selectedCategory);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              selectedCategory === "all"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            All ({gallery.length})
          </button>
          {categories.map((cat) => {
            const count = gallery.filter((g) => g.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  selectedCategory === cat
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-semibold px-4 py-2.5 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredGallery.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <ImageIcon className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm text-zinc-500">No images found</p>
          </div>
        ) : (
          filteredGallery.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-xl border border-zinc-200 overflow-hidden"
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={cloudinaryGalleryUrl(item.image_url)}
                  alt={item.title || "Gallery image"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <a
                    href={item.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-lg hover:bg-zinc-100"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 bg-white rounded-lg hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-zinc-900 truncate">
                  {item.title || "Untitled"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  {isCloudinaryUrl(item.image_url) && (
                    <span className="text-[10px] text-emerald-600">Cloudinary</span>
                  )}
                  {item.trip_id && (
                    <span className="text-[10px] text-zinc-500 truncate">
                      {trips.find((t) => t.id === item.trip_id)?.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <ModalPortal>
          <div
            className={cn(
              "fixed inset-0 flex items-center justify-center bg-black/50 p-4",
              MODAL_LAYER_CLASS
            )}
          >
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-lg font-semibold text-zinc-900">Add Gallery Image</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-zinc-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
              data-error-anchor="media"
            >
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Image *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={mediaAcceptForType("image")}
                  className="hidden"
                  onChange={(e) => {
                    handleFileSelect(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 py-8 text-sm text-zinc-600 transition hover:border-zinc-400 hover:bg-zinc-100"
                >
                  {uploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                  ) : (
                    <Upload className="h-6 w-6 text-zinc-400" />
                  )}
                  <span>
                    {uploading
                      ? "Uploading to Cloudinary…"
                      : formData.image_url
                        ? "Replace image"
                        : "Upload image (JPEG, PNG, WebP — max 10 MB)"}
                  </span>
                </button>
              </div>

              {formData.image_url && (
                <div className="rounded-xl border border-zinc-200 overflow-hidden">
                  <img
                    src={cloudinaryGalleryUrl(formData.image_url)}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Optional title"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Link to Trip
                </label>
                <select
                  value={formData.trip_id}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, trip_id: e.target.value }))
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
                >
                  <option value="">None</option>
                  {trips.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading || uploading || !formData.image_url}
                  className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-semibold py-2.5 rounded-xl"
                >
                  {loading ? "Saving..." : "Save to Gallery"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2.5 text-sm text-zinc-500 hover:text-zinc-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        </ModalPortal>
      )}
    </>
  );
}
