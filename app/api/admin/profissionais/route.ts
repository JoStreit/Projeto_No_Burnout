import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { listarProfissionais } from "@/lib/db";

async function autenticarAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_admin")?.value;
  if (!token) return false;
  return verificarToken(token) === process.env.ADMIN_CPF;
}

export async function GET() {
  if (!(await autenticarAdmin())) {
    return Response.json({ erro: "Não autorizado" }, { status: 403 });
  }
  return Response.json(listarProfissionais({ limit: 1000 }).data);
}
