"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Share2,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  BadgeCheck,
} from "lucide-react";

export type PropertyCardData = {
  id: string;
  title: string;
  price: number;
  type: "RENT" | "SALE";
  city: string;
  state: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area: number;
  images: string[];
  ratingAvg: number;
  views: number;
  isVerified: boolean;
  ownerPhone?: string | null;
};

function formatPrice(price: number, type: "RENT" | "SALE") {
  const formatted =
    price >= 10000000
      ? `₹${(price / 10000000).toFixed(2)} Cr`
      : price >= 100000
      ? `₹${(price / 100000).toFixed(1)} L`
      : `₹${price.toLocaleString("en-IN")}`;
  return type === "RENT" ? `${formatted}/mo` : formatted;
}

export default function PropertyCard({ property }: { property: PropertyCardData }) {
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const images = property.images.length ? property.images : ["/placeholder-property.jpg"];

  function next(e: React.MouseEvent) {
    e.preventDefault();
    setIndex((i) => (i + 1) % images.length);
  }
  function prev(e: React.MouseEvent) {
    e.preventDefault();
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    const url = `${window.location.origin}/properties/${property.id}`;
    if (navigator.share) {
      await navigator.share({ title: property.title, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  }

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in "${property.title}" listed on P2mdestiny.`
  );

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-paper shadow-sm transition hover:shadow-lg">
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-soft">
          <Image
            src={images[index]}
            alt={property.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 340px"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-ink/50 p-1.5 text-sand opacity-0 transition group-hover:opacity-100"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-ink/50 p-1.5 text-sand opacity-0 transition group-hover:opacity-100"
              >
                <ChevronRight size={16} />
              </button>
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-4 bg-ember" : "w-1.5 bg-sand/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute left-3 top-3 flex gap-2">
            <span className="rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-sand">
              {property.type === "RENT" ? "For Rent" : "For Sale"}
            </span>
            {property.isVerified && (
              <span className="flex items-center gap-1 rounded-full bg-teal px-2.5 py-1 text-xs font-semibold text-white">
                <BadgeCheck size={12} /> Verified
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              setSaved((s) => !s);
            }}
            aria-label="Save to wishlist"
            className="absolute right-3 top-3 rounded-full bg-ink/50 p-2 text-sand transition hover:bg-ink/70"
          >
            <Heart size={16} className={saved ? "fill-ember text-ember" : ""} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold leading-tight text-ink">
              {property.title}
            </h3>
          </div>
          <p className="mt-1 text-sm text-mist">
            {property.city}, {property.state}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <p className="font-mono-num text-lg font-bold text-ember-deep">
              {formatPrice(property.price, property.type)}
            </p>
            <div className="flex items-center gap-1 text-sm text-charcoal/70">
              <Star size={14} className="fill-ember text-ember" />
              {property.ratingAvg.toFixed(1)}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs text-mist">
            {property.bedrooms != null && <span>{property.bedrooms} Bed</span>}
            {property.bathrooms != null && <span>{property.bathrooms} Bath</span>}
            <span>{property.area} sqft</span>
            <span className="ml-auto flex items-center gap-1">
              <Eye size={12} /> {property.views}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2 border-t border-line px-4 py-3">
        <a
          href={`tel:${property.ownerPhone ?? ""}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink py-2 text-xs font-semibold text-sand transition hover:bg-ink-soft"
        >
          <Phone size={14} /> Call
        </a>
        <a
          href={`https://wa.me/${property.ownerPhone ?? ""}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-teal py-2 text-xs font-semibold text-white transition hover:bg-teal/90"
        >
          <MessageCircle size={14} /> WhatsApp
        </a>
        <button
          onClick={handleShare}
          aria-label="Share property"
          className="rounded-lg border border-line p-2 text-charcoal/70 transition hover:bg-sand"
        >
          <Share2 size={14} />
        </button>
      </div>
    </div>
  );
}
