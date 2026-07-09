# Repository Guidelines

## Project Structure & Module Organization

This repository is a Vite + React 18 + TypeScript web app for Habitum. The main frontend lives in `src/app/`, with the React entry point in `src/main.tsx` and hash-based routing in `src/app/App.tsx`. Page composition starts in `src/app/pages/LandingPage.tsx`; reusable feature components live in `src/app/components/`; shadcn/Radix-style primitives live in `src/app/components/ui/`. API wrappers are in `src/app/services/`, shared contracts in `src/app/types/`, regional copy/pricing/FAQ in `src/app/config/`, and global styles in `src/styles/`. Static files belong in `public/`. AWS infrastructure is under `infra/aws/`, and the MVP Lambda API is in `server/lambda/habitum-api/`.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Vite development server.
- `npm run build`: create a production build in `dist/`.
- `cd infra/aws && ./deploy-dev.sh`: deploy the dev AWS backend, when AWS credentials are configured.

There is a `pnpm-workspace.yaml`, but the checked-in lockfile is `package-lock.json`; prefer npm unless the package management setup is intentionally changed.

## Coding Style & Naming Conventions

Use TypeScript/TSX and React function components. Name components in PascalCase, hooks and helpers in camelCase, and keep service files focused on one API area, for example `dashboard.ts` or `onboarding.ts`. Follow the existing utility-first Tailwind style and keep shared UI primitives in `src/app/components/ui/`. Prefer regional content files over hardcoded market-specific copy in components. Use two-space indentation and keep imports grouped by external libraries, then local modules.

## Testing Guidelines

No test framework or `npm test` script is currently configured. For now, validate changes with `npm run build` and manual browser checks of affected routes such as `#`, `#demo`, `#onboarding`, and `#dashboard`. If adding tests, use colocated `*.test.ts` or `*.test.tsx` files and add the matching script to `package.json`.

## Commit & Pull Request Guidelines

Git history is not available in this workspace, so use clear conventional commit-style messages such as `feat: add onboarding review state` or `fix: handle missing dashboard metrics`. Pull requests should include a short summary, affected routes or backend endpoints, linked issues when available, screenshots for UI changes, and the exact validation commands run.

## Security & Configuration Tips

Do not commit real secrets. Use `.env.example` as the source for expected variables and keep environment-specific values in `.env`. Treat AWS deployment files and Lambda changes as production-sensitive: document required IAM/profile assumptions and avoid broad permission changes without review.
