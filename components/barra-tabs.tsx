"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONOS = {
  inicio: (
    <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z" />
  ),
  cartas: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="m3.5 7 8.5 6.5L20.5 7" />
    </>
  ),
  frasco: (
    <>
      <path d="M7 3h10M8 3v3M16 3v3" />
      <path d="M6 9a2 2 0 0 1 2-3h8a2 2 0 0 1 2 3v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
      <circle cx="10" cy="15" r="1.6" />
      <circle cx="14.5" cy="12.5" r="1.3" />
    </>
  ),
  cupones: (
    <>
      <path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" />
      <path d="M14 7v10" strokeDasharray="2 2" />
    </>
  ),
  certificado: (
    <>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </>
  ),
};

const TABS = [
  { href: "/", etiqueta: "Inicio", icono: ICONOS.inicio },
  { href: "/cartas", etiqueta: "Cartas", icono: ICONOS.cartas },
  { href: "/frasco", etiqueta: "Frasco", icono: ICONOS.frasco },
  { href: "/cupones", etiqueta: "Cupones", icono: ICONOS.cupones },
  { href: "/certificado", etiqueta: "Nosotros", icono: ICONOS.certificado },
];

export function BarraTabs() {
  const ruta = usePathname();
  return (
    <nav
      aria-label="Secciones"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-cacao/10 bg-papel/90 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md"
    >
      <ul className="mx-auto flex max-w-md justify-around px-2">
        {TABS.map((t) => {
          const activa = t.href === "/" ? ruta === "/" : ruta.startsWith(t.href);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                aria-current={activa ? "page" : undefined}
                className={`presionable flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${
                  activa ? "text-chicle" : "text-cacao-suave"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill={activa ? "currentColor" : "none"}
                  fillOpacity={activa ? 0.15 : 0}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {t.icono}
                </svg>
                {t.etiqueta}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
