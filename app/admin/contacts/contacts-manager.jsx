"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/admin/data-table";
import { X, Mail, Phone, MessageSquare, Calendar, Trash2 } from "lucide-react";

const statusOptions = [
  { value: "new", label: "New", color: "bg-amber-100 text-amber-700" },
  { value: "contacted", label: "Contacted", color: "bg-blue-100 text-blue-700" },
  { value: "converted", label: "Converted", color: "bg-emerald-100 text-emerald-700" },
  { value: "closed", label: "Closed", color: "bg-zinc-100 text-zinc-600" },
];

export function ContactsManager({ contacts }) {
  const router = useRouter();
  const supabase = createClient();
  const [selectedContact, setSelectedContact] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status: newStatus })
      .eq("id", id);
    
    if (error) {
      alert("Error: " + error.message);
    } else {
      router.refresh();
      if (selectedContact?.id === id) {
        setSelectedContact((prev) => ({ ...prev, status: newStatus }));
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this inquiry?")) return;
    
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);
    
    if (error) {
      alert("Error: " + error.message);
    } else {
      router.refresh();
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    }
  };

  const handleNotesUpdate = async (id, notes) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ notes })
      .eq("id", id);
    
    if (error) {
      alert("Error: " + error.message);
    }
  };

  const filteredContacts =
    filterStatus === "all"
      ? contacts
      : contacts.filter((c) => c.status === filterStatus);

  const columns = [
    {
      key: "name",
      label: "Contact",
      render: (value, row) => (
        <div>
          <p className="font-medium text-zinc-900">{value}</p>
          <p className="text-xs text-zinc-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "created_at",
      label: "Date",
      render: (value) => (
        <span className="text-xs text-zinc-500">
          {new Date(value).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value, row) => {
        const status = statusOptions.find((s) => s.value === value);
        return (
          <select
            value={value}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${status?.color}`}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      },
    },
  ];

  const actions = (row) => (
    <>
      <button
        onClick={() => setSelectedContact(row)}
        className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700"
        title="View details"
      >
        <MessageSquare className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-500 hover:text-red-600"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );

  return (
    <>
      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
            filterStatus === "all"
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          All ({contacts.length})
        </button>
        {statusOptions.map((status) => {
          const count = contacts.filter((c) => c.status === status.value).length;
          return (
            <button
              key={status.value}
              onClick={() => setFilterStatus(status.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filterStatus === status.value
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {status.label} ({count})
            </button>
          );
        })}
      </div>

      <DataTable
        columns={columns}
        data={filteredContacts}
        searchPlaceholder="Search contacts..."
        actions={actions}
      />

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-lg font-semibold text-zinc-900">
                Contact Details
              </h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 hover:bg-zinc-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-lg font-semibold text-zinc-600">
                    {selectedContact.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">
                      {selectedContact.name}
                    </p>
                    <div className="flex items-center gap-1">
                      {statusOptions.map((status) =>
                        status.value === selectedContact.status ? (
                          <span
                            key={status.value}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${status.color}`}
                          >
                            {status.label}
                          </span>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 pt-2">
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition"
                  >
                    <Mail className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-zinc-700">
                      {selectedContact.email}
                    </span>
                  </a>
                  {selectedContact.phone && (
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition"
                    >
                      <Phone className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm text-zinc-700">
                        {selectedContact.phone}
                      </span>
                    </a>
                  )}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-zinc-700">
                      {new Date(selectedContact.created_at).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedContact.message && (
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                    Message
                  </p>
                  <div className="p-4 rounded-xl bg-zinc-50 text-sm text-zinc-700 leading-relaxed">
                    {selectedContact.message}
                  </div>
                </div>
              )}

              {/* Trip Interest */}
              {selectedContact.trip_interest && (
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                    Trip Interest
                  </p>
                  <span className="text-sm bg-zinc-100 text-zinc-700 px-3 py-1.5 rounded-full">
                    {selectedContact.trip_interest}
                  </span>
                </div>
              )}

              {/* Status Update */}
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                  Update Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() =>
                        handleStatusChange(selectedContact.id, status.value)
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        selectedContact.status === status.value
                          ? status.color + " ring-2 ring-offset-2 ring-zinc-300"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                  Internal Notes
                </p>
                <textarea
                  defaultValue={selectedContact.notes || ""}
                  onBlur={(e) =>
                    handleNotesUpdate(selectedContact.id, e.target.value)
                  }
                  placeholder="Add notes about this inquiry..."
                  rows={3}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-400 focus:bg-white resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-semibold py-2.5 rounded-xl text-center transition"
                >
                  Send Email
                </a>
                <button
                  onClick={() => handleDelete(selectedContact.id)}
                  className="px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
