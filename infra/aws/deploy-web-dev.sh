#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

AWS_PROFILE="${AWS_PROFILE-habitum-dev}"
AWS_REGION="${AWS_REGION:-us-east-1}"
PROJECT_NAME="${PROJECT_NAME:-habitum}"
ENVIRONMENT="${ENVIRONMENT:-dev}"
BACKEND_STACK_NAME="${BACKEND_STACK_NAME:-${PROJECT_NAME}-${ENVIRONMENT}-backend}"
WEB_STACK_NAME="${WEB_STACK_NAME:-${PROJECT_NAME}-${ENVIRONMENT}-web}"

AWS_ARGS=(--region "$AWS_REGION")
if [[ -n "$AWS_PROFILE" ]]; then
  AWS_ARGS+=(--profile "$AWS_PROFILE")
fi

if [[ -z "${VITE_API_BASE_URL:-}" ]]; then
  VITE_API_BASE_URL="$(
    aws cloudformation describe-stacks \
      --stack-name "$BACKEND_STACK_NAME" \
      --query "Stacks[0].Outputs[?OutputKey=='ApiBaseUrl'].OutputValue | [0]" \
      --output text \
      "${AWS_ARGS[@]}"
  )"
fi

if [[ -z "$VITE_API_BASE_URL" || "$VITE_API_BASE_URL" == "None" ]]; then
  echo "VITE_API_BASE_URL is required. Set it explicitly or deploy ${BACKEND_STACK_NAME} first." >&2
  exit 1
fi

echo "Building web app with VITE_API_BASE_URL=${VITE_API_BASE_URL}"
VITE_API_BASE_URL="$VITE_API_BASE_URL" npm run build

echo "Deploying CloudFormation stack ${WEB_STACK_NAME}"
aws cloudformation deploy \
  --stack-name "$WEB_STACK_NAME" \
  --template-file infra/aws/frontend-template.yaml \
  --parameter-overrides \
    ProjectName="$PROJECT_NAME" \
    Environment="$ENVIRONMENT" \
  "${AWS_ARGS[@]}"

WEB_BUCKET="$(
  aws cloudformation describe-stacks \
    --stack-name "$WEB_STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='WebBucketName'].OutputValue | [0]" \
    --output text \
    "${AWS_ARGS[@]}"
)"

DISTRIBUTION_ID="$(
  aws cloudformation describe-stacks \
    --stack-name "$WEB_STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue | [0]" \
    --output text \
    "${AWS_ARGS[@]}"
)"

SITE_URL="$(
  aws cloudformation describe-stacks \
    --stack-name "$WEB_STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='SiteUrl'].OutputValue | [0]" \
    --output text \
    "${AWS_ARGS[@]}"
)"

echo "Uploading assets to s3://${WEB_BUCKET}"
aws s3 sync dist "s3://${WEB_BUCKET}" \
  --delete \
  --exclude "index.html" \
  --cache-control "public,max-age=31536000,immutable" \
  "${AWS_ARGS[@]}"

aws s3 cp dist/index.html "s3://${WEB_BUCKET}/index.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html" \
  "${AWS_ARGS[@]}"

echo "Invalidating CloudFront cache"
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --output text \
  "${AWS_ARGS[@]}" >/dev/null

echo "Deployed: ${SITE_URL}"
