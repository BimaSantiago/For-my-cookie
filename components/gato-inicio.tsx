"use client";

import { useEffect, useState } from "react";
import { esHoraDeDormir } from "@/lib/fechas";
import { GatoDormido, GatoEnojado, GatoJugando } from "./gatitos";

/**
 * El michi que vive encima del contador: de día juega con su estambre; de noche se duerme
 * y un michi enojado la regaña para que se vaya a dormir. Revisa la hora cada minuto
 * por si tiene la página abierta cuando cambia.
 */
export function GatoInicio({
  durmiendoInicial,
  etiqueta,
  children,
}: {
  durmiendoInicial: boolean;
  etiqueta: string;
  children: React.ReactNode;
}) {
  const [durmiendo, setDurmiendo] = useState(durmiendoInicial);

  useEffect(() => {
    const id = setInterval(() => setDurmiendo(esHoraDeDormir()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {durmiendo && (
        <div role="status" className="globo-entra papel relative mt-5 mr-28 flex items-center gap-3 rounded-2xl px-4 py-3">
          <GatoEnojado className="enojo w-16 shrink-0" />
          <p className="font-mano text-[1.6rem] leading-none">¡Ya duérmeteee, que es tarde!</p>
          {/* piquito del globo apuntando al michi dormido */}
          <span aria-hidden="true" className="absolute -right-1.5 -bottom-1.5 h-4 w-4 rotate-45 bg-papel" />
        </div>
      )}
      <section aria-label={etiqueta} className="relative mt-14">
        {durmiendo ? (
          <GatoDormido className="absolute -top-[52px] right-3 w-32" />
        ) : (
          <GatoJugando className="absolute -top-[54px] right-2 w-36" />
        )}
        {children}
      </section>
    </>
  );
}
