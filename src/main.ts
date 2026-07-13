// Single-file app logic: render data → wire interactions. No framework.
import "./style.css";
import { identity, projects, skillGroups, stats, type Project } from "./data";

const $ = <T extends HTMLElement = HTMLElement>(sel: string): T =>
  document.querySelector<T>(sel)!;

// ── Render: identity ─────────────────────────────────────────────────────────
$("#heroName").textContent = identity.name;
$("#availability").textContent = identity.availability;
$("#location").textContent = identity.location;
$("#heroTagline").textContent = identity.tagline;
$("#aboutLocation").textContent = identity.location;
$("#aboutStatus").textContent = identity.availability;
$("#year").textContent = String(new Date().getFullYear());

// bio paragraphs
$("#bio").append(...identity.bio.map((p) => {
  const el = document.createElement("p");
  el.className = "bio-p reveal";
  el.textContent = p;
  return el;
}));

// stats
$("#heroStats").append(
  ...stats.map((s) => {
    const div = document.createElement("div");
    div.className = "stat reveal";
    div.innerHTML = `<span class="stat-value">${s.value}</span><span class="stat-label">${s.label}</span>`;
    return div;
  }),
);

// socials
$("#socials").append(
  ...identity.socials.map((s) => {
    const a = document.createElement("a");
    a.className = "social";
    if (s.url) { a.href = s.url; a.target = "_blank"; a.rel = "noopener"; }
    else { a.classList.add("social-nolink"); a.title = "Link coming soon"; }
    a.innerHTML = `<span class="social-label">${s.label}</span><span class="social-handle">${s.handle}</span>`;
    return a;
  }),
);

// ── Render: projects ──────────────────────────────────────────────────────────
function projectCard(p: Project): HTMLElement {
  const card = document.createElement("article");
  card.className = "project reveal" + (p.featured ? " project-featured" : "");
  card.style.setProperty("--accent", p.accent);
  card.tabIndex = 0;
  card.setAttribute("role", "link");
  card.setAttribute("aria-label", `Open case study: ${p.name}`);
  // Whole card navigates to the case-study detail view.
  card.addEventListener("click", () => { location.hash = `#/${p.id}`; });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); location.hash = `#/${p.id}`; }
  });
  // External link (if any) stops propagation so it opens without triggering nav.
  const link = (inner: string) =>
    p.url
      ? `<a class="project-link" href="${p.url}" target="_blank" rel="noopener">${inner}</a>`
      : `<span class="project-link project-caselink">Case study <span class="project-arrow">→</span></span>`;
  card.innerHTML = `
    <div class="project-top">
      <span class="project-index">${p.index}</span>
      <span class="project-year">${p.year}</span>
    </div>
    <h3 class="project-name">${p.name}</h3>
    <p class="project-tagline">${p.tagline}</p>
    <p class="project-desc">${p.description}</p>
    <div class="project-stack">${p.stack.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
    ${link('<span class="project-link-text">View</span><span class="project-arrow">→</span>')}
  `;
  // prevent the external link from also triggering the card's nav
  const ext = card.querySelector<HTMLAnchorElement>(".project-link[href]");
  if (ext) ext.addEventListener("click", (e) => e.stopPropagation());
  return card;
}
$("#projectGrid").append(...projects.map(projectCard));

// ── Router: home vs case-study detail ───────────────────────────────────────────
const homeRoot = $("#home");
const detailRoot = $("#detail");

const defaultTitle = document.title;

function showHome() {
  detailRoot.hidden = true;
  homeRoot.hidden = false;
  document.body.classList.remove("detail-active");
  document.title = defaultTitle;
}

function renderDetail(p: Project) {
  homeRoot.hidden = true;
  detailRoot.hidden = false;
  document.body.classList.add("detail-active");
  detailRoot.style.setProperty("--accent", p.accent);
  document.title = `${p.name} — SAHIIX`;
  const paragraphs = p.longDescription.map((t) => `<p class="detail-p">${t}</p>`).join("");
  const highlights = p.highlights.map((h) => `<li class="detail-highlight">${h}</li>`).join("");
  const linkBlock = p.url
    ? `<a class="btn btn-primary" href="${p.url}" target="_blank" rel="noopener">View project <span class="project-arrow">↗</span></a>`
    : `<span class="btn btn-ghost btn-disabled">Link coming soon</span>`;
  detailRoot.innerHTML = `
    <div class="detail-inner">
      <a class="detail-back" href="#work"><span class="project-arrow">←</span> All work</a>
      <p class="detail-eyebrow"><span class="detail-index">${p.index}</span> · ${p.year} · <span class="detail-status">${p.status}</span></p>
      <h1 class="detail-name">${p.name}</h1>
      <p class="detail-tagline">${p.tagline}</p>
      <div class="detail-meta">
        <div><span>Role</span><strong>${p.role}</strong></div>
        <div><span>Status</span><strong>${p.status}</strong></div>
        <div><span>Year</span><strong>${p.year}</strong></div>
      </div>
      <div class="detail-stack">${p.stack.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      <div class="detail-body">
        <section class="detail-overview">
          <h2 class="detail-h">Overview</h2>
          ${paragraphs}
        </section>
        <section class="detail-highlights">
          <h2 class="detail-h">Highlights</h2>
          <ul class="detail-highlights-list">${highlights}</ul>
          <div class="detail-actions">${linkBlock}</div>
        </section>
      </div>
    </div>
  `;
  window.scrollTo({ top: 0, behavior: "auto" });
}

function route() {
  const h = location.hash;
  if (h.startsWith("#/")) {
    const id = h.slice(2);
    const p = projects.find((x) => x.id === id);
    if (p) { renderDetail(p); return; }
    // unknown id → fall home
    location.hash = "";
    return;
  }
  showHome();
  // for in-page anchors, smooth-scroll to the target after layout
  const id = h.slice(1);
  if (id) {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
window.addEventListener("hashchange", route);

// ── Render: skills ───────────────────────────────────────────────────────────
$("#skillGrid").append(
  ...skillGroups.map((g) => {
    const div = document.createElement("div");
    div.className = "skill-group reveal";
    div.innerHTML = `<h3 class="skill-label">${g.label}</h3><ul class="skill-items">${g.items
      .map((i) => `<li class="skill-item">${i}</li>`)
      .join("")}</ul>`;
    return div;
  }),
);

// ── Hero rotator ──────────────────────────────────────────────────────────────
const rotatorEl = $("#rotatorWord");
let ri = 0;
function rotate() {
  const next = identity.rotator[(ri + 1) % identity.rotator.length];
  rotatorEl.classList.add("rotator-out");
  setTimeout(() => {
    rotatorEl.textContent = next;
    rotatorEl.classList.remove("rotator-out");
    rotatorEl.classList.add("rotator-in");
    setTimeout(() => rotatorEl.classList.remove("rotator-in"), 450);
    ri++;
  }, 280);
}
setInterval(rotate, 2600);

// ── Scroll reveal ────────────────────────────────────────────────────────────
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        (e.target as HTMLElement).classList.add("in");
        io.unobserve(e.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
);
// stagger within each group — siblings share one delay sequence
const groupIndex = new Map<ParentNode, number>();
document.querySelectorAll(".reveal").forEach((el) => {
  const parent = el.parentElement!;
  const n = groupIndex.get(parent) ?? 0;
  groupIndex.set(parent, n + 1);
  (el as HTMLElement).style.transitionDelay = `${Math.min(n * 80, 480)}ms`;
  io.observe(el);
});

// ── Scroll progress + nav state ───────────────────────────────────────────────
const progress = $("#scrollProgress");
const nav = $("#nav");
const sections = ["work", "about", "skills", "contact"].map((id) => document.getElementById(id)!);
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("#navLinks a"));

function onScroll() {
  const doc = document.documentElement;
  const scrolled = doc.scrollTop;
  const max = doc.scrollHeight - doc.clientHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrolled / max : 0})`;
  nav.classList.toggle("nav-scrolled", scrolled > 24);

  // active nav link by section in view
  const mid = scrolled + window.innerHeight * 0.4;
  let active = "";
  for (const s of sections) {
    if (s.offsetTop <= mid) active = s.id;
  }
  navLinks.forEach((a) =>
    a.classList.toggle("nav-active", a.getAttribute("href") === `#${active}`),
  );
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// smooth scroll for in-page section anchors (skip case-study routes `#/…`)
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href")!;
    if (id.startsWith("#/")) return; // detail-route link — let the router handle it
    const target = id.length > 1 ? document.querySelector(id) : null;
    if (target) {
      e.preventDefault();
      (target as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// initial route (supports deep-linking straight to a case study)
route();

// ── Contact form (POSTs to /api/contact, falls back to mailto) ──────────────────
const form = $("#contactForm") as HTMLFormElement;
const note = $("#formNote");
const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

function setNote(msg: string, kind: "ok" | "error" | "info") {
  note.textContent = msg;
  note.className = `form-note form-note-${kind === "info" ? "ok" : kind}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();
  if (!name || !email || !message) { setNote("Please fill in all fields.", "error"); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setNote("That email doesn't look right.", "error"); return; }

  submitBtn.disabled = true;
  const origText = submitBtn.textContent;
  submitBtn.textContent = "Sending…";
  setNote("Sending…", "info");

  let delivered = false;
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    if (res.ok) {
      delivered = true;
      setNote("Thanks — your message is on its way. I'll reply soon.", "ok");
    } else if (res.status === 503) {
      // endpoint exists but email delivery isn't configured → mailto fallback
      setNote("Opening your mail client…", "info");
    } else {
      setNote("Something went wrong on the server. Falling back to email.", "info");
    }
  } catch {
    // dev/no-network → mailto fallback
    setNote("Opening your mail client…", "info");
  }

  if (!delivered) {
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${identity.email}?subject=${encodeURIComponent("Portfolio enquiry")}&body=${body}`;
  }

  form.reset();
  submitBtn.disabled = false;
  submitBtn.textContent = origText;
});