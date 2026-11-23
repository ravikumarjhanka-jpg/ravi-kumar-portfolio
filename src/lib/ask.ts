import { askRavi, profile, experience, about } from '../content';

/**
 * Ask Ravi answer engine.
 * - Default: predefined answers from content.ts (resume only), matched by question id or keywords.
 * - Later: set VITE_ASK_ENDPOINT to a server that calls an LLM with portfolioContext() as grounding.
 *   The LLM API key must live on that server. Never put API keys in frontend code.
 */
const ENDPOINT = import.meta.env.VITE_ASK_ENDPOINT as string | undefined;

export function portfolioContext(): string {
  const exp = experience.map((e) => `${e.role}, ${e.org} (${e.period}): ${e.summary} ${e.highlights.join(', ')}`).join('\n');
  return `${profile.name}, ${profile.title}, ${profile.employer}. ${profile.summary}\n${about.text.join(' ')}\n${exp}\nContact: ${profile.email}, ${profile.phone}, ${profile.linkedin}`;
}

export function answerLocally(q: string, id?: string): string {
  if (id && askRavi.answers[id]) return askRavi.answers[id].a;
  const text = ` ${q.toLowerCase()} `;
  let best = { a: askRavi.fallback, score: 0 };
  for (const item of Object.values(askRavi.answers)) {
    const score = item.keys.reduce((n, k) => n + (text.includes(k) ? (k.length > 4 ? 2 : 1) : 0), 0);
    if (score > best.score) best = { a: item.a, score };
  }
  return best.a;
}

export async function ask(question: string, id?: string): Promise<string> {
  if (ENDPOINT && !id) {
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, context: portfolioContext() }) });
      if (r.ok) { const d = (await r.json()) as { answer?: string }; if (d.answer) return d.answer; }
    } catch { /* fall back to local answers */ }
  }
  return answerLocally(question, id);
}
