# Memofun 🧠

> 🌐 **Otros idiomas:** [English](README.md)
>
> 🚀 **Pruébalo en vivo:** `https://memofun.miralante.workers.dev` (una vez desplegado)

Una app de tarjetas de memoria (flashcards) para practicar con
**aprendizaje significativo**: cada tarjeta explica un concepto con una
analogía cotidiana, un ejemplo práctico o el "por qué importa", nunca
con una definición de diccionario. Pensada para que un estudiante con
discapacidad intelectual pueda repasar de forma autónoma.

No hay build, no hay backend, no hay cuentas, no hay dependencias, y
**ninguna API de IA en ningún punto del código**: HTML, CSS y
JavaScript vanilla. El contenido de cada baraja lo escribe
directamente el agente de IA de programación que trabaja en este
proyecto (ver `CLAUDE.md`), no una llamada en directo desde la app.
Las barajas usan un formato JSON propio, no el `.apkg` de Anki.

## Probarlo

Abre `index.html` en un navegador, o sirve la carpeta con cualquier
servidor estático:

```
npx serve .
```

## Qué incluye

- **Rejilla de barajas** en la pantalla de inicio — elegir y repasar,
  sin más pasos.
- **Repaso con tarjetas**: toca para girar, navega con flechas, escucha
  la tarjeta bajo demanda (🔊), sin cronómetro y sin corrección
  "bien/mal". Terminar una baraja suma una ⭐, guardada solo en tu
  dispositivo.
- **Accesibilidad**: botones grandes, alto contraste, tipografía
  Atkinson Hyperlegible, navegación por teclado, `prefers-reduced-motion`.
- **Español e inglés** en toda la interfaz.
- **Funciona sin conexión** una vez instalada (PWA).
- **Sin IA generativa en el producto**: no hay ninguna integración con
  ninguna API de IA en el código del sitio. El contenido lo escribe el
  agente de IA de programación directamente en el repositorio —
  ver [`doc/es/SPEC.md`](doc/es/SPEC.md) §2.1.

## Preparar una baraja nueva (rol de apoyo)

No hace falta instalar nada ni tener ninguna API key. Pídeselo al
agente de IA de programación (Claude Code u otro) que trabaja en este
proyecto:

> "Genera una baraja de Memofun sobre 'Docker y Contenedores', nivel
> intermedio, 10 tarjetas."

El agente escribe las tarjetas siguiendo las reglas de "Generating
deck content" en `CLAUDE.md`, crea el `.json` en `decks/` y añade la
entrada a `decks/manifest.json`. **Revisa el contenido** antes de
darlo por publicado (lectura fácil, sin lenguaje clínico, tono
divertido y algún dato curioso — ver [`doc/es/SPEC.md`](doc/es/SPEC.md) §2.5).

`config.md` (en la raíz) y [`doc/curriculum/`](doc/curriculum/) son
el punto de ingesta de contenidos: basta con un `tema` (el agente
elige los subtemas), o `tema` + una sección `# Índice` con una lista
de subtemas propia si ya tienes un temario y quieres que la baraja lo
siga punto por punto — ver la guía completa en
[`doc/es/guia-interna-crear-barajas.md`](doc/es/guia-interna-crear-barajas.md).

## Validar los cambios

```
node scripts/check.js
```

Comprueba sintaxis JS, paridad ES/EN, integridad de `sw.js`/`manifest.json`/
`decks/manifest.json`, y que ninguna página mencione discapacidad o
lenguaje clínico. Si tocaste un archivo cacheado por `sw.js`, además:

```
node scripts/check-version-bump.js
```

## Documentación del proyecto

| Idioma | Punto de entrada |
|---|---|
| 🇪🇸 Español (este archivo) | [`doc/es/indice.md`](doc/es/indice.md) |
| 🇬🇧 English | [`doc/en/index.md`](doc/en/index.md) |

| Si quieres… | Empieza por… |
|---|---|
| Entender qué es Memofun y para quién es | [`doc/es/SPEC.md`](doc/es/SPEC.md) |
| Saber quién participa y cómo | [`doc/es/roles.md`](doc/es/roles.md) |
| Crear y publicar una baraja nueva, paso a paso | [`doc/es/guia-interna-crear-barajas.md`](doc/es/guia-interna-crear-barajas.md) |
| Ver la arquitectura técnica | [`doc/es/tecnico.md`](doc/es/tecnico.md) |
| Añadir una baraja, un idioma o tocar código | [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) |
| Que un agente de IA toque el código | `CLAUDE.md` (en inglés) |

## Licencia

- El **código** (HTML/CSS/JS) es de quien contribuye, bajo
  licencia MIT (ver `LICENSE`).
- El **contenido de las barajas** (preguntas, respuestas) está bajo
  Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0), salvo que
  una baraja concreta indique lo contrario.

---

## 🧩 Proyectos hermanos

Este proyecto forma parte de un pequeño grupo de proyectos hermanos que
comparten autor, la misma filosofía de accesibilidad y sin backend, y
la misma historia de despliegue en Cloudflare. **Apptonomia es el
proyecto principal**; los demás salieron de él o se construyeron a su
lado sobre el mismo stack.

| Proyecto | Qué es | Repositorio |
|---|---|---|
| **Apptonomia** *(principal)* | Terapia ocupacional: 7 módulos, actividades | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| Calculia | Cálculo y razonamiento lógico | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| Memofun | Tarjetas de memoria con aprendizaje significativo | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| Okeymoney | Finanzas personales y autonomía cotidiana | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| Sinonimia | Diccionario en lectura fácil | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| Teclatlon | Mecanografía con el teclado físico | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

La guía canónica de Cloudflare / despliegue para el grupo vive en
[`CLOUDFLARE.md` de Apptonomia](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md).
Este repo usa el modelo **Workers + static assets** — ver
[`CLOUDFLARE.md`](CLOUDFLARE.md) para la guía local.
