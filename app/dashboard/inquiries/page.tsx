"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageSquare, Phone, MessageCircle } from "lucide-react";

type InquiryItem = {
  id: string;
  message: string;
  createdAt: string;
  property: { title: string };
  user: { name: string; phone: string | null };
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inquiries")
      .then((res) => res.json())
      .then((data) => setInquiries(data.inquiries ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-mist">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line py-16 text-center text-mist">
        <MessageSquare className="mx-auto mb-2" size={22} />
        No inquiries yet. They&apos;ll show up here when someone messages about your listings.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold text-ink">Inquiries</h1>

      {inquiries.map((inq) => (
        <div key={inq.id} className="rounded-2xl border border-line bg-paper p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">{inq.property.title}</p>
            <span className="text-xs text-mist">{new Date(inq.createdAt).toLocaleDateString("en-IN")}</span>
          </div>
          <p className="mt-1 text-xs text-mist">From {inq.user.name}</p>
          <p className="mt-2 text-sm text-charcoal/80">{inq.message}</p>

          {inq.user.phone && (
            <div className="mt-3 flex gap-2">
              <a
                href={`tel:${inq.user.phone}`}
                className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-sand"
              >
                <Phone size={12} /> Call back
              </a>
              <a
                href={`https://wa.me/${inq.user.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-teal px-3 py-1.5 text-xs font-semibold text-white"
              >
                <MessageCircle size={12} /> WhatsApp
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
