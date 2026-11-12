import { useMemo, useState } from "react";
import { Badge, Card } from "../components/Layout";
import { CITIES, TRUCKS, estimate, fmt, nearestDepot } from "../data";
import { newId, useBookings, type Booking } from "../store";
import { cn } from "../utils/cn";

type Tab = "overview" | "book" | "bookings" | "payments";

const input = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200";

function statusTone(s: Booking["status"]) {
  return s === "Confirmed" ? "green" : s === "Awaiting payment" ? "amber" : s === "Cancelled" ? "red" : s === "Completed" ? "slate" : "teal";
}

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const { bookings, add, update, remove } = useBookings();
  const [payFor, setPayFor] = useState<string | null>(null);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "▦" },
    { id: "book", label: "Book a truck", icon: "🚚" },
    { id: "bookings", label: "My bookings", icon: "📋" },
    { id: "payments", label: "Payments", icon: "💳" },
  ];

  const active = bookings.filter((b) => ["Confirmed", "En route", "On site"].includes(b.status));
  const totalPaid = bookings.reduce((s, b) => s + b.paid, 0);
  const totalKwh = bookings.reduce((s, b) => s + b.usedKwh, 0);
  const due = bookings.filter((b) => b.status === "Awaiting payment");

  return (
    <div className="bg-slate-100">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl bg-slate-950 p-4 text-white">
            <div className="text-xs uppercase tracking-widest text-slate-400">Customer portal</div>
            <div className="mt-1 font-semibold">Welcome back</div>
          </div>
          <nav className="mt-3 flex gap-1 overflow-x-auto lg:flex-col">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  tab === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-white/60"
                )}
              >
                <span>{t.icon}</span> {t.label}
                {t.id === "payments" && due.length > 0 && <span className="ml-auto rounded-full bg-amber-500 px-2 text-xs text-white">{due.length}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Active deployments", active.length, "trucks"],
                  ["Units consumed", totalKwh.toLocaleString("en-IN"), "kWh"],
                  ["Total paid", fmt(totalPaid), ""],
                  ["Payments due", due.length, "bookings"],
                ].map(([l, v, u]) => (
                  <Card key={l as string}>
                    <div className="text-xs uppercase tracking-wide text-slate-500">{l}</div>
                    <div className="mt-2 text-3xl font-extrabold text-slate-900">
                      {v} <span className="text-sm font-medium text-slate-500">{u}</span>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Recent bookings</h3>
                    <button onClick={() => setTab("bookings")} className="text-sm font-semibold text-teal-600">View all</button>
                  </div>
                  {bookings.length === 0 ? (
                    <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
                      <div className="text-3xl">🚚</div>
                      <p className="mt-2 text-sm text-slate-600">No bookings yet. Reserve your first GoCore truck.</p>
                      <button onClick={() => setTab("book")} className="mt-4 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950">
                        Book a truck
                      </button>
                    </div>
                  ) : (
                    <ul className="mt-4 divide-y divide-slate-100">
                      {bookings.slice(0, 4).map((b) => (
                        <li key={b.id} className="flex items-center justify-between py-3 text-sm">
                          <div>
                            <div className="font-semibold text-slate-900">{b.truckName} · {b.city}</div>
                            <div className="text-xs text-slate-500">{b.id} · from {b.startDate} · {b.days} days</div>
                          </div>
                          <Badge tone={statusTone(b.status)}>{b.status}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
                <Card className="bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
                  <h3 className="font-semibold">Fleet availability</h3>
                  <ul className="mt-4 space-y-3">
                    {TRUCKS.map((t) => (
                      <li key={t.id} className="flex items-center justify-between text-sm">
                        <span>{t.name}</span>
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", t.status === "Available" ? "bg-white text-teal-700" : "bg-white/20")}>{t.status}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setTab("book")} className="mt-6 w-full rounded-lg bg-white py-2 text-sm font-semibold text-teal-700">
                    New booking
                  </button>
                </Card>
              </div>
            </div>
          )}

          {tab === "book" && (
            <BookingWizard
              onDone={(b) => {
                add(b);
                setPayFor(b.id);
                setTab("payments");
              }}
            />
          )}

          {tab === "bookings" && (
            <BookingsList
              bookings={bookings}
              onPay={(id) => {
                setPayFor(id);
                setTab("payments");
              }}
              onCancel={(id) => update(id, { status: "Cancelled" })}
              onDelete={remove}
              onSimulate={(b) => {
                const next: Record<string, Booking["status"]> = { Confirmed: "En route", "En route": "On site", "On site": "Completed" };
                const ns = next[b.status];
                if (!ns) return;
                const used = ns === "On site" ? Math.round(b.estimate.energyKwh * 0.35) : ns === "Completed" ? Math.round(b.estimate.energyKwh * (0.9 + Math.random() * 0.15)) : b.usedKwh;
                update(b.id, { status: ns, usedKwh: used });
              }}
            />
          )}

          {tab === "payments" && (
            <Payments
              bookings={bookings}
              selected={payFor}
              setSelected={setPayFor}
              onPaid={(id, method, amount) =>
                update(id, { status: "Confirmed", paid: amount, paymentMethod: method, txnId: "TXN" + Date.now().toString().slice(-8) })
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Booking wizard ---------------- */

function BookingWizard({ onDone }: { onDone: (b: Booking) => void }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({
    truckId: TRUCKS[0].id,
    org: "",
    contact: "",
    email: "",
    phone: "",
    city: "Raipur",
    siteAddress: "",
    purpose: "Remote village / mining site",
    startDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    days: 14,
    avgLoadKw: 200,
    hoursPerDay: 24,
    priority: "Planned" as "Planned" | "Emergency",
    agree: false,
  });
  const truck = TRUCKS.find((t) => t.id === f.truckId)!;
  const est = useMemo(() => {
    const e = estimate(truck, f.city, f.days, f.avgLoadKw, f.hoursPerDay);
    if (f.priority === "Emergency") {
      const sur = Math.round(e.subtotal * 0.15);
      const subtotal = e.subtotal + sur;
      const tax = Math.round(subtotal * 0.18);
      return { ...e, subtotal, tax, total: subtotal + tax };
    }
    return e;
  }, [truck, f.city, f.days, f.avgLoadKw, f.hoursPerDay, f.priority]);
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));
  const { depot, km } = nearestDepot(f.city);

  const steps = ["Truck", "Site & contact", "Load & schedule", "Review"];
  const valid1 = f.org && f.contact && /\S+@\S+\.\S+/.test(f.email) && f.phone.length >= 8 && f.siteAddress;

  return (
    <Card className="p-0">
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900">Book a GoCore truck</h2>
        <div className="mt-4 flex gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={cn("h-1.5 rounded-full", i <= step ? "bg-teal-500" : "bg-slate-200")} />
              <div className={cn("mt-1.5 text-xs font-medium", i <= step ? "text-teal-700" : "text-slate-400")}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        {step === 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            {TRUCKS.map((t) => (
              <button
                key={t.id}
                disabled={t.status !== "Available"}
                onClick={() => {
                  set("truckId", t.id);
                  set("days", Math.max(f.days, t.minDays));
                  set("avgLoadKw", Math.min(f.avgLoadKw, t.outputKw));
                }}
                className={cn(
                  "rounded-2xl border-2 p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-50",
                  f.truckId === t.id ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase text-slate-500">{t.tier}</div>
                  <Badge tone={t.status === "Available" ? "green" : "amber"}>{t.status}</Badge>
                </div>
                <div className="mt-1 text-lg font-bold text-slate-900">{t.name}</div>
                <div className="mt-2 text-2xl font-extrabold text-slate-900">{t.outputKw} kW</div>
                <div className="mt-2 text-xs text-slate-600">{fmt(t.ratePerKwh)}/kWh · {fmt(t.transportPerKm)}/km · min {t.minDays} d</div>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm"><span className="text-slate-600">Organisation *</span><input className={input} value={f.org} onChange={(e) => set("org", e.target.value)} placeholder="e.g. Sundargarh District Hospital" /></label>
            <label className="text-sm"><span className="text-slate-600">Contact person *</span><input className={input} value={f.contact} onChange={(e) => set("contact", e.target.value)} /></label>
            <label className="text-sm"><span className="text-slate-600">Email *</span><input type="email" className={input} value={f.email} onChange={(e) => set("email", e.target.value)} /></label>
            <label className="text-sm"><span className="text-slate-600">Phone *</span><input className={input} value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91" /></label>
            <label className="text-sm">
              <span className="text-slate-600">Nearest city *</span>
              <select className={input} value={f.city} onChange={(e) => set("city", e.target.value)}>
                {Object.keys(CITIES).map((c) => <option key={c}>{c}</option>)}
              </select>
              <span className="mt-1 block text-xs text-slate-500">Dispatch from {depot.name} · ≈ {km} km one way</span>
            </label>
            <label className="text-sm">
              <span className="text-slate-600">Purpose</span>
              <select className={input} value={f.purpose} onChange={(e) => set("purpose", e.target.value)}>
                {["Remote village / mining site", "Hospital / disaster relief", "Industrial facility", "Military / strategic site", "Other"].map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label className="text-sm sm:col-span-2"><span className="text-slate-600">Site address / coordinates *</span><textarea className={input} rows={2} value={f.siteAddress} onChange={(e) => set("siteAddress", e.target.value)} placeholder="Plot, village, district, PIN or lat/lng" /></label>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="text-sm"><span className="text-slate-600">Start date</span><input type="date" className={input} value={f.startDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => set("startDate", e.target.value)} /></label>
            <div className="text-sm">
              <span className="text-slate-600">Priority</span>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {(["Planned", "Emergency"] as const).map((p) => (
                  <button key={p} onClick={() => set("priority", p)} className={cn("rounded-lg border-2 px-3 py-2 text-sm font-semibold", f.priority === p ? "border-teal-500 bg-teal-50 text-teal-800" : "border-slate-200 text-slate-600")}>
                    {p}
                    <div className="text-[10px] font-normal">{p === "Planned" ? "survey first" : "24–72 h · +15 %"}</div>
                  </button>
                ))}
              </div>
            </div>
            <label className="text-sm"><span className="flex justify-between text-slate-600"><span>Duration</span><b>{f.days} days</b></span><input type="range" min={truck.minDays} max={180} value={f.days} onChange={(e) => set("days", +e.target.value)} className="mt-2 w-full accent-teal-600" /></label>
            <label className="text-sm"><span className="flex justify-between text-slate-600"><span>Average load</span><b>{f.avgLoadKw} kW</b></span><input type="range" min={50} max={truck.outputKw} step={10} value={f.avgLoadKw} onChange={(e) => set("avgLoadKw", +e.target.value)} className="mt-2 w-full accent-teal-600" /></label>
            <label className="text-sm sm:col-span-2"><span className="flex justify-between text-slate-600"><span>Hours per day</span><b>{f.hoursPerDay} h</b></span><input type="range" min={4} max={24} value={f.hoursPerDay} onChange={(e) => set("hoursPerDay", +e.target.value)} className="mt-2 w-full accent-teal-600" /></label>
            <div className="rounded-xl bg-slate-50 p-4 text-sm sm:col-span-2">
              Estimated consumption: <b>{est.energyKwh.toLocaleString("en-IN")} kWh</b> · Estimated total <b>{fmt(est.total)}</b> · Deposit <b>{fmt(est.deposit)}</b>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3 text-sm">
              <h3 className="font-semibold text-slate-900">Booking summary</h3>
              {[
                ["Truck", `${truck.name} (${truck.id})`],
                ["Organisation", f.org],
                ["Contact", `${f.contact} · ${f.email} · ${f.phone}`],
                ["Site", `${f.siteAddress} (near ${f.city})`],
                ["Purpose", f.purpose],
                ["Schedule", `${f.startDate} for ${f.days} days · ${f.priority}`],
                ["Load", `${f.avgLoadKw} kW × ${f.hoursPerDay} h/day`],
                ["Dispatch depot", est.depot],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3 border-b border-slate-100 pb-2"><span className="w-32 shrink-0 text-slate-500">{k}</span><span className="text-slate-900">{v}</span></div>
              ))}
            </div>
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <div className="text-xs uppercase tracking-widest text-teal-400">Cost estimate</div>
              <dl className="mt-3 space-y-2 text-sm">
                {[
                  [`Energy units (${est.energyKwh.toLocaleString("en-IN")} kWh)`, est.energyCost],
                  [`Transport (${est.transportKm} km round trip)`, est.transportCost],
                  [`Crew standby (${f.days} days)`, est.standbyCost],
                  ...(f.priority === "Emergency" ? [["Emergency surcharge 15 %", est.subtotal - (est.energyCost + est.transportCost + est.standbyCost)]] : []),
                  ["GST 18 %", est.tax],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex justify-between border-b border-white/10 pb-2"><dt className="text-slate-300">{k}</dt><dd>{fmt(v as number)}</dd></div>
                ))}
              </dl>
              <div className="mt-3 flex justify-between text-lg font-bold"><span>Estimated total</span><span>{fmt(est.total)}</span></div>
              <div className="mt-1 flex justify-between text-sm text-teal-300"><span>Deposit payable now</span><span className="font-bold">{fmt(est.deposit)}</span></div>
              <p className="mt-3 text-xs text-slate-400">Final bill is based on metered units. Balance invoiced monthly.</p>
              <label className="mt-4 flex items-start gap-2 text-xs text-slate-300">
                <input type="checkbox" checked={f.agree} onChange={(e) => set("agree", e.target.checked)} className="mt-0.5 accent-teal-500" />
                I understand GoCore is a conceptual pay-per-use service; this booking is a reservation request subject to site survey and regulatory approval.
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 p-6">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-40">
          ← Back
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 1 && !valid1}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Continue →
          </button>
        ) : (
          <button
            disabled={!f.agree}
            onClick={() =>
              onDone({
                id: newId(),
                createdAt: new Date().toISOString(),
                truckId: truck.id,
                truckName: truck.name,
                org: f.org,
                contact: f.contact,
                email: f.email,
                phone: f.phone,
                city: f.city,
                siteAddress: f.siteAddress,
                purpose: f.purpose,
                startDate: f.startDate,
                days: f.days,
                avgLoadKw: f.avgLoadKw,
                hoursPerDay: f.hoursPerDay,
                priority: f.priority,
                estimate: est,
                status: "Awaiting payment",
                paid: 0,
                usedKwh: 0,
              })
            }
            className="rounded-lg bg-teal-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/30 disabled:opacity-40"
          >
            Reserve & proceed to payment
          </button>
        )}
      </div>
    </Card>
  );
}

/* ---------------- Bookings list ---------------- */

function BookingsList({
  bookings,
  onPay,
  onCancel,
  onDelete,
  onSimulate,
}: {
  bookings: Booking[];
  onPay: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
  onSimulate: (b: Booking) => void;
}) {
  if (bookings.length === 0)
    return (
      <Card className="p-10 text-center text-slate-600">
        No bookings yet.
      </Card>
    );
  return (
    <div className="space-y-4">
      {bookings.map((b) => {
        const pct = Math.min(100, Math.round((b.usedKwh / Math.max(1, b.estimate.energyKwh)) * 100));
        const unitBill = Math.round(b.usedKwh * (TRUCKS.find((t) => t.id === b.truckId)?.ratePerKwh ?? 0));
        return (
          <Card key={b.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{b.truckName}</h3>
                  <Badge tone={statusTone(b.status)}>{b.status}</Badge>
                  {b.priority === "Emergency" && <Badge tone="red">Emergency</Badge>}
                </div>
                <div className="mt-1 text-sm text-slate-600">{b.org} · {b.city} · {b.purpose}</div>
                <div className="text-xs text-slate-500">{b.id} · {b.startDate} · {b.days} days · {b.avgLoadKw} kW</div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase text-slate-500">Estimated total</div>
                <div className="text-xl font-bold text-slate-900">{fmt(b.estimate.total)}</div>
                <div className="text-xs text-slate-500">Paid {fmt(b.paid)}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Metered units: {b.usedKwh.toLocaleString("en-IN")} / {b.estimate.energyKwh.toLocaleString("en-IN")} kWh</span>
                <span>Unit charges so far {fmt(unitBill)}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all" style={{ width: pct + "%" }} />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {b.status === "Awaiting payment" && (
                <button onClick={() => onPay(b.id)} className="rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-semibold text-slate-950">Pay deposit {fmt(b.estimate.deposit)}</button>
              )}
              {["Confirmed", "En route", "On site"].includes(b.status) && (
                <button onClick={() => onSimulate(b)} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
                  {b.status === "Confirmed" ? "Simulate dispatch" : b.status === "En route" ? "Simulate arrival" : "Simulate completion"}
                </button>
              )}
              {["Awaiting payment", "Confirmed"].includes(b.status) && (
                <button onClick={() => onCancel(b.id)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Cancel</button>
              )}
              {["Cancelled", "Completed"].includes(b.status) && (
                <button onClick={() => onDelete(b.id)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Remove</button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/* ---------------- Payments ---------------- */

function Payments({
  bookings,
  selected,
  setSelected,
  onPaid,
}: {
  bookings: Booking[];
  selected: string | null;
  setSelected: (id: string | null) => void;
  onPaid: (id: string, method: string, amount: number) => void;
}) {
  const due = bookings.filter((b) => b.status === "Awaiting payment");
  const current = due.find((b) => b.id === selected) ?? due[0];
  const [method, setMethod] = useState("UPI");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });
  const [upi, setUpi] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<Booking | null>(null);
  const history = bookings.filter((b) => b.paid > 0);

  const canPay =
    method === "UPI" ? /^[\w.-]+@[\w]+$/.test(upi) : method === "Card" ? card.number.replace(/\s/g, "").length >= 15 && card.name && card.exp && card.cvv.length >= 3 : true;

  const pay = () => {
    if (!current) return;
    setProcessing(true);
    setTimeout(() => {
      onPaid(current.id, method, current.estimate.deposit);
      setSuccess(current);
      setProcessing(false);
      setSelected(null);
    }, 1400);
  };

  return (
    <div className="space-y-6">
      {success && (
        <Card className="border-emerald-200 bg-emerald-50">
          <div className="flex items-start gap-3">
            <div className="text-2xl">✅</div>
            <div>
              <div className="font-bold text-emerald-900">Deposit received — booking {success.id} confirmed</div>
              <p className="text-sm text-emerald-800">
                {fmt(success.estimate.deposit)} paid via {method}. Our dispatch team will contact {success.contact} at {success.email} to schedule the site survey.
                Metered units will be invoiced monthly.
              </p>
            </div>
            <button onClick={() => setSuccess(null)} className="ml-auto text-emerald-700">✕</button>
          </div>
        </Card>
      )}

      {current ? (
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <h3 className="font-bold text-slate-900">Pay booking deposit</h3>
            {due.length > 1 && (
              <select className={input} value={current.id} onChange={(e) => setSelected(e.target.value)}>
                {due.map((b) => <option key={b.id} value={b.id}>{b.id} · {b.truckName} · {fmt(b.estimate.deposit)}</option>)}
              </select>
            )}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["UPI", "Card", "Bank transfer"].map((m) => (
                <button key={m} onClick={() => setMethod(m)} className={cn("rounded-lg border-2 py-2 text-sm font-semibold", method === m ? "border-teal-500 bg-teal-50 text-teal-800" : "border-slate-200 text-slate-600")}>{m}</button>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              {method === "UPI" && (
                <label className="text-sm"><span className="text-slate-600">UPI ID</span><input className={input} placeholder="name@bank" value={upi} onChange={(e) => setUpi(e.target.value)} /></label>
              )}
              {method === "Card" && (
                <>
                  <label className="text-sm"><span className="text-slate-600">Card number</span><input className={input} placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} /></label>
                  <label className="text-sm"><span className="text-slate-600">Name on card</span><input className={input} value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} /></label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm"><span className="text-slate-600">Expiry</span><input className={input} placeholder="MM/YY" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} /></label>
                    <label className="text-sm"><span className="text-slate-600">CVV</span><input className={input} type="password" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} /></label>
                  </div>
                </>
              )}
              {method === "Bank transfer" && (
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  <div><b>Beneficiary:</b> GoCore Energy Concept Pvt. Ltd.</div>
                  <div><b>Account:</b> 0012 3456 7890 · <b>IFSC:</b> GOCR0000001</div>
                  <div><b>Reference:</b> {current.id}</div>
                  <p className="mt-2 text-xs text-slate-500">Click "Confirm" after initiating the transfer; we'll mark it confirmed on receipt.</p>
                </div>
              )}
            </div>
            <button onClick={pay} disabled={!canPay || processing} className="mt-6 w-full rounded-xl bg-teal-500 py-3 font-semibold text-slate-950 shadow-lg shadow-teal-500/30 disabled:opacity-40">
              {processing ? "Processing…" : `Pay ${fmt(current.estimate.deposit)}`}
            </button>
            <p className="mt-2 text-center text-xs text-slate-500">🔒 Demo payment — no real transaction is made.</p>
          </Card>
          <Card className="bg-slate-950 text-white lg:col-span-2">
            <div className="text-xs uppercase tracking-widest text-teal-400">Invoice preview · {current.id}</div>
            <div className="mt-2 font-semibold">{current.truckName}</div>
            <div className="text-sm text-slate-400">{current.org} · {current.city}</div>
            <dl className="mt-4 space-y-2 text-sm">
              {[
                ["Energy units (est.)", current.estimate.energyCost],
                ["Transport", current.estimate.transportCost],
                ["Crew standby", current.estimate.standbyCost],
                ["GST", current.estimate.tax],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between border-b border-white/10 pb-2"><dt className="text-slate-300">{k}</dt><dd>{fmt(v as number)}</dd></div>
              ))}
            </dl>
            <div className="mt-3 flex justify-between font-bold"><span>Estimated total</span><span>{fmt(current.estimate.total)}</span></div>
            <div className="mt-4 rounded-lg bg-teal-500/15 p-3">
              <div className="flex justify-between text-sm"><span>Deposit now</span><b className="text-teal-300">{fmt(current.estimate.deposit)}</b></div>
              <div className="flex justify-between text-xs text-slate-400"><span>Balance on metered units</span><span>{fmt(current.estimate.total - current.estimate.deposit)}</span></div>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-10 text-center text-slate-600">No payments due. Book a truck to get started.</Card>
      )}

      <Card>
        <h3 className="font-bold text-slate-900">Payment history</h3>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No payments yet.</p>
        ) : (
          <table className="mt-4 w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">Txn</th><th>Booking</th><th>Method</th><th className="text-right">Amount</th></tr></thead>
            <tbody>
              {history.map((b) => (
                <tr key={b.id} className="border-t border-slate-100">
                  <td className="py-2 font-mono text-xs">{b.txnId}</td>
                  <td>{b.id} · {b.truckName}</td>
                  <td>{b.paymentMethod}</td>
                  <td className="text-right font-semibold">{fmt(b.paid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
