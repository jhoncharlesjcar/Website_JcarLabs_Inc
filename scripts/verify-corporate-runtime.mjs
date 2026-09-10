import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const reference = JSON.parse(await fs.readFile('migration/corporate-reference/runtime.json', 'utf8'));
const report = JSON.parse(await fs.readFile('migration/reports/corporate-results.json', 'utf8'));
const knownErrors = new Set(reference.flatMap(({ errors }) => errors));
for (const result of report) {
  const introducedErrors = result.errors.filter((error) => !knownErrors.has(error));
  assert.deepEqual(introducedErrors, [], `New browser errors: ${result.width}px ${result.route}`);
}
for (const control of reference) {
  const current = report.find((result) => result.width === control.width && result.route === control.route);
  if (!current) continue;
  assert.equal(current.animations, control.appearMarkers, `Framer appear markers changed: ${control.width}px ${control.route}`);
  const state = JSON.parse(await fs.readFile(`migration/reports/corporate/${control.width}${control.route.replaceAll('/', '_')}.json`, 'utf8'));
  assert.equal(state.highlights, control.highlights, `Editorial highlight behavior changed: ${control.width}px ${control.route}`);
}
console.log(`PASS: ${report.length} browser cases introduce no errors beyond the preserved runtime; motion/highlight controls match.`);
