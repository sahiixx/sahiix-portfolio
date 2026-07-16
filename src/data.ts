// ── Portfolio content ───────────────────────────────────────────────────────
// Hybrid: technical accuracy (live OS links) + GTM (NEXUS-first pilots, contact).

export interface Project {
  id: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string[];
  /** Case study: problem → architecture → status */
  problem: string;
  architecture: string;
  statusNote: string;
  highlights: string[];
  role: string;
  status: string;
  stack: string[];
  year: string;
  url: string;
  accent: string;
  featured?: boolean;
  /** Commercial emphasis label on card */
  badge?: string;
  /** Optional product screenshot under /screenshots/ */
  image?: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface PilotOffer {
  title: string;
  duration: string;
  priceHint: string;
  bullets: string[];
  cta: string;
  ctaHref: string;
}

export const identity = {
  brand: "SAHIIX",
  name: "SAHIIX",
  rotator: [
    "Dubai deal engines that close the loop.",
    "AI-native operating systems.",
    "real-time voice agents.",
    "systems that control the machine.",
  ],
  tagline:
    "Dubai-based builder of AI-native OS shells, live real-estate pipelines, and voice agents that actually run the stack — not slideware.",
  location: "Dubai, UAE",
  availability: "Open for 60-day pilots · select work",
  bio: [
    "I design and ship end-to-end systems: a live NEXUS real-estate deal engine with WhatsApp, a modular SAHIIX OS on Neon + Cloudflare, and Jarvis — a voice agent with tiered OS control.",
    "Focus: the seam between LLMs and production infrastructure — streaming voice, tool-calling, safety gates, and commercial deal flow in Dubai (RERA-aware).",
  ],
  email: "sahiixofficial@gmail.com",
  phone: "+971 58 547 6077",
  phoneHref: "tel:+971585476077",
  telegram: "@Clawdsahiixbot",
  telegramHref: "https://t.me/Clawdsahiixbot",
  socials: [
    {
      label: "Telegram",
      handle: "@Clawdsahiixbot",
      url: "https://t.me/Clawdsahiixbot",
    },
    {
      label: "Email",
      handle: "sahiixofficial@gmail.com",
      url: "mailto:sahiixofficial@gmail.com",
    },
    {
      label: "Phone",
      handle: "+971 58 547 6077",
      url: "tel:+971585476077",
    },
    {
      label: "Live OS",
      handle: "sahiixx-os.pages.dev",
      url: "https://sahiixx-os.pages.dev",
    },
    {
      label: "Link in Bio",
      handle: "taponn.me/toknowme",
      url: "https://taponn.me/toknowme?utm_source=portfolio&utm_medium=web",
    },
  ],
  lookingFor: [
    { role: "Infra / full-stack eng", note: "Partner on OS modules, Cloudflare edge, Neon." },
    { role: "GTM / BD (Dubai real estate)", note: "Pilot pilots, brokerage intros, RERA-aware offers." },
    { role: "Pre-seed conversation", note: "Capital for productizing NEXUS + OS as a vertical stack." },
  ],
};

/** NEXUS first — commercial lead. Swiss-Army + LLM-Council dropped from public catalog. */
export const projects: Project[] = [
  {
    id: "nexus",
    index: "01",
    name: "NEXUS",
    tagline: "Live Dubai off-market deal engine + WhatsApp.",
    description:
      "Production pipeline on WSL: SQLite + Node, Palm owners, goldmine tiers, WhatsApp bridge. Bridged into SAHIIX OS for live lead import. Built for brokerage velocity under RERA-aware messaging.",
    longDescription: [
      "NEXUS is the commercial spine: a live deal engine, not a mock CRM. Source of truth is SQLite behind a Node API on WSL (ports 3001/3002), with WhatsApp closing the loop to prospects.",
      "Goldmine tiers and Palm priority lists rank who to call; templates stay RERA-aware. The modular OS NEXUS page can pull live estate leads over a Cloudflare tunnel and import them as Neon deals (ESTATE-*).",
    ],
    problem:
      "Brokerages drown in unstructured inventory and chat — no ranked queue, no compliance-aware templates, no path from lead → owner → WhatsApp without five tabs and a spreadsheet.",
    architecture:
      "WSL Node API + SQLite (estate.db) · WhatsApp bot service · goldmine / Palm ranking · optional cloudflared expose · SAHIIX OS NEXUS module imports leads into Neon for the unified OS shell.",
    statusNote:
      "Live on this workstation (systemd-user estate-api + whatsapp). OS bridge at sahiixx-os.pages.dev/nexus when tunnel is up.",
    highlights: [
      "Live API on :3001 / WhatsApp on :3002 under systemd-user.",
      "Goldmine tiers + Palm high-priority owners — chase order, not raw dumps.",
      "RERA-aware framing for off-market / DLD-scale contact work.",
      "Import path: live lead → Neon deal (ESTATE-*) inside SAHIIX OS.",
    ],
    role: "Architect & sole engineer",
    status: "Live · pilot-ready",
    stack: ["Node", "SQLite", "WhatsApp", "WSL", "Cloudflare Tunnel"],
    year: "2025–26",
    url: "https://sahiixx-os.pages.dev/nexus",
    accent: "#f59e0b",
    featured: true,
    badge: "LEAD PRODUCT",
    image: "./screenshots/nexus.jpg",
  },
  {
    id: "sahiix-os",
    index: "02",
    name: "SAHIIX OS",
    tagline: "AI-native OS shell — live on Cloudflare.",
    description:
      "v4.3 production: React 19 + Hono + tRPC + Drizzle on Neon. Command Center, Goldmine, SARA, Signals, GapClaw, Documents, Jarvis, Status. JWT, audit, Workers AI, Ollama Cloud.",
    longDescription: [
      "SAHIIX OS is the unified shell: voice, deals, CRM, content, and ops behind one edge deploy. Neon Postgres is live (demo=false); Hub shows real moduleCounts; mutations write activity_events.",
      "Nine surfaces: Command Center, NEXUS, Goldmine, SARA, Signals, GapClaw, Documents (OCR+FTS), Jarvis, System Status. Ops: /api/ready, metrics, smoke scripts, rate-limited auth.",
    ],
    problem:
      "Tools for agents, deals, and voice lived as separate scripts and ports — no single authenticated shell, no audit, no production deploy path.",
    architecture:
      "Cloudflare Pages `_worker.js` · Hono + tRPC 11 · Drizzle/Neon · Hyperdrive optional · Workers AI binding · Ollama Cloud for Jarvis · responsive OS chrome.",
    statusNote: "Live at https://sahiixx-os.pages.dev — v4.3.0, Neon live, production smoke green.",
    highlights: [
      "Live: sahiixx-os.pages.dev — JWT admin, Workers AI probe, Ollama Cloud glm-5.2.",
      "9 modules + live Hub counts from Neon.",
      "Audit trail, Prometheus metrics, CI / smoke-prod.",
      "Responsive shell: mobile drawer, LIVE/DEMO/ESTATE chips.",
    ],
    role: "Architect & sole engineer",
    status: "Live — v4.3",
    stack: ["React 19", "Hono", "tRPC", "Drizzle", "Neon", "Cloudflare", "Workers AI"],
    year: "2026",
    url: "https://sahiixx-os.pages.dev",
    accent: "#ff4d4d",
    featured: true,
    badge: "PLATFORM",
    image: "./screenshots/sahiix-os.jpg",
  },
  {
    id: "jarvis",
    index: "03",
    name: "Jarvis",
    tagline: "Voice agent that controls the machine.",
    description:
      "SSE voice agent: speaks as it thinks, tiered OS tools (read / mutate / CONFIRM), optional SAPI keyless TTS. Hosted at /jarvis on the live OS with Ollama Cloud.",
    longDescription: [
      "Jarvis multiplexes token stream and TTS so voice leads text. Safety is three-tier OS control so a model can operate without free-form shell disaster.",
      "Embedded in SAHIIX OS; provider stack prefers Ollama Cloud (glm-5.2) with local fallback.",
    ],
    problem:
      "Chatbots don't move a Windows/WSL box. Voice demos die without keys. Ungated shell tools are a liability.",
    architecture:
      "SSE turn stream · tool registry with CONFIRM gates · SAPI warm process for keyless TTS · Ollama Cloud / Kimi providers · /jarvis UI in OS shell.",
    statusNote: "Live module at sahiixx-os.pages.dev/jarvis; local OS-control drivers verified on workstation.",
    highlights: [
      "Keyless warm SAPI TTS path; optional ElevenLabs.",
      "Read / mutate / destructive-CONFIRM tool tiers.",
      "Live edge path: Ollama Cloud glm-5.2.",
    ],
    role: "Architect & sole engineer",
    status: "Live + extended",
    stack: ["SSE", "Ollama Cloud", "PowerShell", ".NET", "WSL"],
    year: "2026",
    url: "https://sahiixx-os.pages.dev/jarvis",
    accent: "#7c5cff",
    featured: true,
    badge: "VOICE",
    image: "./screenshots/jarvis.jpg",
  },
  {
    id: "opa",
    index: "04",
    name: "One Person Agency",
    tagline: "170+ repos, one routing layer.",
    description:
      "Python package (FastAPI + MCP + Typer `opa`) that discovers repos, scores capabilities, and dispatches tasks — agency behavior for one operator.",
    longDescription: [
      "OPA turns a pile of specialized repos into a fleet: discover, register, route, execute. CLI + API + MCP so agents and humans share the same dispatcher.",
    ],
    problem:
      "Context-switching across 170+ repos kills throughput; no single intent→tool path.",
    architecture:
      "Python package · registry JSON · FastAPI · MCP server · Typer CLI · adapter layers for career/security/video modules.",
    statusNote: "Shipped package; local uvicorn agency API used alongside the OS stack.",
    highlights: [
      "`opa` CLI + FastAPI + MCP.",
      "Auto-discovery + keyword/config routing.",
      "Pluggable adapters across categories.",
    ],
    role: "Architect & sole engineer",
    status: "Shipped",
    stack: ["Python", "FastAPI", "MCP", "Typer"],
    year: "2025",
    url: "https://github.com/sahiixx/sahiixx-agency",
    accent: "#22d3ee",
  },
];

export const skillGroups: SkillGroup[] = [
  { label: "Languages", items: ["TypeScript", "Python", "SQL", "PowerShell", "Bash"] },
  { label: "Frontend", items: ["React 19", "Vite", "Tailwind", "SSE", "DOM"] },
  { label: "Backend", items: ["Hono", "tRPC", "FastAPI", "Drizzle", "Node"] },
  {
    label: "Data / Edge",
    items: ["Neon Postgres", "SQLite", "Cloudflare Pages", "Workers AI", "Hyperdrive"],
  },
  {
    label: "AI",
    items: ["Ollama Cloud", "Kimi", "Tool-calling", "TTS / STT", "MCP"],
  },
  { label: "Systems", items: ["WSL2", "systemd-user", "cloudflared", "WhatsApp bots"] },
];

export const stats = [
  { value: "Live", label: "NEXUS pipeline" },
  { value: "v4.3", label: "OS on Cloudflare" },
  { value: "9", label: "OS modules" },
  { value: "60d", label: "pilot window" },
];

export const pilots: PilotOffer[] = [
  {
    title: "NEXUS Deal Desk Pilot",
    duration: "60 days",
    priceHint: "Fixed pilot · Dubai brokerage / sourcing teams",
    bullets: [
      "Stand up ranked lead queue (goldmine / Palm tiers) + WhatsApp loop.",
      "RERA-aware message templates and owner prioritization.",
      "Optional bridge into SAHIIX OS for unified deal view.",
      "Weekly ops review; success = contacted pipeline + closed-loop chats.",
    ],
    cta: "Start NEXUS pilot",
    ctaHref: "https://t.me/Clawdsahiixbot",
  },
  {
    title: "SAHIIX OS + Jarvis Pilot",
    duration: "60 days",
    priceHint: "Operators who want voice + edge shell on their stack",
    bullets: [
      "Deploy OS shell (or white-label modules) on Cloudflare + Neon.",
      "Jarvis voice path with safety tiers for internal tools.",
      "Status / audit / metrics so the system is operable, not a demo.",
    ],
    cta: "Discuss OS pilot",
    ctaHref: "mailto:sahiixofficial@gmail.com?subject=SAHIIX%20OS%2060-day%20pilot",
  },
];
