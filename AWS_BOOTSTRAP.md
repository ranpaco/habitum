# Bootstrap AWS Para Habitum

Este documento define el primer paso operativo para montar Habitum en AWS sin trabajar desde la cuenta root.

## Estado Detectado

El perfil local actual de AWS CLI es:

```text
default
```

La identidad activa detectada por STS es la cuenta root:

```text
arn:aws:iam::917925998251:root
```

No se debe usar esta identidad para desplegar infraestructura del proyecto.

## Objetivo Inmediato

Crear un acceso separado para el proyecto:

```text
AWS root
  Solo seguridad, billing y recuperacion.

IAM Identity Center user
  Usuario humano para desarrollo.

AWS CLI profile
  habitum-dev
```

## Paso 1: Proteger Root

Desde la consola AWS con root:

1. Verificar que root tenga MFA activo.
2. Eliminar access keys de root si existen.
3. Usar root solo para tareas excepcionales:
   - billing;
   - cierre/recuperacion de cuenta;
   - configuracion inicial de seguridad;
   - habilitar IAM Identity Center si hace falta.

## Paso 2: Habilitar IAM Identity Center

Desde AWS Console:

1. Abrir `IAM Identity Center`.
2. Habilitar IAM Identity Center.
3. Si AWS pregunta el tipo de instancia, usar la instancia de organizacion cuando este disponible.
4. Confirmar region de Identity Center. Recomendado para este proyecto: `us-east-1`.

### Si La Cuenta Ya Pertenece A Otra AWS Organization

Si la cuenta `917925998251` ya pertenece a una AWS Organization que no quieres abandonar, esta cuenta normalmente actua como cuenta miembro. En ese caso:

- no puedes crear una AWS Organization nueva desde esta cuenta;
- no puedes habilitar una Organization instance propia de IAM Identity Center desde esta cuenta;
- los permission sets y el acceso SSO a cuentas AWS deben configurarse desde la management account de la organizacion existente.

Opciones disponibles:

1. Pedir al administrador de la AWS Organization existente que configure IAM Identity Center y te asigne acceso a esta cuenta con un permission set para Habitum.
2. Crear una cuenta AWS nueva y dedicada para Habitum, fuera de esa organizacion o dentro de una organizacion que controles.
3. Usar IAM clasico temporalmente dentro de esta cuenta para hacer bootstrap del proyecto.

Para avanzar ahora sin abandonar la organizacion existente, usar la opcion 3.

## Paso 3: Crear Usuario Y Grupo

Crear usuario:

```text
Usuario: rafael / habitum-admin-dev
Email: tu email real
MFA: obligatorio
```

Crear grupo:

```text
habitum-admins
```

Asignar el usuario al grupo.

## Paso 4: Crear Permission Set Temporal De Bootstrap

Crear permission set:

```text
Nombre: HabitumBootstrapAdmin
Tipo: predefined permission set
Policy: AdministratorAccess
Session duration: 4h u 8h
```

Uso permitido:

- crear el primer stack de infraestructura;
- crear roles de deploy mas limitados;
- configurar servicios base.

Uso no permitido:

- operar el proyecto permanentemente con permisos admin;
- crear access keys largas si se puede usar SSO;
- usarlo desde CI/CD.

## Paso 5: Asignar Cuenta AWS

En IAM Identity Center:

1. Ir a `AWS accounts`.
2. Seleccionar la cuenta `917925998251`.
3. Asignar el grupo `habitum-admins`.
4. Seleccionar el permission set `HabitumBootstrapAdmin`.

## Paso 6: Configurar AWS CLI SSO

Cuando el usuario ya exista y tenga acceso:

```bash
aws configure sso --profile habitum-dev
```

Valores esperados:

```text
SSO session name: habitum
SSO start URL: el URL del portal de IAM Identity Center
SSO region: us-east-1
SSO registration scopes: sso:account:access
AWS account: 917925998251
Role name: HabitumBootstrapAdmin
CLI default client Region: us-east-1
CLI default output format: json
CLI profile name: habitum-dev
```

Luego validar:

```bash
aws sso login --profile habitum-dev
aws sts get-caller-identity --profile habitum-dev
```

La salida correcta no debe terminar en `:root`. Debe verse como un rol reservado de AWS SSO, por ejemplo:

```text
arn:aws:sts::917925998251:assumed-role/AWSReservedSSO_HabitumBootstrapAdmin_...
```

## Paso 7: Congelar El Uso De Root

Cuando `habitum-dev` funcione:

- no usar mas el perfil `default` para este proyecto;
- no usar root para deploys;
- ejecutar todos los comandos con `--profile habitum-dev`;
- crear un rol de deploy limitado en el primer stack.

## Fallback Temporal: IAM Clasico Si SSO No Esta Disponible

Usar esta ruta solo si no tienes control de la management account de la AWS Organization actual y no puedes configurar IAM Identity Center.

Desde la consola AWS con root:

1. Ir a `IAM`.
2. Crear grupo:

```text
habitum-bootstrap-admins
```

3. Adjuntar policy AWS managed:

```text
AdministratorAccess
```

4. Crear usuario:

```text
habitum-bootstrap-admin
```

5. Asignar el usuario al grupo `habitum-bootstrap-admins`.
6. Activar MFA para ese usuario.
7. Crear access key para uso con AWS CLI.
8. Configurar perfil local:

```bash
aws configure --profile habitum-dev
```

Usar:

```text
AWS Access Key ID: access key del usuario habitum-bootstrap-admin
AWS Secret Access Key: secret key del usuario habitum-bootstrap-admin
Default region name: us-east-1
Default output format: json
```

Validar:

```bash
aws sts get-caller-identity --profile habitum-dev
```

La salida esperada debe parecerse a:

```text
arn:aws:iam::917925998251:user/habitum-bootstrap-admin
```

Cuando el primer stack este creado, se debe reducir este acceso:

- crear un rol/policy de deploy mas limitado;
- migrar deploys a ese rol;
- desactivar o eliminar la access key temporal;
- eliminar `AdministratorAccess` del usuario si ya no hace falta.

## Siguiente Paso Despues Del Perfil

Cuando `aws sts get-caller-identity --profile habitum-dev` funcione, el siguiente paso sera crear:

```text
infra/aws/
  README.md
  template.yaml
  parameters.dev.json
```

Primer stack AWS:

- S3 bucket para uploads del onboarding.
- DynamoDB para demo requests, onboarding sessions y comunidades demo.
- Lambda backend MVP.
- API Gateway HTTP API.
- CloudWatch logs.
- IAM roles minimos para Lambda.
