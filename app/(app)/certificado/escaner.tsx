"use client";

import { useRef, useState } from "react";
import { Certificado, Huella } from "@/components/certificado";
import { Fuegos } from "@/components/fuegos";
import { Lluvia } from "@/components/lluvia";
import { fechaHoraLarga } from "@/lib/fechas";
import { sellarCertificado } from "../../acciones";

const DURACION_MS = 2500;

type Fase = "esperando" | "escaneando" | "guardando" | "listo";

export function Escaner({
  selladoEnInicial,
  novioDesde,
  firma,
  ella,
  vistaPrevia,
}: {
  selladoEnInicial: string | null;
  novioDesde: string;
  firma: string;
  ella: string;
  vistaPrevia: boolean;
}) {
  const [selladoEn, setSelladoEn] = useState(selladoEnInicial);
  const [fase, setFase] = useState<Fase>(selladoEnInicial ? "listo" : "esperando");
  const [celebrar, setCelebrar] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function empezar(e: React.PointerEvent) {
    if (fase !== "esperando") return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setAviso(null);
    setFase("escaneando");
    navigator.vibrate?.(10);
    timer.current = setTimeout(terminar, DURACION_MS);
  }

  function cancelar() {
    if (fase !== "escaneando") return;
    clearTimeout(timer.current);
    setFase("esperando");
    setAviso("Se te soltó el dedo. Mantenlo hasta que termine el escaneo.");
  }

  async function terminar() {
    setFase("guardando");
    try {
      const resultado = await sellarCertificado();
      navigator.vibrate?.([30, 60, 30, 60, 80]);
      setSelladoEn(resultado.selladoEn);
      if (resultado.vistaPrevia) setAviso("Vista previa: el certificado no se guardó. Ella lo sellará con su dedo.");
      setFase("listo");
      setCelebrar(true);
    } catch {
      setFase("esperando");
      setAviso("No se pudo guardar. Revisa tu internet e inténtalo otra vez.");
    }
  }

  if (fase === "listo" && selladoEn) {
    return (
      <>
        {celebrar && (
          <>
            <Fuegos />
            <Lluvia direccion="sube" cantidad={22} />
          </>
        )}
        <div className={celebrar ? "cert-aparece" : ""}>
          <Certificado selladoEn={fechaHoraLarga(selladoEn)} novioDesde={novioDesde} firma={firma} ella={ella} />
        </div>
        {aviso && <p className="mt-4 text-center text-sm font-semibold text-chicle">{aviso}</p>}
        {!aviso && (
          <div className="mt-6 text-center">
            <a
              href="/certificado/imagen"
              download="Certificado-de-Amor.png"
              className="presionable inline-block rounded-full bg-chicle px-6 py-3 font-display font-medium text-white shadow-md"
            >
              Guardar certificado como imagen
            </a>
          </div>
        )}
      </>
    );
  }

  const escaneando = fase === "escaneando" || fase === "guardando";

  return (
    <div className="flex flex-col items-center pt-4 text-center">
      <p className="font-display text-2xl leading-snug font-semibold text-[#b10077]">
        Pon tu dedo aquí
        <br />y descubre algo 💞
      </p>
      <p className="mt-2 text-sm text-cacao-suave" aria-live="polite">
        {fase === "guardando"
          ? "Listo, guardando…"
          : escaneando
            ? "Escaneando… no lo sueltes ✨"
            : "Déjalo presionado unos segundos. Solo se puede hacer una vez."}
      </p>

      <div
        role="button"
        tabIndex={0}
        aria-label="Lector de huella: mantén presionado"
        onPointerDown={empezar}
        onPointerUp={cancelar}
        onPointerCancel={cancelar}
        onContextMenu={(e) => e.preventDefault()}
        className={`relative mt-8 grid h-[230px] w-[210px] touch-none place-items-center select-none ${escaneando ? "escaneando" : ""}`}
        style={{ WebkitTouchCallout: "none" }}
      >
        <svg viewBox="0 0 210 230" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <rect x="4" y="4" width="202" height="222" rx="30" fill="none" stroke="#ffd3e0" strokeWidth="6" />
          <rect
            className="anillo-progreso"
            x="4"
            y="4"
            width="202"
            height="222"
            rx="30"
            fill="none"
            stroke="#e8457a"
            strokeWidth="6"
            strokeLinecap="round"
            pathLength={100}
          />
        </svg>
        <div className="relative grid h-[196px] w-[176px] place-items-center overflow-hidden rounded-[24px] border-4 border-[#ffb5e1] bg-[radial-gradient(circle_at_30%_30%,#ffc1e3,#c470a6_90%)] shadow-[0_0_25px_#ffc1e3,inset_0_0_10px_rgb(255_255_255/0.3)]">
          <Huella className="h-36 w-28 text-white/90" />
          <div className="linea-escaneo absolute inset-x-0 h-2 rounded-full bg-[linear-gradient(90deg,transparent,#00d2ff,#008cff,transparent)] shadow-[0_0_15px_#00c8ff,0_0_35px_rgb(0_160_255/0.9)] mix-blend-screen" />
        </div>
      </div>

      {aviso && (
        <p role="alert" className="mt-5 max-w-xs text-sm font-semibold text-chicle">
          {aviso}
        </p>
      )}
      {vistaPrevia && !aviso && (
        <p className="mt-5 max-w-xs text-xs text-cacao-suave">Ella aún no lo sella. Puedes probarlo: no se guardará.</p>
      )}
    </div>
  );
}
