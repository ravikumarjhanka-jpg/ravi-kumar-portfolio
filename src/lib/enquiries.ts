import { profile } from '../content';

export type Enquiry = { name: string; email: string; company?: string; topic: string; message: string };

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const enquiriesEnabled = Boolean(URL && KEY);

/**
 * Saves an enquiry to the Supabase "enquiries" table (insert-only for the public key, see
 * supabase/schema.sql). The client library loads only when someone submits.
 * Returns 'saved' or 'email' (no database configured, so the visitor's email app is used).
 */
export async function submitEnquiry(e: Enquiry): Promise<'saved' | 'email'> {
  if (enquiriesEnabled) {
    const { createClient } = await import('@supabase/supabase-js');
    const sb = createClient(URL!, KEY!, { auth: { persistSession: false } });
    const { error } = await sb.from('enquiries').insert({
      name: e.name.slice(0, 120),
      email: e.email.slice(0, 200),
      company: (e.company || '').slice(0, 160),
      topic: e.topic.slice(0, 80),
      message: e.message.slice(0, 4000),
      source: 'portfolio',
    });
    if (error) throw new Error('We could not save your enquiry. Please email ' + profile.email + ' instead.');
    return 'saved';
  }
  const subject = encodeURIComponent(`Enquiry: ${e.topic}`);
  const body = encodeURIComponent(`${e.message}\n\n${e.name}${e.company ? ', ' + e.company : ''}\n${e.email}`);
  window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  return 'email';
}
