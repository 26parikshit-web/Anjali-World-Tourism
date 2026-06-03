import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/stat-card";
import { Map, Star, Image, MessageSquare, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: tripsCount },
    { count: reviewsCount },
    { count: galleryCount },
    { count: contactsCount },
    { count: newContactsCount },
  ] = await Promise.all([
    supabase.from("trips").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("gallery").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
  ]);

  const { data: recentContacts } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Welcome to the admin panel. Here&apos;s an overview of your data.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Trips"
          value={tripsCount || 0}
          description="Active packages"
          icon={Map}
        />
        <StatCard
          title="Reviews"
          value={reviewsCount || 0}
          description="Customer testimonials"
          icon={Star}
        />
        <StatCard
          title="Gallery Images"
          value={galleryCount || 0}
          description="Photos uploaded"
          icon={Image}
        />
        <StatCard
          title="Contact Inquiries"
          value={contactsCount || 0}
          description={`${newContactsCount || 0} new`}
          icon={MessageSquare}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-zinc-900">Recent Inquiries</h2>
            <Link
              href="/admin/contacts"
              className="text-xs text-zinc-500 hover:text-zinc-700"
            >
              View all →
            </Link>
          </div>
          {recentContacts && recentContacts.length > 0 ? (
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50"
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-600">
                    {contact.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {contact.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{contact.email}</p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                      contact.status === "new"
                        ? "bg-amber-100 text-amber-700"
                        : contact.status === "contacted"
                        ? "bg-blue-100 text-blue-700"
                        : contact.status === "converted"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {contact.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 py-4 text-center">
              No inquiries yet
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h2 className="text-base font-semibold text-zinc-900 mb-4">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/admin/trips/new"
              className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition"
            >
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Map className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">Add New Trip</p>
                <p className="text-xs text-zinc-500">Create a package</p>
              </div>
            </Link>
            <Link
              href="/admin/reviews"
              className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition"
            >
              <div className="p-2 bg-amber-100 rounded-lg">
                <Star className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">Add Review</p>
                <p className="text-xs text-zinc-500">Customer testimonial</p>
              </div>
            </Link>
            <Link
              href="/admin/gallery"
              className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Image className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">Upload Photos</p>
                <p className="text-xs text-zinc-500">Add to gallery</p>
              </div>
            </Link>
            <Link
              href="/admin/contacts"
              className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">View Inquiries</p>
                <p className="text-xs text-zinc-500">Manage contacts</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
