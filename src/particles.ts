// Constellation fx: ambient stardust + hero name formed by converging particles.
// Adapted from the standalone piece at C:/Users/sahii/surprise/index.html.
// Purely additive — the site works fully without it (static styled fallback).

export interface FxOptions {
  heroNameEl: HTMLElement;
  heroEl: HTMLElement;
  finePointer: boolean;
}

interface Point {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hueOff: number;
  alpha: number;
  home: Point | null;
  homed: boolean;
}

const HUES = [262, 192, 38, 150]; // violet, cyan, amber, green
// Device-scaled particle budgets (recomputed in resize() from viewport width
// and CPU concurrency) to avoid melting low-end / mobile devices.
let MAX_NAME_PARTICLES = 3500;
let DUST_COUNT = 220;
const SAMPLE_GAP = 4;
const TRAIL_FILL = "rgba(3,4,10,0.20)";

export function initFx(canvas: HTMLCanvasElement, opts: FxOptions): { setRoute: (home: boolean) => void } {
  const context = canvas.getContext("2d");
  if (!context) {
    canvas.remove();
    return { setRoute: () => undefined };
  }
  const ctx: CanvasRenderingContext2D = context;
  document.documentElement.classList.add("fx-on");

  let W = 0;
  let H = 0;
  let frame = 0;
  let routeHome = true;
  let heroVisible = true;
  let particles: Particle[] = [];
  const mouse = { x: -1e4, y: -1e4 };

  function makeParticles(): void {
    particles = [];
    const total = MAX_NAME_PARTICLES + DUST_COUNT;
    for (let i = 0; i < total; i++) {
      const dust = i >= MAX_NAME_PARTICLES;
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0,
        vy: 0,
        size: dust ? 0.8 + Math.random() * 1.2 : 1 + Math.random() * 1.4,
        hueOff: Math.random() * 60,
        alpha: 0,
        home: null,
        homed: false,
      });
    }
  }

  // Rasterize the hero name offscreen, collect opaque pixel positions in
  // viewport coordinates (the fx canvas is fixed full-viewport).
  function sampleName(): Point[] {
    const rect = opts.heroNameEl.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return [];
    const off = document.createElement("canvas");
    off.width = Math.max(1, Math.round(rect.width));
    off.height = Math.max(1, Math.round(rect.height));
    const o = off.getContext("2d");
    if (!o) return [];
    const text = opts.heroNameEl.textContent || "";
    if (!text.trim()) return [];
    let size = Math.floor(rect.height * 0.92);
    o.font = `700 ${size}px "Space Grotesk", system-ui, sans-serif`;
    const tw = o.measureText(text).width;
    if (tw > rect.width) size = Math.floor(size * (rect.width / tw));
    o.font = `700 ${size}px "Space Grotesk", system-ui, sans-serif`;
    o.textAlign = "left";
    o.textBaseline = "middle";
    o.fillStyle = "#fff";
    o.fillText(text, 0, off.height / 2);

    const data = o.getImageData(0, 0, off.width, off.height).data;
    let pts: Point[] = [];
    for (let y = 0; y < off.height; y += SAMPLE_GAP) {
      for (let x = 0; x < off.width; x += SAMPLE_GAP) {
        if (data[(y * off.width + x) * 4 + 3] > 128) {
          pts.push({ x: x + rect.left, y: y + rect.top });
        }
      }
    }
    for (let i = pts.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const tmp = pts[i];
      pts[i] = pts[j];
      pts[j] = tmp;
    }
    if (pts.length > MAX_NAME_PARTICLES) {
      const stride = pts.length / MAX_NAME_PARTICLES;
      const capped: Point[] = [];
      for (let i = 0; i < MAX_NAME_PARTICLES; i++) capped.push(pts[(i * stride) | 0]);
      pts = capped;
    }
    return pts;
  }

  function assignName(): void {
    const pts = sampleName();
    for (let i = 0; i < MAX_NAME_PARTICLES; i++) {
      const p = particles[i];
      if (!p) break;
      if (i < pts.length) {
        p.home = pts[i];
        p.homed = true;
      } else {
        p.home = null;
        p.homed = false;
      }
    }
  }

  function releaseName(): void {
    for (let i = 0; i < MAX_NAME_PARTICLES; i++) {
      const p = particles[i];
      if (!p) break;
      p.home = null;
      p.homed = false;
    }
  }

  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    const isMobile = W < 768;
    const isLowEnd = (navigator.hardwareConcurrency || 8) <= 4;
    MAX_NAME_PARTICLES = isMobile ? 800 : isLowEnd ? 1500 : 3500;
    DUST_COUNT = isMobile ? 60 : isLowEnd ? 120 : 220;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (routeHome && heroVisible) assignName();
  }

  function step(p: Particle, t: number, index: number): void {
    if (p.homed && p.home) {
      p.vx += (p.home.x - p.x) * 0.012;
      p.vy += (p.home.y - p.y) * 0.012;
    } else {
      const a = Math.sin(p.x * 0.003 + t * 0.7) + Math.cos(p.y * 0.003 - t * 0.5);
      p.vx += Math.cos(a * Math.PI) * 0.08;
      p.vy += Math.sin(a * Math.PI) * 0.08;
      if (p.x < -20) p.x = W + 20;
      else if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      else if (p.y > H + 20) p.y = -20;
    }

    if (opts.finePointer) {
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const d2 = mdx * mdx + mdy * mdy;
      if (d2 < 16900) {
        const d = Math.sqrt(d2) || 1;
        const f = ((130 - d) / 130) * 1.6;
        p.vx += (mdx / d) * f;
        p.vy += (mdy / d) * f;
      }
    }

    p.vx *= 0.9;
    p.vy *= 0.9;
    p.x += p.vx;
    p.y += p.vy;

    const dust = index >= MAX_NAME_PARTICLES;
    const target = p.homed ? 0.85 : dust ? 0.28 : 0.06;
    p.alpha += (target - p.alpha) * 0.06;
  }

  function tick(): void {
    frame++;
    if (!document.hidden) {
      const t = frame / 60;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = TRAIL_FILL;
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = "lighter";
      const hueBase = (t * 6) % HUES.length;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        step(p, t, i);
        const hue = HUES[(Math.floor(hueBase) + ((p.hueOff / 60) | 0)) % HUES.length];
        ctx.fillStyle = `hsla(${hue},85%,66%,${p.alpha.toFixed(3)})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    }
    requestAnimationFrame(tick);
  }

  // Name formation only while the hero is on screen.
  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      heroVisible = entry.isIntersecting;
      if (routeHome && heroVisible) assignName();
      else releaseName();
    },
    { threshold: 0.15 },
  );
  io.observe(opts.heroEl);

  if (opts.finePointer) {
    window.addEventListener("pointermove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("pointerleave", () => {
      mouse.x = -1e4;
      mouse.y = -1e4;
    });
  }
  window.addEventListener("resize", resize);

  resize();
  makeParticles();
  assignName();
  // Re-sample once webfonts arrive so the particle glyph matches the rendered one.
  if (document.fonts) {
    void document.fonts.ready.then(() => {
      if (routeHome && heroVisible) assignName();
    });
  }
  tick();

  return {
    setRoute(home: boolean) {
      routeHome = home;
      if (home && heroVisible) assignName();
      else releaseName();
    },
  };
}
