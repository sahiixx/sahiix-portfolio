// ── Portfolio content ───────────────────────────────────────────────────────
// Everything visible on the site is defined here. Edit freely — the UI renders
// from these arrays, so you can add/reorder projects or swap the identity without
// touching layout code. URLs left empty ("" ) render as plain text with no link.

export interface Project {
  id: string;
  index: string;      // display index, e.g. "01"
  name: string;
  tagline: string;     // one-line pitch
  description: string; // 2–3 sentence detail
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
  email: "hello@sahiix.os", // placeholder — replace with a real address
  socials: [
    { label: "GitHub", handle: "@sahiix", url: "" },
    { label: "X / Twitter", handle: "@sahiix", url: "" },
    { label: "LinkedIn", handle: "in/sahiix", url: "" },
  ],
};

export const projects: Project[] = [
  {
    id: "sahiix-os",
    index: "01",
    name: "SAHIIX OS",
    tagline: "An AI-native operating environment.",
    description:
      "A modular, voice-first OS layer that unifies automation, voice, messaging, and deal management. React 19 + Hono + tRPC + Drizzle over Neon Postgres, deployed to Cloudflare. Eight modules from a Command Center to a CRM and content factory.",
    stack: ["React 19", "Hono", "tRPC", "Drizzle", "Neon", "Cloudflare"],
    year: "2026",
    url: "",
    accent: "#ff4d4d",
    featured: true,
  },
  {
    id: "jarvis",
    index: "02",
    name: "Jarvis",
    tagline: "A real-time voice agent that controls the machine.",
    description:
      "Streaming voice agent that speaks as it thinks — keyless TTS via a persistent Windows SAPI process, an OS-control tool layer with tiered safety (read / mutate / destructive + CONFIRM), raw-PowerShell escape hatch, and a tool-calling loop over Kimi / Ollama.",
    stack: ["SSE", "Kimi", "Ollama", "PowerShell", ".NET", "WSL"],
    year: "2026",
    url: "",
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
    stack: ["Python", "FastAPI", "MCP", "Typer"],
    year: "2025",
    url: "",
    accent: "#22d3ee",
  },
  {
    id: "nexus",
    index: "04",
    name: "NEXUS",
    tagline: "A live Dubai real-estate deal engine + WhatsApp bot.",
    description:
      "Production deal pipeline on WSL (SQLite + Node) sourcing off-market inventory, tracking Palm owners and goldmine tiers, and closing the loop with a WhatsApp bridge. RERA-compliant sourcing templates and a DLD-scale contact graph.",
    stack: ["Node", "SQLite", "WhatsApp API", "WSL"],
    year: "2025",
    url: "",
    accent: "#f59e0b",
  },
  {
    id: "kimi-workspace",
    index: "05",
    name: "LLM-Council Workspace",
    tagline: "A multi-model research orchestrator.",
    description:
      "A 16-command workspace orchestrator (status / route / council / sweep / validate) wiring AI-engineering and Karpathy-style skill libraries — runs multi-model councils, parallel research sweeps, and a generated research dashboard.",
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
  { label: "Data / Infra", items: ["Postgres / Neon", "SQLite", "Cloudflare Workers", "WSL2"] },
  { label: "AI / LLM", items: ["Kimi / Moonshot", "Ollama", "Tool-calling", "TTS / STT", "MCP"] },
  { label: "Systems", items: ["PowerShell / .NET", "Automation", "System.Speech"] },
];

export const stats = [
  { value: "8", label: "OS modules shipped" },
  { value: "170+", label: "repos auto-routed" },
  { value: "0", label: "paid keys to speak" },
  { value: "5", label: "live WSL services" },
];