// Cupones canjeables. Cada uno se puede usar una sola vez.
// - id: nombre corto y único (no lo cambies después de publicarlo).

export type Cupon = {
  id: string;
  titulo: string;
  detalle: string;
};

export const CUPONES: Cupon[] = [
  {
    id: "abrazo",
    titulo: "Un abrazo de 5 minutos",
    detalle: "Sin soltarte, aunque se nos duerman los brazos.",
  },
  {
    id: "pelicula",
    titulo: "Tú eliges la película",
    detalle: "La que tú quieras, y yo la veo sin quejarme.",
  },
  {
    id: "antojo",
    titulo: "Un antojo invitado",
    detalle: "Lo que se te antoje: helado, tacos, boba o galletas.",
  },
  {
    id: "primera-foto",
    titulo: "Nuestra primera foto juntos",
    detalle: "Para que esta página tenga por fin una foto de nosotros.",
  },
  {
    id: "cita-sorpresa",
    titulo: "Una cita sorpresa",
    detalle: "Yo planeo todo. Tú solo llegas bonita.",
  },
  {
    id: "llamada",
    titulo: "Llamada hasta que te duermas",
    detalle: "Aunque ya no hablemos y solo se escuche cómo respiras.",
  },
  {
    id: "discusion",
    titulo: "Ganas una discusión",
    detalle: "Úsalo con sabiduría. Tienes la razón y punto.",
  },
  {
    id: "paseo",
    titulo: "Un paseo con helado",
    detalle: "Caminamos, platicamos y yo invito el helado.",
  },
  {
    id: "carta-mano",
    titulo: "Una carta escrita a mano",
    detalle: "En papel de verdad, para que la guardes.",
  },
  {
    id: "dia-tuyo",
    titulo: "Un día de lo que tú quieras",
    detalle: "Ese día mandas tú. Yo solo digo que sí.",
  },
];
