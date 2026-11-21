# SAHIIX lead machine — verified wiring

Updated 2026-11-21 from local code, synthetic tests, and the recovery-audit harness. This supersedes the previous design-only gap analysis.

## Implemented path

```text
Synthetic/API intake
  -> LeadCaptureAgent (normalizes identity, source and reference)
  -> QualificationAgent (intent, budget, timeline, confidence)
  -> qualified only: GeoMatchAgent (curated offline area suggestions)
  -> scheduling handoff label; no booking performed

Nurture/dropped leads -> matched: null; no matching invocation
```

OPA implementation: `../sahiixx-agency/sahiixx_agency/`.

| Component | Verified state | Source |
|---|---|---|
| Capture | Implemented and tested; emits a `lead.created` field | `adapters/lead_capture_agent.py` |
| Qualification | Implemented and tested; supports M/mn/million; complete-duration timeline parsing | `adapters/qualification_agent.py` |
| GeoMatch | Implemented and tested against a curated static area catalogue | `adapters/geomatch_agent.py` |
| HTTP pipeline | Capture -> qualify -> qualified-only matching | `api/lead_machine.py` |
| Dispatch registration | Capture and matching registered in the core engine for CLI/API/MCP consumers | `core/engine.py`, `core/specialized_lead_adapters.py` |
| Message bus | Generic pub/sub exists; these HTTP steps call adapters directly | `core/bus.py` |
| Scheduling | Matching returns a routing label; an automatic booking workflow is not verified | `adapters/geomatch_agent.py` |
| Reporting | General metrics exist; a lead-funnel report is not verified | `core/metrics.py` |

Returning an `event` or `next` field does not publish to the bus or execute the next step.

## HTTP interface

Start with `opa serve --host 127.0.0.1` or:

```bash
uvicorn sahiixx_agency.api.asgi:app --host 127.0.0.1 --port 8082
```

POST JSON to `/opa/lead/capture`, `/opa/lead/qualify`, `/opa/lead/match`, or `/opa/lead/pipeline`.
The `/api/opa/lead/*` aliases also work. Blank/whitespace messages return 422.
The API-key gate applies when `OPA_API_KEY` is configured.

Example synthetic input:

```json
{
  "message": "I want to buy in Palm Jumeirah, budget AED 5mn, in 2 months",
  "source": "nexus_whatsapp",
  "raw_ref": "fixture_message"
}
```

The source label does not connect this endpoint to WhatsApp. Real inbound delivery needs an independently verified integration.

## NEXUS and public OS

The canonical OS source checkout is at `F:/01_Projects/repos/sahiixx-os` (`b4883d5`) with active repair worktree `C:/Users/sahii/work-audits/os-repair` (branch `codex/estate-repair-20261106`); `F:/ALL_MY_FILES/Projects/repos/sahiixx-os` (`52e24b6`) is retired, and neither the README-only `Projects/sahiixx-os` folder nor the older `projects/sahiix-os` Node/SQLite estate service is the Cloudflare OS source.

- `api/lib/estate.ts` reads `/health` and `/leads` through `ESTATE_API_URL`.
- `api/nexus-router.ts` exposes estate queries and an authenticated `importLeadAsDeal` mutation; in `os-repair`, estate endpoints (`estateConfig`, `estateHealth`, `estateLeads`) require `protectedProcedure` auth, `importLeadAsDeal` uses atomic `onConflictDoNothing` idempotency on `dealId`, rejects read-only recovery snapshots (`health.body.recovery === true`), and fails closed when estate health cannot be verified (`src/pages/Nexus.tsx` labels recovery snapshots and disables import).
- Import creates an `ESTATE-<id>` deal shell with price 0 and score 50; it does not carry OPA qualification or matching into the CRM.
- `api/jarvis/tools.ts` dispatches to OPA locally and defines service-control confirmation gates. Local OS control is not established by the edge deployment.
- `F:/01_Projects/repos/sahiixx-os` carries an uncommitted `api/jarvis/tools.ts` WSL distro edit (`Ubuntu-24.04` -> `Ubuntu`).

Read-only public checks on 2026-11-05:

| Check | Observed result |
|---|---|
| `/api/health` | HTTP 200, status ok, version 4.3.0 |
| `/api/ready` | HTTP 200, status ready, dbMode neon-http |
| `/api/trpc/nexus.estateHealth` | Bridge returned ok=false, upstream HTTP 530 |

The public shell is ready, but its estate bridge is currently failing. These checks do not identify an exact deployed Git commit or prove customer workflows succeed.

## Verification and remaining boundary

- OPA (`sahiixx-agency`): 110/110 Python tests passed across the 41 focused lead-pipeline tests (qualification, capture, geomatch, HTTP pipeline, ASGI API-key gate, `cli/main.py serve`, core engine registration), 4 `test_routing_coverage.py` tests, 41 `test_api.py` tests, and 24 `test_api_coverage.py` tests (plus 9/9 `test_star_promoter.py`), with isolated `tmp_path` workflows/data dirs and zero `data/workflows/*.json` mutations; `ruff check` passed with 0 errors.
- OS & recovery audit (`C:/Users/sahii/work-audits/os-repair`, `C:/Users/sahii/work-audits/lead-system`): in `os-repair`, `npm run check`, `check:schema`, `build`, `test:security` (10/10), `test:nexus` (6/6), `test:charts` (4/4), and `estate-health.test.sh` (4/4) all pass on `codex/estate-repair-20261106`; in `lead-system`, 15/15 Vitest checks pass (`bridge.test.ts` 12/12 + `recovery-live.test.ts` 3/3 against the local `127.0.0.1:3011` read-only June 29 recovery origin), 6/6 `nexus-import.test.ts` checks pass, and 7/7 Python `test_estate_recovery.py` checks pass.
- The audit harness at `C:/Users/sahii/work-audits/lead-system` verifies the copied `os-repair` `nexus-router.ts`, `context.ts`, and `lib/estate.ts` contracts (including `protectedProcedure` auth, `onConflictDoNothing` idempotency, and recovery-snapshot fail-closed/rejection guards); it does not prove Neon persistence or live tunnel reachability.
- Curated area matching is not live listing availability, pricing validation, or investment advice.
- No customer lead was imported, no message sent, and no booking or deployment performed.

Next operational dependency: restore the configured estate tunnel/origin, then run an explicitly scoped synthetic lead import against a staging database. Verify WhatsApp intake and outbound approval separately.
