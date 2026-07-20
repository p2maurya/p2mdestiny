"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Phone, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (signInRes?.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard/my-listings");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="text-center font-display text-3xl font-semibold text-ink">Create your account</h1>
      <p className="mt-1 text-center text-sm text-mist">List properties and connect with genuine buyers.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="flex items-center gap-2 rounded-xl border border-line bg-sand px-3 py-2.5">
          <User size={16} className="text-mist" />
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
            className="w-full bg-transparent text-sm outline-none placeholder:text-mist"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-sand px-3 py-2.5">
          <Mail size={16} className="text-mist" />
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full bg-transparent text-sm outline-none placeholder:text-mist"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-sand px-3 py-2.5">
          <Phone size={16} className="text-mist" />
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone (for call/WhatsApp on listings)"
            className="w-full bg-transparent text-sm outline-none placeholder:text-mist"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-sand px-3 py-2.5">
          <Lock size={16} className="text-mist" />
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            className="w-full bg-transparent text-sm outline-none placeholder:text-mist"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-ember py-2.5 text-sm font-semibold text-ink hover:bg-ember-deep disabled:opacity-50"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-mist">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-ember-deep">
          Sign in
        </Link>
      </p>
    </div>
  );
}
