"use client";

import { useState } from "react";

/** Estilo de los campos de texto en los formularios de edición. */
export const campo =
  "mt-1 block w-full rounded-xl border-2 border-fresa-2 bg-white px-3 py-2 text-cacao outline-none focus:border-chicle";

/** Guardar / Cancelar / Borrar (con confirmación) para los formularios de edición. */
export function BotonesEditor({
  pendiente,
  onCancelar,
  onBorrar,
  queBorrar,
}: {
  pendiente: boolean;
  onCancelar: () => void;
  onBorrar?: () => void;
  queBorrar: string;
}) {
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);

  if (confirmarBorrar && onBorrar) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">¿Borrar {queBorrar}?</span>
        <button
          type="button"
          disabled={pendiente}
          onClick={onBorrar}
          className="presionable rounded-full bg-cacao px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pendiente ? "Borrando…" : "Sí, borrar"}
        </button>
        <button
          type="button"
          onClick={() => setConfirmarBorrar(false)}
          className="presionable px-3 py-2 text-sm font-semibold text-cacao-suave"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        disabled={pendiente}
        className="presionable rounded-full bg-chicle px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pendiente ? "Guardando…" : "Guardar"}
      </button>
      <button type="button" onClick={onCancelar} className="presionable px-3 py-2 text-sm font-semibold text-cacao-suave">
        Cancelar
      </button>
      {onBorrar && (
        <button
          type="button"
          onClick={() => setConfirmarBorrar(true)}
          className="presionable ml-auto px-3 py-2 text-sm font-semibold text-cacao-suave underline"
        >
          Borrar
        </button>
      )}
    </div>
  );
}
