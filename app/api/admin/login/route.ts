import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarSenhaPaciente } from "@/lib/db";
import { criarToken } from "@/lib/auth";

const ADMIN_CPF = "01581020023";

export async function POST(request: NextRequest) {
  const { cpf, senha } = await request.json();
  const cpfLimpo = (cpf ?? "").replace(/\D/g, "");

  if (cpfLimpo !== ADMIN_CPF) {
    return Response.json({ erro: "Acesso não autorizado" }, { status: 403 });
  }

  const paciente = verificarSenhaPaciente(cpf, senha);
  if (!paciente) {
    return Response.json({ erro: "CPF ou senha incorretos" }, { status: 401 });
  }

  const token = criarToken(ADMIN_CPF);
  const cookieStore = await cookies();
  cookieStore.set("session_admin", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return Response.json({ ok: true });
}
