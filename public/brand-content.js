(() => {
  // Restoration mode keeps the exported Framer component tree intact. Branding
  // is limited to content, links and form behaviour so Framer can continue to
  // own layout, breakpoints, hover variants and scroll-driven animations.
  const RESTORATION_MODE = true
  const BRAND = "JCAR Labs Inc."
  const CONTACT_URL = "https://wa.me/51904615337"
  const EMAIL_URL = "mailto:contacto@jcarlabs.com"

  const normalized = (value) => String(value || "").replace(/\s+/g, " ").trim().toUpperCase()
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character])
  const animatedLetters = (value) => Array.from(String(value)).map((character, index) => `<span style="--char-index:${index}">${character === " " ? "&nbsp;" : escapeHTML(character)}</span>`).join("")
  let homeVideoObserver
  let revealObserver
  let serviceCardObserver
  let editorialMotionFrame
  let headerScrollBound = false
  let metadataObserver

  const replacements = new Map(Object.entries({
    "HOME": "INICIO",
    "WORK": "PROYECTOS",
    "ABOUT": "NOSOTROS",
    "THOUGHTS": "SERVICIOS",
    "CONTACT": "CONTACTO",
    "PRIVACY POLICY": "POLÍTICA DE PRIVACIDAD",
    "TERMS OF USE": "TÉRMINOS DE USO",
    "VERTICAL": "JCAR LABS",
    "ADAM KNOXVILLE": BRAND,
    "ADAM KNOXVILLE / VERTICAL": BRAND,
    "VISUAL ARTIST/CREATOR": "SOFTWARE · SISTEMAS · IA",
    "INDEPENDENT VISUAL ARTIST": "INGENIERÍA DE SOFTWARE PARA NEGOCIOS",
    "EXPLORE": "DESCUBRIR",
    "I BREAK THINGS": "SOFTWARE",
    "TO SEE WHAT": "PARA TU",
    "THEY ARE MADE OF": "NEGOCIO",
    "PHASE/BREAK": "FASE/IDEA",
    "PHASE/BUILD": "FASE/DISEÑO",
    "PHASE/BEND": "FASE/DESARROLLO",
    "PHASE/RELEASE": "FASE/ESCALA",
    "IDX/AK": "JCAR/LABS",
    "VISUAL EXPERIMENTS": "SOFTWARE & SAAS",
    "FORM & FUNCTION": "SISTEMAS LEGACY",
    "SOUND & MOTION": "IA, AGENTES & LLMOPS",
    "WRITTEN FRAGMENTS": "CLOUD & APIS",
    "THINGS I CAN’T EXPLAIN": "SOLUCIONES EMPRESARIALES",
    "MODERN RITUALS": "PROYECTOS REALES",
    "STUDY — 04.13": "CASOS — 03",
    "SELECTED WORK": "PROYECTOS SELECCIONADOS",
    "LINES BECOME SIGNALS.": "LAS NECESIDADES SE CONVIERTEN EN PRODUCTOS.",
    "SURFACES BECOME STORIES.": "LAS IDEAS SE CONVIERTEN EN RESULTADOS.",
    "LINES BECOME SIGNALS. SURFACES BECOME STORIES.": "LAS NECESIDADES SE CONVIERTEN EN PRODUCTOS. LAS IDEAS SE CONVIERTEN EN RESULTADOS.",
    "STRUCTURE ARGUES WITH IMPULSE UNTIL BOTH LEARN TO STAND STILL. GRIDS SET THE PACE. MARGINS HOLD THE QUIET.": "DISEÑAMOS Y DESARROLLAMOS SOLUCIONES DIGITALES QUE CONECTAN TECNOLOGÍA, NEGOCIO Y EXPERIENCIA DE USUARIO.",
    "ARTIFACT—I": "SISTEMA HOTELERO",
    "ARTIFACT—II": "NEZUS BISUTERÍA",
    "ARTIFACT—III": "SOLUCIONES EMPRESARIALES",
    "[CONFESS]": "[CONSTRUIR]",
    "CAL": "JCL",
    "TI": "LAB",
    "THE ARCHIVE OF EVERYTHING I CAN’T KEEP IN ONE PLACE.": "ECOSISTEMA DE SOLUCIONES DIGITALES.",
    "VERTICAL STORAGE — 2015-2026": "JCAR LABS — SOLUCIONES DIGITALES",
    "ANALOG ARCHIVES": "CAPACIDADES",
    "MOD — I/AK": "CAP — 01",
    "MOD — II/AK": "CAP — 02",
    "MOD — III/AK": "CAP — 03",
    "MOD — IV/AK": "CAP — 04",
    "MOD — V/AK": "CAP — 05",
    "STUDIES IN IMAGE, LIGHT, AND DISTORTION. TESTS THAT DON’T FOLLOW RULES. PIECES BUILT FROM INSTINCT, ERROR, AND THE URGE TO SEE WHAT HAPPENS NEXT.": "SOFTWARE A MEDIDA Y PRODUCTOS SAAS QUE CONECTAN USUARIOS, DATOS Y PROCESOS DE NEGOCIO.",
    "OBJECTS, SYSTEMS, AND SHAPES SHAPED WITH INTENTION — THEN PUSHED UNTIL THEY REVEAL THEIR LIMITS. A DIALOGUE BETWEEN WHAT LOOKS RIGHT AND WHAT WORKS.": "MODERNIZACIÓN DE SISTEMAS LEGACY CON CAMBIOS GRADUALES, VALIDACIÓN Y CONTINUIDAD OPERATIVA.",
    "MOVING IMAGES, RHYTHM STUDIES, AND AUDIOVISUAL FRAGMENTS. WORK DRIVEN BY PULSE, TENSION, AND THE QUIET BETWEEN FRAMES.": "IA TRANSMODAL, AGENTES Y LLMOPS PARA CONECTAR MODELOS CON DATOS Y HERRAMIENTAS DEL NEGOCIO.",
    "POEMS, LYRICS, AND UNFINISHED LINES. THOUGHTS CAUGHT MID-BREATH. WORDS THAT BEHAVE MORE LIKE IMAGES THAN SENTENCES.": "ARQUITECTURA CLOUD, APIS Y MICROSERVICIOS CON CONTRATOS CLAROS Y CAPACIDAD DE EVOLUCIÓN.",
    "CREATIVE IDEAS THAT ARRIVED UNINVITED AND REFUSED TO LEAVE. THE WORK THAT SITS CLOSEST TO WHO I AM AND WHO I’M STILL BECOMING.": "CONSULTORÍA DE ARQUITECTURA Y AUDITORÍA DE CÓDIGO PARA PRIORIZAR RIESGOS Y MEJORAS.",
    "I’AM": "SOMOS",
    "DEVELOPING WORK ACROSS DIGITAL AND PHYSICAL FORMATS.": "DESARROLLAMOS PRODUCTOS DIGITALES DE PRINCIPIO A FIN.",
    "I MAKE WORK ACROSS IMAGE, FORM, MOTION, AND TEXT.": "SOFTWARE, ARQUITECTURA E IA CONECTADOS CON TU NEGOCIO.",
    "MOST PROJECTS START WITH A RULE. EXPERIENCE TRIGGERS THE NEXT STEP.": "CADA PROYECTO PARTE DE UNA NECESIDAD REAL Y AVANZA CON ESTRATEGIA, DISEÑO Y TECNOLOGÍA.",
    "\"PERFECTION IS ACHIEVED NOT WHEN THERE IS NOTHING MORE TO ADD, BUT WHEN THERE IS NOTHING LEFT TO TAKE AWAY.”": "\"LA TECNOLOGÍA FUNCIONA MEJOR CUANDO RESUELVE ALGO REAL.\"",
    "— ANTOINE DE SAINT-EXUPERY": "— JCAR LABS INC.",
    "SOCIALS": "CONTACTO",
    "I’M A UK-BASED VISUAL ARTIST. MY PRACTICE IS DRIVEN BY EXPERIMENTS, SYSTEMS, AND ITERATION. SOME WORK RESOLVES QUICKLY, OTHERS EVOLVE OVER TIME.": "JCAR LABS INC. INTEGRA INGENIERÍA DE PRODUCTO, MODERNIZACIÓN E IA. TRABAJAMOS CON REACT, NODE.JS, PYTHON, JAVA, PHP Y SQL SEGÚN EL CONTEXTO.",
    "THINGS I DO": "ECOSISTEMA TECNOLÓGICO",
    "SOUND DESIGN": "IA, AGENTES & LLMOPS",
    "MOTION GRAPHICS": "CLOUD & APIS",
    "INSTALLATION STUDIES": "SISTEMAS LEGACY",
    "STORYBOARDS": "AUDITORÍA DE CÓDIGO",
    "VISUAL SCRIPTS": "UX/UI",
    "VIEW THE WORK": "VER PROYECTOS",
    "(PROJECT)": "(PROYECTO)",
    "UNSTABLE SEQUENCE": "SISTEMA HOTELERO",
    "A MOTION STUDY THAT RESISTS RESOLUTION.": "GESTIÓN HOTELERA CON FACTURACIÓN ELECTRÓNICA.",
    "SELF-INITIATED INDEPENDENT PROJECT": "SOFTWARE EMPRESARIAL PARA HOTELES EN PERÚ",
    "MARCH 2025": "JAVA · MYSQL",
    "DRAWN FROM MOTION STUDIES WHERE CLARITY FADES AND RHYTHM FRACTURES. MEANING APPEARS IN THE GAPS BETWEEN FRAMES, WHERE INSTABILITY BECOMES STRUCTURAL.": "SISTEMA DE GESTIÓN PARA HOTELES EN PERÚ CON FACTURACIÓN ELECTRÓNICA Y CONTROL DE OPERACIONES.",
    "STILL PRESSURE": "NEZUS BISUTERÍA",
    "A PHOTOGRAPHIC STUDY OF PRESENCE, PAUSE, AND CONTAINED FORCE.": "E-COMMERCE Y PRESENCIA DIGITAL PARA UNA MARCA DE JOYERÍA.",
    "VÖGEL DISTRIBUTION": "DESARROLLO WEB · UX/UI",
    "SEPTEMBER 2025": "E-COMMERCE",
    "MOMENTS OF STILLNESS WHERE TENSION REMAINS PRESENT. LIGHT, DISTANCE, AND POSTURE CARRY WEIGHT WITHOUT ACTION.": "SITIO CORPORATIVO Y TIENDA DIGITAL DISEÑADOS PARA PRESENTAR PRODUCTOS Y FACILITAR LA COMPRA.",
    "SURFACE TENSION": "SOLUCIONES EMPRESARIALES",
    "A CONTROLLED STUDY IN RESTRAINT, PRESSURE, AND DELAYED RELEASE.": "COMUNICACIÓN INTERNA Y GESTIÓN EN UNA SOLA PLATAFORMA.",
    "ATLAS BROADCASTING": "CLOUD & APIS",
    "OCTOBER 2025": "PLATAFORMA EMPRESARIAL",
    "INSPIRED BY MOMENTS WHERE FORM APPEARS STABLE WHILE FORCE ACCUMULATES BENEATH THE SURFACE. TENSION BUILDS THROUGH RESTRAINT RATHER THAN MOVEMENT.": "PLATAFORMA PARA CENTRALIZAR COMUNICACIÓN, INFORMACIÓN Y PROCESOS INTERNOS DE LA EMPRESA.",
    "INSPIRATION": "SOLUCIÓN",
    "THE VERTICAL BLOG": "ECOSISTEMA DIGITAL",
    "THE ARCHIVE OF THOUGHTS I CAN KEEP IN ONE PLACE.": "SOFTWARE, ARQUITECTURA E IA PARA HACER EVOLUCIONAR TU NEGOCIO.",
    "DECEMBER 30, 2025": "SERVICIO 01",
    "BEYOND AI AESTHETICS: WHAT HUMAN-LED DIGITAL ART MEANS NOW": "SOFTWARE & SAAS",
    "AI DIDN’T REPLACE CREATIVITY. IT RESHAPED IT — FORCING ARTISTS TO REDEFINE WHAT HUMAN ORIGINALITY TRULY MEANS.": "SITIOS WEB MODERNOS, RESPONSIVOS Y OPTIMIZADOS PARA SEO, CONSTRUIDOS A LA MEDIDA DE CADA NEGOCIO.",
    "OCTOBER 29, 2025": "SERVICIO 02",
    "WHEN IMAGES BEGIN TO LISTEN: THE QUIET POWER OF RESPONSIVE ART": "IA, AGENTES & LLMOPS",
    "INTERACTIVE WORK IS EVOLVING BEYOND TOUCHSCREENS AND GIMMICKS. THE MOST COMPELLING CONTEMPORARY PIECES NOW RESPOND SUBTLY — TO SOUND, ENVIRONMENT, PRESENCE, AND EMOTION.": "INTEGRACIÓN DE MODELOS DE IA Y AUTOMATIZACIÓN DE PROCESOS PARA TRABAJAR CON MAYOR VELOCIDAD Y PRECISIÓN.",
    "DECEMBER 3, 2025": "SERVICIO 03",
    "THE RISE OF EXPERIENTIAL MINIMALISM IN CONTEMPORARY EXHIBITIONS": "CLOUD & APIS",
    "INSTEAD OF SPECTACLE, GALLERIES ARE EMBRACING CONTROLLED INTENSITY — RESTRAINED ENVIRONMENTS WITH POWERFUL PSYCHOLOGICAL IMPACT.": "DESARROLLO INTEGRAL DESDE LA BASE DE DATOS Y LA LÓGICA DE NEGOCIO HASTA LA INTERFAZ DE USUARIO.",
    "BY": "ESPECIALIDAD",
    "WRITTEN BY": "ESCRITO POR",
    "READING TIME": "TIEMPO DE LECTURA",
    "RELEASED": "LANZADO",
    "MORE PROJECTS": "MÁS PROYECTOS",
    "MORE THOUGHTS": "MÁS SERVICIOS",
    "THE MAIN CHALLENGE WAS SUSTAINING TENSION WITHOUT ARRIVAL.": "EL RETO PRINCIPAL FUE INTEGRAR OPERACIONES, RESERVAS Y FACTURACIÓN EN UN SOLO FLUJO.",
    "HANNA JANE WINSTON": BRAND,
    "MATTHEW SPEARS": BRAND,
    "FREJA ANDERSSON": BRAND,
    "CONTACT ME": "CONTACTO",
    "IF SOMETHING HERE SPARKED A THOUGHT, RAISED A QUESTION, OR SIMPLY MADE YOU PAUSE.": "HABLEMOS DEL SOFTWARE QUE TU NEGOCIO NECESITA CONSTRUIR O EVOLUCIONAR.",
    "I’M ALWAYS OPEN TO CONVERSATIONS ABOUT IDEAS, COLLABORATION, PROCESS, OR ANYTHING IN THE GREY AREA IN BETWEEN. LET’S TALK.": "CUÉNTANOS SOBRE TU PRODUCTO, TU SISTEMA ACTUAL O EL PROCESO QUE QUIERES CONECTAR CON IA.",
    "SUBMIT": "ENVIAR MENSAJE",
    "BY SUBMITTING, YOU CONSENT TO MY PRIVACY POLICY.": "AL ENVIAR, ACEPTAS NUESTRA POLÍTICA DE PRIVACIDAD.",
    "(44) 7700 900 482": "+51 904 615 337",
    "HEY@ADAMKNOXVILLE.DESIGN": "CONTACTO@JCARLABS.COM",
    "PHONE COPIED!": "TELÉFONO COPIADO",
    "EMAIL COPIED!": "CORREO COPIADO",
    "STUDIO 204": BRAND,
    "UNITED KINGDOM": "PERÚ",
    "VIMEO": "WHATSAPP",
    "YOUTUBE": "EMAIL",
    "© 2026 VERTICAL BY ADAM KNOXVILLE. ALL WORK, ALL RIGHTS.": "© 2026 JCAR LABS INC. TODOS LOS DERECHOS RESERVADOS.",

    /* Home sections restored from the original Framer composition. */
    "ART IS A CONTROLLED INTERRUPTION A PRACTICE OF CATCHING THE MOMENT BEFORE IT DISAPPEARS.": "INGENIERÍA DE SOFTWARE PARA CREAR PRODUCTOS, MODERNIZAR SISTEMAS Y CONECTAR EL NEGOCIO CON IA.",
    "I WORK ACROSS IMAGE, OBJECT, MOTION, AND SOUND TO TRACE THE SHAPE OF WHAT DOESN’T SIT STILL.": "UNIMOS SOFTWARE A MEDIDA, ARQUITECTURA Y OPERACIÓN PARA CONSTRUIR SISTEMAS ESCALABLES Y SEGUROS.",
    "IT ISN’T A PORTFOLIO.": "INGENIERÍA CON PROPÓSITO.",
    "IT’S THE PLACE WHERE THE WORK STAYS HONEST. AN ONGOING RECORD OF WHAT I MAKE WHEN THOUGHT MOVES FASTER THAN STRUCTURE.": "CADA SOLUCIÓN PARTE DEL NEGOCIO Y SE SOSTIENE EN CÓDIGO, DATOS Y DECISIONES DE ARQUITECTURA.",
    "NEW YORK (2025)": "ESTRATEGIA",
    "PARIS (2023)": "UX/UI",
    "SINGAPORE (2014)": "DESARROLLO",
    "OSAKA (2019)": "INTEGRACIONES",
    "BRIGHTON (2018)": "CLOUD & APIS",
    "SYDNEY (2021)": "ESCALABILIDAD",
    "INDX": "JCL",
    "// CONCEPTUAL": "// PRODUCTO DIGITAL",
    "REVISION — NEUE 7.6": "VERSIÓN — 1.0",
    "NOTHING STAYS UNTOUCHED": "CADA DETALLE TIENE UN PROPÓSITO",
    "PAGES BECOME PLACES WORTH LINGERING IN, AND ISSUES BECOME EXPERIENCES PEOPLE ANTICIPATE, KEEP, AND SHARE.": "CONSTRUIMOS PRODUCTOS SAAS Y SOFTWARE A MEDIDA CON UNA BASE PREPARADA PARA OPERAR Y EVOLUCIONAR.",
    "PERSPECTIVE NOT THE TRUTH": "INGENIERÍA DE PRODUCTO",
    "CAT — 1.07": "ETAPA — 01",
    "I WORK BETWEEN ORDER AND INTERRUPTION. WHERE CLEAN LINES ARGUE WITH IMPULSE. WHERE RHYTHM BREAKS BEFORE IT RESOLVES.": "ANALIZAMOS EL NEGOCIO, ORDENAMOS LAS PRIORIDADES Y DISEÑAMOS UNA EXPERIENCIA QUE RESPONDE A OBJETIVOS CONCRETOS.",
    "CAT — 1.08": "ETAPA — 02",
    "VERTICAL IS THE STATE I BUILD IN— A PLACE FOR UNFINISHED THOUGHTS, SHARPENED IDEAS, AND THE THINGS THAT REFUSE SILENCE.": "JCAR LABS ES DONDE LAS IDEAS SE CONVIERTEN EN SISTEMAS CONFIABLES, MEDIBLES Y LISTOS PARA EVOLUCIONAR.",
    "EXPLORATION PHASE": "NUESTRO PROCESO",
    "SOME PIECES SETTLE.SOME DON’T.": "CADA PROYECTO COMIENZA CON PREGUNTAS.",
    "SOME PIECES SETTLE. SOME DON’T.": "CADA PROYECTO COMIENZA CON PREGUNTAS.",
    "BOTH REVEAL SOMETHING THE FINISHED VERSION CAN’T.": "LAS RESPUESTAS DEFINEN EL PRODUCTO QUE REALMENTE NECESITAS.",
    "SOURCE — FIELD NOTES": "MÉTODO — JCAR LABS",
    "MODULE — A.1": "FASE — 01",
    "A SECTION OF STUDIES IN RAW STRUCTURE. TEXTURES TESTED UNDER PRESSURE. FORMS PUSHED UNTIL THEY REVEAL INTENTION.": "DESCUBRIMIENTO Y ESTRATEGIA. ENTENDEMOS EL PROBLEMA, LOS USUARIOS Y LOS INDICADORES DE ÉXITO.",
    "MODULE — A.2": "FASE — 02",
    "EXPERIMENTS WITH PHYSICAL MATERIALS AND CONTROLLED DISTORTION. WHERE TOUCH, WEIGHT, AND FAILURE SHAPE THE OUTCOME.": "DISEÑO UX/UI Y PROTOTIPADO. VALIDAMOS FLUJOS, CONTENIDO Y DECISIONES VISUALES ANTES DE CONSTRUIR.",
    "MODULE — A.3": "FASE — 03",
    "OBJECTS EXAMINED THROUGH REPETITION. SMALL SHIFTS CREATING NEW PATTERNS. A RECORD OF HOW MATTER RESPONDS TO MOTION.": "DESARROLLO E INTEGRACIÓN. CONSTRUIMOS FRONTEND, BACKEND, DATOS Y AUTOMATIZACIONES COMO UN SOLO SISTEMA.",
    "MODULE — A.4": "FASE — 04",
    "FRAGMENTS FROM ONGOING INVESTIGATIONS. PART PROTOTYPES, PART UNRESOLVED IDEAS. WORK THAT STAYS HONEST BY NOT PRETENDING TO BE FINISHED.": "PRUEBAS, PUBLICACIÓN Y MEJORA CONTINUA. MEDIMOS EL RESULTADO Y PREPARAMOS LA SOLUCIÓN PARA ESCALAR.",
    "PATTERNS EMERGE. FRICTION CREATES MEANING.": "LOS RETOS REVELAN OPORTUNIDADES.",
    "SIGNALS FORM. SURFACES RESPOND.": "LOS DATOS ORIENTAN. EL PRODUCTO RESPONDE.",
    "ILLUSIONLATENCYPERSPECTIVECONTROL": "IDEADISEÑOCÓDIGOIMPACTO",
    "ILLUSION LATENCY PERSPECTIVE CONTROL": "IDEA DISEÑO CÓDIGO IMPACTO",
    "EMBRACING THE": "CONSTRUIMOS LO",
    "UNKNOWN": "POSIBLE",
    "I FOLLOW IDEAS INTO PLACES THAT DON’T HAVE NAMES YET. SOME REVEAL STRUCTURE. SOME COLLAPSE INTO NOISE.": "EXPLORAMOS SOLUCIONES SIN PERDER DE VISTA EL OBJETIVO: CREAR TECNOLOGÍA QUE LAS PERSONAS PUEDAN USAR Y LOS NEGOCIOS PUEDAN MEDIR.",
    "WORK SHAPED BY MOVEMENT, MEMORY, AND INTERRUPTION. STUDIES IN LIGHT, DEPTH, AND DISTORTION. EACH PIECE BEGINS AS A QUESTION AND ENDS WHEREVER IT NEEDS TO.": "COMBINAMOS DISEÑO, INGENIERÍA Y AUTOMATIZACIÓN. CADA DECISIÓN NACE DE UNA NECESIDAD Y TERMINA EN UNA EXPERIENCIA COHERENTE.",
    "WHAT HOLDS UP IS WHAT MATTERS.": "LO QUE FUNCIONA ES LO QUE IMPORTA.",
    "OBSERVATION OVER EXPLANATION.PROCESS OVER CERTAINTY.": "CLARIDAD ANTES QUE COMPLEJIDAD. RESULTADOS ANTES QUE SUPOSICIONES.",
    "OBSERVATION OVER EXPLANATION. PROCESS OVER CERTAINTY.": "CLARIDAD ANTES QUE COMPLEJIDAD. RESULTADOS ANTES QUE SUPOSICIONES.",
    "I FOLLOW IDEAS INTO PLACES THAT SHIFT AS I STEP INTO THEM. PATHS APPEAR, VANISH, REAPPEAR SOMEWHERE ELSE. SOME LEAD TO CLARITY. SOME LEAD TO NOISE.BOTH KEEP THE RABBIT MOVING.": "INVESTIGAMOS, PROTOTIPAMOS Y APRENDEMOS RÁPIDO. CADA ITERACIÓN ACERCA EL PRODUCTO A UNA SOLUCIÓN MÁS CLARA.",
    "I FOLLOW IDEAS INTO PLACES THAT SHIFT AS I STEP INTO THEM. PATHS APPEAR, VANISH, REAPPEAR SOMEWHERE ELSE. SOME LEAD TO CLARITY. SOME LEAD TO NOISE. BOTH KEEP THE RABBIT MOVING.": "INVESTIGAMOS, PROTOTIPAMOS Y APRENDEMOS RÁPIDO. CADA ITERACIÓN ACERCA EL PRODUCTO A UNA SOLUCIÓN MÁS CLARA.",
    "I CHASE THE THINGS THAT CHANGE DIRECTION WITHOUT WARNING. A LINE BENDS. A THOUGHT SPLITS. A SHAPE BECOMES SOMETHING IT WASN’T MEANT TO BE. I STAY WITH IT UNTIL IT REVEALS A REASON TO FOLLOW.THE RABBIT IS NEVER STILL.": "ADAPTAMOS LA TECNOLOGÍA AL CONTEXTO DEL NEGOCIO. SI EL RETO CAMBIA, EL SISTEMA EVOLUCIONA SIN PERDER ESTABILIDAD.",
    "I CHASE THE THINGS THAT CHANGE DIRECTION WITHOUT WARNING. A LINE BENDS. A THOUGHT SPLITS. A SHAPE BECOMES SOMETHING IT WASN’T MEANT TO BE. I STAY WITH IT UNTIL IT REVEALS A REASON TO FOLLOW. THE RABBIT IS NEVER STILL.": "ADAPTAMOS LA TECNOLOGÍA AL CONTEXTO DEL NEGOCIO. SI EL RETO CAMBIA, EL SISTEMA EVOLUCIONA SIN PERDER ESTABILIDAD.",
    "VISUAL": "DISEÑO",
    "IMAGES PULLED FROM MOVEMENT, MEMORY, AND INTERRUPTION. STUDIES IN LIGHT, DEPTH, AND DISTORTION. WORK BUILT FROM THE URGE TO SEE WHAT HAPPENS NEXT.": "REACT Y JAVASCRIPT PARA CONECTAR A LAS PERSONAS CON LAS FUNCIONES Y LOS DATOS DEL PRODUCTO.",
    "FORM": "SISTEMAS",
    "OBJECTS, SYSTEMS, AND STRUCTURES UNDER TENSION. WHERE FUNCTION BENDS INTO EXPRESSION. TESTS BUILT TO REVEAL HOW MATERIALS BEHAVE WHEN PUSHED.": "NODE.JS, PYTHON, JAVA Y PHP PARA LOS SERVICIOS. SQL PARA ORGANIZAR LOS DATOS Y SOSTENER LOS PROCESOS.",
    "MOTION": "CLOUD & APIS",
    "FRAMES DRIVEN BY RHYTHM AND ATMOSPHERE. LOOPS, PULSES, AND SHIFTING PERSPECTIVES. PIECES MEANT TO BE FELT BEFORE THEY’RE UNDERSTOOD.": "APIS, AGENTES Y LLMOPS PARA INTEGRAR CAPACIDADES DE IA CON EVALUACIÓN, TRAZABILIDAD Y SUPERVISIÓN.",
    "“WHETHER ON PAPER OR PIXELS, THE GOAL IS CONSTANT — DESIGN THAT DISAPPEARS AS THE STORY APPEARS, LETTING THE WORK SPEAK WITHOUT SHOUTING FOR ATTENTION” — AK": "“UN BUEN PRODUCTO DIGITAL HACE SIMPLE LO COMPLEJO Y CONVIERTE LA TECNOLOGÍA EN UNA VENTAJA REAL.” — JCAR LABS",
    "STUDIO CHAT WITH DANIEL MOORE": "CÓMO TRABAJAMOS EN JCAR LABS",
    "ADAM TALKS ABOUT BREAKING FORM, CHASING RHYTHM, AND SHAPING THOUGHT INTO IMAGES.": "UNA MIRADA A NUESTRO PROCESO: DE LA ESTRATEGIA Y EL DISEÑO A LA IMPLEMENTACIÓN, LAS PRUEBAS Y EL CRECIMIENTO.",
    "RECORDED AT CAM66 STUDIOS LONDON IN 24 NOVEMBER 2025": "ESTRATEGIA · DISEÑO · DESARROLLO · ESCALA",
    "15 MINUTES, 13 SECONDS": "PROCESO DE PRINCIPIO A FIN",
    "DIGITAL MEDIA": "PRODUCTOS DIGITALES",
    "MODUS VIVENDI": "SOFTWARE QUE MUEVE NEGOCIOS",
    "A DELICATE BALANCE OF STILLNESS AND MOVEMENT, PRESENCE AND ABSENCE. IT CAPTURES BODIES IN TRANSFORMATION, SUSPENDED IN QUIET RESISTANCE.": "UNA COMBINACIÓN DE DISEÑO, DATOS Y AUTOMATIZACIÓN PARA CREAR EXPERIENCIAS QUE RESPONDEN CON VELOCIDAD.",
    "SHOWING UNTIL 10 MARCH 2026": "EVOLUCIÓN CONTINUA",
    "TATE MODERN EXHIBITION": "PROYECTO DIGITAL JCAR LABS",
    "BANKSIDE, LONDON SE1 9TG": "PERÚ · SOLUCIONES PARA CRECER",
    "SHOWROOM": "JCAR LABS",
    "CONCEPT / MOTION ART": "PRODUCTO / AUTOMATIZACIÓN",
    "CONTEMPORARY/": "TECNOLOGÍA/",
    "MOTION CONCEPT": "SISTEMA EN MOVIMIENTO",
    "A STUDY IN RHYTHM, DISTORTION, AND CONTROLLED IMBALANCE. SURFACES REACT TO MOVEMENT. MOVEMENT RESHAPES THE FRAME. THE PIECE SHIFTS BETWEEN CLARITY AND NOISE, REVEALING PATTERNS YOU ONLY SEE WHEN THEY BREAK.": "UNA EXPERIENCIA DIGITAL DONDE CADA INTERACCIÓN TIENE UN PROPÓSITO. LA INTERFAZ RESPONDE, LOS DATOS FLUYEN Y EL SISTEMA SE ADAPTA AL RITMO DEL NEGOCIO.",
    "NTRL 461.78.A.002": "JCL 2026.PRODUCT.001",
    "RIPPLE TRACE": "IMPACTO MEDIBLE",
    "AK1.0": "JCL1.0",
    "VISUAL IDENTITYMOTION MAPPINGART DIRECTIONCONCEPT DEVELOPMENT": "UX/UIARQUITECTURAAUTOMATIZACIÓNPRODUCTO DIGITAL",
    "VISUAL IDENTITY MOTION MAPPING ART DIRECTION CONCEPT DEVELOPMENT": "UX/UI ARQUITECTURA AUTOMATIZACIÓN PRODUCTO DIGITAL",
    "NDX — A7": "JCAR — LABS"
    ,"RELEASE WITHOUT RESTRAINT": "ESTRATEGIA CON PROPÓSITO"
    ,"PHOTOGRAPHY": "PRODUCTO DIGITAL"
    ,"A PAUSE BETWEEN DEPARTURES": "DESCUBRIMIENTO Y ESTRATEGIA"
    ,"STREET ART": "INVESTIGACIÓN"
    ,"CONCEALMENT AS A FORM OF POWER.": "DISEÑO QUE ORDENA LA COMPLEJIDAD."
    ,"FASHION": "DISEÑO UX/UI"
    ,"QUIET STRENGTH IN FULL BLOOM": "PRODUCTOS LISTOS PARA CRECER"
    ,"DISCIPLINE, HELD IN MOTION": "ARQUITECTURA EN MOVIMIENTO"
    ,"JAPANESE CULTURE": "DESARROLLO"
    ,"CAUGHT BETWEEN WHO YOU WERE AND WHO REMAINS": "AUTOMATIZACIÓN CON SENTIDO"
    ,"LIGHT EXPERIMENT": "IA, AGENTES & LLMOPS"
    ,"SILENCE SHAPED INTO FORM": "ESCALA Y EVOLUCIÓN"
    ,"EXHIBITION": "PRODUCTO"
    ,"CHASING THE WHITE RABBIT*": "EXPLORACIÓN CONTINUA*"
    ,"STUDIO CAM66, LONDON": "JCAR LABS · PERÚ"
    ,"DANIEL & ADAM": "EQUIPO JCAR LABS"
    ,"MODUS VIVENDI": "PRODUCTO EN MOVIMIENTO"
    ,"BY ADAM KNOXVILLE": "POR JCAR LABS INC."
  }).map(([key, value]) => [normalized(key), value]))

  const hiddenExactTexts = new Set([
    "22–24 GREAT EASTERN STREET",
    "SHOREDITCH",
    "LONDON EC2A 3NW",
  ].map(normalized))

  const directReplacements = new Map([
    ["(44) 7700 900 482", "+51 904 615 337"],
    ["hey@adamknoxville.design", "contacto@jcarlabs.com"],
    ["Phone copied!", "Teléfono copiado"],
    ["Email copied!", "Correo copiado"],
    ["United Kingdom", "Perú"],
    ["Inspiration", "Solución"],
    ["Release without restraint", "Estrategia con propósito"],
    ["Photography", "Producto digital"],
    ["A pause between departures", "Descubrimiento y estrategia"],
    ["Street Art", "Investigación"],
    ["Concealment as a form of power.", "Diseño que ordena la complejidad."],
    ["Fashion", "Diseño UX/UI"],
    ["Quiet strength in full bloom", "Productos listos para crecer"],
    ["Discipline, held in motion", "Arquitectura en movimiento"],
    ["Japanese Culture", "Desarrollo"],
    ["Caught between who you were and who remains", "Automatización con sentido"],
    ["Light Experiment", "IA, AGENTES & LLMOPS"],
    ["Silence shaped into form", "Escala y evolución"],
    ["Exhibition", "Producto"],
    ["CHASING THE WHITE RABBIT*", "EXPLORACIÓN CONTINUA*"],
    ["Studio CAM66, London", "JCAR LABS · PERÚ"],
    ["Daniel & Adam", "EQUIPO JCAR LABS"],
    ["Modus Vivendi", "PRODUCTO EN MOVIMIENTO"],
    ["by Adam Knoxville", "POR JCAR LABS INC."],
  ].map(([key, value]) => [normalized(key), value]))

  const detailPages = {
    "/work/sistema-hotelero": {
      kicker: "PROYECTO 01 · SOFTWARE EMPRESARIAL",
      title: "Sistema Hotelero",
      lead: "Gestión integral para hoteles en Perú con facturación electrónica.",
      description: "Una solución creada para centralizar reservas, operaciones y procesos administrativos en una plataforma preparada para el trabajo diario.",
      tags: ["Java", "MySQL", "Facturación electrónica", "Gestión hotelera"],
      media: ["/assets/images/hero-image-6.jpg", "/assets/images/hero-image-7.jpg", "/assets/images/hero-image-8.jpeg", "/assets/images/hero-image-9.jpg"],
    },
    "/work/nezus-bisuteria": {
      kicker: "PROYECTO 02 · E-COMMERCE",
      title: "Nezus Bisutería",
      lead: "E-commerce y presencia corporativa para una marca de joyería.",
      description: "Una experiencia digital enfocada en presentar el catálogo, fortalecer la identidad de marca y facilitar el recorrido de compra.",
      tags: ["SOFTWARE & SAAS", "UX/UI", "E-commerce"],
      media: ["/assets/images/image-26.jpg", "/assets/images/image-10.jpeg", "/assets/images/image-11.jpg", "/assets/images/image-12.jpg"],
    },
    "/work/soluciones-empresariales": {
      kicker: "PROYECTO 03 · FULL STACK",
      title: "SOLUCIONES EMPRESARIALES",
      lead: "Comunicación interna y gestión empresarial en una sola plataforma.",
      description: "Una base tecnológica para organizar información, conectar equipos y mejorar procesos operativos internos.",
      tags: ["Full stack", "Gestión empresarial", "SISTEMAS LEGACY"],
      media: ["/assets/images/image-37.jpg", "/assets/images/image-35.jpg", "/assets/images/image-9.jpeg", "/assets/images/right-36.jpeg"],
    },
    "/services/desarrollo-web": {
      kicker: "SERVICIO 01",
      title: "SOFTWARE & SAAS",
      lead: "Sitios modernos, responsivos y optimizados para buscadores.",
      description: "Diseñamos experiencias digitales a medida que comunican con claridad, funcionan en cualquier dispositivo y ayudan a convertir visitas en oportunidades.",
      tags: ["Diseño responsive", "SEO técnico", "UX/UI", "Desarrollo a medida"],
    },
    "/services/inteligencia-artificial": {
      kicker: "SERVICIO 02",
      title: "IA, AGENTES & LLMOPS",
      lead: "Modelos de IA y automatización aplicados a procesos reales.",
      description: "Integramos herramientas inteligentes para reducir tareas repetitivas, acelerar operaciones y convertir información en mejores decisiones.",
      tags: ["IA aplicada", "CLOUD & APIS", "Integraciones", "Optimización"],
    },
    "/services/desarrollo-full-stack": {
      kicker: "SERVICIO 03",
      title: "CLOUD & APIS",
      lead: "Productos completos desde la base de datos hasta la interfaz.",
      description: "Construimos sistemas robustos y escalables conectando arquitectura, lógica de negocio, APIs y experiencias de usuario.",
      tags: ["Frontend", "Backend", "Bases de datos", "APIs"],
    },
    "/services/software-empresarial": {
      kicker: "SERVICIO 04",
      title: "SISTEMAS LEGACY",
      lead: "Sistemas a medida para organizar y escalar operaciones.",
      description: "Diseñamos software alrededor de los procesos reales del negocio para centralizar información, reducir fricción y mantener el control a medida que la operación crece.",
      tags: ["SISTEMAS LEGACY", "Procesos", "Datos", "Escalabilidad"],
    },
    "/services/integraciones-sunat": {
      kicker: "SERVICIO 05",
      title: "AUDITORÍA DE CÓDIGO",
      lead: "Facturación electrónica conectada con la operación diaria.",
      description: "Integramos emisión electrónica y flujos administrativos para que ventas, comprobantes e información tributaria funcionen como parte de un mismo sistema.",
      tags: ["SUNAT", "Facturación electrónica", "APIs", "CLOUD & APIS"],
    },
  }

  const listingPages = {
    "/work": {
      kicker: "PORTAFOLIO · 03 PROYECTOS",
      title: "Proyectos",
      lead: "Soluciones digitales creadas para necesidades reales de negocio.",
      items: [
        { number: "01", title: "Sistema Hotelero", description: "GESTIÓN HOTELERA CON FACTURACIÓN ELECTRÓNICA.", href: "/work/sistema-hotelero", tags: "JAVA · MYSQL", client: "Operación hotelera", category: "SISTEMAS LEGACY", date: "2026", image: "/assets/images/hero-image-18.jpg" },
        { number: "02", title: "Nezus Bisutería", description: "E-COMMERCE Y PRESENCIA DIGITAL PARA UNA MARCA DE JOYERÍA.", href: "/work/nezus-bisuteria", tags: "WEB · UX/UI", client: "Nezus Bisutería", category: "Comercio electrónico", date: "2026", image: "/assets/images/image-26.jpg" },
        { number: "03", title: "SOLUCIONES EMPRESARIALES", description: "COMUNICACIÓN INTERNA Y GESTIÓN EN UNA SOLA PLATAFORMA.", href: "/work/soluciones-empresariales", tags: "FULL STACK", client: "Producto JCAR Labs", category: "Plataforma empresarial", date: "2026", image: "/assets/images/image-37.jpg" },
      ],
    },
    "/services": {
      kicker: "CAPACIDADES · 05 SERVICIOS",
      title: "Servicios",
      lead: "Tecnología que hace crecer negocios.",
      items: [
        { number: "01", title: "SOFTWARE & SAAS", description: "Sitios modernos, responsivos y optimizados para buscadores.", href: "/services/desarrollo-web", tags: "WEB · SEO · UX/UI", image: "/assets/images/image-bundle-68.jpeg", avatar: "/assets/images/adam-knoxville.jpg" },
        { number: "02", title: "IA, AGENTES & LLMOPS", description: "Modelos de IA y automatización aplicados a procesos reales.", href: "/services/inteligencia-artificial", tags: "IA · AUTOMATIZACIÓN", image: "/assets/images/image-14.jpg", avatar: "/assets/images/jane-ohara.jpg" },
        { number: "03", title: "CLOUD & APIS", description: "Productos completos desde la base de datos hasta la interfaz.", href: "/services/desarrollo-full-stack", tags: "FRONTEND · BACKEND", image: "/assets/images/image-19.jpg", avatar: "/assets/images/matthew-spears.png" },
        { number: "04", title: "SISTEMAS LEGACY", description: "Sistemas a medida para organizar y escalar operaciones.", href: "/services/software-empresarial", tags: "SOFTWARE · PROCESOS", image: "/assets/images/image-35.jpg", avatar: "/assets/images/freja-andersson.jpg" },
        { number: "05", title: "AUDITORÍA DE CÓDIGO", description: "Facturación electrónica conectada con la operación diaria.", href: "/services/integraciones-sunat", tags: "SUNAT · AUTOMATIZACIÓN", image: "/assets/images/image-9.jpeg", avatar: "/assets/images/adam-knoxville.jpg" },
      ],
    },
  }

  const legalPages = {
    "/privacy-policy": {
      kicker: "JCAR LABS · LEGAL",
      title: "Política de privacidad",
      updated: "Actualizada el 29 de agosto de 2026",
      lead: "Explicamos con claridad qué información recibimos, para qué la utilizamos y cómo puedes ejercer tus derechos.",
      sections: [
        ["01", "Información que recopilamos", "Podemos recibir tu nombre, correo electrónico, teléfono y el contenido que compartas voluntariamente mediante nuestros formularios o canales de contacto. También podemos recopilar datos técnicos básicos, como tipo de navegador, región y uso del sitio."],
        ["02", "Cómo utilizamos la información", "Usamos estos datos para responder consultas, preparar propuestas, prestar nuestros servicios, mantener la seguridad del sitio y mejorar la experiencia. No vendemos información personal ni la utilizamos para fines ajenos a JCAR Labs."],
        ["03", "Cookies y analítica", "El sitio puede utilizar cookies esenciales y medición de uso para recordar preferencias, detectar errores y comprender el rendimiento. Puedes restringirlas desde la configuración de tu navegador."],
        ["04", "Conservación y seguridad", "Conservamos los datos únicamente durante el tiempo necesario para atender la finalidad informada o cumplir obligaciones legales. Aplicamos medidas razonables para prevenir acceso, pérdida, uso o divulgación no autorizados."],
        ["05", "Servicios de terceros", "Algunas funciones pueden depender de proveedores de alojamiento, analítica, correo o mensajería. Solo reciben la información necesaria para prestar su función y se rigen por sus propias políticas."],
        ["06", "Tus derechos", "Puedes solicitar acceso, rectificación o eliminación de tus datos, así como retirar un consentimiento otorgado. Evaluaremos cada solicitud de acuerdo con la legislación aplicable."],
        ["07", "Cambios en esta política", "Podemos actualizar esta política cuando cambien nuestros servicios o las obligaciones aplicables. La fecha publicada al inicio identifica la versión vigente."],
        ["08", "Contacto", "Para consultas sobre privacidad, escribe a contacto@jcarlabs.com o comunícate al +51 904 615 337. JCAR Labs Inc. opera desde Perú."],
      ],
    },
    "/terms-of-use": {
      kicker: "JCAR LABS · LEGAL",
      title: "Términos de uso",
      updated: "Actualizados el 29 de agosto de 2026",
      lead: "Estas condiciones regulan el acceso y uso del sitio web y de los materiales publicados por JCAR Labs Inc.",
      sections: [
        ["01", "Aceptación", "Al navegar por este sitio aceptas estos términos. Si no estás de acuerdo con ellos, debes dejar de utilizarlo."],
        ["02", "Uso permitido", "Puedes consultar y compartir páginas públicas para fines personales y no comerciales. No puedes interferir con el funcionamiento del sitio, intentar accesos no autorizados ni utilizarlo para actividades ilícitas."],
        ["03", "Propiedad intelectual", "El diseño, código, textos, marcas, imágenes y casos presentados pertenecen a JCAR Labs Inc. o se utilizan con autorización. No se permite copiarlos, revenderlos o atribuirse su autoría sin permiso escrito."],
        ["04", "Información del sitio", "Trabajamos para mantener el contenido correcto y actualizado, pero puede contener errores o referencias que cambien con el tiempo. La información publicada no sustituye una propuesta o acuerdo de servicio."],
        ["05", "Enlaces externos", "El sitio puede incluir enlaces a servicios de terceros. JCAR Labs no controla su contenido, disponibilidad ni políticas; debes revisar sus condiciones antes de utilizarlos."],
        ["06", "Disponibilidad", "No garantizamos operación ininterrumpida o libre de errores. Podemos modificar, suspender o retirar secciones cuando sea necesario para seguridad, mantenimiento o evolución del producto."],
        ["07", "Limitación de responsabilidad", "En la medida permitida por la ley, JCAR Labs no será responsable por pérdidas indirectas derivadas del uso del sitio o de decisiones tomadas únicamente con base en su contenido."],
        ["08", "Contacto", "Para permisos, consultas o aclaraciones, escribe a contacto@jcarlabs.com o comunícate al +51 904 615 337. JCAR Labs Inc. opera desde Perú."],
      ],
    },
  }

  const corporate = {"services":[{"route":"/services/desarrollo-web","number":"01","label":"SOFTWARE & SAAS","title":"Desarrollo de Software a Medida & Productos SaaS","description":"Desarrollo de software a medida y productos SaaS. Del proceso de negocio a una plataforma preparada para crecer.","sourceTitle":"Beyond AI Aesthetics: What Human-Led Digital Art Means Now","sourceDescription":"AI didn’t replace creativity. It reshaped it — forcing artists to redefine what human originality truly means.","oldTitle":"Desarrollo Web","tags":["React","Node.js","SQL","Producto SaaS"]},{"route":"/services/inteligencia-artificial","number":"02","label":"IA, AGENTES & LLMOPS","title":"Integración de IA Transmodal, Agentes y LLMOps","description":"Integración de IA transmodal, agentes y LLMOps. Conectamos modelos, datos y herramientas con procesos de negocio.","sourceTitle":"When Images Begin to Listen: The Quiet Power of Responsive Art","sourceDescription":"Interactive work is evolving beyond touchscreens and gimmicks. The most compelling contemporary pieces now respond subtly — to sound, environment, presence, and emotion.","oldTitle":"Inteligencia Artificial","tags":["Python","APIs","Agentes","LLMOps"]},{"route":"/services/desarrollo-full-stack","number":"03","label":"CLOUD & APIS","title":"Arquitectura Cloud, APIs & Microservicios","description":"Arquitectura cloud, APIs y microservicios. Diseñamos servicios conectados, observables y preparados para evolucionar.","sourceTitle":"The Rise of Experiential Minimalism in Contemporary Exhibitions","sourceDescription":"Instead of spectacle, galleries are embracing controlled intensity — restrained environments with powerful psychological impact.","oldTitle":"Desarrollo Full Stack","tags":["Node.js","Java","Python","APIs"]},{"route":"/services/software-empresarial","number":"04","label":"SISTEMAS LEGACY","title":"Modernización e Ingeniería de Sistemas Legacy","description":"Modernización e ingeniería de sistemas legacy. Evolucionamos aplicaciones existentes con una transición gradual y verificable.","sourceTitle":"Why Motion-First Art Is Defining The Next Creative Era","sourceDescription":"Static visuals are no longer enough. Motion-first thinking is reshaping art, branding, and digital experiences — here’s why the shift matters.","oldTitle":"Software Empresarial","tags":["Java","PHP","SQL","Modernización"]},{"route":"/services/integraciones-sunat","number":"05","label":"AUDITORÍA DE CÓDIGO","title":"Consultoría de Arquitectura y Auditoría de Código","description":"Consultoría de arquitectura y auditoría de código. Convertimos hallazgos técnicos en decisiones y prioridades para el negocio.","sourceTitle":"Why Slowness Is Becoming a Radical Artistic Choice","sourceDescription":"In a culture obsessed with speed, instant gratification, and constant refresh, artists are turning to slowness — not as nostalgia, but as resistance.","oldTitle":"Integraciones SUNAT","tags":["Arquitectura","Código","Seguridad","Mantenibilidad"]}],"extraCopy":{"Thanks for reading":"Construyamos la solución","SHARE ARTICLE ON SOCIAL":"COMPARTE ESTA SOLUCIÓN","NEXT":"SIGUIENTE","PREVIOUS":"ANTERIOR","December 4, 2025":"SERVICIO 04","October 1, 2025":"SERVICIO 05","December 2025":"JCAR LABS INC.","4 minutes":"4 minutos","5 minutes":"5 minutos","3 minutes":"3 minutos","6 mins":"6 minutos"},"translations":{"/services/desarrollo-web":[["Artificial Intelligence entered the creative world like a storm — exciting, frightening, overwhelming, misunderstood. At first, conversations revolved around fear: Will AI replace artists? Will originality die? Will creative labor become obsolete?\n\nThose questions are settling. What remains is far more interesting.\n\nNow that AI has become ordinary, the real conversation begins: what does it mean to create as a human in a machine-accelerated world?","Desarrollo de Software a Medida & Productos SaaS. Convertimos necesidades de negocio en productos digitales que pueden evolucionar con sus usuarios. Partimos de los procesos, los datos y las decisiones que el software debe facilitar.\n\nDefinimos el alcance, validamos los flujos y construimos una base mantenible. La arquitectura, las pruebas y la seguridad acompañan al producto desde el inicio."],["Beyond Shock and Novelty","Producto y lógica de negocio"],["When AI-generated visuals emerged, their power was novelty. Suddenly, we could generate images at the speed of thought. Entire aesthetics bloomed overnight. But novelty has a short lifespan.","Un producto útil empieza por entender quién lo usa y qué necesita resolver. Identificamos reglas de negocio, roles y recorridos antes de decidir cómo implementarlos."],["Once everyone can produce something instantly, production no longer matters.","El alcance se organiza por valor y por dependencias reales."],["What separates meaningful art from machine-made output isn’t complexity or technical execution. It’s intention. AI can synthesize style. It can remix culture. It can hallucinate possibility. But it cannot anchor meaning to lived experience.","Diseñamos software a medida para conectar la experiencia de usuario con las operaciones. Cada módulo tiene una responsabilidad clara y cada dato, un lugar definido dentro del sistema."],["Human-led digital art accepts this. It doesn’t compete with AI. It collaborates with it — shaping machine chaos with emotional direction.","Para productos SaaS, planificamos la separación de clientes, los permisos y la evolución de funcionalidades según el modelo del negocio."],["A Hybrid Future","Una base que puede evolucionar"],["We’re entering an era where creativity is collaborative — human intuition directing machine capability. Artists shape direction. AI expands possibility. The relationship is additive, not antagonistic.","El ecosistema combina React y JavaScript en la experiencia de usuario con Node.js, Python, Java o PHP en los servicios, según las necesidades del producto. SQL conecta la información con los procesos."],["This shift demands a different type of authorship. Creatives are no longer just makers — they are decision architects, curators of possibility. The role is evolving, not disappearing.","La elección técnica responde al contexto: integraciones existentes, experiencia del equipo, mantenimiento y carga esperada. Documentamos las decisiones para que el producto pueda continuar creciendo."],["The future of digital art isn’t AI replacing us.","Interfaz y reglas de negocio conectadas."],["It’s AI requiring us to be more human than ever.","Datos consistentes y accesos definidos."],["And that may be the most valuable outcome of all.","Una base preparada para nuevas versiones."],["Friction, Error, and the Value of Imperfection","Calidad durante todo el desarrollo"],["AI tends toward completion. Humans tend toward exploration. That difference matters.","La seguridad y la mantenibilidad forman parte del diseño del producto."],["Some of the most compelling digital work right now embraces friction: artifacts, distortion, unpredictability. Artists are using AI’s cold precision and intentionally interrupting it. They break patterns. They disrupt coherence. They impose feeling on structure.","Validamos los recorridos críticos, los permisos y las integraciones antes de cada entrega. Las pruebas y la revisión de código permiten detectar problemas y reducir el riesgo de cambios posteriores."],["Beauty isn’t found in perfection — it’s found in resistance.","Software pensado para operar y evolucionar."],["Human-led AI art isn’t smooth. It’s alive. And being alive inherently means being flawed, inconsistent, layered, and emotionally complicated.","Entregamos una base comprensible: responsabilidades claras, documentación y criterios para evaluar su comportamiento. El alcance de cada etapa se acuerda con el negocio."],["The work doesn’t ask, “How realistic can we get?”","¿Qué proceso necesita una mejor herramienta?"],["It asks, “How human can digital expression feel?”","Conversemos sobre el producto que quieres construir."]],"/services/inteligencia-artificial":[["For years, interactive art was loud. Glowing touchscreens. Reactive tech demos. Spectacle disguised as depth.\nBut something has shifted.\n\nToday, the most meaningful interactive work hardly announces itself. It doesn’t demand attention with flashing interfaces or exaggerated feedback. Instead, it listens. It observes. It responds quietly — almost gently — to the world around it.\n\nThis isn’t “interactive” as entertainment. This is responsiveness as emotional connection.","Integración de IA Transmodal, Agentes y LLMOps. Diseñamos soluciones que conectan texto, imágenes, audio y documentos según las capacidades del modelo y la necesidad del negocio.\n\nLos agentes coordinan herramientas y tareas dentro de límites explícitos. LLMOps aporta evaluación, seguimiento y control de versiones para pasar de una demostración a una operación que pueda supervisarse."],["From Interaction to Sensitivity","IA conectada con el negocio"],["The old definition of interactivity was rooted in action:","Comenzamos por un caso de uso concreto:"],["Tap here. Move this. Trigger that.","Comprender. Asistir. Automatizar."],["It placed the burden on the viewer — perform a task to unlock meaning.","Identificamos qué información necesita el sistema y qué decisiones requieren revisión humana."],["Responsive art changes the premise entirely. The viewer doesn’t operate the work. They inhabit it. Presence itself becomes participation.","La integración transmodal permite trabajar con distintos tipos de información sin perder el contexto del proceso. La solución se diseña alrededor de los datos disponibles y sus restricciones."],["Light shifts based on breathing space.","Texto y documentación del negocio."],["Sound textures evolve as others enter the room.","Imágenes y archivos relevantes para la tarea."],["Visuals adjust their rhythm to the tone of the surrounding environment.","Audio y otros formatos cuando el caso de uso lo requiere."],["Nothing demands. Everything notices.","Cada entrada tiene una finalidad definida."],["This creates a new kind of intimacy — work that acknowledges the audience without controlling them. It feels less like technology and more like conversation.","La IA se conecta con sistemas existentes mediante APIs y servicios. Delimitamos qué datos puede consultar y qué acciones puede ejecutar, con trazabilidad de las operaciones relevantes."],["Toward More Human Technology","Agentes con responsabilidades claras"],["Responsive art points toward a future of technologies that behave less like machines and more like attentive companions. The systems we build for culture, design, architecture, and communication don’t always need to shout.","Un agente puede consultar información, utilizar herramientas y coordinar pasos de un flujo. Definimos su alcance, sus permisos y las condiciones en las que debe pedir intervención humana."],["Sometimes they just need to listen.","La autonomía se diseña con límites."],["This doesn’t mean abandoning complexity or engineering. It means applying it with restraint. Intelligence doesn’t always need to be visible. Often, the most profound systems are the ones that get out of the way — letting human experience carry the weight.","Usamos Python y servicios API como parte del ecosistema de integración. La selección de modelos responde a calidad, latencia, coste y tratamiento de datos, evaluados para cada proyecto."],["The future of interactive work isn’t louder.","La operación necesita criterios visibles."],["It’s quieter.","Calidad de respuesta."],["More attentive.","Tiempo de ejecución."],["More human.","Uso de recursos."],["And that might be the most radical evolution of all.","Y un camino de revisión cuando el sistema no tiene suficiente información."],["The Emotional Weight of Being Seen","LLMOps para mejorar con evidencia"],["There’s quiet psychology behind this.","Los modelos y los datos cambian."],["Most people don’t want to push buttons in galleries. They don’t want to perform. They want to feel acknowledged. Responsive art offers this beautifully. It tells viewers:","Preparamos evaluaciones con ejemplos del proceso real, versionamos instrucciones y revisamos los resultados antes de incorporar cambios. El objetivo es detectar degradaciones y hacer la operación comprensible."],["💬 “You’re here. That matters. Your presence changes this.”","“Cada cambio debe poder evaluarse.”"],["That subtle recognition creates attachment.","Las trazas ayudan a entender cada ejecución."],["Visitors stay longer.","Se revisan los errores."],["They slow down.","Se contrastan las respuestas."],["They breathe differently.","Se ajustan los límites."],["The room no longer feels like a display. It becomes an environment shared between artwork and audience — something living, aware, and sensitive.","La supervisión permite mejorar la solución sin convertir cada actualización en una apuesta. Documentamos los criterios y las decisiones que afectan su funcionamiento."],["This is presence transformed into connection.","IA integrada con criterio y seguimiento."]],"/services/desarrollo-full-stack":[["Something fascinating is happening in gallery culture. While digital platforms flood us with visual excess, physical spaces are moving in the opposite direction: quieter, slower, more deliberate. This new movement isn’t about stripping back aesthetics. It’s about amplifying presence.\n\nWelcome to Experiential Minimalism — exhibitions that use restraint not as aesthetic purity, but as emotional architecture.","Arquitectura Cloud, APIs & Microservicios. Diseñamos la relación entre servicios, datos e infraestructura para que el sistema responda a las necesidades del negocio.\n\nDefinimos límites, contratos e integraciones con criterios de seguridad, operación y crecimiento. Elegimos una arquitectura acorde con la complejidad real y con la capacidad del equipo que la mantendrá."],["Less Material, More Impact","Servicios con límites claros"],["Walk into one of these exhibitions and the first sensation isn’t excitement — it’s awareness. The space stops you. It holds you. Your breathing adjusts. Your senses sharpen.","Identificamos los dominios del negocio, los flujos de información y las dependencias. Esa lectura permite definir responsabilidades y evitar que cada cambio afecte al sistema completo."],["This isn’t traditional minimalism where simplicity equals absence. The new minimalism uses reduction as a pressure system. Nothing is loud, but everything is felt. Every decision carries weight because nothing exists without purpose.","Las APIs establecen contratos entre equipos y aplicaciones. Diseñamos entradas, respuestas, autenticación, tratamiento de errores y evolución de versiones para hacer predecible la integración."],["Light becomes sculptural rather than atmospheric. Sound is treated like a living presence. Spatial emptiness isn’t a void — it’s tension. The viewer’s body becomes part of the work. The experience isn’t about looking at art. It’s about standing inside it.","Los microservicios se evalúan cuando aportan independencia de despliegue u operación. Consideramos también el coste de coordinación, las llamadas de red y la consistencia de datos."],["In a world of noise, silence hits harder.","Cada servicio debe tener una razón para existir."],["A Future Built on Precision, Not Excess","Evolución y operación"],["This movement is not a nostalgic return to minimalism. It’s a response to digital culture. It’s about crafting experiences that resist scrolling behavior and reward presence.","El ecosistema de servicios puede combinar Node.js, Java, Python y PHP según el contexto. SQL sostiene la información estructurada; React conecta los servicios con la experiencia de usuario."],["Galleries are beginning to understand that people don’t need more stimulation — they need focus. Creators are learning that impact doesn’t come from quantity — it comes from precision.","Planificamos entornos, configuración, despliegue y observabilidad. El proveedor cloud y las herramientas se definen con el proyecto, considerando requisitos operativos y restricciones del negocio."],["Experiential Minimalism isn’t smaller art.","La arquitectura se valida en funcionamiento."],["It’s deeper art.","Con señales que el equipo pueda interpretar."],["Art that stays with you not because of spectacle, but because it quietly refuses to leave.","Registros, métricas y documentación ayudan a investigar incidentes y a priorizar mejoras con información del sistema."],["The Psychology of Controlled Environments","Seguridad e integraciones"],["Experiential Minimalism understands something important: overstimulation numbs. The more we are given, the less we feel. These new exhibitions flip that.","Definimos permisos, manejo de secretos y validación de entradas desde los límites del sistema. Revisamos los datos que circulan y las responsabilidades de cada integración."],["When a space restricts stimuli, perception heightens. Details matter. Small changes carry emotional gravity. Time slows down. Visitors don’t just glance — they stay, observe, and begin to participate.","Diseñamos cómo responder a fallos: tiempos de espera, reintentos acotados y recuperación. La disponibilidad se planifica de acuerdo con el alcance y las condiciones de operación."],["This develops powerful emotional intimacy.","Integraciones comprensibles y controladas."],["Instead of impressive grand gestures, viewers experience private, internal responses. The work invites introspection rather than spectacle. You’re not forced to react — you’re given space to feel.","Una arquitectura mantenible permite incorporar nuevas capacidades sin perder visibilidad sobre el conjunto. Dejamos decisiones y contratos documentados para facilitar el trabajo del equipo."],["And in the modern cultural climate, that feels radical.","Construyamos una base que acompañe al negocio."]],"/services/software-empresarial":[["We live in a world that never stops moving. Screens refresh, feeds regenerate, environments shift, and our attention constantly repositions itself. In this landscape, static imagery feels increasingly foreign. That’s why motion-first thinking isn’t just a creative direction — it has become a natural cultural response.\n\nAcross art, design, and communication, movement is no longer support material or aesthetic enhancement. It is now the core medium through which meaning is built, emotion is activated, and presence is felt. To understand where visual culture is heading, we need to understand why motion has taken center stage, and why standing still isn’t an option anymore.","Modernización e Ingeniería de Sistemas Legacy. El software existente contiene reglas, integraciones y conocimiento del negocio que deben entenderse antes de cambiarlo.\n\nAnalizamos el sistema, hacemos visibles sus dependencias y definimos una transición por etapas. El objetivo es mejorar su capacidad de evolución manteniendo bajo control la continuidad operativa y los datos que utiliza."],["Motion as Language, Not Decoration","Entender antes de transformar"],["For years, motion graphics lived at the periphery — useful for advertising, digital displays, brand reveals, and cinematic identity. Now motion is stepping into conceptual territory. It’s no longer “animation added to design.” It is the design.","Revisamos código, datos, interfaces y procesos de operación. Documentamos las funciones críticas y las dependencias para distinguir qué debe conservarse, qué puede aislarse y qué conviene reemplazar."],["Motion holds cognitive power. Movement creates anticipation. Timelines build narrative. Transition defines emotion. When imagery shifts, the brain participates — tracking, following, expecting. Viewers don’t simply look. They react.","La ingeniería del sistema legacy recupera conocimiento que suele estar repartido entre el código y las personas. Convertimos ese contexto en criterios para decidir el siguiente cambio."],["The contemporary audience no longer consumes visuals passively. We’re used to systems that adapt, respond, and evolve in real time. Our relationship with visual media has become kinetic. The result? Work that remains still risks feeling incomplete — like a sentence cut midway.","Antes de intervenir, establecemos una referencia del comportamiento actual. Las pruebas de caracterización ayudan a detectar variaciones en reglas y recorridos importantes."],["The most compelling works today treat motion as structure. Meaning is found in the pace of change, the friction between frames, the tension before release. This is visual literacy evolving — motion as grammar, movement as syntax.","La modernización puede incluir separar módulos, exponer APIs, actualizar componentes o migrar partes del sistema. El plan responde a riesgos y necesidades, no a una sustitución automática de todo el código."],["Why This Isn’t Just a Trend","Una transición por etapas"],["Every major change in art history begins with a technological and cultural shift. Photography transformed representation. The internet transformed communication. Motion is now transforming perception itself.","Ordenamos los cambios por impacto y dependencia. Cada etapa define qué se modifica, cómo se valida y qué condiciones deben cumplirse para continuar."],["This isn’t novelty-driven aesthetics. It’s the next visual literacy.","La continuidad del negocio guía las decisiones."],["Motion-first thinking is shaping education, influencing gallery programming, redefining brand presence, and shifting how audiences emotionally engage with work. It requires different thinking — not “what does it look like?” but “how does it behave?”","Trabajamos con el ecosistema existente, incluyendo Java, PHP y SQL cuando forman parte de la solución. Incorporamos tecnologías como Node.js, Python o React donde aportan una mejora justificada."],["This shift is visible in physical environments too. Gallery installations adjust based on proximity. Digital exhibitions evolve based on time of day. Public art responds to movement, sound, or presence. We’re no longer designing for consumption. We’re designing for interaction.","La transición de datos requiere controles propios: correspondencia de estructuras, validación de resultados y mecanismos de recuperación. Las integraciones también se verifican antes de pasar a producción."],["Creators who understand this aren’t adapting to the times — they’re defining them.","Cada avance debe dejar el sistema más comprensible."],["Motion isn’t future-thinking anymore. It’s the language of now.","Y ofrecer al equipo una base para continuar."],["Branding, Identity & The Rise of the Living System","Conservar el conocimiento del negocio"],["Modern identity design is no longer about “logo + layout.” Brands exist as living entities. They appear across countless environments, scales, cultures, and contexts. Static identity systems simply can’t keep up.","Modernizar también implica documentar decisiones y reducir dependencias difíciles de mantener. Buscamos que las personas puedan entender el sistema, investigar fallos y trabajar sobre él con mayor claridad."],["Motion creates continuity.","Evolución con continuidad."],["Kinetic branding allows identity to breathe — pulsing, adjusting, shifting energy based on context. Instead of one definitive form, brands now operate as organisms, responding to time, sound, emotion, and environment. We’re witnessing design strategies inspired by biology rather than print heritage.","Acordamos el alcance de la transición, los criterios de aceptación y las responsabilidades operativas. La nueva arquitectura se conecta con la realidad del sistema que ya sostiene al negocio."]],"/services/integraciones-sunat":[["Open your phone and everything competes for urgency. Notifications pulse. Content scrolls endlessly. News cycles reset every hour. Speed has quietly become our baseline condition.\n\nWhich makes slowness… revolutionary.\n\nAcross contemporary art, motion work, performance, photography, and installation design, creators are deliberately embracing pacing that resists modern tempo. Moments stretch. Sequences linger. Time becomes material.\n\nThis isn’t sentimental longing for the past. It’s a conscious cultural intervention.","Consultoría de Arquitectura y Auditoría de Código. Revisamos cómo está construido un sistema y qué necesita para continuar evolucionando.\n\nConectamos decisiones técnicas con el contexto del negocio: operación, crecimiento, riesgos y capacidad del equipo. La revisión produce hallazgos explicados y una hoja de ruta priorizada, con un alcance acordado desde el inicio."],["Art That Refuses to Rush","Una revisión con contexto"],["Slow work doesn’t beg for attention. It earns it.","La auditoría empieza por definir el alcance."],["A video loop that develops with painful patience.","Qué componentes se revisan."],["A performance that unfolds like breathing.","Qué procesos son críticos."],["An installation where nothing happens — until you realize everything is happening in ways your rushed perception nearly missed.","Qué preguntas necesita responder el equipo para decidir sobre la siguiente etapa del producto o de la plataforma."],["When time stretches, viewers confront themselves.","El código se interpreta dentro del sistema."],["You notice your restlessness.","Sus responsabilidades."],["You confront your discomfort.","Sus dependencias."],["You become aware of your impatience.","Sus puntos de cambio."],["This makes slowness powerful. It forces presence. It exposes habit. It interrupts the momentum of modern life with deliberate friction.","Analizamos la organización del código, los contratos y el tratamiento de datos. Contrastamos la implementación con los requisitos y las restricciones que debe atender."],["Where speed stimulates, slowness reveals.","Los hallazgos necesitan evidencia y contexto."],["The Value of Refusal","Decisiones que se pueden ejecutar"],["Slowness is not a limitation of medium. It is a statement of intent.","Una revisión es útil cuando permite ordenar el trabajo."],["It resists algorithm culture.","Riesgo e impacto."],["It refuses performance metrics.","Esfuerzo y dependencias."],["It ignores pressure to entertain.","Prioridad y secuencia."],["Slow work creates another world inside our world — one governed by different rules, where presence matters more than reaction, and patience becomes reward rather than burden.","Documentamos los problemas observados y las alternativas de mejora. Diferenciamos acciones inmediatas de cambios que requieren una transición o una decisión de producto."],["In that sense, slowness is not retreat.","El resultado es una hoja de ruta."],["It is rebellion.","Comprensible."],["A quiet rebellion.","Priorizada."],["A grounded rebellion.","Justificada."],["A necessary rebellion.","Acorde con el contexto."],["Because sometimes the bravest creative act is doing the exact opposite of what the world demands.","El equipo recibe criterios para actuar y para verificar si los cambios resuelven el problema identificado."],["The Emotional Mechanics of Time","Seguridad y mantenibilidad"],["Slowness isn’t emptiness. It’s density.","Revisamos límites y responsabilidades."],["The longer you stay with a work, the more meaning accumulates. Small variations become emotionally significant. Repetition becomes meditative instead of mechanical. Subtlety becomes dramatically amplified.","El análisis puede abarcar autenticación, autorización, validación de entradas, manejo de errores y dependencias. Las conclusiones se vinculan con el código y el alcance efectivamente revisados."],["Psychologists call this temporal dilation — time subjectively expands when attention deepens.","El ecosistema documentado incluye JavaScript, React, Node.js, Python, Java, PHP y SQL. Definimos la profundidad de revisión según los componentes del proyecto."],["In art, that expansion becomes poetics.","También evaluamos claridad y facilidad de cambio."],["Viewers aren’t just watching time pass. They’re feeling themselves inside time. That’s rare today. That’s valuable. That’s human.","Una auditoría de código aporta información para decidir; el alcance específico determina qué aspectos pueden evaluarse y qué validaciones adicionales necesita el sistema."],["Which is exactly why artists are protecting it.","Conversemos sobre lo que necesitas conocer de tu software."]]}}
  for (const service of corporate.services) {
    const originalTitle = normalized(service.sourceTitle)
    const previousDescription = replacements.get(normalized(service.sourceDescription))
    replacements.set(originalTitle, service.label)
    replacements.set(normalized(service.sourceDescription), service.description.toUpperCase())
    if (previousDescription) replacements.set(normalized(previousDescription), service.description.toUpperCase())
    Object.assign(detailPages[service.route], { title: service.title, lead: service.description, description: service.description, tags: service.tags })
  }

  // Corporate copy is applied after the retained Framer hydration lifecycle.
  // Keep every existing element, span, link, class and motion attribute.
  function setCorporateText(element, value) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    if (!nodes.length) return;
    const words = value.split(/\s+/);
    const lengths = nodes.map((node) => (node.nodeValue.trim().match(/\S+/g) || []).length);
    const total = lengths.reduce((sum, count) => sum + count, 0) || 1;
    let used = 0;
    let weight = 0;
    nodes.forEach((node, index) => {
      weight += lengths[index];
      const end = index === nodes.length - 1 ? words.length : Math.round(words.length * weight / total);
      node.nodeValue = words.slice(used, end).join(' ') + (end > used && end < words.length ? ' ' : '');
      used = end;
    });
  }

  function applyCorporateCopy() {
    const route = location.pathname.replace(/\/$/, '') || '/';
    const copy = new Map(Object.entries(corporate.extraCopy).map(([key, value]) => [normalized(key), value]));
    if (route.startsWith('/services/')) copy.set('PLATAFORMA EMPRESARIAL', 'JCAR LABS INC.');
    for (const service of corporate.services) {
      for (const key of [service.sourceTitle, service.oldTitle]) copy.set(normalized(key), service.label);
      copy.set(normalized(service.sourceDescription), service.description.toUpperCase());
    }
    for (const [key, value] of corporate.translations[route] || []) copy.set(normalized(key), value);
    for (const element of document.querySelectorAll('main p, main h1, main h2, main h3, main h4, main h5, main h6')) {
      const value = copy.get(normalized(element.textContent));
      if (value) setCorporateText(element, value);
    }
    if (route === '/') {
      for (const element of document.querySelectorAll('main section[data-framer-name="Section 0 - Hero"] p, main section[data-framer-name="Section 6 - Work Types"] p')) {
        if (normalized(element.textContent) === 'SOLUCIONES EMPRESARIALES') setCorporateText(element, 'CONSULTORÍA & CÓDIGO');
      }
      const about = document.getElementById('about-me');
      if (about) {
        const technologies = new Map([
          ['SOFTWARE & SAAS', 'JAVASCRIPT'], ['SISTEMAS LEGACY', 'PYTHON'],
          ['IA, AGENTES & LLMOPS', 'REACT'], ['CLOUD, APIS & MICROSERVICIOS', 'NODE.JS'],
          ['CLOUD & APIS', 'SQL'], ['AUDITORÍA DE CÓDIGO', 'PHP'], ['UX/UI', 'ARQUITECTURA'],
        ]);
        let legacy = 0;
        let cloud = 0;
        for (const element of about.querySelectorAll('p')) {
          const key = normalized(element.textContent);
          const value = key === 'SISTEMAS LEGACY' && legacy++ ? 'JAVA' : key === 'CLOUD & APIS' ? (cloud++ ? 'SQL' : 'NODE.JS') : technologies.get(key);
          if (value) setCorporateText(element, value);
        }
      }
    }
  }


  function replaceCompositeText() {
    const candidates = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, footer, button, label")
    for (const element of candidates) {
      const key = normalized(element.innerText || element.textContent)
      if (!key) continue
      if (hiddenExactTexts.has(key)) {
        element.hidden = true
        continue
      }
      const replacement = replacements.get(key)
      if (!replacement || key === normalized(replacement)) continue
      element.textContent = replacement
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      const node = walker.currentNode
      const parent = node.parentElement
      if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) continue
      const key = normalized(node.nodeValue)
      if (key.startsWith("CAPTION:")) {
        parent.hidden = true
        continue
      }
      if (hiddenExactTexts.has(key)) {
        parent.hidden = true
        continue
      }
      const replacement = directReplacements.get(key) || (key.length > 30 ? replacements.get(key) : null)
      if (replacement && key !== normalized(replacement)) node.nodeValue = replacement
    }
  }

  function adaptDetailCopy() {
    const projectWords = {
      "/work/sistema-hotelero": { UNSTABLE: "SISTEMA", SEQUENCE: "HOTELERO" },
      "/work/nezus-bisuteria": { STILL: "NEZUS", PRESSURE: "BISUTERÍA" },
      "/work/soluciones-empresariales": { SURFACE: "SOLUCIONES", TENSION: "EMPRESARIALES" },
    }[location.pathname]

    if (projectWords) {
      for (const heading of document.querySelectorAll("main h1, main h2")) {
        const replacement = projectWords[normalized(heading.textContent)]
        if (replacement) heading.textContent = replacement
      }
    }

    const walker = document.createTreeWalker(document.querySelector("main") || document.body, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      const node = walker.currentNode
      if (/^\s*\d+\s+minutes?\s*$/i.test(node.nodeValue || "")) {
        node.nodeValue = node.nodeValue.replace(/minutes?/i, "minutos")
      }
    }
  }

  function restoreEditorialEmphasis() {
    if (location.pathname !== "/") return
    const emphasis = new Map([
      ["SOFTWARE A MEDIDA Y PRODUCTOS SAAS QUE CONECTAN USUARIOS, DATOS Y PROCESOS DE NEGOCIO.", ["SOFTWARE A MEDIDA"]],
      ["MODERNIZACIÓN DE SISTEMAS LEGACY CON CAMBIOS GRADUALES, VALIDACIÓN Y CONTINUIDAD OPERATIVA.", ["SISTEMAS LEGACY"]],
      ["IA TRANSMODAL, AGENTES Y LLMOPS PARA CONECTAR MODELOS CON DATOS Y HERRAMIENTAS DEL NEGOCIO.", ["AGENTES Y LLMOPS"]],
      ["ARQUITECTURA CLOUD, APIS Y MICROSERVICIOS CON CONTRATOS CLAROS Y CAPACIDAD DE EVOLUCIÓN.", ["APIS", "MICROSERVICIOS"]],
      ["CONSULTORÍA DE ARQUITECTURA Y AUDITORÍA DE CÓDIGO PARA PRIORIZAR RIESGOS Y MEJORAS.", ["AUDITORÍA DE CÓDIGO"]],
    ])
    for (const element of document.querySelectorAll('main section[data-framer-name="Section 6 - Work Types"] p')) {
      const key = normalized(element.innerText)
      const phrases = emphasis.get(key)
      if (!phrases || element.dataset.jcarHighlighted === "true") continue
      let html = element.textContent
      for (const phrase of phrases) html = html.replace(phrase, `<span class="jcar-highlight">${phrase}</span>`)
      element.innerHTML = html
      element.dataset.jcarHighlighted = "true"
    }
  }

  function updateNavigationAndLinks() {
    for (const anchor of document.querySelectorAll("a[href]")) {
      const href = anchor.getAttribute("href") || ""
      const absolute = new URL(href, location.href)

      if (absolute.origin === location.origin && absolute.hash === "#about-me") anchor.href = "/#about-me"
      if (absolute.origin === location.origin && absolute.pathname === "/thoughts") anchor.href = "/services"
      if (absolute.origin === location.origin && absolute.pathname === "/work/unstable-sequence") anchor.href = "/work/sistema-hotelero"
      if (absolute.origin === location.origin && absolute.pathname === "/work/still-pressure") anchor.href = "/work/nezus-bisuteria"
      if (absolute.origin === location.origin && absolute.pathname === "/work/surface-tension") anchor.href = "/work/soluciones-empresariales"

      const serviceRoutes = {
        "/thoughts/beyond-ai-aesthetics-what-human-led-digital-art-means-now": "/services/desarrollo-web",
        "/thoughts/when-images-begin-to-listen-the-quiet-power-of-responsive-art": "/services/inteligencia-artificial",
        "/thoughts/the-rise-of-experiential-minimalism-in-contemporary-exhibitions": "/services/desarrollo-full-stack",
        "/thoughts/why-motion-first-art-is-defining-the-next-creative-era": "/services/software-empresarial",
        "/thoughts/why-slowness-is-becoming-a-radical-artistic-choice": "/services/integraciones-sunat",
      }
      if (absolute.origin === location.origin && serviceRoutes[absolute.pathname]) anchor.href = serviceRoutes[absolute.pathname]

      if (["https://www.vimeo.com/", "https://vimeo.com/"].includes(absolute.href)) {
        anchor.href = CONTACT_URL
        anchor.target = "_blank"
        anchor.rel = "noopener noreferrer"
        anchor.setAttribute("aria-label", "WhatsApp")
      } else if (["https://www.youtube.com/", "https://youtube.com/"].includes(absolute.href)) {
        anchor.href = EMAIL_URL
        anchor.removeAttribute("target")
        anchor.setAttribute("aria-label", "Correo electrónico")
      } else if (["instagram.com", "www.instagram.com", "linkedin.com", "www.linkedin.com", "github.com", "www.github.com", "tiktok.com", "www.tiktok.com", "x.com", "www.x.com"].includes(absolute.hostname)) {
        // Keep the complete five-icon footer rhythm from the reference while
        // avoiding links to the template author's personal profiles.
        anchor.hidden = false
        anchor.removeAttribute("aria-hidden")
        anchor.removeAttribute("tabindex")
        anchor.href = "/contact"
      }
    }

    for (const logo of document.querySelectorAll('[data-framer-name="Logo"]')) {
      logo.classList.add("jcar-logo-lockup")
      const image = logo.querySelector("img")
      if (image) image.alt = "JCAR Labs Inc."
    }
  }

  function restoreHomeComposition() {
    if (location.pathname !== "/") return
    for (const section of document.querySelectorAll("main section[data-framer-name]")) {
      section.hidden = false
    }

    const processSection = document.querySelector('main section[data-framer-name="Section 4 - Process"]')
    const processBackground = processSection?.querySelector('[data-framer-name="BG Image"]')
    const processVideos = processSection ? [...processSection.querySelectorAll("video")] : []
    const fallbackVideo = processVideos.find((video) => video.hasAttribute("data-jcar-process-video"))
    const framerVideo = processVideos.find((video) => !video.hasAttribute("data-jcar-process-video"))
    if (framerVideo && fallbackVideo) fallbackVideo.remove()
    else if (processBackground && !framerVideo && !fallbackVideo) {
      const processVideo = document.createElement("video")
      processVideo.dataset.jcarProcessVideo = "true"
      processVideo.className = "jcar-process-video"
      processVideo.src = "/assets/videos/video-overlay-video-3.mp4"
      processVideo.poster = "/assets/images/bg-image-28.jpeg"
      processVideo.preload = "auto"
      processVideo.setAttribute("aria-hidden", "true")
      processVideo.tabIndex = -1
      processBackground.append(processVideo)
    }

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!homeVideoObserver && !reduceMotion) {
      homeVideoObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const video = entry.target
          if (entry.isIntersecting) video.play().catch(() => {})
          else video.pause()
        }
      }, { threshold: 0.08 })
    }

    for (const video of document.querySelectorAll("main video")) {
      video.muted = true
      video.loop = true
      video.playsInline = true
      video.autoplay = !reduceMotion
      if (reduceMotion) video.pause()
      else if (!video.dataset.jcarPlaybackObserved) {
        video.dataset.jcarPlaybackObserved = "true"
        homeVideoObserver.observe(video)
      }
    }
  }

  function renderAboutSection() {
    if (location.pathname !== "/") return
    const section = document.querySelector('main section[data-framer-name="Section 11 - About"]')
    if (!section) return
    section.id = "about-me"
    section.classList.add("jcar-about")
    if (section.dataset.jcarAboutRendered === "true") return
    section.dataset.jcarAboutRendered = "true"
    section.innerHTML = `
      <div class="jcar-about__grid">
        <div class="jcar-about__identity" data-jcar-reveal>
          <p class="jcar-about__display">SOMOS</p>
          <h2>JCAR LABS INC.</h2>
          <p class="jcar-about__meta">DESARROLLAMOS PRODUCTOS DIGITALES<br>DE PRINCIPIO A FIN.</p>
          <div class="jcar-about__signature" aria-label="JCAR Labs">JCL / 2026</div>
          <p class="jcar-about__role">DISEÑO · SOFTWARE · INTELIGENCIA ARTIFICIAL</p>
          <blockquote>“LA TECNOLOGÍA ES ÚTIL CUANDO RESUELVE ALGO REAL.”<cite>— JCAR LABS INC.</cite></blockquote>
        </div>
        <div class="jcar-about__work" data-jcar-reveal>
          <figure class="jcar-about__portrait">
            <img class="jcar-about__portrait-base" src="/assets/images/adam-knoxville.jpg" alt="Retrato editorial de JCAR Labs Inc.">
            <img class="jcar-about__portrait-layer jcar-about__portrait-layer--one" src="/assets/images/adam-knoxville.jpg" alt="" aria-hidden="true">
            <img class="jcar-about__portrait-layer jcar-about__portrait-layer--two" src="/assets/images/adam-knoxville.jpg" alt="" aria-hidden="true">
          </figure>
          <h3>CREAMOS SOFTWARE, WEB, SISTEMAS E IA.</h3>
          <p>CADA PROYECTO PARTE DE UNA NECESIDAD REAL. LA ESTRATEGIA DEFINE EL SIGUIENTE PASO.</p>
          <span class="jcar-about__rule" aria-hidden="true"></span>
        </div>
        <div class="jcar-about__profile" data-jcar-reveal>
          <p class="jcar-about__statement">SOMOS UN EQUIPO DIGITAL. TRABAJAMOS CON ESTRATEGIA, SISTEMAS E ITERACIÓN. ALGUNAS IDEAS SE RESUELVEN RÁPIDO; OTRAS EVOLUCIONAN CON EL NEGOCIO.</p>
          <p class="jcar-about__label">LO QUE HACEMOS</p>
          <ul>
            <li>DESARROLLO WEB</li>
            <li>SOFTWARE A MEDIDA</li>
            <li>INTELIGENCIA ARTIFICIAL</li>
            <li>AUTOMATIZACIÓN</li>
            <li>DESARROLLO FULL STACK</li>
            <li>INTEGRACIONES SUNAT</li>
            <li>UX/UI</li>
            <li>SISTEMAS EMPRESARIALES</li>
          </ul>
          <a href="/work">VER PROYECTOS <span aria-hidden="true">↗</span></a>
        </div>
      </div>`

    if (location.hash === "#about-me" && section.dataset.jcarHashAligned !== "true") {
      section.dataset.jcarHashAligned = "true"
      requestAnimationFrame(() => requestAnimationFrame(() => section.scrollIntoView({ block: "start" })))
    }
  }

  function hideUnconfirmedCards() {
    const paths = [
      "/work/fragile-perfection",
      "/work/silent-gravity",
      "/thoughts/why-motion-first-art-is-defining-the-next-creative-era",
      "/thoughts/why-slowness-is-becoming-a-radical-artistic-choice",
    ]
    for (const anchor of document.querySelectorAll("a[href]")) {
      const pathname = new URL(anchor.href, location.href).pathname
      if (!paths.includes(pathname)) continue
      anchor.hidden = true
      anchor.setAttribute("aria-hidden", "true")
      anchor.tabIndex = -1
    }
  }

  function configureContactForm() {
    for (const form of document.forms) {
      const visibleFields = [...form.querySelectorAll('input:not([type="hidden"]):not([aria-hidden="true"]), textarea:not([aria-hidden="true"])')]
      const [name, email, message] = visibleFields
      if (name) {
        name.placeholder = "Nombre"
        name.setAttribute("aria-label", "Nombre")
        name.autocomplete = "name"
      }
      if (email) {
        email.placeholder = "Correo electrónico"
        email.setAttribute("aria-label", "Correo electrónico")
        email.autocomplete = "email"
      }
      if (message) {
        message.placeholder = "Cuéntanos sobre tu proyecto"
        message.setAttribute("aria-label", "Cuéntanos sobre tu proyecto")
      }
      if (form.dataset.jcarConfigured) continue
      form.dataset.jcarConfigured = "true"
      form.addEventListener("submit", (event) => {
        event.preventDefault()
        if (!form.reportValidity()) return
        const text = `Hola JCAR Labs, soy ${name?.value || ""}. Mi correo es ${email?.value || ""}. ${message?.value || "Quiero conversar sobre un proyecto."}`
        window.open(`${CONTACT_URL}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer")
      })
    }
  }

  function shouldUseJcarHeader() {
    const path = location.pathname.replace(/\/$/, "") || "/"
    return path === "/work" || path.startsWith("/work/") ||
      path === "/services" || path.startsWith("/services/") ||
      path === "/contact" || (path === "/" && location.hash === "#about-me")
  }

  function renderSiteHeader() {
    const shouldRender = shouldUseJcarHeader()
    let header = document.querySelector("[data-jcar-site-header]")

    if (!shouldRender) {
      header?.remove()
      document.documentElement.classList.remove("has-jcar-site-header")
      return
    }

    document.documentElement.classList.add("has-jcar-site-header")
    if (header) return

    header = document.createElement("header")
    header.className = "jcar-site-header"
    header.dataset.jcarSiteHeader = "true"
    header.innerHTML = `
      <a class="jcar-site-header__logo" href="/" aria-label="JCAR Labs — Inicio">JCARLABS</a>
      <button class="jcar-site-header__toggle" type="button" aria-expanded="false" aria-controls="jcar-site-menu">
        <span></span><span></span><span></span><span class="sr-only">Abrir menu</span>
      </button>
      <nav class="jcar-site-header__nav" id="jcar-site-menu" aria-label="Navegacion principal">
        <a href="/work">PROYECTOS</a>
        <a href="/#about-me">NOSOTROS</a>
        <a href="/services">SERVICIOS</a>
        <a href="/contact">CONTACTO</a>
      </nav>
      <span class="jcar-site-header__progress" aria-hidden="true"></span>`

    const activePath = location.pathname.replace(/\/$/, "") || "/"
    for (const anchor of header.querySelectorAll("nav a")) {
      const target = new URL(anchor.href, location.href)
      const active = target.hash === "#about-me"
        ? activePath === "/" && location.hash === "#about-me"
        : activePath === target.pathname || activePath.startsWith(`${target.pathname}/`)
      if (active) anchor.setAttribute("aria-current", "page")
    }

    const toggle = header.querySelector("button")
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("is-menu-open")
      toggle.setAttribute("aria-expanded", String(open))
    })
    header.querySelectorAll("a").forEach((anchor) => anchor.addEventListener("click", () => header.classList.remove("is-menu-open")))

    document.body.prepend(header)
    requestAnimationFrame(() => header.classList.add("is-ready"))

    if (!headerScrollBound) {
      headerScrollBound = true
      addEventListener("scroll", () => {
        const current = document.querySelector("[data-jcar-site-header]")
        if (!current || editorialMotionFrame) return
        editorialMotionFrame = requestAnimationFrame(() => {
          const maximum = Math.max(1, document.documentElement.scrollHeight - innerHeight)
          current.style.setProperty("--jcar-scroll", String(Math.min(1, scrollY / maximum)))
          current.style.setProperty("--jcar-header-shift", `${Math.min(18, scrollY * 0.035)}px`)
          editorialMotionFrame = 0
        })
      }, { passive: true })
    }
  }

  function renderContactPage() {
    if (location.pathname.replace(/\/$/, "") !== "/contact") return
    for (const main of document.querySelectorAll("main:not([data-jcar-contact])")) main.hidden = true
    for (const footer of document.querySelectorAll("footer")) footer.hidden = true
    if (document.querySelector("[data-jcar-contact]")) return

    const main = document.createElement("main")
    main.dataset.jcarContact = "true"
    main.className = "jcar-contact"
    main.innerHTML = `
      <section class="jcar-contact__hero" data-jcar-reveal>
        <div class="jcar-contact__hero-copy">
          <p>JCAR LABS INC. / CONTACTO</p>
          <h1>HABLEMOS DE TU PRÓXIMO PROYECTO.</h1>
          <div><span>ESTRATEGIA</span><span>DISEÑO</span><span>SOFTWARE</span><span>IA</span></div>
        </div>
        <figure aria-hidden="true"><span>INICIAR / 2026</span></figure>
      </section>
      <section class="jcar-contact__manifesto" data-jcar-reveal>
        <p>CONTACTO / 01</p>
        <h2>CONSTRUYAMOS ALGO QUE RESUELVA UNA NECESIDAD REAL.</h2>
        <div class="jcar-contact__manifesto-grid">
          <p>CUÉNTANOS QUÉ QUIERES CREAR, MEJORAR O AUTOMATIZAR. DEFINIREMOS EL SIGUIENTE PASO CON CLARIDAD.</p>
          <a href="${CONTACT_URL}" target="_blank" rel="noopener noreferrer">CONVERSAR POR WHATSAPP <span>↗</span></a>
        </div>
      </section>
      <section class="jcar-contact__form-section" data-jcar-reveal>
        <div class="jcar-contact__form-intro">
          <p>CONTACTO / 02</p>
          <h2>EMPECEMOS.</h2>
          <address>
            <a href="mailto:contacto@jcarlabs.com">contacto@jcarlabs.com</a>
            <a href="tel:+51904615337">+51 904 615 337</a>
            <span>PERÚ · TRABAJO REMOTO</span>
          </address>
        </div>
        <form class="jcar-contact__form" aria-label="Formulario de contacto">
          <label><span>01 / NOMBRE</span><input name="name" type="text" required autocomplete="name" placeholder="Tu nombre"></label>
          <label><span>02 / CORREO</span><input name="email" type="email" required autocomplete="email" placeholder="tu@correo.com"></label>
          <label><span>03 / PROYECTO</span><textarea name="message" required rows="4" placeholder="Cuéntanos qué necesitas construir"></textarea></label>
          <button type="submit">ENVIAR MENSAJE <span>→</span></button>
        </form>
      </section>
      <section class="jcar-contact__footer" data-jcar-reveal>
        <div class="jcar-contact__ticks" aria-hidden="true"></div>
        <p class="jcar-contact__wordmark">JCAR LABS</p>
        <div class="jcar-contact__directory">
          <div><strong>JCAR LABS INC.</strong><span>PRODUCTOS DIGITALES · SOFTWARE · IA</span></div>
          <nav aria-label="Navegación del pie"><a href="/">INICIO</a><a href="/work">PROYECTOS</a><a href="/#about-me">NOSOTROS</a><a href="/services">SERVICIOS</a></nav>
          <div><a href="${CONTACT_URL}" target="_blank" rel="noopener noreferrer">WHATSAPP</a><a href="${EMAIL_URL}">CORREO</a></div>
        </div>
        <small>© 2026 JCAR LABS INC. TODOS LOS DERECHOS RESERVADOS.</small>
      </section>`
    const header = document.querySelector("[data-jcar-site-header]")
    if (header) header.after(main)
    else document.body.prepend(main)
  }

  function setupEditorialMotion() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const selectors = [
      ".jcar-work-card__visual",
      ".jcar-service-card__visual img",
      ".jcar-detail__media",
      ".jcar-service-detail__overview figure img",
      ".jcar-about__portrait-layer",
    ]
    const motionElements = document.querySelectorAll(selectors.join(","))
    for (const element of motionElements) {
      if (element.dataset.jcarMotionBound === "true") continue
      element.dataset.jcarMotionBound = "true"
      const host = element.closest("a, figure, section") || element
      host.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return
        const rect = host.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2
        const y = ((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2
        element.style.setProperty("--jcar-pointer-x", x.toFixed(3))
        element.style.setProperty("--jcar-pointer-y", y.toFixed(3))
      }, { passive: true })
      host.addEventListener("pointerleave", () => {
        element.style.setProperty("--jcar-pointer-x", "0")
        element.style.setProperty("--jcar-pointer-y", "0")
      }, { passive: true })
    }

    if (document.documentElement.dataset.jcarParallaxBound === "true") return
    document.documentElement.dataset.jcarParallaxBound = "true"
    let frame = 0
    const update = () => {
      frame = 0
      for (const element of document.querySelectorAll(selectors.join(","))) {
        const rect = element.getBoundingClientRect()
        if (rect.bottom < -120 || rect.top > innerHeight + 120) continue
        const center = rect.top + rect.height / 2
        const offset = Math.max(-1, Math.min(1, (center - innerHeight / 2) / innerHeight))
        element.style.setProperty("--jcar-parallax-y", `${(-offset * 18).toFixed(2)}px`)
      }
    }
    const scheduleMotion = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }
    addEventListener("scroll", scheduleMotion, { passive: true })
    addEventListener("resize", scheduleMotion, { passive: true })
    scheduleMotion()
  }

  function renderDetailPage() {
    const detail = detailPages[location.pathname.replace(/\/$/, "")]
    if (!detail) return
    for (const main of document.querySelectorAll("main:not([data-jcar-detail])")) main.hidden = true
    if (document.querySelector("[data-jcar-detail]")) return

    const isService = location.pathname.startsWith("/services/")
    const main = document.createElement("main")
    main.dataset.jcarDetail = "true"
    main.className = `jcar-detail ${isService ? "jcar-detail--service" : "jcar-detail--project"}`
    const siblingItems = listingPages[isService ? "/services" : "/work"].items.filter((item) => item.href !== location.pathname)
    const currentItem = listingPages[isService ? "/services" : "/work"].items.find((item) => item.href === location.pathname)
    const editorialSections = isService
      ? [
          ["01 / ENFOQUE", "ESTRATEGIA ANTES QUE TECNOLOGÍA", `Comenzamos entendiendo el objetivo, el usuario y el contexto operativo. ${detail.description}`],
          ["02 / CONSTRUCCIÓN", "DISEÑO, IMPLEMENTACIÓN Y PRUEBAS", `Convertimos el alcance en una solución usable, mantenible y preparada para evolucionar. Trabajamos con ${detail.tags.join(", ")}.`],
          ["03 / EVOLUCIÓN", "UN PRODUCTO QUE PUEDE CRECER", "Publicamos con una base sólida, medimos el funcionamiento y priorizamos las siguientes mejoras con criterio de negocio."],
        ]
      : [
          ["03 / CONTEXTO", "UNA NECESIDAD REAL CONVERTIDA EN PRODUCTO", detail.description],
          ["04 / ENFOQUE", "CLARIDAD, CONTROL Y ESCALABILIDAD", "La solución se planteó desde los flujos esenciales, reduciendo fricción y organizando la información alrededor del trabajo cotidiano."],
          ["05 / RETO", "UNIFICAR PROCESOS SIN AÑADIR COMPLEJIDAD", "El reto fue transformar distintas necesidades operativas en una experiencia coherente, clara y preparada para crecer."],
          ["06 / SOLUCIÓN", "ARQUITECTURA Y EXPERIENCIA COMO UN SOLO SISTEMA", `Diseño, desarrollo e integración se trabajaron en conjunto mediante ${detail.tags.join(", ")}.`],
          ["07 / RESULTADO", "UNA BASE DIGITAL LISTA PARA EVOLUCIONAR", "El producto centraliza la operación principal y ofrece una estructura mantenible para incorporar nuevas capacidades."],
        ]

    main.innerHTML = isService ? `
      <section class="jcar-service-detail__header" data-jcar-reveal>
        <aside>
          <a class="jcar-service-detail__back" href="/services">← SERVICIOS</a>
          <img src="${currentItem?.avatar || "/assets/images/adam-knoxville.jpg"}" alt="Equipo de JCAR Labs Inc.">
          <p>DESARROLLADO POR<br><strong>JCAR LABS INC.</strong></p>
          <div aria-hidden="true"></div>
        </aside>
        <div class="jcar-service-detail__headline">
          <p>SERVICIO ${currentItem?.number || "01"} · 2026</p>
          <h1>${detail.title}</h1>
          <span aria-hidden="true"></span>
          <h2>${detail.lead}</h2>
          <small>ALCANCE · ${detail.tags.join(" · ")}</small>
        </div>
      </section>
      <section class="jcar-service-detail__overview" data-jcar-reveal>
        <div class="jcar-service-detail__overview-copy">
          <p>01 / VISIÓN GENERAL</p>
          <h2>TECNOLOGÍA DISEÑADA PARA RESOLVER ALGO REAL.</h2>
          <p>${detail.description}</p>
        </div>
        <figure><img src="${currentItem?.image || "/assets/images/bg-image-28.jpeg"}" alt="${detail.title}" loading="lazy"></figure>
      </section>
      <section class="jcar-service-detail__article" data-jcar-reveal>
        <p>02 / CÓMO TRABAJAMOS</p>
        <h2>ESTRATEGIA, CONSTRUCCIÓN Y EVOLUCIÓN.</h2>
        <div>
          ${editorialSections.map(([label, title, copy]) => `<article><span>${label}</span><h3>${title}</h3><p>${copy}</p></article>`).join("")}
        </div>
      </section>
      <section class="jcar-service-detail__summary" data-jcar-reveal>
        <p>03 / SIGUIENTE PASO</p>
        <h2>LISTO PARA CONSTRUIR ${detail.title}.</h2>
        <div><p>${detail.lead}</p><a href="${CONTACT_URL}" target="_blank" rel="noopener noreferrer">HABLEMOS DE TU PROYECTO →</a></div>
      </section>
      <section class="jcar-service-detail__more" data-jcar-reveal>
        <h2>MÁS SERVICIOS</h2>
        <div>${siblingItems.map((item) => `<a href="${item.href}"><span>${item.number}</span><strong>${item.title}</strong><i>↗</i></a>`).join("")}</div>
      </section>` : `
      <section class="jcar-detail__hero jcar-panel jcar-detail__hero--media" data-jcar-reveal style="--jcar-detail-media:url('${detail.media?.[0] || "/assets/images/bg-image-28.jpeg"}')">
        <a class="jcar-detail__back" href="${location.pathname.startsWith("/services/") ? "/services" : "/work"}">← Volver</a>
        <p class="jcar-detail__kicker">${detail.kicker}</p>
        <h1>${detail.title}</h1>
        <p class="jcar-detail__lead">${detail.lead}</p>
        <div class="jcar-detail__index">JCL / 2026</div>
      </section>
      <section class="jcar-detail__intro jcar-panel jcar-panel--light" data-jcar-reveal>
        <p class="jcar-detail__eyebrow">PROYECTO / JCAR LABS</p>
        <h2>${detail.lead}</h2>
        <div class="jcar-detail__intro-grid">
          <p>${detail.description}</p>
          <ul>${detail.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
        </div>
      </section>
      ${editorialSections.map(([label, title, copy], index) => `
        <section class="jcar-detail__chapter jcar-panel jcar-panel--media${index % 2 ? " jcar-panel--lime" : ""}" data-jcar-reveal>
          <p class="jcar-detail__eyebrow">${label}</p>
          <h2>${title}</h2>
          <p class="jcar-detail__chapter-copy">${copy}</p>
          <div class="jcar-detail__media" aria-hidden="true" style="--jcar-detail-media:url('${detail.media?.[index % detail.media.length] || "/assets/images/bg-image-28.jpeg"}')"></div>
          <span class="jcar-detail__chapter-number" aria-hidden="true">0${index + 1}</span>
        </section>`).join("")}
      <section class="jcar-detail__final jcar-panel" data-jcar-reveal>
        <p class="jcar-detail__eyebrow">PRODUCTO FINAL</p>
        <h2>${detail.title}</h2>
        <p>${detail.lead}</p>
        <a class="jcar-detail__cta" href="${CONTACT_URL}" target="_blank" rel="noopener noreferrer">Hablemos de tu proyecto →</a>
      </section>
      <section class="jcar-detail__share" data-jcar-reveal>
        <p>MÁS PROYECTOS</p>
      </section>
      <section class="jcar-detail__related" data-jcar-reveal>
        ${siblingItems.map((item) => `<a href="${item.href}"><span>${item.number}</span><strong>${item.title}</strong><span>↗</span></a>`).join("")}
      </section>`
    const footer = document.querySelector("footer")
    if (footer) footer.before(main)
    else document.body.append(main)
  }

  function renderLegalPage() {
    const path = location.pathname.replace(/\/$/, "") || "/"
    const legal = legalPages[path]
    if (!legal && path !== "/404") return
    for (const main of document.querySelectorAll("main:not([data-jcar-legal]):not([data-jcar-not-found])")) main.hidden = true

    if (path === "/404") {
      if (document.querySelector("[data-jcar-not-found]")) return
      const main = document.createElement("main")
      main.dataset.jcarNotFound = "true"
      main.className = "jcar-not-found"
      main.innerHTML = `
        <section data-jcar-reveal>
          <p>JCL / ERROR</p>
          <strong aria-hidden="true">404</strong>
          <h1>Esta página no existe.</h1>
          <a href="/">Volver al inicio →</a>
        </section>`
      const footer = document.querySelector("footer")
      if (footer) footer.before(main)
      else document.body.append(main)
      return
    }

    if (document.querySelector("[data-jcar-legal]")) return
    const main = document.createElement("main")
    main.dataset.jcarLegal = "true"
    main.className = "jcar-legal"
    main.innerHTML = `
      <section class="jcar-legal__hero" data-jcar-reveal>
        <p>${legal.kicker}</p>
        <h1>${legal.title}</h1>
        <div><span>${legal.updated}</span><strong>JCL / 2026</strong></div>
        <p>${legal.lead}</p>
      </section>
      <section class="jcar-legal__content" aria-label="${legal.title}">
        ${legal.sections.map(([number, title, copy]) => `
          <article data-jcar-reveal>
            <span>${number}</span>
            <h2>${title}</h2>
            <p>${copy}</p>
          </article>`).join("")}
      </section>`
    const footer = document.querySelector("footer")
    if (footer) footer.before(main)
    else document.body.append(main)
  }

  function renderListingPage() {
    const listing = listingPages[location.pathname.replace(/\/$/, "")]
    if (!listing) return
    for (const main of document.querySelectorAll("main:not([data-jcar-list])")) main.hidden = true
    if (document.querySelector("[data-jcar-list]")) return

    const main = document.createElement("main")
    main.dataset.jcarList = "true"
    const isServices = location.pathname.replace(/\/$/, "") === "/services"
    main.className = `jcar-list${isServices ? " jcar-services" : ""}`
    main.innerHTML = isServices ? `
      <section class="jcar-services__header" data-jcar-reveal>
        <div class="jcar-services__title">
          <h1>SERVICIOS</h1>
          <div class="jcar-services__index"><span aria-hidden="true">✣</span><strong>CAPACIDADES DIGITALES</strong><i></i></div>
        </div>
        <div class="jcar-services__statement">
          <h2>TECNOLOGÍA QUE HACE CRECER NEGOCIOS.</h2>
        </div>
      </section>
      <section class="jcar-services__cards" aria-label="Servicios">
        ${listing.items.map((item) => `
          <a class="jcar-service-card" href="${item.href}" data-jcar-service-card>
            <div class="jcar-service-card__content">
              <p class="jcar-service-card__date">SERVICIO ${item.number} · 2026</p>
              <h2>${item.title}</h2>
              <span class="jcar-service-card__line" aria-hidden="true"></span>
              <p class="jcar-service-card__description"><span class="sr-only">${escapeHTML(item.description)}</span><span class="jcar-service-card__letters" aria-hidden="true">${animatedLetters(item.description)}</span></p>
              <div class="jcar-service-card__author">
                <span><img src="${item.avatar}" alt="" loading="lazy"></span>
                <p>POR<br><strong>JCAR LABS INC.</strong></p>
                <i aria-hidden="true">↗</i>
              </div>
            </div>
            <div class="jcar-service-card__visual" aria-hidden="true"><img src="${item.image}" alt="" loading="lazy" decoding="async"><span>${item.tags}</span></div>
          </a>`).join("")}
      </section>` : `
      <section class="jcar-work-list" aria-label="${listing.title}">
        ${listing.items.map((item) => `
          <a class="jcar-work-card" href="${item.href}" data-jcar-reveal>
            <div class="jcar-work-card__content">
              <p class="jcar-work-card__eyebrow">(PROYECTO)</p>
              <h2>${item.title}</h2>
              <p class="jcar-work-card__description">${item.description}</p>
              <div class="jcar-work-card__meta"><strong>${item.client}</strong><span>${item.category}</span><small>${item.date}</small></div>
            </div>
            <div class="jcar-work-card__ticks" aria-hidden="true"></div>
            <div class="jcar-work-card__visual" aria-hidden="true" style="--jcar-work-image:url('${item.image}')"><span>JCL / ${item.number}</span></div>
          </a>`).join("")}
      </section>`
    const footer = document.querySelector("footer")
    if (footer) footer.before(main)
    else document.body.append(main)
  }

  function renderServicesFooter() {
    if (location.pathname.replace(/\/$/, "") !== "/services") return
    const footer = document.querySelector("footer")
    if (!footer || footer.dataset.jcarServicesFooter === "true") return
    footer.dataset.jcarServicesFooter = "true"
    footer.className = "jcar-services-footer"
    footer.innerHTML = `
      <div class="jcar-services-footer__ticks" aria-hidden="true"></div>
      <p class="jcar-services-footer__name">JCAR LABS INC.</p>
      <div class="jcar-services-footer__directory">
        <div><strong>+51 904 615 337</strong><a href="mailto:contacto@jcarlabs.com">contacto@jcarlabs.com</a></div>
        <div><strong>JCAR LABS</strong><p>PRODUCTOS DIGITALES<br>SOFTWARE · WEB · IA<br>PERÚ</p></div>
        <nav aria-label="Navegación del pie">
          <a href="/">INICIO</a><a href="/work">PROYECTOS</a><a href="/#about-me">NOSOTROS</a><a href="/services">SERVICIOS</a><a href="/contact">CONTACTO</a><a href="/privacy-policy">PRIVACIDAD</a><a href="/terms-of-use">TÉRMINOS</a>
        </nav>
        <div><a href="${CONTACT_URL}" target="_blank" rel="noopener noreferrer">WHATSAPP</a><a href="${EMAIL_URL}">CORREO</a></div>
      </div>
      <p class="jcar-services-footer__wordmark">JCAR LABS</p>
      <div class="jcar-services-footer__bottom"><span>© 2026 JCAR LABS INC. TODOS LOS DERECHOS RESERVADOS.</span><a href="#top" aria-label="Volver arriba">↑</a></div>`
  }

  function restoreOriginalFramerTree() {
    document.documentElement.classList.remove("has-jcar-site-header")

    for (const element of document.querySelectorAll([
      "[data-jcar-site-header]",
      "[data-jcar-contact]",
      "[data-jcar-list]",
      "[data-jcar-detail]",
      "[data-jcar-legal]",
      "[data-jcar-not-found]",
    ].join(","))) {
      element.remove()
    }

    for (const element of document.querySelectorAll("main[hidden], footer[hidden]")) {
      element.hidden = false
    }

    const about = document.querySelector('main section[data-framer-name="Section 11 - About"]')
    if (about) about.id = "about-me"
  }

  function setupRevealAnimations() {
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!revealObserver && !reduceMotion) {
      revealObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            revealObserver.unobserve(entry.target)
          }
        }
      }, { threshold: 0.12 })
    }
    for (const element of document.querySelectorAll("[data-jcar-reveal]")) {
      if (reduceMotion) element.classList.add("is-visible")
      else if (!element.dataset.jcarRevealObserved) {
        element.dataset.jcarRevealObserved = "true"
        revealObserver.observe(element)
      }
    }
  }

  function setupServiceCardAnimations() {
    const cards = document.querySelectorAll("[data-jcar-service-card]")
    if (!cards.length) return
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!serviceCardObserver && !reduceMotion) {
      serviceCardObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add("is-active")
          serviceCardObserver.unobserve(entry.target)
        }
      }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" })
    }
    for (const card of cards) {
      if (reduceMotion) card.classList.add("is-active")
      else if (!card.dataset.jcarServiceObserved) {
        card.dataset.jcarServiceObserved = "true"
        serviceCardObserver.observe(card)
      }
    }
  }

  function setupMetadataGuard() {
    const routeTitles = {
      "/": "JCAR Labs Inc. — Ingeniería de Software, SaaS e IA",
      "/work": "Proyectos — JCAR Labs Inc.",
      "/services": "Servicios — JCAR Labs Inc.",
      "/contact": "Contacto — JCAR Labs Inc.",
      "/privacy-policy": "Política de privacidad — JCAR Labs Inc.",
      "/terms-of-use": "Términos de uso — JCAR Labs Inc.",
    }
    const configured = detailPages[location.pathname]?.title
    const expected = configured
      ? `${configured} — JCAR Labs Inc.`
      : routeTitles[location.pathname] || document.title.replace(/Adam Knoxville|Vertical — Editorial-Style Portfolio/gi, "JCAR Labs Inc.")
    const enforce = () => {
      if (document.title !== expected) document.title = expected
    }
    enforce()
    if (!metadataObserver) {
      metadataObserver = new MutationObserver(enforce)
      metadataObserver.observe(document.head, { childList: true, subtree: true, characterData: true })
    }
  }

  function applyBrand() {
    document.documentElement.lang = "es"
    setupMetadataGuard()

    if (RESTORATION_MODE) {
      restoreOriginalFramerTree()
      restoreHomeComposition()
      replaceCompositeText()
      adaptDetailCopy()
      restoreEditorialEmphasis()
      updateNavigationAndLinks()
      configureContactForm()
      applyCorporateCopy()
      return
    }

    restoreHomeComposition()
    replaceCompositeText()
    restoreEditorialEmphasis()
    renderAboutSection()
    renderSiteHeader()
    updateNavigationAndLinks()
    hideUnconfirmedCards()
    renderContactPage()
    configureContactForm()
    renderLegalPage()
    renderListingPage()
    renderDetailPage()
    renderServicesFooter()
    setupRevealAnimations()
    setupServiceCardAnimations()
    setupEditorialMotion()
  }

  let scheduled = false
  const schedule = () => {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(() => {
      scheduled = false
      applyBrand()
    })
  }

  const startBranding = () => {
    setupMetadataGuard()
    if (RESTORATION_MODE) {
      const main = document.querySelector("#main")
      const hydrationExpected = main?.hasAttribute("data-framer-hydrate-v2")
      if (!hydrationExpected) {
        applyBrand()
        return
      }

      // Wait until Framer has committed its hydrated component tree. Mutating
      // the server-rendered tree sooner creates React mismatches and can tear
      // down CMS pages after their entrance animation.
      let attempts = 0
      const hydrationTimer = setInterval(() => {
        attempts += 1
        const hydrated = Boolean(main.querySelector(":scope > style"))
        if (!hydrated && attempts < 120) return
        clearInterval(hydrationTimer)
        requestAnimationFrame(() => requestAnimationFrame(applyBrand))
      }, 100)
      return
    }

    const initialDelay = document.documentElement.classList.contains("jcar-interactive-page") || document.documentElement.classList.contains("jcar-static-page") ? 0 : 2200
    setTimeout(() => {
      applyBrand()
      new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true })
    }, initialDelay)
    setTimeout(applyBrand, 3600)
    setTimeout(applyBrand, 5200)
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startBranding, { once: true })
  } else {
    startBranding()
  }
  if (RESTORATION_MODE) {
    // Route changes reload the corresponding exported Framer document. This
    // prevents React from reconciling a page whose copy was adapted to JCAR.
    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target.closest("a[href]")
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return
      const url = new URL(anchor.href, location.href)
      if (url.origin !== location.origin) return
      if (url.pathname === location.pathname && url.search === location.search) return
      event.preventDefault()
      location.assign(url.href)
    }, true)
    addEventListener("hashchange", () => setTimeout(applyBrand, 50))
  } else {
    addEventListener("hashchange", schedule)
  }
})()
