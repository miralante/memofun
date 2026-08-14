# Política de seguridad

> 🌐 **Otros idiomas:** [English](SECURITY.md)

Memofun es una aplicación web completamente del lado del cliente y sin
dependencias: no tiene servidor propio, ni backend, ni base de datos,
ni telemetría, ni ninguna librería de terceros (ni siquiera por CDN), y
el código no contiene ninguna integración con ninguna API externa —
tampoco de IA. La superficie de ataque es la del navegador sobre el
mismo origen. Las utilidades de `scripts/` (Node.js, sin paquetes npm)
corren en local, fuera del sitio, no hacen ninguna llamada de red, y
no exponen ningún servicio.

## Versiones soportadas

Solo la rama principal recibe parches de seguridad. No mantenemos
versiones antiguas.

## Cómo reportar una vulnerabilidad

Abre un aviso privado a través de GitHub Security Advisories del
repositorio, o abre un issue etiquetado claramente como **security**
con el prefijo `[SEC]` en el título si no puedes usar Security
Advisories. **No subas pruebas de concepto explotables** a un issue
público: espera a que una persona mantenedora coordine.

Incluye:

- Descripción breve y pasos para reproducir.
- Impacto observado o esperado.
- SHA de commit o etiqueta afectada.

## Qué esperar

- Acuse de recibo en 5 días laborables.
- Primera evaluación (reproducción, severidad, plan) en 15 días
  laborables.
- Si se confirma, un parche o mitigación en cuanto sea viable.

## Divulgación coordinada

Preferimos coordinar la divulgación si la corrección requiere cambios
visibles en la UI o en el shell de la PWA.
