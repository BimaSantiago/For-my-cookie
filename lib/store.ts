import "server-only";
import { Redis } from "@upstash/redis";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Guarda lo que pasa en la página (galletas abiertas, cupones, certificado…).
// En Vercel usa Upstash Redis; en tu compu, si no hay Redis configurado, usa un archivo en .data/.

type Store = {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  /** Guarda solo si la clave no existe. Devuelve true si la guardó. */
  setSiNoExiste<T>(key: string, value: T): Promise<boolean>;
};

const PREFIJO = "galletita:";

function redisStore(redis: Redis): Store {
  return {
    get: (key) => redis.get(PREFIJO + key),
    set: async (key, value) => {
      await redis.set(PREFIJO + key, value);
    },
    setSiNoExiste: async (key, value) =>
      (await redis.set(PREFIJO + key, value, { nx: true })) === "OK",
  };
}

function archivoStore(): Store {
  const archivo = path.join(process.cwd(), ".data", "db.json");
  async function leer(): Promise<Record<string, unknown>> {
    try {
      return JSON.parse(await readFile(archivo, "utf8"));
    } catch {
      return {};
    }
  }
  async function escribir(datos: Record<string, unknown>) {
    await mkdir(path.dirname(archivo), { recursive: true });
    await writeFile(archivo, JSON.stringify(datos, null, 2));
  }
  return {
    get: async (key) => ((await leer())[key] ?? null) as never,
    set: async (key, value) => {
      const datos = await leer();
      datos[key] = value;
      await escribir(datos);
    },
    setSiNoExiste: async (key, value) => {
      const datos = await leer();
      if (key in datos) return false;
      datos[key] = value;
      await escribir(datos);
      return true;
    },
  };
}

function crearStore(): Store {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return redisStore(new Redis({ url, token }));
  if (process.env.VERCEL) {
    throw new Error(
      "Falta conectar la base de datos: en Vercel ve a Storage → Upstash Redis y conéctala a este proyecto.",
    );
  }
  return archivoStore();
}

let store: Store | undefined;
export function db() {
  store ??= crearStore();
  return store;
}
