"use client";

import { useState, useTransition } from "react";
import { abrirGalleta } from "@/app/acciones";
import { GatoAsomado, GatoDormido } from "./gatitos";

type Estado = "lista" | "temblando" | "rota";

function DibujoGalleta() {
  return (
    <svg viewBox="0 0 200 130" className="w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="dorado" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6c987" />
          <stop offset="1" stopColor="#d9913f" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="118" rx="78" ry="6" fill="#4a2a22" opacity="0.1" />
      {/* papelito asomándose por el doblez */}
      <g className="mitad pliegue">
        <rect x="86" y="84" width="54" height="12" rx="1.5" fill="#fffbf5" stroke="#e8c9b4" transform="rotate(-10 113 90)" />
        <path d="M100 91 h22" stroke="#e8457a" strokeWidth="2" strokeLinecap="round" opacity="0.6" transform="rotate(-10 113 90)" />
      </g>
      <g className="mitad mitad-izq">
        <path
          d="M100 20 C 50 20, 8 52, 18 96 C 40 108, 70 104, 86 86 C 93 79, 100 80, 100 80 Z"
          fill="url(#dorado)"
          stroke="#b9783a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* borde interior doblado */}
        <path d="M22 94 C 42 102, 66 98, 82 86" stroke="#f8d9a8" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M40 54 q14 -20 40 -24" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.35" />
      </g>
      <g className="mitad mitad-der">
        <path
          d="M100 20 C 150 20, 192 52, 182 96 C 160 108, 130 104, 114 86 C 107 79, 100 80, 100 80 Z"
          fill="url(#dorado)"
          stroke="#b9783a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M178 94 C 158 102, 134 98, 118 86" stroke="#f8d9a8" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
      <path className="mitad pliegue" d="M100 21 Q 94 52 100 80" stroke="#b9783a" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
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
        <div className="relative mt-10 w-full max-w-sm">
          <GatoAsomado className="asoma absolute -top-[46px] left-1/2 w-24 -translate-x-1/2" />
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
