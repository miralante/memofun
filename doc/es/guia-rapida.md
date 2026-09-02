# Guía rápida

> 🌐 **Otro idioma:** [English](../en/quick-guide.md)

Esta guía explica paso a paso cómo usar Memofun: desde cómo abrirla
hasta cómo repasar una baraja, cambiar de idioma o instalarla en el
móvil. Incluye también **cuatro formas de abrir la aplicación**,
ordenadas de la más fácil a la más elaborada.

> 📦 La versión detallada paso a paso (con el recorrido completo de
> instalación PWA, resolución de problemas y equivalentes a capturas
> por botón) vive en la guía canónica transversal:
> [`routime/doc/es/guia-rapida.md`](https://github.com/thenkdframe/routime/blob/main/doc/es/guia-rapida.md).
> El **flujo de apertura, instalación PWA, cambio de idioma y
> resolución de problemas son idénticos** en todas las apps de la
> suite Miralante. Este documento solo recoge lo específico de
> Memofun.

---

## 1. Cómo abrir Memofun

Hay **cuatro formas**, ordenadas de la más fácil a la más
elaborada. El recorrido completo está en la guía canónica enlazada
arriba. La versión corta:

| # | Método | Qué necesitas | ¿Sin conexión? | ¿Instalable como PWA? |
|---|---|---|---|---|
| **A** | Desde internet ([memofun.apptonomia.uk](https://memofun.apptonomia.uk)) | Un navegador | ❌ | ✅ |
| **B** | Descargando el ZIP de GitHub | Un navegador | ❌ | ❌ |
| **C** | Servidor local con Python | Python 3 | ❌ | ✅ |
| **D** | Servidor local con Node.js | Node.js | ✅ | ✅ |

> 💡 Si solo quieres **probar la app**, usa el método **A** o **B**.
> Para la **experiencia completa** (PWA, modo sin conexión, "Añadir
> a pantalla de inicio"), usa **C** o **D**.

---

## 2. La pantalla principal

La pantalla principal muestra una lista de **barajas** organizada por
**curso y nivel**, no una cuadrícula de minijuegos. Toca un curso
para desplegar sus niveles; toca un nivel para desplegar sus
barajas; toca una baraja para abrirla.

La persona usuaria ve **solo las barajas que el rol de apoyo haya
publicado** — los borradores quedan ocultos. Consulta
[`actividades.md`](actividades.md) para ver el catálogo y el formato
de baraja.

## 3. Dentro de una baraja

Una baraja muestra una tarjeta cada vez. El **anverso** es una
pista (analogía, ejemplo o "por qué importa"); toca **Mostrar
respuesta** para revelar el **reverso**. Botones habituales:

- **Mostrar respuesta** — voltea la tarjeta.
- **Pista** — muestra la primera línea del reverso, no la respuesta
  completa.
- **Ya me la sé** — marca la tarjeta como aprendida (aparecerá menos
  a menudo).
- **Volver a repasar** — marca la tarjeta para la próxima sesión.

## 4. Audio

Cuando la tarjeta lleva un audio asociado, aparece el botón 🔊.
Tócalo para escuchar la palabra o frase. Memofun respeta
`prefers-reduced-motion` y la preferencia de audio de los ajustes.

## 5. Mensajes de respuesta

Memofun **no tiene estado de error**. No hay "incorrecto"; cada
repaso marca la tarjeta como "repasar" o "ya me la sé" sin afectar
al progreso ni a las estrellas.

## 6. Estrellas y progreso

Cada tarjeta marcada como "ya me la sé" suma al contador de
estrellas de la baraja. **Las estrellas nunca bajan** — no hay
mecánica de castigo.

## 7. Cambiar idioma

Abre el menú de idioma desde la cabecera (icono del globo 🌐).
Disponibles: **Español (predeterminado)** e **Inglés**. Consulta
[`I18N.md`](I18N.md) para ver cómo añadir un nuevo idioma.

## 8. Ajustes personales

Abre `/settings`. Desde allí puedes:

- Ver **Mi progreso** (tarjetas sabidas vs por repasar por baraja).
- Restablecer progreso (con confirmación, porque es destructivo).
- Gestionar las preferencias de audio y de movimiento reducido.

## 9. Instalar la app en el móvil

Los pasos completos (Android / iOS / escritorio) están en la guía
canónica. Versión corta: abre Memofun en el navegador, elige
"Añadir a pantalla de inicio" / "Instalar", confirma.

## 10. Resolución de problemas

Consulta **§11 Resolución de problemas** de la guía canónica —
esos apartados aplican idénticamente a Memofun.

## 11. Más ayuda

- Producto: [`SPEC.md`](SPEC.md).
- Arquitectura: [`tecnico.md`](tecnico.md).
- Catálogo de barajas: [`actividades.md`](actividades.md).
- Para familias y docentes: [`equipo.md`](equipo.md).
- Creación de barajas con IA: punto de entrada en
  [`guia-ia-crear-barajas.md`](guia-ia-crear-barajas.md).

## 12. Resumen rápido

1. Abre Memofun (4 métodos; el más fácil es **A**).
2. Elige un curso → nivel → baraja desde la lista de inicio.
3. Lee el anverso (pista), toca **Mostrar respuesta**, y luego
   **Ya me la sé** o **Volver a repasar**.
4. Gana estrellas por tarjeta; sin fallos, sin castigo.
5. Cambia idioma con 🌐; instala como PWA para uso sin conexión.
