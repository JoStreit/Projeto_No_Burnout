import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { exportarDadosProfissionalCompleto } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_prof")?.value;
  const adminToken = cookieStore.get("session_admin")?.value;

  const isOwner = sessionToken && verificarToken(sessionToken) === id;
  const isAdmin = adminToken && verificarToken(adminToken) === process.env.ADMIN_CPF;

  if (!isOwner && !isAdmin) {
    return Response.json({ erro: "Não autorizado" }, { status: 403 });
  }

  const dados = exportarDadosProfissionalCompleto(id);
  if (!dados) {
    return Response.json({ erro: "Profissional não encontrado" }, { status: 404 });
  }

  const exportacao = {
    exportadoEm: new Date().toISOString(),
    finalidade: "Portabilidade de dados — Art. 18, V da LGPD (Lei 13.709/2018)",
    dados,
  };

  return new Response(JSON.stringify(exportacao, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="meus-dados-${id}.json"`,
    },
  });
}
