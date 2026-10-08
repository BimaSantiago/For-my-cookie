import { iconoGalleta } from "@/lib/icono";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return iconoGalleta(64, { conMargen: false });
}
