"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export type Filters = {
  type: "RENT" | "SALE" | "";
  city: string;
  category: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
};

const categories = ["Flat", "House", "Villa", "Plot", "Commercial", "PG"];

export default function PropertyFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const [open, setOpen] = useState(false);

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value });
  }

  function reset() {
    onChange({ type: "", city: "", category: "", bedrooms: "", minPrice: "", maxPrice: "" });
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-4 md:p-5">
      <div className="flex items-center justify-between md:hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-sm font-semibold text-ink"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
        {open && (
          <button onClick={() => setOpen(false)} aria-label="Close filters">
            <X size={18} />
          </button>
        )}
      </div>

      <div className={`${open ? "grid" : "hidden"} mt-4 gap-4 md:mt-0 md:grid md:grid-cols-2 lg:grid-cols-6 lg:items-end`}>
        <div className="lg:col-span-1">
          <label className="text-xs font-semibold text-mist">Deal</label>
          <select
            value={filters.type}
            onChange={(e) => update("type", e.target.value as Filters["type"])}
            className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm"
          >
            <option value="">Any</option>
            <option value="RENT">Rent</option>
            <option value="SALE">Buy</option>
          </select>
        </div>

        <div className="lg:col-span-1">
          <label className="text-xs font-semibold text-mist">City</label>
          <input
            value={filters.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="Any city"
            className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm placeholder:text-mist"
          />
        </div>

        <div className="lg:col-span-1">
          <label className="text-xs font-semibold text-mist">Type</label>
          <select
            value={filters.category}
            onChange={(e) => update("category", e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm"
          >
            <option value="">Any</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-1">
          <label className="text-xs font-semibold text-mist">Bedrooms</label>
          <select
            value={filters.bedrooms}
            onChange={(e) => update("bedrooms", e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}+ BHK</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-1">
          <label className="text-xs font-semibold text-mist">Min price</label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            placeholder="0"
            className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm placeholder:text-mist"
          />
        </div>

        <div className="lg:col-span-1 flex items-end gap-2">
          <div className="flex-1">
            <label className="text-xs font-semibold text-mist">Max price</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => update("maxPrice", e.target.value)}
              placeholder="Any"
              className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm placeholder:text-mist"
            />
          </div>
          <button
            onClick={reset}
            className="mt-1 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-charcoal/70 hover:bg-sand"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
