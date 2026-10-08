import { INICIO_NOVIOS, MI_NOMBRE } from "@/content/config";
import { certificado } from "@/lib/datos";
import { fechaLarga } from "@/lib/fechas";
import { exigirSesion } from "@/lib/session";
import { Escaner } from "./escaner";

export const metadata = { title: "Nosotros · Para mi Galletita" };

export default async function CertificadoPage() {
  const { rol } = await exigirSesion();
  const sello = await certificado();

  return (
    <Escaner
      selladoEnInicial={sello?.selladoEn ?? null}
      novioDesde={fechaLarga(INICIO_NOVIOS)}
      firma={MI_NOMBRE}
      vistaPrevia={rol === "yo"}
    />
  );
}
