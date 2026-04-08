import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarSenhaPaciente } from "@/lib/db";
import { criarToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { logSeguranca } from "@/lib/security-log";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed, retryAfter } = checkRateLimit(`login-admin:${ip}`);
  if (!allowed) {
    logSeguranca("rate_limit", { ip, rota: "/api/admin/login" });
    return Response.json(
      { erro: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const adminCpf = process.env.ADMIN_CPF;
  const { cpf, senha } = await request.json();
  const cpfLimpo = (cpf ?? "").replace(/\D/g, "");

  if (!adminCpf || cpfLimpo !== adminCpf) {
    logSeguranca("acesso_negado", { ip, rota: "/api/admin/login", info: "cpf_invalido" });
    return Response.json({ erro: "Acesso não autorizado" }, { status: 403 });
  }

  const paciente = verificarSenhaPaciente(cpf, senha);
  if (!paciente) {
    logSeguranca("login_falhou", { ip, rota: "/api/admin/login", info: "senha_invalida" });
    return Response.json({ erro: "CPF ou senha incorretos" }, { status: 401 });
  }

  const token = criarToken(adminCpf);
  const cookieStore = await cookies();
  cookieStore.set("session_admin", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return Response.json({ ok: true });
}
