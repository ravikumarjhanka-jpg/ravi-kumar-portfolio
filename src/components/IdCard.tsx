import { useRef, useState } from 'react';
import { education, profile, say } from '../content';
import { asset, finePointer, prefersReducedMotion } from '../lib/env';

/**
 * Lanyard ID card. Swings gently, tilts toward the cursor, and flips on click, tap or Enter.
 * Front: photo, name, title, start year and base. Back: credentials and contact.
 */
export default function IdCard() {
  const [flipped, setFlipped] = useState(false);
  const tilt = useRef<HTMLDivElement>(null);
  const rm = prefersReducedMotion();

  const onMove = (e: React.PointerEvent) => {
    if (rm || !finePointer() || !tilt.current) return;
    const r = tilt.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    tilt.current.style.setProperty('--tx', `${(-y * 10).toFixed(2)}deg`);
    tilt.current.style.setProperty('--ty', `${(x * 14).toFixed(2)}deg`);
  };
  const onLeave = () => { tilt.current?.style.setProperty('--tx', '0deg'); tilt.current?.style.setProperty('--ty', '0deg'); };
  const flip = () => setFlipped((f) => !f);

  return (
    <div className={'idc-wrap' + (rm ? ' still' : '')}>
      <div className="idc-strap" aria-hidden="true" />
      <div className="idc-swing">
        <span className="idc-clip" aria-hidden="true" />
        <div className="idc-tilt" ref={tilt} onPointerMove={onMove} onPointerLeave={onLeave}>
          <button className={'idc' + (flipped ? ' flipped' : '')} onClick={flip} aria-pressed={flipped}
            aria-label={flipped ? 'ID card, back: credentials and contact. Press to flip to the front.' : `ID card for ${profile.name}. Press to flip.`}
            data-avatar-hover="about" data-avatar-say={say.idcard}>
            <span className="idc-face idc-front" aria-hidden={flipped}>
              <span className="idc-top"><b>RK</b><span>Group Finance</span></span>
              <img src={asset('ravi/id-photo.webp')} alt={`${profile.name}, portrait`} width={640} height={665} loading="lazy" decoding="async" />
              <span className="idc-name">{profile.name.toUpperCase()}</span>
              <span className="idc-role">{profile.title}</span>
              <span className="idc-meta">
                <span><small>In finance since</small><b>Mar 2011</b></span>
                <span><small>Based in</small><b>Bengaluru</b></span>
              </span>
              <span className="idc-foot"><i aria-hidden="true">↻</i> Tap to flip</span>
            </span>
            <span className="idc-face idc-back" aria-hidden={!flipped}>
              <span className="idc-top"><b>RK</b><span>{profile.employer}</span></span>
              <span className="idc-sec">Credentials</span>
              {education.map((e) => (
                <span className="idc-row" key={e.title}><b>{e.title.split(' – ')[0]}</b><small>{e.org} · {e.year}</small></span>
              ))}
              <span className="idc-sec">Contact</span>
              <span className="idc-row"><small>Email</small><b>{profile.email}</b></span>
              <span className="idc-row"><small>Phone</small><b>{profile.phone}</b></span>
              <span className="idc-row"><small>LinkedIn</small><b>/in/ravikumar-8579b236</b></span>
              <span className="idc-foot"><i aria-hidden="true">↻</i> Tap to flip back</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
