"use client";

import { useState, useSyncExternalStore } from "react";
import { Patita } from "./gatitos";

const CLAVE = "aviso-instalar-cerrado";

function yaNoMostrar() {
  const instalada =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  let cerrado = false;
  try {
    cerrado = localStorage.getItem(CLAVE) === "1";
  } catch {}
  return instalada || cerrado;
}

const sinSuscripcion = () => () => {};

/** Explica cómo agregar la página a la pantalla de inicio para que se abra como app. */
export function AvisoInstalar() {
  const oculto = useSyncExternalStore(sinSuscripcion, yaNoMostrar, () => true);
  const [cerrado, setCerrado] = useState(false);
  if (oculto || cerrado) return null;

  function cerrar() {
    try {
      localStorage.setItem(CLAVE, "1");
    } catch {}
    setCerrado(true);
  }

  return (
    <aside className="papel mt-6 flex gap-3 rounded-2xl p-4 text-sm">
      <Patita className="mt-0.5 h-6 w-6 shrink-0 text-galleta-osc" />
      <div className="flex-1">
        <p className="font-display font-semibold">Tenme siempre a la mano</p>
        <p className="mt-1 text-cacao-suave">
          En iPhone: toca Compartir y luego <b>Agregar a inicio</b>. En Android: abre el menú ⋮ y toca{" "}
          <b>Instalar app</b>. Así me abres como una app.
        </p>
        <button type="button" onClick={cerrar} className="presionable mt-2 font-semibold text-chicle">
          Entendido
        </button>
      </div>
    </aside>
  );
}
