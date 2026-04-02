import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { buscarProfissionalPorId, atualizarStatusProfissional } from "@/lib/db";

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

  // Verifica sessão
  const cookieStore = await cookies();
  const token = cookieStore.get("session_prof")?.value;
  if (!token) return Response.json({ erro: "Não autenticado" }, { status: 401 });

  const tokenId = verificarToken(token);
  if (tokenId !== id) return Response.json({ erro: "Não autorizado" }, { status: 403 });

  const { status } = await request.json();
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
