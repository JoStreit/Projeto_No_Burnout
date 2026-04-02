import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { criarPaciente, listarPacientes } from "@/lib/db";
import { validarCPF } from "@/lib/cpf";
import { criarToken } from "@/lib/auth";

export async function GET() {
  const pacientes = listarPacientes();
  return Response.json(pacientes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nome, cpf, senha } = body;

  if (!nome?.trim()) {
    return Response.json({ erro: "Nome é obrigatório" }, { status: 400 });
  }

  if (!validarCPF(cpf)) {
    return Response.json({ erro: "CPF inválido" }, { status: 400 });
  }

  if (!senha || senha.length < 6) {
    return Response.json(
      { erro: "Senha deve ter pelo menos 6 caracteres" },
      { status: 400 }
    );
  }

  try {
    const paciente = criarPaciente(nome.trim(), cpf, senha);

    // Auto-login após cadastro
    const token = criarToken(paciente.id);
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json(paciente, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao cadastrar";
    return Response.json({ erro: msg }, { status: 409 });
  }
}
