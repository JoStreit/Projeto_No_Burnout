import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { criarPaciente, listarPacientes } from "@/lib/db";
import { validarCPF } from "@/lib/cpf";
import { criarToken, verificarToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const SENHA_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

const PREFERENCIAS_BUSCA_VALIDAS = ["Presencial", "RemotoBrasil", "RemoToEstado"] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_admin")?.value;
  if (!token || verificarToken(token) !== process.env.ADMIN_CPF) {
    return Response.json({ erro: "Não autorizado" }, { status: 403 });
  }
  return Response.json(listarPacientes());
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed, retryAfter } = checkRateLimit(`cadastro-pac:${ip}`);
  if (!allowed) {
    return Response.json(
      { erro: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const body = await request.json();
  const { nome, cpf, email, estado, cidade, senha, preferenciaBusca } = body;

  if (!nome?.trim()) {
    return Response.json({ erro: "Nome é obrigatório" }, { status: 400 });
  }

  if (!validarCPF(cpf)) {
    return Response.json({ erro: "CPF inválido" }, { status: 400 });
  }

  if (!email?.trim() || !EMAIL_REGEX.test(email)) {
    return Response.json({ erro: "E-mail inválido" }, { status: 400 });
  }

  if (!estado?.trim()) {
    return Response.json({ erro: "Estado é obrigatório" }, { status: 400 });
  }

  if (!cidade?.trim()) {
    return Response.json({ erro: "Cidade é obrigatória" }, { status: 400 });
  }

  if (!senha || !SENHA_REGEX.test(senha)) {
    return Response.json(
      { erro: "Senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número" },
      { status: 400 }
    );
  }

  const preferenciaBuscaValida: ("Presencial" | "RemotoBrasil" | "RemoToEstado")[] | undefined =
    Array.isArray(preferenciaBusca)
      ? preferenciaBusca.filter((v: string) =>
          (PREFERENCIAS_BUSCA_VALIDAS as readonly string[]).includes(v)
        ) as ("Presencial" | "RemotoBrasil" | "RemoToEstado")[]
      : undefined;

  try {
    const paciente = criarPaciente({
      nome: nome.trim(),
      cpf,
      email: email.trim(),
      estado: estado.trim(),
      cidade: cidade.trim(),
      senha,
      ...(preferenciaBuscaValida ? { preferenciaBusca: preferenciaBuscaValida } : {}),
    });

    const token = criarToken(paciente.id);
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json(paciente, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao cadastrar";
    return Response.json({ erro: msg }, { status: 409 });
  }
}
