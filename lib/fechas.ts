import { HORA_DESPERTAR, HORA_DORMIR, INICIO_NOVIOS, ZONA_HORARIA } from "@/content/config";

/** Fechas como texto "año-mes-día", siempre en la zona horaria configurada. */
export type Dia = string;

export function hoy(ahora = new Date()): Dia {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONA_HORARIA }).format(ahora);
}

export function horaLocal(ahora = new Date()) {
  const hora = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONA_HORARIA,
    hour: "numeric",
    hourCycle: "h23",
  }).format(ahora);
  return Number(hora);
}

/** Hora de dormir del michi: de HORA_DORMIR hasta antes de HORA_DESPERTAR. */
export function esHoraDeDormir(ahora = new Date()) {
  const hora = horaLocal(ahora);
  return hora >= HORA_DORMIR || hora < HORA_DESPERTAR;
}

function aUTC(dia: Dia) {
  const [a, m, d] = dia.split("-").map(Number);
  return Date.UTC(a, m - 1, d);
}

function deUTC(ms: number): Dia {
  return new Date(ms).toISOString().slice(0, 10);
}

export function diasEntre(desde: Dia, hasta: Dia) {
  return Math.round((aUTC(hasta) - aUTC(desde)) / 86_400_000);
}

export function sumarDias(dia: Dia, n: number): Dia {
  return deUTC(aUTC(dia) + n * 86_400_000);
}

/** Suma meses; si el día no existe en ese mes (30 de febrero), usa el último día del mes. */
export function sumarMeses(dia: Dia, n: number): Dia {
  const [a, m, d] = dia.split("-").map(Number);
  const ultimo = new Date(Date.UTC(a, m - 1 + n + 1, 0)).getUTCDate();
  return deUTC(Date.UTC(a, m - 1 + n, Math.min(d, ultimo)));
}

const fmtLargo = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const fmtCorto = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function fechaLarga(dia: Dia) {
  return fmtLargo.format(aUTC(dia));
}

export function fechaCorta(dia: Dia) {
  return fmtCorto.format(aUTC(dia)).replace(".", "");
}

export function fechaHoraLarga(iso: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: ZONA_HORARIA,
  }).format(new Date(iso));
}

export function tiempoJuntos(dia: Dia = hoy()) {
  const dias = diasEntre(INICIO_NOVIOS, dia);
  let meses = 0;
  while (sumarMeses(INICIO_NOVIOS, meses + 1) <= dia) meses++;
  const diasResto = diasEntre(sumarMeses(INICIO_NOVIOS, meses), dia);
  return { dias, meses, diasResto };
}

export type Hito = { fecha: Dia; titulo: string; mensaje: string };

function generarHitos(): Hito[] {
  const hitos: Hito[] = [];
  for (let m = 1; m <= 120; m++) {
    if (m > 24 && m % 6 !== 0) continue;
    let titulo: string;
    let mensaje: string;
    if (m % 12 === 0) {
      const anios = m / 12;
      titulo = anios === 1 ? "¡Un año juntos!" : `¡${anios} años juntos!`;
      mensaje = "Feliz aniversario, galletita de mi corazón. Gracias por cada día.";
    } else if (m === 6) {
      titulo = "¡Medio año juntos!";
      mensaje = "Seis meses de ti. Ya puedes abrir la carta de medio año.";
    } else {
      titulo = m === 1 ? "¡Un mes juntos!" : `¡${m} meses juntos!`;
      mensaje = "Feliz mesiversario, corazón. Te quiero más que el mes pasado.";
    }
    hitos.push({ fecha: sumarMeses(INICIO_NOVIOS, m), titulo, mensaje });
  }
  for (const d of [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 3000]) {
    hitos.push({
      fecha: sumarDias(INICIO_NOVIOS, d),
      titulo: `¡${d.toLocaleString("es-MX")} días juntos!`,
      mensaje: `${d.toLocaleString("es-MX")} días de quererte. Y los que faltan.`,
    });
  }
  return hitos.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export const HITOS = generarHitos();

export function estadoHitos(dia: Dia = hoy()) {
  const deHoy = HITOS.filter((h) => h.fecha === dia);
  const siguiente = HITOS.find((h) => h.fecha > dia) ?? null;
  const anterior = [...HITOS].reverse().find((h) => h.fecha <= dia)?.fecha ?? INICIO_NOVIOS;
  const alcanzados = HITOS.filter((h) => h.fecha <= dia);
  const progreso = siguiente
    ? diasEntre(anterior, dia) / Math.max(1, diasEntre(anterior, siguiente.fecha))
    : 1;
  return {
    deHoy,
    siguiente,
    faltan: siguiente ? diasEntre(dia, siguiente.fecha) : 0,
    progreso,
    alcanzados,
  };
}
