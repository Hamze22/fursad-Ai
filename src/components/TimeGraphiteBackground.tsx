import React, { useEffect, useRef } from 'react';

interface TimeGraphiteBackgroundProps {
  className?: string;
  intensity?: 'subtle' | 'vibrant' | 'high';
  interactive?: boolean;
  theme?: 'blue';
}

export const TimeGraphiteBackground: React.FC<TimeGraphiteBackgroundProps> = ({
  className = '',
  intensity = 'vibrant',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Interaction state
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    let time = 0;

    const render = () => {
      time += 0.002;
      
      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.02;
      mouse.y += (mouse.targetY - mouse.y) * 0.02;

      ctx.clearRect(0, 0, width, height);

      // Deep Black & Native Navy Slate Base Fill
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Native Deep Blue & Cobalt Blooms
      const blooms = [
        { x: 0.2, y: 0.25, r: 0.45, color: 'rgba(37, 99, 235, 0.16)', speed: 0.3 },   // Native Blue
        { x: 0.8, y: 0.65, r: 0.55, color: 'rgba(29, 78, 216, 0.14)', speed: 0.2 },   // Cobalt
        { x: 0.5, y: 0.45, r: 0.6, color: 'rgba(14, 165, 233, 0.09)', speed: 0.15 },  // Sky / Cyan
        { x: 0.35, y: 0.85, r: 0.35, color: 'rgba(30, 58, 138, 0.18)', speed: 0.25 }, // Deep Midnight Blue
      ];

      blooms.forEach((b) => {
        const x = width * (b.x + Math.sin(time * b.speed) * 0.1);
        const y = height * (b.y + Math.cos(time * b.speed) * 0.1);
        const radius = Math.max(width, height) * b.r;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, 'rgba(2, 6, 23, 0)');
        
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, width, height);
      });

      // Interactive Mouse Native Blue Glow
      if (interactive) {
        const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 380);
        mouseGrad.addColorStop(0, 'rgba(59, 130, 246, 0.07)');
        mouseGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = mouseGrad;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.globalCompositeOperation = 'source-over';
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [intensity, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none -z-10 w-full h-full ${className}`}
    />
  );
};
