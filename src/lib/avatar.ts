import { useSyncExternalStore } from 'react';
import { asset } from './env';
import { LINES, type AvatarState } from './avatar-lines';
import { voice } from './voice';

/**
 * State-based avatar system (Option A: transparent WebP poses).
 * - scroll state: set by the section currently in view
 * - hover state: set by hover, keyboard focus or tap on anything with data-avatar-hover
 * - speech: an explicit line (Ask Ravi answers, transformation stages) that overrides the default text
 */
export type { AvatarState } from './avatar-lines';
export { LINES } from './avatar-lines';
type Pose = { img: string; mirror: boolean };

// mirror: true flips the pose so a right-pointing gesture faces the content on the left.
export const POSES: Record<AvatarState, Pose> = {
  idle: { img: 'ravi/avatar-idle.webp', mirror: false },
  greeting: { img: 'ravi/avatar-greeting.webp', mirror: false },
  about: { img: 'ravi/avatar-about.webp', mirror: false },
  experience: { img: 'ravi/avatar-experience.webp', mirror: false },
  skills: { img: 'ravi/avatar-skills.webp', mirror: true },
  achievement: { img: 'ravi/avatar-achievement.webp', mirror: false },
  presenting: { img: 'ravi/avatar-presenting.webp', mirror: true },
  education: { img: 'ravi/avatar-education.webp', mirror: false },
  contact: { img: 'ravi/avatar-contact.webp', mirror: false },
  explaining: { img: 'ravi/avatar-presenting.webp', mirror: true },
};

type Line = { state: AvatarState; text: string };
type Store = { scroll: AvatarState; scrollLine: string | null; hover: Line | null; talking: Line | null; speech: string | null; speechState: AvatarState | null; seq: number };
let store: Store = { scroll: 'greeting', scrollLine: null, hover: null, talking: null, speech: null, speechState: null, seq: 0 };
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const set = (p: Partial<Store>) => { store = { ...store, ...p }; emit(); };

export const avatar = {
  setScroll: (s: AvatarState, line: string | null = null) => { if (store.scroll !== s || store.scrollLine !== line) set({ scroll: s, scrollLine: line, speech: null, speechState: null }); },
  setHover: (l: Line | null) => { if (store.hover?.text !== l?.text || store.hover?.state !== l?.state) set({ hover: l }); },
  /** The line currently being spoken aloud; keeps the bubble in sync with the audio. */
  setTalking: (l: Line | null) => set({ talking: l }),
  say: (text: string, state: AvatarState = 'explaining') => set({ speech: text, speechState: state, hover: null, seq: store.seq + 1 }),
  clearSpeech: () => set({ speech: null, speechState: null }),
};

export function useAvatar() {
  const s = useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => store, () => store);
  const state: AvatarState = s.hover?.state ?? s.talking?.state ?? s.speechState ?? s.scroll;
  const text = s.hover?.text ?? s.talking?.text ?? s.speech ?? s.scrollLine ?? LINES[s.scroll].scroll;
  return { state, text, hovering: !!s.hover, seq: s.seq, explaining: s.speechState === 'explaining' };
}

/** Speak a line aloud and show it in the bubble until it finishes. */
export function narrate(text: string, state: AvatarState = 'explaining') {
  if (store.talking?.text === text && voice.isSpeaking()) return;
  avatar.setTalking({ state, text });
  voice.speak(text, { onEnd: () => { if (store.talking?.text === text) avatar.setTalking(null); } });
}

/** Preload only what the first screen needs; other poses load on first use. */
export function preloadPose(s: AvatarState) {
  const img = new Image(); img.decoding = 'async'; img.src = asset(POSES[s].img);
}

/**
 * Wire hover / focus / touch triggers for every [data-avatar-hover] element and
 * scroll triggers for every [data-avatar] section. Returns a cleanup function.
 */
export function bindAvatarTriggers(root: Document = document) {
  const offs: (() => void)[] = [];
  // Hover, keyboard focus or tap: Ravi gestures toward the item at once, and explains it aloud
  // after a short pause so sweeping the mouse across the page does not trigger a stream of clips.
  let dwell = 0;
  root.querySelectorAll<HTMLElement>('[data-avatar-hover]').forEach((el) => {
    const s = el.dataset.avatarHover as AvatarState;
    const line = () => ({ state: s, text: el.dataset.avatarSay || LINES[s].hover });
    const on = () => {
      const l = line();
      avatar.setHover(l); el.classList.add('is-guided');
      clearTimeout(dwell);
      dwell = window.setTimeout(() => narrate(l.text, l.state), 350);
    };
    const off = () => { clearTimeout(dwell); avatar.setHover(null); el.classList.remove('is-guided'); };
    el.addEventListener('pointerenter', on); el.addEventListener('pointerleave', off);
    el.addEventListener('focusin', on); el.addEventListener('focusout', off);
    offs.push(() => { el.removeEventListener('pointerenter', on); el.removeEventListener('pointerleave', off); el.removeEventListener('focusin', on); el.removeEventListener('focusout', off); });
  });
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { const el = e.target as HTMLElement; avatar.setScroll(el.dataset.avatar as AvatarState, el.dataset.avatarLine || null); } }),
    { rootMargin: '-40% 0px -55% 0px' },
  );
  root.querySelectorAll<HTMLElement>('[data-avatar]').forEach((el) => io.observe(el));
  offs.push(() => io.disconnect(), () => clearTimeout(dwell));
  return () => offs.forEach((f) => f());
}
