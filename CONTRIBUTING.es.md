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

## ⚠️ Antes de tocar la generación de contenido

El contenido de las barajas lo escribe el agente de IA directamente en
el repositorio (ver "Generating deck content" en `CLAUDE.md`) — no hay
ningún script que llame a una API de IA, y no debe haberlo. No se
integra en el sitio público bajo ninguna circunstancia — ver
`doc/es/SPEC.md` §2.1. Cualquier PR que añada una llamada a un
servicio de IA desde `index.html`, `app.js`, `tools/study/`,
`settings/`, o desde cualquier script en `scripts/`, será rechazado.

## 🔀 Flujo de trabajo en GitHub

```
1. 🔍 Buscar o crear un issue (en español o inglés)
2. 💬 Comentar y consensuar el alcance
3. 🌿 Crear una rama (fork si no tienes acceso de push)
4. ✏️  Hacer los cambios siguiendo doc/es/tecnico.md
5. 📤 Abrir un Pull Request referenciando el issue
6. 👀 Esperar revisión (al menos 1 persona mantenedora)
7. ✅ Merge cuando hay aprobación
```

## ✅ Checklist antes de abrir un PR

- [ ] `node scripts/check.js` pasa sin errores.
- [ ] Si tocaste un archivo cacheado por `sw.js`, subiste el `VERSION`
      (`node scripts/check-version-bump.js` lo detecta automáticamente).
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
