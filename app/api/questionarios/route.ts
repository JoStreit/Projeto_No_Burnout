import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { registrarQuestionario } from "@/lib/db";
import { checkRateLimitCustom } from "@/lib/rate-limit";
import { logSeguranca } from "@/lib/security-log";
import { verificarToken } from "@/lib/auth";

const UMA_HORA_MS = 60 * 60 * 1000;
const LIMITE_ANONIMO = 5;
const LIMITE_LOGADO = 10;

export async function POST(request: NextRequest) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";

  const cookieStore = await cookies();
  const sessionPac = cookieStore.get("session")?.value;
  const sessionProf = cookieStore.get("session_prof")?.value;

  let userId: string | null = null;
  if (sessionPac) userId = verificarToken(sessionPac);
  if (!userId && sessionProf) userId = verificarToken(sessionProf);

  const isLogado = !!userId;
  const limite = isLogado ? LIMITE_LOGADO : LIMITE_ANONIMO;
  const key = isLogado ? `questionario:user:${userId}` : `questionario:ip:${ip}`;

  const { allowed, retryAfter } = checkRateLimitCustom(key, limite, UMA_HORA_MS);

  if (!allowed) {
    logSeguranca("rate_limit", { ip, rota: "/api/questionarios", info: isLogado ? "logado" : "anonimo" });
    return Response.json(
      { erro: "limite_atingido", retryAfter, isLogado },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  registrarQuestionario();
  return Response.json({ ok: true });
}
