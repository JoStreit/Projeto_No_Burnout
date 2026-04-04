import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { registrarVisita } from "@/lib/db";

export async function POST(_req: NextRequest) {
  const cookieStore = await cookies();

  let tipo: "anonimo" | "paciente" | "profissional" = "anonimo";

  const tokenPac = cookieStore.get("session")?.value;
  const tokenProf = cookieStore.get("session_prof")?.value;

  if (tokenPac && verificarToken(tokenPac)) {
    tipo = "paciente";
  } else if (tokenProf && verificarToken(tokenProf)) {
    tipo = "profissional";
  }

  registrarVisita(tipo);
  return Response.json({ ok: true });
}
