import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/property/ImageGallery";
import ContactPanel from "@/components/property/ContactPanel";
import ReviewsSection from "@/components/property/ReviewsSection";
import PropertyMap from "@/components/property/PropertyMap";
import { BedDouble, Bath, Ruler, MapPin, BadgeCheck } from "lucide-react";

function formatPrice(price: number, type: "RENT" | "SALE") {
  const formatted =
    price >= 10000000
      ? `₹${(price / 10000000).toFixed(2)} Cr`
      : price >= 100000
      ? `₹${(price / 100000).toFixed(1)} L`
      : `₹${price.toLocaleString("en-IN")}`;
  return type === "RENT" ? `${formatted}/month` : formatted;
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true, phone: true } },
      ratings: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!property) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <ImageGallery images={property.images} videoUrl={property.videoUrl} title={property.title} />

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-sand">
              {property.type === "RENT" ? "For Rent" : "For Sale"}
            </span>
            {property.isVerified && (
              <span className="flex items-center gap-1 rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white">
                <BadgeCheck size={12} /> Verified
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">{property.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-mist">
            <MapPin size={14} /> {property.address}, {property.city}, {property.state}
          </p>

          <p className="mt-4 font-mono-num text-2xl font-bold text-ember-deep">
            {formatPrice(property.price, property.type)}
          </p>

          <div className="mt-6 flex flex-wrap gap-6 border-y border-line py-4 text-sm text-charcoal/80">
            {property.bedrooms != null && (
              <span className="flex items-center gap-2"><BedDouble size={18} /> {property.bedrooms} Bedrooms</span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-2"><Bath size={18} /> {property.bathrooms} Bathrooms</span>
            )}
            <span className="flex items-center gap-2"><Ruler size={18} /> {property.area} sqft</span>
          </div>

          <div className="mt-6">
            <h2 className="font-display text-2xl font-semibold text-ink">About this property</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-charcoal/80">
              {property.description}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-2xl font-semibold text-ink">Location</h2>
            <div className="mt-3">
              <PropertyMap
                latitude={property.latitude}
                longitude={property.longitude}
                address={`${property.address}, ${property.city}, ${property.state}`}
              />
            </div>
          </div>

          <ReviewsSection
            propertyId={property.id}
            ratingAvg={property.ratingAvg}
            initialReviews={property.ratings}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ContactPanel
              propertyId={property.id}
              title={property.title}
              ownerName={property.owner.name}
              ownerPhone={property.owner.phone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
