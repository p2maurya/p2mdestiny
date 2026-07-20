"use client";

import { useState } from "react";
import { Phone, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export default function ContactPanel({
  propertyId,
  title,
  ownerName,
  ownerPhone,
}: {
  propertyId: string;
  title: string;
  ownerName?: string | null;
  ownerPhone?: string | null;
}) {
  const [message, setMessage] = useState(`Hi, I'm interested in "${title}". Is it still available?`);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const whatsappMsg = encodeURIComponent(message);

  async function submitInquiry(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, message }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Please sign in to send a message to the owner.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-mist">Listed by</p>
      <p className="mt-1 font-display text-lg font-semibold text-ink">{ownerName ?? "Property owner"}</p>

      <div className="mt-4 flex gap-2">
        <a
          href={`tel:${ownerPhone ?? ""}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-semibold text-sand hover:bg-ink-soft"
        >
          <Phone size={16} /> Call
        </a>
        <a
          href={`https://wa.me/${ownerPhone ?? ""}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal py-3 text-sm font-semibold text-white hover:bg-teal/90"
        >
          <MessageCircle size={16} /> WhatsApp
        </a>
      </div>

      <form onSubmit={submitInquiry} className="mt-5">
        <label className="text-xs font-semibold text-mist">Send a message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-line bg-sand px-3 py-2 text-sm outline-none focus:border-ember"
        />
        {sent ? (
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-teal">
            <CheckCircle2 size={16} /> Message sent to the owner.
          </p>
        ) : (
          <button
            disabled={sending}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-ink py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-sand disabled:opacity-50"
          >
            <Send size={14} /> {sending ? "Sending..." : "Send message"}
          </button>
        )}
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </form>
    </div>
  );
}
