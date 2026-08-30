# Catálogo de actividades

Memofun es una **app de estudio con tarjetas (flashcards)**, no una
cuadrícula fija de actividades. La unidad de contenido es la
**baraja**: un conjunto de tarjetas en torno a un tema (literatura
inglesa, biología, matemáticas, historia…). Las barajas se organizan
por **curso** y **nivel**, y viven en
[`tools/study/`](../../tools/study/). La persona usuaria revisa la
baraja que el rol de apoyo haya preparado y publicado previamente.

> La descripción canónica del producto (audiencia, regla de "sin IA
> generativa en el producto", flujo del rol de apoyo) está en
> [`SPEC.md`](SPEC.md). El formato del fichero de baraja y la cadena
> de renderizado están en [`tecnico.md`](tecnico.md).

---

## 1. ¿Qué es una "baraja"?

Una baraja es un fichero JSON con una lista ordenada de **tarjetas**.
Cada tarjeta presenta la analogía cotidiana, el ejemplo concreto o el
"por qué importa" de un concepto como pista (el **anverso**), y
pide a quien estudia que recuerde el concepto en sí (el **reverso**).
El formato de tarjeta se define en [`tecnico.md`](tecnico.md) §6 y
la escalera de pistas del método socrático, en
[`guia-crear-actividades.md`](guia-crear-actividades.md) §3.

Una baraja **no** necesita llegar acompañada de una actividad:
Memofun tiene una sola actividad de renderizado (`tools/study/`)
que sabe cómo reproducir cualquier baraja que cumpla el esquema. El
catálogo de abajo enumera los **cursos** y las barajas que contienen
actualmente.

---

## 2. Cursos y barajas que se distribuyen con el proyecto

El contenido actual de `tools/study/` cubre los currículos español y
británico que el proyecto soporta de serie. Úsalo como plantilla
para nuevas barajas; la estructura (carpeta por curso, subcarpeta
por nivel, fichero JSON por baraja) forma parte del formato.

### 2.1 Inglés (en)

| Curso | Niveles | Descripción |
|---|---|---|
| **Key Stage 1** | 1–2 | English Literature, Geography, History, Science. |
| **Key Stage 2** | 3–6 | English Literature, Geography, History, Science. |
| **Key Stage 3** | 7–9 | English Literature, Geography, History, Science. |
| **Key Stage 4** | 10–11 | Combined Science más las vías separadas de Biology, Chemistry y Physics, English Literature, Geography, History. |
| **Entry-Level Business** | 1–2 | Business basics y customer service. |
| **BTEC Business L2** | 1–2 | Business administration, communication, finance, operations. |

### 2.2 Español (es)

| Curso | Niveles | Descripción |
|---|---|---|
| **Primaria** | 1–6 | Lengua castellana, Ciencias naturales, Ciencias sociales. |
| **ESO** | 1–4 | Lengua castellana, Geografía e historia, Biología y geología, Física y química. |
| **FP Básica — Servicios administrativos** | 1–2 | Lengua, ciencias, técnicas administrativas, ofimática, atención al cliente, tratamiento de datos. |
| **FP GM — Gestión administrativa** | 1–2 | Comunicación empresarial, empresa y administración, técnica contable, operaciones, sostenibilidad, digitalización. |
| **Mapa mundi** | — | Banderas, capitales, ciudades, continentes, geografía física, récords. |

---

## 3. Cómo añadir una baraja nueva

Este es el flujo del rol de apoyo (sin tocar código). La guía
paso a paso completa vive en
[`guia-interna-crear-barajas.md`](guia-interna-crear-barajas.md)
(si tu asistente de IA tiene acceso al repositorio) o en
[`guia-chat-ia-crear-barajas.md`](guia-chat-ia-crear-barajas.md)
(si no lo tiene). La versión corta:

1. **Elige el curso y nivel** donde encaja la baraja, o crea una
   carpeta nueva siguiendo el patrón existente.
2. **Escribe el JSON de la baraja** siguiendo el esquema de
   [`tecnico.md`](tecnico.md) §6.
3. **Revisa cada tarjeta** antes de publicar: cada una debe tener
   una pista clara (anverso), una respuesta de una frase (reverso)
   y cumplir las reglas de lectura fácil de [`I18N.md`](I18N.md)
   §3.
4. **Publica** ejecutando el check estándar del proyecto
   (`node scripts/check.js`) y abriendo un PR.

La decisión entre "esta baraja pertenece a un curso existente" y
"esta baraja empieza un curso nuevo" la toma el rol de apoyo; la
guía de arriba incluye una lista de comprobación para mantener la
decisión coherente.
