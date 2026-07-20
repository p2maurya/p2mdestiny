"use client";

import { useEffect, useState } from "react";
import PropertyCard, { PropertyCardData } from "@/components/property/PropertyCard";
import { Loader2, HeartOff } from "lucide-react";

type WishlistItem = {
  property: {
    id: string; title: string; price: number; type: "RENT" | "SALE"; city: string; state: string;
    bedrooms: number | null; bathrooms: number | null; area: number; images: string[];
    ratingAvg: number; views: number; isVerified: boolean;
  };
};

export default function WishlistPage() {
  const [items, setItems] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        const mapped: PropertyCardData[] = (data.wishlist ?? []).map((w: WishlistItem) => ({
          ...w.property,
        }));
        setItems(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-mist">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line py-16 text-center text-mist">
        <HeartOff className="mx-auto mb-2" size={22} />
        Nothing saved yet. Tap the heart icon on a listing to save it here.
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Wishlist</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}
