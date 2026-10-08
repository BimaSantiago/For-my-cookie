import { SignJWT, jwtVerify } from "jose";

export type Rol = "ella" | "yo";
export type Sesion = { rol: Rol };

export const COOKIE_SESION = "sesion";
export const DURACION_SESION_MS = 365 * 24 * 60 * 60 * 1000;

function clave() {
  const secreto = process.env.SESSION_SECRET;
  if (!secreto) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Falta la variable de entorno SESSION_SECRET.");
    }
    return new TextEncoder().encode("solo-para-desarrollo-local");
  }
  return new TextEncoder().encode(secreto);
}

export async function firmarSesion(sesion: Sesion) {
  return new SignJWT(sesion)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + DURACION_SESION_MS))
    .sign(clave());
}

export async function leerSesion(token: string | undefined): Promise<Sesion | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, clave(), { algorithms: ["HS256"] });
    return payload.rol === "ella" || payload.rol === "yo" ? { rol: payload.rol } : null;
  } catch {
    return null;
  }
}
