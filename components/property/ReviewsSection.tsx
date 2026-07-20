"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type Review = {
  id: string;
  value: number;
  comment: string | null;
  user: { name: string };
};

export default function ReviewsSection({
  propertyId,
  ratingAvg,
  initialReviews,
}: {
  propertyId: string;
  ratingAvg: number;
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [value, setValue] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, value, comment }),
      });
      if (!res.ok) throw new Error();
      setReviews((r) => [{ id: Date.now().toString(), value, comment, user: { name: "You" } }, ...r]);
      setComment("");
    } catch {
      setError("Please sign in to leave a review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-2xl font-semibold text-ink">Reviews</h2>
        <span className="flex items-center gap-1 text-sm font-semibold text-charcoal/70">
          <Star size={16} className="fill-ember text-ember" /> {ratingAvg.toFixed(1)}
        </span>
      </div>

      <form onSubmit={submit} className="mt-4 rounded-2xl border border-line bg-paper p-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} onClick={() => setValue(n)} aria-label={`Rate ${n}`}>
              <Star size={20} className={n <= value ? "fill-ember text-ember" : "text-line"} />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={2}
          className="mt-3 w-full rounded-xl border border-line bg-sand px-3 py-2 text-sm outline-none focus:border-ember"
        />
        <button
          disabled={submitting}
          className="mt-2 rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-sand hover:bg-ink-soft disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post review"}
        </button>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </form>

      <div className="mt-4 space-y-4">
        {reviews.length === 0 && <p className="text-sm text-mist">No reviews yet. Be the first.</p>}
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-line pb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{r.user.name}</p>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < r.value ? "fill-ember text-ember" : "text-line"} />
                ))}
              </div>
            </div>
            {r.comment && <p className="mt-1 text-sm text-charcoal/70">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
