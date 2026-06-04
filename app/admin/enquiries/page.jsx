"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Mail, Phone, MapPin, Users, Calendar, DollarSign, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    const client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    setSupabase(client);
  }, []);

  const fetchEnquiries = async () => {
    if (!supabase) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching enquiries:", error);
        return;
      }

      setEnquiries(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supabase) {
      fetchEnquiries();
    }
  }, [filter, supabase]);

  const updateStatus = async (id, newStatus) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from("enquiries")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        console.error("Error updating status:", error);
        return;
      }

      // Refresh the list
      fetchEnquiries();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "contacted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "converted":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Travel Enquiries</h1>
          <p className="text-zinc-600">Manage and track customer enquiries</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-zinc-500" />
              <span className="text-sm font-medium text-zinc-700">Filter:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {["all", "new", "contacted", "converted", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === status
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <Button
              onClick={fetchEnquiries}
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4">
            <div className="text-2xl font-bold text-zinc-900">{enquiries.length}</div>
            <div className="text-sm text-zinc-600">Total Enquiries</div>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="text-2xl font-bold text-blue-900">
              {enquiries.filter((e) => e.status === "new").length}
            </div>
            <div className="text-sm text-blue-700">New</div>
          </div>
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <div className="text-2xl font-bold text-yellow-900">
              {enquiries.filter((e) => e.status === "contacted").length}
            </div>
            <div className="text-sm text-yellow-700">Contacted</div>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <div className="text-2xl font-bold text-green-900">
              {enquiries.filter((e) => e.status === "converted").length}
            </div>
            <div className="text-sm text-green-700">Converted</div>
          </div>
        </div>

        {/* Enquiries List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-zinc-300 border-t-zinc-900"></div>
            <p className="mt-4 text-zinc-600">Loading enquiries...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-12 text-center">
            <div className="text-zinc-400 mb-2">📭</div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">No enquiries yet</h3>
            <p className="text-zinc-600">New enquiries will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 hover:shadow-md transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                      {enquiry.name}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      {formatDate(enquiry.created_at)}
                    </p>
                  </div>
                  
                  <select
                    value={enquiry.status}
                    onChange={(e) => updateStatus(enquiry.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(
                      enquiry.status
                    )}`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <a
                      href={`mailto:${enquiry.email}`}
                      className="text-zinc-700 hover:text-zinc-900 hover:underline"
                    >
                      {enquiry.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    <a
                      href={`tel:${enquiry.phone}`}
                      className="text-zinc-700 hover:text-zinc-900 hover:underline"
                    >
                      {enquiry.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-700 font-medium">{enquiry.place}</span>
                  </div>

                  {enquiry.passengers && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-zinc-400" />
                      <span className="text-zinc-700">
                        {enquiry.passengers} {enquiry.passengers === 1 ? "person" : "people"}
                      </span>
                    </div>
                  )}

                  {enquiry.duration && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      <span className="text-zinc-700">{enquiry.duration}</span>
                    </div>
                  )}

                  {enquiry.budget && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-zinc-400" />
                      <span className="text-zinc-700">{enquiry.budget}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
