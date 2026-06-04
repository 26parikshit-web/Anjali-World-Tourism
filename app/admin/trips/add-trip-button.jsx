"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AddTripModal } from "@/components/admin/add-trip-modal";

export function AddTripButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-semibold px-4 py-2.5 rounded-xl transition"
      >
        <Plus className="w-4 h-4" />
        Add Trip
      </button>

      <AddTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
