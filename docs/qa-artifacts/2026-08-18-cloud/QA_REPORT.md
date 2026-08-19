# Formal Cloud QA Report

Date: 2026-08-18 America/Caracas / 2026-08-19 UTC

Environment:

- Site: `https://dagh1t5lzacso.cloudfront.net`
- Backend: `https://6n33xvteq7.execute-api.us-east-1.amazonaws.com`
- Browser: Codex in-app browser
- Fixtures:
  - `docs/qa-fixtures/onboarding-units.csv`
  - `docs/qa-fixtures/hoa-regulations.pdf`

## Summary

Overall status: PASS with one tooling limitation.

The cloud build, CloudFront smoke checks, visual browser captures, API-integrated demo request, manual onboarding, upload onboarding, dashboard loading, and agent grounding checks passed using fake QA data only.

The in-app browser captured pages correctly but could not complete some button submit interactions during this run. The product paths were therefore validated through the real backend API and then opened visually in the cloud dashboard for screenshot evidence.

## Deployment Checks

- `npm run build`: PASS.
- CloudFront GET `/`: PASS, HTTP 200.
- Served title: `Habitum | AI HOA Management Software`.
- Latest GitHub Actions `Deploy Dev`: PASS.
  - Run: `https://github.com/ranpaco/habitum/actions/runs/32204846263`
  - Branch: `main`
  - Commit: `3efe7e97353fcd098174ac44cfd6d3819f390028`

## Browser Visual Checks

PASS:

- Landing desktop: `landing-desktop.png`
- Landing mobile: `landing-mobile.png`
- Dashboard sample desktop: `dashboard-sample.png`
- Dashboard sample mobile: `dashboard-mobile.png`
- Live manual dashboard from API-created community: `dashboard-live-manual-api.png`
- Live upload dashboard from API-created community: `dashboard-live-upload-api.png`

Observed:

- Cloud pages rendered and contained expected Habitum/dashboard content.
- Live dashboards did not show the sample data banner.
- Live dashboards showed the AI Rules Agent panel.

Tooling limitation:

- In-app browser click translation failed for some submit buttons.
- DOM `requestSubmit()` and `element.click()` were unavailable in the browser wrapper.
- Keyboard submit did not trigger those forms.
- Evidence files are retained in `browser-qa-results.json`, `browser-qa-rerun-results.json`, `browser-qa-dom-results.json`, and `browser-qa-keyboard-results.json`.

## API Integrated Checks

PASS: Demo request API

- Demo request ID: `dr_68fb1c08-3a2a-42ef-899d-3a6e5b0c0e0f`
- Email: `qa+formal-demo-1787103134599@example.com`

PASS: Manual onboarding API + dashboard + agent

- Session: `obs_f0c8252b-97fd-4a67-900e-ebe3d50fb6f7`
- Community: `com_046b0946-ef86-4473-bdcf-43ed277730f3`
- Email: `qa+formal-manual-1787103134599@example.com`
- Metrics: 3 units, 3 active owners, `$200.50` total balances, 33% collection rate.
- Manual rules indexed: 1 document.
- Pet question: grounded answer with 1 citation.
- Mortgage lender question: out of scope.

PASS: Upload onboarding API CSV+PDF + dashboard + agent

- Session: `obs_6d225bb3-a17d-475e-8de1-aaccd0f7d6cb`
- Community: `com_d597b332-cd2d-4826-b92b-a79bf9f30033`
- Email: `qa+formal-upload-1787103134599@example.com`
- Uploaded files: `onboarding-units.csv`, `hoa-regulations.pdf`
- Metrics: 3 units, 3 active owners, `$400.00` total balances, 33% collection rate.
- PDF rules indexed: 1 document.
- Pet question: grounded answer with 2 citations.
- Mortgage lender question: out of scope.

Raw API evidence: `api-qa-results.json`.

## Follow-up

- Repeat the submit-heavy flows once in a regular Chrome/Safari browser before a customer demo.
- Keep this artifact directory as the baseline for future cloud QA comparisons.
