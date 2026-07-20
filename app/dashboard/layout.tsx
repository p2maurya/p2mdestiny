"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Heart, PlusCircle } from "lucide-react";

const nav = [
  { href: "/dashboard/my-listings", label: "My listings", icon: Home },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  active ? "bg-ink text-sand" : "text-charcoal/70 hover:bg-sand"
                }`}
              >
                <item.icon size={16} /> {item.label}
              </Link>
            );
          })}

          <Link
            href="/post-property"
            className="mt-4 flex items-center gap-2.5 rounded-xl border border-dashed border-line px-3.5 py-2.5 text-sm font-semibold text-ember-deep hover:bg-sand"
          >
            <PlusCircle size={16} /> New listing
          </Link>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}
