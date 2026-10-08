import type { Metadata, Viewport } from "next";
import { Caveat, Fredoka, Great_Vibes, Nunito } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });
const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Para mi Galletita",
  description: "Galletas de la fortuna, cartas y gatitos para la galletita de mi corazón.",
  appleWebApp: { capable: true, title: "Galletita", statusBarStyle: "default" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#ffe4ec",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${fredoka.variable} ${nunito.variable} ${caveat.variable} ${greatVibes.variable} antialiased`}
    >
      <body className="fondo-chispas">{children}</body>
    </html>
  );
}
