import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { limparDadosAntigos } from "@/lib/db";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_admin")?.value;
  if (!token || verificarToken(token) !== process.env.ADMIN_CPF) {
    return Response.json({ erro: "Não autorizado" }, { status: 403 });
  }

  const resultado = limparDadosAntigos();
  return Response.json({
    mensagem: "Limpeza concluída",
    removidos: {
      visitas: resultado.visitas,
      questionarios: resultado.questionarios,
    },
    politica: {
      visitas: "90 dias",
      questionarios: "30 dias",
    },
    executadoEm: new Date().toISOString(),
  });
}
