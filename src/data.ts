export type Truck = {
  id: string;
  name: string;
  tier: "Compact" | "Standard" | "Heavy";
  outputKw: number;
  peakKw: number;
  footprint: string;
  weightT: number;
  setupHours: number;
  ratePerKwh: number; // currency per kWh
  dailyStandby: number; // currency per day
  transportPerKm: number; // currency per km
  minDays: number;
  bestFor: string[];
  status: "Available" | "Deployed" | "Maintenance";
  color: string;
};

export const CURRENCY = "₹";

export const TRUCKS: Truck[] = [
  {
    id: "GC-C1",
    name: "GoCore Compact",
    tier: "Compact",
    outputKw: 250,
    peakKw: 320,
    footprint: "12 m × 3 m",
    weightT: 28,
    setupHours: 6,
    ratePerKwh: 9.5,
    dailyStandby: 18000,
    transportPerKm: 95,
    minDays: 3,
    bestFor: ["Hospitals", "Disaster relief", "Remote villages"],
    status: "Available",
    color: "from-cyan-500 to-teal-500",
  },
  {
    id: "GC-S2",
    name: "GoCore Standard",
    tier: "Standard",
    outputKw: 1000,
    peakKw: 1250,
    footprint: "16 m × 3.2 m",
    weightT: 42,
    setupHours: 12,
    ratePerKwh: 8.2,
    dailyStandby: 45000,
    transportPerKm: 140,
    minDays: 7,
    bestFor: ["Mining sites", "Industrial facilities", "Construction camps"],
    status: "Available",
    color: "from-teal-500 to-emerald-500",
  },
  {
    id: "GC-H3",
    name: "GoCore Heavy",
    tier: "Heavy",
    outputKw: 3000,
    peakKw: 3600,
    footprint: "2 × 16 m trailers",
    weightT: 85,
    setupHours: 24,
    ratePerKwh: 7.1,
    dailyStandby: 110000,
    transportPerKm: 260,
    minDays: 14,
    bestFor: ["Strategic installations", "Large industry", "Grid support"],
    status: "Deployed",
    color: "from-amber-500 to-orange-500",
  },
];

export const USE_CASES = [
  {
    title: "Remote villages & mining sites",
    desc: "Continuous baseload power where diesel logistics are expensive and grid lines never arrived.",
    icon: "⛰️",
  },
  {
    title: "Hospitals & disaster-hit areas",
    desc: "Rolls in within hours of an outage. Keeps ICUs, cold-chains and water pumps running for weeks.",
    icon: "🏥",
  },
  {
    title: "Industrial facilities",
    desc: "Dedicated, stable supply for plants that cannot afford voltage dips or diesel price swings.",
    icon: "🏭",
  },
  {
    title: "Military & strategic locations",
    desc: "Fuel-independent power for forward bases, radar sites and critical communication nodes.",
    icon: "🛡️",
  },
];

export const STEPS = [
  {
    n: "01",
    title: "Request a truck",
    desc: "Tell us the site, dates and expected load. Our estimator prices units + transport instantly.",
  },
  {
    n: "02",
    title: "Site survey & route plan",
    desc: "We verify access, grounding, exclusion zone and the approved transport corridor.",
  },
  {
    n: "03",
    title: "Roll in & connect",
    desc: "The sealed module parks, levels, and connects to your switchgear. Power in 6–24 hours.",
  },
  {
    n: "04",
    title: "Pay per unit used",
    desc: "A metered connection logs every kWh. You are billed only for energy used plus transport.",
  },
];

export const EXCLUDED = [
  "Real nuclear fuel or a functioning reactor core",
  "Fuel reprocessing",
  "Actual radiation monitoring instruments",
  "Certified nuclear shielding",
  "Full-scale power generation",
  "AI-based reactor control",
  "Transport or regulatory approvals",
];

export const CHALLENGES = [
  {
    title: "Thorium fuel-cycle complexity",
    desc: "Th-232 is fertile, not fissile. It must absorb a neutron and decay via Pa-233 into fissile U-233 — a breeding step that needs a driver fuel and careful neutron economy.",
  },
  {
    title: "Shielding & safety",
    desc: "U-233 comes with U-232 traces whose decay chain emits hard gamma rays. A road-transportable unit needs heavy, certified shielding without exceeding axle limits.",
  },
  {
    title: "Heat removal",
    desc: "Even a 1 MWe module rejects several megawatts of heat. Passive decay-heat removal must work with no power, no operator, in any climate.",
  },
  {
    title: "Transportation restrictions",
    desc: "Moving nuclear material by road is governed by national regulators and IAEA transport rules. Routes, escorts and approvals are non-trivial.",
  },
  {
    title: "Economic & environmental feasibility",
    desc: "Must beat diesel gensets on total cost over a deployment while meeting waste and decommissioning obligations.",
  },
];

export const FAQ = [
  {
    q: "Is GoCore a working nuclear reactor?",
    a: "No. GoCore is a conceptual energy project. Our first prototype is a non-nuclear tabletop demonstration of the engineering concept, with an LED mock core, simulated heat-transfer loop and a simulated dashboard. This website shows how the pay-per-use service would work once such a system were licensed.",
  },
  {
    q: "Why thorium?",
    a: "Thorium is roughly three to four times more abundant than uranium, produces less long-lived transuranic waste, and the fuel form is proliferation-resistant. Its drawback: Th-232 is fertile and must first be bred into U-233 inside a reactor.",
  },
  {
    q: "How am I billed?",
    a: "Two components only: energy units (kWh) measured by a sealed meter at your switchgear, and transport charges based on the road distance from our nearest depot. A small daily standby fee covers the on-site crew. Trucks are never sold.",
  },
  {
    q: "How fast can a truck arrive?",
    a: "For emergency bookings we target 24–72 hours depending on depot distance and route approvals. Planned deployments are scheduled with a site survey first.",
  },
  {
    q: "What do I need to prepare at the site?",
    a: "A level hardstand (about 20 m × 8 m), an exclusion fence perimeter, a grounding point and a connection to your main switchgear. Our survey team confirms everything before dispatch.",
  },
];

export const DEPOTS = [
  { name: "Nagpur Central Depot", lat: 21.1458, lng: 79.0882 },
  { name: "Hyderabad Depot", lat: 17.385, lng: 78.4867 },
  { name: "Guwahati Depot", lat: 26.1445, lng: 91.7362 },
  { name: "Jaipur Depot", lat: 26.9124, lng: 75.7873 },
];

export const CITIES: Record<string, { lat: number; lng: number }> = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Bhopal: { lat: 23.2599, lng: 77.4126 },
  Raipur: { lat: 21.2514, lng: 81.6296 },
  Ranchi: { lat: 23.3441, lng: 85.3096 },
  Leh: { lat: 34.1526, lng: 77.5771 },
  Itanagar: { lat: 27.0844, lng: 93.6053 },
  Jodhpur: { lat: 26.2389, lng: 73.0243 },
  Visakhapatnam: { lat: 17.6868, lng: 83.2185 },
  Kochi: { lat: 9.9312, lng: 76.2673 },
  Srinagar: { lat: 34.0837, lng: 74.7973 },
  Bhubaneswar: { lat: 20.2961, lng: 85.8245 },
};

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearestDepot(city: string) {
  const c = CITIES[city];
  if (!c) return { depot: DEPOTS[0], km: 500 };
  let best = DEPOTS[0];
  let bestKm = Infinity;
  for (const d of DEPOTS) {
    const km = haversineKm(c, d);
    if (km < bestKm) {
      bestKm = km;
      best = d;
    }
  }
  // road distance factor
  return { depot: best, km: Math.round(bestKm * 1.25) };
}

export type Estimate = {
  days: number;
  energyKwh: number;
  energyCost: number;
  transportKm: number;
  transportCost: number;
  standbyCost: number;
  subtotal: number;
  tax: number;
  total: number;
  deposit: number;
  depot: string;
};

export function estimate(truck: Truck, city: string, days: number, avgLoadKw: number, hoursPerDay: number): Estimate {
  const { depot, km } = nearestDepot(city);
  const load = Math.min(avgLoadKw, truck.outputKw);
  const energyKwh = Math.round(load * hoursPerDay * days);
  const energyCost = Math.round(energyKwh * truck.ratePerKwh);
  const transportKm = km * 2; // round trip
  const transportCost = Math.round(transportKm * truck.transportPerKm);
  const standbyCost = truck.dailyStandby * days;
  const subtotal = energyCost + transportCost + standbyCost;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  const deposit = Math.round(transportCost + standbyCost * 0.5);
  return { days, energyKwh, energyCost, transportKm, transportCost, standbyCost, subtotal, tax, total, deposit, depot: depot.name };
}

export function fmt(n: number) {
  return CURRENCY + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
