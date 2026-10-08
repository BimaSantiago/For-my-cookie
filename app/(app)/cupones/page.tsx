import { cuponesCanjeados, listaCupones } from "@/lib/datos";
import { exigirSesion } from "@/lib/session";
import { ListaCupones } from "./lista-cupones";

export const metadata = { title: "Cupones · Para mi Galletita" };

export default async function Cupones() {
  const { rol } = await exigirSesion();
  const [canjeados, cupones] = await Promise.all([cuponesCanjeados(), listaCupones()]);
  const disponibles = cupones.filter((c) => !canjeados[c.id]).length;

  return (
    <>
      <h1 className="font-display text-[1.7rem] font-semibold">Tus cupones</h1>
      <p className="mt-1 text-cacao-suave">
        {rol === "yo" ? (
          `Aquí agregas, editas o borras cupones. Le quedan ${disponibles} sin canjear.`
        ) : (
          <>
            Cada uno vale una sola vez. Cuando lo canjees, me entero y te lo cumplo.{" "}
            {disponibles > 0 ? `Te quedan ${disponibles}.` : "Ya los usaste todos."}
          </>
        )}
      </p>
      <ListaCupones cupones={cupones} canjeadosInicial={canjeados} editor={rol === "yo"} />
    </>
  );
}
