import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hay otro package-lock.json en la carpeta de usuario; fija la raíz en este proyecto.
  turbopack: { root: __dirname },
};

export default nextConfig;
