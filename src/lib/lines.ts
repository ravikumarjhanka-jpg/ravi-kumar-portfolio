// Shared helpers for spoken lines. No DOM access here: scripts/voice-lines.ts imports this file
// to list every line and generate the recorded audio in public/voice/.
import { askRavi, intro, say, transformation } from '../content';
import { LINES } from './avatar-lines';

/** Stable key for a line: FNV-1a hash of the normalised text. Used to find its recorded clip. */
export function lineKey(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim();
  let h = 0x811c9dc5;
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(16).padStart(8, '0');
}

/**
 * Text rewritten so a speech engine pronounces finance terms correctly.
 * Lines that say "Ravi" are recorded with ElevenLabs v4 (same voice element), which pronounces
 * the name correctly; every other line uses Seed Audio. See README "Voice".
 */
export function spoken(text: string): string {
  return text
    .replace(/US\$(\d+)M/g, '$1 million US dollar')
    .replace(/INR (\d+) Cr/g, '$1 crore rupees')
    .replace(/(\d+)\+ year journey/g, '$1-plus-year journey')
    .replace(/(\d+)\+/g, '$1 plus')
    .replace(/ & /g, ' and ')
    .replace(/(\d+)%/g, '$1 percent')
    .replace(/FP&A/g, 'F P and A')
    .replace(/M&A/g, 'M and A')
    .replace(/\bUS GAAP\b/g, 'U S GAAP')
    .replace(/\bUK GAAP\b/g, 'U K GAAP')
    .replace(/\bIFRS\b/g, 'I F R S')
    .replace(/\bSFRS\b/g, 'S F R S')
    .replace(/\bInd AS\b/g, 'Ind A S')
    .replace(/\bASC 606\b/g, 'A S C six oh six')
    .replace(/\bGCC\b/g, 'G C C')
    .replace(/\bBOT\b/g, 'B O T')
    .replace(/\bMIS\b/g, 'M I S')
    .replace(/\bERP\b/g, 'E R P')
    .replace(/\bCFO\b/g, 'C F O')
    .replace(/\bCEO\b/g, 'C E O')
    .replace(/\bSEC\b/g, 'S E C')
    .replace(/\bKPIs\b/g, 'K P Is')
    .replace(/\bESOPs\b/g, 'ESOPs')
    .replace(/\bSAP\b/g, 'S A P')
    .replace(/\bPower BI\b/g, 'Power B I')
    .replace(/ – /g, ', ')
    .replace(/ · /g, ', ')
    .replace(/ravikumarjhankal@gmail\.com/g, 'ravi kumar jhankal at gmail dot com')
    .replace(/\+91 9901851754/g, 'plus 91, 99018, 51754');
}

/** Every line the avatar can speak aloud. */
export function allVoiceLines(): string[] {
  const out = new Set<string>([intro.listen]);
  Object.values(LINES).forEach((l) => out.add(l.hover));
  [say.experience, say.expertise, say.achievements, say.command, say.leadership, say.education, say.kpis].flat().forEach((t) => out.add(t));
  transformation.stages.forEach((_, i) => out.add(say.stage(i)));
  [say.resume, say.idcard, say.linkedin, say.contactMe, say.command_head, say.global_head, say.leadership_head].forEach((t) => out.add(t));
  Object.values(askRavi.answers).forEach((a) => out.add(a.a));
  out.add(askRavi.fallback);
  return [...out];
}
