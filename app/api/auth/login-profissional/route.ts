import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarSenhaProfissional } from "@/lib/db";
import { criarToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { logSeguranca } from "@/lib/security-log";

export async function POST(request: NextRequest) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const { allowed, retryAfter } = checkRateLimit(`login-prof:${ip}`);
  if (!allowed) {
    logSeguranca("rate_limit", { ip, rota: "/api/auth/login-profissional" });
    return Response.json(
      { erro: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const { cpf, senha } = await request.json();

  if (!cpf || !senha) {
    return Response.json({ erro: "CPF e senha são obrigatórios" }, { status: 400 });
  }

  const profissional = verificarSenhaProfissional(cpf, senha);
  if (!profissional) {
    logSeguranca("login_falhou", { ip, rota: "/api/auth/login-profissional", info: "profissional" });
    return Response.json({ erro: "CPF ou senha inválidos" }, { status: 401 });
  }

  const token = criarToken(profissional.id);
  const cookieStore = await cookies();
  cookieStore.set("session_prof", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ profissional });
}
