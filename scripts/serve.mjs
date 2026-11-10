import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("dist");
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".md": "text/markdown; charset=utf-8" };

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
  const candidate = normalize(join(root, pathname));
  if (!candidate.startsWith(root)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  let file = candidate;
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) file = join(root, "404.html");
  response.writeHead(file.endsWith("404.html") ? 404 : 200, { "content-type": mime[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(response);
});

server.listen(4173, "127.0.0.1", () => console.log("Local: http://127.0.0.1:4173/"));
