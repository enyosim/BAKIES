import { useCallback, useEffect, useImperativeHandle, useRef, forwardRef } from 'react';

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

const MAX_PARTICLES = 150;

export const ConfettiCanvas = forwardRef<ConfettiHandle>(function ConfettiCanvas(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  const startLoop = useCallback(() => {
    if (rafRef.current !== null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.6667, 2.5);
      lastTime = now;

      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);

      const list = particlesRef.current;
      let i = list.length - 1;
      while (i >= 0) {
        const p = list[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.22 * dt;
        const drag = Math.pow(0.99, dt);
        p.vx *= drag;
        p.rotation += p.vRot * dt;
        p.opacity -= p.decay * dt;

        if (p.opacity <= 0) {
          // O(1) swap-and-pop removal
          const last = list.length - 1;
          if (i !== last) {
            list[i] = list[last];
          }
          list.pop();
          i--;
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
          const w = p.size * 1.15;
          const h = p.size * 0.55;
          const r = h / 2;
          ctx.beginPath();
          ctx.roundRect(-w / 2, -h / 2, w, h, r);
          ctx.fill();
        }
        ctx.restore();
        i--;
      }

      if (list.length > 0) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, width, height);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      burst(originX: number, originY: number, count = 36) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const list = particlesRef.current;
        const available = Math.max(0, MAX_PARTICLES - list.length);
        const spawnCount = Math.min(count, available || Math.min(count, 24));

        for (let i = 0; i < spawnCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 7.5 + 2.5;
          list.push({
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

        if (list.length > 0) {
          startLoop();
        }
      },
    }),
    [startLoop]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      sizeRef.current = { width, height, dpr };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
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
