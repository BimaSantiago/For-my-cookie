import Link from "next/link";
import { GALLETAS } from "@/content/galletas";
import { GatoSentado } from "@/components/gatitos";
import { galletasAbiertas } from "@/lib/datos";
import { fechaLarga, hoy, sumarDias } from "@/lib/fechas";
import { exigirSesion } from "@/lib/session";

export const metadata = { title: "Frasco · Para mi Galletita" };

/** Galletitas dibujadas dentro del frasco: se va llenando conforme abre más. */
function Frasco({ llenado, cantidad }: { llenado: number; cantidad: number }) {
  const visibles = Math.min(cantidad, 24);
  const galletas = Array.from({ length: visibles }, (_, i) => {
    const fila = Math.floor(i / 4);
    const col = i % 4;
    return { x: 64 + col * 23 + (fila % 2) * 8, y: 192 - fila * 19, r: (i * 47) % 360 };
  });
  return (
    <svg viewBox="0 0 200 220" className="w-44" role="img" aria-label={`Frasco con ${cantidad} galletas`}>
      <rect x="62" y="8" width="76" height="18" rx="5" fill="#e8457a" />
      <rect x="70" y="26" width="60" height="10" fill="#fff" opacity="0.6" />
      <path
        d="M70 36 h60 c0 10 22 14 22 34 v120 a18 18 0 0 1 -18 18 h-68 a18 18 0 0 1 -18 -18 v-120 c0 -20 22 -24 22 -34 z"
        fill="#fff"
        fillOpacity="0.55"
        stroke="#4a2a22"
        strokeOpacity="0.2"
        strokeWidth="3"
      />
      {galletas.map((g, i) => (
        <g key={i} transform={`translate(${g.x} ${g.y}) rotate(${g.r})`}>
          <circle r="11" fill="#e7a95e" stroke="#b9783a" strokeWidth="1.5" />
          <circle cx="-4" cy="-3" r="1.8" fill="#5a3426" />
          <circle cx="4" cy="1" r="1.6" fill="#5a3426" />
          <circle cx="-1" cy="5" r="1.4" fill="#5a3426" />
        </g>
      ))}
      <path d="M58 80 v90" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      <text x="100" y="128" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4a2a22" opacity={llenado > 0 ? 0 : 0.5}>
        vacío
      </text>
    </svg>
  );
}

export default async function FrascoPage() {
  await exigirSesion();
  const abiertas = await galletasAbiertas();
  const total = GALLETAS.length;
  const distintas = new Set(abiertas.map((g) => g.texto)).size;

  const porDia = new Map<string, string[]>();
  for (const g of [...abiertas].reverse()) {
    porDia.set(g.dia, [...(porDia.get(g.dia) ?? []), g.texto]);
  }
  const dia = hoy();
  const ayer = sumarDias(dia, -1);
  const nombreDia = (d: string) => (d === dia ? "Hoy" : d === ayer ? "Ayer" : fechaLarga(d));

  return (
    <>
      <h1 className="font-display text-[1.7rem] font-semibold">Tu frasco de galletas</h1>
      <p className="mt-1 text-cacao-suave">Aquí se guardan todos los mensajes que te han salido.</p>

      <div className="mt-6 flex items-end justify-center gap-2">
        <Frasco llenado={distintas / total} cantidad={abiertas.length} />
        <GatoSentado className="mb-1 w-20" />
      </div>
      <p className="mt-3 text-center font-display text-lg font-medium">
        {distintas} de {total} mensajes descubiertos
      </p>

      {abiertas.length === 0 ? (
        <div className="papel mt-8 rounded-2xl p-5 text-center">
          <p>Todavía no abres ninguna galleta.</p>
          <Link href="/" className="presionable mt-3 inline-block rounded-full bg-chicle px-5 py-2.5 font-display font-medium text-white">
            Abrir mi primera galleta
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {[...porDia].map(([d, textos]) => (
            <section key={d}>
              <h2 className="font-display text-sm font-medium text-cacao-suave">{nombreDia(d)}</h2>
              <ul className="mt-2 space-y-2">
                {textos.map((t, i) => (
                  <li key={i} className="papel rounded-md px-4 py-3 font-mano text-xl leading-snug">
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
