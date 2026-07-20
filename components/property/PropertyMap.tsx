export default function PropertyMap({
  latitude,
  longitude,
  address,
}: {
  latitude?: number | null;
  longitude?: number | null;
  address: string;
}) {
  const query = latitude && longitude ? `${latitude},${longitude}` : encodeURIComponent(address);

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <iframe
        title="Property location"
        src={`https://www.google.com/maps?q=${query}&z=15&output=embed`}
        className="h-72 w-full"
        loading="lazy"
      />
    </div>
  );
}
