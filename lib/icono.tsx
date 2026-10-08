import { ImageResponse } from "next/og";

/** Ícono de la app: una galleta con orejitas de gato sobre fondo rosa. */
export function iconoGalleta(tam: number, { conMargen = true } = {}) {
  const lado = conMargen ? tam * 0.78 : tam;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffe4ec",
        }}
      >
        <svg width={lado} height={lado} viewBox="0 0 100 100">
          <path d="M18 40 L20 8 L44 26 Z" fill="#d9913f" />
          <path d="M23 32 L24 16 L37 26 Z" fill="#ffb3c7" />
          <path d="M82 40 L80 8 L56 26 Z" fill="#d9913f" />
          <path d="M77 32 L76 16 L63 26 Z" fill="#ffb3c7" />
          <circle cx="50" cy="57" r="38" fill="#e7a95e" stroke="#b9783a" strokeWidth="3" />
          <circle cx="34" cy="44" r="4.5" fill="#5a3426" />
          <circle cx="62" cy="40" r="3.8" fill="#5a3426" />
          <circle cx="70" cy="64" r="4.2" fill="#5a3426" />
          <circle cx="30" cy="70" r="3.6" fill="#5a3426" />
          <circle cx="50" cy="80" r="3.2" fill="#5a3426" />
          <path d="M44 58 q6 7 12 0" stroke="#5a3426" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="36" cy="58" rx="5" ry="3" fill="#ff8fab" />
          <ellipse cx="64" cy="58" rx="5" ry="3" fill="#ff8fab" />
        </svg>
      </div>
    ),
    { width: tam, height: tam },
  );
}
