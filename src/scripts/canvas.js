/**
 * Background cluster topology.
 * Port of the canvas logic from the design file, with three additions:
 *   - honours prefers-reduced-motion (renders one static frame, no rAF loop)
 *   - scales the particle mesh down on small / low-core devices (the mesh is O(n²))
 *   - pauses while the tab is hidden
 */

const RINGS = [
  { count: 7, r: 1.0, tilt: 0.32, speed: 0.18 },
  { count: 10, r: 1.55, tilt: -0.24, speed: -0.12 },
  { count: 7, r: 2.15, tilt: 0.5, speed: 0.08 },
];

function particleCount() {
  const cores = navigator.hardwareConcurrency || 4;
  if (window.innerWidth < 700 || cores <= 4) return 70;
  return 150;
}

function project(x, y, z) {
  const d = 4.6;
  const s = d / (d + z);
  return { x: x * s, y: y * s, s };
}

export function initClusterCanvas(selector = '#bg-canvas') {
  const cv = document.querySelector(selector);
  if (!cv) return;

  const ctx = cv.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  let raf = null;

  // Ring nodes
  const nodes = [];
  RINGS.forEach((ring, ri) => {
    for (let i = 0; i < ring.count; i++) {
      nodes.push({
        ring: ri,
        phase: (i / ring.count) * Math.PI * 2,
        size: ri === 0 ? 3.2 : 2.5,
      });
    }
  });

  // Drifting particle mesh
  const drift = Array.from({ length: particleCount() }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00022,
    vy: (Math.random() - 0.5) * 0.00022,
    r: Math.random() * 1.5 + 0.6,
    a: Math.random() * 0.45 + 0.25,
  }));

  const resize = () => {
    w = cv.clientWidth || window.innerWidth;
    h = cv.clientHeight || window.innerHeight;
    cv.width = Math.max(1, Math.floor(w * dpr));
    cv.height = Math.max(1, Math.floor(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduce) render(0); // keep the static frame crisp across resizes
  };

  let scrollY = window.scrollY || 0;
  const onScroll = () => {
    scrollY = window.scrollY || 0;
  };

  function render(t) {
    ctx.clearRect(0, 0, w, h);

    // ---- 1. particle mesh -------------------------------------------------
    drift.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1;
      if (p.y > 1) p.y = 0;
      p.px = p.x * w;
      p.py = p.y * h;
    });

    const linkDist = Math.min(w, h) * 0.17;
    ctx.lineWidth = 1;
    for (let i = 0; i < drift.length; i++) {
      for (let j = i + 1; j < drift.length; j++) {
        const dx = drift[i].px - drift[j].px;
        const dy = drift[i].py - drift[j].py;
        const d2 = dx * dx + dy * dy;
        if (d2 < linkDist * linkDist) {
          const o = (1 - Math.sqrt(d2) / linkDist) * 0.24;
          ctx.beginPath();
          ctx.moveTo(drift[i].px, drift[i].py);
          ctx.lineTo(drift[j].px, drift[j].py);
          ctx.strokeStyle = `rgba(96,165,250,${o})`;
          ctx.stroke();
        }
      }
    }
    drift.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.px, p.py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(191,219,254,${p.a})`;
      ctx.fill();
    });

    // ---- 2. main cluster --------------------------------------------------
    const parallax = Math.sin(scrollY * 0.0009) * h * 0.06;
    const cx = w * 0.72;
    const cy = h * 0.46 + parallax;
    const scale = Math.min(w, h) * 0.3;

    RINGS.forEach((ring) => {
      ctx.beginPath();
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2 + t * ring.speed * 6;
        const zRaw = Math.sin(a) * ring.r;
        const p = project(Math.cos(a) * ring.r, zRaw * Math.sin(ring.tilt), zRaw * Math.cos(ring.tilt));
        const px = cx + p.x * scale;
        const py = cy + p.y * scale;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(96,165,250,0.38)';
      ctx.stroke();
    });

    const pts = nodes.map((n) => {
      const ring = RINGS[n.ring];
      const a = n.phase + t * ring.speed * 6;
      const zRaw = Math.sin(a) * ring.r;
      const p = project(Math.cos(a) * ring.r, zRaw * Math.sin(ring.tilt), zRaw * Math.cos(ring.tilt));
      return { x: cx + p.x * scale, y: cy + p.y * scale, s: p.s, size: n.size };
    });

    // spokes
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `rgba(59,130,246,${0.14 + 0.24 * p.s})`;
      ctx.stroke();
    });

    // packets travelling centre -> node
    pts.forEach((p, i) => {
      const prog = (t * 0.6 + i * 0.11) % 1;
      const px = cx + (p.x - cx) * prog;
      const py = cy + (p.y - cy) * prog;
      ctx.beginPath();
      ctx.arc(px, py, 1.6 * p.s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(191,219,254,${0.6 * (1 - Math.abs(prog - 0.5) * 1.2)})`;
      ctx.fill();
    });

    // nodes + halos
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(219,234,254,${0.5 + 0.5 * p.s})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.s * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59,130,246,0.14)';
      ctx.fill();
    });

    // control-plane core
    const pulse = 1 + Math.sin(t * 4) * 0.12;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 52 * pulse);
    g.addColorStop(0, 'rgba(147,197,253,0.9)');
    g.addColorStop(0.22, 'rgba(59,130,246,0.38)');
    g.addColorStop(1, 'rgba(59,130,246,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 52 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#DBEAFE';
    ctx.fill();

    // ---- 3. satellite cluster, left field ---------------------------------
    const sx = w * 0.2;
    const sy = h * 0.72 - parallax * 0.5;
    const ss = Math.min(w, h) * 0.15;

    ctx.beginPath();
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * Math.PI * 2 - t * 0.9;
      const zRaw = Math.sin(a) * 1.6;
      const p = project(Math.cos(a) * 1.6, zRaw * Math.sin(-0.4), zRaw * Math.cos(-0.4));
      const px = sx + p.x * ss;
      const py = sy + p.y * ss;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.strokeStyle = 'rgba(96,165,250,0.3)';
    ctx.stroke();

    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - t * 0.9;
      const zRaw = Math.sin(a) * 1.6;
      const p = project(Math.cos(a) * 1.6, zRaw * Math.sin(-0.4), zRaw * Math.cos(-0.4));
      const px = sx + p.x * ss;
      const py = sy + p.y * ss;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(px, py);
      ctx.strokeStyle = `rgba(59,130,246,${0.1 + 0.16 * p.s})`;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(px, py, 2.1 * p.s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(219,234,254,${0.4 + 0.4 * p.s})`;
      ctx.fill();
    }

    const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 30);
    sg.addColorStop(0, 'rgba(147,197,253,0.6)');
    sg.addColorStop(1, 'rgba(59,130,246,0)');
    ctx.beginPath();
    ctx.arc(sx, sy, 30, 0, Math.PI * 2);
    ctx.fillStyle = sg;
    ctx.fill();
  }

  resize();
  window.addEventListener('resize', resize);

  if (reduce) {
    render(0.6); // one flattering static frame, no loop
    return;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  let t = 0;
  const loop = () => {
    t += 0.0055;
    render(t);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    } else if (!raf) {
      raf = requestAnimationFrame(loop);
    }
  });
}
