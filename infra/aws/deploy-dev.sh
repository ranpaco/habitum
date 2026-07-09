#!/usr/bin/env bash
set -euo pipefail

PROFILE="${AWS_PROFILE:-habitum-dev}"
REGION="${AWS_REGION:-us-east-1}"
PROJECT_NAME="${PROJECT_NAME:-habitum}"
ENVIRONMENT="${ENVIRONMENT:-dev}"
BEDROCK_MODEL_ID="${BEDROCK_MODEL_ID:-disabled}"
STACK_NAME="${PROJECT_NAME}-${ENVIRONMENT}-backend"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
LAMBDA_DIR="${ROOT_DIR}/server/lambda/habitum-api"
BUILD_ROOT="${ROOT_DIR}/.build"
BUILD_DIR="${BUILD_ROOT}/habitum-api"
ZIP_FILE="${BUILD_ROOT}/habitum-api.zip"

ACCOUNT_ID="$(aws sts get-caller-identity --profile "${PROFILE}" --query Account --output text)"
CURRENT_ARN="$(aws sts get-caller-identity --profile "${PROFILE}" --query Arn --output text)"
ARTIFACT_BUCKET="${PROJECT_NAME}-${ENVIRONMENT}-artifacts-${ACCOUNT_ID}-${REGION}"
ARTIFACT_KEY="lambda/habitum-api-$(date +%Y%m%d%H%M%S).zip"

if [[ "${CURRENT_ARN}" == *":root" ]]; then
  echo "Refusing to deploy with root identity: ${CURRENT_ARN}" >&2
  exit 1
fi

echo "Using AWS profile: ${PROFILE}"
echo "Using AWS identity: ${CURRENT_ARN}"
echo "Using AWS region: ${REGION}"

if ! aws s3api head-bucket --bucket "${ARTIFACT_BUCKET}" --profile "${PROFILE}" --region "${REGION}" >/dev/null 2>&1; then
  echo "Creating artifact bucket: ${ARTIFACT_BUCKET}"
  if [[ "${REGION}" == "us-east-1" ]]; then
    aws s3api create-bucket --bucket "${ARTIFACT_BUCKET}" --profile "${PROFILE}" --region "${REGION}"
  else
    aws s3api create-bucket \
      --bucket "${ARTIFACT_BUCKET}" \
      --create-bucket-configuration "LocationConstraint=${REGION}" \
      --profile "${PROFILE}" \
      --region "${REGION}"
  fi

  aws s3api put-public-access-block \
    --bucket "${ARTIFACT_BUCKET}" \
    --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true \
    --profile "${PROFILE}" \
    --region "${REGION}"
fi

echo "Installing Lambda dependencies"
npm install --prefix "${LAMBDA_DIR}" --omit=dev

echo "Packaging Lambda"
rm -rf "${BUILD_DIR}" "${ZIP_FILE}"
mkdir -p "${BUILD_DIR}"
cp "${LAMBDA_DIR}/index.mjs" "${BUILD_DIR}/index.mjs"
cp "${LAMBDA_DIR}/package.json" "${BUILD_DIR}/package.json"
cp -R "${LAMBDA_DIR}/node_modules" "${BUILD_DIR}/node_modules"
(cd "${BUILD_DIR}" && zip -qr "${ZIP_FILE}" .)

echo "Uploading Lambda artifact: s3://${ARTIFACT_BUCKET}/${ARTIFACT_KEY}"
aws s3 cp "${ZIP_FILE}" "s3://${ARTIFACT_BUCKET}/${ARTIFACT_KEY}" --profile "${PROFILE}" --region "${REGION}"

echo "Deploying CloudFormation stack: ${STACK_NAME}"
aws cloudformation deploy \
  --stack-name "${STACK_NAME}" \
  --template-file "${SCRIPT_DIR}/template.yaml" \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    ProjectName="${PROJECT_NAME}" \
    Environment="${ENVIRONMENT}" \
    BackendCodeS3Bucket="${ARTIFACT_BUCKET}" \
    BackendCodeS3Key="${ARTIFACT_KEY}" \
    CorsAllowOrigin="*" \
    BedrockModelId="${BEDROCK_MODEL_ID}" \
  --profile "${PROFILE}" \
  --region "${REGION}"

echo "Stack outputs"
aws cloudformation describe-stacks \
  --stack-name "${STACK_NAME}" \
  --query "Stacks[0].Outputs" \
  --output table \
  --profile "${PROFILE}" \
  --region "${REGION}"
