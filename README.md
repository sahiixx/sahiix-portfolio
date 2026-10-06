# SAHIIX Portfolio

Public portfolio for SAHIIX: AI-native operating systems, agent runtimes, voice tools and Dubai domain workflows.

**Live:** https://sahiix-portfolio.pages.dev

## What this site represents

The portfolio is deliberately evidence-led. It distinguishes:

- **Live** — a reachable or documented running surface.
- **Shipped** — code exists in a repository, without implying a hosted service.
- **In development** — active implementation or roadmap work.
- **Concept** — a future design direction.

The site does not claim that SAHIIX has achieved AGI or ASI. AGI and ASI are presented as sourced research, safety and governance horizons. Product status comes from repository code, project documentation and public deployment links.

## Selected systems

| System | Evidence | State |
|---|---|---|
| [SAHIIX OS](https://sahiixx-os.pages.dev) | React 19 + Hono + tRPC + Drizzle/Neon on Cloudflare | Public surface |
| [Jarvis](https://sahiixx-os.pages.dev/jarvis) | Streaming voice interface with read/mutate/confirmation tool tiers | Public route |
| NEXUS | Local SQLite/Node deal workflow with WhatsApp and OS import path | Local/pilot |
| [One Person Agency](https://github.com/sahiixx/sahiixx-agency) | CLI/API/MCP repository and task dispatcher | Shipped/local |
| [Friday OS](https://github.com/sahiixx/friday-os) | Voice-first, memory-persistent personal AI OS | Shipped |

## AI horizon sources

The site's **AI horizon** section was refreshed on **2026-10-06** from primary sources:

- [OpenAI Research](https://openai.com/research/) — current frontier research and model announcements.
- [OpenAI Charter](https://openai.com/charter/) — an explicit AGI definition and mission framing.
- [Anthropic: Introducing Claude 4](https://www.anthropic.com/news/claude-4) — reasoning, tool use, memory and agent capabilities.
- [Google DeepMind models](https://deepmind.google/models/) — Gemini, multimodal, robotics and specialized model surfaces.
- [Qwen3](https://qwenlm.github.io/blog/qwen3/) — open-weight models, hybrid thinking modes and agent/MCP use.
- [Google DeepMind Frontier Safety](https://deepmind.google/frontier-safety/) — frontier capability and safety context.

The implementation keeps provider capability claims separate from SAHIIX deployment claims. Model names and benchmark numbers should be refreshed from their primary sources before being treated as current.

## Development

### Requirements

- Node.js 20+
- npm

### Install and run

```bash
npm install
npm run dev
```

### Verification

```bash
npm run check
npm run build
```

### Deploy

```bash
npm run deploy
```

Deployment uses Cloudflare Pages through Wrangler. Credentials belong in the environment; never commit secrets.

## Project layout

```text
AGENTS.md                 repository-specific operating rules
index.html                metadata, navigation and page sections
src/data.ts               identity, projects, systems and source map
src/main.ts               rendering, routing and interactions
src/style.css             visual system and responsive layout
src/particles.ts          motion-gated canvas effects
functions/api/contact.ts  Cloudflare Pages contact endpoint
```

## Related repositories

- [sahiixx profile](https://github.com/sahiixx/sahiixx) — repository-backed profile and systems map.
- [agentic-harness](https://github.com/sahiixx/agentic-harness) — bounded agent workflow patterns and verification.
- [sahiixx-agency](https://github.com/sahiixx/sahiixx-agency) — repository/task dispatch surface.
- [sahiixx-os](https://github.com/sahiixx/sahiixx-os) — public operator shell.

## Model routing

Agent-work routing conventions are documented in [`AGENTS.md`](./AGENTS.md). The file describes Azure AI Foundry deployment names used by the repository workflow; it is not a claim that every model listed there is a public portfolio product.

---

<sub>Content and status labels reviewed 2026-10-06 · SAHIIX</sub>
