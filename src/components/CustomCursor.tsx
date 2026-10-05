import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<string>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(pointer: coarse)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Check cursor data attribute on element or parents
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('[data-cursor]');
        if (interactive) {
          const type = interactive.getAttribute('data-cursor') || 'default';
          setCursorType(type);
        } else if (target.closest('a, button, input, [role="button"]')) {
          setCursorType('access');
        } else {
          setCursorType('default');
        }
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isTouch]);

  // Smooth trail effect
  useEffect(() => {
    if (isTouch) return;
    let animationId: number;
    const follow = () => {
      setTrail((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.22,
        y: prev.y + (pos.y - prev.y) * 0.22,
      }));
      animationId = requestAnimationFrame(follow);
    };
    animationId = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animationId);
  }, [pos, isTouch]);

  if (isTouch || !isVisible) return null;

  const isRed = cursorType === 'locked' || cursorType === 'zero';
  const isCyan = cursorType === 'explore' || cursorType === 'enter' || cursorType === 'access';

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Trailing Outer Ring */}
      <div
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,border-color,transform] duration-150 ease-out ${
          isRed
            ? 'border-cyber-red/80 shadow-[0_0_15px_rgba(255,31,67,0.5)]'
            : isCyan
            ? 'border-cyber-cyan/80 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
            : 'border-white/40'
        } ${
          cursorType === 'access' || cursorType === 'enter'
            ? 'w-12 h-12 rotate-45 border-dashed'
            : cursorType === 'locked'
            ? 'w-10 h-10 border-red-500 scale-95'
            : cursorType === 'explore'
            ? 'w-14 h-14 border-cyber-cyan'
            : 'w-7 h-7'
        }`}
        style={{
          transform: `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%)`,
        }}
      />

      {/* Center Reticle Point */}
      <div
        className={`fixed top-0 left-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-100 ${
          isRed ? 'bg-cyber-red' : isCyan ? 'bg-cyber-cyan' : 'bg-white'
        }`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
        }}
      />

      {/* Mode Tag */}
      {cursorType !== 'default' && (
        <div
          className={`fixed top-0 left-0 pl-4 pt-4 font-mono text-[9px] tracking-widest uppercase font-bold ${
            isRed ? 'text-cyber-red' : 'text-cyber-cyan'
          }`}
          style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          }}
        >
          [{cursorType}]
        </div>
      )}
    </div>
  );
};
