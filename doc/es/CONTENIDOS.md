# Contenidos detallados — Memofun

> 🌐 **Otro idioma:** [English](../en/CONTENTS.md)

Este documento es un **índice didáctico detallado** de Memofun.
Amplía [`actividades.md`](actividades.md) y
[`guia-crear-actividades.md`](guia-crear-actividades.md) dando,
para cada baraja y concepto pedagógico que se distribuye con la
app:

- Su **curso** (el currículo al que pertenece).
- Su **nivel** (el año escolar o la unidad).
- Su **fichero de baraja** (`decks/<curso>_<nivel>_<tema>.json`).
- Su **objetivo didáctico** (el concepto que trabaja).
- Su **vocabulario / tema clave** (el tema de las tarjetas).
- Su **referencia** (documento canónico y sección).

Memofun distribuye **una sola** actividad de renderizado
(`tools/study/`) que reproduce **cualquier** baraja que cumpla el
esquema. El "contenido" de la app es por tanto el **conjunto de
barajas**, no un conjunto de actividades.

Usa este documento como el **workbook de Memofun**: cuando se
proponga una baraja nueva, cuando se revise contenido, o cuando
haya que reequilibrar la cobertura de un currículo, este es el
documento que hay que leer primero.

> **Fuente de verdad para las reglas de producto**:
> [`SPEC.md`](SPEC.md). **Fuente de verdad para la pedagogía**:
> [`guia-crear-actividades.md`](guia-crear-actividades.md). Este
> documento **no** redefine reglas; indexa el contenido que esas
> reglas producen.

---

## 0. Cómo se organiza este documento

1. Anatomía de la tarjeta (qué pinta tiene una sola tarjeta).
2. Cursos y barajas distribuidos con el proyecto (el catálogo).
3. Conceptos pedagógicos (cómo Memofun construye aprendizaje
   significativo).
4. Reglas de autoría de barajas (cómo es una baraja "buena").
5. Restricciones y contenido prohibido.

---

## 1. Anatomía de la tarjeta

Una baraja es un fichero JSON con una lista ordenada de tarjetas.
Cada tarjeta sigue esta **forma didáctica**:

| Campo | Rol | Intención didáctica |
|---|---|---|
| `front` | La pista (analogía, ejemplo o "por qué importa"). | Ancla el concepto en algo que la persona ya sabe. **Nunca una definición para recitar.** |
| `back` | La respuesta en una frase. | Una frase, vocabulario de lectura fácil, sin jerga. |
| `topic` | El tema de la baraja (área de conocimiento). | Lo usa el filtro por tema. |
| `course` | El curso / currículo al que pertenece. | Lo usa la cuadrícula de curso. |
| `level` | El nivel dentro del curso (año escolar). | Lo usa la cuadrícula de nivel. |
| `audio` | Pronunciación grabada opcional o lectura de la frase. | Ayuda opcional; no obligatoria. |
| `pictograma` | Referencia opcional a un pictograma. | Ayuda opcional; no obligatoria. |

El anverso es **siempre una pista** (ver
[`guia-crear-actividades.md`](guia-crear-actividades.md) §2.2).
Esta es la regla didáctica más distintiva del proyecto.

---

## 2. Cursos y barajas distribuidos con el proyecto

> El catálogo actual se resume por **conteo de barajas por curso**.
> Los nombres de fichero siguen la convención
> `decks/<prefijo_curso>_<nivel>_<tema>[_<indice>].json` (el
> `_<indice>` opcional se usa cuando un tema se parte en varias
> barajas para mantener cada sesión corta).

### 2.1 Inglés (en)

| Curso | Niveles | Grupos temáticos | Barajas (aprox.) |
|---|---|---|---|
| **Key Stage 1** | 1–2 | English Literature, Geography, History, Science | ~16 |
| **Key Stage 2** | 3–6 | English Literature, Geography, History, Science | ~32 |
| **Key Stage 3** | 7–9 | English Literature, Geography, History, Science | ~24 |
| **Key Stage 4** | 10–11 | English Literature, Geography, History, Combined Science + las vías separadas de Biology, Chemistry y Physics | ~32 |
| **Entry-Level Business** | 1–2 | Business basics, Customer service | ~16 |
| **BTEC Business L2** | 1–2 | Business administration, Communication, Finance, Operations | ~32 |

#### 2.1.1 Key Stage 1 (5–7 años)

| Nivel | Temas |
|---|---|
| 1 | English Literature, Geography, History, Science |
| 2 | English Literature, Geography, History, Science |

#### 2.1.2 Key Stage 2 (7–11 años)

| Nivel | Temas |
|---|---|
| 3 | English Literature, Geography, History, Science |
| 4 | English Literature, Geography, History, Science |
| 5 | English Literature, Geography, History, Science |
| 6 | English Literature, Geography, History, Science |

#### 2.1.3 Key Stage 3 (11–14 años)

| Nivel | Temas |
|---|---|
| 7 | English Literature, Geography, History, Science |
| 8 | English Literature, Geography, History, Science |
| 9 | English Literature, Geography, History, Science |

#### 2.1.4 Key Stage 4 (14–16 años)

| Nivel | Temas |
|---|---|
| 10 | English Literature, Geography, History, Combined Science |
| 11 | English Literature, Geography, History + Biology, Chemistry y Physics por separado |

#### 2.1.5 Entry-Level Business

| Nivel | Temas |
|---|---|
| 1 | Business basics, Customer service |
| 2 | Business basics, Customer service |

#### 2.1.6 BTEC Business L2

| Nivel | Temas |
|---|---|
| 1 | Business administration, Communication, Finance, Operations |
| 2 | Business administration, Communication, Finance, Operations |

### 2.2 Español (es)

| Curso | Niveles | Grupos temáticos | Barajas (aprox.) |
|---|---|---|---|
| **Primaria** | 1–6 | Lengua castellana, Ciencias naturales, Ciencias sociales | ~139 |
| **ESO** | 1–4 | Lengua castellana, Geografía e historia, Biología y geología, Física y química | ~93 |
| **FP Básica — Servicios administrativos** | 1–2 | Lengua, ciencias, técnicas administrativas, ofimática, atención al cliente, tratamiento de datos | ~22 |
| **FP GM — Gestión administrativa** | 1–2 | Comunicación empresarial, empresa y administración, técnica contable, operaciones, sostenibilidad, digitalización | ~26 |
| **Mapa mundi** | — | Banderas, capitales, ciudades, continentes, geografía física, récords | ~12 |

#### 2.2.1 Primaria (1–6)

| Nivel | Temas |
|---|---|
| 1 | Lengua castellana, Ciencias naturales, Ciencias sociales |
| 2 | Lengua castellana, Ciencias naturales, Ciencias sociales |
| 3 | Lengua castellana, Ciencias naturales, Ciencias sociales |
| 4 | Lengua castellana, Ciencias naturales, Ciencias sociales |
| 5 | Lengua castellana, Ciencias naturales, Ciencias sociales |
| 6 | Lengua castellana, Ciencias naturales, Ciencias sociales |

#### 2.2.2 ESO (1–4)

| Nivel | Temas |
|---|---|
| 1 | Lengua castellana, Geografía e historia, Biología y geología |
| 2 | Lengua castellana, Geografía e historia, Física y química |
| 3 | Lengua castellana, Geografía e historia, Biología y geología, Física y química |
| 4 | Lengua castellana, Geografía e historia, Biología y geología, Física y química |

#### 2.2.3 FP Básica — Servicios administrativos (1–2)

| Nivel | Temas |
|---|---|
| 1 | Lengua, ciencias, ciencias sociales, itinerario personal y de empleabilidad, técnicas administrativas básicas, atención al cliente, tratamiento informático de datos |
| 2 | Lengua, ciencias, ciencias sociales, aplicaciones básicas de ofimática, archivo y comunicación, preparación de pedidos y venta de productos |

#### 2.2.4 FP GM — Gestión administrativa (1–2)

| Nivel | Temas |
|---|---|
| 1 | Comunicación empresarial y atención al cliente, empresa y administración, itinerario personal y de empleabilidad (I), operaciones administrativas de compraventa, técnica contable, tratamiento informático de la información |
| 2 | Digitalización aplicada a los sectores productivos, empresa en el aula, itinerario personal y de empleabilidad (II), operaciones administrativas de RRHH, operaciones auxiliares de gestión de tesorería, sostenibilidad del sistema productivo, tratamiento de la documentación contable |

#### 2.2.5 Mapa mundi (sin niveles)

| Tema |
|---|
| Banderas |
| Capitales |
| Ciudades importantes |
| Continentes |
| Geografía física |
| Récords |

### 2.3 Total agregado

El catálogo distribuido contiene actualmente unas **293 barajas**
entre todos los cursos e idiomas. Cada baraja apunta a **8–15
tarjetas** para una sola sesión. El inventario fichero a fichero
completo está en `/decks/` y se puede consultar con los scripts
estándar del proyecto.

---

## 3. Conceptos pedagógicos (cómo Memofun construye aprendizaje significativo)

La pedagogía de Memofun se apoya en **cuatro** principios
aplicados en todo momento. No son opcionales:

### 3.1 El anverso es una pista, nunca una definición

El anverso de una tarjeta es una **analogía, un ejemplo o un
"por qué importa"** que ancla el concepto en algo que la persona
ya conoce. La tarjeta pide a quien estudia que **recuerde** el
concepto, no que lo **recite**. Esta es la regla más distintiva
del proyecto (ver
[`guia-crear-actividades.md`](guia-crear-actividades.md) §2.2 y
[`SPEC.md`](SPEC.md) §1).

Ejemplos:

| ❌ Recitar | ✅ Recordar |
|---|---|
| "¿Cuál es la definición de fotosíntesis?" | "¿Qué hacen las plantas con la luz, el agua y el CO₂ para fabricar su propia comida?" |
| "¿Quién escribió Don Quijote?" | "¿Qué escritor español perdió la cabeza por leer demasiados libros de caballerías?" |
| "¿Qué es un número primo?" | "¿Qué número tiene exactamente dos amigos: el 1 y él mismo?" |

### 3.2 Repetición con variación

Un concepto clave puede — y debe — reaparecer en más de una
tarjeta y más de una baraja para el mismo tema/curso. A veces de
forma literal (casi la misma pregunta, para consolidar memoria);
a veces variada (la misma idea con un ejemplo o ángulo
diferente). La repetición es **refuerzo**, no un defecto (ver
[`SPEC.md`](SPEC.md) §1.3).

### 3.3 Tarjetas en lectura fácil

Cada tarjeta cumple UNE 153101 — frases cortas, una idea por
frase, vocabulario cotidiano, sin jerga clínica en lo que lee
quien estudia (ver [`SPEC.md`](SPEC.md) §3 y la regla del suite en
[`CLAUDE.md`](CLAUDE.md) §"UNE 153101 reference").

### 3.4 La escalera socrática de pistas

Cuando una tarjeta tiene pista, la pista es un **revelado
parcial del reverso**, nunca una pregunta distinta. Esta es la
regla "pista-antes-de-la-respuesta" del suite (ver
[`guia-crear-actividades.md`](guia-crear-actividades.md) §3 y la
guía canónica de Routime).

---

## 4. Reglas de autoría de barajas

Una baraja "buena" de Memofun cumple estas reglas (justificación
completa en
[`guia-crear-actividades.md`](guia-crear-actividades.md) §2 y §3):

| Regla | Por qué |
|---|---|
| **Conteo de tarjetas**: 8–15 por baraja. | Las sesiones cortas ganan a las largas; una sentada son 5–10 minutos. |
| **Anverso = pista**, nunca definición. | Recordar gana a recitar. |
| **Reverso = una frase**, lectura fácil. | Una idea por frase, palabras llanas. |
| **Sin duplicar el mismo concepto** en la misma baraja. | Dos tarjetas seguidas sobre la misma idea son relleno, no refuerzo. |
| **Repetición entre barajas** bienvenida cuando aporta un matiz. | Misma idea, ángulo distinto, entre barajas = refuerzo. |
| **Etiqueta de tema** que coincide con el curso / nivel. | Para que el filtro por tema la muestre en el grupo correcto. |
| **Todas las cadenas UI** añadidas en AMBOS `strings.es.js` y `strings.en.js`. | Paridad i18n (la exige `scripts/check.js`). |
| **Revisada en voz alta** con la persona (o con alguien que haga de persona) antes de publicar. | Una tarjeta que confunde a quien revisa confundirá a quien estudia. |

---

## 5. Restricciones y contenido prohibido

Estas reglas se aplican a **toda** baraja y **nunca** se rompen
(justificación completa en [`SPEC.md`](SPEC.md) §2 y §3):

- **Sin IA generativa en el producto** — las barajas las revisa y
  cura el rol de apoyo; el runtime nunca llama a un LLM (ver
  [`SPEC.md`](SPEC.md) §2.1).
- **Sin cronómetros, sin puntuación, sin castigo** — el feedback es
  ánimo, no "incorrecto".
- **Sin etiquetas clínicas** sobre la persona usuaria (discapacidad
  intelectual, terapia ocupacional, menores) dentro de la UI.
- **Sin contenido de odio, sexual, político o violento** en los
  textos de las tarjetas.
- **Sin tracking, sin login, sin analítica** — el progreso vive
  solo en `localStorage`.

---

## 6. Ver también

- Producto: [`SPEC.md`](SPEC.md).
- Arquitectura: [`tecnico.md`](tecnico.md).
- Catálogo de barajas (resumen): [`actividades.md`](actividades.md).
- Guía pedagógica (larga):
  [`guia-crear-actividades.md`](guia-crear-actividades.md).
- Creación de barajas con IA: punto de entrada en
  [`guia-ia-crear-barajas.md`](guia-ia-crear-barajas.md).
- Idiomas: [`I18N.md`](I18N.md).
- Para familias y docentes: [`equipo.md`](equipo.md).
