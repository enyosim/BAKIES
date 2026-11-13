import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  opacity: number;
  decay: number;
  isCircle: boolean;
}

export interface ConfettiHandle {
  burst: (originX: number, originY: number, count?: number) => void;
}

const PASTEL_COLORS = [
  '#fb7185', // strawberry pink
  '#fcd34d', // buttercream yellow
  '#7dd3fc', // sky blue
  '#6ee7b7', // pistachio mint
  '#c4b5fd', // lavender
  '#fdba74', // peach
];

export const ConfettiCanvas = forwardRef<ConfettiHandle>(function ConfettiCanvas(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    burst(originX: number, originY: number, count = 36) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7.5 + 2.5;
        particlesRef.current.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          size: Math.random() * 8 + 5,
          color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 9,
          opacity: 1,
          decay: Math.random() * 0.018 + 0.012,
          isCircle: Math.random() > 0.55,
        });
      }
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const list = particlesRef.current;

      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22;
        p.vx *= 0.99;
        p.rotation += p.vRot;
        p.opacity -= p.decay;

        if (p.opacity <= 0) {
          list.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.isCircle) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Cute rounded sprinkle pill shape
          const w = p.size * 1.15;
          const h = p.size * 0.55;
          const r = h / 2;
          ctx.beginPath();
          ctx.roundRect(-w / 2, -h / 2, w, h, r);
          ctx.fill();
        }
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[1200]"
    />
  );
});
