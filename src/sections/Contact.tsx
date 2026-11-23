import { useState } from 'react';
import { contact, profile, say } from '../content';
import { enquiriesEnabled, submitEnquiry } from '../lib/enquiries';
import { asset } from '../lib/env';
import { InlinePose } from './Journey';

/** Executive contact (Ravi waves). Details are exactly as on the resume. */
export default function Contact() {
  const [state, setState] = useState<'idle' | 'sending' | 'saved' | 'email' | 'error'>('idle');
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; const f = new FormData(form);
    if (f.get('website')) return; // honeypot
    setState('sending');
    try {
      const r = await submitEnquiry({ name: String(f.get('name') || ''), email: String(f.get('email') || ''), company: String(f.get('company') || ''), topic: String(f.get('topic') || ''), message: String(f.get('message') || '') });
      setState(r); if (r === 'saved') form.reset();
    } catch (x) { setErr((x as Error).message); setState('error'); }
  }
  const copy = (t: string) => { navigator.clipboard?.writeText(t).then(() => { setCopied(t); setTimeout(() => setCopied(''), 1500); }, () => {}); };

  return (
    <section className="sec gut" id="contact" data-avatar="contact">
      <div className="wrap content">
        <div className="contact">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="h2" data-avatar-hover="contact" data-avatar-say={say.contactMe}>{contact.title}</h2>
            <p className="lead">{contact.text}</p>
            <InlinePose src="ravi/avatar-contact.webp" alt="Ravi Kumar waving" state="contact" />
            <dl className="c-list">
              <div><dt>Email</dt><dd><a href={`mailto:${profile.email}`}>{profile.email}</a><button onClick={() => copy(profile.email)}>{copied === profile.email ? 'Copied' : 'Copy'}</button></dd></div>
              <div><dt>Phone</dt><dd><a href={`tel:${profile.phoneHref}`}>{profile.phone}</a><button onClick={() => copy(profile.phone)}>{copied === profile.phone ? 'Copied' : 'Copy'}</button></dd></div>
              <div><dt>Location</dt><dd>{profile.location}</dd></div>
              <div><dt>LinkedIn</dt><dd><a href={profile.linkedin} target="_blank" rel="noopener">linkedin.com/in/ravikumar-8579b236 ↗</a></dd></div>
              <div><dt>Resume</dt><dd><a href={asset(profile.resume)} download="Ravi_Kumar_Resume.pdf" target="_blank" rel="noopener">Download PDF ↓</a></dd></div>
            </dl>
          </div>
          <form className="enq" onSubmit={onSubmit}>
            <h3>Send a message</h3>
            <label>Topic<select name="topic" id="topic" required defaultValue=""><option value="" disabled>Choose a topic</option>{contact.topics.map((t) => <option key={t}>{t}</option>)}</select></label>
            <div className="row2">
              <label>Name<input id="name" name="name" required maxLength={120} autoComplete="name" /></label>
              <label>Email<input id="email" name="email" type="email" required maxLength={200} autoComplete="email" /></label>
            </div>
            <label>Company <span className="opt">(optional)</span><input id="company" name="company" maxLength={160} autoComplete="organization" /></label>
            <label>Message<textarea id="message" name="message" required rows={4} maxLength={4000} /></label>
            <input className="hp" tabIndex={-1} autoComplete="off" name="website" aria-hidden="true" />
            <button className="btn gold" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : enquiriesEnabled ? 'Send message' : 'Send by email'}</button>
            {state === 'saved' && <p className="ok">Thank you. Your message is saved and Ravi will reply by email.</p>}
            {state === 'email' && <p className="ok">Your email app should open with the message ready. If not, email {profile.email}.</p>}
            {state === 'error' && <p className="bad">{err}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
