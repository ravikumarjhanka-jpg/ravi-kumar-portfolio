// Shared runtime flags and asset paths.
export const BASE = import.meta.env.BASE_URL; // './' so the build works on any host or sub-folder
export const asset = (p: string) => BASE + p.replace(/^\//, '');

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Wide desktop: the full-size guide docks beside the content. */
export const isWide = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1180px)').matches;
export const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
