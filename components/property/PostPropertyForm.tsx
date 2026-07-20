"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud, X, Loader2, Check, Video } from "lucide-react";

type FormData = {
  title: string;
  description: string;
  type: "RENT" | "SALE";
  category: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  address: string;
  city: string;
  state: string;
  latitude: string;
  longitude: string;
};

const categories = ["Flat", "House", "Villa", "Plot", "Commercial", "PG"];
const steps = ["Basics", "Location", "Media", "Review"];

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PostPropertyForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    type: "RENT",
    category: "Flat",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    address: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const base64 = await fileToBase64(file);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64, type: "image" }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setImages((prev) => [...prev, data.url]);
      }
    } catch {
      setError("Image upload failed. Please sign in and try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleVideoUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64, type: "video" }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setVideo(data.url);
    } catch {
      setError("Video upload failed. Please sign in and try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          bedrooms: form.bedrooms || null,
          bathrooms: form.bathrooms || null,
          latitude: form.latitude || null,
          longitude: form.longitude || null,
          images,
          videoUrl: video,
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
      setTimeout(() => router.push("/dashboard/my-listings"), 1800);
    } catch {
      setError("Couldn't publish listing. Please sign in and check all required fields.");
    } finally {
      setSubmitting(false);
    }
  }

  const canNext =
    step === 0
      ? form.title && form.description && form.price && form.category && form.area
      : step === 1
      ? form.address && form.city && form.state
      : true;

  if (done) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-2xl border border-line bg-paper p-10 text-center">
        <Check className="text-teal" size={36} />
        <p className="font-display text-xl font-semibold text-ink">Listing submitted!</p>
        <p className="text-sm text-mist">It&apos;ll go live after a quick review. Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                i <= step ? "bg-ember text-ink" : "bg-line text-mist"
              }`}
            >
              {i + 1}
            </div>
            <span className={`hidden text-xs font-medium sm:block ${i <= step ? "text-ink" : "text-mist"}`}>
              {s}
            </span>
            {i < steps.length - 1 && <div className="h-px flex-1 bg-line" />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-paper p-6">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-mist">Title</label>
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Sunlit 3BHK with terrace garden"
                className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-mist">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                placeholder="Describe the property, amenities, nearby landmarks..."
                className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm outline-none focus:border-ember"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-mist">Deal type</label>
                <select
                  value={form.type}
                  onChange={(e) => update("type", e.target.value as "RENT" | "SALE")}
                  className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm"
                >
                  <option value="RENT">Rent</option>
                  <option value="SALE">Sale</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-mist">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-mist">Price (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-mist">Area (sqft)</label>
                <input
                  type="number"
                  value={form.area}
                  onChange={(e) => update("area", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-mist">Bedrooms</label>
                <input
                  type="number"
                  value={form.bedrooms}
                  onChange={(e) => update("bedrooms", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-mist">Bathrooms</label>
                <input
                  type="number"
                  value={form.bathrooms}
                  onChange={(e) => update("bathrooms", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-mist">Address</label>
              <input
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-mist">City</label>
                <input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-mist">State</label>
                <input
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-mist">Latitude (optional)</label>
                <input
                  value={form.latitude}
                  onChange={(e) => update("latitude", e.target.value)}
                  placeholder="26.8467"
                  className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm placeholder:text-mist"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-mist">Longitude (optional)</label>
                <input
                  value={form.longitude}
                  onChange={(e) => update("longitude", e.target.value)}
                  placeholder="80.9462"
                  className="mt-1 w-full rounded-lg border border-line bg-sand px-3 py-2 text-sm placeholder:text-mist"
                />
              </div>
            </div>
            <p className="text-xs text-mist">
              Tip: search the address on Google Maps, right-click the pin, and copy the lat/lng shown.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-mist">Photos</label>
              <label className="mt-1 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line bg-sand py-8 text-center hover:border-ember">
                <UploadCloud size={24} className="text-mist" />
                <span className="text-sm text-charcoal/70">Click to upload photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
              </label>

              {images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg">
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                      <button
                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute right-1 top-1 rounded-full bg-ink/70 p-0.5 text-sand"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-mist">Walkthrough video (optional)</label>
              {video ? (
                <div className="mt-1 flex items-center justify-between rounded-lg border border-line bg-sand px-3 py-2 text-sm">
                  <span className="flex items-center gap-2"><Video size={16} /> Video uploaded</span>
                  <button onClick={() => setVideo(null)}><X size={14} /></button>
                </div>
              ) : (
                <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-sand py-5 text-sm text-charcoal/70 hover:border-ember">
                  <Video size={18} /> Upload a short video
                  <input
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={(e) => handleVideoUpload(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
            </div>

            {uploading && (
              <p className="flex items-center gap-2 text-xs text-mist">
                <Loader2 size={14} className="animate-spin" /> Uploading...
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 text-sm">
            <p className="font-display text-lg font-semibold text-ink">{form.title || "Untitled property"}</p>
            <p className="text-mist">{form.city}, {form.state} • {form.category} • {form.type}</p>
            <p className="font-mono-num font-semibold text-ember-deep">₹{form.price || "0"}</p>
            <p className="text-charcoal/70">{images.length} photo(s){video ? " · 1 video" : ""}</p>
            <p className="text-xs text-mist">Your listing will be reviewed before it goes live.</p>
          </div>
        )}

        {error && <p className="mt-4 text-xs text-red-600">{error}</p>}

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-charcoal/70 disabled:opacity-40"
          >
            Back
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              disabled={!canNext}
              className="rounded-xl bg-ink px-6 py-2.5 text-sm font-semibold text-sand disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-ember px-6 py-2.5 text-sm font-semibold text-ink hover:bg-ember-deep disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Publish listing"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
