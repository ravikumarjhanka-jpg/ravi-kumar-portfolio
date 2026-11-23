import { useSyncExternalStore } from 'react';
import manifest from '../data/voice-manifest.json';
import { asset } from './env';
import { lineKey, spoken } from './lines';

/**
 * Ravi's narration.
 * 1. Pre-recorded clips (public/voice/*.mp3, an AI clone of Ravi's own voice) for every line in the site.
 * 2. Any other text (e.g. answers from an optional server endpoint) uses a male browser voice.
 *
 * Browsers block sound until the visitor's first click, tap or key press. If the intro is blocked,
 * `needsTap` turns on (a "Tap to hear Ravi" button shows) and the first interaction plays it.
 */
// text: the line currently loaded; playing: audio is actually advancing (used to sync the hero video).
type V = { supported: boolean; speaking: boolean; paused: boolean; muted: boolean; needsTap: boolean; text: string | null; playing: boolean };
type Opts = { onEnd?: () => void; auto?: boolean };

const clips = manifest as Record<string, string>;
const hasWindow = typeof window !== 'undefined';
const synthOk = hasWindow && 'speechSynthesis' in window;
const readMuted = () => { try { return localStorage.getItem('rk-muted') === '1'; } catch { return false; } };

let v: V = { supported: hasWindow, speaking: false, paused: false, muted: hasWindow ? readMuted() : false, needsTap: false, text: null, playing: false };
const subs = new Set<() => void>();
const set = (p: Partial<V>) => { v = { ...v, ...p }; subs.forEach((f) => f()); };

let audio: HTMLAudioElement | null = null;
let mode: 'clip' | 'synth' | null = null;
let endCb: (() => void) | undefined;
let pending: { text: string; opts: Opts } | null = null;
let activated = false;

function el() {
  if (!audio) {
    audio = new Audio();
    audio.preload = 'auto';
    audio.addEventListener('ended', finish);
    audio.addEventListener('error', finish);
    audio.addEventListener('playing', () => set({ playing: true }));
    audio.addEventListener('pause', () => set({ playing: false }));
    audio.addEventListener('waiting', () => set({ playing: false }));
  }
  return audio;
}
function finish() { const cb = endCb; endCb = undefined; mode = null; set({ speaking: false, paused: false, playing: false, text: null }); cb?.(); }

// ---- browser-voice fallback (male voice preferred) ----
const MALE = /\bmale\b|prabhat|\bravi\b|rishi|madhur|daniel|arthur|oliver|george|ryan|guy|thomas|aaron|fred|\btom\b|christopher|eric|mark|david|james|william|liam|andrew|brian|\+m\d/i;
const FEMALE = /female|heera|veena|neerja|lekha|kalpana|samantha|karen|moira|tessa|serena|kate|susan|zira|hazel|fiona|victoria|allison|ava\b|martha|aria|jenny|libby|sonia|natasha|clara|emma|michelle|sara|\+f\d/i;
function maleVoice() {
  const vs = window.speechSynthesis.getVoices().filter((x) => /^en/i.test(x.lang) && !FEMALE.test(x.name));
  return vs.find((x) => MALE.test(x.name) && /en-IN/i.test(x.lang)) || vs.find((x) => MALE.test(x.name) && /en-GB/i.test(x.lang)) || vs.find((x) => MALE.test(x.name)) || vs[0];
}
function synth(text: string) {
  if (!synthOk) { finish(); return; }
  const u = new SpeechSynthesisUtterance(spoken(text));
  const mv = maleVoice();
  if (mv) { u.voice = mv; u.lang = mv.lang; }
  u.rate = 0.97; u.pitch = mv && MALE.test(mv.name) ? 0.9 : 0.7;
  u.onend = u.onerror = () => { if (mode === 'synth') finish(); };
  mode = 'synth';
  window.speechSynthesis.speak(u);
  set({ speaking: true, paused: false });
}

function halt() {
  if (audio) { audio.pause(); audio.removeAttribute('src'); audio.load(); }
  if (synthOk) window.speechSynthesis.cancel();
  mode = null;
}

let reqId = 0;

export const voice = {
  isSpeaking: () => v.speaking,
  current: () => (v.speaking ? v.text : null),
  speak(text: string, opts: Opts = {}) {
    if (!hasWindow || v.muted) return;
    halt();
    const prev = endCb; endCb = undefined; prev?.();
    const file = clips[lineKey(text)];
    if (!file) {
      if (!activated) { pending = { text, opts }; if (opts.auto) set({ needsTap: true }); return; }
      endCb = opts.onEnd; synth(text); return;
    }
    const a = el();
    a.src = asset(file);
    endCb = opts.onEnd;
    mode = 'clip';
    set({ speaking: true, paused: false, text });
    const req = ++reqId;
    a.play().then(() => { activated = true; if (v.needsTap) set({ needsTap: false }); }).catch((err: DOMException) => {
      if (req !== reqId) return; // an older request, replaced by a newer line: leave the new one alone
      endCb = undefined; mode = null; set({ speaking: false, playing: false, text: null });
      if (err && err.name === 'NotAllowedError') { pending = opts.auto ? { text, opts } : null; if (opts.auto) set({ needsTap: true }); }
    });
  },
  pause() {
    if (mode === 'clip' && audio) audio.pause();
    else if (mode === 'synth') window.speechSynthesis.pause();
    if (mode) set({ paused: true });
  },
  resume() {
    if (mode === 'clip' && audio) void audio.play();
    else if (mode === 'synth') window.speechSynthesis.resume();
    if (mode) set({ paused: false });
  },
  stop() { const cb = endCb; endCb = undefined; halt(); set({ speaking: false, paused: false, playing: false, text: null }); cb?.(); },
  /** Playback position of the current clip in seconds (for syncing video to the voice). */
  time: () => (audio && mode === 'clip' ? audio.currentTime : 0),
  toggleMute() {
    const m = !v.muted;
    if (m) voice.stop();
    try { localStorage.setItem('rk-muted', m ? '1' : '0'); } catch { /* storage blocked */ }
    set({ muted: m, needsTap: m ? false : v.needsTap });
  },
  /** Play the line that was blocked by the browser (called from the "Tap to hear" button). */
  playPending() {
    activated = true;
    const p = pending; pending = null;
    set({ needsTap: false });
    if (p) voice.speak(p.text, { ...p.opts, auto: false });
  },
};

// The first click, tap or key press unlocks sound. Replay the blocked intro only if the
// visitor is still near the top of the page; otherwise just unlock for hover narration.
if (hasWindow) {
  const unlock = (e: Event) => {
    if (activated) return;
    activated = true;
    const t = e.target as HTMLElement | null;
    if (t?.closest?.('[data-voice-control]')) return; // the button handles it itself
    if (pending && window.scrollY < window.innerHeight * 0.6) voice.playPending();
    else { pending = null; set({ needsTap: false }); }
  };
  ['pointerdown', 'keydown', 'touchend'].forEach((ev) => window.addEventListener(ev, unlock, { capture: true, passive: true }));
}

export const useVoice = () => useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => v, () => v);
