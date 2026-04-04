import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import {
  buscarProfissionalPorId,
  atualizarStatusProfissional,
  atualizarProfissional,
} from "@/lib/db";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const profissional = buscarProfissionalPorId(id);
  if (!profissional) {
    return Response.json({ erro: "Profissional não encontrado" }, { status: 404 });
  }
  return Response.json(profissional);
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
  const { nome, estado, cidade, atendimento, email, foto } = body;
  try {
    const profissional = atualizarProfissional(id, { nome, estado, cidade, atendimento, email, foto });
    return Response.json(profissional);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao atualizar";
    return Response.json({ erro: msg }, { status: 400 });
  }
}
