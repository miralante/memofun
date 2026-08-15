# Currículos — Primaria a FP Grado Medio, con FP Básica (español)

Esta carpeta es una **biblioteca de puntos de ingesta** para el agente
de IA del proyecto (ver [`../../es/guia-interna-crear-barajas.md`](../../es/guia-interna-crear-barajas.md)):
un archivo Markdown por asignatura y curso, listo para pedir la baraja
directamente:

> "Genera la baraja de `doc/curriculum/es/primaria/3/lengua-castellana.md`."

Es la carpeta **`es/`** de [`doc/curriculum/`](../): el currículo real
de la Comunidad de Madrid, en español. La carpeta hermana
[`../en/`](../en/) está vacía a propósito — documenta cómo replicar
esta misma biblioteca para un currículo en otro idioma.

No hace falta ningún script ni ninguna API key — el agente lee el
archivo y escribe el contenido él mismo (ver "Generating deck content"
en `CLAUDE.md`).

Cada archivo es un `config.md` completo (frontmatter + `# Índice`), no
solo una lista suelta — se puede usar tal cual.

## Alcance

Cubre el recorrido **desde 1º de Primaria hasta 2º de FP de Grado
Medio en Gestión Administrativa**, siguiendo el itinerario real de
acceso (Primaria → ESO → Grado Medio; el título de la ESO ya da acceso
a un Grado Medio, sin pasar por Bachillerato), más una **vía
alternativa**: FP Básica en Servicios Administrativos, para quien no
completa la ESO y necesita un título propio (Grado A de FP) antes de
poder acceder también a un Grado Medio.

| Etapa | Cursos | Asignaturas incluidas |
|---|---|---|
| `primaria/` | 1º a 6º | Lengua Castellana y Literatura, Ciencias Naturales, Ciencias Sociales |
| `eso/` | 1º a 4º | Lengua Castellana y Literatura, Geografía e Historia, y las ciencias experimentales (ver nota) |
| `fp-basica-servicios-administrativos/` | 1º y 2º | Los módulos profesionales del Título Profesional Básico en Servicios Administrativos (Grado A de FP), vía alternativa a la ESO |
| `fp-gm-gestion-administrativa/` | 1º y 2º | Los módulos profesionales de aula del título "Técnico en Gestión Administrativa" |

**Solo asignaturas troncales/instrumentales** — se dejaron fuera
Educación Física, Plástica, Música, Religión/Valores y similares: el
valor de una baraja de repaso es mayor en las materias de contenido
denso (lengua, ciencias, sociales) que en las que son sobre
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
Tampoco se incluye, en FP Básica, el "Proyecto intermodular de
aprendizaje colaborativo": es un proyecto transversal que integra
resultados de aprendizaje de varios módulos ya cubiertos, sin
contenido propio que indexar. Los módulos generales de FP Básica
("Ámbito de Comunicación y Ciencias Sociales", "Ámbito de Ciencias
Aplicadas") se han separado por asignatura (Lengua Castellana,
Ciencias Sociales, Ciencias Aplicadas) para mantener la misma
estructura que `primaria/` y `eso/`; la parte de Matemáticas del
Ámbito de Ciencias Aplicadas queda fuera por la misma razón que en el
resto de la biblioteca (ver nota "Sin Matemáticas" más arriba).

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
(nivel, enfoque y referencia al decreto curricular aplicable)

# Fuentes de consulta
- [Decreto oficial de la Comunidad de Madrid (BOCM)](url) — currículo
  autonómico vigente para esta etapa
- [Real Decreto de currículo básico (BOE)](url) — currículo estatal
  que desarrolla el decreto anterior
- 1-2 fuentes de contenido de calidad para ese tema/curso concreto
  (portal educativo, museo, biblioteca, organismo oficial...)
```

La sección `# Fuentes de consulta` es opcional para el `# Índice` en sí
(el agente no necesita visitarla para generar tarjetas), pero se
incluye en todos los archivos de esta biblioteca como ayuda para quien
quiera **verificar o ampliar** el temario antes de generarlo: enlaza
siempre el decreto curricular oficial que sustenta ese índice (BOCM +
BOE) y, cuando aporte valor, 1-2 fuentes de contenido fiables para el
tema concreto. Todos los enlaces deben ser reales y comprobados — nunca
inventados.

## Cómo usar esta biblioteca

1. Elige el archivo del curso y asignatura que quieras.
2. Pide al agente que genere la baraja a partir de ese archivo (ver el
   ejemplo arriba). El propio agente escribe `decks/<salida>.json` y
   añade la entrada a `decks/manifest.json`.
3. **Revisa el contenido** antes de dar la baraja por publicada — ver
   el checklist de
   [`../../es/guia-interna-crear-barajas.md`](../../es/guia-interna-crear-barajas.md) §4.
   Los índices de este directorio marcan **qué** cubrir; la calidad
   final de cada tarjeta (lectura fácil, tono, datos curiosos) sigue
   mereciendo una revisión, igual que con cualquier otra baraja.
4. Comprueba que todo encaja con `node scripts/check.js` y abre
   `index.html` — la baraja ya está en la app.

Estos archivos son plantillas de partida, no un currículo oficial
certificado: son un punto de partida razonable para generar contenido
de repaso, pensado para ajustarse y corregirse con el tiempo — igual
que cualquier índice de un libro de texto.
