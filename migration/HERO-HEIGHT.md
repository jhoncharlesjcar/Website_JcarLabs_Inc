# Altura de la franja central de inicio

Corrección solicitada por el usuario después de la actualización corporativa.

En el navegador abierto, a 1186 × 698 píxeles CSS, la segunda fila se comprimía a 59,925 px mientras su tipografía ocupaba 216,25 px. El hero tenía altura fija de una pantalla y las filas superior e inferior consumían el espacio disponible.

`public/hero-adjustments.css`, cargado solo en inicio, permite que el hero crezca con su contenido y reserva una altura mínima adaptable para Row 2 desde 810 px de ancho. Se conservan los elementos, tipografía, números, recursos y controladores de animación; la variante móvil mantiene sus reglas anteriores.

Verificación en la misma pestaña y dimensiones: la franja pasa a 237,275 px y el hero a 874,95 px. El contenido central vuelve a verse completo en vertical y no aparece desbordamiento horizontal. El usuario puede desplazarse para ver el cierre de la portada.

El export original sigue intacto. La hoja adicional es una excepción visual explícitamente autorizada, comprobada también en el build por `verify-preservation.mjs`.
