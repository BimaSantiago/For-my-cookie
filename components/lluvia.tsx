// Lluvia de gatitos, galletas y corazones. Las posiciones salen de una fórmula fija
// para que se vean al azar sin cambiar entre el servidor y el navegador.

const COSAS = ["🐱", "🍪", "💗", "🐾", "💕", "😻"];

function pseudo(i: number, semilla: number) {
  const x = Math.sin(i * 12.9898 + semilla * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function Lluvia({ cantidad = 28, direccion = "cae" }: { cantidad?: number; direccion?: "cae" | "sube" }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: cantidad }, (_, i) => (
        <span
          key={i}
          className={direccion === "cae" ? "confeti" : "sube"}
          style={{
            left: `${pseudo(i, 1) * 96}vw`,
            fontSize: `${18 + pseudo(i, 2) * 16}px`,
            animationDuration: `${(direccion === "cae" ? 3.2 : 7) + pseudo(i, 3) * 3}s`,
            animationDelay: `${pseudo(i, 4) * (direccion === "cae" ? 2.5 : 5)}s`,
          }}
        >
          {COSAS[i % COSAS.length]}
        </span>
      ))}
    </div>
  );
}
