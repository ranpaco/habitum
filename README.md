# Habitum Web

Habitum is a Vite + React + TypeScript web app for a PropTech demo flow:

`landing -> demo request -> onboarding -> file upload -> AI processing -> review -> dashboard`

The frontend connects to an AWS MVP backend for demo requests, onboarding sessions, S3 uploads, document processing, dashboard data, and the community rules agent.

## Requirements

- Node.js
- npm

This repository includes `package-lock.json`, so npm is the preferred package manager unless the package management setup is intentionally changed.

## Development

Install dependencies:

```bash
npm install
```

Start the Vite dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Environment

Copy `.env.example` to `.env` and set:

```text
VITE_API_BASE_URL=https://your-api-gateway-url
```

## Project Notes

- Main app code lives in `src/app/`.
- Reusable UI primitives live in `src/app/components/ui/`.
- API wrappers live in `src/app/services/`.
- Regional copy, pricing, and FAQ live in `src/app/config/`.
- AWS infrastructure lives in `infra/aws/`.
- MVP Lambda backend lives in `server/lambda/habitum-api/`.

See `ROADMAP.md`, `PROJECT_STRUCTURE.md`, and `BACKEND_DEMO_STRATEGY.md` for current product and technical direction.
