import { iconoGalleta } from "@/lib/icono";

const TAMANOS = ["192", "512"];

export function generateStaticParams() {
  return TAMANOS.map((tam) => ({ tam }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ tam: string }> }) {
  const { tam } = await params;
  if (!TAMANOS.includes(tam)) return new Response("No existe", { status: 404 });
  return iconoGalleta(Number(tam));
}
