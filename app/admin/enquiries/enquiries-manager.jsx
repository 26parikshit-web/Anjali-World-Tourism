"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  IndianRupee,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/admin/stat-card";
import { showError } from "@/lib/toast";

const STATUS_STYLES = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  contacted: "bg-amber-100 text-amber-800 border-amber-200",
  converted: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EnquiriesManager({ initialEnquiries = [] }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const supabase = createClient();

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      let query = supabase.from("enquiries").select("id, created_at, name, phone, trip_name, travel_date, travelers, details, status, source").order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setEnquiries(data || []);
    } catch (err) {
      showError(err.message || "Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter === "all" && initialEnquiries.length > 0) {
      setEnquiries(initialEnquiries);
      return;
    }
    fetchEnquiries();
  }, [filter]);

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from("enquiries")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      fetchEnquiries();
    } catch (err) {
      showError(err.message || "Failed to update enquiry status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="admin-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-medium text-zinc-700">Filter</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {["all", "new", "contacted", "converted", "cancelled"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === status
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <Button onClick={fetchEnquiries} variant="outline" size="sm" className="ml-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={enquiries.length} description="All enquiries" icon={Mail} />
        <StatCard
          title="New"
          value={enquiries.filter((e) => e.status === "new").length}
          icon={Mail}
        />
        <StatCard
          title="Contacted"
          value={enquiries.filter((e) => e.status === "contacted").length}
          icon={Phone}
        />
        <StatCard
          title="Converted"
          value={enquiries.filter((e) => e.status === "converted").length}
          icon={Users}
        />
      </div>

      {loading ? (
        <div className="admin-card py-12 text-center">
          <div className="mx-auto inline-block h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900" />
          <p className="mt-4 text-sm text-zinc-600">Loading enquiries...</p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="admin-card py-12 text-center">
          <h3 className="text-lg font-semibold text-zinc-900">No enquiries yet</h3>
          <p className="mt-2 text-sm text-zinc-600">New enquiries will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enquiry) => (
            <div key={enquiry.id} className="admin-card p-6 transition hover:shadow-md">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">{enquiry.name}</h3>
                  <p className="text-sm text-zinc-500">{formatDate(enquiry.created_at)}</p>
                </div>

                <select
                  value={enquiry.status}
                  onChange={(e) => updateStatus(enquiry.id, e.target.value)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                    STATUS_STYLES[enquiry.status] || "bg-zinc-100 text-zinc-800 border-zinc-200"
                  }`}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  <a href={`mailto:${enquiry.email}`} className="text-zinc-700 hover:underline">
                    {enquiry.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-zinc-400" />
                  <a href={`tel:${enquiry.phone}`} className="text-zinc-700 hover:underline">
                    {enquiry.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-zinc-400" />
                  <span className="font-medium text-zinc-700">{enquiry.place}</span>
                </div>
                {enquiry.passengers && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-700">
                      {enquiry.passengers} {enquiry.passengers === 1 ? "person" : "people"}
                    </span>
                  </div>
                )}
                {enquiry.duration && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-700">{enquiry.duration}</span>
                  </div>
                )}
                {enquiry.budget && (
                  <div className="flex items-center gap-2 text-sm">
                    <IndianRupee className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-700">{enquiry.budget}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
