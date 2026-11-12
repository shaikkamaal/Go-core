import { Badge, Card, Eyebrow, H2, Section, type Route } from "../components/Layout";
import { TRUCKS, fmt } from "../data";

export default function Fleet({ go }: { go: (r: Route) => void }) {
  return (
    <div>
      <div className="bg-slate-950 text-white">
        <Section className="pb-10">
          <Eyebrow>Fleet</Eyebrow>
          <H2 light>Choose the module that fits your load</H2>
          <p className="mt-4 max-w-2xl text-slate-300">
            Every truck ships with its own crew, switchgear, metering and cooling. You never own it — book it, use it, return it.
          </p>
        </Section>
      </div>
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          {TRUCKS.map((t) => (
            <Card key={t.id} className="flex flex-col overflow-hidden p-0">
              <div className={`bg-gradient-to-r ${t.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-widest opacity-90">{t.tier} · {t.id}</div>
                  <Badge tone={t.status === "Available" ? "green" : t.status === "Deployed" ? "amber" : "slate"}>{t.status}</Badge>
                </div>
                <div className="mt-2 text-2xl font-bold">{t.name}</div>
                <div className="mt-4 text-4xl font-extrabold">
                  {t.outputKw >= 1000 ? t.outputKw / 1000 + " MW" : t.outputKw + " kW"}
                  <span className="text-base font-medium opacity-80"> · peak {t.peakKw >= 1000 ? (t.peakKw / 1000).toFixed(2) + " MW" : t.peakKw + " kW"}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  {[
                    ["Footprint", t.footprint],
                    ["Gross weight", `${t.weightT} t`],
                    ["Setup time", `${t.setupHours} h`],
                    ["Minimum booking", `${t.minDays} days`],
                    ["Energy rate", `${fmt(t.ratePerKwh)} / kWh`],
                    ["Transport", `${fmt(t.transportPerKm)} / km`],
                    ["Crew standby", `${fmt(t.dailyStandby)} / day`],
                    ["Output", "415 V / 11 kV 3-phase"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">{k}</dt>
                      <dd className="font-semibold text-slate-900">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Best for</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {t.bestFor.map((b) => (
                      <Badge key={b} tone="slate">{b}</Badge>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => go("dashboard")}
                  className="mt-6 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Book this truck
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            ["What's included", ["Two-person operating crew, 24×7", "Switchgear, cabling up to 50 m", "Sealed revenue meter", "Exclusion-zone fencing & signage", "Remote monitoring link"]],
            ["Site requirements", ["Level hardstand ≈ 20 m × 8 m", "Road access for 16 m trailer", "Earthing point", "Main switchgear tie-in", "Perimeter for exclusion zone"]],
            ["Service levels", ["Planned: survey, then scheduled dispatch", "Emergency: 24–72 h target rollout", "Load-following within ±10 %/min", "Automatic shutdown on any anomaly"]],
          ].map(([h, items]) => (
            <Card key={h as string}>
              <h3 className="font-semibold text-slate-900">{h as string}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                {(items as string[]).map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
