import { NextRequest } from "next/server";
import { registrarQuestionario } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { logSeguranca } from "@/lib/security-log";

export async function POST(request: NextRequest) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const { allowed, retryAfter } = checkRateLimit(`questionario:${ip}`);
  if (!allowed) {
    logSeguranca("rate_limit", { ip, rota: "/api/questionarios" });
    return Response.json(
      { erro: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  registrarQuestionario();
  return Response.json({ ok: true });
}
