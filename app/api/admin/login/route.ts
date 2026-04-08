import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarSenhaPaciente } from "@/lib/db";
import { criarToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed, retryAfter } = checkRateLimit(`login-admin:${ip}`);
  if (!allowed) {
    return Response.json(
      { erro: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const adminCpf = process.env.ADMIN_CPF;
  const { cpf, senha } = await request.json();
  const cpfLimpo = (cpf ?? "").replace(/\D/g, "");

  if (!adminCpf || cpfLimpo !== adminCpf) {
    return Response.json({ erro: "Acesso não autorizado" }, { status: 403 });
  }

  const paciente = verificarSenhaPaciente(cpf, senha);
  if (!paciente) {
    return Response.json({ erro: "CPF ou senha incorretos" }, { status: 401 });
  }

  const token = criarToken(adminCpf);
  const cookieStore = await cookies();
  cookieStore.set("session_admin", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return Response.json({ ok: true });
}
