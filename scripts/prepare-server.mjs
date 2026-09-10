// One-time extraction of the existing transport. The legacy server stays intact.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
let source = await readFile(new URL('server.mjs', root), 'utf8');
source = source.replace("import { fileURLToPath } from 'url';", '');
source = source.replace(/const __filename =[\s\S]*?const PORT =[^\n]+\n/, '');
source = source.replace('const server = http.createServer(async (req, res) => {', 'export function createSiteServer({ rootDirectory, logRequests = false }) {\nreturn http.createServer(async (req, res) => {');
source = source.replace('  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);', '  if (logRequests) console.log(`${req.method} ${req.url}`);');
source = source.replace('path.resolve(__dirname)', 'path.resolve(rootDirectory)');
source = source.replace("path.join(__dirname, '404', 'index.html')", "path.join(rootDirectory, '404.html')");
source = source.replace(/\nserver.listen\(PORT,[\s\S]*$/, '\n}\n');
// Astro's custom error page is emitted as 404.html, while /404 remains reachable.
source = source.replace("const relativeUrl = pathname.replace(/^[/\\\\]+/, '');", "const relativeUrl = pathname === '/404' || pathname === '/404/' ? '404.html' : pathname.replace(/^[/\\\\]+/, '');");
// Invalid URL encodings must not escape the async HTTP handler.
source = source.replace('const parsedUrl = new URL(req.url, `http://${req.headers.host}`);\n  const pathname = decodeURIComponent(parsedUrl.pathname);', `let parsedUrl;\n  let pathname;\n  try {\n    parsedUrl = new URL(req.url, 'http://localhost');\n    pathname = decodeURIComponent(parsedUrl.pathname);\n  } catch {\n    res.writeHead(400, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=UTF-8' });\n    res.end('400 Bad Request');\n    return;\n  }`);
await mkdir(new URL('src/server/', root), { recursive: true });
await writeFile(new URL('src/server/http.mjs', root), source, { flag: 'wx' });
console.log('Production transport extracted; legacy server unchanged.');
