// Medusas tiernas que suben despacito por el fondo. Mismo estilo que los gatitos:
// formas planas, colores pastel, carita con cachetes. Todo se anima con CSS (ver globals.css).

const LINEA = "#4a2a22";
const CACHETE = "#e8457a";

const COLORES = {
  rosa: { campana: "#ffa8c5", tentaculo: "#ffc6d8" },
  menta: { campana: "#9ddfc5", tentaculo: "#c6eedf" },
  durazno: { campana: "#ffc29a", tentaculo: "#ffdcc2" },
};

type Color = keyof typeof COLORES;

// Las chiquitas están "más lejos": más transparentes y más lentas.
// `reposo` es dónde se quedan quietas si el teléfono pide menos movimiento.
const MEDUSAS: {
  color: Color;
  izquierda: string;
  ancho: number;
  opacidad: number;
  viaje: number;
  retraso: number;
  vaiven: number;
  pulso: number;
  reposo: string;
}[] = [
  { color: "rosa", izquierda: "3%", ancho: 46, opacidad: 0.85, viaje: 34, retraso: -8, vaiven: 7, pulso: 2.6, reposo: "58vh" },
  { color: "menta", izquierda: "79%", ancho: 36, opacidad: 0.7, viaje: 42, retraso: -27, vaiven: 9, pulso: 3.1, reposo: "22vh" },
  { color: "durazno", izquierda: "60%", ancho: 26, opacidad: 0.55, viaje: 50, retraso: -14, vaiven: 8, pulso: 2.9, reposo: "76vh" },
];

function Medusa({ color }: { color: Color }) {
  const { campana, tentaculo } = COLORES[color];
  return (
    <svg viewBox="0 0 60 92" className="block w-full overflow-visible">
      <g className="medusa-pulso">
        {/* tentáculos: los de afuera delgaditos, los de en medio como listones */}
        <g fill="none" strokeLinecap="round">
          <path className="medusa-tentaculo" d="M14 37 q-4 8 0 16 q4 8 0 16" stroke={tentaculo} strokeWidth="2.5" />
          <path className="medusa-tentaculo medusa-tentaculo-2" d="M24 38 q4 9 0 18 q-4 9 0 18 q4 6 0 12" stroke={tentaculo} strokeWidth="4" />
          <path className="medusa-tentaculo medusa-tentaculo-3" d="M36 38 q-4 9 0 18 q4 9 0 18 q-4 6 0 12" stroke={tentaculo} strokeWidth="4" />
          <path className="medusa-tentaculo medusa-tentaculo-4" d="M46 37 q4 8 0 16 q-4 8 0 16" stroke={tentaculo} strokeWidth="2.5" />
        </g>
        {/* campana con orilla de olanes */}
        <path
          d="M6 36 C 4 16, 17 4, 30 4 C 43 4, 56 16, 54 36 Q 50 41, 46 36 Q 42 41, 38 36 Q 34 41, 30 36 Q 26 41, 22 36 Q 18 41, 14 36 Q 10 41, 6 36 Z"
          fill={campana}
        />
        <ellipse cx="19" cy="15" rx="6" ry="3.2" fill="#fff" opacity="0.55" transform="rotate(-30 19 15)" />
        <circle cx="27" cy="10" r="1.6" fill="#fff" opacity="0.55" />
        {/* carita */}
        <g className="ojo">
          <ellipse cx="23" cy="24" rx="1.9" ry="2.3" fill={LINEA} />
        </g>
        <g className="ojo">
          <ellipse cx="37" cy="24" rx="1.9" ry="2.3" fill={LINEA} />
        </g>
        <ellipse cx="18" cy="28.5" rx="3" ry="1.6" fill={CACHETE} opacity="0.3" />
        <ellipse cx="42" cy="28.5" rx="3" ry="1.6" fill={CACHETE} opacity="0.3" />
        <path d="M28 27.5 q2 2 4 0" stroke={LINEA} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function Medusas() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {MEDUSAS.map((m) => (
        <div
          key={m.color}
          className="medusa-viaje"
          style={
            {
              left: m.izquierda,
              width: m.ancho,
              opacity: m.opacidad,
              animationDuration: `${m.viaje}s`,
              animationDelay: `${m.retraso}s`,
              "--reposo": m.reposo,
            } as React.CSSProperties
          }
        >
          <div className="medusa-vaiven" style={{ animationDuration: `${m.vaiven}s` }}>
            <div style={{ "--pulso": `${m.pulso}s` } as React.CSSProperties}>
              <Medusa color={m.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
