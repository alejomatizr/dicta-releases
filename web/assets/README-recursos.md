# Dicta — Recursos web
Recursos visuales para la página de descarga de Dicta (concepto «Onda»). Paleta: negro cálido `#191816`, marfil `#EDE8DF`, arcilla `#D97757`.
Todas las capas de una misma escena comparten lienzo, cámara y gradación: se apilan con `position:absolute; inset:0` y encajan al píxel. Cada PNG tiene su .webp optimizado al lado (con alfa donde hay transparencia).
## Orden de apilado (de atrás hacia delante)
**Héroe** (escritorio y móvil por separado):
1. `heroe-fondo-*` — opaco
2. `heroe-ambiente-*` — opcional, una copia detrás del portátil (≈50 % de opacidad)
3. `heroe-portatil-*` — alfa. La interfaz HTML va encima de esta capa, recortada con `heroe-pantalla-mascara-*`
4. `heroe-punto-*` — alfa
5. `heroe-ambiente-*` — alfa, delante del portátil (≈85 %)
6. `heroe-primer-plano-*` — alfa
`heroe-poster-*` es la escena completa ya compuesta, para usarla de respaldo (sin JS, `prefers-reduced-motion`, carga lenta).
**Capítulos** (clase, privado, final): 1. `capitulo-*-plano-*` (opaco) → 2. `capitulo-*-primer-plano-*` (alfa). `capitulo-*-compuesto-*` es solo referencia.
**Punto**: `punto-arcilla` y `punto-arcilla-sombra` tienen la esfera en exactamente la misma posición (centro del lienzo, 820 px de diámetro); puedes cruzarlos sin salto.
**Texturas**: `textura-grano` encima de todo con `mix-blend-mode: overlay` y opacidad 0.3–0.5; `textura-papel` como `background` repetido.
## Pantalla del portátil (héroe)
Esquinas en píxeles del lienzo, orden sup-izq, sup-der, inf-der, inf-izq. Úsalas para calcular un `matrix3d` y deformar la interfaz real a la perspectiva de la pantalla.
- **escritorio** · zona útil: (1238, 418), (2088, 366), (1963, 1104), (1084, 996)  ·  vidrio completo: (1225, 407), (2106, 353), (1976, 1118), (1066, 1006)
- **movil** · zona útil: (354, 540), (995, 586), (940, 1042), (308, 958)  ·  vidrio completo: (343, 531), (1008, 579), (950, 1051), (296, 964)

## Archivos
| Carpeta | Archivo | Tamaño (px) | Alfa | PNG | WebP | Qué es |
|---|---|---|---|---|---|---|
| heroe/ | `heroe-ambiente-escritorio.png` | 2880×1620 | sí | 448 KB | 187 KB | Bruma cálida y polvo en el haz de la lámpara (semitransparente) · escritorio |
| heroe/ | `heroe-ambiente-movil.png` | 1290×2293 | sí | 245 KB | 129 KB | Bruma cálida y polvo en el haz de la lámpara (semitransparente) · movil |
| heroe/ | `heroe-fondo-escritorio.png` | 2880×1620 | no | 6008 KB | 527 KB | Habitación, ventana y escritorio con el espacio bajo el portátil reconstruido · escritorio |
| heroe/ | `heroe-fondo-movil.png` | 1290×2293 | no | 3682 KB | 337 KB | Habitación, ventana y escritorio con el espacio bajo el portátil reconstruido · movil |
| heroe/ | `heroe-pantalla-mascara-escritorio.png` | 2880×1620 | no | 11 KB | 5 KB | Máscara de la zona útil de pantalla (blanco = pantalla) · escritorio |
| heroe/ | `heroe-pantalla-mascara-movil.png` | 1290×2293 | no | 6 KB | 3 KB | Máscara de la zona útil de pantalla (blanco = pantalla) · movil |
| heroe/ | `heroe-portatil-escritorio.png` | 2880×1620 | sí | 907 KB | 112 KB | Portátil con sombra de contacto; pantalla #191816 plana · escritorio |
| heroe/ | `heroe-portatil-movil.png` | 1290×2293 | sí | 558 KB | 74 KB | Portátil con sombra de contacto; pantalla #191816 plana · movil |
| heroe/ | `heroe-poster-escritorio.png` | 2880×1620 | no | 5467 KB | 462 KB | Escena completa compuesta (respaldo) · escritorio |
| heroe/ | `heroe-poster-movil.png` | 1290×2293 | no | 3482 KB | 308 KB | Escena completa compuesta (respaldo) · movil |
| heroe/ | `heroe-primer-plano-escritorio.png` | 2880×1620 | sí | 1043 KB | 135 KB | Cuaderno y taza desenfocados (esquinas inferiores) · escritorio |
| heroe/ | `heroe-primer-plano-movil.png` | 1290×2293 | sí | 766 KB | 100 KB | Cuaderno y taza desenfocados (esquinas inferiores) · movil |
| heroe/ | `heroe-punto-escritorio.png` | 2880×1620 | sí | 66 KB | 18 KB | Esfera de arcilla con sombra de contacto, en su posición · escritorio |
| heroe/ | `heroe-punto-movil.png` | 1290×2293 | sí | 37 KB | 11 KB | Esfera de arcilla con sombra de contacto, en su posición · movil |
| punto/ | `punto-arcilla-sombra.png` | 1200×1200 | sí | 905 KB | 112 KB | Esfera sola, centrada, con sombra de contacto |
| punto/ | `punto-arcilla.png` | 1200×1200 | sí | 889 KB | 99 KB | Esfera sola, centrada, sin sombra |
| capitulos/ | `capitulo-clase-compuesto-escritorio.webp` | 2880×1620 | no | — | 534 KB | Plano + primer plano compuestos (referencia) · escritorio |
| capitulos/ | `capitulo-clase-compuesto-movil.webp` | 1290×2293 | no | — | 360 KB | Plano + primer plano compuestos (referencia) · movil |
| capitulos/ | `capitulo-clase-plano-escritorio.png` | 2880×1620 | no | 5998 KB | 535 KB | Clase nocturna sin auriculares (videollamada desenfocada) · escritorio |
| capitulos/ | `capitulo-clase-plano-movil.png` | 1290×2293 | no | 3807 KB | 361 KB | Clase nocturna sin auriculares (videollamada desenfocada) · movil |
| capitulos/ | `capitulo-clase-primer-plano-escritorio.png` | 2880×1620 | sí | 734 KB | 82 KB | Auriculares en primer plano · escritorio |
| capitulos/ | `capitulo-clase-primer-plano-movil.png` | 1290×2293 | sí | 426 KB | 52 KB | Auriculares en primer plano · movil |
| capitulos/ | `capitulo-final-compuesto-escritorio.webp` | 2880×1620 | no | — | 548 KB | Plano + primer plano compuestos (referencia) · escritorio |
| capitulos/ | `capitulo-final-compuesto-movil.webp` | 1290×2293 | no | — | 371 KB | Plano + primer plano compuestos (referencia) · movil |
| capitulos/ | `capitulo-final-plano-escritorio.png` | 2880×1620 | no | 5782 KB | 565 KB | Escritorio vacío al amanecer, sin esfera · escritorio |
| capitulos/ | `capitulo-final-plano-movil.png` | 1290×2293 | no | 4124 KB | 376 KB | Escritorio vacío al amanecer, sin esfera · movil |
| capitulos/ | `capitulo-final-primer-plano-escritorio.png` | 2880×1620 | sí | 45 KB | 15 KB | Esfera de arcilla con sombra, en su posición · escritorio |
| capitulos/ | `capitulo-final-primer-plano-movil.png` | 1290×2293 | sí | 23 KB | 9 KB | Esfera de arcilla con sombra, en su posición · movil |
| capitulos/ | `capitulo-privado-compuesto-escritorio.webp` | 2880×1620 | no | — | 413 KB | Plano + primer plano compuestos (referencia) · escritorio |
| capitulos/ | `capitulo-privado-compuesto-movil.webp` | 1290×2293 | no | — | 285 KB | Plano + primer plano compuestos (referencia) · movil |
| capitulos/ | `capitulo-privado-plano-escritorio.png` | 2880×1620 | no | 5304 KB | 412 KB | Cuaderno cerrado bajo la lámpara, sin esfera · escritorio |
| capitulos/ | `capitulo-privado-plano-movil.png` | 1290×2293 | no | 3389 KB | 283 KB | Cuaderno cerrado bajo la lámpara, sin esfera · movil |
| capitulos/ | `capitulo-privado-primer-plano-escritorio.png` | 2880×1620 | sí | 92 KB | 20 KB | Esfera de arcilla con sombra, en su posición · escritorio |
| capitulos/ | `capitulo-privado-primer-plano-movil.png` | 1290×2293 | sí | 63 KB | 14 KB | Esfera de arcilla con sombra, en su posición · movil |
| texturas/ | `textura-grano.png` | 1024×1024 | sí | 1373 KB | 887 KB | Grano de película neutro sobre transparente, sin costuras |
| texturas/ | `textura-papel.png` | 1024×1024 | no | 847 KB | 59 KB | Papel de algodón marfil, sin costuras |
| redes/ | `og-dicta-cuadrado-esfera.png` | 1080×1080 | no | 612 KB | 20 KB | Imagen cuadrada 1080×1080, esfera fotografiada |
| redes/ | `og-dicta-cuadrado.png` | 1080×1080 | no | 610 KB | 20 KB | Imagen cuadrada 1080×1080, punto plano |
| redes/ | `og-dicta-esfera.png` | 1200×630 | no | 395 KB | 16 KB | Imagen para compartir 1200×630, esfera fotografiada como punto final |
| redes/ | `og-dicta.png` | 1200×630 | no | 393 KB | 16 KB | Imagen para compartir 1200×630, punto plano |

## Notas de producción
- Escenas generadas con IA (Canva) a partir del preámbulo de estilo, y postproducidas: capas derivadas de una misma foto, sombras de contacto extraídas de la foto original, fondos reconstruidos donde estaban los objetos, gradación común (el negro más profundo cae en `#191816`), grano de película común por escena y reescalado a 2880 × 1620 / 1290 × 2293.
- La bruma, el polvo, el grano y el papel son procedurales (generados con código), no IA.
- Sin texto, letras ni logos en las escenas; solo las imágenes de `redes/` llevan el logo y el titular.
