import { useEffect, useState } from "react";
import { Card, Eyebrow, H2, Section } from "../components/Layout";
import { EXCLUDED } from "../data";

function FlowDiagram() {
  const stages = [
    { label: "Thorium-232 blanket", sub: "fertile", color: "bg-slate-700" },
    { label: "Neutron capture", sub: "Th-233 → Pa-233", color: "bg-indigo-600" },
    { label: "Uranium-233 core", sub: "fissile · heat", color: "bg-orange-500" },
    { label: "Primary coolant loop", sub: "heat transfer", color: "bg-rose-500" },
    { label: "Heat exchanger / turbine", sub: "steam or sCO₂", color: "bg-amber-500" },
    { label: "Generator & switchgear", sub: "electricity out", color: "bg-teal-500" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % stages.length), 1100);
    return () => clearInterval(t);
  }, [stages.length]);
  return (
    <div className="grid gap-3 md:grid-cols-6">
      {stages.map((s, i) => (
        <div key={s.label} className="relative">
          <div
            className={`rounded-xl p-4 text-white transition-all duration-500 ${s.color} ${active === i ? "scale-105 shadow-xl ring-4 ring-white/40" : "opacity-70"}`}
          >
            <div className="text-xs uppercase tracking-wider opacity-80">Step {i + 1}</div>
            <div className="mt-1 text-sm font-bold leading-tight">{s.label}</div>
            <div className="mt-1 text-xs opacity-90">{s.sub}</div>
          </div>
          {i < stages.length - 1 && (
            <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-slate-400 md:block">›</div>
          )}
        </div>
      ))}
    </div>
  );
}

function SimDashboard() {
  const [t, setT] = useState(0);
  const [scram, setScram] = useState(false);
  const [fan, setFan] = useState(true);
  useEffect(() => {
    const i = setInterval(() => setT((x) => x + 1), 500);
    return () => clearInterval(i);
  }, []);
  const target = scram ? 60 : fan ? 540 : 720;
  const temp = Math.round(target + Math.sin(t / 3) * 8);
  const power = scram ? 0 : Math.round((fan ? 100 : 82) + Math.sin(t / 4) * 2);
  const coolant = scram ? 20 : fan ? 92 : 48;
  const rad = scram ? 0.08 : 0.12 + Math.abs(Math.sin(t / 5)) * 0.03;
  const alert = !scram && !fan ? "Coolant flow low — reduce load" : scram ? "SCRAM engaged — core shutting down" : "All systems nominal";
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 font-mono text-sm text-slate-200 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-teal-400">Simulated prototype dashboard</div>
        <div className={`flex items-center gap-2 text-xs ${scram ? "text-red-400" : !fan ? "text-amber-400" : "text-emerald-400"}`}>
          <span className={`h-2 w-2 rounded-full ${scram ? "bg-red-400" : !fan ? "bg-amber-400" : "bg-emerald-400"} animate-pulse`} />
          {alert}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Core temp (mock)", `${temp} °C`, temp > 650 ? "text-amber-400" : "text-white"],
          ["Output", `${power} %`, "text-white"],
          ["Coolant flow", `${coolant} %`, coolant < 50 ? "text-amber-400" : "text-white"],
          ["Radiation (sim)", `${rad.toFixed(2)} µSv/h`, "text-white"],
        ].map(([l, v, c]) => (
          <div key={l} className="rounded-lg bg-slate-900 p-3">
            <div className="text-[10px] uppercase text-slate-500">{l}</div>
            <div className={`mt-1 text-xl font-bold ${c}`}>{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full transition ${scram ? "bg-slate-700" : "bg-orange-500 shadow-[0_0_30px_8px_rgba(249,115,22,0.6)] animate-pulse"}`} />
          <span className="text-xs text-slate-400">LED mock core</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-2xl ${fan && !scram ? "animate-spin" : ""}`} style={{ animationDuration: "1.2s" }}>✣</div>
          <span className="text-xs text-slate-400">Cooling fan</span>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => setFan((f) => !f)} className="rounded-md border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">
            Fan {fan ? "OFF" : "ON"}
          </button>
          <button
            onClick={() => setScram((s) => !s)}
            className={`rounded-md px-3 py-1.5 text-xs font-bold ${scram ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}
          >
            {scram ? "RESET" : "SCRAM"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Technology() {
  return (
    <div>
      <div className="bg-slate-950 text-white">
        <Section>
          <Eyebrow>Technology</Eyebrow>
          <H2 light>How a GoCore module would make electricity</H2>
          <p className="mt-4 max-w-3xl text-slate-300">
            A sealed, truck-mounted microreactor using a thorium-based fuel-cycle concept. The key scientific detail:{" "}
            <strong className="text-white">Thorium-232 is fertile, not fissile.</strong> It cannot sustain a chain reaction on its own — it must first
            absorb a neutron and transmute into fissile <strong className="text-white">Uranium-233</strong>, which then produces heat.
          </p>
          <div className="mt-10">
            <FlowDiagram />
          </div>
          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5 font-mono text-sm text-teal-200">
            ²³²Th + n → ²³³Th → (β⁻, 22 min) ²³³Pa → (β⁻, 27 days) ²³³U &nbsp;→&nbsp; fission → heat → steam → electricity
          </div>
        </Section>
      </div>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Module anatomy</Eyebrow>
            <H2>What's on the truck</H2>
            <ul className="mt-6 space-y-4">
              {[
                ["Reactor enclosure", "A sealed steel-and-composite vessel. Never opened in the field; refuelled only at the depot."],
                ["Core & fuel section", "Driver fuel starts the chain reaction; a thorium blanket breeds U-233 over the cycle."],
                ["Heat-transfer loop", "Primary coolant carries heat to a compact heat exchanger. Passive natural circulation removes decay heat if pumps fail."],
                ["Power conversion", "A compact turbine-generator or supercritical-CO₂ cycle converts heat to 3-phase electricity."],
                ["Cooling", "Air-cooled radiator banks on the trailer roof, with fans sized for 45 °C ambient."],
                ["Shielding & monitoring", "Layered shielding plus continuous radiation, temperature and seismic monitoring with automatic shutdown."],
                ["Switchgear & metering", "Sealed revenue meter — the basis of your pay-per-unit bill."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-4">
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-500" />
                  <div>
                    <div className="font-semibold text-slate-900">{t}</div>
                    <div className="text-sm text-slate-600">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-5">
            <Card>
              <h3 className="font-semibold text-slate-900">Why thorium?</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• 3–4× more abundant than uranium; large reserves in India's monazite sands.</li>
                <li>• Far less long-lived transuranic waste than the uranium–plutonium cycle.</li>
                <li>• U-232 contamination makes the bred fuel hard to divert — a proliferation advantage.</li>
                <li>• Thorium oxide is chemically stable with a very high melting point.</li>
              </ul>
            </Card>
            <Card>
              <h3 className="font-semibold text-slate-900">The honest trade-offs</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Needs a fissile driver (U-235 or Pu) to start breeding.</li>
                <li>• Pa-233 must be allowed to decay (27 days) — it complicates fuel management.</li>
                <li>• Hard gamma from the U-232 chain demands heavy shielding and remote handling.</li>
                <li>• Little industrial experience compared with uranium fuel.</li>
              </ul>
            </Card>
          </div>
        </div>
      </Section>

      <div className="bg-slate-50">
        <Section>
          <Eyebrow>Initial prototype</Eyebrow>
          <H2>A non-nuclear tabletop demonstration</H2>
          <p className="mt-4 max-w-3xl text-slate-600">
            To demonstrate the engineering concept without pretending we have a functioning reactor, the first prototype is a
            scale model that simulates the flow of heat, cooling and control.
          </p>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <img src="images/prototype.jpg" alt="Tabletop prototype" className="rounded-2xl shadow-lg" />
              <ul className="mt-6 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                {[
                  "Model reactor enclosure",
                  "Labelled core and fuel sections",
                  "Simulated heat-transfer & generation flow",
                  "LED mock core and output indicator",
                  "Fan / pump demonstrating cooling",
                  "Simulated dashboard: temperature, cooling, radiation, shutdown & alerts",
                ].map((x) => (
                  <li key={x} className="flex gap-2 rounded-lg bg-white p-3 shadow-sm">
                    <span className="text-teal-500">✓</span> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-5">
              <SimDashboard />
              <Card className="border-amber-200 bg-amber-50">
                <h3 className="font-semibold text-amber-900">Deliberately excluded from the first prototype</h3>
                <ul className="mt-3 grid gap-1.5 text-sm text-amber-900/80 sm:grid-cols-2">
                  {EXCLUDED.map((x) => (
                    <li key={x}>✕ {x}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
