import { education, leadership, say } from '../content';
import { InlinePose } from './Journey';

export function Leadership() {
  return (
    <section className="sec gut" id="leadership" data-avatar="about" data-avatar-line={say.leadership_head}>
      <div className="wrap content">
        <div className="sec-head" data-avatar-hover="about" data-avatar-say={say.leadership_head}>
          <div><p className="eyebrow">Leadership</p><h2 className="h2">Leadership <em>Beyond Numbers</em></h2></div>
          <p>Six traits, each backed by something he has done.</p>
        </div>
        <div className="lead-grid">
          {leadership.map((l, i) => (
            <article key={l.title} className="lcard" data-reveal tabIndex={0} data-avatar-hover="about" data-avatar-say={say.leadership[i]}><h3>{l.title}</h3><p>{l.text}</p></article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section className="sec gut" id="education" data-avatar="education">
      <div className="wrap content">
        <div className="sec-head" data-avatar-hover="education">
          <div><p className="eyebrow">Education</p><h2 className="h2">Where the <em>journey started.</em></h2></div>
        </div>
        <InlinePose src="ravi/avatar-education.webp" alt="Ravi Kumar holding a certificate" state="education" />
        <div className="edu-grid">
          {education.map((e, i) => (
            <article key={e.title} className="edu-card" data-reveal tabIndex={0} data-avatar-hover="education" data-avatar-say={say.education[i]}>
              <span className="yr">{e.year}</span>
              <h3>{e.title}</h3>
              <p>{e.org}</p>
              <span className="seal" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
