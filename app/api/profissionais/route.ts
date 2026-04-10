import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { criarProfissional, listarProfissionais } from "@/lib/db";
import { validarCPF } from "@/lib/cpf";
import { criarToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const RAMOS_VALIDOS = [
  "Fisioterapeuta",
  "Nutricionista",
  "Psicólogo",
  "Personal Trainer",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
const FOTO_MAX_BYTES = 2 * 1024 * 1024; // 2 MB em base64

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ramo = searchParams.get("ramo") ?? undefined;
  const cidade = searchParams.get("cidade") ?? undefined;
  const estado = searchParams.get("estado") ?? undefined;
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 100);
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const offset = (page - 1) * limit;

  const { data, total } = listarProfissionais({ ramo, cidade, estado, limit, offset });
  return Response.json({ data, total, page, limit });
}

export async function POST(request: NextRequest) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const { allowed, retryAfter } = checkRateLimit(`cadastro-prof:${ip}`);
  if (!allowed) {
    return Response.json(
      { erro: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const body = await request.json();
  const { nome, cpf, carteirinha, ramo, estado, cidade, email, telefone, atendimento, foto, senha } = body;

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

  if (!senha || !SENHA_REGEX.test(senha))
    return Response.json(
      { erro: "Senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número" },
      { status: 400 }
    );

  if (foto) {
    if (!/^data:image\/(png|jpe?g|webp);base64,/.test(foto))
      return Response.json({ erro: "Formato de imagem inválido" }, { status: 400 });
    if (foto.length > FOTO_MAX_BYTES)
      return Response.json({ erro: "Foto muito grande. Tamanho máximo: 2 MB" }, { status: 400 });
  }

  try {
    const profissional = criarProfissional({
      nome: nome.trim(),
      cpf,
      carteirinha: carteirinha.trim(),
      ramo,
      estado: estado.trim(),
      cidade: cidade.trim(),
      email: email.trim(),
      ...(telefone?.trim() ? { telefone: telefone.trim() } : {}),
      atendimento,
      ...(foto ? { foto } : {}),
      senha,
    });

    // Auto-login após cadastro
    const token = criarToken(profissional.id);
    const cookieStore = await cookies();
    cookieStore.set("session_prof", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json(profissional, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao cadastrar";
    return Response.json({ erro: msg }, { status: 409 });
  }
}
