import { useCallback, useEffect, useState } from 'react';
import Nav from './components/Nav';
import Intro from './components/Intro';
import AvatarGuide from './components/AvatarGuide';
import VoiceBar from './components/VoiceBar';
import Dock from './components/Dock';
import { Hero, Kpis } from './sections/Hero';
import { About, Experience, Expertise } from './sections/Journey';
import { Achievements, CommandCenter, Transformation } from './sections/Impact';
import Globe from './sections/Globe';
import { Education, Leadership } from './sections/People';
import Ask from './sections/Ask';
import Contact from './sections/Contact';
import { bindAvatarTriggers } from './lib/avatar';
import { initMagnetic, initReveals, initSmoothScroll, ScrollTrigger } from './lib/motion';
import { intro, profile } from './content';
import { voice } from './lib/voice';

export default function App() {
  const [ready, setReady] = useState(false);
  // When the intro finishes, Ravi introduces himself (if the visitor is at the top of the page).
  const onIntroDone = useCallback(() => {
    setReady(true);
    window.setTimeout(() => { if (window.scrollY < 200) voice.speak(intro.listen, { auto: true }); }, 400);
  }, []);

  useEffect(() => {
    initSmoothScroll();
    initReveals();
    initMagnetic();
    const unbind = bindAvatarTriggers();
    const refresh = () => ScrollTrigger.refresh();
    addEventListener('load', refresh);
    return () => { unbind(); removeEventListener('load', refresh); };
  }, []);

  return (
    <>
      <Intro onDone={onIntroDone} />
      <Nav />
      <main id="main">
        <Hero ready={ready} />
        <Kpis />
        <About />
        <Experience />
        <Expertise />
        <CommandCenter />
        <Achievements />
        <Transformation />
        <Globe />
        <Leadership />
        <Education />
        <Ask />
        <Contact />
      </main>
      <AvatarGuide />
      <VoiceBar />
      <Dock />
      <footer className="gut">
        <div className="wrap">
          <span>© {new Date().getFullYear()} {profile.name} · {profile.title}, {profile.employer}</span>
          <span>Avatar images are AI-generated from Ravi’s photo. The voice is an AI clone of Ravi’s own voice, used with his permission.</span>
        </div>
      </footer>
    </>
  );
}
