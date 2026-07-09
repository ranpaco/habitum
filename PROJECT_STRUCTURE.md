# Estructura Del Proyecto Habitum Web

Este documento describe la estructura actual del sitio web de Habitum para que futuras modificaciones mantengan orden, contexto de producto y consistencia técnica.

## Resumen Del Producto

Habitum es un ecosistema PropTech impulsado por IA para administracion de condominios y comunidades residenciales.

La propuesta central es "Friccion Cero": el administrador puede subir fotos, PDFs o Excel de listas de propietarios, deudas y reglamentos; la IA estructura la base de datos y digitaliza el conocimiento operativo en minutos. Desde ahi, un agente de IA atiende vecinos 24/7, especialmente por WhatsApp en LatAm y mediante portal/SMS/email en Estados Unidos.

## Estado Actual

El proyecto actual es un frontend Vite + React conectado a un backend MVP en AWS para landing, demo, onboarding, procesamiento de archivos, revision de datos y dashboard.

El flujo demo ya persiste solicitudes, sesiones, metadata, archivos subidos, resultados de procesamiento y datos revisados. Aun quedan datos mock en secciones visuales del dashboard/agente y en contenido comercial, pero el recorrido principal `demo -> onboarding -> upload -> procesamiento -> revision -> dashboard` ya funciona contra API.

## Stack

- Build tool: Vite.
- Framework UI: React 18.
- Lenguaje: TypeScript/TSX.
- Estilos: Tailwind CSS 4, CSS global y componentes con clases utilitarias.
- Componentes base: Radix UI/shadcn-style en `src/app/components/ui`.
- Iconos: `lucide-react` y algunos paquetes MUI disponibles.
- Routing actual: hash routing manual en `src/app/App.tsx`.

## Archivos Raiz

- `package.json`: scripts, dependencias y versionado del paquete.
- `vite.config.ts`: configuracion de Vite y React.
- `postcss.config.mjs`: configuracion PostCSS/Tailwind.
- `pnpm-workspace.yaml`: workspace PNPM.
- `index.html`: HTML base montado por Vite.
- `README.md`: instrucciones basicas heredadas del bundle inicial.
- `ATTRIBUTIONS.md`: atribuciones de assets.
- `default_shadcn_theme.css`: tema base generado.
- `guidelines/Guidelines.md`: archivo de guias inicial generado, aun con contenido placeholder.
- `.env.example`: variable esperada para conectar el frontend con el backend AWS.
- `AWS_BOOTSTRAP.md`: acceso AWS seguro y perfil `habitum-dev`.
- `BACKEND_DEMO_STRATEGY.md`: estrategia backend para demo, onboarding y dashboard.
- `infra/aws/`: infraestructura AWS CloudFormation y script de deploy dev.
- `server/lambda/habitum-api/`: backend Lambda MVP para endpoints iniciales.

## Directorio `src`

- `src/main.tsx`: punto de entrada de React.
- `src/styles/`: estilos globales, tema, Tailwind y fuentes.
- `src/imports/`: imports o contenido auxiliar heredado, por ejemplo `pricing-page.md`.
- `src/app/`: aplicacion principal.

## Directorio `infra/aws`

- `template.yaml`: CloudFormation para S3, DynamoDB, Lambda, API Gateway, CloudWatch e IAM.
- `deploy-dev.sh`: empaqueta la Lambda, sube el artefacto y despliega el stack `habitum-dev-backend`.
- `parameters.dev.json`: parametros base de ambiente dev.
- `README.md`: instrucciones y outputs del despliegue.

## Directorio `server/lambda/habitum-api`

- `index.mjs`: Lambda backend MVP.
- `package.json`: dependencias del runtime Lambda.
- `package-lock.json`: lockfile generado al instalar dependencias para deploy.

Endpoints actuales:

- `GET /api/health`.
- `POST /api/demo-requests`.
- `POST /api/onboarding/sessions`.
- `PATCH /api/onboarding/sessions/{sessionId}/account`.
- `POST /api/onboarding/sessions/{sessionId}/files/presign`.
- `POST /api/onboarding/sessions/{sessionId}/files/complete`.
- `POST /api/onboarding/sessions/{sessionId}/process`.
- `PATCH /api/onboarding/sessions/{sessionId}/review`.
- `GET /api/onboarding/sessions/{sessionId}/status`.
- `GET /api/communities/{communityId}/dashboard`.
- `POST /api/communities/{communityId}/agent/ask`.

## Directorio `src/app`

- `App.tsx`: decide la vista activa segun hash:
  - `#` o sin hash: landing.
  - `#onboarding`: flujo de onboarding.
  - `#dashboard`: dashboard; acepta `#dashboard?communityId=...`.
  - `#demo`: solicitud de demo.
- `pages/LandingPage.tsx`: compone la landing con secciones comerciales.
- `context/RegionContext.tsx`: contexto de pais/region.
- `config/`: contenido regional, pricing y FAQ.
  - `hoaDocumentChecklist.ts`: checklist inicial de documentos esperados para onboarding HOA/COA en Estados Unidos.
- `components/`: componentes de landing, demo, dashboard y UI.
- `services/`: cliente API y wrappers para demo, onboarding y dashboard.
- `types/`: contratos TypeScript compartidos entre componentes y servicios.

## Componentes Principales

- `Header.tsx`: navegacion principal y selector regional.
- `Hero.tsx`: hero de posicionamiento comercial.
- `RegionalLifestyleShowcase.tsx`: muestra visual segun region.
- `Problem.tsx`: pain points de administradores.
- `Solution.tsx`: solucion Habitum.
- `AIOnboarding.tsx`: narrativa de carga IA/friccion cero.
- `Features.tsx`: caracteristicas principales.
- `Trust.tsx`: confianza/prueba social.
- `PricingPage.tsx` y `Pricing.tsx`: pricing regional.
- `CategorizedFAQ.tsx`: preguntas frecuentes por region.
- `CTABanner.tsx`: llamada final a accion.
- `Footer.tsx`: cierre del sitio.
- `RequestDemo.tsx`: formulario de solicitud de demo con validacion local.
- `DemoFlow.tsx`: alterna entre formulario y pantalla de exito.
- `DemoSuccess.tsx`: confirmacion visual de demo.
- `Dashboard.tsx`: dashboard mock posterior al onboarding.

## Onboarding

El flujo vive en `src/app/components/onboarding/`.

- `OnboardingFlow.tsx`: orquesta tres pasos con estado local.
- `Step1AccountSetup.tsx`: datos de cuenta, condominio, pais y moneda; crea sesion/comunidad en backend.
- `Step2Upload.tsx`: drag and drop de Excel, PDF o imagenes; sube archivos a S3 con URLs firmadas.
- `Step3Processing.tsx`: inicia procesamiento backend, consulta estado, muestra resumen/preview y permite revisar/agregar/eliminar filas antes de abrir el dashboard.
- `ProgressIndicator.tsx`: indicador visual de pasos.

Actualmente los pasos 1, 2 y 3 persisten en backend. El procesamiento soporta CSV, XLSX estructurado y OCR sincrono con Textract para PDF/JPG/PNG de hasta 5 MB. Tambien existe extraccion LLM de texto OCR desordenado con Bedrock Converse; dev usa `BEDROCK_MODEL_ID=amazon.nova-micro-v1:0`. La pantalla de revision confirma los datos finales con `PATCH /api/onboarding/sessions/{sessionId}/review` y recalcula metricas antes del dashboard. El texto OCR de reglamentos PDF/imagen se guarda como chunks simples de conocimiento y el dashboard puede consultar `POST /api/communities/{communityId}/agent/ask`; ese endpoint tiene un gate de alcance para no responder preguntas fuera del condominio/sitio administrado. `.xls` legacy, OCR asincrono y vector DB quedan para siguientes fases.

## Contenido Regional

El sitio diferencia LatAm y USA mediante `RegionContext`.

- Paises soportados en contexto: `VE`, `CO`, `CL`, `MX`, `US`.
- La region se calcula asi:
  - `US` => `usa`.
  - cualquier otro pais => `latam`.
- `regionalContent.ts`: copies, beneficios e imaginario de producto.
- `regionalPricing.ts`: planes y precios por region.
- `regionalFAQ.ts`: preguntas frecuentes regionales.

Regla importante: cualquier nuevo contenido comercial debe revisar primero estos archivos antes de hardcodear texto en componentes.

## Checklist HOA/USA

El onboarding muestra una referencia de documentos comunes para HOAs/COAs en Estados Unidos desde `src/app/config/hoaDocumentChecklist.ts`.

La lista agrupa documentos en:

- Governing documents.
- Financial and assessment records.
- Owners, lots and access data.
- Meetings, elections and board governance.
- Insurance, contracts and vendors.
- Compliance, requests and legal workflow.

Esta lista es una guia de producto para clasificacion documental y demo; no debe presentarse como requisito legal universal porque cada estado y comunidad puede exigir documentos distintos.

## Convenciones Actuales

- La marca usa principalmente `#1A365D` y `#00A3BF`.
- Muchos componentes usan gradientes, sombras y cards.
- Varias pantallas estan en ingles aunque el mercado LatAm usa copy en espanol.
- Hay datos mock en componentes visuales, especialmente onboarding y dashboard.
- El proyecto no tiene tests configurados actualmente.
- La carpeta actual no esta inicializada como repositorio Git.

## Areas Sensibles

- No mezclar datos mock con integraciones reales sin una capa clara de servicios.
- No duplicar copy regional dentro de componentes si ya pertenece a `config/`.
- No convertir el hash routing actual en routing complejo sin definir primero las rutas de producto.
- No agregar backend dentro de `src/app/components`; crear una capa dedicada o proyecto separado.
- No guardar secretos, API keys ni credenciales en archivos del frontend.
