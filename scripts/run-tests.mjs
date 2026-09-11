import { glob } from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { run } from 'node:test';
import { spec } from 'node:test/reporters';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const files = [];
for await (const file of glob('**/*.test.mjs', { cwd: root })) {
  if (file.split(/[\\/]/).includes('node_modules')) continue;
  files.push(path.join(root, file));
}
files.sort();

if (!files.length) {
  console.error('No *.test.mjs files found.');
  process.exit(1);
}

const stream = run({ files });
stream.on('test:fail', () => {
  process.exitCode = 1;
});
await pipeline(stream, spec(), process.stdout);
