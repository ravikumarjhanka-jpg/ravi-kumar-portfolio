import { useState } from 'react';
import { about, experience, expertise, say } from '../content';
import { asset } from '../lib/env';
import IdCard from '../components/IdCard';
import { LINES, narrate, type AvatarState } from '../lib/avatar';
import { useVoice, voice } from '../lib/voice';

/**
 * Smaller screens only: a compact "Ravi says" card at the top of a section (his face, one line and a
 * play button) instead of a full-height pose, so the content stays in view. Tapping it reads the line aloud.
 */
export function InlinePose({ src, alt, mirror, state }: { src: string; alt: string; mirror?: boolean; state: AvatarState }) {
  const v = useVoice();
  const text = LINES[state].hover;
  const on = v.speaking && v.text === text;
  const play = () => {
    if (on) { voice.stop(); return; }
    if (v.muted) voice.toggleMute();
    narrate(text, state);
  };
  return (
    <button type="button" className={'say-card' + (on ? ' on' : '')} onClick={play} data-voice-control aria-label={on ? 'Stop Ravi' : `Hear Ravi: ${text}`}>
      <span className="sc-face"><img className={mirror ? 'mirror' : ''} src={asset(src)} alt={alt} loading="lazy" decoding="async" /></span>
      <span className="sc-body"><small>Ravi{on ? ' · speaking' : ''}</small><span>{text}</span></span>
      <span className="sc-play" aria-hidden="true">{on ? <i className="sc-eq"><em /><em /><em /></i> : '▶'}</span>
    </button>
  );
}

export function About() {
  return (
    <section className="sec gut" id="about" data-avatar="about">
      <div className="wrap content">
        <p className="eyebrow">About</p>
        <h2 className="h2 stack" data-avatar-hover="about">{about.title.map((t) => <span key={t}>{t}</span>)}</h2>
        <div className="about-grid">
          <div className="about-text">{about.text.map((p) => <p key={p}>{p}</p>)}</div>
          <IdCard />
        </div>
        <ul className="pills" aria-label="Areas of experience">{about.areas.map((a) => <li key={a}>{a}</li>)}</ul>
      </div>
    </section>
  );
}

export function Experience() {
  const [open, setOpen] = useState(0);
  return (
    <section className="sec gut" id="experience" data-avatar="experience">
      <div className="wrap content">
        <div className="sec-head" data-avatar-hover="experience">
          <div><p className="eyebrow">Experience</p><h2 className="h2">Fifteen years across <em>four roles.</em></h2></div>
          <p>Select a role to see what it covered.</p>
        </div>
        <InlinePose src="ravi/avatar-experience.webp" alt="Ravi Kumar walking with a folder" state="experience" />
        <ol className="timeline">
          {experience.map((e, i) => {
            const isOpen = open === i;
            return (
              <li key={e.org + e.period} className={(isOpen ? 'open ' : '') + (e.current ? 'current' : '')} data-reveal data-avatar-hover="experience" data-avatar-say={say.experience[i]}>
                <span className="t-node" aria-hidden="true" />
                <button className="t-head" aria-expanded={isOpen} aria-controls={`exp-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span className="t-period">{e.period}</span>
                  <span className="t-org">{e.org}</span>
                  <span className="t-role">{e.role}</span>
                  <span className="t-pm" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="t-body" id={`exp-${i}`} hidden={!isOpen}>
                  <p>{e.summary}</p>
                  <ul className="chips">{e.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function Expertise() {
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <section className="sec gut" id="expertise" data-avatar="skills">
      <div className="wrap content">
        <div className="sec-head" data-avatar-hover="skills">
          <div><p className="eyebrow">Expertise</p><h2 className="h2">Frameworks and <em>capabilities.</em></h2></div>
          <p>Fifteen capabilities named on his resume.</p>
        </div>
        <InlinePose src="ravi/avatar-skills.webp" alt="Ravi Kumar pointing toward his skills" mirror state="skills" />
        <ul className="xp-grid">
          {expertise.map((x, i) => (
            <li key={x.name} className="xp" tabIndex={0} onPointerMove={onMove} data-avatar-hover="skills" data-avatar-say={say.expertise[i]} data-reveal>
              <b>{x.name}</b><span>{x.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
