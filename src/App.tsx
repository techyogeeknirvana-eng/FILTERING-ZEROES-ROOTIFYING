import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { LoadingCinematic } from './components/LoadingCinematic';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { HeroSection } from './components/HeroSection';
import { PhilosophySection } from './components/PhilosophySection';
import { FourDomainsSection } from './components/FourDomainsSection';
import { WhyRootifySection } from './components/WhyRootifySection';
import { EventJourneySection } from './components/EventJourneySection';
import { SpeakersSection } from './components/SpeakersSection';
import { RootifyFinaleSection } from './components/RootifyFinaleSection';
import { TimelineSection } from './components/TimelineSection';
import { CommandCenterSection } from './components/CommandCenterSection';
import { PassesSection } from './components/PassesSection';
import { CommunityPartnerSection } from './components/CommunityPartnerSection';
import { SponsorsSection } from './components/SponsorsSection';
import { VenueSection } from './components/VenueSection';
import { Footer } from './components/Footer';
import { TerminalModal } from './components/TerminalModal';
import { AudioPlayerHUD } from './components/AudioPlayerHUD';

export function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return !sessionStorage.getItem('fz_intro_viewed');
  });
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('fz_intro_viewed', 'true');
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && showIntro) {
        handleIntroComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showIntro]);

  return (
    <div className="relative min-h-screen bg-[#040507] text-[#e2e8f0] selection:bg-cyber-red selection:text-white">
      <CustomCursor />
      {showIntro && <LoadingCinematic onComplete={handleIntroComplete} />}
      <Navbar
        onReplayIntro={handleReplayIntro}
        onOpenTerminal={() => setTerminalOpen(true)}
      />
      <main className="relative z-10 flex flex-col">
        <HeroSection onOpenTerminal={() => setTerminalOpen(true)} />
        <PhilosophySection />
        <PassesSection />
        <FourDomainsSection />
        <WhyRootifySection />
        <EventJourneySection />
        <SpeakersSection />
        <RootifyFinaleSection />
        <TimelineSection />
        <CommandCenterSection />
        <CommunityPartnerSection />
        <SponsorsSection />
        <VenueSection />
      </main>
      <Footer />
      <AudioPlayerHUD />
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onReplayIntro={handleReplayIntro}
      />
      <Analytics />
    </div>
  );
}

export default App;
