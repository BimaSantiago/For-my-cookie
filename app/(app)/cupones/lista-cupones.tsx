"use client";

import { useState, useTransition } from "react";
import type { Cupon } from "@/content/cupones";
import { Patita } from "@/components/gatitos";
import { canjearCupon } from "../../acciones";

const fmt = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" });

export function ListaCupones({
  cupones,
  canjeadosInicial,
  vistaPrevia,
}: {
  cupones: Cupon[];
  canjeadosInicial: Record<string, string>;
  vistaPrevia: boolean;
}) {
  const [canjeados, setCanjeados] = useState(canjeadosInicial);
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();

  function canjear(id: string) {
    if (vistaPrevia) return;
    startTransition(async () => {
      const fecha = await canjearCupon(id);
      if (fecha) {
        navigator.vibrate?.([15, 40, 15]);
        setCanjeados((c) => ({ ...c, [id]: fecha }));
      }
      setConfirmando(null);
    });
  }

  return (
    <ul className="mt-6 space-y-4">
      {cupones.map((c) => {
        const fecha = canjeados[c.id];
        const preguntando = confirmando === c.id;
        return (
          <li key={c.id} className="relative">
            <div
              className={`relative flex overflow-hidden rounded-2xl shadow-md ${fecha ? "bg-[#f3ebe7]" : "bg-papel"}`}
              style={{
                // muescas a los lados, como boleto
                mask: "radial-gradient(circle 10px at 0 50%, #0000 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 10px at 100% 50%, #0000 98%, #000) right / 51% 100% no-repeat",
              }}
            >
              <div className={`flex w-16 shrink-0 items-center justify-center ${fecha ? "bg-cacao-suave/30" : "bg-galleta"}`}>
                <Patita className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1 border-l-2 border-dashed border-cacao/15 px-4 py-4">
                <p className="text-xs font-semibold text-chicle">Vale por</p>
                <p className={`font-display text-lg leading-tight font-semibold ${fecha ? "text-cacao/50" : ""}`}>
                  {c.titulo}
                </p>
                <p className={`mt-1 text-sm ${fecha ? "text-cacao/40" : "text-cacao-suave"}`}>{c.detalle}</p>

                {!fecha && !vistaPrevia && (
                  <div className="mt-3 flex gap-2">
                    {preguntando ? (
                      <>
                        <button
                          type="button"
                          disabled={pendiente}
                          onClick={() => canjear(c.id)}
                          className="presionable rounded-full bg-chicle px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          {pendiente ? "Canjeando…" : "Sí, canjearlo"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmando(null)}
                          className="presionable rounded-full px-3 py-2 text-sm font-semibold text-cacao-suave"
                        >
                          Todavía no
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmando(c.id)}
                        className="presionable rounded-full border-2 border-chicle px-4 py-1.5 text-sm font-semibold text-chicle"
                      >
                        Canjear
                      </button>
                    )}
                  </div>
                )}
                {!fecha && vistaPrevia && <p className="mt-2 text-xs font-semibold text-cacao-suave">Sin canjear</p>}
              </div>
            </div>
            {fecha && (
              <div className="sello pointer-events-none absolute top-1/2 right-4 -mt-9 grid h-[72px] w-[72px] place-items-center rounded-full border-[3px] border-menta text-center text-[10px] leading-tight font-extrabold text-menta">
                <span>
                  CANJEADO
                  <br />
                  {fmt.format(new Date(fecha))}
                </span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
