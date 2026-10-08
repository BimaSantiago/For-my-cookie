import "server-only";
import { GALLETAS_POR_DIA } from "@/content/config";
import { GALLETAS } from "@/content/galletas";
import { CARTAS, type Carta } from "@/content/cartas";
import { CUPONES, type Cupon } from "@/content/cupones";
import { db } from "./store";
import { hoy } from "./fechas";

export type GalletaAbierta = { texto: string; dia: string; en: string };
export type Certificado = { selladoEn: string };
/** id → fecha (ISO) en que pasó. */
export type Registro = Record<string, string>;

export async function galletasAbiertas() {
  return (await db().get<GalletaAbierta[]>("galletas")) ?? [];
}

export async function estadoGalletasDeHoy() {
  const abiertas = await galletasAbiertas();
  const dia = hoy();
  const deHoy = abiertas.filter((g) => g.dia === dia);
  return { deHoy, restantes: Math.max(0, GALLETAS_POR_DIA - deHoy.length) };
}

/** Elige un mensaje que no haya salido; cuando ya salieron todos, empieza otra vuelta. */
export function elegirMensaje(abiertas: GalletaAbierta[]) {
  const vuelta = abiertas.slice(abiertas.length - (abiertas.length % GALLETAS.length));
  const yaSalieron = new Set(vuelta.map((g) => g.texto));
  const pendientes = GALLETAS.filter((t) => !yaSalieron.has(t));
  const opciones = pendientes.length > 0 ? pendientes : GALLETAS;
  return opciones[Math.floor(Math.random() * opciones.length)];
}

export async function cuponesCanjeados() {
  return (await db().get<Registro>("cupones")) ?? {};
}

export async function cartasLeidas() {
  return (await db().get<Registro>("cartas")) ?? {};
}

export async function certificado() {
  return db().get<Certificado>("certificado");
}

// Cupones y cartas: los de content/ son los iniciales. Cuando él edita algo desde su vista,
// la lista completa se guarda en la base y desde ahí se lee.

export async function listaCupones() {
  return (await db().get<Cupon[]>("lista-cupones")) ?? CUPONES;
}

export async function listaCartas() {
  return (await db().get<Carta[]>("lista-cartas")) ?? CARTAS;
}
