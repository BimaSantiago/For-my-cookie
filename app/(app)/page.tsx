import { APODOS, INICIO_NOVIOS } from "@/content/config";
import { AvisoInstalar } from "@/components/aviso-instalar";
import { GalletaFortuna } from "@/components/galleta-fortuna";
import { GatoInicio } from "@/components/gato-inicio";
import { Lluvia } from "@/components/lluvia";
import { Medusas } from "@/components/medusas";
import { estadoGalletasDeHoy } from "@/lib/datos";
import { esHoraDeDormir, estadoHitos, fechaCorta, fechaLarga, horaLocal, tiempoJuntos } from "@/lib/fechas";
import { exigirSesion } from "@/lib/session";

function saludo() {
  const hora = horaLocal();
  const apodo = APODOS[Math.floor(Math.random() * APODOS.length)].toLowerCase();
  if (hora >= 5 && hora < 12) return `Buenos días, ${apodo}`;
  if (hora >= 12 && hora < 19) return `Buenas tardes, ${apodo}`;
  return `Buenas noches, ${apodo}`;
}

function plural(n: number, uno: string, varios: string) {
  return `${n} ${n === 1 ? uno : varios}`;
}

export default async function Inicio() {
  const { rol } = await exigirSesion();
  const { dias, meses, diasResto } = tiempoJuntos();
  const hitos = estadoHitos();
  const galletas = await estadoGalletasDeHoy();
  const hitoHoy = hitos.deHoy[0];

  const desglose = [
    meses > 0 ? plural(meses, "mes", "meses") : null,
    diasResto > 0 || meses === 0 ? plural(diasResto, "día", "días") : null,
  ]
    .filter(Boolean)
    .join(" y ");

  return (
    <>
      <Medusas />
      {hitoHoy && <Lluvia />}

      {/* el contenido va encima de las medusas: nadan por detrás de las tarjetas */}
      <div className="relative z-10">
        <h1 className="font-display text-[1.7rem] leading-tight font-semibold text-balance">{saludo()}</h1>

        {hitoHoy && (
          <div className="mt-4 rounded-2xl bg-chicle px-5 py-4 text-white shadow-lg">
            <p className="font-display text-xl font-semibold">{hitoHoy.titulo}</p>
            <p className="mt-1 text-sm opacity-90">{hitoHoy.mensaje}</p>
          </div>
        )}

        <GatoInicio durmiendoInicial={esHoraDeDormir()} etiqueta="Tiempo juntos">
          <div className="papel rounded-3xl px-6 pt-6 pb-5">
            <p className="font-display text-[4.5rem] leading-none font-semibold tracking-tight text-chicle tabular-nums">
              {dias.toLocaleString("es-MX")}
            </p>
            <p className="mt-1 font-display text-xl font-medium">días siendo novios</p>
            <p className="mt-2 text-sm text-cacao-suave">
              {desglose} · desde el {fechaLarga(INICIO_NOVIOS)}
            </p>

            {hitos.siguiente && (
              <div className="mt-5">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-semibold">{hitos.siguiente.titulo.replace(/¡|!/g, "")}</span>
                  <span className="shrink-0 text-cacao-suave">
                    {hitos.faltan === 1 ? "mañana" : `en ${hitos.faltan} días`} · {fechaCorta(hitos.siguiente.fecha)}
                  </span>
                </div>
                <div
                  className="mt-2 h-3 overflow-hidden rounded-full bg-fresa-2"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(hitos.progreso * 100)}
                  aria-label="Camino al siguiente festejo"
                >
                  <div
                    className="h-full rounded-full bg-[repeating-linear-gradient(45deg,var(--color-galleta)_0_8px,var(--color-galleta-osc)_8px_10px)]"
                    style={{ width: `${Math.max(6, hitos.progreso * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {hitos.alcanzados.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Festejos que ya pasamos">
                {hitos.alcanzados.slice(-6).map((h) => (
                  <li key={h.fecha} className="rounded-full bg-fresa px-2.5 py-1 text-xs font-semibold text-cacao-suave">
                    {h.titulo.replace(/¡|!/g, "")}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </GatoInicio>

        <div className="mt-12">
          <GalletaFortuna
            restantesInicial={galletas.restantes}
            deHoyInicial={galletas.deHoy.map((g) => g.texto)}
            vistaPrevia={rol === "yo"}
          />
        </div>

        <AvisoInstalar />
      </div>
    </>
  );
}
