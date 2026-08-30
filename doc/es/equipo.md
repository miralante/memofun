# Guía para profesionales y familias

Esta guía está pensada para docentes, familias y personal de apoyo
que quieran usar Memofun como herramienta de repaso con una
persona.

---

## ¿Para quién es Memofun?

Memofun está diseñado principalmente para:

- **Personas con discapacidad intelectual** que quieran repasar
  temas ya trabajados a su propio ritmo.
- **Familias** que buscan una forma sin presión de repetir
  contenidos escolares en casa.
- **Docentes y terapeutas** que quieran preparar barajas a medida
  para una persona o un grupo pequeño.

La aplicación **no sustituye** la enseñanza ni la terapia, pero
puede servir como:

- Un ritual de repaso diario entre sesiones o clases.
- Una herramienta de práctica autónoma, usada por la persona sola.
- Una forma de que el rol de apoyo vea qué tarjetas ya se saben de
  memoria y cuáles aún necesitan trabajo.

---

## Cómo usar Memofun con una persona

### Antes de la primera sesión

Memofun trae un catálogo de barajas de partida (ver
[`actividades.md`](actividades.md)). Antes de la primera sesión,
decide:

1. **Qué curso y nivel** encajan con lo que la persona está
   estudiando ahora. Si nada encaja, pasa al apartado "Preparar una
   baraja a medida" más abajo.
2. **Qué número de tarjetas** es realista para una sola sesión. Una
   sesión típica son **5–10 tarjetas**, no una baraja entera. La app
   no impone un tope, pero las sesiones cortas funcionan mejor.
3. **Cuáles son los criterios del repaso** (p. ej. "hoy miramos
   solo tarjetas de ciencias").

### Durante la sesión

- Abre la baraja desde la cuadrícula de inicio.
- **Leed el anverso en voz alta juntos** la primera vez, y deja
  que la persona toque para voltear.
- Usa el **botón de pista** si la persona se atasca; muestra la
  primera línea del reverso sin revelar la respuesta completa.
- Usa **"Ya me la sé"** y **"Volver a repasar"** para controlar qué
  tarjetas vuelven en la próxima sesión. El orden de las tarjetas
  en una sesión se ve influido por esas marcas (las marcadas para
  repaso tienden a volver antes).

### Después de la sesión

- Memofun guarda el historial por tarjeta **solo en el
  `localStorage` de este navegador**. No sale del dispositivo.
- Restablecer el progreso es una acción destructiva (aparece una
  confirmación) — úsala solo al empezar un tema nuevo.

---

## Preparar una baraja a medida

Esta es la tarea del **rol de apoyo**. El flujo completo vive en
[`guia-interna-crear-barajas.md`](guia-interna-crear-barajas.md)
(cuando tu asistente de IA tiene acceso al repositorio) o en
[`guia-chat-ia-crear-barajas.md`](guia-chat-ia-crear-barajas.md)
(cuando no lo tiene). La versión corta:

1. **Elige un tema pequeño y bien definido** (un capítulo, una
   unidad). Una baraja de 12 tarjetas enfocadas gana a una de 60
   mezcladas.
2. **Escribe el anverso como pista**, no como definición para
   recitar. La tarjeta debería preguntar "¿cuándo verías esto?" o
   "¿de qué es esto un ejemplo?", nunca "¿cuál es la definición
   de X?".
3. **Escribe el reverso en una sola frase** con vocabulario
   cotidiano, siguiendo las reglas de lectura fácil de
   [`I18N.md`](I18N.md) §3.
4. **Revisa la baraja en voz alta** con la persona (o con un
   compañero que haga de persona) antes de publicar. Una tarjeta
   que confunde a quien revisa confundirá a quien estudia.
5. **Abre un PR** con el fichero JSON de la baraja y ejecuta
   `node scripts/check.js`.

---

## Privacidad

- Sin login, sin cuenta, sin analítica, sin llamadas de red.
- El progreso vive en `localStorage` y solo en el navegador donde
  está abierta la app.
- Distintos navegadores en el mismo dispositivo guardan progresos
  independientes; la persona usa siempre el mismo navegador para
  mantener la racha.

---

## Más recursos

- Catálogo de actividades (barajas por curso y nivel):
  [`actividades.md`](actividades.md).
- Guía interna de creación de barajas con IA:
  [`guia-interna-crear-barajas.md`](guia-interna-crear-barajas.md).
- Guía de creación de barajas con chat de IA:
  [`guia-chat-ia-crear-barajas.md`](guia-chat-ia-crear-barajas.md).
- Punto de entrada de guías de IA (cuál seguir):
  [`guia-ia-crear-barajas.md`](guia-ia-crear-barajas.md).
- Guía transversal para familias sobre el suite más amplio:
  [`equipo.md` de Routime](https://github.com/thenkdframe/routime/blob/main/doc/es/equipo.md).
