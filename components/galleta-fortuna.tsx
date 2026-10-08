"use client";

import { useState, useTransition } from "react";
import { abrirGalleta } from "@/app/acciones";
import { GatoAsomado, GatoDormido } from "./gatitos";

type Estado = "lista" | "temblando" | "rota";

// Borde un poquito chueco, como galleta hecha en casa (siempre el mismo, para que no cambie entre renders).
const BORDE = Array.from({ length: 36 }, (_, i) => {
  const angulo = (i / 36) * Math.PI * 2;
  const r = 56 + Math.sin(i * 2.7) * 1.8 + Math.cos(i * 1.3) * 1.2;
  return `${(100 + Math.cos(angulo) * r).toFixed(1)},${(64 + Math.sin(angulo) * r * 0.97).toFixed(1)}`;
}).join(" ");

// La grieta por donde se parte, de arriba abajo.
const GRIETA = "100,0 94,28 105,46 95,66 104,86 97,106 101,130";

const CHISPAS = [
  { x: 72, y: 40, r: 7, g: 20 },
  { x: 118, y: 34, r: 6, g: -15 },
  { x: 140, y: 62, r: 7.5, g: 40 },
  { x: 62, y: 72, r: 6.5, g: -30 },
  { x: 86, y: 92, r: 7, g: 10 },
  { x: 124, y: 92, r: 6, g: 60 },
  { x: 108, y: 64, r: 5, g: -45 },
  { x: 82, y: 58, r: 4.5, g: 0 },
  { x: 150, y: 86, r: 4, g: 25 },
  { x: 52, y: 52, r: 4, g: 70 },
];

function MasaConChispas() {
  return (
    <>
      <polygon points={BORDE} fill="url(#masa)" stroke="#a8692e" strokeWidth="2.5" strokeLinejoin="round" />
      {/* brillo y textura de la masa */}
      <path d="M58 44 q16 -22 44 -24" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.3" />
      <g fill="#c98a3f" opacity="0.55">
        <circle cx="98" cy="40" r="1.6" />
        <circle cx="130" cy="48" r="1.4" />
        <circle cx="70" cy="86" r="1.5" />
        <circle cx="112" cy="104" r="1.6" />
        <circle cx="146" cy="74" r="1.3" />
        <circle cx="60" cy="62" r="1.2" />
      </g>
      {CHISPAS.map((c, i) => (
        <g key={i} transform={`rotate(${c.g} ${c.x} ${c.y})`}>
          <path
            d={`M${c.x - c.r} ${c.y + c.r * 0.3} Q${c.x - c.r * 0.6} ${c.y - c.r} ${c.x + c.r * 0.2} ${c.y - c.r * 0.9} Q${c.x + c.r * 1.1} ${c.y - c.r * 0.4} ${c.x + c.r * 0.8} ${c.y + c.r * 0.5} Q${c.x} ${c.y + c.r * 1.1} ${c.x - c.r} ${c.y + c.r * 0.3} Z`}
            fill="#4a2a22"
          />
          <circle cx={c.x - c.r * 0.25} cy={c.y - c.r * 0.35} r={c.r * 0.22} fill="#fff" opacity="0.35" />
        </g>
      ))}
    </>
  );
}

function DibujoGalleta() {
  return (
    <svg viewBox="0 0 200 130" className="w-full overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id="masa" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#f6cf8f" />
          <stop offset="0.7" stopColor="#e3a65c" />
          <stop offset="1" stopColor="#cf8d44" />
        </radialGradient>
        <clipPath id="corte-izq">
          <polygon points={`0,0 ${GRIETA} 0,130`} />
        </clipPath>
        <clipPath id="corte-der">
          <polygon points={`200,0 ${GRIETA} 200,130`} />
        </clipPath>
        <clipPath id="forma">
          <polygon points={BORDE} />
        </clipPath>
      </defs>
      <g className="mitad pliegue">
        <ellipse cx="100" cy="124" rx="62" ry="5" fill="#4a2a22" opacity="0.1" />
      </g>
      {/* papelito asomándose por la grieta */}
      <g className="mitad pliegue">
        <rect x="92" y="2" width="16" height="22" rx="1.5" fill="#fffbf5" stroke="#e8c9b4" transform="rotate(8 100 14)" />
        <path d="M97 8 v12" stroke="#e8457a" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" transform="rotate(8 100 14)" />
      </g>
      <g className="mitad mitad-izq">
        <g clipPath="url(#corte-izq)">
          <MasaConChispas />
        </g>
        {/* migajón que se ve al partirla */}
        <g clipPath="url(#forma)">
          <polyline points={GRIETA} fill="none" stroke="#f3d29c" strokeWidth="3" strokeLinejoin="round" clipPath="url(#corte-izq)" className="migajon" />
        </g>
      </g>
      <g className="mitad mitad-der">
        <g clipPath="url(#corte-der)">
          <MasaConChispas />
        </g>
        <g clipPath="url(#forma)">
          <polyline points={GRIETA} fill="none" stroke="#f3d29c" strokeWidth="3" strokeLinejoin="round" clipPath="url(#corte-der)" className="migajon" />
        </g>
      </g>
      {/* grieta antes de partirse */}
      <polyline className="mitad pliegue" points="98,22 105,46 95,66 103,82" fill="none" stroke="#a8692e" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" opacity="0.5" />
      {/* migajas que saltan */}
      <g className="migajas" fill="#d9a05a">
        <circle cx="100" cy="50" r="2.4" />
        <circle cx="98" cy="70" r="1.8" />
        <circle cx="102" cy="88" r="2.2" />
        <circle cx="99" cy="40" r="1.5" />
      </g>
    </svg>
  );
}

export function GalletaFortuna({
  restantesInicial,
  deHoyInicial,
  vistaPrevia,
}: {
  restantesInicial: number;
  deHoyInicial: string[];
  vistaPrevia: boolean;
}) {
  const [estado, setEstado] = useState<Estado>("lista");
  const [restantes, setRestantes] = useState(restantesInicial);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [deHoy, setDeHoy] = useState(deHoyInicial);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const agotada = restantes === 0 && estado === "lista";

  function abrir() {
    if (estado !== "lista" || restantes === 0) return;
    setError(null);
    setEstado("temblando");
    startTransition(async () => {
      const [resultado] = await Promise.all([
        abrirGalleta().catch(() => ({ ok: false as const, motivo: "No se pudo abrir. Revisa tu internet e intenta otra vez." })),
        new Promise((r) => setTimeout(r, 900)),
      ]);
      if (!resultado.ok) {
        setError(resultado.motivo);
        setEstado("lista");
        return;
      }
      navigator.vibrate?.(25);
      setMensaje(resultado.texto);
      setRestantes(resultado.restantes);
      if (!resultado.vistaPrevia) setDeHoy((d) => [...d, resultado.texto]);
      setEstado("rota");
    });
  }

  function otra() {
    setMensaje(null);
    setEstado("lista");
  }

  // Mensajes de hoy que no son el que se está mostrando.
  const anteriores = deHoy.filter((t) => t !== mensaje);

  return (
    <section aria-labelledby="titulo-galleta" className="flex flex-col items-center text-center">
      <h2 id="titulo-galleta" className="font-display text-2xl font-semibold">
        Tu galleta de la fortuna
      </h2>
      <p className="mt-1 text-sm text-cacao-suave">
        {vistaPrevia
          ? "Vista previa: lo que abras aquí no cuenta."
          : restantes === 0
            ? "Ya abriste las de hoy. Mañana hay más."
            : restantes === 1
              ? "Te queda 1 galleta hoy."
              : `Te quedan ${restantes} galletas hoy.`}
      </p>

      {agotada ? (
        <div className="mt-6 flex flex-col items-center">
          <GatoDormido className="w-48" />
          <p className="mt-2 max-w-60 font-mano text-2xl leading-tight">
            Los michis están horneando tus galletas de mañana
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={abrir}
          disabled={estado !== "lista"}
          aria-label="Abrir galleta de la fortuna"
          className={`presionable relative mt-4 w-56 cursor-pointer outline-offset-8 disabled:cursor-default ${
            estado === "lista" ? "flota" : ""
          }`}
        >
          <div
            className={`${estado === "temblando" ? "galleta-tiembla" : ""} ${
              estado === "rota" ? "galleta-rota" : ""
            }`}
          >
            <DibujoGalleta />
          </div>
          {estado === "lista" && (
            <span className="mt-1 block font-display text-sm font-medium text-chicle">Tócala para abrirla</span>
          )}
        </button>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-chicle">
          {error}
        </p>
      )}

      {estado === "rota" && mensaje && (
        <div className="relative mt-20 w-full max-w-sm">
          {/* el michi sale de detrás del papel y se recarga con las patitas en el borde */}
          <div className="absolute -top-[58px] left-1/2 z-10 h-[66px] w-28 -translate-x-1/2 overflow-hidden">
            <GatoAsomado className="asoma w-28" />
          </div>
          <div className="papel-sale papel relative rounded-md px-6 py-5">
            <p className="font-mano text-[1.65rem] leading-snug text-cacao">{mensaje}</p>
          </div>
          {restantes > 0 && (
            <button
              type="button"
              onClick={otra}
              className="presionable mt-5 rounded-full bg-chicle px-6 py-3 font-display font-medium text-white shadow-md"
            >
              Abrir otra galleta
            </button>
          )}
        </div>
      )}

      {anteriores.length > 0 && (
        <div className="mt-8 w-full max-w-sm text-left">
          <h3 className="font-display text-sm font-medium text-cacao-suave">Lo que te salió hoy</h3>
          <ul className="mt-2 space-y-2">
            {anteriores.map((t) => (
              <li key={t} className="papel rounded-md px-4 py-3 font-mano text-xl leading-snug">
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
