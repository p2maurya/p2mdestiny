"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Users, Home, MessageSquare, Clock, ArrowRight } from "lucide-react";

type Counts = { status: string; _count: number };

export default function AdminOverviewPage() {
  const [counts, setCounts] = useState<Counts[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/listings")
      .then((res) => res.json())
      .then((data) => {
        setCounts(data.counts ?? []);
        setUserCount(data.userCount ?? 0);
        setInquiryCount(data.inquiryCount ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);

  const pending = counts.find((c) => c.status === "PENDING")?._count ?? 0;
  const approved = counts.find((c) => c.status === "APPROVED")?._count ?? 0;

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-mist">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <h1 className="font-display text-3xl font-semibold text-ink">Admin overview</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <Clock className="text-ember-deep" size={20} />
          <p className="mt-2 text-2xl font-bold text-ink">{pending}</p>
          <p className="text-xs text-mist">Pending review</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-5">
          <Home className="text-teal" size={20} />
          <p className="mt-2 text-2xl font-bold text-ink">{approved}</p>
          <p className="text-xs text-mist">Live listings</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-5">
          <Users className="text-ink" size={20} />
          <p className="mt-2 text-2xl font-bold text-ink">{userCount}</p>
          <p className="text-xs text-mist">Registered users</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-5">
          <MessageSquare className="text-ink" size={20} />
          <p className="mt-2 text-2xl font-bold text-ink">{inquiryCount}</p>
          <p className="text-xs text-mist">Total inquiries</p>
        </div>
      </div>

      <Link
        href="/admin/listings"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-sand hover:bg-ink-soft"
      >
        Review listings <ArrowRight size={16} />
      </Link>
    </div>
  );
}
