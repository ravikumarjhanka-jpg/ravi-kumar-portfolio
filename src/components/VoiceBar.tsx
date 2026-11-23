import { useEffect, useState } from 'react';
import { useVoice, voice } from '../lib/voice';

/**
 * Narration controls, bottom-left:
 * - "Tap to hear Ravi" when the browser blocked the intro (sound needs one click first)
 * - Pause / Resume, Stop, Mute while he is speaking
 * - a small sound on/off toggle the rest of the time
 */
export default function VoiceBar() {
  const v = useVoice();
  // On small screens the hero already has a "Listen to Ravi" button right where these controls sit,
  // so the floating controls wait until the hero has scrolled away.
  const [inHero, setInHero] = useState(true);
  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) { setInHero(false); return; }
    const io = new IntersectionObserver(([e]) => setInHero(e.intersectionRatio > 0.35), { threshold: [0, 0.35, 0.6] });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  if (!v.supported) return null;
  const hc = inHero ? ' in-hero' : '';
  if (v.needsTap && !v.muted) {
    return (
      <button className={'tap-hear' + hc} data-voice-control onClick={voice.playPending}>
        <span aria-hidden="true">🔊</span> Tap to hear Ravi
      </button>
    );
  }
  return (
    <>
      <div className={'voicebar' + (v.speaking ? ' on' : '')} role="region" aria-label="Voice playback" aria-hidden={!v.speaking}>
        <span className="vb-dot" aria-hidden="true" />
        <span className="vb-label">{v.paused ? 'Paused' : 'Ravi is speaking'}</span>
        {v.paused
          ? <button data-voice-control onClick={voice.resume} tabIndex={v.speaking ? 0 : -1}>Resume</button>
          : <button data-voice-control onClick={voice.pause} tabIndex={v.speaking ? 0 : -1}>Pause</button>}
        <button data-voice-control onClick={voice.stop} tabIndex={v.speaking ? 0 : -1}>Stop</button>
        <button data-voice-control onClick={voice.toggleMute} tabIndex={v.speaking ? 0 : -1}>Mute</button>
        <span className="vb-note">AI clone of Ravi’s voice</span>
      </div>
      <div className={'snd-group' + hc + (v.speaking ? ' hide' : '')}>
        <button className="snd" data-voice-control onClick={voice.toggleMute}
          aria-pressed={!v.muted} aria-label={v.muted ? 'Turn Ravi’s voice on' : 'Turn Ravi’s voice off'} title={v.muted ? 'Sound off' : 'Sound on'}>
          <span aria-hidden="true">{v.muted ? '🔇' : '🔊'}</span>
        </button>
      </div>
    </>
  );
}

export function ListenButton({ text, label = 'Listen to Ravi' }: { text: string; label?: string }) {
  const v = useVoice();
  if (!v.supported) return null;
  return (
    <button className="btn ghost sm listen" data-voice-control onClick={() => { if (v.muted) voice.toggleMute(); voice.playPending(); if (voice.current() !== text) voice.speak(text); }}>
      <span aria-hidden="true">🔊</span> {label}
    </button>
  );
}
