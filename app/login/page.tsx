import { GatoAsomado } from "@/components/gatitos";
import { FormularioEntrar } from "./formulario";

export const metadata = { title: "Entrar · Para mi Galletita" };

export default function Login() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
      <h1 className="text-center font-display text-4xl leading-tight font-semibold">
        Esta página es solo para ti
      </h1>
      <p className="mt-3 text-center text-cacao-suave">Para pasar, dime qué día empezó lo nuestro.</p>
      <div className="relative mt-16">
        <GatoAsomado className="absolute -top-[58px] left-1/2 z-10 w-28 -translate-x-1/2" />
        <FormularioEntrar />
      </div>
    </main>
  );
}
