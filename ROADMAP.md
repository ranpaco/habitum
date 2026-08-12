# Roadmap De Habitum Web

Este roadmap separa lo que existe hoy, lo que falta para un demo funcional y lo que falta para convertir el sitio en producto SaaS real.

Actualizado: 2026-07-10.

## Estado Actual

- Landing page comercial con secciones de problema, solucion, onboarding IA, features, pricing, FAQ y CTA.
- Contenido regional LatAm/USA.
- Formulario de demo conectado a API dev (`POST /api/demo-requests`) con validacion local.
- Onboarding de tres pasos conectado a backend MVP:
  - creacion de sesion/comunidad;
  - carga de archivos a S3 privado con presigned URLs;
  - procesamiento real de CSV, XLSX, PDF, JPG y PNG.
- OCR sincrono con Textract para PDF/JPG/PNG de hasta 5 MB.
- Extraccion estructurada desde CSV/XLSX/OCR, con fallback LLM via Bedrock Converse usando `amazon.nova-micro-v1:0` en dev.
- Pantalla de revision humana antes de confirmar la importacion; permite editar, agregar y eliminar filas.
- Dashboard conectado a API cuando existe `communityId`, con fallback mock si no hay sesion o falla la carga.
- Agente IA demo-grade para reglamentos/documentos subidos:
  - OCR/chunking simple;
  - busqueda lexical sin vector DB;
  - respuestas con citas cuando hay evidencia;
  - gate de alcance para bloquear preguntas fuera de la comunidad administrada.
- Infra AWS dev documentada para API Gateway, Lambda, DynamoDB, S3, Textract, Bedrock y CloudFront/S3 web deploy.
- Repositorio Git inicializado y publicado en `git@github.com:ranpaco/habitum.git`.

## Siguiente Hito Recomendado

Objetivo: dejar el MVP demo mas confiable antes de construir nuevas funcionalidades grandes.

- Agregar GitHub Actions para validar `npm install` y `npm run build` en cada push/PR.
- Revisar vulnerabilidades con `npm audit` en raiz y en `server/lambda/habitum-api/`.
- Separar claramente datos reales, fallback demo y mocks visuales. **Iniciado: fallback de dashboard movido a `src/app/mocks/`.**
- Mejorar estados de UX del demo. **Iniciado: retry en demo request, upload, procesamiento y dashboard live.**
  - carga;
  - error;
  - reintento;
  - confirmaciones de exito;
  - mensajes cuando no hay `communityId`.
- Hacer una prueba manual completa de rutas:
  - `#`;
  - `#demo`;
  - `#onboarding`;
  - `#dashboard`.
- Documentar en README el flujo local completo, despliegue dev y limitaciones actuales del MVP.

## Prioridad 0: Orden Del Proyecto

- Actualizar `README.md` para que describa Habitum, no el bundle original de Figma. **Completado.**
- Decidir gestor oficial de paquetes: `npm`, `pnpm` o `yarn`. **Decision actual: npm, porque existe `package-lock.json`. Pendiente: eliminar o justificar `pnpm-workspace.yaml`.**
- Inicializar Git si este directorio sera la fuente principal del proyecto. **Completado: repo publicado en GitHub.**
- Definir variables de entorno esperadas en un `.env.example`. **Completado para `VITE_API_BASE_URL`.**
- Agregar CI basico con GitHub Actions para build de frontend.
- Crear una convencion para datos mock, por ejemplo `src/app/mocks/`. **Iniciado con `src/app/mocks/dashboard.ts`.**
- Mover textos comerciales hardcodeados a configuraciones regionales cuando aplique.
- Definir si el idioma por defecto sera espanol, ingles o dependiente de region.

## Prioridad 1: Backend Para Demo Real

Objetivo: que el demo deje de ser solo visual y pueda recibir leads, archivos y generar una respuesta demostrable.

Documento operativo: ver `BACKEND_DEMO_STRATEGY.md`.

Avance actual:

- Perfil AWS no-root `habitum-dev` verificado.
- Stack dev `habitum-dev-backend` creado en AWS.
- API Gateway + Lambda + DynamoDB + S3 desplegados.
- `GET /api/health` probado correctamente.
- `POST /api/demo-requests` probado correctamente con escritura en DynamoDB.
- Endpoints base de onboarding y dashboard probados correctamente.
- Frontend conectado a `POST /api/demo-requests`.
- Paso 1 de onboarding conectado a sesiones/comunidades reales.
- Paso 2 de onboarding conectado a S3 con presigned URLs.
- Upload end-to-end verificado: presign -> PUT S3 -> complete -> status `files_uploaded`.
- Paso 3 conectado a procesamiento real para CSV.
- Procesamiento end-to-end verificado: CSV en S3 -> resumen -> status `completed` -> dashboard poblado.
- Procesamiento XLSX end-to-end verificado: XLSX en S3 -> resumen -> status `completed` -> dashboard poblado.
- OCR Textract end-to-end verificado: PDF en S3 -> OCR -> filas estructuradas -> dashboard poblado.
- Bedrock Converse activado en dev con `amazon.nova-micro-v1:0`; extraccion LLM desde OCR desordenado verificada.
- Pantalla de revision/correccion implementada antes del dashboard; permite editar, agregar y eliminar filas.
- Endpoint `PATCH /api/onboarding/sessions/{sessionId}/review` desplegado y verificado; recalcula metricas antes de abrir dashboard.
- Dashboard conectado a `GET /api/communities/{communityId}/dashboard` cuando existe `communityId`.
- RAG demo-grade para reglamentos implementado: OCR de PDF/imagen -> chunks de conocimiento -> `POST /api/communities/{communityId}/agent/ask`.
- Prueba RAG end-to-end verificada con PDF de reglamento: pregunta sobre mascotas respondida con cita y confianza alta.
- Gate de alcance del agente implementado y verificado: preguntas no relacionadas al condominio/sitio retornan `outOfScope: true` sin consultar conocimiento externo.
- Checklist inicial de documentos HOA/USA agregado a onboarding: governing documents, finanzas/assessments, owner roster, meetings/elections, insurance/contracts y compliance workflow.

- Crear API para solicitud de demo:
  - guardar nombre, email, telefono, pais, condominio, tamano y rol; **MVP completado con DynamoDB**;
  - enviar notificacion interna;
  - enviar email de confirmacion al lead.
- Crear API para onboarding demo:
  - crear cuenta demo o sesion temporal; **MVP completado como sesion temporal**;
  - recibir metadata del condominio; **MVP completado**;
  - aceptar carga de Excel, PDF e imagenes; **MVP completado con S3 presigned URLs**;
  - almacenar archivos de forma segura; **MVP completado en S3 privado con lifecycle de 30 dias**.
- Implementar procesamiento inicial:
  - OCR sincrono con Textract para PDF/JPG/PNG de hasta 5 MB; **MVP completado**;
  - OCR asincrono para PDFs/imagenes grandes o multi-pagina;
  - parsing XLSX; **MVP completado**;
  - parsing `.xls` legacy;
  - parsing CSV; **MVP completado**;
  - extraccion estructurada de unidades, propietarios y saldos desde CSV/XLSX/OCR lineal; **MVP completado**;
  - extraccion LLM desde OCR desordenado; **MVP completado con Amazon Nova Micro en Bedrock**;
  - extraccion de reglamentos; **MVP completado con OCR + chunks simples**;
  - validacion humana o pantalla de revision antes de confirmar importacion; **MVP completado**.
- Persistir resultados:
  - comunidades/condominios; **MVP completado en DynamoDB**;
  - unidades; **MVP completado como datos importados/revisados**;
  - propietarios/residentes; **MVP completado como datos importados/revisados**;
  - saldos/deudas; **MVP completado como datos importados/revisados**;
  - documentos/reglamentos; **MVP completado como archivos + chunks simples de conocimiento**;
  - eventos de importacion; **pendiente como auditoria formal**.
- Reemplazar resultados mock de `Step3Processing.tsx` por datos reales de una respuesta de backend. **MVP completado para CSV/XLSX/OCR/LLM con pantalla de revision**.
- Reemplazar `Dashboard.tsx` mock por datos obtenidos desde API. **Parcial: usa API con `communityId`, conserva fallback mock.**

## Prioridad 2: Experiencia Del Demo Comercial

- Crear un demo guiado con datos reales de muestra para LatAm y USA.
- Permitir probar preguntas al agente IA:
  - "Cuanto debo?";
  - "Puedo reservar el salon?";
  - "Que dice el reglamento sobre mascotas?";
  - "Como reporto una filtracion?";
- Mostrar comparacion antes/despues del trabajo administrativo.
- Agregar estados de carga, error, exito y reintento en formularios.
- Agregar confirmaciones claras despues de enviar una solicitud.
- Instrumentar eventos de conversion:
  - click en CTA;
  - inicio de onboarding;
  - carga de archivo;
  - solicitud de demo;
  - seleccion de plan.

## Prioridad 3: Agente IA Y Base De Conocimiento

- Definir arquitectura RAG para reglamentos, actas, politicas y FAQs del condominio. **MVP demo completado sin vector DB**.
- Crear pipeline de ingestion documental:
  - carga; **MVP completado desde onboarding**;
  - OCR; **MVP completado para PDF/JPG/PNG sincrono**;
  - chunking; **MVP completado con busqueda lexical simple**;
  - checklist inicial de documentos esperados HOA/USA; **MVP completado**;
  - clasificacion automatica de documentos por tipo;
  - embeddings;
  - almacenamiento vectorial;
  - versionado de documentos.
- Crear reglas de respuesta del agente:
  - responder solo con base en documentos del condominio cuando aplique; **MVP completado**;
  - bloquear preguntas no relacionadas con la comunidad administrada; **MVP completado con gate lexical**;
  - escalar a humano cuando no haya certeza; **MVP completado via `needsHumanReview`**;
  - registrar intencion, usuario, unidad y resultado.
- Crear canales:
  - WhatsApp para LatAm;
  - portal web/SMS/email para USA;
  - futuro mobile app.
- Crear auditoria de conversaciones para administradores.

## Prioridad 4: Cobranza Y Conciliacion

- Modelar cuotas, saldos, recargos, descuentos y pagos parciales.
- Soportar multimoneda LatAm:
  - USD;
  - moneda local;
  - tasa de cambio por fecha;
  - Zelle/Pago Movil/transferencias.
- Soportar USA:
  - ACH;
  - assessment collection;
  - reportes auditables.
- Crear conciliacion asistida por IA:
  - lectura de comprobantes;
  - matching contra deuda;
  - deteccion de duplicados;
  - cola de revision manual.
- Crear reportes de morosidad, flujo de caja y cobranza.

## Prioridad 5: Producto SaaS

- Autenticacion y autorizacion:
  - admin;
  - junta/board;
  - residente;
  - soporte interno.
- Multi-tenant real por comunidad/condominio.
- Panel administrativo completo:
  - residentes;
  - unidades;
  - pagos;
  - documentos;
  - tickets;
  - conversaciones IA;
  - configuracion de canales.
- Portal del residente:
  - saldo;
  - pagos;
  - documentos;
  - solicitudes;
  - reservas;
  - historial.
- Billing SaaS por plan y numero de unidades.
- Roles, permisos y auditoria.

## Prioridad 6: Calidad, Seguridad Y Compliance

- Agregar TypeScript estricto si no esta activado.
- Agregar linting y formateo.
- Revisar y corregir vulnerabilidad reportada por `npm install`:
  - estado actual: `1 high severity vulnerability`;
  - no ejecutar `npm audit fix --force` sin revisar impacto porque puede cambiar versiones mayores;
  - definir si se corrige con upgrade puntual de dependencia transitiva o ajuste de paquete raiz.
- Revisar vulnerabilidades moderadas reportadas durante deploy Lambda:
  - estado actual: `24 moderate severity vulnerabilities` en `server/lambda/habitum-api`;
  - no aplicar `npm audit fix` automatico hasta revisar si afecta `jszip`, `fast-xml-parser` o AWS SDK.
- Agregar tests unitarios para helpers y componentes criticos.
- Agregar tests e2e para landing, demo y onboarding.
- Agregar manejo centralizado de errores.
- Agregar politica de privacidad, terminos y consentimiento de tratamiento de datos.
- Cifrar archivos y datos sensibles en reposo y transito.
- Definir retencion/borrado de documentos.
- Revisar requisitos por mercado:
  - LatAm: privacidad, comprobantes, canales de mensajeria.
  - USA: HOA/COA, audit trails, privacidad estatal, pagos ACH.

## Prioridad 7: Marketing Y Conversion

- Ajustar copy para explicar claramente:
  - ahorro de tiempo;
  - friccion cero;
  - IA por WhatsApp en LatAm;
  - portal/omnichannel en USA;
  - conciliacion multimoneda;
  - digitalizacion en 10 minutos.
- Agregar casos de uso por pais y tipo de comunidad.
- Agregar pruebas sociales reales cuando existan.
- Agregar pagina o seccion para administradores con multiples edificios.
- Crear comparativas contra administracion tradicional y software legacy.
- Mejorar SEO tecnico:
  - metadata;
  - Open Graph;
  - sitemap;
  - schema;
  - performance.

## Decisiones Pendientes

- Backend: Node/Nest, Next.js API, Supabase, Firebase, Rails, Django u otra opcion.
- Base de datos principal: Postgres recomendado para multi-tenant y reportes.
- Storage: S3-compatible, Supabase Storage, Cloudflare R2 u otro.
- Vector DB: pgvector, Pinecone, Weaviate u otro.
- Proveedor IA: OpenAI, Azure OpenAI u opcion hibrida.
- Extraccion OCR LLM: Amazon Bedrock Converse implementado con `amazon.nova-micro-v1:0` en dev.
- Canal WhatsApp: Twilio, Meta Cloud API, 360dialog u otro BSP.
- Procesador de pagos por region.
- CRM interno para leads o integracion con herramienta externa.
