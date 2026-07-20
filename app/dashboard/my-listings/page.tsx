"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Star, Trash2, Loader2 } from "lucide-react";

type MyProperty = {
  id: string;
  title: string;
  price: number;
  type: "RENT" | "SALE";
  status: "PENDING" | "APPROVED" | "REJECTED";
  city: string;
  images: string[];
  views: number;
  ratingAvg: number;
};

const statusStyle: Record<MyProperty["status"], string> = {
  PENDING: "bg-ember/20 text-ember-deep",
  APPROVED: "bg-teal-soft text-teal",
  REJECTED: "bg-red-100 text-red-700",
};

export default function MyListingsPage() {
  const [listings, setListings] = useState<MyProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/properties/mine")
      .then((res) => res.json())
      .then((data) => setListings(data.properties ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this listing? This can't be undone.")) return;
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    setListings((l) => l.filter((p) => p.id !== id));
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-mist">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line py-16 text-center">
        <p className="text-mist">You haven&apos;t listed anything yet.</p>
        <Link href="/post-property" className="mt-3 inline-block font-semibold text-ember-deep">
          Post your first property →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold text-ink">My listings</h1>

      {listings.map((p) => (
        <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-4">
          <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-ink-soft">
            {p.images[0] && <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="80px" />}
          </div>

          <div className="min-w-0 flex-1">
            <Link href={`/properties/${p.id}`} className="truncate font-semibold text-ink hover:text-ember-deep">
              {p.title}
            </Link>
            <p className="text-xs text-mist">{p.city} · {p.type === "RENT" ? "Rent" : "Sale"} · ₹{p.price.toLocaleString("en-IN")}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-mist">
              <span className="flex items-center gap-1"><Eye size={12} /> {p.views}</span>
              <span className="flex items-center gap-1"><Star size={12} className="fill-ember text-ember" /> {p.ratingAvg.toFixed(1)}</span>
            </div>
          </div>

          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[p.status]}`}>
            {p.status === "PENDING" ? "Under review" : p.status === "APPROVED" ? "Live" : "Rejected"}
          </span>

          <button
            onClick={() => handleDelete(p.id)}
            aria-label="Delete listing"
            className="rounded-lg border border-line p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
