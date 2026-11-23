import { useEffect, useRef, useState } from 'react';
import { intro, kpis, profile, say } from '../content';
import { asset, prefersReducedMotion } from '../lib/env';
import { gsap, ScrollTrigger, scrollToId } from '../lib/motion';
import { ListenButton } from '../components/VoiceBar';
import { useVoice, voice } from '../lib/voice';

/**
 * Hero: Ravi's own photos, crossfading slowly. The intro clip plays over them with captions that follow the audio.
 */
// The intro split into caption lines, each timed by its share of the clip.
const CAPS = intro.listen.split(/(?<=[.,])\s+/).reduce<string[]>((o, t) => {
  const last = o[o.length - 1];
  if (last && !last.endsWith('.') && last.length + t.length < 64) o[o.length - 1] = last + ' ' + t; else o.push(t);
  return o;
}, []);
const CAP_ENDS = (() => { const tot = CAPS.join('').length; let acc = 0; return CAPS.map((c) => (acc += c.length) / tot); })();
const display = (t: string) => t.replace('F P and A', 'FP&A').replace('G C C', 'GCC');
// Photos: <name>.webp (1920 wide), <name>-md.webp (1280 wide), <name>-m.webp (portrait, phones).
const SLIDES = ['ravi/hero-1', 'ravi/hero-2'];
const SLIDE_MS = 7000;

export function Hero({ ready }: { ready: boolean }) {
  const [lines, setLines] = useState(0); // 0 none, 1 first line, 2 both
  const [still] = useState(() => prefersReducedMotion());
  const [inView, setInView] = useState(true);
  const [heard, setHeard] = useState(false); // the intro has played with sound once
  const [cap, setCap] = useState(-1);
  const [slide, setSlide] = useState(0);
  const v = useVoice();
  const talking = v.text === intro.listen && v.speaking;
  // Until the visitor turns sound on, offer the "Tap to hear Ravi" button.
  const ambient = !still && ready && !talking && !heard && inView;

  useEffect(() => {
    if (!ready) return;
    setLines(1);
    const t = window.setTimeout(() => setLines(2), 900);
    return () => clearTimeout(t);
  }, [ready]);

  useEffect(() => {
    const el = document.getElementById('home'); if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => { if (talking && v.playing) setHeard(true); }, [talking, v.playing]);

  // Slow crossfade between the photos while the hero is on screen.
  useEffect(() => {
    if (still || !inView || SLIDES.length < 2) return;
    const id = window.setInterval(() => setSlide((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [still, inView]);

  // Captions follow the intro audio.
  useEffect(() => {
    if (!talking) { setCap(-1); return; }
    const id = window.setInterval(() => {
      const d = voice.duration(); if (!d) return;
      const f = voice.time() / d;
      const i = CAP_ENDS.findIndex((e) => f <= e + 0.01);
      setCap(i < 0 ? CAPS.length - 1 : i);
    }, 200);
    return () => clearInterval(id);
  }, [talking]);

  const hearIntro = () => {
    if (v.muted) voice.toggleMute();
    voice.playPending();
    if (voice.current() !== intro.listen) voice.speak(intro.listen);
  };
  const live = talking && cap >= 0;

  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollToId(id); };

  return (
    <section className="hero" id="home" data-avatar="greeting" aria-label="Introduction">
      <div className="hero-bg" aria-hidden="true">
        {SLIDES.map((p, i) => (
          <picture key={p} className={'hero-ph' + (i === slide ? ' on' : '')}>
            <source media="(max-width: 760px)" srcSet={asset(p + '-m.webp')} />
            <img src={asset(p + '.webp')} srcSet={`${asset(p + '-md.webp')} 1280w, ${asset(p + '.webp')} 1920w`} sizes="100vw"
              alt="" decoding="async" loading={i === 0 ? 'eager' : 'lazy'} />
          </picture>
        ))}
        <div className="hero-shade" />
        <svg className="hero-dash" viewBox="0 0 600 200" preserveAspectRatio="none">
          <path className="dl" d="M0 170 C60 160 90 120 150 128 S250 80 300 96 S400 40 460 52 S560 20 600 18" />
          <path className="dl d2" d="M0 185 C80 182 120 160 190 166 S300 130 360 138 S470 104 600 90" />
        </svg>
      </div>

      <div className="wrap gut hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span className="dot" />{profile.credential} · {profile.location}</p>
          <h1><span className="im">I’m</span><span className="nm">Ravi Kumar</span></h1>
          <p className="role">{profile.title}</p>
          <p className="emp">{profile.employerLogo ? <img src={asset(profile.employerLogo)} alt={profile.employer} /> : profile.employer}</p>
          <p className="sum">{profile.summary}</p>
          <div className="ctas">
            <a className="btn gold" href="#about" onClick={go('about')} data-avatar-hover="greeting">Explore My Journey →</a>
            <a className="btn ghost" href={asset(profile.resume)} download="Ravi_Kumar_Resume.pdf" target="_blank" rel="noopener" data-avatar-hover="contact" data-avatar-say={say.resume}>Download Resume</a>
          </div>
          <div className="sec-links">
            <a href={profile.linkedin} target="_blank" rel="noopener" data-avatar-hover="contact" data-avatar-say={say.linkedin}>LinkedIn ↗</a>
            <a href="#contact" onClick={go('contact')} data-avatar-hover="contact" data-avatar-say={say.contactMe}>Contact Me</a>
            <ListenButton text={intro.listen} />
          </div>
        </div>

        <div className={'hero-stage' + (live ? ' is-live' : '')} aria-live="polite">
          <div className={'h-bubble b1' + (lines >= 1 ? ' on' : '')}>{intro.line1}</div>
          <div className={'h-bubble b2' + (lines >= 2 ? ' on' : '') + (live ? ' capt' : '')}>
            {live ? <><span className="cc-tag">● Speaking</span>{display(CAPS[cap])}</> : intro.line2}
          </div>
          {ambient && <button className="h-sound" data-voice-control onClick={hearIntro}><span aria-hidden="true">🔊</span> Tap to hear Ravi</button>}
          {profile.annotations.map((a, i) => <span key={a} className={`note n${i + 1}`} aria-hidden="true">{a}</span>)}
        </div>
      </div>

      <div className="ticker" aria-hidden="true"><div>{Array(2).fill(0).map((_, k) => <span key={k}>FP&amp;A · CONTROLLERSHIP · CONSOLIDATION · TREASURY · GOVERNANCE · US GAAP · IFRS · IND AS · ASC 606 · ZOHO ERP · TRANSFER PRICING ·&nbsp;</span>)}</div></div>
    </section>
  );
}

/** KPI strip: only resume-backed figures; counters animate into view. */
export function Kpis() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      ref.current!.querySelectorAll<HTMLElement>('[data-count]').forEach((b) => {
        const n = Number(b.dataset.count), pre = b.dataset.pre || '', suf = b.dataset.suf || ''; const o = { v: 0 };
        b.textContent = pre + '0' + suf;
        ScrollTrigger.create({ trigger: b, start: 'top 95%', once: true, onEnter: () => gsap.to(o, { v: n, duration: 1.6, ease: 'power3.out', onUpdate: () => { b.textContent = pre + Math.round(o.v) + suf; } }) });
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <div className="kpis-wrap gut">
      <div className="wrap kpis" ref={ref} role="list" aria-label="Key figures">
        {kpis.map((k, i) => (
          <div className="kpi" role="listitem" key={k.label} tabIndex={0} data-avatar-hover="about" data-avatar-say={say.kpis[i]}>
            <b data-count={k.value} data-pre={k.prefix} data-suf={k.suffix}>{k.prefix}{k.value}{k.suffix}</b>
            <span className="lbl">{k.label}</span>
            <span className="note2">{k.note}</span>
            <i className="spark" aria-hidden="true"><em /><em /><em /><em /><em /></i>
          </div>
        ))}
      </div>
    </div>
  );
}
