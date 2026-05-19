import { NextRequest } from "next/server";
import { registrarSugestao, registrarCliqueContato } from "@/lib/db";

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  let body: { tipo?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ erro: "Body inválido" }, { status: 400 });
  }

  const { tipo } = body;
  if (tipo === "sugestao") {
    registrarSugestao(id);
    return Response.json({ ok: true });
  }
  if (tipo === "contato") {
    registrarCliqueContato(id);
    return Response.json({ ok: true });
  }

  return Response.json({ erro: "Tipo inválido" }, { status: 400 });
}
