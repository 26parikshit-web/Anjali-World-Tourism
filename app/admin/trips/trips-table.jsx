"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/admin/data-table";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export function TripsTable({ trips }) {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) {
      alert("Error deleting trip: " + error.message);
    } else {
      router.refresh();
    }
  };

  const columns = [
    {
      key: "name",
      label: "Trip Name",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {row.hero_image && (
            <img
              src={row.hero_image}
              alt={value}
              className="w-10 h-10 rounded-lg object-cover"
            />
          )}
          <div>
            <p className="font-medium text-zinc-900">{value}</p>
            <p className="text-xs text-zinc-500">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (value) => (
        <span className="text-xs font-medium bg-zinc-100 text-zinc-700 px-2 py-1 rounded-full">
          {value}
        </span>
      ),
    },
    {
      key: "duration",
      label: "Duration",
    },
    {
      key: "price",
      label: "Price",
    },
    {
      key: "is_active",
      label: "Status",
      render: (value) => (
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            value
              ? "bg-emerald-100 text-emerald-700"
              : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const actions = (row) => (
    <>
      <Link
        href={`/trips/${row.slug}`}
        target="_blank"
        className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700"
        title="View on site"
      >
        <Eye className="w-4 h-4" />
      </Link>
      <Link
        href={`/admin/trips/${row.id}`}
        className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700"
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </Link>
      <button
        onClick={() => handleDelete(row.id, row.name)}
        className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-500 hover:text-red-600"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );

  return (
    <DataTable
      columns={columns}
      data={trips}
      searchPlaceholder="Search trips..."
      actions={actions}
    />
  );
}
