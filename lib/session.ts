import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESION, DURACION_SESION_MS, firmarSesion, leerSesion, type Rol } from "./jwt";

export async function crearSesion(rol: Rol) {
  const token = await firmarSesion({ rol });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_SESION, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + DURACION_SESION_MS),
  });
}

export async function borrarSesion() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_SESION);
}

export const obtenerSesion = cache(async () => {
  const cookieStore = await cookies();
  return leerSesion(cookieStore.get(COOKIE_SESION)?.value);
});

/** Para páginas y acciones: si no hay sesión, manda al login. */
export async function exigirSesion() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/login");
  return sesion;
}
