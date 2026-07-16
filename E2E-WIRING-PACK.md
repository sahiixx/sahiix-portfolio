# SAHIIX — E2E Lead Machine: Wiring Pack (honest, mapped to real systems)

> Companion to the agent-spec pack you provided. That pack is a **target architecture
> (design)**. This file maps it to what is **actually running** and gives the
> one tactical next step: a paste-ready QualificationAgent schema for OPA's
> real adapter pattern. Nothing here is invented as "live" that isn't.

## 0) Reality map — spec vs. what exists (verified this session)

| Spec component | Real status | Where it lives |
|---------------|-------------|----------------|
| Sovereign Supervisor (top router) | **Partial** — OPA `AgencyEngine` + `TaskRouter` is the real dispatcher (config/regex + keyword routing). No chat "Supervisor" persona exists. | `sahiixx_agency/core/engine.py`, `router.py` |
| Event fabric (LeadCreated…) | **Foundation exists** — `core/bus.py` MessageBus (pub/sub, wildcards). No lead-specific event schemas yet. | `sahiixx_agency/core/bus.py` |
| LeadCaptureAgent | **Does not exist** (no code). NEXUS claims WhatsApp intake but that's a separate WSL/Node service, not an OPA agent. | — |
| QualificationAgent | **Does not exist** (no code). | — |
| GeoMatchAgent | **Does not exist.** `adapters/realestate/` folder exists (foundation). | `sahiixx_agency/adapters/realestate/` |
| SchedulingAgent | **Does not exist.** | — |
| ReportingAgent | **Partial** — OPA metrics + `/metrics` Prometheus + dashboard Metrics page. No lead-funnel report yet. | `core/metrics.py`, dashboard |
| SAHIIX OS shell | **Live** (React/Hono/tRPC/Neon, Cloudflare). | sahiixx-os.pages.dev |
| NEXUS | **Live** (WhatsApp lead→CRM claim). | sahiixx-os.pages.dev/nexus |
| Jarvis voice | **Live** (SSE voice agent). | sahiixx-os.pages.dev/jarvis |
| Sovereign Swarm | **In-dev** (portfolio says so; no code seen). | — |
| Global Deal Floor | **Roadmap only.** | — |

**Bottom line:** the *infrastructure* (OPA dispatch + bus + realestate adapter folder + live OS/NEXUS/Jarvis) is real. The *5 specialist agents* are not — they are the build work. Treat the spec pack as the plan; this is the gap analysis.

## 1) Where the Supervisor actually lives

OPA already routes intent→module via `config/agency.yaml` `routing_rules` + adapter map
(`_SPECIALIZED_ADAPTERS`). A new "lead machine" intent should be a
**routing rule + a `realestate` adapter**, not a chat persona. Example rule to add:

```yaml
routing_rules:
  - pattern: "(qualify|score|match|schedule|capture).*(lead|enquiry|prospect)"
    target: "lead_machine"
    priority: 90
```

And register an adapter factory (mirrors the discovery one I built):
```python
_SPECIALIZED_ADAPTERS["lead_machine"] = _make_lead_machine
```

## 2) Event fabric — reuse the real bus

`MessageBus` already supports topic pub/sub. Define lead events as plain dicts on
topics `lead.created`, `lead.qualified`, `lead.matched`, `lead.scheduled`.
No new infra needed — just event *schemas* + subscribers.

## 3) TACTICAL NEXT STEP — QualificationAgent input/output schema

Paste-ready contract, built to drop into an OPA adapter's `execute(payload)`,
matching the `DiscoveryAdapter.execute` signature pattern (verified:
`async def execute(self, payload: dict) -> dict`).

**Input payload (LeadCreated from LeadCaptureAgent):**
```json
{
  "lead_id": "lead_8f3a",
  "contact": { "name": "A. Rahman", "handle": "+9715xxxx", "channel": "whatsapp" },
  "message": "Looking for a 2BR in Marina, budget 1.2M, moving in 3 months",
  "source": "nexus_whatsapp",
  "captured_at": "2026-07-16T09:12:00Z",
  "raw_ref": "nexus:ESTATE-4471"
}
```

**Output payload (LeadQualified — what QualificationAgent returns):**
```json
{
  "lead_id": "lead_8f3a",
  "score": 78,
  "segment": "end_user_buyer",
  "intent": "buy",
  "timeline": "soon_0_3m",
  "budget_band": "1.0M_1.5M",
  "decision": "qualified_pipeline_entry",
  "confidence": "medium",
  "rationale": [
    "Explicit budget + area + timeline → high intent",
    "Marina 2BR at 1.2M is in-market; moderate confidence on exact fit"
  ],
  "tags": ["segment:buyer", "priority:high", "area:marina"],
  "status": "qualified",
  "next": "route_to_geomatch"
}
```

**Adapter skeleton (real OPA pattern — `sahiixx_agency/adapters/qualification_agent.py`):**
```python
from __future__ import annotations
import re
from sahiixx_agency.adapters.base import BaseAdapter

class QualificationAgent(BaseAdapter):
    """Scores a captured lead and decides pipeline entry. execute() runs in-process."""
    async def execute(self, payload: dict) -> dict:
        msg = (payload.get("message") or "").lower()
        budget = self._extract_budget(msg)
        timeline = self._extract_timeline(msg)
        intent = "buy" if re.search(r"\b(buy|purchase|own|invest)\b", msg) else "info"
        score = 0
        score += 40 if budget else 0
        score += 30 if timeline != "unknown" else 0
        score += 30 if intent == "buy" else 10
        decision = "qualified_pipeline_entry" if score >= 60 else "nurture"
        return {
            "lead_id": payload.get("lead_id"),
            "score": score, "intent": intent, "timeline": timeline,
            "budget_band": budget, "decision": decision,
            "confidence": "medium", "status": "qualified" if decision.startswith("qualified") else "nurture",
            "next": "route_to_geomatch",
        }
    def _extract_budget(self, msg: str) -> str | None: ...
    def _extract_timeline(self, msg: str) -> str: ...
```

## 4) Build order (the 5 agents, incrementally)

1. **QualificationAgent** — schema above. Highest leverage, easiest to test (pure scoring).
2. **LeadCaptureAgent** — normalize WhatsApp/Telegram/web into the LeadCreated payload. (NEXUS already has the WhatsApp side; this wraps it into OPA events.)
3. **GeoMatchAgent** — consume LeadQualified → attach 3–10 area/property matches. Backed by `adapters/realestate/` + inventory data.
4. **SchedulingAgent** — consume LeadMatched → propose slots, Tier-2 gated (requires operator confirm — matches the Supervisor governance rule).
5. **ReportingAgent** — consume all events → funnel tables. Backed by OPA `/metrics` + dashboard.

## 5) Governance (from your Supervisor spec — already in OPA's DNA)

- Tier-2 (financial/production: live offers, auto-booking) = **never auto-execute**.
  OPA's `ApprovalManager` + `risk_level: high/critical` gates already do this.
- Wire SchedulingAgent's confirm step to OPA's existing approval flow, don't reinvent.

## 6) What I did NOT do (and why)

- Did **not** create 5 agent files claiming they're "live." They aren't — that would be
  the exact honesty gap we avoid.
- Did **not** paste the Supervisor prompt as if OPA runs it. OPA's router is config-driven,
  not a chat supervisor. The spec's *governance + event model* is sound and maps onto
  `ApprovalManager` + `MessageBus` — use those, not a new persona.

## 7) Your move

Pick one:
- **(a)** I build `qualification_agent.py` (real, tested against the schema above) + register it + a routing rule. Smallest real increment.
- **(b)** I scaffold the event schemas on the existing `MessageBus` (lead.created/qualified/matched/scheduled) so the 5 agents have a contract to share.
- **(c)** I wire NEXUS's WhatsApp intake → OPA `LeadCreated` event (the real Capture boundary).
