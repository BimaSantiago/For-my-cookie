import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESION, leerSesion } from "@/lib/jwt";

// Revisión rápida: sin sesión válida, todo manda al login.
// Las páginas y acciones vuelven a verificar la sesión por su cuenta.
export async function proxy(request: NextRequest) {
  const sesion = await leerSesion(request.cookies.get(COOKIE_SESION)?.value);
  if (!sesion) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|_next/static|_next/image|manifest.webmanifest|icon|apple-icon|iconos|favicon.ico).*)",
  ],
};
