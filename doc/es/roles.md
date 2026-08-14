# Roles del proyecto

Memofun tiene **tres roles diferenciados**, igual que el resto de la
familia de proyectos (Apptonomia, Calculia, Okeymoney, Sinonimia,
Teclatlon):

| Rol | Quién es | Cómo participa | Dónde mira primero |
|---|---|---|---|
| 👤 **Persona usuaria** (con discapacidad intelectual) | Repasa las barajas | Usa `index.html` y `tools/study/` de forma autónoma. No toca `settings/` ni pide barajas al agente. | La aplicación |
| ❤️ **Apoyo**: familia, docente | Prepara y revisa el contenido | Pide al agente de IA del proyecto que escriba una baraja a partir de un tema, o de un tema + índice detallado si ya tiene un temario propio; revisa el resultado y lo publica en `decks/`. Usa `settings/` para importar barajas propias o ajustar texto/idioma. | [`CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md) |
| 💻 **Construcción**: desarrollador/a | Programa la aplicación | Mantiene el código, revisa PRs, despliega. | [`tecnico.md`](tecnico.md) |

> 💡 La persona usuaria final es siempre alguien con discapacidad
> intelectual. Las decisiones de contenido, lenguaje e interfaz se
> piensan siempre desde su experiencia. Lo que queda fuera de su
> participación son las decisiones técnicas — no por exclusión, sino
> porque es el ámbito de apoyo/construcción.

## Por dónde empezar, según tu perfil

| Si eres… | Empieza por… |
|---|---|
| 👤 Persona usuaria o familiar directo | La aplicación — no hace falta leer nada más |
| ❤️ Familiar o docente que prepara contenido | [`guia-crear-barajas.md`](guia-crear-barajas.md) — paso a paso completo |
| 🤔 Solo quiero entender qué es | [`SPEC.md`](SPEC.md) |
| 💻 Desarrollador/a | [`tecnico.md`](tecnico.md) |
