/*
 * Tipos de personalidad y cálculo de afinidad.
 */

const AXES = [
  { key: "E", pos: "Extrovertido", neg: "Introvertido", posLetter: "E", negLetter: "I" },
  { key: "A", pos: "Atrevido",     neg: "Prudente",     posLetter: "A", negLetter: "P" },
  { key: "C", pos: "Corazón",      neg: "Lógica",       posLetter: "C", negLetter: "L" },
  { key: "D", pos: "Directo",      neg: "Diplomático",  posLetter: "D", negLetter: "T" },
];

const TYPES = {
  EACD: { name: "El Torbellino", emoji: "🌪️",
    desc: "Vives a tope y sientes a tope. Dices lo que piensas en el momento y te lanzas sin red. Contigo nunca hay un día aburrido, aunque a veces vayas más rápido que tu propia cabeza." },
  EACT: { name: "El Alma de la Fiesta", emoji: "🥳",
    desc: "Te apuntas a todo y consigues que todos se lo pasen bien. Tienes un radar para las emociones de los demás y sabes suavizar cualquier situación con una sonrisa." },
  EALD: { name: "El Líder Audaz", emoji: "🦁",
    desc: "Tomas decisiones rápidas, las argumentas y vas de frente. En una crisis todos miran hacia ti. Tu reto: recordar que no todo el mundo va a tu velocidad." },
  EALT: { name: "El Estratega Carismático", emoji: "♟️",
    desc: "Encantador y calculador a partes iguales. Te mueves bien entre la gente, arriesgas cuando las cuentas salen y sabes exactamente qué decir y cuándo." },
  EPCD: { name: "El Protector Sincero", emoji: "🛡️",
    desc: "Cuidas de tu gente y no te callas cuando algo no está bien. Prefieres lo seguro a lo loco, pero nunca dejarías tirado a nadie." },
  EPCT: { name: "El Pegamento del Grupo", emoji: "🤝",
    desc: "Eres quien une a todo el mundo. Evitas los conflictos, piensas en cómo se sienten los demás y haces que todos se sientan en casa." },
  EPLD: { name: "El Organizador", emoji: "📋",
    desc: "Práctico, sociable y claro. Te gusta tener un plan, que se cumpla y decir las cosas como son. Sin ti, el grupo seguiría decidiendo dónde cenar." },
  EPLT: { name: "El Diplomático", emoji: "🕊️",
    desc: "Sabes leer cada situación y encontrar la salida que menos duele. Sociable pero sensato, eres el mediador perfecto en cualquier lío." },
  IACD: { name: "El Rebelde Silencioso", emoji: "🎸",
    desc: "No necesitas público, pero cuando algo te importa vas a por ello con todo. Intenso, auténtico y sin filtros con quien se lo gana." },
  IACT: { name: "El Soñador Aventurero", emoji: "🌙",
    desc: "Tienes un mundo interior enorme y ganas de vivir experiencias únicas. Te mueves por intuición y emoción, siempre con delicadeza." },
  IALD: { name: "El Lobo Solitario", emoji: "🐺",
    desc: "Independiente, valiente y sin rodeos. Piensas por tu cuenta, asumes riesgos calculados y no te importa ir contracorriente." },
  IALT: { name: "La Mente Fría", emoji: "🧊",
    desc: "Observas, analizas y cuando actúas, das en el blanco. Te atreves con lo que otros no, pero siempre con un as bajo la manga." },
  IPCD: { name: "El Guardián Leal", emoji: "🏰",
    desc: "Pocas personas, pero para siempre. Eres prudente y sensible, y cuando alguien de los tuyos lo necesita, hablas claro y das la cara." },
  IPCT: { name: "El Confidente", emoji: "🫶",
    desc: "Escuchas como nadie y guardas los secretos bajo llave. Tranquilo, empático y cuidadoso: la persona a la que todos llaman a las 3 de la mañana." },
  IPLD: { name: "El Analista", emoji: "🔍",
    desc: "Racional, sereno y honesto hasta la médula. Prefieres los hechos a los dramas y siempre sabes cuál es la opción más sensata." },
  IPLT: { name: "El Observador", emoji: "🦉",
    desc: "Discreto y reflexivo. Te fijas en todo, calculas cada paso y evitas los conflictos innecesarios. Pocas cosas te pillan por sorpresa." },
};

/**
 * Perfil normalizado de un jugador: cada eje en [-1, 1].
 * answers: array de índices de respuesta (o null), alineado con questions.
 */
function computeProfile(questions, answers) {
  const total = { E: 0, A: 0, C: 0, D: 0 };
  const max = { E: 0, A: 0, C: 0, D: 0 };
  questions.forEach((q, i) => {
    const choice = answers[i];
    if (choice == null) return;
    for (const { key } of AXES) {
      // Se mide respecto a la media de las 3 respuestas, para que una pregunta
      // cuyas opciones tiran hacia un polo no desequilibre el resultado.
      const values = q.answers.map((a) => a.t[key] || 0);
      const mean = (values[0] + values[1] + values[2]) / 3;
      max[key] += Math.max(...values.map((v) => Math.abs(v - mean)));
      total[key] += values[choice] - mean;
    }
  });
  const profile = {};
  for (const { key } of AXES) profile[key] = max[key] ? total[key] / max[key] : 0;
  return profile;
}

/** Código de 4 letras (clave de TYPES), p. ej. "EPCT". */
function typeCode(profile) {
  return AXES.map((ax) => (profile[ax.key] >= 0 ? ax.posLetter : ax.negLetter)).join("");
}

/**
 * Afinidad total entre dos jugadores (0–100) y desglose.
 */
function computeAffinity(questions, answersA, answersB) {
  let answered = 0;
  let same = 0;
  const perCat = {};
  questions.forEach((q, i) => {
    const a = answersA[i];
    const b = answersB[i];
    if (a == null || b == null) return;
    answered++;
    perCat[q.cat] ??= { same: 0, total: 0 };
    perCat[q.cat].total++;
    if (a === b) {
      same++;
      perCat[q.cat].same++;
    }
  });

  const pa = computeProfile(questions, answersA);
  const pb = computeProfile(questions, answersB);
  const axisDiff = AXES.reduce((acc, ax) => acc + Math.abs(pa[ax.key] - pb[ax.key]), 0) / AXES.length;
  const profileSimilarity = 1 - axisDiff / 2; // 0..1

  const matchRate = answered ? same / answered : 0;
  // Coincidir exactamente es difícil (1 de 3), así que se suaviza con raíz.
  const score = 0.5 * Math.sqrt(matchRate) + 0.5 * profileSimilarity;

  return {
    affinity: Math.round(score * 100),
    matchRate,
    same,
    answered,
    profileSimilarity,
    perCat,
    profiles: [pa, pb],
  };
}

function affinityVerdict(pct) {
  if (pct >= 90) return { title: "Almas gemelas", text: "Es casi inquietante. Pensáis igual hasta en las situaciones más absurdas." };
  if (pct >= 75) return { title: "Conexión brutal", text: "Encajáis de maravilla. Os entendéis sin necesidad de hablar." };
  if (pct >= 60) return { title: "Buena química", text: "Tenéis mucho en común y lo justo de diferente para no aburriros." };
  if (pct >= 45) return { title: "Polos complementarios", text: "Veis la vida distinto, pero eso puede hacer que os completéis." };
  if (pct >= 30) return { title: "Mundos distintos", text: "Vais a tener muchas conversaciones interesantes… y alguna discusión." };
  return { title: "Agua y aceite", text: "Casi nunca coincidís. ¡Pero los opuestos también se atraen!" };
}
