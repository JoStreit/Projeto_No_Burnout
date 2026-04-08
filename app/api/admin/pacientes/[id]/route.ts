import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { atualizarPacienteAdmin } from "@/lib/db";

async function autenticarAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_admin")?.value;
  if (!token) return false;
  return verificarToken(token) === process.env.ADMIN_CPF;
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await autenticarAdmin())) {
    return Response.json({ erro: "Não autorizado" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await request.json();
  const { nome, email, estado, cidade, preferenciaBusca } = body;

  try {
    const paciente = atualizarPacienteAdmin(id, { nome, email, estado, cidade, preferenciaBusca });
    return Response.json(paciente);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao atualizar";
    return Response.json({ erro: msg }, { status: 400 });
  }
}
