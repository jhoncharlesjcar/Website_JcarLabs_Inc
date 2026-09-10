# JCAR Labs Inc. — Astro

Migración conservadora a **Astro 7 + TypeScript**, con compilación estática y rutas explícitas en un manifiesto. Se mantienen el diseño y los motores de interacción del export existente.

## Ejecutar

```sh
npm ci
npm run dev
```

Desarrollo: `http://127.0.0.1:4321`. El proyecto incluye Node 24 como dependencia de desarrollo; los comandos de npm lo utilizan sin modificar la instalación global.

```sh
npm run build
npm start
```

`npm start` sirve **dist/** en el mismo puerto 4321. Para despliegues Node, definir `HOST=0.0.0.0` y `PORT` según el proveedor. El runtime del servidor debe ser Node 22.19+ o 24. No ejecutar desarrollo y producción simultáneamente en el mismo puerto.

## Arquitectura

- `src/pages/`: entradas de Astro para inicio, páginas y 404.
- `src/layouts/PreservedDocument.astro`: documento compartido sin wrappers, estilos nuevos ni hidratación adicional.
- `src/content/routes.json`: 26 rutas originales.
- `src/content/pages/`: HTML preservado; es la fuente que compila Astro.
- `src/lib/documents.ts`: lectura y extracción tipada que conserva los contenidos de head/body.
- `public/`: CSS, JavaScript, bundles Framer/Motion/React, fuentes, imágenes, videos y CMS originales.
- `src/server/http.mjs`: transporte de producción, con redirecciones, compresión, caché, seguridad y rangos de video/CMS.
- `src/middleware.ts`: compatibilidad de URLs y redirecciones en desarrollo.
- `migration/baseline.json`: huellas SHA-256 de las 26 páginas y los 338 recursos.

La raíz conserva el export previo y `server.mjs` como referencia ejecutable mediante `npm run legacy` (puerto 3000). Los scripts antiguos de reparación operan sobre esa referencia, **no** sobre las fuentes de Astro. No ejecutarlos como paso de compilación de la migración.

## Alcance

Astro administra las páginas y el proceso de compilación. El runtime compilado de Framer sigue administrando su árbol React, variantes responsive, animaciones y efectos. `brand-content.js` y `accessibility.js` siguen presentes. No se ha hecho una reescritura de esos componentes a React/Vue/Svelte, ni una eliminación de Framer: esa sustitución requiere reconstruir y validar cada interacción por separado.

Se conserva la navegación de documento completo y la estructura de enlaces. JCAR Labs todavía no tiene dominio web: se omiten canonical, og:url y las imágenes sociales vinculadas al dominio de la plantilla. El sitemap queda vacío y robots.txt no anuncia un dominio provisional. El sitio no se publica con estos comandos.

## Contenido corporativo

`src/content/corporate.mjs` centraliza el posicionamiento, las cinco soluciones, el ecosistema técnico y los textos editoriales. `src/content/service-source-blocks.json` identifica los bloques de la plantilla que reciben esos textos. Editar el contenido corporativo y ejecutar `npm run content:generate` con el servidor abierto; `dev` y `build` lo generan automáticamente al arrancar.

El generador adapta únicamente literales de contenido en la capa original e incorpora un paso posterior a la hidratación para los artículos. Los nuevos artículos conservan sus elementos y spans. Los metadatos se adaptan mediante `src/lib/corporate-document.mjs`. No editar manualmente `public/brand-content.js`, robots.txt o sitemap.xml: son salidas generadas. El export raíz y los HTML de `src/content/pages/` permanecen como referencia intacta.

Las URL históricas se mantienen: desarrollo-web presenta Software & SaaS; inteligencia-artificial presenta IA, agentes y LLMOps; desarrollo-full-stack presenta cloud, APIs y microservicios; software-empresarial presenta modernización legacy; integraciones-sunat presenta consultoría y auditoría. El nombre completo de cada solución figura en su contenido y metadatos.

## Verificar

```sh
npm run build
npm test
npm run test:browser
```

- Build: tipos de Astro, 26 páginas, comparación exacta de documentos con solo las transformaciones de metadatos autorizadas, 335 recursos visuales/runtime por SHA-256 y tres salidas de contenido/SEO contra su generador. Los 26 HTML y 338 recursos de la referencia raíz siguen intactos.
- Pruebas HTTP: todas las rutas, redirecciones, contenido binario CMS, rangos de video, HEAD, compresión, caché y 404.
- Navegador: con el servidor activo en 4321 (o `SITE_URL`), valida inicio, listado, los cinco detalles y contacto a 390, 834 y 1440 px. Comprueba contenido corporativo, metadatos, secciones y desbordamiento; en escritorio contrasta elementos editoriales y enlaces con la referencia capturada de 1440 px. Las variantes móviles de Framer tienen sus propios elementos. Las capturas y datos quedan en `migration/reports/corporate/`. Se enmascaran videos por sus relojes independientes.

Si no hay Chromium disponible, instalarlo con `npx playwright install chromium` o indicar `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. En Windows se reutiliza Chrome de la caché de Puppeteer cuando está disponible. El informe queda en `playwright-report/index.html`.

La validación anterior al cambio de contenidos está en [migration/VALIDATION.md](migration/VALIDATION.md), con 51 comparaciones de la migración inicial. Ese informe y `tests/browser/preservation.spec.mjs` son históricos: la igualdad de textos/píxeles ya no corresponde al cambio corporativo autorizado. La validación actual usa `migration/reports/corporate-results.json`. Con el servidor activo, `npm run test:interactions` comprueba navegación y formulario sin enviar mensajes.

La verificación de preservación bloquea cambios de diseño o recursos contra la referencia. Si se autoriza una modificación futura, revisar el cambio y actualizar explícitamente la referencia y sus comprobaciones; no desactivar silenciosamente el control.

## Publicación

Publicar `dist/` junto con `scripts/serve.mjs` y `src/server/http.mjs` para el servidor Node. No publicar la raíz completa del repositorio. Un proveedor puramente estático necesita implementar las redirecciones y el protocolo `?range=` de `.framercms`; copiar únicamente `dist/` no reproduce ese protocolo.

Referencia oficial: [archivos públicos de Astro](https://docs.astro.build/en/guides/imports/) y [scripts del cliente](https://docs.astro.build/en/guides/client-side-scripts/).
