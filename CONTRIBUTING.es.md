# Contribuir a Memofun

> 🌐 **Otros idiomas:** [English](CONTRIBUTING.md)

Memofun tiene tres roles (ver [`doc/es/roles.md`](doc/es/roles.md)):
persona usuaria, apoyo (familia/docente) y construcción
(desarrollador/a). Esta guía es para los dos últimos — la persona
usuaria no necesita leer nada de esto, solo abrir la app.

## 👥 Formas de contribuir

| Quiero… | Cómo |
|---|---|
| Añadir una baraja nueva | Sigue [`doc/es/guia-interna-crear-barajas.md`](doc/es/guia-interna-crear-barajas.md) (paso a paso completo); resumen: pide al agente de IA que escriba la baraja a partir de un tema o de un `config.md`, **revisa el contenido** y añade la entrada en `decks/manifest.json` antes de abrir el PR con el `.json` y el manifest. |
| Corregir o mejorar una baraja existente | Edita el `.json` directamente (es texto plano), o pide al agente que la regenere y sustituya el archivo en `decks/`. |
| Tocar código (HTML/CSS/JS) | Sigue el flujo de GitHub de abajo. Lee primero [`doc/es/tecnico.md`](doc/es/tecnico.md). Todo el proyecto es vanilla: nada de frameworks ni dependencias nuevas. |
| Traducir la interfaz a un idioma nuevo | Sigue la guía de [`doc/es/I18N.md`](doc/es/I18N.md). |
| Reportar una tarjeta cuya `imagen` no encaja de verdad | Abre un issue indicando el archivo de la baraja, la tarjeta (texto de la pregunta) y qué está mal. Las imágenes de las barajas se eligen a partir del título/fuente del resultado de búsqueda en Openverse al escribir el contenido, a propósito sin abrir el archivo para mirarlo (`doc/es/tecnico.md` §3.1) — se espera que algún desajuste se cuele de vez en cuando y lo detecte quien lee la baraja, no que se reverifique cada imagen de antemano. |

## ⚠️ Antes de tocar la generación de contenido

El contenido de las barajas lo escribe el agente de IA directamente en
el repositorio (ver "Generating deck content" en `CLAUDE.md`) — no hay
ningún script que llame a una API de IA, y no debe haberlo. No se
integra en el sitio público bajo ninguna circunstancia — ver
`doc/es/SPEC.md` §2.1. Cualquier PR que añada una llamada a un
servicio de IA desde `index.html`, `app.js`, `tools/study/`,
`settings/`, o desde cualquier script en `scripts/`, será rechazado.

> **Sobre la suite Miralante** — Memofun es una de las **seis apps**
> de la [suite Miralante](https://apptonomia.uk) (Calculia, Memofun,
> Okeymoney, Routime, Sinonimia, Teclatlon). El repo
> [Apptonomia](https://github.com/miralante/apptonomia) aloja
> **únicamente el portal de la suite** — no es una app en tiempo de
> ejecución. La tabla completa de la suite vive en la sección
> ["La suite Miralante — proyectos del grupo" del `README.es.md`](README.es.md#-la-suite-miralante--proyectos-del-grupo).

## 🔀 Flujo de trabajo en GitHub

```
1. 🔍 Buscar o crear un issue (en español o inglés)
2. 💬 Comentar y consensuar el alcance
3. 🌿 Crear una rama (fork si no tienes acceso de push)
4. ✏️  Hacer los cambios siguiendo doc/es/tecnico.md
5. ✅ Ejecutar los scripts de validación (ver abajo)
6. 📤 Abrir un Pull Request referenciando el issue
7. 👀 Esperar revisión (al menos 1 persona mantenedora)
8. ✅ Merge cuando hay aprobación
```

## ✅ Validar los cambios

Tres scripts se ejecutan automáticamente en CI en cada push y PR (ver
[`.github/workflows/ci.yml`](.github/workflows/ci.yml) +
[`.github/workflows/smoke-prod.yml`](.github/workflows/smoke-prod.yml)),
pero ejecútalos antes en local para detectar problemas antes:

```
node scripts/check.js                  # 92 comprobaciones: estructural, paridad i18n, sin lenguaje clínico, comillado CSP, integridad de barajas, sw.js ↔ disco
node scripts/check-version-bump.js     # falla si cambiaste un archivo de sw.js FILES sin subir VERSION
node scripts/i18n-keys-smoke.js        # informativo: lista data-i18n* / App.i18n.t() usados pero no registrados en ningún idioma
node scripts/i18n-keys-smoke.js --strict   # igual, pero sale con código 1 si faltan claves (úsalo en CI o al añadir un idioma)
node scripts/scan-secrets.js           # grep best-effort para claves API, tokens y claves privadas colados sin querer (mismo script que el job secrets-scan del CI)
node scripts/smoke-prod.js             # post-despliegue: pega contra la URL en vivo y comprueba cabeceras + paridad i18n + decks/manifest.json (necesita PROD_URL)
node scripts/limpiar-graphify-cache.js # dry-run: muestra qué se borraría de graphify-out/ (un artefacto regenerable del agente)
```

## ✅ Checklist antes de abrir un PR

- [ ] `node scripts/check.js` pasa sin errores.
- [ ] Si tocaste un archivo cacheado por `sw.js`, subiste el `VERSION`
      (`node scripts/check-version-bump.js` lo detecta automáticamente).
- [ ] `node scripts/i18n-keys-smoke.js --strict` no reporta claves
      faltantes en los idiomas que tocaste.
- [ ] `node scripts/scan-secrets.js` dice "no secrets found" (ejecútalo
      en local antes de pushear si tu cambio toca algo que pueda
      parecer un token).
- [ ] Si añadiste un texto de interfaz, está en `strings.es.js` **y**
      `strings.en.js`.
- [ ] Si añadiste o cambiaste una baraja, revisaste el contenido y
      actualizaste `decks/manifest.json`.
- [ ] Ningún texto de cara al usuario menciona "discapacidad" ni jerga
      clínica.
- [ ] El contenido nuevo tiene tono cercano y con gracia (nunca sarcasmo
      ni dobles sentidos) y, cuando encaja, un dato curioso — ver
      `doc/es/SPEC.md` §2.5.
- [ ] Botones ≥ 64×64 px, contraste alto, sin cronómetros nuevos.
