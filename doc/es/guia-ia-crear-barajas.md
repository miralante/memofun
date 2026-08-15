# Añadir una baraja con una IA externa (Cowork, Cursor, ChatGPT…)

> Punto de entrada para el rol de **apoyo** (familia, docente) que
> quiere generar una baraja con ayuda de una IA que **no** forma parte
> del producto Memofun — desde un entorno de desarrollo colaborativo
> con IA ("tipo cowork": Cursor, Windsurf, GitHub Copilot Workspace,
> Claude Code…) hasta un chat de texto suelto como ChatGPT o Claude.ai
> en el navegador. Este documento no repite las reglas de contenido
> — te manda directamente a la guía que te corresponde según lo que
> tengas.

---

## La única pregunta que importa: ¿tu herramienta puede leer y escribir en este repositorio?

Da igual la marca o el nombre concreto de la herramienta. Lo único
que cambia el flujo a seguir es si esa IA puede **acceder de verdad al
código de Memofun** (clonarlo, navegarlo, leer y escribir archivos) o
si es solo una conversación de texto aislada, sin conexión a este
repositorio.

### ✅ Sí puede acceder al repositorio

Esto incluye entornos de desarrollo con IA integrada — muchas veces
llamados herramientas de **"cowork"** o de programación asistida:
Cursor, Windsurf, GitHub Copilot Workspace, Claude Code, o incluso un
ChatGPT/Claude.ai con un conector a GitHub activado que le deje leer
este repositorio.

→ Sigue **[`guia-interna-crear-barajas.md`](guia-interna-crear-barajas.md)**. El flujo
es exactamente el mismo sea cual sea la herramienta concreta: dale
acceso al repositorio y pídele que:

1. Lea `CLAUDE.md` → "Generating deck content" (el ruleset completo de
   contenido) y `tecnico.md` §3-4 (el formato exacto de una baraja y
   del `manifest.json`).
2. Genere la baraja a partir de un tema, o de un archivo de
   [`doc/curriculum/es/`](../curriculum/es/) si ya existe uno para
   tu curso/asignatura.
3. Escriba `decks/<slug>.json` y añada la entrada en
   `decks/manifest.json`.
4. Ejecute `node scripts/check.js` (y `check-version-bump.js` si tocó
   algún archivo cacheado por `sw.js`).
5. Si la herramienta puede además abrir un Pull Request, mejor —
   revisa igualmente el checklist de
   [`guia-interna-crear-barajas.md`](guia-interna-crear-barajas.md) §4 antes de
   aprobarlo.

> 💡 Si tu herramienta no lee `CLAUDE.md` sola (algunas solo indexan
> código para autocompletar, sin "razonar" como un agente), pégaselo
> tú al principio de la conversación, junto con `doc/es/tecnico.md`
> §3-4. A partir de ahí, el resto del flujo es igual.

### ❌ No puede acceder al repositorio

Es un chat de texto suelto — ChatGPT, Claude.ai, Gemini, Copilot
Chat… abierto en el navegador, sin conexión a este repositorio. Solo
puede generar texto en una conversación; no puede leer ni escribir
ningún archivo del proyecto.

→ Sigue **[`guia-chat-ia-crear-barajas.md`](guia-chat-ia-crear-barajas.md)**. Tiene un
prompt listo para copiar y pegar con todas las reglas de contenido, y
los pasos para llevar tú (o alguien con acceso) el resultado al
repositorio a mano.

---

## Por qué esto no rompe la regla de "sin IA generativa en el producto"

Memofun no llama a ninguna IA desde `index.html`, `app.js`,
`tools/study/`, `settings/`, ni desde ningún script de `scripts/` —
ver [`SPEC.md`](SPEC.md) §2.1. Todo lo descrito aquí ocurre **antes**
de publicar nada: es una persona, usando una herramienta externa al
producto, preparando contenido que luego se revisa y se guarda como
texto plano en `decks/`. Da igual si esa herramienta es un agente
dentro de un IDE o un chat en una pestaña del navegador — en ningún
caso queda conectada a la aplicación que usa la persona que estudia.

## Referencias cruzadas

- [`guia-interna-crear-barajas.md`](guia-interna-crear-barajas.md) — flujo completo
  con una IA que tiene acceso al repositorio.
- [`guia-chat-ia-crear-barajas.md`](guia-chat-ia-crear-barajas.md) — flujo completo con un
  chat de IA sin acceso al repositorio, prompt incluido.
- `CLAUDE.md` → "Generating deck content" — el ruleset completo de
  contenido, la fuente de la que beben ambas guías.
- [`tecnico.md`](tecnico.md) §3-4 — formato de una baraja y de
  `manifest.json`.
- [`SPEC.md`](SPEC.md) §2.1 — por qué no hay IA generativa en el
  producto, y por qué este flujo no lo contradice.

🌐 English version: [`../en/ai-creating-decks-guide.md`](../en/ai-creating-decks-guide.md)
