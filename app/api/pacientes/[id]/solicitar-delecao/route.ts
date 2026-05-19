import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarToken, revogarToken } from "@/lib/auth";
import { deletarPaciente } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    return Response.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const tokenId = verificarToken(sessionToken);
  if (tokenId !== id) {
    return Response.json({ erro: "Não autorizado" }, { status: 403 });
  }

  try {
    deletarPaciente(id);
    revogarToken(sessionToken);

    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      "session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
    );

    return new Response(
      JSON.stringify({ mensagem: "Conta e dados pessoais excluídos com sucesso." }),
      { status: 200, headers }
    );
  } catch {
    return Response.json({ erro: "Erro ao excluir conta" }, { status: 500 });
  }
}
