"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/dashboard/my-listings");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="text-center font-display text-3xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-1 text-center text-sm text-mist">Sign in to manage your listings.</p>

      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard/my-listings" })}
        className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-line bg-paper py-2.5 text-sm font-semibold text-charcoal hover:bg-sand"
      >
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-mist">
        <div className="h-px flex-1 bg-line" /> or <div className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 rounded-xl border border-line bg-sand px-3 py-2.5">
          <Mail size={16} className="text-mist" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-transparent text-sm outline-none placeholder:text-mist"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-sand px-3 py-2.5">
          <Lock size={16} className="text-mist" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent text-sm outline-none placeholder:text-mist"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-2.5 text-sm font-semibold text-sand hover:bg-ink-soft disabled:opacity-50"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-mist">
        New to P2mdestiny?{" "}
        <Link href="/register" className="font-semibold text-ember-deep">
          Create an account
        </Link>
      </p>
    </div>
  );
}
