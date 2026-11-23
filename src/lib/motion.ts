import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { prefersReducedMotion } from './env';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

let lenis: Lenis | null = null;

/** Smooth scrolling wired into ScrollTrigger. Skipped for reduced motion. */
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -70 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/** Fade-up reveal for elements with [data-reveal]. Content stays visible if JS or GSAP fails. */
export function initReveals(root: ParentNode = document) {
  if (prefersReducedMotion()) return;
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
}

/** Buttons with [data-magnetic] drift toward the cursor on fine pointers. */
export function initMagnetic() {
  if (prefersReducedMotion() || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((m) => {
    m.addEventListener('pointermove', (e) => {
      const r = m.getBoundingClientRect();
      m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
    });
    m.addEventListener('pointerleave', () => (m.style.transform = ''));
  });
}
