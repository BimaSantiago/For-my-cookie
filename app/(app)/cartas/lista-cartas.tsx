"use client";

import { useEffect, useState, useTransition } from "react";
import { BotonesEditor, campo } from "@/components/editor";
import { GatoSentado, Patita } from "@/components/gatitos";
import { borrarCarta, guardarCarta, marcarCartaLeida } from "../../acciones";

type CartaVista = {
  id: string;
  cuando: string;
  texto: string;
  disponible: string;
  parrafos: string[];
  bloqueadaHasta: string | null;
  leida: boolean;
};

export function ListaCartas({ cartas, firma, editor }: { cartas: CartaVista[]; firma: string; editor: boolean }) {
  const [abiertaId, setAbiertaId] = useState<string | null>(null);
  const [nueva, setNueva] = useState(false);
  const [leidas, setLeidas] = useState(() => new Set(cartas.filter((c) => c.leida).map((c) => c.id)));
  // Tras guardar, la lista llega actualizada del servidor; se busca por id para ver la versión nueva.
  const abierta = cartas.find((c) => c.id === abiertaId) ?? null;

  function abrir(carta: CartaVista) {
    if (carta.bloqueadaHasta && !editor) return;
    setAbiertaId(carta.id);
    if (!editor && !leidas.has(carta.id)) {
      setLeidas((s) => new Set(s).add(carta.id));
      marcarCartaLeida(carta.id).catch(() => {});
    }
  }

  return (
    <>
      {editor && (
        <button
          type="button"
          onClick={() => setNueva(true)}
          className="presionable mt-5 w-full rounded-2xl border-2 border-dashed border-chicle/50 py-3 font-display font-medium text-chicle"
        >
          + Agregar carta
        </button>
      )}

      <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5">
        {cartas.map((c, i) => {
          const leida = leidas.has(c.id);
          const bloqueada = Boolean(c.bloqueadaHasta) && !editor;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => abrir(c)}
                aria-disabled={bloqueada ? true : undefined}
                className={`presionable group relative block aspect-[4/3] w-full text-left ${
                  bloqueada ? "cursor-not-allowed" : ""
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

      {cartas.length === 0 && (
        <p className="mt-6 text-center text-sm text-cacao-suave">
          {editor ? "No hay cartas. Agrega una arriba." : "Pronto habrá cartas nuevas."}
        </p>
      )}

      {abierta && (
        <CartaAbierta carta={abierta} firma={firma} editor={editor} onCerrar={() => setAbiertaId(null)} />
      )}
      {nueva && (
        <Modal titulo="Carta nueva" onCerrar={() => setNueva(false)}>
          <FormularioCarta onListo={() => setNueva(false)} />
        </Modal>
      )}
    </>
  );
}

function Modal({
  titulo,
  onCerrar,
  children,
}: {
  titulo: string;
  onCerrar: () => void;
  children: React.ReactNode;
}) {
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
      aria-label={titulo}
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
          aria-label="Cerrar"
          className="presionable absolute top-2 right-2 grid h-10 w-10 place-items-center rounded-full text-2xl text-cacao-suave"
        >
          ×
        </button>
        {children}
      </article>
    </div>
  );
}

function CartaAbierta({
  carta,
  firma,
  editor,
  onCerrar,
}: {
  carta: CartaVista;
  firma: string;
  editor: boolean;
  onCerrar: () => void;
}) {
  const [editando, setEditando] = useState(false);

  return (
    <Modal titulo={`Ábrela cuando ${carta.cuando}`} onCerrar={onCerrar}>
      {editando ? (
        <FormularioCarta carta={carta} onListo={() => setEditando(false)} onBorrada={onCerrar} />
      ) : (
        <>
          <p className="text-sm font-semibold text-chicle">Ábrela cuando…</p>
          <h2 className="font-mano text-4xl leading-tight">{carta.cuando}</h2>
          {editor && (
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditando(true)}
                className="presionable rounded-full border-2 border-chicle px-4 py-1.5 text-sm font-semibold text-chicle"
              >
                Editar carta
              </button>
              {carta.bloqueadaHasta && (
                <span className="text-xs font-semibold text-cacao-suave">Ella la puede abrir el {carta.bloqueadaHasta}</span>
              )}
            </div>
          )}
          <div
            className="mt-4 space-y-[34px] font-mano text-[1.45rem] leading-[34px]"
            style={{ backgroundImage: "repeating-linear-gradient(transparent 0 32px, rgb(232 69 122 / 0.16) 32px 33px, transparent 33px 34px)" }}
          >
            {carta.parrafos.map((p, i) => (
              <p key={i} className="whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-8 flex items-end justify-between">
            <GatoSentado className="w-16" />
            <p className="font-mano text-2xl">Con todo mi amor, {firma}</p>
          </div>
        </>
      )}
    </Modal>
  );
}

function FormularioCarta({
  carta,
  onListo,
  onBorrada,
}: {
  carta?: CartaVista;
  onListo: () => void;
  onBorrada?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();

  function enviar(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const r = await guardarCarta(formData);
      if (r.ok) onListo();
      else setError(r.error);
    });
  }

  function borrar() {
    if (!carta) return;
    startTransition(async () => {
      await borrarCarta(carta.id);
      onBorrada?.();
    });
  }

  return (
    <form action={enviar} className="space-y-3">
      <p className="font-display text-xl font-semibold">{carta ? "Editar carta" : "Carta nueva"}</p>
      <input type="hidden" name="id" value={carta?.id ?? ""} />
      <label className="block">
        <span className="text-sm font-semibold">Ábrela cuando…</span>
        <input
          name="cuando"
          defaultValue={carta?.cuando}
          required
          maxLength={80}
          placeholder="me extrañes"
          className={campo}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">La carta</span>
        <span className="block text-xs text-cacao-suave">Deja una línea en blanco entre párrafos.</span>
        <textarea
          name="texto"
          defaultValue={carta?.texto}
          required
          rows={12}
          maxLength={6000}
          placeholder={"Galletita de mi corazón:\n\n…"}
          className={campo}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Se puede abrir desde (opcional)</span>
        <span className="block text-xs text-cacao-suave">Antes de esa fecha ella la ve con candado.</span>
        <input name="disponible" type="date" defaultValue={carta?.disponible} className={`${campo} min-h-11 appearance-none`} />
      </label>
      {error && (
        <p role="alert" className="text-sm font-semibold text-chicle">
          {error}
        </p>
      )}
      <BotonesEditor pendiente={pendiente} onCancelar={onListo} onBorrar={carta ? borrar : undefined} queBorrar="esta carta" />
    </form>
  );
}
