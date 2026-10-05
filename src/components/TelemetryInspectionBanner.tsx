import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import { Compass, RotateCcw, CheckCircle2, ArrowUp } from 'lucide-react';

interface TelemetryEventDetail {
  targetAnchor?: string;
  title?: string;
}

export const TelemetryInspectionBanner: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(8);
  const [sectionTitle, setSectionTitle] = useState<string>('SECTION');
  const [userSelectedOption, setUserSelectedOption] = useState<boolean>(false);

  const bannerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleTelemetryInspect = (e: Event) => {
      const customEvent = e as CustomEvent<TelemetryEventDetail>;
      const title = customEvent.detail?.title || 'SECTION';

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      setSectionTitle(title);
      setSecondsLeft(8);
      setUserSelectedOption(false);
      setIsActive(true);

      timerRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            // Time expired without selecting an option: return to 3D world animation
            sound.playNavWhoosh();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    window.addEventListener('fz:telemetry-inspect', handleTelemetryInspect);
    return () => {
      window.removeEventListener('fz:telemetry-inspect', handleTelemetryInspect);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Detect when user clicks on an interactive element / selects an option in the section
  useEffect(() => {
    if (!isActive || userSelectedOption) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Ignore clicks within the banner itself
      if (bannerRef.current && bannerRef.current.contains(target)) {
        return;
      }

      // Check if user clicked an interactive option (button, link, card, form, or role="button")
      const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], [data-cursor], .cursor-pointer');
      if (isInteractive) {
        // User selected an option! Stop auto-return and stay in the section
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setUserSelectedOption(true);
        sound.playButtonConfirm();

        // Fade banner out after 1.8 seconds
        setTimeout(() => {
          setIsActive(false);
        }, 1800);
      }
    };

    window.addEventListener('click', handleDocumentClick, true);
    return () => window.removeEventListener('click', handleDocumentClick, true);
  }, [isActive, userSelectedOption]);

  const handleStayHere = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    sound.playButtonConfirm();
    setUserSelectedOption(true);
    setTimeout(() => {
      setIsActive(false);
    }, 1200);
  };

  const handleReturnNow = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    sound.playNavWhoosh();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsActive(false);
  };

  if (!isActive) return null;

  const progressPercent = Math.max(0, Math.min(100, (secondsLeft / 8) * 100));

  return (
    <div
      ref={bannerRef}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none animate-in fade-in slide-in-from-bottom-4 duration-300 font-mono"
    >
      <div className="relative overflow-hidden rounded-full bg-[#06080e]/95 border border-cyber-cyan/80 p-2 sm:px-6 sm:py-2.5 shadow-[0_0_40px_rgba(0,240,255,0.4)] backdrop-blur-md flex items-center gap-3 sm:gap-4 text-xs">
        {/* Animated countdown progress bar under the banner */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyber-cyan to-brand-green transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />

        {userSelectedOption ? (
          <div className="flex items-center gap-2 text-brand-green font-bold">
            <CheckCircle2 className="w-4 h-4 animate-bounce" />
            <span>OPTION SELECTED // REMAINING IN SECTION</span>
          </div>
        ) : (
          <>
            {/* Status & Countdown Indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-red animate-ping" />
              <Compass className="w-4 h-4 text-cyber-cyan" />
              <span className="hidden md:inline text-white/50 text-[11px]">TELEMETRY:</span>
              <span className="font-bold text-white text-[11px] sm:text-xs tracking-wider max-w-[140px] sm:max-w-none truncate">
                {sectionTitle}
              </span>
            </div>

            <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-1.5 text-cyber-cyan font-bold text-[11px] sm:text-xs">
              <RotateCcw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
              <span>RETURNING TO WORLD IN</span>
              <span className="px-1.5 py-0.5 rounded bg-cyber-cyan/20 text-white font-mono font-black border border-cyber-cyan/40">
                {secondsLeft}s
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={handleStayHere}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white/90 hover:text-white text-[10px] sm:text-[11px] font-bold cursor-pointer transition-colors"
                title="Cancel return timer and stay in this section"
              >
                STAY HERE
              </button>

              <button
                onClick={handleReturnNow}
                className="px-3 py-1 rounded bg-cyber-cyan text-black hover:bg-white text-[10px] sm:text-[11px] font-bold tracking-wider transition-all flex items-center gap-1 shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
                title="Return immediately to 3D world animation"
              >
                <span>RETURN</span>
                <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
