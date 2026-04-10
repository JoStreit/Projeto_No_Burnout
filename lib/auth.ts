import crypto from "crypto";
import { revogarTokenDB, isTokenRevogadoDB } from "@/lib/db";

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET não está definido. Configure esta variável de ambiente antes de iniciar.");
}
const SECRET = process.env.AUTH_SECRET;

export function revogarToken(token: string): void {
  revogarTokenDB(token);
}

export function criarToken(pacienteId: string): string {
  const payload = Buffer.from(
    JSON.stringify({ id: pacienteId, ts: Date.now() })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

export function verificarToken(token: string): string | null {
  if (isTokenRevogadoDB(token)) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const { id, ts } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!ts || Date.now() - ts > TOKEN_TTL_MS) return null;
    return id ?? null;
  } catch {
    return null;
  }
}
