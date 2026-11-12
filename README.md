# GoCore — Pay-per-use Transportable Microreactor (Conceptual)

Customer-facing website + booking dashboard for GoCore trucks. Trucks are **never sold** — revenue = metered energy units + transport charges (+ crew standby).

> **Disclosure:** GoCore is a conceptual project. No functioning nuclear reactor exists; the first prototype is a non-nuclear tabletop demonstration. All figures on the site are illustrative.

## Stack
React 19 · Vite 7 · Tailwind CSS 4 · TypeScript. Output is a single self-contained `dist/index.html` (via `vite-plugin-singlefile`) plus `dist/images/*`.
Routing is hash-based (`#/dashboard`), so **no server rewrite rules are needed** on any host.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs ./dist
npm run preview    # serve the production build locally
```

## Deploy (pick one — all configs are already in the repo)

### Option 1 — Netlify (fastest, drag & drop)
1. `npm install && npm run build`
2. Go to https://app.netlify.com/drop and drag the **`dist`** folder in. Done.
   *Or* connect the Git repo — `netlify.toml` sets build command `npm run build` and publish dir `dist`.

### Option 2 — Vercel
```bash
npm i -g vercel
vercel --prod
```
`vercel.json` already sets the Vite framework preset, output dir and headers. Or import the repo at https://vercel.com/new.

### Option 3 — Render
This is a **static site** (no server), so create a **Static Site**, *not* a Web Service:
1. Render Dashboard → **New → Static Site** → connect the repo (or **New → Blueprint** — `render.yaml` sets everything automatically).
2. If creating manually: **Build Command** `npm ci && npm run build`, **Publish Directory** `dist`.
3. Deploy. Done.

> **`Error: Command "start" not found`?** That means the service was created as a **Web Service** (Node). Render's Web Service runs `npm start`, but this project has no `start` script because it needs no server. Fix: delete the Web Service and create a **Static Site** (above). Alternatives: set the Web Service's *Environment* to **Docker** (the `Dockerfile` builds with Node and serves via nginx), or keep it Node and set *Start Command* to `npm run preview -- --host 0.0.0.0 --port $PORT`.

### Option 4 — GitHub Pages (automatic)
1. Push this project to a GitHub repo on branch `main`.
2. Repo → **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml` and publishes the site.

### Option 5 — Docker / your own server
```bash
docker build -t gocore-web .
docker run -d -p 80:80 --name gocore gocore-web
```
Uses a multi-stage build (Node → nginx) with gzip, caching and security headers (`nginx.conf`).

### Option 6 — Any static host (S3 + CloudFront, Firebase Hosting, cPanel…)
Upload the contents of `dist/` to the web root. That's all.

### Custom domain + HTTPS
Add your domain in the host's dashboard (Netlify/Vercel/GitHub Pages all issue free HTTPS certificates) and point a CNAME/A record as instructed.

## ⚠️ Before taking real bookings or money
This build is a **front-end demo**. Specifically:

| Area | Current behaviour | Needed for production |
|---|---|---|
| Bookings | Saved in the visitor's browser (`localStorage`) | Backend + database (e.g. Supabase / Firebase / Node + Postgres) |
| Login | None — dashboard is open | Customer authentication (email OTP / OAuth) |
| Payments | Simulated, **no real charge** | Payment gateway (Razorpay / Stripe) with server-side order creation + webhook verification |
| Metered kWh | Simulated via buttons | Telemetry feed from the sealed revenue meter on each truck |
| Notifications | None | Email/SMS on booking, dispatch, invoice |
| Legal | Footer disclosure + consent checkbox | Terms, privacy policy, and — for any real nuclear service — national regulator licensing and transport certification |

Never put payment-gateway **secret** keys in this front-end code; they belong on a server.

## Project structure
```
src/
  App.tsx              # shell + hash router
  data.ts              # fleet, rates, depots, estimator maths (edit prices here)
  store.ts             # bookings persistence (localStorage hook)
  components/Layout.tsx
  pages/               # Home, Technology, Fleet, Pricing, Safety, Dashboard
public/
  images/              # hero + prototype images
```

**Change prices / trucks:** edit `TRUCKS` and `CURRENCY` in `src/data.ts`.
