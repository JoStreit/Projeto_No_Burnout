import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { listarVisitas, contarQuestionarios } from "@/lib/db";

const ADMIN_CPF = "01581020023";

async function autenticarAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_admin")?.value;
  if (!token) return false;
  return verificarToken(token) === ADMIN_CPF;
}

export async function GET(request: NextRequest) {
  if (!(await autenticarAdmin())) {
    return Response.json({ erro: "Não autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const inicio = searchParams.get("inicio") ?? undefined;
  const fim = searchParams.get("fim") ?? undefined;

  const visitas = listarVisitas({ inicio, fim });
  const questionarios = contarQuestionarios({ inicio, fim });

  const total = visitas.length;
  const pacientes = visitas.filter((v) => v.tipo === "paciente").length;
  const profissionais = visitas.filter((v) => v.tipo === "profissional").length;
  const anonimos = visitas.filter((v) => v.tipo === "anonimo").length;

  return Response.json({ total, pacientes, profissionais, anonimos, questionarios });
}
