import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { buscarPacientePorId, atualizarPaciente } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const paciente = buscarPacientePorId(id);
  if (!paciente) {
    return Response.json({ erro: "Paciente não encontrado" }, { status: 404 });
  }
  return Response.json(paciente);
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  // Verifica sessão
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return Response.json({ erro: "Não autenticado" }, { status: 401 });

  const tokenId = verificarToken(token);
  if (tokenId !== id) return Response.json({ erro: "Não autorizado" }, { status: 403 });

  const body = await request.json();
  const { nome, email, estado, cidade, preferenciaBusca } = body;

  const PREFERENCIAS_VALIDAS = ["Presencial", "RemotoBrasil", "RemoToEstado"] as const;
  const preferenciaBuscaValida =
    preferenciaBusca && PREFERENCIAS_VALIDAS.includes(preferenciaBusca)
      ? (preferenciaBusca as "Presencial" | "RemotoBrasil" | "RemoToEstado")
      : undefined;

  try {
    const paciente = atualizarPaciente(id, {
      ...(nome ? { nome: nome.trim() } : {}),
      ...(email ? { email: email.trim() } : {}),
      ...(estado ? { estado: estado.trim() } : {}),
      ...(cidade ? { cidade: cidade.trim() } : {}),
      ...(preferenciaBuscaValida !== undefined ? { preferenciaBusca: preferenciaBuscaValida } : {}),
    });
    return Response.json(paciente);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao atualizar";
    return Response.json({ erro: msg }, { status: 400 });
  }
}
