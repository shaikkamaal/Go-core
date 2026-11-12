// Zero-dependency static file server for the production build (dist/).
// Used by `npm start` — e.g. on Render as a Node Web Service.
// Serves dist/ on 0.0.0.0:$PORT with the same headers as nginx.conf.

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("./dist", import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

if (!existsSync(join(ROOT, "index.html"))) {
  console.error("dist/index.html not found — run `npm run build` first.");
  process.exit(1);
}

const server = createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Bad request");
    return;
  }

  // Resolve inside dist/ only (block path traversal).
  let filePath = resolve(ROOT, pathname.replace(/^\/+/, ""));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + sep)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html");
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    // SPA fallback: paths without a file extension get index.html
    // (this site uses hash routing, so this is mostly for convenience).
    if (extname(pathname) === "") {
      filePath = join(ROOT, "index.html");
    } else {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
  }

  const headers = {
    "Content-Type": MIME[extname(filePath).toLowerCase()] ?? "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };
  if (filePath === join(ROOT, "index.html")) {
    // index.html must always be revalidated (JS/CSS are inlined into it)
    headers["Cache-Control"] = "no-cache";
  } else if (pathname.startsWith("/images/")) {
    headers["Cache-Control"] = "public, max-age=31536000, immutable";
  }

  res.writeHead(200, headers);
  createReadStream(filePath).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`GoCore serving dist/ at http://${HOST}:${PORT}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
