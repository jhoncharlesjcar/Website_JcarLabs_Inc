import { defineConfig } from '@playwright/test';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

function browserExecutable() {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  const cache = path.join(os.homedir(), '.cache/puppeteer/chrome');
  if (process.platform === 'win32' && existsSync(cache)) {
    for (const version of readdirSync(cache).sort().reverse()) {
      const executable = path.join(cache, version, 'chrome-win64/chrome.exe');
      if (existsSync(executable)) return executable;
    }
  }
  return undefined;
}
export default defineConfig({
  testDir: './tests/browser',
  timeout: 120_000,
  workers: 1,
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }], ['./tests/preservation-reporter.mjs']],
  use: { browserName: 'chromium', launchOptions: { executablePath: browserExecutable() } },
  webServer: [
    { command: 'node server.mjs', url: 'http://127.0.0.1:4319', env: { PORT: '4319' }, reuseExistingServer: false },
    { command: 'node scripts/serve.mjs', url: 'http://127.0.0.1:4320', env: { PORT: '4320' }, reuseExistingServer: false },
  ],
});
