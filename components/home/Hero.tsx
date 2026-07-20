"use client";

import { useEffect, useRef, useState } from "react";
import { Search, MapPin } from "lucide-react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [city, setCity] = useState("");
  const [dealType, setDealType] = useState<"RENT" | "SALE">("RENT");

  useEffect(() => {
    function onScroll() {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setOffset(Math.max(0, -rect.top));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ type: dealType });
    if (city) params.set("city", city);
    window.location.href = `/properties?${params.toString()}`;
  }

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[88vh] flex-col justify-end bg-ink pt-24"
    >
      {/* Signature: layered parallax skyline evoking a living city + horizon glow */}
      <div className="skyline" aria-hidden="true">
        <div className="skyline-glow" />
        <svg
          className="skyline-layer opacity-40"
          style={{ transform: `translateX(${-offset * 0.05}px)` }}
          viewBox="0 0 1600 300"
          preserveAspectRatio="none"
        >
          <rect x="40" y="120" width="90" height="180" fill="#232a4d" />
          <rect x="160" y="60" width="70" height="240" fill="#232a4d" />
          <rect x="260" y="150" width="110" height="150" fill="#232a4d" />
          <rect x="410" y="90" width="80" height="210" fill="#232a4d" />
          <rect x="540" y="170" width="130" height="130" fill="#232a4d" />
          <rect x="720" y="40" width="60" height="260" fill="#232a4d" />
          <rect x="830" y="130" width="100" height="170" fill="#232a4d" />
          <rect x="980" y="80" width="90" height="220" fill="#232a4d" />
          <rect x="1120" y="160" width="120" height="140" fill="#232a4d" />
          <rect x="1290" y="100" width="75" height="200" fill="#232a4d" />
          <rect x="1420" y="150" width="100" height="150" fill="#232a4d" />
        </svg>
        <svg
          className="skyline-layer"
          style={{ transform: `translateX(${-offset * 0.12}px)` }}
          viewBox="0 0 1600 220"
          preserveAspectRatio="none"
        >
          <rect x="0" y="90" width="60" height="130" fill="#171c37" />
          <rect x="90" y="40" width="100" height="180" fill="#171c37" />
          <rect x="220" y="110" width="80" height="110" fill="#171c37" />
          <rect x="330" y="20" width="70" height="200" fill="#171c37" />
          <rect x="430" y="80" width="120" height="140" fill="#171c37" />
          <rect x="590" y="130" width="90" height="90" fill="#171c37" />
          <rect x="710" y="50" width="80" height="170" fill="#171c37" />
          <rect x="820" y="100" width="140" height="120" fill="#171c37" />
          <rect x="1000" y="30" width="70" height="190" fill="#171c37" />
          <rect x="1110" y="90" width="100" height="130" fill="#171c37" />
          <rect x="1250" y="60" width="80" height="160" fill="#171c37" />
          <rect x="1370" y="120" width="130" height="100" fill="#171c37" />
          <rect x="1540" y="70" width="60" height="150" fill="#171c37" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-28 text-center md:px-8">
        <p className="font-mono-num text-xs uppercase tracking-[0.3em] text-ember">
          Verified listings, real people
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-sand md:text-6xl">
          Find a home that feels like the view you imagined.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sand/70">
          Browse thousands of homes to rent or buy across India — real photos, honest pricing, direct contact.
        </p>
      </div>

      {/* Floating search card, overlapping hero edge */}
      <form
        onSubmit={handleSearch}
        className="relative z-10 mx-auto mb-[-2.5rem] flex w-[92%] max-w-3xl flex-col gap-3 rounded-2xl border border-line bg-paper p-3 shadow-xl md:flex-row md:items-center md:gap-2 md:p-2"
      >
        <div className="flex overflow-hidden rounded-xl border border-line">
          {(["RENT", "SALE"] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setDealType(t)}
              className={`px-4 py-2.5 text-sm font-semibold transition ${
                dealType === t ? "bg-ink text-sand" : "bg-transparent text-charcoal/60"
              }`}
            >
              {t === "RENT" ? "Rent" : "Buy"}
            </button>
          ))}
        </div>

        <div className="flex flex-1 items-center gap-2 rounded-xl border border-line px-3 py-2.5">
          <MapPin size={16} className="text-mist" />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City, locality..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-mist"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-ember px-6 py-2.5 text-sm font-semibold text-ink transition hover:bg-ember-deep"
        >
          <Search size={16} /> Search
        </button>
      </form>
    </section>
  );
}