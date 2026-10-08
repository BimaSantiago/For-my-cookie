"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ACCESOS, GALLETAS_POR_DIA } from "@/content/config";
import { CARTAS } from "@/content/cartas";
import { CUPONES } from "@/content/cupones";
import { borrarSesion, crearSesion, exigirSesion } from "@/lib/session";
import { db } from "@/lib/store";
import {
  certificado,
  cuponesCanjeados,
  cartasLeidas,
  elegirMensaje,
  galletasAbiertas,
  type Certificado,
} from "@/lib/datos";
import { hoy } from "@/lib/fechas";

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export async function entrar(_prev: string | null, formData: FormData) {
  const nombre = normalizar(String(formData.get("nombre") ?? ""));
  if (!nombre) return "Escribe tu nombre para entrar.";

  const rol = (ACCESOS.ella as readonly string[]).includes(nombre)
    ? "ella"
    : (ACCESOS.yo as readonly string[]).includes(nombre)
      ? "yo"
      : null;
  if (!rol) return "Ese nombre no está en la lista. Pista: es como te digo siempre 🍪";

  await crearSesion(rol);
  redirect("/");
}

export async function salir() {
  await borrarSesion();
  redirect("/login");
}

export type ResultadoGalleta =
  | { ok: true; texto: string; restantes: number; vistaPrevia: boolean }
  | { ok: false; motivo: string };

export async function abrirGalleta(): Promise<ResultadoGalleta> {
  const { rol } = await exigirSesion();
  const abiertas = await galletasAbiertas();
  const texto = elegirMensaje(abiertas);

  if (rol === "yo") return { ok: true, texto, restantes: GALLETAS_POR_DIA, vistaPrevia: true };

  const dia = hoy();
  const deHoy = abiertas.filter((g) => g.dia === dia).length;
  if (deHoy >= GALLETAS_POR_DIA) {
    return { ok: false, motivo: "Ya abriste tus galletas de hoy. Mañana hay más." };
  }
  abiertas.push({ texto, dia, en: new Date().toISOString() });
  await db().set("galletas", abiertas);
  revalidatePath("/frasco");
  return { ok: true, texto, restantes: GALLETAS_POR_DIA - deHoy - 1, vistaPrevia: false };
}

export async function canjearCupon(id: string) {
  const { rol } = await exigirSesion();
  if (rol === "yo" || !CUPONES.some((c) => c.id === id)) return null;
  const canjeados = await cuponesCanjeados();
  canjeados[id] ??= new Date().toISOString();
  await db().set("cupones", canjeados);
  revalidatePath("/cupones");
  return canjeados[id];
}

export async function marcarCartaLeida(id: string) {
  const { rol } = await exigirSesion();
  const carta = CARTAS.find((c) => c.id === id);
  if (rol === "yo" || !carta || (carta.disponible && carta.disponible > hoy())) return;
  const leidas = await cartasLeidas();
  if (leidas[id]) return;
  leidas[id] = new Date().toISOString();
  await db().set("cartas", leidas);
  revalidatePath("/cartas");
}

/** Sella el certificado una sola vez. Si ya estaba sellado, devuelve la fecha original. */
export async function sellarCertificado(): Promise<Certificado & { vistaPrevia: boolean }> {
  const { rol } = await exigirSesion();
  const existente = await certificado();
  if (existente) return { ...existente, vistaPrevia: false };

  const nuevo: Certificado = { selladoEn: new Date().toISOString() };
  if (rol === "yo") return { ...nuevo, vistaPrevia: true };

  const guardado = await db().setSiNoExiste("certificado", nuevo);
  revalidatePath("/certificado");
  return { ...(guardado ? nuevo : ((await certificado()) ?? nuevo)), vistaPrevia: false };
}
