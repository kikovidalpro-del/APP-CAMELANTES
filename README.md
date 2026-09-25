# 🔥💬 Camelantes

Juego para iPhone para que **dos personas que se están conociendo descubran si encajarían como pareja**: **1000 situaciones** de pareja (día a día, vergüenza, riesgo, romance, dilemas, amigos y familia, y picante +18), cada una con **3 respuestas**. Cada pregunta muestra el nombre de la otra persona. Al final, cada uno descubre su **tipo de personalidad** y cómo es en pareja, y los dos reciben su **porcentaje de afinidad** y una lectura de en qué están en sintonía y de qué deberían hablar.

## Cómo se juega

1. Dos jugadores, un solo móvil.
2. En cada situación, cada uno elige **en secreto** cómo actuaría (A, B o C).
3. Con el modo **“Adivina”**, además intentáis acertar qué ha elegido el otro.
4. La app os avisa de cuándo pasar el móvil y después revela las dos respuestas.
5. Al terminar: % de afinidad, tipo de personalidad de cada uno, perfiles comparados, coincidencia por categoría y las preguntas en las que más chocasteis.

Partidas de 10, 20, 30 o 50 preguntas, y podéis elegir qué categorías entran. La app recuerda las preguntas ya jugadas en cada móvil y no las repite hasta haberlas visto todas. La categoría 🌶️ Picante viene desactivada y pide confirmar la mayoría de edad.

## Personalidad y afinidad

Cada respuesta suma puntos en 4 rasgos:

| Rasgo | Polo + | Polo − |
|---|---|---|
| Energía | Extroversión (E) | Introversión (I) |
| Riesgo | Atrevimiento (A) | Prudencia (P) |
| Decisiones | Corazón (C) | Lógica (L) |
| Comunicación | Franqueza (D) | Diplomacia (T) |

La combinación da uno de **16 tipos** (p. ej. `EPCT` → *Pegamento del grupo*).

Cada respuesta se mide respecto a la media de las 3 opciones de su pregunta, para que ningún polo salga favorecido.

**Afinidad** = 50 % coincidencia de respuestas (suavizada, porque coincidir entre 3 opciones es difícil) + 50 % parecido entre los perfiles de personalidad.

## Instalarla en el iPhone

Es una web app (PWA): no hace falta Mac, ni App Store, ni cuenta de desarrollador.

1. Publica el repo con GitHub Pages: en **Settings → Pages → Source**, elige **GitHub Actions**. El workflow `.github/workflows/pages.yml` la publica en cada push a la rama principal del repositorio. GitHub Pages solo funciona en repositorios **públicos** (o privados con GitHub Pro).
2. Abre la URL (`https://<usuario>.github.io/<repo>/`) en **Safari** en el iPhone.
3. Pulsa **Compartir → Añadir a pantalla de inicio**.

Se abre a pantalla completa con su icono, funciona sin conexión y guarda la partida si la cierras.

## Desarrollo

Sin dependencias ni paso de compilación. Para probarla en local:

```sh
python3 -m http.server 8000
# abre http://localhost:8000
```

| Archivo | Contenido |
|---|---|
| `js/questions.js` | Las 1000 situaciones de pareja y los puntos de cada respuesta |
| `js/personality.js` | Los 16 tipos y el cálculo de perfil y afinidad |
| `js/app.js` | Pantallas y flujo del juego |
| `css/styles.css` | Estilos (adaptados a notch / safe areas del iPhone) |
| `sw.js`, `manifest.webmanifest` | Modo offline e instalación |

Los textos no presuponen el género de ninguno de los dos. `{pareja}` se sustituye en pantalla por el nombre de la otra persona.

Para añadir preguntas, añade un objeto a `QUESTIONS` con el siguiente `id` libre (no cambies los existentes: la app los usa para recordar las ya jugadas), `cat`, `text` y 3 `answers` con sus puntos `t` (`E`, `A`, `C`, `D`, de −2 a +2).

## Seguridad y App Store

- [`SECURITY.md`](SECURITY.md): cómo protege la app a sus usuarios y cómo informar de un problema.
- [`docs/PLAN-APP-STORE.md`](docs/PLAN-APP-STORE.md): plan para convertirla en app nativa y venderla en el App Store.
- [`privacidad.html`](privacidad.html): política de privacidad (URL obligatoria para el App Store).
