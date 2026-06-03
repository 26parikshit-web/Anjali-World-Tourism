import { TripForm } from "@/components/admin/trip-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewTripPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/trips"
          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Add New Trip</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Create a new travel package
          </p>
        </div>
      </div>

      <TripForm />
    </div>
  );
}
