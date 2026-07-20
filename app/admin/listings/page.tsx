"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Check, X } from "lucide-react";

type AdminProperty = {
  id: string;
  title: string;
  city: string;
  price: number;
  type: "RENT" | "SALE";
  status: "PENDING" | "APPROVED" | "REJECTED";
  images: string[];
  owner: { name: string; email: string };
};

const tabs = ["PENDING", "APPROVED", "REJECTED"] as const;

export default function AdminListingsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("PENDING");
  const [listings, setListings] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-tab-change pattern
    setLoading(true);
    fetch(`/api/admin/listings?status=${tab}`)
      .then((res) => res.json())
      .then((data) => setListings(data.properties ?? []))
      .finally(() => setLoading(false));
  }, [tab]);

  async function updateStatus(id: string, status: "APPROVED" | "REJECTED") {
    await fetch(`/api/admin/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setListings((l) => l.filter((p) => p.id !== id));
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <h1 className="font-display text-3xl font-semibold text-ink">Manage listings</h1>

      <div className="mt-5 flex gap-2 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-2 text-sm font-semibold ${
              tab === t ? "border-ember text-ink" : "border-transparent text-mist"
            }`}
          >
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-mist">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : listings.length === 0 ? (
        <p className="py-16 text-center text-mist">Nothing here.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {listings.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-4">
              <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-ink-soft">
                {p.images[0] && <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="80px" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{p.title}</p>
                <p className="text-xs text-mist">{p.city} · ₹{p.price.toLocaleString("en-IN")} · by {p.owner.name}</p>
              </div>
              {tab === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(p.id, "APPROVED")}
                    className="flex items-center gap-1.5 rounded-lg bg-teal px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    onClick={() => updateStatus(p.id, "REJECTED")}
                    className="flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
