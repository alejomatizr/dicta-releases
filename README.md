# Dicta

Dictado por voz para Mac, local y gratis. Mantén **fn**, habla y suelta: el texto aparece donde está el cursor, en cualquier app.

Este repositorio solo contiene las **versiones para instalar**. Dicta se actualiza sola desde aquí.

## Descargar

👉 **[Última versión](https://github.com/alejomatizr/dicta-releases/releases/latest)**: descarga el `.dmg` (o el `.zip`).

**Requisitos:** Mac con chip Apple (M1 o posterior) y macOS 13 o más nuevo. El modo comando y los apuntes de clase necesitan macOS 26 con Apple Intelligence.

## Instalar

1. Abre el `.dmg` y arrastra **Dicta** a **Aplicaciones**. Ábrela desde Aplicaciones.
2. La primera vez macOS la bloquea porque no está firmada por Apple. Ve a **Ajustes del Sistema → Privacidad y seguridad** y pulsa **Abrir igualmente**.
   - Si no aparece el botón, abre **Terminal** y ejecuta (si sale «Possible malware», pulsa *Paste Anyway*):
     ```
     xattr -dr com.apple.quarantine /Applications/Dicta.app
     ```
     Si no muestra nada, funcionó. Si dice «Operation not permitted», activa Terminal en Privacidad y seguridad → Gestión de apps y repite.
3. Sigue la bienvenida: modelo de voz (575 MB, solo la primera vez), micrófono, Monitorización de entrada, Accesibilidad y tecla fn.

## Actualizaciones

Dicta revisa este repositorio al abrirse y cada 6 horas. Cuando hay una versión nueva, aparece un aviso con el botón **Actualizar ahora**: se descarga, se verifica y se reabre sola, sin repetir los pasos de instalación.
