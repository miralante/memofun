# Guía para crear actividades / barajas

> **Cómo diseñar y construir una baraja nueva en Memofun.**
>
> Las "actividades" de Memofun son **barajas**: ficheros JSON que
> describen una secuencia de tarjetas. Hay exactamente **una actividad
> de renderizado** (`tools/study/`) que sabe cómo reproducir
> cualquier baraja bien formada; el trabajo pedagógico ocurre al
> escribir la propia baraja.
>
> Este documento **no** duplica la guía pedagógica canónica del
> suite; apunta a ella y solo recoge lo específico de Memofun. Si
> una regla aquí entra en conflicto con la guía canónica o con
> `tecnico.md`, `tecnico.md` gana.

---

## 1. La guía pedagógica canónica

Las técnicas didácticas, de gamificación, de persuasión y de
neuromarketing completas que comparten todos los proyectos hermanos
de Apptonomia viven en el repositorio de **Routime** en
[`guia-crear-actividades.md`](https://github.com/thenkdframe/routime/blob/main/doc/es/guia-crear-actividades.md).

Léela antes de diseñar nada. Cubre (entre otras cosas):

- Las 13 reglas obligatorias de accesibilidad (con su porqué).
- La escalera de pistas del método socrático (pista → pista más
  grande → respuesta).
- La paleta de refuerzo positivo (sonidos, animaciones, micro-copy).
- Los patrones de neuromarketing adaptados a la audiencia.
- La lista de comprobación del diseño de niveles (progresión
  Fácil → Medio → Difícil).

## 2. Lo específico de Memofun (barajas, no actividades)

### 2.1 Una actividad, muchas barajas

No crees una carpeta nueva en `tools/` para cada tema. Crea un
fichero JSON de baraja en `tools/study/<curso>/<nivel>/<tema>.json` y
deja que la actividad existente `tools/study/` la renderice. Las
carpetas de "actividad" nuevas solo deberían aparecer para modos de
juego genuinamente nuevos (modo quiz, juego con tiempo, etc.) y
deben consensuarse con el rol de build antes de añadirse.

### 2.2 La regla "el anverso es una pista"

El anverso de una tarjeta **nunca** es "¿Cuál es la definición de
X?". Siempre es una pista que ancla el concepto en algo que la
persona ya conoce: una analogía cotidiana, un ejemplo concreto o
un "por qué importa". La tarjeta pide a quien estudia que
**recuerde** el concepto, no que lo **recite**.

Esto forma parte de la regla de "aprendizaje significativo" del
producto (ver [`SPEC.md`](SPEC.md) §1). Una tarjeta que incumple
esta regla se rechaza en revisión, por muy correcto que sea su
reverso.

### 2.3 Repetición con variación

Un concepto clave puede — y debe — reaparecer en más de una tarjeta
y más de una baraja para el mismo tema/curso. A veces de forma
literal (casi la misma pregunta, para consolidar memoria); a veces
variada (la misma idea con un ejemplo o ángulo distinto). La
revisión no descarta una tarjeta solo por parecerse a otra;
descarta una tarjeta que se repite sin aportar ningún matiz,
ejemplo o contexto nuevo.

### 2.4 Convenciones de curso y nivel

Las barajas viven en
`tools/study/<locale>/<curso>/<nivel>/<tema>.json`. Añadir un curso
nuevo (un currículo nuevo) o un nivel nuevo (un año escolar más)
sigue el patrón de carpetas existente; consulta
[`actividades.md`](actividades.md) §2 para los cursos que se
distribuyen ahora.

## 3. La receta técnica

El esquema JSON de la baraja, las reglas de validación y la lista
de comprobación de publicación se describen en
[`tecnico.md`](tecnico.md) §6. El flujo del rol de apoyo con un
asistente de IA que tiene acceso al repositorio está en
[`guia-interna-crear-barajas.md`](guia-interna-crear-barajas.md);
con un chat de IA suelto, en
[`guia-chat-ia-crear-barajas.md`](guia-chat-ia-crear-barajas.md).

## 4. Lista de comprobación antes de abrir un PR

- [ ] Fichero JSON de baraja creado en la carpeta correcta de
      curso / nivel.
- [ ] Cada anverso es una **pista**, no una definición para
      recitar.
- [ ] Cada reverso es **una frase** en vocabulario de lectura
      fácil.
- [ ] La repetición, cuando aparece, añade un matiz o ejemplo
      nuevo.
- [ ] El número de tarjetas es realista para una sesión (objetivo
      8–15 tarjetas por baraja en la primera publicación; barajas
      largas se pueden partir).
- [ ] Baraja revisada en voz alta con la persona (o con alguien
      haciendo de persona) antes de publicar.
- [ ] `node scripts/check.js` pasa.
- [ ] Caché del service worker: `VERSION` subida en `sw.js` si la
      nueva baraja debe estar disponible sin conexión (por
      defecto: sí).

## 5. Ver también

- Guía pedagógica canónica (Routime):
  [guia-crear-actividades.md](https://github.com/thenkdframe/routime/blob/main/doc/es/guia-crear-actividades.md).
- Creación interna de barajas con IA:
  [`guia-interna-crear-barajas.md`](guia-interna-crear-barajas.md).
- Creación de barajas con chat de IA:
  [`guia-chat-ia-crear-barajas.md`](guia-chat-ia-crear-barajas.md).
- Receta técnica: [`tecnico.md`](tecnico.md) §6.
- Reglas innegociables del producto: [`SPEC.md`](SPEC.md).
- Catálogo de barajas: [`actividades.md`](actividades.md).
