// Ajustes generales de la página. Cambia lo que quieras aquí y vuelve a publicar.

/** Día en que empezamos a ser novios (año-mes-día). */
export const INICIO_NOVIOS = "2026-05-30";

/** Zona horaria con la que se cuentan los días y se reinician las galletas. */
export const ZONA_HORARIA = "America/Mexico_City";

/** Cuántas galletas de la fortuna puede abrir al día. */
export const GALLETAS_POR_DIA = 2;

/** Tu nombre, para firmar las cartas. */
export const MI_NOMBRE = "Abimael";

/** Cómo le digo. Se usan para saludarla al azar. */
export const APODOS = [
  "Galletita",
  "Galletita de mi corazón",
  "Cariño",
  "Corazón",
];

/**
 * Nombres con los que se puede entrar. No importan mayúsculas, acentos ni espacios extra.
 * "ella" usa la página de verdad; "yo" la ve en modo vista previa (nada de lo que hagas cuenta).
 */
export const ACCESOS = {
  ella: ["galletita", "galletita de mi corazon"],
  yo: ["abimael"],
} as const;
