"use client";

import { useActionState } from "react";
import { entrar } from "../acciones";

export function FormularioEntrar() {
  const [error, accion, pendiente] = useActionState(entrar, null);
  return (
    <form action={accion} className="papel relative rounded-3xl p-6">
      <label htmlFor="fecha" className="font-display font-medium">
        Nuestro aniversario
      </label>
      <input
        id="fecha"
        name="fecha"
        type="date"
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "error-fecha" : undefined}
        className="mt-2 block min-h-12 w-full appearance-none rounded-xl border-2 border-fresa-2 bg-white px-4 py-3 text-cacao outline-none focus:border-chicle"
      />
      {error && (
        <p id="error-fecha" role="alert" className="mt-2 text-sm font-semibold text-chicle">
          {error}
        </p>
      )}
      <button
        disabled={pendiente}
        className="presionable mt-5 w-full rounded-full bg-chicle py-3 font-display text-lg font-medium text-white shadow-md disabled:opacity-70"
      >
        {pendiente ? "Abriendo…" : "Entrar"}
      </button>
    </form>
  );
}
