# Estrategia Backend Para Demo -> Onboarding -> Dashboard

Este documento define como agregar backend al sitio actual de Habitum para completar el flujo real:

`landing/demo -> onboarding con archivos -> procesamiento IA -> dashboard con datos reales`

## Objetivo

Convertir el frontend actual, que hoy es una experiencia visual con datos mock, en un demo funcional capaz de:

- capturar leads de demo;
- crear una sesion de onboarding;
- recibir datos del condominio;
- subir Excel, PDFs o fotos;
- procesar archivos con OCR/parsing/IA;
- estructurar unidades, propietarios, saldos y documentos;
- mostrar un dashboard real con el resultado del procesamiento.

## Diagnostico Actual

El proyecto actual es Vite + React. No tiene API routes propias.

Estado actual del flujo:

- `RequestDemo.tsx`: valida localmente y muestra `DemoSuccess`.
- `OnboardingFlow.tsx`: guarda datos en `useState`.
- `Step2Upload.tsx`: selecciona archivos en el navegador, pero no los sube.
- `Step3Processing.tsx`: simula procesamiento con timers y `mockResults`.
- `Dashboard.tsx`: muestra metricas y pagos mock.
- `App.tsx`: usa hash routing manual: `#demo`, `#onboarding`, `#dashboard`.

No existe cliente API, autenticacion, persistencia, storage, jobs ni procesamiento IA real.

## Decision Recomendada De Arquitectura

Para avanzar rapido sin reescribir el frontend, la opcion recomendada es agregar un backend separado dentro del mismo proyecto o monorepo.

Estructura propuesta:

```text
habitum-web/
  src/                         # frontend actual Vite/React
  server/                      # backend API
    src/
      modules/
        demoRequests/
        onboarding/
        communities/
        files/
        processing/
        dashboard/
        agent/
      db/
      storage/
      jobs/
      integrations/
  BACKEND_DEMO_STRATEGY.md
```

Backend recomendado para MVP:

- API: Node.js con Fastify o NestJS.
- DB: Postgres.
- ORM: Prisma o Drizzle.
- Storage: S3-compatible, Cloudflare R2 o Supabase Storage.
- Jobs: cola simple inicialmente en DB; luego BullMQ/Redis si hace falta.
- IA/OCR: proveedor intercambiable mediante servicio interno.
- Frontend: mantener Vite y consumir `VITE_API_BASE_URL`.

Razon: el frontend actual puede seguir funcionando y solo se reemplazan mocks por llamadas API. Migrar a Next.js ahora agregaria costo de reestructura sin ser necesario para validar el demo.

## Flujo Producto Objetivo

### 1. Solicitud De Demo

Usuario entra por CTA y abre `#demo`.

Frontend:

- valida campos;
- llama `POST /api/demo-requests`;
- muestra confirmacion con ID de lead;
- opcionalmente ofrece continuar a onboarding demo.

Backend:

- guarda lead;
- normaliza telefono y pais;
- registra fuente/campana si existe;
- envia notificacion interna;
- envia email/WhatsApp de confirmacion si esta configurado.

### 2. Inicio De Onboarding

Usuario entra por CTA "Comenzar Onboarding" o desde la pantalla de demo.

Frontend:

- llama `POST /api/onboarding/sessions`;
- guarda `onboardingSessionId`;
- envia datos de cuenta/condominio en el paso 1;
- pasa al paso de archivos.

Backend:

- crea sesion temporal;
- crea o prepara comunidad;
- define region (`latam` o `usa`);
- registra moneda base, pais y nombre del condominio.

### 3. Carga De Archivos

Usuario sube Excel, PDF o fotos.

Frontend:

- usa `FormData`;
- llama `POST /api/onboarding/sessions/:sessionId/files`;
- muestra progreso y archivos aceptados/rechazados;
- inicia procesamiento.

Backend:

- valida extension, MIME type y tamano;
- guarda archivo en storage;
- crea registros `uploaded_files`;
- crea job de procesamiento.

### 4. Procesamiento IA

Frontend:

- llama `POST /api/onboarding/sessions/:sessionId/process`;
- en `Step3Processing.tsx` consulta `GET /api/onboarding/sessions/:sessionId/status`;
- muestra progreso real por etapas.

Backend:

- ejecuta pipeline:
  - OCR para imagenes/PDFs;
  - parsing de Excel;
  - clasificacion del documento;
  - extraccion estructurada;
  - normalizacion de unidades, propietarios y saldos;
  - deteccion de errores o baja confianza;
  - persistencia de resultados.

### 5. Revision Ligera

Para MVP demo, la revision ya existe como pantalla simple despues del procesamiento.

Frontend:

- muestra resumen:
  - unidades encontradas;
  - propietarios detectados;
  - saldos totales;
  - documentos/reglamentos detectados;
  - filas con baja confianza.
- permite editar unidad, propietario y saldo;
- permite agregar o eliminar filas;
- llama `PATCH /api/onboarding/sessions/:sessionId/review`;
- permite confirmar resultados y pasar al dashboard.

Backend:

- recalcula unidades, propietarios, saldos, tasa de cobranza y pagos recientes;
- guarda filas revisadas;
- marca sesion como `review_completed`;
- crea comunidad demo lista para dashboard.

### 6. Dashboard

Frontend:

- navega a `#dashboard?communityId=...` o guarda el `communityId` en estado persistente;
- llama `GET /api/communities/:communityId/dashboard`;
- reemplaza metricas mock.

Backend:

- retorna:
  - resumen de unidades;
  - propietarios/residentes;
  - saldos;
  - pagos recientes;
  - documentos/reglamentos;
  - estado del agente IA;
  - recomendaciones de siguientes pasos.

### 7. Agente RAG De Reglamentos

Para MVP demo, el RAG no usa vector DB todavia. Usa el texto OCR de documentos PDF/imagen, lo divide en chunks y recupera fragmentos por coincidencia lexical antes de pedir una respuesta a Bedrock.

Frontend:

- muestra el estado del agente en `Dashboard.tsx`;
- muestra cuántos documentos de conocimiento fueron detectados;
- permite hacer preguntas sugeridas o escribir una pregunta libre;
- muestra respuesta, confianza, si requiere revision humana y citas de documentos.

Backend:

- guarda `knowledgeDocumentsJson` y `knowledgeChunksJson` en la comunidad durante el procesamiento;
- aplica un gate de alcance antes de recuperar chunks o llamar al modelo;
- rechaza preguntas no relacionadas con la comunidad, reglamentos, pagos, reservas, mantenimiento, residentes o administracion;
- recupera chunks relevantes para la pregunta;
- llama Bedrock Converse si `BEDROCK_MODEL_ID` esta activo;
- retorna respuesta con citas, bandera `needsHumanReview` y `outOfScope` cuando aplique.

### 8. Checklist Inicial De Documentos HOA/USA

No existe una lista unica nacional para HOAs en Estados Unidos. Los requisitos cambian por estado, pero para onboarding demo debemos esperar estas familias de documentos:

- Governing documents:
  - Declaration / CC&Rs / restrictive covenants;
  - articles of incorporation or certificate of formation;
  - bylaws and amendments;
  - rules and regulations;
  - architectural guidelines;
  - enforcement policy and fine schedule.
- Financial and assessment records:
  - annual budget and proposed budget;
  - income and expense statements;
  - balance sheet and budget comparison;
  - general ledger/accounting export;
  - assessment schedule, fee schedule and special assessment notices;
  - owner ledgers with charges, payments, late fees and balances;
  - tax returns, audits/reviews/compiled financial statements;
  - reserve study and reserve account balances.
- Owners, lots and access data:
  - owner/member roster;
  - unit/lot/parcel/address list;
  - mailing addresses and notice preferences;
  - email/electronic notice consent list;
  - rental or tenant registration;
  - gate, amenity, parking or access device assignments.
- Meetings, elections and governance:
  - board meeting minutes;
  - member meeting minutes;
  - meeting notices and agendas;
  - election rules and voting procedures;
  - ballots, proxies, sign-in sheets and voting results;
  - director certifications, disclosures and board policies.
- Insurance, contracts and vendors:
  - property, liability, fidelity/crime, flood and other insurance policies;
  - insurance declaration pages and deductible summaries;
  - management agreement;
  - vendor contracts;
  - leases, service agreements, bids and invoices;
  - warranties, permits, plans and specifications for common-area improvements.
- Compliance, requests and legal workflow:
  - architectural request forms and approvals;
  - violation notices and unresolved violation summaries;
  - collection policy and delinquency notices;
  - dispute resolution procedures;
  - maintenance work orders and incident reports;
  - disclosure packages, resale certificates, estoppel letters or transfer documents.

Esta lista vive en `src/app/config/hoaDocumentChecklist.ts` y se muestra en `Step2Upload.tsx` como referencia para administradores HOA/COA. En una fase posterior debe alimentar clasificacion documental automatica y checklist de documentos faltantes.

## Estados Del Onboarding

Usar estados explicitos evita mezclar pantallas con efectos visuales.

```text
created
account_completed
files_uploaded
processing_queued
processing_running
review_required
completed
review_completed
failed
expired
```

Cada estado debe tener una traduccion clara en UI:

- `created`: empezar setup.
- `account_completed`: pedir archivos.
- `files_uploaded`: listo para procesar.
- `processing_queued`: esperando turno.
- `processing_running`: procesando.
- `review_required`: hay datos de baja confianza.
- `completed`: dashboard listo.
- `review_completed`: datos revisados y dashboard listo.
- `failed`: mostrar error y reintento.
- `expired`: pedir iniciar de nuevo.

## API MVP

### Demo Requests

`POST /api/demo-requests`

Request:

```json
{
  "name": "Juan Perez",
  "email": "juan@condominio.com",
  "countryCode": "+58",
  "phone": "4121234567",
  "condoName": "Torre Vista Hermosa",
  "condoSize": "51-200",
  "role": "admin",
  "region": "latam"
}
```

Response:

```json
{
  "demoRequestId": "dr_123",
  "status": "received"
}
```

### Onboarding Sessions

`POST /api/onboarding/sessions`

Request:

```json
{
  "source": "landing_cta",
  "region": "latam"
}
```

Response:

```json
{
  "sessionId": "obs_123",
  "status": "created"
}
```

`PATCH /api/onboarding/sessions/:sessionId/account`

Request:

```json
{
  "email": "admin@condominio.com",
  "password": "temporary-or-auth-token",
  "condoName": "Torre Vista Hermosa",
  "country": "Venezuela",
  "baseCurrency": "USD"
}
```

Response:

```json
{
  "sessionId": "obs_123",
  "communityId": "com_123",
  "status": "account_completed"
}
```

### File Upload

`POST /api/onboarding/sessions/:sessionId/files`

Request:

- `multipart/form-data`
- field: `files[]`

Response:

```json
{
  "sessionId": "obs_123",
  "status": "files_uploaded",
  "files": [
    {
      "fileId": "file_123",
      "name": "propietarios.xlsx",
      "kind": "spreadsheet",
      "status": "stored"
    }
  ]
}
```

### Processing

`POST /api/onboarding/sessions/:sessionId/process`

Response:

```json
{
  "jobId": "job_123",
  "status": "processing_queued"
}
```

`GET /api/onboarding/sessions/:sessionId/status`

Response:

```json
{
  "sessionId": "obs_123",
  "status": "processing_running",
  "progress": 66,
  "stage": "extracting_balances",
  "summary": {
    "unitsFound": 50,
    "ownersFound": 48,
    "totalBalances": 1200,
    "documentsFound": 2
  },
  "issues": []
}
```

### Review Onboarding Data

`PATCH /api/onboarding/sessions/:sessionId/review`

Request:

```json
{
  "rows": [
    {
      "unit": "A-101",
      "owner": "Ana Perez",
      "balance": 0
    },
    {
      "unit": "A-102",
      "owner": "Carlos Mora",
      "balance": 150
    }
  ]
}
```

Response:

```json
{
  "sessionId": "obs_123",
  "status": "review_completed",
  "progress": 100,
  "summary": {
    "unitsFound": 2,
    "ownersFound": 2,
    "totalBalances": 150,
    "collectionRate": 50,
    "documentsFound": 1,
    "rowsProcessed": 2
  },
  "previewRows": [],
  "extractedRows": [],
  "issues": []
}
```

### Dashboard

`GET /api/communities/:communityId/dashboard`

Response:

```json
{
  "community": {
    "id": "com_123",
    "name": "Torre Vista Hermosa",
    "country": "Venezuela",
    "baseCurrency": "USD"
  },
  "metrics": {
    "totalUnits": 50,
    "activeOwners": 48,
    "totalBalances": 1200,
    "collectionRate": 94
  },
  "recentPayments": [
    {
      "unit": "A-101",
      "owner": "Maria Gonzalez",
      "amount": 125,
      "currency": "USD",
      "status": "completed"
    }
  ],
  "agent": {
    "status": "ready",
    "knowledgeDocuments": 2,
    "suggestedQuestions": [
      "Cuanto debo?",
      "Que dice el reglamento sobre mascotas?"
    ]
  }
}
```

### Agent Ask

`POST /api/communities/:communityId/agent/ask`

Request:

```json
{
  "question": "Que dice el reglamento sobre mascotas?"
}
```

Response:

```json
{
  "answer": "Se permite una mascota domestica por unidad...",
  "confidence": "high",
  "needsHumanReview": false,
  "outOfScope": false,
  "citations": [
    {
      "documentName": "reglamento.pdf",
      "excerpt": "Mascotas: se permite una mascota domestica por unidad..."
    }
  ]
}
```

Respuesta fuera de alcance:

```json
{
  "answer": "Solo puedo responder preguntas relacionadas con Torre RAG Test...",
  "confidence": "none",
  "needsHumanReview": true,
  "outOfScope": true,
  "citations": []
}
```

## Modelo De Datos MVP

Tablas recomendadas:

- `demo_requests`
  - lead comercial.
- `onboarding_sessions`
  - estado del flujo, fuente, region, expiracion.
- `communities`
  - condominio/comunidad.
- `users`
  - administradores, luego residentes.
- `community_members`
  - relacion usuario-comunidad-rol.
- `uploaded_files`
  - metadata de archivos subidos.
- `processing_jobs`
  - estado, progreso, errores y resultado bruto.
- `units`
  - apartamentos/casas/unidades.
- `residents`
  - propietarios o residentes.
- `unit_residents`
  - relacion entre unidad y persona.
- `balances`
  - deudas/saldos por unidad.
- `payments`
  - pagos detectados o registrados.
- `documents`
  - reglamentos, actas, PDFs.
- `document_chunks`
  - chunks para RAG en fases posteriores.
- `agent_conversations`
  - conversaciones futuras del agente IA.
- `agent_messages`
  - mensajes individuales.

## Pipeline De Procesamiento

Fase inicial, suficiente para demo:

1. Detectar tipo de archivo:
   - Excel/CSV;
   - PDF texto;
   - PDF escaneado;
   - imagen/foto.
2. Extraer texto/datos:
   - Excel: leer hojas y columnas;
   - PDF texto: extraer texto;
   - imagen/PDF escaneado: OCR.
3. Clasificar contenido:
   - lista de unidades;
   - propietarios/residentes;
   - saldos/pagos;
   - reglamento/documento legal;
   - otro.
4. Extraer estructura:
   - unidad;
   - propietario;
   - telefono/email si existe;
   - saldo;
   - moneda;
   - notas;
   - reglas/documentos.
5. Normalizar:
   - moneda;
   - nombres;
   - numeros de unidad;
   - telefonos;
   - duplicados.
6. Calcular confianza:
   - alto: persistir directo;
   - medio: mostrar en revision;
   - bajo: pedir correccion.
7. Crear dashboard demo.

## Cambios Necesarios En Frontend

Crear una capa API:

```text
src/app/services/
  apiClient.ts
  demoRequests.ts
  onboarding.ts
  dashboard.ts
src/app/types/
  demo.ts
  onboarding.ts
  dashboard.ts
```

Agregar variable:

```text
VITE_API_BASE_URL=http://localhost:4000
```

Actualizar componentes:

- `DemoFlow.tsx`
  - manejar loading/error;
  - llamar API real;
  - pasar `demoRequestId` a `DemoSuccess`.
- `RequestDemo.tsx`
  - dejar validacion local;
  - mover submit async al contenedor o servicio.
- `OnboardingFlow.tsx`
  - crear/guardar `sessionId`;
  - conservar estado si refresca la pagina usando `sessionStorage`.
- `Step1AccountSetup.tsx`
  - enviar datos a backend.
- `Step2Upload.tsx`
  - subir archivos con `FormData`;
  - mostrar progreso/errores por archivo.
- `Step3Processing.tsx`
  - reemplazar timers por polling real;
  - renderizar progreso desde backend.
- `Dashboard.tsx`
  - recibir `communityId`;
  - cargar datos desde API;
  - mostrar loading/error/empty state.

## Seguridad Desde El MVP

- Limitar tamano de archivo.
- Validar extension y MIME type en backend.
- Escanear o aislar archivos subidos si se habilita produccion.
- No guardar passwords en texto plano.
- Usar sesiones o tokens temporales para onboarding demo.
- Expirar sesiones demo.
- Separar datos reales de datos demo.
- No enviar archivos completos a modelos IA si no es necesario; extraer y minimizar contenido.
- Guardar logs de procesamiento sin exponer datos sensibles.

## Fases De Implementacion

### Fase 1: API Skeleton

- Crear `server/`.
- Configurar healthcheck: `GET /api/health`.
- Crear `.env.example`.
- Agregar `VITE_API_BASE_URL`.
- Crear `apiClient.ts`.
- Probar conexion frontend-backend.

Criterio de exito: el frontend puede llamar al backend local.

### Fase 2: Demo Requests

- Implementar `POST /api/demo-requests`.
- Persistir lead.
- Actualizar `DemoFlow`.
- Agregar estados loading/error.

Criterio de exito: el formulario de demo guarda datos reales y muestra confirmacion.

Estado: completado para MVP.

### Fase 3: Onboarding Session

- Crear sesiones de onboarding.
- Persistir datos de cuenta/condominio.
- Actualizar `OnboardingFlow` y `Step1AccountSetup`.

Criterio de exito: al completar paso 1 existe una comunidad demo persistida.

Estado: completado para MVP.

### Fase 4: Upload Real

- Implementar storage.
- Subir archivos desde `Step2Upload`.
- Guardar metadata.
- Mostrar archivos aceptados/rechazados.

Criterio de exito: archivos quedan disponibles para procesamiento.

Estado: completado para MVP con S3 presigned URLs, metadata en DynamoDB y sesion marcada como `files_uploaded`.

### Fase 5: Procesamiento MVP

- Implementar parser para Excel primero.
- Agregar OCR para imagen/PDF despues.
- Crear `processing_jobs`.
- Cambiar `Step3Processing` a polling.

Criterio de exito: un Excel de muestra produce unidades, propietarios y saldos reales.

Estado: completado parcialmente para MVP con CSV, XLSX estructurados, OCR sincrono Textract para PDF/JPG/PNG de hasta 5 MB y extraccion LLM con Bedrock Converse usando `amazon.nova-micro-v1:0` en dev. El flujo verificado es archivo en S3 -> processing job -> resumen -> status `completed` -> pantalla de revision -> status `review_completed` -> dashboard poblado. Falta `.xls` legacy y OCR asincrono para archivos grandes/multipagina.

### Fase 5.5: Revision De Datos

- Mostrar filas extraidas antes del dashboard.
- Permitir editar unidad, propietario y saldo.
- Permitir agregar y eliminar filas.
- Guardar filas revisadas en backend.
- Recalcular metricas del dashboard desde la version revisada.

Criterio de exito: una correccion manual cambia las metricas del dashboard.

Estado: completado para MVP. Verificado con `PATCH /api/onboarding/sessions/{sessionId}/review`: 2 filas importadas fueron revisadas a 3 filas, `totalBalances` cambio a 400 y el dashboard reflejo los nuevos valores.

### Fase 6: Dashboard Real

- Implementar endpoint dashboard.
- Reemplazar datos mock en `Dashboard.tsx`.
- Navegar con `communityId`.

Criterio de exito: dashboard refleja datos importados durante onboarding.

Estado: conectado al endpoint real y poblado desde procesamiento CSV/XLSX/OCR lineal/LLM Bedrock y desde datos revisados manualmente. Falta poblar desde `.xls` legacy, OCR asincrono y datos conciliados.

### Fase 7: IA/RAG Demo

- Ingerir reglamentos.
- Crear chunks/embeddings.
- Agregar endpoint de preguntas demo.
- Mostrar agente listo en dashboard.

Criterio de exito: el demo puede responder preguntas basicas con base en documentos cargados.

Estado: MVP completado sin embeddings/vector DB. Verificado con PDF de reglamento: OCR -> `knowledgeDocuments=1` -> agente `ready` -> pregunta sobre mascotas respondida con cita y confianza alta. Gate de alcance verificado: pregunta no relacionada al condominio retorna `outOfScope: true` sin citas. Pendiente: embeddings, almacenamiento vectorial, versionado, auditoria de conversaciones y permisos por rol.

## Orden Recomendado De Construccion

No empezar por WhatsApp ni pagos. Primero cerrar el recorrido visual-real:

0. Configurar AWS CLI con un perfil no-root: `habitum-dev`. Ver `AWS_BOOTSTRAP.md`.
1. Backend healthcheck.
2. Lead de demo persistido.
3. Sesion de onboarding persistida.
4. Upload real.
5. Parser Excel real.
6. OCR y extraccion LLM para archivos no estructurados.
7. Revision humana ligera.
8. Dashboard real.
9. RAG/reglamentos.
10. WhatsApp.
11. Conciliacion multimoneda.

## Riesgos Principales

- Intentar construir todos los canales a la vez.
- Saltar directo a WhatsApp sin datos estructurados.
- Meter logica de backend dentro de componentes React.
- Guardar archivos sin validacion.
- Prometer procesamiento IA perfecto sin revision de confianza.
- No separar datos demo de datos reales.
- No disenar multi-tenant desde el inicio.

## Primer Sprint Sugerido

Duracion: 3 a 5 dias.

Alcance:

- crear backend base;
- crear DB local;
- crear `demo_requests`;
- crear `onboarding_sessions`;
- crear `communities`;
- conectar frontend con `VITE_API_BASE_URL`;
- reemplazar submit mock de `RequestDemo`;
- reemplazar paso 1 de onboarding por persistencia real.

Resultado esperado:

- El demo request queda guardado.
- El onboarding crea una comunidad real.
- Todavia no hay OCR ni dashboard real, pero ya existe el eje de persistencia para completar el resto.
