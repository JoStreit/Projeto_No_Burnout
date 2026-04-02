import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarSenhaPaciente } from "@/lib/db";
import { criarToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { cpf, senha } = await request.json();

  if (!cpf || !senha) {
    return Response.json({ erro: "CPF e senha são obrigatórios" }, { status: 400 });
  }

  const paciente = verificarSenhaPaciente(cpf, senha);
  if (!paciente) {
    return Response.json({ erro: "CPF ou senha inválidos" }, { status: 401 });
  }

  const token = criarToken(paciente.id);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });

  return Response.json({ paciente });
}
