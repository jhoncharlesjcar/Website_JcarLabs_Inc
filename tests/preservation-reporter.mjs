import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
export default class PreservationReporter {
  records = [];
  onBegin() {
    mkdirSync('migration/reports', { recursive: true });
    if (process.env.JCAR_MERGE_BROWSER_REPORT === '1') this.records = JSON.parse(readFileSync('migration/reports/browser-results.json', 'utf8')).results;
    this.save();
  }
  onTestEnd(test, result) {
    this.records = this.records.filter((record) => record.test !== test.title);
    this.records.push({ test: test.title, status: result.status, durationMs: result.duration, measurements: test.annotations, errors: result.errors.map((error) => error.message) });
    this.save();
  }
  save() {
    writeFileSync('migration/reports/browser-results.json', JSON.stringify({ updatedAt: new Date().toISOString(), completed: this.records.length, passed: this.records.filter((record) => record.status === 'passed').length, results: this.records }, null, 2));
  }
}
