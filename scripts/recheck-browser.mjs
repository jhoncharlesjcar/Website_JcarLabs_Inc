import { readFileSync, copyFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
const report = JSON.parse(readFileSync('migration/reports/browser-results.json', 'utf8'));
const failed = report.results.filter((result) => result.status !== 'passed');
if (!failed.length) { console.log('No failed comparisons to recheck.'); process.exit(0); }
copyFileSync('migration/reports/browser-results.json', 'migration/reports/browser-before-recheck.json');
const pattern = failed.map((result) => result.test.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
console.log(`Rechecking ${failed.length} comparisons; retaining ${report.passed} successful results.`);
const child = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', '--workers=2', '--grep', pattern], {
  stdio: 'inherit', env: { ...process.env, JCAR_MERGE_BROWSER_REPORT: '1' },
});
child.on('error', (error) => { console.error(error); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code || 0; });
