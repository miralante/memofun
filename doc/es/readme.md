# Memofun

**App de tarjetas de estudio basada en aprendizaje significativo: cada tarjeta explica un concepto con una analogía cotidiana, un ejemplo concreto o el «para qué sirve».**

---

## ¿Qué es Memofun?

Memofun es una herramienta digital para repasar lo que ya has estudiado — entre clases, en el autobús, mientras esperas. Cada tarjeta te ofrece una analogía cotidiana, un ejemplo concreto o el problema real que un concepto resuelve, y luego te pide que recuerdes el concepto en sí.

La aplicación está **organizada por barajas**: hay una sola actividad de estudio que sabe mostrar cualquier baraja que siga el esquema. Las barajas las prepara el rol de apoyo (familia, profesor) y se agrupan por **curso** y **nivel**. Ver la lista completa de cursos y barajas en [`actividades.md`](actividades.md).

---

## Características principales

### ✅ Diseñada para la autonomía

- **Sin cronómetro, sin aciertos ni errores**: toca para voltear, navega con flechas
- **Escucha cuando quieras**: un botón 🔊 aparece en cada tarjeta para oírla leída en voz alta
- **Lectura Fácil**: frases cortas, vocabulario cotidiano, una idea por pantalla
- **Refuerzo positivo**: completar una baraja suma una ⭐, nunca se resta

### ✅ Accesible para todos

- **Botones grandes**: mínimo 64×64 píxeles
- **Texto grande**: letra clara y legible (Atkinson Hyperlegible)
- **Alto contraste**: colores claros sobre fondo blanco
- **Navegación por teclado** y soporte completo de `prefers-reduced-motion`

### ✅ Sin IA generativa en el producto

El sitio público de Memofun hace **cero** llamadas a cualquier servicio de IA, y el código **no contiene ninguna integración con APIs**. Cada tarjeta que ves fue escrita directamente por quien mantiene el proyecto, nunca generada en tiempo de ejecución.

### ✅ En dos idiomas

- 🇪🇸 **Español** (predeterminado)
- 🇬🇧 **English** (se puede cambiar desde el menú)

---

## Cómo empezar

### 1. Abrir la aplicación

Visita **[memofun.apptonomia.uk](https://memofun.apptonomia.uk)** o abre `index.html` desde un servidor local. El paso a paso completo con **cuatro formas de abrir Memofun** (internet, ZIP, Python, Node.js) está en [`guia-rapida.md`](guia-rapida.md).

### 2. Elegir una baraja

En la pantalla principal verás tus barajas agrupadas por curso. Elige una para empezar a repasar.

### 3. Lee la pista y recuerda la respuesta

La **cara** de la tarjeta es la pista (analogía, ejemplo o «para qué sirve»). Toca la tarjeta para voltearla y ver la **cruz** — el concepto que se te pedía recordar.

### 4. Cambiar el idioma

Toca el botón del idioma (🇪🇸 o 🇬🇧) en la parte superior de la pantalla.

---

## Ejemplo de uso

Imagina que estás repasando Lengua castellana. Abres la baraja **📚 3º de Primaria / Lengua castellana**. La primera tarjeta muestra:

> *Una pompa de jabón: brilla un momento y luego se deshace.*
>
> ¿Cómo se llama esa imagen?

Piensas un poco, tocas para voltear, y la **cruz** muestra:

> **Desengaño**

Ese es todo el ciclo: pista → recuerdo → revelación.

---

## Qué viene incluido en Memofun

Las barajas actuales cubren los currículos español y británico. Úsalas como plantilla para crear nuevas; la estructura (carpeta por curso, subcarpeta por nivel, archivo JSON por baraja) forma parte del formato.

### 🇪🇸 Español (es)

| Curso | Niveles | Descripción |
|---|---|---|
| **Primaria** | 1–6 | Lengua castellana, Ciencias naturales, Ciencias sociales. |
| **ESO** | 1–4 | Lengua castellana, Geografía e historia, Biología y geología, Física y química. |
| **FP Básica — Servicios administrativos** | 1–2 | Lengua, ciencias, técnicas administrativas, ofimática, atención al cliente, tratamiento de datos. |
| **FP GM — Gestión administrativa** | 1–2 | Comunicación empresarial, empresa y administración, técnica contable, operaciones, sostenibilidad, digitalización. |
| **Mapa mundi** | — | Banderas, capitales, ciudades, continentes, geografía física, récords. |

### 🇬🇧 English (en)

| Course | Levels | Description |
|---|---|---|
| **Key Stage 1** | 1–2 | English Literature, Geography, History, Science. |
| **Key Stage 2** | 3–6 | English Literature, Geography, History, Science. |
| **Key Stage 3** | 7–9 | English Literature, Geography, History, Science. |
| **Key Stage 4** | 10–11 | Combined Science plus the separate Biology, Chemistry and Physics tracks, English Literature, Geography, History. |
| **Entry-Level Business** | 1–2 | Business basics and customer service. |
| **BTEC Business L2** | 1–2 | Business administration, communication, finance, operations. |

---

## Para el rol de apoyo

Si vas a preparar barajas para una persona usuaria, el paso a paso canónico está en [`guia-interna-crear-barajas.md`](guia-interna-crear-barajas.md) (para agentes IA dentro de este repo) y en [`guia-ia-crear-barajas.md`](guia-ia-crear-barajas.md) (para herramientas IA externas). Si no usas herramientas IA, [`guia-chat-ia-crear-barajas.md`](guia-chat-ia-crear-barajas.md) explica un prompt listo para copiar y pegar en cualquier chat de IA.

---

## Más información

- [Guía rápida de uso](guia-rapida.md) — Paso a paso (cuatro formas de abrir Memofun)
- [Catálogo de cursos y barajas](actividades.md) — Lista completa de barajas
- [Guía para familias y docentes](equipo.md) — Cómo encaja Memofun en la rutina de estudio
- [Información técnica](tecnico.md) — Para desarrolladores

---

## Créditos y licencia

Memofun es un proyecto de código abierto, distribuido bajo la licencia MIT. El contenido de las barajas está curado por quien mantiene el proyecto y por colaboradores, nunca se genera en tiempo de ejecución.
