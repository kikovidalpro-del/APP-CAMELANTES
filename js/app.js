/* Camelantes — lógica de la app (sin dependencias). */

// v2: banco de preguntas de pareja (los ids de la v1 eran otras preguntas)
const STORAGE_KEY = "camelantes.game.v2";
const SEEN_KEY = "camelantes.seen.v2";
const ADULT_KEY = "camelantes.adult.v1";
// Datos de versiones anteriores que ya no se usan: se borran al arrancar
const LEGACY_KEYS = ["camelantes.game.v1", "camelantes.seen.v1"];
try { LEGACY_KEYS.forEach((k) => localStorage.removeItem(k)); } catch (_) { /* sin almacenamiento */ }
const MAX_NAME = 20;
const LETTERS = ["A", "B", "C"];
const COUNTS = [10, 20, 30, 50];

const app = document.getElementById("app");

let state = loadState() || freshState();
let setup = freshSetup();

function freshState() {
  return {
    screen: "home",
    players: ["", ""],
    guessMode: true,
    qids: [],
    index: 0,
    answers: [[], []],
    guesses: [[], []],
    turn: 0,
    phase: "own",
    pending: null,
  };
}

function freshSetup() {
  return {
    names: [...(state?.players || ["", ""])],
    count: 20,
    // Las categorías +18 empiezan desactivadas
    cats: new Set(Object.keys(CATEGORIES).filter((k) => !CATEGORIES[k].adult)),
    guess: state?.guessMode ?? true,
    askAdult: null, // categoría +18 pendiente de confirmar edad
  };
}

/* ─── Persistencia ─── */

function saveState() {
  const { confirmWipe, ...persisted } = state;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted)); } catch (_) { /* modo privado */ }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeState(JSON.parse(raw)) : null;
  } catch (_) {
    return null;
  }
}

/**
 * Valida una partida guardada. Los datos del almacenamiento local pueden estar
 * corruptos o manipulados: si algo no encaja, se descarta la partida.
 */
function sanitizeState(s) {
  const isChoice = (v) => v == null || (Number.isInteger(v) && v >= 0 && v <= 2);
  const choices = (arr) => Array.isArray(arr) && arr.length <= 1000 && arr.every(isChoice);
  const valid =
    s && typeof s === "object" &&
    Array.isArray(s.players) && s.players.length === 2 &&
    s.players.every((n) => typeof n === "string" && n.length <= MAX_NAME) &&
    Array.isArray(s.qids) && s.qids.length <= 1000 && s.qids.every((id) => QUESTIONS.some((q) => q.id === id)) &&
    Number.isInteger(s.index) && s.index >= 0 && s.index <= s.qids.length &&
    [0, 1].includes(s.turn) && ["own", "guess"].includes(s.phase) &&
    Array.isArray(s.answers) && s.answers.length === 2 && s.answers.every(choices) &&
    Array.isArray(s.guesses) && s.guesses.length === 2 && s.guesses.every(choices);
  if (!valid) return null;
  const screens = ["handoff", "question", "reveal", "results"];
  const last = s.screen === "home" ? s.resumeScreen : s.screen;
  return {
    ...freshState(),
    players: s.players,
    guessMode: s.guessMode === true,
    qids: s.qids,
    index: s.index,
    answers: s.answers,
    guesses: s.guesses,
    turn: s.turn,
    phase: s.phase,
    resumeScreen: screens.includes(last) ? last : "handoff",
  };
}

/* Preguntas ya jugadas en este dispositivo, para no repetirlas */
let seen = loadSeen();

function loadSeen() {
  try {
    const ids = JSON.parse(localStorage.getItem(SEEN_KEY));
    return new Set(Array.isArray(ids) ? ids.filter(Number.isInteger) : []);
  } catch (_) {
    return new Set();
  }
}

function adultConfirmed() {
  try { return localStorage.getItem(ADULT_KEY) === "1"; } catch (_) { return false; }
}

function clearLocalData() {
  try { [STORAGE_KEY, SEEN_KEY, ADULT_KEY].forEach((k) => localStorage.removeItem(k)); } catch (_) { /* nada que borrar */ }
  seen = new Set();
  state = freshState();
  setup = freshSetup();
}

function markSeen(id) {
  seen.add(id);
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...seen])); } catch (_) { /* modo privado */ }
}

function unseenCount(cats) {
  return QUESTIONS.filter((q) => cats.has(q.cat) && !seen.has(q.id)).length;
}

function hasGameInProgress() {
  return state.qids.length > 0 && state.index < state.qids.length;
}

function hasFinishedGame() {
  return state.qids.length > 0 && state.index >= state.qids.length;
}

/* ─── Utilidades ─── */

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const qById = (id) => QUESTIONS.find((q) => q.id === id);
const currentQuestions = () => state.qids.map(qById);
const firstPlayerOf = (i) => i % 2;
const currentPlayer = () => (state.turn === 0 ? firstPlayerOf(state.index) : 1 - firstPlayerOf(state.index));
const nameOf = (p) => esc(state.players[p]);
const nameTag = (p) => `<span class="name-p${p + 1}">${nameOf(p)}</span>`;

/** Texto de una pregunta visto por `viewer`: {pareja} es el nombre de la otra persona. */
const forPlayer = (text, viewer) => esc(text).replaceAll("{pareja}", nameOf(1 - viewer));
/** Texto de una pregunta cuando lo leen los dos a la vez. */
const forBoth = (text) => esc(text).replaceAll("{pareja}", "tu pareja");

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Elige N preguntas de `pool` repartidas de forma equilibrada entre las categorías. */
function pickBalanced(cats, count, pool) {
  const buckets = [...cats].map((c) => shuffle(pool.filter((q) => q.cat === c)));
  const picked = [];
  while (picked.length < count && buckets.some((b) => b.length)) {
    for (const b of shuffle(buckets)) {
      if (b.length && picked.length < count) picked.push(b.pop());
    }
  }
  return picked;
}

/**
 * Elige N preguntas priorizando las que aún no se han jugado en este dispositivo.
 * Si ya no quedan suficientes nuevas, se completan con otras ya vistas.
 */
function pickQuestions(cats, count) {
  const inCats = QUESTIONS.filter((q) => cats.has(q.cat));
  const fresh = pickBalanced(cats, count, inCats.filter((q) => !seen.has(q.id)));
  const used = new Set(fresh.map((q) => q.id));
  const refill = pickBalanced(cats, count - fresh.length, inCats.filter((q) => !used.has(q.id)));
  return shuffle([...fresh, ...refill]).map((q) => q.id);
}

function go(screen) {
  state.screen = screen;
  saveState();
  render();
  window.scrollTo(0, 0);
}

/* ─── Pantallas ─── */

function renderHome() {
  const cats = Object.values(CATEGORIES).map((c) => `<span class="tag">${c.emoji} ${c.label}</span>`).join("");
  return `
    <section class="screen">
      <div class="hero">
        <div class="logo">🔥💬</div>
        <h1>Camel<span class="gradient-text">antes</span></h1>
        <p class="muted">¿Encajaríais como pareja? ${QUESTIONS.length} situaciones para responder en secreto y descubrir vuestra afinidad.</p>
        <div class="cat-cloud">${cats}</div>
      </div>
      <div class="spacer"></div>
      <div class="stack">
        ${hasGameInProgress() ? `<button class="btn btn-primary" data-action="resume">Continuar partida (${state.index + 1}/${state.qids.length})</button>` : ""}
        ${hasFinishedGame() ? `<button class="btn" data-action="show-results">Ver último resultado</button>` : ""}
        <button class="btn ${hasGameInProgress() ? "" : "btn-primary"}" data-action="new">Nueva partida</button>
        <button class="btn btn-ghost" data-action="howto">Cómo se juega</button>
      </div>
    </section>`;
}

function renderHowTo() {
  return `
    <section class="screen">
      <div class="topbar"><button class="icon-btn" data-action="home" aria-label="Volver">←</button><h2>Cómo se juega</h2></div>
      <div class="card stack">
        <p><strong>1.</strong> Jugáis los dos con un solo móvil: ideal para una cita o para las primeras semanas de relación.</p>
        <p><strong>2.</strong> En cada situación, cada uno elige <em>en secreto</em> cómo actuaría entre 3 opciones.</p>
        <p><strong>3.</strong> Si activáis el modo <em>“Adivina”</em>, además intentáis adivinar qué ha elegido el otro.</p>
        <p><strong>4.</strong> Pasaos el móvil cuando la app lo diga. ¡Sin mirar!</p>
        <p><strong>5.</strong> Tras cada pregunta se revelan las respuestas. Al final veréis vuestro <strong>tipo de personalidad</strong> y vuestro <strong>porcentaje de afinidad</strong>.</p>
        <p><strong>6.</strong> La app recuerda las preguntas que ya habéis jugado en este móvil y no las repite hasta que hayáis visto todas.</p>
        <p><strong>7.</strong> La categoría 🌶️ <strong>Picante</strong> es solo para adultos y viene desactivada: actívala al crear la partida.</p>
      </div>
      <div class="card stack">
        <h3>Los 4 rasgos que medimos</h3>
        ${AXES.map((a) => `<p class="muted">${a.pos} ↔ ${a.neg}</p>`).join("")}
        <p class="muted">Combinándolos salen 16 tipos de personalidad distintos.</p>
      </div>
      <div class="card stack">
        <h3>Tus datos</h3>
        <p class="muted">Todo se guarda solo en este móvil: nombres, partida en curso y preguntas jugadas. No se envía nada a ningún servidor. <a href="privacidad.html" style="color:var(--p1)">Política de privacidad</a></p>
        ${state.confirmWipe
          ? `<p><strong>¿Borrar la partida, el historial de preguntas y la confirmación de edad?</strong></p>
             <div class="row"><button class="btn btn-small" data-action="wipe-yes">Sí, borrar</button><button class="btn btn-small btn-ghost" data-action="wipe-no">Cancelar</button></div>`
          : `<button class="btn btn-small btn-ghost" data-action="wipe">Borrar datos de este móvil</button>`}
      </div>
      <div class="spacer"></div>
      <button class="btn btn-primary" data-action="new">¡A jugar!</button>
    </section>`;
}

function renderSetup() {
  const available = QUESTIONS.filter((q) => setup.cats.has(q.cat)).length;
  const fresh = unseenCount(setup.cats);
  const canStart = setup.names.every((n) => n.trim()) && setup.cats.size > 0;
  return `
    <section class="screen">
      <div class="topbar"><button class="icon-btn" data-action="home" aria-label="Volver">←</button><h2>Nueva partida</h2></div>

      <div class="card stack">
        <label class="field"><span><span class="p1-dot"></span>Tu nombre</span>
          <input type="text" id="player-1" data-name="0" value="${esc(setup.names[0])}" placeholder="Nombre" maxlength="${MAX_NAME}" autocomplete="off" enterkeyhint="next">
        </label>
        <label class="field"><span><span class="p2-dot"></span>Nombre de la otra persona</span>
          <input type="text" id="player-2" data-name="1" value="${esc(setup.names[1])}" placeholder="Nombre" maxlength="${MAX_NAME}" autocomplete="off" enterkeyhint="done">
        </label>
      </div>

      <div class="card stack">
        <h3>Número de preguntas</h3>
        <div class="chips">
          ${COUNTS.map((n) => `<button class="chip" data-action="count" data-value="${n}" aria-pressed="${setup.count === n}">${n}</button>`).join("")}
        </div>
      </div>

      <div class="card stack">
        <h3>Tipos de situaciones</h3>
        <div class="chips">
          ${Object.entries(CATEGORIES).map(([k, c]) => `<button class="chip" data-action="cat" data-value="${k}" aria-pressed="${setup.cats.has(k)}">${c.emoji} ${c.label}${c.adult ? " +18" : ""}</button>`).join("")}
        </div>
        ${setup.askAdult ? `
          <div class="card stack" role="alertdialog" aria-label="Confirmación de edad">
            <p><strong>🌶️ Contenido para adultos</strong></p>
            <p class="muted">Esta categoría incluye situaciones de contenido sexual sugerente. Confirma que los dos jugadores tenéis 18 años o más.</p>
            <div class="row"><button class="btn btn-small" data-action="adult-yes">Somos mayores de 18</button><button class="btn btn-small btn-ghost" data-action="adult-no">Cancelar</button></div>
          </div>` : ""}
        <p class="muted">${setup.cats.size ? `${fresh} de ${available} preguntas sin jugar todavía.` : "Elige al menos una categoría."}</p>
      </div>

      <div class="card toggle-row">
        <div>
          <h3>Modo “Adivina”</h3>
          <p class="muted">Intentad adivinar qué respondería el otro.</p>
        </div>
        <label class="switch"><input type="checkbox" data-action="guess" ${setup.guess ? "checked" : ""}><span></span></label>
      </div>

      <button class="btn btn-primary" data-action="start" ${canStart ? "" : "disabled"}>Empezar</button>
    </section>`;
}

function topbar() {
  const pct = (state.index / state.qids.length) * 100;
  return `
    <div class="topbar">
      <button class="icon-btn" data-action="pause" aria-label="Salir">✕</button>
      <div class="progress"><div style="width:${pct}%"></div></div>
      <div class="counter">${state.index + 1}/${state.qids.length}</div>
    </div>`;
}

function renderHandoff() {
  const p = currentPlayer();
  const other = 1 - p;
  const isFirstEver = state.index === 0 && state.turn === 0;
  return `
    <section class="screen">
      ${topbar()}
      <div class="handoff">
        <div class="big-emoji">📱</div>
        <h2>${isFirstEver ? "Empieza" : "Turno de"} ${nameTag(p)}</h2>
        <p class="muted">${state.turn === 1 ? `${nameTag(other)}, pásale el móvil y no mires 👀` : "Que el otro no mire la pantalla 👀"}</p>
      </div>
      <button class="btn btn-primary" data-action="ready">Soy ${nameOf(p)}, ¡vamos!</button>
    </section>`;
}

function renderQuestion() {
  const q = qById(state.qids[state.index]);
  const cat = CATEGORIES[q.cat];
  const p = currentPlayer();
  const other = 1 - p;
  const guessing = state.phase === "guess";
  const prompt = guessing
    ? `¿Qué crees que elegirá ${nameTag(other)}?`
    : "¿Qué harías tú?";
  // Al adivinar se ve la situación tal como le aparece a la otra persona
  const viewer = guessing ? other : p;
  return `
    <section class="screen">
      ${topbar()}
      <div class="row" style="justify-content:space-between">
        <span class="tag" style="color:${cat.color}">${cat.emoji} ${cat.label}</span>
        <span class="who p${p + 1}">${nameOf(p)}</span>
      </div>
      ${guessing ? `<p class="muted">Ponte en el lugar de ${nameTag(other)}. Así le aparece la situación:</p>` : ""}
      <p class="situation">${forPlayer(q.text, viewer)}</p>
      <p class="muted"><strong>${prompt}</strong></p>
      <div class="options">
        ${q.answers.map((a, i) => `
          <button class="option ${state.pending === i ? "selected" : ""}" data-action="pick" data-value="${i}">
            <span class="letter">${LETTERS[i]}</span><span>${forPlayer(a.text, viewer)}</span>
          </button>`).join("")}
      </div>
      <div class="spacer"></div>
      <button class="btn btn-primary" data-action="confirm" ${state.pending == null ? "disabled" : ""}>
        ${guessing || !state.guessMode ? "Confirmar" : "Siguiente"}
      </button>
    </section>`;
}

function renderReveal() {
  const i = state.index;
  const q = qById(state.qids[i]);
  const [a0, a1] = [state.answers[0][i], state.answers[1][i]];
  const match = a0 === a1;
  const card = (p) => {
    const own = state.answers[p][i];
    const guess = state.guesses[p][i];
    const hit = guess === state.answers[1 - p][i];
    return `
      <div class="card reveal-card p${p + 1}">
        <span class="label name-p${p + 1}">${nameOf(p)}</span>
        <p><strong>${LETTERS[own]}.</strong> ${forPlayer(q.answers[own].text, p)}</p>
        ${state.guessMode ? `<p class="guess-line ${hit ? "hit" : ""}">${hit ? "✅ Adivinó" : "❌ Pensaba"} que ${nameOf(1 - p)} elegiría la ${LETTERS[guess]}</p>` : ""}
      </div>`;
  };
  const last = i + 1 >= state.qids.length;
  return `
    <section class="screen">
      ${topbar()}
      <p class="muted">${forBoth(q.text)}</p>
      <div class="banner ${match ? "match" : "nomatch"}">${match ? "🎯 ¡Habéis coincidido!" : "⚡ Pensáis distinto"}</div>
      ${card(0)}
      ${card(1)}
      <div class="spacer"></div>
      <button class="btn btn-primary" data-action="next">${last ? "Ver resultados ✨" : "Siguiente pregunta"}</button>
    </section>`;
}

function axisBars(profiles) {
  return AXES.map((ax) => {
    // perfil en [-1,1] → posición en %: negativo a la izquierda, positivo a la derecha
    const pos = (v) => ((v + 1) / 2) * 100;
    const dots = profiles.map((pr, p) => `<div class="axis-dot p${p + 1}" style="left:${pos(pr[ax.key])}%"></div>`).join("");
    return `
      <div class="axis">
        <div class="axis-labels"><span>${ax.neg}</span><span>${ax.pos}</span></div>
        <div class="axis-track">${dots}</div>
      </div>`;
  }).join("");
}

function renderResults() {
  const qs = currentQuestions();
  const res = computeAffinity(qs, state.answers[0], state.answers[1]);
  const verdict = affinityVerdict(res.affinity);
  const r = 92;
  const circ = 2 * Math.PI * r;

  const typeCard = (p) => {
    const code = typeCode(res.profiles[p]);
    const t = TYPES[code];
    return `
      <div class="card type-card">
        <span class="label name-p${p + 1}" style="font-weight:700">El tipo de ${nameOf(p)}</span>
        <div class="type-head">
          <div class="type-emoji">${t.emoji}</div>
          <div><h3>${t.name}</h3><div class="type-code">${code}</div></div>
        </div>
        <p class="muted">${t.desc}</p>
        <p><strong>En pareja:</strong> ${t.couple.replace(/^En pareja /, "")}</p>
      </div>`;
  };

  const knows = (p) => {
    let hits = 0, total = 0;
    qs.forEach((_, i) => {
      if (state.guesses[p][i] == null) return;
      total++;
      if (state.guesses[p][i] === state.answers[1 - p][i]) hits++;
    });
    return total ? Math.round((hits / total) * 100) : 0;
  };

  const catRows = Object.entries(res.perCat).map(([k, v]) => {
    const c = CATEGORIES[k];
    const pct = Math.round((v.same / v.total) * 100);
    return `
      <div class="bar-row">
        <span>${c.emoji} ${c.label}</span>
        <div class="bar"><div style="width:${pct}%;background:${c.color}"></div></div>
        <strong style="text-align:right">${pct}%</strong>
      </div>`;
  }).join("");

  const clashes = qs
    .map((q, i) => ({ q, a: state.answers[0][i], b: state.answers[1][i] }))
    .filter((x) => x.a !== x.b);
  const clashList = shuffle(clashes).slice(0, 3).map(({ q, a, b }) => `
    <div class="clash">
      <p><strong>${forBoth(q.text)}</strong></p>
      <p><span class="name-p1">${nameOf(0)}:</span> ${forPlayer(q.answers[a].text, 0)}</p>
      <p><span class="name-p2">${nameOf(1)}:</span> ${forPlayer(q.answers[b].text, 1)}</p>
    </div>`).join("");

  return `
    <section class="screen">
      <div class="topbar"><button class="icon-btn" data-action="home" aria-label="Inicio">⌂</button><h2>Resultados</h2></div>

      <div class="ring-wrap">
        <div class="ring">
          <svg width="210" height="210" viewBox="0 0 210 210" aria-hidden="true">
            <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#ffb84d"/><stop offset="1" stop-color="#ff5c7a"/></linearGradient></defs>
            <circle cx="105" cy="105" r="${r}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="16"/>
            <circle id="ring-progress" cx="105" cy="105" r="${r}" fill="none" stroke="url(#g)" stroke-width="16" stroke-linecap="round"
              stroke-dasharray="${circ}" stroke-dashoffset="${circ}" style="transition:stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)" data-target="${circ * (1 - res.affinity / 100)}"/>
          </svg>
          <div class="value"><div><strong id="affinity-num" data-target="${res.affinity}">0%</strong><span>de afinidad</span></div></div>
        </div>
      </div>
      <div class="center stack">
        <h2 class="gradient-text">${verdict.title}</h2>
        <p class="muted">${verdict.text}</p>
      </div>

      <div class="stat-grid">
        <div class="card stat"><strong>${res.same}/${res.answered}</strong><span>respuestas iguales</span></div>
        <div class="card stat"><strong>${Math.round(res.profileSimilarity * 100)}%</strong><span>personalidad parecida</span></div>
        ${state.guessMode ? `
          <div class="card stat"><strong class="name-p1">${knows(0)}%</strong><span>lo que ${nameOf(0)} conoce a ${nameOf(1)}</span></div>
          <div class="card stat"><strong class="name-p2">${knows(1)}%</strong><span>lo que ${nameOf(1)} conoce a ${nameOf(0)}</span></div>` : ""}
      </div>

      ${typeCard(0)}
      ${typeCard(1)}

      <div class="card stack">
        <h3>Vuestros perfiles, cara a cara</h3>
        <div class="legend"><span><span class="p1-dot"></span>${nameOf(0)}</span><span><span class="p2-dot"></span>${nameOf(1)}</span></div>
        ${axisBars(res.profiles)}
      </div>

      <div class="card stack">
        <h3>Coincidencia por tipo de situación</h3>
        ${catRows}
      </div>

      <div class="card stack">
        <h3>Vosotros como pareja 💞</h3>
        ${coupleInsights(res.profiles[0], res.profiles[1]).map((x) => `
          <p><span class="tag">${x.close ? "✅ En sintonía" : "⚠️ Hablad de esto"}</span></p>
          <p class="muted"><strong>${x.axis.pos} / ${x.axis.neg}.</strong> ${x.text}</p>`).join("")}
      </div>

      ${clashList ? `<div class="card stack"><h3>Donde más chocasteis ⚡</h3>${clashList}</div>` : ""}

      <div class="stack">
        <button class="btn btn-primary" data-action="share">Compartir resultado</button>
        <button class="btn" data-action="rematch">Revancha (nuevas preguntas)</button>
        <button class="btn btn-ghost" data-action="new">Nueva partida</button>
      </div>
    </section>`;
}

function animateResults() {
  const ring = document.getElementById("ring-progress");
  const num = document.getElementById("affinity-num");
  if (!ring || !num) return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    ring.style.strokeDashoffset = ring.dataset.target;
  }));
  const target = Number(num.dataset.target);
  const t0 = performance.now();
  const dur = 1400;
  const step = (now) => {
    const k = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - k, 3);
    num.textContent = `${Math.round(target * eased)}%`;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ─── Render ─── */

const SCREENS = {
  home: renderHome,
  howto: renderHowTo,
  setup: renderSetup,
  handoff: renderHandoff,
  question: renderQuestion,
  reveal: renderReveal,
  results: renderResults,
};

function render() {
  app.innerHTML = (SCREENS[state.screen] || renderHome)();
  if (state.screen === "results") animateResults();
}

/* ─── Acciones ─── */

function startGame(players, guessMode, qids) {
  state = {
    ...freshState(),
    players,
    guessMode,
    qids,
    screen: "handoff",
  };
  go("handoff");
}

function finishTurn() {
  state.pending = null;
  state.phase = "own";
  if (state.turn === 0) {
    state.turn = 1;
    go("handoff");
  } else {
    go("reveal");
  }
}

async function share(btn) {
  const res = computeAffinity(currentQuestions(), state.answers[0], state.answers[1]);
  const types = res.profiles.map((p) => TYPES[typeCode(p)]);
  const text =
    `🔥 ${state.players[0]} y ${state.players[1]} tenemos un ${res.affinity}% de afinidad como pareja en Camelantes.\n` +
    `${types[0].emoji} ${state.players[0]}: ${types[0].name}\n` +
    `${types[1].emoji} ${state.players[1]}: ${types[1].name}`;
  try {
    await navigator.share({ title: "Camelantes", text, url: location.href });
    return;
  } catch (e) {
    if (e?.name === "AbortError") return; // el usuario cerró el menú de compartir
  }
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = "¡Copiado! Pégalo donde quieras";
  } catch (_) {
    btn.textContent = "No se pudo copiar el resultado";
  }
}

const actions = {
  home: () => go("home"),
  howto: () => { state.confirmWipe = false; go("howto"); },
  new: () => { setup = freshSetup(); go("setup"); },
  resume: () => {
    // Por privacidad se vuelve a "pasa el móvil", salvo a mitad de adivinar o en la revelación
    const rs = state.resumeScreen;
    if (rs === "reveal") go("reveal");
    else if (rs === "question" && state.phase === "guess") go("question");
    else go("handoff");
  },
  "show-results": () => go("results"),
  pause: () => { state.resumeScreen = state.screen; go("home"); },

  count: (el) => { setup.count = Number(el.dataset.value); render(); },
  cat: (el) => {
    const k = el.dataset.value;
    if (!CATEGORIES[k]) return;
    if (setup.cats.has(k)) setup.cats.delete(k);
    else if (CATEGORIES[k].adult && !adultConfirmed()) setup.askAdult = k;
    else setup.cats.add(k);
    render();
  },
  "adult-yes": () => {
    try { localStorage.setItem(ADULT_KEY, "1"); } catch (_) { /* se volverá a preguntar */ }
    setup.cats.add(setup.askAdult);
    setup.askAdult = null;
    render();
  },
  "adult-no": () => { setup.askAdult = null; render(); },
  wipe: () => { state.confirmWipe = true; render(); },
  "wipe-no": () => { state.confirmWipe = false; render(); },
  "wipe-yes": () => { clearLocalData(); render(); window.scrollTo(0, 0); }, // sin guardar nada tras borrar
  start: () => {
    const players = setup.names.map((n) => n.trim().slice(0, MAX_NAME));
    if (!players.every(Boolean) || !setup.cats.size) return;
    startGame(players, setup.guess, pickQuestions(setup.cats, setup.count));
  },
  rematch: () => {
    const cats = new Set(currentQuestions().map((q) => q.cat));
    startGame(state.players, state.guessMode, pickQuestions(cats, state.qids.length));
  },

  ready: () => { state.phase = "own"; state.pending = null; go("question"); },
  pick: (el) => { state.pending = Number(el.dataset.value); saveState(); render(); },
  confirm: () => {
    if (state.pending == null) return;
    const p = currentPlayer();
    if (state.phase === "own") {
      state.answers[p][state.index] = state.pending;
      if (state.guessMode) {
        state.phase = "guess";
        state.pending = null;
        go("question");
        return;
      }
    } else {
      state.guesses[p][state.index] = state.pending;
    }
    finishTurn();
  },
  next: () => {
    markSeen(state.qids[state.index]);
    state.index++;
    state.turn = 0;
    go(state.index >= state.qids.length ? "results" : "handoff");
  },
  share,
};

app.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el || el.tagName === "INPUT") return;
  const fn = actions[el.dataset.action];
  if (fn) fn(el);
});

app.addEventListener("input", (e) => {
  const el = e.target;
  if (el.dataset.name != null) {
    setup.names[Number(el.dataset.name)] = el.value;
    const btn = app.querySelector('[data-action="start"]');
    if (btn) btn.disabled = !(setup.names.every((n) => n.trim()) && setup.cats.size);
  }
});

app.addEventListener("change", (e) => {
  if (e.target.dataset.action === "guess") setup.guess = e.target.checked;
});

app.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" || e.target.dataset.name == null) return;
  const next = app.querySelector(`[data-name="${Number(e.target.dataset.name) + 1}"]`);
  if (next) next.focus();
  else e.target.blur();
});

render();
