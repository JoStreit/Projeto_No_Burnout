import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarSenhaPaciente } from "@/lib/db";
import { criarToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { logSeguranca } from "@/lib/security-log";

export async function POST(request: NextRequest) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const { allowed, retryAfter } = checkRateLimit(`login:${ip}`);
  if (!allowed) {
    logSeguranca("rate_limit", { ip, rota: "/api/auth/login" });
    return Response.json(
      { erro: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const { cpf, senha } = await request.json();

  if (!cpf || !senha) {
    return Response.json({ erro: "CPF e senha são obrigatórios" }, { status: 400 });
  }

  const paciente = verificarSenhaPaciente(cpf, senha);
  if (!paciente) {
    logSeguranca("login_falhou", { ip, rota: "/api/auth/login", info: "paciente" });
    return Response.json({ erro: "CPF ou senha inválidos" }, { status: 401 });
  }

  const token = criarToken(paciente.id);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ paciente });
}
