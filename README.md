# 🔥💬 Camelantes

Juego para iPhone para que **dos personas se conozcan de verdad**: situaciones incómodas, vergonzosas, peligrosas, amorosas, cotidianas y sociales, cada una con **3 respuestas**. Al final, cada jugador descubre su **tipo de personalidad** y la pareja recibe su **porcentaje de afinidad**.

## Cómo se juega

1. Dos jugadores, un solo móvil.
2. En cada situación, cada uno elige **en secreto** cómo actuaría (A, B o C).
3. Con el modo **“Adivina”**, además intentáis acertar qué ha elegido el otro.
4. La app os avisa de cuándo pasar el móvil y después revela las dos respuestas.
5. Al terminar: % de afinidad, tipo de personalidad de cada uno, perfiles comparados, coincidencia por categoría y las preguntas en las que más chocasteis.

Partidas de 10, 20, 30 o 50 preguntas, y podéis elegir qué categorías entran.

## Personalidad y afinidad

Cada respuesta suma puntos en 4 rasgos:

| Rasgo | Polo + | Polo − |
|---|---|---|
| Energía | Extrovertido (E) | Introvertido (I) |
| Riesgo | Atrevido (A) | Prudente (P) |
| Decisiones | Corazón (C) | Lógica (L) |
| Comunicación | Directo (D) | Diplomático (T) |

La combinación da uno de **16 tipos** (p. ej. `EPCT` → *El Pegamento del Grupo*).

**Afinidad** = 50 % coincidencia de respuestas (suavizada, porque coincidir entre 3 opciones es difícil) + 50 % parecido entre los perfiles de personalidad.

## Instalarla en el iPhone

Es una web app (PWA): no hace falta Mac, ni App Store, ni cuenta de desarrollador.

1. Publica el repo con GitHub Pages: en **Settings → Pages → Source**, elige **GitHub Actions**. El workflow `.github/workflows/pages.yml` la publica en cada push a `main`.
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
| `js/questions.js` | Las 50 situaciones y los puntos de cada respuesta |
| `js/personality.js` | Los 16 tipos y el cálculo de perfil y afinidad |
| `js/app.js` | Pantallas y flujo del juego |
| `css/styles.css` | Estilos (adaptados a notch / safe areas del iPhone) |
| `sw.js`, `manifest.webmanifest` | Modo offline e instalación |

Para añadir preguntas, añade un objeto a `QUESTIONS` con `id`, `cat`, `text` y 3 `answers` con sus puntos `t` (`E`, `A`, `C`, `D`, de −2 a +2).
