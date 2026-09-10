# Validación de la migración

> Informe histórico: corresponde a la migración inicial, antes de la actualización del contenido corporativo. La verificación actual conserva los exports originales, permite únicamente las transformaciones corporativas explícitas y registra sus pruebas en `reports/corporate-results.json`.

Fecha: 9 de septiembre de 2026. Proyecto: JCAR Labs Inc.

## Resultado

La base de compilación y rutas usa Astro 7.3.2 y TypeScript. El árbol visual de Framer, sus bundles React/Motion y la capa local de contenido/accesibilidad se conservan. No se ha sustituido el motor visual ni rediseñado la web.

| Comprobación | Resultado |
| --- | --- |
| Diagnóstico de Astro | 0 errores, 0 advertencias |
| Compilación estática | 26 páginas |
| Preservación de documentos | 26/26: atributos de html/head/body, contenido de head/body y orden de scripts iguales |
| Recursos originales, public y dist | 338/338 iguales por SHA-256 |
| Pruebas HTTP de la migración | 4/4 grupos aprobados, incluyendo todas las rutas y redirecciones |
| QA preexistente sobre el build nuevo | 24/24 comprobaciones aprobadas |
| Comparación en Chromium | 51/51 casos: 17 páginas a 390, 834 y 1440 px |
| Capturas comparadas | 102 vistas: inicio y zona intermedia de cada caso |
| Formulario y navegación | Aprobados a 390 y 1440 px; WhatsApp interceptado, sin envío |

El informe visual consolidado está en [reports/browser-results.json](reports/browser-results.json). Contiene 38 casos aprobados en la corrida general y 13 repetidos después de corregir la sincronización de las capturas, sin modificar el sitio. La diferencia máxima de píxeles medida fue 2,126 %, dentro del umbral de 3 %; también se compararon posiciones y dimensiones con tolerancia de 1 px.

## Qué se preservó

- Las 26 rutas del export, incluyendo páginas históricas, y sus redirecciones de servidor.
- Estructura de cada documento, clases, selectores, estilos inline y marcadores de hidratación.
- Tipografías, imágenes, videos, archivos CMS, CSS y código de animación.
- Navegación de documento completo, enlaces, metadatos, formulario y breakpoints.
- Compresión, caché, cabeceras, respuestas 404, rangos de video y protocolo `?range=` del CMS.
- Export original en la raíz, ejecutable con `npm run legacy`.

## Método y límites

Las capturas mantienen las animaciones activas. Forzar su finalización en Playwright alteraba temporalmente estados hover del propio Framer. Se esperó la carga y la adaptación del contenido, se usó un scroll compartido y se comprobó su posición.

Los videos se enmascaran únicamente en las capturas, porque dos navegadores tienen relojes de reproducción independientes. Sus bytes, URLs y atributos se verifican por separado. Los encabezados ocultos añadidos por el temporizador de accesibilidad del export se excluyen de la comparación visual; el código que los crea permanece idéntico. La compresión se verifica por HTTP, mientras la comparación de navegador solicita recursos sin compresión para no sobrecargar la compresión repetida del servidor original.

Estas comprobaciones verifican esta migración en Chromium y en los tres anchos indicados. No son una certificación de todos los estados posibles, ni eliminan comportamientos o limitaciones preexistentes de Framer. El runtime compilado permanece como dependencia deliberada para conservar el diseño y el movimiento actuales.

## Reproducir

```sh
npm ci
npm run build
npm test
npm run test:browser
npm start
# En otra terminal, con la vista previa activa:
npm run qa
npm run test:interactions
```

El servidor de producción usa `dist/`. No se ha publicado el proyecto ni cambiado el dominio técnico de sus metadatos.
