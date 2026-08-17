# Habitum Web QA Checklist

This document records the manual QA flows for the Habitum MVP demo. Use it before releases, deploys, or demo rehearsals.

## Scope

Routes to verify:

- `#`: landing page.
- `#demo`: demo request form.
- `#onboarding`: onboarding flow.
- `#dashboard`: dashboard sample mode.
- `#dashboard?communityId=<id>`: dashboard live mode.

Validation command:

```bash
npm run build
```

Local QA server:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

Reusable fixtures:

- `docs/qa-fixtures/onboarding-units.csv`: 3 fake units, 3 fake owners, `$400` total balances.
- `docs/qa-fixtures/hoa-regulations.pdf`: synthetic HOA rules for repeatable agent/RAG grounding tests.

## Flow 1: Landing Page

Expected:

- Landing route loads without console errors.
- Header, hero, CTA, pricing, FAQ, and footer render.
- Main CTA links route to demo or onboarding as intended.
- Region selector does not break layout.
- Mobile and desktop widths keep text readable and non-overlapping.

## Flow 2: Demo Request

Route: `#demo`

Expected:

- Form loads with name, email, phone, condominium name, unit count, and role fields.
- Empty submit shows field-level validation.
- Invalid email shows email validation.
- While submitting, the submit button is disabled and shows a loading state.
- If API submission fails, the entered form data remains visible.
- Failed submission shows a retry action.
- Successful submission shows the scheduling screen.

External side effect:

- Successful submission writes to the configured backend via `POST /api/demo-requests`.
- Use fake QA data only.

## Flow 3: Demo Scheduling

Entry: successful demo request.

Expected:

- Success screen greets the submitted first name.
- Available dates render.
- Selecting a date reveals/activates time choices.
- Taken time slots are disabled.
- Selecting a valid time enables booking.
- Booking confirmation displays selected date/time and submitted email.
- Return to homepage works.

## Flow 4: Onboarding Step 1

Route: `#onboarding`

Expected:

- Account and condominium form renders.
- Required fields prevent empty submission.
- Password minimum length is enforced.
- While creating workspace, the continue button is disabled and shows loading state.
- If API creation fails, data remains visible and an error appears.

External side effect:

- Successful continue creates/updates onboarding session and community records in the configured backend.
- Use fake QA data only.

## Flow 5A: Onboarding Step 2 Upload Path

Entry: completed onboarding step 1.

Expected:

- Setup path selector renders `Upload existing files` and `Manual setup`.
- Upload path can be selected without losing previously selected files.
- Drag/drop zone renders.
- File picker accepts `.csv`, `.xlsx`, `.xls`, `.pdf`, `.jpg`, `.jpeg`, and `.png` where supported by the browser.
- Selected files are listed with name and size.
- Upload button is disabled until at least one file is selected.
- Uploading state disables controls.
- Upload failure keeps selected files and shows `Retry Upload`.

External side effect:

- Successful upload stores files in S3 via presigned URLs.
- Use small fake QA files only.

## Flow 5B: Onboarding Step 2 Manual Setup Path

Entry: completed onboarding step 1.

Expected:

- Manual setup path can be selected.
- Unit rows render with unit, owner/resident, and opening balance fields.
- Add unit creates a new blank row.
- Delete unit removes a row but keeps at least one row available.
- Submit is disabled until at least one unit/owner row and one rule note are present.
- Starter rules render for pets, quiet hours, parking, reservations, maintenance, payments, and additional notes.
- Successful submit skips file processing and opens `#dashboard?communityId=<id>`.
- Live dashboard shows manual units, owner balances, and no sample banner.
- Agent shows a ready knowledge source when manual rules were entered.
- Agent can answer from manual rules with citations to `Manual onboarding rules`.

External side effect:

- Successful manual setup persists community rows and starter rules through `PATCH /api/onboarding/sessions/{sessionId}/manual-setup`.
- Use fake QA data only.

## Flow 6: Onboarding Step 3 Upload Processing

Entry: completed upload.

Expected:

- Processing starts automatically.
- Progress UI renders stages.
- Processing failure shows a retry action.
- Completed processing shows extracted summary.
- Review table allows editing, adding, and deleting rows.
- Confirming reviewed data opens dashboard with `communityId`.

External side effect:

- Processing invokes backend OCR/parsing and persists reviewed import data.
- Use fake QA data only.

## Flow 7: Dashboard Sample Mode

Route: `#dashboard`

Expected:

- Dashboard loads without a `communityId`.
- Header marks the view as sample data.
- Sample data banner is visible.
- Metric cards, recent payments, agent panel, and quick actions render.
- Agent submit is disabled in sample mode.
- No live-data retry button appears when there is no `communityId`.

## Flow 8: Dashboard Live Mode

Route: `#dashboard?communityId=<id>`

Expected:

- Dashboard attempts to load live data.
- Loading state appears while fetching.
- Successful load removes sample banner.
- Community name and metrics reflect live API response.
- Failed load falls back to sample data and shows `Retry Live Data`.
- Agent questions are enabled only when live data is active.

## Current QA Run

Date: 2026-08-12, 2026-08-16, and 2026-08-17.

Environment:

- Local Vite server at `http://127.0.0.1:5173/`.
- Browser: Codex in-app browser.
- Backend side-effect flows were submitted with fake QA data only.

Results:

- `npm run build`: pass.
- `#dashboard` sample mode: pass.
  - Sample banner visible.
  - Header marks sample data.
  - No live retry button without `communityId`.
- `#demo` initial render: pass.
  - Form visible.
  - Submit CTA visible.
  - Retry action not visible before an error.
- `#onboarding` initial render: pass.
  - Step 1 visible.
  - Continue CTA visible.
  - Retry action not visible before an error.
- Demo request local validation: pass.
  - Empty submit shows required messages for name, email, phone, condominium, size, and role.
- Onboarding step 1 browser validation: pass.
  - Empty continue focuses email.
  - Required email, password, and condominium fields are invalid.
- Browser console errors: none observed.

Backend-integrated QA pass:

- Demo request submission with fake data: pass.
  - Request saved through backend.
  - Scheduling screen rendered.
- Demo scheduling: pass.
  - Date selection worked.
  - Taken time slots were disabled.
  - Valid time selection enabled booking.
  - Booking confirmation showed selected time and QA email.
- Onboarding workspace creation with fake data: pass.
  - Step 1 completed.
  - Step 2 upload screen rendered.
- CSV upload with `docs/qa-fixtures/onboarding-units.csv`: pass.
  - File was accepted and uploaded.
  - Processing completed.
  - Review screen showed 3 units, 3 owners, `$400` total balances.
- Review confirmation: pass.
  - Dashboard opened with `communityId=com_9e0cb2d9-ddf4-44ca-9fcc-3c9960ec6a4b`.
- Dashboard live mode: pass.
  - Sample banner was not visible.
  - Community name reflected the QA onboarding record.
  - Metrics showed 3 units and `$400`.
  - Recent payments showed the QA CSV rows.
- Browser console errors during integrated pass: none observed.

Agent/RAG integrated QA pass:

- Fixture created: `docs/qa-fixtures/hoa-regulations.pdf`.
  - Text extraction check with `pdfplumber`: pass.
  - Poppler render check: not completed; `pdfinfo`/`pdftoppm` hung locally during this run.
- Onboarding ingest with CSV + PDF via backend API: pass.
  - Session: `obs_da777640-d978-4695-a117-e1439f8b8717`.
  - Community: `com_ded6c2e2-74ae-484b-8962-82354c9a8118`.
  - CSV fixture produced 3 units, 3 active owners, `$400` total balances, and 33% collection rate.
  - PDF fixture produced 1 indexed knowledge document.
- Dashboard live mode for the RAG community: pass.
  - Sample banner was not visible.
  - Community name was visible.
  - Metrics showed 3 units and `$400`.
  - Agent status showed `Ready`.
  - Agent panel showed `1 uploaded document ready for grounded answers`.
- Agent API grounding checks: pass.
  - Pet rules question returned a grounded answer with citations.
  - Quiet hours question returned a grounded answer with citations.
  - Mortgage lender recommendation was flagged out of scope and returned no citations.
- Agent browser UI check: pass.
  - Submitted `What are the HOA pet rules?` from the dashboard agent input.
  - Answer rendered with high confidence, pet/leash guidance, and `hoa-regulations.pdf` citation cards.

Manual onboarding integrated QA pass:

- Backend dev deployment for manual setup endpoint: pass.
  - Initial deploy used the script default `BEDROCK_MODEL_ID=disabled`, which preserved citations but returned the fallback model-unavailable answer.
  - Redeployed dev with `BEDROCK_MODEL_ID=amazon.nova-micro-v1:0` before final agent validation.
- Manual setup via API with fake data: pass.
  - Session: `obs_bee15951-1829-4293-a66f-01e01797c4cd`.
  - Community: `com_b7de899a-a40f-4cb4-986c-423dd652850b`.
  - Manual rows produced 3 units, 3 active owners, `$200` total balances, and 33% collection rate.
  - Manual rules produced 1 ready knowledge source named `Manual onboarding rules`.
- Dashboard live mode for manual community: pass.
  - Agent status was `ready`.
  - Knowledge source count was 1.
  - Metrics reflected the manual setup data.
- Agent API grounding checks from manual rules: pass.
  - Pet rules question returned the two-pet/leash answer with `Manual onboarding rules` citation.
  - Quiet hours question returned `10:00 PM to 7:00 AM` with `Manual onboarding rules` citation.
  - Mortgage lender recommendation was flagged out of scope and returned no citations.

Issues found and fixed:

- CSV processing worked, but the upload file picker did not advertise `.csv` in `accept`. Fixed by adding `.csv` to the onboarding upload input and copy.
- In-app browser file chooser automation failed once with `No node found for given backend id`; backend API ingestion was used as the reliable QA fallback. Manual user-browser upload should still be re-checked before a release rehearsal.
- Dev backend deploy scripts default to `BEDROCK_MODEL_ID=disabled`; set `BEDROCK_MODEL_ID=amazon.nova-micro-v1:0` when deploying QA environments that need full agent answers.

Not covered in this run:

- Mobile responsive screenshots.

Next QA recommendations:

- Capture screenshots for desktop and mobile widths.
- Re-run both onboarding branches manually in a regular browser before a customer-facing demo:
  - upload path with CSV + PDF;
  - manual setup path with typed units and rules.
