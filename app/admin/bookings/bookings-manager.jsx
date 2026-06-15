"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/admin/data-table";
import { StatCard } from "@/components/admin/stat-card";
import { formatINR } from "@/lib/trip-booking";
import { tierLabel } from "@/lib/trip-pricing";
import {
  X,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Users,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_STYLES = {
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function tripHref(booking) {
  if (booking.booking_kind === "group") {
    return `/group-trips/${booking.group_trip_slug || booking.trip_slug}`;
  }
  return `/trips/${booking.trip_slug}`;
}

export function BookingsManager({ bookings: initialBookings }) {
  const router = useRouter();
  const supabase = createClient();
  const [bookings, setBookings] = useState(initialBookings);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setBookings(data || []);
      router.refresh();
    } catch (err) {
      console.error("Error fetching bookings:", err);
      alert(err.message || "Failed to refresh bookings.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (kindFilter === "trip" && b.booking_kind === "group") return false;
      if (kindFilter === "group" && b.booking_kind !== "group") return false;
      return true;
    });
  }, [bookings, statusFilter, kindFilter]);

  const paidTotal = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "paid")
        .reduce((sum, b) => sum + Number(b.amount || 0), 0),
    [bookings]
  );

  const columns = [
    {
      key: "customer_name",
      label: "Customer",
      render: (value, row) => (
        <div>
          <p className="font-medium text-zinc-900">{value}</p>
          <p className="text-xs text-zinc-500">{row.customer_email}</p>
        </div>
      ),
    },
    {
      key: "trip_name",
      label: "Trip",
      render: (value, row) => (
        <div>
          <p className="font-medium text-zinc-900 line-clamp-1">{value}</p>
          <p className="text-[11px] text-zinc-500">
            {row.booking_kind === "group" ? "Group trip" : "Trip"}
            {row.package_tier ? ` · ${tierLabel(row.package_tier)}` : ""}
          </p>
        </div>
      ),
    },
    {
      key: "pax",
      label: "Pax",
      render: (value) => <span className="tabular-nums">{value ?? 1}</span>,
    },
    {
      key: "amount",
      label: "Amount",
      render: (value) => (
        <span className="font-medium tabular-nums text-zinc-900">
          {value != null ? formatINR(Number(value)) : "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            STATUS_STYLES[value] || STATUS_STYLES.pending
          }`}
        >
          {value || "pending"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Booked",
      render: (value) => (
        <span className="text-xs text-zinc-500">{formatDateTime(value)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total bookings"
          value={bookings.length}
          description="All payment records"
          icon={CreditCard}
        />
        <StatCard
          title="Paid"
          value={bookings.filter((b) => b.status === "paid").length}
          icon={CreditCard}
        />
        <StatCard
          title="Revenue (paid)"
          value={formatINR(paidTotal)}
          description="Incl. GST as charged"
          icon={CreditCard}
        />
      </div>

      <div className="admin-card flex flex-wrap items-center gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          {["all", "paid", "pending", "failed", "refunded"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === status
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 border-l border-zinc-200 pl-3">
          {[
            { id: "all", label: "All types" },
            { id: "trip", label: "Trips" },
            { id: "group", label: "Group" },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setKindFilter(id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                kindFilter === id
                  ? "bg-amber-500 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <Button
          onClick={refresh}
          variant="outline"
          size="sm"
          disabled={loading}
          className="ml-auto"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search by customer, trip, email, payment ID..."
        searchKeys={[
          "customer_name",
          "customer_email",
          "customer_phone",
          "trip_name",
          "trip_slug",
          "razorpay_payment_id",
          "razorpay_order_id",
        ]}
        onRowClick={setSelected}
        emptyMessage="No bookings yet. They appear here after successful Razorpay payments."
      />

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">Booking details</h2>
                <p className="text-xs text-zinc-500">{formatDateTime(selected.created_at)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">
                  {selected.customer_name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">{selected.customer_name}</p>
                  <span
                    className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      STATUS_STYLES[selected.status] || STATUS_STYLES.pending
                    }`}
                  >
                    {selected.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <a
                  href={`mailto:${selected.customer_email}`}
                  className="flex items-center gap-2 text-zinc-700 hover:text-zinc-900"
                >
                  <Mail className="h-4 w-4 text-zinc-400" />
                  {selected.customer_email}
                </a>
                {selected.customer_phone && (
                  <a
                    href={`tel:${selected.customer_phone}`}
                    className="flex items-center gap-2 text-zinc-700 hover:text-zinc-900"
                  >
                    <Phone className="h-4 w-4 text-zinc-400" />
                    {selected.customer_phone}
                  </a>
                )}
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                  Trip
                </p>
                <p className="mt-1 font-semibold text-zinc-900">{selected.trip_name}</p>
                <p className="mt-1 text-xs text-zinc-600">
                  {selected.booking_kind === "group" ? "Group departure" : "Regular trip"}
                  {selected.package_tier
                    ? ` · ${tierLabel(selected.package_tier)} package`
                    : ""}
                </p>
                <Link
                  href={tripHref(selected)}
                  target="_blank"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-900"
                >
                  View public page
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-zinc-200 p-3">
                  <p className="flex items-center gap-1 text-[10px] font-semibold uppercase text-zinc-500">
                    <Users className="h-3 w-3" /> Travelers
                  </p>
                  <p className="mt-1 font-semibold tabular-nums">{selected.pax ?? 1}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-3">
                  <p className="flex items-center gap-1 text-[10px] font-semibold uppercase text-zinc-500">
                    <CreditCard className="h-3 w-3" /> Amount
                  </p>
                  <p className="mt-1 font-semibold tabular-nums">
                    {selected.amount != null ? formatINR(Number(selected.amount)) : "—"}
                  </p>
                  {selected.discount_percent > 0 && (
                    <p className="mt-0.5 text-[11px] text-emerald-600">
                      {selected.discount_percent}% discount applied
                    </p>
                  )}
                </div>
              </div>

              {selected.departure_date && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  Departure: {formatDateTime(selected.departure_date)}
                </div>
              )}

              <div className="rounded-xl border border-dashed border-zinc-200 p-3 text-xs text-zinc-600">
                <p>
                  <span className="font-medium text-zinc-800">Order ID:</span>{" "}
                  {selected.razorpay_order_id || "—"}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-zinc-800">Payment ID:</span>{" "}
                  {selected.razorpay_payment_id || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
