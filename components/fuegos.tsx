"use client";

import { useEffect, useRef } from "react";

type Particula = { x: number; y: number; vx: number; vy: number; vida: number; color: string; r: number };

const COLORES = ["#ff007f", "#00eaff", "#ffe600", "#ff9f43", "#b26bff", "#ff8fab"];

/** Fuegos artificiales en un canvas. Se apagan solos cuando terminan. */
export function Fuegos({ explosiones = 9 }: { explosiones?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ajustar = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ajustar();
    window.addEventListener("resize", ajustar);

    let particulas: Particula[] = [];
    const timers = Array.from({ length: explosiones }, (_, i) =>
      setTimeout(() => {
        const x = innerWidth * (0.15 + Math.random() * 0.7);
        const y = innerHeight * (0.12 + Math.random() * 0.4);
        for (let j = 0; j < 46; j++) {
          const angulo = Math.random() * Math.PI * 2;
          const vel = 1 + Math.random() * 3;
          particulas.push({
            x,
            y,
            vx: Math.cos(angulo) * vel,
            vy: Math.sin(angulo) * vel,
            vida: 1,
            color: COLORES[Math.floor(Math.random() * COLORES.length)],
            r: 1.2 + Math.random() * 1.8,
          });
        }
      }, i * 320),
    );

    let frame = 0;
    const inicio = performance.now();
    const dibujar = (t: number) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      particulas = particulas.filter((p) => p.vida > 0);
      for (const p of particulas) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.035;
        p.vida -= 0.0065;
        ctx.globalAlpha = Math.max(0, p.vida);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      const yaTermino = t - inicio > explosiones * 320 + 200 && particulas.length === 0;
      if (!yaTermino) frame = requestAnimationFrame(dibujar);
    };
    frame = requestAnimationFrame(dibujar);

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", ajustar);
    };
  }, [explosiones]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] h-full w-full" />;
}
