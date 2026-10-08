"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ACCESOS, GALLETAS_POR_DIA } from "@/content/config";
import type { Carta } from "@/content/cartas";
import type { Cupon } from "@/content/cupones";
import { borrarSesion, crearSesion, exigirSesion } from "@/lib/session";
import { db } from "@/lib/store";
import {
  certificado,
  cuponesCanjeados,
  cartasLeidas,
  elegirMensaje,
  galletasAbiertas,
  listaCartas,
  listaCupones,
  type Certificado,
} from "@/lib/datos";
import { hoy } from "@/lib/fechas";

export async function entrar(_prev: string | null, formData: FormData) {
  const fecha = String(formData.get("fecha") ?? "").trim();
  if (!fecha) return "Elige la fecha para entrar.";

  const rol = fecha === ACCESOS.ella ? "ella" : ACCESOS.yo && fecha === ACCESOS.yo ? "yo" : null;
  if (!rol) return "Esa no es. Pista: fue el día en que empezamos 💕";

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
  if (rol === "yo" || !(await listaCupones()).some((c) => c.id === id)) return null;
  const canjeados = await cuponesCanjeados();
  canjeados[id] ??= new Date().toISOString();
  await db().set("cupones", canjeados);
  revalidatePath("/cupones");
  return canjeados[id];
}

export async function marcarCartaLeida(id: string) {
  const { rol } = await exigirSesion();
  const carta = (await listaCartas()).find((c) => c.id === id);
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

// ---------- Edición (solo en su vista) ----------

export type ResultadoEdicion = { ok: true } | { ok: false; error: string };

async function exigirEditor() {
  const { rol } = await exigirSesion();
  if (rol !== "yo") throw new Error("Solo Abimael puede editar.");
}

function texto(formData: FormData, campo: string, max: number) {
  return String(formData.get(campo) ?? "").trim().slice(0, max);
}

function nuevoId() {
  return crypto.randomUUID().slice(0, 8);
}

export async function guardarCupon(formData: FormData): Promise<ResultadoEdicion> {
  await exigirEditor();
  const id = texto(formData, "id", 40);
  const titulo = texto(formData, "titulo", 80);
  const detalle = texto(formData, "detalle", 300);
  if (!titulo) return { ok: false, error: "Ponle un título al cupón." };

  const cupones = [...(await listaCupones())];
  const i = cupones.findIndex((c) => c.id === id);
  const cupon: Cupon = { id: i >= 0 ? id : nuevoId(), titulo, detalle };
  if (i >= 0) cupones[i] = cupon;
  else cupones.push(cupon);

  await db().set("lista-cupones", cupones);
  revalidatePath("/cupones");
  return { ok: true };
}

export async function borrarCupon(id: string) {
  await exigirEditor();
  const cupones = (await listaCupones()).filter((c) => c.id !== id);
  await db().set("lista-cupones", cupones);
  revalidatePath("/cupones");
}

export async function guardarCarta(formData: FormData): Promise<ResultadoEdicion> {
  await exigirEditor();
  const id = texto(formData, "id", 40);
  const cuando = texto(formData, "cuando", 80);
  const cuerpo = texto(formData, "texto", 6000);
  const disponible = texto(formData, "disponible", 10);
  if (!cuando) return { ok: false, error: "Escribe cuándo debe abrirla." };
  if (!cuerpo) return { ok: false, error: "La carta está vacía." };
  if (disponible && !/^\d{4}-\d{2}-\d{2}$/.test(disponible)) return { ok: false, error: "La fecha no es válida." };

  const cartas = [...(await listaCartas())];
  const i = cartas.findIndex((c) => c.id === id);
  const carta: Carta = { id: i >= 0 ? id : nuevoId(), cuando, texto: cuerpo, ...(disponible ? { disponible } : {}) };
  if (i >= 0) cartas[i] = carta;
  else cartas.push(carta);

  await db().set("lista-cartas", cartas);
  revalidatePath("/cartas");
  return { ok: true };
}

export async function borrarCarta(id: string) {
  await exigirEditor();
  const cartas = (await listaCartas()).filter((c) => c.id !== id);
  await db().set("lista-cartas", cartas);
  revalidatePath("/cartas");
}
