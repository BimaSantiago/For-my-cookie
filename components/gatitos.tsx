// Gatitos dibujados a mano en SVG. Un michi naranja con rayitas y orejas rosas.

const PELO = "#f2a65a";
const RAYAS = "#d9823a";
const OREJA = "#ffb3c7";
const LINEA = "#4a2a22";
const CACHETE = "#ff8fab";
const HOCICO = "#fde6cc";

type Props = { className?: string };

/** `separacion`: qué tan lejos de la nariz empiezan los bigotes. */
function Bigotes({ x, y, separacion = 9 }: { x: number; y: number; separacion?: number }) {
  const s = separacion;
  const l = s + 13;
  return (
    <g stroke={LINEA} strokeWidth="1.2" strokeLinecap="round" opacity="0.55">
      <path d={`M${x - s} ${y} L${x - l} ${y - 3}`} />
      <path d={`M${x - s} ${y + 3} L${x - l} ${y + 5}`} />
      <path d={`M${x + s} ${y} L${x + l} ${y - 3}`} />
      <path d={`M${x + s} ${y + 3} L${x + l} ${y + 5}`} />
    </g>
  );
}

/** Michi hecho bolita, dormido, con zzz. */
export function GatoDormido({ className }: Props) {
  return (
    <svg viewBox="0 0 140 80" className={className} aria-hidden="true">
      <g className="respira">
        {/* cola rodeando el cuerpo */}
        <path
          d="M118 58 C 136 62, 128 78, 100 76 L 52 76"
          fill="none"
          stroke={PELO}
          strokeWidth="11"
          strokeLinecap="round"
        />
        <ellipse cx="80" cy="56" rx="44" ry="21" fill={PELO} />
        <path d="M74 37 q4 8 0 16 M88 36 q4 9 0 18 M102 40 q4 8 0 14" stroke={RAYAS} strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* cabeza */}
        <path d="M24 34 L28 14 L40 26 Z" fill={PELO} />
        <path d="M27 28 L29 19 L35 25 Z" fill={OREJA} />
        <path d="M58 26 L66 12 L68 32 Z" fill={PELO} />
        <path d="M61 26 L65 18 L66 28 Z" fill={OREJA} />
        <ellipse cx="46" cy="48" rx="25" ry="21" fill={PELO} />
        <path d="M44 28 l0 7 M50 28 l-1 6" stroke={RAYAS} strokeWidth="3" strokeLinecap="round" />
        <path d="M33 47 q4 3 8 0 M51 47 q4 3 8 0" stroke={LINEA} strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="31" cy="54" rx="4" ry="2.5" fill={CACHETE} opacity="0.6" />
        <ellipse cx="61" cy="54" rx="4" ry="2.5" fill={CACHETE} opacity="0.6" />
        <path d="M44.5 52 h4 l-2 2.5 z" fill={CACHETE} />
        <Bigotes x={46} y={55} />
        {/* patita */}
        <ellipse cx="54" cy="70" rx="10" ry="6" fill={PELO} />
      </g>
      <g fill={LINEA} fontFamily="var(--font-fredoka)" fontWeight="600">
        <text x="72" y="22" fontSize="12" className="zzz">z</text>
        <text x="82" y="16" fontSize="9" className="zzz zzz-2">z</text>
      </g>
    </svg>
  );
}

/** Michi agachado jugando con una bola de estambre: le da manotazos y la bola rueda. */
export function GatoJugando({ className }: Props) {
  return (
    <svg viewBox="0 0 140 80" className={className} aria-hidden="true">
      <path
        className="cola-gato"
        d="M114 52 C 130 46, 134 26, 124 16"
        fill="none"
        stroke={PELO}
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* cuerpo con la colita levantada, listo para saltar */}
      <ellipse cx="98" cy="58" rx="24" ry="16" fill={PELO} />
      <ellipse cx="76" cy="67" rx="20" ry="10" fill={PELO} />
      <ellipse cx="110" cy="74" rx="10" ry="5" fill={PELO} />
      <path d="M94 44 q3 7 0 13 M104 45 q3 7 0 12" stroke={RAYAS} strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* patita quieta */}
      <ellipse cx="66" cy="75" rx="8" ry="4.5" fill={PELO} stroke={RAYAS} strokeWidth="1" />
      {/* cabeza agachada mirando la bola */}
      <path d="M47 44 L49 20 L65 33 Z" fill={PELO} />
      <path d="M51 37 L52 26 L60 33 Z" fill={OREJA} />
      <path d="M71 33 L84 19 L86 44 Z" fill={PELO} />
      <path d="M75 33 L82 25 L83 37 Z" fill={OREJA} />
      <ellipse cx="66" cy="50" rx="22" ry="18" fill={PELO} />
      <path d="M63 33 l1 6 M69 33 l-1 6" stroke={RAYAS} strokeWidth="3" strokeLinecap="round" />
      <g className="ojo">
        <ellipse cx="57" cy="48" rx="4.6" ry="5.6" fill={LINEA} />
        <circle cx="55.5" cy="46" r="1.7" fill="#fff" />
      </g>
      <g className="ojo">
        <ellipse cx="75" cy="48" rx="4.6" ry="5.6" fill={LINEA} />
        <circle cx="73.5" cy="46" r="1.7" fill="#fff" />
      </g>
      <ellipse cx="62" cy="58" rx="5.5" ry="4" fill={HOCICO} />
      <ellipse cx="70" cy="58" rx="5.5" ry="4" fill={HOCICO} />
      <ellipse cx="49" cy="56" rx="4" ry="2.5" fill={CACHETE} opacity="0.6" />
      <ellipse cx="83" cy="56" rx="4" ry="2.5" fill={CACHETE} opacity="0.6" />
      <path d="M63.5 54 h5 l-2.5 3 z" fill={CACHETE} />
      <path d="M66 57 q-2 3 -4.5 1 M66 57 q2 3 4.5 1" stroke={LINEA} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <Bigotes x={66} y={57} separacion={11} />
      {/* bola de estambre */}
      <g className="estambre">
        <circle cx="20" cy="68" r="10" fill="#ff9ec0" />
        <path
          d="M12 62 q8 4 15 -1 M11 68 q9 5 18 0 M13 74 q8 3 14 -1 M17 59 q-3 9 1 18"
          stroke="#e8457a"
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        />
      </g>
      {/* patita que le pega a la bola */}
      <ellipse className="pata-juega" cx="42" cy="72" rx="9" ry="5" fill={PELO} stroke={RAYAS} strokeWidth="1" />
    </svg>
  );
}

/** Michi enojado: orejas de avión, cejas fruncidas, cachetes rojos y venita. */
export function GatoEnojado({ className }: Props) {
  return (
    <svg viewBox="0 0 80 72" className={className} aria-hidden="true">
      <path d="M12 34 L2 14 L28 20 Z" fill={PELO} />
      <path d="M12 27 L8 18 L21 21 Z" fill={OREJA} />
      <path d="M68 34 L78 14 L52 20 Z" fill={PELO} />
      <path d="M68 27 L72 18 L59 21 Z" fill={OREJA} />
      <ellipse cx="40" cy="40" rx="31" ry="25" fill={PELO} />
      <path d="M35 17 l1 6 M40 16 v7 M45 17 l-1 6" stroke={RAYAS} strokeWidth="3" strokeLinecap="round" />
      {/* cejas fruncidas y ojos entrecerrados */}
      <path d="M21 28 L34 33 M59 28 L46 33" stroke={LINEA} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M23 37 q6 -3 11 1 q-6 5 -11 -1 Z" fill={LINEA} />
      <path d="M57 37 q-6 -3 -11 1 q6 5 11 -1 Z" fill={LINEA} />
      <ellipse cx="35" cy="49" rx="6" ry="4.5" fill={HOCICO} />
      <ellipse cx="45" cy="49" rx="6" ry="4.5" fill={HOCICO} />
      <ellipse cx="20" cy="46" rx="5.5" ry="3.2" fill={CACHETE} opacity="0.85" />
      <ellipse cx="60" cy="46" rx="5.5" ry="3.2" fill={CACHETE} opacity="0.85" />
      <path d="M37.5 44 h5 l-2.5 3 z" fill={CACHETE} />
      {/* boca de enojo */}
      <path d="M35 54 q5 -4 10 0" stroke={LINEA} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <Bigotes x={40} y={49} separacion={12} />
      {/* patitas cruzadas */}
      <ellipse cx="31" cy="64" rx="11" ry="5.5" fill={PELO} stroke={RAYAS} strokeWidth="1" transform="rotate(14 31 64)" />
      <ellipse cx="49" cy="64" rx="11" ry="5.5" fill={PELO} stroke={RAYAS} strokeWidth="1" transform="rotate(-14 49 64)" />
      {/* venita de enojo */}
      <path
        className="vena"
        d="M58 7 Q64 7 64 1 M77 7 Q71 7 71 1 M58 11 Q64 11 64 17 M77 11 Q71 11 71 17"
        stroke="#e8457a"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Michi sentado mirando, moviendo la cola. */
export function GatoSentado({ className }: Props) {
  return (
    <svg viewBox="0 0 100 120" className={className} aria-hidden="true">
      <path
        className="cola-gato"
        d="M70 104 C 92 104, 96 80, 86 70"
        fill="none"
        stroke={PELO}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path d="M26 112 C 22 80, 34 62, 50 62 C 66 62, 78 80, 74 112 Z" fill={PELO} />
      <path d="M40 74 q-3 6 0 12 M60 74 q3 6 0 12" stroke={RAYAS} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <ellipse cx="40" cy="112" rx="9" ry="5" fill={PELO} />
      <ellipse cx="60" cy="112" rx="9" ry="5" fill={PELO} />
      <path d="M22 34 L24 8 L44 22 Z" fill={PELO} />
      <path d="M26 28 L27 15 L37 22 Z" fill={OREJA} />
      <path d="M78 34 L76 8 L56 22 Z" fill={PELO} />
      <path d="M74 28 L73 15 L63 22 Z" fill={OREJA} />
      <ellipse cx="50" cy="42" rx="30" ry="25" fill={PELO} />
      <path d="M46 19 l1 7 M54 19 l-1 7 M50 18 v8" stroke={RAYAS} strokeWidth="3" strokeLinecap="round" />
      <g className="ojo">
        <ellipse cx="39" cy="42" rx="4.2" ry="5.2" fill={LINEA} />
        <circle cx="40.5" cy="40" r="1.5" fill="#fff" />
      </g>
      <g className="ojo">
        <ellipse cx="61" cy="42" rx="4.2" ry="5.2" fill={LINEA} />
        <circle cx="62.5" cy="40" r="1.5" fill="#fff" />
      </g>
      <ellipse cx="31" cy="51" rx="5" ry="3" fill={CACHETE} opacity="0.6" />
      <ellipse cx="69" cy="51" rx="5" ry="3" fill={CACHETE} opacity="0.6" />
      <path d="M47.5 49 h5 l-2.5 3 z" fill={CACHETE} />
      <path d="M50 52 q-3 4 -6 1 M50 52 q3 4 6 1" stroke={LINEA} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <Bigotes x={50} y={52} />
    </svg>
  );
}

/** Michi asomándose por un borde, con las patitas por delante. */
export function GatoAsomado({ className }: Props) {
  return (
    <svg viewBox="0 0 120 70" className={className} aria-hidden="true">
      {/* orejas anchas y separadas; la cabeza es más ancha que alta para que no parezca ratón */}
      <path d="M22 40 L26 4 L54 22 Z" fill={PELO} />
      <path d="M28 30 L30 12 L45 22 Z" fill={OREJA} />
      <path d="M98 40 L94 4 L66 22 Z" fill={PELO} />
      <path d="M92 30 L90 12 L75 22 Z" fill={OREJA} />
      <path d="M18 66 C 16 36, 34 18, 60 18 C 86 18, 104 36, 102 66 Z" fill={PELO} />
      <path d="M55 20 l1 7 M60 19 v8 M65 20 l-1 7" stroke={RAYAS} strokeWidth="3" strokeLinecap="round" />
      <g className="ojo">
        <ellipse cx="44" cy="39" rx="5.5" ry="6.5" fill={LINEA} />
        <circle cx="46" cy="36.5" r="2" fill="#fff" />
      </g>
      <g className="ojo">
        <ellipse cx="76" cy="39" rx="5.5" ry="6.5" fill={LINEA} />
        <circle cx="78" cy="36.5" r="2" fill="#fff" />
      </g>
      {/* hocico clarito con boquita de gato */}
      <ellipse cx="54" cy="50" rx="7.5" ry="5.5" fill={HOCICO} />
      <ellipse cx="66" cy="50" rx="7.5" ry="5.5" fill={HOCICO} />
      <ellipse cx="33" cy="49" rx="5.5" ry="3.2" fill={CACHETE} opacity="0.6" />
      <ellipse cx="87" cy="49" rx="5.5" ry="3.2" fill={CACHETE} opacity="0.6" />
      <path d="M57 45 h6 l-3 3.5 z" fill={CACHETE} />
      <path d="M60 48.5 q-2.5 4 -5.5 1.5 M60 48.5 q2.5 4 5.5 1.5" stroke={LINEA} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <Bigotes x={60} y={49} separacion={15} />
      <ellipse cx="38" cy="60" rx="11" ry="7" fill={PELO} stroke={RAYAS} strokeWidth="1" />
      <ellipse cx="82" cy="60" rx="11" ry="7" fill={PELO} stroke={RAYAS} strokeWidth="1" />
      <path d="M34 57 v4 M38 56 v5 M42 57 v4 M78 57 v4 M82 56 v5 M86 57 v4" stroke={RAYAS} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/** Huellita de gato. */
export function Patita({ className, color = "currentColor" }: Props & { color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill={color}>
      <ellipse cx="20" cy="27" rx="10" ry="8.5" />
      <ellipse cx="8" cy="16" rx="4" ry="5" />
      <ellipse cx="16" cy="9" rx="4" ry="5" />
      <ellipse cx="24" cy="9" rx="4" ry="5" />
      <ellipse cx="32" cy="16" rx="4" ry="5" />
    </svg>
  );
}
