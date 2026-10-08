import { MI_NOMBRE } from "@/content/config";
import { cartasLeidas, listaCartas } from "@/lib/datos";
import { fechaCorta, hoy } from "@/lib/fechas";
import { exigirSesion } from "@/lib/session";
import { ListaCartas } from "./lista-cartas";

export const metadata = { title: "Cartas · Para mi Galletita" };

export default async function Cartas() {
  const { rol } = await exigirSesion();
  const [leidas, lista] = await Promise.all([cartasLeidas(), listaCartas()]);
  const dia = hoy();

  const cartas = lista.map((c) => ({
    id: c.id,
    cuando: c.cuando,
    texto: c.texto,
    disponible: c.disponible ?? "",
    parrafos: c.texto.split(/\n\s*\n/).map((p) => p.trim()),
    bloqueadaHasta: c.disponible && c.disponible > dia ? fechaCorta(c.disponible) : null,
    leida: Boolean(leidas[c.id]),
  }));

  return (
    <>
      <h1 className="font-display text-[1.7rem] font-semibold">Ábrelas cuando…</h1>
      <p className="mt-1 text-cacao-suave">
        {rol === "yo"
          ? "Aquí agregas cartas nuevas. Abre una para editarla o borrarla."
          : "Cartas para los momentos en que no puedo estar ahí."}
      </p>
      <ListaCartas cartas={cartas} firma={MI_NOMBRE} editor={rol === "yo"} />
    </>
  );
}
