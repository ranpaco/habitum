# Functional Dashboard QA - 2026-09-28

Scope: first administrator dashboard slice in sample mode.

## Automated Checks

- `npm run build`: pass.
- `node --check server/lambda/habitum-api/index.mjs`: pass.
- `git diff --check`: pass.

## Visual Checks

- Desktop viewport (`1440x1200`): pass.
  - Operational context, metrics, filters, table, status badges, recent payments, and agent panel render without overlap.
- Mobile viewport (`500x1200`): pass.
  - Header collapses administrator identity to the avatar.
  - Context banner, title, import action, and metric cards fit without horizontal overflow.

Evidence:

- `dashboard-desktop.png`
- `dashboard-mobile.png`

## Deferred Cloud Checks

- Live-mode refresh with the deployed API.
- Search, filters, sorting, empty state, and unit-detail interactions in the deployed build.
- Verification that a newly onboarded community returns normalized `units` and `lastUpdatedAt`.
