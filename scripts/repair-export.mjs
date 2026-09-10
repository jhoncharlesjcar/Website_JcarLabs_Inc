// ⚠️  AVISO: Este script opera sobre el export LEGACY en la raíz del repositorio.
//    NO modifica las fuentes de Astro en src/content/pages/.
//    Para actualizar contenido corporativo, usa: npm run content:generate
//    Ver PRODUCTION.md para el contexto completo de este script.
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const rootDirectory = path.resolve(scriptDirectory, "..")
const siteOrigin = "https://vertical.framer.media"
const socialImage = `${siteOrigin}/assets/images/image-extra-4.jpg`
const brandName = "JCAR Labs Inc."
const productionAssetRevision = "20260830-jcar41"
const cmsFetchShim = `<script data-local-cms-fetch>(function(){var f=window.fetch;window.fetch=function(u,o){var raw=typeof u==='string'?u:(u&&u.url?u.url:String(u||''));if(raw.includes('.framercms')){var parsed=new URL(raw,location.href);var file=parsed.pathname.split('/').pop();return f('/assets/cms/'+file+parsed.search,o)}return f(u,o)}})();</script>`

const workItems = [
  {
    slug: "sistema-hotelero",
    sourceSlug: "unstable-sequence",
    itemId: "YA9soS2fS",
    title: "Sistema Hotelero",
    description: "Sistema de gestión hotelera en Perú con facturación electrónica.",
  },
  {
    slug: "nezus-bisuteria",
    sourceSlug: "still-pressure",
    itemId: "PnYPEIIxF",
    title: "Nezus Bisutería",
    description: "E-commerce y presencia corporativa para una marca de joyería.",
  },
  {
    slug: "soluciones-empresariales",
    sourceSlug: "surface-tension",
    itemId: "tyjSPBEg7",
    title: "Soluciones Empresariales",
    description: "Plataforma de comunicación interna y gestión empresarial.",
  },
]

const serviceItems = [
  {
    slug: "desarrollo-web",
    sourceSlug: "beyond-ai-aesthetics-what-human-led-digital-art-means-now",
    itemId: "OHQeBJonM",
    title: "Desarrollo Web",
    description: "Sitios web modernos, responsivos y optimizados para buscadores.",
  },
  {
    slug: "inteligencia-artificial",
    sourceSlug: "when-images-begin-to-listen-the-quiet-power-of-responsive-art",
    itemId: "iioPEO0js",
    title: "Inteligencia Artificial",
    description: "Integración de modelos de IA y automatización de procesos.",
  },
  {
    slug: "desarrollo-full-stack",
    sourceSlug: "the-rise-of-experiential-minimalism-in-contemporary-exhibitions",
    itemId: "NlSoa7jyR",
    title: "Desarrollo Full Stack",
    description: "Desarrollo integral desde la base de datos hasta la interfaz de usuario.",
  },
  {
    slug: "software-empresarial",
    sourceSlug: "why-motion-first-art-is-defining-the-next-creative-era",
    itemId: "E1JiHignr",
    title: "Software Empresarial",
    description: "Sistemas a medida para organizar y escalar operaciones.",
  },
  {
    slug: "integraciones-sunat",
    sourceSlug: "why-slowness-is-becoming-a-radical-artistic-choice",
    itemId: "D6DUYZ83M",
    title: "Integraciones SUNAT",
    description: "Facturación electrónica conectada con la operación diaria.",
  },
]

const thoughtItems = [
  {
    slug: "beyond-ai-aesthetics-what-human-led-digital-art-means-now",
    itemId: "OHQeBJonM",
    datePublished: "2025-12-30",
    title: "Beyond AI Aesthetics: What Human-Led Digital Art Means Now",
    description: "AI reshaped creativity and pushed artists to redefine human originality in digital work.",
  },
  {
    slug: "when-images-begin-to-listen-the-quiet-power-of-responsive-art",
    itemId: "iioPEO0js",
    datePublished: "2025-10-29",
    title: "When Images Begin to Listen: The Quiet Power of Responsive Art",
    description: "How responsive art moves beyond touchscreens toward more attentive and meaningful interaction.",
  },
  {
    slug: "the-rise-of-experiential-minimalism-in-contemporary-exhibitions",
    itemId: "NlSoa7jyR",
    datePublished: "2025-12-03",
    title: "The Rise of Experiential Minimalism in Contemporary Exhibitions",
    description: "Why restrained environments and controlled intensity are reshaping contemporary exhibitions.",
  },
  {
    slug: "why-motion-first-art-is-defining-the-next-creative-era",
    itemId: "E1JiHignr",
    datePublished: "2025-12-04",
    title: "Why Motion-First Art Is Defining the Next Creative Era",
    description: "Motion-first thinking is reshaping art, branding, and digital experiences.",
  },
  {
    slug: "why-slowness-is-becoming-a-radical-artistic-choice",
    itemId: "D6DUYZ83M",
    datePublished: "2025-10-01",
    title: "Why Slowness Is Becoming a Radical Artistic Choice",
    description: "Artists are using slowness as a deliberate response to speed, constant refresh, and instant gratification.",
  },
]

const topLevelMetadata = {
  "index.html": {
    title: "JCAR Labs Inc. — Desarrollo Web, Software e Inteligencia Artificial",
    description: "JCAR Labs Inc. desarrolla sitios web, software a medida y soluciones de inteligencia artificial para transformar ideas en productos digitales.",
    canonical: `${siteOrigin}/`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: brandName,
      url: `${siteOrigin}/`,
      email: "mailto:contacto@jcarlabs.com",
      telephone: "+51 904 615 337",
      contactPoint: { "@type": "ContactPoint", contactType: "sales", telephone: "+51 904 615 337", email: "contacto@jcarlabs.com", availableLanguage: "Spanish" },
    },
  },
  "work/index.html": {
    title: "Proyectos — JCAR Labs Inc.",
    description: "Proyectos de desarrollo web, comercio electrónico y software empresarial creados por JCAR Labs Inc.",
    canonical: `${siteOrigin}/work`,
    structuredData: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Proyectos de JCAR Labs Inc.", url: `${siteOrigin}/work` },
  },
  "thoughts/index.html": {
    title: "Servicios — JCAR Labs Inc.",
    description: "Desarrollo web, inteligencia artificial y desarrollo full stack para empresas.",
    canonical: `${siteOrigin}/services`,
    structuredData: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Servicios de JCAR Labs Inc.", url: `${siteOrigin}/services` },
  },
  "services/index.html": {
    title: "Servicios — JCAR Labs Inc.",
    description: "Desarrollo web, inteligencia artificial y desarrollo full stack para empresas.",
    canonical: `${siteOrigin}/services`,
    structuredData: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Servicios de JCAR Labs Inc.", url: `${siteOrigin}/services` },
  },
  "contact/index.html": {
    title: "Contacto — JCAR Labs Inc.",
    description: "Conversa con JCAR Labs Inc. sobre desarrollo web, software a medida, automatización e inteligencia artificial.",
    canonical: `${siteOrigin}/contact`,
    structuredData: { "@context": "https://schema.org", "@type": "ContactPage", name: "Contacto de JCAR Labs Inc.", url: `${siteOrigin}/contact` },
  },
  "privacy-policy/index.html": {
    title: "Política de privacidad — JCAR Labs Inc.",
    description: "Política de privacidad del portafolio de JCAR Labs Inc.",
    canonical: `${siteOrigin}/privacy-policy`,
    structuredData: { "@context": "https://schema.org", "@type": "WebPage", name: "Privacy Policy", url: `${siteOrigin}/privacy-policy` },
  },
  "terms-of-use/index.html": {
    title: "Términos de uso — JCAR Labs Inc.",
    description: "Términos que regulan el uso del portafolio de JCAR Labs Inc.",
    canonical: `${siteOrigin}/terms-of-use`,
    structuredData: { "@context": "https://schema.org", "@type": "WebPage", name: "Terms of Use", url: `${siteOrigin}/terms-of-use` },
  },
  "404/index.html": {
    title: "Página no encontrada — JCAR Labs Inc.",
    description: "No encontramos la página solicitada.",
    canonical: `${siteOrigin}/404`,
  },
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function prepareHtml(html) {
  let output = html
    .replace(/<link rel="stylesheet" href="\/overrides\.css(?:\?[^\"]*)?">/g, "")
    .replace(/<script src="\/accessibility\.js(?:\?[^\"]*)?" defer><\/script>/g, "")
    .replace(/<script src="\/brand-content\.js(?:\?[^\"]*)?" defer><\/script>/g, "")
    .replace(/<script(?: data-local-cms-fetch)?[^>]*>\(function\(\)\{var f=window\.fetch;[\s\S]*?<\/script>/g, "")

  output = output.replace(/<link rel="stylesheet" href="\/?styles\.css">/, (match) => `${match}<link rel="stylesheet" href="/overrides.css?v=${productionAssetRevision}">`)
  output = output.replace("</base>", `</base>${cmsFetchShim}`)
  if (!output.includes("data-local-cms-fetch")) output = output.replace(/<base href="[^"]*">/, (match) => `${match}${cmsFetchShim}`)
  output = output.replace("</head>", `<script src="/brand-content.js?v=${productionAssetRevision}" defer></script><script src="/accessibility.js?v=${productionAssetRevision}" defer></script></head>`)
  output = output.replace(/<html\s+lang="[^"]*"/i, '<html lang="es"')

  output = output.replace('<div id="template-overlay"></div>', "")
  return output
}

function setMetadata(html, { title, description, canonical, structuredData }) {
  const pageTitle = title.includes(brandName) ? title : `${title} — ${brandName}`
  const escapedTitle = escapeHtml(pageTitle)
  const escapedDescription = escapeHtml(description)
  const escapedCanonical = escapeHtml(canonical)

  let output = html
    .replace(/<script id="site-structured-data"[^>]*>[\s\S]*?<\/script>/, "")
    .replace(/<script data-production-metadata[^>]*>[\s\S]*?<\/script>/, "")
    .replace(/<title>[^<]*<\/title>/, `<title>${escapedTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapedDescription}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapedTitle}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapedDescription}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapedTitle}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapedDescription}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${escapedCanonical}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${escapedCanonical}">`)
    .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${socialImage}">`)
    .replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${socialImage}">`)

  if (structuredData) {
    const jsonLd = JSON.stringify(structuredData).replaceAll("<", "\\u003c")
    output = output.replace("</head>", `<script id="site-structured-data" type="application/ld+json">${jsonLd}</script></head>`)
  }

  const runtimeData = JSON.stringify({ title: pageTitle, description }).replaceAll("<", "\\u003c")
  const runtimeScript = `<script data-production-metadata>(()=>{const m=${runtimeData};const a=()=>{if(document.title!==m.title)document.title=m.title;const d=document.querySelector('meta[name="description"]');if(d&&d.content!==m.description)d.content=m.description};a();const o=new MutationObserver(a);o.observe(document.head,{subtree:true,childList:true,attributes:true});setTimeout(()=>{a();o.disconnect()},4000)})()</script>`
  return output.replace("</body>", `${runtimeScript}</body>`)
}

function prepareInteractivePage(html) {
  // Keep the native Framer hydration marker and runtime bundle intact. They
  // drive the exported layout, reveal animations, variants, and interactions.
  let output = html
  output = output.replace(/<html\b[^>]*>/i, (tag) => {
    const classes = [...tag.matchAll(/\sclass="([^"]*)"/g)].flatMap((match) => match[1].split(/\s+/)).filter((name) => name && name !== "jcar-static-page")
    const mergedClasses = [...new Set([...classes, "jcar-interactive-page"])].join(" ")
    return tag.replace(/\sclass="[^"]*"/g, "").replace(/>$/, ` class="${mergedClasses}">`)
  })
  return output
}

async function writeDynamicPages({ source, detailRouteId, pathVariable, breakpoints, routePrefix, items }) {
  for (const item of items) {
    const sourcePath = path.join(rootDirectory, source, item.sourceSlug, "index.html")
    const canonical = `${siteOrigin}/${routePrefix}/${item.slug}`
    let html = prepareInteractivePage(prepareHtml(await fs.readFile(sourcePath, "utf8")))
    const structuredData = routePrefix === "work"
      ? { "@context": "https://schema.org", "@type": "CreativeWork", name: item.title, description: item.description, url: canonical, creator: { "@type": "Organization", name: brandName } }
      : { "@context": "https://schema.org", "@type": "Service", name: item.title, description: item.description, url: canonical, provider: { "@type": "Organization", name: brandName } }
    html = setMetadata(html, { ...item, canonical, structuredData })

    const outputDirectory = path.join(rootDirectory, routePrefix, item.slug)
    await fs.mkdir(outputDirectory, { recursive: true })
    await fs.writeFile(path.join(outputDirectory, "index.html"), html, "utf8")
  }
}

async function cleanTopLevelPages() {
  for (const [relativePath, metadata] of Object.entries(topLevelMetadata)) {
    const filePath = path.join(rootDirectory, relativePath)
    let html = setMetadata(prepareHtml(await fs.readFile(filePath, "utf8")), metadata)
    if ([
      "work/index.html",
      "thoughts/index.html",
      "services/index.html",
      "contact/index.html",
      "privacy-policy/index.html",
      "terms-of-use/index.html",
      "404/index.html",
    ].includes(relativePath)) {
      html = prepareInteractivePage(html)
    }
    await fs.writeFile(filePath, html, "utf8")
  }
}

async function createServicesIndex() {
  const sourcePath = path.join(rootDirectory, "thoughts", "index.html")
  const outputDirectory = path.join(rootDirectory, "services")
  await fs.mkdir(outputDirectory, { recursive: true })
  await fs.copyFile(sourcePath, path.join(outputDirectory, "index.html"))
}

async function writeDiscoveryFiles() {
  const routes = [
    "", "work", "services", "contact", "privacy-policy", "terms-of-use",
    ...workItems.map((item) => `work/${item.slug}`),
    ...serviceItems.map((item) => `services/${item.slug}`),
  ]
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${siteOrigin}/${route}</loc></url>`).join("\n")}\n</urlset>\n`
  await fs.writeFile(path.join(rootDirectory, "sitemap.xml"), sitemap, "utf8")
  await fs.writeFile(path.join(rootDirectory, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`, "utf8")
}

await createServicesIndex()
await cleanTopLevelPages()

await writeDynamicPages({
  source: "work",
  detailRouteId: "yBlTl8xnu",
  pathVariable: "fKGtoKC1r",
  breakpoints: [
    { hash: "1yhvz1a", mediaQuery: "(min-width: 1200px)" },
    { hash: "oabn1r", mediaQuery: "(min-width: 810px) and (max-width: 1199.98px)" },
    { hash: "10d7mb8", mediaQuery: "(max-width: 809.98px)" },
    { hash: "1agdyil", mediaQuery: "(min-width: 1200px)" },
    { hash: "acnwf", mediaQuery: "(min-width: 810px) and (max-width: 1199.98px)" },
    { hash: "fqooh", mediaQuery: "(max-width: 809.98px)" },
  ],
  routePrefix: "work",
  items: workItems,
})

await writeDynamicPages({
  source: "thoughts",
  detailRouteId: "ZIcuEFmrV",
  pathVariable: "bjAKXemmt",
  breakpoints: [
    { hash: "1guz46k", mediaQuery: "(min-width: 1200px)" },
    { hash: "ziyve2", mediaQuery: "(min-width: 810px) and (max-width: 1199.98px)" },
    { hash: "1wiy2vc", mediaQuery: "(max-width: 809.98px)" },
    { hash: "1agdyil", mediaQuery: "(min-width: 1200px)" },
    { hash: "acnwf", mediaQuery: "(min-width: 810px) and (max-width: 1199.98px)" },
    { hash: "fqooh", mediaQuery: "(max-width: 809.98px)" },
  ],
  routePrefix: "services",
  items: serviceItems,
})

await writeDiscoveryFiles()

console.log("JCAR Labs export regenerated: branded content, 3 projects, 5 services, metadata, sitemap, and accessibility hooks.")
