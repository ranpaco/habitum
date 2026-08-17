# AWS Infra Para Habitum

Infraestructura inicial para convertir el demo de Habitum en un flujo real:

`demo request -> onboarding session -> uploads -> processing -> dashboard`

## Perfil AWS

Usar siempre el perfil no-root:

```bash
aws sts get-caller-identity --profile habitum-dev
```

La identidad esperada debe ser:

```text
arn:aws:iam::917925998251:user/habitum-bootstrap-admin
```

No desplegar si la identidad termina en `:root`.

## Stack Inicial

El template `template.yaml` crea:

- S3 bucket para archivos subidos durante onboarding.
- DynamoDB tables:
  - demo requests;
  - onboarding sessions;
  - communities;
  - uploaded files;
  - processing jobs.
- Lambda backend MVP.
- API Gateway HTTP API.
- CloudWatch logs.
- IAM role minimo para la Lambda.

## Dev Desplegado

Stack:

```text
habitum-dev-backend
```

Estado verificado:

```text
CREATE_COMPLETE
```

API base:

```text
https://6n33xvteq7.execute-api.us-east-1.amazonaws.com
```

Recursos principales:

```text
Uploads bucket: habitum-dev-uploads-917925998251-us-east-1
Demo requests table: habitum-dev-demo-requests
Onboarding sessions table: habitum-dev-onboarding-sessions
Communities table: habitum-dev-communities
Lambda: habitum-dev-api
```

Pruebas realizadas:

```http
GET /api/health -> 200
POST /api/demo-requests -> 201
POST /api/onboarding/sessions -> 201
PATCH /api/onboarding/sessions/{sessionId}/account -> 200
POST /api/onboarding/sessions/{sessionId}/files/presign -> 200
PUT S3 presigned URL -> 200
POST /api/onboarding/sessions/{sessionId}/files/complete -> 200
POST /api/onboarding/sessions/{sessionId}/process -> 200
PATCH /api/onboarding/sessions/{sessionId}/review -> 200
GET /api/onboarding/sessions/{sessionId}/status -> 200
GET /api/communities/{communityId}/dashboard -> 200
```

Procesamiento CSV verificado:

```text
CSV input: 3 rows
unitsFound: 3
ownersFound: 3
totalBalances: 375
dashboard metrics populated: yes
```

Procesamiento XLSX verificado:

```text
XLSX input: 3 rows
headers: unidad, propietario, saldo
unitsFound: 3
ownersFound: 3
totalBalances: 375
dashboard metrics populated: yes
```

OCR con Textract verificado:

```text
PDF input: 1 page
OCR lines detected: yes
unitsFound: 3
ownersFound: 3
totalBalances: 375
documentsFound: 1
dashboard metrics populated: yes
```

Limitacion actual:

```text
PDF/JPG/PNG para OCR sincrono: max 5 MB
```

## Extraccion LLM Opcional

La Lambda incluye una capa opcional de extraccion estructurada con Amazon Bedrock para casos donde Textract extrae texto, pero las heuristicas no detectan filas `unidad / propietario / saldo`.

Modelo activo en dev:

```text
BEDROCK_MODEL_ID=amazon.nova-micro-v1:0
```

Puede deshabilitarse usando:

```text
BEDROCK_MODEL_ID=disabled
```

Para habilitarla, primero activa acceso al modelo en Amazon Bedrock y luego despliega con:

```bash
BEDROCK_MODEL_ID=<bedrock-model-id> infra/aws/deploy-dev.sh
```

Ejemplo de comportamiento esperado:

```text
OCR text desordenado -> Bedrock Converse -> JSON rows -> dashboard
```

Prueba Bedrock verificada:

```text
OCR text: Apartment/Home prose
model: amazon.nova-micro-v1:0
unitsFound: 3
ownersFound: 3
totalBalances: 375
dashboard metrics populated: yes
```

Revision humana verificada:

```text
initial rows: 2
reviewed rows: 3
reviewed totalBalances: 400
reviewed collectionRate: 33
status after review: review_completed
dashboard metrics updated from reviewed data: yes
```

RAG/reglamentos verificado:

```text
PDF input: reglamento de prueba
OCR lines detected: yes
knowledgeDocuments: 1
agent status: ready
question: Que dice el reglamento sobre mascotas?
answer grounded in uploaded PDF: yes
confidence: high
citations returned: 1
out-of-scope gate: yes
unrelated question response: outOfScope=true, citations=0
```

## Deploy Dev

Desde la raiz del proyecto:

```bash
infra/aws/deploy-dev.sh
```

Variables opcionales:

```bash
AWS_PROFILE=habitum-dev AWS_REGION=us-east-1 PROJECT_NAME=habitum ENVIRONMENT=dev infra/aws/deploy-dev.sh
```

Al terminar, el script imprime los outputs del stack. Copiar `ApiBaseUrl` a `.env`:

```text
VITE_API_BASE_URL=https://...execute-api.us-east-1.amazonaws.com
```

## Deploy Web Dev

El sitio web se publica como build estatico de Vite en S3 privado con CloudFront:

```bash
infra/aws/deploy-web-dev.sh
```

El script toma `ApiBaseUrl` del stack backend `habitum-dev-backend`, ejecuta `npm run build`, sincroniza `dist/` al bucket web e invalida la cache de CloudFront.

Variables opcionales:

```bash
AWS_PROFILE=habitum-dev AWS_REGION=us-east-1 PROJECT_NAME=habitum ENVIRONMENT=dev infra/aws/deploy-web-dev.sh
```

Para apuntar a otro backend:

```bash
VITE_API_BASE_URL=https://...execute-api.us-east-1.amazonaws.com infra/aws/deploy-web-dev.sh
```

## Continuous Deployment

El repositorio incluye GitHub Actions para deploy automatico de dev:

```text
.github/workflows/deploy-dev.yml
```

El workflow corre en cada push a `main` y tambien puede ejecutarse manualmente desde GitHub Actions. Hace:

- checkout del repo;
- `npm ci`;
- `npm run build`;
- autenticacion AWS por OIDC;
- deploy del backend con `infra/aws/deploy-dev.sh`;
- deploy del frontend con `infra/aws/deploy-web-dev.sh`;
- invalidacion de cache CloudFront.

Rol OIDC dev creado:

```text
arn:aws:iam::917925998251:role/habitum-dev-github-actions-deploy
```

El workflow referencia ese ARN directamente porque no es un secreto y la trust policy del rol esta limitada a `ranpaco/habitum` en `main`.

Para recrearlo desde cero, desplegar:

```bash
aws cloudformation deploy \
  --stack-name habitum-dev-github-oidc \
  --template-file infra/aws/github-oidc-role.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --profile habitum-dev \
  --region us-east-1
```

Si el proveedor OIDC `token.actions.githubusercontent.com` ya existe en la cuenta AWS:

```bash
aws cloudformation deploy \
  --stack-name habitum-dev-github-oidc \
  --template-file infra/aws/github-oidc-role.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides CreateOidcProvider=false \
  --profile habitum-dev \
  --region us-east-1
```

Para obtener el ARN del rol:

```bash
aws cloudformation describe-stacks \
  --stack-name habitum-dev-github-oidc \
  --query "Stacks[0].Outputs[?OutputKey=='RoleArn'].OutputValue | [0]" \
  --output text \
  --profile habitum-dev \
  --region us-east-1
```

El workflow usa estos valores por defecto:

```text
AWS_REGION=us-east-1
PROJECT_NAME=habitum
ENVIRONMENT=dev
BEDROCK_MODEL_ID=amazon.nova-micro-v1:0
```

Nota: los scripts de deploy soportan dos modos:

- local: `AWS_PROFILE=habitum-dev`;
- GitHub Actions: `AWS_PROFILE=""` y credenciales OIDC inyectadas por `aws-actions/configure-aws-credentials`.

## Endpoints MVP

```http
GET /api/health
POST /api/demo-requests
POST /api/onboarding/sessions
PATCH /api/onboarding/sessions/{sessionId}/account
POST /api/onboarding/sessions/{sessionId}/files/presign
POST /api/onboarding/sessions/{sessionId}/files/complete
POST /api/onboarding/sessions/{sessionId}/process
PATCH /api/onboarding/sessions/{sessionId}/review
GET /api/onboarding/sessions/{sessionId}/status
GET /api/communities/{communityId}/dashboard
POST /api/communities/{communityId}/agent/ask
```

## Limpieza Dev

Para eliminar el stack dev:

```bash
aws cloudformation delete-stack --stack-name habitum-dev-backend --profile habitum-dev --region us-east-1
```

Si el bucket de uploads tiene archivos, CloudFormation no lo eliminara automaticamente. Vaciarlo manualmente solo si estas seguro de que no necesitas esos archivos.
