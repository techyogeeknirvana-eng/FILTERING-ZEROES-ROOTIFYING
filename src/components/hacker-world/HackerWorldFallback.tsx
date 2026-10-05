import React, { useEffect, useRef } from 'react';

/**
 * 2D Canvas Fallback if client browser/device does not support WebGL.
 */
export const HackerWorldFallback: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: { x: number; y: number; val: string; color: string }[] = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        val: Math.random() > 0.5 ? '1' : '0',
        color: Math.random() > 0.5 ? '#00f0ff' : '#ff1f43',
      });
    }

    let animId: number;
    const render = () => {
      ctx.fillStyle = 'rgba(4, 5, 7, 0.2)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += 0.4;
        if (p.y > height) p.y = 0;
        ctx.fillStyle = p.color;
        ctx.font = '11px monospace';
        ctx.fillText(p.val, p.x, p.y);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-[#040507] overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="relative z-10 text-center font-mono p-6">
        <h2 className="text-2xl font-black text-white">ACCESS THE ROOT</h2>
        <p className="text-xs text-cyber-cyan mt-2">
          2D COMPATIBILITY MODE ACTIVE // EXPLORE VIA ECOSYSTEM BELOW
        </p>
      </div>
    </div>
  );
};
