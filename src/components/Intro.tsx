import { useEffect, useState } from 'react';
import { profile } from '../content';
import { prefersReducedMotion } from '../lib/env';

/**
 * Cinematic landing: dark screen → light sweep → "RAVI KUMAR" → reveal the hero (≈1.6 s overlay;
 * the hero film and speech lines finish the sequence in about 3.5 s total). Skippable, and skipped
 * entirely for reduced motion or when already seen in this browser session.
 */
export default function Intro({ onDone }: { onDone: (skipped: boolean) => void }) {
  const [phase, setPhase] = useState<'play' | 'out' | 'gone'>(() => {
    if (prefersReducedMotion()) return 'gone';
    try { if (sessionStorage.getItem('rk-intro')) return 'gone'; } catch { /* storage blocked */ }
    return 'play';
  });

  useEffect(() => {
    if (phase === 'gone') { onDone(true); return; }
    try { sessionStorage.setItem('rk-intro', '1'); } catch { /* storage blocked */ }
    const t1 = window.setTimeout(() => setPhase('out'), 1500);
    const t2 = window.setTimeout(() => { setPhase('gone'); onDone(false); }, 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'gone') return null;
  const skip = () => { setPhase('gone'); onDone(true); };

  return (
    <div className={'intro' + (phase === 'out' ? ' out' : '')} role="presentation">
      <div className="intro-sweep" />
      <div className="intro-name"><span>{profile.name.toUpperCase()}</span><small>{profile.title} · {profile.employer}</small></div>
      <button className="intro-skip" onClick={skip}>Skip intro</button>
    </div>
  );
}
