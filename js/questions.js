/*
 * Banco de preguntas.
 *
 * Cada respuesta suma puntos en 4 ejes de personalidad:
 *   E  → positivo: Extrovertido   · negativo: Introvertido
 *   A  → positivo: Atrevido       · negativo: Prudente
 *   C  → positivo: Corazón        · negativo: Lógica
 *   D  → positivo: Directo        · negativo: Diplomático (con tacto)
 */

const CATEGORIES = {
  cotidiana:  { label: "Cotidiana",  emoji: "🏠", color: "#4fb3ff" },
  vergonzosa: { label: "Vergonzosa", emoji: "😳", color: "#ff8fb1" },
  peligrosa:  { label: "Peligrosa",  emoji: "⚠️", color: "#ff9f43" },
  amorosa:    { label: "Amorosa",    emoji: "❤️", color: "#ff5c7a" },
  complicada: { label: "Complicada", emoji: "🤯", color: "#a78bfa" },
  social:     { label: "Social",     emoji: "🎉", color: "#34d399" },
};

const QUESTIONS = [
  // ───────────── COTIDIANAS ─────────────
  {
    id: 1, cat: "cotidiana",
    text: "El camarero te trae un plato que no has pedido… y tiene una pinta increíble.",
    answers: [
      { text: "Me lo como sin decir nada. El universo ha hablado.", t: { A: 2, D: -1 } },
      { text: "Aviso al camarero, que alguien se va a quedar sin cena.", t: { C: 1, D: 1, A: -1 } },
      { text: "Pregunto con mi mejor sonrisa si me lo dejan al mismo precio.", t: { E: 2, D: 1 } },
    ],
  },
  {
    id: 2, cat: "cotidiana",
    text: "Tu vecino pone la música a tope a las 2 de la madrugada. Es martes.",
    answers: [
      { text: "Bajo a hablar con él, en pijama y todo.", t: { D: 2, E: 1, A: 1 } },
      { text: "Le dejo una nota muy educada al día siguiente.", t: { D: -2, E: -1 } },
      { text: "Llamo a la policía o al administrador y que se encarguen.", t: { A: -1, C: -1, E: -1 } },
    ],
  },
  {
    id: 3, cat: "cotidiana",
    text: "Encuentras en la calle una cartera con 300 € y el DNI dentro.",
    answers: [
      { text: "Busco al dueño por redes y se la devuelvo en persona.", t: { C: 2, E: 1 } },
      { text: "La llevo a la policía y me olvido del tema.", t: { A: -2, C: -1 } },
      { text: "La devuelvo… pero me quedo 20 € de “recompensa”.", t: { A: 2, C: -1 } },
    ],
  },
  {
    id: 4, cat: "cotidiana",
    text: "Un amigo te pide dinero prestado por tercera vez sin haberte devuelto lo anterior.",
    answers: [
      { text: "Le digo claramente que no, hasta que me devuelva lo anterior.", t: { D: 2, C: -1 } },
      { text: "Se lo dejo otra vez. Es mi amigo.", t: { C: 2, D: -1 } },
      { text: "Me invento que este mes voy fatal de dinero.", t: { D: -2, A: -1 } },
    ],
  },
  {
    id: 5, cat: "cotidiana",
    text: "Te equivocas de autobús y acabas en la otra punta de la ciudad.",
    answers: [
      { text: "Aprovecho y me pongo a explorar la zona.", t: { A: 2, C: 1 } },
      { text: "Abro el mapa y calculo la ruta más rápida para volver.", t: { C: -2, A: -1 } },
      { text: "Le pregunto al conductor o a alguien de la parada.", t: { E: 2, D: 1 } },
    ],
  },
  {
    id: 6, cat: "cotidiana",
    text: "En la cola del súper alguien se te cuela descaradamente.",
    answers: [
      { text: "“Perdona, la cola empieza ahí atrás.”", t: { D: 2, E: 1 } },
      { text: "Resoplo fuerte y le miro fijamente, pero no digo nada.", t: { D: -1, C: 1 } },
      { text: "Lo dejo pasar. No merece la pena el mal rato.", t: { D: -2, C: -1 } },
    ],
  },
  {
    id: 7, cat: "cotidiana",
    text: "Te hacen un regalo horrible y la persona te pregunta, ilusionada, si te gusta.",
    answers: [
      { text: "“¡Me encanta!” …y va directo a un cajón para siempre.", t: { D: -2, C: 1 } },
      { text: "Le digo con cariño que no es mi estilo y si puedo cambiarlo.", t: { D: 2, C: 1 } },
      { text: "Lo uso delante de ella para que se sienta bien.", t: { C: 2, E: 1, A: 1 } },
    ],
  },
  {
    id: 8, cat: "cotidiana",
    text: "Tienes un domingo entero libre y sin planes.",
    answers: [
      { text: "Escribo a todo el mundo para montar algo.", t: { E: 2, A: 1 } },
      { text: "Sofá, manta, serie y el móvil en silencio.", t: { E: -2, A: -1 } },
      { text: "Cojo el coche sin rumbo, a ver qué pasa.", t: { A: 2, E: -1 } },
    ],
  },
  {
    id: 9, cat: "cotidiana",
    text: "Tu jefe te felicita delante de todos por un trabajo que en realidad hizo un compañero.",
    answers: [
      { text: "Digo en ese momento que el mérito es de mi compañero.", t: { D: 2, C: 1 } },
      { text: "Sonrío, acepto… y luego invito a mi compañero a un café.", t: { D: -2, C: 1 } },
      { text: "Aprovecho para decir que ha sido “trabajo en equipo”.", t: { D: -1, C: -1, E: 1 } },
    ],
  },

  // ───────────── VERGONZOSAS ─────────────
  {
    id: 10, cat: "vergonzosa",
    text: "En mitad de una reunión importante te das cuenta de que llevas la bragueta abierta desde por la mañana.",
    answers: [
      { text: "La cierro con disimulo y rezo para que nadie lo haya visto.", t: { E: -1, D: -1 } },
      { text: "Lo digo en voz alta y me río de mí mismo.", t: { E: 2, D: 2 } },
      { text: "Me excuso para ir al baño y vuelvo como si nada.", t: { A: -1, C: -1 } },
    ],
  },
  {
    id: 11, cat: "vergonzosa",
    text: "Saludas con un abrazo enorme a alguien… que resulta ser un completo desconocido.",
    answers: [
      { text: "Sigo la conversación como si nos conociéramos de toda la vida.", t: { A: 2, E: 1 } },
      { text: "“¡Uy, perdona, te he confundido!” y nos reímos.", t: { D: 2, E: 1 } },
      { text: "Finjo que en realidad saludaba a alguien que estaba detrás.", t: { D: -2, E: -1 } },
    ],
  },
  {
    id: 12, cat: "vergonzosa",
    text: "Mandas un audio criticando a tu jefe… al grupo del trabajo. Donde está tu jefe.",
    answers: [
      { text: "Lo borro rapidísimo y rezo para que nadie lo haya escuchado.", t: { D: -1, A: -1 } },
      { text: "Voy a hablar con mi jefe antes de que lo oiga. Doy la cara.", t: { D: 2, A: 1 } },
      { text: "Escribo: “jajaja era broma, ¿quién se ha creído eso?”", t: { A: 1, D: -2, E: 1 } },
    ],
  },
  {
    id: 13, cat: "vergonzosa",
    text: "Tropiezas y te caes de boca delante de un montón de gente en plena calle.",
    answers: [
      { text: "Me levanto de un salto y hago una reverencia.", t: { E: 2, A: 1 } },
      { text: "Me levanto como si nada y acelero el paso.", t: { E: -2 } },
      { text: "Me quedo un momento en el suelo comprobando que estoy bien.", t: { A: -2, C: -1 } },
    ],
  },
  {
    id: 14, cat: "vergonzosa",
    text: "Te ruge el estómago muy fuerte en un momento de silencio absoluto (un examen, el cine, un funeral…).",
    answers: [
      { text: "“Perdón, es que no he desayunado”, en voz alta.", t: { D: 2, E: 1 } },
      { text: "Miro a la persona de al lado con cara de acusación.", t: { A: 1, D: -2 } },
      { text: "Hago como si no hubiera pasado nada.", t: { E: -1, D: -1 } },
    ],
  },
  {
    id: 15, cat: "vergonzosa",
    text: "Te pillan cantando y bailando a lo grande en el coche, parado en un semáforo.",
    answers: [
      { text: "Subo el volumen y sigo con más ganas.", t: { E: 2, A: 2 } },
      { text: "Paro en seco y miro al frente muy serio.", t: { E: -2, A: -1 } },
      { text: "Saludo con la mano y me río.", t: { E: 1, C: 1, D: 1 } },
    ],
  },
  {
    id: 16, cat: "vergonzosa",
    text: "Estás enseñando fotos del móvil a tu familia y te llega un mensaje muy comprometido.",
    answers: [
      { text: "Bloqueo el móvil a la velocidad de la luz.", t: { A: -1, D: -1 } },
      { text: "Explico con toda naturalidad de qué va.", t: { D: 2, A: 1 } },
      { text: "Me invento una historia rapidísimo.", t: { A: 1, D: -2, C: -1 } },
    ],
  },
  {
    id: 17, cat: "vergonzosa",
    text: "Estás criticando a alguien… y resulta que está justo detrás de ti.",
    answers: [
      { text: "Me doy la vuelta y le pido perdón en ese mismo momento.", t: { D: 2, C: 1 } },
      { text: "Cambio de tema sin ningún disimulo.", t: { D: -2 } },
      { text: "“¡Hombre! Justo te estábamos echando de menos.”", t: { E: 2, A: 1, D: -1 } },
    ],
  },
  {
    id: 18, cat: "vergonzosa",
    text: "Llegas a una fiesta disfrazado… y nadie más va disfrazado.",
    answers: [
      { text: "Lo disfruto al máximo: esta noche soy el alma de la fiesta.", t: { E: 2, A: 1 } },
      { text: "Me vuelvo a casa a cambiarme.", t: { E: -2, A: -1 } },
      { text: "Digo que he perdido una apuesta.", t: { D: -1, C: -1 } },
    ],
  },

  // ───────────── PELIGROSAS ─────────────
  {
    id: 19, cat: "peligrosa",
    text: "Estás de excursión con amigos, os perdéis en la montaña y empieza a anochecer.",
    answers: [
      { text: "Tomo el mando y elijo un camino para bajar.", t: { E: 1, A: 2, D: 1 } },
      { text: "Nos quedamos quietos, llamamos al 112 y ahorramos batería.", t: { A: -2, C: -1 } },
      { text: "Intento que el grupo no pierda los nervios con bromas y ánimos.", t: { C: 2, E: 1 } },
    ],
  },
  {
    id: 20, cat: "peligrosa",
    text: "En el metro ves a alguien robándole la cartera a un turista.",
    answers: [
      { text: "Le grito al ladrón para que la suelte.", t: { A: 2, D: 2 } },
      { text: "Aviso discretamente al turista.", t: { A: -1, D: -1, C: 1 } },
      { text: "Lo grabo con el móvil y aviso a seguridad.", t: { C: -2, A: -1 } },
    ],
  },
  {
    id: 21, cat: "peligrosa",
    text: "Estás bañándote en el mar y notas que la corriente te arrastra hacia dentro.",
    answers: [
      { text: "Nado en paralelo a la costa, que lo he leído mil veces.", t: { C: -2, A: -1 } },
      { text: "Grito y hago señales para pedir ayuda.", t: { E: 2, D: 1 } },
      { text: "Nado con todas mis fuerzas hacia la orilla.", t: { A: 2, C: 1 } },
    ],
  },
  {
    id: 22, cat: "peligrosa",
    text: "Un amigo quiere coger el coche después de haber bebido.",
    answers: [
      { text: "Le quito las llaves, aunque se enfade conmigo.", t: { D: 2, A: 1 } },
      { text: "Le convenzo con buenas palabras para que pida un taxi.", t: { D: -1, C: 1, E: 1 } },
      { text: "Le ofrezco quedarse a dormir en mi casa.", t: { C: 2, A: -1 } },
    ],
  },
  {
    id: 23, cat: "peligrosa",
    text: "Se va la luz en casa de noche y oyes ruidos en la planta de abajo.",
    answers: [
      { text: "Enciendo la linterna del móvil y bajo a mirar.", t: { A: 2 } },
      { text: "Me encierro en la habitación y llamo a alguien.", t: { A: -2, E: 1 } },
      { text: "Seguro que es el viento. Me vuelvo a dormir.", t: { C: -2, E: -1 } },
    ],
  },
  {
    id: 24, cat: "peligrosa",
    text: "Estás de viaje y un desconocido muy simpático te invita a subir a su barco a ver la puesta de sol.",
    answers: [
      { text: "¡Claro! Estas cosas solo pasan una vez en la vida.", t: { A: 2, E: 2 } },
      { text: "No, gracias. Ni de broma.", t: { A: -2, D: 1 } },
      { text: "Acepto solo si viene alguien más conmigo.", t: { A: -1, C: -1, E: 1 } },
    ],
  },
  {
    id: 25, cat: "peligrosa",
    text: "Tus amigos te proponen hacer puenting por primera vez.",
    answers: [
      { text: "Yo salto el primero.", t: { A: 2, E: 1 } },
      { text: "Solo si antes veo saltar a alguien y todo va bien.", t: { A: -1, C: -1 } },
      { text: "Yo sujeto las mochilas y hago las fotos.", t: { A: -2, E: -1 } },
    ],
  },
  {
    id: 26, cat: "peligrosa",
    text: "Vas en avión, hay turbulencias fuertes y la persona de al lado entra en pánico.",
    answers: [
      { text: "Le cojo la mano y le hablo para tranquilizarla.", t: { C: 2, E: 1 } },
      { text: "Le explico que las turbulencias casi nunca son peligrosas.", t: { C: -2, D: 1 } },
      { text: "Me pongo los cascos y cierro los ojos: bastante tengo con lo mío.", t: { E: -2, C: -1 } },
    ],
  },

  // ───────────── AMOROSAS ─────────────
  {
    id: 27, cat: "amorosa",
    text: "La persona que te gusta te escribe “¿qué haces?” a la 1 de la madrugada.",
    answers: [
      { text: "Contesto al segundo.", t: { C: 2, D: 1 } },
      { text: "Espero 20 minutos para no parecer desesperado.", t: { D: -2, C: -1 } },
      { text: "“Pensando en ti 😏”", t: { A: 2, D: 1, E: 1 } },
    ],
  },
  {
    id: 28, cat: "amorosa",
    text: "Primera cita. La otra persona tiene un trozo de comida entre los dientes.",
    answers: [
      { text: "Se lo digo con discreción.", t: { D: 2, C: 1 } },
      { text: "No digo nada para que no pase vergüenza.", t: { D: -2, C: 1 } },
      { text: "Me toco los dientes con disimulo, a ver si lo pilla.", t: { D: -1, E: -1 } },
    ],
  },
  {
    id: 29, cat: "amorosa",
    text: "Tu ex te escribe “te echo de menos” después de un año sin hablar.",
    answers: [
      { text: "Le contesto y quedamos para hablar.", t: { C: 2, A: 1 } },
      { text: "Lo leo, lo dejo en visto y sigo con mi vida.", t: { C: -2, E: -1 } },
      { text: "Le contesto con educación que ya pasé página.", t: { D: 2, C: -1 } },
    ],
  },
  {
    id: 30, cat: "amorosa",
    text: "Te gusta alguien de tu grupo de amigos.",
    answers: [
      { text: "Se lo digo directamente, y que pase lo que tenga que pasar.", t: { D: 2, A: 2 } },
      { text: "Voy lanzando indirectas a ver cómo reacciona.", t: { D: -1, E: 1 } },
      { text: "Me lo callo. No quiero romper el grupo.", t: { A: -2, E: -1 } },
    ],
  },
  {
    id: 31, cat: "amorosa",
    text: "Llevas 3 meses con alguien y te propone iros a vivir juntos.",
    answers: [
      { text: "¡Sí! Cuando lo sabes, lo sabes.", t: { C: 2, A: 2 } },
      { text: "Le digo que me encanta la idea, pero que vayamos más despacio.", t: { A: -1, D: 1 } },
      { text: "Hago una lista de pros y contras antes de responder.", t: { C: -2, A: -1 } },
    ],
  },
  {
    id: 32, cat: "amorosa",
    text: "Primera cita. Llega la cuenta.",
    answers: [
      { text: "Invito yo, sin discusión.", t: { C: 1, D: 1 } },
      { text: "A medias, que es lo justo.", t: { C: -2 } },
      { text: "Propongo jugárnoslo a piedra, papel o tijera.", t: { E: 2, A: 1 } },
    ],
  },
  {
    id: 33, cat: "amorosa",
    text: "Tu mejor amigo empieza a salir con tu ex.",
    answers: [
      { text: "Hablo con él claramente de cómo me siento.", t: { D: 2, C: 1 } },
      { text: "Les deseo lo mejor. Es pasado.", t: { C: -2 } },
      { text: "Me alejo un tiempo sin dar explicaciones.", t: { E: -2, D: -2 } },
    ],
  },
  {
    id: 34, cat: "amorosa",
    text: "¿Qué te parece una declaración de amor en público (pedida en un estadio, un flashmob…)?",
    answers: [
      { text: "Me parece precioso. Me encantaría.", t: { E: 2, C: 2 } },
      { text: "Qué vergüenza. Prefiero algo íntimo.", t: { E: -2, C: 1 } },
      { text: "Es meterle presión a la otra persona delante de todos.", t: { C: -2, D: 1 } },
    ],
  },

  // ───────────── COMPLICADAS (dilemas) ─────────────
  {
    id: 35, cat: "complicada",
    text: "Descubres que la pareja de tu mejor amigo le está siendo infiel.",
    answers: [
      { text: "Se lo cuento inmediatamente.", t: { D: 2, C: 1 } },
      { text: "Hablo primero con la persona infiel y le doy un plazo para contarlo.", t: { C: -1, D: -1 } },
      { text: "No me meto. No es asunto mío.", t: { D: -2, E: -1 } },
    ],
  },
  {
    id: 36, cat: "complicada",
    text: "Te ofrecen el trabajo de tus sueños en otro país, pero tu familia te necesita aquí.",
    answers: [
      { text: "Me voy. Es mi vida y es ahora o nunca.", t: { A: 2, C: -1 } },
      { text: "Me quedo. La familia es lo primero.", t: { C: 2, A: -2 } },
      { text: "Negocio teletrabajar o ir y volver a menudo.", t: { C: -2, D: 1 } },
    ],
  },
  {
    id: 37, cat: "complicada",
    text: "Un amigo te pide que le cubras mintiendo a su pareja sobre dónde estuvo anoche.",
    answers: [
      { text: "No. No pienso mentir por nadie.", t: { D: 2, C: -1 } },
      { text: "Le cubro esta vez, pero le dejo claro que es la última.", t: { C: 1, D: -1 } },
      { text: "Le cubro sin preguntar. Los amigos están para eso.", t: { C: 2, A: 1, D: -1 } },
    ],
  },
  {
    id: 38, cat: "complicada",
    text: "Puedes saber la fecha exacta de tu muerte.",
    answers: [
      { text: "Quiero saberla para organizar mi vida.", t: { C: -2, A: 1 } },
      { text: "Ni hablar. Prefiero vivir sin saberlo.", t: { A: -1, C: 1 } },
      { text: "Solo si hay alguna forma de cambiarla.", t: { A: 2, E: 1 } },
    ],
  },
  {
    id: 39, cat: "complicada",
    text: "Cometes un error en el trabajo que nadie ha notado, pero que perjudica a un cliente.",
    answers: [
      { text: "Lo confieso y lo soluciono.", t: { D: 2, C: 1 } },
      { text: "Lo arreglo en silencio sin decir nada a nadie.", t: { D: -2 } },
      { text: "Espero a ver si alguien se da cuenta.", t: { A: 2, C: -1 } },
    ],
  },
  {
    id: 40, cat: "complicada",
    text: "Te toca un millón de euros en la lotería.",
    answers: [
      { text: "Dejo el trabajo y me voy a dar la vuelta al mundo.", t: { A: 2, E: 1 } },
      { text: "Lo invierto casi todo y sigo con mi vida como si nada.", t: { A: -2, C: -1 } },
      { text: "Reparto una buena parte entre mi familia y amigos.", t: { C: 2, E: 1 } },
    ],
  },
  {
    id: 41, cat: "complicada",
    text: "Tienes que elegir: perder todas las fotos de tu móvil o todos tus contactos.",
    answers: [
      { text: "Las fotos. Lo importante son las personas.", t: { E: 2 } },
      { text: "Los contactos. Los recuerdos no se recuperan.", t: { E: -1, C: 1 } },
      { text: "Ninguno: tengo copia de seguridad de todo.", t: { C: -2, A: -2 } },
    ],
  },
  {
    id: 42, cat: "complicada",
    text: "Un amigo va a invertir todos sus ahorros en un proyecto que, sinceramente, es malísimo.",
    answers: [
      { text: "Le digo la verdad aunque le duela.", t: { D: 2, C: -1 } },
      { text: "Le apoyo. Es su sueño.", t: { C: 2, D: -2 } },
      { text: "Le hago preguntas para que llegue él solo a la conclusión.", t: { D: -1, C: -1 } },
    ],
  },

  // ───────────── SOCIALES ─────────────
  {
    id: 43, cat: "social",
    text: "Llegas a una fiesta donde solo conoces al anfitrión, y está ocupado.",
    answers: [
      { text: "Me presento al primer grupo que veo.", t: { E: 2, A: 1 } },
      { text: "Me pego a la comida y al móvil.", t: { E: -2 } },
      { text: "Busco a alguien que también esté solo.", t: { C: 2 } },
    ],
  },
  {
    id: 44, cat: "social",
    text: "En una cena, alguien suelta un comentario racista o machista.",
    answers: [
      { text: "Le contesto en el momento, delante de todos.", t: { D: 2, A: 1 } },
      { text: "Se lo comento luego en privado.", t: { D: -1, C: 1 } },
      { text: "Cambio de tema para que no haya tensión.", t: { D: -2, E: -1 } },
    ],
  },
  {
    id: 45, cat: "social",
    text: "Tu grupo de amigos organiza un viaje… y a ti no te han invitado.",
    answers: [
      { text: "Pregunto directamente por qué.", t: { D: 2, E: 1 } },
      { text: "Me duele, pero no digo nada.", t: { C: 2, D: -2 } },
      { text: "Me organizo mi propio plan, y mejor.", t: { A: 2, E: 1, C: -1 } },
    ],
  },
  {
    id: 46, cat: "social",
    text: "Karaoke con los compañeros de trabajo.",
    answers: [
      { text: "Me pido la primera canción.", t: { E: 2, A: 2 } },
      { text: "Canto si me arrastran en grupo.", t: { E: -1, C: 1 } },
      { text: "Ni de broma. Yo aplaudo.", t: { E: -2, A: -1 } },
    ],
  },
  {
    id: 47, cat: "social",
    text: "Cena de grupo: tú has pedido una ensalada y agua; los demás, chuletón y vino. Llega la cuenta.",
    answers: [
      { text: "Pago a partes iguales. No voy a ser el rata del grupo.", t: { C: 1, D: -2 } },
      { text: "Digo que cada uno pague lo suyo.", t: { D: 2, C: -2 } },
      { text: "Pago lo mío y un poco más para no quedar mal.", t: { D: -1, C: -1 } },
    ],
  },
  {
    id: 48, cat: "social",
    text: "Un amigo cuenta delante de gente una historia en la que estuviste, exagerándola muchísimo.",
    answers: [
      { text: "Le sigo el rollo y la adorno todavía más.", t: { E: 2, A: 1, D: -1 } },
      { text: "Le corrijo: “bueno, no fue exactamente así…”", t: { D: 2, C: -1 } },
      { text: "Me río y no digo nada.", t: { E: -1, D: -1 } },
    ],
  },
  {
    id: 49, cat: "social",
    text: "Alguien que te cae fatal te invita a su cumpleaños.",
    answers: [
      { text: "Voy. A lo mejor me sorprende.", t: { A: 1, C: 1, E: 1 } },
      { text: "Me invento una excusa.", t: { D: -2, E: -1 } },
      { text: "Le digo que no puedo, sin más explicaciones.", t: { D: 2, C: -1 } },
    ],
  },
  {
    id: 50, cat: "social",
    text: "En la boda de un amigo te piden, sin avisar, que digas unas palabras.",
    answers: [
      { text: "Me vengo arriba y hago llorar a todo el mundo.", t: { E: 2, C: 2 } },
      { text: "Algo cortito y agradecido, y a sentarme.", t: { E: -1, A: -1 } },
      { text: "Cuento la anécdota más vergonzosa del novio o la novia.", t: { A: 2, D: 2 } },
    ],
  },
];
