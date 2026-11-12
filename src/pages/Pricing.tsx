import { useMemo, useState } from "react";
import { Card, Eyebrow, H2, Section, type Route } from "../components/Layout";
import { CITIES, TRUCKS, estimate, fmt } from "../data";

export function Estimator({ compact = false, onBook }: { compact?: boolean; onBook?: (truckId: string, city: string, days: number, load: number, hours: number) => void }) {
  const [truckId, setTruckId] = useState(TRUCKS[1].id);
  const [city, setCity] = useState("Raipur");
  const [days, setDays] = useState(14);
  const [load, setLoad] = useState(600);
  const [hours, setHours] = useState(24);
  const truck = TRUCKS.find((t) => t.id === truckId)!;
  const est = useMemo(() => estimate(truck, city, days, load, hours), [truck, city, days, load, hours]);

  return (
    <div className={`grid gap-6 ${compact ? "" : "lg:grid-cols-5"}`}>
      <Card className={compact ? "" : "lg:col-span-3"}>
        <h3 className="font-semibold text-slate-900">Estimate your deployment</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="text-slate-600">Module</span>
            <select value={truckId} onChange={(e) => setTruckId(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
              {TRUCKS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {t.outputKw} kW
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-slate-600">Nearest city to site</span>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
              {Object.keys(CITIES).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="flex justify-between text-slate-600"><span>Duration</span><b>{days} days</b></span>
            <input type="range" min={truck.minDays} max={180} value={Math.max(days, truck.minDays)} onChange={(e) => setDays(+e.target.value)} className="mt-2 w-full accent-teal-600" />
          </label>
          <label className="text-sm">
            <span className="flex justify-between text-slate-600"><span>Average load</span><b>{Math.min(load, truck.outputKw)} kW</b></span>
            <input type="range" min={50} max={truck.outputKw} step={10} value={Math.min(load, truck.outputKw)} onChange={(e) => setLoad(+e.target.value)} className="mt-2 w-full accent-teal-600" />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="flex justify-between text-slate-600"><span>Hours of use per day</span><b>{hours} h</b></span>
            <input type="range" min={4} max={24} value={hours} onChange={(e) => setHours(+e.target.value)} className="mt-2 w-full accent-teal-600" />
          </label>
        </div>
        <p className="mt-4 text-xs text-slate-500">Transport is computed as round-trip road distance from {est.depot}: ≈ {est.transportKm} km.</p>
      </Card>
      <Card className={`bg-slate-950 text-white ${compact ? "" : "lg:col-span-2"}`}>
        <div className="text-xs uppercase tracking-widest text-teal-400">Estimated bill</div>
        <div className="mt-2 text-4xl font-extrabold">{fmt(est.total)}</div>
        <div className="text-sm text-slate-400">for {days} days · {est.energyKwh.toLocaleString("en-IN")} kWh</div>
        <dl className="mt-6 space-y-2 text-sm">
          {[
            [`Energy units (${est.energyKwh.toLocaleString("en-IN")} kWh × ${fmt(truck.ratePerKwh)})`, est.energyCost],
            [`Transport (${est.transportKm} km × ${fmt(truck.transportPerKm)})`, est.transportCost],
            [`Crew standby (${days} d × ${fmt(truck.dailyStandby)})`, est.standbyCost],
            ["GST 18 %", est.tax],
          ].map(([k, v]) => (
            <div key={k as string} className="flex justify-between gap-4 border-b border-white/10 pb-2">
              <dt className="text-slate-300">{k}</dt>
              <dd className="font-semibold">{fmt(v as number)}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-slate-300">Booking deposit due now</span>
          <span className="font-bold text-teal-300">{fmt(est.deposit)}</span>
        </div>
        <div className="mt-1 text-xs text-slate-500">Effective: {fmt(Math.round(est.total / Math.max(est.energyKwh, 1) * 100) / 100)} per kWh all-in. Balance billed monthly on metered units.</div>
        {onBook && (
          <button
            onClick={() => onBook(truckId, city, days, load, hours)}
            className="mt-6 w-full rounded-xl bg-teal-500 py-2.5 font-semibold text-slate-950 hover:bg-teal-400"
          >
            Continue to booking →
          </button>
        )}
      </Card>
    </div>
  );
}

export default function Pricing({ go }: { go: (r: Route) => void }) {
  return (
    <div>
      <div className="bg-slate-950 text-white">
        <Section className="pb-10">
          <Eyebrow>Pricing</Eyebrow>
          <H2 light>Pay per unit. Pay for transport. Nothing else.</H2>
          <p className="mt-4 max-w-2xl text-slate-300">GoCore trucks are not for sale. Our revenue comes from the electricity you actually consume and the distance we drive to reach you.</p>
        </Section>
      </div>
      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["⚡", "Energy units", "Billed per kWh measured by a sealed revenue meter. Rates fall with larger modules."],
            ["🚚", "Transport charges", "Per-kilometre round-trip from the nearest depot, including escorts and route approvals."],
            ["👷", "Crew standby", "A flat daily fee for the two-person operating crew and remote monitoring."],
          ].map(([i, t, d]) => (
            <Card key={t}>
              <div className="text-3xl">{i}</div>
              <h3 className="mt-3 font-semibold text-slate-900">{t}</h3>
              <p className="mt-2 text-sm text-slate-600">{d}</p>
            </Card>
          ))}
        </div>

        <div className="mt-14 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Module</th>
                <th className="px-5 py-3">Continuous output</th>
                <th className="px-5 py-3">Energy rate</th>
                <th className="px-5 py-3">Transport</th>
                <th className="px-5 py-3">Crew standby</th>
                <th className="px-5 py-3">Min. booking</th>
              </tr>
            </thead>
            <tbody>
              {TRUCKS.map((t) => (
                <tr key={t.id} className="border-t border-slate-200">
                  <td className="px-5 py-3 font-semibold text-slate-900">{t.name}</td>
                  <td className="px-5 py-3">{t.outputKw} kW</td>
                  <td className="px-5 py-3">{fmt(t.ratePerKwh)} / kWh</td>
                  <td className="px-5 py-3">{fmt(t.transportPerKm)} / km</td>
                  <td className="px-5 py-3">{fmt(t.dailyStandby)} / day</td>
                  <td className="px-5 py-3">{t.minDays} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-14">
          <Eyebrow>Estimator</Eyebrow>
          <H2>Instant estimate</H2>
          <div className="mt-8">
            <Estimator onBook={() => go("dashboard")} />
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold text-slate-900">Payment terms</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              <li>• Deposit at booking = transport + 50 % of crew standby.</li>
              <li>• Metered units invoiced monthly; auto-debit or bank transfer.</li>
              <li>• Emergency bookings carry a 15 % priority surcharge.</li>
              <li>• Cancel ≥ 7 days before dispatch for a full deposit refund.</li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-semibold text-slate-900">Compared with diesel</h3>
            <p className="mt-3 text-sm text-slate-600">
              A 1 MW diesel genset at full load burns ~250 L/hour. Over 30 days that is ~180,000 L of fuel to haul to a remote
              site — before maintenance and emissions. GoCore's target is to undercut that all-in cost while emitting no CO₂ on site.
            </p>
          </Card>
        </div>
      </Section>
    </div>
  );
}
