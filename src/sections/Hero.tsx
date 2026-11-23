import { useEffect, useRef, useState } from 'react';
import { intro, kpis, profile, say } from '../content';
import { asset, prefersReducedMotion } from '../lib/env';
import { gsap, ScrollTrigger, scrollToId } from '../lib/motion';
import { ListenButton } from '../components/VoiceBar';
import { useVoice, voice } from '../lib/voice';

/**
 * Hero: Ravi standing in his office. The intro clip is lip-synced to a muted video that plays in step
 * with the recorded voice (started, paused and kept in sync from the voice engine); otherwise he stands still.
 */
// The intro split into caption lines, each timed by its share of the clip.
const CAPS = intro.listen.split(/(?<=[.,])\s+/).reduce<string[]>((o, t) => {
  const last = o[o.length - 1];
  if (last && !last.endsWith('.') && last.length + t.length < 64) o[o.length - 1] = last + ' ' + t; else o.push(t);
  return o;
}, []);
const CAP_ENDS = (() => { const tot = CAPS.join('').length; let acc = 0; return CAPS.map((c) => (acc += c.length) / tot); })();
const display = (t: string) => t.replace('F P and A', 'FP&A').replace('G C C', 'GCC');

export function Hero({ ready }: { ready: boolean }) {
  const vid = useRef<HTMLVideoElement>(null);
  const [lines, setLines] = useState(0); // 0 none, 1 first line, 2 both
  const [still] = useState(() => prefersReducedMotion());
  const [sd] = useState(() => window.matchMedia('(max-width: 760px)').matches);
  const [inView, setInView] = useState(true);
  const [heard, setHeard] = useState(false); // the intro has played with sound once
  const [cap, setCap] = useState(-1);
  const v = useVoice();
  const talking = v.text === intro.listen && v.speaking;
  // Until the visitor turns sound on, Ravi keeps speaking silently with captions, like a muted video.
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

  // With sound: play in step with the intro audio and hold on pause. Without: loop silently.
  // After he has spoken with sound, rest on the standing pose.
  useEffect(() => {
    const el = vid.current; if (!el) return;
    if (talking) {
      el.loop = false;
      if (v.playing) {
        const t = voice.time();
        if (Math.abs(el.currentTime - t) > 0.25) el.currentTime = t;
        void el.play().catch(() => {});
      } else el.pause();
    } else if (ambient) {
      el.loop = true;
      void el.play().catch(() => {});
    } else { el.pause(); if (el.currentTime > 0) el.currentTime = 0; setCap(-1); }
  }, [talking, v.playing, ambient]);

  // Keep lips on the words: nudge the video if it drifts from the audio.
  useEffect(() => {
    if (!talking) return;
    const id = window.setInterval(() => {
      const el = vid.current; if (!el || el.paused) return;
      const d = el.currentTime - voice.time();
      if (Math.abs(d) > 0.18) el.currentTime = voice.time();
    }, 400);
    return () => clearInterval(id);
  }, [talking]);

  // Captions follow the video clock (which follows the audio when sound is on).
  useEffect(() => {
    const el = vid.current; if (!el) return;
    const on = () => {
      if (el.paused && !talking) return;
      const f = el.duration ? el.currentTime / el.duration : 0;
      const i = CAP_ENDS.findIndex((e) => f <= e + 0.01);
      setCap(i < 0 ? CAPS.length - 1 : i);
    };
    el.addEventListener('timeupdate', on);
    return () => el.removeEventListener('timeupdate', on);
  }, [talking]);

  const hearIntro = () => {
    if (v.muted) voice.toggleMute();
    voice.playPending();
    if (voice.current() !== intro.listen) voice.speak(intro.listen);
  };
  const live = (ambient || talking) && cap >= 0;

  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollToId(id); };

  return (
    <section className="hero" id="home" data-avatar="greeting" aria-label="Introduction">
      <div className="hero-bg" aria-hidden="true">
        {still
          ? <img src={asset('ravi/hero-stand.webp')} alt="" />
          : <video ref={vid} className={talking ? 'talking' : ''} muted playsInline preload="auto" poster={asset('ravi/hero-stand.webp')} src={asset(sd ? 'ravi/hero-talk-sd.mp4' : 'ravi/hero-talk.mp4')} />}
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
            {live ? <><span className="cc-tag">{talking ? '● Speaking' : 'Captions'}</span>{display(CAPS[cap])}</> : intro.line2}
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
