"use client";

import { useActionState } from "react";
import { entrar } from "../acciones";

export function FormularioEntrar() {
  const [error, accion, pendiente] = useActionState(entrar, null);
  return (
    <form action={accion} className="papel relative rounded-3xl p-6">
      <label htmlFor="nombre" className="font-display font-medium">
        Tu nombre
      </label>
      <input
        id="nombre"
        name="nombre"
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="go"
        placeholder="¿Cómo te digo?"
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "error-nombre" : undefined}
        className="mt-2 w-full rounded-xl border-2 border-fresa-2 bg-white px-4 py-3 outline-none focus:border-chicle"
      />
      {error && (
        <p id="error-nombre" role="alert" className="mt-2 text-sm font-semibold text-chicle">
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
