import { NextRequest } from "next/server";
import { buscarPacientePorCPF, buscarProfissionalPorCPF, criarResetToken } from "@/lib/db";
import { enviarEmailResetSenha } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed, retryAfter } = checkRateLimit(`esqueci-senha:${ip}`);
  if (!allowed) {
    return Response.json(
      { erro: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const { cpf, tipo } = await request.json();
  const cpfLimpo = (cpf ?? "").replace(/\D/g, "");

  if (!cpfLimpo) {
    return Response.json({ erro: "CPF é obrigatório" }, { status: 400 });
  }

  // Resposta genérica independente de encontrar ou não (evita enumeração de usuários)
  const RESPOSTA_PADRAO = Response.json({
    ok: true,
    mensagem: "Se o CPF estiver cadastrado, você receberá um e-mail com o link de redefinição.",
  });

  try {
    const tipoValido = tipo === "profissional" ? "profissional" : "paciente";
    const usuario =
      tipoValido === "profissional"
        ? buscarProfissionalPorCPF(cpfLimpo)
        : buscarPacientePorCPF(cpfLimpo);

    if (!usuario || !("email" in usuario) || !usuario.email) {
      return RESPOSTA_PADRAO;
    }

    const token = criarResetToken(usuario.id, tipoValido);
    const rawUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    // Valida que é uma URL absoluta do próprio sistema
    const appUrl = /^https?:\/\/.+/.test(rawUrl) ? rawUrl.replace(/\/$/, "") : "http://localhost:3000";
    const link = `${appUrl}/reset-senha?token=${encodeURIComponent(token)}&tipo=${encodeURIComponent(tipoValido)}`;

    await enviarEmailResetSenha(usuario.email, usuario.nome, link);
  } catch {
    // Falha silenciosa para não expor erros internos
  }

  return RESPOSTA_PADRAO;
}
