import { NextRequest } from "next/server";
import { criarProfissional, listarProfissionais } from "@/lib/db";
import { validarCPF } from "@/lib/cpf";

const RAMOS_VALIDOS = [
  "Fisioterapeuta",
  "Nutricionista",
  "Psicólogo",
  "Personal Trainer",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ramo = searchParams.get("ramo") ?? undefined;
  const cidade = searchParams.get("cidade") ?? undefined;
  const profissionais = listarProfissionais({ ramo, cidade });
  return Response.json(profissionais);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nome, cpf, carteirinha, ramo, estado, cidade, email, atendimento } = body;

  if (!nome?.trim())
    return Response.json({ erro: "Nome é obrigatório" }, { status: 400 });

  if (!validarCPF(cpf))
    return Response.json({ erro: "CPF inválido" }, { status: 400 });

  if (!carteirinha?.trim())
    return Response.json({ erro: "Número da carteirinha é obrigatório" }, { status: 400 });

  if (!RAMOS_VALIDOS.includes(ramo))
    return Response.json({ erro: "Ramo inválido" }, { status: 400 });

  if (!estado?.trim())
    return Response.json({ erro: "Estado é obrigatório" }, { status: 400 });

  if (!cidade?.trim())
    return Response.json({ erro: "Cidade é obrigatória" }, { status: 400 });

  if (!email?.trim() || !EMAIL_REGEX.test(email))
    return Response.json({ erro: "E-mail inválido" }, { status: 400 });

  if (!Array.isArray(atendimento) || atendimento.length === 0)
    return Response.json({ erro: "Selecione ao menos uma modalidade de atendimento" }, { status: 400 });

  try {
    const profissional = criarProfissional({
      nome: nome.trim(),
      cpf,
      carteirinha: carteirinha.trim(),
      ramo,
      estado: estado.trim(),
      cidade: cidade.trim(),
      email: email.trim(),
      atendimento,
    });
    return Response.json(profissional, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao cadastrar";
    return Response.json({ erro: msg }, { status: 409 });
  }
}
