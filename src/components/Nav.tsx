import { useEffect, useState } from 'react';
import { nav } from '../content';
import { scrollToId } from '../lib/motion';

/** Sticky navigation. Hovering or focusing an item makes Ravi gesture toward that section. */
export default function Nav() {
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on(); addEventListener('scroll', on, { passive: true });
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    nav.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => { removeEventListener('scroll', on); io.disconnect(); };
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); scrollToId(id); };

  return (
    <header className={'nav' + (scrolled ? ' scrolled' : '')}>
      <a className="skip" href="#main">Skip to content</a>
      <div className="wrap gut nav-in">
        <a className="logo" href="#home" onClick={go('home')} aria-label="Ravi Kumar, home">RK<span>.</span></a>
        <nav className={'menu-list' + (open ? ' open' : '')} aria-label="Sections">
          {nav.map((n) => (
            <a key={n.id} href={'#' + n.id} onClick={go(n.id)} data-avatar-hover={n.avatar} aria-current={active === n.id ? 'true' : undefined}>{n.label}</a>
          ))}
        </nav>
        <a className="btn gold sm" href="#contact" onClick={go('contact')} data-avatar-hover="contact">Let’s Connect</a>
        <button className="menu" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}><span /><span /></button>
      </div>
    </header>
  );
}
