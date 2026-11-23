import { useEffect, useRef, useState } from 'react';
import { askRavi } from '../content';
import { ask } from '../lib/ask';
import { avatar, narrate } from '../lib/avatar';
import { useVoice } from '../lib/voice';
import { InlinePose } from './Journey';

type Msg = { who: 'you' | 'ravi'; text: string };

/** Ask Ravi: predefined, resume-only answers. Ravi switches to his explaining pose and speaks in a bubble. */
export default function Ask() {
  const [msgs, setMsgs] = useState<Msg[]>([{ who: 'ravi', text: 'Pick a question, or type your own. I answer from my resume only.' }]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  const v = useVoice();

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: 'smooth' }); }, [msgs]);

  async function send(text: string, id?: string) {
    const t = text.trim(); if (!t || busy) return;
    setMsgs((m) => [...m, { who: 'you', text: t }]); setQ(''); setBusy(true);
    const a = await ask(t, id);
    setMsgs((m) => [...m, { who: 'ravi', text: a }]); setBusy(false);
    avatar.say(a, 'explaining');
    narrate(a, 'explaining');
  }

  return (
    <section className="sec gut" id="ask" data-avatar="explaining">
      <div className="wrap content">
        <div className="sec-head" data-avatar-hover="explaining">
          <div><p className="eyebrow">Ask Ravi</p><h2 className="h2">Ask <em>Ravi.</em></h2></div>
          <p>Answers come only from his resume. Ravi reads each answer aloud; tap 🔊 to hear it again.</p>
        </div>
        <InlinePose src="ravi/avatar-presenting.webp" alt="Ravi Kumar explaining" mirror state="explaining" />
        <div className="ask">
          <div className="qs" role="list">
            {askRavi.questions.map((x) => <button key={x.id} role="listitem" onClick={() => send(x.q, x.id)}>{x.q}</button>)}
          </div>
          <div className="ask-panel">
            <div className="chat" ref={log} aria-live="polite">
              {msgs.map((m, i) => (
                <div key={i} className={'msg ' + m.who}>
                  <span className="who">{m.who === 'you' ? 'You' : 'Ravi'}</span>
                  <p>{m.text}</p>
                  {m.who === 'ravi' && i > 0 && v.supported && <button className="say" data-voice-control onClick={() => narrate(m.text, 'explaining')} aria-label="Listen to this answer">🔊</button>}
                </div>
              ))}
              {busy && <div className="msg ravi"><span className="who">Ravi</span><p>…</p></div>}
            </div>
            <form className="ask-form" onSubmit={(e) => { e.preventDefault(); send(q); }}>
              <label htmlFor="askIn" className="sr">Your question for Ravi</label>
              <input id="askIn" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about his experience…" autoComplete="off" maxLength={300} />
              <button type="submit" className="btn gold sm" disabled={busy}>Ask</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
