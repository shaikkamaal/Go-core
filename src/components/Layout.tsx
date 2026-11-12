import { useState, type ReactNode } from "react";
import { cn } from "../utils/cn";

export type Route = "home" | "technology" | "fleet" | "pricing" | "safety" | "dashboard";

export const NAV: { id: Route; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "technology", label: "Technology" },
  { id: "fleet", label: "Fleet" },
  { id: "pricing", label: "Pricing" },
  { id: "safety", label: "Safety & FAQ" },
];

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 shadow-lg shadow-teal-500/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className={cn("text-lg font-bold tracking-tight", dark ? "text-white" : "text-slate-900")}>
          Go<span className="text-teal-500">Core</span>
        </div>
        <div className={cn("text-[10px] uppercase tracking-[0.2em]", dark ? "text-slate-400" : "text-slate-500")}>Power on wheels</div>
      </div>
    </div>
  );
}

export function Navbar({ route, go }: { route: Route; go: (r: Route) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <button onClick={() => go("home")} aria-label="GoCore home">
          <Logo dark />
        </button>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                route === n.id ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => go("dashboard")}
            className={cn(
              "hidden rounded-lg px-4 py-2 text-sm font-semibold transition sm:inline-flex",
              route === "dashboard"
                ? "bg-teal-400 text-slate-950"
                : "bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-lg shadow-teal-500/30"
            )}
          >
            Book a Truck
          </button>
          <button className="rounded-lg p-2 text-slate-300 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-slate-950 px-4 py-3 md:hidden">
          {[...NAV, { id: "dashboard" as Route, label: "Dashboard / Book a Truck" }].map((n) => (
            <button
              key={n.id}
              onClick={() => {
                go(n.id);
                setOpen(false);
              }}
              className={cn(
                "block w-full rounded-lg px-3 py-2 text-left text-sm font-medium",
                route === n.id ? "bg-white/10 text-white" : "text-slate-300"
              )}
            >
              {n.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

export function Footer({ go }: { go: (r: Route) => void }) {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-md text-sm leading-relaxed">
            GoCore is a conceptual energy project exploring a transportable thorium-based microreactor delivered as a
            pay-per-use service. Trucks are never sold — you pay only for the units you use and the transport to your site.
          </p>
          <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <strong>Disclosure:</strong> No functioning nuclear reactor has been built. The first prototype is a non-nuclear
            tabletop demonstration. All figures on this site are illustrative design targets.
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.id}>
                <button onClick={() => go(n.id)} className="hover:text-white">
                  {n.label}
                </button>
              </li>
            ))}
            <li>
              <button onClick={() => go("dashboard")} className="hover:text-white">
                Customer dashboard
              </button>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>ops@gocore.energy</li>
            <li>+91 1800 GO CORE</li>
            <li>24×7 emergency dispatch desk</li>
            <li>Depots: Nagpur · Hyderabad · Guwahati · Jaipur</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} GoCore Energy Concept. Pay per use · Not for sale.</div>
    </footer>
  );
}

export function Section({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-teal-400">{children}</div>;
}

export function H2({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <h2 className={cn("text-3xl font-bold tracking-tight sm:text-4xl", light ? "text-white" : "text-slate-900")}>{children}</h2>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", className)}>{children}</div>;
}

export function Badge({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "amber" | "red" | "slate" | "green" }) {
  const tones = {
    teal: "bg-teal-100 text-teal-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-800",
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-800",
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone])}>{children}</span>;
}
