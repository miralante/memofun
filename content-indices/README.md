# Índices de contenidos — Primaria a FP Grado Medio

Esta carpeta es una **biblioteca de puntos de ingesta** para el agente
de IA del proyecto (ver [`../doc/es/guia-crear-barajas.md`](../doc/es/guia-crear-barajas.md)):
un archivo Markdown por asignatura y curso, listo para pedir la baraja
directamente:

> "Genera la baraja de `content-indices/primaria/3/lengua-castellana.md`."

No hace falta ningún script ni ninguna API key — el agente lee el
archivo y escribe el contenido él mismo (ver "Generating deck content"
en `CLAUDE.md`).

Cada archivo es un `config.md` completo (frontmatter + `# Índice`), no
solo una lista suelta — se puede usar tal cual.

## Alcance

Cubre el recorrido **desde 1º de Primaria hasta 2º de FP de Grado
Medio en Gestión Administrativa**, siguiendo el itinerario real de
acceso (Primaria → ESO → Grado Medio; el título de la ESO ya da acceso
a un Grado Medio, sin pasar por Bachillerato).

| Etapa | Cursos | Asignaturas incluidas |
|---|---|---|
| `primaria/` | 1º a 6º | Lengua Castellana y Literatura, Ciencias Naturales, Ciencias Sociales, Inglés |
| `eso/` | 1º a 4º | Lengua Castellana y Literatura, Geografía e Historia, Inglés, y las ciencias experimentales (ver nota) |
| `fp-gm-gestion-administrativa/` | 1º y 2º | Los módulos profesionales de aula del título "Técnico en Gestión Administrativa" |

**Solo asignaturas troncales/instrumentales** — se dejaron fuera
Educación Física, Plástica, Música, Religión/Valores y similares: el
valor de una baraja de repaso es mayor en las materias de contenido
denso (lengua, ciencias, sociales, inglés) que en las que son sobre
todo práctica.

**Sin Matemáticas**: el cálculo y el razonamiento lógico ya los cubre
la app hermana **Calculia** (11 actividades dedicadas — números,
tablas, números romanos, patrones, el reloj, el monedero...), con un
formato de práctica interactiva mucho más adecuado para esa materia
que una tarjeta de pregunta/respuesta. Memofun se centra en las
asignaturas de contenido factual y narrativo.

**Nota sobre Biología y Geología / Física y Química en la ESO**: su
reparto por curso varía algo según la comunidad autónoma y el centro.
Aquí se ha usado el reparto más habitual: Biología y Geología en 1º,
3º y 4º; Física y Química en 2º, 3º y 4º. Revisa el temario oficial de
tu centro antes de dar por bueno el índice si necesitas precisión
curricular exacta.

**Nota sobre FP**: los módulos y su año (1º/2º) también pueden variar
ligeramente por comunidad autónoma. Se ha usado el reparto más
extendido del título LOE/LOMLOE de Gestión Administrativa, sin incluir
la Formación en Centros de Trabajo (FCT) — son prácticas, no temario.

## Estructura de cada archivo

```markdown
---
tema: "Lengua Castellana y Literatura - 3º de Primaria"
nivel: "principiante"
cantidad: 15
salida: "primaria_3_lengua-castellana.json"
---
# Índice
- El sustantivo: común y propio
- La rima en la poesía
- ...

# Contexto o notas adicionales
(nivel y enfoque)
```

## Cómo usar esta biblioteca

1. Elige el archivo del curso y asignatura que quieras.
2. Pide al agente que genere la baraja a partir de ese archivo (ver el
   ejemplo arriba). El propio agente escribe `decks/<salida>.json` y
   añade la entrada a `decks/manifest.json`.
3. **Revisa el contenido** antes de dar la baraja por publicada — ver
   el checklist de
   [`../doc/es/guia-crear-barajas.md`](../doc/es/guia-crear-barajas.md) §4.
   Los índices de este directorio marcan **qué** cubrir; la calidad
   final de cada tarjeta (lectura fácil, tono, datos curiosos) sigue
   mereciendo una revisión, igual que con cualquier otra baraja.
4. Comprueba que todo encaja con `node scripts/check.js` y abre
   `index.html` — la baraja ya está en la app.

Estos archivos son plantillas de partida, no un currículo oficial
certificado: son un punto de partida razonable para generar contenido
de repaso, pensado para ajustarse y corregirse con el tiempo — igual
que cualquier índice de un libro de texto.
