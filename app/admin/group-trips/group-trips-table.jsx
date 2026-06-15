"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/admin/data-table";
import { Edit, Trash2, Eye } from "lucide-react";
import { revalidateGroupTripsOnServer } from "@/lib/revalidate-trips-client";
import { capacityLabel } from "@/lib/group-trip-capacity";
import { formatFullDate } from "@/lib/trip-booking";

export function GroupTripsTable({ trips }) {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete group trip "${name}"?`)) return;

    const { error } = await supabase.from("group_trips").delete().eq("id", id);
    if (error) {
      alert("Error deleting group trip: " + error.message);
    } else {
      await revalidateGroupTripsOnServer();
      router.refresh();
    }
  };

  const columns = [
    {
      key: "name",
      label: "Group trip",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {row.hero_image && (
            <img src={row.hero_image} alt={value} className="h-10 w-10 rounded-lg object-cover" />
          )}
          <div>
            <p className="font-medium text-zinc-900">{value}</p>
            <p className="text-xs text-zinc-500">{row.hosted_place}</p>
          </div>
        </div>
      ),
    },
    {
      key: "departure_date",
      label: "Departure",
      render: (value) =>
        value ? formatFullDate(new Date(value)) : "—",
    },
    {
      key: "max_capacity",
      label: "Slots",
      render: (_, row) => {
        const cap = capacityLabel(row);
        return (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              cap.isFull
                ? "bg-red-100 text-red-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {cap.booked}/{cap.max} booked
          </span>
        );
      },
    },
    {
      key: "price",
      label: "From",
    },
    {
      key: "is_active",
      label: "Status",
      render: (value) => (
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            value ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
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
        href={`/group-trips/${row.slug}`}
        target="_blank"
        className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700"
        title="View on site"
      >
        <Eye className="w-4 h-4" />
      </Link>
      <Link
        href={`/admin/group-trips/${row.id}`}
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
      searchPlaceholder="Search group trips..."
      actions={actions}
    />
  );
}
