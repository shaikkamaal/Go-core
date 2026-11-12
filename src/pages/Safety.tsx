import { useState } from "react";
import { Card, Eyebrow, H2, Section } from "../components/Layout";
import { CHALLENGES, FAQ } from "../data";

export default function Safety() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      <div className="bg-slate-950 text-white">
        <Section className="pb-10">
          <Eyebrow>Safety & transparency</Eyebrow>
          <H2 light>Designed to fail safe. Described honestly.</H2>
          <p className="mt-4 max-w-2xl text-slate-300">
            A road-mobile reactor must be safer than a stationary one, not less. These are the design principles and the open
            problems.
          </p>
        </Section>
      </div>

      <Section>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Passive shutdown", "Negative temperature coefficient and gravity-driven control rods — the core shuts itself down if it overheats."],
            ["Passive decay-heat removal", "Natural-circulation loops and radiators remove residual heat with no pumps, power or operator."],
            ["Sealed module", "No fuel handling on site. The vessel is opened only in a licensed depot hot-cell."],
            ["Continuous monitoring", "Radiation, temperature, vibration and tilt sensors with automatic SCRAM and a remote operations centre."],
          ].map(([t, d]) => (
            <Card key={t}>
              <h3 className="font-semibold text-slate-900">{t}</h3>
              <p className="mt-2 text-sm text-slate-600">{d}</p>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Open challenges</Eyebrow>
            <H2>What still has to be solved</H2>
            <div className="mt-6 space-y-4">
              {CHALLENGES.map((c, i) => (
                <div key={c.title} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">{i + 1}</div>
                  <div>
                    <div className="font-semibold text-slate-900">{c.title}</div>
                    <p className="text-sm text-slate-600">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Eyebrow>Regulatory path</Eyebrow>
            <H2>Milestones before any real deployment</H2>
            <ol className="mt-6 space-y-3">
              {[
                ["Now", "Non-nuclear tabletop prototype & concept website", true],
                ["Phase 1", "Thermal-hydraulic mock-up with electric heaters", false],
                ["Phase 2", "Fuel-cycle and shielding design review with national regulator", false],
                ["Phase 3", "Licensed stationary demonstration unit", false],
                ["Phase 4", "Transport package certification (Type B) & route approvals", false],
                ["Phase 5", "First commercial pay-per-use deployments", false],
              ].map(([k, v, done]) => (
                <li key={k as string} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                  <span className={`h-3 w-3 rounded-full ${done ? "bg-teal-500" : "bg-slate-300"}`} />
                  <span className="w-16 text-xs font-bold uppercase text-slate-500">{k as string}</span>
                  <span className="text-sm text-slate-800">{v as string}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <div className="bg-slate-50">
        <Section>
          <Eyebrow>FAQ</Eyebrow>
          <H2>Frequently asked questions</H2>
          <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {FAQ.map((f, i) => (
              <div key={f.q}>
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-slate-900">
                  {f.q}
                  <span className="text-teal-600">{open === i ? "−" : "+"}</span>
                </button>
                {open === i && <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{f.a}</p>}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
