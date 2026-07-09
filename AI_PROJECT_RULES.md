# Reglas Para IA Que Modifique Habitum Web

Estas reglas son obligatorias para cualquier agente IA o desarrollador que modifique este proyecto.

## Contexto Que Debe Respetarse

- Habitum no es una landing generica SaaS; es una plataforma PropTech de IA para administracion de condominios.
- La ventaja competitiva central es "Friccion Cero": subir fotos, Excel o PDFs y transformar datos/reglamentos en un sistema operativo funcional en minutos.
- LatAm y USA tienen necesidades diferentes:
  - LatAm: WhatsApp, multimoneda, Zelle/Pago Movil, informalidad documental, administradores saturados.
  - USA: HOA/COA, portal, SMS/email, ACH, compliance, auditoria y covenants.
- Cualquier feature nueva debe reforzar ahorro de tiempo, automatizacion, confianza y reduccion de trabajo manual.

## Orden Tecnico

- Antes de editar, revisar archivos relacionados con `rg` y leer el componente/configuracion existente.
- Mantener cambios pequenos y enfocados.
- No crear componentes duplicados si existe uno reutilizable en `src/app/components`.
- No editar componentes `ui/` salvo que el cambio sea realmente del sistema base.
- No hardcodear contenido regional si pertenece a `src/app/config`.
- No mezclar datos mock con datos reales. Si se agrega mock data, ubicarlo en una carpeta clara como `src/app/mocks/`.
- No introducir dependencias nuevas sin justificar su necesidad.
- No guardar secretos ni API keys en el frontend.
- No usar comandos destructivos ni borrar archivos sin confirmacion humana.

## Estilo De Codigo

- Usar TypeScript/TSX consistente con el proyecto.
- Preferir componentes funcionales.
- Usar nombres descriptivos: `OnboardingFlow`, `RegionalPricing`, `RequestDemo`.
- Mantener props tipadas. Evitar `any` en codigo nuevo salvo que sea una transicion temporal documentada.
- Extraer helpers solo cuando reduzcan complejidad real.
- Evitar comentarios obvios; comentar solo decisiones o bloques complejos.
- Mantener imports limpios y eliminar codigo muerto.

## Estilo Visual

- Mantener la identidad visual principal:
  - azul profundo `#1A365D`;
  - cyan `#00A3BF`;
  - fondos claros y jerarquia limpia.
- Usar cards solo cuando representen elementos concretos, formularios, modales o items repetidos.
- Evitar saturar la interfaz con gradientes, sombras o decoracion si no mejora la conversion.
- Cuidar responsive en mobile y desktop.
- Verificar que textos largos no rompan botones, cards o tablas.
- Evitar mezclar ingles y espanol en una misma experiencia salvo que sea intencional por region.

## Copy Y Producto

- Hablar de "administradores", "condominios", "comunidades", "vecinos/residentes", "junta/board" segun region.
- En LatAm, priorizar:
  - WhatsApp;
  - cobranza multimoneda;
  - digitalizacion desde papel/Excel;
  - consultas 24/7 de vecinos.
- En USA, priorizar:
  - HOA/COA;
  - assessments;
  - covenants;
  - ACH;
  - audit-ready reporting;
  - resident portal.
- No prometer capacidades legales, financieras o de IA como si estuvieran certificadas si aun no existen.
- Si una capacidad es demo/mock, indicarlo internamente en codigo o documentacion.

## Backend E Integraciones

- Crear una capa de servicios/API antes de conectar formularios o dashboards a backend.
- Validar inputs en frontend y backend.
- Tratar archivos subidos como informacion sensible.
- Separar claramente:
  - leads comerciales;
  - cuentas demo;
  - datos reales de condominios;
  - documentos/reglamentos;
  - conversaciones IA.
- Toda integracion con IA debe tener manejo de errores, timeouts y fallback.
- Toda respuesta del agente sobre reglamentos debe poder rastrearse a una fuente o escalarse a humano.

## Testing Y Verificacion

- Despues de cambios visuales, correr build si las dependencias estan instaladas: `npm run build`.
- Si se agrega logica, agregar pruebas o dejar documentado por que no se agregaron.
- Verificar al menos:
  - landing sin hash;
  - `#demo`;
  - `#onboarding`;
  - `#dashboard`.
- Revisar consola del navegador si se trabaja en UI.
- No cerrar una tarea diciendo que esta lista si no se verifico lo minimo posible.

## Documentacion

- Actualizar `PROJECT_STRUCTURE.md` cuando cambie la arquitectura.
- Actualizar `ROADMAP.md` cuando una tarea importante pase a estar terminada o deje de aplicar.
- Actualizar este archivo cuando se detecte una regla recurrente que evite desorden.
- Mantener la documentacion breve, util y accionable.

