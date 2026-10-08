import { BarraTabs } from "@/components/barra-tabs";
import { exigirSesion } from "@/lib/session";
import { salir } from "../acciones";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { rol } = await exigirSesion();
  return (
    <>
      {rol === "yo" && (
        <div className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-cacao px-4 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] pb-2 text-xs text-papel">
          <span>Tu vista: puedes editar cupones y cartas. Galletas y certificado no cuentan para ella.</span>
          <form action={salir}>
            <button className="presionable rounded-full border border-papel/40 px-3 py-1 font-semibold">Salir</button>
          </form>
        </div>
      )}
      <main className="mx-auto w-full max-w-md px-4 pt-[calc(env(safe-area-inset-top,0px)+1.25rem)] pb-[calc(env(safe-area-inset-bottom,0px)+6rem)]">
        {children}
      </main>
      <BarraTabs />
    </>
  );
}
