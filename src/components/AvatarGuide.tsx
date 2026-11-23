import { useEffect, useRef, useState } from 'react';
import { POSES, narrate, preloadPose, useAvatar, type AvatarState } from '../lib/avatar';
import { asset, finePointer, prefersReducedMotion } from '../lib/env';

/**
 * Ravi's virtual guide.
 * Wide screens: a docked figure beside the content that changes pose, leans toward the cursor
 * and speaks in a bubble. Smaller screens: a compact round button with the current pose and a
 * bubble that appears on change or on tap. Hidden while the hero is on screen.
 */
export default function AvatarGuide() {
  const { state, text, hovering, seq, explaining } = useAvatar();
  const [fresh, setFresh] = useState(false);
  const [shown, setShown] = useState<AvatarState[]>(['greeting']);
  const [visible, setVisible] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(() => !window.matchMedia('(max-width: 1179px)').matches);
  const fig = useRef<HTMLDivElement>(null);
  const rm = prefersReducedMotion();

  // Show the guide once the hero has scrolled away.
  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) { setVisible(true); return; }
    const io = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting || e.intersectionRatio < 0.25), { threshold: [0, 0.25, 0.5] });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Keep the last two poses mounted for a cross-fade; load new poses on first use only.
  const compact = () => window.matchMedia('(max-width: 1179px)').matches;
  useEffect(() => {
    setShown((p) => (p[p.length - 1] === state ? p : [...p.slice(-1), state]));
  }, [state]);
  // Wide: the bubble is always open. Compact: it opens on tap, or when Ravi answers a question;
  // otherwise a small pulse on the button signals a new line without covering content.
  useEffect(() => {
    if (!compact()) { setBubbleOpen(true); return; }
    setFresh(true);
  }, [text]);
  useEffect(() => { if (compact() && explaining && seq > 0) setBubbleOpen(true); }, [seq, explaining]);

  // Compact mode: bubble auto-hides after a few seconds.
  useEffect(() => {
    if (!bubbleOpen) return;
    if (!compact()) return;
    const t = window.setTimeout(() => setBubbleOpen(false), 6000);
    return () => clearTimeout(t);
  }, [bubbleOpen, text]);

  // Subtle "look toward the cursor" lean (fine pointers, no reduced motion).
  useEffect(() => {
    if (rm || !finePointer()) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = fig.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth, dy = (e.clientY - (r.top + r.height * 0.3)) / innerHeight;
        el.style.setProperty('--ry', `${Math.max(-10, Math.min(10, dx * 22))}deg`);
        el.style.setProperty('--rx', `${Math.max(-5, Math.min(5, -dy * 10))}deg`);
      });
    };
    addEventListener('pointermove', onMove, { passive: true });
    return () => { removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, [rm]);

  useEffect(() => { preloadPose('idle'); preloadPose('greeting'); }, []);

  return (
    <aside className={'guide' + (visible ? ' on' : '') + (hovering ? ' hover' : '') + (bubbleOpen ? ' talk' : '') + (fresh ? ' fresh' : '')} aria-label="Ravi, your virtual guide">
      <div className="g-bubble" role="status" aria-live="polite">
        <span className="g-name">Ravi</span>
        <p>{text}</p>
        <button className="g-listen" data-voice-control onClick={() => narrate(text, state)} aria-label="Listen to this line">🔊</button>
      </div>
      <div className="g-fig" ref={fig}>
        {shown.map((s, i) => (
          <img key={s + i} className={'g-pose' + (i === shown.length - 1 ? ' cur' : '') + (POSES[s].mirror ? ' mirror' : '')}
            src={asset(POSES[s].img)} alt={i === shown.length - 1 ? `Ravi Kumar, ${s} pose` : ''} aria-hidden={i !== shown.length - 1} decoding="async" />
        ))}
        <div className="g-floor" />
      </div>
      <button className="g-chip" onClick={() => { setFresh(false); setBubbleOpen((o) => !o); }} aria-expanded={bubbleOpen} aria-label="Show what Ravi is saying">
        <img src={asset(POSES[state].img)} alt="" className={POSES[state].mirror ? 'mirror' : ''} />
      </button>
    </aside>
  );
}
