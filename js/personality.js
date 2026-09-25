/*
 * Tipos de personalidad y cálculo de afinidad.
 */

const AXES = [
  { key: "E", pos: "Extroversión", neg: "Introversión", posLetter: "E", negLetter: "I" },
  { key: "A", pos: "Atrevimiento", neg: "Prudencia",     posLetter: "A", negLetter: "P" },
  { key: "C", pos: "Corazón",      neg: "Lógica",       posLetter: "C", negLetter: "L" },
  { key: "D", pos: "Franqueza",    neg: "Diplomacia",  posLetter: "D", negLetter: "T" },
];

/*
 * 16 tipos. Nombres y textos sin género, porque no sabemos el de quien juega.
 * `couple`: cómo suele ser este tipo en pareja.
 */
const TYPES = {
  EACD: { name: "Torbellino", emoji: "🌪️",
    desc: "Vives a tope y sientes a tope. Dices lo que piensas en el momento y te lanzas sin red. Contigo nunca hay un día aburrido.",
    couple: "En pareja das intensidad y pasión, y necesitas a alguien que no se asuste de tu sinceridad ni de tu ritmo." },
  EACT: { name: "Alma de la fiesta", emoji: "🥳",
    desc: "Te apuntas a todo y consigues que todo el mundo lo pase bien. Tienes un radar para las emociones de los demás y suavizas cualquier situación con una sonrisa.",
    couple: "En pareja eres pura complicidad y buen rollo, pero te cuesta sacar los temas incómodos: ojo con guardarte lo que te molesta." },
  EALD: { name: "Líder audaz", emoji: "🦁",
    desc: "Tomas decisiones rápidas, las argumentas y vas de frente. En una crisis, todas las miradas van hacia ti.",
    couple: "En pareja tiras del carro y das seguridad, pero necesitas recordar que las decisiones importantes se toman entre dos." },
  EALT: { name: "Estratega con carisma", emoji: "♟️",
    desc: "Tienes encanto y cabeza a partes iguales. Te mueves bien entre la gente, arriesgas cuando las cuentas salen y sabes qué decir en cada momento.",
    couple: "En pareja sabes negociar y hacer planes a largo plazo; a veces a tu pareja le vendría bien verte improvisar y dejarte llevar." },
  EPCD: { name: "Escudo sincero", emoji: "🛡️",
    desc: "Cuidas de tu gente y no te callas cuando algo no está bien. Prefieres lo seguro a lo loco, pero nunca dejarías a nadie en la estacada.",
    couple: "En pareja eres un refugio: lealtad, protección y claridad. Buscas estabilidad y alguien con quien construir." },
  EPCT: { name: "Pegamento del grupo", emoji: "🤝",
    desc: "Unes a todo el mundo. Evitas los conflictos, piensas en cómo se sienten los demás y haces que todos se sientan en casa.",
    couple: "En pareja das mucho cariño y paz, y te encanta compartir amigos y familia. Aprende a pedir lo que necesitas." },
  EPLD: { name: "Mente organizada", emoji: "📋",
    desc: "Tienes sentido práctico, don de gentes y claridad. Te gusta tener un plan, que se cumpla y decir las cosas como son.",
    couple: "En pareja pones orden y cumples lo que prometes; la espontaneidad de la otra persona puede darte ese punto de chispa." },
  EPLT: { name: "Alma conciliadora", emoji: "🕊️",
    desc: "Lees cada situación y encuentras la salida que menos duele. Con don de gentes y sensatez, arreglas cualquier lío.",
    couple: "En pareja las discusiones duran poco contigo; eso sí, que buscar la paz no te lleve a esconder lo que sientes." },
  IACD: { name: "Rebelde en silencio", emoji: "🎸",
    desc: "No necesitas público, pero cuando algo te importa vas a por ello con todo. Intensidad, autenticidad y cero filtros con quien se lo gana.",
    couple: "En pareja eres de pocas palabras pero de hechos enormes. Necesitas espacio propio y alguien que respete tu forma de ser." },
  IACT: { name: "Espíritu soñador", emoji: "🌙",
    desc: "Tienes un mundo interior enorme y ganas de vivir experiencias únicas. Te mueves por intuición y emoción, siempre con delicadeza.",
    couple: "En pareja eres romanticismo y planes inesperados a solas. Te hace falta alguien que te escuche sin prisas." },
  IALD: { name: "Lobo solitario", emoji: "🐺",
    desc: "Independencia, valentía y cero rodeos. Piensas por tu cuenta, asumes riesgos calculados y no te importa ir a contracorriente.",
    couple: "En pareja das libertad y la pides. Funciona de maravilla con alguien que tenga su propia vida y te diga las cosas claras." },
  IALT: { name: "Mente fría", emoji: "🧊",
    desc: "Observas, analizas y, cuando actúas, das en el blanco. Te atreves con lo que otros no, pero siempre con un plan B.",
    couple: "En pareja das calma en las crisis; a tu pareja puede costarle leer lo que sientes, así que díselo de vez en cuando." },
  IPCD: { name: "Corazón leal", emoji: "🏰",
    desc: "Pocas personas, pero para siempre. Eres prudente y sensible, y cuando alguien de los tuyos lo necesita, hablas claro y das la cara.",
    couple: "En pareja la fidelidad y la confianza lo son todo para ti. Vas despacio, pero cuando te entregas es de verdad." },
  IPCT: { name: "Confidente", emoji: "🫶",
    desc: "Escuchas como nadie y guardas los secretos bajo llave. Transmites calma, empatía y cuidado.",
    couple: "En pareja eres ternura y comprensión. Tu reto: expresar también tus propias necesidades, no solo atender las de tu pareja." },
  IPLD: { name: "Analista", emoji: "🔍",
    desc: "Razón, serenidad y honestidad hasta la médula. Prefieres los hechos a los dramas y sueles saber cuál es la opción más sensata.",
    couple: "En pareja eres alguien en quien confiar para las decisiones serias; un gesto romántico de vez en cuando hará maravillas." },
  IPLT: { name: "Mirada atenta", emoji: "🦉",
    desc: "Discreción y reflexión. Te fijas en todo, calculas cada paso y evitas los conflictos innecesarios.",
    couple: "En pareja lo recuerdas todo y cuidas los detalles; necesitas confianza y tiempo para abrirte del todo." },
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
  if (pct >= 90) return { title: "Almas gemelas", text: "Es casi inquietante: pensáis igual hasta en lo más íntimo. Tenéis una base enorme para construir algo juntos." };
  if (pct >= 75) return { title: "Pareja con futuro", text: "Encajáis de maravilla. Os entendéis sin necesidad de hablar y vuestras diferencias suman." };
  if (pct >= 60) return { title: "Buena química", text: "Tenéis mucho en común y lo justo de diferente para no aburriros nunca." };
  if (pct >= 45) return { title: "Polos que se complementan", text: "Veis la vida de forma distinta. Si habláis las diferencias, podéis completaros." };
  if (pct >= 30) return { title: "Mundos distintos", text: "Os va a tocar negociar bastante. Mirad abajo dónde chocáis más y habladlo." };
  return { title: "Agua y aceite", text: "Casi nunca coincidís. Los opuestos se atraen… pero necesitaréis mucha paciencia." };
}

/**
 * Qué significa cada rasgo para vosotros como pareja.
 * Devuelve una línea por rasgo según lo cerca o lejos que estéis.
 */
const AXIS_INSIGHTS = {
  E: {
    close: "Tenéis el mismo ritmo social: estaréis de acuerdo en cuántos planes hacer y cuánto sofá.",
    far: "A una parte le cargan las pilas los planes con gente y a la otra, estar en casa. Pactad planes a medias y respetad el tiempo a solas.",
  },
  A: {
    close: "Os parecéis en cuánto arriesgáis: decidiréis viajes, dinero y cambios de vida sin tiras y aflojas.",
    far: "Una parte se lanza y la otra frena. Bien llevado, os protegéis; mal llevado, os desesperáis.",
  },
  C: {
    close: "Decidís de la misma manera, con la cabeza o con el corazón: os entenderéis en los momentos difíciles.",
    far: "Una parte decide con el corazón y la otra con la cabeza. Escuchad los motivos antes de discutir.",
  },
  D: {
    close: "Discutís igual: sabréis cómo arreglar un enfado sin malentendidos.",
    far: "Una parte lo suelta todo y la otra se lo guarda. Acordad cómo sacar los temas para que nadie se sienta atacado.",
  },
};

function coupleInsights(pa, pb) {
  return AXES.map((ax) => {
    const gap = Math.abs(pa[ax.key] - pb[ax.key]);
    const sameSide = (pa[ax.key] >= 0) === (pb[ax.key] >= 0);
    const close = sameSide || gap < 0.35;
    return { axis: ax, close, text: AXIS_INSIGHTS[ax.key][close ? "close" : "far"] };
  });
}
