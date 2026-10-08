import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Para mi Galletita",
    short_name: "Galletita",
    description: "Galletas de la fortuna, cartas y gatitos para la galletita de mi corazón.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffe4ec",
    theme_color: "#ffe4ec",
    lang: "es",
    icons: [
      { src: "/iconos/192", sizes: "192x192", type: "image/png" },
      { src: "/iconos/512", sizes: "512x512", type: "image/png" },
      { src: "/iconos/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
