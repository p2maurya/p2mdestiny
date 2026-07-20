"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PropertyCard, { PropertyCardData } from "@/components/property/PropertyCard";
import PropertyFilters, { Filters } from "@/components/property/PropertyFilters";
import { Loader2, SearchX } from "lucide-react";

export default function PropertiesPageContent()  {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<Filters>({
    type: (searchParams.get("type") as Filters["type"]) ?? "",
    city: searchParams.get("city") ?? "",
    category: searchParams.get("category") ?? "",
    bedrooms: searchParams.get("bedrooms") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
  });

  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    try {
      const res = await fetch(`/api/properties?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const mapped: PropertyCardData[] = data.properties.map(
        (p: {
          id: string; title: string; price: number; type: "RENT" | "SALE"; city: string;
          state: string; bedrooms: number | null; bathrooms: number | null; area: number;
          images: string[]; ratingAvg: number; views: number; isVerified: boolean;
          owner: { phone: string | null };
        }) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          type: p.type,
          city: p.city,
          state: p.state,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          area: p.area,
          images: p.images,
          ratingAvg: p.ratingAvg,
          views: p.views,
          isVerified: p.isVerified,
          ownerPhone: p.owner?.phone,
        })
      );
      setProperties(mapped);
      setTotal(data.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-filter-change pattern
    void fetchProperties();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.replace(`/properties?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <h1 className="font-display text-3xl font-semibold text-ink">
        {filters.type === "RENT" ? "Homes for rent" : filters.type === "SALE" ? "Homes for sale" : "All properties"}
      </h1>
      <p className="mt-1 text-sm text-mist">{loading ? "Searching..." : `${total} properties found`}</p>

      <div className="mt-6">
        <PropertyFilters filters={filters} onChange={setFilters} />
      </div>

      {loading && (
        <div className="flex justify-center py-20 text-mist">
          <Loader2 className="animate-spin" size={28} />
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center gap-2 py-20 text-center text-mist">
          <SearchX size={28} />
          <p>Couldn&apos;t load listings right now. Try again in a moment.</p>
        </div>
      )}

      {!loading && !error && properties.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-20 text-center text-mist">
          <SearchX size={28} />
          <p>No properties match these filters. Try widening your search.</p>
        </div>
      )}

      {!loading && !error && properties.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
