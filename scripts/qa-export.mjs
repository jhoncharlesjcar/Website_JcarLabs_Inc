const baseUrl = process.env.SITE_URL || "http://127.0.0.1:4321"

const routes = [
  "/",
  "/work",
  "/services",
  "/contact",
  "/privacy-policy",
  "/terms-of-use",
  "/work/sistema-hotelero",
  "/work/nezus-bisuteria",
  "/work/soluciones-empresariales",
  "/work/fragile-perfection",
  "/work/silent-gravity",
  "/services/desarrollo-web",
  "/services/inteligencia-artificial",
  "/services/desarrollo-full-stack",
  "/services/software-empresarial",
  "/services/integraciones-sunat",
]

const titlePattern = /<title>(.*?)<\/title>/i
const canonicalPattern = /<link rel="canonical" href="([^"]+)"/i
const results = []

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`)
  const html = await response.text()
  const title = html.match(titlePattern)?.[1] || ""
  const canonical = html.match(canonicalPattern)?.[1] || ""
  const framerRuntime = html.includes("data-framer-hydrate-v2") && html.includes('data-framer-bundle="main"')
  const passed = response.status === 200 && Boolean(title) && !canonical && framerRuntime
  results.push({ route, status: response.status, title, canonical, passed })
  console.log(`${passed ? "PASS" : "FAIL"} ${response.status} ${route} | ${title}`)
}

for (const route of ["/robots.txt", "/sitemap.xml"]) {
  const response = await fetch(`${baseUrl}${route}`)
  const passed = response.status === 200 && !(await response.text()).includes("vertical.framer.media")
  results.push({ route, status: response.status, passed })
  console.log(`${passed ? "PASS" : "FAIL"} ${response.status} ${route}`)
}

const serverChecks = [
  {
    name: "security headers",
    request: () => fetch(`${baseUrl}/`, { method: "HEAD" }),
    // [2.1] Verificar X-Frame-Options + CSP + ETag
    validate: (response) => response.status === 200
      && Boolean(response.headers.get("content-security-policy"))
      && Boolean(response.headers.get("x-frame-options"))
      && Boolean(response.headers.get("etag")),
  },
  {
    name: "Brotli compression",
    request: () => fetch(`${baseUrl}/styles.css`, { headers: { "Accept-Encoding": "br" } }),
    validate: (response) => response.status === 200 && response.headers.get("content-encoding") === "br",
  },
  {
    name: "video byte ranges",
    request: () => fetch(`${baseUrl}/assets/videos/video-video-1.mp4`, { headers: { Range: "bytes=0-1023", "Accept-Encoding": "identity" } }),
    validate: (response) => response.status === 206 && response.headers.get("content-length") === "1024" && response.headers.get("content-range")?.startsWith("bytes 0-1023/"),
  },
  {
    name: "Framer CMS query ranges",
    request: () => fetch(`${baseUrl}/assets/cms/PuvR7bUan-indexes-default-0.framercms?range=0-144`, { headers: { "Accept-Encoding": "identity" } }),
    validate: (response) => response.status === 200 && response.headers.get("content-length") === "145" && response.headers.get("cache-control") === "no-cache",
  },
  {
    name: "real 404 response",
    request: () => fetch(`${baseUrl}/qa-route-that-does-not-exist`),
    validate: (response) => response.status === 404 && response.headers.get("cache-control") === "no-cache",
  },
  {
    name: "legacy Thoughts redirect",
    request: () => fetch(`${baseUrl}/thoughts`, { redirect: "manual" }),
    validate: (response) => response.status === 301 && response.headers.get("location") === "/services",
  },
  {
    // [1.2] Verificar que no hay referencias a vertical.framer.media en el HTML renderizado
    name: "sin referencias a vertical.framer.media en home",
    request: () => fetch(`${baseUrl}/`),
    validate: async (response) => !(await response.text()).includes("vertical.framer.media"),
  },
  {
    // [SEO-01] Verificar que la descripción SEO de la home es la corporativa actualizada
    name: "descripción SEO corporativa en home",
    request: () => fetch(`${baseUrl}/`),
    validate: async (response) => {
      const html = await response.text()
      const desc = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)?.[1]
                || html.match(/<meta[^>]*content="([^"]+)"[^>]*name="description"/i)?.[1]
                || ''
      return desc.includes('Ingeniería de software') || desc.includes('JCAR Labs')
    },
  },
  {
    // [3.1] Verificar noindex en páginas /thoughts/*
    name: "noindex en thoughts/",
    request: () => fetch(`${baseUrl}/thoughts/beyond-ai-aesthetics-what-human-led-digital-art-means-now`),
    validate: async (response) => (await response.text()).includes('noindex'),
  },
]

for (const check of serverChecks) {
  const response = await check.request()
  const passed = check.validate(response)
  results.push({ route: check.name, status: response.status, passed })
  console.log(`${passed ? "PASS" : "FAIL"} ${response.status} ${check.name}`)
  await response.body?.cancel()
}

const failed = results.filter((result) => !result.passed)
console.log(`\n${results.length - failed.length}/${results.length} comprobaciones superadas.`)
if (failed.length) process.exitCode = 1
