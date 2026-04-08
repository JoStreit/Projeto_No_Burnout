import { NextRequest } from "next/server";
import { consumirResetToken, atualizarSenhaPaciente, atualizarSenhaProfissional } from "@/lib/db";

const SENHA_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export async function POST(request: NextRequest) {
  const { token, novaSenha } = await request.json();

  if (!token) {
    return Response.json({ erro: "Token inválido" }, { status: 400 });
  }

  if (!novaSenha || !SENHA_REGEX.test(novaSenha)) {
    return Response.json(
      { erro: "Senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número" },
      { status: 400 }
    );
  }

  const entry = consumirResetToken(token);
  if (!entry) {
    return Response.json({ erro: "Link inválido ou expirado" }, { status: 400 });
  }

  if (entry.tipo === "profissional") {
    atualizarSenhaProfissional(entry.userId, novaSenha);
  } else {
    atualizarSenhaPaciente(entry.userId, novaSenha);
  }

  return Response.json({ ok: true });
}
