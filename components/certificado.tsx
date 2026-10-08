import { Patita } from "./gatitos";

/** Huella digital dibujada con óvalos punteados. */
export function Huella({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round">
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

export function Certificado({
  selladoEn,
  novioDesde,
  firma,
}: {
  selladoEn: string;
  novioDesde: string;
  firma: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-sm rounded-[22px] border-[3px] border-dashed border-[#ffb6d0] bg-[#fff4f8] p-3">
      <article className="rounded-2xl border-2 border-[#e29ab7] bg-papel px-5 py-6 text-center shadow-[0_0_30px_rgb(255_160_200/0.35)]">
        <h2 className="font-firma text-[2.6rem] leading-none text-[#b10077]">Certificado de Amor</h2>
        <p className="mt-1 text-xs font-semibold text-cacao-suave">Novios desde el {novioDesde}</p>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-[#5c3a53]">
          Por medio de la presente se certifica que la galletita de mi corazón y yo quedamos oficialmente unidos. 💞
        </p>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-[#5c3a53]">
          Prometo cuidarte, hacerte reír, quererte en los días buenos y en los no tan buenos, y compartir contigo
          cada galleta, incluso la última. 🍪
        </p>
        <div className="mt-5 flex items-start justify-center gap-6">
          <figure>
            <div className="grid h-24 w-24 place-items-center rounded-xl border-2 border-[#b10077] bg-[#ffb6d2]/20">
              <Huella className="h-20 w-16 text-[#b10077]/80" />
            </div>
            <figcaption className="mt-1 text-xs text-[#7a4069]">Tu huella</figcaption>
          </figure>
          <figure>
            <div className="grid h-24 w-24 place-items-center rounded-xl border-2 border-galleta-osc bg-galleta/15">
              <Patita className="h-14 w-14 text-galleta-osc/85" />
            </div>
            <figcaption className="mt-1 text-xs text-[#7a4069]">Testigo: un michi</figcaption>
          </figure>
        </div>
        <p className="mt-4 font-mano text-2xl text-[#7a4069]">Con amor, {firma}</p>
        <p className="mt-2 text-xs text-[#a63b8d] italic">Sellado el {selladoEn}</p>
      </article>
    </div>
  );
}
