"use client";

import { useEffect, useState } from "react";
import { GatoSentado, Patita } from "@/components/gatitos";
import { marcarCartaLeida } from "../../acciones";

type CartaVista = {
  id: string;
  cuando: string;
  parrafos: string[];
  bloqueadaHasta: string | null;
  leida: boolean;
};

export function ListaCartas({ cartas, firma }: { cartas: CartaVista[]; firma: string }) {
  const [abierta, setAbierta] = useState<CartaVista | null>(null);
  const [leidas, setLeidas] = useState(() => new Set(cartas.filter((c) => c.leida).map((c) => c.id)));

  function abrir(carta: CartaVista) {
    if (carta.bloqueadaHasta) return;
    setAbierta(carta);
    if (!leidas.has(carta.id)) {
      setLeidas((s) => new Set(s).add(carta.id));
      marcarCartaLeida(carta.id).catch(() => {});
    }
  }

  return (
    <>
      <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5">
        {cartas.map((c, i) => {
          const leida = leidas.has(c.id);
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => abrir(c)}
                aria-disabled={c.bloqueadaHasta ? true : undefined}
                className={`presionable group relative block aspect-[4/3] w-full text-left ${
                  c.bloqueadaHasta ? "cursor-not-allowed" : ""
                }`}
                style={{ rotate: `${i % 2 === 0 ? -1.2 : 1.4}deg` }}
              >
                <span
                  className={`absolute inset-0 rounded-lg shadow-md ${
                    c.bloqueadaHasta ? "bg-[#efe3df]" : i % 3 === 0 ? "bg-[#fff1f5]" : i % 3 === 1 ? "bg-papel" : "bg-[#fdf0e1]"
                  }`}
                />
                {/* solapa del sobre */}
                <span
                  className="absolute inset-x-0 top-0 h-[55%] rounded-t-lg bg-black/[0.045]"
                  style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                />
                <span className="absolute top-[38%] left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-chicle shadow">
                  {c.bloqueadaHasta ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                      <rect x="5" y="11" width="14" height="9" rx="2" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                  ) : (
                    <Patita className="h-5 w-5 text-white" />
                  )}
                </span>
                <span className="absolute inset-x-2 bottom-2 text-center">
                  <span className="block font-mano text-[1.3rem] leading-[1.05] text-cacao">{c.cuando}</span>
                  <span className="mt-0.5 block text-[11px] font-semibold text-cacao-suave">
                    {c.bloqueadaHasta ? `Se abre el ${c.bloqueadaHasta}` : leida ? "Ya la leíste" : "Sin abrir"}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {abierta && <CartaAbierta carta={abierta} firma={firma} onCerrar={() => setAbierta(null)} />}
    </>
  );
}

function CartaAbierta({ carta, firma, onCerrar }: { carta: CartaVista; firma: string; onCerrar: () => void }) {
  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    document.addEventListener("keydown", alPresionar);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = overflow;
    };
  }, [onCerrar]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-carta"
      className="fondo-entra fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-cacao/45 px-4 pt-[calc(env(safe-area-inset-top,0px)+1.5rem)] pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]"
      onClick={onCerrar}
    >
      <article
        className="carta-sube relative mx-auto max-w-md rounded-md bg-papel px-6 pt-8 pb-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar carta"
          className="presionable absolute top-2 right-2 grid h-10 w-10 place-items-center rounded-full text-2xl text-cacao-suave"
        >
          ×
        </button>
        <p className="text-sm font-semibold text-chicle">Ábrela cuando…</p>
        <h2 id="titulo-carta" className="font-mano text-4xl leading-tight">
          {carta.cuando}
        </h2>
        <div
          className="mt-4 space-y-[34px] font-mano text-[1.45rem] leading-[34px]"
          style={{ backgroundImage: "repeating-linear-gradient(transparent 0 32px, rgb(232 69 122 / 0.16) 32px 33px, transparent 33px 34px)" }}
        >
          {carta.parrafos.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-8 flex items-end justify-between">
          <GatoSentado className="w-16" />
          <p className="font-mano text-2xl">Con todo mi amor, {firma}</p>
        </div>
      </article>
    </div>
  );
}
