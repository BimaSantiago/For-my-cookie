import { ImageResponse } from "next/og";
import { INICIO_NOVIOS, MI_NOMBRE } from "@/content/config";
import { certificado } from "@/lib/datos";
import { fechaHoraLarga, fechaLarga } from "@/lib/fechas";
import { obtenerSesion } from "@/lib/session";

/** Descarga una fuente de Google Fonts en TTF, solo con las letras que se usan. */
async function fuente(familia: string, peso: number, texto: string) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${familia.replace(/ /g, "+")}:wght@${peso}&text=${encodeURIComponent(texto)}`;
    const css = await (await fetch(url)).text();
    const ttf = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!ttf) return null;
    return { name: familia, data: await (await fetch(ttf)).arrayBuffer(), weight: peso as 400, style: "normal" as const };
  } catch {
    return null;
  }
}

/** Satori junta las palabras en Great Vibes; las separo a mano. */
function palabras(texto: string, separacion: number) {
  return texto.split(" ").map((p, i) => (
    <span key={i} style={{ marginRight: separacion }}>
      {p}
    </span>
  ));
}

function patita(color: string, tam: number) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 40 40" fill={color}>
      <ellipse cx="20" cy="27" rx="10" ry="8.5" />
      <ellipse cx="8" cy="16" rx="4" ry="5" />
      <ellipse cx="16" cy="9" rx="4" ry="5" />
      <ellipse cx="24" cy="9" rx="4" ry="5" />
      <ellipse cx="32" cy="16" rx="4" ry="5" />
    </svg>
  );
}

function huella(color: string) {
  return (
    <svg width="130" height="156" viewBox="0 0 100 120" fill="none" stroke={color} strokeLinecap="round">
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="62"
          rx={5 + i * 5}
          ry={7 + i * 6.3}
          strokeWidth="2.6"
          strokeDasharray={`${18 + i * 9} ${5 + (i % 3) * 4}`}
          strokeDashoffset={i * 13}
        />
      ))}
    </svg>
  );
}

export async function GET() {
  if (!(await obtenerSesion())) return new Response("No autorizado", { status: 401 });
  const sello = await certificado();
  if (!sello) return new Response("El certificado todavía no está sellado", { status: 404 });

  // Great Vibes recortada por Google no trae el espacio normal; el espacio duro sí se ve.
  const titulo = "Certificado de Amor";
  const textos = [
    `Novios desde el ${fechaLarga(INICIO_NOVIOS)}`,
    "Por medio de la presente se certifica que la galletita de mi corazón y yo quedamos oficialmente unidos.",
    "Prometo cuidarte, hacerte reír, quererte en los días buenos y en los no tan buenos, y compartir contigo cada galleta, incluso la última.",
    `Con amor, ${MI_NOMBRE}`,
    `Sellado el ${fechaHoraLarga(sello.selladoEn)}`,
    "Tu huella Testigo: un michi",
  ];
  const [firmaFuente, cuerpo, cuerpoNegrita] = await Promise.all([
    fuente("Great Vibes", 400, titulo + textos[3]),
    fuente("Nunito", 400, textos.join(" ")),
    fuente("Nunito", 700, textos.join(" ")),
  ]);

  const rosa = "#b10077";
  const texto = "#5c3a53";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #fff0f8, #ffe3ed)",
          fontFamily: "Nunito",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: 24,
            borderRadius: 48,
            border: "6px dashed #ffb6d0",
            background: "#fff4f8",
          }}
        >
          <div
            style={{
              width: 860,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "70px 70px 56px",
              borderRadius: 36,
              border: "4px solid #e29ab7",
              background: "#fffbf5",
              color: texto,
            }}
          >
            <div style={{ display: "flex", fontFamily: "Great Vibes", fontSize: 110, color: rosa, lineHeight: 1 }}>
              {palabras(titulo, 26)}
            </div>
            <div style={{ marginTop: 14, fontSize: 28, fontWeight: 700, color: "#8a6157" }}>{textos[0]}</div>
            <div style={{ marginTop: 44, fontSize: 36, lineHeight: 1.5 }}>{textos[1]}</div>
            <div style={{ marginTop: 22, fontSize: 36, lineHeight: 1.5 }}>{textos[2]}</div>
            <div style={{ marginTop: 50, display: "flex", gap: 70 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 210,
                    height: 210,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 24,
                    border: `4px solid ${rosa}`,
                    background: "#ffe9f2",
                  }}
                >
                  {huella("#b10077cc")}
                </div>
                <div style={{ marginTop: 10, fontSize: 24, color: "#7a4069" }}>Tu huella</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 210,
                    height: 210,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 24,
                    border: "4px solid #b9783a",
                    background: "#fbeedd",
                  }}
                >
                  {patita("#b9783acc", 130)}
                </div>
                <div style={{ marginTop: 10, fontSize: 24, color: "#7a4069" }}>Testigo: un michi</div>
              </div>
            </div>
            <div style={{ marginTop: 44, display: "flex", fontFamily: "Great Vibes", fontSize: 64, color: "#7a4069" }}>
              {palabras(textos[3], 16)}
            </div>
            <div style={{ marginTop: 12, fontSize: 26, color: "#a63b8d" }}>{textos[4]}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      fonts: [firmaFuente, cuerpo, cuerpoNegrita ? { ...cuerpoNegrita, weight: 700 as const } : null].filter(
        (f) => f !== null,
      ),
      headers: { "Content-Disposition": 'attachment; filename="Certificado-de-Amor.png"', "Cache-Control": "private, no-store" },
    },
  );
}
