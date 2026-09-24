# Seguridad

## Cómo protege la app a sus usuarios

- **Sin servidor ni cuentas.** Camelantes no envía datos a ningún sitio. Los nombres, la partida en curso y el historial de preguntas se guardan solo en el dispositivo, y se pueden borrar desde *Cómo se juega → Borrar datos de este móvil*.
- **Política de seguridad de contenido (CSP).** El navegador solo ejecuta el código de la propia app: no hay scripts en línea ni de terceros, ni conexiones externas.
- **Texto del usuario escapado.** Los nombres de los jugadores se escapan siempre antes de mostrarse, para evitar inyección de HTML.
- **Datos guardados validados.** Una partida guardada que esté corrupta o manipulada se descarta en vez de cargarse.
- **Modo sin conexión acotado.** El service worker solo guarda en caché respuestas correctas de la propia app.
- **Contenido +18 con confirmación de edad.** La categoría Picante viene desactivada y pide confirmar que los dos jugadores sois mayores de edad.
- **Sin dependencias.** La app no usa librerías externas. Las acciones de GitHub que la publican se revisan cada semana con Dependabot y tienen permisos mínimos.

## Informar de un problema

Si encuentras una vulnerabilidad, no abras un issue público. Usa **Security → Report a vulnerability** en este repositorio.
