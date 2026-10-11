// Regenerate memofun/dev/index.html with the public page's 2-level
// structure (H2 course + H3 subject) — but every course/subject activated.
// The public index renders course > subject > topic groups > decks; here we
// stop at the subject level and link each subject card to the public page
// at ?course=X&subject=Y (which triggers renderTopicLevel). Topic groups
// (Tema N · ...) and individual decks are NOT shown — the public app
// renders them on click. This matches what users see when they navigate
// the live site, but with everything unlocked.
//
// Inputs: decks/manifest.json (the source of truth for courses/subjects).
// Outputs: dev/index.html (overwrites the previous 3-level expansion).
//
// Run from the memofun repo root: node scripts/one-off/regen-dev-index.js

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const MANIFEST = path.join(ROOT, 'decks', 'manifest.json');
const OUT = path.join(ROOT, 'dev', 'index.html');

// Subject -> emoji icon. Sourced from the previous 3-level /dev/ so the
// look stays consistent. Order of fallbacks is "specific name first,
// generic name last".
const ICONS = {
  'Aplicaciones Básicas de Ofimática': '💻',
  'Archivo y Comunicación': '📁',
  'Atención al Cliente': '🤝',
  'Banderas del Mundo': '🏳️',
  'Biología y Geología': '🧬',
  'Capitales del Mundo': '🏛️',
  'Ciencias Aplicadas': '🔬',
  'Ciencias Naturales': '🌿',
  'Ciencias Sociales': '🌍',
  'Ciudades Importantes': '🌆',
  'Comunicación Empresarial y Atención al Cliente': '📞',
  'Continentes y Océanos': '🗺️',
  'Digitalización Aplicada a los Sectores Productivos': '💻',
  'Empresa en el Aula': '🏫',
  'Empresa y Administración': '🏢',
  'Física y Química': '⚗️',
  'Geografía Física': '🏔️',
  'Geografía e Historia': '🌍',
  'Itinerario Personal para la Empleabilidad': '🧭',
  'Itinerario Personal para la Empleabilidad I': '🧭',
  'Itinerario Personal para la Empleabilidad II': '🧭',
  'Lengua Castellana': '📖',
  'Operaciones Administrativas de Compraventa': '🛒',
  'Operaciones Administrativas de Recursos Humanos': '👥',
  'Operaciones Auxiliares de Gestión de Tesorería': '💰',
  'Preparación de Pedidos y Venta de Productos': '🛒',
  'Récords y Curiosidades': '🏆',
  'Sostenibilidad Aplicada al Sistema Productivo': '🌱',
  'Técnica Contable': '📊',
  'Técnicas Administrativas Básicas': '🏢',
  'Tratamiento de la Documentación Contable': '📊',
  'Tratamiento Informático de Datos': '💻',
  'Tratamiento Informático de la Información': '💻'
};

// Course order: keep manifest's natural order (it groups stages cleanly).
function loadManifest() {
  const raw = fs.readFileSync(MANIFEST, 'utf8');
  return JSON.parse(raw);
}

function groupByCourse(entries) {
  const courses = new Map();
  for (const e of entries) {
    if (!courses.has(e.course)) courses.set(e.course, new Map());
    const subjects = courses.get(e.course);
    if (!subjects.has(e.subject)) {
      subjects.set(e.subject, { total: 0, topicGroups: new Set() });
    }
    const s = subjects.get(e.subject);
    s.total++;
    if (e.topicGroup) s.topicGroups.add(e.topicGroup);
  }
  return courses;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function encodeQuery(course, subject) {
  const params = new URLSearchParams({ course });
  if (subject) params.set('subject', subject);
  return params.toString().replace(/\+/g, '%20');
}

function iconFor(subject) {
  return ICONS[subject] || '📘';
}

function renderCourseSection(course, subjects) {
  let html = `  <div class="section-header" style="margin-top: var(--space-6);">
    <h2 class="section-heading">${escapeHtml(course)}</h2>
  </div>
  <div class="deck-grid" role="list">
`;
  for (const [subject, info] of subjects) {
    const icon = iconFor(subject);
    const href = `../index.html?${encodeQuery(course, subject)}`;
    const meta = `${info.total} tarjeta${info.total === 1 ? '' : 's'}`;
    html += `    <a class="deck-card" role="listitem" href="${href}">
      <span class="deck-icon" aria-hidden="true">${icon}</span>
      <h3>${escapeHtml(subject)}</h3>
      <span class="deck-meta">${meta}</span>
    </a>
`;
  }
  html += `  </div>
`;
  return html;
}

function buildHeader() {
  return `<!DOCTYPE html>
<!-- ============================================================================
     Memofun — /dev/ : catálogo de desarrollo.

     Página hardcodeada (sin app.js) con todos los cursos y asignaturas
     activados. Estructura:

       H2 curso → card por asignatura (con H3 dentro)

     Cada asignatura abre la portada pública en ../index.html con
     ?course=X&subject=Y, donde app.js renderiza el nivel de asignatura
     (renderTopicLevel) y muestra los grupos de temas. La baraja suelta
     que una asignatura pueda tener sin topicGroup aparece también a
     ese nivel, igual que en la portada.

     No usa data-access="full" ni OPEN_SUBJECTS: la decisión de qué
     asignaturas son visibles vive enteramente aquí, como en Routime y
     Calculia con sus herramientas.

     En la portada pública (app.js → OPEN_SUBJECTS) algunas asignaturas
     aparecen como "Próximamente"; aquí todas están activas. La forma
     de las cards (deck-card) y los iconos (deck-icon) coinciden con
     los de la portada para que el lector de ojos vea la misma jerarquía
     que al pinchar un curso en https://memofun.apptonomia.uk/.

     Los totales de tarjetas son sumas del \`amount\` de cada baraja
     según el manifest — copia literal para que el dev page sea coherente
     con el manifest y no haya que mantener dos cuentas.
     ============================================================================ -->
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Memofun — /dev (FP Básica)</title>
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#FAF7F2">
<meta name="color-scheme" content="light">

<link rel="stylesheet" href="../assets/css/tokens.css?v=memofun-v2ca">
<link rel="stylesheet" href="../assets/css/base.css">
<link rel="stylesheet" href="../assets/css/componentes.css">
<link rel="stylesheet" href="../assets/css/locale-picker.css?v=memofun-v2caa">
<link rel="manifest" href="../manifest.json">
</head>
<body>

<a class="skip-link" href="#contenido">Ir al contenido</a>

<header class="app-header suite-header container container-wide">
  <div class="suite-brand app-hero">
    <div class="hero-mark" aria-hidden="true">
      <img class="hero-mark-front" src="../assets/img/icono.svg" alt="" width="44" height="44">
      <span class="hero-mark-back">⭐</span>
    </div>
    <div class="suite-brand-copy">
      <h1 class="logo">Memofun</h1>
      <p class="suite-attribution">Una app de <a href="https://apptonomia.uk/">Apptonomia</a>.</p>
    </div>
  </div>
  <div class="suite-controls"><div id="locale-picker"></div></div>
  <div class="suite-details"><p class="tagline">Elige una baraja y practica con tarjetas.</p><span class="stars">⭐ 0</span></div>
</header>

<main id="contenido" class="container container-wide">
`;
}

function buildFooter() {
  return `</main>

</body>
</html>
`;
}

function main() {
  const entries = loadManifest();
  const courses = groupByCourse(entries);

  let body = '';
  for (const [course, subjects] of courses) {
    body += renderCourseSection(course, subjects);
  }

  const html = buildHeader() + body + buildFooter();
  fs.writeFileSync(OUT, html, 'utf8');

  // Stats for the operator.
  const totalSubjects = [...courses.values()].reduce((acc, s) => acc + s.size, 0);
  console.log(`Wrote ${OUT}`);
  console.log(`  courses: ${courses.size}`);
  console.log(`  subjects: ${totalSubjects}`);
  console.log(`  bytes: ${Buffer.byteLength(html, 'utf8')}`);
}

main();