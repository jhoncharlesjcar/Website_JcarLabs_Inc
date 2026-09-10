import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createSiteServer } from '../src/server/http.mjs';

const rootDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
try { await access(new URL('../dist/index.html', import.meta.url)); }
catch { console.error('Build missing. Run npm run build before npm start.'); process.exit(1); }
const port = Number(process.env.PORT || 4321);
const host = process.env.HOST || '127.0.0.1';
const server = createSiteServer({ rootDirectory });
server.listen(port, host, () => console.log(`JCAR Labs (Astro build): http://${host}:${port}`));
