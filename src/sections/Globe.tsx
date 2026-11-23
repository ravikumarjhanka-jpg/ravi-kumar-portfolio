import { useEffect, useRef, useState } from 'react';
import { globalOps, say } from '../content';
import dots from '../data/land-dots.json';
import { prefersReducedMotion } from '../lib/env';

/**
 * Dotted globe on a 2D canvas (no WebGL): orthographic projection of ~2,600 land dots,
 * three highlighted regions and great-circle arcs from India. Drag to spin; arrow keys also work.
 */
const D2R = Math.PI / 180;
type P = { x: number; y: number; z: number };
const toVec = (lon: number, lat: number): P => ({ x: Math.cos(lat * D2R) * Math.sin(lon * D2R), y: Math.sin(lat * D2R), z: Math.cos(lat * D2R) * Math.cos(lon * D2R) });

export default function Globe() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [focus, setFocus] = useState(0);
  const rot = useRef({ lon: -72, lat: -14, vel: 0.06, drag: false, lastX: 0 });

  useEffect(() => {
    const c = cv.current!; const ctx = c.getContext('2d')!;
    const pts = (dots as [number, number][]).map(([lo, la]) => toVec(lo, la));
    const regs = globalOps.regions.map((r) => ({ ...r, v: toVec(r.lon, r.lat) }));
    const css = getComputedStyle(document.documentElement);
    const C = { dot: css.getPropertyValue('--globe-dot').trim(), blue: css.getPropertyValue('--blue').trim(), gold: css.getPropertyValue('--gold').trim(), fg: css.getPropertyValue('--fg').trim(), rim: css.getPropertyValue('--line').trim() };
    let raf = 0, visible = false, W = 0, H = 0, R = 0, dpr = 1, t0 = performance.now();
    const rm = prefersReducedMotion();

    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = c.width = c.clientWidth * dpr; H = c.height = c.clientHeight * dpr; R = Math.min(W, H) * 0.42; };
    const project = (p: P) => {
      const lo = rot.current.lon * D2R, la = rot.current.lat * D2R;
      const x1 = p.x * Math.cos(lo) - p.z * Math.sin(lo); const z1 = p.x * Math.sin(lo) + p.z * Math.cos(lo);
      const y2 = p.y * Math.cos(la) - z1 * Math.sin(la); const z2 = p.y * Math.sin(la) + z1 * Math.cos(la);
      return { sx: W / 2 + x1 * R, sy: H / 2 - y2 * R, z: z2 };
    };
    const slerp = (a: P, b: P, t: number): P => {
      const d = Math.acos(Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z)); const s = Math.sin(d) || 1;
      const k1 = Math.sin((1 - t) * d) / s, k2 = Math.sin(t * d) / s; const lift = 1 + Math.sin(Math.PI * t) * 0.18;
      return { x: (a.x * k1 + b.x * k2) * lift, y: (a.y * k1 + b.y * k2) * lift, z: (a.z * k1 + b.z * k2) * lift };
    };

    const draw = (now: number) => {
      if (!visible) return;
      if (!rot.current.drag && !rm) rot.current.lon += rot.current.vel;
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W / 2 - R * 0.3, H / 2 - R * 0.3, R * 0.1, W / 2, H / 2, R);
      g.addColorStop(0, 'rgba(61,139,255,0.16)'); g.addColorStop(1, 'rgba(10,20,40,0.05)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W / 2, H / 2, R, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = C.rim; ctx.lineWidth = dpr; ctx.stroke();
      ctx.fillStyle = C.dot; const s = 2 * dpr;
      for (const p of pts) { const q = project(p); if (q.z > 0) { ctx.globalAlpha = 0.3 + q.z * 0.7; ctx.fillRect(q.sx - s / 2, q.sy - s / 2, s, s); } }
      ctx.globalAlpha = 1;
      // arcs from India (index 0) to the other regions
      const phase = ((now - t0) / 2400) % 1;
      for (let k = 1; k < regs.length; k++) {
        ctx.beginPath(); let started = false;
        for (let i = 0; i <= 48; i++) {
          const q = project(slerp(regs[0].v, regs[k].v, i / 48));
          if (q.z > -0.05) { if (!started) { ctx.moveTo(q.sx, q.sy); started = true; } else ctx.lineTo(q.sx, q.sy); } else started = false;
        }
        ctx.strokeStyle = C.blue; ctx.globalAlpha = 0.7; ctx.lineWidth = 1.5 * dpr; ctx.setLineDash([6 * dpr, 6 * dpr]); ctx.lineDashOffset = -phase * 24 * dpr; ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      }
      regs.forEach((r, i) => {
        const q = project(r.v); if (q.z <= 0) return;
        const pulse = rm ? 0 : (Math.sin(now / 400 + i) + 1) / 2;
        ctx.fillStyle = i === 0 ? C.gold : C.blue;
        ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(q.sx, q.sy, (8 + pulse * 6) * dpr, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(q.sx, q.sy, 4.5 * dpr, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = C.fg; ctx.font = `600 ${12 * dpr}px Sora, system-ui, sans-serif`; ctx.fillText(r.name, q.sx + 10 * dpr, q.sy - 8 * dpr);
      });
      raf = requestAnimationFrame(draw);
    };

    size(); addEventListener('resize', size);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible) raf = requestAnimationFrame(draw); });
    io.observe(c);
    const down = (e: PointerEvent) => { rot.current.drag = true; rot.current.lastX = e.clientX; c.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!rot.current.drag) return; rot.current.lon -= (e.clientX - rot.current.lastX) * 0.4; rot.current.lastX = e.clientX; };
    const up = () => { rot.current.drag = false; };
    c.addEventListener('pointerdown', down); c.addEventListener('pointermove', move); c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
    return () => { io.disconnect(); cancelAnimationFrame(raf); removeEventListener('resize', size); };
  }, []);

  const spinTo = (i: number) => { setFocus(i); rot.current.lon = -globalOps.regions[i].lon; rot.current.lat = -globalOps.regions[i].lat * 0.6; };
  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'ArrowLeft') rot.current.lon += 12; if (e.key === 'ArrowRight') rot.current.lon -= 12; };

  return (
    <section className="sec gut" id="global" data-avatar="presenting" data-avatar-line={say.global_head}>
      <div className="wrap content globe-sec">
        <div>
          <p className="eyebrow">Global experience</p>
          <h2 className="h2" data-avatar-hover="presenting" data-avatar-say={say.global_head}>{globalOps.label.replace('3 Geographies', '')}<em>3 Geographies</em></h2>
          <p className="lead">Group finance for 17 entities across India, the United States and the Middle East.</p>
          <div className="regions" role="group" aria-label="Focus a region">
            {globalOps.regions.map((r, i) => (
              <button key={r.code} aria-pressed={focus === i} onClick={() => spinTo(i)}><i>{r.code}</i><span>{r.name}<small>{r.note}</small></span></button>
            ))}
          </div>
        </div>
        <canvas ref={cv} className="globe" tabIndex={0} onKeyDown={onKey} role="img" aria-label="Rotating globe highlighting India, the United States and the Middle East. Drag or use arrow keys to rotate." />
      </div>
    </section>
  );
}
