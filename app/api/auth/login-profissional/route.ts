import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarSenhaProfissional } from "@/lib/db";
import { criarToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed, retryAfter } = checkRateLimit(`login-prof:${ip}`);
  if (!allowed) {
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
    return Response.json({ erro: "CPF ou senha inválidos" }, { status: 401 });
  }

  const token = criarToken(profissional.id);
  const cookieStore = await cookies();
  cookieStore.set("session_prof", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ profissional });
}
