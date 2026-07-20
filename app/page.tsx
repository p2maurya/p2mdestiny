import Hero from "@/components/home/Hero";
import PropertyCard from "@/components/property/PropertyCard";
import { mockProperties } from "@/lib/mock-properties";
import Link from "next/link";
import { ArrowRight, ShieldCheck, MapPinned, Users } from "lucide-react";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-5 pt-24 pb-8 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Verified owners", desc: "Every listing is checked before it goes live." },
            { icon: MapPinned, title: "Real locations", desc: "Map-pinned addresses, no guesswork." },
            { icon: Users, title: "Direct contact", desc: "Talk to the owner, no middlemen fees." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-line bg-paper p-6">
              <f.icon className="text-teal" size={22} />
              <p className="mt-3 font-display text-lg font-semibold text-ink">{f.title}</p>
              <p className="mt-1 text-sm text-mist">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono-num text-xs uppercase tracking-[0.3em] text-ember-deep">Handpicked</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Featured homes</h2>
          </div>
          <Link href="/properties" className="hidden items-center gap-1 text-sm font-semibold text-ink hover:text-ember-deep md:flex">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        <Link href="/properties" className="mt-8 flex items-center justify-center gap-1 text-sm font-semibold text-ink hover:text-ember-deep md:hidden">
          View all <ArrowRight size={16} />
        </Link>
      </section>

      <section className="bg-ink py-20">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
          <h2 className="font-display text-3xl font-semibold text-sand md:text-4xl">
            Have a property to list?
          </h2>
          <p className="mt-3 text-sand/70">
            Post it in minutes — add photos, a walkthrough video, and reach genuine buyers and tenants.
          </p>
          <Link
            href="/post-property"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ember px-7 py-3 text-sm font-semibold text-ink transition hover:bg-ember-deep"
          >
            List your property <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
