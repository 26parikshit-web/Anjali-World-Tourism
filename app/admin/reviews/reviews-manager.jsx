"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, X, Star } from "lucide-react";

export function ReviewsManager({ reviews, trips }) {
  const router = useRouter();
  const supabase = createClient();
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    trip: "",
    trip_id: "",
    quote: "",
    image_url: "",
    rating: 5,
    is_featured: false,
    is_approved: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      trip: "",
      trip_id: "",
      quote: "",
      image_url: "",
      rating: 5,
      is_featured: false,
      is_approved: true,
    });
    setEditingReview(null);
  };

  const openModal = (review = null) => {
    if (review) {
      setFormData({
        name: review.name || "",
        designation: review.designation || "",
        trip: review.trip || "",
        trip_id: review.trip_id || "",
        quote: review.quote || "",
        image_url: review.image_url || "",
        rating: review.rating || 5,
        is_featured: review.is_featured || false,
        is_approved: review.is_approved ?? true,
      });
      setEditingReview(review);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        trip_id: formData.trip_id || null,
      };

      if (editingReview) {
        const { error } = await supabase
          .from("reviews")
          .update(dataToSave)
          .eq("id", editingReview.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("reviews").insert([dataToSave]);
        if (error) throw error;
      }

      setShowModal(false);
      resetForm();
      router.refresh();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete review from "${name}"?`)) return;
    
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
    } else {
      router.refresh();
    }
  };

  const columns = [
    {
      key: "name",
      label: "Customer",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            <img
              src={row.image_url}
              alt={value}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-semibold text-zinc-600">
              {value?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-zinc-900">{value}</p>
            <p className="text-xs text-zinc-500">{row.designation}</p>
          </div>
        </div>
      ),
    },
    {
      key: "trip",
      label: "Trip",
      render: (value) => (
        <span className="text-xs bg-zinc-100 text-zinc-700 px-2 py-1 rounded-full">
          {value || "General"}
        </span>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (value) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < value ? "fill-amber-400 text-amber-400" : "text-zinc-300"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      key: "is_approved",
      label: "Status",
      render: (value) => (
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            value
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {value ? "Approved" : "Pending"}
        </span>
      ),
    },
  ];

  const actions = (row) => (
    <>
      <button
        onClick={() => openModal(row)}
        className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDelete(row.id, row.name)}
        className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-500 hover:text-red-600"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-semibold px-4 py-2.5 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        searchPlaceholder="Search reviews..."
        actions={actions}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-lg font-semibold text-zinc-900">
                {editingReview ? "Edit Review" : "Add Review"}
              </h2>
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      designation: e.target.value,
                    }))
                  }
                  placeholder="e.g., Software Engineer, Delhi"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Trip
                </label>
                <select
                  value={formData.trip_id}
                  onChange={(e) => {
                    const trip = trips.find((t) => t.id === e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      trip_id: e.target.value,
                      trip: trip?.name || "",
                    }));
                  }}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
                >
                  <option value="">Select a trip (optional)</option>
                  {trips.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Review *
                </label>
                <textarea
                  value={formData.quote}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, quote: e.target.value }))
                  }
                  required
                  rows={4}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      image_url: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, rating: value }))
                      }
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 transition ${
                          value <= formData.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-zinc-300 hover:text-amber-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_approved}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_approved: e.target.checked,
                      }))
                    }
                    className="rounded border-zinc-300"
                  />
                  <span className="text-sm text-zinc-700">Approved</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_featured: e.target.checked,
                      }))
                    }
                    className="rounded border-zinc-300"
                  />
                  <span className="text-sm text-zinc-700">Featured</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-semibold py-2.5 rounded-xl"
                >
                  {loading ? "Saving..." : editingReview ? "Update" : "Add Review"}
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
      )}
    </>
  );
}
