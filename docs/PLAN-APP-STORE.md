# Plan para vender Camelantes en el App Store

Hoy Camelantes es una web app instalable. Para venderla en el App Store hay que convertirla en app nativa de iOS, darla de alta en Apple y pasar su revisión. Este plan recoge los pasos, los costes y las decisiones que tienes que tomar.

## 1. Resumen

| | |
|---|---|
| **Tecnología** | [Capacitor](https://capacitorjs.com): envuelve el código actual en una app nativa de iOS. Se reutiliza el 100 % del juego. |
| **Modelo de negocio recomendado** | Descarga gratis con 150 preguntas y una compra única (≈ 3,99 €) que desbloquea las 1000 y la categoría Picante. |
| **Coste fijo** | 99 €/año del Apple Developer Program. |
| **Comisión de Apple** | 15 % con el *App Store Small Business Program* (menos de 1 M$ al año). Sin él, 30 %. |
| **Calendario** | Unas 5 semanas hasta el lanzamiento. |
| **Lo que necesitas tú** | Cuenta de Apple Developer, datos fiscales y bancarios, y acceso a un Mac o a un servicio de compilación en la nube. |

## 2. Decisiones que tienes que tomar

1. **Cuenta personal o de empresa.** Con cuenta personal, en la ficha sale tu nombre. En la UE, Apple publica además la dirección, el teléfono y el email del vendedor (obligación de la *Digital Services Act*). Si no quieres que salgan tus datos personales, date de alta como autónomo o empresa y usa esos datos. Para la cuenta de empresa necesitas un número D-U-N-S, que es gratuito y tarda de 1 a 2 semanas.
2. **Modelo de negocio.**
   - **Freemium con una compra única (recomendado).** Es el modelo habitual en los juegos de fiesta: la gente lo prueba gratis y paga cuando le gusta. Requiere integrar compras dentro de la app.
   - **De pago (1,99–2,99 €).** Es lo más sencillo, sin compras dentro de la app, pero se descarga mucho menos.
   - **Suscripción.** No lo recomiendo: para un juego de preguntas que se completa, genera rechazo.
3. **Picante dentro o fuera.** Solo con tener contenido sexual sugerente en la app, la clasificación por edad sube (sección 6). Hay dos alternativas: sacar una versión sin Picante con clasificación más baja, o aceptar la clasificación de adultos a cambio de su atractivo comercial.
4. **Nombre.** Comprueba que "Camelantes" esté libre en App Store Connect y en la [OEPM](https://www.oepm.es) antes de invertir en marca.

## 3. Requisitos de Apple que afectan al diseño

- **Funcionalidad mínima (norma 4.2).** Apple rechaza las apps que son solo una web metida en un contenedor. Para evitarlo:
  - todo el contenido va dentro de la app y funciona sin conexión (ya es así);
  - se añaden funciones nativas: vibración al elegir respuesta y al revelar resultados, el menú de compartir de iOS y guardado nativo;
  - una imagen del resultado para compartir en Instagram y WhatsApp (muy recomendable también para marketing);
  - no se ve ninguna interfaz de navegador ni se cargan páginas web remotas.
- **Compras dentro de la app (norma 3.1.1).** Todo contenido digital se tiene que vender con el sistema de compras de Apple. La compra debe ser *no consumible* y la app necesita un botón **"Restaurar compras"**.
- **Privacidad (norma 5.1).** Hacen falta una política de privacidad con URL pública (ya está: `privacidad.html`) y una etiqueta de privacidad en App Store Connect. Como la app no recoge nada, la etiqueta es **"Datos no recopilados"**.
- **Manifiesto de privacidad.** Se incluye un archivo `PrivacyInfo.xcprivacy`. Si se usa el guardado nativo (`UserDefaults`), hay que declarar el motivo `CA92.1`.

## 4. Plan técnico

### Semana 1 · Convertir a app nativa

1. Crear el proyecto de Capacitor (`@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`) con `webDir` apuntando a una carpeta `www/` que contenga los archivos del juego.
2. Plugins:
   - `@capacitor/haptics`: vibraciones.
   - `@capacitor/share`: menú de compartir nativo.
   - `@capacitor/preferences`: guardado nativo. iOS puede borrar el `localStorage` de un WebView cuando le falta espacio, así que las partidas y el historial deben ir aquí.
   - `@capacitor/splash-screen` y `@capacitor/status-bar`: aspecto nativo al abrir.
3. En la versión nativa no se registra el service worker, porque los archivos ya van dentro de la app.
4. Añadir una capa de almacenamiento que use Preferences en iOS y `localStorage` en la web, así el mismo código sirve para los dos.
5. Iconos (1024×1024 sin transparencia) y pantalla de inicio. Ya tenemos el diseño del icono en `icons/icon.svg`.

### Semana 2 · Compras y monetización

1. Crear en App Store Connect la compra no consumible `camelantes.completo`.
2. Integrarla con [RevenueCat](https://www.revenuecat.com), gratis hasta 2.500 $ de ingresos al mes. RevenueCat valida los recibos en su servidor y así no hay que montar un backend propio. Plugin: `@revenuecat/purchases-capacitor`.
3. Bloquear en la app lo que no está pagado. Hay que decidir qué 150 preguntas son gratis; propongo unas 25 de cada categoría, sin Picante.
4. Añadir una pantalla de desbloqueo con el precio que devuelve Apple y los botones "Comprar" y "Restaurar compras".

### Semana 3 · Seguridad y calidad de la versión nativa

- Mantener la CSP actual y no configurar `server.url` en Capacitor: la app nunca carga código remoto.
- Dejar *App Transport Security* con los valores por defecto de iOS (solo HTTPS).
- Desactivar la inspección del WebView en las versiones de producción (Capacitor ya lo hace por defecto).
- Validar las compras en el servidor (RevenueCat), nunca solo en el dispositivo.
- Probar en iPhones reales: pantalla pequeña (SE), grande (Pro Max), modo oscuro, texto grande y VoiceOver.

### Semana 4 · Beta con TestFlight

1. Compilar y subir con Xcode, o sin Mac con [Codemagic](https://codemagic.io) (tiene un plan gratuito con minutos de compilación en Mac) o con GitHub Actions en un runner macOS con *fastlane*.
2. Invitar a 10–20 personas por TestFlight y jugar partidas reales. Hay que revisar sobre todo si se entiende lo de pasar el móvil, si alguna pregunta es confusa o se repite, y si el resultado de afinidad tiene sentido.

### Semana 5 · Ficha y envío a revisión

- **Capturas** para el tamaño de iPhone que exija App Store Connect (hoy, la pantalla de 6,9"). Propuesta de 5 capturas: portada, pregunta, revelación, resultado de afinidad y tipo de personalidad.
- **Textos:** nombre (30 caracteres), subtítulo (30), palabras clave (100) y descripción.
- **Categoría:** Juegos → *Party* (Juegos de fiesta) como principal y *Trivia* o *Familiar* como secundaria.
- **URL de soporte y de privacidad:** las páginas de GitHub Pages sirven.
- **Notas para el revisor:** explicar que se juega con dos personas en un solo móvil e indicar cómo probar la compra (Apple usa una cuenta *sandbox*).
- La revisión suele tardar entre 24 y 48 horas. Si la rechazan, responden con la norma concreta y se corrige.

## 5. Alta en Apple (en paralelo, empieza ya)

1. Darte de alta en el [Apple Developer Program](https://developer.apple.com/programs/) (99 €/año).
2. En App Store Connect, firmar el acuerdo de **apps de pago** (*Paid Apps Agreement*), rellenar los datos fiscales (incluido el formulario W-8BEN de EE. UU.) y los bancarios.
3. Declarar el **estado de comerciante** para la UE (*Trader status*, DSA).
4. Solicitar el **Small Business Program** para pagar un 15 % de comisión en vez de un 30 %.
5. Consultar con un gestor cómo declarar estos ingresos en España. Apple actúa como vendedor y cobra el IVA a los clientes, pero tus ingresos siguen tributando.

## 6. Clasificación por edad

La clasificación sale del cuestionario de App Store Connect. Con la categoría Picante (contenido sexual sugerente, sin desnudos) hay que declarar temas sexuales, y la clasificación resultante será de las más altas (16+ o 18+). La confirmación de edad dentro de la app ayuda, pero no sustituye a la clasificación. Si prefieres llegar a un público más amplio, publica sin Picante y valora añadirlo más adelante.

No se puede subir contenido sexual explícito: Apple lo prohíbe (norma 1.1.4). Las preguntas Picante están escritas para insinuar sin ser explícitas; aun así, conviene revisarlas antes de enviar.

## 7. Costes estimados

| Concepto | Coste |
|---|---|
| Apple Developer Program | 99 €/año |
| Compilación (Codemagic gratuito o Mac propio) | 0 € |
| RevenueCat | 0 € hasta 2.500 $/mes de ingresos |
| Dominio propio (opcional) | ~12 €/año |
| **Total mínimo** | **~99 €/año** |

Con un precio de 3,99 € y un 15 % de comisión, recibes unos 2,80 € por venta en España, después del IVA y de la comisión de Apple.

## 8. Checklist antes de enviar

- [ ] Cuenta de desarrollador activa, acuerdos firmados, datos fiscales y bancarios completos.
- [ ] Estado de comerciante de la UE declarado.
- [ ] Nombre comprobado y disponible.
- [ ] App nativa con vibración, menú de compartir nativo y guardado nativo.
- [ ] Compra única configurada, probada en sandbox y con "Restaurar compras".
- [ ] `PrivacyInfo.xcprivacy` incluido y etiqueta "Datos no recopilados" configurada.
- [ ] URL de privacidad y de soporte funcionando.
- [ ] Cuestionario de edad completado.
- [ ] Preguntas Picante revisadas a mano.
- [ ] Capturas, icono de 1024 px, textos y palabras clave.
- [ ] Beta en TestFlight con al menos 10 personas, sin errores graves.
- [ ] Notas para el revisor escritas.

## 9. Siguientes pasos recomendados

1. **Tú:** date de alta en el Apple Developer Program y decide el modelo de negocio (sección 2).
2. **Yo:** creo el proyecto de Capacitor con los plugins nativos, la capa de almacenamiento y la imagen del resultado para compartir. Todo sigue funcionando también como web.
3. **Tú y yo:** cuando la cuenta esté activa, configuramos la compra, compilamos y subimos la primera versión a TestFlight.
