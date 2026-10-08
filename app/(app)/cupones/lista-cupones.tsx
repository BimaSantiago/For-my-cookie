"use client";

import { useState, useTransition } from "react";
import type { Cupon } from "@/content/cupones";
import { BotonesEditor, campo } from "@/components/editor";
import { Patita } from "@/components/gatitos";
import { borrarCupon, canjearCupon, guardarCupon } from "../../acciones";

const fmt = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" });

export function ListaCupones({
  cupones,
  canjeadosInicial,
  editor,
}: {
  cupones: Cupon[];
  canjeadosInicial: Record<string, string>;
  /** Su vista: puede agregar, editar y borrar, pero no canjear. */
  editor: boolean;
}) {
  const [canjeados, setCanjeados] = useState(canjeadosInicial);
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [editando, setEditando] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();

  function canjear(id: string) {
    if (editor) return;
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
    <>
      {editor && (
        <div className="mt-5">
          {editando === "nuevo" ? (
            <FormularioCupon onListo={() => setEditando(null)} />
          ) : (
            <button
              type="button"
              onClick={() => setEditando("nuevo")}
              className="presionable w-full rounded-2xl border-2 border-dashed border-chicle/50 py-3 font-display font-medium text-chicle"
            >
              + Agregar cupón
            </button>
          )}
        </div>
      )}

      <ul className="mt-6 space-y-4">
        {cupones.map((c) => {
          const fecha = canjeados[c.id];
          const preguntando = confirmando === c.id;
          if (editando === c.id) {
            return (
              <li key={c.id}>
                <FormularioCupon cupon={c} onListo={() => setEditando(null)} />
              </li>
            );
          }
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
                  {c.detalle && (
                    <p className={`mt-1 text-sm ${fecha ? "text-cacao/40" : "text-cacao-suave"}`}>{c.detalle}</p>
                  )}

                  {!fecha && !editor && (
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
                  {editor && (
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setEditando(c.id)}
                        className="presionable rounded-full border-2 border-chicle px-4 py-1.5 text-sm font-semibold text-chicle"
                      >
                        Editar
                      </button>
                      {!fecha && <span className="text-xs font-semibold text-cacao-suave">Sin canjear</span>}
                    </div>
                  )}
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

      {cupones.length === 0 && (
        <p className="mt-6 text-center text-sm text-cacao-suave">
          {editor ? "No hay cupones. Agrega uno arriba." : "Pronto habrá cupones nuevos."}
        </p>
      )}
    </>
  );
}

function FormularioCupon({ cupon, onListo }: { cupon?: Cupon; onListo: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();

  function enviar(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const r = await guardarCupon(formData);
      if (r.ok) onListo();
      else setError(r.error);
    });
  }

  function borrar() {
    if (!cupon) return;
    startTransition(async () => {
      await borrarCupon(cupon.id);
      onListo();
    });
  }

  return (
    <form action={enviar} className="papel space-y-3 rounded-2xl p-4">
      <p className="font-display font-semibold">{cupon ? "Editar cupón" : "Cupón nuevo"}</p>
      <input type="hidden" name="id" value={cupon?.id ?? ""} />
      <label className="block">
        <span className="text-sm font-semibold">Vale por…</span>
        <input
          name="titulo"
          defaultValue={cupon?.titulo}
          required
          maxLength={80}
          placeholder="Un abrazo de 5 minutos"
          className={campo}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Detalle (opcional)</span>
        <textarea
          name="detalle"
          defaultValue={cupon?.detalle}
          rows={2}
          maxLength={300}
          placeholder="Sin soltarte, aunque se nos duerman los brazos."
          className={campo}
        />
      </label>
      {error && (
        <p role="alert" className="text-sm font-semibold text-chicle">
          {error}
        </p>
      )}
      <BotonesEditor pendiente={pendiente} onCancelar={onListo} onBorrar={cupon ? borrar : undefined} queBorrar="este cupón" />
    </form>
  );
}
