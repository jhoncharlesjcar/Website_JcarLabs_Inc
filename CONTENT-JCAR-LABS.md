# Contenido maestro — JCAR Labs Inc.

## Actualización corporativa — 9 de septiembre de 2026

Esta sección y `src/content/corporate.mjs` definen el contenido vigente. El material de abajo se conserva como documentación histórica del export y de los datos proporcionados; sus antiguos servicios y propuestas de composición quedan reemplazados por esta actualización.

JCAR Labs Inc. se presenta como una empresa de ingeniería de software para negocios. El mensaje conecta las soluciones digitales con las decisiones de arquitectura, datos, operación y seguridad que permiten construir y evolucionar productos.

| Solución | Ruta conservada |
| --- | --- |
| Desarrollo de Software a Medida & Productos SaaS | `/services/desarrollo-web` |
| Modernización e Ingeniería de Sistemas Legacy | `/services/software-empresarial` |
| Integración de IA Transmodal, Agentes y LLMOps | `/services/inteligencia-artificial` |
| Arquitectura Cloud, APIs & Microservicios | `/services/desarrollo-full-stack` |
| Consultoría de Arquitectura y Auditoría de Código | `/services/integraciones-sunat` |

Se conserva el orden de las tarjetas y sus destinos. Las etiquetas visuales son breves para encajar en la tipografía existente; los nombres completos aparecen en los detalles y metadatos. Las doce secciones de inicio, los bloques editoriales, menús, enlaces, formularios, recursos y motores de animación se mantienen.

El ecosistema documentado incluye JavaScript, React, Node.js, Python, Java, PHP y SQL. Se explica su relación con interfaces, servicios, datos e integración de IA dentro de los bloques actuales. No se añaden certificaciones, alianzas, cifras de rendimiento ni casos de clientes no confirmados.

**Dominio:** el usuario confirmó que todavía no existe. No se atribuye `vertical.framer.media` ni se inventa un dominio corporativo. Canonical, og:url y sitemap absoluto quedan pendientes de disponer del dominio real. Se conservan los datos de contacto que ya contenía el proyecto, sin verificar su titularidad o recepción en esta actualización.

**Edición:** modificar `src/content/corporate.mjs` y ejecutar `npm run content:generate`. `src/content/service-source-blocks.json` conserva las correspondencias con la estructura editorial. No editar las salidas generadas en public ni los exports preservados.

## Documentación histórica del export

Este documento recopila los datos extraídos del HTML proporcionado y define qué contenido sustituirá a la identidad anterior del export de Framer.

**Estado de migración:** fase visual, estructural e interactiva aplicada. El inicio conserva las 12 secciones de la referencia; cada proyecto usa 10 secciones, cada detalle de servicio 5, Contacto usa 4 paneles animados, las páginas legales 2 y la página 404 una. Proyectos, Nosotros, Servicios, detalles y Contacto comparten el encabezado oscuro de Inicio y utilizan revelados por scroll, parallax, movimiento de puntero y estados hover/foco. Las redes sin perfil oficial permanecen ocultas.

## Identidad y SEO

- **Marca oficial:** JCAR Labs Inc.
- **Nombre del sitio:** Portafolio JCAR Labs Inc.
- **Título SEO propuesto:** JCAR Labs Inc. — Desarrollo Web, Software e Inteligencia Artificial
- **Descripción SEO:** JCAR Labs Inc. desarrolla sitios web, software a medida y soluciones de inteligencia artificial. Transformamos ideas en productos digitales robustos y escalables.
- **Palabras clave base:** desarrollo web, software a medida, inteligencia artificial, automatización, React, Node.js, JavaScript, Perú.
- **Idioma:** español (`es`).

## Navegación propuesta

| Navegación actual | Nueva navegación |
|---|---|
| Home | Inicio |
| Work | Proyectos |
| About | Nosotros |
| Thoughts | Servicios |
| Contact | Contacto |

La ruta pública de servicios es `/services`. La ruta anterior `/thoughts` redirige de forma permanente a `/services` para conservar enlaces existentes.

## Arquitectura aplicada

| Página | Estructura de referencia conservada | Ruta JCAR Labs |
|---|---:|---|
| Inicio | 12 secciones editoriales | `/` |
| Proyectos | 3 filas editoriales de 576 px | `/work` |
| Detalle de proyecto | 10 secciones por caso | `/work/{proyecto}` |
| Servicios | Portada + 5 capacidades a pantalla completa | `/services` |
| Detalle de servicio | 5 capítulos editoriales, 6.140 px en escritorio | `/services/{servicio}` |
| Contacto | 1 composición con formulario | `/contact` |
| Privacidad y términos | Portada legal + contenido editorial | `/privacy-policy`, `/terms-of-use` |
| Error 404 | 1 composición a pantalla completa | cualquier ruta inexistente |

### Secciones del inicio

1. Hero.
2. Introducción.
3. Galería visual.
4. Concepto con vídeo.
5. Proceso con vídeo de fondo.
6. Proyectos seleccionados.
7. Capacidades en formato índice.
8. Manifiesto.
9. Filosofía de trabajo.
10. Presentación del proceso.
11. Exhibición con vídeo.
12. Nosotros.

La jerarquía tipográfica, el contraste negro/blanco/verde, los paneles de altura completa, las palabras destacadas, las cuadrículas y el ritmo de scroll siguen la composición de `vertical.framer.media`, adaptados al contenido corporativo de JCAR Labs.

### Corrección de paridad — Nosotros y Servicios

- **Nosotros (`/#about-me`)** conserva la composición de referencia en tres columnas: identidad y manifiesto, retrato editorial multicapa con propuesta de trabajo, y perfil corporativo con capacidades y CTA. El hash se realinea después del render para abrir exactamente al inicio de la sección.
- **Proyectos (`/work`)** elimina el hero que no existe en la fuente y utiliza filas de 576 px con bloque editorial, regla gráfica de 100 px e imagen de 608 px en escritorio.
- **Detalles de proyecto** conservan diez capítulos y una altura de 10.963 px en escritorio, equivalente a los 10.964 px de la plantilla de referencia.
- **Servicios (`/services`)** usa la estructura de `vertical.framer.media/thoughts`: encabezado editorial de 608 px dividido entre portada clara y manifiesto oscuro, seguido por tarjetas de 800 px con texto a la izquierda e imagen a la derecha.
- La composición de Servicios es full-bleed y conserva el ritmo de la referencia: 100 px de entrada superior, portada clara de 314 px, manifiesto oscuro de 294 px y primera tarjeta en `y=708` para un viewport de 1280 × 720.
- Las cinco tarjetas de servicios mantienen únicamente capacidades confirmadas de JCAR Labs y enlazan a sus páginas de detalle.
- Cada tarjeta reproduce la secuencia de movimiento de la referencia: barrido de imagen, título desde `translateY(75px)`, línea horizontal, descripción revelada carácter por carácter y entrada final de autor/flecha.
- En reposo, las tarjetas usan el gris editorial `#f2f2f2`; en hover o foco cambian al verde de marca sin desaturar la imagen. Las líneas verticales se concentran en el borde derecho como en la referencia.
- Las imágenes principales se renderizan como recursos diferidos (`loading="lazy"`) para evitar descargar las cinco piezas al abrir la página.
- El cierre de Servicios incorpora el footer verde completo: marcas de regla, tipografía de 409 px en escritorio, directorio corporativo, navegación y datos de contacto de JCAR Labs.
- Ambas composiciones incluyen revelado al entrar en pantalla, efectos de imagen en hover/foco y adaptación específica para tablet y móvil.
- **Detalles de servicio** reproducen la estructura de artículo de Thoughts: cabecera de autor, overview, artículo en tres columnas, resumen/CTA y cuatro servicios relacionados.

## Portada

- **Título:** Hola, somos JCAR Labs Inc.
- **Propuesta principal:** Transformamos tus ideas en realidad digital.
- **Descripción:** Nos especializamos en soluciones de software, inteligencia artificial y desarrollo web a medida para cada negocio.
- **CTA principal:** Contratar
- **Destino confirmado:** `https://wa.me/51904615337`
- **CTA secundario:** Descargar presentación o perfil corporativo.

El HTML original menciona “Descargar CV”, pero para una empresa es más apropiado “Descargar presentación”. El archivo todavía no fue proporcionado.

## Nosotros

**Texto corporativo:**

> Somos un equipo apasionado por la tecnología. Creamos sistemas robustos y escalables integrando tecnologías modernas para resolver necesidades reales de negocio.

**Experiencia declarada:**

- Desarrollo de software empresarial.
- Integraciones con SUNAT.
- Sistemas de gestión hotelera.

**Tecnologías y metodología:**

- Python
- JavaScript
- React
- Node.js
- SQL
- Java
- PHP
- Scrum

## Proyectos confirmados

### Sistema Hotelero

- **Descripción:** Sistema de gestión para hoteles en Perú con facturación electrónica.
- **Tecnologías declaradas:** Java y MySQL.
- **Pendiente:** nombre del cliente, URL, alcance verificable, resultados, imágenes y autorización de publicación.

### Nezus Bisutería

- **Descripción:** E-commerce y sitio web corporativo para una marca de joyería.
- **Disciplinas declaradas:** desarrollo web y UX/UI.
- **Pendiente:** URL, alcance verificable, resultados, imágenes y autorización de publicación.

### Soluciones Empresariales

- **Descripción:** Plataforma de comunicación interna y gestión empresarial.
- **Disciplina declarada:** desarrollo full stack.
- **Pendiente:** nombre definitivo, cliente, URL, tecnologías, resultados, imágenes y autorización de publicación.

El portafolio de Framer contiene cinco proyectos. Solo hay información confirmada para tres; los otros dos no deben inventarse.

## Servicios confirmados

### Desarrollo web

Sitios web modernos, responsivos y optimizados para buscadores.

### Inteligencia artificial

Integración de modelos de IA y automatización de procesos.

### Desarrollo full stack

Desarrollo integral desde la base de datos y la lógica de negocio hasta la interfaz de usuario.

### Software empresarial

Sistemas a medida para organizar información, reducir fricción operativa y preparar el negocio para crecer.

### Integraciones SUNAT

Facturación electrónica y flujos administrativos conectados con la operación diaria.

## Contacto confirmado

- **Correo:** `contacto@jcarlabs.com`
- **Teléfono:** `+51 904 615 337`
- **WhatsApp:** `https://wa.me/51904615337`
- **Título de contacto:** Hablemos de tu proyecto
- **Texto:** Estamos listos para llevar tu negocio al siguiente nivel. Contáctanos para conversar sobre tu proyecto.

## Pie de página

- **Marca:** JCAR Labs Inc.
- **Descripción:** Somos un equipo apasionado por la tecnología y desarrollamos sistemas robustos, escalables y orientados a necesidades reales de negocio.
- **Copyright propuesto:** © 2026 JCAR Labs Inc. Todos los derechos reservados.

## Datos que no deben publicarse como definitivos

Los siguientes valores del HTML son genéricos o no incluyen una cuenta específica:

- `https://instagram.com`
- `https://linkedin.com`
- `https://github.com`
- `https://tiktok.com`
- Imágenes de Unsplash usadas en Open Graph, proyectos y servicios.
- Enlaces `href="#"` de los tres proyectos.

Hasta recibir las URLs oficiales, estas redes deben ocultarse o marcarse como pendientes. WhatsApp y correo sí están definidos.

## Activos pendientes

- Logo oficial mencionado como `jcar-logo.jpg`.
- Vídeo de portada mencionado como `video de inicio web.mp4`.
- Vídeo de la sección Nosotros mencionado como `video de Nosotros.mp4`.
- Mientras se entregan los vídeos oficiales, el sitio conserva los recursos audiovisuales incluidos en la exportación original de Framer. Se reproducen silenciados y en bucle únicamente cuando entran en pantalla, y respetan la preferencia del sistema para reducir movimiento.
- La composición audiovisual queda asignada así: `video-video-1.mp4` en **Concepto**, `video-overlay-video-3.mp4` como fondo de **Proceso** y `video-video-4.mp4` en **Exhibición**. Las tres secciones mantienen sus capas tipográficas y animaciones de Framer.
- Los listados, detalles de proyectos, servicios y páginas legales incorporan revelado progresivo al entrar en pantalla. El efecto se desactiva cuando el dispositivo solicita movimiento reducido.
- Los casos internos utilizan temporalmente imágenes editoriales de la exportación para conservar la densidad visual de la referencia. Deben reemplazarse por capturas reales de cada producto cuando estén disponibles.
- Presentación corporativa o PDF descargable.
- Imagen social de Open Graph propiedad de JCAR Labs Inc.
- Capturas, portadas y enlaces reales de cada proyecto.
- Revisión legal profesional de la política de privacidad y los términos ya adaptados a JCAR Labs Inc.

## Verificación técnica

- 21 de 21 comprobaciones automatizadas superadas.
- Respuestas HTTP, metadatos, sitemap, `robots.txt`, cabeceras de seguridad y compresión verificados.
- Rangos parciales de vídeo (`206`) verificados para reproducción fluida.
- Sin desbordamiento horizontal en 390 px, 930 px y 1280 px.
- Los tres vídeos fueron comprobados en reproducción al entrar en su sección.
- Navegación, jerarquía de secciones y estados de revelado comprobados en navegador real.

## Sustituciones principales en el export actual

- “Adam Knoxville” y “Vertical” → “JCAR Labs Inc.”
- “Independent Visual Artist” → “Desarrollo web, software e inteligencia artificial”.
- Textos artísticos de portada y Nosotros → propuesta y descripción corporativa.
- Proyectos artísticos → los tres proyectos confirmados.
- Artículos/Thoughts → presentación editorial de los cinco servicios de JCAR Labs.
- Correo, teléfono, dirección y copyright anteriores → datos confirmados de JCAR Labs Inc.
- Redes sociales de la plantilla → ocultas hasta contar con perfiles oficiales.
