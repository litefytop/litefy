// Local static server that applies public/_headers so CSP can be verified in a browser.
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const root = process.argv[2] || "build/client";
const port = Number(process.argv[3]) || 8877;

const headerLines = (await readFile("public/_headers", "utf8")).split("\n");
const custom = {};
let collect = false;
for (const line of headerLines) {
  if (!line.startsWith("  ")) { collect = line.trim() === "/*"; continue; }
  if (!collect) continue;
  const idx = line.indexOf(":");
  if (idx > 0) custom[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
}

const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml", ".md": "text/markdown",
};

const reports = [];
const reportOnlyPolicy = `${custom["Content-Security-Policy"]}; report-uri /__csp-report`;

http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (pathname === "/__csp-dump") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(reports, null, 2));
    return;
  }
  if (pathname === "/__csp-report") {
    let body = "";
    for await (const chunk of req) body += chunk;
    try { reports.push(JSON.parse(body)["csp-report"]); } catch { reports.push(body); }
    res.writeHead(204); res.end();
    return;
  }
  try {
    let p = pathname;
    if (p.endsWith("/")) p += "index.html";
    let file = join(root, p);
    try {
      const st = await stat(file);
      if (st.isDirectory()) file = join(file, "index.html");
      else if (!st.isFile()) throw new Error("not file");
    } catch {
      try { file = join(file, "index.html"); }
      catch { file = join(root, "__spa-fallback.html"); }
    }
    const body = await readFile(file);
    const headers = {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      ...custom,
    };
    if (extname(file) === ".html") {
      headers["Content-Security-Policy-Report-Only"] = reportOnlyPolicy;
    }
    res.writeHead(200, headers);
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain", ...custom });
    res.end("not found");
  }
}).listen(port, () => console.log(`serving ${root} on http://localhost:${port} with _headers applied`));
