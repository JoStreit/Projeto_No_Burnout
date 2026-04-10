import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";

const FOTO_MAX_BYTES = 2 * 1024 * 1024;
import {
  buscarProfissionalPorId,
  atualizarStatusProfissional,
  atualizarProfissional,
} from "@/lib/db";

function mascaraCPF(cpf: string): string {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.***.***-${d.slice(9)}`;
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const profissional = buscarProfissionalPorId(id);
  if (!profissional) {
    return Response.json({ erro: "Profissional não encontrado" }, { status: 404 });
  }
  // Retorno público: remove email e mascara CPF
  const { email: _, ...publico } = profissional;
  return Response.json({ ...publico, cpf: mascaraCPF(profissional.cpf) });
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const cookieStore = await cookies();
  const token = cookieStore.get("session_prof")?.value;
  if (!token) return Response.json({ erro: "Não autenticado" }, { status: 401 });

  const tokenId = verificarToken(token);
  if (tokenId !== id) return Response.json({ erro: "Não autorizado" }, { status: 403 });

  const body = await request.json();

  // Atualização de status
  if ("status" in body) {
    const { status } = body;
    if (status !== "Ativo" && status !== "Inativo") {
      return Response.json({ erro: "Status inválido" }, { status: 400 });
    }
    try {
      const profissional = atualizarStatusProfissional(id, status);
      return Response.json(profissional);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar";
      return Response.json({ erro: msg }, { status: 400 });
    }
  }

  // Atualização de perfil
  const { nome, estado, cidade, atendimento, email, telefone, foto } = body;
  if (foto && foto.length > FOTO_MAX_BYTES)
    return Response.json({ erro: "Foto muito grande. Tamanho máximo: 2 MB" }, { status: 400 });
  try {
    const profissional = atualizarProfissional(id, { nome, estado, cidade, atendimento, email, telefone, foto });
    return Response.json(profissional);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao atualizar";
    return Response.json({ erro: msg }, { status: 400 });
  }
}
