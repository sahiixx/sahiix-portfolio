// ── Portfolio content ───────────────────────────────────────────────────────
// Everything visible on the site is defined here. Edit freely — the UI renders
// from these arrays, so you can add/reorder projects or swap the identity without
// touching layout code. URLs left empty ("" ) render as plain text with no link.

export interface Project {
  id: string;
  index: string;      // display index, e.g. "01"
  name: string;
  tagline: string;     // one-line pitch
  description: string; // 2–3 sentence detail (card)
  longDescription: string[]; // case-study paragraphs
  highlights: string[];      // case-study feature bullets
  role: string;        // what I did
  status: string;      // shipped / live / WIP
  stack: string[];     // tech tags
  year: string;
  url: string;         // live/repo link ("" = no link)
  accent: string;      // CSS color for the card's hover glow
  featured?: boolean;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const identity = {
  brand: "SAHIIX",
  name: "SAHIIX",
  // Rotating words after "I build " in the hero.
  rotator: [
    "AI-native operating systems.",
    "real-time voice agents.",
    "developer tools that ship.",
    "systems that control the machine.",
  ],
  tagline:
    "Independent engineer building AI-native operating systems and real-time voice agents — from the OS layer to the checkout button.",
  location: "Dubai, UAE",
  availability: "Available for select work",
  bio: [
    "I design and build end-to-end AI systems: a voice-first operating environment that actually controls the machine, a deal engine powering a live real-estate pipeline, and a research-routing agency that auto-discovers and delegates across hundreds of repos.",
    "My focus is the seam between LLMs and the operating system — streaming voice, tool-calling, OS control, and the safety primitives that make a model a useful operator rather than a chat box.",
  ],
  email: "sahiixofficial@gmail.com",
  socials: [
    { label: "Link in Bio", handle: "taponn.me/toknowme", url: "https://taponn.me/toknowme?utm_source=ig&utm_medium=social&utm_content=link_in_bio" },
  ],
};

export const projects: Project[] = [
  {
    id: "sahiix-os",
    index: "01",
    name: "SAHIIX OS",
    tagline: "An AI-native operating environment — live on Cloudflare.",
    description:
      "Production OS shell on Neon + Cloudflare Pages: Command Center, NEXUS estate bridge, Goldmine CRM, SARA, Signals, GapClaw, Documents, Jarvis, System Status. React 19 + Hono + tRPC + Drizzle. Live counts, JWT auth, Workers AI probe, Ollama Cloud for Jarvis.",
    longDescription: [
      "SAHIIX OS is the through-line of everything I build: a single AI-native environment where voice, automation, deal flow, and content live behind one shell. v4.3 is full-stack and modular — typed tRPC over Hono, Drizzle on Neon Postgres, Hyperdrive optional, Workers AI binding, and a Cloudflare Pages `_worker.js` deploy path.",
      "Nine module surfaces compose the product: Command Center, NEXUS (with live estate leads via tunnel), Goldmine CRM, SARA, Signals, GapClaw, Documents (OCR + FTS), Jarvis voice, and System Status (integrations + audit). Hub shows real Neon moduleCounts; mutations write activity_events. Demo mode only if the DB is unreachable.",
      "Ops is first-class: /api/ready, /api/metrics, smoke-prod and real-world task scripts, rate-limited login, bootstrap admin, dealUpdate pipeline, and estate import (ESTATE-* deals). Responsive OS chrome with LIVE/DEMO/ESTATE chips.",
    ],
    highlights: [
      "Live: https://sahiixx-os.pages.dev — Neon demo=false, JWT admin, Workers AI + Ollama Cloud (glm-5.2).",
      "9 modules + System Status; live Hub counts (agents/deals/contacts from DB).",
      "NEXUS estate bridge: cloudflared → WSL estate-api; import lead → Neon deal.",
      "Audit trail, Prometheus metrics, CI smoke against production.",
      "UI: responsive shell, mobile drawer, Command Deck hub, empty states.",
    ],
    role: "Architect & sole engineer",
    status: "Live — v4.3",
    stack: ["React 19", "Hono", "tRPC", "Drizzle", "Neon", "Cloudflare", "Workers AI"],
    year: "2026",
    url: "https://sahiixx-os.pages.dev",
    accent: "#ff4d4d",
    featured: true,
  },
  {
    id: "jarvis",
    index: "02",
    name: "Jarvis",
    tagline: "A real-time voice agent that controls the machine.",
    description:
      "Streaming voice agent that speaks as it thinks — keyless TTS via a persistent Windows SAPI process, an OS-control tool layer with tiered safety (read / mutate / destructive + CONFIRM), raw-PowerShell escape hatch, and a tool-calling loop over Kimi / Ollama Cloud.",
    longDescription: [
      "Jarvis is a streaming voice agent that speaks as it thinks, then acts on the machine. Token streaming and per-sentence TTS are multiplexed over a single SSE stream, so the voice leads the text — audio interleaves with the LLM's tokens on the wire.",
      "The interesting constraint was cost: paid TTS keys come and go. So TTS is keyless by default — a persistent Windows SAPI voice process that stays warm, cutting synth latency from ~600ms cold to ~25–45ms per sentence. ElevenLabs remains optional when a key is present. A voices endpoint falls back to installed SAPI voices.",
      "Safety: three tiers — read-only runs ungated, mutating ops need a toggle, destructive ops need a per-op CONFIRM — and bounded tools where the model only ever controls quoted string values. Raw-PowerShell sits behind its own two-click flag, blocklist, and dry-run preview. Production OS shell hosts Jarvis at /jarvis with Ollama Cloud (glm-5.2) as the active edge provider.",
    ],
    highlights: [
      "Keyless streaming TTS — warm SAPI process, ~25–45ms synth; optional ElevenLabs.",
      "Three-tier OS-control safety: read / mutate / destructive-CONFIRM.",
      "Tool-calling over Ollama Cloud (glm-5.2) with local Ollama fallback.",
      "Embedded in live SAHIIX OS at /jarvis on Cloudflare Pages.",
    ],
    role: "Architect & sole engineer",
    status: "Live + actively extended",
    stack: ["SSE", "Ollama Cloud", "Kimi", "PowerShell", ".NET", "WSL"],
    year: "2026",
    url: "https://sahiixx-os.pages.dev/jarvis",
    accent: "#7c5cff",
    featured: true,
  },
  {
    id: "opa",
    index: "03",
    name: "One Person Agency",
    tagline: "An agency that auto-discovers 170+ repos and routes tasks.",
    description:
      "A real Python package (FastAPI + MCP + Typer CLI, entry point `opa`) that discovers repositories, indexes their capabilities, and routes a task to the best specialized tool across the fleet — a one-person agency that delegates like a team.",
    longDescription: [
      "One Person Agency (OPA) is the idea that a single person with the right routing can behave like a team. It's a real installable Python package — `pip install`-able, a `opa` CLI entry point, a FastAPI service, and an MCP server — that auto-discovers the 170+ repositories on this machine, indexes what each can do, and routes an incoming task to the best-fit tool across the fleet.",
      "Where a person would context-switch across a dozen repos, OPA delegates: it reads the task, matches it against indexed capabilities, and hands off. It's the routing layer that turns a pile of side-projects into a usable agency.",
    ],
    highlights: [
      "Installable Python package with a `opa` Typer CLI, FastAPI service, and an MCP server.",
      "Auto-discovers and indexes 170+ local repositories by capability.",
      "Routes a task to the best-fit specialized tool across the fleet instead of context-switching.",
    ],
    role: "Architect & sole engineer",
    status: "Shipped",
    stack: ["Python", "FastAPI", "MCP", "Typer"],
    year: "2025",
    url: "https://github.com/sahiixx/sahiixx-agency",
    accent: "#22d3ee",
  },
  {
    id: "nexus",
    index: "04",
    name: "NEXUS",
    tagline: "A live Dubai real-estate deal engine + WhatsApp bot.",
    description:
      "Production deal pipeline on WSL (SQLite + Node) sourcing off-market inventory, tracking Palm owners and goldmine tiers, and closing the loop with a WhatsApp bridge. Bridged into SAHIIX OS NEXUS module via Cloudflare Tunnel for live leads import.",
    longDescription: [
      "NEXUS is a production real-estate deal engine running live on WSL. The source of truth is a SQLite database behind a Node API; on top of it sits an off-market sourcing pipeline, a Palm-owners high-priority list, a goldmine-tier engine, and a WhatsApp bridge that closes the loop with prospects.",
      "The hard part isn't the stack — it's compliance at Dubai scale. Sourcing templates are RERA-compliant, the contact graph spans ~18.9k DLD entries, and the deal tiers are real. The modular OS NEXUS page can import live estate leads into Neon deals (ESTATE-*) when ESTATE_API_URL is tunnelled.",
    ],
    highlights: [
      "Live deal pipeline on WSL — SQLite + Node API on ports 3001/3002 (systemd-user).",
      "WhatsApp bridge under systemd-user; outbound path for messaging loops.",
      "RERA-aware sourcing + DLD-scale contact graph.",
      "OS bridge: live leads → Neon deal import on sahiixx-os.pages.dev/nexus.",
    ],
    role: "Architect & sole engineer",
    status: "Live",
    stack: ["Node", "SQLite", "WhatsApp API", "WSL", "Cloudflare Tunnel"],
    year: "2025",
    url: "https://sahiixx-os.pages.dev/nexus",
    accent: "#f59e0b",
  },
  {
    id: "kimi-workspace",
    index: "05",
    name: "LLM-Council Workspace",
    tagline: "A multi-model research orchestrator.",
    description:
      "A 16-command workspace orchestrator (status / route / council / sweep / validate) wiring AI-engineering and Karpathy-style skill libraries — runs multi-model councils, parallel research sweeps, and a generated research dashboard.",
    longDescription: [
      "The LLM-Council Workspace is my research routing layer for AI-engineering work. A 16-command orchestrator (`status / route / smart-route / usecase / council / sweep / validate / …`) wires together AI-engineering and Karpathy-style skill libraries and runs them across local models.",
      "It's where multi-model councils, parallel research sweeps, and validation pipelines actually run. Four registered patterns — ai-engineer-patterns, karpathy-patterns, autoresearch, and a device-AI pattern — are wired and healthy, and the workspace generates its own research dashboard from the runs.",
    ],
    highlights: [
      "16-command orchestrator: route, smart-route, council, sweep, validate, dashboard, meta, and more.",
      "Four healthy registered patterns (ai-engineer, karpathy, autoresearch, device-AI).",
      "Co-located skill libraries: Andrej-Karpathy skills, llm-council, nanochat, minGPT.",
      "Generates a research dashboard from sweep/council runs.",
    ],
    role: "Architect & sole engineer",
    status: "Shipped",
    stack: ["Python", "Ollama", "Multi-model", "Skills"],
    year: "2025",
    url: "",
    accent: "#34d399",
  },
  {
    id: "swiss-army",
    index: "06",
    name: "Swiss-Army Utility",
    tagline: "A quiet desktop tray that does the small things.",
    description:
      "An Electron tray app — clipboard history, screenshots, a file organizer, and an app launcher. Small, native, always one click away.",
    longDescription: [
      "Swiss-Army Utility is the small, always-there tool. An Electron tray app that holds the things you reach for a hundred times a day — clipboard history, screenshots, a file organizer, and an app launcher — one click away in the system tray.",
      "It's intentionally boring: native, fast, and quiet. No accounts, no cloud, no framework theater — just the convenience primitives that make a Windows box livable.",
    ],
    highlights: [
      "Electron tray app — clipboard history, screenshots, file organizer, app launcher.",
      "One-click access from the system tray; native and quiet.",
      "No accounts, no cloud — runs fully local.",
    ],
    role: "Architect & sole engineer",
    status: "Shipped",
    stack: ["Electron", "TypeScript"],
    year: "2024",
    url: "",
    accent: "#e879f9",
  },
];

export const skillGroups: SkillGroup[] = [
  { label: "Languages", items: ["TypeScript", "Python", "SQL", "PowerShell", "Bash"] },
  { label: "Frontend", items: ["React 19", "Vite", "Tailwind", "Canvas / DOM", "SSE streaming"] },
  { label: "Backend", items: ["Hono", "tRPC", "FastAPI", "Drizzle ORM", "Node"] },
  { label: "Data / Infra", items: ["Postgres / Neon", "SQLite", "Cloudflare Pages", "Workers AI", "Hyperdrive", "WSL2"] },
  { label: "AI / LLM", items: ["Ollama Cloud", "Kimi / Moonshot", "Workers AI", "Tool-calling", "TTS / STT", "MCP"] },
  { label: "Systems", items: ["PowerShell / .NET", "Automation", "System.Speech", "cloudflared"] },
];

export const stats = [
  { value: "9", label: "OS modules live" },
  { value: "170+", label: "repos auto-routed" },
  { value: "v4.3", label: "OS on Cloudflare" },
  { value: "5", label: "live WSL services" },
];