import { useEffect, useRef, useState } from 'react';
import { LINES, POSES, narrate, useAvatar } from '../lib/avatar';
import { asset } from '../lib/env';
import { useVoice, voice } from '../lib/voice';

/**
 * Smaller screens (under 1180px): one bottom dock for Ravi instead of a floating avatar button plus
 * separate voice controls. It opens briefly when a new section comes into view, stays open while he
 * speaks, and otherwise folds down to his face so it never sits on the content for long.
 */
export default function Dock() {
  const v = useVoice();
  const a = useAvatar();
  const [heroIn, setHeroIn] = useState(true);
  const [peek, setPeek] = useState(false);
  const [pinned, setPinned] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) { setHeroIn(false); return; }
    const io = new IntersectionObserver(([e]) => setHeroIn(e.intersectionRatio > 0.3), { threshold: [0, 0.3, 0.6] });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // A new section (or answer) shows its line for a few seconds, then the dock folds away.
  useEffect(() => {
    setPeek(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { setPeek(false); setPinned(false); }, 4500);
    return () => clearTimeout(timer.current);
  }, [a.state, a.seq]);

  // Opened by hand: fold again after a while unless he is speaking.
  useEffect(() => {
    if (!pinned) return;
    const t = window.setTimeout(() => setPinned(false), 8000);
    return () => clearTimeout(t);
  }, [pinned, v.speaking]);

  const speaking = v.speaking && !!v.text;
  const playLine = a.explaining && a.text ? a.text : LINES[a.state].hover;
  const shown = speaking ? (v.text as string) : playLine;
  const open = speaking || peek || pinned;

  // The tap itself unlocks sound, so this plays the line shown (never the blocked intro).
  const play = () => {
    if (speaking) { if (v.paused) voice.resume(); else voice.pause(); return; }
    if (v.muted) voice.toggleMute();
    narrate(playLine, a.state);
  };
  const face = POSES[a.state];

  return (
    <div className={'dock' + (heroIn ? '' : ' on') + (open ? ' open' : '') + (speaking && !v.paused ? ' talking' : '')} role="region" aria-label="Ravi, your guide">
      <button className="dk-face" data-voice-control onClick={() => { if (open && !speaking) { setPinned(false); setPeek(false); } else setPinned(true); }}
        aria-expanded={open} aria-label={open ? 'Fold Ravi away' : 'Show what Ravi is saying'}>
        <img src={asset(face.img)} alt="" className={face.mirror ? 'mirror' : ''} />
        <i className="dk-ring" aria-hidden="true" />
      </button>
      <div className="dk-body" aria-live="polite" aria-hidden={!open}>
        <small>Ravi{speaking ? (v.paused ? ' · paused' : ' · speaking') : ''}</small>
        <p>{shown}</p>
      </div>
      <div className="dk-ctl" aria-hidden={!open}>
        <button className="dk-play" data-voice-control onClick={play} tabIndex={open ? 0 : -1}
          aria-label={speaking ? (v.paused ? 'Resume' : 'Pause') : 'Play'}>{speaking && !v.paused ? '❚❚' : '▶'}</button>
        {speaking
          ? <button className="dk-btn" data-voice-control onClick={voice.stop} tabIndex={open ? 0 : -1} aria-label="Stop">■</button>
          : <button className="dk-btn" data-voice-control onClick={voice.toggleMute} tabIndex={open ? 0 : -1} aria-pressed={!v.muted} aria-label={v.muted ? 'Turn voice on' : 'Turn voice off'}>{v.muted ? '🔇' : '🔊'}</button>}
      </div>
    </div>
  );
}
