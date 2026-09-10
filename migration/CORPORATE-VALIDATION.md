# Actualización corporativa de JCAR Labs Inc.

La actualización incorpora las cinco soluciones del brief en inicio, servicios, sus detalles y contacto. El ecosistema técnico ocupa los bloques existentes de capacidades y Nosotros. Los artículos de servicios ahora explican software/SaaS, modernización legacy, IA transmodal y LLMOps, cloud/APIs y auditoría de código.

## Preservación

- Se conservan las 26 rutas y redirecciones, los enlaces del sitio y el orden de las tarjetas.
- Los 26 HTML del export y sus 338 recursos originales permanecen intactos como referencia.
- En public y dist, 335 recursos visuales y de ejecución conservan sus hashes: CSS, fuentes, imágenes, video, CMS y bundles de Framer/React/Motion.
- Las tres excepciones explícitas son brand-content.js, robots.txt y sitemap.xml, comprobadas contra sus generadores. Los documentos solo cambian en los metadatos corporativos autorizados.
- Los textos se incorporan después de la hidratación mediante la capa de contenido existente. Los nuevos artículos mantienen sus elementos, spans, clases y enlaces. No se añaden secciones ni estilos.

## Validación realizada

| Verificación | Resultado |
| --- | --- |
| Astro y build | 0 errores, 0 advertencias; 26 páginas |
| Preservación de documentos y recursos | Aprobada |
| Pruebas del servidor | 4 grupos aprobados |
| QA HTTP del build | 24/24 |
| Navegador sobre el build | 24/24: 8 rutas a 390, 834 y 1440 px |
| Navegación y formulario | Aprobados a 390 y 1440 px; apertura de WhatsApp interceptada, sin envío |
| Aparición al desplazarse | Aprobada en Nosotros, listado de servicios y artículo cloud; capturas en `reports/corporate/scroll-*.png` |

El informe detallado es `reports/corporate-results.json`, con capturas y estado del DOM en `reports/corporate/`. Se validan los textos completos de los cinco artículos, las tarjetas, los títulos, la ausencia de canonical provisional, las secciones y el desbordamiento horizontal. En escritorio se comparan además tipos/clases de elementos editoriales y enlaces contra la referencia de 1440 px.

Las variantes de Framer cambian elementos y presets en móvil y tableta. La primera prueba detectó que no correspondía compararlas con un DOM de escritorio; la ejecución final usa la referencia de escritorio solo a 1440 px. La referencia original confirma que el énfasis editorial tiene seis spans en móvil y cero en tableta. Estos comportamientos se conservan.

`corporate-reference/runtime.json` registra controles del export original. El aviso React #405 ya aparece en esa referencia y continúa en el runtime preservado. La verificación de ejecución comprueba que el sitio actualizado no añada otros errores y conserve los marcadores de aparición y el comportamiento de énfasis de los controles.

## Alcance y pendientes

El usuario confirmó que todavía no existe dominio. Se eliminan las atribuciones del dominio de la plantilla en canonical, Open Graph y datos estructurados; el sitemap queda vacío hasta configurar un dominio real. No se realizó un despliegue.

Se conservan los datos de contacto y el portafolio existentes. No se atribuyen tecnologías ajenas al ecosistema documentado, certificaciones, alianzas, métricas ni nuevos proyectos de clientes. Las fotografías, videos e ilustraciones originales se mantienen por la restricción de preservar el diseño.

Las 51 comparaciones visuales de la migración inicial permanecen en VALIDATION.md como historial. La actualización corporativa cambia texto y su composición natural: no se presenta como una comparación de píxeles idénticos.
