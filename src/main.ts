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
  const card = document.createElement(p.featured ? "article" : "article");
  card.className = "project reveal" + (p.featured ? " project-featured" : "");
  card.style.setProperty("--accent", p.accent);
  const link = (inner: string) =>
    p.url ? `<a class="project-link" href="${p.url}" target="_blank" rel="noopener">${inner}</a>` : `<span class="project-link project-nolink">${inner}</span>`;
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
  return card;
}
$("#projectGrid").append(...projects.map(projectCard));

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
document.querySelectorAll(".reveal").forEach((el, i) => {
  // stagger within a group
  (el as HTMLElement).style.transitionDelay = `${Math.min((i % 6) * 60, 360)}ms`;
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

// smooth scroll for in-page anchors
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href")!;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      (target as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ── Contact form (no backend — demo handler) ──────────────────────────────────
const form = $("#contactForm") as HTMLFormElement;
const note = $("#formNote");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();
  if (!name || !email || !message) {
    note.textContent = "Please fill in all fields.";
    note.className = "form-note form-note-error";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    note.textContent = "That email doesn't look right.";
    note.className = "form-note form-note-error";
    return;
  }
  // No backend yet — open the user's mail client as a graceful fallback.
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:${identity.email}?subject=${encodeURIComponent("Portfolio enquiry")}&body=${body}`;
  note.textContent = "Opening your mail client… (wire this to a real endpoint to capture submissions.)";
  note.className = "form-note form-note-ok";
  form.reset();
});