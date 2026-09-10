import { parse } from 'parse5';
import manifest from '../content/routes.json';
import { corporateDocument } from './corporate-document.mjs';

// These are trusted, versioned exports. Never pass user input to this renderer.
const sources = import.meta.glob<string>('../content/pages/**/*.html', {
  query: '?raw', import: 'default', eager: true,
});

export const routes = manifest;

export function getDocument(route: string) {
  const entry = routes.find((candidate) => candidate.route === route);
  if (!entry) throw new Error(`Unknown preserved route: ${route}`);
  const source = corporateDocument(sources[`../content/pages/${entry.file}`], route);
  if (!source) throw new Error(`Missing preserved document: ${entry.file}`);
  const tree = parse(source, { sourceCodeLocationInfo: true });
  const html = tree.childNodes.find((node) => node.nodeName === 'html');
  if (!html || !('tagName' in html)) throw new Error(`Missing html: ${route}`);
  const head = html.childNodes.find((node) => node.nodeName === 'head');
  const body = html.childNodes.find((node) => node.nodeName === 'body');
  if (!head || !body || !('tagName' in head) || !('tagName' in body)) {
    throw new Error(`Invalid document: ${route}`);
  }
  function contents(node: typeof head) {
    if (!node || !('tagName' in node)) throw new Error('Invalid element');
    const location = node.sourceCodeLocation;
    if (!location?.startTag || !location.endTag) throw new Error('Missing document boundaries');
    return source.slice(location.startTag.endOffset, location.endTag.startOffset);
  }
  return {
    htmlAttributes: Object.fromEntries(html.attrs.map(({ name, value }) => [name, value])),
    headAttributes: Object.fromEntries(head.attrs.map(({ name, value }) => [name, value])),
    bodyAttributes: Object.fromEntries(body.attrs.map(({ name, value }) => [name, value])),
    head: contents(head), body: contents(body),
  };
}
