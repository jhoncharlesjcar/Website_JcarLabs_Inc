# Publicación y mantenimiento — Portafolio JCAR Labs Inc.

> Guía histórica del export anterior. El proyecto migrado usa Astro: consultar [README.md](README.md) y [migration/VALIDATION.md](migration/VALIDATION.md). No ejecutar `repair-export.mjs` como paso del build de Astro; modifica la referencia original.

Esta guía corresponde al despliegue y mantenimiento del portafolio oficial de **JCAR Labs Inc.**

## Flujo recomendado

1. Conserva una copia del export original.
2. Ejecuta `node scripts/repair-export.mjs` después de cada nueva extracción.
3. Inicia `node server.mjs` y revisa las rutas críticas.
4. Publica la carpeta completa con un runtime de Node o replica en tu proveedor las cabeceras y reglas de caché de `server.mjs`.

## Dominio canónico

Antes de cambiar de dominio, actualiza `siteOrigin` al inicio de `scripts/repair-export.mjs` y vuelve a ejecutar el script. Esto actualiza canonical, Open Graph, JSON-LD, `robots.txt` y `sitemap.xml`.

Mientras no se defina el dominio corporativo definitivo, el export conserva `https://vertical.framer.media` como origen canónico técnico. No debe publicarse como versión final de JCAR Labs Inc. sin reemplazarlo.

## Comprobaciones antes de publicar

- `/`, `/work`, `/services`, `/contact`, `/privacy-policy` y `/terms-of-use` responden 200.
- Las tres páginas de proyecto y las cinco páginas de servicio responden 200 y muestran contenido de JCAR Labs Inc.
- `robots.txt` y `sitemap.xml` usan el dominio definitivo.
- El formulario abre una conversación de WhatsApp con los datos escritos por el visitante.
- No aparecen controles “Get Template”, enlaces visibles a `/404` ni la interfaz del editor de Framer.
- El sitio se revisa a 390 px, 834 px y 1440 px sin scroll horizontal.

## Arquitectura interactiva del export

Las páginas personalizadas no dependen del bundle principal de Framer: usan una capa interactiva local que conserva movimiento y comportamiento responsive sin errores de hidratación. Proyectos, Servicios, sus detalles y Contacto incluyen encabezado compartido, revelados por intersección, parallax, respuesta al puntero y estados hover/foco. La portada conserva el runtime compilado de Framer para mantener sus composiciones, videos y animaciones exportadas.

El postproceso debe ejecutarse después de cada nueva extracción. La revisión vigente de los recursos personalizados es `20260830-jcar41`.

El servidor local añade seguridad, compresión y rangos de vídeo. Un hosting puramente estático puede servir los archivos, pero debe configurarse por separado para igualar esas cabeceras.
