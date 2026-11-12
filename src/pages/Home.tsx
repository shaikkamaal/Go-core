import { Badge, Card, Eyebrow, H2, Section, type Route } from "../components/Layout";
import { CHALLENGES, STEPS, TRUCKS, USE_CASES, fmt } from "../data";

export default function Home({ go }: { go: (r: Route) => void }) {
  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-slate-950 text-white">
        <img src="images/hero-truck.jpg" alt="GoCore microreactor truck" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" /> Pay per unit · Not for sale · Conceptual project
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Reliable, low-carbon electricity <span className="bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent">delivered by truck.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              GoCore is a transportable thorium-based microreactor concept. We drive a sealed power module to your site,
              connect it to your switchgear, and you pay only for the kWh you use plus transport. No purchase, no diesel, no
              fuel convoys.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => go("dashboard")}
                className="rounded-xl bg-teal-500 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-teal-500/30 transition hover:bg-teal-400"
              >
                Book a truck →
              </button>
              <button
                onClick={() => go("technology")}
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                How it works
              </button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                ["250 kW – 3 MW", "per module"],
                ["< 72 h", "emergency rollout"],
                ["0 L", "diesel burned"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold text-white sm:text-3xl">{v}</div>
                  <div className="text-xs uppercase tracking-wider text-slate-400">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Use cases */}
      <Section>
        <Eyebrow>Who we power</Eyebrow>
        <H2>Continuous power, anywhere a truck can reach</H2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((u) => (
            <Card key={u.title} className="transition hover:-translate-y-1 hover:shadow-lg">
              <div className="text-3xl">{u.icon}</div>
              <h3 className="mt-4 font-semibold text-slate-900">{u.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{u.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <div className="bg-slate-950 text-white">
        <Section>
          <Eyebrow>The service</Eyebrow>
          <H2 light>From booking to billing in four steps</H2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="relative">
                <div className="text-5xl font-black text-teal-500/30">{s.n}</div>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-3">
            <div>
              <div className="text-sm text-slate-400">You pay for</div>
              <div className="mt-1 text-xl font-bold">Energy units (kWh)</div>
              <p className="mt-1 text-sm text-slate-400">Measured by a sealed meter at your switchgear.</p>
            </div>
            <div>
              <div className="text-sm text-slate-400">plus</div>
              <div className="mt-1 text-xl font-bold">Transport charges</div>
              <p className="mt-1 text-sm text-slate-400">Round-trip road distance from the nearest depot.</p>
            </div>
            <div>
              <div className="text-sm text-slate-400">never</div>
              <div className="mt-1 text-xl font-bold">A purchase price</div>
              <p className="mt-1 text-sm text-slate-400">The truck, fuel and crew remain ours end-to-end.</p>
            </div>
          </div>
        </Section>
      </div>

      {/* Fleet preview */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Fleet</Eyebrow>
            <H2>Three module sizes</H2>
          </div>
          <button onClick={() => go("fleet")} className="text-sm font-semibold text-teal-600 hover:underline">
            Full specifications →
          </button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TRUCKS.map((t) => (
            <Card key={t.id} className="flex flex-col">
              <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${t.color}`} />
              <div className="mt-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{t.name}</h3>
                <Badge tone={t.status === "Available" ? "green" : t.status === "Deployed" ? "amber" : "slate"}>{t.status}</Badge>
              </div>
              <div className="mt-1 text-sm text-slate-500">{t.id}</div>
              <div className="mt-4 text-3xl font-extrabold text-slate-900">
                {t.outputKw >= 1000 ? t.outputKw / 1000 + " MW" : t.outputKw + " kW"}
                <span className="text-sm font-medium text-slate-500"> continuous</span>
              </div>
              <dl className="mt-4 space-y-1 text-sm text-slate-600">
                <div className="flex justify-between"><dt>Energy rate</dt><dd className="font-semibold">{fmt(t.ratePerKwh)}/kWh</dd></div>
                <div className="flex justify-between"><dt>Transport</dt><dd className="font-semibold">{fmt(t.transportPerKm)}/km</dd></div>
                <div className="flex justify-between"><dt>Setup time</dt><dd className="font-semibold">{t.setupHours} h</dd></div>
              </dl>
              <button
                onClick={() => go("dashboard")}
                className="mt-6 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Book {t.tier}
              </button>
            </Card>
          ))}
        </div>
      </Section>

      {/* Honesty section */}
      <div className="bg-slate-50">
        <Section>
          <Eyebrow>Engineering honesty</Eyebrow>
          <H2>The hard problems we are working on</H2>
          <p className="mt-4 max-w-2xl text-slate-600">
            We don't pretend to have solved nuclear engineering. These are the five challenges that define the project.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CHALLENGES.map((c, i) => (
              <Card key={c.title}>
                <div className="text-xs font-bold text-teal-600">CHALLENGE {i + 1}</div>
                <h3 className="mt-2 font-semibold text-slate-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.desc}</p>
              </Card>
            ))}
            <div className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 p-6 text-white">
              <h3 className="text-xl font-bold">See the prototype</h3>
              <p className="mt-2 text-sm text-teal-50">Our non-nuclear tabletop demo shows the enclosure, heat loop and dashboard.</p>
              <button onClick={() => go("technology")} className="mt-4 w-fit rounded-lg bg-white px-4 py-2 text-sm font-semibold text-teal-700">
                Technology page →
              </button>
            </div>
          </div>
        </Section>
      </div>

      {/* CTA */}
      <Section>
        <div className="rounded-3xl bg-slate-950 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">Need power on site?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">Get an instant estimate for units and transport, reserve a truck, and pay the deposit online.</p>
          <button
            onClick={() => go("dashboard")}
            className="mt-8 rounded-xl bg-teal-500 px-8 py-3 font-semibold text-slate-950 shadow-lg shadow-teal-500/30 transition hover:bg-teal-400"
          >
            Open the booking dashboard
          </button>
        </div>
      </Section>
    </div>
  );
}
