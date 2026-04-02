import { NextRequest } from "next/server";
import { criarProfissional, listarProfissionais } from "@/lib/db";
import { validarCPF } from "@/lib/cpf";

const RAMOS_VALIDOS = [
  "Fisioterapeuta",
  "Nutricionista",
  "Psicólogo",
  "Personal Trainer",
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ramo = searchParams.get("ramo") ?? undefined;
  const cidade = searchParams.get("cidade") ?? undefined;
  const profissionais = listarProfissionais({ ramo, cidade });
  return Response.json(profissionais);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nome, cpf, ramo, cidade } = body;

  if (!nome?.trim()) {
    return Response.json({ erro: "Nome é obrigatório" }, { status: 400 });
  }

  if (!validarCPF(cpf)) {
    return Response.json({ erro: "CPF inválido" }, { status: 400 });
  }

  if (!RAMOS_VALIDOS.includes(ramo)) {
    return Response.json({ erro: "Ramo inválido" }, { status: 400 });
  }

  if (!cidade?.trim()) {
    return Response.json({ erro: "Cidade é obrigatória" }, { status: 400 });
  }

  try {
    const profissional = criarProfissional(nome.trim(), cpf, ramo, cidade.trim());
    return Response.json(profissional, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao cadastrar";
    return Response.json({ erro: msg }, { status: 409 });
  }
}
