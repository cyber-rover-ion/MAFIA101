import React, { useEffect, useRef } from 'react';

const PixelCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId;
    let particles = [];

    const initCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 28 : 50;

      particles = [];
      for (let i = 0; i < count; i++) {
        const rand = Math.random();
        let type = 'dust'; // default grey dust
        if (rand > 0.85) type = 'crimson'; // neon crimson ember
        else if (rand > 0.72) type = 'purple'; // neon purple particle

        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: type === 'dust' ? Math.random() * 1.4 + 0.8 : Math.random() * 2 + 1.2,
          speedX: (Math.random() - 0.5) * 0.16,
          speedY: type !== 'dust' ? -(Math.random() * 0.22 + 0.06) : (Math.random() - 0.5) * 0.12,
          type,
          baseOpacity: type === 'dust' ? Math.random() * 0.18 + 0.05 : Math.random() * 0.35 + 0.15,
          pulseSpeed: Math.random() * 0.02 + 0.008,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    let tick = 0;
    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      tick++;

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;

        const currentOpacity = p.baseOpacity + Math.sin(tick * p.pulseSpeed + p.pulsePhase) * 0.08;
        const opacity = Math.max(0.02, Math.min(currentOpacity, 0.55));

        if (p.type === 'crimson') {
          ctx.fillStyle = `rgba(255, 23, 68, ${opacity})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(255, 23, 68, 0.6)';
        } else if (p.type === 'purple') {
          ctx.fillStyle = `rgba(139, 92, 255, ${opacity * 0.9})`;
          ctx.shadowBlur = 5;
          ctx.shadowColor = 'rgba(139, 92, 255, 0.5)';
        } else {
          ctx.fillStyle = `rgba(160, 160, 180, ${opacity * 0.5})`;
          ctx.shadowBlur = 0;
        }

        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    initCanvas();
    draw();

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

export default PixelCanvas;
