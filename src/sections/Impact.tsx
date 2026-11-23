import { useEffect, useRef, useState } from 'react';
import { achievements, commandCenter, transformation, say } from '../content';
import { avatar } from '../lib/avatar';
import { prefersReducedMotion } from '../lib/env';
import { ScrollTrigger } from '../lib/motion';
import { InlinePose } from './Journey';

/** Purely illustrative mini-charts. No figures, no real data. */
function Viz({ kind }: { kind: string }) {
  switch (kind) {
    case 'line':
      return (<svg viewBox="0 0 200 80" className="viz"><path className="grid" d="M0 20H200M0 40H200M0 60H200" /><path className="ln" d="M0 66 C25 60 40 48 62 52 S100 30 124 34 S168 14 200 10" /><path className="ln alt" d="M0 72 C30 70 60 62 90 64 S150 46 200 40" /></svg>);
    case 'regions':
      return (<svg viewBox="0 0 200 80" className="viz"><path className="arc" d="M40 50 Q100 0 160 38" /><path className="arc" d="M40 50 Q90 30 120 52" /><circle className="pt gold" cx="40" cy="50" r="5" /><circle className="pt" cx="160" cy="38" r="5" /><circle className="pt" cx="120" cy="52" r="5" /><text x="30" y="70">IN</text><text x="152" y="58">US</text><text x="112" y="72">ME</text></svg>);
    case 'consolidate':
      return (<svg viewBox="0 0 200 80" className="viz">{[10, 26, 42, 58].map((y) => <rect key={y} className="box" x="8" y={y} width="44" height="10" rx="2" />)}{[15, 31, 47, 63].map((y) => <path key={y} className="flow" d={`M52 ${y} C90 ${y} 100 40 132 40`} />)}<rect className="box gold" x="132" y="28" width="60" height="24" rx="4" /></svg>);
    case 'pipeline':
      return (<svg viewBox="0 0 200 80" className="viz"><path className="track" d="M14 40H186" />{[14, 72, 130, 186].map((x, i) => <circle key={x} className={'pt' + (i === 3 ? ' gold' : '')} cx={x} cy="40" r="7" />)}<path className="prog" d="M14 40H186" /></svg>);
    default:
      return (<svg viewBox="0 0 200 80" className="viz"><path className="shield" d="M100 8 L136 20 V42 C136 60 120 70 100 76 C80 70 64 60 64 42 V20 Z" /><path className="tick" d="M84 42 L96 54 L118 30" /></svg>);
  }
}

export function CommandCenter() {
  return (
    <section className="sec gut" id="command" data-avatar="presenting" data-avatar-line={say.command_head}>
      <div className="wrap content">
        <div className="sec-head" data-avatar-hover="presenting" data-avatar-say={say.command_head}>
          <div><p className="eyebrow">Command center</p><h2 className="h2">Finance Leadership <em>Command Center</em></h2></div>
          <p>Five areas he runs. Charts are visual metaphors only.</p>
        </div>
        <div className="cc">
          {commandCenter.map((m, i) => (
            <article key={m.key} className={'cc-mod m-' + m.key} data-reveal tabIndex={0} data-avatar-hover="presenting" data-avatar-say={say.command[i]}>
              <header><h3>{m.title}</h3><span className="live"><i />Module</span></header>
              <Viz kind={m.viz} />
              <ul>{m.items.map((i) => <li key={i}>{i}</li>)}</ul>
              <small className="illus">Illustrative visualization</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const ICONS: Record<string, string> = {
  deal: 'M4 18h16M6 18V9m4 9V5m4 13v-7m4 7v-4', erp: 'M4 6h16v12H4zM4 10h16M9 10v8', auto: 'M12 3v4m0 10v4M3 12h4m10 0h4M6 6l3 3m6 6 3 3M6 18l3-3m6-6 3-3',
  entities: 'M3 20h18M5 20V8l7-4 7 4v12M9 20v-6h6v6', globe: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  treasury: 'M4 9l8-5 8 5M5 9v9m4-9v9m6-9v9m4-9v9M3 20h18', ipo: 'M4 17l6-6 4 4 6-8M14 7h6v6', mis: 'M4 4h16v16H4zM8 15v-3m4 3V9m4 6v-5', team: 'M8 11a3 3 0 1 0 0-6a3 3 0 1 0 0 6M16 11a3 3 0 1 0 0-6M3 20c0-3 2-5 5-5s5 2 5 5M14 15c3 0 6 2 6 5',
};

export function Achievements() {
  return (
    <section className="sec gut" id="achievements" data-avatar="achievement">
      <div className="wrap content">
        <div className="sec-head" data-avatar-hover="achievement">
          <div><p className="eyebrow">Achievements</p><h2 className="h2">Milestones that <em>moved the business.</em></h2></div>
          <p>Each card is taken directly from his resume.</p>
        </div>
        <InlinePose src="ravi/avatar-achievement.webp" alt="Ravi Kumar standing confidently" state="achievement" />
        <div className="ach-grid">
          {achievements.map((a, i) => (
            <article key={a.title} className={'ach' + (i === 0 ? ' lead' : '')} data-reveal tabIndex={0} data-avatar-hover="achievement" data-avatar-say={say.achievements[i]}>
              <svg viewBox="0 0 24 24" className="ach-ic" aria-hidden="true"><path d={ICONS[a.icon]} /></svg>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
              <span className="src">{a.where}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Seven-stage flow. The active stage follows scroll; Ravi points to it and narrates. */
export function Transformation() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const items = listRef.current!.querySelectorAll('li');
    const sts = Array.from(items).map((li, i) => ScrollTrigger.create({
      trigger: li, start: 'top 60%', end: 'bottom 60%',
      onToggle: (st) => { if (st.isActive) { setActive(i); avatar.say(say.stage(i), 'skills'); } },
    }));
    return () => sts.forEach((s) => s.kill());
  }, []);
  return (
    <section className="sec gut" id="transformation" data-avatar="presenting">
      <div className="wrap content">
        <div className="sec-head" data-avatar-hover="presenting">
          <div><p className="eyebrow">Finance transformation</p><h2 className="h2">{transformation.title.split(' Into ')[0]} into <em>{transformation.title.split(' Into ')[1]}</em></h2></div>
          <p>Scroll through the stages. Ravi points to each one.</p>
        </div>
        <InlinePose src="ravi/avatar-presenting.webp" alt="Ravi Kumar presenting" mirror state="presenting" />
        <ol className="tf" ref={listRef} style={{ ['--p' as string]: `${(active / (transformation.stages.length - 1)) * 100}%` }}>
          {transformation.stages.map((s, i) => (
            <li key={s.name} className={(i <= active ? 'done ' : '') + (i === active ? 'now' : '')} tabIndex={0} data-avatar-hover="skills" data-avatar-say={say.stage(i)}>
              <span className="tf-n">{String(i + 1).padStart(2, '0')}</span>
              <div><h3>{s.name}</h3><p>{s.text}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
