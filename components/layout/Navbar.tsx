"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Heart, User, LayoutDashboard, LogOut } from "lucide-react";

const links = [
  { href: "/properties?type=RENT", label: "Rent" },
  { href: "/properties?type=SALE", label: "Buy" },
  { href: "/post-property", label: "List your property" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="font-display text-2xl font-semibold text-ink">
          P2mdestiny
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-charcoal/80 transition hover:text-ember-deep"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/dashboard/wishlist" aria-label="Wishlist" className="text-charcoal/70 hover:text-ember-deep">
            <Heart size={20} />
          </Link>

          {status === "authenticated" ? (
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ink hover:text-sand"
              >
                <User size={16} />
                {session.user?.name?.split(" ")[0] ?? "Account"}
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-line bg-paper py-2 shadow-lg">
                  <Link
                    href="/dashboard/my-listings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-charcoal hover:bg-sand"
                    onClick={() => setMenu(false)}
                  >
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-sand"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ink hover:text-sand"
            >
              <User size={16} />
              Sign in
            </Link>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-paper px-5 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-3 text-sm font-medium text-charcoal"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard/my-listings" className="block py-3 text-sm font-semibold text-ink" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="block py-3 text-sm font-semibold text-red-600">
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="mt-2 block py-3 text-sm font-semibold text-ember-deep">
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
