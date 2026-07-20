import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line-dark bg-ink text-sand/80">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-semibold text-sand">P2mdestiny</p>
            <p className="mt-3 max-w-xs text-sm text-sand/60">
              Verified homes, honest listings. Find the right place, on your terms.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sand/50">Explore</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/properties?type=RENT" className="hover:text-ember">Rent a home</Link></li>
              <li><Link href="/properties?type=SALE" className="hover:text-ember">Buy a home</Link></li>
              <li><Link href="/post-property" className="hover:text-ember">List your property</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sand/50">Company</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-ember">About</Link></li>
              <li><Link href="/contact" className="hover:text-ember">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sand/50">Reach us</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>hello@P2mdestiny.app</li>
              <li>+91 7388739502</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line-dark pt-6 text-xs text-sand/40 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} P2mdestiny. All rights reserved.</p>
          <p>Built for people, not just listings.</p>
        </div>
      </div>
    </footer>
  );
}
